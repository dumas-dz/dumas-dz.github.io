---
title: LangChain - 向量嵌入
category:
  - LLM
  - LangChain
tag:
  - LangChain
---


## 8.1 什么是 Embedding？为何用于检索？

### 8.1.1 核心定义：文本的“数值身份证”

Embedding（嵌入）本质是一种语义编码技术，它能将文本（单词、句子、文档）映射到一个低维或高维的稠密数值向量空间中，让“语义相似”的文本，在向量空间中的距离更近。

举个直观例子：

- “猫”的嵌入向量：[0.82, -0.15, 0.33, ..., 0.21]（假设1536维）

“猫”的嵌入向量：[0.82, -0.15, 0.33, ..., 0.21]（假设1536维）

- “狗”的嵌入向量：[0.79, -0.18, 0.31, ..., 0.23]

“狗”的嵌入向量：[0.79, -0.18, 0.31, ..., 0.23]

- “苹果”的嵌入向量：[-0.22, 0.85, -0.17, ..., 0.09]

“苹果”的嵌入向量：[-0.22, 0.85, -0.17, ..., 0.09]

可以看到，“猫”和“狗”的向量距离很近（语义相似，都是动物），而它们与“苹果”的距离很远（语义无关）——这就是Embedding的核心价值：将文本的“语义信息”转化为可计算的数值。

### 8.1.2 为何用于检索？秒杀传统关键词检索

传统关键词检索（比如MySQL的like查询）有个致命缺陷：只能匹配“字面一致”，无法理解“语义相似”。比如搜索“如何用LangChain做RAG”，关键词检索找不到“LangChain搭建检索增强生成系统”的内容，但Embedding检索可以——因为两者语义高度相似。

Embedding用于检索的核心逻辑：

- 提前将所有文档生成嵌入向量，存入向量数据库；

提前将所有文档生成嵌入向量，存入向量数据库；

- 用户查询时，先将查询语句生成嵌入向量；

用户查询时，先将查询语句生成嵌入向量；

- 计算查询向量与所有文档向量的“距离”，取距离最近的文档作为检索结果。

计算查询向量与所有文档向量的“距离”，取距离最近的文档作为检索结果。

这也是LangChain RAG的核心流程之一，Embedding就是连接“文本”和“机器检索”的桥梁。

### 8.1.3 关键提醒

LangChain本身不开发嵌入模型，而是提供了统一的Embedding接口，可以无缝对接OpenAI、Hugging Face、本地模型等，开发者无需关注不同模型的调用差异，只需一行代码切换模型。

## 8.2 使用 OpenAI、Hugging Face、Sentence-Transformers 生成嵌入

本节聚焦3种最常用的嵌入方式，代码均简化到最少，可直接复制运行，同时标注依赖安装和引用来源。

### 8.2.1 准备工作：安装核心依赖

无论使用哪种模型，先安装基础依赖（LangChain核心包）：

```
pip install langchain  # 核心框架
pip install python-dotenv  # 管理环境变量（用于存储API密钥）
```

### 8.2.2 OpenAI Embeddings（最常用，精度高）

OpenAI的嵌入模型（如text-embedding-ada-002）性价比极高，是生产环境的首选，需提前获取OpenAI API密钥（获取链接）。

#### 代码示例（简短可运行）

```
from langchain.embeddings.openai import OpenAIEmbeddings
from dotenv import load_dotenv
import os

# 加载环境变量（.env文件中存OPENAI_API_KEY=你的密钥）
load_dotenv()

# 初始化OpenAI嵌入模型
embeddings = OpenAIEmbeddings(
    model="text-embedding-ada-002",  # 推荐模型，性价比最高
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# 生成单句嵌入
text = "LangChain向量嵌入实战"
embedding = embeddings.embed_query(text)  # 检索时用embed_query，文档用embed_documents
print(f"嵌入向量维度：{len(embedding)}")  # 输出1536（ada-002固定维度）
print(f"嵌入向量前5位：{embedding[:5]}")
```

#### 关键说明

- embed_query：用于生成“用户查询”的嵌入（优化检索精度）；

embed_query：用于生成“用户查询”的嵌入（优化检索精度）；

- embed_documents：用于生成“文档”的嵌入；

