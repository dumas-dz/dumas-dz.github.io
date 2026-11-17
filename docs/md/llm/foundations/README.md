---
title: AI 基础与核心概念
category:
  - LLM
tag:
  - LLM 基础
  - 上下文工程
description: 面向后端工程师的 LLM、上下文、Prompt 和结构化输出知识地图。
order: 1
outline: [2, 3]
---

# AI 基础与核心概念

> 状态：已完善。本文档是 AI 应用开发的入口，后续新增基础主题时先在这里登记。

## 1. 领域定位

本领域回答一个应用开发者最常遇到的基础问题：模型如何生成、上下文如何组织、Prompt 如何稳定地表达意图、模型输出如何进入可靠的数据结构。它不负责知识库检索、Agent 循环或 MCP 协议，相关内容分别见 [Agent](../agent/README.md)、[RAG](../rag/README.md)、[Workflow](../workflow/README.md) 和 [MCP](../mcp/README.md)。

## 2. 知识地图

| 主题 | 关键问题 | 核心文档 |
| --- | --- | --- |
| 推理与上下文 | Token、上下文窗口、消息历史、截断和缓存如何影响效果与成本 | [LLM 推理与上下文工程](./ai-llm-context-and-inference.md) |
| Prompt 工程 | 如何把业务规则、工具和输出约束写成可维护的提示 | [Prompt 工程与提示治理](./ai-llm-prompt-engineering.md) |
| 结构化输出 | 如何让模型输出稳定进入 JSON Schema、数据库和消息队列 | [结构化输出与校验](./ai-llm-structured-output.md) |

## 3. 推荐学习顺序

1. 先掌握 token、上下文窗口、消息角色和温度等推理参数。
2. 再学习 Prompt 的分层、变量、示例和回归测试。
3. 最后把自然语言输出收敛为 Schema，并设计校验、重试和降级。

```text
业务意图
   ↓
上下文预算 + Prompt 模板
   ↓
模型推理 / Tool Calling
   ↓
Schema 校验 → 业务代码
        ↘ 失败 → 修复提示或降级
```

## 4. 与后端工程的连接

- 把 Prompt 版本视为配置或代码，纳入 Code Review、灰度和回滚。
- 把模型调用视为有超时、限流、重试和幂等要求的外部依赖。
- 把结构化输出当作 API Contract：先定义 Schema，再生成、校验和持久化。

## 5. 维护清单

- 文档中的模型能力描述注明模型家族或版本范围，避免把临时能力写成永久事实。
- 示例只展示一条最短路径；复杂编排链接到 Agent、RAG 或 Workflow 文档。
- 新增主题时更新本页表格和[知识地图](../../README.md)中的领域入口。

## 6. 相关主题

- [Agent 规划、工具调用与记忆](../agent/ai-agent-planning-and-execution.md)
- [RAG 数据摄取与切分](../rag/ai-rag-ingestion-and-chunking.md)
- [Workflow 状态机与 LangGraph](../workflow/ai-workflow-state-machine.md)
- [MCP 架构与工具协议](../mcp/ai-mcp-architecture-and-protocol.md)
