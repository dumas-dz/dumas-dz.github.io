---
title: AI 服务接口与可靠性
category:
  - LLM
  - AI 工程化
tag:
  - FastAPI
  - SSE
  - 幂等
  - 重试
description: 使用 FastAPI 构建可流式、可重试、可幂等处理的企业级 AI 服务接口。
order: 1
outline: [2, 3]
---

# AI 服务接口与可靠性

## 学习目标

- 区分 AI 服务的普通请求、流式请求和异步任务三类接口。
- 为模型调用设置分层超时、有限重试和明确的错误协议。
- 使用 Idempotency-Key 防止网络重试和用户重复提交造成重复业务结果。
- 在不阻塞事件循环的前提下完成 HTTP、数据库和工具调用。

## 适用场景

适用于对话生成、文本改写、分类、结构化抽取、Agent 单轮执行等在线服务。

以下场景不应只依赖同步 HTTP：

| 场景 | 推荐方式 |
| --- | --- |
| 首字需要快速返回 | SSE 或流式 HTTP |
| 执行时间超过网关超时 | 任务 API + 队列 |
| 可批量提交并接受延迟 | 批处理作业 |
| 必须与客户端双向交互 | WebSocket 或分段任务接口 |

## 核心概念

### 请求生命周期

```text
接收 -> 认证/授权 -> 参数校验 -> 配额/限流 -> 幂等检查
    -> 缓存检查 -> Trace -> 模型/工具调用 -> 输出校验
    -> 持久化 -> 响应/事件流 -> 记录成本与结果
```

### 超时不是单个数字

| 超时层 | 建议控制项 | 失败动作 |
| --- | --- | --- |
| 客户端 | 总等待时间、SSE 空闲时间 | 重连或查询任务 |
| 网关 | Header、Body、Idle、Total | 返回标准 502/504 |
| 应用 | 获取连接、排队、单工具、模型、总预算 | 取消子任务 |
| 模型 | 首 Token、Token 间间隔、总生成时间 | 降级模型或返回摘要 |

### 重试分类

- 可重试：连接超时、短暂网络错误、HTTP 429、部分 5xx。
- 不可重试：400 校验错误、401/403 权限错误、内容策略拒绝、确定性 404。
- 条件重试：模型已产生部分输出或业务工具已执行时，必须先确认幂等与状态。
- 使用指数退避加随机抖动，并限制总次数、总时长和全局重试并发。

## 工程实现

### 可运行的 FastAPI 流式服务

创建 `main.py`：

```python
import asyncio
import hashlib
import json
import os
import time
import uuid
from contextlib import asynccontextmanager
from dataclasses import dataclass, field

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field


@dataclass
class AppState:
    cache: dict[str, tuple[float, str]] = field(default_factory=dict)
    idempotency: dict[str, tuple[float, str]] = field(default_factory=dict)
    locks: dict[str, asyncio.Lock] = field(default_factory=dict)
    client: httpx.AsyncClient | None = None


STATE = AppState()
MODEL_URL = os.getenv("MODEL_URL", "http://127.0.0.1:11434/v1/chat/completions")
MODEL_NAME = os.getenv("MODEL_NAME", "qwen2.5:7b")
MODEL_API_KEY = os.getenv("MODEL_API_KEY", "local")
MAX_RETRIES = 3


class Message(BaseModel):
    role: str = Field(pattern="^(system|user|assistant)$")
    content: str = Field(min_length=1, max_length=32_000)


class ChatRequest(BaseModel):
    user_id: str = Field(min_length=1, max_length=64)
    messages: list[Message] = Field(min_length=1, max_length=50)
    temperature: float = Field(default=0.2, ge=0, le=2)


@asynccontextmanager
async def lifespan(app: FastAPI):
    STATE.client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=3.0, read=60.0, write=10.0, pool=5.0)
    )
    yield
    await STATE.client.aclose()


app = FastAPI(title="Reliable AI Chat API", lifespan=lifespan)


def fingerprint(payload: ChatRequest) -> str:
    raw = payload.model_dump_json()
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


async def generate(payload: ChatRequest) -> str:
    body = {
        "model": MODEL_NAME,
        "messages": [message.model_dump() for message in payload.messages],
        "temperature": payload.temperature,
        "stream": False,
    }
    headers = {"Authorization": f"Bearer {MODEL_API_KEY}"}
    last_error: Exception | None = None

    for attempt in range(MAX_RETRIES):
        try:
            response = await STATE.client.post(MODEL_URL, json=body, headers=headers)
            if response.status_code in (408, 409, 425, 429, 500, 502, 503, 504):
                raise httpx.HTTPStatusError(
                    f"retryable status {response.status_code}",
                    request=response.request,
                    response=response,
                )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except (httpx.TimeoutException, httpx.TransportError, httpx.HTTPStatusError) as exc:
            last_error = exc
            if attempt + 1 == MAX_RETRIES:
                break
            await asyncio.sleep((2**attempt) * 0.2 + 0.1 * attempt)

    raise HTTPException(status_code=503, detail=f"model unavailable: {last_error}")


async def stream_text(text: str):
    yield "event: message\n"
    for part in text:
        yield f"data: {json.dumps({'text': part}, ensure_ascii=False)}\n"
        await asyncio.sleep(0)
    yield "event: done\n"
    yield f"data: {json.dumps({'usage': {'output_chars': len(text)}}, ensure_ascii=False)}\n"


@app.post("/v1/chat/stream")
async def chat_stream(
    payload: ChatRequest,
    idempotency_key: str = Header(min_length=8, max_length=128),
    request_id: str | None = Header(default=None, alias="X-Request-ID"),
):
    request_id = request_id or str(uuid.uuid4())
    lock = STATE.locks.setdefault(idempotency_key, asyncio.Lock())

    async with lock:
        cached = STATE.idempotency.get(idempotency_key)
        if cached and cached[0] > time.monotonic():
            return StreamingResponse(stream_text(cached[1]), media_type="text/event-stream")

        cache_key = fingerprint(payload)
        cached_answer = STATE.cache.get(cache_key)
        if cached_answer and cached_answer[0] > time.monotonic():
            answer = cached_answer[1]
        else:
            answer = await generate(payload)
            STATE.cache[cache_key] = (time.monotonic() + 300, answer)

        STATE.idempotency[idempotency_key] = (time.monotonic() + 3600, answer)

    return StreamingResponse(stream_text(answer), media_type="text/event-stream")
```