embed_documents：用于生成“文档”的嵌入；

- 依赖：需额外安装 openai 包（pip install openai）；

依赖：需额外安装 openai 包（pip install openai）；

- 引用来源：LangChain官方OpenAI Embeddings文档。

引用来源：LangChain官方OpenAI Embeddings文档。

### 8.2.3 Hugging Face Embeddings（开源免费）

Hugging Face提供大量开源嵌入模型（如all-MiniLM-L6-v2），可免费使用，无需API密钥，适合本地开发和预算有限的场景。

#### 代码示例

```
from langchain.embeddings import HuggingFaceEmbeddings

# 初始化Hugging Face嵌入模型（自动下载模型）
embeddings = HuggingFaceEmbeddings(
    model_name="all-MiniLM-L6-v2",  # 轻量模型，速度快，适合入门
    model_kwargs={"device": "cpu"},  # 可选gpu（需安装torch-gpu）
    encode_kwargs={"normalize_embeddings": True}  # 归一化，提升检索精度

# 生成文档嵌入（批量）
texts = [
    "LangChain是一个大模型开发框架",
    "Embedding用于将文本转为向量",
    "Hugging Face提供开源嵌入模型"
]
embeddings_list = embeddings.embed_documents(texts)
print(f"批量生成{len(embeddings_list)}个嵌入，每个维度：{len(embeddings_list[0])}")
```

#### 关键说明

- 依赖：需安装 sentence-transformers 包（pip install sentence-transformers）；

依赖：需安装 sentence-transformers 包（pip install sentence-transformers）；

- model_name：可替换为其他模型（如all-MiniLM-L12-v2，精度更高但速度稍慢）；

model_name：可替换为其他模型（如all-MiniLM-L12-v2，精度更高但速度稍慢）；

- 引用来源：LangChain官方Hugging Face Embeddings文档。

引用来源：LangChain官方Hugging Face Embeddings文档。

### 8.2.4 Sentence-Transformers（专注句子嵌入）

Sentence-Transformers是专门用于句子/段落嵌入的库，LangChain提供了专门的接口，本质是对Hugging Face模型的封装，使用更简洁。

#### 代码示例

```
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings

# 初始化Sentence-Transformers嵌入模型
embeddings = SentenceTransformerEmbeddings(
    model_name="all-MiniLM-L6-v2"

# 生成单句嵌入
text = "Sentence-Transformers专注于句子语义嵌入"
embedding = embeddings.embed_query(text)
print(f"嵌入向量维度：{len(embedding)}")
```

#### 关键说明

与HuggingFaceEmbeddings的区别：Sentence-Transformers接口更简洁，无需手动设置encode_kwargs，默认做归一化，适合句子级嵌入；

引用来源：LangChain官方Sentence-Transformers文档。

## 8.3 本地嵌入模型部署（BGE、text2vec）

当数据敏感（不能上传到第三方API）、需要离线运行时，本地部署嵌入模型是最佳选择。本节重点讲解2个中文友好的模型：BGE（中文检索天花板）和text2vec（轻量高效），均基于LangChain实现本地化调用。

### 8.3.1 本地部署核心前提

- 环境：Python 3.8+，建议安装PyTorch（支持CPU/GPU，GPU可大幅提升速度）；

环境：Python 3.8+，建议安装PyTorch（支持CPU/GPU，GPU可大幅提升速度）；

- 依赖：pip install sentence-transformers torch（两个模型通用）；

依赖：pip install sentence-transformers torch（两个模型通用）；

- 模型获取：首次运行会自动下载模型（约几百MB~几GB），也可手动从Hugging Face下载后本地加载。

模型获取：首次运行会自动下载模型（约几百MB~几GB），也可手动从Hugging Face下载后本地加载。

### 8.3.2 BGE模型部署（中文首选）

BGE（BAAI General Embedding）是智源AI推出的开源嵌入模型，中文语义理解能力远超同类模型，支持长文本（最长8192 tokens），是RAG中文场景的首选模型，推荐使用BGE-M3版本。

#### 代码示例（本地加载）

