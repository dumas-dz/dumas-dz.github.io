---
title: LangChain - 开发环境搭建
category:
  - LLM
  - LangChain
tag:
  - LangChain
description: "本知识库示例统一使用 Python 3.11。不同 LangChain 版本的支持范围可能变化，安装前应查看所选版本的包元数据、发布说明和兼容矩阵。"
order: 20
outline: [2, 3]
---


### 2.1 Python 环境准备（3.9+ 推荐）

本知识库示例统一使用 Python 3.11。不同 LangChain 版本的支持范围可能变化，安装前应查看所选版本的包元数据、发布说明和兼容矩阵。

#### 2.1.1 安装Python（分系统操作）

- 下载安装包：访问Python官方网站（www.python.org/downloads/w…），选择“Python 3.10.x”（稳定版），点击“Windows Installer (64-bit)”下载；


- 安装步骤：双击安装包，务必勾选“Add Python 3.10 to PATH”（关键！避免后续无法在命令行调用Python），然后点击“Install Now”，默认安装即可；


- 验证安装：打开CMD命令行，输入 python --version，若输出“Python 3.10.x”，则安装成功。


- 方式1（推荐）：使用Homebrew安装（需先安装Homebrew，官网：brew.sh/），打开终端，输入命令：brew install python@3.10；


- 方式2：官网下载安装包（www.python.org/downloads/m…），双击安装，默认勾选“Add Python to PATH”；


- 验证安装：终端输入 python3 --version（Mac默认自带Python 2.7，需用python3区分），输出“Python 3.10.x”即为成功。


- 更新软件源：终端输入 sudo apt update；


- 安装Python 3.10：输入 sudo apt install python3.10 python3.10-pip；


- 验证安装：输入 python3.10 --version，输出对应版本号即为成功。


#### 2.1.2 常见问题排查

- 问题1：Windows命令行输入python提示“不是内部或外部命令”——未勾选“Add Python to PATH”，重新安装并勾选，或手动配置环境变量（百度“Python环境变量配置Windows”）；


- 问题2：Mac/Linux输入python3提示“command not found”——Homebrew安装失败，重新执行brew install python@3.10，或检查Homebrew是否正常；


- 问题3：版本冲突（如同时安装多个Python版本）——使用虚拟环境隔离（详见2.5节），避免全局环境混乱。


### 2.2 安装 LangChain 及其核心包

LangChain 的包结构会随版本演进。学习环境先安装核心编排能力，再按模型、社区集成和向量库需求安装扩展包；生产项目必须提交锁文件。

#### 2.2.1 核心包说明（必装/可选）

#### 2.2.2 安装命令（简洁可复制）

```bash
python -m pip install --upgrade pip
python -m pip install langchain langchain-core
```

按需安装模型与社区集成：

```bash
python -m pip install langchain-openai
python -m pip install langchain-community
```

学习示例不在文档中长期固定第三方小版本；实际项目应根据官方兼容矩阵选定版本，并用 `requirements.txt`、`pyproject.toml` 或锁文件保证可复现。

#### 2.2.3 验证安装

```python
from langchain_core.prompts import PromptTemplate

prompt = PromptTemplate.from_template("你好，{name}！欢迎学习 LangChain")
print(prompt.format(name="开发者"))
```

### 2.3 配置主流 LLM 的 API 密钥（OpenAI、DeepSeek、Qwen、Ollama）

LangChain本身不提供大模型，需对接外部LLM（云端API或本地模型），核心是配置对应模型的API密钥（云端模型）或部署本地模型（如Ollama）。本节覆盖4种主流LLM的配置方法，按需选择（新手推荐先从DeepSeek、Qwen等国内模型入手，无需科学上网）。

#### 2.3.1 云端模型配置（OpenAI、DeepSeek、Qwen）

云端模型无需本地部署，只需获取API密钥，即可通过LangChain调用，适合快速开发验证。

- 获取API密钥：访问OpenAI平台（platform.openai.com/），注册/登录后，进入「Personal → View API keys」，点击「Create new secret key」生成密钥；


- LangChain调用示例（简短代码）：


