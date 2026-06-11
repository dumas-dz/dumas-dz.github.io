---
title: 大模型训练 - API 调用实战
category:
  - LLM
  - LLM Training
tag:
  - 大模型训练
---

## 一、OpenAI协议：大模型对话的通用语言

### 1.1 什么是OpenAI格式？

如今的大模型就像是一个功能强大的“万能API”，能够通过简单的接口调用即可实现诗歌创作、问题解答、代码编写甚至哲学思辨等复杂任务。实现这一切的关键，在于一套标准化的调用方式——即笔者今天要深入介绍的 **OpenAI格式**。

OpenAI格式如今已成为绝大多数主流大模型API调用的事实标准，它如同AI领域的“通用语言”或“普通话”，使得不同厂商、不同架构的大模型能够以统一的通信方式与用户交互，极大地降低了开发者的学习和集成成本。

### 1.2 OpenAI协议的核心：标准化传输格式与消息规范

OpenAI协议本身并不复杂，它本质上是在传统HTTP协议基础上封装的一套专用规范，明确规定了与大模型交互时**请求应包含的参数结构**与**响应要返回的数据格式**。

#### 1.2.1 请求参数详解

一个典型的OpenAI格式请求主要包含以下核心参数：

1. **base_url**：大模型服务的API地址。

2. **api_key**：用于身份验证和权限控制的密钥（本地部署时可简化或省略）。

3. **messages**：**核心的参数**，以列表形式定义了完整的对话上下文。列表中的每个元素都是一个消息对象，包含`role`和`content`两个基本字段。消息中的`role`（角色）主要分为以下几种类型，共同构成多轮对话的逻辑结构：

system：系统指令，用于设定模型的背景、行为或身份（例如：“你是一个乐于助人的AI助手”）。
user：用户输入的问题或指令。
assistant：模型之前的回复记录，用于维持对话历史。
tool（扩展角色）：与下文提到的函数调用（Function Calling）功能配套使用。

##### 扩展：Function Calling与tool角色

随着大模型能力演进，OpenAI格式扩展了**函数调用（Function Calling）**  能力，使模型能够理解并请求调用外部工具或函数。这引入了两个新的关键字段：

- **`tool_calls`**：通常出现在`assistant`返回的消息中，模型通过此字段声明它希望调用哪些函数，并给出调用参数。

- **`tool`** 角色消息：当用户（或系统）根据模型的`tool_calls`执行了相应函数后，需要将执行结果以`tool`角色消息的形式反馈给模型。此消息除了`role`和`content`（函数执行结果）外，还必须包含 `tool_call_id`，用于关联先前的函数调用请求。

> 提示：Function Calling是构建智能体（Agent）和实现复杂应用的基础。本系列后续将推出专门内容，深入探讨如何训练和增强大模型的函数调用与指令遵循能力。如果大家想提前了解其应用，可以参考笔者的往期文章《从0到1开发DeepSeek天气助手智能体——你以为大模型只会聊天？Function Calling让它“上天入地”》。

#### 1.2.2 响应返回格式

根据调用时是否启用流式传输（`stream`），大模型的响应格式分为两种：

**1. 非流式响应**

一次性接收完整的模型回复，返回一个完整的 `chat completion` 对象，主要字段包括：

- `id`：本次会话的唯一标识符。

- `choices`：一个列表，其中`message`对象的`content`字段包含了模型的完整回复文本（Function calling的`message`对象中包括`tool_calls`内容）。

- `created`：响应生成的时间戳。

- `model`：所使用模型的名称。

- `usage`：本次请求的令牌消耗统计，包括提示（prompt）和生成（completion）的token数量。

**2. 流式响应**

以数据流（Stream）的形式逐块（chunk）返回结果，用户体验更佳，能实时看到生成过程。返回的是多个 `chat completion chunk` 对象序列。其结构与上述对象类似，但核心区别在于：

- `choices` 列表中的 `delta` 字段：它包含模型**最新生成**的增量内容（如`content`），而非完整消息。例如，第一个chunk的`delta.content`可能是“Hel”，第二个是“lo”，最终拼接成“Hello”。

通过理解上述请求与响应的标准格式，大家便掌握了使用OpenAI格式与大模型对话的“语法”，这是进行一切后续开发工作的基石。

## 二、大模型API调用实战

### 2.1 模型部署

经过前面的理论讲解，相信大家对OpenAI请求格式已经有了初步的认识。然而，要真正掌握它，动手实践是关键的第一步。首先需要在本地环境中部署一个可用的大模型。

1. 创建实例：  打开Lab4AI官网，创建一个新的 VS Code 云实例。

2. 选择镜像：  在创建实例的页面，选择包含必要模型和环境的镜像，完成实例创建。

3. 查看预置模型: Lab4AI平台非常贴心在大家启动的实例中已预置了部分常用模型。可以在 VS Code 终端的命令行中执行 cd /shared-only/models 来查看。