```

# 本地部署BGE-M3（自动下载模型，首次较慢）
# 手动下载地址：https://hf-mirror.com/FlagAI-Open/BGE-M3（国内镜像，速度更快）
    model_name="FlagAI-Open/BGE-M3",
    model_kwargs={
        "device": "cpu",  # 若有GPU，替换为"cuda"
        "trust_remote_code": True  # 必须开启，加载BGE自定义代码
    },
    encode_kwargs={
        "normalize_embeddings": True,  # 归一化，确保相似度计算准确
        "max_length": 8192  # BGE-M3支持长文本，按需调整
    }

# 测试中文嵌入
text = "LangChain本地部署BGE嵌入模型"
print(f"BGE-M3嵌入维度：{len(embedding)}")  # 输出1024维
```

#### 关键说明

- 模型版本：BGE-M3（最新版，推荐）、BGE-base-zh（轻量版，适合低算力设备）；

模型版本：BGE-M3（最新版，推荐）、BGE-base-zh（轻量版，适合低算力设备）；

- GPU加速：若安装了PyTorch-GPU，将device改为"cuda"，生成嵌入速度可提升5~10倍；

GPU加速：若安装了PyTorch-GPU，将device改为"cuda"，生成嵌入速度可提升5~10倍；

- 本地加载：手动下载模型后，将model_name改为本地模型路径（如"./BGE-M3"），避免重复下载；

本地加载：手动下载模型后，将model_name改为本地模型路径（如"./BGE-M3"），避免重复下载；

- 引用来源：LangChain Hugging Face集成文档、BGE本地部署实战。

引用来源：LangChain Hugging Face集成文档、BGE本地部署实战。

### 8.3.3 text2vec模型部署（轻量高效）

text2vec是专为中文设计的轻量嵌入模型，体积小（约100MB），速度快，适合低算力设备（如笔记本），语义精度满足日常开发需求。

#### 代码示例

```

# 本地部署text2vec模型（自动下载）
    model_name="shibing624/text2vec-base-chinese",
    model_kwargs={"device": "cpu"},
    encode_kwargs={"normalize_embeddings": True}

# 测试中文嵌入
texts = ["text2vec轻量高效", "中文嵌入模型推荐"]
print(f"text2vec嵌入维度：{len(embeddings_list[0])}")  # 输出768维
```

#### 关键说明

- 模型优势：体积小、速度快，CPU上也能快速生成嵌入；

模型优势：体积小、速度快，CPU上也能快速生成嵌入；

- 适用场景：中小规模中文文档检索、本地Demo开发；

适用场景：中小规模中文文档检索、本地Demo开发；

- 引用来源：text2vec官方仓库。

引用来源：text2vec官方仓库。

## 8.4 嵌入维度、距离度量（余弦相似度）

生成嵌入后，我们需要理解两个核心概念：嵌入维度（向量的长度）和距离度量（如何判断两个向量的相似度）——这直接决定检索精度。

### 8.4.1 嵌入维度：向量的“长度”

#### 核心定义

嵌入维度是指生成的向量包含的数值个数（如ada-002是1536维，BGE-M3是1024维），维度越高，理论上能承载的语义信息越丰富，但计算成本和存储成本也越高。

#### 主流模型维度对比（重点记）

#### 维度选择建议

- 生产环境（通用场景）：优先选1024~1536维（BGE-M3、ada-002），精度足够；

生产环境（通用场景）：优先选1024~1536维（BGE-M3、ada-002），精度足够；

- 本地Demo、低算力设备：选384~768维（all-MiniLM-L6-v2、text2vec）；

本地Demo、低算力设备：选384~768维（all-MiniLM-L6-v2、text2vec）；

- 无需追求“越高越好”：维度提升到一定程度后，精度提升不明显，反而增加成本。

无需追求“越高越好”：维度提升到一定程度后，精度提升不明显，反而增加成本。

### 8.4.2 距离度量：判断语义相似的“标尺”

距离度量的核心作用：计算两个向量之间的“距离”，距离越近，语义相似度越高。LangChain中最常用、最推荐的是余弦相似度，其次是欧氏距离、曼哈顿距离。

#### 余弦相似度（重点）

余弦相似度衡量的是两个向量之间的“夹角”，取值范围为[-1, 1]：

- 相似度=1：两个向量方向完全一致（语义完全相同）；

相似度=1：两个向量方向完全一致（语义完全相同）；