```python
from langchain_openai import ChatOpenAI

# 配置API密钥（后续会用.env管理，此处先直观展示）
llm = ChatOpenAI(
    model_name="gpt-3.5-turbo",
    api_key="你的OpenAI API密钥",
    temperature=0.7
)

# 调用模型生成文本
print(llm.invoke("简单介绍LangChain"))
```

依赖安装：需额外安装OpenAI适配包，命令：pip install langchain-openai==0.1.6；代码来源：LangChain OpenAI集成文档（python.langchain.com/docs/integr…）。

- 获取API密钥：访问DeepSeek平台（platform.deepseek.com/），注册/登录后，进入「API密钥」页面，创建并复制密钥；


- LangChain调用示例：


```python
from langchain_community.chat_models import ChatDeepSeek

llm = ChatDeepSeek(
    model_name="deepseek-chat",
    api_key="你的DeepSeek API密钥"
)

print(llm.invoke("用一句话说明LangChain的作用"))
```

依赖说明：无需额外安装包（langchain-community已集成）；代码来源：LangChain DeepSeek集成文档（python.langchain.com/docs/integr…）。

- 获取API密钥：访问通义千问开放平台（dashscope.aliyun.com/），注册/登录后，进入「API密钥」页面，创建密钥；


- LangChain调用示例：


```python
from langchain_community.chat_models import ChatQwen

llm = ChatQwen(
    model_name="qwen-turbo",
    api_key="你的Qwen API密钥"
)

print(llm.invoke("LangChain适合开发什么类型的应用？"))
```

依赖安装：需额外安装适配包，命令：pip install dashscope==1.14.0；代码来源：LangChain Qwen集成文档（python.langchain.com/docs/integr…）。

#### 2.3.2 本地模型配置（Ollama，无需API密钥）

Ollama是一款轻量级本地大模型部署工具，支持llama 3、Qwen、Llama 2等开源模型，无需API密钥，适合无网络或隐私敏感场景，配置步骤如下：

- 安装Ollama：访问官网（ollama.com/），下载对应系统版本（Windows/Mac/Linux），默认安装即可；


- 拉取本地模型：打开终端，输入命令（拉取轻量版llama 3，约4.7GB，适合入门）：ollama pull llama3:8b；


- LangChain调用示例：


```python
from langchain_community.chat_models import ChatOllama

# 调用本地llama 3模型
llm = ChatOllama(model="llama3:8b")

print(llm.invoke("介绍一下你自己"))
```

依赖说明：无需额外安装包（langchain-community已集成）；代码来源：LangChain Ollama集成文档（python.langchain.com/docs/integr…）；注意：本地模型运行需占用一定内存（8b模型建议16GB以上内存）。

#### 2.3.3 常见问题

- 问题1：API密钥无效/报错“invalid api key”——检查密钥是否复制完整，是否有空格，或重新生成密钥；


- 问题2：OpenAI调用报错“Connection error”——未科学上网，或网络不稳定，切换网络后重试；


- 问题3：Ollama调用报错“model not found”——未拉取对应模型，执行ollama pull 模型名重试。


### 2.4 使用 .env 文件管理敏感信息

上一节中，我们将API密钥直接写在代码里，这种方式存在严重安全隐患（代码提交到GitHub、分享给他人时，密钥会泄露）。最佳实践是使用.env文件管理敏感信息，通过环境变量加载，避免硬编码。

#### 2.4.1 安装依赖包

使用python-dotenv包加载.env文件，安装命令：

```bash
pip install python-dotenv==1.0.1
```

#### 2.4.2 创建 .env 文件（关键步骤）

- 在你的LangChain项目根目录下，新建一个文件，命名为.env（注意：文件名前有一个小数点，无后缀）；


- 在.env文件中，按“KEY=VALUE”格式填写所有敏感信息（如API密钥），示例：


```text
# .env 文件内容（敏感信息统一管理）
OPENAI_API_KEY=你的OpenAI API密钥
DEEPSEEK_API_KEY=你的DeepSeek API密钥
QWEN_API_KEY=你的Qwen API密钥
# 无需填写Ollama相关信息（本地模型无密钥）
```

