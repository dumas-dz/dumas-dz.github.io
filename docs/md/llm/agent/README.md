---
title: Agent 架构与实践
category:
  - LLM
  - Agent
tag:
  - Agent
  - Tool Calling
  - 多 Agent
description: 从任务规划、工具调用、意图路由和记忆到多 Agent 协作的工程知识地图。
order: 1
outline: [2, 3]
---

# Agent 架构与实践

> 状态：已完善。本目录聚焦“模型如何决策并执行”，复杂流程的确定性编排见 [Workflow](../workflow/README.md)。

## 1. 领域定位

Agent 是“模型决策 + 工具执行 + 状态管理 + 停止条件”的运行单元。一个生产 Agent 必须可观察、可中断、可限额、可恢复，不能只依赖模型自觉。

## 2. 知识地图

| 主题 | 关键问题 | 核心文档 |
| --- | --- | --- |
| 规划与执行 | 何时拆解任务、调用工具、反思和停止 | [Agent 规划、Tool Calling 与执行控制](./ai-agent-planning-and-execution.md) |
| 路由与记忆 | 如何识别意图、管理短期/长期记忆 | [意图路由与分层记忆](./ai-agent-memory-and-intent-routing.md) |
| 多 Agent | 如何划分职责、传递状态并隔离故障 | [多 Agent 系统设计](./ai-agent-multi-agent-systems.md) |

## 3. 参考架构

```text
用户输入
   ↓
意图路由 → 澄清/拒绝 → 安全策略
   ↓
Planner → Tool Calling → 观察结果
   ↑          ↓
记忆读写 ← 状态与审计
   ↓
结构化结果 / 自然语言回答
```

## 4. 学习顺序

1. 先会设计工具 Schema、权限和超时，再让模型选择工具。
2. 再加入计划、反思、最大步数、成本和时间预算。
3. 最后按真实瓶颈引入路由、长期记忆和多 Agent，避免过早复杂化。

## 5. 设计原则

- **确定性优先**：能用规则或 Workflow 判断的，不让 Agent 每轮重新推理。
- **最小权限**：工具只获得完成任务所需的数据和动作。
- **状态显式化**：计划、证据、工具结果和未完成事项都写入可持久化状态。
- **停止可解释**：记录是成功、超预算、无工具、人工接管还是失败。

## 6. 相关主题

- [结构化输出与校验](../foundations/ai-llm-structured-output.md)
- [Workflow 状态机与 LangGraph](../workflow/ai-workflow-state-machine.md)
- [MCP 工具协议](../mcp/ai-mcp-architecture-and-protocol.md)