- 相似度=0：两个向量垂直（语义无关）；

相似度=0：两个向量垂直（语义无关）；

- 相似度=-1：两个向量方向完全相反（语义完全相反）。

相似度=-1：两个向量方向完全相反（语义完全相反）。

在文本检索中，我们只关注正数相似度，通常相似度≥0.7，就认为两个文本语义高度相关。

#### LangChain中计算余弦相似度（代码示例）

```
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# 初始化嵌入模型
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 生成两个文本的嵌入向量
text1 = "LangChain向量嵌入"
text2 = "LangChain Embedding实战"
vec1 = np.array(embeddings.embed_query(text1)).reshape(1, -1)
vec2 = np.array(embeddings.embed_query(text2)).reshape(1, -1)

# 计算余弦相似度
similarity = cosine_similarity(vec1, vec2)[0][0]
print(f"两个文本的余弦相似度：{similarity:.4f}")  # 输出约0.8+，高度相关
```

#### 关键说明

- 依赖：需安装 scikit-learn 包（pip install scikit-learn）；

依赖：需安装 scikit-learn 包（pip install scikit-learn）；

- LangChain集成：向量数据库（如Chroma、FAISS）会自动计算余弦相似度，无需手动编写；

LangChain集成：向量数据库（如Chroma、FAISS）会自动计算余弦相似度，无需手动编写；

- 为何首选余弦相似度？它不受向量“长度”影响，只关注方向，更适合文本语义匹配（比如长句和短句，只要语义相似，相似度就高）。

为何首选余弦相似度？它不受向量“长度”影响，只关注方向，更适合文本语义匹配（比如长句和短句，只要语义相似，相似度就高）。

## 8.5 缓存嵌入结果避免重复计算

生成嵌入的过程（尤其是调用API、大模型本地推理）会消耗时间和资源，如果同一文本多次生成嵌入（比如重复的文档、重复的查询），会造成不必要的浪费。LangChain提供了内置缓存机制，可轻松避免重复计算，提升效率。

### 8.5.1 两种常用缓存方式

LangChain支持多种缓存方式，重点讲解2种最常用的：内存缓存（适合临时开发）和SQLite缓存（适合持久化，重启程序后缓存仍有效）。

#### 方式1：内存缓存（InMemoryCache）

缓存存储在内存中，程序重启后缓存丢失，适合临时测试、短期开发。

```
from langchain.embeddings import OpenAIEmbeddings
from langchain.cache import InMemoryCache
import langchain

# 启用内存缓存
langchain.llm_cache = InMemoryCache()

# 初始化OpenAI嵌入模型
embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")

# 第一次生成嵌入（会调用API，消耗资源）
text = "LangChain缓存嵌入实战"
emb1 = embeddings.embed_query(text)
print("第一次生成：完成")

# 第二次生成相同文本的嵌入（从缓存读取，不调用API）
emb2 = embeddings.embed_query(text)
print("第二次生成：完成（从缓存读取）")

# 验证两次嵌入是否一致
print(f"两次嵌入是否相同：{emb1 == emb2}")  # 输出True
```

#### 方式2：SQLite缓存（SQLiteCache）

缓存存储在本地SQLite数据库中，程序重启后缓存仍有效，适合长期开发、生产环境。

```
from langchain.cache import SQLiteCache

# 启用SQLite缓存（缓存文件存储在./langchain_cache.db）
langchain.llm_cache = SQLiteCache(database_path="./langchain_cache.db")

# 初始化嵌入模型

# 重复生成嵌入（第二次从缓存读取）
text = "LangChain SQLite缓存"

```

### 8.5.2 关键提醒

- 缓存生效条件：文本完全一致（包括空格、大小写），否则会重新生成嵌入；

缓存生效条件：文本完全一致（包括空格、大小写），否则会重新生成嵌入；

- 其他缓存方式：LangChain还支持Redis缓存（适合分布式系统），用法类似；

其他缓存方式：LangChain还支持Redis缓存（适合分布式系统），用法类似；

- 引用来源：LangChain官方缓存文档、RAG系统性能优化技巧。

引用来源：LangChain官方缓存文档、RAG系统性能优化技巧。

## 8.6 批量嵌入与性能优化