#### 2.4.3 在代码中加载 .env 文件

使用python-dotenv加载环境变量，代码示例（以调用DeepSeek为例）：

```python
from langchain_community.chat_models import ChatDeepSeek
from dotenv import load_dotenv
import os

# 加载.env文件中的环境变量
load_dotenv()

# 从环境变量中获取API密钥（无需硬编码）
llm = ChatDeepSeek(
    model_name="deepseek-chat",
    api_key=os.getenv("DEEPSEEK_API_KEY")  # 读取.env中的密钥
)

print(llm.invoke("LangChain如何管理敏感信息？"))
```

代码来源：LangChain官方最佳实践（python.langchain.com/docs/get_st…）。

#### 2.4.4 关键注意事项

- 提交代码时，务必将.env文件加入.gitignore（新建.gitignore文件，添加一行.env），避免泄露敏感信息；


- .env文件需与运行的Python脚本在同一目录下，否则需指定文件路径（load_dotenv("xxx/.env")）；


- 若加载失败，检查环境变量名称是否与.env文件中一致（区分大小写）。


### 2.5 虚拟环境与依赖隔离（venv / conda）

在开发过程中，不同项目可能需要不同版本的依赖包（如A项目用LangChain 0.1.10，B项目用LangChain 0.2.0），直接安装在全局环境会导致版本冲突。虚拟环境可以实现“项目级依赖隔离”，每个项目拥有独立的依赖环境，互不干扰。

本节介绍两种常用虚拟环境工具：venv（Python自带，轻量）和conda（适合数据科学场景，功能强大），按需选择。

#### 2.5.1 使用 venv 创建虚拟环境（推荐新手）

venv是Python 3.3+自带的虚拟环境工具，无需额外安装，操作简单。

- 创建虚拟环境：打开终端，进入你的LangChain项目目录，执行命令（env为虚拟环境名称，可自定义）：# Windows/Mac/Linux通用 python -m venv env  # Windows用python，Mac/Linux用python3


- 激活虚拟环境：
激活成功后，终端提示符前会出现(env)，表示当前处于虚拟环境中。

Windows（CMD）：env\Scripts\activate

Windows（PowerShell）：.\env\Scripts\Activate.ps1

Mac/Linux：source env/bin/activate

激活虚拟环境：
激活成功后，终端提示符前会出现(env)，表示当前处于虚拟环境中。

- Windows（CMD）：env\Scripts\activate


- Windows（PowerShell）：.\env\Scripts\Activate.ps1


- Mac/Linux：source env/bin/activate


- 安装依赖：在虚拟环境中，执行之前的LangChain安装命令，依赖会安装在虚拟环境中，不影响全局；


- 退出虚拟环境：终端输入deactivate即可。


#### 2.5.2 使用 conda 创建虚拟环境（适合数据科学场景）

conda 适合需要管理 Python 二进制包、GPU 依赖或数据科学工具链的项目：

```bash
conda create -n langchain-env python=3.11
conda activate langchain-env
python -m pip install --upgrade pip
python -m pip install langchain langchain-core
conda deactivate
```

如需删除环境，执行 `conda remove -n langchain-env --all`。团队项目应把环境名、Python 版本和依赖锁定规则写入 README 或环境文件。

#### 2.5.3 依赖导出与导入（实用技巧）

为了方便他人复现你的环境，或在其他设备上快速搭建，可将虚拟环境的依赖导出为requirements.txt文件：

```bash
# 导出依赖（虚拟环境中执行）
pip freeze > requirements.txt
```

他人导入依赖时，执行：

```bash
pip install -r requirements.txt
```

### 2.6 安装常用向量数据库（Chroma、FAISS、Pinecone）

向量数据库负责保存 Embedding 并执行相似度检索。开发阶段优先选择可本地复现的方案；生产选型还要比较一致性、过滤能力、运维、成本和数据迁移边界。

#### 2.6.1 Chroma（本地轻量）

```bash
python -m pip install chromadb
```

