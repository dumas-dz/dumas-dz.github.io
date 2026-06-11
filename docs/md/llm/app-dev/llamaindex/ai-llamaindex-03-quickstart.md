---
title: LlamaIndex - 开启 LlamaIndex 之旅
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 快速开始
---

---

本章深入 LlamaIndex 的核心构建块：Document（文档）、Node（节点）、Index（索引）和 QueryEngine（查询引擎），并通过代码示例构建第一个 RAG 应用。

## 技术要求

你需要在环境中安装以下 Python 库，才能运行本章中的示例：

- Wikipedia：[wikipedia.readthedocs.io/en/latest/](https://wikipedia.readthedocs.io/en/latest/)

Wikipedia reader 需要它。

还需要以下 LlamaIndex 集成包：

- Wikipedia reader：[pypi.org/project/lla…](https://pypi.org/project/llama-index-readers-wikipedia/)

我们将使用它来摄取 Wikipedia 页面。

## 揭开 LlamaIndex 的核心构建块：文档、节点和索引

既然我们已经开始使用 LlamaIndex，现在是时候理解构成其架构的一些关键概念和组件了。你可以把本章看作对典型 LlamaIndex RAG 架构，以及这个框架提供的最重要工具的一次快速介绍。它应该能让你对如何构建一个简单的 RAG 应用形成基本理解。在接下来的章节中，我们会一步一步深入探索这里介绍的每一个组件。

## 文档

一切都始于数据。

直接处理原始数据可能就像用手捧水一样棘手。它通常四处分散，没有任何固定结构。这时就需要我们介入，给它一些形状。这正是我们在 LlamaIndex 中通过所谓的文档（documents）来做的事情。文档是 LlamaIndex 的一个组件，像数据容器一样工作。它捕获并包含任何类型的数据，无论这些数据是你手动输入的，还是从外部来源加载进来的。它就像把数据装进一个漂亮的瓶子里，让它更容易处理。

想象一下，你有一堆公司流程文档，以 PDF 形式保存，并且想用一个强大的语言模型来理解它们。在 LlamaIndex 中，每一个流程文档都会被转换成自己的 `Document` 对象——而且这并不仅仅针对文件。假设你有一些数据存放在数据库中，或者通过 API 传入，这些也可以成为文档。请看图 3.1 的视觉概览：

**图 3.1 —— 文档可以来自多个来源**

你可以把 `Document` 类看作一个容器。它不仅保存来自原始来源的原始文本或数据，还可以保存你决定附带的任何额外信息。这些额外信息被称为元数据（metadata），当你开始搜索文档时，它会带来巨大变化，因为它允许你非常具体地组织查询。

下面是一个手动创建文档的基础示例：

```ini
from llama_index.core import Document

text = "The quick brown fox jumps over the lazy dog."

doc = Document(
    text=text,
    metadata={'author': 'John Doe','category': 'others'},
    id_='1'
)

print(doc)
```

在这个例子中，导入 `Document` 类之后，我们创建了一个名为 `doc` 的 `Document` 对象。这个对象包含实际文本、一个文档 ID，以及一些我们自己选择的附加元数据，这些元数据以字典形式提供。

下面是 `Document` 对象中一些最重要的属性：

**text**：这个属性存储文档的文本内容。

**metadata**：这个属性是一个字典，可以用于包含关于文档的附加信息，例如文件名或分类。元数据字典中的键必须是字符串，值可以是字符串、浮点数或整数。

**id_** ：这是每个文档的唯一 ID。你可以根据需要手动设置；但如果你没有指定 ID，LlamaIndex 会自动为每个文档分配一个。

你还可以通过查看 LlamaIndex 的 GitHub 仓库找到其他属性。不过，为了保持简单，在这里我们只关注这三个。这些属性为定制和增强 LlamaIndex 中 `Document` 类的功能提供了多种方式。

**图 3.2 —— 文档的基本结构**

LlamaIndex 文档以未经处理的原始形式包含数据。虽然前面的示例展示了如何手动创建一个文档，但在实际应用中，这些文档通常会通过从各种数据源批量获取而生成。这种批量数据摄取，会使用一个名为 LlamaHub 的大型库中预定义的数据加载器。这些加载器有时也被称为连接器，或者简单称为 reader：[llamahub.ai/。](https://llamahub.ai/%E3%80%82)

下面是一个使用预定义 LlamaHub 数据加载器进行自动化数据摄取的基础示例。在运行示例之前，请确保你已经安装“技术要求”部分提到的库，并且如果你还没有完成第 2 章《LlamaIndex：隐藏的宝石——LlamaIndex 生态系统简介》中提到的所有必要环境准备，请先完成它们：

```perl
pip install wikipedia
pip install llama-index-readers-wikipedia
```

第一个库允许你轻松访问和解析来自 Wikipedia 的数据，而第二个库是用于 Wikipedia 数据加载器的 LlamaIndex 集成。

安装这两个库之后，你就可以运行下面的示例：

```ini
from llama_index.readers.wikipedia import WikipediaReader

loader = WikipediaReader()

documents = loader.load_data(
    pages=['Pythagorean theorem','General relativity']
)

print(f"loaded {len(documents)} documents")
```

`WikipediaReader` 加载器使用 Wikipedia Python 包，从 Wikipedia 文章中提取文本。除了 `WikipediaReader`，LlamaHub 中还有很多更专门化的数据连接器。

所以，创建文档是一个非常直接的过程。但原始的 `Document` 对象是如何转换成 LLM 可以高效处理和推理的格式的呢？这就轮到节点（nodes）登场了。

## 节点

**允许我们的专有知识适配模型的提示词限制**：想象一下，如果我们有一份 50 页长的组织内部流程文档，当我们试图将它放入提示词上下文中时，肯定会遇到大小限制问题。不过，在实践中，我们大概率并不需要把整份流程文档都放进一个提示词里。因此，只选择相关节点就能解决这个问题。

**创建围绕特定信息组织的语义数据单元**：这可以让数据更容易处理和分析，因为它被组织成了更小、更聚焦的单元。

**允许创建节点之间的关系**：这意味着节点可以基于它们之间的关系被链接起来，形成一个相互连接的数据网络。这对于理解文档中不同信息片段之间的连接和依赖非常有用。

**图 3.3 —— 文档分块过程可视化**

### `BaseNode` 和 `Node` 类及其子类型

在基础层面上，LlamaIndex 中所有类型的节点都继承自抽象类 `BaseNode`。这个类定义了任何可以被存储、索引和检索的数据块的一般行为。这些一般行为包括：

**管理每个节点的唯一 ID**：这个 ID 通常由 LlamaIndex 自动生成，用于高效索引和检索；但当需要特定标识方案时，也可以手动设置。

**存储并访问与节点关联的元数据**：这些元数据可以提供关于内容来源、类型、源文件、创建时间戳或其他相关上下文方面的额外信息层。

**定义节点之间的关系**：通过关系连接节点，可以为我们的内容增加额外维度，使检索系统能够沿着主题之间的逻辑连接扩展搜索到相关概念，并在多部分回答中保持连贯性。这对于复杂文档尤其有价值，因为理解这类文档往往依赖于把握不同章节之间的关系。

建立在 `BaseNode` 基础之上的，是 `Node` 类。它增加了对多模态内容的支持。这意味着一个节点不仅可以存储文本，还可以存储图像、音频片段或视频。每个 `Node` 对象都会在专用字段中存储其内容：`text_resource`、`image_resource`、`audio_resource` 和 `video_resource`。这种灵活性意味着，你不仅可以用同一种节点抽象表示文本文件的一部分，也可以表示图像或声音片段等富媒体内容。

| 子类 | 描述 |
| --- | --- |
| TextNode | 用于只包含文本的节点。它是经典 RAG 流水线中最常用的变体，本书大部分内容也会重点关注这种节点类型。 |
| ImageNode | 这个类扩展了 TextNode，并增加了对与文本关联图像的支持。它非常适合视觉文档、演示文稿或包含大量图像的 PDF。 |
| IndexNode | 它允许一个节点包含对另一个对象的引用，例如另一个索引或另一个节点。IndexNode 用于更高级的场景，例如知识图谱或层级索引。 |

**表 3.1 —— 节点子类描述**

**图 3.4 —— LlamaIndex 中不同节点类概览**

由于 LlamaIndex 的图像、音频、视频多模态功能仍在快速演进，并且频繁变化，因此在本书中，我们将主要关注框架的文本能力。所以，从现在开始，我们的主角将是 `TextNode` 类。

### 理解 `TextNode` 类及其用途

在介绍完整体节点架构之后，我们现在可以重点关注 `TextNode` 类，它是大多数 RAG 实现中的主力。由于 `TextNode` 处理了基于文本的 RAG 流水线中的大多数使用场景，理解它的结构和能力，对于构建有效的检索系统至关重要。

下面是 `TextNode` 类中一些较为重要的属性：

**id_** ：节点的唯一标识符，自动生成。

**text**：它存储从原始文档中派生出来的实际文本块。

**start_char_idx 和 end_char_idx**：可选整数值，分别用于存储文本在文档中的起始字符位置和结束字符位置。当文本是更大文档的一部分，并且你需要精确定位它的位置时，这些字段会很有帮助。

**text_template 和 metadata_template**：模板字段，定义文本和元数据如何被格式化。它们帮助生成更结构化、更可读的 `Node` 表示。

**metadata_separator**：这是一个字符串字段，定义元数据字段之间的分隔符。当包含多个元数据项时，这个分隔符用于保持可读性和结构。

**任何有用的 metadata**：例如父文档 ID 和可选标签。这些元数据可以在必要时用于存储额外上下文。

**relationships**：一个字典，用于定义与其他节点的关系。我们将在本章稍后进一步讨论这个主题。

**embedding**：它存储节点文本内容的向量表示，用于语义搜索和索引。这个字段通常会在索引过程中自动生成。

与文档类似，如果你想查看 `Node` 属性的完整列表，可以在 LlamaIndex 的 GitHub 仓库中找到：

为了充分理解节点的行为，并为本书后续更高级的主题打下基础，我们还需要探索一些与 `TextNode` 交互时最常用的方法：

**get_content()** ：这个方法返回节点的内容。对于 `TextNode`，这通常就是文本本身；如果你指定了，也可以选择带元数据格式化后的内容。

**set_content(value)** ：我们可以使用这个方法设置或更新节点的主要文本内容。

**get_metadata_str(mode)** ：返回节点元数据的格式化字符串，并根据指定模式进行过滤。例如，你可以排除某些元数据字段，使其不展示给 LLM，或不包含在嵌入文本中。

**get_embedding()** ：这个方法返回与节点关联的向量嵌入。如果当前没有设置嵌入，则会抛出错误。

**get_node_info()** ：如果你需要定位节点在文档正文中的原始位置，`get_node_info()` 会返回一个字典，其中包含文本在父文档中的起始和结束字符位置。

### 手动创建 `TextNode` 对象

下面是一个简单示例，展示如何手动创建 `TextNode` 对象：

```ini
from llama_index.core import Document
from llama_index.core.schema import TextNode

doc = Document(text="This is a sample document text")

n1 = TextNode(
    text=doc.text[0:16],
    metadata={"parent_doc_id": doc.doc_id}
)

n2 = TextNode(
    text=doc.text[17:],
    metadata={"parent_doc_id": doc.doc_id}
)

print(n1.id_)
print(n1.get_content())
print(n2.id_)
print(n2.get_content())
```

在这个例子中，我们使用 Python 的文本切片能力，为两个节点手动提取文本。我们还为每个节点设置了一些元数据。随后，如果我们想在创建节点之后修改某个节点的文本，可以使用 `set_content()` 方法。当你确实想完全控制节点文本及其附带元数据时，这种手动方式会非常方便。

为了理解幕后发生了什么，我们来看一下这段代码的输出：

```vbnet
Node ID: 102b570f-5b22-48b5-b9b6-6378597e920d
Text: This is a sample
Node ID: 0ad81b09-bf12-4063-bfe4-6c5fd3c36cd4
Text: document text
```

正如你所看到的，这两个节点包含一个随机生成的 ID，以及我们从原始文档中切分出来的文本片段。`Node` 构造函数使用 Python 的 UUID 模块，为每个节点自动生成了一个 ID。不过，如果我们想采用不同的标识方案，可以在创建节点之后定制这个标识符。

既然我们已经知道如何手动创建节点，接下来看看 LlamaIndex 如何自动帮我们完成这件事。

### 使用 splitters 从文档中自动提取节点

正如我在本节开头已经解释过的，文档分块在 RAG 工作流中非常重要。这也是为什么 LlamaIndex 内置了专门用于这一目的的工具，称为 splitters。

Splitters 是将长文档拆分成更小节点的工具。其中一种工具就是 `SentenceSplitter`。

作为自动节点生成的例子，`SentenceSplitter` 会将文档文本拆分成保留完整句子的节点。每个节点包含一个或多个句子，并且节点之间默认会有一定重叠，以帮助保持上下文连续性。

```ini
from llama_index.core import Document
from llama_index.core.node_parser import SentenceSplitter

doc = Document(
    text=(
        "This is sentence 1. This is sentence 2. "
        "Sentence 3 here."
    ),
    metadata={"author": "John Smith"}
)

splitter = SentenceSplitter(
    chunk_size=12,
    chunk_overlap=0
)

nodes = splitter.get_nodes_from_documents([doc])

for node in nodes:
    print(node.text)
    print(node.metadata)
```

下面是这段代码的输出：

```arduino
Metadata length (4) is close to chunk size (12). Resulting chunks are less than 50 tokens. Consider increasing the chunk size or decreasing the size of your metadata to avoid this.
This is sentence 1.
{'author': 'John Smith'}
This is sentence 2.
{'author': 'John Smith'}
Sentence 3 here.
{'author': 'John Smith'}
```

由于 chunk size 表示一次可以处理多少内容，如果元数据太大，它会占据每个 chunk 中的大部分空间，从而留给实际内容 token 的空间变少。这可能导致 chunk 主要由元数据构成，而实际内容很少，使这个 chunk 在嵌入时效率低下，提供给 LLM 的上下文有限，并且浪费 token 预算。在我们的示例中，警告出现是因为有效 chunk size，也就是 chunk size 减去元数据占用的空间之后，会产生小于 50 个 token 的 chunk。对于高效处理来说，这被认为太小了。

在这个例子中，我们首先创建了一个只包含三个简单句子的简单文档。接着，我们定义了一个 `SentenceSplitter`，并使用它的 `get_nodes_from_documents()` 方法，将每个句子提取到单独的节点中。在底层，这些节点会根据文档中检测到的内容，被创建为 `TextNode` 或其他合适的节点类型。从输出中也可以看到，每个节点的元数据都自动继承自原始文档的元数据。

### 节点不喜欢孤独——它们渴望关系

想象一下，把一张大地图剪成几十块小拼图。每一块都展示了城市的一部分，例如一条街、一座公园、一栋建筑；但如果看不到这些碎片之间如何连接，几乎不可能理解完整布局，也很难从一个地方导航到另一个地方。虽然单个节点包含有价值的信息块，但通常是它们之间的连接揭示了上下文、结构和意义。

在 LlamaIndex 中创建节点之间的关系，可能有以下几个原因：

**支持更具上下文的查询**：通过将节点连接起来，你可以在查询过程中利用它们之间的关系，检索额外的相关上下文。例如，在查询某个节点时，你也可以返回前一个或后一个节点，以提供更多上下文。

**允许追踪来源**：关系编码了来源信息，也就是源节点从哪里来，以及它们之间如何连接。例如，当你需要识别某个节点的原始来源时，这会很有用。

**支持通过节点导航**：通过关系遍历节点，可以实现新类型的查询。例如，可以定位下一个包含特定关键词的节点。沿关系进行导航，为搜索提供了另一个维度。

**支持知识图谱构建**：节点和关系是知识图谱的构建块。将节点连接成图结构，可以使用 LlamaIndex 从文本构建知识图谱。

**改善索引结构**：一些 LlamaIndex 索引，例如树和图，会利用节点关系构建其内部结构。关系允许构建更复杂、更具表达力的索引拓扑。

总之，关系为节点增加了额外的上下文连接。这支持更具表达力的查询、来源追踪、知识图谱构建，以及复杂索引结构。

```scss
from llama_index.core import Document
from llama_index.core.schema import (
    TextNode,
    NodeRelationship,
    RelatedNodeInfo
)

doc = Document(text="First sentence. Second Sentence")

n1 = TextNode(text="First sentence", node_id=doc.doc_id)
n2 = TextNode(text="Second sentence", node_id=doc.doc_id)

n1.relationships[NodeRelationship.NEXT] = n2.node_id
n2.relationships[NodeRelationship.PREVIOUS] = n1.node_id

print(n1.relationships)
print(n2.relationships)
```

在这个例子中，我们手动创建了两个节点，并在它们之间定义了前一个或后一个关系。这个关系追踪节点在原始文档中的顺序。这段代码告诉 LlamaIndex，这两个节点属于最初的文档，并且它们也具有特定顺序。

**图 3.5 —— 两个节点之间的 previous 或 next 关系**

我们还可以定义其他类型的关系。除了 previous 或 next 这类简单关系之外，节点还可以使用以下方式连接：

**SOURCE**：source 关系表示某个节点被提取或解析出来的原始源文档。当你将一个文档解析成多个节点时，可以使用 source 关系追踪每个节点来自哪个文档。

**PARENT**：parent 关系表示一种层级结构，其中拥有此关系的节点比关联节点高一个层级。在树结构中，一个父节点会有一个或多个子节点。这个关系用于导航或管理嵌套数据结构，在这些结构中，你可能有一个主节点，以及代表主节点中章节、段落或其他细分部分的从属节点。

**CHILD**：这是 `PARENT` 的相反关系。拥有 child 关系的节点，是另一个节点，也就是父节点的从属节点。子节点可以被看作从父节点延伸出来的树结构中的叶子或分支。

当原始数据已经作为文档被摄取，并被结构化为可以查询的节点之后，最后一步就是把节点组织成高效索引。

## 索引

我们的第三个重要概念——索引——指的是一种特定数据结构，用于组织节点集合，以优化存储和检索。

为 RAG 准备好数据，有点像为一次重要旅行整理衣服——你必须确保所有东西都组织好，并且容易拿到！假设你正在为一次重要商务旅行打包。你当然可以把所有东西直接扔进行李箱，但衬衫、袜子、裤子和其他东西都会混在一起！问题在于，当你想快速拿到需要的东西时，可能会拿错物品，最后发明出一套全新的着装规范。

恰当的索引会把信息整齐地归入有意义的类别，例如把销售记录放入一个索引，把支持工单放入另一个索引。这就像把相关物品打包在一起。它将混乱数据转化为 AI 可以使用的、井井有条的知识。你不再是在行李箱中随机翻找，而是可以从定制口袋中准确拿到你需要的东西。

为了避免后续的挫败和时间浪费，请在早期投入精力，对数据进行结构化和索引。它会让你后面的工作轻松得多。

LlamaIndex 支持不同类型的索引，每种索引都有自己的优势和取舍。下面是一些可用索引类型的列表：

**SummaryIndex**：它非常像一个菜谱盒子——它按顺序保存你的节点，让你可以一个接一个地访问它们。它接收一组文档，将其切分成节点，然后把这些节点连接成一个列表。它非常适合通读一篇大型文档。

**DocumentSummaryIndex**：它为每个文档构建一个简洁摘要，并将这些摘要映射回各自的节点。它通过使用这些摘要快速识别相关文档，从而支持高效信息检索。

**VectorStoreIndex**：这是更复杂的索引类型之一，也很可能是大多数 RAG 应用中的主力。它将文本转换为向量嵌入，并使用数学方法对相似节点进行分组，帮助定位彼此相似的节点。

**TreeIndex**：对于热爱秩序的人来说，这是完美方案。这个索引类似于把小盒子放进大盒子里，以类似树的层级结构组织节点。在内部，每个父节点都会存储子节点的摘要。这些摘要由 LLM 使用通用摘要提示词生成。这个特定索引对于摘要任务非常有用。

**KeywordTableIndex**：想象一下，你需要根据手头已有的食材找到一道菜。关键词索引会把重要词语连接到它们所在的节点。通过查找关键词，它可以轻松找到任何节点。

**KnowledgeGraphIndex**：当你需要把事实连接到一个作为知识图谱存储的大型数据网络中时，它非常有用。它适合回答那些涉及大量相互连接信息的复杂问题。

**ObjectIndex**：想象一个工具箱，你可以在其中存储并组织任何类型的 Python 对象，而不仅仅是文本。通过这种结构，你可以索引工具、表结构 schema，甚至自定义数据结构——几乎任何你能想到的东西。这对于基于智能体的工作流尤其有用，因为智能体可能需要在运行时浏览并选择工具或资源。`ObjectIndex` 通过将每个对象映射到一个节点来工作，让你可以像检索或搜索文档片段一样，检索或搜索任意对象。这使它在高级使用场景中非常灵活，尤其是在你的数据不仅仅是纯文本时。

**ComposableGraph**：它允许你创建复杂的索引结构，其中，文档级索引会被索引到更高层级的集合中。没错，如果你想从一个更大的文档集合中的多个文档访问数据，你甚至可以构建索引的索引。这里先做一个概览。

LlamaIndex 中所有索引类型都共享一些共同核心特性：

**构建索引**：每种索引类型都可以在初始化时传入一组节点来构建。这会建立底层索引结构。

**插入新节点**：索引构建完成后，可以手动插入新节点。这会增加到已有索引结构中。

**查询索引**：一旦构建完成，索引会提供查询接口，用于根据特定查询检索相关节点。检索逻辑会因索引类型不同而不同。

不同索引类型在索引结构和查询细节上会有所差异。但构建、插入和查询这个模式是一致的。如果你想充分发挥每种索引类型的潜力，理解其特定特性非常重要。

现在，我们先看一个简单示例，说明如何创建 `SummaryIndex`：

```javascript
import models_config
from llama_index.core import SummaryIndex, Document
from llama_index.core.node_parser import SentenceSplitter

doc = Document(text=(
    "Lionel Messi is a football player from Argentina. "
    "He has won the Ballon d'Or trophy 8 times. "
    "Lionel Messi's hometown is Rosario. "
    "He was born on June 24, 1987."
))

splitter = SentenceSplitter(chunk_size=20, chunk_overlap=0)
nodes = splitter.get_nodes_from_documents([doc])

index = SummaryIndex(nodes)
```

注意，在这个例子中，我们首先导入了一个名为 `models_config` 的模块。这是必需的，因为我们需要定制 LlamaIndex，使其使用由 Ollama 提供服务的本地 LLM，而不是默认的 OpenAI LLM。我们首先创建一个包含文本数据的文档，然后使用 `SentenceSplitter` 自动将它拆分成节点。通过调整 `chunk_size` 和 `chunk_overlap` 等参数，我们可以控制每个节点中包含多少文本。接着，我们把这些节点传入 `SummaryIndex`，这是一个直接的、基于列表的数据结构，用于组织和检索你的内容。

你可以把 `SummaryIndex` 想象成一个小记事本，用来记下许多故事中的要点。在设置它时，它会接收一大组故事，将它们拆成更小的片段，并把这些片段排成一个列表。最棒的是？LlamaIndex 在构建这种索引时甚至不需要使用 LLM。

```ini
query_engine = index.as_query_engine()
response = query_engine.query("What is Messi's hometown?")
print(response)
```

输出如下：

```rust
Messi's hometown is Rosario.
```

summary index 会将所有节点按顺序组织到一个列表中。

当被查询时，它会检索所有节点，从而允许在完整上下文中合成响应。

那么，这在底层到底是如何工作的呢？

`QueryEngine` 包含一个 Retriever，它负责根据查询从索引中检索相关节点。Retriever 会执行查找操作，从索引中获取并排序与该查询相关的节点。它会从索引中抓取那些可能包含关于 Messi 家乡信息的节点。

但仅仅返回一个节点列表并没有太大用处。此时，`QueryEngine` 的另一个部分，也就是 node postprocessor，会开始发挥作用。这个部分允许在节点被检索之后、最终响应被构造之前，对节点进行转换、重新排序或过滤。有许多类型的 postprocessor 可用，每一种都可以根据使用场景进行配置和定制。

`QueryEngine` 对象还包含一个 response synthesizer，它会接收检索到的节点，并使用 LLM 构造最终响应。它会执行以下步骤：

- response synthesizer 获取由 retriever 选中、并由 node postprocessor 处理过的节点，并将它们格式化成一个 LLM 提示词
- 这个提示词包含查询，以及来自节点的上下文
- 这个提示词被交给 LLM 生成响应
- 使用 LLM 对原始响应进行任何必要的后处理，以返回最终的自然语言答案

所以，`index.as_query_engine()` 是在为我们创建一个完整的查询引擎，其中包含三个元素的默认版本：retriever、node postprocessor 和 response synthesizer。同时，运行这个查询引擎的最终结果，会是一个类似 “Messi's hometown is Rosario.” 的自然语言答案。

让我们看一下图 3.6，了解完整流程概览。

**图 3.6 —— 使用 LlamaIndex 的完整 RAG 工作流**

基于图 3.6 中展示的主要组件，这个过程包含以下步骤：

- 将数据加载为文档
- 将文档解析成连贯节点
- 从节点构建索引
- 在索引上运行用户查询，以检索相关节点
- 将用户查询与相关节点一起发送给 LLM，以合成最终响应

## 关键概念快速回顾

下面是我们到目前为止覆盖内容的快速概要：

**Documents**：被摄取的原始数据。

**Nodes**：从文档中提取出来的逻辑块。

**Indexes**：根据使用场景组织节点的数据结构。

**QueryEngine**：处理完整查询工作流的组件。它包含 retriever、node postprocessor 和 response synthesizer。

## 构建我们的第一个交互式增强型 LLM 应用

对于下一步，请确保你已经满足本章开头提到的技术要求。对于下面的代码示例，我们需要 Wikipedia 包，这样才能解析某个 Wikipedia 文章，并从中提取我们的样例数据。

```ini
import models_config
from llama_index.core import Document, SummaryIndex
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.wikipedia import WikipediaReader

loader = WikipediaReader()
documents = loader.load_data(pages=["Messi Lionel"])

parser = SentenceSplitter.from_defaults()
nodes = parser.get_nodes_from_documents(documents)

index = SummaryIndex(nodes)
query_engine = index.as_query_engine()

print("Ask me anything about Lionel Messi!")

while True:
    question = input("Your question: ")
    if question.lower() == "exit":
        break

    response = query_engine.query(question)
    print(response)
```

只用了几行代码，我们就构建了一个简单应用，它使用 Wikipedia 作为锚定知识源，回答关于 Lionel Messi 的问题。

下面是这段代码的快速走读：

首先，我们导入 `models_config` 模块，以便设置本地 LLM。

然后，我们使用 `WikipediaReader` 数据加载器，将 Lionel Messi 的 Wikipedia 页面作为文档加载进来。这会摄取原始文本数据。

接着，我们使用 `SentenceSplitter` 将文档分块成节点。这会把文本拆成更小的片段。

然后，我们从节点构建 `SummaryIndex`。这会按顺序组织节点，以便进行完整上下文检索。

我们定义 `QueryEngine`，形成完整查询流水线。

但如果我们想确切知道幕后发生了什么，该怎么办？

## 使用日志更好地理解逻辑并调试应用

但随着你的应用变得越来越复杂，你会想准确理解 LlamaIndex 在底层到底是如何工作的。这就是日志变得重要的地方。LlamaIndex 提供了大量有用的日志语句，可以一步一步向你展示索引和查询过程中发生的事情。这就像有一个小型调试旁白，在描述每一个动作。

启用基础日志非常简单，只需添加下面这段代码：

```ini
import logging
logging.basicConfig(level=logging.DEBUG)
```

启用 debug 日志后，你会看到 LlamaIndex 如何执行下面这些事情：

- 将你的文档解析成节点
- 决定使用哪种索引结构
- 为 LLM 格式化提示词
- 基于你的查询检索相关节点
- 从节点中合成响应

正如我们将在接下来的章节中看到的那样，日志还会揭示一些有用数据，例如：

- API 调用使用的 token 数量
- 延迟信息
- 任何警告或错误

现在，要不要做一些调整？

## 定制 LlamaIndex 使用的 AI 模型

默认情况下，LlamaIndex 使用 OpenAI API 和 GPT-3.5-Turbo 模型。在它所处的时代，这是一个非常有能力且高效的模型，但目前它已经被 OpenAI 视为 legacy，并且很可能正在走向最后阶段，在不久的将来被完全退役。这一事实，再加上潜在的数据隐私问题，也是鼓励读者使用本地托管模型的另一个原因。

那么，我们如何配置 LlamaIndex 使用某个特定 AI 模型呢？机制其实非常简单。我们会使用 `Settings` 类，它包含 LlamaIndex 库的所有全局设置，包括 LLM 模型和嵌入模型的选择。`Settings` 类可以在你的代码中任何地方被直接访问和修改，并且所做的任何更改都会在整个会话期间持续生效。

要设置自定义模型，只需将一个 LLM 对象，例如 Ollama 模型，赋值给 `Settings` 类的 `llm` 属性。类似地，对于嵌入，可以将对应对象设置给 `embed_model`。嵌入模型用于为文本生成向量，也称为 embeddings，从而支持语义搜索。一旦设置了这两个参数，所有 LlamaIndex 操作都会继续使用你指定的模型。

为了更好地理解 `Settings` 如何工作，下面展示了我如何为本书示例配置通过 Ollama 提供服务的本地模型：

我使用了一种模块化、可复用的机制，让本书中的所有示例共享同一套模型设置，而不必在每个脚本中重复配置代码。

在 GitHub 中每一章的子文件夹里，我创建了一个名为 `models_config.py` 的文件，每章中的每个代码示例都会导入它。这个文件为该章中的所有脚本提供集中且一致的 AI 模型配置，因此我们不需要在每个示例中重复设置。

```python
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).parent.parent))

from config.models import *
```

因此，本书中的所有示例都以同一套模板设置开始，不管它位于哪一章或哪个子文件夹。任何对模型的更改，都只需要在 `config/models.py` 文件中完成一次，下一次运行时，这个更改就会自动被所有脚本接收。

下面是 `models.py` 的样子：

```ini
from llama_index.core import Settings
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

Settings.llm = Ollama(
    model="gemma3:4b",
    base_url="http://localhost:11434",
    temperature=0.8,
    context_window=16000,
    request_timeout=30.0
)

Settings.embed_model = OllamaEmbedding(
    model_name="nomic-embed-text",
    base_url="http://localhost:11434",
    request_timeout=30.0
)
```

这个系统提供了两个主要优势：

- 你可以只在一个地方更改整个代码库的 AI 模型
- 你可以轻松尝试其他模型，而不需要修改所有源文件

为了让 LlamaIndex 使用这些设置工作，默认能够运行本书所有示例，你需要确保 Ollama 始终在后台运行。当模型被下载到本地之后，可以使用 `ollama serve` 命令运行 Ollama。当 Ollama 应用在本地机器上运行时，它会在 `localhost:11434` 上为你的所有本地模型提供服务。

你可能已经注意到，在前面的代码中，我定义 LLM 时使用了一些额外参数。其中一个参数是 `temperature`，它控制 AI 响应的随机性，或者说创造性。请看图 3.7 的概览：

**图 3.7 —— temperature 对输出变化性的影响**

对于大多数 LLM，包括 OpenAI、Mistral、Claude 和 Google Gemini，`temperature` 参数通常在 0 到 1 之间。不过，范围和效果可能会因提供商而略有差异。更高的值会产生更随机、更有创造性的输出。更低的值会产生更聚焦、更确定性的输出。

`temperature` 值为 0 时，对于同一个输入提示词，每次几乎会产生相同输出。注意，我使用了“几乎”这个词。这是因为即使 temperature 被设置为 0，大多数模型对于同一个提示词，可能仍然会在答案中产生细微变化。这是由模型初始化中的固有随机性，或模型内部状态中的细微变化导致的，而这些变化可能来自浮点精度限制，或神经网络中某些操作的随机性质等因素。因此，即使 temperature 值为 0，也就是试图最小化随机性，这些小变化仍然可能导致相同输入产生稍微不同的输出。

temperature 设置应该根据你的使用场景是否要求事实准确性或更高创造性来选择。对于代码生成、数据分析或其他精确性导向的工作流，一般更偏好较低的 temperature 值，例如 0.2，因为它会产生更一致、更可靠的输出。相反，对于内容写作或对话式聊天机器人响应这类需要创造力的任务，通常会受益于 0.5 或更高的 temperature 值，使模型能够生成更多样、更有想象力的回答。

另一个参数是 `context_window`，它定义模型在生成响应时一次能够考虑的最大 token 数量。它实际上设置了模型在单个提示词中可以看到多少信息的上限，包括你的输入和模型输出。更大的上下文窗口允许模型对更长文本进行推理，或在更长对话中维持连续性，但这也可能增加内存使用和计算时间。

- Mistral：要安装的包是 `llama-index-llms-mistral`
- Anthropic 的 Claude：要安装的包是 `llama-index-llms-anthropic`
- Groq：要安装的包是 `llama-index-llms-groq`
- Google：对于 Gemini 模型，安装 `llama-index-llms-google`

对于大多数 AI 模型提供商，你可以在这里找到合适的集成：

安装非常简单。

如果你没有安装对应集成，LlamaIndex 将无法识别该模型，并会在运行时返回错误。

所以，对于任何使用不同 AI 模型的实验，第一步都是检查是否已经安装集成包。安装完成后，你只需要修改配置文件，指定想要的模型，就像前面已经展示过的示例一样。

`Settings` 中还有其他可以调整的参数。无论你想改变什么，定制方式都会和前面的示例类似。一旦你定义了自定义 `Settings`，所有后续操作都会使用这套配置。

## 构建一个简单的 AI 智能体

AI 智能体是当下技术领域最热门的话题之一，而且有充分理由。想象一下，有一种软件不只是回答问题，而是可以替你推理、规划和行动。智能体就像数字同事：它们可以使用工具、做出决策、浏览网页，甚至自动化整个工作流，所有这些都由语言模型的最新进展驱动。现在已经不只是聊天了；智能体承诺将 AI 变成主动协作者，使其成为当今 AI 革命中最令人兴奋的前沿之一。

因此，仅针对与智能体相关的示例，我们将切换到 `Qwen3:8B`。这个模型支持更好的逐步推理，也就是 chain-of-thought，以及规划能力。这些都是智能体任务中的关键特性，因为模型需要系统性地规划行动并解释工具输出。ReAct 智能体框架依赖模型以严格格式生成结构化输出。较小模型有时很难稳定遵循这种格式，从而导致解析错误和不一致结果。要有效运行 `Qwen3:8B`，你的电脑理想情况下应该具备：

- 至少 16 GB VRAM，用于高质量 16-bit（FP16）推理
- 至少 8 GB VRAM，用于 4-bit 量化版本，它在性能和资源使用之间提供了不错的折中

如果你的机器不满足这些要求，不用担心。Ollama 会根据你的硬件自动选择最佳模型变体。如果你的 VRAM 有限，Ollama 会加载更小、精度更低的模型版本，以确保它能够运行。这同样适用于 `Gemma 3:4B` 和 `Qwen3:8B`。

对于本书中所有其他示例，包括我们的主项目，我们仍然会坚持使用更轻量、对硬件更友好的 `Gemma 3:4B`。

```code
ollama pull qwen3:8b
```

`Qwen3:8B` 模型现在会保留在你的本地 Ollama 服务器中；后面章节中探索更高级智能体时，我们还会需要它。

在这个代码示例中，你会注意到，这次我们没有像之前那样导入 `models_config`，而是直接导入 Ollama 库，并定义了一个自定义 `llm` 对象，用来初始化智能体：

```ini
import asyncio
from llama_index.core.agent.workflow import AgentWorkflow, ReActAgent, AgentStream, ToolCallResult
from llama_index.core.tools import FunctionTool
from llama_index.tools.wikipedia import WikipediaToolSpec
from llama_index.core.tools.tool_spec.load_and_search import LoadAndSearchToolSpec
from llama_index.llms.ollama import Ollama

llm = Ollama(
    model="qwen3:8b",
    base_url="http://localhost:11434",
    temperature=0.8,
    request_timeout=30.0
)

wiki_search = WikipediaToolSpec().to_tool_list()[1]
tools = LoadAndSearchToolSpec.from_defaults(wiki_search).to_tool_list()

react_agent = ReActAgent(
    name="wiki_agent",
    description="An agent that searches Wikipedia",
    tools=tools,
    llm=llm
)

agent = AgentWorkflow(agents=[react_agent], root_agent="wiki_agent")

async def main():
    handler = agent.run("What is the most famous place on every island in the Azores?")
    async for ev in handler.stream_events():
        if isinstance(ev, ToolCallResult):
            print(f"\n--- Tool Call: {ev.tool_name} ---")
            print(f"Input: {ev.tool_kwargs}")
            print(f"Output: {ev.tool_output}\n")
        if isinstance(ev, AgentStream):
            print(ev.delta, end="", flush=True)
    response = await handler
    print("\n\n=== Final Response ===")
    print(response)

asyncio.run(main())
```

ReAct 智能体会在推理和行动之间交替进行。推理是使用 LLM 决定下一步该做什么；行动是执行动作，例如使用工具或搜索。这很像你以迭代方式处理研究任务。

魔法实际上发生在三个关键步骤中。首先，我们获取 Wikipedia 的搜索功能，并使用 `LoadAndSearchToolSpec` 将它包装起来。这个包装器很聪明——它不是把庞大的 Wikipedia 文章一股脑丢给 LLM，因为这可能压垮较小模型，而是将内容分块，并智能地搜索其中的信息。

`WikipediaToolSpec` 提供两个工具：

- `[0] - load_data`：下载完整 Wikipedia 页面
- `[1] - search_data`：在数据中搜索相关信息

我们使用 `[1]` 来获取搜索工具，因为它更适合智能体。搜索工具会返回相关 Wikipedia 页面的列表和片段，让智能体决定什么值得进一步探索。这比一开始就下载完整 Wikipedia 文章高效得多。

为了实时观察智能体的思考过程，我们在它运行时流式输出事件。`AgentStream` 事件会逐 token 展示智能体的推理，而 `ToolCallResult` 事件会展示每一次工具调用及其输入和输出。这就像看着某个人在研究某个主题时的内心独白。

由于 LlamaIndex 智能体是异步的，我们将执行过程包装在一个 async 函数中，并使用 `asyncio.run()` 启动它。

智能体性能会随着模型规模提升而扩展。虽然这个示例在 `Qwen3:8B` 或更大模型上运行良好，但较小模型，通常低于 7B 参数，可能难以处理多步骤研究任务所需的复杂推理。如果你的硬件允许，也可以尝试更大的模型，例如 `Qwen3:14B` 或 `Mixtral`，以获得更好的结果。

好了。本章概念已经讲得够多了。现在，要不要在我们的编码项目上做一些练习？

## 开始我们的动手练习

你准备好做一点动手实践了吗？现在是时候开始构建我们的 `Contract Review Expert` 了。我们已经打下足够的理论基础，而在本章中，我们将开始为后续更高级的元素做准备。

我以模块化方式组织了这个项目，以提高代码清晰度和可维护性。这种方式也允许我们一次探索一个模块，逐步理解 LlamaIndex 中的关键概念。你既可以一边读书一边编写代码，也可以使用我提供给你的 GitHub 仓库，下载并完整学习代码。

### 免责声明

现有代码库中有许多方面可以改进，并且它缺少不少功能，所以还不能被视为生产就绪应用。例如，在我的实现中，没有身份认证，应用也是单用户的。此外，为了保持代码简短，我也没有大量处理错误。当然，这些不是 bug，而是 feature 😊。这样一来，你可以延续它的故事，加入缺失元素，并把它转换成商业级应用。为什么不呢？

在开始之前，我想简要解释一下支撑我们应用的代码结构。下面是项目中使用的 Python 源代码文件列表，以及每个文件的简要说明：

**app.py**：这个文件是我们 `Contract Review Expert` 系统的核心。它定义了主 Streamlit 页面，允许用户上传和管理合同以及内部政策文档。一旦合同被上传，用户就可以运行自动风险分析和合规检查，并生成对应报告。UI 简单且直观，包含并排展示的政策区和合同区，以及一个专门区域用于查看生成的报告，并与你的合同聊天。

**policies.py**：这个模块管理所有与政策相关的功能，包括上传、列出和删除公司政策。它处理政策索引，并确保当政策被修改时，聊天缓存会被清除，以保持数据一致性。

**contracts.py**：这个模块处理合同管理，包括上传、分析工作流和报告生成。它编排风险分析和合规检查流程，管理合同生命周期，并与分析引擎协调。

**reports.py**：这个模块管理分析报告的展示和交互。它提供报告查看界面，与聊天系统集成，提供下载功能，并展示应用统计数据和指标。

**chat.py**：这个模块管理交互式聊天界面，允许用户围绕合同、政策和分析报告提出问题。它处理文档索引、查询处理、聊天历史管理，并提供 fallback 机制，以支持稳健的对话处理。

**utils.py**：这个模块处理文件持久化和索引管理，确保上传的文档和报告能够跨会话保持可用。

**config.py**：这个文件包含应用设置。它集中管理配置，便于管理和更新。

现在，我们先看一下源代码。

我们首先从 `config.py` 中的设置开始：

```ini
from llama_index.core import Settings
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

# Configure the LLM model
Settings.llm = Ollama(
    model="gemma3:4b",
    base_url="http://localhost:11434",
    temperature=0.8,
    context_window=16000,
    request_timeout=30.0
)

# Configure the embedding model
Settings.embed_model = OllamaEmbedding(
    model_name="nomic-embed-text",
    base_url="http://localhost:11434",
    request_timeout=30.0
)

# Paths for persisting indexes
POLICIES_INDEX_PATH = "data/persistence/policies_index"
CONTRACTS_INDEX_PATH = "data/persistence/contracts_index"
REPORTS_INDEX_PATH = "data/persistence/reports_index"
```

`config.py` 文件充当应用关键组件的集中配置位置。在这里，我们定义系统将使用哪个 LLM 和嵌入模型。在这个示例中，我们配置 LlamaIndex 使用本地 Ollama 服务器，其中语言生成使用 `gemma3:4b` 模型，嵌入使用 `nomic-embed-text` 模型。这些设置控制应用如何解释、总结和分析合同与政策文档。

除了模型配置之外，`config.py` 还定义了用于持久化政策、合同和报告索引的文件路径。通过集中定义这些内容，我们可以轻松更改模型或存储位置，而不必修改应用其余代码。

我们需要在这里先打好基础；后续章节中，我们会继续介绍其他模块。

## 总结

此外，我们展示了如何构建你的第一个交互式 LlamaIndex 应用，使用 Wikipedia 数据创建一个简单问答系统。我们介绍了 LlamaIndex 的日志功能，将其作为理解框架内部流程和调试应用的强大工具。你还学习了如何通过 `Settings` 类配置本地 LLM 和嵌入模型，从而定制 LlamaIndex 使用的 AI 模型，确保 RAG 工作流中的灵活性和效率。作为一个令人兴奋的能力预览，我们使用 ReAct 模式构建了一个简单 AI 智能体，展示了 LlamaIndex 如何支持更复杂的、会使用工具的 AI 行为。