当需要处理大量文本（如成千上万篇文档）时，逐一生成嵌入会非常慢。LangChain支持批量嵌入，同时提供多种性能优化技巧，大幅提升处理效率，尤其适合大规模文档检索场景。

### 8.6.1 批量嵌入（核心操作）

所有LangChain嵌入模型都支持embed_documents方法，可传入文本列表，批量生成嵌入，比逐一生成快5~10倍。

```

# 初始化嵌入模型

# 批量处理100条文本（模拟大规模文档）
texts = [f"LangChain批量嵌入测试{i}" for i in range(100)]

# 批量生成嵌入（一次调用，处理所有文本）
batch_embeddings = embeddings.embed_documents(texts)

print(f"批量生成{len(batch_embeddings)}个嵌入，每个维度：{len(batch_embeddings[0])}")
```

### 8.6.2 性能优化技巧（实战必备）

#### 技巧1：控制批量大小

批量大小并非越大越好，需根据模型和硬件调整：

- API模型（OpenAI）：批量大小建议10~100（避免触发API限流）；

API模型（OpenAI）：批量大小建议10~100（避免触发API限流）；

- 本地模型（BGE、text2vec）：批量大小建议3264（CPU）、64128（GPU），根据显存/内存调整。

本地模型（BGE、text2vec）：批量大小建议3264（CPU）、64128（GPU），根据显存/内存调整。

#### 技巧2：异步调用（提升并发效率）

LangChain的嵌入模型支持异步调用（ainvoke），可在处理大量文本时，利用I/O等待时间处理其他任务，提升并发效率，尤其适合Web服务场景。

```
import asyncio

# 初始化嵌入模型

# 异步批量生成嵌入
async def async_batch_embed():
    texts = [f"异步嵌入测试{i}" for i in range(50)]
    # 异步调用embed_documents
    batch_embeddings = await embeddings.aembed_documents(texts)
    return batch_embeddings

# 运行异步函数
if __name__ == "__main__":
    embeddings_list = asyncio.run(async_batch_embed())
    print(f"异步批量生成{len(embeddings_list)}个嵌入")
```

#### 技巧3：GPU加速（本地模型首选）

本地部署嵌入模型时，启用GPU加速可大幅提升生成速度（5~10倍），只需将model_kwargs中的device改为"cuda"（需安装PyTorch-GPU）：

```
    model_kwargs={"device": "cuda"},  # GPU加速
```

#### 技巧4：文本预处理（减少无效计算）

生成嵌入前，对文本进行预处理，删除空白、重复内容、无效字符，减少文本长度，可降低计算成本：

```
def preprocess_text(text):
    # 去除空白、换行、多余空格
    text = text.strip().replace("\n", "").replace("  ", " ")
    # 过滤无效文本（如长度小于3的文本）
    return text if len(text) >= 3 else ""

# 批量预处理文本
texts = [preprocess_text(t) for t in texts if preprocess_text(t)]
# 再生成嵌入
```

## 8.7 嵌入质量评估方法

生成嵌入后，如何判断其质量？很多开发者会忽略这一步，导致后续检索精度低下。本节讲解3种实用的评估方法，从简单到复杂，适合不同场景，无需复杂的学术知识，直接落地使用。

### 8.7.1 方法1：人工评估（最简单，适合小批量文本）

核心逻辑：挑选若干文本对，人工判断语义是否相似，再计算其嵌入的余弦相似度，看相似度是否与人工判断一致。

```

# 人工标注的文本对（相似/不相似）
text_pairs = [
    ("LangChain向量嵌入", "LangChain Embedding", "相似"),
    ("猫", "狗", "相似"),
    ("猫", "苹果", "不相似"),
    ("Python编程", "Java编程", "相似"),
    ("雨天", "晴天", "不相似")

# 评估
correct = 0
for text1, text2, label in text_pairs:
    sim = cosine_similarity(vec1, vec2)[0][0]
    # 判定规则：sim≥0.7为相似，否则为不相似
    pred = "相似" if sim >= 0.7 else "不相似"
    if pred == label:
        correct += 1
    print(f"{text1} vs {text2}：相似度{sim:.4f}，预测{pred}，实际{label}")

# 计算准确率
accuracy = correct / len(text_pairs)
print(f"\n评估准确率：{accuracy:.2f}")  # 准确率≥0.8，说明嵌入质量较好
```

