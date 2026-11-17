---
title: 可观测性与故障治理
category:
  - LLM
  - AI 工程化
tag:
  - OpenTelemetry
  - Metrics
  - Tracing
  - 故障治理
description: 构建覆盖模型、检索、工具、任务、成本与业务结果的 AI 可观测性体系。
order: 3
outline: [2, 3]
---

# 可观测性与故障治理

## 学习目标

- 用 RED/USE 与业务结果指标评估在线 AI 服务。
- 贯通 Gateway、应用、Agent、模型、向量库和工具的 Trace。
- 分开观察“系统失败”和“模型质量下降”。
- 建立告警、熔断、限流和降级闭环，而不是只收集日志。

## 适用场景

适用于已进入联调、压测、灰度或生产运行的 AI 应用。开发阶段至少保留 Request ID、Token、时延、错误类别和版本标签，避免上线后无法回溯。

## 核心概念

### 四层遥测

| 层 | 核心问题 | 典型信号 |
| --- | --- | --- |
| 业务 | 用户是否完成目标 | 解决率、转人工率、采纳率、工单闭环率 |
| 应用 | 服务是否稳定 | QPS、错误率、P95/P99、队列积压、饱和度 |
| AI 链路 | 模型与检索是否正常 | 首 Token、Token 速率、上下文长度、召回、拒答 |
| 资源/成本 | 资源和费用是否可控 | GPU 利用率、KV Cache、并发、Token/请求、单位任务成本 |

### 指标命名与标签

推荐名称：`ai_request_duration_seconds`、`ai_model_tokens_total`、`ai_tool_calls_total`。

低基数标签示例：

```text
tenant_tier, route, model_alias, task_type, status_class,
tool_name, retryable, cache_hit, stream_mode
```

禁止把 `user_id`、问题原文、完整 Prompt、Trace ID 放入指标标签。高基数字段只进入结构化日志或 Trace 属性。

### Trace Span 结构

```text
POST /v1/chat
├── auth.validate
├── idempotency.check
├── cache.lookup
├── agent.route
│   ├── model.intent_classify
│   └── agent.order_support
├── rag.retrieve
│   ├── embedding.create
│   └── vector.search
├── tool.create_ticket
├── model.generate
└── output.validate
```

## 工程实现

### 可运行的 Prometheus 指标服务

创建 `metrics_app.py`：

```python
import asyncio
import random
import time

from fastapi import FastAPI, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    Counter,
    Gauge,
    Histogram,
    generate_latest,
)

app = FastAPI()
REQUESTS = Counter("ai_requests_total", "AI requests", ["route", "status"])
DURATION = Histogram("ai_request_duration_seconds", "Request duration", ["route"])
TOKENS = Counter("ai_model_tokens_total", "Model tokens", ["model_alias", "kind"])
QUEUE = Gauge("ai_queue_depth", "Queue depth", ["queue"])


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/demo")
async def demo() -> dict:
    started = time.perf_counter()
    status = "success"
    try:
        await asyncio.sleep(random.uniform(0.02, 0.12))
        TOKENS.labels("demo-model", "input").inc(180)
        TOKENS.labels("demo-model", "output").inc(60)
        QUEUE.labels("default").set(random.randint(0, 10))
        return {"ok": True}
    except Exception:
        status = "error"
        raise
    finally:
        DURATION.labels("/demo").observe(time.perf_counter() - started)
        REQUESTS.labels("/demo", status).inc()
```

安装并运行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "fastapi>=0.115,<1" "uvicorn>=0.30,<1" "prometheus-client>=0.21,<1"
uvicorn metrics_app:app --port 8000
curl -X POST http://127.0.0.1:8000/demo
curl http://127.0.0.1:8000/metrics
```

生产环境增加 OpenTelemetry SDK，将 Span 导出到 Jaeger、Tempo 或商业 APM。指标暴露端点只能被监控网络访问，并配置抓取鉴权和采集限制。

### 结构化日志字段

```json
{
  "timestamp": "2026-11-16T10:20:30.123+08:00",
  "level": "INFO",
  "event": "model_call_completed",
  "trace_id": "8f8c...",
  "request_id": "req-...",
  "tenant_id": "hashed-tenant-id",
  "route": "chat.stream",
  "model_alias": "prod-general-v3",
  "latency_ms": 1842,
  "first_token_ms": 520,
  "input_tokens": 2100,
  "output_tokens": 460,
  "cache_hit": false,
  "retry_count": 1,
  "outcome": "success"
}
```

日志默认不记录原始 Prompt、答案、文件内容和凭据。需要调试时使用受控采样、脱敏、短保留期和审批后的查询权限。

## 监控与告警

| 类别 | 指标示例 | 初始告警方向 |
| --- | --- | --- |
| 可用性 | 5xx 比例、模型调用失败率 | 错误预算快速消耗 |
| 时延 | P95、P99、首 Token、工具时延 | SLO 持续超限 |
| 吞吐 | QPS、生成字符/秒、任务完成数 | 突降或异常突增 |
| 饱和度 | 队列深度、连接池、GPU、KV Cache | 接近容量上限 |
| 重试 | 重试率、放大系数、429 比例 | 形成重试风暴 |
| 成本 | Token/请求、成本/成功任务 | 异常增长、重复调用 |
| 质量 | 抽样评分、引用命中、工具失败 | 版本或知识库变更后下降 |

告警必须带运行手册：影响范围、第一检查项、降级开关、回滚版本和升级联系人。

## 故障治理

- **限流**：按租户、用户、路由、模型分别限流，保护昂贵模型和高风险工具。
- **熔断**：模型或工具持续失败时快速失败；半开状态只放少量探测请求。
- **降级**：大模型切换小模型、联网切换知识库、Agent 切换固定工作流、机器人转人工。
- **隔离**：交互请求、批处理、重试、实验流量使用独立队列和并发池。
- **回滚**：模型别名、提示模板、检索参数、工具版本都应可按版本回滚。

## 常见问题

| 现象 | 常见原因 | 处理 |
| --- | --- | --- |
| 监控显示成功但用户说答错 | 只监控 HTTP 成功 | 增加采纳率、引用、回归评测和抽样审核 |
| Trace 在某个服务后断开 | 上下文未跨线程/队列传递 | W3C Trace Context、消息头传播 |
| 指标成本暴涨 | 高基数标签或采样不当 | 限制标签；日志/Trace 分层采样 |
| P99 无法解释 | 只看平均值和单服务 | 查 Span 瀑布、排队、冷启动和 GC |
| 告警很多但无人处理 | 阈值脱离 SLO、缺少运行手册 | 按错误预算告警，合并关联告警 |
| 无法判断是否重复计费 | 成本缺少请求/任务关联 | Token 明细带 `request_id/idempotency_key` |

面试追问：为什么高基数字段不能放 Prometheus 标签？  
标签组合会形成时间序列，用户 ID、Trace ID 等高基数值会使存储、查询和抓取成本失控；应进入日志或 Trace。

## 总结与延伸

可观测性要同时回答“系统是否正常、模型是否有效、钱花在哪里、用户是否完成目标”。上线门禁参见[离线与在线评测](../evaluation/ai-evaluation-offline-online.md)，容量和成本阈值参见[并发、容量与成本治理](../deploy/ai-deploy-capacity-cost.md)。
