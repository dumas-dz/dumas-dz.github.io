---
title: LlamaIndex - Workflow 构建智能应用
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - Workflow
---

---

本章介绍 LlamaIndex Workflow 事件驱动架构——介于简单 RAG 和 Agent 之间的最佳平衡点，支持分支、重试、并行执行、人工审批等生产级特性。

## 技术要求

本章需要在环境中安装 LlamaIndex Workflows 包：

## 理解 workflows 及其使用场景

有时候，构建 RAG 应用感觉就像杂耍。一开始，你只需要抛一个球：加载一些数据，建立索引，然后查询。接着你又加了一个球：重新排序。再加一个：引用检查。再加一个：工具调用。等你反应过来时，你已经同时抛着五个东西了，而一个小错误就会让一切崩盘。

简单来说，workflow 是一种结构化方式，用来告诉你的应用：

- 需要发生哪些步骤
- 这些步骤应该以什么特定顺序发生
- 如何处理过程中的异常或特殊情况

它们的一个关键特性是：workflows 并不是将一串刚性的步骤硬连接起来，而是事件驱动的。每个步骤会监听事件，并决定接下来要做什么，这让逻辑更自然，也更容易扩展。

要真正看到 workflows 的价值，值得先看看开发者在构建 LLM 驱动应用时通常会走的常见路径。总体来说，开发者通常会采用三种架构方法之一：简单流水线、agent-first 系统，或结构化 workflows。

### 简单 RAG 方法

到目前为止，本书中的所有示例都遵循单一、简单的 RAG 模式。简单 RAG 应用的工作方式是：接收用户查询，检索相关节点，并将它们传给 LLM 进行响应合成。这种直线式方法适合演示和小型原型。问题在于，真实世界中的查询很混乱：用户的问题很模糊，索引存在缺口，API 也会失败。如果你的流水线没有分支、没有重试、没有防护措施，它很容易崩溃，用户在遇到几次糟糕答案后就会离开。这就是为什么很多快速粗糙的 RAG 项目永远无法越过概念验证阶段。

真实世界中的 RAG 应用很少是一条直线。有时你需要同时查询多个索引并组合结果。有时你希望中途停下来，向用户展示部分结果，并且只有在用户批准后才继续。有时你可能需要重试某个步骤，因为 API 超时了。手写所有这些逻辑很快就会变得混乱。正如我们很快会看到的，workflows 通过内置支持分支、重试和错误处理，正好解决了这些限制。

### Agents：黑盒

在光谱的另一端，是 agent-first 应用。我们会在接下来的两章中讨论 agents。把所有决策都委托给 LLM，也就是 agent-first 哲学，听起来很诱人：只需给 LLM 一组工具，然后让它在推理循环中自己搞定。需要检索？给它一个 retriever 工具。需要引用？给它一个 summarizer 工具。问题解决了……理论上是这样。

在实践中，agents 可能感觉像黑盒。它们可能花 20 步推理一个本该 2 步解决的问题。它们可能选择错误工具，或者陷入无尽循环。它们强大，但不可预测，这也是许多基于 agent 的应用在生产中失败的原因。它们可能在实验室表现很好，但在真实场景中，经常会消耗大量 token、增加延迟，并在跑偏时让用户沮丧。

### Workflows：两者的最佳结合

Workflows 位于这两个极端之间。像简单 RAG chains 一样，它们结构化且可预测：你定义步骤、顺序和规则。像 agents 一样，它们可以灵活且自适应：你可以在需要时添加分支、并行步骤，甚至人在回路审批。结果是逻辑更清晰、性能更好，而且随着产品需求变化，系统更容易演进。

与简单的 prompts 和 retrievers 链相比，workflows 更灵活，也更容易维护。与自由形式的 agents 相比，它们更透明，也更容易控制。你可以把它们看作硬编码流水线和有时像黑盒一样的 agents 之间的中间地带。Workflows 还会保留共享状态，所以你不必手动到处传递同一份数据，并且它们具备生产就绪特性，例如异步执行、流式输出和内置可观测性。

### Agents 是否聪明过头了？

确实，agents 有时被过度炒作了。在许多实际应用中，你并不真的需要那种自由形式的决策能力。事实上，大多数业务使用场景从结构化、高效且确定性的 workflow 中获得的收益，要大于一个以不可预测方式即兴发挥的 agent。

那么，什么时候应该坚持简单 RAG，什么时候需要 agents，什么时候 workflows 更合适？图 8.1 将其拆解成一个简单决策树：

**图 8.1 —— 根据灵活性和可预测性需求，在简单 RAG、workflows 和 agents 之间选择**

可以这样理解：

简单 RAG 是一条直路。在遇到岔路或障碍之前，它都很好用。Agents 是越野车。它们可以到任何地方，但有时会卡在荒郊野外。Workflows 则像设计良好的高速公路，有出口、高架和绕行路线。你知道自己要去哪里，但如果交通状况变化，仍然有选择。这就是 workflows 对 RAG 如此强大的原因。它们给你流水线的清晰性，同时又有 agents 的灵活性，而且让应用更容易调试、测试，并扩展成商业产品。

到最后，你将能够把 RAG 中那种杂耍式操作，变成一场经过精心编排的表演：更快、更智能，也更容易维护。

## 构建一个简单 workflow

```perl
pip install llama-index-workflows
```

我会展示一个非常简单、只有两个步骤的 workflow：第一步调用 LLM 生成答案，下一步在返回前重新格式化这个答案：

