---
title: Workflow 可靠性与常用模式
category:
  - LLM
  - Workflow
tag:
  - 可靠性
  - 幂等
  - 工作流模式
description: 为 AI 工作流加入重试、幂等、人工审批、并行聚合和补偿机制。
order: 4
outline: [2, 3]
---

# Workflow 可靠性与常用模式

## 1. 学习目标

读完后可以为外部模型和工具调用设计幂等、有限重试、超时、人工接管、Fan-out/Fan-in 和补偿，并识别不应自动重试的错误。

## 2. 适用场景

适用于跨数据库、消息队列、模型 API、MCP 工具和人工审批的长流程。对于单次只读查询，只实现超时、限流和降级即可。

## 3. 核心模式

### 3.1 重试与幂等

```text
请求 → 生成幂等键 → 执行外部动作
                 ↓
        超时/限流/临时故障 → 指数退避重试（有限次数）
        参数/权限/规则错误 → 不重试，记录并升级
        重复请求 → 返回首次结果，不重复写入
```

幂等键应由业务语义生成，例如 `tenant_id + operation + business_id + version`，不能只用每次生成的请求 UUID。

### 3.2 常用模式

| 模式 | 流程 | 适用 | 风险 |
| --- | --- | --- | --- |
| Human-in-the-loop | 自动准备 → 暂停 → 人工决定 → 继续 | 高风险写操作 | 等待超时、越权审批 |
| Fan-out/Fan-in | 拆分 → 并行执行 → 聚合 | 多数据源、批量抽取 | 部分失败、结果冲突 |
| 补偿/Saga | A 成功 → B 失败 → 执行 A' | 跨系统事务 | 补偿本身失败 |
| 超时降级 | 主路径 → 超时 → 简化结果 | 在线问答 | 降级结果质量下降 |
| 人工兜底 | 自动失败 → 工单 → 人工处理 | 低频高风险错误 | 队列积压 |

### 3.3 错误分类

- **可重试**：网络超时、429、临时 5xx、短暂锁冲突。
- **不可重试**：Schema 错误、权限不足、业务规则拒绝、重复业务事件。
- **需人工**：证据冲突、高风险写入、超过重试预算、模型持续输出非法数据。

## 4. 工程实现

下面的重试器只重试显式标记的临时错误，并使用确定性退避：

```python
import time
from collections.abc import Callable


class TemporaryError(Exception):
    pass


def call_with_retry(
    operation: Callable[[str], str],
    argument: str,
    max_attempts: int = 3,
    base_delay: float = 0.2,
) -> str:
    if max_attempts < 1:
        raise ValueError("max_attempts must be positive")
    for attempt in range(max_attempts):
        try:
            return operation(argument)
        except TemporaryError:
            if attempt == max_attempts - 1:
                raise
            time.sleep(base_delay * (2 ** attempt))
    raise AssertionError("unreachable")


if __name__ == "__main__":
    print(call_with_retry(lambda value: value, "ok"))
```

生产系统应把等待放进持久化任务队列，不要让 HTTP 请求线程直接睡眠；每个动作仍要校验幂等键。

## 5. 生产实践

| 目标 | 措施 | 指标 |
| --- | --- | --- |
| 防重复 | 幂等键、唯一约束、结果回放 | 重复写入率 |
| 防雪崩 | 超时、熔断、并发上限、背压 | 拒绝率、队列深度 |
| 可恢复 | 检查点、事件日志、死信队列 | 恢复时长、丢失任务数 |
| 可问责 | 人工操作审计、决策理由 | 人工处理时长 |
| 可降级 | 简化回答、只读模式、模板 | 降级率、满意度 |

## 6. 常见问题

- **外部接口没有幂等键怎么办？** 先在本地事务记录意图和状态，再调用外部系统；用业务唯一键和结果核对降低重复风险。
- **重试为什么放大故障？** 无抖动和无上限的重试会造成流量尖峰；要加退避、预算和熔断。
- **所有失败都要补偿吗？** 只对可逆副作用做补偿；不可逆动作需要事前确认或更强的审批边界。
- **如何测试恢复能力？** 在节点执行前后注入崩溃、重复事件、延迟和回调乱序，验证终态一致。

## 7. 总结与延伸

可靠 Workflow 把失败视为状态而不是意外。状态建模见[AI Workflow 状态机设计](./ai-workflow-state-machine.md)，框架实现见[LangGraph 状态图实践](./ai-workflow-langgraph.md)，工具服务的传输和安全边界见 [MCP](../mcp/ai-mcp-security-and-production.md)。
