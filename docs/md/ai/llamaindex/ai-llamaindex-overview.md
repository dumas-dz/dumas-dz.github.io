---
title: LlamaIndex
category:
  - AI
  - LlamaIndex
tag:
  - LlamaIndex
---
llamaIndex是一个用于构建和查询大规模语言模型（LLM）应用的开源数据框架，专注于提升语言模型与外部数据源的交互能力，可将私有或特定领域数据注入、结构化并提供访问，为开发知识驱动的应用程序提供支持，实现检索增强生成（RAG）功能。
连接LLMS和DataSilos的数据连接应用框架
## LlamaIndex的功能模块
1. 数据连接器（Data Connectors）：帮助应用程序注入已有的数据，提供统一接口，专治各种数据源、不同格式，可连接超过100+种数据源。
2. 索引类型（Index Types）：该模块帮助将数据转换成大模型更好处理的数据格式。具体索引类型及适用场景如下：
- VectorStoreIndex：用于语义相似度检索，快速、准确，适合大多数RAG场景。
- TreeIndex：适用于层级摘要、文档总结，自底向上构建摘要树，适合“总结全书”类查询。
- KeywordTableIndex：进行关键词精确匹配，不依赖Embedding，适合结构化查询。
- KnowledgeGraphIndex：用于实体关系查询，提取实体和关系，支持“谁和谁有关系”类问题。
- DocumentSummaryIndex：用于多文档摘要检索，预先为每个文档生成摘要，检索时先查摘要。
- ComposableGraphIndex：可组合多种索引，将多个索引组合，实现复杂查询策略。
- PandasIndex：用于表格数据查询，直接查询DataFrame，支持自然语言转SQL。
3. 查询引擎（Query Engines）：提供自然语言访问数据的模块和接口，不同的查询引擎解决不同的查询需求。例如：
RetrieverQueryEngine：实现检索+生成，是标准RAG流程。
RouterQueryEngine：可智能路由，根据问题选择不同的数据源。
4. 应用集成（Application Integrations）：可以方便地将LlamaIndex与AI应用框架结合，目前使用较多的是与LangChain联手，打造私有专家AI智能系统。
5. 数据代理（Data Agent）：如ReAct和OpenAI风格的代理，能够基于索引进行推理并调用工具。

---

# 六种典型Agent设计模式

Agent分为两种，一种是以固定的流程为主，不同节点分别连接着逻辑处理、文本处理、大模型请求等，以dify、coze、n8n等为主流的Workflow。
另一种是可以实现执行过程中自主动态决策：计划、反思、调用等动作，可以完成复杂任务的执行，需要定制开发的Agent。

单Agent设计模式
1、ReAct模式
核心思想：Reason + Act = ReAct —— 推理与行动交错进行，"边想边做"Agent 在每一步都先生成思考（Thought），再决定行动（Action），观察结果（Observation），循环往复直到完成任务。
流程 Thought -> Action -> Observation
| Thought（思考） | 智能体分析当前情况、分解任务、制定下一步计划，或反思上一步结果 || Action（行动） | 智能体决定采取的具体动作，通常是调用一个外部工具 || Observation（观察） | 执行 Action 后从外部工具返回的结果，如搜索摘要或 API 返回值 |
2、Plan-and-Excute 模式
核心思想：先全局规划，再分步执行Agent 首先生成完整的执行计划，然后按照计划逐步执行每个步骤。适合任务步骤明确、需要整体优化的场景。通过预先规划，Agent 能够优化整体执行路径，避免局部最优。
流程 Planning -> Execution -> Evaluation
| 规划（Planning） | 生成完整执行计划 || 执行（Execution） | 按顺序执行每个步骤 || 评估（Evaluation） | 检查结果，决定继续或重规划 || 完成（Finish） | 返回最终结果 |
3、Reflection 模式
核心思想：自我评估与迭代改进Agent 生成初始输出后，通过自我反思（Reflection）评估质量，识别问题，然后进行优化（Refinement），循环迭代直到达到质量标准。其特点是为智能体引入一种事后（post-hoc）的自我校正循环，使智能体能够像人类一样审视自己的工作，发现不足并进行迭代优化。完整的"执行-反思-优化"轨迹形成宝贵的经验记录，还可以扩展至多模态输出（代码、图像等）。
流程 Generator -> Evaluator -> Refiner
| 生成器（Generator） | 生成初始输出 || 评估器（Evaluator） | 评估输出质量，产出反馈 || 优化器（Refiner） | 基于反馈改进输出，进入下一轮迭代 |

多Agent设计范式

1、Multi-Agent Network（网络型）
这种架构，存在多个智能体节点，每个节点之间都和相互通信，并且相互委派，去中心化
| 拓扑结构 | 去中心化，点对点通信 |
| 适用场景 | 强互动、无固定调用顺序的场景 |
| 优点 | 信息、资源和任务共享，具备弹性和灵活性 |
| 缺点 | 通信管理复杂，决策一致性较难保证 |
2、Agent Supervisor（监督者型）
| 拓扑结构 | 星形，监督者居中协调 |
| 适用场景 | 多领域任务分发、并行运行多 Agent、map-reduce 模式 |
| 优点 | 层级结构清晰，易于管理和扩展 |
| 缺点 | 存在单点故障和性能瓶颈风险 |
3、Hierarchical Agent Teams（层级型）
Agent Supervisor的进阶版，多层级指挥，和公司一样，有CEO、经理、员工...
| 拓扑结构 | 多层树形，高层监督者管理低层监督者，底层为操作智能体 |
| 适用场景 | 大型复杂任务、需要分布式决策的系统 |
| 优点 | 便于扩展，分层管理清晰，支持分布式决策 |
| 缺点 | 架构复杂，层级间通信开销较大 |


