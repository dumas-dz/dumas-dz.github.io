---
title: LlamaIndex - 学习大纲
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 大纲
---

> **来源专栏**：[ChatGPT与大模型研究](https://juejin.cn/column/7235906887861960741)（作者：数据智能老司机）
> **参考书籍**：*Building Data-Driven Applications with LlamaIndex (Second Edition)* — Packt Publishing
> **整理日期**：2026-06-10

---

## 📚 主目录

| 序号 | 章节标题 | 详细笔记 | 原文链接 | 一句话摘要 |
|------|---------|---------|---------|-----------|
| 01 | 理解大型语言模型 | [📝笔记](./01_第01章_理解大型语言模型.md) | [掘金](https://juejin.cn/post/7646345605620072498) | GenAI 与 LLM 基础概念，以及 RAG 如何解决 LLM 的核心局限 |
| 02 | LlamaIndex 生态系统简介 | [📝笔记](./02_第02章_LlamaIndex生态系统简介.md) | [掘金](https://juejin.cn/post/7646480731238137882) | LlamaIndex 框架定位、模块化架构、环境搭建与实战项目介绍 |
| 03 | 开启你的 LlamaIndex 之旅 | [📝笔记](./03_第03章_开启你的LlamaIndex之旅.md) | [掘金](https://juejin.cn/post/7646593427816448010) | 核心构建块：Document、Node、Index 与 QueryEngine，构建第一个应用 |
| 04 | 将数据摄取到 RAG 工作流中 | [📝笔记](./04_第04章_将数据摄取到RAG工作流中.md) | [掘金](https://juejin.cn/post/7646593427816529930) | 数据加载器、文档分块策略、元数据管理与隐私保护 |
| 05 | 使用 LlamaIndex 进行索引 | [📝笔记](./05_第05章_使用LlamaIndex进行索引.md) | [掘金](https://juejin.cn/post/7646480731238367258) | 向量索引、Embeddings 原理、多种索引类型与持久化策略 |
| 06 | 查询数据（上）——上下文检索 | [📝笔记](./06_第06章_查询数据上_上下文检索.md) | [掘金](https://juejin.cn/post/7646480731238514714) | 各类 Retriever 机制：向量检索、稀疏检索、混合检索与元数据过滤 |
| 07 | 查询数据（下）——后处理与响应合成 | [📝笔记](./07_第07章_查询数据下_后处理与响应合成.md) | [掘金](https://juejin.cn/post/7646622735791652874) | 节点后处理器、Re-ranker、响应合成策略与流式输出 |
| 08 | 使用 Workflow 构建更智能的应用 | [📝笔记](./08_第08章_使用Workflow构建更智能的应用.md) | [掘金](https://juejin.cn/post/7646537363406340137) | LlamaIndex Workflow 事件驱动架构、分支/重试/人工审批机制 |
| 09 | 理解基础智能体架构 | [📝笔记](./09_第09章_理解基础智能体架构.md) | [掘金](https://juejin.cn/post/7646684010680811561) | ChatEngine 模式、FunctionAgent 与 ReActAgent 范式、对话记忆 |
| 10 | 探索高级智能体用例 | [📝笔记](./10_第10章_探索高级智能体用例.md) | [掘金](https://juejin.cn/post/7646684010680909865) | 多智能体协作、Handoff 机制、Human-in-the-loop 与大型工具输出处理 |
| 11 | 定制并部署 LlamaIndex 项目 | [📝笔记](./11_第11章_定制并部署LlamaIndex项目.md) | [掘金](https://juejin.cn/post/7646684010681008169) | 模型定制、Streamlit 前端集成、生产部署与性能优化 |
| 12 | 调优 RAG 实现——可观测性与评估 | [📝笔记](./12_第12章_调优RAG实现_可观测性与评估.md) | [掘金](https://juejin.cn/post/7646636470159999018) | Instrumentation 追踪、RAG 评估指标体系与迭代优化循环 |
| 13 | 提示工程指南与最佳实践 | [📝笔记](./13_第13章_提示工程指南与最佳实践.md) | [掘金](https://juejin.cn/post/7646696467930906687) | 提示词模板设计、CoT/ToT 策略、Few-shot 与提示链 |
| 14 | 结语与额外资源 | [📝笔记](./14_第14章_结语与额外资源.md) | [掘金](https://juejin.cn/post/7646684010681434153) | 学习资源汇总、AI 监管趋势（EU AI Act）与伦理思考 |

---

## 第 01 章：理解大型语言模型

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——理解大型语言模型](https://juejin.cn/post/7646345605620072498)

### 核心概念

- **GenAI（生成式 AI）**：能够生成新内容（文本、图像、音频、视频）的系统，使用深度神经网络（如 Transformer）在海量数据上训练，学习数据背后的概率分布并从中采样生成新内容
- **LLM（大型语言模型）**：专为理解和生成人类语言设计的神经网络，在数十亿甚至万亿词上训练，通过学习词与词之间的概率关系来生成文本
- **Transformer 架构**：使用注意力机制学习文本中的长距离依赖关系，GPT 系列采用仅解码器架构

### LLM 的能力与局限

| 能力 | 局限 |
|------|------|
| 文本生成、翻译、摘要 | **知识截断**：训练数据有截止日期，无法获取最新信息 |
| 代码编写、推理辅助 | **幻觉（Hallucination）**：生成看似合理但实际错误的内容 |
| 多轮对话、指令遵循 | **缺乏真实推理能力**：本质是概率预测，非真正理解 |
| 跨领域知识覆盖 | **偏见与不公平**：继承训练数据中的偏见 |

### RAG（检索增强生成）的提出

- **出处**：2020 年 Meta 研究论文 *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*
- **核心思想**：先从已索引数据源中检索相关信息，再使用生成模型生成回答
- **五大优势**：
  1. **更好的事实保持能力**：从特定数据源拉取信息支撑回答
  2. **改进推理能力**：填补知识缺口，带来更合乎逻辑的推理
  3. **上下文相关性**：基于查询拉取外部信息，而非仅依赖静态训练数据
  4. **降低幻觉风险**：减少完全虚假答案的概率
  5. **易于验证和追踪**：可提供原始信息引用

### 关键原理

LLM 类似操作系统——提供基础层，应用构建其上。RAG 是连接 LLM 通用知识与专有数据的桥梁，而 LlamaIndex 是实现 RAG 的高效独立框架，支持本地托管模型以降低成本和隐私担忧。

---

## 第 02 章：LlamaIndex 生态系统简介

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——LlamaIndex生态系统简介](https://juejin.cn/post/7646480731238137882)

### 核心概念

#### LLM 优化的流行方法对比

| 方法 | 原理 | 优势 | 劣势 |
|------|------|------|------|
| **微调（Fine-tuning）** | 在专有数据上对 LLM 进行额外训练 | 领域专业化、性能提升 | 成本高、需要大数据集、永久改变原始模型 |
| **LoRA（低秩适配）** | 引入小型可训练层，保持原始模型冻结 | 内存高效、保留原始模型 | 仍需计算资源和专业知识 |
| **提示工程** | 通过文本输入引导 LLM 行为 | 最快上手、无需修改模型 | 战术工具，非系统性方法 |
| **知识蒸馏** | 将大模型知识迁移到小模型 | 轻量化部署 | 损失精度 |
| **RAG** | 结合检索与生成 | 易更新、易个性化、成本可控 | 依赖检索系统质量 |

#### LlamaIndex 双层设计

- **高层 API**：开箱即用的函数，适合快速开发
- **低层 API**：可定制组件，适合高级使用场景

#### 模块化代码结构

```
llama-index-core/          # 核心框架基础包
llama-index-integrations/  # 300+ 集成包（LLM、加载器、嵌入模型、向量存储）
llama-index-packs/         # 50+ Llama Packs（社区模板）
llama-index-cli/           # 命令行界面
```

### 实践方法

#### 环境搭建

```bash
pip install llama-index
pip install streamlit
ollama pull gemma3:4b
ollama pull nomic-embed-text
```

#### 实战项目：Contract Review Expert

贯穿全书的合同审查应用，将逐步从简单原型发展为完整生产系统。

---

## 第 03 章：开启你的 LlamaIndex 之旅

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——开启你的 LlamaIndex 之旅](https://juejin.cn/post/7646593427816448010)

### 核心概念

#### 三大核心构建块

**1. Document（文档）**
- 数据容器，捕获和包含任何类型的数据
- 关键属性：`text`（文本内容）、`metadata`（元数据字典）、`id_`（唯一 ID）

**2. Node（节点）**
- 从文档中提取的逻辑数据块（chunk），是 LlamaIndex 处理数据的基本单元
- 创建方式：手动创建或使用 **Splitters**（如 `SentenceSplitter`）自动提取
- 节点间可建立关系（`PREVIOUS`/`NEXT`/`PARENT`/`CHILD`/`SOURCE`）

**3. Index（索引）**
- 根据使用场景组织节点的数据结构
- `SummaryIndex` / `VectorStoreIndex` / `TreeIndex` / `KeywordIndex` 等

#### QueryEngine（查询引擎）

1. **Retriever**：从索引中检索相关节点
2. **Node Postprocessor**：对检索到的节点进行转换、重排或过滤
3. **Response Synthesizer**：使用 LLM 构造最终响应

#### 完整 RAG 工作流

```
数据 → Document → Node → Index → Retriever → Postprocessor → Response Synthesizer → 最终响应
```

### 实践方法

```python
from llama_index.core import Document, SummaryIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.wikipedia import WikipediaReader

loader = WikipediaReader()
documents = loader.load_data(pages=["Messi Lionel"])
parser = SentenceSplitter.from_defaults()
nodes = parser.get_nodes_from_documents(documents)
index = SummaryIndex(nodes)
query_engine = index.as_query_engine()
response = query_engine.query("What is Messi's hometown?")
```

---

## 第 04 章：将数据摄取到 RAG 工作流中

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——将数据摄取到我们的 RAG 工作流中](https://juejin.cn/post/7646593427816529930)

### 核心概念

- **LlamaHub 数据加载器**：200+ 数据 reader（SimpleDirectoryReader、DatabaseReader、LlamaParse 等）
- **文档分块策略**：SentenceSplitter / TokenTextSplitter / CodeSplitter / HierarchicalNodeParser / SentenceWindowNodeParser
- **元数据管理**：自动继承、LLM 提取器、元数据过滤器
- **IngestionPipeline**：可定制的自动化摄取流水线
- **隐私保护**：PIINodePostprocessor 遮蔽个人身份信息

---

## 第 05 章：使用 LlamaIndex 进行索引

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——使用 LlamaIndex 进行索引](https://juejin.cn/post/7646480731238367258)

### 核心概念

- **VectorStoreIndex**：主力索引（约 80% 场景），基于向量相似度检索
- **Embeddings 原理**：文本转高维向量，语义相似文本距离更近
- **相似度计算**：余弦相似度（默认）、点积、欧氏距离
- **其他索引**：SummaryIndex / TreeIndex / KeywordIndex / DocumentSummaryIndex / PropertyGraphIndex
- **ComposableGraph**：索引之上的索引，支持跨索引查询
- **持久化**：`index.storage_context.persist()` 存储到磁盘

---

## 第 06 章：查询数据（上）——上下文检索

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——查询我们的数据，第1部分——上下文检索](https://juejin.cn/post/7646480731238514714)

### 核心概念

- **Dense vs Sparse vs Hybrid Retrieval**：向量检索 / 关键词检索 / 混合检索
- **VectorIndexRetriever / VectorIndexAutoRetriever**：向量检索器
- **SummaryIndexRetriever / SummaryIndexEmbeddingRetriever / SummaryIndexLLMRetriever**
- **DocumentSummaryIndex Retriever**
- **元数据过滤器**：安全第一道防线，在数据进入 LLM 前过滤

---

## 第 07 章：查询数据（下）——后处理与响应合成

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——查询我们的数据，第2部分——后处理与响应合成](https://juejin.cn/post/7646622735791652874)

### 核心概念

- **过滤型后处理器**：SimilarityPostprocessor / KeywordNodePostprocessor / PIINodePostprocessor
- **转换型后处理器**：MetadataReplacementPostprocessor / SentenceEmbeddingOptimizer
- **重排器（Re-ranker）**：SentenceTransformerRerank / LLMRerank / ColbertRerank
- **响应合成策略**：refine / compact / tree_summarize / simple_summarize
- **流式输出**：token 级别实时流式响应

---

## 第 08 章：使用 Workflow 构建更智能的应用

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——使用工作流构建更快、更智能的应用](https://juejin.cn/post/7646537363406340137)

### 核心概念

- **简单 RAG vs Workflow vs Agent**：Workflow 是结构性与灵活性的最佳平衡点
- **事件驱动架构**：Workflow / StartEvent / StopEvent / @step() / 自定义 Event
- **内置特性**：分支、重试、并行执行、共享状态、人工审批、异步执行
- **Workflow 是 Agent 的底层引擎**

---

## 第 09 章：理解基础智能体架构

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——理解基础智能体架构](https://juejin.cn/post/7646684010680811561)

### 核心概念

- **ChatEngine 模式**：SimpleChatEngine / Context / Condense Question / Condense+Context
- **FunctionAgent**：依赖 LLM 原生函数调用能力
- **ReActAgent（Reasoning + Acting）**：思考与行动交替，兼容性更广
- **智能体核心组件**：LLM + Tools + Memory + Workflow

---

## 第 10 章：探索高级智能体用例

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——探索高级智能体用例](https://juejin.cn/post/7646684010680909865)

### 核心概念

- **智能体事件循环**：AgentInput → LLM推理 → AgentOutput → ToolCall → ToolCallResult
- **多智能体协作**：AgentWorkflow 管理多智能体，Handoff 机制传递任务
- **LoadAndSearchToolSpec**：处理大型工具输出，拆分为"加载+索引"和"搜索"两步
- **Human-in-the-loop**：关键决策点暂停等待人工审批

---

## 第 11 章：定制并部署 LlamaIndex 项目

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——定制并部署我们的 LlamaIndex 项目](https://juejin.cn/post/7646684010681008169)

### 核心概念

- **模型定制**：Settings 类全局配置 LLM 和 Embedding 模型
- **Streamlit 前端**：快速构建交互式 Web 应用
- **部署策略**：本地部署（Ollama） / 容器化（Docker） / 云服务

---

## 第 12 章：调优 RAG 实现——可观测性与评估

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——调优我们的 RAG 实现——可观测性与评估](https://juejin.cn/post/7646636470159999018)

### 核心概念

- **可观测性**：Trace、Log、Metric；LlamaIndex Instrumentation 模块
- **评估指标**：Faithfulness（忠实度）/ Relevancy（相关性）/ Correctness（正确性）
- **LLM-as-a-Judge**：使用 LLM 自动评估
- **迭代优化循环**：评估 → 追踪问题 → 调整 → 再评估

---

## 第 13 章：提示工程指南与最佳实践

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——提示工程指南与最佳实践](https://juejin.cn/post/7646696467930906687)

### 核心概念

- **RichPromptTemplate**：LlamaIndex 现代提示词模板
- **提示策略**：Zero-shot / Few-shot / CoT / ToT / Prompt Chaining
- **Bi-encoders vs Cross-encoders**：检索阶段 vs 重排阶段

---

## 第 14 章：结语与额外资源

**原文链接**：[使用 LlamaIndex 构建数据驱动型应用——结语与额外资源](https://juejin.cn/post/7646684010681434153)

### 核心内容

- **LlamaIndex 定位转变**：从"RAG 框架"转向"面向 Agentic Work Automation 的文档基础设施"
- **MCP（Model Context Protocol）**：AI 与外部数据集成的新兴标准
- **EU AI Act**：核心工程原则——透明性、人类监督、数据隐私、公平性、可问责性、持续监控
- **"RAG 已死"争论**：RAG 正在演进，与 Agents 和 Workflows 融合

---

## 🔗 附录：专栏中其他 LlamaIndex/RAG 相关文章

| 标题 | 链接 | 说明 |
|------|------|------|
| 构建基于数据驱动的应用程序与 LlamaIndex（第一版系列） | [掘金](https://juejin.cn/post/7397274001067229193) | 第一版系列，部分内容有重叠 |
| Python RAG 实战手册（系列 11 篇） | [掘金专栏](https://juejin.cn/column/7235906887861960741) | RAG 实践从入门到 Web 应用 |
| RAG（检索增强生成）的演变 | [掘金](https://juejin.cn/post/7353476280862703616) | 初级/高级/模块化 RAG 架构 |
| 精通 RAG：如何构建企业 RAG 系统 | [掘金](https://juejin.cn/post/7353458034562203663) | 企业级 RAG 系统设计 |

---

> 📖 **学习建议**：按 01→14 顺序逐章学习，点击各章「📝笔记」链接查看完整内容。每章包含代码示例、配置方法和最佳实践。重点关注第 3-5 章的基础概念，以及第 8-10 章的 Workflow 和 Agent 架构。
