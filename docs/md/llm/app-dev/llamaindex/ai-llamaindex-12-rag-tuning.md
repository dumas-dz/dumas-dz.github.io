---
title: LlamaIndex - 调优 RAG - 可观测性与评估
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 调优
---

---

本章聚焦 RAG 系统的可观测性与评估：使用 Instrumentation 模块追踪工作流，Faithfulness/Relevancy 等评估指标，以及评估→追踪→调整的迭代优化循环。

### 技术要求

本章示例代码需要以下包：

`docx2txt`：[pypi.org/project/doc…](https://pypi.org/project/docx2txt/) —— 用于加载代码示例中使用的 `.docx` 格式示例合同文档。

OpenAI LLM integration：[pypi.org/project/lla…](https://pypi.org/project/llama-index-llms-openai/) —— 我们会在评估示例中将其用于 judge LLM。你需要一个 OpenAI API key，可以在 [platform.openai.com](https://platform.openai.com/) 获取。

## 为什么 RAG 评估很重要？

如果你一直跟着本书中的动手示例走，那么你已经构建出了一些相当令人印象深刻的东西。你加载了文档，把它们切分成 nodes，构建了索引，并连接了能够返回连贯答案的 query engine。LlamaIndex 让所有这些事情看起来几乎毫不费力。这既是它最大的优势，也在某种意义上是它最棘手的陷阱。

因为 LlamaIndex 抽象掉了大量底层复杂性，例如 embedding 调用、向量相似度搜索、prompt 构造和 LLM 推理，所以你很容易把整个 pipeline 当作一个黑箱。你输入一个问题，得到一个答案；只要答案看起来合理，一切似乎就都没问题。

但如果答案看起来不合理，会发生什么？或者更糟的是，如果答案看起来合理，但实际上是错的，又会发生什么？一个听起来很自信的幻觉回答，可以说比一个明显坏掉的回答更危险，因为它更难被发现。

考虑一个场景：Contract Review Expert 的 query engine 返回了一个关于合同终止条款的答案。这个回答听起来非常权威，并且引用了一个看似相关的部分。但当你深入查看时，你会发现被检索出来的上下文来自文档中完全不同的部分，和终止条件毫无关系。LLM 作为一个自信的文本生成器，只是尽力基于它拿到的内容完成回答。根本原因不是 LLM 本身。在这个具体案例中，问题可能出在检索步骤。

如果你无法看见从问题到最终答案之间发生了什么，就永远不会知道问题是从哪里开始的。这就是黑箱问题，也是 RAG 开发中最大的挑战之一。我们添加的抽象层越多，定位问题就越困难。

### 什么是可观测性和评估？

可观测性是从软件工程和分布式系统领域借来的概念。

简单来说，可观测性指的是：通过查看应用的输出，理解应用内部正在做什么的能力。

观测会用到 trace、log 和 metric 等概念。如果你曾经在 Python 脚本中添加过一个 `print()` 语句，用来弄清楚为什么某个变量出现了意料之外的值，那么你已经实践过一种非常基础的可观测性形式。

但随着应用变得更复杂，`print()` 语句并不能扩展。在一个 RAG pipeline 中，单个查询可能触发一串操作：对查询做 embedding，搜索向量存储，检索并排序 nodes，构造 prompt，调用 LLM，并合成最终响应。这些步骤中的每一个都可能独立成功或失败，而它们之间的交互也可能产生意料之外的行为。

可观测性工具给了我们一种结构化方式，用来捕获和可视化整个执行流程。我们得到的不再是分散的 `print` 语句，而是有组织的 traces，清楚展示到底发生了什么，以及发生的顺序。我们可以看到每个步骤耗时多久，以及哪些数据流经了 pipeline。

如果说可观测性回答的是“我的应用正在做什么？”，那么评估回答的是另一个同样重要的问题：“我的应用做得有多好？”

在传统软件开发中，测试相对直接。你写一个函数，定义预期输入和输出，然后检查结果是否匹配。但 RAG 应用从根本上不同。输出是开放式文本，而且很少只有一个正确答案。比如“这份合同中的付款条款是什么？”这样的问题，可能有许多有效答案，取决于信息如何被表述或置于上下文中。

答案真的受到检索上下文的支持，还是模型编造了一些东西？

检索出来的上下文本身是否与问题相关？

答案是否回应了问题，还是走偏了方向？

正如本章稍后将看到的，LlamaIndex 提供了内置评估模块，可以帮助我们系统性地回答这些问题。但现在，关键结论是：评估是一种实践，用于从多个维度衡量 RAG pipeline 输出的质量。它以可重复、可扩展的方式完成这件事，而不是只依赖检查几个样例。

### 同一枚硬币的两面

可观测性帮助我们识别问题。它可以回答一些重要问题，例如：

哪个检索步骤返回了无关上下文？

LLM 调用花了多久，实际发送给模型的 prompt 是什么？

评估帮助我们衡量这些问题的影响。它回答的是这类问题：

我的系统多久出现一次幻觉？

检索出来的 nodes 中，有多少比例实际上是相关的？

生成的响应是否忠实于提供的上下文？

评估、追踪、改进、再评估。这个迭代循环是构建可靠 RAG 应用的核心。它让我们从“看起来能工作”，走向“我能证明它确实有效”。

面向 LLM 应用的可观测性和评估生态正在快速演进。事实上，当我开始写这一章时，我原本熟悉的工具已经发生了很大变化，以至于有必要重新研究。而现在已经有许多优秀的第三方工具可用，包括 Arize Phoenix、Langfuse、DeepEval、MLflow 等。每个工具都有自己的优势。不过在本章中，我决定聚焦于 LlamaIndex 通过 instrumentation 和 evaluation 模块原生提供的能力。这会给你一个稳固、无额外依赖的基础，之后你可以根据生产需求，用任何这些外部工具进行扩展。你会在本章末尾找到部分工具的参考资料，便于进一步探索。

## 使用 LlamaIndex 的 instrumentation 模块追踪 RAG 工作流通过将 logging 级别设置为 `DEBUG`，我们可以在终端中看到关于文档解析、embedding 调用和检索操作的消息滚动出现。对于简单应用来说，这通常已经足够理解发生了什么。

但随着应用变得更加复杂，比如多个 retriever、re-ranker、编排工具调用的 agents，原始 log 输出很快就会变得难以承受。你会得到数百行交织在一起的消息，而找到那个相关细节就像在干草堆里找针。我们需要更结构化的东西。

如果你看过较早的 LlamaIndex 教程或文档，其中提到 `CallbackManager` 或 `set_global_handler()` 函数，需要注意这些方式现在已经被认为是 legacy。instrumentation 模块是未来推荐的替代方案。虽然旧方法在弃用期内仍然可用，但所有新开发都应该使用我们接下来要探索的 instrumentation 方法。

让我们先理解该模块的三个核心概念：spans、events 和 dispatchers。instrumentation 模块围绕这三个关键抽象构建。如果你在传统软件开发中使用过可观测性工具，那么一旦看到它们如何运作，这些概念会很直观。让我们进一步了解它们：

Spans：它们表示一个有开始和结束的工作单元。span 就像一个秒表，在某个特定操作开始时启动，在操作完成时停止。每个 span 都会捕获关于该操作的 metadata，例如正在做什么类型的工作、耗时多久，以及任何相关输入或输出数据。span 特别强大的地方在于它们可以嵌套。当你对 query engine 运行查询时，LlamaIndex 会为整个查询操作创建一个顶层 span。在这个 span 内部，它会为检索步骤、embedding 调用、LLM 推理和响应合成创建子 span。这种父子层级结构给了你一种树状视图，用来查看应用的执行流。这样，你既能看到全局，也能看到细节。

Events：它们是某个时间点上发生的事件。span 表示一段持续时间，而 event 表示一个可辨识的单一时刻。LlamaIndex 会在执行期间针对特定里程碑发出 events，例如 LLM 调用开始、embedding 操作完成，或查询开始处理。events 通常属于某个父 span，为该工作单元内部发生的事情提供额外细节。

Dispatchers：它们是路由机制：从 LlamaIndex 代码中接收 spans 和 events，并将它们转发给你附加的 handlers。如果你熟悉 Python 内置 logging 模块，dispatchers 的工作方式与 loggers 非常相似。它们遵循层级结构：有一个 root dispatcher 捕获所有内容，也有位于单个模块层级的 child dispatchers。默认情况下，events 和 spans 会从 child dispatchers 向上传播到 root，因此把 handler 附加到 root dispatcher 通常就足以捕获完整执行流。

### 追踪一个简单的 RAG 查询

由于我们会使用 `.docx` 格式的示例合同，请在运行示例前确保你已经安装必要包：

```code
pip install docx2txt
```

第一步是在运行任何 LlamaIndex 操作之前配置 instrumentation。

警告：

确保在创建任何 indexes 或运行任何 queries 之前设置 instrumentation。如果你在附加 span handler 之前实例化 `VectorStoreIndex`，那么 indexing spans 会被静默丢失，你不会在 trace 输出中看到它们。

```javascript
import llama_index.core.instrumentation as instrument
import models_config
from llama_index.core.instrumentation.span_handlers import SimpleSpanHandler
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex

span_handler = SimpleSpanHandler()
dispatcher = instrument.get_dispatcher()
dispatcher.add_span_handler(span_handler)
```

```ini
documents = SimpleDirectoryReader('files').load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What are the main obligations of the supplier?")
print(response)
```

你可能还记得，这就是我们在整本书中一直使用的相同模式。但重要的事情发生在幕后。当每个操作执行时，LlamaIndex 的内部 dispatchers 会发出 spans，这些 spans 会被我们的 `SimpleSpanHandler` 捕获。现在让我们看看捕获到了什么：

```python
for span in span_handler.completed_spans:
    print(f"Span: {span.id_}"  )
    print(f"  Parent: {span.parent_id}")
    print(f"  Duration: {span.duration}")
    print(f"  Tags: {span.tags}")
    print()
```

我们的 handler 的 `completed_spans` 属性包含执行期间捕获到的所有 spans 列表。每个 span 都有一个 `id_` 标识符，一个 `parent_id` 引用，用于把它连接到层级结构中的父级，一个衡量操作耗时的 `duration`，以及提供额外 metadata 的 `tags`。

### 读取并解释 trace 输出

输出包含 span 名称、它的 parent，以及它的 duration。通过跟随父子关系，你可以重建执行树。

你可能会觉得深度很多、让人不知所措，甚至有点吓人。但请记住，每一层只是 LlamaIndex 的内部基类在委托给它的具体实现。重要的结构模式仍然是我们预期的两分支拆分：一边是 retrieval，另一边是 synthesis。

从这个 trace 中，我们可以做出以下观察：

总查询时间约为 30 秒，而 LLM 调用（`LLM.predict`，28.71 秒）几乎占据了全部时间。这在通过 Ollama 运行本地模型时很典型。

在这个示例中，retrieval 分支，包括 query embedding，只花了约 1.15 秒。如果我们想提速，就能准确知道应该关注哪里。

某些 spans 出现在 query spans 之前，例如 `NodeParser.__call__` 和 `BaseEmbedding.get_text_embedding_batch`。这些来自 `VectorStoreIndex.from_documents()` 调用，该调用解析示例合同并创建用于 indexing 的 embeddings。span handler 会捕获所有内容，而不仅仅是 query。

这里的关键结论是，你不需要记住每个 span 名称。关注 durations 和父子关系即可。retrieval 慢吗？看 embedding 调用。synthesis 慢吗？看 LLM 调用。响应错了吗？先检查 retriever 是否返回了正确 chunks，再去责怪模型。

### 捕获 events 以获得更深入洞察

Spans 给了我们结构性概览，但有时我们需要某个特定步骤内部发生情况的更多细节。这就是 events 的作用。LlamaIndex 在执行期间会发出丰富的 events，覆盖从 embedding 操作到 LLM chat completions 再到 retrieval results 的所有内容。要捕获 events，我们可以通过继承 `BaseEventHandler` 定义一个自定义 event handler。下面是在前一个示例基础上的一个简单补充，它会在每个 event 发生时打印出来：

```python
from llama_index.core.instrumentation.event_handlers import BaseEventHandler
from llama_index.core.instrumentation.events import BaseEvent

class SimpleEventHandler(BaseEventHandler):
    @classmethod
    def class_name(cls):
        return "SimpleEventHandler"

    def handle(self, event: BaseEvent, **kwargs):
        print(f"Event: {event.class_name()}")
        print(f"  Span ID: {event.span_id}")
        print()

event_handler = SimpleEventHandler()
dispatcher.add_event_handler(event_handler)
```

添加 events 后，再运行与之前相同的查询，就会在 events 发生时打印 event 通知。你会看到诸如 `QueryStartEvent`、`RetrievalStartEvent`、`EmbeddingStartEvent`、`SynthesizeStartEvent` 和 `LLMChatStartEvent`，以及它们对应的 End events，实时流经你的 handler。这就像一段按时间顺序叙述的故事，逐步说明 pipeline 正在做什么。每个 event 都通过它的 `span_id` 连接到一个 span，因此你总能看到它属于哪个更高层操作。

和 spans 一样，你会注意到，来自 `from_documents()` events 的 embedding 调用发生在 query events 开始之前，属于 indexing 阶段。

你可以根据需要，让自己的 event handler 简单或复杂。对于快速调试，只打印 event 名称可能就够了。对于生产应用，你可能想把 events 记录到文件，收集 timing metrics，甚至构建一个可视化 dashboard。

### 实践练习

这里有一个现在就可以尝试的有用练习。你会更好地理解不同组件在幕后如何交互，而且你可能会惊讶于那些从 API 层看起来很简单的操作，内部实际上涉及了多少步骤。

### OpenTelemetry 与生产可观测性

我们刚刚探索的 instrumentation 方法非常适合开发和调试。但在生产环境中，如果你需要持久存储、dashboards 和 alerting，又该怎么办？

Jaeger（[www.jaegertracing.io/）](https://www.jaegertracing.io/%EF%BC%89)

Grafana Tempo（[grafana.com/oss/tempo/）](https://grafana.com/oss/tempo/%EF%BC%89)

Datadog（[www.datadoghq.com/）](https://www.datadoghq.com/%EF%BC%89)

## 衡量 RAG 质量——关键概念和指标

在进入代码和工具之前，让我们后退一步，建立一个扎实理解：RAG 评估到底意味着什么，我们在衡量什么，以及它为什么不同于传统软件测试。有了这个概念基础，后续内容会更容易掌握。

### RAG 评估的两个维度

关于 RAG 评估，最重要的一点是：RAG pipeline 不是一个单一的整体实体。它实际上由两个主要阶段组成，而且每个阶段都可以独立失败。这会对我们如何衡量质量产生重要影响。

第一阶段是 retrieval。这里，LlamaIndex 搜索 index，并返回 top-k 最相关 nodes。这里的质量问题很明显：我们真的找到了正确的信息片段吗？如果你问“这份合同中的付款条款是什么？”，而 retriever 返回的是关于交付时间表的 nodes，那么无论 LLM 多聪明，最终答案都会错误或误导。正如我们已经知道的：垃圾进，垃圾出。

第二阶段是 response generation。这里，LLM 接收检索上下文，将其与用户查询结合，并生成自然语言答案。即使 retriever 做得非常完美，LLM 仍然可能在这里出错。它可能误解上下文，忽略关键细节，引入上下文中不存在的信息，也就是幻觉，或者生成一个虽然技术上正确、但实际上并没有回答问题的答案。

### 关键评估指标

外面有很多评估指标，而且生态还在不断发明新的指标。但为了建立扎实基础，你只需要理解那些对实际 RAG 开发最重要的指标。让我们逐一走过它们。

第一个是 faithfulness，它可以说是任何 RAG 应用最重要的指标。它衡量生成答案是否真正受到检索上下文支持。换句话说：LLM 是否坚持使用给定事实，还是编造了内容？

考虑这个例子：你的 retriever 成功找到一个条款，说明合同可以通过提前 30 天书面通知终止。一个 faithful 的回答会说类似“合同可以通过提供 30 天书面通知来终止”。一个不 faithful，也就是幻觉的回答，可能会说“任何一方都可以立即终止合同，无需通知”。这听起来可能合理，但相对于我们提供的上下文而言完全是捏造的。

faithfulness 的一个巨大优点是，它是一个 label-free metric。你不需要提前准备 ground-truth answers。你只需要 query、retrieved context 和 generated response。这使它成为评估的完美起点，尤其是在早期开发阶段，你还没有构建标注数据集时。

第二个重要指标是 relevancy。一个响应可能完全 faithful，它的每一个字都基于检索上下文，但仍然完全没用。怎么会这样？因为它可能回答了错误问题。relevancy 衡量生成响应是否真正回应了用户所问内容。

举个例子：如果有人问“终止条件是什么？”，而系统返回了付款条款部分的 faithful 摘要，那么这个响应是 faithful 的，但不相关。信息是正确的，但它不是被问到的内容。

和 faithfulness 一样，relevancy 也是一个 label-free metric。它评估 query、context 和 response 之间的关系，不需要参考答案。

在实践中，faithfulness 和 relevancy 通常会一起使用，因为它们捕获了两种不同失败模式：编造内容与没有答到点上。

我们要学习的最后一个指标是 correctness，它更进一步。它把生成答案与一个已知参考答案进行比较。这个参考答案有时被称为 ground-truth label。评估器会检查系统响应是否传达了与参考答案相同的信息，通常返回一个量表分数，例如 1 到 5。

correctness 是最严格的评估形式，但它有成本：你需要自己准备那些参考答案。对于评估数据集中的每个 query，你都需要编写或验证正确答案应该是什么。这可能很耗时，尤其是面对大数据集，或法律、医疗文本这类复杂领域。

### 检索指标：hit rate 和 MRR

我们刚刚讨论的所有指标都聚焦于 response generation 侧。那么 retriever 本身呢？下面两个常用指标可以帮助我们独立评估 retrieval 质量：

Hit rate：它回答一个简单问题：正确 node 是否出现在 top-k 检索结果中的任何位置？它不关心位置，也不关心检索到了多少相关 nodes，只关心相关 node 是否进入集合。如果你检索 5 个 nodes，其中包含答案的那个 node 在其中，那就是 hit。这是一个二元指标，意味着每个 query 的得分要么是 1，也就是 hit，要么是 0，也就是 miss。Hit rate 有时会和 recall@k 混淆，但它们不同：recall@k 衡量的是所有相关文档中有多少比例出现在 top-k 结果中，当一个 query 有多个相关文档时，这个指标很重要。

Mean reciprocal rank（MRR）：它更进一步，会考虑相关结果在排名中的位置。位于第 1 位的相关结果，比位于第 5 位的相关结果得分更高。这一点很重要，因为许多 RAG 应用在构造 prompt 时会更重视第一个检索 chunk。如果最相关信息被埋在 5 个结果中的第 4 位，LLM 可能不会给予它应有的注意。

### LLM-as-a-judge 模式

你可能会想：如果 RAG 系统的输出是开放式文本，谁来决定一个响应是否 faithful、relevant 或 correct？人工 reviewer 可以做，但这很慢、昂贵，并且无法扩展。

行业中已经成为标准的方法叫作 LLM-as-a-judge。研究表明，这种方法效果非常好。在 2023 年一项标志性研究中，Zheng 等人发现，让 GPT-4 作为 judge 时，它与人工评估者的一致率超过 80%，大致相当于人工评估者彼此之间的一致水平。Zheng et al. (2023)，Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena，[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2306.05685%E3%80%82)

这个思路非常优雅且简单：我们使用一个能力很强的 LLM 来评估 RAG 系统的输出。我们把 query、retrieved context 和 generated response 交给 judge LLM，同时提供清晰的评估标准，并要求它给响应打分。

它如何工作？

举例来说，在评估 faithfulness 时，judge LLM 本质上会被提示：阅读这个上下文和这个响应。响应中的每个 claim 是否都受到上下文支持？回答 YES 或 NO。对于 correctness，它可能会被要求：把这个响应与参考答案进行比较。在 1 到 5 的范围内，这个响应匹配得有多好？

LLM-as-a-judge 方法很强大，但并不完美。judge 模型也会犯错。它可能漏掉一个微妙的幻觉，或者错误地把一个有效响应标记为不相关。还需要注意一些已被记录的偏差：LLM 倾向于偏好用它自己风格写成的响应，也就是 self-enhancement bias；可能不管质量如何都偏好更长响应，也就是 verbosity bias；可能受到选项呈现顺序影响，也就是 position bias；并且可能难以可靠评估数学或逻辑推理。这些偏差都在前面引用的 Zheng 等人研究中有记录，在解释评估结果时值得牢记。

尽管存在这些限制，基于 LLM 的评估仍然是大多数开发者可获得的最实用、最可扩展的方法。相比尝试人工审查数百个 query-response 对，它要一致得多，并且提供了一个可重复、自动化的 baseline，你可以随着时间不断完善它。

到现在，你可能已经注意到一种模式。有些指标需要参考答案，也就是标注数据，而有些不需要。这一区别很重要，因为它决定了你能多快开始评估。

Label-free evaluation 使用 faithfulness 和 relevancy 等指标，只需要三个元素：query、retrieved context 和 generated response。除了你的文档和一组测试 query 之外，你不需要提前准备任何东西。这使它成为大多数项目的自然起点。你可以在几分钟内启动并获得有意义的评估指标。这种无标签 RAG 评估方法由 Es 等人在 RAGAS 框架中形式化提出，RAGAS: Automated Evaluation of Retrieval Augmented Generation（[doi.org/10.48550/ar…](https://doi.org/10.48550/arXiv.2309.15217)）。该研究展示了无需 ground-truth annotations，也可以有效衡量 faithfulness 和 relevancy 指标，而这正是我们将使用 LlamaIndex 内置 evaluators 采用的方法。

Labeled evaluation 用于 correctness 等指标，需要为每个 query 提供 ground-truth answers。它设置起来更费力，但会给你更强信号。它对于 regression testing 尤其有价值：一旦你建立了一组已知正确答案，每次更改 pipeline 配置时都可以重新运行评估，确保没有变差。

我的建议？

从使用 faithfulness 和 relevancy 的 label-free evaluation 开始。仅这两个指标就能暴露典型 RAG pipeline 中的大多数问题。随着应用成熟，并且你积累了一批经过验证的 query-answer 对，再逐步为最关键查询引入 correctness evaluation。你不需要一次做完所有事情。

还有一件值得一提的事：LlamaIndex 提供了一种方式，可以从你的 indexed documents 中自动生成 evaluation datasets。使用一个名为 `generate_question_context_pairs()` 的函数，你可以让 LLM 基于实际数据创建一组测试问题。这是一个非常棒的捷径，可以在不花几个小时手动写问题的情况下，快速启动评估数据集。如果你在使用该函数时遇到 import error，请通过运行以下命令确保你的 `llama-index-core` 包是最新的：

```css
pip install --upgrade llama-index-core
```

我会在下一节解释这个巧妙功能。

## 使用 LlamaIndex 内置模块进行评估

### 运行 evaluation 模块中的单个 evaluators

我们需要的一切都位于 `llama_index.core.evaluation` 中。下面快速概览一下我们将使用的主要类：

`FaithfulnessEvaluator`：检查响应是否忠实于检索上下文。返回 judge LLM 的通过/失败结果。这直接对应上一节讨论的 faithfulness 指标。

`RelevancyEvaluator`：验证在给定检索上下文的情况下，响应是否与原始 query 相关，并返回通过/失败结果。

`CorrectnessEvaluator`：将响应与参考答案进行比较，并返回从 1 最差到 5 最好的分数。默认情况下，4.0 或更高分数被视为通过。

`BatchEvalRunner`：使用异步执行，在多个 queries 上高效运行多个 evaluators。这是评估整个数据集，而不是一次只评估一个 query 的完美工具。

`generate_question_context_pairs`：这是一个很棒的 utility 组件，它使用 LLM 从你的 indexed documents 中自动生成测试问题。一个示例用例是，它可以省去你手写评估问题的工作。

让我们先探索如何单独使用 evaluators，然后再用 batch evaluation 进行扩展。

讲完这些后，让我们先构建一个小型 RAG pipeline，它索引一个示例合同文档，并回答关于其条款和义务的问题：

```ini
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
import models_config
from llama_index.llms.openai import OpenAI
from llama_index.core.evaluation import (
    FaithfulnessEvaluator,
    RelevancyEvaluator,
    CorrectnessEvaluator,
)

documents = SimpleDirectoryReader("files").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()

query = "What are the main obligations of the service provider?"
response = query_engine.query(query)
print(response)
```

注意，我们同时导入了 `models_config` 和 `OpenAI`。前者基本上会把默认 LLM 设置为 Gemma3:4B，后者是我们实例化 judge LLM，也就是 GPT-5.2 所需要的。输出应该类似下面这样：

```python
The service provider's main obligations include:

*   Providing Support Services as defined in the agreement, excluding specific items like software development, third-party system support, hardware procurement, and end-user training.
*   Maintaining a monthly Supported Systems availability of 99.5% or greater, excluding specific circumstances.
*   Responding to Incidents according to priority levels (P1, P2, P3, P4) with defined target resolution times.
*   Protecting Client's Confidential Information as outlined in the Confidentiality section, with exceptions for publicly available information, prior knowledge, information received without restriction, or disclosures required by law.
*   Complying with the terms of the agreement regarding fees, payment, and dispute resolution.
```

这是我们一直使用的相同 query engine 模式。现在，让我们引入 evaluators。

### 评估 faithfulness、relevancy 和 correctness

`FaithfulnessEvaluator` 类会检查响应是否基于检索上下文。

以下示例中使用的模型名称反映了写作时可用的模型。OpenAI 经常更新模型列表，因此如果你运行代码时某个模型名称不再可用，只需把它替换为当前可用模型即可。你可以在 [platform.openai.com/docs/models](https://platform.openai.com/docs/models) 找到最新可用模型。

我们用 judge LLM 创建 evaluator，并调用它的 `evaluate_response()` 方法：

```ini
judge_llm = OpenAI(model="gpt-5.2", temperature=0)
faithfulness_evaluator = FaithfulnessEvaluator(llm=judge_llm)
faith_result = faithfulness_evaluator.evaluate_response(
    response=response
)
print(f"Passing: {faith_result.passing}")
```

注意，我们只需要传入 `response` 对象。这是因为 `response` 已经包含生成文本，以及它所基于的 source nodes，也就是检索上下文。evaluator 会从这一个对象中提取所需的一切。这个代码片段的输出会是 `Passing: True` 或 `Passing: False`。在底层，生成文本可以通过 `response.response` 获取，它是一个普通字符串；而检索上下文存储在 `response.source_nodes` 中，它是一个 `NodeWithScore` 对象列表。如果你需要手动检查或提取上下文，这会很有用。

结果对象有两个关键属性。`passing` 属性是一个布尔值，`True` 表示响应是 faithful 的，`False` 表示 judge 检测到潜在幻觉。`feedback` 属性包含 judge 的原始裁决。对于 `FaithfulnessEvaluator`，这只是 `YES` 或 `NO`，因为底层 prompt 会直接询问 judge：响应是否受到上下文支持。如果你需要理解为什么某个响应失败，就必须自己检查检索上下文，并将其与响应比较。正如我们稍后将看到的，`CorrectnessEvaluator` 在推理解释方面会更慷慨。

```ini
relevancy_evaluator = RelevancyEvaluator(llm=judge_llm)
rel_result = relevancy_evaluator.evaluate_response(
    query=query,
    response=response
)
print(f"Passing: {rel_result.passing}")
```

这里的差异很细微但重要：除了 response，我们还传入 `query=query`。judge LLM 需要原始问题，才能判断答案是否真正回应了它。和 `FaithfulnessEvaluator` 一样，前面代码块的结果包含 `passing` 和 `feedback` 属性，feedback 同样是一个简单的 `YES` 或 `NO` 裁决。

`CorrectnessEvaluator` 类增加了第三个组成部分：你自己提供的参考答案。这就是我们前面讨论过的 labeled evaluation 方法：

```ini
correctness_evaluator = CorrectnessEvaluator(llm=judge_llm)
cor_result = correctness_evaluator.evaluate(
    query=query,
    response=str(response),
    reference="The service provider is obligated to deliver monthly reports, maintain uptime of 99.9%, and respond to support requests within 4 hours."
)
print(f"Score: {cor_result.score}")
print(f"Passing: {cor_result.passing}")
print(f"Feedback: {cor_result.feedback}")
```

```vbnet
Score: 2.0
Passing: False
Feedback: The answer is relevant to the question but contains significant errors and omissions: it omits the obligation to deliver monthly reports, gives the wrong availability target (99.5% vs reference 99.9%), and does not state the specified 4-hour response requirement (instead gives a generic priority-based response). It also adds extra contractual items (confidentiality, fees) not mentioned in the reference.
```

这里有几点需要注意。第一，我们使用的是 `evaluate()` 方法，而不是 `evaluate_response()`，因为我们传入的是原始字符串，而不是 `Response` 对象。第二，注意 `reference` 参数：这是 judge 将用于比较的 ground-truth answer。第三，结果包含一个从 1.0 到 5.0 的数值分数，而不是简单的通过/失败。默认情况下，4.0 或更高分数会被视为通过。

参考答案不需要和预期响应逐字一致，因为 judge LLM 能理解语义相似性。它只需要捕捉正确答案应该包含的核心信息。

### 生成合成评估数据集

在单个 query 上运行 evaluators，对于学习它们如何工作很有用；但真正价值来自于在一组测试问题上运行它们。问题是：这些问题从哪里来？

手写评估问题很乏味，而且很容易得到一个要么太小而没有意义，要么偏向于你预期系统擅长处理的问题类型的数据集。对于像我这样时间紧的人，LlamaIndex 提供了一个捷径：`generate_question_context_pairs()` 函数。这个小工具会遍历你的 indexed nodes，并要求 LLM 为每个文本 chunk 生成可由该 chunk 回答的问题。注意，在下面这个具体示例中，我使用的是本地 Gemma3:4B 模型，但和 LLM-as-a-judge 模式的例子一样，我建议为了获得最佳结果，使用能力更强的模型。

```python
from llama_index.core import SimpleDirectoryReader
from llama_index.core.evaluation import generate_question_context_pairs
from llama_index.core.node_parser import SentenceSplitter
import models_config

documents = SimpleDirectoryReader("files").load_data()
splitter = SentenceSplitter(chunk_size=512)
nodes = splitter.get_nodes_from_documents(documents)

qa_dataset = generate_question_context_pairs(
    nodes,
    num_questions_per_chunk=2
)

print(f"Generated {len(qa_dataset.queries)} questions")
for query_id, query_text in list(qa_dataset.queries.items())[:3]:
    print(f"  - {query_text}")
```

该函数会遍历每个 node，并要求 LLM 为每个 chunk 生成指定数量的问题。结果是一个 `EmbeddingQAFinetuneDataset` 对象，它包含一个 queries 字典，以及一个映射，说明哪些 nodes 作为上下文与每个 query 相关。正是这个映射让它不仅可用于 response evaluation，也可用于 retrieval evaluation，因为我们知道每个问题应该检索哪些 nodes。

从 `num_questions_per_chunk=1` 或 `2` 以及一小组 nodes 开始。生成问题涉及 LLM 调用，因此如果从大型文档集中生成数百个问题，可能会花一些时间；如果你不是依赖自托管模型，还会花钱。你总可以之后再生成更多。

### 使用 BatchEvalRunner 提升效率

在循环中一次运行一个 query 的 evaluators 会非常慢。每次评估都至少涉及一次 LLM 调用，也就是 judge。如果你用两个指标评估 50 个 queries，那就是 100 次 LLM 调用，而且是顺序运行。`BatchEvalRunner` 类通过异步并行运行评估来解决这个问题：

```ini
import asyncio
import models_config
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.evaluation import FaithfulnessEvaluator, RelevancyEvaluator
from llama_index.core.evaluation import BatchEvalRunner, generate_question_context_pairs
from llama_index.core.node_parser import SentenceSplitter

documents = SimpleDirectoryReader("files").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
splitter = SentenceSplitter(chunk_size=512)
nodes = splitter.get_nodes_from_documents(documents)

qa_dataset = generate_question_context_pairs(nodes, num_questions_per_chunk=2)
```

为了简单起见，这个示例使用我们的默认本地模型，但为了获得有意义结果，你应该像前面展示的那样传入一个更强 judge：

```ini
faithfulness_eval = FaithfulnessEvaluator()
relevancy_eval = RelevancyEvaluator()
```

在代码的第一部分，我们加载文档并处理 node splitting，随后生成 evaluation `qa_dataset` 对象。接下来是 batch evaluation 部分：

```ini
runner = BatchEvalRunner(
    {"faithfulness": faithfulness_eval,
     "relevancy": relevancy_eval},
    workers=8
)
eval_questions = list(qa_dataset.queries.values())

eval_results = asyncio.run(
    runner.aevaluate_queries(
        query_engine=query_engine,
        queries=eval_questions
    )
)
```

让我们拆解一下这里发生了什么。我们创建一个 `BatchEvalRunner` 实例，并传入一个字典，把 evaluation 名称映射到 evaluator 实例。`workers` 参数控制并发运行多少个 evaluations，8 是一个合理默认值，可以在速度与 API rate limits 之间取得平衡。然后我们调用 `aevaluate_queries()`，注意前缀 `a` 表示 async，并传入 query engine 和问题列表。runner 会处理一切：它查询 engine，收集 responses，并针对每个 response 并行运行每个 evaluator。

结果是一个以 evaluator 名称为 key 的字典，每个 value 都是一组 `EvaluationResult` 对象列表，每个 query 一个。接下来，我们计算一些聚合分数：

```python
faithfulness_score = sum(
    1 for r in eval_results["faithfulness"] if r.passing
) / len(eval_results["faithfulness"])

relevancy_score = sum(
    1 for r in eval_results["relevancy"] if r.passing
) / len(eval_results["relevancy"])

print(f"Faithfulness: {faithfulness_score:.1%}")
print(f"Relevancy:    {relevancy_score:.1%}")
```

我们的 evaluation pipeline 最终输出会类似下面这样：

```makefile
Faithfulness: 81.8%
Relevancy:    100.0%
```

由于 faithfulness 和 relevancy 返回通过/失败结果，我们计算通过 query 的百分比。约 0.8，也就是 81.8% 的 faithfulness 分数，意味着 10 个响应中有 8 个基于检索上下文，而 10 个中有 2 个可能包含幻觉信息。

### 解释结果并采取行动

数字只有在你知道如何使用它们时才有用。让我分享一些实践指导，用于解释评估分数并决定修复什么：

较低的 faithfulness 分数，低于 80%，表明 LLM 正在产生幻觉，也就是生成检索上下文中不存在的信息。这是一个 response generation 问题。在这种情况下，可以尝试几件事：调整 system prompt，明确指示 LLM 只能使用提供的上下文；切换到一个更有能力、能更可靠遵循指令的模型；或者检查检索上下文是否过于稀疏，以至于 LLM 只能填补空白。如果是这样，真正问题可能是 retrieval。

较低的 relevancy 分数，低于 80%，表明系统经常没有答到点上，也就是生成的答案没有回应用户问题。这可能由糟糕的 retrieval 导致，错误上下文被获取出来，引导 LLM 走偏；也可能是 prompt template 没有足够让 LLM 聚焦问题。先检查失败 queries 的检索上下文。本章“使用 LlamaIndex 的 instrumentation 模块追踪 RAG 工作流”一节中学到的 instrumentation 技能，会在这里成为你最好的朋友。

较低的 correctness 分数，平均低于 5 分中的 3.5，是一个更广泛信号，表示端到端 pipeline 没有生成准确答案。由于 correctness 同时依赖 retrieval 和 generation，你需要把它与 faithfulness 和 relevancy 结果交叉对照，以隔离根因。如果 faithfulness 和 relevancy 都很高，但 correctness 很低，问题可能是检索到的 nodes 根本不包含回答问题所需的信息。这可能表明你的 chunking 策略或文档覆盖需要改进。

## 构建一个简单的评估 pipeline

### 设置 instrumentation

在做任何其他事情之前，让我们先接入 instrumentation 模块，以便追踪 pipeline 内部发生了什么。我们将使用本章前面学到的内容：

```javascript
import models_config
import llama_index.core.instrumentation as instrument
from llama_index.core.instrumentation.span_handlers import SimpleSpanHandler

span_handler = SimpleSpanHandler()
dispatcher = instrument.get_dispatcher()
dispatcher.add_span_handler(span_handler)
```

通过这三行代码，pipeline 中的每个操作都会自动被追踪。我们会在第 5 步“分析并解释结果”中回到这些 trace 数据，当我们需要调试失败评估时使用它们。

### 构建 RAG pipeline

```ini
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter

documents = SimpleDirectoryReader("files").load_data()
splitter = SentenceSplitter(chunk_size=512)
nodes = splitter.get_nodes_from_documents(documents)
index = VectorStoreIndex(nodes)
query_engine = index.as_query_engine(similarity_top_k=2)
```

注意，我们明确设置了 `similarity_top_k=2`。这是一个有意选择。我们从相对较低的值开始，这样在第 4 步“运行 batch evaluation、改进并重新评估”中就有改进空间。可以把它看作有意留下一个之后可以旋转/调整的旋钮。

### 生成评估问题

对于 dataset generation，我们使用更具成本效益的 GPT-5-mini 模型，而不是 GPT-5.2。生成合成问题涉及许多 LLM 调用，每个 node 一次，因此在这里使用更小模型有助于降低成本。对于前面展示的实际 evaluation judgments，更强大的 GPT-5.2 更可取，因为准确评估需要更强推理。这是一种常见模式：用更便宜的模型处理批量生成任务，用更强模型处理质量关键的判断任务。

我们将为每个 node 生成两个问题，这应该会给我们一个合理的测试查询集合，并且我们会使用 OpenAI 的 GPT-5-mini 模型作为 judge：

```ini
from llama_index.core.evaluation import generate_question_context_pairs
from llama_index.llms.openai import OpenAI

judge_llm = OpenAI(model="gpt-5-mini", temperature=0)
qa_dataset = generate_question_context_pairs(
    nodes,
    llm=judge_llm,
    num_questions_per_chunk=2
)
eval_questions = list(qa_dataset.queries.values())
print(f"Generated {len(eval_questions)} evaluation questions")
```

这可能需要一两分钟，因为每个 node 都需要一次 LLM 调用。你可能也会看到 OpenAI API 返回一些 Too many requests 错误，因为我在这个简单示例中没有实现任何 throttling 机制。

如果你遇到 rate limit errors，可以尝试降低 `BatchEvalRunner` 中的 `workers` 参数，例如从 8 降到 4，或者在调用之间添加一个短暂的 `time.sleep()`。对于生产脚本，可以考虑使用 `tenacity` 这样的 backoff 库来自动处理 retry。

完成之后，看一看生成的一些问题。它们合理吗？看起来像真实用户可能提出的问题吗？这个快速 sanity check 可以避免你基于无意义问题进行评估。

### 运行 batch evaluation、改进并重新评估

问题准备好之后，让我们在整个数据集上运行 faithfulness 和 relevancy evaluation。由于 `BatchEvalRunner` 使用异步执行，我们会把初始 evaluation 和改进后的 re-evaluation 都包装在一个 async 函数中。

来看代码：

```ini
import asyncio
from llama_index.core.evaluation import (
    FaithfulnessEvaluator,
    RelevancyEvaluator,
    BatchEvalRunner,
)
faithfulness_eval = FaithfulnessEvaluator(llm=judge_llm)
relevancy_eval = RelevancyEvaluator(llm=judge_llm)
runner = BatchEvalRunner(
    {"faithfulness": faithfulness_eval,
     "relevancy": relevancy_eval},
    workers=8
)
async def run_evaluations():
    eval_results = await runner.aevaluate_queries(
        query_engine=query_engine,
        queries=eval_questions
    )
```

```ini
improved_qe = index.as_query_engine(similarity_top_k=5)
    improved_results = await runner.aevaluate_queries(
        query_engine=improved_qe,
        queries=eval_questions
    )
    return eval_results, improved_results
 eval_results, improved_results = asyncio.run(run_evaluations())
```

运行需要一点时间，因为每个问题都涉及查询我们的 RAG pipeline，并运行两次 evaluation LLM 调用，而且我们做了两轮。有 8 个 workers 并行运行时，对于我们的示例数据集来说，应该仍然能在几分钟内完成。

### 分析并解释结果

现在该看看我们做得怎么样：

```scss
faith_results = eval_results["faithfulness"]
rel_results = eval_results["relevancy"]
 faith_score = sum(1 for r in faith_results if r.passing) / len(faith_results)
rel_score = sum(1 for r in rel_results if r.passing) / len(rel_results)
print(f"Faithfulness: {faith_score:.1%}")
print(f"Relevancy:    {rel_score:.1%}")
print("\nFailing queries:")
for i, (fr, rr) in enumerate(zip(faith_results, rel_results)):
    if not fr.passing or not rr.passing:
        failed = []
        if not fr.passing:
            failed.append("Faithfulness")
        if not rr.passing:
            failed.append("Relevancy")
        print(f"  Query {i}: {eval_questions[i][:80]}.")
        print(f"    Failed: {', '.join(failed)}")
```

此时，具体数字会因生成的 nodes 和 questions 而变化，但你可能会看到类似下面这样的输出：

```yaml
Faithfulness: 85.0%
Relevancy:    70.0%

Failing queries:
  Query 3: What specific penalties are mentioned for late delivery of.
    Failed: Relevancy
  Query 7: What are the data protection obligations outlined in.
    Failed: Faithfulness, Relevancy
  Query 12: How does the agreement address force majeure events.
    Failed: Relevancy
```

有意思！Faithfulness 是 85.0%，还不错，但仍有提升空间。Relevancy 是 70.0%，明显更低。在这个案例中，看失败 queries，会发现一种模式：几个失败都涉及特定主题的问题，例如 penalties、data protection、force majeure，这些相关信息很可能存在于文档中，但没有出现在 top 2 检索 nodes 中。

```css
for span in span_handler.completed_spans:
    if "retrieve" in span.id_.lower():
        print(f"Retrieval span: {span.id_}")
        print(f"  Duration: {span.duration}")
```

traces 证实了 evaluation results 暗示的问题：对于失败 queries，retriever 返回的 nodes 根本不包含相关信息。由于 `similarity_top_k=2`，我们只查看最相似的两个 nodes，而答案有时存在于第 3 或第 4 个 node 中。

### 比较改进效果

```python
new_faith_score = sum(1 for r in improved_results["faithfulness"]
                      if r.passing) / len(improved_results["faithfulness"])
new_rel_score = sum(1 for r in improved_results["relevancy"]
                    if r.passing) / len(improved_results["relevancy"])

print(f"BEFORE -> AFTER")
print(f"Faithfulness: {faith_score:.1%} -> {new_faith_score:.1%}")
print(f"Relevancy:    {rel_score:.1%} -> {new_rel_score:.1%}")
```

你的结果将取决于具体文档、生成的问题以及你使用的 judge 模型。例如，一份合同密集型文档会产生与技术手册不同的问题类型；更强的 frontier judge model 会比小模型给出更一致的分数；甚至具体生成出来的问题也会在不同运行之间变化，因为它们取决于 LLM 关注哪些 nodes。你可能看到明显提升，完全没有变化，或者也许令人意外地看到分数变差。这三种结果都具有信息量。

为了做一致比较，你应该只生成一次评估问题，把它们保存下来，并在所有实验中复用同一组问题。如果你在每次运行之间重新生成问题，就同时改变了两个变量，也就是 pipeline 配置和测试集，这会让你无法知道分数差异到底由什么导致。

在前面的代码中，我们在第 3 步生成一次数据集，并在两次评估中复用 `eval_questions`，这正是正确做法。如果 relevancy 改善了，说明正确 nodes 只是刚好在 top 2 之外，引入更多上下文帮助 LLM 生成更好的答案。如果没有变化，说明问题在别处。这些是最常见解释，但其他因素也可能发挥作用。例如，embedding 模型可能无法很好捕捉领域特定术语，或者 chunk 边界可能把关键信息拆分到两个 nodes 中。本章前面的 instrumentation 技术可以帮助你缩小原因范围。也许生成的问题指向的信息根本不在源文档中，或者 nodes 与问题表述方式对齐得不好。

那么，如果增加 `similarity_top_k` 后 relevancy 反而下降呢？

这也可能发生。检索更多 nodes 时，你也会拉入更多噪声，也就是有点相关但并不真正回答问题的上下文。然后 LLM 必须在一个更大、更不聚焦的 passage 集合中做筛选，它可能会被额外上下文分散注意力，而不是被帮助。这是 RAG 系统中一个众所周知的权衡：更多上下文并不总是更好的上下文。如果你看到这种模式，这是一个强信号，说明你应该探索 re-ranking，而不是简单增加检索 nodes 数量。re-ranking 是解决这一问题的有效手段。

欢迎来到系统化评估的现实：数字并不总是朝你预期的方向移动，而这正是过程的一部分。价值在于快速排除可能性，并让数字指导你的下一步，而不是靠猜。根据你看到的结果，下一个实验可能是尝试不同 chunk size、添加 re-ranker、修改 system prompt，或者更仔细地检查失败 queries，理解它们有什么共同点。

这个过程正是我们在本章开头介绍的反馈循环：evaluate → trace → identify → hypothesize → test → learn。有时学到的是“这招有效！”。有时学到的是“这让事情变糟了，但现在我知道为什么”。两者都是进展。现在，你已经拥有了在自己项目中运行这个循环所需的所有工具。当你把这些工具和技能带入自己的项目时，请记住，评估不是最后才做的一次性任务。它是一种持续实践，应该伴随你对 pipeline 做出的每一次修改。本章讲到的工具已经足够让你起步。随着应用复杂度增加，你可能想探索 Phoenix、Langfuse 或 DeepEval 等第三方可观测性和评估平台，它们以生产级 dashboards、历史追踪和更高级指标扩展了这些相同概念。但你在这里学到的基础会直接迁移过去。

增加 `similarity_top_k` 只是众多可能改进之一。其他可实验内容包括：改变 `SentenceSplitter` 中的 chunk size，为文档添加 metadata 以改善 retrieval，修改 system prompt 以减少幻觉，尝试不同 embedding 模型，或者使用 re-ranker。每次改动都可以通过重新运行同一个 evaluation pipeline 来客观衡量。

在结束本章之前，我鼓励你进一步实验这个 pipeline。下面有几个练习，可以加深你的理解：

Exercise 1：尝试把 `chunk_size` 从 512 改为 256 或 1024，并重新运行评估。对于你的具体文档，更小或更大的 chunks 是否会产生影响？你观察到什么样的差异？

Exercise 2：把 `CorrectnessEvaluator` 添加到 batch runner 中。你需要为生成问题中的一部分手写几个参考答案。比较 correctness 告诉你的信息，与 faithfulness 和 relevancy 已经揭示的信息之间有什么不同。

Exercise 3：把同一个 evaluation pipeline 应用到 Contract Review Expert 项目，或前面讲过的某个示例，例如 re-ranker 或 agent。这些更复杂设置的得分如何？

## 总结

随后，我们为 RAG 评估建立了扎实的概念基础。我们学会从两个维度思考质量，也就是 retrieval 和 response generation，并逐一了解关键指标：faithfulness、relevancy 和 correctness。我们讨论了 LLM-as-a-judge 模式，然后使用 LlamaIndex 内置 evaluation 工具将这些概念付诸实践。我们用 `FaithfulnessEvaluator`、`RelevancyEvaluator` 和 `CorrectnessEvaluator` 评估单个 queries，用 `generate_question_context_pairs()` 生成合成测试数据集，并用 `BatchEvalRunner` 高效扩展评估。

在下一章中，我们会把注意力转向另一个提升 RAG 性能的强力杠杆：prompt engineering。你将学习如何检查、定制和优化 LlamaIndex 在幕后使用的 prompts。正如你将看到的，本章中的评估技能，对于衡量你的 prompt 修改是否真的有效，是必不可少的。