```python
import asyncio
import models_config
from llama_index.core import Settings
from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Event,
)

class Generated(Event):
    text: str

class SimpleWorkflow(Workflow):
    @step()
    async def generate(self, ev: StartEvent) -> Generated:
        query = ev.get("query")
        llm = Settings.llm
        response = await llm.acomplete(query)
        return Generated(text=response.text)

    @step()
    async def summarize(self, ev: Generated) -> StopEvent:
        llm = Settings.llm
        prompt = f"reply only with a one-sentence summary of this text:\n\n{ev.text}"
        summary = await llm.acomplete(prompt)
        return StopEvent(result=summary.text)

async def main():
    workflow = SimpleWorkflow(timeout=30)
    result = await workflow.run(query="Who was Albert Einstein?")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

让我们理解这段脚本中实际发生了什么：

`SimpleWorkflow` 类继承自 `Workflow`，它充当主容器，通过协调步骤和在步骤之间传递事件，编排整个流程。

在这个 workflow 中，每个被 `@step` 装饰的函数都代表一个独立执行阶段：`generate` 步骤接收输入查询，与 LLM 交互，并生成完整答案；而 `summarize` 步骤接收生成的答案，并将其压缩成更短的摘要。

事件充当连接这些步骤的胶水。执行从 `StartEvent` 开始，之后 `generate` 步骤返回一个自定义 `Generated` 事件，其中包含响应文本。`summarize` 步骤监听这个 `Generated` 事件，对其进行处理，最后返回 `StopEvent`，表示 workflow 结束。

`run()` 方法开始执行。我们首先提供 query，然后 workflow 会一步一步运行，直到到达 `StopEvent`。输出会类似如下：

```css
Albert Einstein was a revolutionary physicist who fundamentally changed our understanding of space, time, and the universe through groundbreaking theories like relativity and his iconic equation E=mc².
```

这个小示例展示了核心思想：步骤产生事件，事件触发其他步骤，而 workflow 会在到达 stop event 时停止。只用几行代码，你就已经在 workflow 结构之上构建了一个结构化的两步流程。

在前面的示例中，每个步骤只运行一次，但 workflows 也可以循环，例如在重试验证直到结果正确时。我们会在本章后面探索这种模式。

下一节中，我们会详细剖析每个元素，然后探索与 workflows 相关的更高级概念。

## 理解 workflow 的核心元素

在看到一个简单两步 workflow 如何运行后，是时候退一步看看 workflow 的构建块了。从外观上看，workflow 可能只是一些带 decorators 的 Python 代码，但其底层有明确定义的结构。理解这种结构会让你更容易设计、扩展和调试自己的 flows。

从最高层看，一个 workflow 由四个概念组成。前三个我们已经在前面的示例中见过：workflow 类本身、定义其行为的 steps，以及在 steps 之间流动的 events。第四个元素，也就是我们还没有接触过的，是 context。这个第四元素是一次 workflow 运行期间持续存在的共享状态，它允许不同步骤记住并复用信息，而不必手动把它到处传递。让我们更详细地逐个看看这些概念。

## `Workflow` 类

`Workflow` 类是编排一切的容器。可以想象一个乐队指挥：他们自己不演奏任何乐器，但会协调乐团中的所有音乐家。

workflow 有几个可以配置的参数：

**Timeouts**：控制 workflow 最多允许运行多长时间。

**Verbosity**：开启或关闭调试日志，使逐步执行可见。

**Observability hooks**：与 tracing 和 monitoring 工具集成，以获得更深层洞察。

Workflows 被设计为异步运行，这使它们非常适合长时间运行任务，例如 LLM 调用或 API / 数据库查询。它们也开箱即用地具备 instrumentation，所以你可以将它们接入 Arize Phoenix 这类 tracing 工具，并在不做额外设置的情况下获得 step-level 可见性。

## Steps

step 基本上就是一个被 `@step` 装饰的函数。每个 step 声明自己接受的事件类型，执行一些逻辑，然后产生一个或多个新事件。在前面的示例中，我们有一个调用 LLM 的 `generate` 步骤，以及一个重新格式化结果的 `summarize` 步骤。你可以按顺序串联 steps，也可以并行运行它们，或者根据条件在它们之间分支。

Steps 在设计上是模块化的，这意味着你可以添加、移除或重新排序它们，而不必重写其他所有内容。此外，由于这种模块化，一旦你定义并验证了一个 step，也可以将它集成到不同应用中，而不必重新构建同样逻辑。

`@step` decorator 还有另一个关键功能：它会推断并验证输入和输出事件类型，因此你的 workflow 在运行之前就会被检查正确性。

## Events

将 steps 粘合在一起的是 events 系统。每个 workflow 都从 `StartEvent` 开始，它会包装你传给 `run()` 方法的输入。然后，steps 会监听它们被配置监听的事件类型。当某个 step 完成时，它会发出新事件，这些事件随后被路由到下一个匹配的 steps。

## Context

除了 events，workflows 也提供 context。你可以将其理解为一次运行期间持续存在的共享内存。当你希望某些内容可供多个步骤使用，但又不想通过一长串事件显式传递时，context 特别有用。例如，你可能在某个 step 中构建索引，然后在后续检索 step 中复用同一个索引。通过只把它写入 context 一次，你可以避免杂乱，并让 flows 更清爽。

```python
import asyncio
import models_config
from llama_index.core import Settings
from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Event,
    Context,
)

class Generated(Event):
    text: str

class Summarized(Event):
    summary: str
```

在前面的代码块中，imports 提供了我们需要的元素：Python 的 `asyncio` 用于运行异步代码；来自 `models_config` 的 LLM 配置；以及 LlamaIndex 的关键 workflow 原语：`Workflow`、`StartEvent`、`StopEvent`、`step`、`Event` 和 `Context`。

在 imports 之后，我们定义了两个自定义事件：`Generated` 和 `Summarized`。二者都继承自基础 `Event` 类，但携带特定信息。`Generated` 事件保存 LLM 返回的完整答案，而 `Summarized` 事件保存这个答案的较短版本。下一步是定义 workflow：

```ini
class SimpleWorkflow(Workflow):
    @step(pass_context=True)
    async def generate(self, ctx: Context, ev: StartEvent) -> Generated:
        query = ev.get("query")
        llm = Settings.llm
        response = await llm.acomplete(query)
        await ctx.store.set("raw_answer", response.text)
        return Generated(text=response.text)

    @step()
    async def summarize(self, ev: Generated) -> Summarized:
        llm = Settings.llm
        prompt = f"reply only with a one-sentence summary of this text:\n\n{ev.text}"
        summary = await llm.acomplete(prompt)
        return Summarized(summary=summary.text)

    @step(pass_context=True)
    async def extract_keywords(self, ctx: Context, ev: Summarized) -> StopEvent:
        llm = Settings.llm
        raw_answer = await ctx.store.get("raw_answer")
        prompt = f"extract 5 concise keywords from the following text, comma-separated only:\n\n{raw_answer}"
        kw = await llm.acomplete(prompt)
        keywords = [k.strip() for k in kw.text.split(",") if k.strip()]
        await ctx.store.set("keywords", keywords)
        return StopEvent(result={"summary": ev.summary, "keywords": keywords})
```

`SimpleWorkflow` 类继承自 `Workflow`，这意味着它可以编排一系列通过 events 通信的 steps。在这个类中，我们定义了三个步骤：`generate`、`summarize` 和 `extract_keywords`。每个 step 都用 `@step` decorator 标记，告诉框架它是 workflow 的一部分，也让系统推断每个 step 消费和产生什么类型的 events。接下来，main 函数会把所有内容组合起来：

```css
async def main():
    workflow = SimpleWorkflow(timeout=30)
    result = await workflow.run(query="Who was Albert Einstein?")
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

运行这段代码时，会发生以下事情：

- workflow 开始时，输入 query 被包装进 `StartEvent`，从而触发 `generate` 步骤
- `generate` 步骤调用 LLM，将原始答案保存到 context 中以供后续使用，然后发出 `Generated` 事件
- `Generated` 事件激活 `summarize` 步骤，后者将答案压缩成一句话摘要，并发出 `Summarized` 事件
- `Summarized` 事件触发 `extract_keywords` 步骤。这个 step 从 context 中查找原始答案，从中提取关键词，将它们存回 context，并发出 `StopEvent`
- `StopEvent` 结束 workflow，并将摘要和提取出的关键词作为最终结果返回

由于第三个步骤返回的内容，这一次输出会同时包含摘要和关键词：

```css
{'summary': 'Albert Einstein was a revolutionary physicist who developed groundbreaking theories like relativity and explained phenomena like Brownian motion, fundamentally changing our understanding of the universe and earning him global recognition.', 'keywords': ['Theory of Relativity', 'Space-Time', 'Physics', 'Genius', 'Innovation']}
```

将这些元素组合起来，也就是 workflow 类、steps、typed events 和 shared context，可以同时获得结构性和灵活性。结构性确保你始终知道数据如何在系统中移动，而灵活性允许你在不拆掉整个 workflow 的情况下进行分支、并行化或扩展。

在正常场景中，一个 step 会通过返回 event 推动 workflow 前进。但如果你需要更多控制，也可以使用 `ctx.send_event(event)` 自己向系统推送事件，这让你可以在任何选择的时机触发额外动作。

由于一切都是 async、instrumented 且 type-checked，相比临时拼接的流水线，调试和维护会容易得多。

下一节中，我们将开始应用这些元素，并学习如何设计更高级的 workflows，逐步加入并行执行、循环、分支和 checkpoints 等功能。

## 使用高级 workflow 元素

**Checkpoints**：允许我们保存进度，从而暂停、恢复或从错误中恢复。