安装并运行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "fastapi>=0.115,<1" "httpx>=0.27,<1" "pydantic>=2.8,<3" "uvicorn>=0.30,<1"
uvicorn main:app --host 0.0.0.0 --port 8000
```

请求示例：

```bash
curl -N http://127.0.0.1:8000/v1/chat/stream \
  -H 'Content-Type: application/json' \
  -H 'Idempotency-Key: demo-request-0001' \
  -d '{"user_id":"u-1","messages":[{"role":"user","content":"总结生产环境上线检查项"}]}'
```

示例使用单进程内存表说明协议，生产环境应将 `cache` 和 `idempotency` 迁移到 Redis，并使用数据库唯一约束兜底。

### Java/Spring 对应关系

| Python 方案 | Spring Boot 3 方案 |
| --- | --- |
| FastAPI + Pydantic | Web MVC/WebFlux + Bean Validation |
| `httpx.AsyncClient` | WebClient、Java HttpClient |
| `StreamingResponse` | `Flux<ServerSentEvent<T>>` |
| `asyncio.Lock` | Redis `SETNX`、数据库唯一键 |
| `asyncio.Queue` | RabbitMQ、RocketMQ、Kafka |
| `BackgroundTasks` | `@Async`、任务表、MQ Worker |

## 生产实践

- 幂等键由客户端生成并覆盖完整业务操作；同一用户重试时复用，新业务意图使用新键。
- 先持久化“任务已受理”和输入摘要，再调用昂贵模型，避免客户端超时后无法追踪。
- 缓存键包含租户、模型版本、系统提示版本、知识库版本和输入，避免跨租户污染。
- SSE 只发送可序列化事件，不向客户端泄露堆栈、内部 URL、提示词或工具凭据。
- 为客户端断开注册取消信号，避免用户关闭页面后继续消耗 Token。
- 对长输出设置最大 Token、停止条件和输出结构校验。

## 常见问题

| 现象 | 常见原因 | 排查方法 |
| --- | --- | --- |
| 事件循环偶发卡顿 | 同步 SDK/文件 IO 在 async 函数中执行 | Trace 中查看阻塞 Span；改为异步客户端或线程池 |
| 同一请求生成两次 | Idempotency-Key 缺失或先调用后登记 | 检查并发日志、数据库唯一键、锁覆盖范围 |
| SSE 一直空白 | 未刷新缓冲区或代理开启压缩 | 发送心跳；检查 Nginx/网关缓冲配置 |
| 429 后大量失败 | 所有请求同时重试 | 加随机抖动、退避、并发上限和熔断 |
| 首字慢但吞吐正常 | 冷启动、排队或 prompt 过长 | 分解首 Token、排队、Token 输入指标 |
| 客户端断开仍扣费 | 未传播取消信号 | 对所有下游调用绑定 `request_id` 与取消上下文 |

面试追问：为什么客户端提供 Idempotency-Key 后仍可能重复？  
因为锁范围、存储一致性或下游副作用不一致；必须把幂等记录和业务结果放入同一事务，或由下游接口提供幂等保证。

## 总结与延伸

核心原则是“入口可识别、调用有预算、重试有边界、写入可去重、流式可取消”。下一步阅读[异步任务、队列与持久化](./ai-engineering-async-persistence.md)，将长任务从请求生命周期中解耦。

参考范围：FastAPI 官方文档、HTTP Idempotency-Key 草案语义、OpenTelemetry 文档。具体 API 以部署时锁定版本为准。
