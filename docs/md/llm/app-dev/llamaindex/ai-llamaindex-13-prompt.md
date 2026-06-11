---
title: LlamaIndex - 提示工程指南与最佳实践
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - Prompt
---

---

本章讲解提示工程在 RAG 中的应用：RichPromptTemplate 模板、Zero-shot/Few-shot/CoT/ToT/Prompt Chaining 等策略，以及成本优化技术。

### 技术要求

## 为什么提示词是你的秘密武器

我 6 岁时，开始用一台 ZX Spectrum 电脑写下人生中第一行代码。那是在 20 世纪 80 年代中期，当时计算机在世界上仍然是新鲜事物，并没有多少人理解它们将对人类社会产生多么非凡的影响。今天，我们生活在一个被技术主导，并在许多方面由技术驱动的现实中。过去 40 年里，我们与技术之间的关系也发生了根本性变化。几乎所有人类活动都以某种方式受到了技术进步的影响。

变化不大的，是我们与技术交互的方式。除了少数显著例外，例如触摸屏和语音界面的引入，我们与技术的交互几乎保持不变。和 40 年前一样，我们仍然使用一些相当原始的方法，让计算机执行我们需要的功能。

当我说“原始”时，并不一定是指界面本身的复杂程度，尽管从功能上讲，如果我们比较现代键盘或鼠标，也会发现即使在这里，进步也谈不上惊人。我更想指的是另一个遗憾地持续停滞的方面：当前界面能够提供的带宽。

我们当前与技术交互的方式，早就该被替换了。

为了更好地理解这一点，请考虑以下观察：

计算能力仍在快速增长，并受到 TPU、NPU 和定制加速器等 AI 专用硬件的推动。

我们生活在一个几乎完全由应用程序主导的世界。目前，应用程序是用户和机器之间的一层，它让我们与计算机之间的交互成为可能：运行在本地系统上的应用，运行在移动设备上的应用，或运行在云端的应用。每个应用都提供一组非常具体的功能。

许多应用只被设计为运行在特定平台上，并不能轻松移植到其他平台。这意味着每个具体平台都需要一个不同的应用。

许多应用在功能上存在重叠。对于给定任务，在大多数情况下，都有几十个不同应用可以完成它。因此，存在大量重复。

我们与技术交互的带宽总体上仍然与 40 年前差不多。我们使用几乎相同类型的界面——键盘、鼠标、触摸屏、基于手势或语音的界面——来控制应用逻辑。

几乎每个应用都有自己的 UI。用户必须经历一条强制性的学习曲线，才能学会如何操作每个应用。如果我们把这段时间乘以一个典型用户日常使用的应用数量，就会发现，我们实际上花了大量时间学习如何有效使用某个工具，而这会侵蚀我们真正使用该工具提高生产力的时间。

软件应用的数量，包括公开可用的软件和组织内部私有使用的软件，已经非常庞大。据估计，全世界应用总数已达数亿。这还没有考虑到一个应用往往还存在多个不同版本。而且这个数字仍在增长。

从进化角度来看，在这段时间里，人类大脑的容量并没有变化。神经可塑性让我们具备了非凡的学习和适应新技术的能力，但遗憾的是，进化本身无法跟上技术进步。

明白我想表达什么了吗？这种对特定应用界面的依赖，加上技术的快速演进，正在慢慢让我们成为自身成功的受害者。一方面，我们已经成功构建了数量庞大的专业工具，能够解决大量问题。但现在，我们有了一个更大的问题：工具太多，以至于高效组织和使用它们本身已经变成一个极其复杂的过程。我们需要一种新的范式。

基于自然语言处理的对话式界面，正在作为一种有前景的替代方案出现，用来替代当前与技术交互的方式。它们代表了我们与设备沟通方式的一种自然演进。我们不再依赖复杂的视觉界面和需要花费精力与时间学习的输入方式，而是可以使用自然语言，也就是人类最基础、最直观的沟通形式。

随着人机交互越来越依赖自然语言，能够构造有效提示词，引导 AI 算法生成期望响应或执行期望动作，就变得至关重要。这项技能不仅涉及清晰地表述提示词，还包括预判不同表述方式可能如何影响 AI 对命令的解释和执行。

对话式界面把与技术的交互转变为一种对话，在这种对话中，语言精度和对算法微妙之处的理解成为达成期望结果的关键因素。使用自然语言直接且有效地与计算机系统交互，可以显著降低人类与技术之间的门槛。它提供了一条通向技术普及的道路，让更广泛的用户可以访问技术，而不受其技术专业水平限制。

已经有迹象表明，在日常与 LLM 的交互中密集使用提示词，甚至可以改善我们的人际沟通能力。例如 Liu 等人 2023 年的研究《Improving Interpersonal Communication by Simulating Audiences with Language Models》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2311.00687)）就展示了这一点。

想象一下这样的计算机系统：它们可以替代几十个甚至数百个不同应用的功能，却没有传统界面的复杂性。语言交互：一种技术形式，其中由 RAG 增强的 LLM 取代应用程序和操作系统，给我们一种通用且简单得多的方式来使用计算能力。如果不深入投机领域，若让我做一个中长期预测，我认为这就是我们正在走向的方向。自本书第一版以来，支持这一预测的证据只变得更强。agentic AI 的爆发式兴起，也就是能够使用工具进行推理、规划并执行多步骤任务的自主系统，已经在模糊“使用一个应用”和“要求 AI 完成一个目标”之间的界线。像 LlamaIndex 自己的 `AgentWorkflow` 和 LlamaAgents 这样的框架，OpenAI 的 Codex agent 这样的产品，以及 OpenClaw、Nous Research 的 Hermes Agent 这样的开源个人智能体，都是这一趋势的早期但具体的例子。这些系统不只是回答问题；它们执行任务，跨会话记忆上下文，并在消息平台、文件系统或外部服务之间自主运行。短期内，经典计算系统仍将继续占主导地位。一开始，基于对话智能体的界面会逐渐简化用户交互，掩盖后端应用层的复杂性。随后，随着专用 AI 硬件成为普通商品，大量应用将逐步退出生态，其提供的功能将由 AI 模型接管。

## 理解 LlamaIndex 如何使用提示词

从机制上讲，一个基于 RAG 的应用遵循的交互规则和原则，与普通用户在同 LLM 聊天时使用的规则完全一样。一个主要区别是，RAG 实际上是一种“强化版提示工程师”。在幕后，对于几乎每一个索引、检索、metadata 抽取或最终响应合成操作，RAG 框架都会以编程方式生成提示词。这些提示词会被上下文增强，然后发送给 LLM。

在 LlamaIndex 中，对于每一种需要 LLM 的操作，都有一个默认 prompt，用作模板。以 `TitleExtractor` 为例。`TitleExtractor` 类使用两个预定义 prompt templates，从文档内部的 text nodes 中获取标题。它分两步完成：

它使用 `node_template` 参数从单个 text nodes 中获取潜在标题，该参数会创建 prompts 来生成合适标题。

它使用 `combine_template` prompt，把单个 node titles 合并成整个文档的一个整体综合标题。

`TitleExtractor` prompts 的默认值存储在两个常量中：