**Retries**：允许我们妥善处理错误，而不是让整个 flow 崩溃。

**Branches**：基于条件执行不同路径上的步骤。

**Loops**：允许我们重复某些步骤，直到任务完成或满足某个条件。

## 实现 checkpoints 和 retries

可以把 workflow 想象成数据库中的 transaction。一个 transaction 可能涉及多个操作，例如插入一些行、更新其他行，或运行计算。在理想场景中，它们都会成功。但如果过程中某个环节失败，你并不想失去所有东西并从头再来。这就是 checkpoints 可以提供帮助的地方。就像数据库可以保存中间状态一样，workflow 可以在关键时刻提交进度，这样你可以回滚到最后一个良好状态，而不是从零开始。

在 LlamaIndex 中，checkpoints 就是这些已保存状态。在关键点上，你可以为 workflow 的 `Context` 创建快照，并将所需输入 / 输出放入其中，这样稍后就可以恢复。如果 workflow 之后失败或需要暂停，当你用已保存的 `Context` 恢复时，前面的 steps 可以识别缓存状态并立即返回，避免重复计算。你也可以使用 checkpoints 有意暂停 workflow，例如等待人工审核，然后稍后恢复，而不会丢失上下文。

**Preserving state**：Checkpoints 安全地存储 workflow 的进度和数据。

**Enabling recovery**：它们提供一种在错误后从稳定点重试的选项。

**Supporting pausing**：它们让人在回路和步骤调度成为可能。

LlamaIndex 中的 checkpoints 建立在你已经见过的 `Context` 对象之上。每个 workflow 都有 context，这个 context 可以跨步骤保存状态。默认情况下，这个状态只在单次运行生命周期内存在。一旦 workflow 完成，状态就消失了。但通过 checkpointing，你可以将状态持久化到运行生命周期之外，甚至跨进程重启，并稍后重新加载它，从中断处继续。

根据你需要的 durability 程度，checkpointing 有几种不同形式：

**基础内存状态**：最简单的选项是将值存储在 workflow 实例内部。如果你运行的是短生命周期脚本，并且不需要在崩溃后恢复，这种方式可用；但进程退出后它不会持久化。

**Context store**：更常见的选项是将数据写入 `ctx.store`。这给你 async-safe、可序列化的状态，可以导出为 JSON 等形式，并稍后重新加载。它可以跨 workflow runs 存活，但除非你显式保存快照，否则无法跨运行时错误存活。

**外部 checkpointing**：这特别推荐用于生产级应用。它意味着你可以将 workflows 的 context 连接到外部 store，例如 Redis 或其他数据库。这样，每次到达敏感点时，你都可以把 context 保存到外部 store 中。如果进程意外关闭，例如出现错误后，你可以简单地用保存的 context 重启 workflow，并从最后提交的步骤继续。

但拼图还缺最后一块：如果某个 step 在你到达 checkpoint 之前失败，会发生什么？这种情况下，还没有任何内容被保存，所以你无法恢复，这意味着你被迫重新运行整个 step。这就是 workflow retries 发挥作用的地方。

Retries 是一种安全网，可以在短暂错误冒泡并破坏整个 workflow 之前捕获它们。想象下面这种场景：你调用一个外部 API，而它时不时会超时。你不希望整个 workflow 仅仅因为一次糟糕调用就崩溃。相反，你希望系统自动再试一次，也许等待几秒，再尝试几次，然后才最终放弃。

在 LlamaIndex 中，retries 通过 retry policies 内置于 workflow 系统中。retry policy 会告诉某个 step 在出错时如何表现：

- 应该重试多少次？
- 每次尝试之间应该等待多长时间？
- 等待时间应该保持固定，还是每次变得更长，也就是指数退避？

指数退避是一种简单但强大的方式，用于在某个东西持续失败时拉开重试间隔，也是网络系统中的常见策略。系统不是每隔几秒固定重试一次，而是逐渐增加尝试之间的等待时间。第一次重试可能在 1 秒后，下一次在 2 秒后，以此类推。其想法是避免限流和压垮 API。如果 API 宕机或过载，过于激进的重试只会让情况变得更糟。通过每次增加等待时间，你给系统留出恢复空间，同时仍然保持最终成功的机会。许多真实实现还会加入一点随机 jitter，以避免同步重试风暴。

通过给 step 附加 retry policy，你可以在不手写自定义重试逻辑的情况下，让 workflows 抵御真实世界中不可避免的问题，例如网络抖动、速率限制、不稳定服务等。

Checkpoints 和 retries 彼此互补。Retries 帮你穿越短期故障，并真正抵达 checkpoint。Checkpoints 确保一旦你越过某个里程碑，就不必重做它。二者结合，会让 workflows 稳健得多：既能容忍短暂故障，也能应对更长期中断。

实现 retry policy 最简单的方法，是使用内置的 `ConstantDelayRetryPolicy`。顾名思义，这个 policy 会以固定时间间隔重试失败 step，直到它成功或达到最大尝试次数。不过，如果你需要更高级的 retry 机制，可以在这里找到创建自定义 retry policy 的指导：

是时候看看 checkpointing 和 retries 在实践中的样子了，不是吗？让我们看一个如何在简单 workflow 中实现它们的示例：

```javascript
import asyncio
import random
import models_config
from llama_index.core import Settings
from llama_index.core.workflow import (
    Workflow,
    StartEvent,
    StopEvent,
    step,
    Event,
    Context,
)
from workflows.retry_policy import ConstantDelayRetryPolicy
```

我们从常规 imports 开始：Python 的 `asyncio`、我们的 `models_config`、用于 LLM 访问的 LlamaIndex `Settings`、核心 workflow 原语，最后是 `ConstantDelayRetryPolicy`，它给我们开箱即用的 retry 逻辑。我们还需要 `random` 来模拟 step 执行期间的失败。

```vbnet
class ServiceResult(Event):
    text: str

class Summarized(Event):
    summary: str
```

接下来是两个自定义 events：`ServiceResult` 会携带模拟外部调用的原始输出，而 `Summarized` 会携带之后生成的压缩答案。这些 events 是 steps 之间的胶水：

```python
class CheckpointDemoWorkflow(Workflow):
    @step(pass_context=True, retry_policy=ConstantDelayRetryPolicy(delay=2, maximum_attempts=5))
    async def unreliable_service(self, ctx: Context, ev: StartEvent) -> ServiceResult:
        cached = await ctx.store.get("service_text", default=None)
        if cached is not None:
            return ServiceResult(text=cached)
        query = ev.get("query", "Who was Albert Einstein?")
        if random.random() < 0.5:
            raise RuntimeError("Transient external service error")
        text = f"Service response for: {query}"
        await ctx.store.set("service_text", text)
        return ServiceResult(text=text)

    @step(retry_policy=ConstantDelayRetryPolicy(delay=2, maximum_attempts=5))
    async def summarize(self, ev: ServiceResult) -> Summarized:
        if random.random() < 0.5:
            raise RuntimeError("Summarization failed (simulated)")
        llm = Settings.llm
        prompt = f"Reply with a one-sentence summary of this text:\n\n{ev.text}"
        r = await llm.acomplete(prompt)
        return Summarized(summary=r.text)

    @step(pass_context=True)
    async def finalize(self, ctx: Context, ev: Summarized) -> StopEvent:
        service_text = await ctx.store.get("service_text")
        return StopEvent(result={"service_text": service_text, "summary": ev.summary})
```