4. 启动 vLLM 服务: 笔者这里同样使用了大模型训练全流程实战指南基础篇（三）——大模型本地部署实战（Vllm与Ollama）中所讲的vllm 部署方方式，同样使用Qwen-4B来测试部署 vllm serve ./Qwen3-4B/ --served-model-name Qwen3-4B --api-key 111 --max-model-len 32768 --gpu-memory-utilization 0.9 --port 6666

服务成功启动后模型就处于待命状态了。接下来笔者将使用Python代码来调用它。

### 2.2 Requests库底层实现

为了帮助大家“知其然，更知其所以然”，笔者先不直接使用封装好的`openai`库，而是从更底层的`requests`库开始，亲手实现一遍API调用流程。

1. **导入相关依赖:**

```
import requests
import json
import time

```

1. **定义OpenAI客户端类：** 该类构造函数接收API的基础URL和密钥。

```
class OpenAI:
    def __init__(self, base_url, api_key):
        self.api_key = api_key
        self.base_url = base_url
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

```

1. **构造请求方法：** 按照笔者上面分享的OpenAI格式规范组装请求参数并发起POST请求。

```
def make_request(self, model, messages):
    url = f"{self.base_url}/chat/completions"

    # 默认参数
    payload = {
        "model": model,
        "messages": messages,
        "stream": False,  # 非流式
        "max_tokens": 2048,
        "temperature": 0.7,
        "top_p": 1.0,
    }

    response = requests.post(
        url,
        headers=self.headers,
        json=payload,
    )

    return response

```

**参数说明**：

- `model`, `messages` 是核心参数。

- `temperature`（温度）：控制输出的随机性。值越高（如0.8），输出越富有创意和多样性；值越低（如0.2），输出越确定和保守。

- `top_p`（核采样）：另一种控制多样性的方式。它从累积概率超过p的最小词集中采样。值越低，输出越集中和可预测，值越高输出结果越严谨

大家可以回顾大模型训练全流程实战指南基础篇（二）——大模型文件结构解读与原理解析中介绍的Modelscope Qwen3-4B文件列表， 这些参数通常可以在模型文件中的 `generation_config.json` 里找到默认值。若想复现论文或特定效果，应确保参数与配置文件一致。

1. **解析响应结果：** 根据OpenAI响应格式，从返回的JSON中提取关键信息。

```
def extract_response(self, result):
    if "choices" in result and len(result["choices"]) > 0:
        message = result["choices"][0].get("message", {})
        content = message.get("content", "")
        finish_reason = result["choices"][0].get("finish_reason", "")

        # 提取使用情况
        usage = result.get("usage", {})
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        total_tokens = usage.get("total_tokens", 0)

        # 显示结果
        print(f"✓ Tokens使用: 提示={prompt_tokens}, 完成={completion_tokens}, 总计={total_tokens}")
        print(f"✓ 完成原因: {finish_reason}")
        print("\n" + "=" * 50)
        print("模型回复:")
        print("=" * 50)
        print(content)
        print("=" * 50)

        # 返回完整响应
        return {
            "content": content,
            "role": message.get("role", "assistant"),
            "finish_reason": finish_reason,
            "usage": usage,
            "full_response": result
        }
    else:
        print("响应中没有找到有效内容")
        return None

```

1. **整合聊天方法：** 将请求与解析过程整合，提供简洁的`chat`接口。

```
def chat_completion(self,  model, messages):
    # 发送请求
    response = self.make_request(model, messages)
    print(response)
    # 检查响应状态
    if response.status_code != 200:
        print(f"HTTP错误: {response.status_code}")
        print(f"错误信息: {response.text}")
        return None
    # 解析响应
    result = response.json()
    return self.extract_response(result)

def chat(self,  model, messages):
    # 调用API
    result = self.chat_completion(model, messages)

    if result:
        return result["content"]
    else:
        return None

```

1. **执行测试：** 创建客户端，发起一次简单的对话。运行成功！可以看到代码不仅正确输出了模型回复，还显示了详细的用量分析：用户输入消耗18个token，模型输出消耗135个token，总计153个token。

```
if __name__ == "__main__":
    # 替换为你的API Key
    base_url = 'http://localhost:6666/v1'
    API_KEY = "111"
    model = 'Qwen3-4B'

    # 创建客户端
    client = OpenAI(base_url, API_KEY)

    messages = [
        {"role": "system", "content": "你是一个小助手"},
        {"role": "user", "content": "你好"}
    ]

    response = client.chat(model,messages)

```

### 2.3 openai库实现

使用`requests`库进行底层实现虽然有助于理解原理，但过程稍显繁琐。官方`openai`库已经封装了所有这些逻辑。对比一下，使用`openai`库实现相同功能仅需寥寥数行：

