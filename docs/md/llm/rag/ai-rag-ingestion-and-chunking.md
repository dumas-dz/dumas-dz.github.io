---
title: RAG 数据摄取与切分
category:
  - LLM
  - RAG
tag:
  - 数据摄取
  - Chunking
description: 设计可追溯、可增量更新的文档解析、清洗、切分和元数据管线。
order: 2
outline: [2, 3]
---

# RAG 数据摄取与切分

## 1. 学习目标

读完后可以为 Markdown、PDF、HTML 和表格数据设计摄取流程，选择切分策略，并记录足以支持引用、权限和增量更新的元数据。

## 2. 适用场景

适用于企业文档、帮助中心、制度规范、代码手册和会议资料的索引。实时业务数据、事务查询和强一致报表不应只依赖 RAG。

## 3. 核心概念

### 3.1 摄取流水线

```text
发现文件 → 解析 → 规范化 → 清洗/去敏 → 结构识别
       → 切分 → 元数据与权限 → 去重/版本 → 入库 → 质量抽样
```

每一步输出可追踪的 `source_id`、`document_version`、`parser_version` 和 `checksum`，否则无法回答“答案来自哪份文件、何时更新”。

### 3.2 切分策略

| 策略 | 优点 | 限制 | 适用内容 |
| --- | --- | --- | --- |
| 固定长度 | 实现简单、吞吐稳定 | 可能切断语义 | 日志、短消息 |
| 段落/标题 | 保留主题边界 | 文档格式要求高 | Markdown、制度 |
| 递归分隔符 | 兼顾长度和结构 | 规则需要调优 | 混合文档 |
| 父子块 | 小块召回、大块给模型 | 存储和实现复杂 | 长章节、FAQ |
| 表格/代码专用 | 保留行列和签名 | 需要专门解析器 | SQL、配置、表格 |

切分目标是让一个块能独立回答一个局部问题，同时保留标题、章节号和相邻关系。不要只追求固定字符数。

### 3.3 清洗和去重

- 保留标题层级、列表编号、表格列名和代码语言。
- 移除页眉页脚、重复水印和导航文本，但记录被删除原因。
- 以正文规范化哈希识别重复；重复文档仍要保留不同权限或版本时做别名映射。
- 敏感字段先脱敏或禁止入库，不能等生成阶段再提醒模型。

## 4. 工程实现

以下 Python 示例使用标准库，按空行和最大长度递归切分 Markdown 文本：

```python
from dataclasses import dataclass


@dataclass
class Chunk:
    text: str
    section: str
    index: int


def split_markdown(text: str, max_chars: int = 800) -> list[Chunk]:
    if max_chars < 100:
        raise ValueError("max_chars must be at least 100")
    paragraphs = [part.strip() for part in text.split("\n\n") if part.strip()]
    chunks: list[Chunk] = []
    current = ""
    for paragraph in paragraphs:
        while len(paragraph) > max_chars:
            if current:
                chunks.append(Chunk(current, "正文", len(chunks)))
                current = ""
            chunks.append(Chunk(paragraph[:max_chars], "正文", len(chunks)))
            paragraph = paragraph[max_chars:]
        candidate = f"{current}\n\n{paragraph}".strip()
        if current and len(candidate) > max_chars:
            chunks.append(Chunk(current, "正文", len(chunks)))
            current = paragraph
        else:
            current = candidate
    if current:
        chunks.append(Chunk(current, "正文", len(chunks)))
    return chunks


if __name__ == "__main__":
    for chunk in split_markdown("# 标题\n\n第一段。\n\n第二段。"):
        print(chunk)
```

生产实现应把标题作为每块的前缀，并保存 `start_line`、`end_line`、页码或 DOM 锚点用于引用。

## 5. 生产实践

| 目标 | 做法 | 验收信号 |
| --- | --- | --- |
| 可追溯 | source/version/location 元数据 | 引用可打开到原文位置 |
| 可增量 | checksum、软删除、版本替换 | 更新延迟、删除残留率 |
| 可评测 | 固定抽样集、解析错误报告 | 解析成功率、空块率 |
| 可控权限 | 文档级/块级 ACL，继承来源 | 越权召回为零 |

## 6. 常见问题

- **块越大越好吗？** 大块语义完整但召回噪声和成本高；常用父子块或重排缓解。
- **PDF 解析乱码怎么办？** 区分数字版和扫描版；扫描件需 OCR，并把 OCR 置信度写入元数据。
- **文档更新后旧块还在怎么办？** 用文档版本和逻辑删除清理旧块，查询时只允许当前有效版本。
- **表格被切碎怎么办？** 保留表头、行键和单位，必要时生成“表格摘要 + 原表引用”。

## 7. 总结与延伸

索引质量决定检索上限。下一步阅读[Embedding、召回与重排](./ai-rag-retrieval-and-reranking.md)，最终质量闭环见[引用、忠实度与 RAG 评测](./ai-rag-citation-and-evaluation.md)。