```ini
DEFAULT_TITLE_NODE_TEMPLATE = """\
Context: {context_str}. Give a title that summarizes all of \ the unique entities, titles or themes found in the context. Title: """
DEFAULT_TITLE_COMBINE_TEMPLATE = """\
{context_str}. Based on the above candidate titles and content, \ what is the comprehensive title for this document? Title: """
```

看一下 `TitleExtractor` 使用的这两个默认模板，我们很容易理解它们如何工作。每个模板都包含一段固定指令文本，以及诸如 `{context_str}` 这样的动态占位符。在执行期间，LlamaIndex 会用我们 nodes 中的实际文本内容替换这些占位符，而固定部分保持不变，如图 13.1 所示：

metadata extractors（例如 `TitleExtractor`）使用的 prompt templates 直接定义在 `metadata_extractors.py` 模块中。这个模块在 LlamaIndex GitHub 仓库中的相对路径是 `llama-index-core/llama_index/core/extractors/metadata_extractors.py`。不过，这只是一个例外，因为绝大多数默认模板都定义在另外两个关键模块中：`llama-index-core/llama_index/core/prompts/default_prompts.py` 和 `llama-index-core/llama_index/core/prompts/chat_prompts.py`。

### RichPromptTemplate——prompt templates 的现代方法

2025 年 4 月，LlamaIndex 引入了 `RichPromptTemplate`，这是一个 Jinja 风格的模板类，支持使用 `{{ }}` 语法的变量、循环、条件语句、chat role blocks，甚至多模态内容（图像和音频）。它已经成为构建新 prompt templates 的推荐方法。旧的 `PromptTemplate` 类，也就是基于 f-string 的类，仍然完全可用，并且在现有代码库中被广泛使用，因此本章中的示例仍会继续工作。不过，`RichPromptTemplate` 表达能力更强，也是你在最新官方文档中会遇到的方式。

为了展示差异，下面用两种风格表达同一个 `text_qa_template`。首先，这是使用 `PromptTemplate` 的经典方法，也就是 f-string 语法：

```swift
from llama_index.core import PromptTemplate
classic_template = PromptTemplate(
    "Context information is below.\n"
    "---------------------\n"
    "{context_str}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query.\n"
    "Query: {query_str}\n"
    "Answer:"
)
```

现在是使用 `RichPromptTemplate` 的现代方法，也就是 Jinja 语法：

```swift
from llama_index.core.prompts import RichPromptTemplate
rich_template = RichPromptTemplate(
    "Context information is below.\n"
    "---------------------\n"
    "{{ context_str }}\n"
    "---------------------\n"
    "Given the context information and not prior knowledge, "
    "answer the query.\n"
    "Query: {{ query_str }}\n"
    "Answer:"
)
```

对于这种简单模板，两种方法几乎相同。主要可见差异是 `{ }` 与 `{{ }}`。不过，`RichPromptTemplate` 的真正威力会在更高级场景中显现，例如直接在模板中定义 chat roles，或遍历一组检索到的 nodes：

```python
chat_qa_template = RichPromptTemplate(
    """
    {% chat role="system" %}
    You are a helpful assistant. Answer questions using
    only the provided context.
    {% endchat %}
    {% chat role="user" %}
    Context:
    {% for node in nodes %}
    {{ node.text }}
    {% endfor %}
    Question: {{ query_str }}
    {% endchat %}
    """
)
```

