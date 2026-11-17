---
title: RAG 与知识库工程
category:
  - LLM
  - RAG
tag:
  - RAG
  - 向量检索
  - 知识库
description: 覆盖数据摄取、切分、Embedding、召回、重排、引用和评测的 RAG 知识地图。
order: 1
outline: [2, 3]
---

# RAG 与知识库工程

> 状态：已完善。本目录描述从原始文档到可引用答案的完整数据链路；模型调用基础见 [LLM 基础](../foundations/README.md)。

## 1. 领域定位

RAG（Retrieval-Augmented Generation）用检索结果为模型提供可更新、可引用的证据。它不是“把 PDF 切块后存向量库”的单一步骤，而是包含数据治理、索引、检索、生成和评测的持续系统。

## 2. 知识地图

| 环节 | 关键问题 | 核心文档 |
| --- | --- | --- |
| 摄取与切分 | 如何解析、清洗、分段、去重并保留文档结构 | [数据摄取与切分](./ai-rag-ingestion-and-chunking.md) |
| 索引与检索 | Embedding、混合召回、过滤和重排如何组合 | [Embedding、召回与重排](./ai-rag-retrieval-and-reranking.md) |
| 生成与评测 | 如何引用证据、拒绝无依据回答并量化效果 | [引用、忠实度与 RAG 评测](./ai-rag-citation-and-evaluation.md) |

## 3. 端到端流程

```text
原始文档 → 解析/清洗/权限标记 → 切分/父子块 → Embedding/关键词索引
                                              ↓
用户问题 → 查询改写 → 混合召回 → 过滤 → 重排 → 证据预算
                                              ↓
                              Prompt + 引用约束 → 答案/拒答
                                              ↓
                              在线反馈 → 离线评测 → 索引迭代
```

## 4. 技术选型原则

- 先建立可回答性、检索命中率和忠实度基线，再更换向量库或模型。
- 结构化数据优先走数据库/API；RAG 适合文档、手册、制度和非结构化知识。
- 文档权限必须在检索前和检索后同时过滤，不能只依赖 Prompt。
- 答案必须能追溯到文档、版本和位置；无法追溯时走拒答或人工复核。

## 5. 与相邻领域的关系

- [Prompt 与结构化输出](../foundations/README.md)控制证据如何进入回答。
- [Agent](../agent/README.md)决定何时检索以及如何使用检索结果。
- [Workflow](../workflow/README.md)适合固定的数据摄取、审批和评测流水线。

## 6. 维护清单

- 每类文档记录解析器、切分策略、Embedding 模型和索引版本。
- 建立问题集、标注集和失败样本，不以单次演示判断效果。
- 更新文档时同步更新引用定位、权限和过期信息。
