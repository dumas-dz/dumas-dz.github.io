---
title: LlamaIndex - 定制与部署 LlamaIndex 项目
category:
  - LLM
  - LlamaIndex
tag:
  - LlamaIndex
  - 部署
---

---

本章讲解如何定制 LlamaIndex 的 RAG 组件（模型、嵌入等），使用 Streamlit 构建前端界面，并将应用部署到生产环境。

### 技术要求

本章需要在你的环境中安装以下组件：

Hugging Face embeddings：[pypi.org/project/lla…](https://pypi.org/project/llama-index-embeddings-huggingface/)

OpenAI-like LLM integration：[pypi.org/project/lla…](https://pypi.org/project/llama-index-llms-openai-like/)

OpenAI-like embeddings integration：[pypi.org/project/lla…](https://pypi.org/project/llama-index-embeddings-openai-like/)

Neutrino LLM：[pypi.org/project/lla…](https://pypi.org/project/llama-index-llms-neutrino/)

Semantic chunking pack：[pypi.org/project/lla…](https://pypi.org/project/llama-index-packs-node-parser-semantic-chunking/)

ChromaDB：[pypi.org/project/chr…](https://pypi.org/project/chromadb/)

LM Studio：[lmstudio.ai/download](https://lmstudio.ai/download)

## 定制我们的 RAG 组件

LlamaIndex 中 RAG 工作流的几乎所有组件都可以被定制：索引、后处理、响应合成、LLM 和 embedding 模型。RAG 工作流的核心是它所使用的 LLM 和 embedding 模型。本示例围绕本地运行构建，使用 Ollama 和 `gemma3:4b` 模型。

但首先，我们需要一些背景知识。

### LLaMA 模型如何改变开源格局

2023 年初，Meta AI 推出了 Large Language Model Meta AI（LLaMA）系列，通过向研究社区发布模型权重，显著提升了 LLM 的可访问性。随后，LLaMA 2 于 2023 年 7 月发布，它带来了更多训练数据、更大的模型规模，以及在较宽松商业使用条件下为对话任务微调的模型。Meta 分别开发并发布了 7B、13B 和 70B 参数规模的三个 LLaMA 2 版本。虽然这些模型的基本结构仍然与最初的 LLaMA 版本相似，但为了增强其基础能力，它们相比原始模型使用了额外数据进行训练。

随后，Llama 系列继续快速演进，推出了 Llama 3 等更新版本，以及最近的 Llama 4 系列。每一次新发布都进一步拓展边界，扩大模型规模，提升指令遵循能力，并吸引越来越庞大的开发者社区。

`llama.cpp` 是 Meta LLaMA 架构用于 LLM 推理的一个高效 C/C++ 实现。这个基础框架在开源社区中非常受欢迎，并激发了许多类似工具和服务的发展，例如 Ollama、Local.AI 等。

相反，我会尝试向你介绍一个我个人觉得非常方便的替代方案，原因有两个：它非常容易实现，并且你的现有代码只需要做极少修改就能复用。对于初学编程者，以及那些希望快速实验一个想法或构建简单原型的 tinkerer 来说，这可能是最好的解决方案之一。由于本书到目前为止一直依赖 Ollama 在本地运行模型，现在我们将看看 LM Studio，它是一个方便的替代本地运行时，可以模拟 OpenAI API，并让你用最少改动复用大部分现有 LlamaIndex 代码。

## 使用 LM Studio 运行本地 LLM

LM Studio（[lmstudio.ai/](https://lmstudio.ai/)）构建在 `llama.cpp` 库之上，为 LLM 提供了一个非常友好的图形界面。它允许我们发现、下载、配置并在本地运行开源模型，尤其是对于通过 Hugging Face 分发的模型，体验非常顺滑。LM Studio 是一个非常好的资源，尤其适合非技术用户。它提供两种与本地 LLM 交互的方式：一种是通过类似 OpenAI ChatGPT 的聊天 UI，另一种是通过 OpenAI 兼容的本地服务器。第二个选项让它特别有用，因为我们可以非常轻松地适配任何原本为使用 OpenAI LLM 而设计的 LlamaIndex 应用，通常只需要把 client 的 base URL 改成指向本地服务器即可。我们马上会讲到这一点，但首先，我们先看看如何开始使用 LM Studio。

要开始使用这个工具，你首先需要根据操作系统下载并安装正确版本。它提供 Mac、Windows 和 Linux 版本。安装步骤非常直观，并且在它们的网站上有良好文档说明。

安装完成后，LM Studio GUI 会从 Model Discovery 页面开始，你可以输入任何模型或模型系列名称，并获得可下载的匹配模型构建列表。在我们的示例中，将使用 Gemma 3 4B，也就是本书中一直通过 Ollama 以 `gemma3:4b` 使用的同一模型系列；但这一次，我们会通过 LM Studio 而不是 Ollama 来运行它。这里一个不错的选择是经过指令微调的变体 Gemma-3-4B-IT（[huggingface.co/google/gemm…](https://huggingface.co/google/gemma-3-4b-it)）。我选择 Gemma 3 4B，是因为它足够小，可以在典型开发者硬件上实际运行，同时仍然是一个强大的通用模型，适合问答、摘要和推理等任务（[ai.google.dev/gemma/docs/…](https://ai.google.dev/gemma/docs/core/model_card_3)）。

在搜索结果页面，你会看到两个面板：

左侧面板包含所有与你搜索查询匹配的模型。在我们的例子中，这些是 Gemma 3 4B 模型的不同构建版本。

右侧面板列出所有可下载的 GGUF 文件版本。

GGUF 是一种用于存储本地推理模型的文件格式，已经成为开源生态中分发模型的一种流行方式，尤其适用于基于 `llama.cpp` 的运行时。

对于大多数模型，你会获得一整组可用的 GGUF 文件。每个文件都有自己的特征，但最重要的特征很可能是量化等级。

### 理解 LLM 量化

在典型消费级硬件上运行开源 LLM 可能具有挑战性，主要原因是它们内存占用大、计算需求高。虽然一些消费级 GPU 可以在这方面提供帮助，但面对 LLM 的需求时，它们可能并不像企业级硬件那样有效。这就是我们需要量化的原因。将量化这一训练后优化技术应用到 AI 模型上的目标，是在不显著牺牲准确性或输出质量的情况下，优化模型性能和效率，尤其是在速度和内存使用方面。

量化过程通过把模型参数从通常以 FP16/BF16 或 32 位浮点数存储的形式，转换为更低 bit 的表示来实现，例如 16 位浮点数（FP16）、8 位整数（INT8），甚至更低。这是一种近似过程，它通过降低用于表示模型参数的数值精度，并结合复杂技术尽可能保持准确性。现代量化技术旨在最小化准确性损失，通常会得到几乎与全精度模型同样准确的模型。

一个帮助你更好理解这个概念的简单类比是：某个食谱要求非常精确的计量，例如 1.4732 杯面粉。在实践中，你可能会把它四舍五入为 1.5 杯，因为在大多数情况下，这种差异可以忽略不计，并不会影响最终结果。这与量化类似：我们降低模型参数的精度，以便让模型更高效，同时保持可接受的准确性。只不过，我们减少的不是面粉杯数的精确度，而是模型参数的数值精度。比如，与其用 16 bit 存储一个值为 `23.7` 的参数，我们可以把它量化为 8 bit 的 `23`。这会直接转化为更少的内存使用和更快的处理时间。不过，模型大小、速度和准确性之间存在权衡。

在可接受的准确性损失下，这个过程可以显著减小模型体积，并降低训练和推理阶段所需的计算资源，从而让这些模型更容易部署在消费级硬件上。一般来说，bit 表示越低，例如 INT4 甚至二值化，模型就越小、越快，但准确性损失风险也越高。

由于 LM Studio 构建在 `llama.cpp` 之上，它可以利用推理过程中可用的任何兼容 GPU。这个特性通常被称为 GPU offloading，意思是计算操作可以部分甚至全部从 CPU 转移到 GPU。考虑到现代 GPU 比 CPU 更擅长处理高度并行的计算任务，这可以显著加速推理过程。它也会减少 CPU 负载，从而提供整体更均衡的系统性能提升。尝试 GPU offloading 时的主要限制，是 GPU 上可用的视频内存容量。为了高效运行，GPU 必须先把模型加载到显存中。

因此，除了量化等级之外，右侧面板中的 GGUF 文件还会带有一个标记，显示三种可能的兼容性场景，每种场景由不同标签表示：

Full GPU Offload Possible：这意味着你的 GPU 有足够显存加载模型并执行推理。在大多数情况下，这是理想场景。

Partial GPU Offload Possible：并不理想，但仍然可以显著提升性能。

Likely too large：很遗憾，这意味着你无法在自己的机器上运行这个版本，最可能的原因是它的大小超过了你的总系统内存。

如果你使用的是 Hugging Face Transformers 模型，可以在 [huggingface.co/docs/accele…](https://huggingface.co/docs/accelerate/usage_guides/model_size_estimator) 找到一个方便的工具，用于估算不同精度级别下所需内存。对于 GGUF 模型，也就是 LM Studio、Ollama 和 `llama.cpp` 使用的格式，这个计算器并不适用，因为 GGUF 使用的是自己的量化方案，例如 `Q4_K_M` 或 `Q5_K_S`。相反，你应该查看 Hugging Face 上的模型卡，其中会列出每个量化等级的文件大小。文件大小是估算加载模型所需 VRAM 的一个不错参考，不过你仍然应该为推理期间的运行时开销预留大约 20% 的额外余量。

那么，你应该选择哪个模型？

一般经验法则是：量化等级越低，需要的内存越少，推理过程越快。代价是准确性下降。例如，3-bit 量化通常会比 6-bit 量化准确性更低，尽管具体影响取决于模型和量化方法。

下载完成后，切换到 Chats 页面，你会看到类似图 11.2 的内容：

这应该是一种非常熟悉的 AI 模型交互方式，因为它类似 ChatGPT 界面。在这个页面中，你可以执行以下操作：

从所有已下载模型列表中选择所需 AI 模型。要选择模型，请使用屏幕顶部的模型选择器。你需要等待片刻，直到模型被加载到内存中。

使用右侧配置面板配置模型的任何可用参数。我们马上会更详细地讨论这一点。

在左侧查看之前的聊天列表。

使用受 ChatGPT 启发的熟悉界面与模型聊天。

配置面板中有许多参数可以调整。其中最重要的是：

Preset：某些模型带有预定义配置，你可以从 presets 加载。为了轻松开始，我建议从列表中选择该模型特定的 preset。例如，如果你运行的是 Gemma 3 4B Instruct 构建版本，就寻找与该模型匹配的 Gemma 或 instruction-tuned preset，因为它通常会为聊天格式和生成参数设置合理默认值。

System Prompt：这个 prompt 会设置对话的初始上下文。

GPU Offload：允许你配置要卸载到 GPU 的模型层数。根据你使用的模型和可用 GPU，你可能需要在检查模型稳定性的同时，逐步尝试更高值。更高值有时会产生错误。如果你有信心，可以使用 `-1` 将模型所有层都卸载到 GPU。

Context Length：允许你定义要使用的最大上下文窗口。

更改其中某些参数可能会触发模型重新加载，因此你需要耐心等待该过程完成。一旦你完成所有定制，舞台就交给你了：尽情与你的本地 LLM 聊天吧。

目前为止一切都很好，但这里的 RAG 部分在哪里？

为此，我们需要进入 Developer 页面，你可以点击左侧菜单中类似 prompt 的图标。你会看到类似图 11.3 的 UI：

右侧面板中的配置选项几乎与 Chat 页面中的完全相同。一开始，你可以把服务器配置选项保留为默认值。左侧面板中的 Developer Docs 部分会告诉你如何与 API 交互。LM Studio 的一个优秀特性是，它可以模拟各种 API endpoint。这意味着你已经存在的代码只需要做很少改动，就可以与通过 LM Studio 托管的模型一起工作。

此时你只需要点击 `Status: Running` 开关，就可以开始了。

```ini
client = OpenAI(base_url="http://localhost:1234/v1")
```

然而，在 LlamaIndex 中，我们通常不会直接与 OpenAI Python SDK 对话。相反，我们会配置 LlamaIndex 自己的 LLM 和 embedding 抽象。当后端是“兼容 OpenAI，但不是 OpenAI”时，最方便的选项是使用 `OpenAILike`。它是 LlamaIndex OpenAI 集成的一个薄包装，专门为那些实现了 OpenAI 兼容 API 的第三方提供商而设计。要启用这个集成，先安装所需包：

```perl
pip install llama-index-llms-openai-like llama-index-embeddings-openai-like
```

运行任何代码之前，确保你已经先在 LM Studio 中下载了模型，也就是通过左侧菜单中的 Model Search 标签页下载，然后启动本地 inference server。还要注意，`model` 的值应该与 LM Studio 暴露的模型标识符匹配，也就是 Developer UI 中列出的标识符，或通过 `/v1/models` endpoint 返回的标识符。

下面是当我们把 LLM 和 embedding 模型都指向 LM Studio 服务器时，`config/models.py` 配置文件的样子：

```ini
from llama_index.core import Settings
from llama_index.llms.openai_like import OpenAILike
from llama_index.embeddings.openai_like import OpenAILikeEmbedding

Settings.llm = OpenAILike(
    model="google/gemma-3-4b-it",
    api_base="http://localhost:1234/v1",
    api_key="lm-studio",
    temperature=0.8,
    context_window=16000,
    timeout=30.0,
    is_chat_model=True,
)

Settings.embed_model = OpenAILikeEmbedding(
    model_name="nomic-embed-text",
    api_base="http://localhost:1234/v1",
    api_key="lm-studio",
    timeout=30.0,
)
```

核心思想是：我们不再选择 Ollama 运行时，而是选择一个 OpenAI 兼容的本地服务器。`api_base` 参数会把所有请求重定向到 `http://localhost:1234/v1`，而 `OpenAILike` 的存在，正是为了让这种 drop-in 风格的替换能够与 LM Studio 这类提供商干净地协同工作。

正如你所看到的，我们真正需要做的唯一改动，是把 LLM 和 embedding 实例指向 LM Studio 服务器，而不是 Ollama 服务器。运行这个示例后，你会在 LM Studio 的日志页面看到来自我们代码的实际请求，以及 API 返回的响应。如果想永久重新配置模型，可以通过 `Settings` 对象一次性定义。

很整洁，不是吗？

只是要记住，虽然 LM Studio 对个人和商业使用都是免费的，但它的服务条款限制重新分发、再授权，以及将其作为 SaaS 产品提供。把它纳入你的工作流之前，务必查看当前条款：[lmstudio.ai/app-terms。](https://lmstudio.ai/app-terms%E3%80%82)

## 使用 Neutrino 等服务在 LLM 之间路由

有时，单个 LLM 并不适合每一次交互。在复杂 RAG 场景中，如果被迫为所有事情选择一个 LLM，那么在成本、延迟和精度之间找到最佳组合可能是一项困难任务。但如果我们能找到一种方法，在同一个应用中混合不同 LLM，并为每一次单独交互动态选择要使用的模型呢？这正是 Neutrino（[www.neutrinoapp.com/](https://www.neutrinoapp.com/)）和 OpenRouter（[openrouter.ai/](https://openrouter.ai/)）这类第三方服务的目的。这些服务可以通过在不同 LLM 之间提供智能路由，显著增强 RAG 工作流，并针对成本、延迟、质量和提供商可用性等因素进行优化。例如，OpenRouter 提供跨数十家提供商、超过 300 个模型的访问能力，并内置自动 fallback 和基于质量的路由。

警告：

Neutrino 和 OpenRouter 这类服务是托管式路由层。这意味着你的 prompt 会被发送到它们的 API，而实际 LLM 调用是在远程基础设施上执行的，而不是在你的本地机器上。换句话说，虽然它们对于混合模型以及优化成本或延迟非常方便，但它们并不符合我们在本书中一直使用 Ollama 和 Gemma 3 4B 所采用的“所有内容本地运行”方法。如果你的主要目标是隐私，或者保持所有数据都在设备上，通常就应该坚持使用本地模型和本地路由模式。

如果你希望在不使用托管服务的情况下获得类似路由行为，可以用 LlamaIndex 的 `RouterQueryEngine` 在本地实现。前面已经动手实现过 `RouterQueryEngine`，定义候选 query engine 并让 router 为每个问题选择最佳 query engine。同样的模式也适用于这里：由于 router 和候选 engine 都可以使用你的本地 Gemma 模型，整个工作流仍然保留在你的机器上。

以 Neutrino 的智能模型路由器为例，它允许你将查询智能路由到最适合该 prompt 的 LLM，同时优化响应质量和成本效率。这在 RAG 工作流中尤其有用，因为不同类型查询可能需要不同的 LLM 能力或专长。例如，一个模型可能更擅长理解和解析初始用户查询，而另一个模型可能更适合基于检索到的文档生成响应。通过使用 router，我们可以为每个任务动态选择最合适的模型，而无需在应用中硬编码模型选择，从而增强灵活性，并有可能提升整个 RAG 系统的整体性能。

```perl
pip install llama-index-llms-neutrino
```

要设置 Neutrino router，请遵循以下步骤：

安装包后，你首先应该在 Neutrino 网站注册账号并获取 API key。

下一步是创建一个 LLM router，选择你想要的 LLM，以及一个 fallback LLM。如果出现错误，或 router 无法确定应使用哪个 LLM，fallback 模型将默认使用。在 router 设置过程中，你还可以选择使用 Neutrino 作为 AI 模型提供商，或者为每个 LLM 使用你自己的 API key。

router 设置过程的最后一步要求你提供一个 router ID。这个 ID 将在代码中用于指定该服务使用的 router。

下面是我们如何在 LlamaIndex 中使用 Neutrino router：

```ini
from llama_index.llms.neutrino import Neutrino
llm = Neutrino(
    api_key="<your-Neutrino_API_key>",
    router="<Neutrino-router_ID>"
)
```

这段代码首先以 LlamaIndex `llm` 对象的形式初始化 Neutrino router，你需要提供 Neutrino API key，以及你定义的 router ID。接下来，它在循环中运行，持续从用户那里接收问题，直到收到 `'exit'` 关键词：

```python
while True:
    user_message = input("Ask a question: ")
    if user_message.lower() == 'exit':
        print("Exiting chat.")
        break
    response = llm.complete(user_message)
    print(f"LLM answer: {response}")
    print(f"Answered by: {response.raw['model']}")
```

问题会被提交给 Neutrino router，作为返回，脚本不仅会打印答案，还会打印 router 选择用来生成答案的 LLM 名称。你可以尝试不同类型的问题。根据你在定义 router 时选择的模型，你会看到它会根据模型能力，把问题发送给不同 LLM。

另一种更通用的使用这种 router 的方法，是使用 `Settings` 类，用这个 `llm` 对象创建全局配置：

```ini
from llama_index.core import Settings
Settings.llm = llm
```

这样做的好处是，它会配置我们代码中之后的每个 LlamaIndex 组件都使用 Neutrino router。

如果你不完全满意 router 做出的决策，Neutrino 还允许你通过上传一组示例来微调你定义的 router，router 可以基于这些示例进行训练。你可以在 Neutrino 文档中找到更多细节：[docs.neutrinoapp.com/](https://docs.neutrinoapp.com/)。访问该平台上的 training studio 需要一个免费的 Neutrino 账号。

而 Neutrino 只是一个例子。OpenRouter（[openrouter.ai/](https://openrouter.ai/)）以类似方式工作，但主要专注于优化成本而不是质量。它通过统一 API 支持数十个模型，并且可以使用 `llama-index-llms-openrouter` 包进行集成。

还有其他提供商也在提供类似服务，而且随着每周数百个新 AI 模型不断涌现，这个概念必然会变得越来越流行。使用 LLM 路由服务的能力，通过抽象模型选择和管理的复杂性，增强了 RAG 工作流。结果是，我们可以专注于构建和优化应用，而不是管理底层 AI 模型。

在 RAG 场景中，另一个可以考虑定制的重要组件，是底层 embedding 模型。在使用向量存储索引的场景中，embedding 模型会被密集使用，因此它也可能在成本和隐私方面成为一个顾虑来源。这就是为什么我们有时更愿意在 RAG 工作流中使用本地模型。再次，好消息是 LlamaIndex 开箱即用地支持超过 30 种 embedding 模型。你可以通过安装 embedding 集成包来使用它们，这些内容记录在 LlamaHub 网站上：[llamahub.ai/?tab=embedd…](https://llamahub.ai/?tab=embeddings%E3%80%82)

## 利用 Llama Packs 的即插即用便利性

有时你并不想从零开始连接每一个组件。Llama Packs 提供预构建、可定制的模块，让你可以快速启动一个可工作的 pipeline，然后在此基础上微调。

LlamaIndex 为我们提供如此丰富的底层 RAG 元素和方法框架，这是一把双刃剑。一方面，几乎任何你需要解决的实际问题，都有一个可用工具，这非常有用。另一方面，要成功实现这些工具，我们必须先花相当多时间熟悉每一个工具。然后还要进入每个组件的微调和优化阶段。我们已经在开发和优化过程中谈到了一项不小的工作量。有时，为了能够用快速原型测试一个想法，如果已经有一些高级现成模块，那会更理想。想象一下，有些乐高积木已经被组织成功能性子组件：屋顶、窗户、公交站等等。好吧，我们手边确实有这样的东西。

Llama Packs 由蓬勃发展的 LlamaIndex 社区创建并持续改进，是一些预打包模块，可用于快速构建 LLM 应用。就像一些预构建的乐高结构一样，它们提供可复用组件，例如 LLM、embedding 模型和向量索引，这些组件已经针对构建 RAG pipeline 的各种用例预先配置为可以协同工作。它们是开箱即用的模块，可以下载并用参数初始化，以实现某个特定目标。一个 pack 可能包含一个完整 RAG pipeline，用于在文本上启用语义搜索；也可能包含一个完整智能体构造，可以在我们的应用中立即调用。

Llama Packs 充当模板，可以根据需要检查、定制和扩展。每个 pack 的代码都是可用的，因此开发者可以修改它，或者从中获得灵感来构建自己的应用。这个概念的美妙之处在于，它提供了 Plug and Play（PnP）解决方案，而不会让框架主代码库膨胀。你仍然可以将各种集成包与 LlamaIndex 核心组件一起使用，并且你当然也可以根据自己的需求定制这些 packs。

使用它们非常直接。因为在本节中，我们讨论的是一般意义上的定制，并且在其他选项之外，还谈到了如何为本地模型改进 RAG 工作流，所以我会沿着同一思路给你展示一个例子。我们将探索一个 Llama Pack，它关注任何 RAG pipeline 中一个影响惊人的部分：chunking。与按固定大小切分文本不同，semantic chunking 使用相邻句子之间的 embedding 相似度来寻找自然断点，从而生成更连贯、通常也更容易被 retriever 处理的 chunk。LlamaIndex 以一个现成 pack 的形式提供了这个能力，叫作 Semantic Chunking Query Engine Pack，你可以在官方 pack 列表和 API 参考中找到它。

使用任何 Llama Pack 的第一步，是把实际模块下载到你的本地环境。这可以通过三种不同方式之一完成：

通过安装对应的集成包。在我们的例子中，可以用以下命令完成：

```perl
pip install llama-index-packs-node-parser-semantic-chunking
```

通过命令行界面（CLI）。下面是一个例子：

```bash
llamaindex-cli download-llamapack SemanticChunkingQueryEnginePack --download-dir ./semantic_chunk_pack
```

我们将在下一节更详细地讨论 CLI 工具。

直接在代码中，使用 `download_llama_pack()` 方法并指定下载位置，如下所示：

```java
from llama_index.core.llama_pack import download_llama_pack
download_llama_pack(
    "SemanticChunkingQueryEnginePack", "./semantic_chunk_pack"
)
```

下面是下载后如何使用这个 pack 的简单示例：

```ini
from llama_index.core import SimpleDirectoryReader
from semantic_chunk_pack.base import SemanticChunkingQueryEnginePack
reader = SimpleDirectoryReader("files")
documents = reader.load_data()
semantic_qe = SemanticChunkingQueryEnginePack(documents)
response = semantic_qe.run("Enumerate famous buildings in ancient Rome")
print(response)
```

注意，我们使用的是 `run()` 方法，在这个例子中，它是底层 query engine 所使用的 `query()` 方法的一个包装器。

Llama Packs 自带默认 embedding 模型，通常是 OpenAI 模型。由于我们要在本地运行所有内容，技巧很简单：确保在创建 pack 之前导入 `models_config`，它会把 `Settings.embed_model` 设置为我们的本地 `nomic-embed-text`。pack 会在你实例化它时读取当时 `Settings` 中的内容。

因此，更新后的代码如下：

```ini
import models_config
from llama_index.core import SimpleDirectoryReader
from semantic_chunk_pack.base import SemanticChunkingQueryEnginePack
reader = SimpleDirectoryReader("files")
documents = reader.load_data()
semantic_qe = SemanticChunkingQueryEnginePack(documents)
```

就是这样。如果你遇到某个 pack 忽略了 `Settings`，并硬编码了自己的 embedding，就打开 `./semantic_chunk_pack` 文件夹中的 `base.py` 文件，手动替换 embedding 赋值。

`SemanticChunkingQueryEnginePack` 只是目前 LlamaHub 上已有的几十个 pack 之一。而且数量还在持续增长。好消息是，它们都有良好文档，并且基本遵循同样的实现模型。

所以，下次当你面对一个需要把底层组件组合成更高级元素的实际场景时，与其重复造轮子，我鼓励你花些时间浏览 LlamaHub，看看是否已经有适合你问题的现成解决方案。Llama Packs 通过让开发者使用针对常见用例定制的预构建组件，加速 LLM 应用开发。无论是现成解决方案，还是可定制模板，都可以帮助项目快速启动。

## 使用 Llama CLI

除了 Python 支持之外，LlamaIndex 还提供了命令行界面。它允许你下载 packs，升级旧代码，甚至通过 `llamaindex-cli` 工具，在不写一行代码的情况下运行一个完整 RAG 工作流。该工具会随 LlamaIndex 库一起安装，可以非常轻松地从命令行访问，并用于多种目的，包括以下内容：

下载 Llama Packs，正如上一节所见。下载 Llama Pack 的语法如下：

```xml
llamaindex-cli download-llamapack <pack_name> --download-dir <target_location>
```

升级早于 LlamaIndex v0.10 版本的源代码。由于 0.10 版本在代码结构以及如何使用框架中的某些模块方面带来了很多变化，LlamaIndex 作者为开发者提供了这个自动升级工具。基本上，它会自动修改旧版本中编写的代码，并将其更新到 v0.10 引入的新结构，以便更容易过渡。用于此功能的语法如下，可以同时处理某个给定文件夹中的所有源文件：

```xml
llamaindex-cli upgrade <target_directory>
```

执行以下命令来升级单个文件：

```xml
llamaindex-cli upgrade-file <target_file>
```

目前最有意思的能力，是通过使用 `rag` 参数启用的。这个功能允许你直接从命令行构建 RAG 工作流，而无需写任何代码。默认情况下，命令行 RAG 模式使用基于 Chroma DB 数据库的本地存储来保存 embeddings，并且对 embeddings 和 LLM 都使用 OpenAI。出于隐私原因，请记住，这意味着默认情况下，你上传的所有数据都会发送给 OpenAI。不过，CLI 是完全可定制的：你可以创建自己的脚本，用自定义 `IngestionPipeline` 和自己的 LLM 实例化 `RagCLI`，包括本地 Ollama 模型。官方文档 [developers.llamaindex.ai/python/fram…](https://developers.llamaindex.ai/python/framework/getting_started/starter_tools/rag_cli/) 中包含一个完整示例，展示如何设置。

### 命令行中的 RAG 如何工作

在可以从命令行使用 RAG 模式之前，我们必须先在本地环境中安装 ChromaDB 库：

```code
pip install chromadb
```

`llamaindex-cli` 工具提供了各种命令行参数，使用户能够与语言模型交互，并高效管理本地文件。以下是最重要命令行参数的说明：

`--help`：显示帮助信息，提供可用命令及其用法的概览。

`--files <FILES>`：定义文件或目录名称，工具将从这里摄入我们的专有数据。其内容会被摄入并嵌入到本地向量数据库中，使 RAG CLI 工具能够索引指定文件，并在查询时从中检索上下文。

`--question <QUESTION>`：指定你想就已摄入文件提出的问题。用于查询已索引内容，借助 LLM 的能力从我们的专有数据中抽取信息。

`--chat`：在终端中打开一个聊天 read-eval-print loop（REPL），用于交互式问答会话。它提供一个对话界面，用于查询已摄入文档。

`--verbose`：执行期间启用详细输出，提供关于工具操作的详细信息，这有助于排障和理解工具内部工作机制。

`--clear`：从本地向量数据库中清除所有当前已嵌入数据。因为使用 Chroma 数据库来存储 embeddings，这些数据会跨会话持久存在。`--clear` 命令相当于一次 reset。

`--create-llama`：基于所选文件启动一个 LlamaIndex 应用的创建。这个参数把工具功能扩展到简单问答之外，支持开发带后端和前端的全栈应用，并利用已摄入数据。你可以在这里找到完整使用示例：[www.npmjs.com/package/cre…](https://www.npmjs.com/package/create-llama#example%E3%80%82)

说到示例，让我们看看一种使用 CLI RAG 功能与文件对话的简单方式。我们将使用 GitHub 仓库中 `ch9\files` 文件夹的内容。因此，请确保你是在该文件夹内部运行这个脚本，该文件夹应包含一些示例文件：

```css
llamaindex-cli rag --files files -q "What can you tell me about ancient Rome?" --verbose
```

或者，在文件被摄入之后，如果想与数据进行交互式聊天会话，可以使用以下命令：

```css
llamaindex-cli rag --chat
```

另外，如果你需要定制 RAG CLI 的机制，可以在框架官方文档中找到一个完整示例：[developers.llamaindex.ai/python/fram…](https://developers.llamaindex.ai/python/framework/getting_started/starter_tools/rag_cli/%E3%80%82)

## 使用 Streamlit 部署应用

当你的 RAG 应用已经完成定制并在本地运行后，下一步就是把它呈现给用户。本节将介绍通过 Streamlit 可用的部署选项，并为后续动手指南铺垫背景。

选择 Streamlit 作为项目前端是因为它简单，并且提供了许多部署选项。Streamlit 为部署应用提供了一种简单方法，使你能够以最小努力把作品分享给更广泛受众。如果你成功按照第 2 章的安装步骤完成环境设置，那么你的本地环境应该已经为接下来的步骤准备好了。不过为了保险，在继续之前，请确保你已经完成第 2 章“Discovering Streamlit – the perfect tool for quick build and deployment”一节中提到的必要安装。

Streamlit Community Cloud：这个用户友好的平台是部署 Streamlit 应用最直接的选项，允许用户只需点击几下，就可以直接从 GitHub 仓库部署。它需要最少配置，部署完成后，你的应用会通过 Streamlit Community Cloud 上的唯一 URL 访问，方便分享给他人。

Custom cloud services：对于那些希望对部署环境拥有更大控制权的人来说，Streamlit 应用可以部署到各种云服务上，包括 Amazon Web Services（AWS）、Google Cloud Platform（GCP）和 Azure。在这些平台上部署可能涉及额外步骤，例如用 Docker 对应用进行容器化，以及配置云特定服务，例如 AWS Elastic Beanstalk、Google App Engine 或 Azure App Service。相比 Streamlit Community Cloud，主要优势在于你对基础设施、扩缩容、网络和安全有更多控制，而这对于生产部署通常是必要的。

Self-hosting：如果你有自己的服务器，选择自托管 Streamlit 应用可以让你对部署环境和资源拥有最大控制权。这种方法需要设置一个能够运行 Python 应用的服务器环境，安装 Streamlit，并配置网络以访问 Streamlit 应用。自托管选项可以满足云平台无法满足的特定安全、性能或定制需求。

Streamlit in Snowflake：对于优先考虑安全性和基于角色的访问控制（RBAC）的用例，Streamlit 与 Snowflake 的集成在 Snowflake 平台内提供了安全的编码和部署环境。你可以轻松注册一个试用 Snowflake 账号，为应用创建 warehouse 和 database，并直接在 Snowflake 内部署 Streamlit 应用。

## 将 Contract Review Expert 部署到 Streamlit Community Cloud

```javascript
import streamlit as st
from policies import render_policies_section
from contracts import render_contracts_section
from reports import render_reports_section
```

我们先导入必要模块和组件，包括 Streamlit。还从其他模块导入几个自定义函数，例如 `render_policies_section`、`render_contracts_section` 和 `render_reports_section`，它们分别负责 UI 的不同部分。

接下来，我们配置 Streamlit 页面布局和一些基础 UI 细节：

```ini
st.set_page_config(
    page_title="Contract Advisor",
    layout="wide",
    initial_sidebar_state="collapsed"
)
```

一开始使用 `st.set_page_config` 会建立我们 Web 应用的基础布局。在我们的例子中，由于 UI 被拆分成多个面板，因此使用 wide layout；同时，我们一开始折叠 sidebar，以便让界面聚焦于主要工作流。然后，我们渲染应用标题和一段给用户看的简短描述：

```arduino
st.title("Contract Review Expert")
st.markdown("Upload policies and contracts to perform AI-powered risk analysis and compliance checks.")
```

Web 应用本质上是无状态的，这意味着客户端和服务器之间的每个请求和响应都是独立的。Streamlit 的 session state 允许我们克服这一点，它提供了一种方式，在同一浏览器会话中的 app rerun 之间保持状态。

在 Contract Review Expert 中，我主要使用 session state 来追踪当前是否正在运行分析，以及正在分析哪个合同文件：

```ini
is_analyzing = st.session_state.get("is_analyzing", False)
analyzing_file = st.session_state.get("is_analyzing_file", None)
```

接下来，我们构建主 UI 布局。Streamlit 可以很容易地并排渲染多个 section，我们利用这一点在左侧显示 Policies，在右侧显示 Contracts，如图 11.5 所示：

```ini
col1, col2 = st.columns(2, gap="large")
with col1:
    policies_modified = render_policies_section(is_analyzing)
with col2:
    contracts_modified, analysis_started, analysis_completed = render_contracts_section(
        is_analyzing, analyzing_file
    )
```

此时，app 会把控制权交给两个 UI 模块。Policies 面板负责上传和管理政策文档，而 Contracts 面板处理合同上传、运行分析工作流以及生成报告。

由于 Streamlit 会在每次用户交互时重新运行脚本，我们在分析开始或完成时使用一个简单的 rerun 触发器：

```css
if analysis_started or analysis_completed:
    st.rerun()
```

```scss
st.markdown("---")
report_displayed = render_reports_section()
```

如果当前没有选中报告，app 会显示一段简短的 how-to-use 说明，以及 sidebar 中的一些基础状态信息，包括系统当前是否正在分析合同。

由于 Streamlit Community Cloud 环境的实现方式，我们在部署前需要做一些实际调整。计划是直接从 GitHub 仓库部署应用。Streamlit Community Cloud 允许你在部署时选择 main file path，因此入口文件不必位于仓库根目录。

在 Windows 上：

```less
xcopy <project_folder_name> C:\CONTRACT_REVIEW_EXPERT /E /I
```

在 macOS 或 Linux 上：

```bash
cp -r <project_folder_name> ~/CONTRACT_REVIEW_EXPERT
```

这会在你的 C: 盘上创建一个文件夹，其中只包含 Contract Review Expert 应用的源文件。如果你导航到新创建的文件夹，并使用 `dir` 命令列出其内容，输出应类似图 11.6：

下一步是登录你的 GitHub 账号并创建一个新仓库。我们把它命名为 `CONTRACT_REVIEW_EXPERT_ONLINE`，如图 11.7 所示：

创建完成后，记下仓库 URL，供后续步骤使用。接下来，我们将在目标文件夹中初始化一个新的本地仓库。打开 CLI，导航到你想转换成独立仓库的文件夹，也就是 `C:\CONTRACT_REVIEW_EXPERT`，然后执行以下命令：

```csharp
git init
```

接下来，通过运行以下命令添加并提交现有文件：

```sql
git add .
git commit -m "Initial commit for CONTRACT_REVIEW_EXPERT_ONLINE repository"
```

```csharp
git remote add origin <your_repository_URL>.git
```

```css
git branch -M main
git push -u origin main
```

如果一切顺利，你现在应该有一个全新的 GitHub 仓库，其中包含 Contract Review Expert 源代码。

一个重要细节是：LlamaIndex 的 Ollama 集成默认假设你的本地模型服务运行在 `localhost:11434`。当你部署到 Streamlit Community Cloud 时，你的 Streamlit app 会运行在远程机器上，因此 `http://localhost:11434` 指的是云端容器本身，而不是你的本地机器。如果你仍然想把 UI 部署到 Community Cloud，有两个实用选项：把 `config.py` 中的 `base_url` 指向一个运行在其他地方、并且可通过网络访问的 Ollama 实例；或者把后端切换到托管 LLM endpoint，例如任何通过 `api_base` 暴露 OpenAI 兼容 API 的提供商。

接下来，我们处理 Community Cloud 部署。

把 Streamlit 应用部署到其 Community Cloud 环境中，是一个相当简单直接的过程。下面是分步指南：

第一步是在这里注册一个免费 Streamlit 账号：[share.streamlit.io/signup](https://share.streamlit.io/signup)。最佳选项是使用你的 GitHub 账号注册并登录 Streamlit 账号。

登录后，只需点击 New app 按钮即可开始部署过程。你会进入一个类似图 11.8 的页面：

如果你使用 GitHub 登录 Streamlit，那么你应该已经可以在选项中看到 `CONTRACT_REVIEW_EXPERT_ONLINE` 仓库。选择它，然后在 Main file path 字段下，把默认值改为 `app.py`，然后点击 Deploy。

从这里开始，Streamlit 部署服务会接管，并为你的应用准备所需环境。这可能需要一段时间，但如果你想查看进度，可以展开屏幕右下角的 Manage app 部分。当一切准备就绪后，应用应该会自动启动。

现在你可以上传内部政策和合同，生成风险和合规报告，并使用聊天界面围绕特定合同及其分析结果提问。

在当前实现中，app 使用 Ollama 和 Gemma 3:4B 在本地运行，因此默认没有 token 成本。不过，如果你把 Streamlit UI 部署到云端，并将其指向一个远程托管 LLM endpoint，就应该像对待任何其他生产依赖一样对待该 endpoint：妥善保护它，并密切关注使用量和资源消耗。

很简单，不是吗？尽管 Streamlit Community Cloud 提供的是一个资源有限的环境，但它确实非常容易部署简单应用并分享快速原型。你的 app 现在已经上线，可以轻松分享给其他用户。

## 总结

我们还讲到了模型路由，根据你的优先级是便利性还是让所有内容保留在设备上，对比了 Neutrino 和 OpenRouter 这类托管路由层，以及使用 LlamaIndex router 的本地路由模式。在生产力方面，我们探索了 Llama Packs 这种即插即用构建块，并展示了 Semantic Chunking Query Engine Pack 这类 pack 如何通过生成更连贯的 chunk 来提升检索质量。最后，我们看了 `llamaindex-cli` 工具及其 RAG 模式，并以 Streamlit 部署选项和 Contract Review Expert 的实操部署指南作为收尾。

掌握这些定制和部署技术后，你现在可以构建并分享既实用又适应性强的 LlamaIndex 应用，同时在隐私和成本控制重要时，仍然保持本地优先的工作流。