workflow 的核心是 `CheckpointDemoWorkflow` 类。第一个 step，也就是 `unreliable_service`，是一个模拟的不可靠外部服务。这个 step 会检查 workflow 的 context store，看之前成功调用是否已经被保存。如果找到了，它就直接复用该值。如果没有，它使用 `random.random() < 0.5` 模拟 50% 的失败概率。成功时，它将结果作为 checkpoint 存储在 `ctx.store` 中。我们的 retry policy 是：如果模拟服务失败，workflow 会自动等待两秒并重试，最多尝试五次。

在示例最后部分，我们使用 main 函数组合所有内容。我们创建 workflow 实例，并用示例查询运行它。如果 workflow 成功完成，就打印结果。如果它在重试后仍然失败，就捕获异常并创建一个新的 workflow。这个新实例使用前一次运行中保存的 context 恢复，因此可以从最后一个 checkpoint 继续，而不是重复不可靠服务调用。

```python
async def main():
    wf = CheckpointDemoWorkflow(timeout=30, verbose=True)
    handler = wf.run(query="Who was Albert Einstein?")

    try:
        result = await handler
        print("RESULT:", result)
    except Exception as e:
        print(f"[run] failed: {e!r}")
        wf2 = CheckpointDemoWorkflow(timeout=30, verbose=True)
        resumed = await wf2.run(ctx=handler.ctx, query="Who was Albert Einstein?")
        print("RESUMED RESULT:", resumed)

if __name__ == "__main__":
    asyncio.run(main())
```

```vbnet
Running step unreliable_service
Step unreliable_service produced an error, retry in 2 seconds
Step unreliable_service produced event ServiceResult
Running step summarize
Step summarize produced an error, retry in 2 seconds
Step summarize produced event Summarized
Running step finalize
Step finalize produced event StopEvent
RESULT: {'service_text': 'Service response for: Who was Albert Einstein?', 'summary': 'This response likely provides a brief biography of Albert Einstein, detailing his groundbreaking contributions to physics, particularly his theories of relativity, and his lasting impact on the world.'}
```

从输出可以看到，retries 帮助 workflow 穿越短暂失败，而 checkpoints 确保某个 step 一旦成功，它的结果就会被安全保存，并且在 resume 时不会被重新计算。二者结合，使流程感觉更有韧性，而不是脆弱。

但韧性并不意味着你应该到处实现 checkpoints。就像数据库一样，真正价值来自策略性使用它们。每个 snapshot 都会增加开销。真正的艺术在于选择正确时刻提交进度。

### 什么时候 checkpoint：设计建议

在有意义的边界添加 checkpoints，而不是到处添加。一个经验法则是，在昂贵或缓慢的步骤之后进行 snapshot，例如 web crawling、大型检索或长时间运行的工具调用，这样后面失败不会迫使你重做昂贵工作。在非幂等动作之前放一个 checkpoint，例如可能产生重复副作用的操作，如发送邮件、扣款或追加日志，以防 retry 时产生重复副作用。考虑在 fan-in 之前，也就是并行分支完成之后添加 checkpoint，这样如果最终 merge 或 synthesis 失败，就不必重新计算多个分支。它们在人工边界处也很有价值，例如你暂停等待审核或批准时，这样可以跨会话安全恢复同一次运行。总体来说，保持 checkpoints 小而有意图：太多 snapshots 会增加开销，太少则可能导致不必要的返工。

有了 checkpoints，你的 workflows 会变得更有韧性，也对用户更友好，而不是脆弱的全有或全无流程。通过使用 checkpoints，我们可以构建能经受崩溃、中断和重试的系统，大幅改善用户体验。

在前面的示例中，checkpoint 只存在于内存中。我们在同一个 Python 进程中复用了 `handler.ctx`，但如果脚本崩溃或重启，就没有任何内容可以加载。要让 checkpoint 持久化，你需要做以下事情：

- 在正确时刻，例如昂贵或关键步骤之后，使用 `ctx.to_dict()` 序列化 workflow context
- 将该 snapshot 写入磁盘，小规模项目可用，或写入专用数据库后端，例如 Redis，适用于生产级应用
- 下一次运行时，检查文件是否存在，用 `Context.from_dict(wf, data)` 重建 context，并将其传入 `wf.run(ctx=.)`

为了更好理解这个机制，可以查看官方文档：

我们已经介绍了如何用 checkpoints 让 workflows 更有韧性。接下来，让它们更灵活。有时，你希望一个 flow 走不同路径，或循环直到获得正确结果。这就是 branches 和 loops 发挥作用的地方。

## 实现 branches 和 loops

并不是每个 workflow 都是一条从开始到结束的直路。有时，你需要转弯。另一些时候，你需要绕回来再试一次。这就是为什么 workflows 可能需要 branching 和 looping。

Branching 关乎选择路径。想象你正在构建一个问答应用。如果用户问 `What's 2 + 2?`，那完全没必要去检索公司文档。你会希望把这个查询路由到 calculator。另一方面，如果用户问 `What's our refund policy?`，你会希望从知识库检索。借助 workflows，你可以添加一个简单分类步骤，决定走哪条分支，并且只运行相关逻辑。

Loops 则关乎当第一次答案不够好时，给系统另一次机会。我们持续迭代，直到结果足够好，或者达到设定限制，然后停止。这种模式特别适合需要结构化输出的任务，例如生成 JSON 或填写表单，也就是小错误常见且重试成本低的场景。

Workflows 的美妙之处在于，你不必硬编码巨大的 if-else 语句，也不必到处写自定义 retry loops。相反，你让 steps 发出接下来应该发生什么的信号。一个 step 可以说“一切正常，继续”，另一个可以说“再试一次”，还有一个可以说“走另一条路径”。workflow 只需要跟随信号。Branches 给 workflows 灵活性，loops 给它们韧性。二者结合，让系统可以处理混乱、不可预测的输入，而不会崩溃，也不会让代码变得不可读。

### 如何保持干净：设计建议

设计 branches 和 loops 时，最好让逻辑保持干净且有意图。应该由一个小而专门的 step 处理分支决策，而不是把逻辑隐藏在更大的 steps 中。Loops 应该始终有限制，三到五次尝试通常足够，这样 workflow 不会永远旋转。最后，要提前思考 branches 应该在哪里重新汇合。例如，calculator 分支和 retrieval 分支最终可能在同一个 validation step 汇合。

- 查看用户查询，并判断它是数学问题还是知识问题
- 将用户查询路由到 calculator 或 knowledge 分支
- 验证结果，如果结果不够好，就循环回去再试一次

在这个示例中，我们不调用任何 LLM；这些步骤只是 mock 操作，目的是保持简单，只聚焦展示 workflow 内部的 branching 和 looping 如何工作。

我们先定义自定义 events。这些 events 是 steps 会发送和监听的信号：math queries、retrieval queries、drafts、fix requests 和 final answers。

```vbnet
import asyncio
from llama_index.core.workflow import (
    Workflow, step, Event, StartEvent, StopEvent
)

class CalcQuery(Event):
    expr: str

class RagQuery(Event):
    question: str

class DraftAnswer(Event):
    text: str

class NeedsFix(Event):
    prior: str

class FinalAnswer(Event):
    text: str
```

第一步是分类。如果查询看起来像数学题，就发出 `CalcQuery`。否则，就把它送入 mock retrieval 路径。

```python
class BranchLoopWorkflow(Workflow):
    @step
    async def classify(self, ev: StartEvent) -> CalcQuery | RagQuery:
        q = ev.get("query", "")
        if any(ch.isdigit() for ch in q) and any(op in q for op in "+-*/"):
            return CalcQuery(expr=q)
        return RagQuery(question=q)
```

