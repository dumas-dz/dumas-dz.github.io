---
title: AI 应用开发
category:
  - LLM
tag:
  - AI 应用
  - Agent
  - RAG
description: 从模型基础到 Agent、RAG、Workflow、MCP、评测、安全和部署的 AI 应用开发知识地图。
order: 1
outline: [2, 3]
---

# AI 应用开发

AI 应用开发的核心不是“接一个模型 API”，而是把模型能力、业务数据、工具、状态和权限组合成可验证、可恢复、可控制成本的软件系统。本目录以开发工程师视角组织：先理解模型与提示，再完成检索、Agent、工作流和工具协议，最后补齐评测、安全、部署与项目交付。

## 学习目标

- 解释上下文、推理、结构化输出、工具调用和失败边界。
- 设计可追溯的 RAG 数据链路，并用引用和评测证明答案质量。
- 实现意图路由、计划执行、记忆、工具调用和多 Agent 协作。
- 用状态机、LangGraph 或工作流引擎构建可恢复业务流程。
- 理解 MCP 的工具协议、权限边界、版本与生产部署。
- 建立离线评测、在线反馈、可观测性、安全治理和成本控制。

## 推荐学习路线

1. **模型基础**：[LLM 基础](./foundations/README.md)、Prompt、上下文和结构化输出。
2. **检索增强**：[RAG 工程](./rag/README.md)、切分、Embedding、召回、重排、引用和评测。
3. **Agent 开发**：[Agent 架构](./agent/README.md)、意图路由、计划执行、记忆和工具调用。
4. **流程编排**：[Workflow](./workflow/README.md)、状态机、LangGraph、可靠性和恢复。
5. **工具生态**：[MCP](./mcp/README.md)、服务端/客户端、安全和工程落地。
6. **生产工程**：[工程化](./engineering/README.md)、[评测](./evaluation/README.md)、[安全](./security/README.md)。
7. **交付运行**：[部署](./deploy/README.md)、模型选型、推理平台、容量和成本。
8. **项目闭环**：[项目案例](./projects/README.md)，把知识组合成可演示、可测试的系统。

## 知识地图

| 领域 | 入口 | 核心产出 | 状态 |
| --- | --- | --- | --- |
| 模型与提示 | [Foundations](./foundations/README.md) | 能解释模型输入输出与失败 | 已完善 |
| RAG | [RAG](./rag/README.md) | 有引用、有评测的知识问答 | 已完善 |
| Agent | [Agent](./agent/README.md) | 可控的工具调用与多 Agent 系统 | 已完善 |
| Workflow | [Workflow](./workflow/README.md) | 可恢复的状态与流程编排 | 已完善 |
| MCP | [MCP](./mcp/README.md) | 可治理的工具协议集成 | 已完善 |
| 工程化 | [Engineering](./engineering/README.md) | 可靠服务、异步任务和观测 | 持续更新 |
| 评测 | [Evaluation](./evaluation/README.md) | 离线回归与在线质量 | 持续更新 |
| 安全 | [Security](./security/README.md) | 提示注入、权限、隐私和审计 | 持续更新 |
| 部署 | [Deploy](./deploy/README.md) | 模型选型、推理、容量和成本 | 持续更新 |
| 项目 | [Projects](./projects/README.md) | 可展示的端到端案例 | 持续更新 |
| LangChain | [LangChain](./app-dev/langchain/README.md) | 编排框架与组件实践 | 持续更新 |
| LlamaIndex | [LlamaIndex](./app-dev/llamaindex/README.md) | 数据摄取、索引和查询 | 持续更新 |
| 模型训练 | [Model Training](./model-training/README.md) | 数据、微调、评测和部署 | 持续更新 |
| 面试复盘 | [Interview](./interview/README.md) | 用工程证据回答高频问题 | 持续更新 |

## 工程约束

- **可验证**：每个 Agent/RAG/Workflow 都要有离线样例、失败断言和线上指标。
- **最小权限**：工具、知识、模型和用户数据按任务授权，不把全部能力交给单一 Prompt。
- **可恢复**：超时、重试、幂等、状态持久化、人工接管和降级都是业务路径。
- **成本可控**：记录 token、模型、检索、工具和重试成本，区分批量任务与交互式任务。
- **版本明确**：框架、模型、协议和 API 变化快，示例必须标注版本范围和迁移边界。

## 关联阅读

- [开发者技术知识地图](../README.md)
- [工程方法论与开发规范](../dev-spec/README.md)
- [数据库](../db/README.md)
- [架构与分布式](../arch/README.md)
- [内容规范](../../guide/content-standard.md)

状态：持续更新。新增文档先更新本页知识地图，再补充领域 README 和导航。
