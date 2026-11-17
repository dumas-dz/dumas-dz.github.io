---
title: AI 应用框架
category:
  - LLM
  - 应用开发
tag:
  - LangChain
  - LlamaIndex
  - 框架选型
description: LangChain 与 LlamaIndex 的定位、组件、数据链路和工程化实践入口。
order: 20
outline: [2, 3]
---

# AI 应用框架

框架负责组合模型、提示、数据、工具和输出，但不能替代清晰的业务边界、测试和可观测性。本目录保留两条常见框架学习线，帮助开发者理解抽象，也能在框架升级时迁移。

## 学习路线

1. 先用 [AI 基础](../foundations/README.md) 理解模型、上下文和结构化输出。
2. 学习 [LangChain](./langchain/README.md)：模型、Prompt、Chain、Memory、Retriever、Agent 和回调。
3. 学习 [LlamaIndex](./llamaindex/README.md)：Document/Node、摄取、索引、查询、Agent 和评测。
4. 用 [RAG](../rag/README.md)、[Agent](../agent/README.md)、[Workflow](../workflow/README.md) 校验框架抽象是否真正解决问题。
5. 进入 [工程化](../engineering/README.md)、[评测](../evaluation/README.md) 和 [部署](../deploy/README.md)。

## 选型原则

- 先写清业务流程、数据边界、错误语义和评测集，再选框架。
- 框架封装必须能被日志、测试和调试穿透，避免“黑盒链路”。
- 固定版本、模型、Embedding 和向量库，记录迁移成本。
- 能用标准接口或少量代码解决时，不为框架特性引入无界复杂度。

状态：持续更新。LangChain 与 LlamaIndex 文档包含历史导入内容，执行前应按各篇版本基线核对 API。