接下来，我们有两个分支：calculator 和 retrieval 分支。二者都会产生一个 draft answer：

```less
@step
    async def calculator(self, ev: CalcQuery) -> DraftAnswer:
        try:
            result = str(eval(ev.expr, {"__builtins__": {}}))
        except Exception as e:
            result = f"error: {e}"
        return DraftAnswer(text=result)

    @step
    async def retriever(self, ev: RagQuery) -> DraftAnswer:
        return DraftAnswer(text=f"(draft) answer to: {ev.question}")
```

这里是 loop 出现的地方。validator 会检查 draft 是否足够长。如果不够，就发出 `NeedsFix` 事件。它会循环回 `fix` step，后者重写 draft，并将其重新送入 validator。循环持续到 validation 通过为止。

```less
@step
    async def validate(self, ev: DraftAnswer) -> FinalAnswer | NeedsFix:
        if len(ev.text) < 10:
            return NeedsFix(prior=ev.text)
        return FinalAnswer(text=ev.text)

    @step
    async def fix(self, ev: NeedsFix) -> DraftAnswer:
        return DraftAnswer(text=ev.prior + " (expanded to be clearer)")
```

最后，一旦答案通过验证，workflow 就以 `StopEvent` 结束：

```less
@step
    async def finalize(self, ev: FinalAnswer) -> StopEvent:
        return StopEvent(result=ev.text)
```

如果运行这段代码，数学查询会走 calculator 分支并返回 `4`。RAG 查询会走 retrieval 分支，生成短 draft，并可能循环一两次后通过验证：

```ini
async def main():
    wf = BranchLoopWorkflow(timeout=20, verbose=True)
    print(await wf.run(query="2+2"))
    print(await wf.run(query="Explain RAG workflows"))

if __name__ == "__main__":
    asyncio.run(main())
```

实际输出如下：

```vbnet
Running step classify
Step classify produced event CalcQuery
Running step calculator
Step calculator produced event DraftAnswer
Running step validate
Step validate produced event NeedsFix
Running step fix
Step fix produced event DraftAnswer
Running step validate
Step validate produced event FinalAnswer
Running step finalize
Step finalize produced event StopEvent
4 (expanded to be clearer)
Running step classify
Step classify produced event RagQuery
Running step retriever
Step retriever produced event DraftAnswer
Running step validate
Step validate produced event FinalAnswer
Running step finalize
Step finalize produced event StopEvent
(draft) answer to: Explain RAG workflows
```

## 实现人在回路逻辑

让我们想一个你可能熟悉的业务场景。想象一个支持客服的工具应用，它会根据退款请求起草客户邮件。我们希望系统完成最耗时的部分，比如检索政策、写一封礼貌回复，并引用工单；但我们不希望它在没有人工输入之前直接发送。有些案例很敏感，快速审批或小幅编辑可以避免尴尬消息。

Workflows 让这种模式变得自然。你不需要把阻塞式 prompt 生硬接到代码上，而是让 flow 暂停，展示它的工作，并等待响应。当审核者批准、编辑或拒绝时，workflow 会从刚才停止的地方继续。幕后机制其实就是事件处理：flow 发出“我需要输入”的信号，你的 UI 捕获人类响应，然后 flow 继续。

LlamaIndex Workflows 库包含两个专门为这个场景设计的事件：`InputRequiredEvent` 和 `HumanResponseEvent`。在事件流中，你可以 yield 一个 `InputRequiredEvent` 来表示暂停，稍后再将 `HumanResponseEvent` 送回正在运行的 workflow 以继续执行。你甚至可以中断 stream，在别处收集输入，例如网页表单、Slack 或 CRM 按钮，然后稍后恢复，这非常适合真实审核周期。

我会展示一个简单示例，说明如何用代码实现：

```python
import asyncio
from llama_index.core.workflow import (
    Workflow, step, StartEvent, StopEvent
)
from llama_index.core.workflows.events import (
    InputRequiredEvent, HumanResponseEvent
)

class EmailWorkflow(Workflow):
    @step
    async def draft(self, ev: StartEvent) -> InputRequiredEvent:
        draft = f"Dear {ev.get('customer')}, we approved your refund."
        print("\nDRAFT EMAIL:\n", draft)
        return InputRequiredEvent(prefix="Approve this draft? (yes/no): ")

    @step
    async def review(self, ev: HumanResponseEvent) -> StopEvent:
        if ev.response.lower().startswith("y"):
            return StopEvent(result="Email approved and sent ✅")
        return StopEvent(result="Email rejected ❌")

async def main():
    wf = EmailWorkflow(timeout=30)
    handler = wf.run(customer="Alice")

    async for event in handler.stream_events():
        if isinstance(event, InputRequiredEvent):
            answer = input(event.prefix)
            handler.ctx.send_event(HumanResponseEvent(response=answer))

    print(await handler)

if __name__ == "__main__":
    asyncio.run(main())
```

这个响应由 `HumanResponseEvent` 捕获，workflow 会带着它继续。在我们的例子中，第二步 `review` 会检查输入是否以 `y` 开头，并根据输入是否为 yes 来批准或拒绝邮件。

这之所以可行，是因为 workflows 支持事件流。你不必让 workflow 一次性从头跑到尾，而是可以在事件发生时流式处理它们。这意味着 workflow 可以中途停下来，等待外部输入，例如按钮点击、聊天消息或主管决策，然后从刚才停止的地方继续。context 会保持一切一致，所以 workflow 不会忘记自己正在做什么。这正是让人在回路场景在真实应用中变得实用且非常有价值的原因。

人工输入最好用于清晰决策点，而不是散落在所有地方。在暂停前添加 checkpoint 会很有帮助，这样即使进程重启，workflow 也能安全恢复。保持 prompt 简单且聚焦，因为人类的角色是确认或调整，而不是重做模型工作。也应该添加基础验证和清洗响应，例如检查 yes/no，或限制评论长度，以免随意输入破坏 flow。并且由于答案可能不会立即到达，需要将 flow 设计为可以优雅暂停，并稍后继续而不丢失状态。

要真正充分利用 workflows，你需要思考各个部分如何组合：steps 如何排序、何时分支或并行、哪里添加防护。换句话说，除了单个元素之外，你还需要考虑 workflow 本身的整体架构。这正是我们接下来要处理的内容。

## 设计高效 workflow 架构

我们已经覆盖了各个部件：steps、events、context、checkpoints，甚至人工审批。但就像盖房子一样，拥有正确材料并不保证结构牢固。你如何把这些部件组合起来，也就是 workflow 的架构，比一开始看起来重要得多。

看一下图 8.2，你就能大致感受到一个真实业务 workflow 可能有多复杂。即使是在一个简化的合同分析场景中，也可以看到流程自然包含 checkpoints、用于改进的 loops，以及交付给客户之前的人在回路步骤。

**图 8.2 —— 一个简化合同分析 workflow，展示 checkpoints、反馈 loops 和人在回路审核**

### 为什么 workflow 架构很重要？

因为忽视架构是破坏自己项目最快的方式之一。没有清晰设计，workflows 往往会越来越混乱。Steps 被随意加在有空间的地方，events 以不可预测的方式乱飞，很快你就得到一个“能工作”的东西……直到它不工作。在小规模下，你可能注意不到。系统在 demos 中感觉还不错。但进入生产后，裂缝很快出现：大量延迟、烦人的重试、调试变成猜谜，维护变成噩梦。

所以，与其只是把 steps 串起来直到某些东西能跑，不如停下来思考设计。事情应该按什么顺序发生？我们在哪里分支？什么时候并行运行？哪里添加防护？这些都是架构问题，提前回答它们，会决定你的系统是一个艰难挣扎的原型，还是一个可扩展的生产系统。

