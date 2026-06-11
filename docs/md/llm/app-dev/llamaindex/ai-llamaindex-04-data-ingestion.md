---
title: LlamaIndex - 数据摄取与 RAG 工作流
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 数据摄取
---

---

本章详解数据如何进入 RAG 工作流，包括 LlamaHub 数据加载器、文档分块策略（SentenceSplitter 等）、元数据管理、隐私保护和 IngestionPipeline 自动化流水线。

## 技术要求

你需要在环境中安装以下 Python 库，才能运行本章中的示例：

- LangChain Text Splitters：[pypi.org/project/lan…](https://pypi.org/project/langchain-text-splitters/)
- Py-Tree-Sitter：[pypi.org/project/tre…](https://pypi.org/project/tree-sitter/)
- LlamaParse SDK：[pypi.org/project/lla…](https://pypi.org/project/llama-cloud-services/)

此外，还需要几个 LlamaIndex 集成包：

- Entity extractor：[pypi.org/project/lla…](https://pypi.org/project/llama-index-extractors-entity/)
- Hugging Face LLMs：[pypi.org/project/lla…](https://pypi.org/project/llama-index-llms-huggingface/)
- Database reader：[pypi.org/project/lla…](https://pypi.org/project/llama-index-readers-database/)
- Web reader：[pypi.org/project/lla…](https://pypi.org/project/llama-index-readers-web/)

## 通过 LlamaHub 摄取数据

无论我们的 RAG 流水线多么有效，归根结底，最终结果的质量在很大程度上取决于初始数据的质量。因此，请确保你从清理数据开始。消除潜在的重复项和错误。虽然冗余信息不完全等同于重复数据，但它同样会让你的知识库变得杂乱，并让 RAG 系统感到困惑。你需要警惕模糊、有偏见、不完整或过时的信息。我见过很多结构糟糕、维护不足的知识库，对于那些想快速获得准确答案的用户来说，它们完全没有用。问自己一个问题：如果让我手动搜索这些数据，要找到我需要的信息会有多容易？在继续构建数据摄取流水线之前，请帮自己一个忙，认真准备数据，直到你对这个问题的答案感到满意为止。

我们的数据是动态的。一个组织的知识库很少是静态且永久不变的数据源。它会随着业务发展而演进，反映新的洞察、发现，以及外部环境中的变化。认识到这种流动性，是维护一个相关且有效系统的关键。在生产级 RAG 应用中，你必须实现一种系统化方法，用于定期审查和更新内容，确保新信息被纳入，同时移除过时或错误的数据。

数据有许多不同的味道、形状和尺寸。有时它是结构化的，有时不是。一个构建良好的 RAG 系统，应该能够正确摄取各种格式和文档类型。虽然 LlamaIndex 为许多不同 API、数据库和文档类型提供了大量数据加载器，但构建一个自动化摄取系统仍然可能很有挑战。为了克服这个特定挑战，在本节后面，我们将介绍 LlamaParse——一个创新的托管服务，旨在自动摄取和处理来自不同数据源的数据。

既然我们已经知道前方会遇到哪些问题，那么就先从最简单的数据摄取方式开始我们的旅程：使用可用的 LlamaHub 数据加载器，将数据摄取到 RAG 流水线中。

### LlamaHub 概览

LlamaHub 是一个庞大的集成库，用于增强核心框架的能力。在众多不同类型的集成中，LlamaHub 包含大量连接器，这些连接器也被称为数据 reader 或数据加载器，专门用于让外部数据与 LlamaIndex 无缝集成。当前已经有超过 200 个可直接使用的数据 reader，覆盖广泛的数据源和格式，而且这个列表还在不断增加。

LlamaHub 让你只需几行代码，就能接入多样化的数据源。得到的 `Document` 对象随后可以根据你的应用需求，被解析成节点并建立索引。统一输出为 LlamaIndex `Document` 对象，意味着你的核心业务逻辑不必关心如何处理各种数据类型。这些复杂性已经被框架抽象掉了。

### 为什么我们需要这么多集成？由于这种模块化架构，LlamaIndex 提供的许多 RAG 组件，并不包含在随框架一起安装的核心元素中。这意味着，在第一次使用任何数据加载器之前，我们必须先安装对应的集成包。一旦安装完成，我们就可以在代码中导入 reader，并使用它的功能。一些 reader 还会使用专门针对各类数据定制的专业库和工具。例如，`PDFReader` 使用 Camelot 和 Tika 解析 PDF 内容。`AirbyteSalesforceReader` 使用 Salesforce API client，等等。这使我们能够高效适配每个来源的格式和接口，但也可能要求我们在开发环境中安装额外包。

所有可用 reader 都列在 LlamaHub 网站上：[llamahub.ai/?tab=reader…](https://llamahub.ai/?tab=readers)，并且通常附带详细文档和使用示例。因此，我只会简要介绍几个例子，让你对如何在应用中使用它们有一个大致概念。

我强烈建议你在构建 LlamaIndex 应用时，花时间浏览完整的数据 reader 列表，而不是花宝贵时间从零构建一个 reader。很可能你只是在重复造轮子。

LlamaHub 为每个数据 reader 提供的文档都会列出安装要求和使用指南，因此，在尝试使用它们之前，请确保你也安装了特定连接器所需的任何额外依赖。

## 使用 LlamaHub 数据加载器摄取内容

### 从网页摄取数据

`SimpleWebPageReader` 可以从网页中提取文本内容。

要使用它，我们必须先安装对应集成：

```perl
pip install llama-index-readers-web
```

安装之后，它真的很容易使用，如下面的示例所示：

```scss
from llama_index.readers.web import SimpleWebPageReader

urls = ["https://docs.llamaindex.ai"]
documents = SimpleWebPageReader().load_data(urls)

for doc in documents:
    print(doc.text)
```

这会将指定网页的文本内容作为文档加载并显示出来。

加载数据时，`SimpleWebPageReader` 会遍历用户提供的 URL 列表。对于每个 URL，它会执行一次 Web 请求来获取页面内容。响应最初是 HTML 格式，如果 `html_to_text` 标志被设置为 `True`，它可以被转换成纯文本。这个转换过程会去掉 HTML 标签，并把网页内容转换成更容易消化的文本格式。不过，还记得我前面说过这些 reader 的外部依赖吗？在这个例子中，HTML 到文本的转换功能需要 `html2text` 包，因此必须先安装它。

这个 reader 的另一个重要方面，是它能够为抓取出来的文档附加元数据。通过 `metadata_fn` 参数，我们可以传入一个自定义函数，该函数接收 URL 作为输入，并返回一个元数据字典。这种灵活性允许我们用额外信息或任何相关标签来丰富文档，从而更好地分类和理解数据上下文。如果用户提供了 `metadata_fn` 参数，那么 reader 会将这个函数应用到当前 URL 上，以提取元数据，并用这一额外信息层丰富最终的 `Document` 对象。

### `metadata_fn` 函数的一个实际使用场景

例如，我们可以使用一个简单返回当前日期和时间的函数。这样，我们就可以在不同时间摄取同一个 URL，并构建一个按时间顺序排列的时间线，突出展示该页面在不同时间点的不同版本。这在浏览代码仓库，或回答与持续发展中的新闻事件相关的问题时，可能会很有用。

处理数据之后，每个网页的内容，以及它的 URL 和可选添加的元数据，都会被封装到一个 `Document` 对象中。这些对象随后被收集到一个列表里，为从每个网页中提取出来的文本内容和元数据提供结构化表示。

正如名字所暗示的，这个 reader 是一个简单工具。虽然它可以有效读取简单网页，但对于更高级的情况，例如需要交互的页面，比如导航登录流程或处理由 JavaScript 渲染的内容，`SimpleWebPageReader` 可能并不够用。那些会根据用户交互动态生成内容，或严重依赖客户端脚本的网站，会带来挑战，而这个基础 scraper 并不是为处理这些挑战而设计的。

### 从数据库摄取数据

使用数据库不仅是一种常见实践，也是一种管理和检索结构化信息的高效方法。数据库为存储大量不同数据类型提供了稳健平台，从简单文本，到实体之间的复杂关系都可以管理，因此它们是数据管理中不可或缺的资产。

`DatabaseReader` 连接器允许我们查询许多数据库系统。首先，我们需要安装必要的集成包：

```perl
pip install llama-index-readers-database
```

下面是一个示例，展示如何轻松获取 SQLite 数据库的内容：

```ini
from llama_index.readers.database import DatabaseReader

reader = DatabaseReader(
    uri="sqlite:///files/db/example.db"
)

query = "SELECT * FROM products"
documents = reader.load_data(query=query)

for doc in documents:
    print(doc.text)
```

在底层，`DatabaseReader` 会连接到各种数据库以获取数据，并将其转换成 RAG 流水线可用的格式。它支持通过 `SQLDatabase` 实例、SQLAlchemy `Engine`、连接 URI，或一组数据库凭据进行连接，这些凭据通过 `scheme`、`host`、`port`、`user`、`password` 和 `dbname` 参数提供。设置完成后，`DatabaseReader` 会连接到数据库，并执行提供的 SQL 查询来检索数据。结果行随后会被转换成 `Document` 对象，查询结果中的每一行都会形成一个单独文档。转换过程会将每个列值对拼接成一个字符串，然后将其作为文档文本。

我提供的示例会针对存储在 `ch4/files/db` 文件夹中的 SQLite 数据库执行 SQL 查询，将每一行返回结果作为文档加载，并显示结果。你可以在官方项目文档网站上找到一个更通用的示例：

好了，我相信你现在已经对这个工作流有了扎实理解。正如你可能已经注意到的，使用 LlamaHub reader 的方式非常直接。在本书到目前为止展示的所有示例中，我们都是先按照 LlamaHub 上的说明安装所需集成包，然后导入并使用 reader 加载数据。除了我提供的示例之外，你还会在 LlamaHub 上找到大量可用的数据 reader，从 Office 文档、Gmail 账户、视频和图像、YouTube 视频、RSS feed，到 GitHub 仓库和 Discord 聊天，几乎所有流行数据格式都得到了支持。

既然我们已经看到如何使用专用数据 reader 读取单个文件，下一节将探索一些高效方法，用于一次性摄取多个文档。

## 从包含多种文件格式的来源批量摄取数据

将数据加载到 LlamaIndex 是重要的第一步。但浏览 LlamaHub 中长长的数据加载器列表，并弄清楚每一个如何配置，一开始可能会让人有些不知所措。而在很多真实场景中，你处理的也不仅仅是一种整洁的文件类型；你需要一次性拉取混合的 PDF、Word 文档和 CSV。这正是本节要解决的问题：让从多个来源和格式中批量加载数据变得更容易。我会向你展示两种不同方法，它们可以简化流程并节省时间。

我们先从简单方法开始。

### 使用 `SimpleDirectoryReader` 摄取多种数据格式

```ini
from llama_index.core import SimpleDirectoryReader

reader = SimpleDirectoryReader(
    input_dir="files",
    recursive=True
)

documents = reader.load_data()

for doc in documents:
    print(doc.metadata)
```

`SimpleDirectoryReader` 内置了一些方法，可以判断每种文件类型最适合使用哪个 reader。你不需要担心这些细节。它会基于文件扩展名，自动检测 PDF、DOCX、CSV、纯文本等格式。然后，它会选择最合适的工具，将内容提取成 `Document` 对象。对于纯文本文件，它只是读取文本内容。对于 PDF 和 Office 文档等二进制文件，它会使用 PyPDF 和 Pillow 等库来提取文本。

`SimpleDirectoryReader` 可以轻松处理不同文件，并将解析后的内容作为文档返回。默认情况下，它只处理目录顶层的文件。如果要包含子目录，需要将 `recursive` 参数设置为 `True`。

你也可以传入一个具体文件列表来加载，像这样：

```ini
files = ["file1.pdf", "file2.docx", "file3.txt"]
reader = SimpleDirectoryReader(files)
documents = reader.load_data()
```

结果是一批准备好用于索引的 `Document` 对象，只需要几行代码就能完成。你不需要为每种文件类型分别设置单独的数据 reader，也不会因此头疼。当你需要快速、简单的数据摄取，并且不想增加额外复杂性时，就让 `SimpleDirectoryReader` 来完成这些艰苦工作吧！它既通用，又自动化。

### 借助 LlamaParse 像专家一样解析

LlamaParse 的一个突出特性是，它允许你使用 `parsing_instruction` 参数提供自然语言指令来指导解析。既然你最了解自己的文档，就可以准确告诉 LlamaParse 你需要什么样的输出，以及这些信息应该如何从文件中提取。

例如，在解析一篇技术白皮书时，你可以指示它提取所有章节标题、忽略脚注，并以 markdown 格式输出所有代码片段。LlamaParse 会遵循你的指令，并准确解析文档。

除了指令引导解析模式之外，LlamaParse 还提供 JSON 输出模式，它可以提供关于已解析文档的丰富结构化数据，包括标记表格、标题、提取图像等。此外，LlamaParse 还可以与 `SimpleDirectoryReader` 结合使用，一次性批量摄取整个文件夹，正如你将在下一个示例中看到的那样。这为你基于复杂文档集合构建定制 RAG 应用提供了完整灵活性。你也可以通过为数据集合中的每种文件格式使用专门的数据 reader，手动完成这件事。不过，使用 LlamaParse 会极大简化这个过程，提高整体质量，并节省大量时间。

LlamaParse 支持的文件类型非常广泛且还在扩展，并不只是 PDF，还包括 Word 文档、PowerPoint、RTF、ePub 等等。它提供了慷慨的免费层，便于你开始使用。

```code
pip install llama-cloud-services llama-cloud
```

下一步是在 [cloud.llamaindex.ai](https://cloud.llamaindex.ai/) 创建一个免费账户，并获取 API key。获得 key 之后，你可以直接在代码中使用它；但为了更安全，建议将 key 作为本地环境变量添加，变量名为 `LLAMA_CLOUD_API_KEY`。为了展示这个工具的能力，我设计了一个结构复杂的示例 PDF，如图 4.1 所示：

**图 4.1 —— 包含多篇文章、图像和表格的示例 PDF**

让我们看一个使用 LlamaParse 摄取这个 PDF 的基础代码示例。

首先，我们导入必要模块：

```javascript
import models_config
from llama_cloud_services import LlamaParse
from llama_index.core import SimpleDirectoryReader
from llama_index.core import VectorStoreIndex
```

接下来，我们配置 LlamaParse，并将其作为 `file_extractor` 参数传给 `SimpleDirectoryReader`：

```ini
parser = LlamaParse(result_type="text")
file_extractor = {".pdf": parser}

reader = SimpleDirectoryReader(
    "./files/pdf",
    file_extractor=file_extractor
)

docs = reader.load_data()
```

```ini
index = VectorStoreIndex.from_documents(docs)
qe = index.as_query_engine()

response = qe.query(
    "List all large dog breeds mentioned in Table 2 "
)

print(response)
```

这个脚本的输出应该类似如下：

```code
Started parsing the file under job_id <…>
German Shepherd, Golden Retriever, Labrador Retriever
```

使用 LlamaParse 这类托管服务时，一个重要考虑因素是数据隐私。在通过 API 提交你的专有数据之前，请务必仔细查看它们的隐私政策，以确保其符合你的数据保护要求。虽然这个服务提供了强大的解析能力，但保护敏感信息至关重要。

另外，请记住 LlamaParse 是付费服务。它采用基于 credit 的定价模式，既方便初学者入门，也能够面向重度用户扩展。该服务提供慷慨的免费层，每月给你足够的 credit，让你熟悉平台，并处理中等规模的文档处理工作负载，而无需任何前期成本。一旦超出免费额度，你可以选择按需购买额外 credit，或升级到包含更多 credit 的月度订阅计划——如果你经常处理文档，这会非常合适。

消耗多少 credit 取决于你选择的解析层级。LlamaParse 使用层级系统：Fast、Cost Effective、Agentic 和 Agentic Plus。你可以根据使用场景，在成本、速度和准确性之间选择合适平衡。例如，Fast 层级用于简单文本提取时每页只使用 1 个 credit，而 Agentic Plus 会使用更多 credit，但在最复杂文档上提供最先进的准确性。这取代了手动配置解析模式和模型的需要。你只需选择一个层级，剩下的交给 LlamaParse。

对于处理大规模文档的企业用户，LlamaParse 提供定制定价计划，并包含专属支持和私有云部署选项等额外功能，以增强安全性。你可以直接通过 LlamaParse dashboard 跟踪 credit 使用量，并探索不同价格层级。一如既往，我建议你查看当前价格：[www.llamaindex.ai/pricing](https://www.llamaindex.ai/pricing)，因为随着服务持续改进，成本和计划细节可能会变化。

## 将文档解析成节点

### 对节点解析器和文本拆分器之间的区别感到困惑？

一开始，将解析模块分为这两组可能会造成一些困惑。为了简化理解，你可以认为节点解析器是一种比简单拆分器更复杂的机制。虽然二者都服务于相同的基本功能，并工作在不同复杂度层级上，但它们的实现方式不同。

文本拆分器会根据某些规则或约束，例如 `chunk_size` 或 `chunk_overlap`，将长篇扁平文本拆分成节点。这些节点可以表示行、段落或句子，也可能包含附加元数据，或指向原始文档的链接。

节点解析器更复杂，并涉及额外的数据处理逻辑。除了简单地将文本拆分成节点之外，它们还可以执行额外任务，例如分析 HTML 和 JSON 文件结构，并生成带有上下文信息增强的节点。

## 理解简单文本拆分器

文本拆分器会在原始文本层面，将文档拆解成更小的片段。当内容是扁平结构，并且没有特定格式时，它们非常有用。

要运行我即将展示的示例，请确保在所有示例代码开头，添加以下必要导入和使用 `FlatReader` 的文档读取逻辑：

```javascript
from llama_index.core.node_parser import <Splitter_Module>
from llama_index.readers.file import FlatReader
from pathlib import Path

reader = FlatReader()
document = reader.load_data(Path(<file_name>))
```

`FlatReader` 是一个简单文件 reader，专门用于将纯文本文件的内容加载到 `Document` 对象中，使其准备好由拆分器或解析器进一步处理。

另外，如果你想看到代码生成的实际节点，可以在运行解析器之后添加类似下面的内容：

```python
for node in nodes:
    print(f"Metadata {node.metadata} \nText: {node.text}")
```

好了，让我们看看文本拆分器类别中有哪些内容。

### `SentenceSplitter`

`SentenceSplitter` 被设计用于将文本拆成 chunk，并且强烈倾向于保持句子，甚至完整段落的完整性。与我们将在下一节看到的 `TokenTextSplitter` 相比，这个 splitter 对语言结构更加敏感，并且减少了句子被尴尬地拆分到不同 chunk 中的可能性。

在底层，它采用多阶段拆分策略：

- 首先，它尝试按照段落分隔符拆分文本，例如双换行符
- 如有必要，它会回退到句子 tokenizer，默认情况下是 Natural Language Toolkit，也就是 NLTK 的句子 tokenizer
- 如果 chunk 仍然过大，它会使用可配置 regex 或基于字符的拆分，作为最后手段进行额外拆分

最终得到的是一组 chunk，它们力求尊重自然语言结构，同时仍然遵守配置的 `chunk_size` 和 `chunk_overlap` token 限制。

这个 splitter 的基本工作原理前面已经介绍过。

`SentenceSplitter` 的关键参数包括：

**chunk_size**：每个 chunk 的最大 token 数。

**chunk_overlap**：连续 chunk 之间重叠的 token 数。

**paragraph_separator**：用于分隔段落的字符串，默认是 `"\n\n "`。

**secondary_chunking_regex**：在必要时用于额外句子级拆分的备用 regex。

**separator**：作为最后手段用于词级拆分的默认分隔符。

### `TokenTextSplitter`

`TokenTextSplitter` 工作层级低于 `SentenceSplitter`，它被设计用于基于词 token 将文本拆解成更小的 chunk。它主要在 token 层面运行，并且可以配置为优先在特定分隔符处分割。不同于 `SentenceSplitter` 明确尝试保留句子边界，`TokenTextSplitter` 采用更灵活的方法。它的工作方式是：

- 尝试使用主分隔符拆分文本，默认是空格 `" "`
- 必要时回退到备用分隔符，例如换行符 `"\n"`
- 如果文本仍然超过指定 chunk 大小，则递归按字符拆分，确保没有 chunk 过大

这使它在创建受控 token 长度的 chunk 时非常灵活，同时也允许你对拆分位置有一定控制。`TokenTextSplitter` 的典型代码用法如下：

```ini
splitter = TokenTextSplitter(
    chunk_size = 70,
    chunk_overlap = 2,
    separator = " ",
    backup_separators = [".", "!", "?"]
)

nodes = splitter.get_nodes_from_documents(document)
```

下面是这个 splitter 参数的一些说明：

**chunk_size**：设置每个 chunk 的最大 token 数。

**chunk_overlap**：定义连续 chunk 之间的 token 重叠。

**separator**：用于确定主要 token 边界。

**backup_separators**：如果主分隔符无法充分拆分文本，则用于额外拆分点。

**keep_whitespaces**：表示是否保留 chunk 中开头或结尾的空白字符，默认值为 `False`。

如果 `separator` 或备用分隔符都无法生成足够小、满足 `chunk_size` 限制的 chunk，这个 splitter 会回退到字符级拆分，以保证满足大小约束。如果元数据长度接近或超过 chunk 大小，splitter 会发出警告，因为这会让实际内容几乎没有空间，使 chunk 在嵌入或 LLM 上下文中效率很低。

### `CodeSplitter`

这个智能 splitter 被设计用于解释源代码。它会基于特定编程语言的语法拆分文本，非常适合处理技术文档或源代码。在运行所示示例之前，请确保安装必要依赖：

```perl
pip install tree_sitter
pip install tree-sitter-language-pack
```

```ini
code_splitter = CodeSplitter.from_defaults(
    language = 'python',
    chunk_lines = 5,
    chunk_lines_overlap = 2,
    max_chars = 150
)

nodes = code_splitter.get_nodes_from_documents(document)
```

正如你所看到的，这个 splitter 有几个可以调节的参数：

**language**：指定代码语言。

**chunk_lines**：定义每个 chunk 的行数。

**chunk_lines_overlap**：定义 chunk 之间的行重叠。

**max_chars**：定义每个 chunk 的最大字符数。

这个 splitter 巧妙地建立在一个叫做抽象语法树（AST）的概念之上。AST 是计算机科学中的一个关键概念，主要用于创建翻译或解释代码的程序。它是源代码结构的树形表示，其中每个节点代表一种不同构造：函数、循环、变量声明，等等。图 4.2 给出了 AST 外观的一个基础示例。由于这个 splitter 具备 AST 感知能力，当你拆分代码时，它会尽可能把相关语句放在一起，避免在函数或代码块中间随机拆分。当你后续需要理解或处理代码，并保持代码逻辑流时，这一点至关重要。

**图 4.2 —— CodeSplitter 将整个 FunctionDef 子树保留为一个 chunk，以保持逻辑结构**

如果 splitter 不支持指定语言，或者代码包含语法错误，导致无法正确解析，它会抛出错误并停止流程。

到目前为止，我们只看了 splitter，它们非常适合快速和简单的文本。但如果你的文档带有更多结构，例如 HTML 标签、Markdown 标题或嵌套 JSON，该怎么办？这就是节点解析器登场的地方。

## 使用更高级的节点解析器

文本拆分器只提供了用于拆解文本的基础逻辑，主要依赖简单规则。不过，也有更高级的工具可以将数据分块成节点。这些工具被设计用于处理各种标准文件格式，或可用于更具体类型的内容。

**include_metadata**：决定解析器是否应该考虑元数据。默认设置为 `True`。

**include_prev_next_rel**：决定解析器是否应该自动包含节点之间 prev/next 类型的关系。默认值同样是 `True`。

**callback_manager**：可用于定义特定回调函数。这些函数可用于调试、追踪和成本分析等。

**id_func**：一个可选函数，让你控制每个节点唯一 ID 的生成方式。你提供的函数会接收节点作为输入，并使用你想实现的任何逻辑，以字符串形式返回 ID。如果未提供，LlamaIndex 会使用默认的基于 UUID 的系统来生成 ID。

除了这些通用选项之外，每个解析器还提供特定参数用于定制。你可以在 LlamaIndex 官方文档中找到每个解析器可用参数的完整列表。

让我们探索 LlamaIndex 中可用的节点解析器。

### `SentenceWindowNodeParser`

这个解析器建立在 `SentenceSplitter` 的基础之上，在句子级拆分概念上扩展出一层额外上下文。它将文本拆分成单独句子，并且针对每个句子，在节点元数据中包含其周围句子的窗口。这种附加上下文在检索过程中可能很有用，因为它允许 LLM 访问每个句子周围的文本环境，从而提高响应质量。我们可以像这样使用 `SentenceWindowNodeParser`：

```ini
parser = SentenceWindowNodeParser.from_defaults(
    window_size=2,
    window_metadata_key="text_window",
    original_text_metadata_key="original_sentence"
)

nodes = parser.get_nodes_from_documents(document)
```

对于这个解析器，有三个特定参数可以定制：

**window_size**：定义每侧要包含在窗口中的句子数量。

**window_metadata_key**：定义窗口句子的元数据 key。

**original_text_metadata_key**：定义原始句子的元数据 key。

### `LangchainNodeParser`

这个解析器充当 LlamaIndex 与 LangChain 之间的桥梁，允许你使用 LangChain 库中的任何文本 splitter 将文档拆分成节点。它通过接入 LangChain 丰富的 splitter 集合，扩展了 LlamaIndex 原生解析能力，在你需要比内置选项更多的灵活性时非常有用。例如，LangChain 包含依赖 NLTK 或 spaCy 等 NLP 库的 splitter，如果你想更具语言意识地处理句子，这些 splitter 会很方便。

作为下一个示例的前置条件，你需要安装 LangChain Text Splitters 库：

```arduino
pip install langchain-text-splitters
```

下面是一个使用这个解析器的简单示例：

```python
from llama_index.core.node_parser import LangchainNodeParser
from langchain_text_splitter import NLTKTextSplitter
from llama_index.readers.file import FlatReader
from pathlib import Path

reader = FlatReader()
document = reader.load_data(Path("files/sample_document1.txt"))

lc_splitter = NLTKTextSplitter(chunk_size=160, chunk_overlap=0)
parser = LangchainNodeParser(lc_splitter)

nodes = parser.get_nodes_from_documents(document)

for node in nodes:
    print(f"Metadata {node.metadata} \nText: {node.text}")
```

LangChain 框架与 LlamaIndex 的目标类似，提供了一套通用工具集，专门面向高级自然语言处理能力。它的文本分段、摘要和语言理解模型集合，有助于将文本数据拆分并消化成连贯 chunk，准备好以类似 LlamaIndex 的方式进行索引。当处理需要细致语言分析的大型数据源时，LangChain 让用户能够精细控制文本拆解和摄取过程，确保为后续检索和查询保留上下文与清晰度。事实上，在 RAG 场景中，二者可以互相补充。想了解更多？请查看：[www.langchain.com/](https://www.langchain.com/)。

### `SimpleFileNodeParser`

这个解析器会根据文件类型自动决定应该使用哪个节点解析器。它能够自动处理 `.html`、`.md` 和 `.json` 文件格式，并将它们转换为节点，从而简化与各种内容类型交互的过程：

```ini
from llama_index.readers.file import FlatReader
from llama_index.core.node_parser import SimpleFileNodeParser
from pathlib import Path

documents = FlatReader().load_data(Path("files/sample_document1.txt"))

parser = SimpleFileNodeParser()
nodes = parser.get_nodes_from_documents(documents)
```

加载数据时，`FlatReader` 会自动向每个文档添加有用元数据，包括文件扩展名，例如 `.txt`、`.pdf`、`.md` 等。`SimpleFileNodeParser` 使用这个扩展名元数据，为每个文件动态选择合适解析器。基于文件类型，它会选择正确逻辑将内容拆分成节点。如果它识别出文件扩展名，就应用专门解析逻辑。如果没有识别出来，则回退为将整个内容作为简单文本 chunk 处理。

接下来，我们来谈谈 `FlatReader` 能识别的不同格式，以及它们对应的解析器。

### `HTMLNodeParser`

这个解析器使用 Beautiful Soup——一个流行的 Python 库，用于从 HTML 中提取和清理信息——来解析 HTML 文件，并基于选定 HTML 标签将其转换成节点。它通过从特定标签中提取文本来简化 HTML 内容，并智能地将连续的同类型元素合并成一个节点。这有助于减少碎片化，生成更干净、更连贯的节点。解析器可以像这样使用：

```scss
my_tags = ["p", "span"]
html_parser = HTMLNodeParser(tags=my_tags)

nodes = html_parser.get_nodes_from_documents(document)

print('<span> elements:')
for node in nodes:
    if node.metadata['tag']=='span':
        print(node.text)

print('<p> elements:')
for node in nodes:
    if node.metadata['tag']=='p':
        print(node.text)
```

正如你所看到的，你可以选择指定希望从哪些 HTML 标签中提取内容。如果没有提供标签，解析器会默认选择常见的承载文本的标签，例如 `<p>`、`<h1>`、`<h2>`、`<li>`、`<section>` 等，将相邻的同类型标签合并成一个节点，以保留上下文分组，并在节点元数据中添加一个 `tag` 字段，表示文本来源于哪个 HTML 标签。

### `MarkdownNodeParser`

这个解析器处理原始 Markdown 文本，并根据文档标题结构将其拆分成节点。每遇到一个标题，它就生成一个包含对应内容章节的节点，并自动在节点元数据中追踪标题层级。这种方法对于在摄取和检索过程中保留 Markdown 文档的结构化上下文非常有用。下面是 `MarkdownNodeParser` 的使用方式：

```ini
parser = MarkdownNodeParser.from_defaults()
nodes = parser.get_nodes_from_documents(document)
```

`MarkdownNodeParser` 有几个需要考虑的重要特性：

- 它根据 Markdown 标题拆分内容，例如 `#`、`##` 等
- 它追踪标题层级，例如 `# Introduction → ## Subsection`，并将这个路径存储在节点元数据的 `header_path` 字段中
- 标题路径的分隔符可以自定义，默认是 `/`
- 解析器会智能地忽略代码块中的标题，也就是被三个反引号 ``` 包围的内容，确保代码部分不会被错误拆分
- 如果没有标题，整个文档会被视为一个单独节点

这个解析器简化了结构化 Markdown 文件的处理，确保节点保留后续查询和检索所需的上下文信息。

### `JSONNodeParser`

`JSONNodeParser` 被设计用于处理结构化 JSON 数据，并将其转换成 LlamaIndex 可以索引和查询的节点。它递归遍历 JSON 结构，并将其展平为线性文本格式，同时在生成的节点内容中保留层级 key 路径。

这个解析器简化了嵌套 JSON 对象或数组的处理，将它们转换成可搜索文本，同时保留重要结构上下文。

JSON 解析器的使用方式与 Markdown 解析器类似：

```ini
json_parser = JSONNodeParser.from_defaults()
nodes = json_parser.get_nodes_from_documents(document)
```

解析器期望文档文本是有效 JSON，也就是 dict 或 dict 对象列表。然后，解析器会使用深度优先搜索，递归遍历 JSON 结构的每一层。

深度优先搜索（DFS）是一种探索结构化数据的方法，例如树或嵌套 JSON。它从根开始，沿着一条分支尽可能深入，再回溯。它会完整探索每条路径，然后再移动到下一条路径。对于 JSON 解析而言，DFS 确保解析器按照正确的层级顺序访问每个嵌套 key 和 value，使得即使是深度嵌套的信息，也能够被提取并包含在最终输出中。

对于每个叶子节点，也就是具有非 dict、非 list 值的节点，解析器会输出完整 key 路径和对应值，作为一行文本。这些行随后被组合成节点内容，用来反映原始 JSON 的结构。

### `SemanticSplitterNodeParser`

例如，假设我们有下面这段短文本：

```sql
Cats are popular pets around the world.
They are known for being independent and curious.
In many cultures, cats are symbols of luck.
Airplanes are one of the fastest ways to travel long distances.
They can carry hundreds of passengers at once.
```

普通 splitter 可能会不管含义，直接把它拆成每个 chunk 两三句话。但 `SemanticSplitterNodeParser` 会注意到，前三句话都在谈猫，而后两句话在谈飞机。它不会把它们混在一起，而是会把关于猫的句子分成一个节点，把关于飞机的句子分成另一个节点。

这样，每个节点都聚焦在单一主题上，当后续有人提问时，检索会准确得多。

这个高级解析器使用嵌入模型，根据含义比较相邻句子组。当组与组之间的语义差异超过某个阈值时，会在节点之间引入断点。

这使它非常适合那些保持相关信息连贯 chunk 至关重要的场景，例如解析研究文档或信息密集的技术内容。

下面是使用 `SemanticSplitterNodeParser` 的一种简单方式：

```ini
import models_config
from llama_index.core import Settings
from llama_index.core.node_parser import SemanticSplitterNodeParser
from llama_index.readers.file import FlatReader
from pathlib import Path

reader = FlatReader()
document = reader.load_data(Path("files/black_bears.txt"))

parser = SemanticSplitterNodeParser.from_defaults(
    embed_model=Settings.embed_model,
    buffer_size=1,
    breakpoint_percentile_threshold=95
)

nodes = parser.get_nodes_from_documents(document)

for node in nodes:
    print(f"Metadata {node.metadata} \nText: {node.text}")
```

在这个示例中，我们首先导入 `models_config`，以指示 LlamaIndex 切换到我们自定义的本地托管 Ollama 嵌入模型。然后，我们从名为 `ch4\data` 的子文件夹中的文本文件加载数据，这是一篇关于棕熊的文本。由于这个解析器默认使用 OpenAI embedding，而不是使用已经定义在 `Settings` 中的模型，因此我们需要一个 workaround，通过传入参数 `embed_model=Settings.embed_model` 手动指定 Ollama 嵌入模型。在这个上下文中，它表示使用已经由 `models_config.py` 定义到 `Settings` 中的嵌入模型。

然后，解析器会处理文本：先将其拆成句子，再根据相邻句子的语义相似度进行分组，并在组与组之间含义发生显著变化的位置插入断点，最终生成反映内容真实结构的节点。

这个高级解析器有多个可以调整的参数：

**embed_model**：指定用于比较句子之间语义相似度的嵌入模型。如果未提供，LlamaIndex 默认使用 `OpenAIEmbedding`。在我们的示例中，我们使用了自己通过 Ollama 兼容的嵌入模型。

**buffer_size**：定义当前句子前后各有多少句子会被组合起来进行语义比较。较大的值会为评估含义创建更多上下文，但也会增加计算成本。

**breakpoint_percentile_threshold**：控制基于语义差异拆分文本的激进程度。较低阈值会产生更多节点，也就是更细粒度；较高阈值会产生更少、更大的节点。

**sentence_splitter**：可选的自定义句子 splitter 函数，如果你想控制初始句子的提取方式，可以使用它。例如，你可以指定一个更高级的句子拆分函数，比如我在前面某节中演示过的 `NLTKTextSplitter`。

`SemanticSplitterNodeParser` 会先将文本拆成句子，然后将相邻句子组合成小组。它使用嵌入模型比较这些小组的含义，并计算它们之间有多大差异。在语义差异超过设定阈值的位置，它会插入断点，将断点之间的文本变成单独节点。这样得到的是基于自然主题边界，而不是任意长度的文本拆分结果。

到目前为止，我们看过的 splitter 和 parser 都关注如何拆分文本。接下来，让我们探索另一个角度：那些不只是拆分，还会通过关系把节点连接起来的解析器。

## 使用关系型解析器

关系型解析器会将信息解析成彼此通过关系连接的节点。关系为我们的数据增加了一个全新维度，并支持 RAG 工作流中更高级的检索技术。这些关系，例如 `PARENT` 和 `CHILD`，有助于在不同内容 chunk 之间建立层级、分组或依赖关系。

### `HierarchicalNodeParser`

`HierarchicalNodeParser` 会将节点组织成多层级结构。它通过在层级结构的每一层应用不同节点解析器来做到这一点，通常这些解析器具有不同 chunk size。较高层级节点覆盖更大的文本片段，而较低层级节点表示逐渐更小、更详细的片段。你可以想象同时按章节、节和段落对一本书进行总结。首先，你把书拆成大章节，然后把每章拆成更小的节，同时追踪它们之间如何连接。这样，你既能快速找到高层次概览，也能找到细粒度细节，而不会丢失结构。

**Level 1**：章节大小 2,048 tokens

**Level 2**：章节大小 512 tokens

**Level 3**：章节大小 128 tokens

较大的顶层节点可以提供高层次摘要，而较低层节点可以对文本片段进行更详细分析。请看图 4.3，它给出了这个概念的视觉表示：

**图 4.3 —— chunk size 为 2,048、512 和 128 的层级节点**

通过这种方式，不同节点层级可以用于调整搜索结果的准确性和深度，让用户能够在不同粒度层面查找信息。

下面是如何在代码中使用这个解析器的示例：

```ini
hierarchical_parser = HierarchicalNodeParser.from_defaults(
    chunk_sizes=[128, 64, 32],
    chunk_overlap=0,
)

nodes = hierarchical_parser.get_nodes_from_documents(document)
```

这个解析器有两个特定参数可以配置：

**chunk_sizes**：这个列表中的值会基于内容大小定义你的层级。

**chunk_overlap**：定义 chunk 之间的重叠大小。

### `UnstructuredElementNodeParser`

我把这个留到最后，因为它面向更复杂的情况。

数据并不总是直截了当。许多真实世界文档，例如研究论文、财务报告或技术相关文档，都包含非结构化文本和结构化表格数据的混合内容。摄取这类异构文档会带来额外复杂性：我们不仅需要提取文本，还需要识别、解析和处理嵌入在文本中的表格。有时你处理的是纯文本，有时是表格，而且经常是二者混合。传统文本 splitter 难以处理这类内容，因为它们倾向于把所有内容都当成纯文本处理，常常忽略结构，并在过程中丢失有价值的上下文。

`UnstructuredElementNodeParser` 就是为处理这些场景而设计的。它使用 `unstructured` 库智能处理文档，将纯文本与表格等嵌入结构分离出来。文本和表格内容都会被解析成 `TextNode` 对象。当检测到表格时，其底层 HTML 会被提取并转换成 pandas `DataFrame`，然后作为元数据存储在节点中。这允许解析器保留语义结构，同时避免丢失表格信息。我们将在下一节“使用元数据改善上下文”中更多讨论元数据。

将文本和表格作为独立节点存储，可以让后续 RAG 工作流中的处理更加模块化，也更有意义。文本可以像普通内容一样通过关键词等元素进行索引和搜索，而表格则可以加载到 DataFrame 或任何结构化数据库中，以支持基于 SQL 的访问。因此，在涉及混合数据类型的复杂情况下，在摄取前使用这种方法，可以更好地组织数据，并提高检索准确性。

## 理解 `chunk_size` 和 `chunk_overlap`

`chunk_size` 定义文本 chunk 的最大大小，通常以 token 计量，而不是字符。这确保节点对于索引和 LLM 处理来说，都保持在可管理大小之内。在 LlamaIndex 中，默认 `chunk_size` 是 1,024 tokens。

`chunk_overlap` 指定前一个 chunk 中有多少 token 应该被包含在下一个 chunk 的开头。这些重叠内容有助于在相邻节点之间保持上下文。默认 `chunk_overlap` 设置为 20 tokens。

在构建 RAG 系统时，选择合适 chunk size 是一个重要设计决策。如果 chunk 太小，重要上下文可能会丢失，从而降低 LLM 响应质量。反过来，如果 chunk 太大，发送给 LLM 的提示词就会变得臃肿，增加计算成本，并可能超过模型限制。

LlamaIndex 团队曾进行实验，以确定合理的 chunk size 默认值，你可以在这里更详细了解：

[blog.llamaindex.ai/evaluating-…](https://blog.llamaindex.ai/evaluating-the-ideal-chunk-size-for-a-rag-system-using-llamaindex-6207e5d3fec5)

**图 4.4 —— chunk_size 和 chunk_overlap 说明**

```less
Gardening is not only a relaxing hobby but also an art form. Cultivating plants, designing landscapes, and nurturing nature bring a sense of accomplishment. Many find it therapeutic and rewarding, especially when they see their garden flourish.
```

文本会被拆分成以下区域：

**Node 1**，前 100 个字符：

```css
" Gardening is not only a relaxing hobby but also an art form. Cultivating plants, designing landscapes, an "
```

**Node 2**，从第 75 个字符开始，接下来 100 个字符：

```arduino
" designing landscapes, and nurturing nature bring a sense of accomplishment. Many find it therapeutic and re "
```

**Node 3**，从第 150 个字符开始到文本结束：

```arduino
" Many find it therapeutic and rewarding, especially when they see their garden flourish "
```

在这个设置中，Node 1 与 Node 2 之间的重叠是：

```arduino
" designing landscapes, an "
```

而 Node 2 与 Node 3 之间的重叠是：

```arduino
" Many find it therapeutic and re "
```

## 使用 `include_prev_next_rel` 包含关系

下面是另一个可以决定解析器行为的重要参数：`include_prev_next_rel` 选项。当设置为 `True` 时，这个参数会让解析器自动在连续节点之间添加 `NEXT` 和 `PREVIOUS` 关系。下面是一个示例：

```ini
node_parser = SentenceWindowNodeParser.from_defaults(
  include_prev_next_rel=True
)
```

这有助于捕获节点之间的顺序关系。随后在查询时，你可以选择使用 `PrevNextNodePostprocessor` 这类功能，检索前一个或后一个节点，以获得更多上下文。

**Node 0**：链条中的第一个节点；只会有一个 `NEXT` 关系：

```ini
node0.relationships[NEXT] = RelatedNodeInfo(node_id=node1.node_id)
```

**Node1**：中间节点；会同时有 `PREVIOUS` 和 `NEXT`：

```ini
node1.relationships[PREVIOUS] = RelatedNodeInfo(node_id=node0.node_id)
node1.relationships[NEXT] = RelatedNodeInfo(node_id=node2.node_id)
```

**Node2**：链条中的最后一个节点；只会有一个 `PREVIOUS` 链接：

```ini
node2.relationships[PREVIOUS] = RelatedNodeInfo(node_id=node1.node_id)
```

捕获这些顺序关系，有助于在长文档中提供上下文连续性，也会带来很多其他好处，支持来源追踪、知识图谱构建和更复杂的索引结构。

除此之外，拥有 previous-next 关系可以支持 cluster retrieval：你可以通过沿着关系获取附近连接节点，从而得到一组相关节点。这提供了更聚焦的上下文，而不是随机分散的节点。在跟随故事或对话时，通过内容维护连贯叙事线索，也是让节点之间具备这些关系的另一个好理由。

本章中我们已经介绍了大量 parser 和 splitter，它们分别面向不同内容类型和使用场景。表 4.1 提供了一个快速参考，帮助你选择合适工具。请记住，你对解析器的选择可能会显著影响检索质量。

| Parser / Splitter | 最适合 | 是否需要嵌入模型 |
| --- | --- | --- |
| SentenceSplitter | 通用文本；保留句子边界 | 否 |
| TokenTextSplitter | 严格 token 预算控制；当 token 限制比句子完整性更重要时有用 | 否 |
| CodeSplitter | 源代码；沿 AST 边界拆分，以保持函数和类完整 | 否 |
| SentenceWindowNodeParser | 细粒度检索；每个句子成为一个节点，并在元数据中包含周围上下文 | 否 |
| SemanticSplitterNodeParser | 主题变化重要的内容；将语义相似的句子组合在一起 | 是 |
| HierarchicalNodeParser | 多层级检索；以不同 chunk size 创建父子节点层级 | 否 |
| SimpleFileNodeParser | 混合文件类型；根据文件扩展名自动选择正确解析器 | 否 |
| HTMLNodeParser | HTML 内容；从特定标签中提取文本 | 否 |
| MarkdownNodeParser | Markdown 文件；按标题拆分并保留文档结构 | 否 |
| JSONNodeParser | 结构化 JSON 数据；保留键值关系 | 否 |
| LangchainNodeParser | 在 LlamaIndex 中使用 LangChain splitter | 否 |
| UnstructuredElementNodeParser | 包含表格和混合元素的复杂文档 | 否 |

**表 4.1 —— 节点解析器和拆分器概览**

## 使用文本拆分器和节点解析器的实际方式

你在代码中如何实现节点解析器或文本拆分器，取决于你想对分块过程进行多大程度的定制。但归根结底，主要有三种选项。

### 选项 1：独立使用

```ini
from llama_index.core import Document
from llama_index.core.node_parser import SentenceWindowNodeParser

doc = Document(
    text="Sentence 1. Sentence 2. Sentence 3."
)

parser = SentenceWindowNodeParser.from_defaults(
    window_size=2,
    window_metadata_key="ContextWindow",
    original_text_metadata_key="node_text"
)

nodes = parser.get_nodes_from_documents([doc])
```

这段代码会生成三个 node 对象。如果我们查看第二个节点，例如运行 `print(nodes[1])`，会得到以下输出：

```yaml
Node ID: 0715876a-61e6-4e77-95ba-b93e10de1c67
Text: Sentence 2.
```

正如你所看到的，解析器提取了第二个句子，并为这个节点分配了一个随机 ID。但如果我们查看节点的元数据，例如运行 `print(nodes[1].metadata)`，还会看到它收集到的上下文，使用的是我们指定的 key，在这个例子中是 `ContextWindow` 和 `node_text`：

```arduino
{'ContextWindow': 'Sentence 1.  Sentence 2.  Sentence 3.', 'node_text': 'Sentence 2. '}
```。

### 选项 2：在 Settings 中配置

第二个选项更通用，也更方便，适用于你需要在应用中为多个用途自动使用同一个 parser 的情况。下面是一个示例：

```ini
import models_config
from llama_index.core import Settings, Document, VectorStoreIndex
from llama_index.core.node_parser import SentenceWindowNodeParser

doc = Document(
    text="Sentence 1. Sentence 2. Sentence 3."
)

text_splitter = SentenceWindowNodeParser.from_defaults(
    window_size=2,
    window_metadata_key="ContextWindow",
    original_text_metadata_key="node_text"
)

Settings.text_splitter = text_splitter

index = VectorStoreIndex.from_documents([doc])
```

### 选项 3：作为摄取流水线的一部分

第三个选项依赖于将 parser 定义为摄取流水线中的一个转换步骤。摄取流水线是一种自动化、结构化的过程，用来通过一系列转换步骤收集并处理数据。每一步都会在数据通过流水线时修改或丰富数据。

本章稍后的“使用摄取流水线提高效率”一节中，我会解释它如何工作，以及可以用来做什么。你也会看到如何将 parser 作为流水线中的一个 transformation 来实现的代码。

## 使用元数据改善上下文

什么是元数据？它只是我们可以附加到文档和节点上的额外信息。这种额外上下文可以帮助 LlamaIndex 更好地理解我们的数据。它提供关于数据的附加上下文，并且可以在可见性和格式方面进行定制。

例如，假设你已经将一些 PDF 报告摄取为文档。然后，你可以简单地添加一些类似这样的元数据：

```javascript
document.metadata = {
    "report_name": "Sales Report April 2022",
    "department": "Sales",
    "author": "Jane Doe"
}
```

还有一个漂亮的小技巧：你在文档上设置的任何元数据，都会自动向下流入子节点！所以，如果我在一个文档上设置了 `author` 字段，并且 `include_metadata` 被设置为 `True`，这是大多数 parser 的默认状态，那么从该文档派生出来的所有节点都会继承这个 author 元数据。

定义元数据有多种方式：

直接在 `Document` 构造函数中设置元数据值，如下所示：

```ini
document = Document(
    text=".",
    metadata={"author": "John Doe"}
)
```

在文档创建之后添加元数据：

```ini
document.metadata = {"category": "finance"}
```

在摄取过程中自动设置元数据，例如使用 `SimpleDirectoryReader` 这样的数据连接器时。你可以向 `file_metadata` 参数传入一个函数。这个函数接收文件名作为输入，并返回一个包含所需元数据的字典。例如：

```python
def set_metadata(filename):
    return {"file_name": filename}

documents = SimpleDirectoryReader(
    "./data",
    file_metadata=set_metadata
).load_data()
```

使用 LlamaIndex 提供的独立专用 extractor。元数据 extractor，例如 `EntityExtractor`，是一种强大方式，可以利用 LLM 或其他高级技术从文本中生成相关元数据。

将 extractor 定义为摄取流水线中的一个转换步骤。就像节点解析器一样，extractor 也可以成为流水线的一部分。我们将在本章稍后的“使用摄取流水线提高效率”一节中介绍这种方法。

```ini
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter

reader = SimpleDirectoryReader('files')
documents = reader.load_data()

parser = SentenceSplitter(include_prev_next_rel=True)
nodes = parser.get_nodes_from_documents(documents)
```

这段样板代码会准备你的数据，也就是从 `files` 子文件夹摄取数据，并把你需要的一切放到节点中。我们会将元数据存储在名为 `metadata_list` 的变量中。我在每个示例末尾都添加了 `print(metadata_list)`，这样我们就能看到提取出来的元数据输出。除了描述它们的逻辑，我还突出展示了每个 extractor 的实际用途。

### `SummaryExtractor`

`SummaryExtractor` 使用 LLM 为每个 `TextNode` 生成简洁摘要，从而在检索过程中提供额外上下文。可选情况下，它还可以为前一个和后一个相邻 `TextNode` 对象生成摘要，以进一步丰富可用上下文。下面是一个示例：

```ini
import models_config
from llama_index.core.extractors import SummaryExtractor

summary_extractor = SummaryExtractor(summaries=["prev", "self", "next"])
metadata_list = summary_extractor.extract(nodes)

print(metadata_list)
```

这有点像翻到本书某一章的最后一页：你可以一眼看到主要思想，而不必重新阅读每一个细节。同样，摘要让你的 RAG 系统能够锁定正确的上下文 chunk，节省 token，并加速响应。

**section_summary**：节点自身的摘要。

**prev_section_summary**：前一个节点的摘要，如果指定了 `prev`。

**next_section_summary**：下一个节点的摘要，如果指定了 `next`。

使用这个 extractor，可以让检索机制在不处理文档全部内容的情况下，考虑文档摘要。

### 实际使用场景

想象一个客户支持知识库，`SummaryExtractor` 可以为客户问题和解决方案提供摘要。然后，当新的支持请求进入时，我们的应用可以检索最相关的历史案例，以帮助生成详细且具备上下文的解决方案。

你可以通过将 `summaries` 设置为 `self`、`prev` 和 `next` 的任意组合，来定制要生成哪些摘要。其他值会触发错误。它们会分别填充 `section_summary`、`prev_section_summary` 和 `next_section_summary`。此外，你还可以通过在 `prompt_template` 参数中定义提示词，修改实际传给 LLM 使用的 prompt。

### `QuestionsAnsweredExtractor`

`QuestionsAnsweredExtractor` 会基于每个 `TextNode` 的内容，生成一组该节点非常适合回答的问题。这些问题会存储在节点元数据中，并且可以显著提高检索精度，尤其是在问答系统中。下面的示例可以让你了解它的用法：

```scss
import models_config
from llama_index.core.extractors import QuestionsAnsweredExtractor

qa_extractor = QuestionsAnsweredExtractor(questions=5)
metadata_list = qa_extractor.extract(nodes)

print(metadata_list)
```

这个 extractor 使用 LLM 分析每个节点文本，并生成一组可以使用该内容回答的相关问题。这些问题会存储在名为 `questions_this_excerpt_can_answer` 的 key 下。

### 实际使用场景

在客户支持 FAQ 系统中，这个 extractor 可以基于帮助文章或历史支持案例生成问题。在检索阶段，系统随后可以将用户输入查询与这些生成问题进行匹配，从而更容易定位准确且相关的答案。

你可以定制 extractor 生成的问题数量，也可以通过设置 `prompt_template` 参数，定制实际传给 LLM 使用的 prompt。还有一个 `embedding_only` 布尔参数，如果设置为 `True`，会让这些元数据仅对 embedding 可用。

### `TitleExtractor`

`TitleExtractor` 会基于每个文档中前几个节点的内容，生成一个文档级标题。不同于一些只支持 `TextNode` 的 extractor，`TitleExtractor` 被设计为同时支持文本和非文本节点，例如 `ImageNode`。当处理可能缺少明确标题的长文档或非结构化文档时，这尤其有用。下面是一个简单示例：

```scss
from llama_index.core.extractors import TitleExtractor

title_extractor = TitleExtractor()
metadata_list = title_extractor.extract(nodes)

print(metadata_list)
```

这个 extractor 会分析每个文档中的前几个节点，你可以通过 `nodes` 参数控制分析数量。它使用 LLM 从这些节点中生成潜在标题线索，然后将它们组合起来，推断整体文档标题。这个标题随后会作为元数据存储在 `document_title` 这个 key 下。

### 实际使用场景

在数字图书馆或知识库中，`TitleExtractor` 可以通过生成有意义的标题来帮助文档分类，即使文件本身缺少明确标题也可以。这增强了可搜索性，尤其是在检索过程中标题被用作关键词时。

这个 extractor 有几个可以调整的参数：

**nodes**：指定从每个文档开头分析多少个节点以生成标题。

**node_template**：允许你定制用于在节点层面提取标题的 prompt 模板。

**combine_template**：定义用于将多个节点级标题合并为一个文档级标题的 prompt 模板。

### `EntityExtractor`

```perl
pip install llama-index-extractors-entity
```

NER 是计算机用于识别并标注文本中特定实体的一种技术，例如人名、公司名、地点和日期。这有助于计算机更好地理解内容，并在 RAG 场景中提供有用上下文。

下面是使用这个 extractor 的代码示例：

```ini
from llama_index.core.extractors import EntityExtractor

entity_extractor = EntityExtractor(
    label_entities = True,
    device = "cpu"
)

metadata_list = entity_extractor.extract(nodes)

print(metadata_list)
```

这个 extractor 会识别文本中的命名实体，给它们打标签，并添加到元数据中，使检索系统能够聚焦于包含特定引用的节点。

`device` 参数指定 NER 模型是在 CPU 还是 GPU 上运行。使用 `"cpu"` 可以获得最大兼容性；如果你有兼容的 NVIDIA GPU，并希望加快处理速度，可以使用 `"cuda"`。

命名实体如何存储，取决于 `label_entities` 标志：如果 `label_entities=True`，每种实体类型都会得到自己的元数据字段；否则，它们都会存储在一个通用的 `entities` 字段下。

### 实际使用场景

想象一个法律文档归档系统，每个节点都带有这样的元数据。这个 extractor 可以简化检索提到特定人物、地点或组织的文档，从而为我们的查询提供最佳上下文。

这个 extractor 有一长串可以调节的参数：

**model_name**：设置 SpanMarker 使用的底层 transformer 模型。

**prediction_threshold**：修改命名实体预测的默认最小阈值 0.5。正如你可能已经猜到的，实体识别通常不是一个 100% 准确的过程。不过，你可以在这里尝试不同值，直到找到最佳折中。降低阈值会提取更多实体，但也会有更多误报；提高阈值会增加精度，错误更少，但你可能会漏掉一些真实实体。

**span_joiner**：修改用于连接 span，也就是被识别为实体的原始文本片段的默认字符串。

**label_entities**：如果设置为 `True`，extractor 会为每个实体名称标注实体类型。这在后续检索和查询阶段可能很有用。默认情况下，它被设置为 `False`。

**device**：控制模型运行在哪个设备上。默认是 `cpu`，但如果你的系统支持，也可以设置为 `cuda`。

**entity_map**：允许你为每种实体类型定制标签。extractor 自带一个预定义 entity map，其中包括人物、组织、地点、事件以及许多其他类型的标签。

**tokenizer**：允许你更改默认 tokenizer 函数，默认是 NLTK tokenizer。

### `KeywordExtractor`

`KeywordExtractor` 会为每个 `TextNode` 生成一个重要关键词列表，帮助丰富节点元数据，以便进行更有效的检索或推荐任务。让我们看一个示例：

```scss
import models_config
from llama_index.core.extractors import KeywordExtractor

key_extractor = KeywordExtractor(keywords=3)
metadata_list = key_extractor.extract(nodes)

print(metadata_list)
```

这个 extractor 使用 LLM 分析每个 `TextNode` 的内容，并生成一个相关关键词或关键短语的简单列表。这些内容会存储在节点元数据的 `excerpt_keywords` key 下。

### 实际使用场景

将 `KeywordExtractor` 集成到内容推荐引擎中，可以显著增强其效果。通过将从内容节点中提取的关键词，与用户搜索中使用的词语对齐，推荐引擎可以更准确地匹配并推荐符合用户兴趣的内容。这种基于关键词的匹配，确保推荐不仅相关，而且能针对用户正在探索的具体问题或主题进行定制。

你可以通过将 `keywords` 参数改为特定值，定制这个 extractor 生成的关键词数量。还可以调整 `prompt_template`，它定义了发送给 LLM 用于关键词生成的 prompt。

### `PydanticProgramExtractor`

这个高级 extractor 允许你使用自定义 Pydantic 模型和一次 LLM 调用，为 `TextNode` 对象生成结构化元数据。它非常适合复杂场景，在这些场景中，需要以一致且经过验证的格式提取多个元数据字段。

与提取简单关键词或摘要不同，这个 extractor 利用 Pydantic 模型，精确定义提取数据应该如何结构化。你可以在这里查看使用该 extractor 的完整示例：

这把瑞士军刀让你可以通过一次 LLM 调用，创建复杂且结构化的元数据，因此它是一种非常高效的元数据提取方式。这些数据会被很好地组织到我们自己设计的模型中。

### Pydantic 模型快速介绍

Pydantic 模型就像一个蓝图，或者一组你在 Python 程序中以类形式定义的规则。它帮助你确保接收或处理的数据遵循某些规则，并采用正确格式。你可以把它想象成一种定义数据应该长什么样的方式——Pydantic 帮助你执行这些规则，并确保数据符合你期望的结构。

例如，一个 Pydantic 模型可以这样指定：

```python
from pydantic import BaseModel

class EntityMetadata(BaseModel):
    persons: list[str]
    organizations: list[str]
    locations: list[str]
```

然后，extractor 会使用 LLM 基于 `TextNode` 内容为这些字段生成值。

例如，想象你有一个处理用户数据的程序，这些数据包括姓名、年龄和电子邮件地址。你可以创建一个 Pydantic 模型，指定用户姓名应该是字符串，年龄应该是数字，电子邮件地址应该是有效 email 格式。如果输入数据不符合这些规则，Pydantic 会抛出错误，告诉你数据不正确。

它还提供几个可以调节的参数：

**program**：一个必需的 `BasePydanticProgram` 实例，用于定义你的 LLM 设置和 Pydantic 输出模型。

**input_key**：程序模板中用于插入节点内容的输入 key。

**extract_template_str**：用于指示 LLM 提取哪些结构化数据的 prompt 模板。

每当 LlamaIndex 需要确保其处理数据的一致性和正确性时，尤其是在它经常处理复杂结构和相互关联数据时，就会采用这种机制。

### `MarvinMetadataExtractor`

这个 extractor 使用 Marvin AI 工程框架提取元数据：[www.askmarvin.ai/。`MarvinMet…](https://www.askmarvin.ai/%E3%80%82%60MarvinMetadataExtractor%60) 能够可靠且可扩展地提取和增强元数据。它的高级之处在于，提供了类似 Pydantic 模型的类型安全文本 schema，并支持业务逻辑转换。

想象你正在构建一个金融文档索引系统。你可以使用 Marvin 提取 `company_name`、`stock_ticker` 和 `revenue` 等实体，同时应用 schema 验证，以及将 revenue 字符串转换为浮点数这类逻辑。

当在 LlamaIndex 的节点解析流水线中使用时，这个 extractor 会在每个适用节点中，用 `marvin_metadata` 字段丰富结构化元数据。

### 定义你自己的自定义 extractor

如果这些现成 extractor 都不能满足你的需求，你始终可以定义自己的 extractor 函数。下面是一个如何定义自定义 extractor 的简单示例：

```python
from llama_index.core.extractors import BaseExtractor
from typing import List, Dict

class CustomExtractor(BaseExtractor):
    async def aextract(self, nodes) -> List[Dict]:
        metadata_list = [
            {
                "node_length":  str(len(node.text))
            }
            for node in nodes
        ]
        return metadata_list
```

这个基础 extractor 会测量每个节点的字符长度，并将这些值保存到元数据中。当然，你可以用应用所需的任何逻辑替换它。

拥有这么多可用工具和方法当然是件好事。但随后会出现一个新问题：我们真的需要这么多元数据吗？让我们找出答案。

## 拥有所有这些元数据总是好事吗？

不一定。一个关键细节是，元数据会被注入发送给 LLM 和嵌入模型的文本中。这可能会在模型中引入一些偏差。这意味着，有时你可能不希望所有元数据都可见。例如，文件名可能有助于 embedding，但可能会干扰 LLM，因为 LLM 可能不会把它们理解为文件名，而是误认为其他实体；此外，文件名在 prompt 上下文中可能完全没有相关性。例如，如果一个类似 `draft_contract_v2_BAD.docx` 的文件名被传入，`BAD` 这个词可能会影响模型对内容的解释，即使它与合同本身没有任何关系。类似地，无关元数据可能会让模型偏离实际文本，或者让 embedding 基于元数据而非含义将文档聚类到一起。

你可以使用以下命令选择性隐藏元数据：

```ini
document.excluded_llm_metadata_keys = ["file_name"]
```

这会对 LLM 隐藏 `file_name`。如果你愿意，也可以对 embeddings 隐藏元数据：

```ini
document.excluded_embed_metadata_keys = ["file_name"]
```

此外，你还可以像这样定制元数据格式：

```ini
document.metadata_template = "{key}::{value}"
```

这里有一个处理 LlamaIndex 元数据的专业提示。框架中有一个叫做 `MetadataMode` 的 enum，用来控制元数据可见性：

**MetadataMode.ALL**：显示所有元数据。

**MetadataMode.LLM**：只显示对 LLM 可见的元数据。

**MetadataMode.EMBED**：只显示对 embeddings 可见的元数据。

你可以使用以下命令测试元数据可见性：

```ini
print(document.get_content(metadata_mode=MetadataMode.LLM))
```

所以，总结一下，元数据为你的数据提供了非常需要的上下文。你可以完全控制它的格式，以及对不同模型的可见性。这些定制能力让你能够塑造元数据，使其匹配你的使用场景！

这个主题已经讲完了，现在该谈钱了。

## 估算使用元数据提取器的潜在成本

在使用 LlamaIndex 中各种元数据 extractor 时，一个关键考虑因素是相关 LLM 计算成本。虽然本书中的所有示例都使用本地托管模型，可以在你自己的硬件上免费运行，但在生产环境中，你几乎肯定会依赖托管或基于 API 的模型，其中每个 prompt 和 completion 都会被计量和收费。正如前面提到的，大多数 extractor 在底层依赖 LLM 来分析文本并生成描述性元数据。

反复调用 LLM 来处理大量文本，成本可能会快速累积。例如，如果你使用 `SummaryExtractor` 和 `KeywordExtractor` 从数千个节点中提取摘要和关键词，这些持续不断的 LLM 调用会带来显著成本。

为了最小化 LLM 成本，我们建议遵循一些常见最佳实践：

- 将内容批处理到更少的 LLM 调用中，而不是每个节点单独调用一次。这样可以摊销开销，因为相比多次单独调用，你会消耗更少 token。Pydantic extractor 对此非常有用，因为它可以在一次 LLM 调用中生成多个字段。
- 如果不需要非常高准确性，可以使用计算需求更低、更便宜的 LLM 模型。不过要小心——你可能会在数据中引入错误，而这些错误可能会向下游传播并放大。
- 缓存之前的提取结果并复用它们，而不必每次都重新调用 LLM。我们将在本章稍后的“使用摄取流水线提高效率”一节中看到如何使用摄取流水线做到这一点。
- 只对关键节点的选定子集执行元数据提取，而不是全量覆盖。在自动化场景中，这可能很难实现。
- 考虑使用离线 LLM 以消除云成本。根据你的硬件情况，这可能是也可能不是一种解决方案。

下面是一个基础示例，展示在真实 AI 模型上运行 extractor 之前，如何使用 `MockLLM` 估算 LLM 成本。`MockLLM` 是一个替身 LLM，它模拟 LLM 行为，但不会进行任何实际 API 调用：

```python
from llama_index.core import Settings
from llama_index.core.extractors import QuestionsAnsweredExtractor
from llama_index.core.llms.mock import MockLLM
from llama_index.core.schema import TextNode
from llama_index.core.callbacks import (
    CallbackManager,
    TokenCountingHandler
)

llm = MockLLM(max_tokens=256)

counter = TokenCountingHandler(verbose=False)
callback_manager = CallbackManager([counter])

Settings.llm = llm
Settings.callback_manager = CallbackManager([counter])

sample_text = (
    "LlamaIndex is a powerful tool used "
    "to create efficient indices from data."
)

nodes= [TextNode(text=sample_text)]

extractor = QuestionsAnsweredExtractor(
    show_progress=False
)

Questions_metadata = extractor.extract(nodes)

print(f"Prompt Tokens: {counter.prompt_llm_token_count}")
print(f"Completion Tokens: {counter.completion_llm_token_count}")
print(f"Total Token Count: {counter.total_llm_token_count}")
```

你会注意到，我们使用了一些专门工具来进行实际估算。让我们快速概览一下代码。

### `max_tokens` 参数是如何工作的？

这里的目标是估算最坏情况下的成本，假设模型总是生成你用 `max_tokens` 设置的完整 token 数。实践中，大多数响应会更短，因此实际 token 使用量和成本通常低于这个限制。不过，它仍然是一个非常有用的工具，因为它可以帮助你理解不同元数据提取策略应用到不同数据集时，会如何影响总成本。对于元数据提取而言，这个总成本取决于 prompt 和响应大小，再乘以 extractor 执行的总调用次数。在我们的示例中，`CallbackManager` 与 `TokenCountingHandler` 模块结合使用，后者专门用于统计涉及 LLM 的各种操作所使用的 token。当定义 `TokenCountingHandler` 时，你也可以指定 `tokenizer` 参数。

### 什么是 tokenizer？为什么我们需要它？

tokenizer 负责文本的 tokenization，也就是将文本转换成 token，因为 LLM 使用 token 工作，并且也用 token 来衡量模型使用量。当你针对特定 LLM 的特定 prompt 进行成本预测时，使用与该 LLM 兼容的 tokenizer 很重要。每个 LLM 通常会使用特定 tokenizer 训练，该 tokenizer 决定文本如何被拆分成 token。如果你想做更准确的成本预测，使用正确 tokenizer 很重要。默认情况下，LlamaIndex 使用 CL100K tokenizer，这是 GPT-4 专用的 tokenizer。因此，如果你计划使用其他 LLM，可能需要定制 tokenizer。

回到我们的示例，底层发生的事情是，当我们运行 extractor 时，它使用 `MockLLM`，所以一切都保留在本地。然后，`TokenCountingHandler` 会拦截来自这个 `MockLLM` 的 prompt 和响应，并统计实际使用的 token 数量。

在这个示例中，我只展示了如何估算一种 extractor，也就是 `QuestionsAnsweredExtractor` 的成本。如果你需要在同一次运行中估算多个 extractor 的单独成本，可以在运行下一轮提取之前，使用 `token_counter.reset_counts()` 方法将计数器重置为零。

丰富元数据可以解锁很多能力，但如果过度使用且缺乏有意识的优化，它可能会对运营成本产生负面影响，甚至毁掉你的一天。请务必考虑这一点。应用最佳实践来最小化成本，并且在对大型数据集运行 extractor 之前始终先做估算。

## 保护数据隐私

用你的专有数据增强 LLM，在很多情况下这些数据顺便说一句可能属于你的客户，从数据隐私角度看可能是一项具有挑战性的任务。虽然基于云的 LLM 解决方案可以丰富你的专有数据，并提供许多优势，但不受控制地与外部方共享数据，很快就可能演变成法律、安全和监管噩梦。

由于大多数 extractor 依赖通过 LLM 处理内容来生成元数据，你的实际数据会被传输到外部云服务，并由其分析。

这存在暴露或不当处理数据中个人信息或机密信息的风险，原因可能包括安全漏洞、LLM 供应商内部人员风险，或恶意活动。

说到隐私问题，假设我们使用某个 LlamaHub 连接器，例如 `DiscordReader`，来摄取消息并从 Discord 服务器传输数据。鉴于 Discord 消息可能包含私人对话，这里存在潜在隐私问题，尤其是如果没有考虑 Discord 服务条款和消息发送者期望的话。所以，如果你的数据包含私人身份、医疗细节、财务信息等，允许不受限制的提取工作流可能会有问题。

下面是一些缓解隐私风险的方法：

- 在摄取到 LlamaIndex 之前清洗个人数据，例如结合本地 LLM 使用 `PIINodePostprocessor`。下一节会给出这个选项的简单实现指南。
- 只将元数据提取限制在非敏感节点子集上。当然，这假设你已经手动分类了每个节点的敏感性。对于自动化处理流水线来说，这并不实际。
- 在可能的情况下运行本地 LLM，而不是云端 LLM，以限制外部暴露。当然，这取决于你的可用硬件和模型选择。
- 如果某些 LLM 供应商提供加密机制，则启用这些机制。如果隐私在你的实现中非常重要，你可能想进一步考虑并阅读有关全同态加密（FHE）的内容：[huggingface.co/blog/encryp…](https://huggingface.co/blog/encrypted-llm)。

你应该理解的是，使用 LLM 本身就已经给你的数据带来了隐私风险。用 LlamaIndex 这样的额外框架增强这个 LLM，也意味着同时增强了相关隐私风险。

那么，我们如何真正把这些想法付诸实践？最简单且最有效的方法之一，是在数据到达外部模型之前，就把敏感细节清理掉。下面我们就来看看这个做法。

## 清洗个人数据和其他敏感信息

在一个充满爱管闲事的旁观者和数据规则手册的世界里，谨慎对待你的数据非常关键，就像一只松鼠在拥挤公园里守护自己的橡果一样！好消息是，确实有一些解决方案可以保证隐私。而 LlamaIndex 框架已经提供了一个方便方案。

节点后处理器可以为我们解决这个问题。它们会被应用到 retriever 返回的节点上，在响应合成步骤之前，对节点或节点数据本身执行不同转换。这至少是它们最常见的使用场景。

但使用它们还有另一个原因——事实证明，我们也可以在 query engine 外部使用 node processor。比如，它们可以用于在使用外部 LLM 提取元数据之前，清理敏感数据。

目前有三种可用方法：`PIINodePostprocessor`、`NERPIINodePostprocessor` 和 `PresidioPIINodePostprocessor`。第一个被设计为与你手头任何本地 LLM 一起工作；第二个使用专门 NER 模型；第三个依赖微软的 Presidio 库，它通过快速、基于规则的检测，发现电子邮件、信用卡或电话号码等内容。

如果你不熟悉这些缩写，PII 代表 Personally Identifiable Information，即个人身份信息；而 NER 正如前面定义过的，指命名实体识别。NER 模型会从文本中提取并分类关键实体，例如姓名、日期和地点，将其转换为结构化数据。

由于 `PIINodePostprocessor` 仍然被认为是 beta 功能，并且未来可能还会发生更多变化，我将重点放在另外两种方法上。

### 使用 `NERPIINodePostprocessor`

下面是一个使用 `NERPIINodePostprocessor` 清理数据的简单示例。这个方法使用来自 Hugging Face 的 NER 模型来完成工作。为了保持简单，我没有指定特定模型。因此，你可能会看到一个 warning，并且 `HuggingFaceLLM` 很可能默认使用 `dbmdz/bert-large-cased-finetuned-conll03-english` 模型，文档地址如下：

请先确保安装对应集成包：

```perl
pip install llama-index-llms-huggingface
```

此外，第一次运行时，代码会从 Hugging Face 下载模型；你需要确保机器上至少有 1.5 GB 可用空间。

下面是代码：

```ini
from llama_index.core.postprocessor import NERPIINodePostprocessor
from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.core.schema import NodeWithScore, TextNode

original = (
    "Dear Jane Doe. Your address has been recorded in "
    "our database. Please confirm it is valid: 8804 Vista "
    "Serro Dr. Cabo Robles, California(CA)."
)

node = TextNode(text=original)

processor = NERPIINodePostprocessor()

clean_nodes = processor.postprocess_nodes(
    [NodeWithScore(node=node)]
)

print(clean_nodes[0].node.get_text())
```

输出应该类似如下：

```ini
Dear [PER_5]. Your address has been recorded in our database. Please confirm it is valid: 8804 [LOC_95] Dr. [LOC_111], [LOC_124]([LOC_135]).
```

观察结果可以看到，姓名已经被替换成占位符，因此这些数据现在可以安全传递给任何外部 LLM。这个方法的美妙之处在于，返回时，答案可以被再次处理，并将占位符替换回原始数据，从而获得无缝用户体验。

占位符和真实数据之间的实际映射，会存储在 `clean_nodes[0].node.metadata` 中。这些元数据不会被发送给 LLM，并且之后可以在响应合成阶段用于恢复原始姓名。

### 使用 `PresidioPIINodePostprocessor`

`NERPIINodePostprocessor` 的一个有趣替代方案是 `PresidioPIINodePostprocessor`，它使用微软开源 Presidio 库来检测和匿名化 PII。不同于依赖 LLM 或预训练 Hugging Face 模型的 NER 方法，Presidio 使用基于规则和模式匹配的技术，识别广泛的 PII 类型，包括姓名、地址、信用卡号、IBAN、电子邮件等，并且不消耗 LLM token，也不需要外部 API 调用。它是一个快速、轻量的选项，完全在本地运行，并且非常适合许多常见隐私使用场景。

Presidio 会在本地运行一个快速的基于规则检测器，并将检测到的 PII 替换为占位符，同时保留映射，以便你之后恢复原始内容。下面是一个可以实验的快速示例。在此之前，请确保你至少有 1 GB 可用空间，并在运行代码前安装所需依赖：

```perl
pip install llama-index-postprocessor-presidio
```

现在所需组件已经安装，可以尝试下面的示例：

```ini
from llama_index.core.schema import TextNode, NodeWithScore
from llama_index.postprocessor.presidio import PresidioPIINodePostprocessor

text = "Hi John Doe, your email is john@example.com"

node = TextNode(text=text)

processor = PresidioPIINodePostprocessor()
clean_nodes = processor.postprocess_nodes([NodeWithScore(node=node)])

print(clean_nodes[0].node.get_text())
print(clean_nodes[0].node.metadata["__pii_node_info__"])
```

第一次运行时，Presidio 会在后台自动下载所需 NLP 组件，包括用于实体检测的 spaCy 语言模型。

在这个示例中，我们将一个包含原始文本的 `TextNode` 传给 `PresidioPIINodePostprocessor`，它会扫描文本中的敏感信息，例如姓名或电子邮件。然后，它会将每个检测到的元素替换为占位符，例如 `<PERSON_1>` 或 `<EMAIL_ADDRESS_1>`，这样文本就可以安全发送给外部 LLM，而不会暴露任何真实 PII。

与此同时，占位符到原始值的映射，会存储在节点元数据的 `__pii_node_info__` key 下。LLM 完成处理之后，这个映射可以用于在最终响应中无缝恢复原始信息。这是一种简单且高效的方法，可以在保护敏感数据的同时保留功能。

元数据 extractor 可以极大丰富你的节点，提供额外上下文，但其中一些会带来成本，因为它们需要调用 LLM 来处理节点。表 4.2 总结了可用 extractor 以及每一个会添加什么内容，方便你权衡更丰富元数据和额外处理开销之间的取舍。

| Extractor | 添加到元数据中的内容 | 是否需要 LLM |
| --- | --- | --- |
| SummaryExtractor | 每个节点内容的简洁摘要 | 是 |
| QuestionsAnsweredExtractor | 节点可以回答的问题列表 | 是 |
| TitleExtractor | 从前几个节点推断出的文档级标题 | 是 |
| EntityExtractor | 通过 NER 识别出的命名实体，例如人物、地点、组织 | 否，使用 spaCy |
| KeywordExtractor | 相关关键词或关键短语 | 是 |
| PydanticExtractor | 通过 Pydantic 模型定义的自定义结构化元数据字段 | 是 |

**表 4.2 —— 元数据 extractor 概览**

## 使用摄取流水线提高效率

从 0.9 版本开始，LlamaIndex 框架引入了一个非常巧妙的概念：所谓的摄取流水线。

### 一个简单类比

摄取流水线有点像工厂里的传送带。在 LlamaIndex 的上下文中，它是一套设置，用来接收你的原始数据，并将其准备好集成到 RAG 工作流中。它通过让数据依次经过一系列步骤，也就是 transformations，来完成这一点。核心思想是将摄取过程拆解成一系列可复用的 transformations，并将它们应用到输入数据上。这有助于为不同使用场景标准化和定制摄取流程。你可以把 transformations 想象成传送带上的不同工作站。随着原始数据向前移动，它会经过不同站点，每个站点都会发生一些特定事情。它可能在某个站点被拆成句子，也就是你的 `SentenceSplitter`；也可能在另一个站点被提取标题，例如使用 `TitleExtractor`。

如果工厂默认工作站，也就是前面类比中提到的那些，不太满足你的需求，没关系！假设你有一个特殊工具想用在原始数据上。LlamaIndex 让插入自定义工具，也就是 custom transformation，变得很容易。只需要定义它的功能，例如使用字典将缩写替换为完整名称，然后把它加入流水线。

**图 4.5 —— 正在工作的摄取流水线**

摄取流水线最重要的一点是，它会记住已经处理过的数据。它会对每个节点数据与每次 transformation 运行的组合执行哈希函数。在未来对相同节点运行相同 transformation 时，哈希将完全相同，因此会使用缓存中已经处理过的数据，而不是重新运行 transformation。

### 这对我意味着什么？

如果你再次把同一个文档发送通过流水线，就像拥有一条快速通道，因为它已经被处理过，所以可以跳过排队。这很酷，因为它通过避免对相同数据进行无用的重复处理，同时节省你的时间和金钱。

默认情况下，缓存会存储在本地，但你可以定制存储选项，并使用任何你喜欢的外部数据库提供商。让我们介绍一个流水线如何实现的示例。我会按代码部分进行解释，以便更容易跟上。

```python
import models_config
from llama_index.core import SimpleDirectoryReader
from llama_index.core.extractors import SummaryExtractor, QuestionsAnsweredExtractor
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline, IngestionCache
from llama_index.core.schema import TransformComponent

class CustomTransformation(TransformComponent):
  def __call__(self, nodes, **kwargs):
    # run any node transformation logic here
    return nodes
```

在处理完所需导入之后，为了展示如何定制流水线，我定义了一个叫做 `CustomTransformation` 的类。稍后它会被输入到流水线中。在我的示例中，没有发生实际处理，因此它会原样返回节点。

继续看第二部分：

```scss
reader = SimpleDirectoryReader('files')
documents = reader.load_data()

try:
    cached_hashes = IngestionCache.from_persist_path(
        "./ingestion_cache.json"
    )
    print("Cache file found. Running using cache.")
except:
    cached_hashes = IngestionCache()
    print("No cache file found. Running without cache.")
```

让我们继续第三部分：

```scss
pipeline = IngestionPipeline(
    transformations = [
        CustomTransformation(),
        SentenceSplitter(
            chunk_size=512,
            chunk_overlap=128),
        SummaryExtractor(),
        QuestionsAnsweredExtractor(
            questions=3,
            num_workers=1
        )
    ],
    cache=cached_hashes
)
```

最后一部分如下：

```ini
nodes = pipeline.run(
    documents=documents,
    show_progress=True,
)

pipeline.cache.persist("./ingestion_cache.json")
print("All documents loaded")
```

这里是运行流水线的位置，并且将 `show_progress` 选项设置为 `True`。这会让流水线进度可见，并帮助你更好地理解后台发生了什么。最后，我们将结果保存在缓存文件中，以避免下一次运行时重新处理。

即使你保存了缓存文件，你在流水线逻辑中做出的任何更改都不会被缓存，并且必须在下一次运行时重新处理。

你还应该知道，还有一种替代方式，不必每次想摄取更多数据时都手动定义和运行流水线。就像节点解析器一样，我们可以在 `Settings` 中定义 transformations：

```css
from llama_index.core import Settings

Settings.transformations = [    CustomTransformation(),    TokenTextSplitter(        separator=" ",        chunk_size=512,        chunk_overlap=128    ),    SummaryExtractor(),    QuestionsAnsweredExtractor(        questions=3,        num_workers=1    )]
```

总之，摄取流水线是一种超级高效的方式，可以通过一组可定制 transformations，自动准备和打磨数据，直到它完全适合你的应用或数据库。

有了工具箱中的这些新概念，让我们继续构建合同审查项目。

## 动手实践——将文档摄取到我们的 Contract Review Expert 应用中

这个模块充当 `Contract Review Expert` 应用的数据管理和索引主干。它实现了几个重要函数：

**文件管理**：

**save_file()** ：处理上传文件存储，并自动创建目录。

**list_files()** ：用于目录列表的通用 helper。

**load_report()** ：从磁盘读取已生成报告内容。

**内部公司政策索引**：

**load_policies_index()** ：实现带持久化的智能索引加载。

**报告管理**：

**list_reports()** ：按合同名称组织分析报告，以支持应用的报告查看功能。

由于 `utils.py` 中的大多数函数都是文件管理和数据加载的通用 helper，我们将重点关注最重要的一个：`load_policies_index()`，它展示了 RAG 工作流中的一个关键步骤。

正如我们将在下一章进一步讨论的，创建向量索引在计算上成本很高。当 LlamaIndex 处理文档时，它必须解析内容、生成 embeddings，并构建可搜索结构。如果没有持久化，每次启动应用时，用户都要等待几分钟来重新加载相同政策文档。为了避免损害用户体验，`load_policies_index()` 函数实现了一种条件加载策略，可以显著提高应用启动性能：

```ini
def load_policies_index():
    index_file = os.path.join(config.POLICIES_INDEX_PATH, "docstore.json")
    if os.path.exists(index_file):
        print("Loading existing policies index from persistence.")
        storage_context = StorageContext.from_defaults(persist_dir=config.POLICIES_INDEX_PATH)
        index = load_index_from_storage(storage_context)
    else:
        print("No valid index found - rebuilding policies index.")
        reader = SimpleDirectoryReader("data/policies")
        docs = reader.load_data()
        index = VectorStoreIndex.from_documents(docs)
        os.makedirs(config.POLICIES_INDEX_PATH, exist_ok=True)
        index.storage_context.persist(persist_dir=config.POLICIES_INDEX_PATH)
    return index
```

这个函数会检查是否存在 `docstore.json` 文件，以判断索引是否已经存在。

`docstore.json` 文件是 LlamaIndex 用于将索引持久化到磁盘的内部存储结构的一部分。具体来说，它存储文档解析过程中生成的所有节点的元数据和内容。当你构建 `VectorStoreIndex` 时，LlamaIndex 会将文档拆分成更小文本块，为它们生成 embeddings，并将它们存储为可检索节点。`docstore.json` 文件会追踪这些节点，本质上充当一个轻量级文档数据库。启动时，如果这个文件存在，LlamaIndex 就知道不需要重新处理或重新嵌入原始文档。这通过避免冗余计算，大大提升了性能。如果没有它，LlamaIndex 每次应用启动时都必须从零开始。

所以，我们这里处理的是两种可能场景：

**如果找到文件**：代码假设有一个有效索引可用，并快速从磁盘加载预计算 embeddings。实践中，这应该只需要几秒钟。

**如果没有找到文件**：代码会从零构建索引。这可能需要更长时间才能完成，尤其是当用户上传多个大型政策文档时。索引创建完成后，会被保存下来，以便未来会话复用。

暂时就到这里。现在，我们可以将公司特定政策上传到 `Contract Review Expert` 应用中了。稍后，我们会使用这些政策来对合同运行合规检查，并生成合规报告。

## 总结

数据摄取之后，我们将重点转向文档分块和节点解析，对比了简单文本 splitter 与更高级的节点解析器，这些解析器针对 HTML、Markdown、JSON、源代码，甚至语义分段文本进行了定制。我们讨论了如何用元数据丰富节点，并探索了多个内置 extractor，以及使用 Pydantic 模型或 Marvin 框架定义自定义 extractor 的选项。

随后，我们讨论了隐私问题以及如何缓解这些问题，确保敏感数据在传递给 LLM 之前受到保护。此外，我们还学习了成本估算和优化策略，以减少元数据提取过程中的 LLM 使用。