`PromptTemplate` 和 `RichPromptTemplate` 都完全兼容后面几页将讨论的 `get_prompts()` 和 `update_prompts()` 方法。关于 `RichPromptTemplate` 所有功能的完整指南，请参见官方文档：[docs.llamaindex.ai/en/stable/m…](https://docs.llamaindex.ai/en/stable/module_guides/models/prompts/usage_pattern/)

讲完模板语法之后，下一个问题就是实践性的：我们如何知道自己的 RAG 组件实际正在使用哪些 prompts？

### 检查 RAG 组件使用的 prompts

由于使用 LlamaIndex 构建的 RAG 工作流可能包含许多依赖 LLM 交互的不同组件，而且并非所有 prompt templates 都能在代码库中轻松定位，因此框架提供了一种简单方法，用于识别某个具体组件使用的模板。这个方法叫作 `get_prompts()`，可以用于 agents、retrievers、query engines、response synthesizers，以及许多其他 RAG 组件。当你调试意外行为时，这尤其有用。如果模型响应感觉不对劲，检查底层 prompt template 往往是理解原因的最快方式。下面是一个简单示例，展示我们如何使用它获取一个构建在 `SummaryIndex` 之上的 query engine 所使用的 prompt templates 列表：

```ini
from llama_index.core import SummaryIndex, SimpleDirectoryReader
documents = SimpleDirectoryReader("files").load_data()
summary_index = SummaryIndex.from_documents(documents)
qe = summary_index.as_query_engine()
```

```ini
prompts = qe.get_prompts()
```

`get_prompts()` 方法返回的字典，会把用于识别 query engine 中不同 prompt 类型的 keys，映射到实际 prompt templates。代码最后一部分负责遍历并显示 keys 及其对应 templates：

```css
for k, p in prompts.items():
    print(f"Prompt Key: {k}")
    print("Text:")
    print(p.get_template())
    print("\n")
```

检查输出时，我们会看到 query engine 使用的两个模板：`text_qa_template` 和 `refine_template`。你会注意到，这两个 keys 都以 `response_synthesizer:` 文本开头。这表示 query engine 中实际使用这些 prompts 的具体组件，在我们的例子中就是 response synthesizer。按照同样逻辑，我们可以在许多其他类型的 RAG 组件上使用 `get_prompts()` 方法，以理解底层实际使用了哪些 prompts。LlamaIndex 的 instrumentation 模块可以帮助我们追踪应用执行流，从而更容易看到不同 prompts 是如何以及何时被使用的，以及最终发送给模型的 prompts。不过，这种方法有一个注意事项：我们看到的不是原始 prompt templates，而是最终 prompts，其中已经包含了插入到 prompt 中的任何上下文。

## 定制默认 prompts

融入特定领域知识或术语

适配某种特定写作风格或语气

优先考虑某些类型的信息或输出

尝试不同 prompt 结构，以优化性能或质量

通过定制 prompts，我们可以微调 RAG 组件与语言模型之间的交互，从而可能提升应用的准确性、相关性和整体效果。

在 LlamaIndex 中，每个暴露 `get_prompts()` 方法的 RAG 组件，也都提供了一个用于修改这些 prompt templates 的对应方法：`update_prompts()` 方法。因此，这是修改某个特定 prompt template 最简单的方法。让我们继续使用上一节的例子，并尝试一个不同的 prompt。这一次，我们将调整 `text_qa_template` 模板，让它在回答 query 时也依赖 LLM 自身知识。默认的 `text_qa_template` 模板通常如下：

```markdown
Context information is below.
---------------------
{context_str}
---------------------
Given the context information and not prior knowledge, answer the query.
Query: {query_str}
Answer:
```

在下面的示例中，我们会对这个模板做一个非常微妙的改动，并看看它将如何影响 query engine 的行为。让我们看看代码：

```ini
from llama_index.core import SummaryIndex, SimpleDirectoryReader
from llama_index.core import PromptTemplate
documents = SimpleDirectoryReader("files").load_data()
summary_index = SummaryIndex.from_documents(documents)
qe = summary_index.as_query_engine()
```

到目前为止，代码与前一个示例相同，只多了一个额外 import，几分钟后我会解释它。不过这一次，我们会先使用默认模板运行一次 query。稍后我们会把这个响应作为参考：

```bash
print(qe.query("Who burned Rome?"))
print("------------------------")
```

现在该修改 `text_qa_template` 模板了。我们首先定义一个包含新版本的字符串：

```makefile
new_qa_template = (
"Context information is below."
"---------------------"
"{context_str}"
"---------------------"
"Given the context information "
"and any of your prior knowledge, "
"answer the query."
"Query: {query_str}"
"Answer:")
```

如果你仔细比较新版本和原始模板，会注意到一个微妙但非常重要的变化。在这个新版本中，我指示模型不仅要应用检索上下文中提供的知识，还要使用它自己关于该主题的知识。现在是时候使用我们在代码开头添加的那个新 import 了。因为 `update_prompts()` 方法要求 prompts 采用 `BasePromptTemplate` 格式，所以必须先确保我们的新 prompt 按如下方式结构化：

```ini
template = PromptTemplate(new_qa_template)
```

```arduino
qe.update_prompts(
    {"response_synthesizer: text_qa_template": template}
)
print(qe.query("Who burned Rome?"))
```

```ini
from llama_index.core import SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.extractors import TitleExtractor
reader = SimpleDirectoryReader('files')
documents = reader.load_data()
parser = SentenceSplitter()
nodes = parser.get_nodes_from_documents(documents)
```

示例第一部分负责把示例文件摄入为 documents，然后把它们切分成单独 nodes。我们先使用上一节看到的默认 prompt templates 来抽取标题：

```ini
title_extractor = TitleExtractor(summaries=["self"])
meta = title_extractor.extract(nodes)
print("\nFirst title: " +meta[0]['document_title'])
print("Second title: " +meta[1]['document_title'])
```

到目前为止，输出应该类似这样：

```sql
First title: "The Enduring Influence of Ancient Rome: Architecture, Engineering, Conquest, and Legacy"
Second title: "The Enduring Bond: Dogs as Loyal Companions - Exploring the Unbreakable Connection Between Humans and Man's Best Friend"
```

```ini
combine_template = (
    "{context_str}. Based on the above candidate titles "
    "and content, what is the comprehensive title for "
    "this document? Keep it under 6 words. Title: "
)
title_extractor = TitleExtractor(
    summaries=["self"],
    combine_template=combine_template
)
meta = title_extractor.extract(nodes)
print("\nFirst title: "+meta[0]['document_title'])
print("Second title: "+meta[1]['document_title']
```

因为我们在这个自定义 prompt 中添加了一条额外指令，extractor 现在应该生成更短标题。第二次运行的输出应该大致如下：

```sql
First title: "Roman Legacy: Architecture, Engineering, Conquest"
Second title: "Man's Best Friend: The Enduring Bond"
```

看完 prompt 定制的基本机制后，现在是时候进入更高级的方法了。

LlamaIndex 提供了几种高级 prompting 技术，让你能够创建更定制化、更具表达力的 prompts，复用已有 prompts，并以更简洁的方式表达某些操作。这些技术包括 partial formatting、prompt template variable mappings，以及 prompt function mappings。表 13.1 分解了每种方法的目的和潜在用例：

| 方法 | 目的 |
| --- | --- |
| Partial formatting | 允许你通过填入部分变量，但把其他变量留到以后再填，从而部分格式化一个 prompt。这很有用，因为它允许你在变量可用时进行格式化，而不是一直维护所有必需 prompt 变量直到最后。这个方法在多步骤 RAG 场景中特别有用，因为该场景会通过收集不同用户输入逐步构建 prompt。 |
| Prompt template variable mappings | 允许你指定一些预期 prompt keys 与你的模板中实际使用 keys 之间的映射，从而复用现有字符串模板，而无需修改模板变量。它类似于为 template keys 创建别名。 |
| Prompt function mappings | 这个功能允许你在 query time 期间根据其他值或条件，通过传入函数作为模板变量，而不是固定值，动态注入某些值。 |

表 13.1 —— LlamaIndex 提供的更高级 prompting 技术概览

在下一节中，我们会把注意力转向最大化 RAG 设置潜力的一个重要方面：提示工程的艺术与科学。

## 提示工程的黄金法则

本节并不打算作为提示工程的权威指南。事实上，这个领域本身仍在不断扩展。由于许多 LLM 正在展现一些最初并未预料到的新兴能力，我们与这些语言专家互动的方法也自然会随着时间继续被打磨。换句话说，随着 LLM 更好地建模和理解人性，我们也会反过来学会与它们互动的新方式。在本节中，我会先从构建 prompts 时需要考虑的最重要方面开始，然后讨论如何为任务选择合适 LLM，最后介绍一些最常用的 prompting 技术。正如上一节所说，写一个好的 prompt 需要在多个参数之间取得精细平衡。下面是构建 RAG 应用 prompts 时需要考虑的一些最重要方面。

### 表达的准确性和清晰度

prompt 应该清晰且精确，避免歧义。你越清楚地说明自己需要什么，就越有可能得到相关响应。重要的是，要以几乎不留下误解空间的方式表达问题或任务。不要假设模型有能力理解你的消息。这些假设通常带有偏见，并往往会反过来产生幻觉。

### 指令性

prompt 的指令性强弱会显著影响响应。prompt 可以从开放式，例如鼓励创造性或宽泛响应，到高度具体，例如要求一种非常特定类型的答案。指令性水平应该与预期结果匹配。由于我们实际构建的是 prompt templates，它们把静态部分与动态检索内容混合起来，因此要考虑模型可能误解 prompt 的异常场景和边界案例。

例如，如果你的 prompt template 写的是“总结下面的合同条款”，但检索上下文碰巧包含的是一整份合同，而不是单个条款，模型就可能生成过于宽泛的摘要，或者对范围感到困惑。将模板设计为能够处理这类不匹配，例如“总结以下上下文中最相关的条款”，会让它更健壮。

使用清晰指令或命令，例如 Summarize、Analyze 和 Explain，来引导模型完成期望任务。我们的 prompts 必须足够宽泛，能够适应各种输入，同时又足够详细，能够有效指导模型。

### 上下文质量

### 上下文数量

简洁和提供足够细节之间存在平衡。prompt 应该足够简短，以保持聚焦，但也要足够详细，以传达任务或问题的具体要求。上下文太少可能导致答案缺乏深度或相关性；上下文太多则可能让模型困惑，或让它偏离主题。

在 RAG 场景中，随着 prompt 中提供的上下文数量增加，重要的是要考虑它对生成响应的对齐性和准确性可能产生的影响。虽然提供更多上下文在许多情况下是有益的，因为它能让语言模型对手头任务有更广泛理解，但过长 prompts 也存在风险。

例如，当 prompt 变得太长时，更有可能引入无关或矛盾信息。这可能导致预期任务和模型对任务的理解之间不对齐。模型可能过度关注旁枝细节，或失去对核心目标的聚焦。保持 prompt 清晰简洁，有助于确保模型与期望输出保持一致。

### “lost in the middle” 问题

长上下文窗口并不保证 prompt 的所有部分都会被同等良好地使用。在实践中，LLM 往往更依赖输入开头和结尾附近的信息，而位于中间的信息可能得到较少关注。这被称为 lost in the middle 问题，Liu 等人在 2024 年的论文《Lost in the Middle: How Language Models Use Long Contexts》，Transactions of the Association for Computational Linguistics，12:157-173（[doi.org/10.1162/tac…](https://doi.org/10.1162/tacl_a_00638)）中对此进行了讨论。在 RAG 应用中，它凸显了为什么添加更多检索内容有时会伤害结果而不是帮助结果：最相关 passage 可能确实存在，但并不够突出，导致模型无法有效使用它。

此外，随着上下文增长，模型必须处理和考虑更多信息。这种增加的认知负荷可能导致准确性下降。模型可能难以识别最相关的信息片段，或对不太重要的细节赋予过高权重。此外，更长 prompts 更有可能包含歧义或不一致，从而进一步降低响应准确性。

认知负荷指语言模型基于提供的上下文进行处理、理解并生成响应所需的处理努力和资源量。在 RAG 系统中，认知负荷与 prompt 中信息的数量和复杂性直接相关。

实现诸如 `SimilarityPostprocessor` 或 `SentenceEmbeddingOptimizer` 这样的 node postprocessors，可以通过过滤不太相关的 nodes 或缩短其内容，部分缓解这个问题，从而减少最终提交给 LLM 的 prompt。这些方法前面已经详细讲解过。此外，如果检索上下文本身很长，可以考虑将其拆分成更小、更易管理的 chunks。

### 上下文排序

RAG pipeline 的整体有效性不仅取决于上下文的数量和质量。面对较长上下文时，大多数 LLM 在尝试从上下文中抽取关键信息时，可能会因为关键信息放置的位置不同而表现不同。一种好方法是把 prompt 结构化为层级形式，把最关键的信息放在开头或结尾。这可以确保模型优先考虑核心指令和上下文。这也是 node re-rankers 或 `LongContextReorder` postprocessor 这类工具变得有用的地方。

有一种越来越流行的 RAG 评估技术，叫作 needle in a haystack test。研究人员用它来衡量模型从提供给 LLM 的更大上下文中注意并回忆一条非常具体信息的能力。这条具体信息看起来并不起眼，通常会无缝混入整体上下文中。在许多方面，这种方法类似于测试人类关注某段文本并随后回忆其中关键信息的能力。

### 必需的输出格式

在大多数情况下，构建 RAG 工作流时，我们需要 LLM 生成结构化或半结构化输出。几乎在所有场景中，我们都需要输出在格式、大小或语言上是可预测的。有时，在 prompt 中提供几个示例可能会带来更好响应，但这并不是适用于所有场景的银弹。这就是使用 output parsers 和 Pydantic programs 变得非常重要的地方。

### 推理成本

在大多数情况下，我们会在非常具体的成本约束下运行应用。忽略 token 使用量显然是一个错误。因此，请确保你在进行成本估算，并始终跟踪 token 使用。此外，你可以使用诸如 `LongLLMLinguaPostprocessor` 这样的工具进行 prompt compression。prompt compression 技术不仅有可能提升成本效率，还可能通过从上下文中消除冗余信息、只保留关键信息，提升最终响应质量。

### 整体系统延迟

提示工程是一个持续实验和迭代的过程。定期评估 prompts 的表现，并根据结果优化它们。记住，这是一场长期游戏，而规则正在不断被重写。尽量跟进提示工程领域的最新进展和技术，因为这个领域正在快速演变。

讲完 prompt 构造的核心原则后，还有另一个因素可能决定我们的 prompts 成败：我们把它们发送给哪个模型。

## 为任务选择合适的 LLM

在 AI 世界中，并非所有 LLM 都是一样的。但实际上有很多可选项，那么我们应该为工作选择哪个？为特定任务选择错误 LLM，很可能会抵消我们在实际 prompts 打磨上投入的许多努力。这很像试图从错误的人那里得到答案。如果你足够有说服力，最终可能确实会得到一个答案。然而，那可能并不是你想要的答案。

### 模型架构

模型可以有不同底层架构，而这些架构可能决定其固有能力。例如，encoder-only 模型专门用于编码和分类输入文本，适合把文本归入定义好的类别，例如 Bidirectional Encoder Representations from Transformers（BERT）。BERT 使用 masked language modeling（MLM）和 next sentence prediction（NSP）任务进行预训练（[en.wikipedia.org/wiki/BERT_(…](https://en.wikipedia.org/wiki/BERT_(language_model)%25EF%25BC%2589%25E3%2580%2582)

encoder-decoder 模型结合了输入理解和文本生成，使其非常适合翻译、摘要，以及其他形式的基于源材料的生成任务。属于这一类别的一个例子是 Bidirectional and Auto-Regressive Transformer（BART）（[huggingface.co/docs/transf…](https://huggingface.co/docs/transformers/en/model_doc/bart%EF%BC%89%E3%80%82)

decoder-only 模型可以从给定 prompt 解码或生成后续词语或 tokens，主要用于文本生成。Generative Pre-trained Transformer（GPT）、Mistral、Claude 和 LLaMa 等模型，都是这个领域的明星。

还有一些架构，例如 Mixture-of-Experts（MoE），本质上利用稀疏 MoE 框架来提供动态的、token 级别的特定处理。参见 Shazeer 等人 2017 年的论文《Outrageously Large Neural Networks: The Sparsely-Gated Mixture-of-Experts Layer》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.1701.06538%EF%BC%89%E3%80%82%E6%AD%A3%E5%A6%82) Mixtral 8x7B，以及阿里云 Qwen 团队的更新系统 Qwen3.5-35B-A3B 所展示的，这种方法可以显著提升数学、代码生成和多语言任务等多个领域的表现。

### 模型大小

模型大小是选择 LLM 时需要考虑的另一个关键因素，因为它直接影响潜在计算成本和模型能力。LLM 内部参数数量，从训练期间调整的 weights 到 biases，可以作为理解模型复杂性以及由此产生的运营开销的代理指标。更大的模型，例如 GPT-5.4 或 Opus 4.6，提供深厚能力，但也带来更高成本和计算资源要求。

### 总大小已经不再是全部故事

对于 MoE 模型而言，总参数数量并不一定反映推理时实际使用了多少模型。不同于 dense models 会对每个 token 应用大多数参数，MoE 模型只会为每个 token 激活一部分 experts。这让参数数量作为成本、速度或有效容量的直接比较指标变得不那么可靠。

另一方面，中等规模模型通常低于 100 亿参数，在可负担性和性能之间取得平衡，使其适合大量应用，而不会造成预算崩溃。

### 推理速度

为了让事情更复杂，除了这些特征之外，LLM 还可以专门针对各种任务或领域进行特化，从而提升其在特定场景中的表现。这种特化来自用于微调模型的数据类型和训练目标。接下来让我们看看一些常见特化类型。

### 聊天模型

聊天模型针对对话式交互进行优化。它们被设计用于与用户展开对话，提供类似人类对话的响应。这些模型擅长来回交流，并且能够在一系列交互中维护上下文。

它们是构建 chatbot 或 virtual assistant 的理想选择，适用于更随意或更对话化的交互。这些模型用于需要与用户进行自然、有吸引力对话的应用，例如客服机器人、娱乐应用或虚拟陪伴。作为一个特殊特征，它们的响应往往更开放，目标是生成有吸引力、上下文相关，有时甚至具有娱乐性的回复。

### 指令模型

指令模型经过微调，用于理解并执行特定指令或查询。它们优先根据指令完成给定任务，而不是展开对话。这使它们适合用户需要模型执行特定任务的场景，例如总结文档、基于 prompt 生成代码，或提供详细解释。这些模型更适合教育工具、生产力应用，以及任何需要对 query 给出直接、清晰响应的地方，例如 RAG 应用复杂工作流中。

它们更关注准确性和与当前任务的相关性，而不是维持对话语气。它们的响应会围绕尽可能高效且有效地满足用户请求来调整。

### 编码模型

### 摘要模型

### 翻译模型

顾名思义，这些模型被设计用于把文本从一种语言翻译成另一种语言。它们在大型多语言数据集上接受训练，能够以高准确性理解并翻译不同语言，最适合全球沟通平台、内容本地化，以及面向语言学习者的教育工具。

### 问答模型

这个列表当然还可以继续扩展到其他类型模型，它们可以针对特定领域或应用进行微调。此外，请记住，由于这些不同特化往往会增强或削弱模型的某些能力，我们精心构造的 prompts 可能会产生不一致结果。对于一个模型，某个 prompt 可能带来近乎完美的响应；而对另一个模型，它可能勉强达到平均水平。

选择 LLM 时，必须权衡所有这些特征与你的 RAG 应用具体需求之间的取舍。理解这些方面有助于选择一个既符合预算，又满足性能和速度预期的模型。无论你是在为需要快速响应的实时应用部署 LLM，还是为需要深度理解和生成能力的复杂任务部署 LLM，所选择的模型都会深刻影响 LlamaIndex 应用的结果。但请记住，你永远不必局限于为整个 RAG 逻辑只使用一个模型。由于 LlamaIndex 给了你无穷的定制可能，使用一组不同模型也可以是一个选择。你只需要实验并评估，直到找到理想组合，以及每个模型的用途。

既然我们知道了选择 LLM 时应该关注什么，接下来让我们探索一些经过验证的技术，用来最大化我们所选模型的能力。

## 创建有效 prompts 的常用方法

### Few-shot prompting，也称为 k-shot prompting

正如 Brown 等人在 2020 年论文《Language Models are Few-Shot Learners》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2005.14165)）中所描述的，对于涉及 LLM 的复杂任务，带示范的 few-shot prompting 可以启用 in-context learning 并提升表现。这个方法依赖于提供几个任务示例，以及期望输出，从而对模型进行条件设定。你可以尝试不同数量的示例，例如 one-shot、three-shot 和 five-shot，以找到最佳平衡，这也是 k-shot 这个替代名称的来源。

### 那 zero-shot prompting 呢？

作为参考，zero-shot prompting 指在没有任何前置上下文问答对的情况下，直接向模型提出问题。与 one-shot 或 few-shot prompting 相比，这种方法对模型更具挑战性，因为缺少上下文。

使用 few-shot prompting 时，请记住，示例格式和输入文本分布都是可能影响表现的重要因素。虽然 few-shot prompting 方法会提高较简单任务得到正确答案的概率，但面对更复杂推理场景时，它仍然可能吃力。下面是使用该技术的一个实际 prompt 示例：

```csharp
Classify the following reviews as positive or negative sentiment:
<The food was delicious and the service was excellent!> // Positive
<I waited over an hour and my meal arrived cold.> // Negative
<The ambiance was nice but the dishes were overpriced.> //
Output:
```

以这种风格给模型提供几个示例，可以启用 in-context learning，并在无需微调的情况下提升任务表现。

### Chain-of-thought（CoT）prompting

这个方法最早由 Wei 等人在 2022 年论文《Chain-of-Thought Prompting Elicits Reasoning in Large Language Models》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2201.11903)）中提出，对需要推理或多步骤流程的 LLM 任务产生了令人印象深刻的结果。我们可以使用 CoT prompting 鼓励模型拆解问题，并展示其思考过程。可以在 prompts 中包含示例，在 prompt 中演示逐步推理过程。下面是一个实际 prompt 示例：

```vbnet
There are 15 students in a class. 8 students have dogs as pets.
If 3 more students get a dog, how many of them would have a dog as a pet then?
Step 1) Initially there are 15 students and 8 have dogs
Step 2) 3 more students will get dogs soon
Step 3) So the final number is the initial 8 students with dogs plus the 3 new students = 8 + 3 = 11
Therefore, the number of students that would have a dog as a pet is 11.
A factory makes 100 items daily. On Tuesday, they boost production by 40% for a special order. However, to adjust inventory, they cut Thursday's output by 20% from Tuesday's high. Then, expecting a sales increase, Friday's output rises by 10% over the day before. Calculate the production numbers for Tuesday, Thursday, and Friday.
```

prompt 的第一部分展示了推理过程，引导 LLM 更好地回答第二部分，也就是实际任务。

### 自洽性

自洽性旨在通过采样多条多样化推理路径，并利用这些生成结果选择最一致答案，来提升 CoT prompting 的表现。这个方法最早由 Wang 等人在 2023 年论文《Self-Consistency Improves Chain of Thought Reasoning in Language Models》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2203.11171)）中提出。self-consistency 方法通过替代更传统的 CoT prompting，帮助提升涉及算术和常识推理任务的表现。self-consistency 包括提供 few-shot CoT 示例，生成多条推理路径，然后基于这些路径选择最一致答案。

### Tree of thoughts（ToT）prompting

ToT 是一个对 CoT prompting 进行泛化的框架，它鼓励探索作为语言模型一般问题求解中间步骤的 thoughts。在底层，它维护一棵 thoughts 之树，其中 thoughts 表示作为解决问题中间步骤的连贯语言序列。语言模型生成和评估 thoughts 的能力，会与专门搜索算法结合，从而支持对 thoughts 的系统性探索。ToT prompting 包括提示语言模型把 intermediate thoughts 按照到达期望解决方案的可能性评估为 sure / maybe / impossible，然后使用搜索算法探索最有前景路径。该方法首次出现在以下论文中：

Yao 等人 2023 年，《Tree of Thoughts: Deliberate Problem Solving with Large Language Models》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2305.10601%EF%BC%89)

