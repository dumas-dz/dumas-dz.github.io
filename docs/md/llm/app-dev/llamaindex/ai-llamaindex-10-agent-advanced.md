---
title: LlamaIndex - 高级智能体用例
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - Agent
---

---

本章探索高级智能体用例：多智能体协作（AgentWorkflow + Handoff 机制）、LoadAndSearchToolSpec 处理大型工具输出、Human-in-the-loop 编排等。

### 技术要求

本章示例代码需要使用以下 LlamaIndex 集成包：Wikipedia reader（[pypi.org/project/lla…](https://pypi.org/project/llama-index-readers-wikipedia/%EF%BC%89%E3%80%82)

## 从工作流到智能体

如果说第 8 章讲的是如何为我们的应用“编排动作”，那么本章讲的就是如何让我们的“表演者”拥有更多主动性。

结果是，我们得到了某种感觉扎实且可预测的东西。你知道每一步从哪里开始，它会产生什么，以及它如何影响系统的其余部分。你能看到哪里可以增加重试，哪里可以暂停等待人工处理，哪里可以把任务分发成并行任务。简而言之，工作流给了我们一张清晰的地形图。但它没有做到的一点是：它并没有给模型太多即兴发挥的空间。每一个决策都被编码在我们设计的图中。

换句话说，如果工作流是一个程序，其中由你硬编码“哪个事件之后执行哪个步骤”，那么智能体就是一种由 LLM 在运行时决定下一步的工作流。循环是一样的，但决策者变了。

FunctionAgent 和 ReActAgent 是 LlamaIndex 中两种核心智能体范式。前者依赖 LLM 原生函数调用能力，后者通过“思考-行动”循环实现工具选择。本节将从底层理解智能体的工作机制。

在此基础上，我们将进入更高级的领域。真实应用很少只依赖一个简单智能体加几个工具。你可能需要数十个工具，这些工具由不同团队负责，并由不同服务支撑。你可能需要一个规划智能体来拆解任务，以及一些工作智能体来执行这些子任务。你可能需要专门化的智能体：一个用于风险分析，一个用于合规，一个用于把内容改写给非技术读者。你甚至可能希望它们相互协作，让结果流经一个 AgentWorkflow，由它来协调整个过程。

和工作流一样，本章重点仍然是实践。我们会讨论架构，但始终带着实现视角。你将看到如何组织大型工具集合，避免模型被选项淹没；如何把数据检索与工具检索结合起来；如何设计仍然可以被理解的多智能体模式；以及如何把所有这些重新接回你已经熟悉的编排概念中。

到本章结束时，智能体将不再像一种神秘的“越野模式”：你要么完全信任它，要么彻底避开它。相反，它会变成你工具箱中的另一件工具：在正确语境下非常强大，在必要时可以被工作流约束，并且能够把你的 LlamaIndex 应用从脚本化流程转变为真正可以推理“下一步该做什么”的系统。

## LlamaIndex 如何把工具、记忆和模型变成智能体

使用 `FunctionAgent(tools=tools, .)`，把几个函数交给它，然后让 LlamaIndex 处理其余事情。这感觉有点神奇：一次调用进去，一个完整可用的智能体出来。本节的目标就是尽可能去除这种“魔法感”。你将看到，LlamaIndex 智能体是如何构建在你第 8 章见过的同一组工作流原语之上的，以及 `FunctionAgent`、`ReActAgent` 和 `AgentWorkflow` 层并不是独立的“黑箱产品”，而是构建在这套基础设施之上。

在官方 LlamaIndex 文档中，智能体被描述为一个具体系统，它将 LLM、工具和记忆结合起来，用于处理用户输入。它不仅仅是一次带提示词的模型调用，而是一个循环：读取输入，决定下一步要做什么，调用工具，更新状态，最终产生答案。这正是我们将在本节拆解的循环，并且我们会用工作流作为框架来理解它如何组合起来。

工作流是一个事件驱动程序：你定义步骤，每个步骤监听特定事件类型；当它处理一个事件后，可以发出新的事件，从而唤醒其他步骤。状态存在于 `Context` 中，而不是局部变量里，因此整个流程可以被暂停、恢复和检查。LlamaIndex 使用同一个事件驱动工作流引擎来构建单智能体和多智能体系统。在幕后，一个函数调用智能体其实就是一个工作流，它会响应诸如“请求工具调用”和“工具结果已准备好”这样的事件。

如果把高层 API 剥离到最核心的部分，每个 LlamaIndex 智能体都依赖四个构建块：

LLM，被封装在 LlamaIndex 的 LLM 抽象中，因此所有模型，例如 OpenAI、Gemini、本地模型等，从智能体视角看起来都是一样的。

工具集，包括被提升为工具的 Python 函数，或结构化工具对象，例如 `FunctionTool` 和 `QueryEngineTool`，它们携带名称、描述和参数 schema。

记忆，通过 `BaseMemory` 抽象暴露给基于工作流的智能体。如果没有提供记忆对象，当前默认仍然是 `ChatMemoryBuffer`，它会在 token 限制内保存最近的聊天历史。对于更高级的场景，LlamaIndex 还提供了更新的 `Memory` 类，它是 `BaseMemory` 的一个实现，支持短期队列，以及可选的长期记忆块，用于静态上下文、事实抽取和基于向量的召回。

工作流层，由事件类型、步骤和 `Context` 存储组成，它把所有内容粘合成一个连贯的循环，其中 `AgentWorkflow` 是专门面向智能体的工作流。

你已经知道如何使用 `FunctionAgent`：传入工具和 LLM，然后调用 `agent.run("What is 1234 * 4567?")`。那么接下来发生了什么？智能体会收集最新消息和聊天历史，把历史以及工具 schema 一起发送给 LLM，接收一个直接答案或一组工具调用，执行每个工具，把结果追加到聊天历史，然后重复这个过程，直到它可以直接回答。操作层面上，这就是智能体循环。架构层面上，它被实现为一个工作流，其步骤对应以下阶段：准备输入、询问模型、运行工具、整合结果，以及决定是否继续。

为了更清楚地理解智能体循环，用事件而不是方法来思考会很有帮助。当你调用 `agent.run(.)` 时，会创建一个 `AgentWorkflowStartEvent`，它是 `StartEvent` 的一个专门子类，携带用户消息、任何初始聊天历史以及可选的记忆对象。第一个步骤会读取这个事件，规范化用户消息，并构建初始对话上下文。第二个步骤会用上下文和工具定义来调用 LLM。如果模型请求工具调用，就会发出一个工具调用事件，由“运行工具”步骤接收，该步骤调用底层 Python 函数并记录输出。一旦结果可用，另一个事件会流回推理步骤，推理步骤会带着更新后的历史再次调用 LLM。当模型最终返回一个普通答案时，工作流会发出一个停止事件，生成一个 `AgentOutput` 对象。图 10.1 展示了完整循环，从初始 `StartEvent`，经过推理与工具调用循环，到最终的 `AgentOutput`：

这个循环内部发生的一切都是可观察的，因为它们都以事件形式暴露出来。这里有两类事件值得理解。第一类是工作流事件，它们真正驱动控制流：`AgentInput` 把准备好的消息带入推理步骤；`AgentOutput` 保存模型响应，包括它想进行的任何工具调用；`ToolCall` 触发工具执行；`ToolCallResult` 把输出反馈回循环。这些事件是工作流步骤监听和发出的事件。它们是智能体循环本身的引擎。第二类是插桩事件，例如 `AgentRunStepStartEvent`、`AgentRunStepEndEvent` 和 `AgentToolCallEvent`。这些事件不会影响控制流。相反，它们会伴随工作流事件一起触发，让回调、追踪工具和可观测性平台可以接入正在发生的事情，而不会干扰循环。你可以把工作流事件看作机器内部转动的齿轮，而把插桩事件看作机器外部的仪表，让你能够观察这些齿轮如何转动。

`FunctionAgent` 只是这种架构上的一种智能体风格。它假设 LLM 支持工具调用或函数调用，并允许模型在响应中直接发出结构化工具调用。`ReActAgent` 位于同一个工作流引擎上，但使用的是不同策略：它提示模型在文本中交替进行“思考”和“行动”步骤，利用这些思考来决定调用哪个工具，然后循环，直到可以回答。从应用开发者视角看，这两个类暴露了相似的 `run` 接口；在幕后，它们只是把不同的规划和工具选择逻辑插入到第 8 章解释过的同一套步骤与事件框架中。

把这一点连接到多智能体设置的组件是 `AgentWorkflow`。它是 `Workflow` 的一个子类，并额外提供了一些功能，用于管理一组智能体、选择根智能体、处理交接，以及维护共享状态。它甚至有一个方便的构造器 `AgentWorkflow.from_tools_or_functions`，可以接收一组工具或函数以及一个 LLM，然后为你构建一个单智能体工作流。如果 LLM 支持函数调用，内部智能体会是一个 `FunctionAgent`；否则，它会回退到一个 `ReActAgent`。可以理解为“我正在实例化一个里面正好只有一个智能体的智能体工作流”。

既然你已经理解了智能体如何构建在工作流之上，那么接下来让我们处理一个你很快就会遇到的实际问题：当一个工具返回的数据超过模型能够舒适处理的范围时，会发生什么？

## 安全处理大型工具输出

为了增强现有工具的能力，LlamaIndex 提供了两个非常有用的所谓 utility tools：`OnDemandLoaderTool` 和 `LoadAndSearchToolSpec`。它们是通用的，可以与任何类型的智能体一起使用，用来增强标准工具功能，尤其适用于工具输出过大、无法安全地直接放入 LLM prompt 的场景。

与 API 交互时，一个常见问题是我们可能会收到非常长的响应。智能体处理大型输出时可能会遇到困难，因为这些输出可能溢出模型的上下文窗口，或者稀释良好推理所需的关键信息，从而降低智能体推理逻辑的准确性。

那么，如果我们希望智能体只加载一次大型 payload，然后以一种受控方式搜索结果，使只有相关片段被使用，该怎么办？这就是 `LoadAndSearchToolSpec` 的工作。

### 理解 LoadAndSearchToolSpec 工具

这个 utility tool 旨在帮助智能体处理来自 API 端点的大量数据，如图 10.3 所示：

`LoadAndSearchToolSpec` 接收一个现有工具，并生成两个独立工具：一个用于加载和索引数据，默认使用向量索引；另一个用于在这些已索引数据上执行搜索。这种模式专门用于处理那些否则会因为过大而无法直接传给 LLM 的工具输出。智能体会先使用 Load 工具摄入数据，然后把它存储到索引中。在下一步中，智能体再使用 Search 工具，通过内置 query engine 只抽取所需信息。

```javascript
import asyncio
import models_config
from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.tools.tool_spec.load_and_search import LoadAndSearchToolSpec
from llama_index.tools.database import DatabaseToolSpec
```

我们先导入 `asyncio`，因为我们要异步运行所有内容。我们还导入 `models_config`，它在幕后为我们完成那些枯燥但重要的设置工作：它把默认 LLM 设置为 `gemma3:4b`，把 embedding 模型设置为 `nomic-embed-text`。我们使用 `ReActAgent`，是因为我们想要一个能够在循环中推理并决定何时调用工具的智能体，即使模型本身不支持原生函数调用。我们还导入了 `LoadAndSearchToolSpec`，这是这里的关键 utility：它允许我们拿一个可能返回大型 payload 的工具，把工作流拆成“加载并索引”阶段，以及“搜索”阶段。接下来，我们定义一个异步 `main()` 函数：

```ini
async def main() -> None:
    db_tools = DatabaseToolSpec(uri="sqlite:///files/database/employees.db")
    tool_list = db_tools.to_tool_list()
    load_data_tool = next(t for t in tool_list if t.metadata.name == "load_data")
```

接下来，我们不再把原始的 `load_data` 工具直接交给智能体，而是用 `LoadAndSearchToolSpec` 包装它：

```ini
tools = LoadAndSearchToolSpec.from_defaults(load_data_tool).to_tool_list()
```

这会把一个可能产生巨大输出的工具，转换成一个小型两步接口：一个工具加载并索引数据，另一个工具搜索该索引，以便只取回所需内容。这就是防止大型工具输出膨胀模型上下文的全部技巧。

之后，我们创建一个 `ReActAgent`，并把包装后的工具交给它。

我们从 `llama_index.core.agent.workflow` 导入 `ReActAgent`，这意味着它使用的是更新的、基于异步工作流的设计模式。这就是为什么我们使用 `agent.run()` 获得一个 handler，遍历 `stream_events()` 获得实时可见性，并 `await` 这个 handler 来取得最终响应，而不是得到一个同步返回值。

代码如下：

```python
agent = ReActAgent(tools=tools, verbose=True, streaming=False)
    handler = agent.run(
        "Who has the highest salary in the Employees table? "
        "Use the tools and return the exact name and salary."
    )
    async for ev in handler.stream_events():
        cls = ev.__class__.__name__
        if "Tool" in cls or "Agent" in cls or "Step" in cls:
            print(f"{cls}: {ev}")
    response = await handler
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
```

注意，这里我们明确设置了 `streaming=False`。所有 LlamaIndex 智能体默认 `streaming=True`，这意味着模型输出会随着生成过程逐步传递出来。对于实时 UI 来说，这很好；但如果你运行的是脚本，并且只想要最终答案，那么你会希望禁用它。如果你保持 streaming 打开，却没有正确消费 stream，就可能得到不完整或意外的结果。

然后我们启动智能体运行。这会返回一个 handler，而不是立刻返回最终答案。prompt 明确告诉智能体我们想要什么，并指示它实际使用工具，而不是尝试猜测。

在智能体工作期间，我们遍历 `handler.stream_events()`，这样就可以实时观察运行过程。我们保持简单，通过类名做过滤，只打印看起来与工具、智能体逻辑或步骤执行相关的事件。这给了我一个轻量级 trace，可以看到正在发生什么，而不会倾倒所有事件类型。最后，我们 `await` handler，得到完成后的响应并打印出来。到那时，智能体已经结束了它的循环，并返回它能够产生的最佳最终答案；理想情况下，这个答案是基于它通过 load-and-search 工具抽取到的内容生成的。

如果你查看图 10.4 中显示的输出，会注意到这次智能体需要处理的数据量减少了：

从输出中很容易看到这种模式。智能体第一次调用不再收到整个 document 作为响应，而只是得到一条确认消息，说明数据已经被加载并索引；第二次调用则通过查询抽取最终响应。接下来，我们将讨论另一个 utility tool。

### 理解 OnDemandLoaderTool

另一个重要的 utility 是 `OnDemandLoaderTool`。这个工具旨在让智能体工作流中的数据加载、索引和查询过程变得无缝且高效，尤其是在处理来自各种来源的大量数据时。

它通过允许智能体用单次工具调用触发数据的加载、索引和查询，简化了在智能体中使用数据 loader 的过程。

在普通 RAG 工作流中，常见做法是在应用启动时摄入所有数据，然后切块、索引，并在其上构建 query engine。但这并不总是最高效的方法。

假设我们有大量数据源。如果在启动期间摄入并索引所有数据，会耗费很长时间，对用户体验产生负面影响。再者，如果用户问了一个仅凭已摄入数据源无法回答的问题怎么办？这正是这类功能变得有用的地方。

`OnDemandLoaderTool` 在数据需求动态且不可预测的场景中尤其有用。与其在启动时预加载大量数据，而这些数据并不一定都与用户当前需求相关，这个工具允许智能体按需获取、索引和查询数据。这种方法显著提升了效率，因为它让智能体在任何给定时间只专注于相关数据，而不是处理大量当下并不必要的数据集。

它如何工作？它接收任何现有 data loader，并将其包装成一个智能体可以按需使用的工具。

运行代码之前，请确保安装 Wikipedia 集成包：

```perl
pip install llama-index-readers-wikipedia
```

下面是示例代码。我们从 imports 开始：

```javascript
import asyncio
import models_config
from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.tools.ondemand_loader_tool import OnDemandLoaderTool
from llama_index.readers.wikipedia import WikipediaReader
```

我们先导入 `asyncio`，因为我们将异步运行智能体；同时导入 `models_config`，这样默认 LLM 和 embedding 模型已经为我们配置好。然后导入 `ReActAgent`，它将运行推理循环；导入 `OnDemandLoaderTool`，它会把 data loader 包装成智能体工具；以及 `WikipediaReader`，这是我们希望智能体使用的 loader。接下来，让我们基于 `WikipediaReader` 为智能体定义一个按需工具：

```ini
async def main() -> None:
    tool = OnDemandLoaderTool.from_defaults(
        WikipediaReader(),
        name="WikipediaReader",
        description="args: {'pages': [<list of pages>], 'query_str': <query>}",
    )
```

核心思想是：我们拿一个 loader，即 `WikipediaReader`，并把它转换成智能体可以调用的工具。`name` 是智能体看到的工具标识符，`description` 会作为自由文本直接传给 LLM，LlamaIndex 并不会解析或验证它。这是我们告诉模型在调用该工具时应该如何组织参数的方式。这里我们基本上是在告诉智能体：传入一个 Wikipedia 页面标题列表 `pages`，再传入一个 `query_str`，表示你想查找什么。这个描述的质量会直接影响模型能否可靠地用正确参数调用工具。

之后，我们用这一个工具创建一个 `ReActAgent`：

```ini
agent = ReActAgent(
        tools=[tool],
        verbose=True,
        streaming=False,
    )
```

然后启动运行：

```ini
handler = agent.run("List top 3 countries by population")
```

这会返回一个 handler，代表正在进行的执行。我们的 prompt 刻意写得很短，同时它也有点像一个测试：`List top 3 countries by population` 给了智能体一个获取新鲜事实的理由，而在这里它唯一能做到这一点的方式，就是使用 Wikipedia 工具。

智能体运行期间，我们遍历 `handler.stream_events()`，并只打印相关事件：

```python
async for ev in handler.stream_events():
        cls = ev.__class__.__name__
        if "Tool" in cls or "Agent" in cls or "Step" in cls:
            print(f"{cls}: {ev}")
```

这会给我们一个简单的实时 trace，展示智能体何时决定调用工具、工具何时返回，以及运行过程如何推进。

```ini
response = await handler
    print(response)
if __name__ == "__main__":
    asyncio.run(main())
```

我们的默认本地 LLM `Gemma3:4b` 似乎很难处理这个示例的复杂性。在我的本地环境中，切换到 `Qwen3.5:9b`，也就是后面 AgentWorkflow 示例中也会使用的模型，带来了明显更稳定的结果：它更可靠地遵循“使用工具”的指令，并基于检索到的内容生成更干净的最终答案，而不是直接猜测。

`OnDemandLoaderTool` 会把加载和索引作为工具调用的一部分来执行。如果你想在多个问题之间复用结果，就需要显式实现缓存或持久化。例如，你可以使用第 5 章“持久化和复用索引”一节中的技术，把工具调用创建的索引持久化，然后在再次调用工具之前先检查是否已有缓存索引。这样可以避免重复加载和重新索引。

`OnDemandLoaderTool` 可以与其他普通工具串联使用，使智能体能够处理更复杂的场景。

## 扩展到大量工具：工具检索与工具索引

在生产环境中，工具很少只有三个辅助函数。它们通常包含数十甚至数百种能力：数据库查询、内部 API、工单操作、搜索端点、政策查询、分析查询、文档检索、代码执行，以及不同团队随时间构建出来的小型 utility 函数。如果你简单地把它们一次性全部交给模型，两个问题会立刻出现：

Prompt 膨胀：模型必须看到每个工具的名称、描述和 schema。当工具很多时，这部分可能主导上下文窗口，并给用户实际任务和智能体推理留下更少空间。

工具混淆：即使所有内容都能放进去，当模型面对太多相似选项时，其决策质量也会下降。它开始选择“差不多”的工具，调用错误端点，或走更长的推理路径。

所以问题变成：如何在不让模型被选项淹没的情况下扩展工具使用？

LlamaIndex 的答案相当直接：把工具当作可检索对象。你不需要每次都把每个工具塞进 prompt，而是索引你的工具，并针对当前用户请求只检索最相关的工具，然后只用这一个更小的子集来运行智能体循环。

我们把这拆成三部分：第一，如何从“工具列表”的思维转向“工具库”的思维；第二，LlamaIndex 如何为工具建立索引，使其变得可检索；第三，检索如何融入你已经熟悉的智能体循环。

### 从“工具列表”转向“工具库”

你把完整工具清单保存在某个地方。

你基于工具描述和 metadata 构建索引。

对于每个用户查询，检索一个小型 top-k 工具集合。

只有这些工具会展示给模型，用于选择和调用。

这与你用于 Documents 的模式是一样的：你不会把每条政策和每页合同都喂给模型。你会先检索相关节点。工具检索只是把同一个思想应用到智能体的能力上。

### 使用 ObjectIndex 进行工具索引

LlamaIndex 提供了一种索引任意 Python 对象的通用机制：`ObjectIndex`。毕竟，工具只是带有丰富 metadata 的 Python 对象，例如 `name`、`description`、`schema`，因此它们天然适合这种机制。

从概念上讲，`ObjectIndex` 做两件重要事情：

它把对象转换成可索引的东西，通常是从每个对象的 metadata 派生出的文本节点。

它保存映射关系，使检索出来的节点可以重新转换回原始对象。

工具检索的效果取决于你的工具 metadata。索引是由工具名称和描述驱动的。如果这些信息模糊，检索也会模糊。我们在文档切块中学到的同一条规则也适用于这里：垃圾进，垃圾出。例如，一个像 `Searches HR data` 这样的描述几乎不给检索器任何可用信息。将它与 `Searches HR databases for contractor vacation policies and holiday exceptions` 对比。第二个版本给 embedding 模型足够的语义信号，使它能够把这个工具匹配到相关查询，并把它与其他 HR 工具区分开来。

### 工具检索器：ObjectRetriever

### 检索如何融入智能体循环

检索增强智能体不会替代智能体循环。它只是在循环之前，有时也可能在循环内部，添加一个缩小工具集的步骤。

在 LlamaIndex 的检索增强智能体模式中，流程如下：检索相关工具，只把这些工具传入 `FunctionAgent` 或 `ReActAgent`，然后运行普通推理循环。这一点很重要，因为它保留了你已经知道的一切：ReAct 仍然以迭代方式进行推理和行动；FunctionAgent 仍然使用模型原生工具调用。

流式输出和可观测性仍然通过同一套工作流/事件基础设施呈现出来。

区别只是：智能体看到的是经过筛选的工具集合，而不是整个工具箱。

工具检索在三个方面有帮助：

更小的工具菜单可以提高选择准确性。当模型只看到 top-k 工具时，它花在比较无关选项上的精力会更少。

更低的 token 压力意味着更少失败。工具定义是 prompt payload 的一部分。把 80 个工具缩减到 6 个，可能就是稳定行为和模型静默截断上下文之间的区别。

领域分离变得更容易。例如，如果你有财务工具、HR 工具和工程工具，检索可以像一个自动部门路由器，而不需要你为每种情况硬编码规则。

最终结果会感觉不那么像一个猜测模型，而更像一个有纪律的系统：它只考虑对任务有意义的工具。

下面是一个实际例子，展示如何使用 `ObjectIndex` 为一组工具建立索引，针对给定查询只检索相关工具，并把过滤后的子集传给 `ReActAgent`。虽然这个例子刻意简化，但示例代码应该能让你大致了解如何应用这项技术：

```javascript
import asyncio
import models_config
from llama_index.core import VectorStoreIndex
from llama_index.core.agent.workflow import ReActAgent
from llama_index.core.objects import ObjectIndex
from llama_index.core.tools import FunctionTool
```

我们先导入 `asyncio`，因为我们将异步运行整个示例；同时导入 `models_config`，这样默认的 LlamaIndex LLM 和 embedding 设置已经准备好。然后导入 `VectorStoreIndex`、`ReActAgent`、`ObjectIndex` 和 `FunctionTool`。这些组件合在一起，给了我们完整的工具检索流水线：定义工具、索引工具、检索相关工具，并在检索出来的子集之上运行智能体循环。

接下来，我们定义一小组模拟 Python 函数，代表我们的工具库。

```python
def hr_vacation_policy_lookup(topic: str) -> str:
    return (
        "HR policy excerpt: Contractors are not eligible for paid vacation. "
        "Exceptions require VP approval and must be documented in the contract addendum."
    )

def hr_holiday_calendar(country_code: str) -> str:
    return f"Holiday calendar for {country_code}: New Year, Easter, Labour Day, Christmas."

def finance_sales_by_region(quarter: str) -> str:
    return f"Sales by region for {quarter}: NA $12.4M, EMEA $9.1M, APAC $7.6M."

def it_create_ticket(title: str, details: str) -> str:
    return f"Created ticket: {title} (details: {details})"

def slack_send_message(channel: str, text: str) -> str:
    return f"Sent message to {channel}: {text}"

def util_generate_uuid() -> str:
    return "9f2c2e9a-8f30-4d3b-baa6-4a9f3bd1a2f1"
```

我故意把几个面向 HR 的函数和其他无关函数混在一起。这个设置的重点是：在真实系统中，我们会有数十种能力，而我想展示的是，检索可以在不强迫模型一次性看到所有内容的情况下，浮现出正确的工具。

之后，我们进入 `main()`，并使用 `FunctionTool.from_defaults` 从这些函数构建真正的 LlamaIndex 工具。对于每个工具，我们提供名称和描述，因为这段文本正是驱动工具检索的内容。也正是在这里，我们为检索器编码语义：如果描述清晰且彼此区分明显，检索器就有强信号，可以把用户意图匹配到正确能力上。

```rust
async def main() -> None:
    tools = [
        FunctionTool.from_defaults(
            fn=hr_vacation_policy_lookup,
            name="hr_vacation_policy_lookup",
            description="Look up HR vacation policy rules and exceptions by topic.",
        ),
        FunctionTool.from_defaults(
            fn=hr_holiday_calendar,
            name="hr_holiday_calendar",
            description="Return the holiday calendar for a given country code.",
        ),
        FunctionTool.from_defaults(
            fn=finance_sales_by_region,
            name="finance_sales_by_region",
            description="Return sales totals split by region for a quarter like 'Q3 2025'.",
        ),
        FunctionTool.from_defaults(
            fn=it_create_ticket,
            name="it_create_ticket",
            description="Create an IT support ticket with a title and details.",
        ),
        FunctionTool.from_defaults(
            fn=slack_send_message,
            name="slack_send_message",
            description="Send a Slack message to a channel.",
        ),
        FunctionTool.from_defaults(
            fn=util_generate_uuid,
            name="util_generate_uuid",
            description="Generate a random UUID string.",
        ),
    ]
```

```ini
tool_index = ObjectIndex.from_objects(tools, index_cls=VectorStoreIndex)
```

我在这里做的是把工具转换成可检索对象，类似于我们把文档转换成可检索节点。在底层，索引会存储工具 metadata 的 embedding，并保留映射关系，这样当检索发生时，我们取回的是实际工具对象，而不只是文本片段。

工具索引准备好之后，我们通过 `tool_index.as_retriever()` 创建一个 retriever，并设置 `similarity_top_k=2`：

```ini
tool_retriever = tool_index.as_retriever(similarity_top_k=2)
```

在真正运行智能体之前，我们先用 `tool_retriever.retrieve()` 做一次快速预览检索，并打印返回的工具名称：

```ini
preview = tool_retriever.retrieve("vacation policy exceptions for contractors")
    print([t.metadata.name for t in preview])
```

这让我们确认检索是否按照预期运行：你应该看到 HR 政策相关工具排在前面，而 Slack 消息或 UUID 生成等无关能力不应被选中。然后我们通过传入 `tool_retriever`，而不是完整工具列表，来构造 `ReActAgent`。这是让智能体具备检索增强能力的关键部分。我没有改变推理循环；我只是改变了智能体如何获得工具菜单。

```ini
agent = ReActAgent(
        tool_retriever=tool_retriever,
        verbose=True,
        streaming=False,
    )
    handler = agent.run(
        "Summarize the vacation policy exceptions for contractors in 2 bullets. "
        "Use tools."
    )
    response = await handler
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
```

你应该期待以下输出：

```css
['hr_vacation_policy_lookup', 'hr_holiday_calendar', 'finance_sales_by_region']
*   Contractors are generally not eligible for paid vacation.
*   Exceptions to this rule require VP approval and must be documented in a contract addendum.
```

运行时，智能体会向 retriever 请求相关工具，只有这些工具可供选择和调用。返回的 handler 表示正在进行的运行；当我们 `await handler` 时，ReAct 循环会按需要执行，先检索正确工具，调用它们，然后基于工具输出综合生成一个有依据的响应。

和前一个示例一样，如果你的硬件允许，在想要获得稳定结果时，你可能希望切换到更强大的模型。对我来说，`Gemma3:12b` 的行为明显更稳定：它更可靠地遵循“使用工具”的指令，更经常选择预期的 HR 政策工具，并基于实际检索到的内容生成更干净的最终答案，而不是直接猜测。

### 大型工具库的实践指导

在看过工具检索如何运作之后，下一步是确保你的工具库在持续增长时仍然可用。因此，下面是一些当工具集从小规模扩展出去时最重要的设计规则：

像给 LLM 写 API 文档一样写工具描述。LlamaIndex 工具是供 AI 模型消费的，不是供人类消费的。你的描述应该解释工具的用途、何时使用它，以及它返回什么。如果两个工具做的事情相似，要明确说明区别。定义工具就像为智能体定义 API 接口。

尽量避免工具同义词。如果你有三个听起来都像“搜索文档”的工具，模型就会挣扎。要么合并它们，要么让它们的边界清晰。例如：“search policies” 与 “search contracts” 与 “search tickets”。

按能力分组工具，并在正确粒度上建立索引。有时正确单位是单个工具。有时则是代表一个服务的 `ToolSpec`。如果你的工具清单非常庞大，先索引工具包，然后在工具包内部检索，可能会很有用。`ObjectIndex` 足够灵活，可以索引任意对象，而不仅仅是 `BaseTool`。

像调优 RAG 一样调优检索。工具检索有类似文档检索的旋钮：`top_k`、相似度阈值、embedding 模型选择，以及你的工具文本质量。把它当成一个真正的检索问题，你就会得到可预测的改进。

## 使用 AgentWorkflow 编排智能体

在上一节中，我们解决了一个非常具体的问题：当工具清单增长时，我们不能继续把每个工具定义都倒进 prompt，然后期待模型表现良好。工具检索通过为每个请求缩小工具菜单来解决这一点。

但一旦你扩展了工具层，第二个扩展问题几乎会立刻出现：单个智能体循环有时并不够。

人类社会是通过专业化发展起来的。早期人类是通才，自己处理各种任务；但随着社区增长，人们开始专注于特定角色，例如狩猎、耕作、制工具等。这并不仅仅是为了效率，也是为了深度。一个专职铁匠能够精进出通才永远无法掌握的技术。专业化创造了边界，使每个领域都可以独立推进，同时为整体进步做出贡献。架构智能体系统时，同样的原则也适用。

大多数真实任务并不像“调用一个工具，写一个答案”那么简单。它们更像一个有多个阶段的小项目。你收集上下文，决定要做什么，执行动作，并对结果做合理性检查。有时你甚至会停下来请求审批。如果把所有这些都强塞进一个智能体 prompt，就会得到一个困惑的智能体，它同时试图扮演所有这些角色。

多智能体设置在真实部署中出现的另一个原因是安全和访问控制。在严肃系统中，并不是每种能力都应该暴露给每个决策循环。你可能有一些只读工具，可以广泛、安全地暴露；也可能有一些写入工具，应该只存在于一个受到严格约束的智能体内部，并在更严格的认证、日志和审批规则下运行。把职责拆分到多个智能体中，可以让你清晰地执行不同安全范围：研究智能体可以检索事实和证据，而执行智能体可以执行副作用任务，并且这可能只有当工作流显式交出控制权时才会发生。

编排本质上是一个工作流问题。不同之处在于，现在的步骤通常是独立的智能体循环，而不是固定函数。`AgentWorkflow` 是连接这两个世界的桥梁。它给你同样的工作流式结构和可观测性，但把智能体自主性放在定义清晰的边界之内。

### 为什么要编排多个智能体？

如果你在构建玩具示例，一个带一组工具的智能体感觉非常完美。然而在生产中，你通常至少会碰到以下痛点之一：

任务天然会拆分成不同角色。例如，一个组件应该检索事实，另一个应该评估政策风险，另一个应该为特定受众改写最终答案。

有些工具安全，有些工具不安全。从数据库读取是低风险的。创建工单、发送消息或修改记录则不是。

你需要显式关卡。并非所有事情都应该自动执行，即使智能体有能力这么做。

编排就是一种策略，用于分离这些关注点，同时不失去智能体行为的好处。你允许模型做决策，但你塑造这些决策可以发生的位置，并让整体运行过程保持可检查。

在接下来的几节中，我们将理解 `AgentWorkflow` 实际如何工作。我们会先从其执行模型开始，然后进入智能体之间 handoff 的设计、常见编排模式，例如 router-specialists、planner-workers、producer-reviewer，高风险决策中的 human-in-the-loop 关卡，以及让多智能体系统保持可预测的 guardrails。

`AgentWorkflow` 构造本质上就是为了构建一个运行智能体的工作流。回想第 8 章的工作流模型：步骤响应事件，状态保存在上下文中，执行过程可以被流式输出和追踪。

`AgentWorkflow` 遵循同样思想：你不再自己连接每一个决策，而是连接决策发生的场域。在高层，一个 `AgentWorkflow` 运行如下：

用户请求进入工作流。

工作流选择一个当前智能体，通常称为 root agent。

该智能体运行自己的循环：它可以推理、调用工具、更新记忆，并产生答案或请求 handoff。

如果发生 handoff，工作流会把控制权路由到下一个智能体，并保持共享状态一致。

当工作流发出最终响应，或暂停等待人工输入时，运行结束。

最后一点很重要。对于工作流来说，暂停和恢复并不是 hack。它是执行模型的一部分。一旦智能体编排建立在这之上，增加审批关卡或澄清问题就会成为正常的架构动作，而不是在 UI 层硬贴上去的东西。

### Handoff 才是关键

人们在多智能体系统中最常犯的实际错误，是把 handoff 当成机器人之间的自由聊天。这会导致乒乓行为和不清晰的职责边界。你希望 handoff 更像内部 API。

一个好的 handoff 包含：

用一句话说明用户目标。

简要总结前一个智能体已经采取的动作以及观察到的结果。

目前发现的关键事实，以及它们来自哪里。

接收智能体应该回答的开放问题。

任何约束，例如：“不要执行写入动作”。

如果你保持 handoff 结构化，会立刻获得两个好处：

你可以把系统当作工程来推理。你可以回答：“我们为什么在这里切换智能体？”

你可以清晰地调试失败。如果选错了智能体，那是路由问题。如果选对了智能体但它选择了错误工具，那是工具 metadata 或检索问题。如果工具调用正确但最终答案错误，那是推理和 grounding 问题。

### 少量编排模式覆盖大多数真实系统

外面有很多花哨的多智能体图。在实践中，大多数生产系统最终会落在少数几种模式上，因为它们保持可理解：

Router and specialists：一个根智能体读取请求，并决定哪个专家应该处理它。router 的职责是选择，而不是解决问题。这与工具检索设置天然匹配：每个专家可以有自己的 retriever 和自己的工具库。

Planner and workers：一个智能体把任务拆解成步骤，并委派执行。关键是 planner 不要试图自己做所有事情。它把具体子任务交给拥有更窄说明和更小工具菜单的 worker。

Producer and reviewer：一个智能体生成草稿答案，另一个智能体检查它。当错误会带来有意义后果时，这种模式很有价值。即使 reviewer 也是一个 LLM，分离角色也会带来更一致的结果。reviewer 可以发现 producer 因为急于提供帮助而跳过的问题。

注意这里的主题：当每个智能体都有清晰身份和有限表面时，编排效果最好。

### Human-in-the-loop 编排

在人最有价值的地方，通常包括：

副作用发生之前的审批关卡：如果一个工具可以创建、修改或发送某些东西，除非你处在一个受控、低风险环境中，否则应该假设它需要审批关卡。举几个例子：安排或取消与外部利益相关方的日历会议，执行数据库迁移，或修改生产数据库 schema。实现模式很直接：智能体提出一个动作 payload，工作流暂停等待审批。

这里的关键细节是 payload 必须易于评估。一个好的模板应该包括工具名称、将要执行的精确参数、简短理由、预期影响，也许还包括建议。然后用户可以批准、拒绝或编辑。这会把智能体自主性转变成智能体辅助，而这正是大多数组织真正想要的东西。

高风险内容的审查关卡：即使不涉及风险工具，输出本身也可能是高风险的。法律摘要、合规声明或政策解释通常属于这类。这里人工不是在批准一个动作，而是在批准主张和措辞，并且这些答案很可能具有某种法律影响。在这些场景中，当工作流呈现一份紧凑草稿、生成它所依据的支持上下文，例如工具输出、检索片段等，以及一组可能需要验证的主张时，reviewer step 会最有效。

请求不充分时的澄清关卡：当用户请求模糊时，工具检索和工具调用都会受到影响。可靠系统不应该猜测并冒幻觉风险。可以提示智能体识别不充分的请求，并在继续之前提出有针对性的问题。它问一个有针对性的问题，然后再继续，例如：“我们要把这条政策应用到哪一类员工？”这是一个很小的介入，但可以防止大量浪费的工具调用和错误输出。

信心较低时的升级关卡：有时正确行为是停止。不是因为模型无法回答，而是因为系统没有检索到足够 grounding。在这些情况下，工作流可以显式升级。例如：“我没有找到支持这一例外的政策文本。”然后人工操作员可以决定是否扩大搜索、补充缺失上下文，或者结束流程。

### 生产系统中的异步挑战

大多数 human-in-the-loop 演示都假设同步聊天：用户在线，并立即批准。然而生产流程通常是异步的：审批可能发生在长时间运行任务或持续多天的合规审查期间；需要审批的人也可能离线数天，这会改变实现方式。你需要持久状态，使工作流可以暂停数小时或数天；需要通知，让人知道有事情在等待；需要超时和升级规则，以应对审批迟迟不来的情况；还需要恢复逻辑，确保流程能够从暂停位置准确重启。

你可以把它看作随着系统变得更加真实，可以添加的三层控制。当工具输出很大时，可以使用 load-and-search 模式，这样单次工具调用不会淹没 prompt。当工具清单增长时，可以依赖工具检索，使模型每个查询只看到小而相关的工具子集。当任务本身变复杂时，可以引入 `AgentWorkflow`，把工作拆分成角色和阶段，在运行期间保持共享状态，并在真正有意义的地方添加人工审批关卡。

### 防止编排陷入混乱的 Guardrails

另一个需要注意的问题是，如果你不约束编排式智能体，它们仍然可能失控。不同之处在于，通过 `AgentWorkflow`，你有清晰的位置可以放置 guardrails。下面列出实践中通常最重要的一些潜在 guardrails：

每个智能体的工具权限：有些智能体应该设计为只读。如果一个智能体的角色是“研究”，它甚至不应该看到写入工具。

结构化输出验证：使用 `output_cls`（Pydantic）或 `structured_output_fn` 对智能体结果强制执行 schema，这样即使智能体推理过程混乱，它返回给工作流的内容也仍然可预测，并且可被机器消费。

迭代限制：你需要为任何单个智能体可以循环多久，以及整个工作流可以运行多久，设置可预测的上限。

Handoff 约束：不是每个智能体都应该被允许 handoff 给其他所有智能体。限制 handoff 路由可以防止循环行为。

显式停止条件：如果工具检索没有返回任何相关内容，正确的下一步通常是澄清，而不是随机调用工具。

可追踪执行：因为编排建立在工作流之上，你可以流式输出事件，并保留一份清晰记录，逐步展示发生了什么。

你可以看到这些 guardrails 如何契合编排的整体主题。我们不是试图消除自主性。我们是在把自主性塑造成一种可以运营和调试的东西。

既然架构和 guardrails 已经讲完，让我们看看所有这些如何在一个工作示例中组合起来。

## 综合起来：一个多智能体示例

智能体编排是小型本地模型最容易失败的地方之一。路由决策会变得不稳定，handoff 会变得嘈杂，工具使用遵循度会下降。像 `Gemma3:4b` 这样较小的模型很难处理这类多步骤协调。在这个示例中，我使用 `Qwen3.5:9b`，它能足够好地处理结构化 prompt 和多智能体 handoff，从而可靠演示这些概念。如果你可以访问云 API，例如 OpenAI 的 GPT Mini 类模型或 Anthropic 的 Claude Haiku，那么它们会表现得更加一致。

运行示例前，请确保你已经下载模型。`Qwen3.5:9b` 下载大小约为 6.6 GB，因此你至少需要 7 GB 可用磁盘空间。使用以下命令拉取模型：

```code
ollama pull qwen3.5:9b
```

```javascript
import asyncio
from llama_index.core import Settings
from llama_index.core.agent.workflow import (
    AgentOutput,
    AgentWorkflow,
    ReActAgent,
    ToolCall,
    ToolCallResult,
)
from llama_index.core.workflow import Context
from llama_index.llms.ollama import Ollama
```

我们从 agent workflow 模块导入 `AgentWorkflow` 和 `ReActAgent`，以及将在运行期间用于观察发生情况的事件类型：`AgentOutput`，也就是每个推理步骤后的模型响应；`ToolCall`，即即将发生的工具调用；`ToolCallResult`，即完成后的工具调用输出。我们还从 workflow 模块导入 `Context`，因为智能体将通过共享状态存储使用它在彼此之间传递数据。由于我们不会使用常规 Gemma 模型，因此也不再像往常一样导入 `models_config`，而是直接使用 `Settings` 来设置底层 LLM：

```ini
Settings.llm = Ollama(
    model="qwen3.5:9b",
    base_url="http://localhost:11434",
    temperature=0.0,
    context_window=16000,
    request_timeout=120.0,
)
```

如前一个代码块所示，我们把 LLM 设置为 `Qwen3.5:9b`，并将 `temperature=0.0` 以获得确定性行为。

构建智能体式工作流时，将 LLM temperature 设置为 0 或接近 0 通常是个好主意。智能体需要对调用哪个工具、传什么参数、何时 handoff 做出一致决策，而这些都受益于确定性行为。更高 temperature 可能产生更有创意的最终答案，但也会增加错误工具调用、参数格式错误或不可预测路由决策的概率。如果你需要创造性输出，可以考虑让推理智能体保持低 temperature，而只在最终响应撰写步骤中提高 temperature。

接下来，我们定义 `PolicyAgent` 将用来查找费用规则的工具：

```python
def lookup_expense_policy(category: str) -> str:
    """Look up the reimbursement policy for an expense category."""
    category_lower = category.lower()
    if any(
        term in category_lower
        for term in ("monitor", "hardware", "equipment", "work equipment")
    ):
        return (
            "External monitors are reimbursable up to 250 EUR when used for "
            "remote work. A receipt is required for hardware expenses over "
            "50 EUR."
        )
    return (
        "General business expenses are reimbursable when they are work-related, "
        "reasonable, and supported by a receipt."
    )
def lookup_worker_rules(worker_type: str) -> str:
    """Look up reimbursement rules for a worker type."""
    worker_type_lower = worker_type.lower()
    if "contractor" in worker_type_lower:
        return (
            "Contractors may expense approved work equipment only after manager "
            "approval. The approval must be obtained before reimbursement."
        )
    if "employee" in worker_type_lower:
        return (
            "Full-time employees may expense approved work equipment directly, "
            "as long as the expense follows the category policy."
        )
    return (
        "The worker type is not recognized. Apply the strictest rule and ask "
        "for manager approval before reimbursement."
    )
```

现在我们再定义两个工具，用于处理智能体之间的共享状态：

```python
async def save_policy_finding(ctx: Context, finding: str) -> str:
    """Save the policy finding for the response agent."""
    async with ctx.store.edit_state() as ctx_state:
        ctx_state["state"]["policy_finding"] = finding

    return "Policy finding saved."

async def read_policy_finding(ctx: Context) -> str:
    """Read the saved policy finding."""
    state = await ctx.store.get("state", default={})
    finding = state.get("policy_finding")

    if not finding:
        return "No policy finding was saved."

    return finding
```

工具准备好之后，我就可以定义两个智能体，并把它们连接进一个 `AgentWorkflow`：

```ini
async def main() -> None:
    policy_agent = ReActAgent(
        name="PolicyAgent",
        description=(
            "Looks up expense policy rules and saves a concise policy finding."
        ),
        tools=[
            lookup_expense_policy,
            lookup_worker_rules,
            save_policy_finding,
        ],
        can_handoff_to=["ResponseAgent"],
        llm=Settings.llm,
        max_iterations=8,
        verbose=False,
        streaming=False,
        system_prompt=(
            "You are PolicyAgent. Inspect the user's request, identify the expense "
            "category and worker type, then use the available tools to check the "
            "relevant policy. Save one concise policy finding. After saving it, hand "
            "off to ResponseAgent. Do not write the final answer."
        ),
    )

    response_agent = ReActAgent(
        name="ResponseAgent",
        description=(
            "Writes the final employee-facing answer from the saved policy "
            "finding."
        ),
        tools=[read_policy_finding],
        can_handoff_to=[],
        llm=Settings.llm,
        max_iterations=4,
        verbose=False,
        streaming=False,
        system_prompt=(
            "You are ResponseAgent. Call read_policy_finding exactly once. "
            "Then write the final answer in plain language. Keep it short. "
            "Do not invent policy details."
        ),
    )

    workflow = AgentWorkflow(
        agents=[policy_agent, response_agent],
        root_agent=policy_agent.name,
        initial_state={"policy_finding": ""},
        timeout=120,
        verbose=False,
    )
```

每个智能体都是一个 `ReActAgent`，并且都有清晰角色。`PolicyAgent` 有三个工具：两个 lookup 函数和一个 save 函数；并且 `can_handoff_to=["ResponseAgent"]`，这意味着当它完成工作后，可以转交控制权。`ResponseAgent` 只有一个工具，即 `read_policy_finding`，并且 `can_handoff_to=[]`，这意味着它是最终节点，不能再 handoff 给任何人。每个智能体的 `system_prompt` 都明确定义了它的角色和边界：`PolicyAgent` 被要求查找信息并保存发现，而不是写最终答案；`ResponseAgent` 被要求读取发现并写答案，而不是编造细节。这正是我们前面讨论过的 guardrails 的直接应用：每个智能体的工具权限和显式角色边界。

`AgentWorkflow` 本身接收智能体列表，指定 `PolicyAgent` 为 `root_agent`，也就是接收初始用户消息的智能体，并设置一个 `initial_state` 字典，它将存在于共享 `Context` 中。`timeout` 参数确保如果出现问题，工作流不会无限运行。

```python
user_msg = (
        "A contractor asks whether they can expense a 180 EUR monitor for "
        "remote work. Check the policy and write a short answer."
    )
    print(f"INPUT: {user_msg}")
    handler = workflow.run(user_msg=user_msg)
    current_agent = None
    async for event in handler.stream_events():
        agent_name = getattr(event, "current_agent_name", None)
        if agent_name and agent_name != current_agent:
            current_agent = agent_name
            print(f"\nAGENT: {current_agent}")
        if isinstance(event, AgentOutput):
            if event.tool_calls:
                tool_names = [call.tool_name for call in event.tool_calls]
                print(f"PLANNED TOOLS: {tool_names}")
        elif isinstance(event, ToolCall):
            print(f"CALLING TOOL: {event.tool_name}")
            print(f"TOOL INPUT: {event.tool_kwargs}")
        elif isinstance(event, ToolCallResult):
            print(f"TOOL RESULT: {event.tool_output}")
    response = await handler
    print("\nFINAL RESPONSE:")
    print(str(response))

if __name__ == "__main__":
    asyncio.run(main())
```

我们调用 `workflow.run()`，它返回一个 handler，然后遍历 `handler.stream_events()` 来实时观察工作流。事件循环会检测智能体切换，当 `current_agent_name` 发生变化时，就说明发生了 handoff；它会打印 `AgentOutput` 事件中的计划工具调用，展示每个 `ToolCall` 及其输入参数，并在工具完成后显示 `ToolCallResult`。这就是我前面讨论的可观测性：因为 `AgentWorkflow` 构建在工作流事件系统之上，所以不需要额外插桩，每一步都是可见的。

下面是运行这个示例得到的实际输出：

```vbnet
INPUT: A contractor asks whether they can expense a 180 EUR monitor for
remote work. Check the policy and write a short answer.

AGENT: PolicyAgent
PLANNED TOOLS: ['lookup_worker_rules']
CALLING TOOL: lookup_worker_rules
TOOL INPUT: {'worker_type': 'contractor'}
TOOL RESULT: Contractors may expense approved work equipment only after manager approval. The approval must be obtained before reimbursement.
PLANNED TOOLS: ['lookup_expense_policy']
CALLING TOOL: lookup_expense_policy
TOOL INPUT: {'category': 'equipment'}
TOOL RESULT: External monitors are reimbursable up to 250 EUR when used for remote work. A receipt is required for hardware expenses over 50 EUR.
PLANNED TOOLS: ['save_policy_finding']
CALLING TOOL: save_policy_finding
TOOL INPUT: {'finding': 'Contractors can expense a 180 EUR monitor for remote work. External monitors are reimbursable up to 250 EUR when used for remote work. A receipt is required for hardware expenses over 50 EUR. However, contractors must obtain  manager approval before reimbursement for work equipment.'}
TOOL RESULT: Policy finding saved.
PLANNED TOOLS: ['handoff']
CALLING TOOL: handoff
TOOL INPUT: {'to_agent': 'ResponseAgent', 'reason': 'Policy finding has been saved. Ready to write the final answer to the user.'}
TOOL RESULT: Agent ResponseAgent is now handling the request due to the following reason: Policy finding has been saved. Ready to write the final answer to the user.
Please continue with the current request.
AGENT: ResponseAgent

FINAL RESPONSE:
Yes, you can expense a 180 EUR monitor for remote work. According to our policy:
External monitors are reimbursable up to 250 EUR when used for remote work (your 180 EUR monitor qualifies)
A receipt is required for hardware expenses over 50 EUR
As a contractor, you must obtain manager approval before reimbursement for work equipment

Please ensure you have a receipt and get manager approval before submitting your reimbursement request.
```

注意，handoff 本身也显示为一次工具调用。`AgentWorkflow` 将 handoff 实现为智能体可以调用的工具，这意味着它遵循与任何其他工具调用相同的可观察模式。

作为参考，官方 LlamaIndex 文档在以下地址维护了更多 `AgentWorkflow` 和多智能体编排示例：[docs.llamaindex.ai/en/stable/u…](https://docs.llamaindex.ai/en/stable/understanding/agent/multi_agent_pattern/)。这些示例会跟踪 API 变化，并覆盖我在这里展示之外的更多模式。你可以把它们作为本节内容的补充。

## 总结

在下一章中，我们将从构建智能体转向定制和部署它们。我们将探索如何替换和配置 RAG 组件，如何使用不同本地运行时，以及如何把我们的 Contract Review Expert 应用打包成一个 Streamlit 应用并部署。

