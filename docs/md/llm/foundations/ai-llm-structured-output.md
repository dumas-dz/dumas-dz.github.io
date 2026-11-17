---
title: 结构化输出与校验
category:
  - LLM
tag:
  - JSON Schema
  - 输出解析
description: 用 Schema、函数调用和校验修复把模型输出可靠地接入业务系统。
order: 4
outline: [2, 3]
---

# 结构化输出与校验

## 1. 学习目标

读完后可以定义模型输出契约，选择 JSON Schema、Tool Calling 或受限解码方案，并设计解析、校验、修复和降级路径。

## 2. 适用场景

适用于信息抽取、分类、表单生成、工单路由、数据标注和任何要进入数据库或消息队列的模型输出。纯文本问答不需要强制结构化。

## 3. 核心概念

### 3.1 输出契约

结构化输出的核心是先定义数据语义，再要求模型填充：

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["answer", "confidence", "evidence_ids"],
  "properties": {
    "answer": { "type": "string" },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "evidence_ids": { "type": "array", "items": { "type": "string" } }
  },
  "additionalProperties": false
}
```

字段应表达业务状态，例如 `unknown`、`needs_review`，不要用空字符串或魔法数字代替未知。

### 3.2 方案对比

| 方案 | 优点 | 限制 | 适用场景 |
| --- | --- | --- | --- |
| JSON 模式 | 兼容面广，易调试 | 仍需应用层校验 | 通用 API |
| Tool/Function Calling | 参数与工具绑定，模型易选择 | 依赖提供商能力 | Agent 工具参数 |
| 受限解码 | 语法错误少 | 部署复杂，Schema 支持有限 | 本地模型、严格格式 |
| 模板 + 解析器 | 简单可控 | 表达能力低 | 枚举、短字段 |

### 3.3 校验与修复流程

```text
模型输出 → JSON 解析 → Schema 校验 → 业务规则校验
       ↘ 失败 → 保留错误码和原文 → 最多 N 次定向修复
       ↘ 仍失败 → 人工复核或安全降级
```

修复提示只反馈错误字段和期望约束，不把整套系统策略重复一遍；不要无限重试。

## 4. 工程实现

以下 Python 示例使用 `pydantic` 2.x，展示解析、校验和一次定向修复所需的边界：

```python
from pydantic import BaseModel, Field, ValidationError


class Extraction(BaseModel):
    answer: str
    confidence: float = Field(ge=0, le=1)
    evidence_ids: list[str]


def parse_extraction(raw: str) -> Extraction:
    return Extraction.model_validate_json(raw)


def build_repair_message(raw: str, error: ValidationError) -> str:
    return (
        "请只修复下列字段并返回 JSON，不要添加解释。\n"
        f"errors={error.errors()}\nraw={raw}"
    )


if __name__ == "__main__":
    value = '{"answer":"30 天","confidence":0.98,"evidence_ids":["doc-1#p3"]}'
    print(parse_extraction(value))
```

业务层还要验证 `evidence_ids` 是否属于当前请求、`confidence` 是否达到自动处理阈值，以及答案是否包含不允许的外部事实。

## 5. 生产实践

| 环节 | 最低要求 | 指标 |
| --- | --- | --- |
| 生成 | 明确 Schema、禁止额外字段 | 首次合法率 |
| 解析 | 区分语法错误和语义错误 | 解析失败率 |
| 修复 | 限制次数、保留原文和错误码 | 修复成功率 |
| 落库 | 幂等键、版本、审计字段 | 重复写入率 |

## 6. 常见问题

- **模型返回了 JSON 但字段填错怎么办？** Schema 只能验证类型和范围；业务语义需要规则、检索证据或人工复核。
- **为什么不能直接 `eval` 模型输出？** 有代码执行风险且难以审计；只做 JSON 解析和白名单校验。
- **枚举值应放在哪里？** 放在 Schema 和业务常量中，Prompt 负责提示，代码负责最终判断。
- **置信度可以直接作为正确率吗？** 不能。它是模型自报信号，必须通过标注集校准并单独监控。

## 7. 总结与延伸

结构化输出把模型变成可测试的输入源，但不能替代业务校验。提示模板见[Prompt 工程与提示治理](./ai-llm-prompt-engineering.md)，工具参数的执行边界见 [Agent](../agent/ai-agent-planning-and-execution.md) 和 [MCP](../mcp/ai-mcp-architecture-and-protocol.md)。