Long 2023 年，《Large Language Model Guided Tree-of-Thought》（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2305.08291%EF%BC%89)

下面是一个示例 prompt：

```vbnet
Let's simulate a verbal conversation between three experts who tackle a complex puzzle.
Each expert outlines one step in their thought process before exchanging insights with the others, without adding any unnecessary remarks. As they progress, any expert who identifies a flaw in their reasoning exits the discussion. The process continues until a solution is found or all available options have been exhausted. The problem they need to solve is:
"Using only numbers 3, 3, 7, 7 and basic arithmetic operations, is it possible to obtain the value 25?"
```

### Prompt chaining

### Prompting 的新兴趋势

遵循这些黄金法则和方法，你就可以使用 LlamaIndex 开发更有效、更可靠的 RAG 应用，并充分发挥 LLM 的潜力。

## 微调 RAG 组件以获得更好结果

在 RAG 语境中，微调指的是取一个预训练模型，并在我们自己的数据上进一步训练它，以提升其在特定任务上的表现。不同于从零训练模型，那需要巨大的计算资源，微调是一个轻量过程，它建立在模型已有知识之上，并调整模型，使其更好适配我们的领域。

有几个 RAG 组件可以从微调中受益。让我们看看最有影响力的那些。

### 微调 embedding 模型