```python
import os

from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

vector_db = Chroma.from_texts(
    texts=["LangChain 用于组合模型、数据和工具。"],
    embedding=OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY")),
    persist_directory="./chroma_db",
)
print(vector_db.similarity_search("LangChain 有什么用途？", k=1))
```

#### 2.6.2 FAISS（本地向量检索）

FAISS 提供高效向量检索能力，但索引持久化、元数据过滤、鉴权和服务化仍由应用层负责：

```bash
python -m pip install faiss-cpu
```

```python
import os

from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

vector_db = FAISS.from_texts(
    texts=["LangChain 支持多种向量数据库。"],
    embedding=OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY")),
)
vector_db.save_local("faiss_db")
print("FAISS index saved")
```

#### 2.6.3 Pinecone（托管服务）

```bash
python -m pip install langchain-pinecone
```

```python
import os

from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings

vector_db = PineconeVectorStore.from_texts(
    texts=["托管向量服务适合需要弹性扩展的场景。"],
    embedding=OpenAIEmbeddings(api_key=os.getenv("OPENAI_API_KEY")),
    index_name=os.environ["PINECONE_INDEX_NAME"],
)
print("Pinecone index ready")
```

API Key、索引名和环境信息统一从环境变量注入；不要把云密钥写入 Notebook 或提交到 Git。

### 2.7 Jupyter Notebook 与 VS Code 调试技巧

#### 2.7.1 Jupyter Notebook（适合快速验证）

- 每个步骤单独运行，依次验证 Prompt、模型和解析器输出。
- 先用小输入和 `max_tokens` 控制成本，再扩大测试数据。
- 不在 Notebook 中保存 API Key；使用 `.env` 或运行环境注入。
- 报错后清空输出并从失败单元开始重跑，避免旧变量掩盖问题。

```python
from langchain_core.prompts import PromptTemplate
from langchain_community.chat_models import ChatDeepSeek

prompt = PromptTemplate.from_template("{question}")
llm = ChatDeepSeek(api_key=__import__("os").getenv("DEEPSEEK_API_KEY"))
response = llm.invoke(prompt.format(question="如何调试 LangChain 调用链？"))
print(response.content)
```

#### 2.7.2 VS Code（适合项目开发）

- 选择项目虚拟环境，并让解释器、测试和终端使用同一环境。
- 在模型调用、工具调用和输出解析处设置断点，检查输入、输出、耗时和异常。
- 为关键组件写最小测试，不把所有验证都留在 Notebook。
- 使用 `launch.json` 固定环境变量名称，但不保存变量值。

```python
from langchain.chains import LLMChain

chain = LLMChain(llm=llm, prompt=prompt, verbose=True)
print(chain.invoke({"question": "LangChain 调试技巧"}))
```

#### 2.7.3 通用调试技巧

```python
import logging

logging.basicConfig(level=logging.INFO)
```

- 先看异常类型和最后一行，再沿调用栈定位组件初始化、参数传递和外部调用。
- 分别验证 Prompt 渲染结果、模型原始响应、解析器输入和最终业务结果。
- 对超时、限流、解析失败和依赖不可用设置明确错误信息与恢复动作。
- 日志记录 requestId、组件、模型、耗时和结果，不记录 API Key 或完整敏感输入。

### 2.8 【实战】验证环境：调用本地/云端大模型

本节通过一个完整实战案例，验证整个开发环境是否配置成功——分别调用「云端模型（DeepSeek）」和「本地模型（Ollama）」，实现简单的文本生成功能，整合前面所学的.env管理、虚拟环境、组件调用等知识点。

#### 2.8.1 实战准备

- 确保已激活虚拟环境；


- 确保.env文件已配置DeepSeek API密钥（Ollama无需配置）；


- 确保已安装所需依赖（langchain-core、langchain-community、python-dotenv、ollama（本地模型））。


#### 2.8.2 实战代码（完整可运行）