### 8.7.2 方法2：聚类评估（看语义簇是否清晰）

核心逻辑：将同类文本的嵌入向量进行聚类，看同类文本是否能聚在一起，异类文本是否能分开——聚类效果越好，嵌入质量越高。常用工具：K-Means聚类+可视化（UMAP/t-SNE降维）。

```
from sklearn.cluster import KMeans
from sklearn.manifold import TSNE
import matplotlib.pyplot as plt

# 生成不同类别的文本嵌入
    # 类别1：LangChain
    "LangChain向量嵌入", "LangChain RAG实战", "LangChain文档加载",
    # 类别2：嵌入模型
    "BGE嵌入模型", "text2vec模型", "OpenAI Embeddings",
    # 类别3：编程语言
    "Python编程", "Java开发", "JavaScript入门"

# TSNE降维（将高维向量降到2维，方便可视化）
tsne = TSNE(n_components=2, random_state=42)
embeddings_2d = tsne.fit_transform(embeddings_list)

# K-Means聚类（分成3类，对应3个文本类别）
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(embeddings_list)

# 可视化
plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], c=clusters, cmap="viridis")
for i, text in enumerate(texts):
    plt.annotate(text, (embeddings_2d[i, 0], embeddings_2d[i, 1]), fontsize=8)
plt.title("嵌入向量聚类可视化（同类文本应聚在一起）")
plt.show()
```

#### 评估标准

如果可视化图中，“LangChain”“嵌入模型”“编程语言”三类文本分别形成清晰的簇群（颜色不同，互不重叠），说明嵌入质量较好；如果簇群混乱（不同类文本混在一起），说明嵌入质量较差，需更换模型。

### 8.7.3 方法3：下游任务评估（最实用，生产环境首选）

核心逻辑：嵌入的最终用途是检索、问答等下游任务，因此可通过下游任务的性能来评估嵌入质量——比如检索的“召回率”“精确率”，问答的“准确率”。

示例：用检索召回率评估（简化版）

```
from langchain.vectorstores import Chroma
from langchain.document_loaders import TextLoader

# 1. 加载文档（假设3篇文档，每篇对应一个主题）
loader = TextLoader("test_doc.txt")  # 文档内容：LangChain、BGE、Python各一段
documents = loader.load()

# 2. 生成嵌入并构建向量数据库
db = Chroma.from_documents(documents, embeddings)

# 3. 测试检索（查询与文档主题匹配，看是否能检索到对应文档）
queries = [
    "LangChain是什么",  # 对应文档1
    "BGE模型怎么用",    # 对应文档2
    "Python入门教程"    # 对应文档3

# 评估召回率（检索到对应文档的比例）
recall = 0
for query in queries:
    # 检索Top1结果
    similar_docs = db.similarity_search(query, k=1)
    # 判断检索结果是否与查询主题一致（人工标注或关键词匹配）
    if query.split(" ")[0] in similar_docs[0].page_content:
        recall += 1

print(f"检索召回率：{recall / len(queries):.2f}")  # 召回率≥0.9，嵌入质量合格
```

### 8.7.4 评估总结

- 小批量文本：用人工评估（简单高效）；

小批量文本：用人工评估（简单高效）；

- 大规模文本：用聚类评估（直观看到语义分布）；

大规模文本：用聚类评估（直观看到语义分布）；

- 生产环境：用下游任务评估（最贴合实际用途）；

生产环境：用下游任务评估（最贴合实际用途）；

- 引用来源：Embedding质量评估权威指南。

引用来源：Embedding质量评估权威指南。

## 8.8 【实战】为技术文档生成高质量向量表示

本节结合前面所有知识点，做一个完整实战：加载技术文档（以LangChain官方文档片段为例），预处理文本、生成嵌入、缓存优化、质量评估，最终将文档向量存入向量数据库，为后续检索做准备。

### 8.8.1 实战目标

- 加载本地技术文档（txt格式）；

加载本地技术文档（txt格式）；

- 文本预处理、分割（适配嵌入模型的输入长度）；

文本预处理、分割（适配嵌入模型的输入长度）；