```
from openai import OpenAI
client = OpenAI(base_url="http://localhost:6666/v1", api_key="111")
messages = [
    {"role": "system", "content": "你是一个小助手"},
    {"role": "user", "content": "你好"}
]
response = client.chat.completions.create(model="Qwen3-4B", messages=messages)
print(response.choices[0].message.content)

```

运行结果与上小节的底层实现完全一致，但代码简洁性有了质的飞跃:

通过对比大家可以清晰地看到：**`openai`库的本质，就是对符合OpenAI格式标准的HTTP请求/响应进行高度封装，提供了一套优雅、易用的Python接口。**  理解其底层原理，能帮助大家在遇到问题时进行有效调试，并在需要时进行灵活的定制化开发。

## 三、构建多轮对话机器人

许多人可能好奇，像ChatBox、CherryStudio这类应用是如何实现多轮对话功能的。其实，其核心逻辑并不复杂。通过分析其通信过程可以发现，关键在于**妥善维护对话历史**并有效利用大模型自身的上下文理解能力。

接下来笔者将带领大家实现一个运行在命令行环境中的多轮对话机器人。结合之前讲解的知识，并引入**流式调用**，让大家直观感受其实时输出的效果，并理解其背后的请求与响应格式。

1. **导入依赖并初始化客户端：** 引入必要的库并配置好连接本地模型的客户端。

```
from openai import OpenAI

# 初始化客户端
client = OpenAI(base_url="http://localhost:6666/v1", api_key="111")

```

1. **设计交互界面：** 为程序添加一个简单的命令行引导界面，说明基本操作。

```
print("=" * 50)
print("欢迎使用多轮对话机器人！(流式输出版)")
print("输入 'exit' 或 'quit' 退出程序")
print("输入 'clear' 或 'reset' 清除对话历史")
print("=" * 50)

```

1. **实现核心对话循环**

这里是程序的核心，主要实现两个关键机制：

- **多轮对话历史维护**：每次对话都将用户输入和AI回复完整地追加到 `messages` 列表中，并在下次请求时发送整个历史。大模型经过专门训练，能够基于完整的上下文进行连贯回复。

- **流式调用处理**：通过设置 `stream=True` 启用流式响应。响应内容不再是一次性返回的完整消息，而是通过一系列数据块（chunk）逐步返回，每个块的增量内容（`delta.content`）需要被拼接起来，直到收到结束信号。

```
messages = [
    {"role": "system", "content": "你是一个友好的AI助手，乐于帮助用户解决问题。"}
]
turn_count = 1
while True:
    try:
        user_input = input(f"\n[第{turn_count}轮] 你: ").strip()
        if user_input.lower() in ['exit', 'quit', '退出']:
            print("再见！")
            break
        if user_input.lower() in ['clear', 'reset', '清除', '重置']:
            messages = [
                {"role": "system", "content": "你是一个友好的AI助手，乐于帮助用户解决问题。"}
            ]
            turn_count = 1
            print("对话历史已清除，开始新的对话")
            continue
        if not user_input:
            continue
        messages.append({"role": "user", "content": user_input})
        print("\nAI: ", end="", flush=True)
        try:
            # 流式请求
            full_response = ""
            stream = client.chat.completions.create(
                model="Qwen3-4B",
                messages=messages,
                stream=True,  # 启用流式输出
                max_tokens=1000
            )
            # 逐块处理响应
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    content = chunk.choices[0].delta.content
                    print(content, end="", flush=True)
                    full_response += content
            print()  # 换行
            # 将AI回复添加到消息列表
            if full_response:
                messages.append({"role": "assistant", "content": full_response})
                turn_count += 1
        except Exception as e:
            print(f"\n请求出错: {e}")
            if messages and messages[-1]["role"] == "user":
                messages.pop()
    except KeyboardInterrupt:
        print("\n\n程序被中断，再见！")
        break
    except EOFError:
        print("\n\n检测到文件结束，再见！")
        break

```

1. **运行测试：** 运行程序进行测试。在第一轮对话中笔者告诉AI“我的名字是苍井空”。在第二轮中，当笔者问“我叫什么名字？”时，大模型能够成功回忆起上下文，给出正确答复。这演示了大模型的多轮对话能力，也是众多聊天应用的基础。

## 四、总结

本文系统分享了如何通过OpenAI格式调用本地大模型。首先解析了作为行业标准的OpenAI协议，详细说明了请求与响应的数据结构。接着通过实战演示，从使用requests库底层实现到调用openai库简化操作，完整展示了API对接流程，并构建了支持流式输出的多轮对话机器人，让开发者能够快速掌握大模型集成与应用开发的核心技能。

在对大模型的基础知识有了一定了解之后，从下一期开始将正式进入本系列的**工具篇**。笔者将带领大家一同梳理训练大模型的完整步骤，并深入介绍每个环节所需的**核心工具与平台**。大家敬请期待！
