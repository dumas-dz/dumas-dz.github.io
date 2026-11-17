---
title: LangChain 学习路线
category:
  - LLM
  - LangChain
tag:
  - LangChain
  - 编排框架
  - Agent
description: 从 LangChain 环境、模型与提示到 Chain、RAG、Agent、调试和生产实践的学习入口。
order: 10
outline: [2, 3]
---

# LangChain 学习路线

LangChain 适合学习如何组合模型、提示、数据、记忆和工具。学习重点是理解组件契约和调用链，而不是记忆易变的类名。API 会随版本演进，运行示例前先核对官方迁移说明。

## 学习顺序

| 阶段 | 文档 | 学习产出 |
| --- | --- | --- |
| 1 | [概览](./ai-langchain-overview.md) | 理解定位、生态和学习路线 |
| 2 | [环境搭建](./ai-langchain-setup.md) | 建立可复现 Python 环境 |
| 3 | [模型与消息](./ai-langchain-model.md) | 调用 LLM/ChatModel 并处理消息 |
| 4 | [Prompt](./ai-langchain-prompt.md) | 构建可复用提示模板 |
| 5 | [Output Parser](./ai-langchain-output-parser.md) | 把自由文本转为稳定结构 |
| 6 | [Chain](./ai-langchain-chain.md) | 组合多步骤调用 |
| 7 | [文档加载](./ai-langchain-doc-loader.md) | 接入 PDF、Word、网页等数据 |
| 8 | [Embedding](./ai-langchain-embedding.md) | 生成和管理向量表示 |
| 9 | [向量数据库](./ai-langchain-vector-db.md) | 选择并使用向量检索 |
| 10 | [RAG](./ai-langchain-rag.md) | 构建检索增强问答 |
| 11 | [Memory](./ai-langchain-memory.md) | 管理对话历史与长期记忆 |
| 12 | [Tools](./ai-langchain-tools.md) | 定义并治理工具 |
| 13 | [Agent](./ai-langchain-agent.md) | 实现计划、调用和恢复 |
| 14 | [LangGraph](./ai-langchain-langgraph.md) | 用状态图编排复杂流程 |
| 15 | [Callback](./ai-langchain-callback.md) | 记录、监控和成本统计 |
| 16 | [缓存](./ai-langchain-cache.md) | 降低延迟和模型成本 |
| 17 | [错误处理](./ai-langchain-error-handling.md) | 处理超时、限流和解析失败 |

## 实践检查表

- [ ] 锁定 Python、LangChain、模型 SDK 和向量库版本。
- [ ] Prompt、模型、解析器和工具分别有最小测试。
- [ ] 记录调用链、token、耗时、错误和缓存命中。
- [ ] API Key 从环境变量或密钥管理器注入。
- [ ] 对模型不可用、限流、输出不合法和工具失败定义恢复动作。

状态：持续更新。部分章节为历史导入内容，示例版本和模型名必须在运行前核对。