- 用BGE-M3模型（本地部署）生成高质量嵌入；

用BGE-M3模型（本地部署）生成高质量嵌入；

- 启用缓存，避免重复计算；

启用缓存，避免重复计算；

- 评估嵌入质量；

评估嵌入质量；

- 将嵌入向量存入Chroma向量数据库（持久化）。

将嵌入向量存入Chroma向量数据库（持久化）。

### 8.8.2 实战步骤（完整代码，可直接运行）

#### 步骤1：准备工作（依赖+文档）

- 安装依赖：

```
pip install langchain sentence-transformers torch chromadb scikit-learn matplotlib
```

- 准备技术文档：创建langchain_docs.txt，写入LangChain相关技术内容（示例内容如下）：

```
LangChain是一个用于构建大语言模型应用的框架，它提供了一系列工具和组件，帮助开发者快速搭建RAG、聊天机器人等应用。

LangChain的核心组件包括：文档加载器（Document Loaders）、文本分割器（Text Splitters）、嵌入模型（Embeddings）、向量数据库（Vector Stores）、大语言模型（LLMs）等。

向量嵌入（Embedding）是LangChain RAG的核心，它能将文本转化为数值向量，实现语义检索。常用的嵌入模型有OpenAI Embeddings、BGE、text2vec等。

BGE-M3是智源AI推出的开源嵌入模型，中文语义理解能力强，支持长文本，适合本地部署，是中文RAG场景的首选模型。

Chroma是一个轻量级向量数据库，适合本地开发和小规模数据存储，可与LangChain无缝集成，支持相似性检索。
```

#### 步骤2：完整实战代码

```
from langchain.text_splitter import RecursiveCharacterTextSplitter

# ---------------------- 1. 启用缓存（避免重复计算） ----------------------
langchain.llm_cache = SQLiteCache(database_path="./embedding_cache.db")

# ---------------------- 2. 加载并预处理技术文档 ----------------------
# 加载文档
loader = TextLoader("langchain_docs.txt")

# 文本预处理函数
    text = text.strip().replace("\n", " ").replace("  ", " ")
    return text if len(text) >= 5 else ""

# 预处理文档内容
for doc in documents:
    doc.page_content = preprocess_text(doc.page_content)

# 分割文本（避免长文本超出模型输入限制）
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,  # 每个文本块长度
    chunk_overlap=20  # 相邻文本块重叠部分（保留上下文）
split_docs = text_splitter.split_documents(documents)
print(f"文档分割后共{len(split_docs)}个文本块")

# ---------------------- 3. 本地部署BGE-M3模型，生成嵌入 ----------------------
        "device": "cpu",  # 有GPU可改为"cuda"
        "trust_remote_code": True
        "normalize_embeddings": True,
        "max_length": 8192

# 批量生成嵌入（从缓存读取重复文本）
doc_embeddings = embeddings.embed_documents([doc.page_content for doc in split_docs])
print(f"生成{len(doc_embeddings)}个文档嵌入，维度：{len(doc_embeddings[0])}")

# ---------------------- 4. 嵌入质量评估（聚类可视化） ----------------------
# TSNE降维可视化
embeddings_2d = tsne.fit_transform(doc_embeddings)

# 绘制可视化图
plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1], c="blue", alpha=0.7)
for i, doc in enumerate(split_docs):
    plt.annotate(doc.page_content[:20] + "...",
                 (embeddings_2d[i, 0], embeddings_2d[i, 1]),
                 fontsize=8)
plt.title("技术文档嵌入向量聚类可视化")

# 人工评估（抽样检查）
sample_texts = [
    split_docs[0].page_content,  # LangChain框架介绍
    split_docs[2].page_content,  # 向量嵌入介绍
    split_docs[3].page_content   # BGE-M3介绍
sample_embeddings = embeddings.embed_documents(sample_texts)
# 计算相似度（同类文本相似度应高于异类）
sim1 = cosine_similarity([sample_embeddings[0]], [sample_embeddings[1]])[0][0]
sim2 = cosine_similarity([sample_embeddings[0]], [sample_embeddings[2]])[0][0]
sim3 = cosine_similarity([sample_embeddings[1]], [sample_embeddings[2]])[0][0]
print(f"\n相似度评估：")
print(f"LangChain框架 vs 向量嵌入：{sim1:.4f}")
print(f"LangChain框架 vs BGE-M3：{sim2:.4f}")
print(f"向量嵌入 vs BGE-M3：{sim3:.4f}")  # 应最高，因为都属于嵌入相关

# ---------------------- 5. 将嵌入存入Chroma向量数据库（持久化） ----------------------
vector_db = Chroma.from_documents(
    documents=split_docs,
    embedding=embeddings,
    persist_directory="./langchain_embedding_db"  # 存储路径
vector_db.persist()
print(f"\n向量数据库已持久化，存储路径：./langchain_embedding_db")

# 测试检索（验证嵌入效果）
query = "BGE-M3模型适合什么场景"
similar_docs = vector_db.similarity_search(query, k=2)
print(f"\n检索结果（与'{query}'最相关的2个文本块）：")
for i, doc in enumerate(similar_docs):
    print(f"\n--- 结果{i+1} ---")
    print(doc.page_content)
```

