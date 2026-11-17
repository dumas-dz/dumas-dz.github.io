---
title: 多 Agent 系统设计
category:
  - LLM
  - Agent
tag:
  - 多 Agent
  - 协作架构
description: 通过职责拆分、共享状态和故障隔离设计可维护的多 Agent 应用。
order: 4
outline: [2, 3]
---

# 多 Agent 系统设计

## 1. 学习目标

读完后可以判断何时需要多个 Agent，设计 Router、Worker、Critic 等角色，并控制消息、状态、权限和故障传播。

## 2. 适用场景

适用于不同权限、不同工具集、不同模型成本或需要并行处理的复杂任务。若一个 Agent 能稳定完成，不应为了“看起来智能”引入多 Agent。

## 3. 核心概念

### 3.1 何时拆分

| 拆分依据 | 例子 | 不拆分的做法 |
| --- | --- | --- |
| 权限边界 | 财务 Agent 与客服 Agent | 一个 Agent 只暴露受限工具 |
| 工具规模 | 文档检索、代码执行、发消息 | 路由后动态加载工具 |
| 质量要求 | 生成 + 独立复核 | 单 Agent 自检 |
| 并行收益 | 同时查询多个数据源 | 单 Agent 顺序调用 |

### 3.2 常见拓扑

- **Router + 垂直 Agent**：一个入口负责意图和权限，再交给专业 Agent。
- **Planner + Workers + Aggregator**：拆分子任务并行执行，最后合并结果。
- **Generator + Critic**：独立复核事实、格式或安全，Critic 不负责随意改写业务结论。
- **黑板/状态总线**：所有 Agent 读写同一结构化状态，避免自然语言消息成为唯一事实源。

```text
用户 → Router → 状态存储 ←→ Worker A
                    ↘ Worker B → Aggregator → 用户
                              ↘ Critic → 通过/退回
```

### 3.3 消息与状态

Agent 之间传“任务包”而不是完整聊天记录。任务包包括 `task_id`、目标、输入引用、输出 Schema、权限、预算、截止时间、父任务和幂等键。状态更新采用版本号或乐观锁，防止两个 Worker 覆盖彼此结果。

## 4. 工程实现

下面的最小编排器展示 Router、两个 Worker 和 Aggregator 的数据边界：

```python
from dataclasses import dataclass


@dataclass
class Task:
    task_id: str
    kind: str
    payload: dict


def worker_search(task: Task) -> str:
    return f"search:{task.payload['query']}"


def worker_calc(task: Task) -> str:
    return f"calc:{task.payload['value'] * 2}"


def orchestrate(task: Task) -> dict:
    workers = {"search": worker_search, "calc": worker_calc}
    if task.kind not in workers:
        return {"status": "rejected", "reason": "unsupported_task"}
    return {
        "status": "completed",
        "task_id": task.task_id,
        "result": workers[task.kind](task),
    }


if __name__ == "__main__":
    print(orchestrate(Task("t-1", "calc", {"value": 3})))
```

真实系统要把 `Task` 放入持久化队列，给每个 Worker 配置独立凭据、超时、重试和死信队列。

## 5. 生产实践

- 用 trace_id 和 task_id 串联入口、路由、工具和聚合日志。
- 为 Critic 定义“通过/退回/人工复核”三态，不允许它悄悄改答案。
- 聚合器只合并结构化结果，冲突时按来源权威度、时间戳或人工规则裁决。
- 对每个 Agent 设置独立预算，防止一个 Worker 消耗全部 token。

## 6. 常见问题

- **多 Agent 会自动提高准确率吗？** 不会。角色边界不清、消息丢失和错误传播会让系统更难调试。
- **什么时候用并行？** 子任务无写冲突、结果可合并且延迟收益大于额外成本时才并行。
- **如何避免 Agent 互相循环？** 设置父任务预算、最大转发次数、消息去重和统一停止原因。
- **为什么不把所有内容广播给所有 Agent？** 会扩大数据泄露面和 token 成本，并让无关内容干扰决策。

## 7. 总结与延伸

多 Agent 是权限、工具和组织边界的映射，不是数量竞赛。确定性的流程骨架见 [Workflow](../workflow/ai-workflow-state-machine.md)，跨进程工具接入见 [MCP](../mcp/ai-mcp-architecture-and-protocol.md)。