如果说 RAG pipeline 中有一个组件，微调能带来最直接、最可衡量的改进，那就是 embedding 模型。正如我们在前面章节中讨论过的，embedding 模型负责把文本转换成存在于高维空间中的向量表示。检索通过在这个空间中寻找彼此接近的向量来工作。

问题在于，预训练 embedding 模型是从通用训练数据中学习“接近性”概念的。当我们引入自己的领域特定 corpus 时，模型对于哪些文本在语义上相似的理解，可能并不完全匹配我们的检索目标。

例如，如果我们正在针对一批医学研究论文构建 RAG 应用，就会希望 embedding 模型理解 myocardial infarction 和 heart attack 应该在向量空间中非常接近，而 heart attack 和 attack helicopter 应该相距很远。通用 embedding 模型可能无法像我们希望的那样清晰地区分这一点。

LlamaIndex 提供了用于微调 embedding 模型的内置抽象，而且这个过程出奇地容易上手。一般工作流包括以下步骤：

我们生成一个合成训练数据集：这是 LlamaIndex 方法中最优雅的方面之一：不需要人工标注数据。相反，我们使用 LLM 从文本 chunks 中生成假设性问题。每个（question, text chunk）对都成为一个正训练样本，而负样本则从其他 chunks 中随机采样。LlamaIndex 提供了 `generate_qa_embedding_pairs` helper function，可以完全自动化这个过程。