### 8.8.3 实战结果说明

- 文档分割：将原始文档分割为多个短文本块，避免长文本超出模型输入限制，同时保留上下文；

文档分割：将原始文档分割为多个短文本块，避免长文本超出模型输入限制，同时保留上下文；

- 嵌入生成：用BGE-M3本地模型生成嵌入，启用缓存后，重复文本不会重新计算；

嵌入生成：用BGE-M3本地模型生成嵌入，启用缓存后，重复文本不会重新计算；

- 质量评估：聚类可视化中，语义相关的文本块会聚在一起；人工评估中，“向量嵌入”与“BGE-M3”的相似度最高，符合预期；

质量评估：聚类可视化中，语义相关的文本块会聚在一起；人工评估中，“向量嵌入”与“BGE-M3”的相似度最高，符合预期；

- 向量存储：嵌入向量存入Chroma数据库，持久化后，下次可直接加载使用，无需重新生成嵌入。

向量存储：嵌入向量存入Chroma数据库，持久化后，下次可直接加载使用，无需重新生成嵌入。

### 8.8.4 实战拓展

- 更换模型：将BGE-M3替换为OpenAI Embeddings，只需修改embeddings的初始化代码；

更换模型：将BGE-M3替换为OpenAI Embeddings，只需修改embeddings的初始化代码；

- 处理多格式文档：用PyPDFLoader加载PDF技术文档，用WebBaseLoader加载网页技术文档；

处理多格式文档：用PyPDFLoader加载PDF技术文档，用WebBaseLoader加载网页技术文档；

- 大规模文档：结合批量嵌入、GPU加速，提升处理效率；

大规模文档：结合批量嵌入、GPU加速，提升处理效率；

- 引用来源：综合LangChain官方文档、BGE部署实战、Chroma使用指南。

引用来源：综合LangChain官方文档、BGE部署实战、Chroma使用指南。

## 本章总结

本章围绕LangChain向量嵌入展开，从基础概念到实战落地，覆盖了嵌入的核心原理、多种模型调用、本地部署、性能优化、质量评估，最终通过实战完成技术文档的向量表示。关键要点：

- Embedding的核心是“语义编码”，将文本转为可计算的向量，是语义检索的基础；

Embedding的核心是“语义编码”，将文本转为可计算的向量，是语义检索的基础；

- 优先选择适合场景的模型：OpenAI（通用高精度）、BGE（中文首选）、text2vec（轻量高效）；

优先选择适合场景的模型：OpenAI（通用高精度）、BGE（中文首选）、text2vec（轻量高效）；

- 性能优化：批量嵌入、缓存、GPU加速，可大幅提升处理效率；

性能优化：批量嵌入、缓存、GPU加速，可大幅提升处理效率；

- 质量评估：人工评估、聚类评估、下游任务评估，确保嵌入符合需求；

质量评估：人工评估、聚类评估、下游任务评估，确保嵌入符合需求；

- 实战核心：文本预处理→嵌入生成→质量评估→向量存储，形成完整闭环。

实战核心：文本预处理→嵌入生成→质量评估→向量存储，形成完整闭环。

下一章将讲解向量数据库的使用，结合本章生成的文档向量，实现完整的LangChain RAG检索功能。