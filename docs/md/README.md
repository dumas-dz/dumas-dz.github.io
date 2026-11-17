---
title: 知识地图
icon: map
order: 1
category:
  - 知识地图
tag:
  - 学习路线
outline: [2, 3]
---

# 开发者技术知识地图

这是个人学习知识库的统一入口，也是对外展示技术能力的索引。内容以一名希望持续成长的技术人员视角组织：先理解核心概念，再通过最小示例动手实践，最后用项目、工程规范和面试复盘形成能力闭环。

## 三条学习主线

| 主线 | 学习目标 | 适合谁 | 入口 |
| --- | --- | --- | --- |
| 传统 Java 技术栈 | 建立扎实的后端工程能力 | Java 初学者、后端开发者、需要巩固基础的人 | [Java](./java/README.md) |
| AI 应用技术栈 | 能开发 Agent、RAG、Workflow 与 MCP 应用 | 后端转型 AI、AI 应用开发者 | [AI 应用](./llm/README.md) |
| Web3 开发技术栈 | 理解区块链并能开发、测试智能合约与 DApp | 对区块链、智能合约和去中心化应用感兴趣的开发者 | [Web3](./web3/README.md) |

三条主线共享编程基础、工程规范、调试测试和系统设计能力，可以并行学习，也可以按职业目标选择一条主线。

## 能力模型

| 能力层 | 核心问题 | 对应主题 |
| --- | --- | --- |
| AI 基础 | 如何理解模型、提示、上下文和输出 | LLM 基础、Prompt、结构化输出 |
| 应用架构 | 如何把模型变成稳定业务应用 | Agent、RAG、Workflow、MCP |
| 工程实现 | 如何实现接口、流式、并发和状态 | FastAPI、SSE、队列、缓存、幂等 |
| 数据与检索 | 如何构建企业知识和长期记忆 | Milvus、Embedding、召回、重排、记忆 |
| 质量与安全 | 如何证明效果并控制风险 | 评测、监控、提示注入、权限、审计 |
| 交付与运维 | 如何部署、扩容和控制成本 | Dify、Ollama、vLLM、K8s、成本治理 |
| 后端底座 | 如何构建可靠业务系统 | Java、Spring、数据库、MQ、架构 |

## 推荐学习路线

1. **基础入门**：LLM、Prompt、Tool Calling、结构化输出、流式接口。
2. **知识应用**：RAG 数据链路、向量检索、重排、引用与评测。
3. **Agent 开发**：意图路由、状态机、计划执行、工具调用、分层记忆。
4. **多 Agent 与工作流**：Router + 垂直 Agent、LangGraph、Dify、MCP。
5. **生产工程**：FastAPI、SSE、异步任务、幂等、缓存、重试、可观测性。
6. **质量与治理**：离线评测、在线反馈、安全边界、权限与审计。
7. **部署与优化**：Ollama、vLLM、LoRA、模型选型、并发和成本优化。

## 知识领域

### AI 应用开发

- [AI 基础与核心概念](./llm/foundations/README.md)
- [Agent 架构与实践](./llm/agent/README.md)
- [RAG 与知识库工程](./llm/rag/README.md)
- [Workflow 与 LangGraph](./llm/workflow/README.md)
- [MCP 与工具协议](./llm/mcp/README.md)
- [AI 工程化](./llm/engineering/README.md)
- [AI 评测与可观测性](./llm/evaluation/README.md)
- [AI 安全与治理](./llm/security/README.md)
- [模型与应用部署](./llm/deploy/README.md)
- [项目案例](./llm/projects/README.md)

### 框架与模型

- [LangChain](./llm/app-dev/langchain/README.md)
- [LlamaIndex](./llm/app-dev/llamaindex/README.md)
- [模型训练与微调](./llm/model-training/README.md)

### Web3 开发

- [Web3 与 DApp 开发](./web3/README.md)

### 后端工程基础

- [Java](./java/README.md)
- [Spring](./spring/README.md)
- [数据库](./db/README.md)
- [框架与中间件](./framework/README.md)
- [架构与分布式](./arch/README.md)
- [工程方法论](./dev-spec/README.md)

## 维护方式

- 先阅读[内容规范](../guide/content-standard.md)，再新增文档。
- 每篇文档必须有清晰的适用场景、工程实现和常见问题。
- 新内容先补充领域 `README.md` 的知识地图，再加入导航。
- 每次发布前执行 `pnpm run docs:build`，检查链接、代码块和页面结构。
