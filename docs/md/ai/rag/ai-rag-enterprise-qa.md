---
title: RAG 企业问答系统
category:
  - AI
  - RAG
tag:
  - RAG
  - 企业问答
---

> 覆盖 LangChain 全部 17 章知识点的实战项目

## 系统架构

```
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Web 应用                        │
│  ┌──────────────────┐    ┌──────────────────┐           │
│  │  📤 文档上传入口  │    │  🔍 智能检索入口  │           │
│  │  POST /api/upload │    │  POST /api/query  │           │
│  └────────┬─────────┘    └────────┬─────────┘           │
│           │                       │                      │
│  ┌────────▼─────────┐    ┌────────▼─────────┐           │
│  │ 文档处理器        │    │ 查询管线          │           │
│  │ Loader→Splitter   │    │ 输入防御→缓存检查  │           │
│  │ →元数据注入       │    │ →向量检索→RAG链   │           │
│  └────────┬─────────┘    │ →Agent→Memory     │           │
│           │               └────────┬─────────┘           │
│  ┌────────▼────────────────────────▼─────────┐           │
│  │              向量数据库 (Chroma)            │           │
│  │         Embedding + 缓存 + 元数据过滤       │           │
│  └───────────────────────────────────────────┘           │
│                                                          │
│  [监控层] LangSmith + 审计日志    [缓存层] SQLiteCache    │
└─────────────────────────────────────────────────────────┘
```

## 知识点覆盖矩阵

| 模块 | 知识点 | 对应章节 |
|------|--------|---------|
| 文档处理 | DocumentLoader + TextSplitter + 元数据注入 | 第7章 |
| 向量嵌入 | Embedding 模型 + 缓存 + 批量处理 | 第8章 |
| 向量数据库 | Chroma + 元数据过滤 + MMR检索 | 第9章 |
| RAG 核心 | RetrievalQA + 自定义Retriever + 多路召回 | 第10章 |
| 对话记忆 | ConversationSummaryBufferMemory | 第11章 |
| 工具集成 | 自定义Tool + Agent调用 | 第12章 |
| 智能体 | ReAct Agent + 多工具协作 | 第13章 |
| 工作流 | LangGraph State/Node/Edge | 第14章 |
| 回调监控 | LangSmith + Prometheus + 审计日志 | 第15章 |
| 错误处理 | Fallback + Retry + 输入防御 + 输出过滤 | 第16章 |
| 缓存优化 | SQLiteCache + 缓存键设计 | 第17章 |
| 提示工程 | PromptTemplate + ChatPromptTemplate | 第4章 |
| 输出解析 | PydanticOutputParser + JsonOutputParser | 第5章 |
| 链式编排 | LCEL + SequentialChain | 第6章 |
| Web 服务 | FastAPI + 异步接口 + 文件上传 | 综合实战 |

## 快速开始

### 1. 安装依赖

```bash
cd rag-enterprise-qa
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
cp ../langchain-awesome/.env .
# 编辑 .env 文件，填入你的 API Key
```

### 3. 启动 Web 服务

```bash
# 方式1：直接启动
uvicorn src.web_app:app --reload --host 0.0.0.0 --port 8000

# 方式2：Python 直接运行
python -m src.web_app
```

### 4. 访问系统

打开浏览器访问 **http://localhost:8000**

- **📤 文档上传**：上传 PDF/TXT/MD 等文档，系统自动解析、分块、向量化入库
- **🔍 智能检索**：输入问题，系统基于已上传文档进行 RAG 检索并生成回答

## API 接口文档

启动后访问 **http://localhost:8000/docs** 查看 Swagger 交互式文档。

### 核心接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/status` | 系统状态 |
| `POST` | `/api/upload` | 上传单个文档 |
| `POST` | `/api/upload/batch` | 批量上传文档 |
| `GET` | `/api/documents` | 文档列表 |
| `DELETE` | `/api/documents/{name}` | 删除文档 |
| `POST` | `/api/query` | 智能检索（RAG/Agent） |
| `POST` | `/api/query/stream` | 流式检索（SSE） |
| `GET` | `/api/memory/{user_id}` | 查看对话历史 |
| `DELETE` | `/api/memory/{user_id}` | 清除对话历史 |

### 查询示例

```bash
# RAG 模式查询
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "文档的主要内容是什么？", "top_k": 3}'

# Agent 模式查询（自动选择工具）
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "现在几点了？", "use_agent": true}'
```

## 项目结构

```
rag-enterprise-qa/
├── templates/
│   └── index.html            # 前端页面（上传+检索）
├── src/
│   ├── web_app.py            # FastAPI Web 应用（双入口）
│   ├── config.py             # 配置管理（第2章）
│   ├── document_processor.py # 文档处理（第7章）
│   ├── vector_store.py       # 向量数据库（第8、9章）
│   ├── rag_pipeline.py       # RAG 管线（第10章）
│   ├── memory_manager.py     # 对话记忆（第11章）
│   ├── tools.py              # 工具定义（第12章）
│   ├── agent_service.py      # 智能体服务（第13章）
│   ├── workflow.py            # LangGraph 工作流（第14章）
│   ├── monitor.py            # 监控回调（第15章）
│   ├── defense.py            # 安全防御（第16章）
│   ├── cache_manager.py      # 缓存管理（第17章）
│   ├── prompts.py            # 提示模板（第4章）
│   ├── ingest.py             # 文档导入脚本
│   └── main.py               # CLI 入口
├── docs/                      # 放置待导入的文档
├── requirements.txt
└── README.md
```
