---
title: LLM 推理与上下文工程
category:
  - LLM
tag:
  - 上下文工程
  - 推理参数
description: 理解 token、上下文窗口、消息历史和推理参数，并设计可控的上下文预算。
order: 2
outline: [2, 3]
---

# LLM 推理与上下文工程

## 1. 学习目标

读完后可以估算模型上下文预算，决定保留哪些消息和资料，并用超时、缓存和可观测指标描述一次模型调用。

## 2. 适用场景

适用于对话、摘要、分类、工具调用和生成式 API 的基础设计。模型训练、向量检索和多 Agent 编排不在此展开；训练见[模型训练](../model-training/README.md)，检索见 [RAG](../rag/README.md)。

## 3. 核心概念

### 3.1 Token、上下文窗口和输出预算

Token 是模型读写文本的计费与容量单位，不等于字符数。一次请求的容量可以近似表示为：

```text
输入 token + 最大输出 token ≤ 模型上下文窗口
输入 token ≈ 系统提示 + 工具定义 + 历史消息 + 检索片段 + 当前问题
```

工程上把“最大输出 token”单独预留，避免输入塞满后模型没有空间回答。中文、代码、JSON 的 token 密度不同，应通过真实样本测量，不要只用字符数估算。

### 3.2 消息角色与上下文层次

| 层次 | 示例 | 变化频率 | 管理策略 |
| --- | --- | --- | --- |
| 系统策略 | 角色、禁止事项、工具边界 | 低 | 版本化、评审 |
| 长期记忆 | 用户偏好、项目约束 | 中 | 明确来源和失效时间 |
| 会话历史 | 用户和助手的短期消息 | 高 | 摘要、滚动窗口、去重 |
| 检索片段 | RAG 返回的文档 | 高 | 按证据预算压缩、保留出处 |
| 当前输入 | 本轮用户消息 | 每轮 | 做输入校验和敏感信息处理 |

### 3.3 推理参数

- **temperature / top_p**：控制采样随机性。分类、抽取和工具参数选择通常使用低随机性；创意文案可适度提高。
- **max_tokens**：限制输出长度，同时也是成本和延迟的上限。
- **stop / seed**：部分提供商支持停止序列或可复现采样，应记录适用范围。
- **stream**：流式返回能改善首字延迟，但会把错误处理分散到多个事件。

### 3.4 上下文压缩流程

```text
收集消息 → 标记优先级 → 保留系统策略/当前输入
       → 旧消息摘要或丢弃 → 拼接检索证据 → 记录被裁剪内容
```

压缩不是无损操作。摘要必须保留实体、约束、未完成事项和引用编号，否则后续工具调用会失去依据。

## 4. 工程实现

以下示例只依赖 Python 标准库，展示一个可测试的预算裁剪器：

```python
from dataclasses import dataclass


@dataclass
class Message:
    role: str
    text: str
    priority: int  # 数字越小越优先保留


def trim_messages(messages: list[Message], max_chars: int) -> list[Message]:
    """按优先级保留消息，保证当前输入最后一条不被裁剪。"""
    if not messages:
        return []
    current = messages[-1]
    if len(current.text) > max_chars:
        raise ValueError("current message exceeds budget")
    kept = [current]
    used = len(current.text)
    for item in sorted(messages[:-1], key=lambda x: x.priority):
        cost = len(item.text)
        if used + cost <= max_chars:
            kept.append(item)
            used += cost
    return list(reversed(kept))


if __name__ == "__main__":
    messages = [
        Message("system", "只依据提供的证据回答。", 1),
        Message("user", "第一条历史消息。", 3),
        Message("assistant", "已收到。", 4),
        Message("user", "当前问题", 1),
    ]
    print(trim_messages(messages, 30))
```

生产实现还应记录原始消息 ID、裁剪原因、估算 token 和模型响应耗时，便于回放和成本归因。

## 5. 生产实践

| 目标 | 做法 | 观测指标 |
| --- | --- | --- |
| 降低延迟 | 流式输出、提示缓存、并行无关检索 | TTFT、P95 总耗时 |
| 控制成本 | 限制上下文和输出、缓存稳定前缀 | 每次任务 token、每成功任务成本 |
| 保证可复现 | 固定提示版本、记录模型和参数 | 版本命中率、回归通过率 |
| 处理故障 | 超时、有限重试、熔断、降级到模板 | 失败率、重试率、降级率 |

## 6. 常见问题

- **上下文越长效果一定越好吗？** 不一定。无关内容会稀释注意力，长上下文也会增加延迟和成本；先测证据命中率。
- **历史消息应该全部保留吗？** 不应该。保留任务状态、实体和约束，旧的寒暄和已完成中间步骤可摘要或删除。
- **如何排查回答凭空编造？** 检查是否缺少证据片段、系统策略是否要求引用、输出 Schema 是否允许“未知”状态。
- **面试追问：为什么不能只用字符数估算？** 不同语言和格式的 token 密度不同，且工具定义也占输入预算，必须用模型 tokenizer 或线上样本校准。

## 7. 总结与延伸

上下文工程的目标不是把所有信息塞进窗口，而是让每条信息都可追溯、可预算、可失效。下一步阅读 [Prompt 工程与提示治理](./ai-llm-prompt-engineering.md) 和 [结构化输出与校验](./ai-llm-structured-output.md)。