我们使用生成的数据集微调 embedding 模型：LlamaIndex 提供 `SentenceTransformersFinetuneEngine`，它封装 sentence-transformers 库，并让微调开源模型变得直接，例如来自 Beijing Academy of Artificial Intelligence General Embedding（BGE）系列的模型。训练是轻量的，不需要 GPU。它可以舒适地运行在普通笔记本上。

我们将微调模型与基础模型进行评估对比：LlamaIndex 支持多种评估指标，包括 hit rate 和 MRR。

值得吗？这里有一些数字：

在实践中，基于领域特定合成数据集的微调通常可以在检索评估指标上带来 5-10% 的提升，这是一个显著收益，并会直接转化为更好的 RAG 响应。作为参考，Gupta 等人 2025 年观察到，在多个数据集上使用合成数据和模型融合可以带来 5-7% 的召回收益（[doi.org/10.1007/978…](https://doi.org/10.1007/978-981-96-0348-0_6%EF%BC%89%EF%BC%9B%E8%80%8C) Schmid 2024 年展示了仅用 6,300 个样本微调 BGE 时约 7% 的提升（[www.philschmid.de/fine-tune-e…](https://www.philschmid.de/fine-tune-embedding-model-for-rag%EF%BC%89%E3%80%82)

下图展示了使用 LlamaIndex 微调 embedding 模型的三步工作流：

但是，如果我们使用的是像 OpenAI 这样的专有 embedding 模型，无法修改其权重怎么办？LlamaIndex 也为此提供了解决方案。`EmbeddingAdapterFinetuneEngine` 允许我们在任何黑箱 embedding 模型之上训练一个轻量 adapter，可以是一个线性层、一个两层神经网络，甚至自定义架构。adapter 会把 embedding 输出转换为一种新表示，使其更符合我们的检索目标。

### 什么是 embedding adapter？

可以把 adapter 想象成一个小型、可训练的翻译器，它位于 embedding 模型和我们的检索系统之间。embedding 模型本身保持冻结。我们完全不改变它的权重。相反，adapter 学习一个变换，调整模型产生的 embeddings，使它们更适合我们的具体数据。实际中，这可以简单到一个线性层，用于旋转并重新缩放 embedding vectors；也可以是一个小型两层神经网络，应用更复杂的变换。因为 adapter 相比完整 embedding 模型非常小，所以训练速度快，所需计算也很少。关键洞察是，我们不需要改变整个模型来改善检索。有时，只需对输出的解释方式做一个小调整就够了。

关于这两种方法的完整指南和代码示例，包括使用 `SentenceTransformersFinetuneEngine` 直接微调 embedding 模型，以及使用 `EmbeddingAdapterFinetuneEngine` 在冻结 embedding 模型之上训练轻量 adapter，请参见以下官方文档：

Direct fine-tuning：[docs.llamaindex.ai/en/stable/e…](https://docs.llamaindex.ai/en/stable/examples/finetuning/embeddings/finetune_embedding/)

Adapter fine-tuning：[docs.llamaindex.ai/en/stable/e…](https://docs.llamaindex.ai/en/stable/examples/finetuning/embeddings/finetune_embedding_adapter/)

### 微调用于 re-ranking 的 cross-encoders

### Bi-encoders vs. cross-encoders

bi-encoder 会独立处理 query 和 document，为每一方生成一个单独 embedding。随后通过余弦相似度等相似度指标比较两个 embeddings 来确定相关性。这使 bi-encoders 非常快，因为我们可以提前预计算并存储 document embeddings，但代价是模型永远不会同时看到 query 和 document。另一方面，cross-encoder 会把 query 和 document 作为一个组合输入，并直接输出相关性分数。这种联合处理让模型能够捕捉 query 和 document 之间的细微交互，从而产生更准确的相关性判断。不过，由于计算必须在 query time 对每个 query-document pair 执行，cross-encoders 明显更慢。这就是为什么实践中我们使用 bi-encoders 做初始检索，也就是快速、宽泛搜索，再使用 cross-encoders 做 re-ranking，也就是准确、狭窄精炼。

和 embedding 模型一样，我们可以在自己的数据上微调 cross-encoder，以提升 re-ranking 表现。LlamaIndex 支持使用 sentence-transformers 库微调 cross-encoders。训练数据格式很直接：每个样本由一个 question、一个 context passage 和一个 relevance score（0 或 1）组成。我们可以使用类似前面为 embeddings 描述的方法合成生成这些数据。

此外，LlamaIndex 还通过 `CohereRerankerFinetuneEngine` 集成 CohereAI 的自定义 re-ranker 微调 API。这允许我们使用 Cohere 托管基础设施创建领域特定 re-rankers，对于生产部署来说可能特别方便。

### 微调 LLM 以获得更好的响应合成

LlamaIndex 通过 `OpenAIFineTuningHandler` 为此提供工具，它可以自动记录 RAG 工作流中使用 GPT-5.4 这类强大模型生成的问答对。这些记录下来的 pairs 随后作为训练数据，用于微调一个成本较低的模型。结果是得到一个蒸馏模型，它以一小部分成本近似原始模型的输出质量。

当我们已经拥有一个调优良好的 RAG pipeline，并希望在不显著牺牲质量的情况下降低运营成本时，这种方法尤其有效。

另一个实际微调场景，是训练 LLM 生成更好的结构化输出，或遵循应用所需的特定格式约定。正如“必需的输出格式”小节中所讨论的，仅靠 prompting 让 LLM 稳定生成结构化响应可能很有挑战。在期望输出格式示例上进行微调，可以显著提升一致性。

### 微调 evaluator

一个经常被忽视但非常实用的微调用例，是把强大的 evaluator 模型蒸馏成一个更便宜的模型。许多评估方法依赖基于 LLM 的 judges。这些模型会评估生成响应的质量、正确性或忠实度。

如果每次评估都使用 Anthropic Opus 或 OpenAI GPT 这样的 frontier model 作为 judge，成本可能很高，尤其是在评估大型数据集，或开发期间频繁运行评估循环时。

LlamaIndex 支持这种评估工作流，它允许我们微调一个成本较低的模型，使其近似 frontier model 的判断质量。事实上，这是前一小节中描述的知识蒸馏方法的直接应用，只不过它应用在我们 pipeline 的评估层，而不是响应合成层。

我们首先使用 frontier model 作为 evaluator，为一组响应打分，然后用这些分数作为训练数据，微调一个更便宜的模型。使用这种方法，我们可以微调 correctness judge 和基于比较的 judge。结果是一个 evaluator，它能以一小部分推理成本接近 GPT-5.4 与人工评估一致性的水平，使更频繁、更大规模地运行评估成为可能，而这正是我们持续改进 RAG pipeline 所需要的。

### 决定何时微调

微调是一个强大工具，但并不总是正确的第一步。在投入时间进行微调之前，请确保你已经用尽了更简单的优化策略。你是否已经尝试不同 chunk size 和 overlap 值？是否使用了合适的检索策略和 re-rankers？是否优化了 prompts？在许多情况下，仅这些调整就能得到我们需要的结果。

当我们已经优化 pipeline 架构和 prompt templates，但当前表现与需求之间仍有差距时，微调最有价值。面对高度专业化领域时，它尤其有效，因为其中词汇和语义关系与模型通用训练数据显著不同。一如既往，任何微调工作都应该由严格评估支撑。如果我们不衡量影响，就无法知道自己是否真的改进了什么。

此外，如果不小心，微调可能会适得其反。一个特别隐蔽的风险是过拟合。过拟合发生在模型过度学习训练数据模式，从而失去对新的、未见输入的泛化能力时。训练期间的评估指标可能看起来很好，甚至每个 epoch 都稳步提升，但当我们把模型部署到真实生产数据上时，结果可能令人失望，甚至比基础模型更差。

我在微调一个 90 亿参数模型时亲身经历过这一点。训练期间的评估分数很鼓舞人心，但一旦模型暴露给实际生产 queries，也就是自然更丰富、更不可预测的 queries，性能就急剧下降。模型本质上记住了训练示例，而不是学习我希望它捕捉的底层模式。

为了降低这个风险，一定要在一个保留验证集上进行评估，这个验证集必须真正代表生产数据，而不仅仅是训练集的随机切分。关注训练指标和验证指标之间的差距。如果训练表现持续提升，而验证表现停滞或恶化，这就是过拟合的明确信号。

使用更少训练 epochs、应用 regularization 技术，并确保训练数据有足够多样性，都能有所帮助。但最重要的是，我通过艰难方式学到的教训是：在把微调模型部署到生产之前，永远不要跳过真实世界数据测试。

另外，决定微调时，要理解硬件和成本影响。关于微调最常见的误解之一是，它总是需要昂贵硬件和大量计算预算。事实上，成本差异巨大，取决于我们正在微调哪个组件：

微调 embedding 模型是目前最容易上手的选项。由于 embedding 模型相对较小，通常从数千万到几亿参数不等，训练过程是轻量的。LlamaIndex 的 embedding 微调 notebooks 已经在普通消费级硬件上测试，并表现出相对不错的性能水平。这里主要成本来自生成合成训练数据集，因为这涉及 LLM API 调用。但对于一个中等规模数据集，这可能只对应几美元 API 费用，考虑到检索质量可能提升，这是一笔可以忽略不计的投入。

微调 cross-encoders 落在类似范围。这些模型也相对紧凑，训练可以在配备普通 GPU 的消费级硬件上完成。如果我们改用托管微调服务，例如 Cohere 的 custom re-ranker training API，或 Anyscale、Modal 等云端微调平台，计算会在它们的基础设施上处理，并通过 API 计费。这简化了流程，但也引入了对第三方服务的依赖。

微调 LLM 本身则是成本可能显著攀升的地方。如果使用 OpenAI fine-tuning API 这样的托管服务，成本按使用量计费。我们按训练 token 付费，而且微调后的模型相比基础模型，通常有更高的每 token 推理成本。作为参考，OpenAI 对不同模型的微调收费不同，并且这些价格经常变化，因此在投入大型训练运行前，务必查看其平台上的最新价格。如果我们选择本地微调开源 LLM，硬件要求会大幅增加。使用 LoRA 或 QLoRA 等参数高效技术时，7-8B 参数模型通常可以在一块高端消费级 GPU（24 GB VRAM）上完成微调。更大模型可能需要多块 GPU 或云实例，把每次训练运行的成本推高到数百甚至数千美元。

结论是，存在一个清晰成本梯度：embedding 微调几乎免费；cross-encoder 微调成本较低；而 LLM 微调根据模型大小和方法不同，从中等成本到昂贵不等。这也是先从 pipeline 的检索侧入手的另一个原因。它不仅经常带来最大改进，而且也是最便宜的实验对象。图 13.6 对这种成本梯度提供了视觉解释：

说到成本，微调只是管理 RAG 应用经济性的一个杠杆。在下一节中，我们将更广泛地看一看成本优化技术，它们可以帮助我们构建高效、生产就绪的系统，同时不突破预算。

## 探索成本优化技术

构建一个在 demo 中表现良好的 RAG 应用是一回事。让它在生产中具备经济可持续性，则是完全不同的挑战。随着应用扩展到更多用户、更多 queries 和更大的知识库，与 LLM 推理、embedding 生成和存储相关的成本会快速增长。在本节中，我们将探索一些实践策略，用于在不牺牲 RAG pipeline 质量的情况下控制这些成本。

LLM inference 通常是最大开销。我们处理的每个 query 都涉及向 LLM 发送 prompt，并且我们按 token 付费，包括输入 token，也就是我们的 prompt 加检索上下文，以及生成输出 token。输出 token 尤其昂贵，通常根据提供商不同，比输入 token 贵 3 到 8 倍。随着用户和 queries 数量增长，这项成本会成比例扩展。

Embedding generation 是第二个成本驱动因素。每当我们摄入新数据或处理 query 时，都需要生成 embeddings。虽然单次 embedding 调用很便宜，但在处理大型或频繁更新的数据集时，成本会累积。

Vector storage 是一些实践者称为 sneaky cost 的东西。初始 embedding 生成可能不贵，但在托管向量数据库中存储数百万个高维向量，需要持久基础设施，而这些成本会随着时间累积。

### 为任务选择合适模型

也许最有效的单一成本优化策略，是避免使用超出任务所需的更强大、更昂贵模型。RAG pipeline 中并不是每个操作都需要 frontier model。

metadata extraction、classification 或直接 question answering 这类简单任务，通常可以由更小、更便宜的模型处理，而不会有明显质量下降。

### 优化 token 使用

既然我们按 token 付费，减少发送和接收的 token 数量就是降低成本的直接路径。有几种实践方法可以实现这一点：

Prompt optimization 是最直接的杠杆。简洁、结构良好并避免不必要冗长的 prompts，可以显著减少输入 token 数量。正如本章中我们一直讨论的，精心构造 prompt 不只是为了获得更好响应；也是为了高效使用 token 预算。每一条冗余指令或过于冗长的 system prompt，在规模化时都会直接转化为更高成本。

Context window management 同样重要。在 RAG pipeline 中，检索上下文往往构成输入 tokens 的大部分。检索超过必要数量的 nodes，会用低相关信息膨胀 prompt，增加成本，却不改善响应。调优 `similarity_top_k` 以检索刚好足够的上下文，使用 re-rankers 优先选择最相关 nodes，并采用 `SimilarityPostprocessor` 等 node postprocessors 过滤低相关内容，都是有效策略，我们在前面章节中已经讲过。

Prompt compression 更进一步。第 7 章《查询我们的数据，第 2 部分——后处理和响应合成》中讨论过的 `LongLLMLinguaPostprocessor` 等工具，可以通过移除冗余 tokens，同时保留上下文语义含义来压缩 prompts。这可以显著减少输入 token 数量，在某些情况下减少 4 倍甚至更多，同时还可能通过消除噪声来提升响应质量。

在输出侧，通过 `max_tokens` 参数限制响应长度，或在 prompt 中包含明确长度指令，可以减少输出 token 成本。由于输出 token 比输入 token 贵数倍，即使适度减少，也可能对总体账单产生有意义影响。

### 缓存策略

如果说有一种优化在生产 RAG 系统中始终能带来令人印象深刻的回报，那就是 caching。真实世界工作负载往往包含比我们预期更多的重复：相同问题、类似 queries，以及其他反复出现的模式。那么，我们能做什么？

在应用层，exact-match caching 会存储给定 query 的响应，当同一个 query 再次出现时直接返回，从而完全绕过 LLM 调用。这实现起来极其简单，并且可以消除很大一部分冗余推理成本。

Semantic caching 更进一步，它识别那些并不完全相同，但语义相似到足以使用相同响应的 queries。这通常使用 embedding similarity lookup，在之前 query-response pairs 的缓存中查找。虽然设置起来稍复杂一些，但 semantic caching 能捕获比 exact matching 更多的 cache hits。

LlamaIndex 的 ingestion pipeline caching 是这种优化的另一种形式。ingestion pipelines 可以缓存中间结果，使重新处理未变化文档时不会产生不必要的 embedding 或 LLM 成本。这对于增量更新而不是从零重建的数据集尤其有价值。

还值得注意的是，大多数 frontier model 提供商现在都在 API 层提供 prompt caching。其机制是提供商存储并复用此前处理过的 prompt prefixes，因此后续请求中相同部分不需要重新处理。这种机制透明运行，我们几乎无需额外工作就能获得显著节省。例如，OpenAI API 会自动缓存长度超过 1,024 tokens 的 prompt prefixes。

看一下图 13.7，以可视化 prompt caching 过程：

当后续请求共享相同 prefix 时，这在 RAG 应用中相对常见，因为 system prompt 和 instructions 会在 queries 之间保持不变，cached tokens 会以大幅折扣费率处理，从而在输入 token 成本上带来可观节省，并使延迟最多降低 80%。这会自动生效，无需代码改动。

为了充分利用它，我们应该构造 prompts，使稳定部分，也就是 system instructions、tool definitions、static context，出现在开头，而可变部分，也就是 user query、retrieved context，放在末尾。

Anthropic、Google 和其他主要提供商也提供类似缓存机制，每家实现略有不同，但底层原则相同。

### 利用开源模型

对于 query volume 很高的应用，自托管开源模型可以完全消除 API 费用。LlamaIndex 可以通过 LM Studio、vLLM、SGLang、Ollama 等工具与本地模型无缝集成。在本书中，我们在大多数代码示例中一直使用 Gemma3:4b，跟着做的读者已经熟悉一个小型本地托管模型在许多 RAG 任务上可以有多么强大。代价是我们需要承担管理推理基础设施的责任，但对于具备技术能力的组织来说，长期成本节省可能相当可观。

对于没有所需硬件、但仍想探索自托管的开发者，Vast.ai（[vast.ai](https://vast.ai)）这样的 GPU marketplace 平台是一个很好的起点。Vast.ai 是一个去中心化 GPU 市场，个人和数据中心可以出租其可用计算能力。这意味着我们可以以显著低于传统云提供商的价格，访问高性能 GPU，从消费级 RTX 5090 到 H100、H200 和 B200 这样的数据中心卡，而且没有长期合同或最低承诺。我们可以从几美元起步，并按需扩展。

对于想要尝试微调，或在认真硬件上运行本地模型，但又不想进行重大前期投资的开发者来说，这类平台消除了最大的入门障碍之一。

### 监控并跟踪成本

如果无法衡量影响，这些优化策略都不会有效。跟踪 token 使用不是可选项。它是运行生产 RAG 应用的基础部分。LlamaIndex 提供 token counting utilities 和 callbacks，可以集成到 pipeline 中，实时监控使用情况。

一种实践方法是从一开始就在 pipeline 中接入 token usage logging，即使是在开发期间也如此。这会形成一种成本意识习惯，之后会非常有价值。优化一个我们一直在监控的系统，要比事后反向推导一个无约束增长系统的成本结构容易得多。

最有效的成本优化策略很少只依赖单一技术。它们会复合生效。结构良好的 prompt 减少输入 tokens。re-ranker 减少无关上下文数量。较小模型处理简单 queries。caching 消除冗余调用。monitoring 告诉我们下一步应该关注哪里。系统性应用这些技术的组织，经常能在维持甚至提升 RAG pipeline 质量的同时，降低 40–70% 成本。

## 总结

本章探讨了提示工程在使用 LlamaIndex 构建有效 RAG 应用中的重要性。我们学习了如何检查并定制各种组件使用的默认 prompts，包括用于构建更具表达力的 Jinja 风格模板的现代 `RichPromptTemplate` 方法。

本章概述了构造高质量 prompts 的关键原则和最佳实践，以及高级 prompting 技术。此外，它强调了为当前任务选择合适语言模型的重要性，并理解它们的不同架构、能力和取舍。

我们讨论了一些简单但强大的 prompting 方法，例如 few-shot prompting、CoT prompting、self-consistency、ToT 和 prompt chaining，用来增强语言模型的推理和问题解决能力。

除了 prompt engineering 之外，我们还探索了如何微调单个 RAG 组件，例如 embedding models、cross-encoders、LLMs 和 evaluators，从而在检索和响应质量上产生可衡量改进。我们还讲到了实践性的成本优化技术，从 model routing 和 token management，到 caching strategies 和利用开源模型，它们有助于随着应用扩展而保持经济可持续性。

掌握这些技能，对于在生产级 RAG 应用中释放 LLM 的全部潜力至关重要。

随着我们的旅程接近最后阶段，我邀请你在下一章继续和我一起探索 LlamaCloud 和 LlamaParse 如何通过生产级文档解析、摄入和检索能力，把我们的 RAG 应用带到企业级水平。

