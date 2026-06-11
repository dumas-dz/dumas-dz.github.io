---
title: LlamaIndex - 查询数据 - 上下文检索
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 检索
---

---

本章详解各类 Retriever 机制，包括 Dense Retrieval（向量检索）、Sparse Retrieval（BM25 关键词检索）、Hybrid Search（混合检索），以及元数据过滤器的使用。

## 技术要求

为了运行本章中的示例，你需要安装以下集成包：

- BM25 Retriever：[pypi.org/project/lla…](https://pypi.org/project/llama-Index-retrievers-bm25/)

我们需要它来演示 BM25 在 LlamaIndex 中是如何实现的。

## 学习查询机制——概览

在接下来的章节中，我们会讨论 LlamaIndex 提供的各种查询技术。和往常一样，我们会从最简单的查询方法开始，在信息检索术语中，这类方法被称为 naive methods，然后逐步推进到更高级的方法。

首先，我们需要理解查询过程中的典型步骤：检索、后处理和响应合成。现在，我们将分别探索这三种机制，并理解它们如何工作，以及它们提供了哪些可定制选项。

首先，我们会聚焦于 retrievers。

## 理解基础 retriever

检索机制是任何 RAG 系统中的核心元素。虽然它们的实现方式可能不同，但所有 retriever 都遵循同一个原则：它们浏览一个索引，并选择相关节点，用来构建必要上下文。每种索引类型都会提供几种检索模式，每种模式都提供不同功能和定制选项。无论 retriever 类型是什么，返回结果都会是 `NodeWithScore` 对象的形式——这是一种将节点与关联 relevance score 组合起来的结构。这个 score 在 RAG 流程后续阶段可能会很有用，因为它允许我们根据相关性对返回节点进行排序。

和往常一样，LlamaIndex 提供了多种方式来完成一个任务，因此 retriever 可以通过几种方式构建。最简单的方式是直接从 `Index` 对象构建。假设我们已经完成文档摄取，下面的代码会构建一个索引，然后基于该索引结构构建一个 retriever：

```ini
import models_config
from llama_index.core import SummaryIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("files").load_data()
summary_index = SummaryIndex.from_documents(documents)

retriever = summary_index.as_retriever()

result = retriever.retrieve("Tell me about ancient Rome")
print(result[0].text)
```

在前面的示例中，生成的 retriever 类型是 `SummaryIndexRetriever`。这是 `SummaryIndex` 的默认 retriever。

第二种选项是直接实例化，如下面示例所示：

```ini
import models_config
from llama_index.core import SummaryIndex, SimpleDirectoryReader
from llama_index.core.retrievers import SummaryIndexEmbeddingRetriever

documents = SimpleDirectoryReader("files").load_data()
summary_index = SummaryIndex.from_documents(documents)

retriever = SummaryIndexEmbeddingRetriever(
    index=summary_index
)

result = retriever.retrieve("Tell me about ancient Rome")
print(result[0].text)
```

### 区别是什么？

使用 `.as_retriever()` 是更方便的方法。它会返回该索引类型的默认 retriever。当你只是想查询，不想操心细节时，这种方式快速且简单。

直接实例化则让你可以明确控制使用哪个 retriever 类。许多索引都有不止一种 retriever 实现，例如基于 embedding 的 retriever 与基于 LLM 的 retriever。通过直接实例化 retriever 类，你可以配置参数，或替换为非默认行为。

简单来说，`.as_retriever()` 是获取与索引绑定的默认 retriever 的快捷方式；而直接实例化，则是你选择特定 retriever 类，并使用自定义参数配置它的方式。

在下一节中，我们会逐个介绍每种索引类型可用的检索选项。在每种 retriever 类型旁边，我会说明它如何从对应索引中实例化。这里先提醒你，下一节会压缩大量信息。不过，这些信息非常有用，你可以收藏起来，之后在开始用 LlamaIndex 框架构建真实应用时再回来查阅。

下面就是每种索引类型对应的 retriever 列表。

## `VectorStoreIndex` 的 retrievers

对于这个索引，我们有两个 retriever 选项。让我们看看它们如何工作，以及如何针对不同使用场景进行定制。

### `VectorIndexRetriever`

`VectorStoreIndex` 使用的默认 retriever 是 `VectorIndexRetriever`。它可以很容易地通过以下方式构建：

```ini
index = VectorStoreIndex.from_documents(documents)
retriever = index.as_retriever()
```

正如预期，由于 `VectorStoreIndex` 是最复杂且最广泛使用的索引之一，这个 retriever 也比较复杂。

**图 6.1 —— 使用 `VectorIndexRetriever` 检索节点**

这个 retriever 的工作方式是将查询转换为向量，然后在向量空间中执行基于相似度的搜索。针对不同使用场景，可以定制多个参数：

**similarity_top_k**：定义 retriever 返回的 top-k 结果数量。它决定每个查询会返回多少个最相似结果。例如，如果我们希望搜索范围更广，可以修改默认值，默认值是 `2`。

**vector_store_query_mode**：这个参数控制查询如何针对 vector store 执行。不同外部 vector store，例如 Pinecone：[www.pinecone.io/、OpenSearch…](https://www.pinecone.io/%E3%80%81OpenSearch%EF%BC%9Ahttps://opensearch.org/) 等，支持不同查询模式。可以通过这个参数选择多种查询模式，包括 `DEFAULT`，即标准 dense vector similarity；`TEXT_SEARCH`，用于支持关键词搜索的存储；以及 `HYBRID`，即 dense retrieval 与 sparse retrieval 的组合。我们将在本章后面的“理解 dense retrieval 和 sparse retrieval 的概念”一节中更多讨论这些内容。

**filters**：还记得第 3 章“节点”一节中我们看到如何向节点添加元数据吗？我们可以使用这些元数据来缩小 retriever 的搜索范围。我们会在本章后面的“实现元数据过滤器”一节中看到一个实际示例，用 metadata filters 实现一个简单系统，用来过滤索引返回的节点。

**alpha**：当使用 hybrid search 模式时，这个参数很有用。hybrid search 是 sparse search 和 dense search 的组合。`alpha` 值范围从 `0.0` 到 `1.0`：`0.0` 完全偏向 sparse matching，`1.0` 完全偏向 dense matching，中间值则混合二者。请根据查询风格调整这个值。精确引用类查询更适合较低 alpha，而开放式 “why/how” 问题更适合较高 alpha。我们将在本章后面的“理解 dense retrieval 和 sparse retrieval 的概念”一节中更详细讨论 sparse search 和 dense search 的区别。

**sparse_top_k**：sparse search 的 top 结果数量。这在 hybrid search 模式中相关。前面的说明同样适用于这里。

**hybrid_top_k**：这个参数设置在 hybrid 模式下，将 dense 和 sparse search 组件的分数组合之后要返回的 top 结果数量。它允许我们控制从合并排序中选择多少结果，而不依赖 `similarity_top_k` 或 `sparse_top_k` 的值。

**doc_ids**：它类似于 metadata filters，但粒度稍粗。`doc_ids` 用于将搜索限制在特定文档子集内。例如，假设组织使用一个由所有部门共享的公共知识库。不过，组织同时有清晰的文档命名规范。如果文档名中包含部门名称或代码，就可以使用这个参数将用户查询限制在其所在部门的文档中。

**node_ids**：这个参数类似于 `doc_ids`，但指的是索引中的节点 ID。这可以让我们对 retriever 返回的信息进行更细粒度控制。

**vector_store_kwargs**：这个参数可以传递每种 vector store 特有的额外参数，使它们能够在查询时发送出去。

由于检索决定哪些节点会到达 LLM，所以 `filters`、`doc_ids` 和 `node_ids` 这类参数，也会成为第一道访问控制防线。这引出了几个重要的安全考虑。

作为一种安全设计原则，安全应该在应用生命周期中尽可能早地实现。RAG 应用也是如此。例如，如果我们想更好地控制信息访问，就应该尽可能早地过滤应用处理的信息。在 RAG 流程中，这意味着从信息被检索出来的那一刻开始，如果不是更早的话。当然，也有办法在 query engine 后续阶段过滤信息，例如在后处理甚至响应合成阶段。但更简单的方式，是一开始就防止那些超出用户安全上下文的信息被注入流程中。这里也存在成本问题。由于 RAG 流程中的许多处理都基于 LLM 摄取，我们处理的信息越少，成本就越低。

### `VectorIndexAutoRetriever`

前面讨论的所有 `VectorIndexRetriever` 参数，在我们明确知道自己要找什么，并且非常理解数据结构时，都很有用。不幸的是，在某些情况下，我们会面对复杂结构，或者索引数据中存在歧义。

`VectorIndexAutoRetriever` 是一种高级 retriever，它可以使用 LLM，基于内容和支撑元数据的自然语言描述，自动为 vector store 设置查询参数。当用户不熟悉数据结构，或不知道如何构造有效查询时，这特别有用。在这种情况下，这个 retriever 可以把模糊或不清楚的查询转换成更结构化的查询，并更好地利用 vector store 的能力，从而提高找到相关结果的概率。

### 快速使用场景示例

想象一个在线购物搜索系统，购物者输入：`breathable trail shoes under $120 with good ankle support`。`VectorIndexAutoRetriever` 会将其转换为结构化过滤条件，例如：

```makefile
category: trail running
features: breathable, ankle support
price: < $120
```

然后使用这些条件获取最相关商品。它还可以在重写查询并提出过滤条件时捕捉同义词，例如 `breathable` 约等于 `mesh upper`。

详细讨论这个机制会占用好几页，我可能会过度偏离主题；如果你想了解更多关于它如何工作的信息，建议参考官方文档：

探索了基于向量的 retrievers，包括可自动调优的 `VectorIndexAutoRetriever` 之后，让我们转向 `SummaryIndex` 家族，从最简单的选项开始：`SummaryIndexRetriever`。

## `SummaryIndex` 的 retrievers

对于这个索引，有三种 retriever 选项。让我们来看一下。

### `SummaryIndexRetriever`

可以通过下面命令构建这个 retriever：

```ini
index = SummaryIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode = 'default')
```

**图 6.2 —— 使用 `SummaryIndexRetriever` 检索节点**

当我们希望获得索引中数据的完整视图，而不需要过滤或排序结果时，它很有用。节点不会返回 relevance score。

### `SummaryIndexEmbeddingRetriever`

我们可以用下面命令构建它：

```ini
index = SummaryIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='embedding')
```

这个 retriever 依赖 embeddings 从 `SummaryIndex` 中检索节点。虽然 `SummaryIndex` 本身以纯文本方式存储节点，但这个 retriever 会在发起查询时，使用 embedding 模型将这些纯文本节点转换为 embeddings。请看图 6.3，以便更好地理解它的运行方式：

**图 6.3 —— `SummaryIndexEmbeddingRetriever` 的内部工作机制**

embeddings 会在检索需要时动态创建。在检索期间，如果某个节点没有 embedding，retriever 会计算一个 embedding，将其写入 `node.embedding`，也就是写入 docstore，然后基于查询对该节点打分。后续查询会直接复用缓存向量，因此 embedding 成本只会支付一次，尽管索引本身构建时并没有预先计算 embeddings。

`similarity_top_k` 参数根据节点与查询的相似度，决定返回多少个节点。默认值是 `1`。`embed_model` 参数允许你在构建 retriever 时指定自定义 embedding 模型，而不是依赖全局默认值，从而对查询和节点如何被编码提供细粒度控制。

这个 retriever 对于使用相似度计算寻找与给定查询最相关的节点很有用。对于每个被选中的节点，retriever 会基于 embeddings 计算一个 similarity score，然后将其与节点一起作为 `NodeWithScore` 返回。这个 score 反映了每个节点与查询对应的程度。

### `SummaryIndexLLMRetriever`

可以用下面命令构建这个 retriever：

```ini
index = SummaryIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='llm')
```

正如名称所暗示的，这个 retriever 使用 LLM 从 `SummaryIndex` 中检索节点。它使用 prompt 来选择最相关节点。图 6.4 展示了它的方法概览：

**图 6.4 —— `SummaryIndexLLMRetriever` 运行中**

如果愿意，我们可以使用 `choice_select_prompt` 参数覆盖默认 prompt。查询会被分批处理，每批大小由 `choice_batch_size` 参数决定，默认值是 `10`。可选情况下，我们也可以将 `format_node_batch_fn` 和 `parse_choice_select_answer_fn` 函数作为参数提供。

第一个函数 `format_node_batch_fn` 会将节点中的信息准备成适合 LLM 使用的格式。这可能包括合并多个节点中的文本，以特定方式结构化信息，或添加上下文元素来帮助 LLM 理解和评估内容。

第二个函数 `parse_choice_select_answer_fn` 会决定哪些节点与查询最相关，并提取每个节点关联的 relevance score 或其他指标。通过分析 LLM 响应，这个函数允许 retriever 判断哪些节点与用户查询最相关。然后，这些 score 会与对应节点关联，并作为 `NodeWithScore` 返回。

如果省略任一函数，retriever 会使用内置默认值：`default_format_node_batch_fn` 和 `default_parse_choice_select_answer_fn`。

通常来说，这类 retriever 在复杂搜索系统中很有用，因为 LLM 可以为查询提供上下文感知且细节丰富的答案。

## `DocumentSummaryIndex` 的 retrievers

对于这个索引，我们只有两种检索选项。让我们看看。

### `DocumentSummaryIndexLLMRetriever`

我们可以用下面命令构建它：

```ini
index = DocumentSummaryIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='llm')
```

因为 `DocumentSummaryIndexLLMRetriever` 是这个索引的默认 retriever，所以省略 `retriever_mode` 参数实际上会得到相同结果。

这个 retriever 使用 LLM 从文档摘要索引中选择相关摘要。你可以通过图 6.5 更好地理解它如何工作：

**图 6.5 —— `DocumentSummaryIndexLLMRetriever` 如何工作**

retriever 会分批处理查询，每个批次包含指定数量的节点，并发送给 LLM 进行评估。`choice_batch_size` 参数用于指定批次大小，默认是 `10`。retriever 可以使用通过 `choice_select_prompt` 参数提供的自定义 prompt，来判断摘要与查询的相关性。结果会按照相关性排序，并根据 `choice_top_k` 指定的数量返回。这个参数默认值是 `1`。

`format_node_batch_fn` 和 `parse_choice_select_answer_fn` 函数也可以作为参数指定。

和其他基于 LLM 的 retriever 一样，如果你想使用特定 LLM，可以通过 `llm` 参数直接传入。

总结一下，`DocumentSummaryIndexLLMRetriever` 适合使用 LLM 的自然语言处理能力，从大量文档中检索有用数据。作为一个有用的旁注，需要知道这个 retriever 也会返回与每个节点关联的 relevance score。

在我实验这种 retriever 时，我注意到 LLM 分配给每个节点的 relevance score 往往持续偏高，经常达到最大值 10。对于那些需要细腻区分相关程度的应用，调整 prompt 或对 LLM 响应进行后处理，可能有助于获得更加平衡且更细致的 relevance score 分布。这个问题也强调了根据不同应用的具体需求和上下文，定制 LLM prompts 与响应处理的重要性。

### `DocumentSummaryIndexEmbeddingRetriever`

可以使用下面代码构建这个 retriever：

```ini
index = DocumentSummaryIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='embedding')
```

这个 retriever 依赖 embeddings 从索引中检索 summary nodes。图 6.6 展示了它的操作方式：

**图 6.6 —— `DocumentSummaryIndexEmbeddingRetriever`**

它会为查询计算 embedding，然后找到与查询相似度最高的摘要。

为了让这个方法生效，索引构建时应该将 `embed_summaries` 参数设置为 `True`。如果没有设置这个参数，基于 embedding 的 retriever 就没有任何 summary embeddings 可用于比较，检索会静默返回空结果。

`similarity_top_k` 参数指定基于相似度返回多少个 summary nodes，默认值为 `1`。由于这个 retriever 会让每个 `NodeWithScore` 中的 score 字段保持未设置，即 `None`，所以实际上不会返回 relevance value。和其他基于 embedding 的 retriever 一样，你仍然可以通过 `embed_model` 参数提供自定义模型。

让我们继续下一组 retrievers。

## `TreeIndex` 的 retrievers

`TreeIndex` 就其本质而言，被设计用来反映数据中的层级关系，因此非常适合数据天然以树状结构组织的场景，例如文件系统、组织结构图或产品分类。话虽如此，LlamaIndex 对这种结构的实现，是一棵关于数据摘要的树。不管原始文档中是否已经存在结构，这个索引都会通过将文档分块，并在树的每一层创建摘要，来构建一个平行的层级结构。由于 `TreeSelectLeafRetriever` 和 `TreeSelectLeafEmbeddingRetriever` 的递归特性，在查询时导航这个结构，可能比其他类型索引计算成本更高。这个递归过程会增加计算开销，尤其是对于很深的树或大型数据集。

### `TreeSelectLeafRetriever`

我们可以像这样构建这个 retriever：

```ini
index = TreeIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='select_leaf')
```

这也是 `TreeIndex` 使用的默认 retriever。它的目的，是递归导航索引结构，并识别与给定查询最相关的叶节点。这可以在图 6.7 中看到：

**图 6.7 —— 使用 `child_branch_factor` 参数值为 1 配置的 `TreeSelectLeafRetriever`**

`child_branch_factor` 参数指定在树的每一层要考虑多少个子节点。设置更高的值可以带来更彻底的搜索，并增加找到最相关节点的机会。不过，它的缺点是会增加计算成本和处理时间。如果没有指定值，retriever 默认值是 `1`。另一个非常有用的参数是 `verbose`，当它设置为 `True` 时，会显示详细选择过程。这是理解 retriever 如何工作，或排查潜在执行问题的好方法。这个 retriever 返回的节点不包含关联 relevance score。由于这个 retriever 使用 LLM 进行节点选择，因此可以使用多个参数来定制 prompts：

**query_template**：这是一个 prompt template，可用于定制发送给 LLM 的查询。

**text_qa_template**：这是另一个用于基于文本 Q&A 查询的 template。它用于从文本节点中获取特定答案。

**refine_template**：这个 template 用于 refine 或增强从 LLM 获得的初始答案。它可以用于添加额外上下文或澄清答案。

**query_template_multiple**：一个替代 prompt template，允许针对多个节点同时构造查询。当 `child_branch_factor` 参数大于 1 时很有用。

### `TreeSelectLeafEmbeddingRetriever`

```ini
index = TreeIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='select_leaf_embedding')
```

正如名称所暗示的，这个 retriever 通过比较查询 embedding 与节点文本 embeddings 来搜索索引，并选择相似度最高的节点作为最相关节点。

这个过程是递归的，会导航树的所有层级。它几乎与 `TreeSelectLeafRetriever` 完全相同，唯一不同在于它使用 embeddings 来选择节点。

我们前面讨论过的 `TreeSelectLeafRetriever` 参数在这里同样有效，但这里还有一个额外参数：`embed_model`。它可以用于指定偏好的 embedding 模型。

即使这个 retriever 使用 embeddings 进行树遍历，prompt templates，例如 `query_template`、`text_qa_template`、`refine_template`，仍然是相关的，因为当到达叶节点之后，它们会在响应合成阶段使用。

和前一个 retriever 一样，这个 retriever 返回的节点不包含关联 relevance score。

### `TreeAllLeafRetriever`

构建这个 retriever 最快的方式如下：

```ini
index = TreeIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='all_leaf')
```

你可以在图 6.8 中看到说明图：

**图 6.8 —— 使用 `TreeAllLeafRetriever` 检索所有节点**

这个 retriever 的用处在于它能够分析大量数据，确保响应生成过程中不会遗漏任何潜在相关信息。和 `SummaryIndexRetriever` 一样，这个 retriever 会从索引中提取所有节点并排序，而不管它们在层级结构中的位置。这类似于批量检索，但不会返回任何 relevance score。

### `TreeRootRetriever`

可以用下面命令构建它：

```ini
index = TreeIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='root')
```

不同于 `TreeAllLeafRetriever`，这个 retriever 专注于直接从树的根节点检索响应。它假设索引树已经存储了响应。不像其他方法可能会沿树向下解析信息，以提取相关节点，`TreeRootRetriever` 依赖这样一个事实：答案已经位于根层级。图 6.9 给出了视觉解释：

**图 6.9 —— 从树根进行检索**

当关键信息被聚合或综合在数据结构顶层时，例如数据摘要、一般结论或常见问题答案，它很有效。这个 retriever 也不会返回与节点关联的 relevance score。

### 实际使用场景

一个实际例子是医学领域中的临床决策支持系统（CDSS）。想象这样一个系统拥有 `TreeIndex` retriever，其中每个根节点代表一个特定医学问题，对应答案或临床建议已经被预先计算并存储在这些根节点中。例如，根节点可能存储一个预计算答案，例如：`Common symptoms of COVID-19 include fever, dry cough, tiredness, and so on`。在这种场景中，当医生或患者使用 `Symptoms of a COVID-19 infection` 查询系统时，这个 retriever 会查看对应根节点，并返回预计算答案，而无需任何额外处理，也不需要遍历树来查找信息。

## `KeywordTableIndex` 的 retrievers

从 `KeywordTableIndex` 进行检索的过程，首先会从传给 retriever 的查询中提取相关关键词。提取方式可以有几种，具体取决于使用的 retriever。一旦关键词被提取出来，retriever 会统计每个关键词在已索引节点中出现的频率。这个索引可用的所有 retriever 都会按照图 6.10 所示方式运行。唯一不同之处在于关键词提取方法：

**图 6.10 —— `KeywordTableIndex`**

在统计每个节点中出现了多少个提取关键词之后，retriever 会按照关键词匹配数量从高到低返回节点。每个节点都会被包装在 `NodeWithScore` 对象中，以保持 API 一致性，但其 score 字段会保持 `None`，因此你会得到排序，也就是匹配最多的排在前面，但没有明确数值 relevance value。

### `KeywordTableGPTRetriever`

可以使用下面命令构建这种 retriever：

```ini
index = KeywordTableIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='default')
```

它使用 LLM 查询来识别查询中的相关关键词，然后返回与这些关键词关联的节点。

### `KeywordTableSimpleRetriever`

这个 retriever 可以这样构建：

```ini
index = KeywordTableIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='simple')
```

### `KeywordTableRAKERetriever`

可以使用下面命令定义它：

```ini
index = KeywordTableIndex.from_documents(documents)
retriever = index.as_retriever(retriever_mode='rake')
```

与前一个 retriever 类似，这个 retriever 使用 RAKE 方法高效提取相关关键词。

我们可以使用几个通用参数来设置 `KeywordTableIndex` 的 retrievers：

**query_keyword_extract_template**：覆盖用于从查询文本中提取关键词的默认 prompt。只有基于 LLM 的 default 模式实际使用这个参数；simple 和 rake 模式会忽略它。

**keyword_extract_template**：允许你为文档侧关键词提取提供自定义 prompt。

**max_keywords_per_query**：设置可以从单个查询中提取的最大关键词数量，默认值为 `10`。这个参数有助于控制查询复杂度。

**num_chunks_per_query**：限制单次查询检索的节点数量，默认值为 `10`，有助于限制被处理的数据量。

**llm**：允许你向基于 LLM 的 retriever 传入自定义 LLM 对象，而不是使用全局 `Settings.llm`。simple 和 rake 模式会忽略这个参数。

## `PropertyGraphIndex` 的 retrievers

这种索引会构建一个由 triplets 组成的图。每个 triplet 由 subject、predicate 和 object 组成。subject 是被陈述的实体或概念。predicate 是连接 subject 与 object 的关系或动词，描述二者如何相关。object 是被 predicate 连接到 subject 的实体或概念。

查询知识图谱的主要结构是 `PropertyGraphIndex`，它已经取代了较旧的 `KnowledgeGraphIndex`。这个新索引提供了更加模块化且灵活的检索系统。它不再是一个内部包含多个模式的单一 retriever，而是依赖两个 sub-retrievers，每个都专注于不同策略。它们通过一个叫做 `PGRetriever` 的智能复合 retriever 组合在一起。

### 默认 `PGRetriever` 的行为

要实例化一个 `PGRetriever` 对象，我们采用与前面讨论过的其他 retrievers 相同的方法：

```ini
index = PropertyGraphIndex.from_documents(documents)
retriever = index.as_retriever()
```

这个调用会构建一个 `PGRetriever`，它本质上是一个混合 retriever，默认结合两种互补策略：

**LLMSynonymRetriever**：这个 sub-retriever 使用由 LLM 驱动的同义词扩展，执行类似关键词的检索。

**VectorContextRetriever**：这个 sub-retriever 执行基于 embedding 的检索，并且只有当 embedding 模型可用，并且 graph store 或提供的 `vector_store` 支持 vector queries 时才会使用。

如果你在 LlamaIndex 早期版本中使用过 `KGTableRetriever` 或 `KnowledgeGraphRAGRetriever`，需要知道这两个 retriever 都已经废弃。它们的能力已经被重构为更加模块化的构建块，也就是 `LLMSynonymRetriever` 和 `VectorContextRetriever`。你可能应该考虑重构代码以适应这些变化。

**图 6.11 —— `PropertyGraphIndex` 默认 retriever（`PGRetriever`）的内部工作机制**

每个 sub-retriever 都会根据自己的逻辑返回相关节点，`PGRetriever` 会在结果返回前进行去重。

所有 retriever 都以 `NodeWithScore` 对象形式返回结果。不过，在这个上下文中，score 字段通常保持未设置，即 `None`。一般而言，除非直接使用 embedding similarity，否则 LlamaIndex 不依赖数值 scoring。如果没有找到相关节点，retriever 会直接返回空列表，不会返回占位节点。

为了避免冗余处理，请记住关键词在提取过程中会被规范化，也就是首字母大写，因此查询大小写不再影响检索。例如，`where is the colosseum?` 和 `Where is the Colosseum?` 会产生相同结果。

### 定制 `PropertyGraphIndex` retrievers

正如我前面解释过的，`PGRetriever` 是一个编排器，它会运行你提供给它的任何 sub-retriever 列表。如果你想改变整体检索过程的执行方式，可以调整表 6.1 中展示的 `PGRetriever` 三个参数：

| 参数 | 目的 | 默认值 |
| --- | --- | --- |
| num_workers | 决定 retriever 异步运行时使用的并行任务数量。 | 4 |
| use_async | 决定是否并发调度 sub-retrievers，True 为并发，False 为逐个运行。 | True |
| show_progress | 开启或关闭 tqdm 进度条，在调试长查询时可能很方便。 | False |

**表 6.1 —— `PGRetriever` 可定制参数列表**

要理解单个 sub-retriever 提供的选项，请看表 6.2：

| 参数 | 使用者 | 目的 | 默认值 |
| --- | --- | --- | --- |
| max_keywords | LLMSynonymRetriever | 限制 LLM 从用户查询中生成多少关键词或同义词。 | 10 |
| include_text | LLMSynonymRetriever, VectorContextRetriever | 决定是否将原始源文本附加到每条返回路径上。True 返回原始文本，False 只返回节点元数据。 | TRUE |
| path_depth | LLMSynonymRetriever, VectorContextRetriever | 决定在构建答案上下文时，retriever 应该从每个匹配节点向外探索的最大跳数。 | 1 |
| similarity_top_k | VectorContextRetriever | 决定 vector search 步骤中要检查的最大最近邻节点数量。 | 2 |

**表 6.2 —— `LLMSynonymRetriever` 和 `VectorContextRetriever` 的可定制参数**

还有一件重要的事情需要强调：所有使用 LLM 并接受 prompt 定制参数的 retriever 中，这些参数，例如关键词提取、同义词扩展、查询 refine，都会接受 `BasePromptTemplate` 类型的 template。

### 使用基于 Cypher 的 sub-retrievers

一些图数据库，例如 Neo4j、Memgraph 和 Amazon Neptune，能够理解 Cypher 查询语言，这是一种面向图的 SQL 等价物。如果你的 `PropertyGraphIndex` 指向这样的后端，就可以使用表 6.3 中描述的 Cypher-aware retrievers：

| Sub-retriever | 何时使用 | 做什么 |
| --- | --- | --- |
| TextToCypherRetriever | 当你希望 LLM 从零编写完整 Cypher 查询时。 | 将自然语言问题 + schema 转换成 Cypher，执行它，并以节点形式返回结果。 |
| CypherTemplateRetriever | 当你有固定 Cypher 模板，只希望 LLM 填入参数时。 | 锁定查询形状，只允许 LLM 填充占位符，比自由形式更安全。 |

**表 6.3 —— `PropertyGraphIndex` 的基于 Cypher 的 sub-retrievers**

为了让大量 retriever 更容易比较，表 6.4 总结了本章讨论的主要选项。它不是重复每个参数或实现细节，而是关注开发者一开始最可能问的三个实际问题：这个 retriever 适用于哪类索引，它依赖什么检索机制，以及在哪类场景中最有用。你可以把它看作一个快速参考指南，与周围章节中的详细解释互为补充。

| Retriever | 核心机制 | 最佳使用场景 |
| --- | --- | --- |
| VectorIndexRetriever | 嵌入查询，并从 vector store 中检索最相似节点 | 面向自然语言查询的通用语义检索 |
| VectorIndexAutoRetriever | 使用 LLM 推断更好的 vector-store 查询，通常包括结构化过滤条件 | 面向半结构化数据的查询，尤其是用户不知道元数据 schema 时 |
| SummaryIndexRetriever | 返回所有节点，不排序也不过滤 | 小型数据集、完整上下文审查、摘要 |
| SummaryIndexEmbeddingRetriever | 使用 embedding similarity 返回最相关节点 | 在 SummaryIndex 上进行语义检索 |
| SummaryIndexLLMRetriever | 使用 LLM 从批次中选择最相关节点 | LLM 判断有用的上下文检索 |
| DocumentSummaryIndexLLMRetriever | 使用 LLM 选择最相关文档摘要 | 大型文档集合，其中摘要可以作为有用的第一层过滤 |
| DocumentSummaryIndexEmbeddingRetriever | 对 summary nodes 使用 embedding similarity | 对嵌入后的文档摘要进行快速语义检索 |
| TreeSelectLeafRetriever | 使用基于 LLM 的选择递归遍历树，直到到达相关叶节点 | 层级数据，其中通过摘要逐步遍历很有用 |
| TreeSelectLeafEmbeddingRetriever | 使用 embedding similarity 递归遍历树来选择节点 | 层级数据，其中语义相似度优于基于 LLM 的选择 |
| TreeAllLeafRetriever | 返回所有叶节点 | 穷尽式检索，当你不希望树遍历过滤任何内容时 |
| TreeRootRetriever | 从根层级检索，假设答案已经在那里被总结 | 根摘要已经包含所需答案的场景 |
| KeywordTableGPTRetriever | 使用 LLM 从查询中提取关键词，然后检索匹配节点 | 带 LLM 辅助关键词提取的关键词驱动检索 |
| KeywordTableSimpleRetriever | 使用简单 regex 风格关键词提取 | 不产生 LLM 成本的快速轻量关键词检索 |
| KeywordTableRAKERetriever | 使用基于 RAKE 的关键词提取 | 适合 RAKE 风格关键词提取的 sparse retrieval |
| PGRetriever | 编排多个 graph sub-retrievers 并合并结果 | property graph 上的通用查询 |
| LLMSynonymRetriever | 使用 LLM 生成关键词或同义词来扩展查询 | 当实体可能以不同方式表达时的图检索 |
| VectorContextRetriever | 对 graph nodes 或 paths 使用 embeddings | 当 embeddings 可用时，对图数据进行语义检索 |
| TextToCypherRetriever | 使用 LLM 根据用户请求和 graph schema 生成 Cypher 查询 | 支持 Cypher 的图后端，需要灵活自然语言图查询时 |
| CypherTemplateRetriever | 使用固定 Cypher 模板，并让 LLM 填充参数 | 当你希望更严格控制查询结构时的更安全 Cypher 查询 |
| BM25Retriever | 使用 BM25 基于词项排序，而不是 embeddings | 精确术语、引用、代码以及关键词密集型查询 |

**表 6.4 —— LlamaIndex 中主要 retriever 的实用对比**

至此，我们已经介绍了每种 retriever 之间的差异。现在，让我们看看它们共同具备什么。

## 所有 retriever 共享的共同特征

所有 retriever 都接受直接 query，或 `QueryBundle` 对象作为参数。`QueryBundle` 是一种通用机制，像一个查询信封。它可以保存原始文本、任何预计算 embeddings、可选 metadata filters，甚至多模态输入，例如一张图片加一个 caption。`QueryBundle` 可用于更高级使用场景，例如基于 embeddings 搜索，或者在多模态场景中搜索图像和/或文本。

此外，所有 retriever 都接受 `callback_manager` 参数。

正如我们所看到的，一些 retriever 使用 embedding 模型或 LLM 查询来识别最相关节点。不过，从核心上看，这里列出的所有 retriever 类型都是 `BaseRetriever` 的子类。这意味着它们都继承主 `retrieve()` 方法，以及用于异步操作的 `aretrieve()`。

## 高效使用检索机制——异步操作

为了简单起见，到目前为止我们讨论的所有代码示例都使用了同步方法。虽然同步，也就是串行化的运行模式线性、易于理解且可预测，但在现代应用中，性能和低延迟对于提供优秀用户体验非常重要。

```python
import models_config
import asyncio
from llama_index.core import KeywordTableIndex
from llama_index.core import SimpleDirectoryReader

async def retrieve(retriever, query, label):
    response = await retriever.aretrieve(query)
    print(f"{label} retrieved {str(len(response))} nodes")

async def main():
    reader = SimpleDirectoryReader('files')
    documents = reader.load_data()

    index = KeywordTableIndex.from_documents(documents)

    retriever1 = index.as_retriever(
        retriever_mode='default'
    )
    retriever2 = index.as_retriever(
        retriever_mode='simple'
    )

    query = "Where is the Colosseum?"

    await asyncio.gather(
        retrieve(retriever1, query, '<llm>'),
        retrieve(retriever2, query, '<simple>')
    )

asyncio.run(main())
```

## 构建更高级的检索机制

既然我们理解了 LlamaIndex 提供的基础组件，就可以构建越来越复杂的解决方案。一方面，我们已经讨论过的 retrievers 已经为知识库查询和 RAG 流程中的上下文增强提供了高效解决方案。另一方面，我们也会看到，还有许多更高级的检索方法，它们要么使用特定技术，要么巧妙组合已经讨论过的 retrievers。

### 朴素检索方法

LlamaIndex 默认提供快速查询方法。正如我们看到的，只需要几行代码，就可以摄取文档、创建节点，并构建例如 `VectorStoreIndex` retriever。然后，也可以非常容易地查询这个 retriever，使用基于相似度的技术返回最相关部分。

### 做个类比……

这几乎就像用一把锤子修理房子里所有东西。锤子是一种必要且易用的工具，但它并不总是每个问题的最佳解决方案。类似地，使用简化的提问方法可能对基础情况有效，但对于更复杂情况或需要更高精细度和适配性的具体需求，就不会那么有效。

对于大型数据集，naive methods 可能效率低下，要么返回太多无关结果，要么忽略重要信息。它们在响应时间和资源消耗方面也可能表现不佳。

此外，在真实世界中，数据在质量、结构和格式方面可能差异巨大。简单方法并不总能管理这种多样性并提取有价值信息。例如，如果我们要找的具体信息分散在文档中随机分布的小 chunk 中，结果就会低于预期。

因此，对于更复杂情况，有必要探索更高级且更定制化的解决方案，这可能涉及调整检索算法，或以不同方式组合它们。

## 实现元数据过滤器

一个非常简单但也有效的检索机制，是根据元数据过滤检索到的节点。我们会处理一个组织中常见的实际问题，LlamaIndex 的检索功能非常适合解决它。

我们将实现一个检索系统，根据用户所属部门过滤返回节点。你可以把它想象成语言学中的多义性：一个词可能携带不同的、依赖上下文的含义。在我们的示例中，`incident` 对信息安全部门意味着一件事，对 IT 服务运营则意味着另一件事。元数据过滤器允许我们通过上下文消除歧义，并返回适合部门的定义。

首先，我们必须处理必要导入，并定义用户与部门之间的映射：

```javascript
import models_config
from llama_index.core.vector_stores.types import MetadataFilter, MetadataFilters
from llama_index.core import VectorStoreIndex
from llama_index.core.schema import TextNode

user_departments = {"Alice": "Security", "Bob": "IT"}
```

然后，我们必须定义两个节点，它们都存储 `incident` 这一概念的定义。区别在于元数据，它指定了该定义适用的部门：

```arduino
nodes = [
    TextNode(
        text=(
            "An incident is an accidental or malicious event that has the potential to cause unwanted effects on the security of our IT assets."
        ),
        metadata={"department": "Security"},
    ),
    TextNode(
        text=(
            "An incident is an unexpected interruption or degradation of an IT service."
        ),
        metadata={"department": "IT"},
    )
]
```

接下来，我们必须定义负责过滤和检索的函数：

```ini
def show_report(index, user, query):
    user_department = user_departments[user]

    filters = MetadataFilters(
        filters=[
            MetadataFilter(
                key="department",
                value=user_department
            )
        ]
    )

    retriever = index.as_retriever(filters=filters)
    response = retriever.retrieve(query)

    print(f"Response for {user}: {response[0].node.text}")
```

现在，如果我们在每个用户的上下文中运行同一个查询，就会根据用户所属部门得到不同答案：

```perl
index = VectorStoreIndex(nodes)
query = "What is an incident?"

show_report(index, "Alice", query)
show_report(index, "Bob", query)
```

输出如下：

```vbscript
Response for Alice: An incident is an accidental or malicious event that has the potential to cause unwanted effects on the security of our IT assets.
Response for Bob: An incident is an unexpected interruption or degradation of an IT service.
```

看到有多简单了吗？同样机制也可以用于控制信息访问并定义安全规则。

例如，在一个由多个客户共享的多租户知识库系统中，我们可以通过实现 `MetadataFilters` 来限制访问。

你前面看到的代码只做了简单过滤：它将搜索限制在 `department` key 的值等于用户部门的节点上。但还有一些更复杂的过滤变体，它们使用基于 `FilterOperator` 类的操作符。幸运的是，默认内置 vector store，也就是 `SimpleVectorStore`，支持 LlamaIndex 中几乎完整范围的操作符，如表 6.5 所列：

| 符号操作符 | 编程等价形式 | 描述 |
| --- | --- | --- |
| EQ | == | 等于，默认 |
| GT | > | 大于 |
| LT | < | 小于 |
| NE | != | 不等于 |
| GTE | >= | 大于或等于 |
| LTE | <= | 小于或等于 |
| IN | in | 在数组中 |
| NIN | not in | 不在数组中 |
| ANY | n/a | 数组字段包含给定值中的任意一个 |
| ALL | n/a | 数组字段包含所有给定值 |
| TEXT_MATCH | n/a | 全文子串 / token 匹配，区分大小写 |
| CONTAINS | n/a | 数组字段包含特定值 |
| IS_EMPTY | n/a | 字段缺失、为 null 或为空数组 |

**表 6.5 —— `FilterOperator` 可用操作符完整列表**

下面是一个示例，我们使用 filter operators 和 filter aggregation conditions 实现更复杂场景：

```ini
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
    FilterOperator,
    FilterCondition
)

filters = MetadataFilters(
    filters=[
        MetadataFilter(
            key="department",
            value="Procurement"
        ),
        MetadataFilter(
            key="security_classification",
            value="<user_clearance_level>",
            operator=FilterOperator.LTE
        ),
    ],
    condition=FilterCondition.AND
)
```

在这个示例中，我们实现了一个非常简单的访问控制机制，基于 clearance level 和 security classification。只有属于特定部门，并且 classification level 小于或等于用户访问级别的节点才会被返回。接下来，我们会讨论另一种方法。

## 使用 selectors 实现更高级的决策逻辑

在高级用户交互系统中，用户可能提出各种各样的问题。例如，他们可能提出非常具体的问题，寻找一个精确定义。其他时候，用户可能寻找更一般的信息，或者要求系统总结或比较两篇文档。

在这种复杂情况下，应该使用哪个 retriever？显然，最佳实现应该基于许多检索系统的综合能力。但这也隐含意味着，RAG 应用必须有一个内部选择机制，根据查询选择最合适的 retriever。这就引出了本节主题：使用 selectors。

在 LlamaIndex 中，它们有五种不同形式：`LLMSingleSelector`、`LLMMultiSelector`、`EmbeddingSingleSelector`、`PydanticSingleSelector` 和 `PydanticMultiSelector`。

它们的工作方式略有不同。根据名称可以看出，有些依赖 LLM 的决策能力，有些基于相似度计算从选项列表中选择特定选项，还有一些使用 Pydantic 对象返回选择。有些从列表中返回单个选项；另一些可能从选项列表中返回多个选择。不过，最终它们的结果或多或少是一样的：帮助我们在开发的应用中实现高级条件逻辑。它们可以评估复杂条件，并决定应用应该遵循哪个逻辑分支，就像一个 IF … THEN 决策块，但能处理复杂得多的场景。

下面的图可以帮助我们更好地理解 selector 在 RAG 应用逻辑中的角色。图 6.12 提供了 `LLMSingleSelector` 如何工作的视觉表示：

**图 6.12 —— `LLMSingleSelector` 可视化**

下面是一个非常简单的 selector 实现，它使用 LLM 从预定义选项列表中返回单个选项：

```ini
import models_config
from llama_index.core.selectors.llm_selectors import LLMSingleSelector

options = [
    "option 1: this is good for summarization questions",
    "option 2: this is useful for precise definitions",
    "option 3: this is useful for comparing concepts",
]

selector = LLMSingleSelector.from_defaults()
```

在这部分代码中，我们将选项定义为字符串列表，并通过 `.select()` 方法发送给 LLM。`.select()` 方法接收定义好的选项和用户查询作为参数：

```ini
decision = selector.select(
    options,
    query="What's the definition of space?"
).selections[0]

print(decision.index+1)
print(decision.reason)
```

在底层，selector 使用一个专门构造的 prompt，要求 LLM 基于查询从列表中选择最佳选项。

作为响应，selector 返回一个 `SingleSelection` 对象，其中包含被选中选项的编号，以及做出该选择的理由。正如你所看到的，selector 并不是 retriever 专用的东西。

在真实应用中，你会使用 `decision.index` 从对应的 retrievers 或 tools 列表中进行选择，例如：

```ini
chosen_retriever = list_of_retrievers[decision.index]
```

然后使用被选中的 retriever 处理查询。

你可能已经注意到，在这个示例中我们甚至没有定义 retriever。这是因为我想展示这个机制是通用的，可以用于应用中任何想实现的条件逻辑。返回的选项编号可以帮助我们从 parsers、indexes、retrievers 等列表中进行选择。在这个简单版本中，selector 只是从定义可用选项的字符串列表中做选择。

还有一种更高级的选择形式，涉及使用 `ToolMetadata` 类。不过，要理解这个概念，我们首先需要澄清什么是 tool。

## 理解 tools

agentic functionality 的一个核心元素是 tool——一种支持上下文决策的通用容器。它可以封装应用在运行时动态调用的多种功能。

LlamaHub 中已经开发并提供了丰富的 tools 集合：[llamahub.ai/?tab=tools。…](https://llamahub.ai/?tab=tools%E3%80%82%E8%BF%99%E4%BA%9B) tools 可以执行各种具体功能，从编写并发送电子邮件，到查询各种 API 或与计算机文件系统交互。

```ini
import models_config
from llama_index.core.selectors import LLMMultiSelector
from llama_index.core.retrievers import RouterRetriever
from llama_index.core.tools import RetrieverTool
from llama_index.core import (
    VectorStoreIndex, SummaryIndex, SimpleDirectoryReader
)

documents = SimpleDirectoryReader("files").load_data()

vector_index = VectorStoreIndex.from_documents([documents[0]])
summary_index = SummaryIndex.from_documents([documents[1]])

vector_retriever = vector_index.as_retriever()
summary_retriever = summary_index.as_retriever()
```

正如前面的代码片段所示，首先，我们从 GitHub 仓库的 `files` 子文件夹中取出两个示例文件。第一个文件包含关于古罗马的信息，第二个是关于狗的通用文本。然后，我们为每个文件创建一个索引，并从每个索引创建一个 retriever。现在，我们必须定义 tools：

```ini
vector_tool = RetrieverTool.from_defaults(
    retriever=vector_retriever,
    name="rome_tool",
    description="Use this for answering questions about Ancient Rome"
)

summary_tool = RetrieverTool.from_defaults(
    retriever=summary_retriever,
    name="dogs_tool",
    description="Use this for answering questions about dogs"
)
```

正如你所看到的，我们将每个 retriever 包装进 `RetrieverTool` 中，并添加了清晰描述，供 selector 使用。接下来，我们必须构建 `RouterRetriever`：

```ini
retriever = RouterRetriever(
    selector=LLMMultiSelector.from_defaults(),
    retriever_tools=[
        vector_tool,
        summary_tool
    ]
)

response = retriever.retrieve(
    "What can you tell me about the Ancient Rome?"
)

for r in response:
    print(r.text)
```

```arduino
retriever.retrieve("What can you tell me about the Ancient Rome?")
```

这会使用 `vector_tool` 进行检索。

现在，看下面这段代码：

```arduino
retriever.retrieve("Tell me all you know about dogs")
```

这会调用 `summary_tool`。因为我们使用的是 `LLMMultiSelector`，所以也可以处理两个 retriever 都应该被使用的情况，例如：

```arduino
retriever.retrieve("Tell me about dogs in Ancient Rome")
```

不同于 `LLMSingleSelector`，`LLMMultiSelector` 可以同时从 selector 列表中选择多个选项，从而覆盖多个使用场景。类似地，我们也可以通过 `RouterQueryEngine` 在 query engine 层级定义更复杂 routers。

但首先，我们还需要介绍其他几种高级 retriever 形式。

## 转换和重写查询

在上一节中，我们看到如何使用 selectors 和 router 概念，让应用决定使用哪个 retriever。

我们的 RAG 应用还可以使用另一个非常强大的工具：`QueryTransform` 结构。它允许我们在使用查询访问索引之前，对查询进行重写和修改，如图 6.13 所示：

**图 6.13 —— `QueryTransform` 改善检索过程**

让我们想象一个可能需要 `QueryTransform` 功能的场景。

### 实际示例

一个为复杂软件提供技术支持的 chatbot：用户经常用模糊或非技术性的语言描述问题。`QueryTransform` 可以解释这些描述，将它们拆解成更具体的子查询，或用更匹配文档的技术术语对其进行丰富。例如，类似 `My computer keeps freezing` 的查询，可以被转换成更具体的查询，例如 `Troubleshooting steps for operating system freezes`。

我们可以使用几种 `QueryTransform` 变体。每种都有其在增强信息检索过程中的特定角色。让我们逐个看看：

**IdentityQueryTransform**：这是一个基础 transform，不修改查询。它会原样返回接收到的查询，不进行任何转换。当不需要特定转换，希望保持默认或基础行为时，它很有用。

**HyDEQueryTransform**：Hypothetical Document Embeddings（HyDE）会将查询转换成由 LLM 生成的假想文档。这个想法是生成假想查询答案，并将它们用作 embedding strings。默认情况下，HyDE 会在 embedding set 中保留原始查询，因此 retriever 在执行相似性搜索时，既能受益于用户精确措辞，也能受益于由 LLM 生成的、被丰富过的假想内容。这可以帮助提升结果相关性。这个方法会过滤掉不准确细节，同时将生成响应锚定在真实内容中。你可以阅读下面论文了解更多使用这种技术的好处：Gao, Luyu; Ma, Xueguang; Lin, Jimmy; Callan, Jamie (2022). *Precise Zero-Shot Dense Retrieval without Relevance Labels*. arXiv:2212.10496v1 [cs.IR]. [arxiv.org/abs/2212.10…](https://arxiv.org/abs/2212.10496%E3%80%82)

**DecomposeQueryTransform**：这种 transform 会将复杂查询拆解成更简单、更聚焦的子查询。这可以让索引更容易处理查询，并增加找到相关节点的机会，尤其是在索引结构没有针对复杂或模糊查询优化时。

**ImageOutputQueryTransform**：这个方法会添加以图片格式化结果的指令，例如生成 HTML `<img>` 标签。它适用于查询结果预期以图像形式展示，或输出只是更复杂逻辑中的中间步骤，并且必须进一步以特定格式处理的场景。

不同于列表中的其他 transforms，`ImageOutputQueryTransform` 并不会修改查询以改善检索。相反，它是一个专注于满足特定展示需求的格式化输出工具。

**StepDecomposeQueryTransform**：它类似于 `DecomposeQueryTransform`，但会增加额外一层：在分解查询时考虑之前的推理或上下文。这有助于基于反馈或之前结果持续 refine 查询，从而提高检索准确性。不过，请记住，虽然它很有前景，但仍是一个实验功能，在生产应用中可能无法产生有用结果。

让我们看一个实际示例，以更好地理解这类 transform 如何工作：

```python
import models_config
from llama_index.core.indices.query.query_transform.base import DecomposeQueryTransform

decompose = DecomposeQueryTransform()

query_bundle = decompose.run(
    "Tell me about buildings in ancient Rome"
)

print(query_bundle.query_str)
```

运行代码后，`DecomposeQueryTransform` 会接收我们原始且相当模糊的查询。然后，它使用一个专门设计的 prompt，通过 LLM 生成一个更精确的查询。在我们的示例中，输出应该类似如下：

```sql
What were some famous buildings in ancient Rome?
```

你可以立刻看到，新查询清晰得多，并大大增加了 retriever 从索引中生成正确上下文的概率。

## 创建更具体的子查询

增强查询的另一种有用方法，是生成子查询。有时候，一个模糊或非常复杂的问题，在被拆分成几个具体问题之后，会变得清楚得多。LlamaIndex 通过几个专门构建的 query generators 来帮助我们完成这个任务：[llamahub.ai/?tab=questi…](https://llamahub.ai/?tab=question_gen%E3%80%82)

LlamaIndex 还提供 `OpenAIQuestionGenerator`，这是专门为 OpenAI 模型构建的变体，原生支持 Pydantic schema parsing。不过，使用它需要有效的 OpenAI API key，这并不适用于本书中使用的示例。

下面是我们之前在“使用 selectors 实现更高级的决策逻辑”一节中讨论 selectors 和 routers 时用过的代码。这一次，我们会稍微调整它，用来展示 `LLMQuestionGenerator` 如何工作：

```javascript
import models_config
from llama_index.core.question_gen.llm_generators import LLMQuestionGenerator
from llama_index.core.tools import RetrieverTool, ToolMetadata
from llama_index.core import VectorStoreIndex, SummaryIndex, SimpleDirectoryReader, QueryBundle

documents = SimpleDirectoryReader("files").load_data()

vector_index = VectorStoreIndex.from_documents([documents[0]])
summary_index = SummaryIndex.from_documents([documents[1]])
```

到目前为止，代码与前面的示例相同。我们读取 `files` 子文件夹中的两个文件，然后为每个文档创建一个索引。

接下来，对于每个索引，我们在 `ToolMetadata` 结构中定义名称和描述。这些信息会被 `LLMQuestionGenerator` 用来理解每个 retriever 的角色，以及它可能回答什么类型的问题：

```ini
vector_tool_metadata = ToolMetadata(
    name="Vector Tool",
    description="Use this for answering questions about Ancient Rome"
)

summary_tool_metadata = ToolMetadata(
    name="Summary Tool",
    description="Use this for answering questions about dogs"
)
```

接下来，我们定义两个 retrievers：

```ini
vector_tool = RetrieverTool(
    retriever=vector_index.as_retriever(),
    metadata=vector_tool_metadata
)

summary_tool = RetrieverTool(
    retriever=summary_index.as_retriever(),
    metadata=summary_tool_metadata
)
```

现在进入子查询生成部分。首先，我们用默认设置初始化一个 `LLMQuestionGenerator` 对象。然后，我们构建一个 `QueryBundle` 对象，用来包含从用户那里收到的原始查询。这个 `QueryBundle` 会作为参数传给 question generator：

```ini
question_generator = LLMQuestionGenerator.from_defaults()

query_bundle = QueryBundle(
    query_str="Tell me about dogs and Ancient Rome"
)

sub_questions = question_generator.generate(
    tools=[vector_tool.metadata, summary_tool.metadata],
    query=query_bundle
)
```

正如你所看到的，sub-query generator 接收两个参数：它可用的 tools 列表，以及原始查询，后者可以用来构建更具体查询。

代码下一部分会遍历生成的问题，并显示结果：

```python
for sub_question in sub_questions:
    print(f"{sub_question.tool_name}: {sub_question.sub_question}")
```

最终，生成的问题可能类似如下：

```yaml
Summary Tool: What are the different breeds of dog?
Summary Tool: What was the role of dogs in ancient Rome?
Vector Tool: What were the most important events in Ancient Rome?
Vector Tool: What were the most famous buildings in ancient Rome?
```

`LLMQuestionGenerator` 接收初始查询，并使用 LLM 返回一组更具体的问题。现在，这些问题可以被传给合适的 retriever tool，以便进行更聚焦且更准确的检索。像这样使用子查询，可以显著提升检索质量，因为每个具体问题通常会得到更强的上下文窗口和更少噪音，而不是宽泛、模糊的输入。

`sub_questions` 变量中返回的答案，是 `SubQuestion` item 的列表。`SubQuestion` 是一个简单类，包含两个属性：`tool_name` 和 `sub_question`。现在，我们可以遍历列表中的所有 item，获取我们想要的 tools 和 questions。

在实践中，使用前面示例中更具体的查询，通常会让 retriever 生成更多上下文，因此也更可能从 `QueryEngine` 得到更高质量答案。

同一组 question generators 中还包含 `GuidanceQuestionGenerator`。这个机制使用 LLM 创建辅助问题来引导 query engine。当你处理需要拆解并按特定顺序处理的复杂查询时，它可能非常有用。你可以在这里找到使用 `GuidanceQuestionGenerator` 的示例：

表 6.6 对三种 generator 进行了并排比较：

| Generator | LLM 兼容性 | 输出解析 | 典型使用场景 | 是否需要 OpenAI API |
| --- | --- | --- | --- | --- |
| LLMQuestionGenerator | 任意 LLM，本地或 API | 结构化输出 parser | 通用子查询生成 | 否 |
| OpenAIQuestionGenerator | 仅 OpenAI 模型 | Pydantic schema | 与 OpenAI tools / function-calling 工作流一起使用 | 是 |
| GuidanceQuestionGenerator | 任意 LLM | 分步骤辅助问题 | 复杂查询拆解 | 否 |

**表 6.6 —— 不同 generator 的比较**

子查询生成后，可以在专门构造的 query engine 中使用它们。

## 理解 dense retrieval 和 sparse retrieval 的概念

正如我们所看到的，检索方法是 RAG 系统中的关键组件。它们能够为查询识别和排序相关内容，而这是从 LLM 生成有用答案的第一步。在 RAG 应用开发旅程中，你很可能会遇到两种主流检索范式：dense retrieval 和 sparse retrieval。这些概念非常重要，本节将重点讨论它们的特征、取舍，以及组合它们的好处。

### Dense retrieval

dense retrieval 方法依赖 embedding vectors，在连续高维空间中表示文本。使用 embedding models，文本会被编码成固定长度的数值向量，这些向量旨在捕捉语义含义。查询也会被编码，以便使用几何操作衡量查询与节点向量之间的相似度。在 dense retrieval 中，节点会被嵌入为向量，并存储在专门索引中，例如 `VectorStoreIndex`。

我们称这些向量为 dense，是因为它们通常密集填充了非零值，以紧凑形式表示丰富且细腻的语义信息。

专门的索引解决方案，例如 Pinecone vector database 提供的方案：[www.pinecone.io/product/](https://www.pinecone.io/product/)，还允许在数百万向量上进行闪电般快速的相似度搜索。延迟范围从毫秒到不到一秒，并且可以轻松扩展。

**计算成本**：对大量数据进行 embedding 和索引，可能计算成本高昂且耗时。

**precision 与 recall 之间的取舍**：dense retrieval 系统有时会偏向 recall 而牺牲 precision，或相反，这取决于 embedding 模型如何调优。在检索所有相关文档与避免检索太多无关文档之间找到正确平衡，可能很困难。

**难以处理长文档**：生成固定长度向量的 dense models 有时难以处理非常长的内容，因为重要信息可能在 embedding 过程中被稀释或丢失。

**逻辑推理缺口**：虽然这些方法非常擅长捕捉语义相似度，但它们通常缺乏逻辑推理能力。这意味着，它们可以识别与查询语义相似的节点，但可能难以理解需要超越这种模式匹配的上下文或逻辑关系。因此，它们可能检索到表面上与查询相关，但实际上并不真正符合用户意图的数据，尤其是在查询需要理解复杂关系或细腻推理时。

**依赖模型质量**：dense retrieval 系统的效果高度依赖底层 embedding 模型的质量。训练不佳的模型可能导致次优检索表现。

### Sparse retrieval

sparse retrieval 方法将文本与关键词关联起来。这些方法基于查询与文本之间的精确关键词匹配或重叠。

一般过程涉及通过分析文本中的重要术语来建立索引。随后，这些关键词会被记录到 inverted indexes 中。inverted indexes 是一种用于快速检索包含给定关键词的 chunk，也就是节点的数据结构。

在检索阶段，查询会针对这些 inverted indexes 执行搜索，以找到与查询共享关键词的 chunks。chunks 会基于查询和每个已索引 chunk 之间识别出的共同术语数量进行排序。sparse retrieval 中最常用的技术之一，是词频-逆文档频率，也就是 TF-IDF 方法。

### sparse retrieval 中的 TF-IDF

TF-IDF 是一种数值统计指标，反映一个词对于文档集合中每篇文档的重要程度。这种方法会将文本转换成一种数值表示，用来捕捉词语在文档中的重要性，同时考虑它们在单篇文档中的频率，以及在整个文档集合中的分布。

词频（TF）衡量一个术语在一篇文档中出现的频率，并根据文档中的术语总数进行归一化。它的计算方式是：用某个特定术语，也就是一个词，在文档中出现的次数，除以该文档中的总词数。这表示该术语在特定文档中的重要性。

逆文档频率（IDF）评估术语在整个集合中的重要性。它通过取总文档数量与包含该术语的文档数量之比的对数来计算。这有助于降低那些在许多文档中非常频繁出现的术语的重要性。像 `the` 或 `is` 这样的常见词会出现在许多文档中，信息量较低，因此 IDF 分数较低。独特术语则具有更高 IDF 分数。

TF-IDF score 通过将 TF 与 IDF 相乘得到，表示每个术语在文档中的重要性，并根据其在集合中的常见程度进行调整。在 sparse retrieval 中，每篇文档会表示为高维空间中的向量，其中每个维度对应一个独特术语，值是 TF-IDF score：[en.wikipedia.org/wiki/Tf%E2%…](https://en.wikipedia.org/wiki/Tf%E2%80%93idf%E3%80%82)

我们称它为 sparse，是因为在这个高维向量空间中，对于任意给定文档，大多数维度，也就是术语，值都会是零，表示集合中的大多数术语并没有出现在该文档中。如果我们可视化这些向量，就会得到一种稀疏表示，其中包含许多零，因为大多数文档只包含集合总词汇表中的一小部分词。

检索期间，查询也会被转换成 TF-IDF 向量表示。每篇文档与查询的相关性会使用余弦相似度等度量进行计算，并据此排序。随后，返回与查询相似度最高的 top-ranked documents。

像 TF-IDF 这样的 sparse retrieval 方法，对于精确术语匹配很重要的任务特别有效。不过，它们可能无法捕捉文本语义含义或术语使用上下文，而这可以通过 dense retrieval 这类更高级检索技术来解决。

**高效处理大型数据集**：sparse retrieval 方法，例如 TF-IDF，通常更擅长处理大型数据集。inverted index 结构允许基于关键词匹配快速搜索和检索文档，因此适合大型文本集合。

**高 precision**：当精确术语匹配非常关键时，sparse methods 通常提供高准确性。它们擅长检索包含用户查询中特定关键词的文档，这对关键词特异性非常重要的应用很有益。

**简单且可解释**：sparse retrieval 方法在概念上比 dense methods 更简单、更可解释。由于它们依赖显式关键词频率，因此更容易理解为什么某些文档会针对查询被检索出来。

**资源消耗较低**：不同于 dense retrieval，sparse methods 不需要复杂神经网络模型来生成 embeddings。这使它们在计算能力和内存需求方面资源消耗更低。这意味着它们更容易部署和维护。

**对模型变化依赖较少**：由于 sparse retrieval 不像 dense retrieval 那样依赖机器学习模型细微差异，因此通常对模型质量变化更稳健。在不同数据集上的表现更加可预测和一致。

sparse methods 也有自身局限。其中最重要的包括：

**缺乏语义理解**：sparse methods 可能无法捕捉词语之间的语义关系。它们可能错过那些上下文相关但没有与查询共享精确关键词匹配的文档。

**容易受到同义词和多义词影响**：这些方法难以处理 synonymy，也就是不同词具有相似含义，以及 polysemy，也就是词具有多重含义。这可能导致漏检或无关检索。

**无法捕捉上下文和细微差别**：sparse retrieval 无法有效捕捉语言中的更广泛上下文或细微差别，而这些对于理解查询背后的真实意图可能至关重要。

## 在 LlamaIndex 中实现 sparse retrieval

一个完美例子是 `BM25Retriever`，它实现了 Best Matching 25，也就是 BM25 检索算法。

BM25 是 TF-IDF 方法的一种改进，是用于 sparse retrieval 的更复杂算法。不同于 TF-IDF，BM25 同时考虑 term frequency 和 document length，从而对文档相关性评分提供更加细腻的方法。使用这个 retriever，节点会根据相对于查询的 BM25 scores 排序。BM25 分数最高的 top-k 节点会作为查询结果返回，为用户提供最相关结果。

让我们看一个如何使用 `BM25Retriever` 的示例。

要使用这个特定 retriever，你需要通过运行下面命令安装对应 LlamaIndex 集成包：

```perl
pip install llama-index-retrievers-bm25
```

这个包底层使用流行的 `rank-bm25` 库。安装完成后，你可以用下面示例代码测试：

```ini
import models_config
from llama_index.retrievers.bm25 import BM25Retriever
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core import SimpleDirectoryReader

reader = SimpleDirectoryReader('files')
documents = reader.load_data()

splitter = SentenceSplitter.from_defaults(
    chunk_size=60,
    chunk_overlap=0,
    include_metadata=False
)

nodes = splitter.get_nodes_from_documents(
    documents
)
```

我们使用的是最开始的两个示例文件，其中包含关于古罗马和不同狗品种的数据。在这个示例中，我使用了 `SentenceSplitter`，并配置了相对较小的 chunk size。这是因为示例文件体积较小，我想生成更细粒度、以句子为结构的节点，以便更好地展示 `BM25Retriever` 的工作方式。接下来，让我们实现 retriever：

```ini
retriever = BM25Retriever.from_defaults(
    nodes=nodes,
    similarity_top_k=2
)

response = retriever.retrieve("Who built the Colosseum? ")

for node_with_score in response:
    print('Text:'+node_with_score.node.text)
    print('Score: '+str(node_with_score.score))
```

在将两篇文档分块后，我们使用 retriever 应用 BM25 算法，并检索与关于 Colosseum 的查询最相关的两个 chunk。

你可以进一步实验这个示例，尝试调整 `similarity_top_k` 参数、查询或分块策略，以更好地理解这个 retriever 如何工作。

### 什么时候应该使用 sparse retrieval，而不是 dense retrieval？

假设我们构建了一个用于检索法律文档的系统。在这种场景中，用户查询很可能包含精确法律术语、引用或法律文本中的特定短语。假设用户输入查询：`Article 45 of the GDPR regarding personal data transfers on the basis of an adequacy decision.` 这个查询包含特定短语，例如 `Article 45` 和 `GDPR`，这些内容很可能以完全相同形式出现在相关法律文档中。

对于这类查询，sparse search 很可能提供非常准确的结果。它会准确定位包含 GDPR 中特定条款的文档，减少噪音和无关检索。考虑到法律文档通常具有结构化格式，包含不同章节和条款，sparse retrieval 方法可以高效解析这些结构化数据，并基于查询中发现的直接引用检索节点。

由于 dense retrieval 方法倾向于优先考虑一般含义，而不是精确术语匹配，因此在这种专业化、关键词特定查询中，结果可能不够准确。

除非专门在法律文本上训练，否则用于 dense retrieval 的 embedding 模型可能难以准确解释和匹配法律查询中使用的复杂法律术语和特定引用风格。

### 什么时候 dense retrieval 会是更好的选择？

下面是另一个实际例子。

dense retrieval 很可能产生更好结果的一个典型使用场景，是设计用于理解并回应广泛客户查询的客户支持 chatbot。假设这个 chatbot 的任务是帮助用户解决与技术产品相关的各种问题，例如硬件故障排查、软件功能、使用技巧，以及关于产品和服务的一般咨询。

用户可能会问这样一个问题：`My laptop battery is draining really quickly, even when I'm not using it much. What can I do about it?` 由于 dense search 擅长理解查询的语义上下文，在这种情况下，它可以理解 `battery drains really fast` 这类短语背后的更广泛含义，并将其关联到类似问题，即使知识库中并没有完全相同的短语。

另一方面，如果查询不包含支持文档中出现的特定关键词，sparse methods 可能表现不佳。在我们的例子中，用户可能使用与技术手册或 FAQ 中不同的术语来描述问题。

### 我们能在一个 retriever 中组合两种方法吗？

简短答案是可以。你可能已经猜到，我正在沿着这个方向铺垫。通过组合二者，我们可以获得两全其美：dense retrieval 的语义理解能力，加上 sparse retrieval 的关键词精确性。这通常被称为 hybrid retrieval，也是当今大多数生产级 RAG 系统使用的方法。LlamaIndex 已经直接支持在 vector indexes 上进行 hybrid retrieval，只需要在调用 `.as_retriever()` 时使用 `retriever_mode='hybrid'`。如果你使用的 vector store 支持它，例如 Pinecone 或 Qdrant，这是最简单的路径。如果想获得更多控制，也可以使用本章前面讨论过的 router 和 selector 模式手动构建 hybrid 系统，例如在 `RouterRetriever` 下组合 `BM25Retriever` 与 `VectorIndexRetriever`。

完整的 Pinecone 示例可以查看：

## 发现其他高级检索方法

除了刚才讨论的基础概念之外，还有几种其他高级检索方法值得熟悉。LlamaIndex 官方文档中有一个专门章节解释这些方法：

在这个链接中，你会了解到更多特殊技术，例如 small-to-big retrieval、recursive retrieval、retrieval from embedded tables、multi-modal retrieval、auto-merging retrieval 等。

逐一详细解释每种检索策略，远远超出了本书打算覆盖的范围，但这并不意味着它们不重要。毕竟，如果我们无法在 RAG 中有效提取所需上下文，那么摄取和索引原始文档就没有意义。

在开始重大项目前，请始终阅读最新版本的官方文档。事情发展太快，新方法和新技术出现得太快，浪费时间重复造轮子太可惜了。作为一个小故事，根据我的亲身经验，我曾花几个小时发明了一种与 small-to-big 方法非常相似的东西，结果几天后才发现，它已经是一个经过测试且有文档说明的技术。

## 调试常见检索问题

在真实世界 RAG 应用中，检索问题往往比明显失败更具欺骗性。retriever 可能仍然返回节点，但不是正确节点。最终答案可能听起来很有说服力，却建立在薄弱或无关上下文之上。因此，通常最好将检索与查询流水线的其余部分分开调试。在实践中，这意味着在引入 postprocessors 或 response synthesis 之前，先检查 `retriever.retrieve()` 的原始输出。LlamaIndex 的 retriever 接口正是为这种直接检查而设计的，并且还有专门的 retrieval evaluation 工具，可以独立于最终答案来衡量 retriever 质量。

一个好的第一步，是查看检索到的 `NodeWithScore` 对象本身。这允许我们回答几个非常简单但非常重要的问题：哪些节点被返回了？顺序是什么？它们是否来自我们预期的文档？它们是否包含我们以为存在的元数据？是否真的分配了 score？很多时候，仅仅打印这些信息，就能立即揭示问题是在检索阶段，还是发生在更下游。

```scss
import models_config
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("files").load_data()
index = VectorStoreIndex.from_documents(documents)

retriever = index.as_retriever(similarity_top_k=5)
results = retriever.retrieve("Who built the Colosseum?")

for i, item in enumerate(results, start=1):
    print(f"\nResult {i}")
    print("Score:", item.score)
    print("Node ID:", item.node.node_id)
    print("Metadata:", item.node.metadata)
    print(item.node.text[:30])
```

如果在这个阶段检索到的文本已经是错的，那么问题就不是 LLM。retriever 正在把弱上下文传入 RAG 流水线的其余部分，之后的所有步骤都会受到影响。

### 诊断无关节点

当返回无关节点时，第一个嫌疑通常应该是分块机制。如果节点太大，它们可能混合多个主题，使 dense retrieval 很容易匹配到文本中的错误部分。如果节点太小，关键信息可能被拆散到多个节点中，没有任何单个节点看起来足够相关。

换句话说，检索质量往往远早于 retriever 本身就已经开始决定了。它始于原始文档如何被分段。这也是为什么检索应该被视为一个端到端设计问题，而不仅仅是查询阶段关注点的主要原因之一。

第二件要检查的事情，是检索策略是否真正匹配查询性质。dense retrieval 非常擅长语义匹配，但对于精确引用、标识符、法律引用、产品代码或关键词密集型短查询来说，它并不总是最佳选择。在这些情况下，sparse retrieval 可能效果更好。正如前一节看到的，LlamaIndex 当前提供 `BM25Retriever` 用于这个目的，检索质量也可以通过组合 sparse 和 dense 信号的 hybrid 方法进一步提升。当一个查询高度依赖精确术语时，假设基于 embedding 的 retriever 会自动成为最佳解决方案，通常是个错误。

poor retrieval 的另一个常见原因，是过于激进或过于宽松的 `similarity_top_k` 设置。如果 top_k 太低，相关 chunk 可能刚好落在截断之外。如果 top_k 太高，retriever 可能会让流水线后续阶段被松散相关材料淹没。这可能让最终答案变得更差，而不是更好。

目前，实际建议很简单：先检查原始节点，一次只做一个改动，并使用同一组查询重新测试。LlamaIndex 的 retrieval evaluation 工具支持 hit-rate 和 mean reciprocal rank（MRR）等指标，当你从临时调试进入更结构化测量时，它们特别有用。

hit-rate 衡量正确节点是否出现在 top-k 结果中的任意位置，而 MRR 衡量第一个相关节点排得有多靠前。这些指标很有用，因为它们不仅告诉我们检索是否成功，也告诉我们结果排序是否有效。

还有一个非常实际的 sanity check，每当 retriever 看起来困惑时都值得做：尝试用稍微不同的形式提出同一个查询。问一个语义上更宽泛的版本，再问一个精确版本。例如，比较 `Tell me about Roman amphitheaters` 和 `Who built the Colosseum?`。如果精确版本有效，但更宽泛版本失败，问题很可能在于语义覆盖、chunk 质量或 embedding 质量。这意味着 retriever 可以匹配精确术语，但泛化能力不足。反过来，如果宽泛版本有效，而精确版本失败，retriever 可能在精确关键词匹配方面较弱，这意味着 sparse retrieval 或 hybrid retrieval 可能更合适。

### 诊断 metadata filter 问题

正如我们已经在本章看到的，metadata filters 可能非常有用。不过，当它们失败时，原因往往出奇简单。很多时候，filter 表达式本身没问题，问题出在已存储 metadata 上。key 名称可能与 retriever 期望的不同，某些节点上可能不存在该值，或者值可能以与预期不同的类型被存储。

最后一点很重要，因为 LlamaIndex metadata filters 使用严格值类型。以数字存储的 `2026` 与字符串 `"2026"` 并不相同，这种不匹配很容易导致 filter 返回空结果。

框架也支持更丰富的 filter operators，但后端支持仍然取决于所使用的 vector store。一个 filter 在框架层面可能是有效的，而某个特定 vector store 只支持其中一部分行为。

换句话说，LlamaIndex 为定义 metadata filters 提供了通用 Python 接口，但 filter 最终是由底层 vector store 执行的。由于不同 vector stores 支持不同过滤能力，一个在 LlamaIndex 中完全有效的 filter 表达式，仍然可能根据使用的存储引擎表现不同、只被部分支持，或需要额外后端特定配置。这就是为什么当 filter 没有按预期工作时，我们不仅要检查 LlamaIndex 代码，也要检查 vector store 本身的功能支持。

因此，调试 metadata filters 最安全的方法是增量式进行。先从单个 equality filter 开始。如果它有效，就再添加一个条件。然后测试类似 `GTE`、`IN` 或 `TEXT_MATCH` 这样的 operator。换句话说，不要一开始就用很大的复合 filter，然后在没有返回结果时假设整个表达式都错了。要一步一步缩小问题范围。

下面是我在前面某节中用于解释 metadata filtering 的代码示例的简化版本：

```ini
import models_config
from llama_index.core import VectorStoreIndex
from llama_index.core.schema import TextNode
from llama_index.core.vector_stores.types import (
    MetadataFilter,
    MetadataFilters,
)

nodes = [
    TextNode(
        text="An incident is an accidental or malicious event affecting security.",
        metadata={"department": "Security", "level": 2},
    ),
    TextNode(
        text="An incident is an interruption or degradation of an IT service.",
        metadata={"department": "IT", "level": 1},
    ),
]

index = VectorStoreIndex(nodes)

filters = MetadataFilters(
    filters=[MetadataFilter(key="department", value="Security")]
)

retriever = index.as_retriever(filters=filters)

results = retriever.retrieve("What is an incident?")

for item in results:
    print(item.node.metadata)
    print(item.node.text)
```

如果这返回预期节点，那么基础过滤路径就是工作的。从那里开始，你可以添加第二个 filter 或更改 operator。如果 retriever 突然开始返回空结果，你很可能已经识别出不匹配发生的确切位置。

第二个有用测试，是在有 filters 和没有 filters 的情况下运行同一个查询。如果无 filter 查询返回合理节点，但带 filter 查询返回空列表，那么问题很可能出在 metadata 或 filter 逻辑上，而不是 embeddings 或 similarity search。如果两个版本都失败，那么问题可能在其他地方。

### 诊断空结果或弱结果

有时，我们的 retriever 可能两手空空，没有找到任何与当前查询匹配的索引内容。乍一看，这似乎表明索引中没有相关节点。不过在实践中，并不总是这样。空结果也可能意味着查询太窄、filters 太严格、分块策略很差，或者所选检索方法不适合查询类型。

弱结果集与空结果一样有问题，尤其是当 retriever 返回的节点表面上相关，乍看合理，但实际上并不能回答问题时。

根据使用的索引类型不同，空结果或弱结果可能出于不同原因。在基于关键词的检索中，查询术语可能太具体或太罕见，没有任何索引节点包含这些精确术语。在基于 embedding 的检索中，相似性搜索可能只是没有在当前参数下识别出足够接近的匹配。在两种情况下，retriever 可能完全没有返回结果，或者返回的节点与查询只是松散相关。

在这些情况下，尝试三个快速实验通常很有帮助：

- 移除所有 filters 并重新运行查询。这有助于判断 retriever 是否被过度约束。
- 略微增加 `similarity_top_k` 并检查额外节点。有时相关上下文存在于索引中，但刚好落在初始 cutoff 之外。
- 分别用更宽泛的自然语言和更精确的术语重写查询。这些简单测试通常足以告诉我们，retriever 是遗漏上下文、限制过严，还是只是使用了错误的检索范式。

如果一个查询在使用与源文本中相同的具体词、名称、代码或短语时效果更好，那么 sparse retrieval 方法，例如 BM25，或 hybrid 设置，可能值得尝试。相比之下，如果当查询以更松散自然语言重述，用不同措辞表达同样大意时，retriever 表现更好，那么 dense retrieval 可能已经在正常工作，问题可能在于 chunking 或 ranking。

其他有用补救措施包括：

**Fallback mechanisms**：搜索系统可以设置 fallback 策略，例如通过调整 retriever 参数执行更一般的搜索，或向用户建议替代查询词。

**Query expansion**：可以自动扩展查询，包含同义词、相关术语或更广泛概念，以增加找到相关节点的机会。

**Relevance scoring**：即使没有找到精确关键词匹配，搜索系统也可以使用基于相似度的检索或排序方法，识别与查询语义相似或包含部分匹配的节点。

### 从临时调试转向系统化调试

到目前为止，我们讨论的技术都刻意保持简单：检查原始节点、比较有 filter 和无 filter 的查询，并尝试小的受控改动。当你还在建立直觉时，这正是正确方法。但随着应用变得更复杂，基于 print 的调试就不够了。一旦有多个 retrievers、routers、postprocessors 或异步工作流，你就需要一种更结构化的方式，来理解发生了什么，以及失败从哪里开始。

换句话说，检索调试最终应该变得基于证据，而不是基于直觉。如果用户报告答案无关，不要立即责怪 LLM。首先检查 retriever 是否返回了正确节点。如果 retriever 很弱，就改善检索。如果 retriever 没问题但答案仍然差，那么问题很可能属于后续阶段，例如后处理、排序，甚至响应合成。这种关注点分离，会成为严肃 RAG 开发中最重要的习惯之一。

当检索质量差时，不要急于一次性改变所有东西。先隔离 retriever。检查原始 `NodeWithScore` 对象。验证节点文本、排序和元数据。单独测试 filters。重写查询一两次。只有在那之后，才应该进入更大的变更，例如 hybrid retrieval、基于 router 的选择或 evaluation pipelines。在实践中，大多数检索 bug 一开始看起来神秘，但最终并没那么神秘。它们通常来自少数几个原因：chunking、filtering、ranking depth，或查询风格与检索策略不匹配。

本章信息已经够多了。我们现在先跳过 Contract Review Expert 的编码实践，等下一章积累更多信息之后，再为项目实现额外功能。

## 总结

此外，我们还介绍了 dense retrieval 和 sparse retrieval 这类基础范式，并讨论了它们的优缺点。我们也介绍了 LlamaIndex 中的实现，例如 `BM25Retriever`。最后，我们讨论了调试常见检索问题的实际方法，包括无关节点、metadata filter 问题，以及空结果或弱结果集。

