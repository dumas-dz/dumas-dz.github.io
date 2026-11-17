---
title: Workflow 与 LangGraph
category:
  - LLM
  - Workflow
tag:
  - Workflow
  - LangGraph
  - 状态机
description: 用显式状态、条件边和可靠执行模式编排 AI 应用。
order: 1
outline: [2, 3]
---

# Workflow 与 LangGraph

> 状态：已完善。本目录强调可重复、可恢复、可观测的流程编排，开放决策交给 [Agent](../agent/README.md)。

## 1. 领域定位

Workflow 把业务步骤、分支、循环、人工审批和失败处理显式化。LangGraph 以状态图实现节点、条件边、持久化检查点和中断恢复，适合把模型调用嵌入工程流程。

## 2. 知识地图

| 主题 | 关键问题 | 核心文档 |
| --- | --- | --- |
| 状态机建模 | 如何定义状态、事件、守卫、终态和版本 | [AI Workflow 状态机设计](./ai-workflow-state-machine.md) |
| LangGraph | 如何把状态图编译成可执行、可恢复的流程 | [LangGraph 状态图实践](./ai-workflow-langgraph.md) |
| 可靠模式 | 如何处理重试、幂等、人工审批、并行和补偿 | [Workflow 可靠性与常用模式](./ai-workflow-patterns-and-resilience.md) |

## 3. 选择原则

| 情况 | 选择 |
| --- | --- |
| 步骤固定、分支可枚举 | Workflow |
| 步骤取决于模型观察和工具选择 | Agent |
| 少量分支混合动态工具 | Workflow 节点中调用受控 Agent |
| 跨天人工审批、外部回调 | 可持久化 Workflow |
| 一次性简单提示 | 直接模型调用，不建编排 |

## 4. 标准执行模型

```text
输入校验 → 状态初始化 → 节点执行 → 条件转移
                  ↑          ↓
               恢复 ← 检查点/持久化
                  ↓
               终态 → 结果、审计、指标
```

## 5. 设计原则

- 状态可序列化，节点尽量无副作用或以幂等方式写入。
- 节点不知道全局路由，转移由条件边和守卫决定。
- 模型输出必须经过 Schema 校验后才能改变业务状态。
- 流程版本与输入版本一起持久化，旧实例继续按旧图执行。

## 6. 相关主题

- [Agent 规划与执行](../agent/ai-agent-planning-and-execution.md)
- [RAG 评测流水线](../rag/ai-rag-citation-and-evaluation.md)
- [MCP 工具服务](../mcp/ai-mcp-server-client.md)
