---
title: LlamaIndex 学习路线
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - RAG
  - 数据摄取
description: 从 LlamaIndex 数据加载、索引、查询到 Agent、部署、调优和提示工程的学习入口。
order: 20
outline: [2, 3]
---

# LlamaIndex 学习路线

LlamaIndex 适合学习数据如何进入 RAG：从 Document、Node、Index 到 Query Engine、Agent 和评测。核心不是记住所有集成，而是掌握数据质量、切分、检索和引用的因果链。

## 学习顺序

| 编号 | 文档 | 主题 |
| --- | --- | --- |
| 01 | [LLM 基础](./ai-llamaindex-01-llm.md) | 模型能力与限制 |
| 02 | [生态系统](./ai-llamaindex-02-ecosystem.md) | 模块、集成和项目结构 |
| 03 | [快速开始](./ai-llamaindex-03-quickstart.md) | Document、Node、Index、Query Engine |
| 04 | [数据摄取](./ai-llamaindex-04-data-ingestion.md) | Reader、切分、元数据和流水线 |
| 05 | [索引](./ai-llamaindex-05-indexing.md) | 向量、结构和索引选择 |
| 06 | [查询与检索](./ai-llamaindex-06-query-retrieval.md) | Retriever、过滤和融合 |
| 07 | [查询响应](./ai-llamaindex-07-query-response.md) | 合成、引用和结构化输出 |
| 08 | [Workflow](./ai-llamaindex-08-workflow.md) | 事件、步骤和恢复 |
| 09 | [Agent 基础](./ai-llamaindex-09-agent-basic.md) | 对话、工具与记忆 |
| 10 | [Agent 进阶](./ai-llamaindex-10-agent-advanced.md) | 多 Agent 和工具检索 |
| 11 | [部署](./ai-llamaindex-11-deploy.md) | 服务化、打包和发布 |
| 12 | [RAG 调优](./ai-llamaindex-12-rag-tuning.md) | 诊断、重排和评测 |
| 13 | [提示工程](./ai-llamaindex-13-prompt.md) | PromptTemplate 与提示优化 |
| 14 | [总结](./ai-llamaindex-14-summary.md) | 回顾与下一步 |

## 工程检查表

- [ ] 记录数据源、解析器、切分参数、Embedding 和索引版本。
- [ ] 测试表格、扫描件、重复、过期和权限过滤。
- [ ] 评估召回、重排、忠实度、引用和答案相关性。
- [ ] 对索引重建、模型切换和数据删除保留迁移路径。
- [ ] 控制元数据提取、Embedding 和生成的 token/调用成本。

状态：持续更新。示例含历史版本 API 和模型名，执行前按官方文档锁定兼容版本。