## 理解 workflow 的常见架构模式

**Sequential flows**：最自然的设计是一条直线。第一步通向第二步，第二步通向第三步。试着想象公司内部的费用报销流程：员工先提交报销申请，然后系统验证收据，然后发放付款。一件事接着另一件事，以可预测顺序发生。这类 workflow 最容易设计，也最容易调试。你总是知道下一步是什么，如果出错，也确切知道该去哪里看。当然，代价是 sequential flows 没有为意外留下空间。如果某个单独步骤失败，或花太长时间完成，整个 workflow 就会卡住。当我们处理简单、直接的流程时，sequential flow 可能足以正确建模它。对于更复杂的东西，你会开始感到需要更多灵活性。

**Parallel flows**：就像一群团队一起工作。有时候速度比顺序更重要。想象一个市场情报助手需要同时检查多个来源，例如新闻文章、社交媒体讨论和内部分析师报告。如果你一个接一个地运行这些查找，累积等待时间会毁掉用户体验。但如果并行运行，用户更快得到结果，而且不会被最慢的那个瓶颈卡住。它很高效，但也意味着你需要一个合并或协调输出的计划。

**Conditional branching flows**，也就是允许实现决策点的流程：并不是每个查询都一样，把它们都当成一样处理会导致工作浪费或答案糟糕。想象一个回答员工问题的 HR chatbot。像 `Where is the vacation policy?` 这样的问题可能会触发快速文档检索。另一个问题，例如 `How do I apply for parental leave?`，则可能引导到一个更长流程，涉及多个表单和审批。Branching flows 让你干净地处理这些情况。workflow 从评估条件开始。根据结果，它将查询送到某条路径或另一条路径。一条路径可能是快速检索，另一条可能涉及多个步骤和人工签字。相比一刀切，branching 让 workflow 能够适应情况，这使你在建模复杂业务流程时拥有更多灵活性。

**Hybrid flows**：这指的是组合使用条件分支和并行。这可能是最适用的模式，因为真实业务流程，只要不只是简单步骤序列，几乎很少完美匹配其他任何单一模式。想象一个投资机构使用的尽职调查助手。它的 workflow 从一个分支开始：目标公司是 startup 还是 enterprise？这个判断会改变需要运行的检查类型。但在每个分支内部，助手仍然会并行运行多个分析，例如财务指标、新闻情绪、合规风险等，以节省时间。这就是 hybrid flow：部分 branching，部分 parallel。它反映了业务流程的真实复杂性，而不是硬编码每一种单独场景。就像分析师团队会分工，并根据情况走不同路径一样，你的 workflow 也做同样事情，只是希望更快且错误更少。

选择正确模式之后，下一个问题是如何让它在实践中运行良好。当 steps 涉及长时间 LLM 调用或外部 API 时，你如何让它保持快速、可靠且成本有效？你如何确保 workflow 随着使用场景增长而平滑扩展？让我们看看一些面向性能和规模设计的原则。

## 面向性能和规模设计

确定 workflow 模式后，下一项挑战是让它在实践中良好运行。Demos 宽容，因为数据集小、用户有耐心，而且 LLM 调用通常很少。生产环境不是这样。真实用户不会等三十秒才得到答案，API 会在你最不希望的时候限流，token 成本也会快速累积。如果你没有带着性能和规模来设计，即使最好的架构一离开实验室也会停摆。

那么这在实践中意味着什么？

以**异步性**为例。LlamaIndex 中的 workflows 是 async-first，这是有原因的：你希望重叠执行昂贵调用，而不是把它们排进队列。想象一个客服机器人需要查询知识库、从 CRM 获取工单历史，并调用 LLM 起草回复。并行运行这些任务可以从响应时间中削掉宝贵的几秒，让交互感觉即时，而不是迟钝。

另一个要考虑的重要方面是**尽早过滤**。如果 retrieval 步骤拉入 50 个节点，但只有 5 个真正相关，不要把全部 50 个都传到下游，并让 LLM 去整理它们。这是在浪费 token 和时间。

然后是**重试**。外部服务会失败……这就是现实。一个支付应用可能调用银行 API，然后遇到超时。没有 retries，整个 workflow 会失败，用户被晾在那里。有了合理的 retry policy，例如五秒后再试，最多三次，错误对最终用户不可见，workflow 可以继续。关键是要有选择性：考虑在不可靠网络调用等情况下使用 retries，而不是对每个步骤都用。

另一个设计杠杆是**流式输出结果**。一个法律研究助手可能需要几分钟编译完整答案，但它仍然可以通过在准备好时立即流式输出部分发现来保持律师参与感：`Found 12 relevant cases…`，同时 synthesis step 继续运行。用户会感觉系统在与他们一起工作，而不是让他们蒙在黑暗中。在实践中构建 workflows 时，我们可以使用 `write_event_to_stream` 方法实现事件流。下面是一个快速代码示例：

```ruby
class ProgressEvent(Event):
    msg: str

class DemoWorkflow(Workflow):
    @step
    async def step_one(self, ctx: Context, ev: StartEvent) -> StopEvent:
        ctx.write_event_to_stream(ProgressEvent(msg="Step one is happening."))
        return StopEvent(result="Done!")
```

只用一行代码，我们就可以把一个沉默黑盒变成一个会在过程中持续告知用户进展的对话式流程。

这里共同的主题是：性能和规模不会偶然发生。它们是关于异步性、过滤、重试、流式输出和成本的有意识选择结果。把这些做好，你的 workflow 不仅能工作，而且即使用量增长，也能很好地工作。

## 保持 workflows 可维护

面向性能和规模设计是一面硬币，另一面是确保你和你的团队能长期与这个 workflow 共处。构建一个今天能跑，但六个月后变成更新、调试或解释噩梦的东西，非常容易。Workflows 和其他任何软件一样，都需要可维护。

我经常看到的一个陷阱是把所有东西都堆进一个大 flow 中。构建一个巨大的类、十几个 steps、一团 events，感觉很方便；但一旦需求变化，你就迷路了。更好的方法是保持 steps 模块化，并使用非常清晰的命名约定。如果你的队友无法从 step 名称猜出它做什么，那它可能太模糊了。例如，`summarize_policy` 就自解释，但 `step2` 不是。

另一个建议是将相关 steps 分组成 sub-flows。可以把它想象成包装：你不会把一百颗散装螺丝和电线寄给客户；你会寄一个产品。Sub-flows 在代码内部提供同样效果。例如，在理赔处理系统中，所有与文档处理相关的 steps 可以放在一个 sub-flow 中，而资格检查放在另一个 sub-flow 中。

**图 8.3 —— LlamaIndex workflow 可视化：`draw_all_possible_flows()` 方法**

为了熟悉绘制这类图，你可以查看 LlamaIndex 官方文档中关于 workflow visualization 的内容：

这个图不只是用于调试。它是一种与队友和利益相关者沟通的方式。只存在于代码中的 workflow 更难推理；能够被可视化的 workflow 更容易解释、质疑和改进。

黄金法则是：未来的你，或者下一个接手代码的工程师，应该能够打开 workflow，读一遍，然后理解数据如何移动，而不是解一团意大利面。如果能做到这一点，你构建的不只是 workflows，而是可持续系统。

## 将韧性构建进设计

即使有干净架构和良好性能习惯，真实世界系统仍然会抛出曲线球。API 会超时，用户会中途离开，会在升级期间崩溃。demo 应用和生产应用之间的区别，在于你如何优雅处理这些时刻。这就是 resilience 变得非常重要的地方。