# RAG
RAG解决了大模型的三大核心痛点：知识实效性问题，幻觉问题，私有数据访问问题

RAG一般问题[https://mp.weixin.qq.com/s/UGuBJTockH6QHmMDtIKyoQ]


# 构建RAG系统的11个有效策略[https://mp.weixin.qq.com/s/F2PhCCTUWLwzM1IQ81Raww]
## 原始 RAG 的问题
- 固定大小的分块会在句子中途切断，导致上下文丢失
- 单一查询视角会错过用不同表述方式的文档
- 没有相关性过滤——你得到的是“最接近”的匹配，而不一定是最相关的
- 上下文有限——小块内容缺乏整体信息
## 解决办法
1. 文档摄取策略（Ingestion strategies） —— 如何准备文档
2. 查询策略（Query strategies） —— 如何进行搜索
3. 混合方法（Hybrid approaches） —— 多种方法结合以增强效果

策略 1：上下文感知分块（Context-Aware Chunking）
- 作用：不是按固定字符数拆分文档，而是分析语义边界和文档结构来进行分块。
策略 2：上下文检索（Contextual Retrieval）
- 作用：在对每个文档块进行嵌入之前，为其添加文档级上下文。LLM 会生成 1–2 句，说明每个块在整篇文档中的内容和意义。
策略 3：重排序（Re-ranking）
- 作用：采用两阶段检索方法——先通过快速向量搜索找到 20–50 个候选块，然后使用交叉编码器（Cross-Encoder）对它们重新打分以提高精度。
策略 4：查询扩展（Query Expansion）
- 作用：使用 LLM 将简短的用户查询扩展为更详细、全面的版本。
策略 5：多查询 RAG（Multi-Query RAG）
- 作用：为同一个问题生成 3–4 种不同的表述方式，并行使用所有查询进行搜索，然后对结果进行去重。
策略 6：智能体式 RAG（Agentic RAG）
- 作用：为 AI 智能体提供多种检索工具，并让它根据具体查询自主选择使用哪一种或哪几种工具。
策略 7：自反式 RAG（Self-Reflective RAG）
- 作用：检索文档后，系统评估其相关性，如有必要会优化查询并重新搜索，直到结果满意为止。
策略 8：知识图（Knowledge Graphs）
- 作用：将向量搜索与图数据库结合，捕捉实体之间的关系。
策略 9：分层 RAG（Hierarchical RAG）
- 作用：建立父子块关系，小块检索精确，大块提供上下文。
策略 10：后期分块（Late Chunking）
- 作用：在将文档分块之前，将整篇文档通过 Transformer 模型处理，生成 token 级别嵌入再分块。
策略 11：微调嵌入（Fine-tuned Embeddings）
- 作用：对嵌入模型进行领域特定的 query-document 对训练。

强力组合：策略组合实现 94% 准确率

组合 1：生产就绪堆栈（综合表现最佳）
策略：
• 语义感知分块（Context-Aware Chunking）
• 重排序（Re-ranking）
• 查询扩展（Query Expansion）
• 自主代理 RAG（Agentic RAG）
为什么有效：每种策略解决不同失败模式：
• 语义感知分块保证块内容连贯
• 查询扩展解决模糊查询
• 重排序修正向量搜索错误
• 自主代理方法适应查询复杂度

组合 2：高精度堆栈（Critical 应用最佳）
策略：
• 上下文检索（Contextual Retrieval）
• 多查询（Multi-Query）
• 重排序（Re-ranking）
• 自我反思 RAG（Self-Reflective RAG）
为什么有效：最大冗余 + 自我纠正
• 上下文检索保证每个块自包含
• 多查询捕捉所有角度
• 重排序过滤噪声
• 自我反思检测并修正错误

组合 3：领域专家堆栈（专业领域最佳）
策略：• 微调嵌入（Fine-tuned Embeddings）
• 上下文检索（Contextual Retrieval）
• 知识图谱（Knowledge Graphs）
• 重排序（Re-ranking）
为什么有效：每一层都注入深度领域知识
• 微调嵌入理解专业术语
• 上下文检索增加领域背景
• 知识图谱捕捉领域关系
• 重排序应用领域感知相关性


实施路线图：先简单，后扩展
阶段 1：基础（第 1 周）
• 上下文感知切分（Context-aware chunking）：替代固定长度拆分
• 基础向量搜索：使用合适的嵌入模型
• 测量基线准确率阶段 
2：快速提升（第 2–3 周）
• 加入重排序（Re-ranking）：提升准确率最大
• 实现查询扩展（Query expansion）：处理模糊查询
• 测量改进效果阶段 
3：高级策略（第 4–6 周）
• 多查询（Multi-query）或智能代理 RAG（Agentic RAG）：根据用例选择
• 自我反思（Self-reflection）：用于关键查询
• 微调与优化阶段 
4：专业化（第 2 月及以后）
• 上下文检索（Contextual retrieval）：针对高价值文档
• 知识图谱（Knowledge Graph）：在实体关系重要时使用
• 领域微调嵌入：提升专业领域准确率