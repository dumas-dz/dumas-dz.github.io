---
title: LlamaIndex - 查询数据 - 后处理与响应合成
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 响应合成
---

---

本章介绍节点后处理器（过滤型、转换型、Re-ranker 重排型）和响应合成策略（refine、compact、tree_summarize 等），完善查询流水线的最后两环。

## 技术要求

本章需要在环境中安装以下包：

- spaCy：[spacy.io/](https://spacy.io/)
- Guardrails-AI：[www.guardrailsai.com/](https://www.guardrailsai.com/)
- LangChain Classic：[pypi.org/project/lan…](https://pypi.org/project/langchain-classic/)

## 使用 postprocessors 对节点进行重新排序、转换和过滤

检索到的节点并不总是足够好。还需要对节点进行后处理和响应合成，才能生成高质量的最终答案。

正如我们已经讨论过的，naive retrieval methods 不太可能在任何场景下都产生理想结果。很可能会出现许多情况：返回的节点也许包含无关信息，或者并没有按照时间顺序排序。这类情况可能会让 LLM 变得难以处理，从而负面影响我们的 RAG 应用所构建 prompt 的质量。

如果这还不够明显，那么请记住：RAG 流程的主要目的，是**以编程方式构建 prompts**。我们不是手动构建这些 prompts，然后将它们输入到类似 ChatGPT 的界面中；LlamaIndex 会从我们的文档中动态组装 prompts，这些文档会被拆分成节点，然后被索引，并通过 retrievers 选择出来。在这个过程中，很多事情都可能出错。也许我们没有完整或正确地摄取原始文档；也许我们没有选择合适的 `chunk_size` 值，最终得到的节点要么过于细碎，要么包含太多无关信息。也许我们没有正确索引它们，或者我们使用的 retriever 没有按照正确顺序选择节点，或者带入的信息比我们想要的更多。

整个过程中有很多地方都可能引入错误。这听起来不太令人鼓舞，对吧？

节点后处理器在优化检索过程中获得的结果方面非常关键。原因在于，无论检索步骤做得多好，额外的、不必要的检索数据总有可能污染上下文，并让 LLM 感到困惑。有时，即使检索到的节点是相关的，它们也未必按正确顺序排列，这同样会影响 LLM 响应质量。

**图 7.1 —— 节点后处理器在 RAG 中的角色**

让我们先理解节点后处理器的不同目的和运行模式。

### 不确定节点后处理器如何改善 RAG 流水线？

从核心上看，所有节点后处理器都会在上下文被注入 prompt，并发送给 LLM 进行响应合成之前，对检索到的上下文进行调整。它们通过过滤、转换、重新排序或向节点添加额外上下文来工作。在接下来的几节中，我们将查看这些运行模式，以更好地理解它们的使用场景。我们会先从过滤检索结果的处理器开始。

## 节点过滤型 postprocessors

### `SimilarityPostprocessor`

`SimilarityPostprocessor` 会通过将节点与相似度分数阈值进行比较来过滤节点。低于该阈值的节点会被移除，确保只保留与查询相关且相似的内容。这一点特别有用，因为它可以确保传给语言模型用于响应生成的节点，和查询之间具有较高程度的语义相关性。

### 一个潜在使用场景

一家电商公司拥有一个由 LLM 驱动的客户支持 chatbot。假设 chatbot 从 `KeywordTableIndex` 中检索节点，并尝试基于用户查询中包含的关键词识别所有上下文。对于类似 `How do I return a damaged item I received yesterday?` 的查询，检索到的节点可能包括一般退货政策、客户订购物品的产品描述、物流信息，甚至无关的产品广告或促销信息。`SimilarityPostprocessor` 可以过滤掉那些与查询具体上下文并不紧密相关的节点。在这种情况下，它会优先保留专门讨论损坏商品退货政策以及客户近期订单的节点，同时丢弃一般产品广告和无关物流细节。这会大大提高 LLM 生成更有意义响应的概率。

这个 postprocessor 接收一组节点作为输入，这些节点通常由 retriever 获取，并且每个节点都带有关联相似度分数。postprocessor 可以通过 `similarity_cutoff` 参数配置。这个阈值决定一个节点必须达到的最低分数，才会被视为相关。如果某个节点的 similarity score 是 `None`，或者低于 `similarity_cutoff`，该节点就会被认为不满足阈值要求，因此会从最终列表中排除。本质上，这个 postprocessor 会过滤掉任何相似度分数低于设定阈值的节点。这确保只有与查询紧密相关的节点会被保留下来。达到或超过相似度阈值的节点随后会被传递到进一步处理或响应合成阶段。下面是一个在实践中使用它的简单示例：

```ini
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

reader = SimpleDirectoryReader('files/other')
documents = reader.load_data()

index = VectorStoreIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='default')

nodes = retriever.retrieve(
    "What did Fluffy find in the gentle stream?"
)
```

在这段代码的第一部分中，我们处理了 imports，然后将一个示例文件摄取成文档。接着，我们创建了一个 `VectorStoreIndex` 索引，并使用默认 retriever 基于查询获取相关节点。接下来，我们打印 retriever 获取到的原始节点列表：

```python
print('Initial nodes:')
for node in nodes:
    print(f"Node: {node.node_id} – Score: {node.score}")
```

```scss
pp = SimilarityPostprocessor(similarity_cutoff=0.86)
remaining_nodes = pp.postprocess_nodes(nodes)

print('Remaining nodes:')
for node in remaining_nodes:
    print(f"Node: {node.node_id} – Score: {node.score}")
```

```yaml
Initial nodes:
Node: 95f15459-dac6-4cf8-86a3-ecc55a54dbfd - Score: 0.8766996524499907
Node: 53f1a03c-9656-4638-b268-fedfc0d821aa - Score: 0.8519027704761369

Remaining nodes:
Node: 95f15459-dac6-4cf8-86a3-ecc55a54dbfd - Score: 0.8766996524499907
```

正如我们所看到的，初始列表中的第二个节点被移除了，因为它的分数低于我们定义的 `0.86` 阈值。

### `KeywordNodePostprocessor`

`KeywordNodePostprocessor` 被设计用于基于特定关键词优化节点选择。这个 postprocessor 的工作方式是确保检索到的节点包含某些必需关键词，或者排除特定不需要的关键词。它是一种非常好的方法，可以通过聚焦关键词相关性，让节点内容更贴近用户查询。

### RAG 场景中的实际使用场景

想象一个企业环境，RAG 系统用于从庞大的内部数据库中检索信息，以回答员工查询。不过，某些机密文件或文件章节不应该对所有员工开放。通过为 `KeywordNodePostprocessor` 配置表示敏感内容的关键词，例如 `confidential`、`restricted`，或者某些特定项目代号，系统可以自动从检索结果中排除包含这些关键词的节点。这样的设置可以确保敏感信息不会被无意披露，从而维护企业数据的完整性和机密性。

它接收一组节点作为输入，这些节点通常由 retriever 获取，并通过必需关键词和排除关键词参数进行配置。`KeywordNodePostprocessor` 随后会处理这些节点，只保留满足关键词条件的节点。这确保最终节点集合高度相关于具体查询，从而在 RAG 系统中带来更准确、更有用的响应。

这个 postprocessor 依赖 spaCy 库：[pypi.org/project/spa…](https://pypi.org/project/spacy/%E3%80%82%E5%9C%A8%E8%BF%90%E8%A1%8C%E4%B8%8B%E4%B8%80%E4%B8%AA%E7%A4%BA%E4%BE%8B%E5%89%8D%EF%BC%8C%E4%BD%A0%E5%BF%85%E9%A1%BB%E5%85%88%E5%9C%A8%E7%B3%BB%E7%BB%9F%E4%B8%AD%E5%AE%89%E8%A3%85%E5%AE%83%E3%80%82%E8%BF%99%E6%98%AF%E4%B8%80%E4%B8%AA%E5%BC%BA%E5%A4%A7%E7%9A%84) Python 库，用于高级 NLP。它的功能包括用于各种 NLP 任务的神经网络模型，例如标注、解析和 NER。它是一款采用 MIT 许可证的商业开源软件。

要使用 `KeywordNodePostprocessor`，请确保通过以下命令在环境中安装 spaCy：

```code
pip install spacy
```

下面是一个基础示例，展示如何使用这个 postprocessor 基于分类标签过滤掉一些日志条目：

```arduino
from llama_index.core.postprocessor import KeywordNodePostprocessor
from llama_index.core.schema import TextNode, NodeWithScore

nodes = [
    TextNode(
        text="Entry no: 1, <SECRET>, Attack at Dawn"
    ),
    TextNode(
        text="Entry no: 2, <RESTRICTED>, Go to point Bravo"
    ),
    TextNode(
        text="Entry no: 3, <PUBLIC>, text: Roses are Red"
    ),
]
```

在这个示例中，我们手动定义节点，而不是从外部文件摄取数据。定义节点之后，我们必须将它们包装成 `NodeWithScore`，因为这是 postprocessor 期望的输入。

由于 LlamaIndex postprocessors 作用于 retriever 的标准输出，也就是 `NodeWithScore` 对象列表，因此我们包装原始 `TextNode`，让 API 匹配，并且使它们的初始相似度分数可以被下游过滤器或 re-ranker 保留，即使这个特定 filter 并不使用 score。

下面是剩余代码：

```ini
node_with_score_list = [
    NodeWithScore(node=node) for node in nodes
]

pp = KeywordNodePostprocessor(
    exclude_keywords=["SECRET", "RESTRICTED"]
)

remaining_nodes = pp.postprocess_nodes(
    node_with_score_list
)

print('Remaining nodes:')
for node_with_score in remaining_nodes:
    node = node_with_score.node
    print(f"Text: {node.text}")
```

在这个示例中，`KeywordNodePostprocessor` 会过滤 retriever 获取的节点，排除包含 `SECRET` 和 `RESTRICTED` 的节点。

这个 postprocessor 有几个可以定制的参数。最重要的如下：

**required_keywords**：这是一个字符串列表，其中每个字符串代表节点必须包含的关键词，只有包含它们的节点才会进入最终输出。如果这个列表非空，postprocessor 会过滤掉任何不包含这些关键词的节点。

**exclude_keywords**：类似于 `required_keywords`，这也是一个字符串列表。不过，在这种情况下，任何包含该列表中关键词的节点都会被排除在最终输出之外。它用于基于不需要的内容过滤节点。

**lang**：这个参数指定内部 spaCy NLP 库使用的语言模型。默认值是英文 `en`，但可以设置为 spaCy 支持的其他语言代码。关键词匹配的效果和准确性可能取决于文本的语言特定处理。例如，spaCy 对词语的 tokenization 方式可能会影响关键词如何被识别。

### `PIINodePostprocessor` 和 `NERPIINodePostprocessor`

`PIINodePostprocessor` 接收以下参数：

**llm**：这个对象应该包含用于处理的本地模型。

**pii_str_tmpl**：可以用于定制掩盖个人数据时使用的默认 prompt template。

**pii_node_info_key**：这个字符串作为节点元数据中的 key，用来存储与 PII 处理相关的信息。它用于追踪和引用每个节点中被处理过的 PII 数据。如果需要，之后可以用它重新组合出原始信息。

`NERPIINodePostprocessor` 可以通过 `pii_node_info_key` 参数配置。类似于 `PIINodePostprocessor`，这个字符串 key 用于在节点元数据中存储与 PII 处理相关的信息。它是节点元数据中用于追踪已处理 PII 数据的唯一标识符。

下一节中，我们将覆盖另一类 postprocessors。

## 节点转换型 postprocessors

### `MetadataReplacementPostprocessor`

`MetadataReplacementPostProcessor` 被设计用于用节点元数据中的某个特定字段替换节点内容。这允许我们基于元数据，而不是原始摄取内容，动态切换用来表示节点的文本。

### 这个 postprocessor 的一个有用应用

想象一个工作流，其中通过 `SentenceWindowNodeParser` 摄取文件。这个解析器会将文本拆分成句子级节点，并在元数据中捕获周围文本。通过配置 processor，将节点内容替换为包含 sentence window 的元数据字段，查询就会检索完整句子上下文，而不是句子碎片。这让 retriever 可以基于句子运行以获得更高准确性，同时仍然向 LLM 暴露更广泛的文档上下文。这项技术在处理大型文档时非常有用。你可以在这里找到完整示例：

这个 postprocessor 接收一组节点作为输入，并通过 `target_metadata_key` 参数配置，指定使用哪个元数据字段进行替换。`MetadataReplacementPostProcessor` 处理节点时，会将每个节点的 `text` 属性替换为给定元数据 key 中的内容。如果 key 缺失，则保留原始文本。这提供了动态转换节点内容的灵活性。

下面是另一个简单示例，可以帮助你理解这个 postprocessor 的功能：

```arduino
from llama_index.core.postprocessor import MetadataReplacementPostProcessor
from llama_index.core.schema import TextNode, NodeWithScore

nodes = [
    TextNode(
        text="Article 1",
        metadata={"summary": "Summary of article 1"}
    ),
    TextNode(
        text="Article 2",
        metadata={"summary": "Summary of article 2"}
    ),
]
```

首先，我们定义了两个示例节点，接下来会将 postprocessor 应用于它们。我们会指示它将每个节点的内容替换为 `summary` 元数据字段中存储的值：

```ini
node_with_score_list = [
    NodeWithScore(node=node) for node in nodes
]

pp = MetadataReplacementPostProcessor(
    target_metadata_key="summary"
)

processed_nodes = pp.postprocess_nodes(
    node_with_score_list
)

for node_with_score in processed_nodes:
    print(f"Replaced Text: {node_with_score.node.text}")
```

处理完成后，输出应如下：

```less
Replaced Text: Summary of article 1
Replaced Text: Summary of article 2
```

让我们继续探索 LlamaIndex 提供的其他后处理选项。

### `SentenceEmbeddingOptimizer`

`SentenceEmbeddingOptimizer` 被构建用于根据查询，基于语义相似度选择最相关句子，从而优化较长文本段落。它使用高级 NLP 技术为句子相关性打分，并丢弃不太有用的句子。

### 为什么以及在哪里使用它？

在摄取长文档的工作流中，检索完整段落可能会超出模型上下文大小限制。`SentenceEmbeddingOptimizer` 允许我们只向 LLM 发送最重要的句子，同时保留足够上下文。这会减少无关文本造成的 token 浪费，从而降低噪音内容。移除内容中无关部分，也会改善响应时间，并能显著降低最终 LLM 调用相关成本。

这个 postprocessor 接收一组节点作为输入，并使用 embeddings 分析每个句子与搜索查询之间的语义相似度。与查询向量最接近的句子会被保留，而距离较远、无关的句子会被剥离。

实践中可以这样使用它：

```ini
from llama_index.core.postprocessor import SentenceEmbeddingOptimizer

optimizer = SentenceEmbeddingOptimizer(
    percentile_cutoff=0.8,
    threshold_cutoff=0.7
)

query_engine = index.as_query_engine(
    optimizer=optimizer
)

response = query_engine.query("<your_query_here>")
```

在这个示例中，`SentenceEmbeddingOptimizer` 使用 `percentile_cutoff` 值 `0.8` 和 `threshold_cutoff` 值 `0.7` 来选择句子。这意味着它的目标是保留相似度分数排名前 80% 的句子，并进一步过滤，只保留相似度分数高于 `0.7` 的句子。主要可定制参数如下：

**percentile_cutoff**：保留相似度阈值以上 top 句子的百分比。例如，这允许我们将节点压缩到最相关的 75% 句子。

**threshold_cutoff**：绝对相似度分数阈值，只有相似度高于该值的句子会被保留。这对更严格过滤很有用。

**context_before 和 context_after**：允许我们保留匹配句子前后若干句，以获得更多上下文。

就像 `KeywordNodePostprocessor` 一样，`SentenceEmbeddingOptimizer` 会从节点中移除不太相关的句子。不过，在这种情况下，它是使用 vector search 而不是关键词来做到这一点。

这个 postprocessor 更侧重于 refine 和缩短每个节点内部的内容，使其更好地与查询对齐。这允许在考虑 LLM 限制的同时，为查询定制最优信息密度。

相比之下，`KeywordNodePostprocessor` 和 `SimilarityPostprocessor` 这类处理器是在节点级别运行，分别基于关键词或相似度分数保留或移除整个节点。

### `LongLLMLinguaPostprocessor`

这个非常有用的 postprocessor 被设计用于通过压缩节点文本，针对查询优化节点内容。它基于 Jiang 等人 2023 年论文中描述的方法：*LongLLMLingua: Accelerating and Enhancing LLMs in Long Context Scenarios via Prompt Compression*，[arxiv.org/abs/2310.06…](https://arxiv.org/abs/2310.06839)。该方法将原始 LLMLingua prompt compression 框架扩展到长上下文场景。

`LongLLMLinguaPostprocessor` 解决了与 LLM 相关的几个问题，例如 API 延迟增加、上下文窗口限制超出，以及昂贵的 API 成本。

核心思想是以智能方式压缩 prompts，使其聚焦最相关信息，从而支持 LLM 更高效、更准确地处理。它在性能和效率之间取得平衡，展示了 prompt compression，最高可达到 20 倍压缩，在几乎不损失性能的情况下，可以显著提升模型推理和成本效率。

该 processor 被设计为与本地、经过良好训练的语言模型一起工作。这种设置支持在本地高效压缩 prompts，以供 LLM 使用，而无需依赖外部 API 调用。

[github.com/microsoft/L…](https://github.com/microsoft/LLMLingua/blob/main/examples/RAGLlamaIndex.ipynb)

## 节点重新排序型 postprocessors

节点重新排序型 postprocessors 并不会专门移除或改变检索到的节点。re-ranker 的目的是接收 retriever 返回的初始节点集合，并根据它们与给定查询的相关性重新排序。这在处理长查询或复杂信息需求时尤其重要，因为许多 LLM 在面对冗长或多面向上下文时，难以有效处理并生成准确响应。通过使用 re-ranker，RAG 系统可以优先排列最相关的信息，并以更连贯的格式呈现给 LLM，从而带来更好的响应。Re-rankers 通常会利用深度学习、transformers 或 LLM 本身等高级技术，来评估每段检索内容的相关性。它们可能会考虑语义相似度、上下文重叠或 query-document alignment 等因素，为检索到的节点分配 relevance scores。

它们都接受一个 `top_n` 参数，用来指定应该返回多少个重新排序后的节点。排名最高的节点随后会被输入到 LLM 中，后者基于这个优化后的上下文生成最终响应，从而增强 RAG 系统的整体性能和实用性。其中一些 postprocessors，例如 `SentenceTransformerRerank`，还会更新节点的 relevance scores，以反映它们与查询的相似度。

### `LLMRerank`

这个 processor 会通过请求 LLM 分配 relevance scores 来重新排序节点。它会根据用户查询，从给定集合中选择 `top_n` 个最相关节点。这个 postprocessor 使用的 prompt 可以通过 `choice_select_prompt` 参数定制。

为了提高效率，它会分批运行。批次大小也可以通过 `choice_batch_size` 参数定制。处理时它需要一个 `query_bundle` 参数，并使用 `llm` 中配置的模型。它的重新排序过程包括：将节点内容格式化成 prompts，使用 LLM 评估相关性，然后根据计算出的 relevance scores 对节点重新排序。

### `StructuredLLMRerank`

`StructuredLLMRerank` 是一种基于 LLM 的 re-ranker，它要求模型返回一个结构化的已选节点列表，并附带数值 relevance scores，而不是自由文本。这提升了稳健性，因为减少了 prompt parsing，并且提供显式 score 用于排序。

就像 `LLMRerank` 一样，它通过以下方式工作：通过内部 batch formatter 格式化节点批次，使用结构化 prompt 调用 LLM，默认是 `STRUCTURED_CHOICE_SELECT_PROMPT`，并使用模型的结构化预测，即由 `DocumentWithRelevance` items 组成的 `DocumentRelevanceList` 来重新排序节点。然后，它会跨批次聚合结果，按返回的 relevance scores 排序，并返回 `top_n` 节点。

想象你正在为一家银行构建合规助手。用户可能会问：`Which of these internal memos mention new anti-money laundering obligations, and how relevant are they?` 基础 retriever 会拉取 15–20 个看起来稍微相关的节点。普通 re-ranker，例如 `LLMRerank`，可以对它们排序，但通常只返回重新排序后的列表，并不会明确说明为什么某个节点比另一个更相关。`StructuredLLMRerank` 则不同，它会提示 LLM 返回一个结构化节点列表，并为每个节点给出 `1–10` 的 relevance score。

这带来两个优势：

**透明性**：你可以在 UI 中将 score 与检索到的 memos 一起显示，让合规人员不仅看到哪些段落被选中，也看到它们被判断为相关的强度。

**更好的过滤**：你可以自动丢弃低相关性节点，例如 `<5`，而不是让 LLM 把上下文窗口浪费在弱候选节点上。

相比之下，`LLMRerank` 会解析模型的自由文本输出，以推断哪些节点最相关；而 `StructuredLLMRerank` 要求模型返回带有明确数值 relevance scores 的结构化对象，使重新排序更可靠、更透明。

### `CohereRerank`

这个 processor 使用 Cohere 的神经 re-ranking 模型：[cohere.com/rerank](https://cohere.com/rerank)，基于查询对节点按相关性排序。默认使用的模型是 `rerank-english-v3.0`。

由于模型默认值可能会随着 LlamaIndex 版本变化而变化，请始终查看当前源代码或文档，以获取最新默认值。

Cohere 模型判断为最相关的 `top_n` 节点会被选出并返回。

这个 processor 允许我们利用 Cohere 提供的强大相关性算法，但需要 Cohere API key，并且需要在本地环境中安装它们的库。

### `SentenceTransformerRerank`

`SentenceTransformerRerank` 使用 sentence transformer models，基于节点与给定查询的相关性重新排序节点。

这个过程涉及使用 sentence transformer model 为节点打分，默认模型是 `cross-encoder/stsb-distilroberta-base`，然后基于这些分数重新排序节点。它会返回排名最高的节点，最多返回指定的 `top_n` 数量。你可以在这里找到更多信息：

[www.sbert.net/examples/se…](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)

### `RankGPTRerank`

这个重新排序 postprocessor 被设计用于使用 LLM 提高检索结果相关性。它包含一个过程，其中用户查询和节点内容会被格式化为 prompts，引导语言模型根据相关性对这些节点排序。

模型输出随后用于重新排列节点，确保最相关的节点出现在顶部。当检索到的上下文过大，无法放进 LLM 的上下文窗口时，`RankGPTRerank` 会使用 sliding window 方法，逐步对一段段节点进行重新排序。

### `RankGPTRerank` 与 `LLMRerank` 的区别

你可以把 `LLMRerank` 看成更偏向 filter and score 的方法。它将检索到的节点分成小批次，询问 LLM 哪些看起来最相关，给它们打分，然后简单排序以保留 top 结果。它效果不错，但请注意，模型并没有真正一次看到整个集合；它只是逐块判断。`RankGPTRerank` 则像一个会查看完整候选阵容的裁判。它要求 LLM 生成候选节点的完整排序，也就是一个 permutation。如果节点太多，无法放进模型上下文窗口，`RankGPTRerank` 会用 sliding-window 策略处理，并拼接成一个全局顺序。好处是模型可以发现段落之间的冗余、细微差别或交叉引用，这些东西可能会被纯 point-wise 方法忽略。在实践中，这意味着当你只是想要快速且相当准确的 shortlist 时，`LLMRerank` 很适合。但当查询复杂、候选池很大，或者你非常关心细微差别和多样性时，`RankGPTRerank` 是更重但更聪明的选项。

这个方法基于 Sun 等人 2023 年论文：*Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Agents*，[arxiv.org/abs/2304.09…](https://arxiv.org/abs/2304.09542v2%E3%80%82)

### `LongContextReorder`

`LongContextReorder` 专门被设计用于改善 LLM 在处理长上下文场景时的表现，具体来说，是为了补偿所谓的 lost-in-the-middle effect。研究表明，在扩展上下文中，重要细节如果位于输入上下文的开头或结尾，会被更好地利用。参考 Liu 等人的论文：*Lost in the Middle: How Language Models Use Long Contexts*（2023），[arxiv.org/abs/2307.03…`LongContextReorder`](https://arxiv.org/abs/2307.03172%E3%80%82%60LongContextReorder%60) postprocessor 通过重新排序节点，将关键信息放到模型更容易访问的位置，从而解决这个问题。

### 一个实际场景

在 RAG 系统中，尤其是在学术或研究导向的查询中，长而详细的文档非常常见，`LongContextReorder` 可能非常有用。例如，如果用户查询详细历史事件，系统可能会检索到包含大量细节的长节点。`LongContextReorder` 会重新排列这些节点，确保最相关细节位于开头或结尾，从而增强模型有效提取并利用这些关键信息的能力。这会产生更连贯、上下文更丰富的响应，并显著改善涉及长上下文场景时的整体输出质量。

`LongContextReorder` 接收一组节点，通常由 retriever 获取，并基于节点 relevance scores 对它们重新排序。目标是优化信息排列方式，使语言模型访问和处理重要细节的能力最大化，尤其是在上下文长度可能影响性能的情况下。

这个 postprocessor 与 `SentenceEmbeddingOptimizer` 或 `LongLLMLinguaPostprocessor` 等压缩 / 清理步骤配合得很好。作为最佳实践，应在过滤 / 压缩之后使用 reorder，这样只有高价值节点会被排列。

这个 postprocessor 特别适合需要详细且全面响应的场景，确保最相关信息以模型最容易访问的方式呈现。请在以下情况下考虑使用它：

- 你正在检索许多节点，例如 `top_k > 8–10`，并且注意到随着上下文增长，答案质量下降。
- 你无法进一步缩小上下文，或者除了缩小之外，仍然希望将注意力偏向最相关信息。

## 基于时间的 postprocessors

基于时间的 postprocessors 属于重新排序处理器中的一个特殊子类别。它们被设计用于优先考虑新近性，并为用户提供最新、最及时的信息。它们通过各种技术实现这一目标，例如按日期元数据排序节点、基于 embedding similarity 过滤，或应用时间衰减评分模型。

让我们概览这些处理器。

### `FixedRecencyPostprocessor`

这个简单 postprocessor 会通过基于日期元数据对节点排序，并返回按日期排序的 `top_k` 节点，从而展示基于最新数据的结果。这确保我们获得最新数据，这对于环境监控这类实时应用至关重要，因为在这类应用中，当前信息非常关键。例如，当查询最近空气质量指标时，该 postprocessor 确保只提供最新读数。它将结果聚焦在最新信息上。

这个 processor 有两个可配置参数：

**top_k**：要返回的最新 top 节点数量。

**date_key**：用于识别每个节点中日期的元数据 key，默认是 `date`。

### `EmbeddingRecencyPostprocessor`

`EmbeddingRecencyPostprocessor` 会使用指定的 `date_key` 元数据字段按日期排序节点。然后，它会通过将节点内容插入 `query_embedding_tmpl` 模板，为每个节点生成 query embedding。这个 query embedding 会用于寻找相似文档。

### 它可能在哪里有用？

例如，我们可以想象一个新闻聚合服务。当用户查询某个近期事件时，系统会检索一组按日期排序的节点，在这个场景中就是新闻文章。不过，许多文章可能都报道同一个事件，导致信息冗余。`EmbeddingRecencyPostprocessor` 会检查这些文章，并过滤掉那些在内容上与更近期文章过于相似的文章。这可以避免我们向用户展示多篇关于同一事件的冗余文章，方法是删除那些内容与更近期报道明显重叠的文章。

它的可配置参数如下：

**similarity_cutoff**：embedding similarity 阈值，高于该值的节点会被视为过于相似并被过滤掉。

**date_key**：指定用于按日期排序节点的元数据 key。无论你传入哪个元数据字段作为 `date_key`，默认是 `date`，它都应该保存通用解析器能够理解的日期字符串，例如符合 ISO-8601 的格式：

```yaml
2025-08-31
2025-08-31T14:22:00Z
2025-08-31T14:22:00+02:00
```

如果某个节点缺少日期或日期不可解析，它可能会被丢弃，或根据 processor 被视为非常旧。因此，请确保在摄取期间填充日期。

**query_embedding_tmpl**：用于为每个节点生成 query embeddings 的模板。

### `TimeWeightedPostprocessor`

`TimeWeightedPostprocessor` 会通过基于时间衰减函数重新排序节点，考虑节点最近被访问的时间，从而优先考虑更新结果。这会偏向新鲜且较少重复的内容，对 trending news aggregation 这类使用场景非常关键，因为用户想要的是最新更新，而不是同样的信息。

评分会随时间动态适应访问模式变化。`TimeWeightedPostprocessor` 被设计为基于节点的新近性和历史访问记录重新排序节点，应用时间加权评分系统。这个 postprocessor 在需要避免重复呈现相同信息，并且内容新鲜度很重要的场景中特别有效。

processor 的工作方式是基于每个节点最后一次被访问的时间调整其 score，应用衰减因子来优先考虑最近较少被访问的内容。这种动态重新排序确保输出不仅相关，而且及时且多样。这非常适合那些保持用户获取最新信息至关重要的应用。

它也有几个可以调整的参数：

**time_decay**：时间加权评分的衰减因子。

**last_accessed_key**：用于追踪节点最后访问时间的元数据 key。

**time_access_refresh**：一个布尔值，用于决定是否应该更新最后访问时间。

**now**：一个可选参数，用于设置当前时间。它很有用，因为它允许你覆盖当前时间，使所有 recency / decay 计算都锚定在特定时间点，从而产生确定性、可复现的排序结果。

**top_k**：重新排序后返回的 top 节点数量。默认值是 `1`。

借助这些高级时间感知 postprocessors，我们的 RAG 流水线会转变成一个动态信息策展器，擅长处理数据的时间维度。它们确保系统不只是检索信息，而是智能选择不仅新近、而且多样且相关的内容。

这让它们在及时且多样的信息至关重要的场景中不可或缺，为我们提供持续新鲜且丰富的体验。

你还应该知道，除了核心集合之外，LlamaIndex 还提供了一个基于集成的 re-rankers 生态，当你需要供应商模型或更复杂依赖时，可以启用这些集成。

## 不包含在 LlamaIndex core 中的额外 re-rankers

除了 core 中包含的主要 re-rankers 之外，还有一整套位于 core 之外的 re-rankers。这不是疏漏，而是有意设计。core package 保持轻量，并专注于核心功能；而任何依赖重型外部库，例如 PyTorch、供应商 SDK 或第三方服务的内容，都会作为单独的集成包发布。这样，你只需要安装真正需要的东西，集成也可以按自己的节奏演进，而不会给核心库增加额外重量。

几个不错的例子如下：

**ColBERTRerank**：一种 token-interaction re-ranker，可以提供非常细粒度的 relevance scoring。因为它依赖深度学习库，所以作为自己的 add-on package 提供。

**TEIRerank**：构建在 Hugging Face 的 Text Embeddings Inference（TEI）服务之上：[huggingface.co/docs/text-e…](https://huggingface.co/docs/text-embeddings-inference/en/index)。由于这个 re-ranker 依赖部署或连接 TEI，因此它也位于核心库之外。

还有很多类似的例子：DashScope、Flag Embedding、FlashRank 等。跟踪它们最简单的方式，是查看官方 API reference，它会在一个地方列出核心 postprocessors 和 integrations：

经验法则是：如果你看到某个 postprocessor 位于 `llama_index.core.postprocessor` 下，它就可以开箱即用。如果它显示为 `llama_index.postprocessor.<name>`，它就是一个集成，因此你需要先安装对应 package。

## 衡量基于 LLM 的 re-ranking 效果

一个常见担忧，尤其是在使用基于 LLM 的 re-rankers 时，是它们输出质量如何。由于 LLM 在海量数据上训练，有时会生成有偏、不一致，甚至事实错误的结果。在处理专业领域或敏感信息时，这尤其成问题。为了验证基于 LLM 的 postprocessors 是否足够好地对节点重新排序，正确评估其性能非常重要。下面是几种可以用来衡量 re-ranking 步骤质量的方法：

**人工相关性评估**：手动检查重新排序后的结果，确认最相关节点是否确实出现在顶部。这种定性评估依赖人工判断，来确定 re-ranking 是否符合查询意图。虽然它不算非常科学，但对于简单使用场景、实验或非生产 RAG 应用，这种简单方法可能已经足够。

**benchmark datasets**：在标准信息检索（IR）benchmark 上评估 re-ranking 性能，这些 benchmark 具有预定义查询和相关性判断。这个过程可能耗时，并且需要准备良好的评估数据集，但可以在 RAG 工作流后续阶段帮你避免麻烦。通过将重新排序结果与 ground truth 比较，你可以计算 precision、recall 等指标来量化 re-ranking 质量。

**用户反馈**：在真实世界应用中，收集用户对重新排序搜索结果的反馈。用户满意度分数、点击率或其他参与度指标，都可以表明 re-ranking 是否增强了用户体验并提供了更相关结果。这种方法有一个内在优势。因为它依赖直接在真实环境中收集的人类反馈，所以它成为一种持续评估形式。这使它有助于检测任何潜在 model drift，我们会在下一节解释，从而能够及时调整流水线，避免质量随时间下降。

**A/B 测试**：另一种收集用户反馈的方式，是运行受控实验，其中一部分用户看到原始排序，另一部分用户看到基于 LLM 重新排序的结果。比较两组之间的性能指标，以评估 re-ranking 是否带来更好结果。

**领域专家评估**：对于专业领域，可以请主题专家审查重新排序结果，并就其相关性和质量提供反馈。虽然这种方法比其他选项更昂贵且更困难，但在处理高度技术化或小众主题时，它可能是最佳解决方案，因为这些主题需要对相关领域有深入理解。

你选择的评估方法取决于具体使用场景、可用资源，以及你需要的严谨程度。混合使用定性和定量方法，可以帮助你全面评估 LLM 的 re-ranking 性能。

## 理解 model drift 现象

**Data drift**：当输入数据的统计属性或分布随时间变化时发生。例如，如果一个模型基于某个特定时期的客户评论数据集训练，那么在面对包含不同语言模式、情绪或主题的新评论时，表现可能不如以前。

**Concept drift**：当输入特征与目标变量之间的关系发生演变时发生。在一个设计用于辅助医疗查询的 RAG 系统中，新疾病、新治疗方法或新医学术语的出现，可能导致 concept drift。模型对领域的理解变得过时，性能可能下降。

**Upstream data changes**：当用于训练模型的数据与生产环境中使用的数据不同时，就会发生这种 drift。例如，如果一个 RAG 系统基于经过策划的数据集训练，但随后应用到生产中的原始、未处理数据上，模型性能可能会因数据质量、格式或分布差异而受损。

**Feedback loops**：在某些情况下，模型输出可能会影响未来输入，从而形成反馈循环。例如，如果 RAG 系统用于向用户推荐文章，而这些推荐随后又被用于更新检索组件，模型可能会偏向自身之前的输出，导致其提供的信息范围随时间变窄。

**Domain shift**：当模型被应用到不同于其原始训练领域或上下文的场景中时发生。在 RAG 工作流中，如果检索组件基于某一领域的数据训练，例如法律文档，但随后用于回答另一领域的问题，例如医学问题，模型性能可能会因语言、术语或底层概念差异而受损。

**Temporal drift**：这种 drift 与时间流逝有关，可以包含 data drift 和 concept drift。随着时间推移，与特定任务相关的数据和概念可能会演变，如果不加以处理，就会导致模型性能逐渐下降。

为了缓解这些不同类型的 model drift，持续监控 RAG 系统性能、定期用新数据更新检索组件，并使其适应底层数据分布、概念或领域变化非常重要。此外，谨慎实现反馈循环，并确保训练数据能代表生产环境，也有助于最小化 upstream data changes 和 feedback-related drift 的影响。这有助于确保我们的 RAG 系统保持准确、最新，并与用户不断变化的需求保持一致。

## 上下文增强型 postprocessors

这类 processors 会向检索结果中添加有用的相邻节点或相关节点，而不改变或重新排序原始节点。因此，它们试图恢复局部连续性，例如前后节点，或引入紧密相关的上下文，以改善整体答案。示例包括 `PrevNextNodePostprocessor` 和 `AutoPrevNextNodePostprocessor`。当节点是使用过低 `chunk_size` 创建的，并且重要细节可能跨越节点边界时，这些 postprocessors 特别有用。让我们看看它们如何运行。

### `PrevNextNodePostprocessor` 和 `AutoPrevNextNodePostprocessor`

`PrevNextNodePostprocessor` 当前是 beta 功能，被设计用于基于文档中的关系上下文获取额外节点，从而增强节点检索。这个 postprocessor 可以在三种模式下运行：`previous`、`next` 或 `both`，允许用户检索相对于当前节点集合而言位于前面、后面，或前后两侧的节点。

### 一个潜在使用场景

考虑一个法律研究场景，用户向 RAG 系统查询某个具体法律案例。`PrevNextNodePostprocessor` 可以设置为 `both` 模式，不仅检索与该案例直接相关的节点，还检索前后节点，这些节点可能包含重要上下文信息，例如相关法律先例或后续裁决。这通过提供更广泛上下文，确保对案例有全面理解，而在法律研究中，每个细节都可能很关键。

这个过程从接收一组节点开始，这些节点通常由 retriever 获取。然后，`PrevNextNodePostprocessor` 会基于配置模式，从 docstore 中添加直接位于前面、后面或两侧的节点，扩展这个列表。这样会得到一个上下文更丰富的节点集合，从而在 RAG 系统中带来更细腻、更全面的响应。下面是这个 postprocessor 的参数列表：

**docstore**：实际存储节点的 document store。

**num_nodes**：设置要返回的节点数量。默认情况下，会在所选方向返回 1 个节点。

**mode**：可以设置为 `previous`、`next` 或 `both`。

此外，我们还有 `AutoPrevNextNodePostprocessor`，它是 `PrevNextNodePostprocessor` 的高级变体。这个 processor 会根据查询上下文，智能推断是否应该基于 `previous`、`next` 或 `neither` 关系获取额外节点。

相比需要手动选择模式的 `PrevNextNodePostprocessor`，`AutoPrevNextNodePostprocessor` 会自动执行这个过程。它利用特定 prompts，基于当前上下文和查询推断方向，也就是 previous、next 或 none。

当信息顺序及其上下文相关性对生成准确且有用的响应至关重要时，这种能力很有价值。

可以使用 `infer_prev_next_tmpl` 和 `refine_prev_next_tmpl` 参数定制 prompts。还有一个 `verbose` 参数，可以提供更多关于选择过程的可见性。

我们快到本节末尾了。到现在为止，你应该已经对 postprocessors 如何工作，以及它们能处理哪些使用场景有了不错理解。这里只剩最后一个细节要补充。

## 关于节点 postprocessors 的最后思考

如果现有 processors 并不完全适合我们的特定使用场景，我们可以选择构建自己的。自定义 postprocessors 可以通过扩展 `BaseNodePostprocessor` 来构建。

在更复杂场景中，postprocessors 也可以串联起来，在节点被传给 response synthesizer 之前，对其应用多个 transformations。

关键是应用正确 processors，以移除噪音、改善相关性信号、注入多样性，并处理敏感内容，从而生成更高质量、更可靠的响应。

## 理解 response synthesizers

在把辛苦处理好的上下文数据发送给 LLM 之前，最后一步是 response synthesizer。它是负责使用用户查询和检索上下文，从语言模型生成响应的组件。

它简化了查询 LLM 并基于专有数据合成答案的过程。和框架中的其他组件一样，response synthesizers 可以独立使用，也可以配置在 query engines 中，在节点被检索和后处理之后，负责响应生成的最后一步。

下面是一个简单示例，展示如何直接在给定节点集合上使用它：

```arduino
from llama_index.core.schema import TextNode, NodeWithScore
from llama_index.core import get_response_synthesizer

nodes = [
    NodeWithScore(
        node=TextNode(text="The town square clock was built in 1895")
    ),
    NodeWithScore(
        node=TextNode(text="A turquoise parrot lives in the Amazon")
    ),
    NodeWithScore(
        node=TextNode(text="A rare orchid blooms only at midnight")
    ),
]
```

这里，我们定义了一些任意节点。这将成为我们的专有上下文。接下来，我们会使用 response synthesizer 基于上下文运行 LLM 查询：

```ini
synth = get_response_synthesizer(
    response_mode="refine",
    streaming=False,
    structured_answer_filtering=False
)

response = synth.synthesize(
    "When was the clock built?",
    nodes=nodes
)

print(response)
```

输出如下：

```lua
The clock was built in 1895.
```

好奇幕后发生了什么吗？这里后台到底发生了什么？好，接下来几行请耐心看完——一旦你理解了这个示例，就会准确知道 response synthesizer 如何工作。先看一张图：

**图 7.2 —— refine response synthesizer**

下面是这个过程的描述：

synthesizer 首先会构建一个专用 prompt，从列表中的第一个节点开始作为上下文。这个 prompt 包含查询、具体指令和上下文，在本例中就是我们的第一个 Node。它使用默认值，但可以通过 `text_qa_template` 参数定制：

```sql
System: "You are an expert Q&A system that is trusted around the world. Always answer the query using the provided context information, and not prior knowledge. Some rules to follow: 1. Never directly reference the given context in your answer. 2. Avoid statements like 'Based on the context, .' or 'The context information .' or anything along those lines."

User: "Context information is below. The town square clock was built in 1895. Given the context information and not prior knowledge, answer the query. Query: When was the clock built? Answer: "
```

下一步是将这个 prompt 发送给 LLM，并等待答案。

初始答案返回后，它会为下一个节点构建 prompt，同时把第一个答案整合进 prompt 中，并使用一个可以通过 `refine_template` 定制的 prompt，对最终答案进行 refine。

然后，它会对所有节点重复这个迭代过程，不断 refine 最终答案。

当节点耗尽后，它返回经过 refine 的最终答案。

过程完成后，synthesizer 会返回一个 `Response` 对象。这个对象不仅包含最终答案文本，还包含合成过程中使用的 `source_nodes` 列表。每个 source node 都是一个 `NodeWithScore` 对象，这意味着它携带底层节点内容，以及来自检索或后处理阶段的关联 relevance score。这些 scores 让你可以定量了解每段上下文与查询的匹配强度，而文本答案展示了 LLM 如何合成这些上下文。答案、引用和 scores 结合起来提供了透明性和可追踪性——这是生产级 RAG 系统非常重要的两个品质。

在前面的示例中，synthesizer 的行为由 `response_mode` 决定，它被设置为 `refine`。不过，`refine` 模式只是 LlamaIndex 中几个预定义 synthesizers 之一。synthesizer mode 可以通过 `response_mode` 参数指定。下面是可用 response modes 列表：

**refine**：正如前面示例看到的，`refine` 会使用 `text_qa_template` 和 `refine_template` prompts 单独查询每个节点，以迭代构建详细响应。这个模式非常适合构建详细回答，确保每一条信息都被仔细考虑。我们也可以将 `verbose` 设置为 `True`，以获得更多关于这个 synthesizer 内部工作机制的可见性，并使用 `output_cls` 指定一个 pydantic 对象作为响应模板。

**compact**：这个模式类似 `refine`，但它会先拼接节点，以减少所需 LLM 查询次数，在细节和效率之间取得平衡。这就像律师将所有证人陈述打包成一份简报，并一次性交给法官；这比逐个叫每位证人上庭更快、更便宜，而逐个叫证人上庭就是 `refine` 做的事情。

**tree_summarize**：这个模式使用自底向上的递归摘要，通过 `summary_template` 处理每个节点。它会递归总结和查询节点，在每次迭代中拼接它们，直到只剩一个最终响应。它对摘要非常有用，特别适合从多条信息中创建全面摘要。

**simple_summarize**：这个模式会截断节点，使其适配单次 LLM 查询，以进行基础摘要。它非常适合简短概览，因为快速且便宜，但可能会遗漏细节。

**accumulate**：这个模式会将查询分别应用到每个节点，并累积响应。它最适合分析或比较来自多个来源的响应。

**no_text**：在这个运行模式下，response synthesizer 会获取节点，但不会查询 LLM。这主要用于调试、分析原始数据，或检查 retrieval / postprocessing 输出。

**compact_accumulate**：这是 `compact` 和 `accumulate` 的混合模式。它会像 `compact` 模式一样压缩 prompts，并将查询应用到各个节点上。它特别适合高效处理多个来源。

**generation**：这个模式会完全忽略检索上下文，直接调用 LLM 回答查询。它主要用于作为基线比较，例如模型在没有检索时表现如何，或者当你想提出不依赖文档的一般问题时使用。

**context_only**：这个模式不会查询 LLM，而是返回所有检索节点的纯拼接结果。它便于调试检索结果、检查被输入到 prompts 的原始上下文，或将上下文导出给 LlamaIndex 外部的自定义下游处理。

要使用这些模式中的任何一种，只需将模式名作为字符串传给：

```ini
get_response_synthesizer(response_mode="<mode_name>")
```

或者传给：

```ini
index.as_query_engine(response_mode="<mode_name>")
```

在为生产使用选择 response mode 时，请记住成本和延迟方面的权衡。`refine` 模式对每个节点进行一次 LLM 调用，也就是 N 个节点对应 N 次调用。它会产生详尽答案，但在检索集合很大时可能很慢且昂贵。`compact` 模式通过在应用相同 refinement 逻辑前，将节点拼接进更少、更大的 prompts 中来减少调用次数，通常能显著削减 LLM 调用数量。`tree_summarize` 模式通过递归合并方法，使用对数数量调用，也就是 log N 次，使其成为摘要任务的一个不错折中选择。另一端，`simple_summarize` 和 `no_text` 最多只需要一次 LLM 调用，或者不需要调用，因此是最便宜的选项，但存在明显限制。经验法则是，先从 `compact` 开始，它也是默认值，在质量和效率之间有良好平衡；只有当你需要更多控制，或处理非常大上下文时，再切换到 `refine` 或 `tree_summarize`。

除了这些预定义模式之外，也可以通过继承 `BaseSynthesizer` 并实现 `get_response` 方法来创建自定义 response synthesizers。你可以在官方文档中找到完整示例：

这为你设计专门响应生成方法提供了灵活性。

`structured_answer_filtering` 这类功能也可以在 `refine` 和 `compact` synthesizers 上启用。`refine` synthesizer 的一个常见问题是，早期无帮助响应，例如 `I don't know`，可能会在整个 refinement 过程中持续存在，即使后续节点包含正确答案。Structured Answer Filtering（SAF）通过确保只有有意义答案会被向前传递来解决这一点。如果某个节点没有贡献有效响应，它会被过滤掉，允许后续节点提供正确结果。要启用 SAF，只需在创建 response synthesizer 时设置：

```ini
structured_answer_filtering=True
```

如果你希望模型答案逐 token 返回，以降低长响应延迟，也可以设置 `streaming=True`。流式输出既支持独立 synthesizers，也支持它们在 LlamaIndex query engine 内部运行时使用。

response synthesizers 的另一个强大功能是 `output_cls` 参数。它允许你指定一个 Pydantic 模型，用于定义你期望答案的形状。这样 synthesizer 就不只是返回自由文本，而是可以填充一个带有明确类型字段的结构化对象，使输出更容易验证并用于下游工作流。例如，你可以要求答案始终包含 `answer`、`confidence` 或 `sources` 等字段。我们会在下一节更详细介绍结构化输出。

`text_qa_template` 和 `refine_template` 这类 prompt templates 允许我们定制响应合成不同阶段使用的 prompts。也可以传入额外变量来影响响应生成。

但猜猜看？我们还没走出森林。

接下来，谈谈路径上的另一个挑战。

## 提取结构化输出

下一个主题解决的是 RAG 应用中的一个常见问题：这些应用依赖 LLM 生成的结构化输出。每当 LLM 响应要被解析成变量、存储到数据库，或作为另一个函数的输入时，输出的精确结构就变得非常关键。

### 一点背景

由于 LLM 具有非确定性，它们有一个坏习惯：有时会以不同于我们要求的格式生成响应，添加未经请求的评论或描述——如果你仔细想想，这就像人类一样。仅仅依赖聪明的 prompting 技术，可能不足以完全避免这种行为。即使是专门训练来遵循精确指令的模型，偶尔也会偏离我们要求的结构。

如果输出只是简单返回给用户，这问题不大；它甚至可能创造更自然的体验。但当我们需要机器可读输出时，这种不可预测性可能会破坏流水线。图 7.3 展示了这种风险：

**图 7.3 —— LLM 可能产生不可预测输出**

那么，我们如何确保从 LLM 获得结构化且可预测的输出？和往常一样，LlamaIndex 会出手相救，提供几种方法来强制或验证结构化输出。这些方法分为三类：

**Structured LLMs**：这种方法允许你将数据 schema 直接绑定到语言模型，使其响应以结构化对象形式返回，而不是自由文本。它利用支持 JSON 或 function-calling 模式的模型，例如 OpenAI 的 GPT-5，甚至包括我们资源受限的 Gemma3:4B，也就是本书示例使用的模型。这种方法可能是确保可预测输出最直接、最可靠的方式。Structured LLMs 也能与 query engines 无缝集成，使 RAG 流水线无需额外步骤即可产生结构化响应。

**Output parsers**：在原生结构化输出无法保证的情况下，output parsers 会充当额外一层，将模型原始文本解释并重塑为可预测格式。它们可以强制 schema 规则、验证字段，或过滤不需要的内容，确保即使 LLM 本身偏离了要求结构，最终结果仍然一致且机器可读。

**Pydantic programs**：这是一种更灵活的抽象，将 prompts、models 和 schemas 连接成一个工作流。开发者不必直接处理原始 completions，Pydantic program 会自动将模型响应映射到定义良好的对象中。在底层，它可以使用 function calling、JSON output 或 parsing strategies；但对开发者来说，它就像一个干净的、schema 驱动的结构化数据接口，适合更复杂流水线。

我们会在后续页面详细讨论每种方法，但我认为首先需要快速介绍一下 Pydantic。毕竟，LlamaIndex 中大多数结构化输出功能都依赖它。

## 理解 Pydantic 的用途

Pydantic：[docs.pydantic.dev/latest](https://docs.pydantic.dev/latest)，是一个 Python 库，使定义和验证数据结构变得容易。你描述自己期望的数据类型，例如一个拥有姓名和年龄的用户，或者一张包含 line items 的发票，Pydantic 会把这个描述变成一个类。每当新数据进入时，Pydantic 会检查它是否匹配你定义的结构：需要的字段是否存在、类型是否正确，以及是否在需要时填入默认值。

可以把它想象成填写表单。表单可能会要求你的姓名、邮箱和出生日期。如果你漏填邮箱，或者在出生日期字段中输入随机内容，表单会拒绝。Pydantic 以类似方式工作：它会根据你设置的规则，强制数据完整且有意义。

为什么它对 LLM 有用？因为语言模型生成文本，但我们的应用中经常需要的是可靠对象，例如数字、列表、日期或记录，这些对象可以存储到数据库，或传给另一个函数。通过将 LLM 输出与 Pydantic 结合，我们获得了一张安全网：不再只是希望模型正确格式化内容，而是可以将响应验证并强制转换成结构化 Python 对象。

结构化输出并不保证正确性。LLM 仍然可能误解问题或编造细节，即使它把答案整齐地包装进你定义的 schema 中。例如，你可能要求返回某个人的出生年份，并得到一个完全有效的整数，但它仍然可能是错误年份。结构化输出只确保响应符合你期望的格式。验证错误，例如缺失字段或数据类型错误，可以被提前捕获，因为 Pydantic 会抛出错误。但语义错误会溜过去：模型可能自信地填入正确类型的数据，而实际内容却不准确或被编造。为了解决这个问题，你仍然需要检索 grounding、事实核查或其他安全措施。

## 使用 structured LLMs 生成结构化输出

在 LlamaIndex 中获得结构化输出最自然的方法，是将语言模型转换成所谓的 structured LLM。实践中，这意味着我们不是只向模型发送自由形式 prompt，然后希望它以正确形状返回。而是告诉它：这是你必须遵循的 schema。模型响应会自动以符合该 schema 的正确 Python 对象形式返回。

这里的魔法来自 Pydantic。一旦你定义了描述所需数据的类，例如一张专辑，包含名称、艺术家和歌曲列表，就可以将它直接附加到 LLM。从那以后，每次调用模型时，你不只是获得文本：你会同时获得原始 JSON 字符串和一个经过完整验证的 Pydantic 对象。

下面是一个简单示例。假设我们希望模型发明一张新的 Taylor Swift 专辑：

```python
import models_config
from pydantic import BaseModel, Field
from llama_index.core import Settings

class Album(BaseModel):
    name: str = Field(description="Album title")
    artist: str
    songs: list[str]

struct_llm = Settings.llm.as_structured_llm(Album)

response = struct_llm.complete("Generate a 3-song album by Taylor Swift")

print(response.raw)
```

在这个示例中，导入 `models_config` 会将 Gemma3:4B 设置为 `Settings` 中的默认 LLM。然后，我们围绕该 `llm` 对象定义 structured LLM，也就是 `struct_llm`。

运行这个示例后，你可能收到如下输出：

```ini
name='Echoes in Bloom' artist='Taylor Swift' songs=["Song 1: 'Paper Lanterns'", "Song 2: 'Fractured Light'", "Song 3: 'Wildfire & Honey'"]
```

正如你所看到的，运行这段代码不会只得到松散文本。它会给我们一个 `Album` 对象，并带有我们定义的字段。`songs` 会作为一个真正的字符串列表出现，专辑有标题，艺术家也填在我们期望的位置。

你可能已经注意到，在 `Album` 类中，我并没有只写：

```makefile
name: str
```

而是写了：

```ini
name: str = Field(description="Album title")
```

为什么要费心添加这个额外描述？答案在于 LLM 如何理解指令。当你使用 `Field` 添加 description 时，Pydantic 会将它变成背后生成的 JSON schema 的一部分。这个 schema 不只是说“这里应该是一个字符串”，还会说“这是专辑标题”。当 LlamaIndex 将这个 schema 发送给模型时，description 会为模型提供更多上下文，让它理解每个字段应该包含什么。没有它，模型可能仍然猜对；但有了 description，你会显著提升输出符合意图的概率。换句话说，这些注释是一种引导模型生成更准确、更有意义响应的方式。

所以，虽然不写 descriptions 代码也能运行，但包含它们是一种最佳实践。它让你的 schema 对人类更自解释，也帮助模型在填充细节时保持方向正确。

structured LLMs 特别强大的地方在于，它们可以无缝集成到 RAG 流水线中。如果你将 structured LLM 传入 query engine，那么查询答案会以结构化对象形式返回，而不是混乱文本块。它几乎像是跳过了整整一层后处理，因为模型本身已经在做保持整洁的工作。

不用先创建 structured LLM，然后调用 `.complete()` 或 `.chat()`，我们可以直接将 schema 附加到 prompt template 上，让模型完成剩余工作。幕后机制是相同的，但它省去一步，让代码更整洁。

下面是实践中的样子：

```python
import models_config
from pydantic import BaseModel, Field
from llama_index.core import Settings
from llama_index.core.llms import ChatMessage
from llama_index.core.prompts import ChatPromptTemplate

class Album(BaseModel):
    name: str = Field(description="Album title")
    artist: str
    songs: list[str]

chat_prompt = ChatPromptTemplate([
    ChatMessage.from_str("Generate a 3-song album by {artist}", role="user")
])

album = Settings.llm.structured_predict(
    Album,
    chat_prompt,
    artist="Taylor Swift",
)

print(album)
```

你可能注意到，在上面的示例中，我们把 prompt 包装进 `ChatPromptTemplate`，而不是直接传入普通字符串。为什么要这样做？这是因为 `structured_predict` 期望输入以 chat message 的形状出现，而不仅仅是自由文本。`ChatPromptTemplate` 给了我们一种干净方式，可以定义带变量占位符的可复用 prompts，在本例中变量是 `artist`，然后在调用 LLM 时将它们展开为正确的 chat messages。

在这个示例中，我们传给 LLM 的只有 prompt template 和 Pydantic class。结果是一个完整形成的 `Album` 对象，其中包含我们要求的每个字段。

当模型原生支持结构化输出时，Structured LLMs 是最干净的路径。但有时你会使用无法保证严格 JSON 或 tool calls 的模型，或者想在模型输出之上增加额外验证或修复。这时就轮到 output parsers 登场了。

## 使用 output parsers 提取结构化输出

Output parsers 对于管理 LLM 响应的不可预测性非常重要。它们确保 LLM 输出在应用后续步骤中具备正确结构和格式。这些 output parsers 在流水线中扮演双重角色。它们会在 LLM 调用之前介入，通过向 prompt 添加格式指令，轻轻地把模型推向正确方向。这就像告诉模型：不要只是给我答案，要用这个确切格式回答。然后，当模型完成工作后，parser 会在调用之后再次回来，清理返回内容。它会解析原始文本，对照你期望的 schema 检查它，并在必要时重试或修复输出，直到它符合请求的 schema。

由于这种两阶段行为，当你使用原生不支持结构化输出的模型时，parsers 最有价值。如果你的 LLM 已经支持结构化输出，通常不需要额外 parser。但在模型可能漂移的情况下，例如返回额外评论、忘记字段或破坏 JSON，你会很庆幸有 parser。

那么，什么时候应该真正使用 output parser？

可以把它看作一张安全网，用于那些你无法信任模型服从性的时刻。如果你的 schema 必须被强制执行，如果你想要验证并具备自动重试选项，或者如果你希望有一个轻量 helper 来结构化响应，而不必重新配置整个 LLM 设置，那么 parsers 可以产生很大差异。它们不会改变模型本身，但会给你一层可靠性和控制力，而这是纯 prompting 无法保证的。

Parsers 有多种形式，每种都有自己处理和 refine 输出的独特方式。

### `GuardrailsOutputParser`

这个 parser 基于 Guardrails AI 提供的 Guardrails 库：[www.guardrailsai.com/。Guardrails](https://www.guardrailsai.com/%E3%80%82Guardrails) 确保 LLM 输出遵循指定结构和类型。这在 RAG 应用中特别有用，因为输出需要保持一致且结构化，以便进一步处理。

Guardrails 通过根据定义好的格式验证 LLM 输出来做到这一点。如果输出不符合指定标准，它可以采取纠正动作，例如重新询问 LLM。这一功能对于在自动化流程中保持 LLM 输出的完整性和可用性非常关键。

### 底层机制

Guardrails 工作方式的核心，是 rails 的概念。在 Guardrails 库中，rail 是一种 LLM 输出规范工具。它用于对这些输出强制执行特定结构、类型和验证标准。Rails 可以使用 Reliable AI Markup Language（RAIL）来定义结构化输出，也可以直接使用 Python Pydantic 结构来定义。

rail 的目的是确保 LLM 输出遵循预定义质量和格式标准，包括设置 validators，以及在输出偏离标准时采取纠正动作。

这个 parser 基于以下逻辑运行：

- 首先，它接收初始 prompt 和输出格式规范作为输入。
- 基于输出格式规范，它会重新格式化 prompt，使其适配目标 LLM。
- 它还可以验证从 LLM 接收到的输出。如果规范没有通过验证，它可以重新生成输出，直到结构有效。

这个 parser 可以配置以下参数：

**guard**：来自 Guardrails 库的 `Guard` 类实例。这个类封装 Guardrails 系统的核心功能。它负责执行 RAIL 结构中定义的规范。

**llm**：这个参数是可选的，用于选择与 Guardrails parser 配合使用的语言模型。

**format_key**：这个可选参数很有用，当你想基于所需输出格式，将特定格式化指令注入查询中时，可以使用它。

```code
pip install guardrails-ai
```

### `LangchainOutputParser`

除了 `GuardrailsOutputParser` 之外，LlamaIndex 还支持 LangChain 提供的 output parsers。不同于使用更复杂的 RAIL 语言来定义验证标准和纠正动作，`LangchainOutputParser` 依赖一个更简单的概念，称为 response schema。

LangChain 中的 response schemas 主要用于结构化输出，重点在于定义输出应该包含哪些特定字段。这些 schemas 会引导 LangChain 系统确保输出匹配期望格式。

在运行下一段代码前，请运行以下命令安装 LangChain Classic 包：

```code
pip install langchain-classic
```

下面是一个示例，基于这种方法实现一个非常简单的 answer-with-citation 系统：

```javascript
import models_config
from langchain_classic.output_parsers import StructuredOutputParser, ResponseSchema
from llama_index.core.output_parsers import LangchainOutputParser
from llama_index.core.schema import TextNode
from llama_index.core import VectorStoreIndex, Settings
from pydantic import BaseModel
from typing import List

nodes = [
    TextNode(
        text="Roses have vibrant colors and smell nice."),
    TextNode(
        text="Oak trees are tall and have green leaves."),
]
```

在代码第一部分中，我们处理了必要 imports，然后定义了一些随机专有数据，这些数据包含在两个节点中。

接下来，我们必须定义用于结构化 LLM 输出的 response schemas：

```ini
schemas = [
    ResponseSchema(
        name="answer",
        description=(
            "answer to the user's question"
        )
    ),
    ResponseSchema(
        name="source",
        description=(
            "the source text used to answer the user's question, "
            "should be a quote from the original prompt."
        )
    )
]
```

正如你所看到的，schema 定义了期望输出结构。现在，我们可以定义 LangChain parser，并将其附加到 `models_config` 已经在 `Settings` 中配置好的 `llm` 对象上：

```ini
lc_parser = StructuredOutputParser.from_response_schemas(schemas)
output_parser = LangchainOutputParser(lc_parser)

llm = Settings.llm
llm.output_parser = output_parser
```

```ini
index = VectorStoreIndex(nodes=nodes)
query_engine = index.as_query_engine(llm=llm)

response = query_engine.query(
    "Are oak trees small?",
)

print(response)
```

输出如下：

```arduino
{'answer': 'no', 'source': 'Oak trees are tall and have green leaves.'}
```

很整洁，对吧？

注意，在 RAG 系统中 citations 很有用，因为它们增加透明度，并允许根据我们的专有数据验证答案。

LangChain parser 有两个可配置参数：

**output_parser**：这个参数接收一个 LangChain output parser（`LCOutputParser`）实例。解析和结构化输出的主要逻辑就在这里定义。正如前面示例所示，这里提供的 parser 决定如何处理和格式化 LLM 输出。

**format_key**：这是一个可选参数，如果提供，会用于向查询中插入额外格式指令。当查询需要用特定指令格式化，以引导语言模型输出生成时，这特别有用。

## 使用 Pydantic programs 提取结构化输出

Pydantic programs 代表另一种生成结构化输出的方式。Pydantic programs 是 LLM 工作流中的一种抽象，它可以将输入字符串转换成结构化 Pydantic 对象类型。

Pydantic programs 的另一个优势是可组合性。它们不绑定到单一使用场景，而是可以插入更大的工作流，无论是驱动 RAG 流水线、向 agent 提供数据，还是作为多步骤应用中的可复用组件。由于它们抽象掉了 extraction 的机制，因此可以适配从简单字段映射到复杂多对象输出的各种场景。

下面是一个简单示例，使用纯文本 completion 调用，没有 function/tool calling，因此可以运行在我们的 Gemma3:4B 模型上，而该模型在默认配置下并不支持 function calling：

```python
import json
import models_config
from llama_index.core import Settings
from pydantic import BaseModel, Field

class Invoice(BaseModel):
    invoice_id: str = Field(description="unique invoice identifier")
    total: float = Field(description="total amount")
```

在脚本第一部分中，我们首先确保必要 imports，并定义 `Invoice` 类，它将作为输出结构。接下来，我们准备 schema 和希望从中提取信息的输入文本：

```ini
llm = Settings.llm
schema = json.dumps(Invoice.model_json_schema(), indent=2)

text = "Invoice #INV-001 | Total: $22.90 | Thanks!"
```

接下来，我们构建一个同时包含 JSON schema 和原始文本的 prompt。prompt 明确指示 LLM 只返回符合 schema 的 JSON 对象，避免额外格式，例如 Markdown 代码块或评论：

```ini
prompt = f"""
You are an information extractor. Using ONLY the schema below,
return a single JSON object that conforms to this schema.
No preambles, no markdown, no extra text.
No ```json at the beginning

SCHEMA:
{schema}

TEXT:
{text}
"""
```

然后，我们将这个 prompt 发送给 LLM，以生成 completion。

```ini
raw = llm.complete(prompt)
```

```ini
invoice = Invoice.model_validate_json(raw.text)
```

```scss
print(invoice)
```

你可能会想，为什么我们要经历手动编写 prompt、调用 `llm.complete()`，然后自己解析 JSON 的麻烦。这是有意为之。我希望你看到，当要求 LLM 生成结构化输出时，幕后发生了什么。不过在实践中，你通常不会手动做所有这些。

LlamaIndex 提供了 `LLMTextCompletionProgram`，它将这种模式包装成一次调用：你给它一个 Pydantic class 和一个 prompt template，它会处理其余事情。可以把它看作我们刚刚手动构建流程的自动化版本。你也可以使用前面看到的 `structured_predict` 方法。两种方式都会带你到同一个目标。

总结一下：response synthesizers 接收你的问题和清理后的上下文，并将其转换成答案。你可以选择风格，也就是 `refine`、`compact` 或 summarize，并且可以使用其他功能，例如过滤空答案、流式返回回复，或生成结构化、机器可读的输出。

既然我们已经可以塑造上下文并合成答案，那么还需要一个编排器：QueryEngine 会在单次调用背后，将 retrieval、postprocessing 和 synthesis 串联起来。这将是我们的下一个主题。

## 构建并使用 query engines

我们的拼图现在完整了。在前面几章中，我们逐步学习了 RAG 设置中的关键组成部分。现在，是时候把所有东西组合起来：nodes、indexes、retrievers、postprocessors、response synthesizers 和 output parsers。

本章中，我们会重点关注如何将这些元素融合成一个复杂结构：query engine。我们会学习 query engines 如何工作，以及它们有哪些巧妙功能。

## 探索构建 query engines 的不同方法

从核心上看，`QueryEngine` 是一个接口，用于处理自然语言查询并生成丰富响应。它通常通过 retrievers 依赖一个或多个 indexes，也可以与其他 query engines 组合，以增强能力。

定义 `QueryEngine` 最简单的方法，是使用 LlamaIndex 提供的高层 API，如下：

```ini
query_engine = index.as_query_engine()
```

只用一行代码，我们就从现有索引构建了一个简单 query engine。虽然很快，但这种方法在底层使用默认设置的 `RetrieverQueryEngine`，并没有提供很多定制机会。

如果我们想完全控制其参数，并获得完整定制选项，可以使用低层 API 明确构建 query engine。

让我们看一个示例：

```javascript
import models_config
from llama_index.core.retrievers import SummaryIndexEmbeddingRetriever
from llama_index.core.postprocessor import SimilarityPostprocessor
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.core import (
    SummaryIndex, SimpleDirectoryReader, get_response_synthesizer
)
```

和往常一样，我们先处理 imports。接下来，摄取 demo 文件并构建一个简单 `SummaryIndex`：

```ini
documents = SimpleDirectoryReader("files").load_data()
index = SummaryIndex.from_documents(documents)
```

然后，我们加入一个 retriever、一个 response synthesizer 和一个 node postprocessor。使用这种低层 API 方法构建 query engine，可以让我们完全定制每个组件：

```ini
retriever = SummaryIndexEmbeddingRetriever(
    index=index,
    similarity_top_k=3,
)

response_synthesizer = get_response_synthesizer(
    response_mode="tree_summarize",
    verbose=True
)

pp = SimilarityPostprocessor(similarity_cutoff=0.6)
```

```ini
query_engine = RetrieverQueryEngine(
    retriever=retriever,
    response_synthesizer=response_synthesizer,
    node_postprocessors=[pp]
)

response = query_engine.query(
    "Enumerate iconic buildings in ancient Rome"
)

print(response)
```

输出应该类似如下：

```erlang
The iconic buildings in ancient Rome included the Colosseum and the Pantheon.
```

你也可以通过在调用 `as_query_engine` 时设置 `streaming=True`，然后使用 `response.print_response_stream()`，实时流式输出响应，逐 token 输出生成内容。

## QueryEngine 接口的高级用法

LlamaIndex 社区已经逐步开发出，并且还在继续开发各种高级查询方法，而 `QueryEngine` 是其中的主要组件。

除了本书中已经覆盖的 query engines 外，表 7.1 概览了写作时其他可用 engines：

| QueryEngine 类 | 简短描述与使用场景 |
| --- | --- |
| Citation and Retrieval-Augmented |  |
| CitationQueryEngine | 专为需要来自多个来源的 citations 来支持答案的场景设计。它在学术研究、法律分析，或任何重视经过验证、基于来源的信息的上下文中尤其有用。生成响应时，这个 query engine 会纳入并引用相关来源，确保答案不仅准确，而且可以由文档证据验证支持。 |
| FLAREInstructQueryEngine | 实现 Forward-Looking Active REtrieval（FLARE）方法。这个 query engine 允许模型在生成内容时持续访问并纳入外部知识。这对生成长篇、知识密集文本尤其有用。通过主动预测未来内容需求并相应检索信息，FLARE 旨在减少幻觉并提升生成响应的事实准确性。它基于 Jiang 等人 2023 年论文 Active Retrieval Augmented Generation，arxiv.org/abs/2305.06… |
| Routing and Composition |  |
| ComposableGraphQueryEngine | 被设计用于在 composable graph 结构中运行，支持跨不同数据源和索引进行灵活、模块化查询。它非常适合不同类型信息相互连接的复杂数据生态。 |
| ToolRetrieverRouterQueryEngine | 可以基于查询上下文，从多个候选 query engines 中动态选择。它会为每个具体查询使用最合适的 query engine tool。 |
| QASummaryQueryEngineBuilder | 结合 SummaryIndex 和 VectorStoreIndex。这既适合从文档中检索具体信息，也适合获取内容简洁摘要。 |
| TransformQueryEngine | 被设计用于在查询提交给底层 query engine 前，使用特定 transformation 对查询进行预处理。当查询格式或清晰度差异很大时，应用 transformation 来标准化或增强查询，可以大大改善检索。 |
| MultiStepQueryEngine | 通过将复杂查询分解成更简单的连续步骤来工作。它适合处理需要一系列逻辑步骤的复杂或多面问题。 |
| SQL and Structured Data |  |
| SQLJoinQueryEngine | 专为需要组合 SQL 数据库查询，以及额外信息检索或处理的场景设计。当 SQL 查询结果需要使用进一步查询进行增强或 refine 时，尤其有用。 |
| SQLAutoVectorQueryEngine | 将 SQL 数据库查询与基于向量的检索结合起来，支持两步流程：先对 SQL 数据库执行查询，然后基于这些结果，从 vector store 获取更多信息。 |
| SQLTableRetrieverQueryEngine | 将自然语言查询转换成 SQL 查询，并从查询结果中合成响应，使响应更容易被用户的自然语言查询理解，也更相关。 |
| NLSQLTableQueryEngine | 将自然语言问题直接转换成结构化数据库上的 SQL 查询，执行它们，并将结果合成为自然语言答案。它适合 analytics assistants 或 business intelligence 场景，让非技术用户无需编写 SQL 就能查询数据。不同于 SQLTableRetrieverQueryEngine，它更关注让用户用普通英文轻松提问，而不是严格控制使用数据库 schema 的哪些部分。 |
| PGVectorSQLQueryEngine | 被设计用于与 PGvector：github.com/pgvector/pg… 配合工作。PGvector 是 PostgreSQL 的一个扩展，允许向量直接存储并嵌入数据库中。 |
| PandasQueryEngine | 将自然语言查询转换成可执行的 pandas Python 代码，允许在 pandas DataFrames 上进行数据操作和分析。 |
| JSONalyzeQueryEngine | 被设计用于分析 JSON list-shaped data，通过将自然语言查询转换成在内存 SQLite 数据库中执行的 SQL 查询来实现。 |
| Retry and Self-Correcting |  |
| RetryQueryEngine | 当查询的初始响应不满足某些评估标准时，如果评估失败，会自动重试查询。 |
| RetrySourceQueryEngine | 被设计用于根据评估标准，使用不同 source nodes 对查询执行 retries。如果 query engine 的初始响应不符合 evaluator 标准，它会尝试寻找可能产生更好响应的替代 source nodes。 |

**表 7.1 —— LlamaIndex 中可用的不同 query engine 模块**

在那里，你会找到每个模块的详细解释、使用场景，以及最重要的代码示例，帮助你理解每种方法的运行和实现。

另一个需要考虑的重要方面是，`QueryEngine` 接口处理的是单次查询和响应。如果你需要多轮来回交互，并保留上下文记忆，LlamaIndex 提供了 `ChatEngine` 接口，被设计用于支持更长对话，可以理解为由你的数据增强的 ChatGPT 风格对话。

本章结束之前，我们至少需要介绍 RAG 场景中的几个核心模块。接下来就做这件事。

## 使用 `RouterQueryEngine` 实现高级路由

**图 7.4 —— `RouterQueryEngine` 如何工作**

`RouterQueryEngine` 能够在它可用的不同 tools 之间做选择。根据用户查询，router 会决定应该使用哪个 `QueryEngineTool` 来生成答案。

就像 retrievers 一样，我们可以使用 `PydanticMultiSelector` 或 `PydanticSingleSelector` 配置它的行为。multi-selector 会组合多个选项，并能处理更广范围的用户查询。

### 潜在使用场景

想象一个真实场景：一个组织的知识被拆分到多个独立文档中。这样的 router 可以支持对整个知识库的一般查询，同时仍然能够精确定位用于生成答案的源数据。

在下面示例中，我们正在构建一个 `RouterQueryEngine` engine，它操作多个 query engine tools，每一个都建立在不同文档之上。代码如下：

```javascript
from llama_index.core.tools import QueryEngineTool
from llama_index.core.query_engine import RouterQueryEngine
from llama_index.core.selectors import PydanticMultiSelector
from llama_index.core import SummaryIndex, SimpleDirectoryReader
from llama_index.core.extractors import TitleExtractor

documents = SimpleDirectoryReader("files").load_data()
```

这部分代码处理 imports 并摄取示例数据。和之前一样，我们使用两个简单文本文件：一个包含关于古罗马的信息，另一个包含关于狗的通用文本。在下一部分中，我们会遍历每篇文档，并使用 `TitleExtractor` 提取标题，将其存储为元数据字段：

```ini
title_extractor = TitleExtractor()

for doc in documents:
    title_metadata = title_extractor.extract([doc])
    doc.metadata.update(title_metadata[0])
```

文件被摄取并生成文档标题之后，我们可以为每篇文档定义 `SummaryIndex`、`QueryEngine` 和 `QueryEngineTool`。我们使用文档标题为 selector 提供每个 tool 的描述：

```ini
indexes = []
query_engines = []
tools = []

for doc in documents:
    document_title = doc.metadata['document_title']

    index = SummaryIndex.from_documents([doc])

    query_engine = index.as_query_engine(
        response_mode="tree_summarize",
        use_async=True,
    )

    tool = QueryEngineTool.from_defaults(
        query_engine=query_engine,
        description=f"Contains data about {document_title}",
    )

    indexes.append(index)
    query_engines.append(query_engine)
    tools.append(tool)
```

```ini
qe = RouterQueryEngine(
    selector=PydanticMultiSelector.from_defaults(),
    query_engine_tools=tools
)
```

根据查询，selector 会决定使用哪些 tools 来收集响应。每个 tool 响应之后，query engine 会合成并返回最终响应：

```vbscript
response = qe.query(
    "Tell me about Rome and dogs"
)

print(response)
```

对于相对较小的文档，这种方法大概率可以很好工作。只要文本足够短，能够被恰当地总结成标题，这个 query engine 就能很好处理大多数用户查询。不过在真实场景中，用标题完整总结全部内容几乎不太可能。在这种情况下，使用文档摘要而不是标题会更好。

除了 Pydantic selectors，LlamaIndex 还提供基于 LLM 的 selectors，也就是 `LLMSingleSelector` 和 `LLMMultiSelector`。它们依赖语言模型本身来决定使用哪个 tool 或哪组 tools。当决策逻辑过于复杂，难以用静态 Pydantic rules 捕捉时，这些 selectors 尤其有帮助。LLM selectors 的概念在 query engine 层级同样适用。

假设你已经构建好了 `QueryEngineTool` 对象列表 `tools`，定义一个基于 LLM 的 selector 非常直接：

```ini
qe = RouterQueryEngine(
    selector=LLMMultiSelector.from_defaults(),
    query_engine_tools=tools
)
```

这与前面 `PydanticMultiSelector` 示例相呼应。当你预期某个查询最好由一个 tool 回答时，可以使用 `LLMSingleSelector`；当查询可能受益于组合多个 tools 的信息时，可以使用 `LLMMultiSelector`。

## 使用 `SubQuestionQueryEngine` 查询多个文档

在涉及多个数据源的真实场景中，就像前一个示例，用户可能会提出更复杂的查询。例如，他们可能要求比较记录在不同文件中的不同主题。对于这种情况，可以使用 `SubQuestionQueryEngine`。它被设计用于通过将复杂查询拆解成更小的子问题来处理复杂查询。

每个子问题都会由其指定的 query engine 处理，然后各个响应会被组合起来。response synthesizer 会用于将这些响应编译成连贯的最终响应，从而有效管理需要多方面处理的查询。图 7.5 描述了它的运行方式：

**图 7.5 —— `SubQuestionQueryEngine` 如何工作**

让我们看一下代码。第一部分与前面关于 `RouterQueryEngine` 的示例非常类似：

```javascript
import models_config
from llama_index.core.tools import QueryEngineTool
from llama_index.core.question_gen import LLMQuestionGenerator
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.core.selectors import PydanticMultiSelector
from llama_index.core.extractors import TitleExtractor
from llama_index.core import SummaryIndex, SimpleDirectoryReader, Settings
```

导入必要模块后，我们加载文件并提取它们的标题：

```ini
documents = SimpleDirectoryReader("files/sample").load_data()

title_extractor = TitleExtractor()

for doc in documents:
    title_metadata = title_extractor.extract([doc])
    doc.metadata.update(title_metadata[0])

indexes = []
query_engines = []
tools = []
```

到目前为止，我们完成了与 `RouterQueryEngine` 相同的步骤。下一部分有一个明显变化：我们还会从元数据中提取 `file_name`，并将其作为对应 tool 的名称。这样，我们就能准确知道每个答案来自哪里：

```ini
for doc in documents:
    document_title = doc.metadata['document_title']
    file_name = doc.metadata['file_name']

    index = SummaryIndex.from_documents([doc])

    query_engine = index.as_query_engine(
        response_mode="tree_summarize",
        use_async=True,
    )

    tool = QueryEngineTool.from_defaults(
        query_engine=query_engine,
        name=file_name,
        description=f"Contains data about {document_title}",
    )

    indexes.append(index)
    query_engines.append(query_engine)
    tools.append(tool)
```

```ini
qgen = LLMQuestionGenerator.from_defaults(llm=Settings.llm)

qe = SubQuestionQueryEngine.from_defaults(
    query_engine_tools=tools,
    question_gen=qgen,
    use_async=True
)
```

到这里，我们已经准备好生成输出：

```vbscript
response = qe.query(
    "Compare buildings from ancient Athens and ancient Rome"
)

print(response)
```

你应该会看到类似如下内容：

```vbnet
Generated 3 sub questions.
[sample_document3.txt] Q: What were the main types of buildings in ancient Athens?
[sample_document3.txt] Q: What were the main types of buildings in ancient Rome?
[sample_document3.txt] Q: How did the purpose of the buildings in Athens compare to those in Rome?
[sample_document3.txt] A: The Parthenon, a temple dedicated to Athena, and the Theater of Dionysus were significant structures in ancient Athens. The Agora served as a bustling marketplace and center for social life.
[sample_document3.txt] A: The city of Athens was adorned with magnificent structures, with the Parthenon standing as a testament to their architectural brilliance.
[sample_document3.txt] A: The text describes the Parthenon as a testament to architectural brilliance, dedicated to the city's patron deity. It also details the Agora as the heart of Athenian commerce and social life. These structures highlight the city's focus on religious devotion and civic engagement.

The city of Athens was adorned with magnificent structures, with one dedicated to the city's patron deity and another as the heart of Athenian commerce and social life.
```

除了最终响应之外，我们还能看到每个生成的子问题，以及对应的 query engine tool 名称。在我们的案例中，tool 名称会对应每个源文本的文件名。

`SubQuestionQueryEngine` 特别适合处理无法直接一步回答的复杂查询。它在以下场景中效果很好：

**比较分析**：对于需要比较和对照不同主题的查询，engine 可以将查询拆分成更小、更聚焦的子问题，先收集每个主题的详细信息，再合成比较性响应。示例问题：`Compare and contrast the economic policies of Country A and Country B in the last decade.`

**多面向问题**：当查询涉及多个方面或标准时，这个 engine 可以将查询拆解成单独组成部分，分别处理，然后合并结果形成全面答案。这意味着它可以处理类似这样的问题：`What are the environmental, economic, and social impacts of deforestation in the Amazon rainforest?`

**复杂研究任务**：对于需要从各种来源或视角收集信息的研究型查询，这个 engine 可以通过将任务切分成更易管理的子问题，高效处理任务。它可以回答这类查询：`Investigate the historical development of renewable energy technologies and their adoption across different continents.`

掌握这些新知识之后，下一章我们将探索构建复杂 RAG 系统的更高级方式。

## 总结

接着，我们介绍了 response synthesizers，它们接收优化后的上下文和用户查询，生成最终答案。我们考察了不同 synthesis modes，从 `refine` 和 `compact`，到 summarization 和 accumulation-based 方法，并看到如何使用 templates、streaming 和 structured answer filtering 对它们进行定制。

然后，我们讨论了结构化输出的重要性，也就是当响应需要机器可读，而不是自由文本时。我们比较了主要方法，并强调它们在强制 schema、验证和可预测性方面的作用。

