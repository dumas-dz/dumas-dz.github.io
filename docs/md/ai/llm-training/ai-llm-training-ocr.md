---
title: 大模型训练 - OCR 工具实战
category:
  - AI
  - LLM Training
tag:
  - 大模型训练
---

> 原文链接：[掘金](https://juejin.cn/post/7605859660613042210)

## 前言

上篇文章[《大模型训练全流程实战指南工具篇（五）——大模型训练全流程步骤详解与对应工具推荐》](https://juejin.cn/post/7601313474719301667)笔者系统梳理了大模型训练的三大核心阶段——数据工程、训练工程、评测工程，并为每个环节推荐了关键工具。从本期开始将进入“工具实战”系列，逐一深入这些工具的具体用法，真正上手操作，为后续实战环节打下扎实基础。

本期内容聚焦数据工程阶段的基础设施级工具：**OCR** 。

在大模型训练的数据处理流程中，文本清洗、过滤、去重的前提，往往是将各类异构文档——无论是扫描版PDF、网页截图、老旧扫描件，还是非标准格式的图片——统一转换为结构化的Markdown或纯文本格式。这一步看似基础，实则决定了后续所有处理环节的质量上限。

很多人对OCR的理解仍停留在几个经典场景：扫描件转Word、PDF文字提取失败、发票识别等。这些用途没错，但只说对了一半。真正的OCR，**从来不只是“把字读出来”这么简单**。做过企业级AI落地服务的从业者大都深有体会：难的不是AI应用本身，而是**企业数据的数字化与结构化**。而OCR，正是打通物理世界与数字世界的第一道闸门。正因如此，在大模型时代，OCR非但没有被边缘化，反而重新回到了技术舞台的中央。准确率足够高的OCR工具，已经成为高质量数据集构建的底层支柱之一。

本期内容，笔者就以当下备受关注的**DeepSeek-OCR-2**为例，从安装部署到实际调用，完整演示这款OCR工具的核心用法，带大家直观感受“能读、能认、能结构化”的OCR实战体验。

## 一、DeepSeek-OCR-2 核心特性

2026年1月27日，距离初代DeepSeek-OCR模型发布仅过去不到三个月，DeepSeek团队便推出了第二代模型——**DeepSeek-OCR-2**。这一次迭代，不再是常规的性能提升，而是**打破了OCR模型的能力天花板**。

### 1.1 技术创新：从“坐标扫描”到“语义理解”

DeepSeek-OCR-2 的核心突破，源自其开创性的 **视觉因果流（Visual Causal Flow）**  技术。它以 Qwen2-0.5B 为底座，训练出全新的视觉编码器 **DeepEncoder V2**，使OCR模型首次具备了**类似大语言模型的因果推理能力**。

传统OCR模型依赖像素坐标逐行扫描，面对多栏排版、图文混排、表格错位时，阅读顺序常常“串行”。而DeepSeek-OCR-2 不再盲从坐标，而是**根据内容的语义逻辑，动态重排视觉Token**， 有效解决了报纸、论文、财务报表等文档读序不准，逻辑混乱的问题。

正是这项技术，让 DeepSeek-OCR-2 在**仅3.6B参数**的体量下，实现了与 Gemini 3 Pro 相当的多模态识别能力，视觉Token利用率达到新高度。

### 1.2 能力进化：不止识字，更是“读图”

经过笔者实战检验，DeepSeek-OCR-2带来的性能提升是十分显著的。以同一份复杂PDF为例：

- **常规OCR**：输出文字块，图片直接跳过或仅标注“图像”；

- **DeepSeek-OCR-2**：不仅精准框出图片区域，还能**识别并总结图中的核心信息**，甚至还原数据表格。

DeepSeek-OCR-2的能力也远不止精准啊识别，它还可以做到

- **大规模语言支持：** 支持100+种主流语言文字，中英日韩、德法西阿，均保持高精度识别；

- **复杂结构解析：** 无论是多层表头、跨页表格，还是嵌套公式、流程图、CAD工程图，都能结构化输出；

- **语义版面分析**：自动区分标题、正文、注释、页眉页脚，输出符合阅读逻辑的Markdown；

- **数据还原**：针对柱状图、折线图、饼图等可视化图像，可直接识别并**还原为原始数据表格**；

- **PDF一键转换**：官方提供完整脚本，支持将多模态PDF高保真转为Markdown，图文、公式、表格无损保留。

### 1.3 行业位置：顶尖之争中的实力派

当然OCR领域的竞争从未停歇。DeepSeek-OCR-2不一定是“最强OCR模型”（关于OCR技术演进与当前头部模型对比，可参考我此前梳理的《[OCR技术简史：从深度学习到大模型，最强OCR大模型花落谁家](https://juejin.cn/post/7564921269491040271)》）。但可以确定的是：**它已稳稳站在第一梯队，并在语义理解、结构还原等关键维度，形成了独树一帜的竞争力**。根据B站UP**九天老师**的横向测评结果，直观展示了 DeepSeek-OCR-2 在复杂文档理解任务上的领先表现：

## 二、DeepSeek-OCR-2本地部署及实战

通过笔者前面对DeepSeek-OCR-2模型的强大性能的介绍，相信大家已经迫不及待的想体验DeepSeek-OCR-2模型。要真正掌握该模型的使用，动手实践肯定是最关键的一步，接下来笔者就分享如何在本地环境中部署DeepSeek-OCR-2模型并使用。

部署大模型对计算资源（尤其是GPU显存）确实有一定要求。为了降低大家的学习门槛，笔者与国内主流云平台合作，为大家争取了体验资源。您可以点击链接 [lab4ai.cn](https://link.juejin.cn?target=https%3A%2F%2Fwww.lab4ai.cn%2Fregister%3FagentID%3Duser-XorgKKc56U) 领取 **H100 GPU 6.5小时**的免费算力，用于完成本篇及本系列所有实战内容。

### 2.1 DeepSeek-OCR-2 本地部署（含完整命令）

下面笔者将分 9 个步骤，在 Lab4AI 云实例上完成模型部署。**每一步都附有可直接复制的命令**，建议大家跟随操作，不要跳步。

1. 创建实例：打开 Lab4AI官网，点击「创建实例」，选择 VS Code 云实例 类型。

2. 选择镜像与资源配置： 在镜像选择页面，建议选取包含 PyTorch 2.6.0、CUDA 11.8 的预置镜像。显卡优先选择 A100，兼容性最佳，可避免后续依赖冲突。

3. 查看预置模型（可选）： Lab4AI平台非常贴心在大家启动的实例中预置了部分常用模型。可以在 VS Code 终端的命令行中执行 cd /shared-only/models 来查看, 不过很遗憾Lab4AI预置的deepseek系列模型中并没有DeepSeek-OCR-2

4. 下载 DeepSeek-OCR-2 模型权重：Lab4AI 已预装 Anaconda，新建一个专用虚拟环境，并通过 modelscope 快速下载模型：
conda create -n deepseekocr2 -y
conda activate deepseekocr2
pip install -U modelscope
mkdir /workspace/deepseekocr2
modelscope download --model deepseek-ai/Deepseek-0CR-2 --local_dir /workspace/deepseek-ocr-2

5. 克隆官方项目仓库: 在workspace目录下执行命令git clone https://github.com/deepseek-ai/DeepSeek-OCR-2.git克隆官方项目仓库，仓库中包含后续要用到的所有推理脚本与工具类，接下来笔者也会用它的项目包进行文件的转换:

6. 安装 PyTorch 与配套库: 在 deepseekocr2 虚拟环境中安装指定版本的 PyTorch（必须与 CUDA 11.8 匹配）：pip install torch==2.6.0 torchvision==0.21.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu118

7. 安装特供版 vLLM（关键！） DeepSeek-OCR-2 基于特定分支编译的 vLLM 进行优化，严禁使用 pip install vllm 直接安装，否则推理效率会大幅下降。编译完成的包笔者已经帮助大家下载下来了，大家可以关注同名微信公众号： 大模型真好玩， 并回复deepseek-ocr-2获得whl文件，然后将该whl文件拖到服务器workspace目录下，最后执行pip install vllm-0.8.5+cu118-cp38-abi3-manylinux1_x86_64.whl

8. 安装项目基础依赖: 执行命令cd DeepSeek-OCR-2进入到git clone的目录文件夹下，执行pip install -r requirements.txt命令安装项目基础依赖,该步骤最后可能因某些依赖版本冲突而报错（如 pydantic 或 transformers 版本），不影响核心功能，可忽略.

9. 安装 FlashAttention 加速库: 执行命令pip install flash-attn==2.7.3 --no-build-isolation安装flash-attn加速库:

**至此，DeepSeek-OCR-2 的本地运行环境已全部搭建完毕**。虽然步骤稍显繁琐，但只要顺序执行，均可顺利完成。接下来将正式进入推理实战环节。

### 2.2 DeepSeek-OCR-2推理实战

DeepSeek-OCR-2 原生支持基于 **vLLM** 的高性能推理引擎，这也是官方首推的调用方式。相比 Hugging Face Transformers，vLLM 在**高并发、长文档、批量推理**场景下具有数倍的速度优势，且显存占用更低，是企业级服务化部署的首选方案。（对于VLLM的了解和使用大家可以参考笔者文章：[大模型训练全流程实战指南基础篇（三）——大模型本地部署实战（Vllm与Ollama）](https://juejin.cn/post/7595896809652437032)）
官方仓库已经为我们封装好了开箱即用的 vLLM 调用脚本，全部存放在以下目录`/workspace/DeepSeek-OCR-2/DeepSeek-OCR2-master/DeepSeek-OCR2-vllm`：

各脚本职责如下：

- config.py：全局配置文件，定义模型路径、输入输出目录、推理提示词（Prompt）等；

- deepseek_ocr2.py：核心依赖模块，封装模型加载与推理逻辑，一般无需修改；

- run_dpsk_ocr2_image.py：单图/批量图片推理脚本；

- run_dpsk_ocr2_pdf.py：PDF 文档批量转换脚本。

DeepSeek-OCR-2 支持**数十种任务场景**，**不同任务仅需修改 `config.py` 中的 `PROMPT` 配置项**，模型会根据指令自动切换行为模式。包括但不限于：

- 纯文本 OCR

- 保留版面的结构化 OCR

- 图表/表格内容解析

- 图片语义描述

- 指定元素位置检测

- **PDF → Markdown 高保真转换**

- 目标检测与定位

#### 2.2.1 场景一：复杂图片内容识别（以 CAD 工程图为例）

##### 步骤 1：修改 config.py

进入 `DeepSeek-OCR2-vllm` 目录，编辑 `config.py`：

```
MODEL_PATH = "/workspace/deepseek-ocr-2"          # 模型权重路径
INPUT_PATH = "/workspace/测试图片.png"  # 输入图片路径
OUTPUT_PATH = "/workspace/test_image/"      # 输出目录
PROMPT = "<image>\nFree OCR."                     # 自由OCR模式，模型自动判断内容

```

**PROMPT 配置技巧**：

> 若需详细描述图片，可设为 "<image>\nDescribe this image in detail"
> 若需提取图表数据并还原为表格，可设为 "<image>\nParse the figure."
> 本次测试使用 "Free OCR."，让模型自行决定输出形式。

##### 步骤 2：执行推理脚本

```
cd /workspace/DeepSeek-OCR-2/DeepSeek-OCR2-master/DeepSeek-OCR2-vllm
python run_dpsk_ocr2_image.py

```

脚本会自动拉起 vLLM 后端（终端无显式提示，但后台已运行），逐张处理输入图片。

##### 步骤 3：查看识别结果

输出目录下会生成对应图片的 **Markdown 文件**，可直接用文本编辑器或浏览器打开。下图展示了 CAD 图纸的文字提取与版面还原效果，可以看到不仅工程图中的尺寸标注、文字说明被精准识别，整体版面结构也得以完整保留。

#### 2.2.2 场景二：PDF 文档转高保真 Markdown

PDF 转 Markdown 是数据处理流水线中最常见的需求，DeepSeek-OCR-2 提供了**端到端的一键转换脚本**。

##### 步骤 1：修改 config.py

```
MODEL_PATH = "/workspace/deepseek-ocr-2"
INPUT_PATH = "/workspace/测试报告.pdf"   # 输入 PDF 路径
OUTPUT_PATH = "/workspace/test_pdf"               # 输出目录
PROMPT = "<image>\n<|grounding|>Convert the document to markdown."

```

> 💡  <|grounding|>  是触发版面分析与结构化输出的特殊标记，配合 Convert the document to markdown. 指令，模型会输出包含图片、表格、公式的完整 Markdown。

##### 步骤 2：执行 PDF 转换脚本

```
python run_dpsk_ocr2_pdf.py

```

> ⚠️ 耗时说明：脚本会将 PDF 的每一页渲染为图像，再逐页进行 OCR 与版面分析。对于数十页的长文档，建议预留充足时间。

##### 步骤 3：解析输出产物

转换完成后，输出目录（本例为 `/workspace/test_paper/output`）下会生成以下文件：

```
images/                 # PDF 中抽取的所有图片，供 Markdown 引用
测试PDF.mmd            # 主输出文件，标准的 MultiMarkdown 格式
测试PDF_layouts.pdf    # 版面分析可视化结果（标注标题、正文、表格、图片区域）

```

打开 `测试PDF.mmd`，大家会发现：

- 论文标题、作者、摘要、章节结构被完美还原；

- 内嵌图片自动保存至 `images/` 文件夹，并在 Markdown 中以相对路径引用；

- 表格被转化为 Markdown 表格语法；

- 公式（即使为扫描图片）也被识别为 LaTeX 行内公式。

**这一能力，已经无限接近“文档数字化”的终极形态。** 本章节的所有测试样例大家均可关注笔者同名微信公众号：**大模型真好玩**， 并私信**deepseek-ocr-2**获得。

## 三、OCR工具解析结果的后处理：从“读出来”到“用起来”

如果说 OCR 的核心价值在于**将非结构化文档转化为结构化数据**，那么后处理环节则决定了**这些数据能否真正转化为生产力**。

无论 DeepSeek-OCR-2 的识别准确率有多高，解析出的 Markdown、JSON 或纯文本仍然只是“半成品”。要让它们无缝接入数据处理流水线、RAG 知识库甚至多模态检索系统还需要一套成熟的后处理策略。

本节将围绕三大典型应用场景，拆解 OCR 解析结果的后处理要点与实战思路。

### 3.1 场景一：统一格式，构建标准数据处理流水线

在数据工程阶段，异构文档的统一是清洗、去重、分割的前置条件。DeepSeek-OCR-2 默认输出 **Markdown 格式**，这本身已是一种极佳的中间格式——兼顾人类可读与机器可解析。

**后处理要点：**

- 文本清洗增强：虽然模型已过滤大部分噪声，但仍需根据业务场景定制清洗规则，例如：

移除多余换行、空格；
统一中英文标点；
过滤广告水印、页眉页脚；
保留或剔除特定标签（如 <image> 引用）。

- 语义分块 ：利用 Markdown 的标题层级（#、##）天然划分章节，结合滑动窗口或语义嵌入，生成高质量文档块，为大模型微调或 RAG 索引提供精准输入。

✅ **实战建议**：

可基于 `python-markdown`、`pypandoc` 等库编写后处理脚本，将 `.mmd` 文件批量转换为结构化 JSON，字段包含 `metadata`（来源、页码）、`content`（文本）、`images`（图片路径列表）、`tables`（表格结构）等，方便下游任务直接调用。

### 3.2 场景二：RAG 知识库的“弹药升级”

将 OCR 解析结果直接灌入 RAG 系统，效果往往优于使用原始 PDF 或纯文本提取工具。原因在于：

- **版面信息保留**：标题、列表、表格结构被显式编码，检索器更容易定位关键内容；

- **语义完整性**：模型阅读顺序符合人类逻辑，避免因坐标错乱导致上下文割裂；

- **图片与公式锚定**：Markdown 中保留图片引用路径，为后续多模态检索埋下伏笔。

**后处理要点：**

- **元数据注入**：为每个文档块附加来源文件名、页码、版面类型（标题/正文/表格/图片），提升过滤与排序精度；

- **向量化策略优化**：对表格、公式等特殊元素采用混合检索（关键词 + 向量），或提前将其转换为自然语言描述，便于语义匹配。

✅ **实战建议**：

使用 LlamaIndex 或 LangChain 内置的 `MarkdownReader`，可直接将 OCR 输出的 Markdown 解析为 Document 对象，并自动识别标题层级。再配合 `HTMLHeaderTextSplitter` 或 `MarkdownHeaderTextSplitter`，实现语义感知的分块。

### 3.3 场景三：多模态 RAG —— 让图文真正联动

单模态 RAG 只能检索文本，而多模态 RAG 允许用户**同时根据文字描述与图像内容进行检索**。DeepSeek-OCR-2 已经为我们铺平了最关键的道路——它将 PDF 中的图片**独立保存**，并在 Markdown 中留下精确的引用位置。

**后处理进阶方案：**

1. **图像语义化**：对 `images/` 文件夹中的每张图片，调用轻量级多模态模型（如 CLIP、BLIP、Qwen-VL）生成文本描述；

2. **语义嵌入对齐**：将图片描述向量与文本块向量存入同一向量空间，或直接将描述文本附加在图片引用位置；

3. **图文联合检索**：用户提问时，系统同时检索文本块与图片描述，返回最相关的图文片段。

如此一来，一份包含大量图表的年报、技术手册或教学 PPT，将不再是“文字检索 + 图片附件”，而是**真正的图文融合知识库**。

✅ **实战建议**：

可构建如下后处理流水线：

```
OCR解析 → Markdown + 图片文件夹 → 图片描述生成（离线）→ Markdown中插入描述文本 → 向量化 → 多模态检索

```

对于实时性要求较高的场景，也可在检索时动态调用多模态 embedding 模型，实现图像与文本的统一编码。

## 四、总结

本文以DeepSeek-OCR-2为例，详解其核心特性、本地部署及vLLM推理实战。并延伸后处理策略，涵盖数据清洗、RAG优化到多模态检索，打通从“读出来”到“用起来”的全链路，为高质量数据集构建提供实战指南。有了OCR工具等统一格式后，接下来数据处理流程的重要工作就是构建数据集了，下篇内容笔者将分享当前通用的数据处理工具EasyDataset, 大家敬请期待~

大模型训练对计算资源有一定要求，尤其是GPU显存。为降低学习门槛，笔者与国内主流云平台合作，大家可以通过打开链接: [Lab4AI](https://link.juejin.cn?target=https%3A%2F%2Fwww.lab4ai.cn%2Fregister%3FagentID%3Duser-XorgKKc56U) ，体验**H100 GPU 6.5小时**的算力。本系列所有实战教程均将在该平台上完成，帮助大家低成本上手实践。

除大模型训练外，笔者也在同步更新[《深入浅出LangChain&LangGraph AI Agent 智能体开发》](https://juejin.cn/column/7526240014499495972)免费专栏，要说明该专栏适合所有对 LangChain 感兴趣的学习者，无论之前是否接触过 LangChain。该专栏基于笔者在实际项目中的深度使用经验，系统讲解了使用LangChain/LangGraph如何开发智能体，目前已更新 38 讲，并持续补充实战与拓展内容。欢迎感兴趣的同学关注笔者的掘金账号与专栏，也可关注笔者的同名微信公众号**大模型真好玩**，每期分享涉及的代码均可在公众号私信: **LangChain智能体开发**免费获取。