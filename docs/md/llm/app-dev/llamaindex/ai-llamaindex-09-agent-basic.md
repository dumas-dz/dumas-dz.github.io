---
title: LlamaIndex - 基础智能体架构
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - Agent
---

---

本章详解 LlamaIndex 的对话系统：ChatEngine 模式（Simple、Context、Condense Question 等）、FunctionAgent 与 ReActAgent 两种智能体范式，以及工具和对话记忆机制。

## 技术要求

示例代码需要以下 LlamaIndex 集成包：

- Database Tool：[pypi.org/project/lla…](https://pypi.org/project/llama-index-tools-database/)

## 从聊天机器人到 RAG 驱动的对话

在现代商业生态系统中，聊天机器人系统的角色变得越来越重要。聊天机器人最早出现在 20 世纪 60 年代：[en.wikipedia.org/wiki/ELIZA](https://en.wikipedia.org/wiki/ELIZA)，并且一直让开发者和技术用户都感到着迷。图 9.1 展示了这些早期系统之一的用户界面：

**图 9.1 —— ELIZA 聊天机器人界面**

基于聊天机器人的支持系统，为今天的消费者提供了自助服务体验。对用户来说，自助支持相比人工支持有两个主要优势：

- 它们全天候可用，包括正常工作时间之外
- 用户不需要一直在线等待才能访问它们

即使用户一开始不愿意使用这些系统，但一旦开始与它们互动，并体验到它们的优势，他们通常会很快适应。

例如，ChatOps 是现代组织越来越多采用的一个概念：[www.ibm.com/blog/benefi…](https://www.ibm.com/blog/benefits-of-chatops/%E3%80%82)

ChatOps 指的是将聊天平台与运营工作流集成的能力，促进团队成员、流程、工具和自动化机器人之间的透明协作，从而提升服务可靠性、加快恢复速度，并增强协作生产力。

基于对话驱动协作的思想，ChatOps 模型通过使用聊天机器人简化并加速团队成员之间的交互，从而融入 DevOps 原则：[en.wikipedia.org/wiki/DevOps…](https://en.wikipedia.org/wiki/DevOps%E3%80%82)

无论我们将聊天机器人用于内部沟通，还是用于与用户互动，只有当它们能够解决真实问题时，才可以被认为是有效的。这取决于它们对交互上下文的理解程度，以及它们提供的答案有多相关。

**图 9.2 —— ChatOps 范式**

一开始，聊天机器人的主要局限来自于与用户交互的方式僵硬且不自然。早期系统依赖关键词匹配和脚本化决策树，因此用户必须猜出正确措辞，才能获得有用响应。随着 NLP 技术的发展，最近它们的主要短板已经变成缺乏与组织知识库的集成。

毕竟，如果系统给出的答案无法有效解决用户请求，那么自然的沟通体验又有什么用呢？

这就把我们带到了 RAG。

## 发现 ChatEngine

在前几章中，我们看到了如何构建 query engine，以基于我们的数据运行查询。这一机制允许我们同时集成多种类型的索引、retriever、节点后处理器和响应合成器，从而能够以多种方式访问我们的专有数据。不幸的是，`QueryEngine` 类并不提供任何保存对话历史的机制。这意味着每次查询都是一次独立交互，并没有上下文记忆来支持真正的对话。

在最简单形式下，chat engine 可以像这样基于一个索引初始化：

```ini
chat_engine = index.as_chat_engine()
response = chat_engine.chat("Hi, how are you?")
```

初始化之后，可以使用多种方法查询 chat engine：

**chat()** ：这个方法启动一个同步聊天会话，处理用户消息并立即返回响应。

**achat()** ：这个方法类似于 `chat()`，但会异步执行查询，允许同时处理多个请求。例如，在 Web 或移动应用中，如果我们不希望服务器查询期间阻塞主线程，它会很有用。

**stream_chat()** ：这个方法打开一个流式聊天会话，响应可以在生成过程中逐步返回，以支持更动态的交互。对于需要大量处理时间的长响应或复杂响应，这尤其有用，因为用户可以在全部处理完成之前，先看到部分响应。

**astream_chat()** ：这是 `stream_chat()` 的异步版本，允许我们在异步上下文中处理流式交互。

与 chat engine 交互的另一个选项，是使用 `ChatEngine` 启动一个 Read-Eval-Print Loop，也就是 REPL 循环：

```scss
chat_engine.chat_repl()
```

REPL chat 类似于 ChatGPT 界面，用户发送消息或问题，LLM 处理输入，生成响应，然后立即展示给用户。只要用户持续提供输入，这个循环就会持续下去，形成交互式对话。

要重置聊天对话，可以使用以下命令：

```scss
chat_engine.reset()
```

在更深入讨论 chat engines 之前，我们需要理解 LlamaIndex 中如何管理聊天记忆。

## 理解 chat engine 如何维护对话历史

默认情况下，`ChatEngine` 会将对话保存在内存中。这非常适合快速运行，但进程结束后历史就会消失。为了让对话可以跨重启持久化，我们可以使用 `SimpleChatStore` 作为持久化层，它会按照 `session_id` 保存和恢复 `ChatMessage` 对象列表。下面是一个实际示例：

```ini
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.chat_engine import SimpleChatEngine

SESSION_ID = "user_X"
STORE_PATH = "chat_memory.json"

try:
    chat_store = SimpleChatStore.from_persist_path(persist_path=STORE_PATH)
except FileNotFoundError:
    chat_store = SimpleChatStore()
```

第一部分会尝试从磁盘加载 store，如果文件存在；否则，就创建一个新的 store。在后台，`SimpleChatStore` 知道如何序列化 / 反序列化你的聊天日志，并且会通过 session key 将不同对话分开组织。

这里我们获取该 session 之前保存过的消息。如果还没有保存过任何内容，它就只是一个空列表：

```ini
seed_history = chat_store.get_messages(SESSION_ID)
```

接下来，我们使用默认设置初始化一个新的 chat engine 实例。这个 engine 会负责与 LLM 交互，并在当前运行期间，也就是内存中，维护对话：

```ini
chat_engine = SimpleChatEngine.from_defaults()
```

这样，我们就创建了一个基础 chat engine。它会为本次运行维护一个 turns 列表，但本身不会持久化这些内容。现在我们可以运行实际对话循环。在第一轮中，我们注入任何已保存历史，让 engine 从上一次 session 停止的位置继续：

```ini
first_turn = True
while True:
    user_message = input("You: ")
    if user_message.lower() == "exit":
        break
    if first_turn and seed_history:
        response = chat_engine.chat(user_message, chat_history=seed_history)
        first_turn = False
    else:
        response = chat_engine.chat(user_message)
    print(f"Assistant: {response}")
```

在第一轮中，我们用之前的消息为 engine 提供初始历史，让它记住你上次停在哪里。之后，你只需要正常调用 `chat()`，engine 会持续将新 turns 追加到内存历史中。

```ini
chat_store.set_messages(SESSION_ID, chat_engine.chat_history)
chat_store.persist(persist_path=STORE_PATH)
```

将 chat engine 与 `SimpleChatStore` 结合使用非常适合入门，但你可能已经看到它有一些限制。随着 transcript 变长，传入完整历史可能会超过模型上下文窗口。如果进程在保存之前崩溃，你会丢失当前运行中尚未保存的 turns。而且，由于历史只是一个扁平消息列表，没有摘要、没有提取事实，也没有检索，随着对话变长，聊天机器人的关注点可能会漂移。

本章稍后我们会探索一种更好的方法来处理这些问题，也就是更高级的 Memory 系统。它增加了 token-aware 的短期队列、长期 blocks，例如事实、静态备注、向量召回，以及持久化的数据库后端存储。

选择正确 chat mode，是设计对话界面时最有影响的决策之一。它决定你的聊天机器人只是复述 LLM 的通用知识，还是会真正基于你的专有数据回答。让我们探索可用选项。

## 理解不同 chat modes

LlamaIndex 提供了几种 chat engine modes，每种模式都实现一种不同的对话处理策略。有些只是将消息转交给 LLM，另一些会从你的数据中检索上下文，或将对话历史压缩成聚焦查询。

创建 chat engine 有两种方式。最简单的方式是从现有索引创建，通过向 `as_chat_engine()` 传入 `chat_mode` 参数。这会告诉 LlamaIndex 你想要哪种聊天行为，然后它会自动为你设置好。另一种方式是直接创建特定 chat engine 类，例如 `SimpleChatEngine`，就像我们刚才在“理解 chat engine 如何维护对话历史”一节中看到的那样。第二种方式给你更多控制能力，可以细调 prompts 或对话历史的处理方式。

## Simple mode

**图 9.3 —— SimpleChatEngine**

用户在这种模式下的体验，由 LLM 固有能力和限制决定，例如上下文窗口大小和整体性能。

要初始化这种模式，可以使用以下代码：

```java
import models_config
from llama_index.core.chat_engine import SimpleChatEngine

chat_engine = SimpleChatEngine.from_defaults()
chat_engine.chat_repl()
```

你可以选择传入 `system_prompt` 参数，例如用于定义助手行为。我们也可以用 `llm` 参数定制 LLM。如果没有显式传入 LLM，engine 会使用全局 `Settings.llm` 配置。在我们的示例中，因为导入了 `models_config` 工具，所以 chat engine 会使用 `Gemma3:4b` 模型。

由于在 RAG 设计中你大概率不会太常使用这种简单模式，让我们转向更高级的可用选项。

## Context mode

`ContextChatEngine` 被设计用于利用专有知识增强聊天交互。它会基于用户输入从索引中检索相关文本，将这些检索到的信息整合进 system prompt 中以提供上下文，然后在 LLM 帮助下生成响应。

**图 9.4 —— ContextChatEngine**

这个 chat engine 有几个可以定制的参数：

**retriever**：实际使用的 retriever，用于根据用户消息从索引中检索相关文本。当 chat engine 直接从索引初始化时，它会使用该特定索引类型的默认 retriever。

**llm**：LLM 实例，用于生成响应。如果省略，engine 会使用全局配置的 `Settings.llm`。

**memory**：一个 `ChatMemoryBuffer` 对象，用于存储和管理聊天历史。正如我在 `SimpleChatEngine` 中已经解释过的，`ChatMemoryBuffer` 已经废弃，未来很可能被 `Memory` 类替代。

**chat_history**：这是一个可选的 `ChatMessage` 实例列表，表示对话历史。它可用于保持对话连续性。这个历史包括聊天会话中交换过的所有消息，包括用户消息和聊天机器人消息。例如，它可以用于从某个点继续对话。`ChatMessage` 对象包含三个属性：

- **role**：默认是 `user`
- **content**：实际消息内容
- 通过 `additional_kwargs` 提供的任何可选参数

**prefix_messages**：一个 `ChatMessage` 实例列表，可以在实际用户消息之前用作预定义消息或 prompts。这对于设置特定语气或聊天上下文很有用。

**node_postprocessors**：一个可选的 `BaseNodePostprocessor` 实例列表，用于进一步处理 retriever 检索到的节点。如果需要，可以用它实现 guardrails、从上下文中清洗敏感信息，或对检索节点做任何其他调整。

**context_template**：一个可选字符串或 `PromptTemplate`，也就是带有命名变量的可复用文本或聊天 prompt，用于在发送给 LLM 前格式化上下文。

**context_refine_template**：一个可选字符串或 `PromptTemplate`，用于在检索到额外上下文时 refine 模型答案。如果未提供，则内部使用默认 refine template。

**callback_manager**：一个可选的 `CallbackManager` 实例，用于管理聊天过程中的 callbacks。这对 tracing 和 debugging 很有用。

**system_prompt**：一个可选字符串，用作 system prompt，为聊天机器人提供初始上下文或指令。

在内部，`ContextChatEngine` 使用 `CompactAndRefine` 响应合成器。这一机制会先构建包含检索上下文的 prompt，然后可选地使用 refine template 优化答案。结果是一个连贯、基于事实 grounding 的响应，可以在必要时整合多个检索片段。

这个类完整支持 `achat`、`astream_chat` 和 `stream_chat`，它们的行为与 `chat()` 相同，但允许异步和流式交互。

要实现 `ContextChatEngine`，我们必须加载数据并构建索引，然后根据需要用不同参数配置 chat engine。

下面是一个基于示例数据文件的快速示例，这些文件可以在本书 GitHub 仓库的 `ch9/files` 子文件夹中找到：

```ini
import models_config
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

docs = SimpleDirectoryReader(input_dir="files").load_data()
index = VectorStoreIndex.from_documents(docs)

chat_engine = index.as_chat_engine(
    chat_mode="context",
    system_prompt=(
        "You're a chatbot, able to talk about "
        "general topics, as well as answering specific "
        "questions about ancient Rome."
    ),
)

chat_engine.chat_repl()
```

在这个示例中，我们从索引初始化了 `chat_engine`。另一种方式是，我们也可以独立定义它，并将 retriever 作为参数提供，如下：

```ini
retriever = index.as_retriever(retriever_mode='default')
chat_engine = ContextChatEngine.from_defaults(
    retriever=retriever
    )
```

因为 engine 会先从索引中检索上下文，并使用它来生成响应，所以对于希望从索引数据中获取具体信息的用户来说，这种方法会让聊天体验有用得多，也自然得多。

## Condense question mode

`CondenseQuestionChatEngine` 会先借助 LLM，将对话和最新用户消息压缩成一个独立问题，从而简化用户交互。这个独立问题试图捕捉对话中的关键元素，然后会被发送给建立在专有数据之上的 query engine 以生成响应。

使用这种方法的主要好处是，它可以让对话始终聚焦于主题，并在每次交互中保留整个对话的关键点。它始终会在专有数据上下文中响应。

**图 9.5 —— CondenseQuestionChatEngine**

最终响应来自检索到的专有数据，而不是直接来自 LLM，这一点有时也可能成为缺点。这种 chat mode 可能难以处理更一般的问题，例如关于之前交互的询问，因为它每次响应都依赖查询知识库。

在设计生产系统时，请记住下面这一点。当用户只是说 “How are you?” 或 “Thanks for the help” 时，如果 LLM 被迫将其重写成一个独立问题，然后再查询知识库，就会浪费 token 并增加延迟。一种实用处理方式，是在 chat engine 前放一个轻量 intent classifier 或 router。这样，我们就可以检测用户消息是真正的搜索查询，还是普通对话寒暄。非搜索消息可以直接路由到简单 LLM 响应，完全绕过 condense 逻辑。

**query_engine**：这是用于查询压缩后问题的 `BaseQueryEngine` 实例。这里可以使用任何类型的 query engine，包括具有 routing 功能的复杂结构。

**condense_question_prompt**：这是一个 `PromptTemplate` 实例，用于将对话和用户消息压缩成一个单独的独立问题。

**memory**：一个 `ChatMemoryBuffer` 实例，用于管理和存储聊天历史。

**llm**：语言模型实例，用于生成压缩后的问题。

**verbose**：一个布尔标志，用于在运行期间打印详细日志。

**callback_manager**：一个可选的 `CallbackManager` 实例，用于管理 callbacks。

要实现这个 chat engine，通常要用 query engine 初始化它，并可选择配置自定义参数。对话会使用一个预定义 template 压缩成问题，这个 template 可以通过 `condense_question_prompt` 参数定制。生成的问题随后会发送给 query engine。不同于其他 chat engines，`CondenseQuestionChatEngine` 不支持 `system_prompt` 或 `prefix_messages`。

如果没有提供自定义 `condense_question_prompt`，engine 会使用内置默认 template，将最新用户消息改写成一个自包含问题，并纳入相关对话上下文。为了让你更好理解其工作方式，下面是实际 prompt：

```ini
DEFAULT_TEMPLATE = """Given a conversation (between Human and Assistant) and a follow up message from Human, rewrite the message to be a standalone question that captures all relevant context from the conversation."""
```

下面是一个简短实现示例：

```ini
import models_config
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.chat_engine import CondenseQuestionChatEngine
from llama_index.core.llms import ChatMessage

documents = SimpleDirectoryReader("files").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine=index.as_query_engine()

chat_history = [
    ChatMessage(
        role="user",
        content="Arch of Constantine is a famous"
        "building in Rome"
    ),
    ChatMessage(
        role="user",
        content= "I'm not interested in the Pantheon."
    ),
]
```

在代码第一部分中，我们摄取示例文件，创建索引，然后创建一个简单 query engine。接着，我们通过创建由两个 `ChatMessage` 对象组成的 chat history，引入之前的对话上下文。具体来说，我们指示 chat engine 不要将 Pantheon 视为著名建筑。

```ini
chat_engine = CondenseQuestionChatEngine.from_defaults(
    query_engine=query_engine,
    chat_history=chat_history
)

response = chat_engine.chat(
    "What are the most famous structures in ancient Rome?"
)

print(response)
```

- `CondenseQuestionChatEngine` 接收用户消息和提供的 chat history，并将它们压缩成独立问题。这个过程涉及使用 LLM 和 `condense_question_prompt` 生成一个问题，该问题概括了对话上下文和用户最新查询的核心。
- 然后，engine 将这个压缩后的问题转发给 query engine，后者会在索引数据中搜索相关信息。
- query engine 能够访问来自 `VectorStoreIndex` 的信息，会处理这个问题并返回答案。这个答案反映了之前对话的整体上下文，以及关于古罗马著名建筑的具体查询。

如果没有添加 chat history，示例输出可能类似如下：

```erlang
The Colosseum and the Pantheon.
```

```sql
The Colosseum and the Arch of Constantine are two famous buildings in ancient Rome.
```

初始化这个 chat engine 的另一种方式，是直接从索引初始化：

```ini
index.as_chat_engine(chat_mode="condense_question")
```

我们接下来要讨论的 chat mode 会混合两种方法。

## Condense and context mode

`CondensePlusContextChatEngine` 通过结合压缩问题和上下文检索的优势，提供了更全面的聊天交互。

前面讨论的 chat engine 更直接，专注于将对话简化成一个问题来生成响应；而 `CondensePlusContextChatEngine` 会额外走一步，从索引数据中检索额外上下文来丰富对话，从而带来更详细、更具上下文感知能力的响应。在幕后，`CondensePlusContextChatEngine` 使用 `CompactAndRefine` 响应合成器，将来自多个检索节点的信息合并并打磨，生成更流畅、更完整的答案。

**图 9.6 —— CondensePlusContextChatEngine**

首先，这个 engine 会将对话和最新用户消息压缩成一个独立问题。然后，它使用这个压缩后的问题从索引中检索相关上下文。最后，它同时使用检索到的上下文和压缩后的问题，让 LLM 生成响应。

下面是 `CondensePlusContextChatEngine` 的一些关键参数：

**retriever**：用于基于压缩后的问题获取上下文。

**llm**：用于生成压缩问题和最终响应的 LLM。

**memory**：一个 `ChatMemoryBuffer` 实例，用于存储和管理聊天历史。

**context_prompt**：用于在 system prompt 中格式化上下文的 prompt template。它会基于检索上下文构建初始答案。

**context_refine_prompt**：如果有更多上下文可用，这个 prompt 会 refine 或扩展答案。

**condense_prompt**：用于将对话压缩成独立问题的 prompt。

**system_prompt**：包含聊天机器人指令的 prompt。

**skip_condense**：一个布尔标志，用于完全跳过压缩步骤。当设置为 `True` 时，engine 会跳过第一次 LLM 调用，并将用户消息直接传给检索和合成阶段，实际上表现得像 `ContextChatEngine`。这在对话第一轮时很有用，因为没有历史需要压缩；或者当你知道用户消息已经是自包含时也很有用，可以节省一次完整 LLM 往返。

**node_postprocessors**：可选的 `BaseNodePostprocessors` 列表，用于进一步处理检索到的节点。

**callback_manager**：和往常一样，可用于管理 callbacks。

**verbose**：一个布尔标志，用于在运行期间启用详细日志。

要从索引构建这种特定 chat engine，可以使用以下命令：

```ini
index.as_chat_engine(chat_mode="condense_plus_context")
```

好了，是时候探索更高级的 chat modes 了。

## 在应用中实现智能体策略

名字叫 Bot，Chat Bot。

在本章开头，我们讨论了 ChatOps 模型日益增长的流行度。这个模型基于人类操作员群体与 AI agents 之间的互动。AI agents 可以理解讨论上下文，回答问题并执行某些功能，从而为其服务群体扮演虚拟助手角色。

你可能已经意识到，我们目前讨论的 chat engine 模型只能回答问题，不能执行函数，也不能以只读之外的方式与后端数据交互。

对于这些使用场景，我们需要 agents。

agent 与简单 chat engine 的主要区别在于，agent 基于推理循环运行，并且手头有多个工具。毕竟，如果没有 Q 总是提供的那些小工具，Bond 又会是谁呢？

聊天机器人对话；智能体决策并行动。

不同于简单聊天机器人，后者最多只能直接借助 LLM 或从知识库中提取专有数据来回答问题，agents 强大得多，并且能处理复杂得多的场景。这让它们在业务语境中更有实用价值，因为由 AI 增强的人类互动正变得越来越普遍。

## 理解 agent chat memory 如何工作

在任何智能体系统中，memory 都是决定聊天机器人和 agents 在对话中实际表现的关键组件。在本章开头，我们看到了一个非常简单的实现，将 `SimpleChatStore` 与 `ChatEngine` 结合使用。虽然这对于仅使用 chat engine 的简单实验可能足够，但 agents 需要更复杂的方法。

在 LlamaIndex 中，`Memory` 类将短期上下文管理为有限数量的最近消息，同时也通过模块化、可连接的 memory blocks 支持长期上下文。你可以把 memory blocks 想象成存储对话前面片段的小型档案库。随着对话流动，旧消息会自动转移到这些 blocks 中，然后短期和长期上下文会被重新引入 prompt。这样，agent 的响应保持相关，我们也避免了那种熟悉的“失忆感”，而这种体验可能严重损害用户体验并影响对话质量。

较旧的实现 `ChatMemoryBuffer` 现在已经废弃。`Memory` 是现代且更通用的实现。随着助手从简单聊天机器人演进成完整智能体系统，它帮助我们维持对话上下文和质量。

## 理解短期记忆如何工作

为了实现短期记忆，`Memory` 类维护一个 First-In-First-Out（FIFO）队列，其中保存最近消息。这个队列长度受总 token 预算限制，而这个预算必须考虑 LLM 的最大上下文窗口。有两个设置控制短期记忆的行为：

**token_limit**：`Memory` 可以贡献给 prompt 的总体上限，包括短期和长期。

**chat_history_token_ratio**：为短期聊天历史保留的预算比例。当 live queue 超过这个比例时，`Memory` 会将最旧 turns flush 到 memory blocks 中。

当 memory flushes 时，它并不是随机派发消息。它会按你通过 `token_flush_size` 参数设置的大小移除旧对话片段，而且会感知 turn：它总是尝试在自然边界切分，因此至少保留一个完整的 user-assistant 交换。

可以把它想象成在段落末尾修剪，而不是在句子中间切断。如果聊天太长，最旧的完整 turns 会先被移出去，留下最近的来回交互保持完整。这让模型注意力集中在刚刚发生的事情上，同时防止 prompt 悄悄超过模型上下文窗口。

示例：如果最后三轮对话都很相关，并且你触发限制，`Memory` 会将更早 turns 推到长期存储中，并完整保留这三轮，而不是把某个 turn 切成两半。

## 理解长期记忆如何实现

当消息从短期记忆中 flush 出来时，它们会被传给你配置的 memory blocks。这些是小型可插拔模块，用于保留或转换过去上下文。我们有三种预定义 memory block 类型：

**StaticMemoryBlock**：这就像助手的一张始终开启的便利贴。它保存永远不应该忘记的事情，例如用户是谁、你想保持的品牌语气、必须遵守的政策等，并且每轮都会把这些信息放入 prompt。你可以把它想象成显示器上的便利贴，上面写着：叫我 Dana，答案保持简洁，不要注释代码。因为它应该始终存在，我们通常将这个 block 的 `priority` 参数设为 `0`，这样 prompt 紧张时它也不会被修剪。

**FactExtractionMemoryBlock**：这像是一封长讨论结束后到达的会议纪要邮件。当旧消息从短期记忆中滚出时，这个 block 会扫描它们，并将重要信息，例如偏好、决策、定义等，提炼成紧凑 facts。如果积累太多，它会总结这些 facts，为新洞察腾出空间。随着时间推移，它会累积类似 `User's time-zone is Europe/Bucharest`、`Prefers Python for code` 或 `Uses Qdrant for vectors` 这样的陈述，使助手可以从之前对话停止的地方继续，而不必重新阅读整段 transcript。

**VectorMemoryBlock**：这像一个可搜索档案库。它不会总结，而是将 flush 出来的消息批次存储到 vector database 中，并在你提出新问题时检索最相关区域。可以把它想象成一个图书管理员，可以立即找到“我们调试 OAuth callback 的那条线程”，即使你不记得确切措辞。当你问 `Remind me how we configured rate limiting last week?` 时，它会检索之前的交流，并把那些内容重新送入 prompt，让答案反映你当时实际采取的步骤。

每种 memory block 类型都接受 `priority` 参数。这个参数控制在组装 prompt 时，如果组合上下文超过 token 限制，哪些长期 memory blocks 会被缩短或省略：`0` 表示永不裁剪；在其他 blocks 中，如果组合上下文超过 token 限制，数字较低的会先被裁剪。为了让所有内容保持在 token 预算内，算法会先要求较低优先级 block 自行截断。如果 token 预算仍然超出，则完全移除较低优先级 blocks，而 priority 0 blocks 永远不会被截断。

### 为什么有三种不同类型的 memory blocks？

在实践中，这三种 memory blocks 彼此互补。Static memory 用不可协商数据锚定对话；fact extraction 以紧凑形式捕获不断演化的事实；vector memory 则在需要准确历史上下文时保留丰富细节。我们可以通过分配 priorities 控制哪些内容在 token 预算紧张时幸存下来：将必须保留的 notes 设置为最高优先级；必要时允许 fact list 缩小；如果空间不足，先丢弃长片段。最终得到的是一个能记住关键内容、召回有用内容，并保持在模型上下文限制内的助手。

对话期间，在组装 prompt 上下文时，`Memory` 会收集当前短期队列，以及现有 memory blocks 中任何相关输出，并通过 template 格式化。然后，它会根据你选择的 `insert_method`，将结果注入 prompt，要么注入 system message，要么注入最新 user message。`insert_method` 参数控制 memory 放在哪里。当你希望 memory context 被模型视为稳定指令时，选择 `"system"`；当你希望它附加到最新用户 turn 中，像用户提供的上下文一样被读取时，选择 `"user"`。顺便说一句，如果你的 routing 或 safety rules 依赖 user role，这可能很有用。

到目前为止，我们看到 memory 如何在 prompt 时组装上下文。但短期队列、归档 turns 和提取 facts 实际存在哪里？让我们看看持久化层。

## 默认情况下 memory 存在哪里？

短期聊天历史会自动写入一个内置 SQLAlchemy 数据库，并且每个对话都按唯一 `session_id` 分组。如果你没有提供一个，框架会生成一个新 ID，因此不同聊天永远不会混在一起。开箱即用时，`Memory` 类使用内存 SQLite 数据库，这意味着它不需要额外设置，非常适合 demos 和 tests。将历史存储在内存中的缺点是，进程停止后数据会消失。

SQLAlchemy 是一个功能强大且通用的 Python 工具包，允许开发者以更 Pythonic 的方式使用各种数据库，例如 Microsoft SQL Server、OracleDB、MySQL 等，抽象掉数据库交互和查询构造中的很多复杂性。

如果你希望历史可以跨重启持久化，或跨进程共享，可以将 `Memory` 指向真实数据库。基于文件的 SQLite URI，例如 `sqlite+aiosqlite:///chat_memory.db`，可以提供简单本地持久化。对于生产级应用，可以使用 PostgreSQL，例如 `postgresql+asyncpg://user:pass@host:5432/dbname`，或者如果你已经管理连接池，可以接入自己的 SQLAlchemy async engine。不过，Postgres 会提供更好的并发性、持久性和更复杂工具。你也可以定制表名和 schema，这在部署多个环境时可能很有用。

当短期聊天历史超过 `token_limit * chat_history_token_ratio`，默认是 70%，`Memory` 会将最旧 turns flush 到长期存储中。这些 flush 出来的消息会归档在同一个 SQLAlchemy store 中，然后传递给你配置的任何长期 memory blocks，例如 fact extraction 或 vector storage。

active queue 会被直接注入 prompt，而归档行仍然可供 blocks 拉取，也可供你之后检查或清理。

如果需要清空或轮换某个对话，可以使用：

```scss
memory.reset()
```

或者简单地用一个新 ID 开始新 session。

长期、检索式 memory 会与聊天历史 store 分开配置。如果你添加 `VectorMemoryBlock`，可以选择任意支持的 vector database，例如 Qdrant、Chroma、Weaviate 或 Milvus，并用你偏好的 embedding 模型连接它。这样就把消息存储位置，也就是用于短期和归档 turns 的 SQL store，与我们如何搜索过去上下文，也就是 vector store，解耦开来，因此你可以独立扩展语义召回。在真实场景中，团队通常会将短期 / 归档聊天保存在 Postgres 中，以获得可靠性和可观测性，而 vector store 则作为托管服务运行，专门调优以支持快速相似性搜索。

如果三种可用 memory blocks 无法满足你的使用场景需求，也可以创建自己的 memory block。官方文档中可以看到相关内容：[developers.llamaindex.ai/python/fram…](https://developers.llamaindex.ai/python/framework/module_guides/deploying/agents/memory/#customizing-memory-blocks)。框架会处理其余部分，保持 live queue 新鲜，将旧上下文 flush 到长期 memory，并在每轮把正确片段重新缝合进 prompt 中。

## 状态持久化与逻辑持久化

这里值得停一下，澄清两个容易混淆的概念。到目前为止我们讨论的所有内容，聊天历史、memory blocks 和 SQL store，都属于状态持久化：保存 agent 跨 turns 和 sessions 所知道的内容。但当你走向生产时，还有另一种重要持久化：逻辑持久化，它关乎保存 agent 如何行动，也就是它的 steps 流水线、routing decisions 和 tool orchestration 逻辑。状态持久化回答的是“我们聊过什么？”，而逻辑持久化回答的是“我接下来应该做什么，为什么？”。在 LlamaIndex 中，`Memory` 系统处理状态。逻辑持久化存在于 agent 架构本身中，也就是你如何定义 tools、配置 reasoning loops，以及对于更高级设计，如何组合事件驱动 workflows。等我们介绍完 memory 后，就会进入这部分内容。

## 实现 memory 时的一些推荐最佳实践

正确配置 memory 可以决定聊天机器人用户体验的成败。下面是一些实用指导，覆盖 token budgets、memory block 选择、持久化和隐私。

设置 token limits 时，要考虑模型上下文窗口。一个不错的规则是，为 memory 保留大约窗口的 60–80%，剩余部分留给模型推理和工具使用。实践中，`token_limit` 应该足够高，可以容纳几轮完整对话，以及你想注入的任何长期上下文；同时保持 `token_flush_size` 适中，大约是 limit 的 5–10%，这样旧 turns 会平滑滚出，而不是以大块方式突然消失。默认 `0.7` 的 `chat_history_token_ratio` 通常很好。只有当长期 blocks 需要在 prompt 中占用更多空间时，才应该降低它。

根据你希望 agent 行为有多稳定，选择 memory 注入位置。使用 `insert_method="system"` 会让风格、政策和长期事实持续位于对话上方，并倾向于减少漂移。这也是大多数应用最安全的默认方式。将 memory 注入最新用户消息，在你希望 memory 像额外用户上下文时有意义，例如 `FYI: last week we decided to…`，同时又不改变 agent 的全局语气。

选择 memory blocks 时，围绕你实际任务来选。保留一个小型高优先级 static block，用于身份、语气和不可协商规则。当你希望 agent 以紧凑形式记住不断变化的事实，例如偏好或决策时，添加 fact extraction block。当你需要高保真召回之前的 threads，例如配置、日志、确切步骤时，使用 vector block。必须保留的 notes 设置为 priority 0，确保永不裁剪。让提取 facts 位于其下，冗长检索片段再低一些，这样 token 紧张时它们会先被丢弃。

内存 SQLite 设置非常适合 demos 和测试。当你需要本地保留数据时，切换到文件支持的 SQLite。但一旦进入生产，并且有多个 workers 需要共享状态，就需要像 Postgres 这样的优秀后端来提供可靠性能。并且不要忘记监控 memory 增长。如果你实际上不使用那些旧对话，就修剪或归档它们，以保持良好用户体验并避免资源浪费。

另一个很好的建议是保持 prompts 干净。问题在于：更多 memory 并不总意味着更好结果。如果你发现答案变得啰嗦或偏题，尝试降低 retrieval `top_k`，收紧 vector block 上的 similarity thresholds，或降低 priorities，让可选内容先被裁剪。保持 static memory 精简且事实化。把大型政策文档塞进去没有意义。

从一开始就考虑隐私。如果聊天涉及个人信息或敏感数据，请在任何内容进入长期 memory 之前构建 redaction step。还有一个专业建议：不要把用户特定内容放进 static memory，尤其是任何之后可能需要更改或删除的东西。不过，因为第 6 章的主题是数据查询，我只展示了如何将不同 query engines 或 retrievers 包装成 tools，然后成为 router 的组件。从很多方面看，你可以把 router 看作一种非常简单的 agent。它使用 LLM 推理，根据指定用途和实际用户查询来决定应该使用哪个 query engine 或 retriever。

但 tools 可以有用得多。

tool 也可以包装任何用户定义函数，能够读写数据、调用外部 API 函数，并执行任何代码。这意味着 tools 有多种形式：

**QueryEngineTool**：可以封装任何现有 query engine。

**FunctionTool**：允许任何用户定义函数转换成 tool。这是一种通用类型的 tool，因为它允许执行任意类型操作。

**LlamaHub ToolSpec classes**：这些是社区构建的工具包，通常围绕某个产品或技术提供多种功能。

**不同 utility tools**：当需要处理大量 tools，或 tools 返回大量数据时，它们可能很有用。

**Debugging tools**：顾名思义，它们有助于理解 agents 在幕后实际做了什么。

我们可以用这个结构将任何 Python 函数转换成 agent tool。下面是一个定义 tool 的基础示例：

```python
from llama_index.core.tools import FunctionTool

def calculate_average (values: list[float]) -> float:
    """
    Calculates the average of the provided values.
    """
    return sum(values) / len(values)

average_tool = FunctionTool.from_defaults(
    fn=calculate_average)
```

为了让 agents 更好地吸收我们的函数作为 tools，它们应该包含描述性 docstrings，就像前面示例一样。在上面示例中，docstring，也就是 `Calculates the average of the provided values`，会被 LlamaIndex 自动提取，并用于帮助 agent 理解何时以及如何使用这个 tool。除了自动推断 tool schema，如果提供了 docstrings，LlamaIndex 也可以使用它们，让 agents 更好理解包装用户定义函数的特定 tool 的目的和正确用法。

在 Python 中，docstring 是一个字符串字面量，作为模块、函数、类或方法定义中的第一条语句出现。它用于记录所描述代码块的目的和用法。Docstrings 可以在运行时通过对象上的 `__doc__` 属性访问，也是 Python 中生成文档的主要方式。

到现在为止，你应该已经很好理解了基础 tool 用法。不过，有能力的 agents 应该能够处理不止一个 tool，对吧？

为此，LlamaIndex 还提供了 `ToolSpec` 类。`ToolSpec` 类似一组独立 tools 的集合，它为某项特定服务指定完整工具集。这就像为我们的 agent 配备一个用于特定任务集合的完整 API。

我们可以构建自定义 `ToolSpec` 类，但 LlamaHub 上也已经有越来越多可用的 ToolSpec：[llamahub.ai/?tab=tools](https://llamahub.ai/?tab=tools)。它们覆盖不同类型服务集成，例如 Gmail、Slack、Salesforce、Shopify 等。

LlamaHub agent tool repository 是 LlamaHub 的一个重要补充，它提供了一组经过策划的 tool specs，使 agents 能够与一系列服务交互，并扩展其功能。这个 repository 简化了面向各种 API 的 agent 设计过程，并且在 notebooks 中包含许多实用示例，便于集成和使用。

**图 9.7 —— DatabaseToolSpec**

这个工具集合建立在 SQLAlchemy 库之上，可以访问多种类型数据库，同时提供三个简单 tools：

**list_tables**：列出数据库 schema 中 tables 的 tool

**describe_tables**：描述某张 table schema 的 tool

**load_data**：接收 SQL 查询作为输入并返回结果数据的 tool

因为这不是 LlamaIndex core 组件，而是作为 integration package 提供，所以必须先在环境中安装：

```perl
pip install llama-index-tools-database
```

接下来，要初始化这个 `ToolSpec`，只需导入它：

```javascript
from llama_index.tools.database import DatabaseToolSpec
```

然后，我们必须配置数据库访问，如下：

```ini
db_tools = DatabaseToolSpec(<db_specific_configuration>)
```

下面是如何轻松将 `ToolSpec` 类转换成 tool 对象列表：

```ini
tool_list = db_tools.to_tool_list()
```

到这里，我们可以在初始化任何类型 agent 时，将 `tool_list` 作为参数传入。我们的 agent 现在就能够理解数据库 schema，并从其 tables 中提取任何需要的信息。你可以在本章稍后的 `FunctionAgent` 一节中找到如何使用这个 `ToolSpec` 类的完整示例。

永远不要给 agent 不受限制的数据库凭据。对于只读任务，使用只读数据库用户；将可见 tables 限制为 agent 实际需要的范围；限制结果大小，避免将整张表 dump 进上下文；避免在 prompts 或 logs 中暴露凭据；当 tool 接受原始查询时，在执行前验证任何生成的 SQL。这些预防措施不仅适用于 `DatabaseToolSpec`，也适用于任何将 agent 连接到数据存储的 tool。

## 理解 reasoning loops

为 agents 提供这么多专门 tools 是一个巨大优势。但不幸的是，一箱高质量工具并不总是足够。我们的 agents 还需要知道什么时候使用每一种工具。

具体来说，我们构建的 RAG 应用需要根据具体用户查询和它们所操作的数据集，尽可能自主地决定使用哪个 tool。任何硬编码方案都只能在有限场景中产生好结果。这就是 reasoning loops 发挥作用的地方。

reasoning loop 是 agents 的一个基础方面，使它们能够在不同场景中智能决定使用哪些 tools。这个方面很重要，因为在复杂真实应用中，需求可能差异很大，静态方法会限制 agent 的效果。

**图 9.8 —— agent 中的 reasoning loop**

reasoning loop 负责决策过程。它评估上下文，理解当前任务需求，然后从工具库中选择合适 tools 来完成任务。这种动态方法允许 agents 适应各种场景，使其灵活而高效。

这里要做一个明确区分：我们接下来要覆盖的组件都与 agents 相关，而不是 chat engines。现在我们知道 reasoning loop 是什么了，有几种 agent 风格以不同方式实现它。我们从最简单、最常用的一种开始。

## FunctionAgent

function calling 模型会解释 prompts 和上下文，根据训练中学到的内容判断什么时候适合函数调用。它们会返回符合函数定义结构的输出。要判断你选择的 LLM 是否具备 function calling 能力，最好的方法是查阅模型提供商文档。

**图 9.9 —— `FunctionAgent` 的简化工作流**

由于模型处理 tool 选择和链式调用的复杂逻辑，`FunctionAgent` 是 tool orchestration 的很好方案。一个权衡是，相比其他架构，它灵活性较低，因为 tool 选择逻辑被硬编码进 LLM 中。

要实现 `FunctionAgent`，我们定义 tools，并用它们初始化 agent。解释它如何工作的最佳方式是通过示例。

### 在运行下一个示例之前

本书一直使用的默认模型 `Gemma3:4b` 不支持 function calling。因此，对于这个特定示例，我们必须使用 `Qwen3:8b` 模型。如果还没有将 Qwen3:8b 模型拉取到 Ollama 环境，请先运行 `ollama pull qwen3:8b`。

在这个示例中，我们将使用一个 SQLite 数据库，其中包含一张名为 `Employees` 的表。这张表包含来自不同部门的 10 名员工的一些随机薪资数据。表 9.1 展示了 `Employees` 表的内容：

| ID | Name | Department | Salary | Email |
| --- | --- | --- | --- | --- |
| 1 | Alice | IT | 36420.77 | Alice_IT@org.com |
| 2 | Karen | Finance | 57705.06 | Alice_Finance@org.com |
| 3 | Helen | IT | 52612.51 | Helen_IT@org.com |
| 4 | Jackie | Finance | 61374.58 | Jack_Finance@org.com |
| 5 | David | Finance | 32242.72 | David_Finance@org.com |
| 6 | Cora | HR | 62040.53 | Alice_HR@org.com |
| 7 | Ingrid | IT | 70821.96 | Alice_IT@org.com |
| 8 | Jack | IT | 57268.89 | Jack_IT@org.com |
| 9 | Bob | Finance | 76868.23 | Bob_Finance@org.com |
| 10 | Bill | HR | 74161.45 | Bob_HR@org.com |

**表 9.1 —— `Employees.db` 文件中的示例 `Employees` 表**

数据库文件本身可以在本书 GitHub 仓库的 `ch9/files/database` 子文件夹中找到。让我们看代码：

```javascript
import asyncio
from llama_index.core import Settings
from llama_index.llms.ollama import Ollama
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.core.tools import FunctionTool
from llama_index.tools.database import DatabaseToolSpec
```

第一部分负责 imports。注意，我们这里没有使用常规 `models_config` 脚本，因为它被配置为将 Gemma 设置为默认 LLM。这里我们手动将 `llm` 指向 `Qwen3:8b`。

接下来，是时候定义一个简单函数，它会成为 agent 的自定义 tool。这个简单 tool 允许我们在本地文件夹中保存文件。注意我们为 agent 提供了详细 docstring：

```python
def write_text_to_file(text, filename):
    """
    Writes the text to a file with the specified filename.
    Args:
        text (str): The text to be written to the file.
        filename (str): File name to write the text into.
    Returns: None
    """
    with open(filename, 'w') as file:
        file.write(text)
```

定义函数后，我们必须将其包装成一个名为 `save_tool` 的新 tool。我们还从导入的 `DatabaseToolSpec` 初始化一个完整 `ToolSpec` 类。我们需要这些 tools，因为 agent 必须从 SQLite 数据库读取数据来解决任务：

```ini
save_tool = FunctionTool.from_defaults(fn=write_text_to_file)
db_tools = DatabaseToolSpec(uri="sqlite:///files//database//employees.db")
tools = [save_tool]+db_tools.to_tool_list()
```

创建 `db_tools` 后，我们必须将其与 `save_tool` 合并，放入一个名为 `tools` 的列表中。我们会将这个列表作为初始化 agent 的参数。

```ini
llm=Ollama(model="qwen3:8b",
    base_url="http://localhost:11434",
    temperature=0.8,
    request_timeout=30.0
)

agent = FunctionAgent(
    tools=tools,
    llm=llm,
    streaming=True
)
```

```csharp
async def main():
    handler = agent.run(
        "For each IT department employee with a salary lower "
        "than the average organization salary, write an email, "
        "announcing a 10% raise and then save all emails into "
        "a file called 'emails.txt, then stop. '"
    )
    async for event in handler.stream_events():
        if hasattr(event, "delta") and event.delta:
            print(event.delta, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
```

因为 `streaming=True` 并且我们循环处理 `handler.stream_events()`，所以现在只通过 `event.delta` 打印增量模型文本，然后 `response = await handler` 返回最终答案。

根据你的本地设置，这个示例需要耐心等待。我们提供的任务相对复杂。解决它需要多个步骤。由于我们在查询中没有提供太多细节，agent 必须自行弄清数据库结构，然后构造 SQL 查询，提取组织平均薪资，以及 IT 部门中薪资低于平均值的员工列表。

注意每一步中，agent 如何将 tools 的输出整合进其持续推理过程。一旦它拿到员工列表和所有相关数字，就会为每个人撰写邮件。任务最后一步是使用我们自定义创建的 tool，将结果保存到本地文件。

`FunctionAgent` 的可定制参数如下：

**llm**：支持 function-calling 的 LLM。agent 会强制检查这一点，如果模型缺乏 tool calling，就会抛出错误。

**name**：可选 agent 名称，用于 emitted events。

**streaming**：启用模型响应的 token-level streaming。

**initial_tool_choice**：一个可选参数，只在第一个用户 turn 中强制 agent 调用特定 tool。该值应该匹配 agent tool 列表中某个 tool 的名称。第一次调用之后，tool 选择会回到 agent 正常决策行为。这在你想保证一开始执行某个特定动作时很有用。例如，总是在 agent 开始推理查询之前列出数据库 tables。

**allow_parallel_tool_calls**：如果为 `True`，agent 可以在单个 turn 中发出多个 tool calls。

**scratchpad_key**：workflow context 中用于运行 transcript 的存储 key。

运行时可以提供以下参数：

**tools**：agent 可以调用的 tools 序列。

**memory**：agent 在 finalize 时写入消息的 memory backend。

**ctx（Context）** ：用于 streaming 和 scratchpad storage 的 workflow context。

`FunctionAgent` 与其他 chat engines 的不同之处在于，它既能执行 tool calls，又能让对话保持基于上下文。这使它特别适合需要高级功能的场景，例如集成外部 tools 或以更复杂方式处理用户查询。`FunctionAgent` 为创建有吸引力且智能的聊天体验提供了一个通用而强大的平台。

但是，如果我们的 LLM 没有被训练成会使用 tools，该怎么办？

## ReActAgent

与 `FunctionAgent` 不同，`ReActAgent` 使用可以由任何 LLM 驱动的通用 chat 或 text completion endpoints。它基于一组 tools 之上的 chat mode 中的 ReAct loop 运行。这个 loop 决定是否使用任何可用 tools，观察其输出，然后决定是否重复这个过程，或提供最终响应。这种灵活性允许它在使用 tools 和仅依赖纯模型推理之间做选择。不过，这也意味着它的性能高度依赖 LLM 质量，通常需要更细致的 prompting，才能确保准确查询知识库，而不是依赖可能不准确的模型生成响应。

驱动 `ReActAgent` 的内置 prompt 会展示可用 tools，并要求模型选择一个 tool，并以结构化格式提供参数。它受到 Yao, S. 等人 2022 年论文 *ReAct: Synergizing Reasoning and Acting in Language Models* 的启发：[arxiv.org/abs/2210.03…](https://arxiv.org/abs/2210.03629)。这个prompt template 会展示可用 tools 列表，并要求模型选择一个 tool，用 JSON 格式提供所需参数。这个显式 prompt 对 agent 的决策过程至关重要。

选择 tool 后，agent 会执行它，并将响应整合进聊天历史。这个 prompting、execution 和 response integration 的循环会持续进行，直到获得令人满意的响应。高层 loop 与图 9.9 中展示的 `FunctionAgent` 工作流类似：agent 接收用户消息，决定是否需要 tool，执行选中的 tool，观察结果，然后继续或返回最终响应。不过，产生 tool call 的机制不同。`FunctionAgent` 依赖模型提供商的原生 function-calling API，并从模型那里接收结构化 tool calls。`ReActAgent` 使用基于 prompt 的 reasoning format，模型会发出文本化 reasoning/action pattern，而 LlamaIndex 会通过 ReAct formatter 和 output parser 对其格式化和解析。

这使 `ReActAgent` 在不同模型后端之间更灵活，尤其是在所选模型不支持原生 tool calling 时。不过，这种权衡是更依赖 prompt engineering、output parsing，以及模型持续遵循预期 reasoning-and-action 格式的能力。

对于这种 agent 类型，我们有之前为 `FunctionAgent` 讨论过的常规可定制参数：`tools`、`llm`、`memory` 和 `callback_manager`。

此外，`ReActAgent` 还有几个特定参数：

**max_iterations**：这个参数设置 ReAct loop 可执行的最大迭代次数。这个限制确保 agent 不会陷入无限循环。

**react_chat_formatter**：它会根据提供的 tools、chat history 和 reasoning steps，将聊天历史格式化成结构化 `ChatMessages` 列表，在 user 和 assistant roles 之间交替。这有助于在 reasoning loop 中保持清晰性和一致性。

**output_parser**：一个可选的 `ReActOutputParser` 类实例。这个 parser 会处理 agent 生成的输出，帮助解释和适当格式化它们。

**tool_retriever**：一个可选的 `ObjectRetriever` 实例，用于 `BaseTool`。这个 retriever 可用于基于某些标准动态获取 tools。类似于我们索引 nodes 的方式，也可以创建一个 `ObjectIndex` 索引来索引一组 tools。当我们必须处理大量 tools 时，这特别有用。你可以在官方文档中找到更多信息：[docs.llamaindex.ai/en/stable/m…](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/usage_pattern.html#function-retrieval-agents)。

**context**：一个可选字符串，用于为 agent 提供初始指令。

### 关于 `max_iterations` 参数的简短说明

可能会很想直接把这个值设得非常大，以避免耗尽调用次数，并增加 agent 解决任务的机会。不过，请记住，每次 function call 都会产生成本，而且有时 agents 有进入无限循环的坏习惯。当它们这么做时，我称它们为 rogue agents。如果你的 agent 实现需要大量 LLM 调用才能解决简单任务，那么很可能是你在定义或描述底层 tools 时做错了什么。

我们初始化并使用 `ReActAgent` 的方式与 `FunctionAgent` 相同，只是这次你不需要先安装任何集成包；这种 agent 是 LlamaIndex core 组件的一部分：

```ini
from llama_index.core.agent import ReActAgent

agent = ReActAgent.from_tools(tools)
```

`ReActAgent` 的优势在于灵活性，因为它可以使用任何 LLM 来驱动其独特的 ReAct loop，使其能够智能选择并使用各种 tools。它就像一个虚拟助手，不仅能回答问题，还能智能决定何时查阅外部来源，从而让对话更符合上下文，并改善用户体验。

| Failure mode | Example | Mitigation |
| --- | --- | --- |
| Tool call is malformed | Agent 发出格式错误或无法解析的 tool arguments | Parser checks、retries、降低 temperature |
| Wrong tool selected | Agent 用薪资数据库回答政策问题 | 更好的 tool descriptions、tool retrieval、routing |
| Infinite loop | Agent 不断调用同一个 tool | max_iterations、预算上限、watchdog timeout |
| Tool timeout | DB / API 调用挂起 | Timeouts、circuit breakers、fallback response |
| Empty response | LLM 没有返回有用内容 | Fallback query、返回前验证 response、面向用户的 retry message |
| Sensitive data exposure | Agent 返回 emails 或 salaries | Redaction、least privilege、access control |
| Concurrent state mix-up | 两个用户意外共享 memory | Per-user session IDs 和 durable memory |

**表 9.2 —— 常见 agent failure modes 与缓解方法**

## 动手实践：为 Contract Review Expert 实现对话追踪

在这个实践部分中，我们会使用刚学到的一些知识，进一步改进合同审查项目。为了帮助澄清用户关于识别出的风险和合规问题的任何疑问，我们的 `Contract Review Expert` 核心应该拥有一个合适的对话引擎。它应该能够理解主题、感知当前上下文，并追踪与用户的完整交互。

我刻意让这个示例保持小而聚焦。目标是给你一个可工作的聊天体验，你之后可以将它扩展成完整 agent，并且如果愿意，可以使用本章中的技术添加 durable memory。

我们会在 `chat.py` 中实现所有聊天功能。这个模块并不打算在应用架构中直接使用。相反，它提供 `render_chat_interface(contract_name)` 函数，之后我们会在 `reports.py` 模块中导入并使用它。

**图 9.10 —— Contract Review Expert 训练 UI 截图**

让我们看代码。第一部分包含所有必要 imports：

```javascript
import streamlit as st
import os
from utils import load_policies_index, load_report
from llama_index.core import VectorStoreIndex, Document
from llama_index.core.readers.file.base import SimpleDirectoryReader
```

`Streamlit` import 驱动 UI。`os` 帮助定位磁盘文件。两个 helper，`load_policies_index` 和 `load_report`，来自工具模块。LlamaIndex 组件负责 RAG 部分：`SimpleDirectoryReader` 将文件加载为 `Document` 对象，`VectorStoreIndex` 基于这些文档构建索引。

函数第一部分检查是否提供了合同名称。如果没有，它会给出警告并提前返回，这样 UI 的其余部分不会尝试初始化：

```python
contract_filename = None
for ext in [".txt", ".pdf"]:
    potential_path = os.path.join("data/contracts", f"{contract_name}{ext}")
    if os.path.exists(potential_path):
        contract_filename = f"{contract_name}{ext}"
        break
```

这段代码会查找所请求合同是否存在 `.txt` 或 `.pdf` 版本。它按顺序遍历两个扩展名，并分配找到的第一个匹配文件名，然后立即停止，不再检查剩余扩展名。如果两者都不存在，函数会显示错误并退出。这避免后续步骤因缺失文件失败。接下来，如果找到了合同的 `.txt` 或 `.pdf` 版本，我们处理 chat engine 构建和缓存：

```ini
chat_engine_key = f"chat_engine_{contract_name}"
if chat_engine_key not in st.session_state:
    with st.spinner("Loading contract and policies."):
        contract_path = os.path.join("data/contracts", contract_filename)
        contract_reader = SimpleDirectoryReader(input_files=[contract_path])
        contract_docs = contract_reader.load_data()
        policies_index = load_policies_index()
        policies_reader = SimpleDirectoryReader(input_dir="data/policies")
        policies_docs = policies_reader.load_data()
        report_name = f"analysis report for {contract_name}.txt"
        report_path = os.path.join("data/reports", report_name)
        report_docs = []
        if os.path.exists(report_path):
            report_text = load_report(report_path)
            report_docs.append(Document(text=report_text))
        all_docs = contract_docs + policies_docs + report_docs
        index = VectorStoreIndex.from_documents(all_docs)
        chat_engine = index.as_chat_engine(
            chat_mode="condense_question",
            verbose=True,
            similarity_top_k=3,
            streaming=False
        )

        st.session_state[chat_engine_key] = chat_engine
else:
    chat_engine = st.session_state[chat_engine_key]
```

- 将合同加载为 documents
- 从 `data/policies` 加载政策文档，并调用 `load_policies_index()`。这个函数包含在 `utils` 模块中，它会检查 `config.POLICIES_INDEX_PATH` 下是否存在持久化的 policies `VectorStoreIndex`，如果存在就加载；否则，从 `data/policies` 读取文档，构建新索引，将其持久化到该路径，并返回索引
- 如果存在已保存分析报告，则可选地加载它，并将其包装成 document
- 基于组合语料构建 `VectorStoreIndex`
- 从索引构造一个 `condense_question` chat engine

### 为什么使用 `condense_question`？

**similarity_top_k=3**：将检索限制在三个最相关节点内，这会让 prompts 更紧凑，答案更聚焦。

**streaming=False**：请求完整响应，而不是 token streaming。

engine 实例会存储在 `st.session_state` 中，key 包含合同名称，因此切换合同时会有独立对话上下文。

同一合同的后续运行会复用缓存 engine，并跳过整个代码块。下一段代码在 UI 中追踪聊天历史：

```ini
chat_key = f"chat_history_{contract_name}"
if chat_key not in st.session_state:
    st.session_state[chat_key] = []
```

engine 本身会在进程生命周期内内部追踪历史，但我们也会在 `st.session_state` 中保存一个显示 transcript。这只是为了渲染。它按合同从空列表开始，并保存 `(question, answer)` 元组。接下来，我们收集输入并在 UI 中实现对话控制：

```ini
user_input = st.text_input(
    f"Ask about '{contract_name}':",
    key=f"chat_input_{contract_name}",
    placeholder="e.g., What are the main risks in this contract?"
)

col1, col2 = st.columns([1, 4])
with col1:
    ask_button = st.button("Ask", key=f"ask_btn_{contract_name}")
with col2:
    if st.session_state[chat_key]:
        clear_button = st.button("Clear Chat", key=f"clear_btn_{contract_name}")
        if clear_button:
            st.session_state[chat_key] = []
            st.rerun()
```

text input 捕获问题。`Ask` 按钮触发对 engine 的调用。`Clear Chat` 按钮会清空当前合同的 UI transcript，并重新运行应用。注意，这并不会重置 engine 的内部 memory。换句话说，在清空面板之后，engine 在这个 Streamlit session 中仍然会考虑之前 turns。

为了提供良好用户体验，我们的 chat engine 应该能够处理常见错误。所以我们在下面代码块中实现这一点：

```scss
if ask_button and user_input.strip():
    with st.spinner("Thinking."):
        try:
            response = chat_engine.chat(user_input)
            response_text = str(response)
            if not response_text.strip():
                response_text = (
                    "I couldn't generate a proper response. "
                    "Please try rephrasing your question."
                )
            st.session_state[chat_key].append((user_input, response_text))
            st.rerun()
        except Exception as e:
            [.]
```

按下 `Ask` 会将原始 `user_input` 发送给 `chat_engine.chat`。engine 会压缩问题，在索引上执行检索，合成答案，并返回一个 response 对象，我们将其转换为字符串。如果它碰巧为空，就插入一条友好消息，而不是显示空白。exception handler 覆盖两种情况。如果错误信息提到 `max iterations`，UI 会告知用户模型耗时过长，并尝试使用 `index.as_query_engine(.)` 做一次直接、无状态检索作为 fallback。否则，它会显示错误，并将错误记录到 transcript 中。

下一段代码负责在用户界面中渲染对话：

```python
if st.session_state[chat_key]:
    st.markdown("### Chat History")
    with st.container():
        for i, (q, a) in enumerate(reversed(st.session_state[chat_key])):
            expander_title = (
                f"Q: {q[:50]}{'.' if len(q) > 50 else ''}"
            )
            with st.expander(expander_title, expanded=(i == 0)):
                st.markdown(f"**Question:** {q}")
                st.markdown(f"**Answer:** {a}")
else:
    st.info("No chat history yet. Ask a question about the contract above!")
```

transcript 使用 expanders 按最新优先渲染。最新一次交流默认打开，因此用户会立即看到最新答案。如果还没有之前 turns，则显示一个低调提示，鼓励提出第一个问题。

我们还有一个小 helper 函数，用于清除缓存 engine：

```python
def clear_chat_cache(contract_name):
    chat_engine_key = f"chat_engine_{contract_name}"
    if chat_engine_key in st.session_state:
        del st.session_state[chat_engine_key]
```

这个函数会移除某个合同的缓存 `ChatEngine` 实例。当更新政策或替换合同文件后，它很有用，因为它会强制下一次运行时创建新的索引和 engine。

暂时就到这里。我们会在后续几章中讨论 `Contract Review Expert` 的更多功能。

## 总结

本章从基础聊天进入了 LlamaIndex 中完整智能体系统。我们探索了聊天机器人在现代工作流中的位置，以及为什么用 RAG grounding 至关重要。然后，我们介绍了 `ChatEngine`，它是 `QueryEngine` 的有状态对应物。你学习了四种 chat modes 以及各自适用场景：`Simple` 用于普通 LLM 聊天，`Context` 用于基于检索 grounding 的答案，`CondenseQuestion` 用于将历史感知查询转化成独立问题，`CondensePlusContext` 用于用检索上下文丰富压缩问题。本章随后深入介绍了对话 memory，从用于基础持久化的 `SimpleChatStore` 及其限制开始，再到新的 `Memory` 系统。后者通过 `Static`、`FactExtraction` 和 `Vector` memory blocks，以及 token budgets、priorities 和存储选项，管理短期队列和长期上下文。

我们还讨论了 tooling：使用 `FunctionTool` 包装函数，使用 `ToolSpec` 打包能力，并使用 LlamaHub 中的社区工具，其中重点展示了 `DatabaseToolSpec`。你学习了 agents 如何通过 reasoning loops 做决策，并比较了两种 agent 风格：`FunctionAgent` 依赖原生 tool calling 模型来规划和调用 tools；`ReActAgent` 通过结构化 prompt 决定 tool 使用，为没有原生 tool calling 的模型增加灵活性。

在动手实践部分，我们为 `Contract Review Expert` 接入了 Streamlit chat。到本章结束，你获得了关于 chat mode 选择、持久化和检索增强 memory、tool packaging，以及两种互补 agent 架构的实践知识，可以将它们适配到真实应用中。

我们通往更高级 agent 功能的旅程，会在下一章继续。