```python
"""
实战：验证LangChain开发环境，调用云端/本地大模型
代码来源：LangChain官方实战示例改编（https://python.langchain.com/docs/get_started/quickstart）
"""
from dotenv import load_dotenv
import os
from langchain_community.chat_models import ChatDeepSeek, ChatOllama
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain

# 1. 加载环境变量（敏感信息管理）
load_dotenv()

# 2. 定义Prompt模板
prompt = PromptTemplate.from_template(
    "请用简洁的语言回答以下问题：{question}\n回答要求：不超过50字，通俗易懂。"
)

# 3. 调用云端模型（DeepSeek）
print("=== 调用云端模型（DeepSeek） ===")
try:
    cloud_llm = ChatDeepSeek(
        model_name="deepseek-chat",
        api_key=os.getenv("DEEPSEEK_API_KEY")
    )
    cloud_chain = LLMChain(llm=cloud_llm, prompt=prompt, verbose=False)
    cloud_response = cloud_chain.invoke({"question": "LangChain环境搭建的核心步骤是什么？"})
    print("云端模型回答：", cloud_response["text"])
except Exception as e:
    print("云端模型调用失败：", str(e))

# 4. 调用本地模型（Ollama - llama3:8b）
print("\n=== 调用本地模型（Ollama - llama3） ===")
try:
    local_llm = ChatOllama(model="llama3:8b")
    local_chain = LLMChain(llm=local_llm, prompt=prompt, verbose=False)
    local_response = local_chain.invoke({"question": "LangChain环境搭建的核心步骤是什么？"})
    print("本地模型回答：", local_response["text"])
except Exception as e:
    print("本地模型调用失败：", str(e))

print("\n=== 环境验证完成 ===")
if "cloud_response" in locals() or "local_response" in locals():
    print("✅ 至少一种模型调用成功，环境配置正常！")
else:
    print("❌ 模型调用失败，请检查环境配置！")
```

#### 2.8.3 运行结果与解读

```text
=== 调用云端模型（DeepSeek） ===
云端模型回答： 安装Python、LangChain核心包，配置LLM API密钥，用.env管理敏感信息。
=== 调用本地模型（Ollama - llama3） ===
本地模型回答： 准备Python环境，安装依赖，配置模型，验证调用即可完成LangChain环境搭建。
=== 环境验证完成 ===
✅ 至少一种模型调用成功，环境配置正常！
```

- 代码整合了「.env敏感信息管理」「Prompt模板」「LLMChain链式调用」「云端/本地模型适配」，覆盖本章核心知识点；


- 若云端模型调用失败，优先检查API密钥、网络（如OpenAI需科学上网）；


- 若本地模型调用失败，检查Ollama是否安装、模型是否拉取成功（执行ollama list查看已拉取模型）。


#### 2.8.4 常见问题排查

- 问题1：报错“ModuleNotFoundError: No module named 'langchain_community'”——未安装langchain-community包，执行pip install langchain-community；


- 问题2：本地模型调用报错“Connection refused”——Ollama服务未启动，重启Ollama（Windows在服务中重启，Mac/Linux执行ollama serve）；


- 问题3：链式调用报错“KeyError: 'text'”——检查LLM调用是否成功，可单独打印cloud_llm.invoke("测试")，查看是否有响应。


### 本章小结

本章我们完成了LangChain开发环境的全流程搭建，从Python环境准备、核心包安装，到LLM API密钥配置、敏感信息管理，再到虚拟环境隔离、向量数据库安装和调试工具使用，最后通过实战验证了环境的可用性。

核心要点回顾：

- Python 3.9~3.11是LangChain的最佳适配版本，避免版本过高或过低导致的兼容性问题；


- langchain-core和langchain-community是必装核心包，按需安装扩展包；


- 敏感信息（API密钥）必须用.env文件管理，避免硬编码，提交代码时忽略.env文件；


- 虚拟环境是依赖隔离的关键，推荐用venv（新手）或conda（数据科学场景）；


- Chroma适合新手开发测试，FAISS适合本地大规模数据，Pinecone适合生产环境；


- Jupyter适合快速验证，VS Code适合项目开发，断点调试和日志打印是定位问题的核心技巧。


环境搭建完成后，下一章我们将深入学习LangChain的核心组件——Prompt模板，掌握Prompt工程的技巧，让大模型生成更精准、更符合需求的回答。
