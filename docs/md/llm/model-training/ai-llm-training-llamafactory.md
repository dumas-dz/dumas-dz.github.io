---
title: 大模型训练 - LLamaFactory 训练工具
category:
  - LLM
  - LLM Training
tag:
  - 大模型训练
---


## 一、 为什么会出现大模型训练框架？

在正式介绍LLaMAFactory之前，先来探讨一个问题：为什么会出现大模型训练框架？这主要源于大模型微调过程中普遍存在的 **“碎片化”** 与 **“高门槛”** 两大痛点。传统方式下，针对不同模型需要分别实现各类微调算法，不仅代码工作量大，而且高度分散，难以复用和维护。大模型训练框架正是为解决这一问题而生——它们通过提供**统一且高效的平台**，使用户能够灵活地定制和训练上百种大模型，显著降低了技术门槛。

LLaMAFactory作为其中的佼佼者，其核心优势主要体现在以下两点：

1. **极简操作，近乎零代码**

用户无需编写代码，仅通过简单的配置即可完成数据集加载、参数设置并启动训练，极大提升了实验效率。此外，LLaMAFactory还提供了直观的WebUI界面，真正实现了“零代码”训练大模型。（笔者在日常工作中多采用配置文件的方式进行训练，本系列分享为了帮助大家深入理解大模型训练中的超参数设置，也将沿用配置文件的方式展开讲解。）

2. **广泛的模型与算法覆盖**

支持包括LLaMA、Qwen、ChatGLM等在内的**100余种主流模型**，并集成了LoRA、QLoRA、GaLore、DoRA等**前沿高效微调技术**，满足不同场景下的定制需求。

## 二、LLaMAFactory 操作实战

本节笔者将带领大家一步步完成 LLaMAFactory 的实操演练，涵盖环境搭建、模型下载、数据准备、微调训练以及模型合并与部署的全过程。

### 2.1 LLamaFactory 环境搭建

在使用 LLaMAFactory 之前，需要安装 CUDA 驱动、PyTorch、metrics、transformers 等一系列依赖。为避免环境冲突，建议使用 Anaconda 管理 Python 环境。这里提供两种快速搭建环境的方式：

#### 方法一：使用 Lab4AI 大模型实验室平台（推荐）

1. Lab4AI 大模型实验室 提供了开箱即用的服务器实例环境，新用户可获赠 6.5 小时H100使用额度，非常适合快速上手。

2. 在镜像选择页面，可以看到默认镜像已标注 lf0.9.4 字样，说明该镜像已预装 0.9.4 版本的 LLaMAFactory，省去了手动安装的麻烦。根据需要选择显卡型号与数量，点击启动即可：

3. 实例启动后，进入 VS Code 界面，打开终端执行命令验证安装，若无报错，说明环境已就绪。后续操作笔者将基于此镜像进行。

#### 方法二：在自有 GPU 服务器上手动安装

若已有带显卡的 Linux 服务器（建议使用 Linux，Windows 也可但推荐 Linux可以减少安装依赖的复杂程度），可按照以下步骤从源码安装：

```
git clone --depth 1 https://github.com/hiyouga/LlamaFactory.git
cd LlamaFactory
pip install -e .
pip install -r requirements/metrics.txt -r requirements/deepspeed.txt

```

安装成功后界面如下：

> 注意：虽然 LLaMAFactory 支持 CPU 训练和推理，但速度会比 GPU 慢数百甚至数千倍，因此务必使用带显卡的服务器。

为避免环境配置困扰，本期实战推荐使用Lab4AI 大模型实验室平台进行学习。

### 2.2 LLamaFactory模型训练实战

为快速演示，下面笔者将以 `Qwen2.5-0.5B-Instruct` 模型为例，演示从模型下载到微调、合并、部署的完整流程。

1. 下载模型： 为快速演示，我们选用约 900MB 的 Qwen2.5-0.5B-Instruct 模型。使用 ModelScope 命令下载（ModelScope 的使用可参考 大模型训练全流程实战指南基础篇（三）——大模型本地部署实战（Vllm与Ollama））。
modelscope download --model Qwen/Qwen2.5-0.5B-Instruct --local_dir ./Qwen2_5_0_5

2. 获取LLamaFactory源码: 执行如下命令从LLamafactory github仓库中下载源码, 然后进入下载目录。
git clone --depth 1 https://github.com/hiyouga/LlamaFactory.git
cd LlamaFactory

3. 准备数据集： LLaMAFactory 提供了多个示例数据集。进入 LlamaFactory/data 目录，打开 alpaca_zh_demo.json 文件，可见其为 Alpaca 格式的问答数据。后续实战中，大家也可以将自己的数据集整理为相同格式。为了让 LLaMAFactory 识别该数据集，需要在 data/dataset_info.json 中注册。检查该文件，发现示例数据集已被默认注册：