最简单的技术之一，是在关键步骤之前使用 checkpoints。想象一个新员工 onboarding workflow。系统收集文档，运行背景调查，然后生成 offer letter。如果一切都在 checkpoints 处保存，当背景调查 API 超时时，你不会丢失整个流程。相反，flow 可以从最后一个安全点重启，并从中断处继续。

韧性也意味着以可预测方式处理失败。一个调用银行 API 的支付助手不能在第一次错误时就崩溃。有了 retry policy，系统会自动再试一次，平滑处理分布式系统中很正常的短暂故障。但 retries 应该聪明：不是无限循环，而是足够多的尝试，在不掩盖深层问题的情况下保持用户体验顺畅。

另一部分是清晰的入口和出口点。当你设计自定义 start 和 stop events 时，你就是在明确定义 workflow 如何插入业务系统其余部分。这种清晰性让重启 flows、恢复状态，甚至重放过去运行以调试都更容易。这是一个小细节，但当事情出错时回报很大。

最后，韧性不仅仅关乎机器。

它也关乎人。敏感流程，例如审批退款、发布财务报告、给出医疗建议等，可能需要人工签字。Workflows 让暂停、等待输入并继续变得自然。当关键事情悬而未决时，韧性意味着让人进入回路，捕获系统可能遗漏的问题。

事实是，没有任何 workflow 永远完美。你想要的是一个能弯曲而不折断的系统，一个在事情不按计划发展时，能够暂停、重试、恢复或优雅交接的系统。这就是聪明原型和可靠产品之间的区别。

## 将 workflows 加入我们的实战项目

我们将介绍两个新模块：`contract_analysis_workflow.py` 和 `contracts.py`。这两个文件共同将 workflow orchestration 带入我们项目的核心：

`contract_analysis_workflow.py` 将合同分析逻辑封装为 LlamaIndex workflow。它并行协调两个分析任务，也就是风险分析和合规检查，然后将结果合并为一份报告。

`contracts.py` 将新的 workflow 集成进 Streamlit 应用。它触发 workflow，等待结果，并将报告保存为 TXT 格式。

## `contract_analysis_workflow.py` 模块

```python
import asyncio
from typing import Optional
from llama_index.core.workflow import (
    Workflow,
    step,
    StartEvent,
    StopEvent,
    Event,
    Context,
)
from analysis import perform_risk_analysis, perform_compliance_check
```

我们导入 `asyncio` 用于 async-first 执行，导入 `Optional` 用于类型提示。从 LlamaIndex Workflows 中，我们导入核心构建块：`Workflow` 基础类、用于定义 workflow steps 的 `step` decorator、入口 / 出口信号 `StartEvent` / `StopEvent`、自定义 events 的基础类 `Event`，以及共享状态和同步工具 `Context`。

接下来，我们定义 events：

```vbnet
class RiskAnalyzed(Event):
    text: str

class ComplianceChecked(Event):
    text: str
```

两个轻量、强类型消息定义了每个 step 发出什么。使用自定义 events 让 workflow 显式且自文档化：任何标记为 `RiskAnalyzed` 或 `ComplianceChecked` 的内容，都携带一个包含分析结果的 `text` payload。

让我们定义 workflow：

```kotlin
class ContractAnalysisWorkflow(Workflow):
```

```ini
@step
    async def risk(self, ev: StartEvent) -> RiskAnalyzed:
        contract_path = ev.get("contract_path")
        policies_index = ev.get("policies_index")

        # Run blocking work in a thread to keep the step async-friendly
        risk_text = await asyncio.to_thread(
            perform_risk_analysis, contract_path, policies_index
        )
        return RiskAnalyzed(text=risk_text)
```

`risk` step 会从 `StartEvent` 中提取输入，并调用 `perform_risk_analysis`。因为这个调用是阻塞型、CPU 密集或 I/O 密集的，所以我们使用 `asyncio.to_thread` 将其派发到 worker thread，以保持 workflow 的 event loop 响应。结果会被包装进 `RiskAnalyzed` event。

LlamaIndex workflows 运行在 async event loop 上。如果某个 step 直接调用 blocking 或 CPU-heavy 代码，而没有用 `asyncio.to_thread` 包装，它会阻塞整个 loop，并阻止其他 steps，例如 compliance step，并发运行。始终用 `await asyncio.to_thread(.)` 派发 blocking work，以保持 workflow 响应。

让我们进入下一个 step：

```ini
@step
    async def compliance(self, ev: StartEvent) -> ComplianceChecked:
        contract_path = ev.get("contract_path")
        policies_index = ev.get("policies_index")
        comp_text = await asyncio.to_thread(
            perform_compliance_check, contract_path, policies_index
        )
        return ComplianceChecked(text=comp_text)
```

第二个 step 与第一个模式相同，但用于 compliance。由于两个 steps 独立声明，workflow engine 可以并发运行它们，与顺序执行相比减少 wall-clock time。一旦两个分支都完成，它们的结果需要被组合。下面的 step 负责这种同步：

```python
@step(pass_context=True)
    async def merge(
        self, ctx: Context, ev: RiskAnalyzed | ComplianceChecked
    ) -> StopEvent | None:
        # Wait for both results to arrive (fan-in)
        data: Optional[tuple[RiskAnalyzed, ComplianceChecked]] = ctx.collect_events(
            ev, [RiskAnalyzed, ComplianceChecked]
        )
        if not data:
            return None
        risk_ev, comp_ev = data
        return StopEvent(result={"risk": risk_ev.text, "compliance": comp_ev.text})
```

`merge` step 使用 `ctx.collect_events(.)` 同步两个分支，这是经典 fan-in 架构模式。在 `merge` step 同时收到 `RiskAnalyzed` 和 `ComplianceChecked` 之前，它会返回 `None`，表示 workflow 继续等待。一旦二者都到达，它会发出 `StopEvent`，其中包含一个合并后的字典。这个结构给了我们清晰性：合同分析 workflow 总是从 `StartEvent` 开始，产生两个中间事件，并以一个合并结果结束。

在生产中，请记住 fan-in 同步点可能成为瓶颈。如果一个分支失败，例如风险分析超时，而另一个成功，`collect_events` 会无限等待，或者直到 workflow timeout。对于更有韧性的设计，可以考虑实现一个 timeout-aware merge，在截止时间后继续处理部分结果；或者让每个分支发出专用 error event，这样 merge step 可以生成降级但仍然有用的报告，而不是整个失败。这在许多 workflows 同时运行的高并发系统中尤其重要。

## `contracts.py` 模块

下一个组件是 `contracts.py`。如前所述，它负责将合同分析 workflow 集成到 Streamlit 应用中。它处理 UI 中与合同管理相关的一切：上传和删除文件、列出现有合同、触发 workflow 进行风险和合规检查，最后保存并显示生成的报告。图 8.4 展示了所有组件就位后 UI 的样子：

**图 8.4 —— 我们的 Contract Review Expert UI**

好了，让我们覆盖代码：

```javascript
import streamlit as st
import os
import asyncio
from utils import save_file, load_policies_index, load_report, list_files
from chat import clear_chat_cache
from contract_analysis_workflow import ContractAnalysisWorkflow
```

我们导入 Streamlit 用于 UI，`os` 用于文件系统操作，`asyncio` 用于桥接异步执行。工具函数处理存储和检索，`clear_chat_cache` 会重置某个合同的缓存 chat engines。我们还导入了刚刚构建的 `ContractAnalysisWorkflow` 模块。

接下来，定义一个小 helper 函数：