4. 编写训练配置文件： LLaMAFactory 通过“命令行 + 配置文件”的方式启动训练。官方提供了大量示例配置，位于 examples/train_lora/ 目录下。以 qwen3_lora_sft.yaml 为例，其中包含众多超参数。初学者可能感到陌生，后续笔者将专门用一期内容详细解读每个参数的含义。本期目标是跑通流程，因此只需修改关键参数即可。
在工作目录下新建项目文件夹 test_sft，将示例配置复制到该目录下并重命名为 test_qwen_sft.yaml，然后修改以下关键字段：

model_name_or_path: 指定模型路径，改为 /workspace/Qwen2_5_0_5
dataset: 使用在 dataset_info.json 中注册的数据集名称，保持示例中的名称（如 alpaca_zh_demo）
template: 根据模型选择对话模板。对于 Qwen 系列，通常设为 qwen（原示例中为 qwen3_nothink，需修改）
output_dir: 训练输出目录，设为 /workspace/test_sft/Qwen2_5_sft
num_train_epochs: 训练轮数，为快速演示设为 1

其余参数可暂时保持默认，修改后的配置文件内容大致如下（只展示关键行）：

5. 启动训练： 在 LlamaFactory 目录下执行以下命令开始微调：
llamafactory-cli train /workspace/test_sft/test_qwen_sft.yaml

训练过程日志如下：

训练完成后，输出目录 /workspace/test_sft/Qwen2_5_sft 下保存了 LoRA 适配器权重及中间检查点：

6. 合并 LoRA 权重与基座模型: 由于使用的是 LoRA 高效微调，训练后只生成了约 20MB 的适配器文件，并非完整模型。要得到可供部署的完整模型，需要将适配器与原始模型合并。LLaMAFactory 同样提供了合并配置示例，位于 examples/merge_lora/qwen3_lora_sft.yaml。将其复制到 /workspace/test_sft/test_qwen_merge_sft.yaml，并修改参数如下：
### Note: DO NOT use quantized model or quantization_bit when merging lora adapters

### model
model_name_or_path: /workspace/Qwen2_5_0_5
adapter_name_or_path: /workspace/test_sft/Qwen2_5_sft
template: qwen
trust_remote_code: true

### export
export_dir: /workspace/test_sft/Qwen2_5_sft_all
export_size: 5
export_device: cpu  # choices: [cpu, auto]
export_legacy_format: false

然后在 LlamaFactory 目录下执行合并命令：
llamafactory-cli export /workspace/test_sft/test_qwen_merge_sft.yaml

合并成功后，完整模型将保存在 /workspace/test_sft/Qwen2_5_sft_all 目录下，大小与原始模型相当（约 1g）：

7. 部署与测试: 使用 vLLM 启动模型服务(对vllm部署不了解的看笔者 大模型训练全流程实战指南基础篇（三）——大模型本地部署实战（Vllm与Ollama） 文章)：
vllm serve /workspace/test_sft/Qwen2_5_sft_all --served-model-name Qwen2_5 --max-model-len 8096 --gpu-memory-utilization 0.9 --port 6666

然后编写 Python 脚本调用模型(同样参考大模型训练全流程实战指南基础篇（三）——大模型本地部署实战（Vllm与Ollama）)
from openai import OpenAI
client = OpenAI(base_url="http://localhost:6666/v1", api_key="EMPTY")
response = client.chat.completions.create(model="Qwen2_5", messages=[{"role": "user", "content": "识别并解释给定列表中的两个科学理论：细胞理论和日心说。"}])
print(response.choices[0].message.content)

测试结果如下:

通过以上步骤，大家成功使用 LLaMAFactory 对 Qwen2.5-0.5B 模型进行了微调，并将 LoRA 权重合并回完整模型，最后通过 vLLM 部署测试。可见 LLaMAFactory 大大简化了模型微调的流程，真正做到了高效、易用。至于训练配置文件中各项参数的具体含义及调优技巧，笔者将在下一期内容中深入剖析，帮助大家不仅知其然，更知其所以然，成为大模型训练专家！

## 三、总结

本期分享以 LLaMAFactory 大模型训练框架 为例，从环境搭建到模型下载、数据准备、微调训练、权重合并及部署测试，完整演示了 Qwen2.5-0.5B 的实战流程，充分展现了 LLaMAFactory 极简操作与广泛模型兼容的核心优势。通过本文大家可快速上手大模型微调，并掌握从训练到部署的全链路方法。下一期笔者将深入解析训练配置文件中的各项参数，帮助大家真正成为调参高手，敬请期待！

除大模型训练外，笔者也在同步更新《深入浅出LangChain&LangGraph AI Agent 智能体开发》专栏，要说明该专栏适合所有对 LangChain 感兴趣的学习者，无论之前是否接触过 LangChain。该专栏基于笔者在实际项目中的深度使用经验，系统讲解了使用LangChain/LangGraph如何开发智能体，目前已更新 41 讲，并持续补充实战与拓展内容。欢迎感兴趣的同学关注笔者的掘金账号与专栏，也可关注笔者的同名微信公众号**大模型真好玩**，每期分享涉及的代码均可在公众号私信: **LangChain智能体开发**免费获取。