```python
def _run_workflow_sync(wf, **kwargs):
    async def _runner():
        handler = wf.run(**kwargs)
        return await handler
    return asyncio.run(_runner())
```

Streamlit callbacks 是同步的，所以这个 helper 用 `asyncio.run` 包装异步 workflow 调用。在内部，我们用 `wf.run(.)` 启动 workflow，并等待 handler 完成，返回最终结果。

下一个函数负责 UI：

```ini
def render_contracts_section(is_analyzing, analyzing_file):
    st.header("📄 Contracts")
    contracts_modified = False
    analysis_started = False
    analysis_completed = False
```

这个函数渲染整个合同管理 UI，并返回三个标志，让调用方知道是否有内容变化、分析是否开始、分析是否完成。这对于协调更大的应用流程很有用。让我们看看合同上传如何处理：

```python
if "contract_uploaded_done" not in st.session_state:
        uploaded_contract = st.file_uploader("Add Contract (.pdf, .txt)", key="contract_uploader")
        if uploaded_contract and "contract_uploaded" not in st.session_state and not is_analyzing:
            save_file(uploaded_contract, "data/contracts")
            st.session_state["contract_uploaded"] = True
            st.success("Contract added!")
            st.session_state["contract_uploaded_done"] = True
            contracts_modified = True
    else:
        if st.button("Upload another contract", disabled=is_analyzing):
            del st.session_state["contract_uploaded_done"]
            if "contract_uploaded" in st.session_state:
                del st.session_state["contract_uploaded"]
```

```kotlin
contract_files = list_files("data/contracts")
    if not contract_files:
        st.info("No contracts uploaded yet. Upload a contract to get started.")
        return contracts_modified, analysis_started, analysis_completed
```

```python
if not is_analyzing:
        for file in contract_files:
            contract_name = os.path.splitext(file)[0]
            report_name = f"analysis report for {contract_name}.txt"
            report_path = os.path.join("data/reports", report_name)
            col_a, col_b, col_c, col_d = st.columns([3, 1, 1, 1])

            with col_a:
                if os.path.exists(report_path):
                    st.write(f"📄 {file} ✅")
                else:
                    st.write(f"📄 {file}")

            with col_b:
                if st.button("Analyze", key=f"analyze_contract_{file}"):
                    st.session_state["is_analyzing"] = True
                    st.session_state["is_analyzing_file"] = file
                    analysis_started = True

            with col_c:
                if os.path.exists(report_path):
                    if st.button("See report", key=f"see_report_{file}"):
                        report_content = load_report(report_path)
                        st.session_state["current_report_content"] = report_content
                        st.session_state["current_report_name"] = file
                        st.session_state["current_contract_name"] = contract_name
                else:
                    st.write("—")

            with col_d:
                if st.button("❌", key=f"delete_contract_{file}"):
                    try:
                        os.remove(os.path.join("data/contracts", file))
                        if os.path.exists(report_path):
                            os.remove(report_path)
                        clear_chat_cache(contract_name)
                        if st.session_state.get("current_contract_name") == contract_name:
                            for key in ["current_report_content", "current_report_name", "current_contract_name"]:
                                if key in st.session_state:
                                    del st.session_state[key]
                        st.success(f"Deleted contract: {file}")
                        contracts_modified = True
                        st.rerun()
                    except Exception as e:
                        st.error(f"Error deleting contract: {str(e)}")
```

那么，前面这段长代码块在做什么？当不处于分析状态时，每个合同行会显示可用合同操作：

- 状态，如果报告存在则显示勾选
- `Analyze` 按钮，用来切换状态并开始处理
- `See report` 按钮，将保存的文本加载到 session 中，以便在其他地方查看
- `Delete` 按钮，移除合同及其报告，清除相关 chat cache，并强制 UI rerun

```ini
else:
        st.info(f" Analyzing: {analyzing_file}")
        with st.spinner("Analyzing contract."):
            file = st.session_state["is_analyzing_file"]
            try:
                policies_index = load_policies_index()
                contract_path = os.path.join("data/contracts", file)
                wf = ContractAnalysisWorkflow(timeout=60, verbose=False)
                result = _run_workflow_sync(
                    wf,
                    contract_path=contract_path,
                    policies_index=policies_index,
                )
                risk_report = result["risk"]
                compliance_report = result["compliance"]
                contract_name = os.path.splitext(file)[0]
                report_name = f"analysis report for {contract_name}.txt"
                os.makedirs("data/reports", exist_ok=True)
                with open(f"data/reports/{report_name}", "w", encoding="utf-8") as f:
                    f.write("RISK ANALYSIS:\n")
                    f.write("=" * 50 + "\n")
                    f.write(risk_report)
                    f.write("\n\n" + "=" * 50 + "\n")
                    f.write("COMPLIANCE CHECK:\n")
                    f.write("=" * 50 + "\n")
                    f.write(compliance_report)

                clear_chat_cache(contract_name)
                st.session_state["is_analyzing"] = False
                del st.session_state["is_analyzing_file"]
                analysis_completed = True
                st.success(f"✅ Analysis completed! Report saved: {report_name}")

            except Exception as e:
                st.error(f"Error during analysis: {str(e)}")
                st.session_state["is_analyzing"] = False
                if "is_analyzing_file" in st.session_state:
                    del st.session_state["is_analyzing_file"]
```

接下来，只剩最后一件事：更新 UI 并显示摘要：

```python
if contract_files:
        analyzed_count = sum(1 for file in contract_files
                           if os.path.exists(os.path.join("data/reports", f"analysis report for {os.path.splitext(file)[0]}.txt")))
        st.caption(f"Total contracts: {len(contract_files)} | Analyzed: {analyzed_count}")

    return contracts_modified, analysis_started, analysis_completed
```

在前面的代码部分中，一行小摘要会显示进度，也就是已经分析的合同数量与总合同数量。函数返回三个状态标志，使父级视图能够做出适当反应。

暂时就到这里！有了这两个文件，我们的 `Contract Review Expert` 已经迈出了成为完整应用的第一步。我们不再手动协调多个任务，而是使用 LlamaIndex Workflows 实现了编排，获得了并行执行、结构化结果，以及一个之后可以继续扩展的基础。

### 免责声明

在后续章节中，我们会继续演进这个项目，添加一个可以回答合同和政策相关问题的 chatbot。

## 总结

本章展示了如何使用 workflows，从临时拼接的 RAG 流水线转向结构化、可扩展流程。我们首先澄清了 workflows 在什么情况下有意义，将它们定位在简单 RAG chains 与 agentic-first 系统之间：前者可预测但僵硬，后者灵活但更难控制。我们介绍了 workflow 的核心元素：workflow classes、steps、events 和 context。我们还展示了 typed events 如何路由执行，而 shared context 如何在 steps 之间保存状态。

接着，我们探索了让真实系统稳健的高级 workflow 元素：用于暂停 / 恢复和避免重复计算的 checkpoints；用于处理短暂失败并具备合理 backoff 的 retries；用于基于决策路由的 branches；以及用于迭代改进的 loops。我们还介绍了使用 input 和 response events 的 human-in-the-loop 模式，使 workflows 可以暂停等待审批或编辑，然后无缝恢复。在此过程中，我们强调了架构和设计模式，同时提供了关于性能、可扩展性和成本的实用建议，例如异步执行、早期过滤和进度流式输出；关于可维护性的建议，例如模块化、sub-flows、清晰命名和可视化；以及关于韧性的建议，例如在关键或非幂等步骤之前设置 checkpoints、有边界的 retries，以及干净的 start/stop contracts。

