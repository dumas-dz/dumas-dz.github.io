---
title: 异步任务、队列与持久化
category:
  - LLM
  - AI 工程化
tag:
  - 队列
  - 持久化
  - 幂等
  - Outbox
description: 使用任务状态机、Outbox/Inbox、队列与事件日志构建可恢复的 AI 异步链路。
order: 2
outline: [2, 3]
---

# 异步任务、队列与持久化

## 学习目标

- 为长耗时 AI 任务设计 `accepted/running/succeeded/failed/cancelled` 状态机。
- 正确处理队列至少一次投递、重复消费、乱序和部分失败。
- 使用 Outbox/Inbox 模式保证数据库与消息系统之间的最终一致性。
- 让 SSE 断线后的客户端可以通过任务状态或事件游标继续读取结果。

## 适用场景

适用于文档解析、批量抽取、RAG 索引、多 Agent 工作流、定时报告和超过网关超时的生成任务。

不建议使用的场景：

- 简单单轮短文本生成，一次 HTTP 即可完成。
- 必须严格同步返回且业务方不能查询任务状态。
- 下游操作本身不可幂等且无法登记执行结果。

## 核心概念

### 至少一次不等于重复执行安全

队列通常提供 at-least-once。消费者可能在“业务已执行、ACK 未提交”时崩溃并再次收到消息。因此：

```text
收到消息 -> 查询 Inbox/幂等表 -> 执行业务并写 Outbox
        -> 写消费位点/结果 -> ACK
```

只有业务副作用和幂等记录同事务提交，才能避免“记录成功但业务未执行”或相反。

### 任务状态机

```text
accepted -> queued -> running -> succeeded
                    |       \-> failed -> queued（人工或自动重试）
                    \-> cancelled
```

- 状态转换必须带版本号，旧 Worker 不得覆盖新状态。
- `running` 需要 `lease_until`，租约超时后允许重新投递。
- `failed` 区分用户错误、暂时故障和系统错误，只有暂时故障进入自动重试。
- `cancel_requested` 与 `cancelled` 分开，前者是请求，后者是执行器确认。

### 事件日志

任务表只保存当前状态，事件表保存 `created/started/retry/token/output/tool_call/completed` 等事件。SSE 客户端使用自增 `event_id` 或时间游标续传。

## 工程实现

### 可运行的 SQLite Outbox/Inbox Worker

创建 `worker.py`：

```python
import asyncio
import json
import sqlite3
import time
import uuid
from dataclasses import dataclass


SCHEMA = """
CREATE TABLE IF NOT EXISTS task_outbox (
  idempotency_key TEXT PRIMARY KEY,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  next_run_at REAL NOT NULL,
  created_at REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS consumer_inbox (
  consumer_name TEXT NOT NULL,
  idempotency_key TEXT NOT NULL,
  result_json TEXT NOT NULL,
  consumed_at REAL NOT NULL,
  PRIMARY KEY (consumer_name, idempotency_key)
);
CREATE TABLE IF NOT EXISTS task_event (
  event_id INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at REAL NOT NULL
);
"""


@dataclass
class Job:
    idempotency_key: str
    payload: dict


class Store:
    def __init__(self, path: str):
        self.db = sqlite3.connect(path, isolation_level=None)
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.executescript(SCHEMA)

    def enqueue(self, job: Job) -> bool:
        try:
            self.db.execute(
                "INSERT INTO task_outbox(idempotency_key, payload_json, next_run_at, created_at)"
                " VALUES (?, ?, ?, ?)",
                (job.idempotency_key, json.dumps(job.payload), time.time(), time.time()),
            )
            return True
        except sqlite3.IntegrityError:
            return False

    def claim(self, consumer: str) -> tuple[str, dict] | None:
        self.db.execute("BEGIN IMMEDIATE")
        row = self.db.execute(
            "SELECT idempotency_key, payload_json FROM task_outbox"
            " WHERE status='pending' AND next_run_at<=? ORDER BY created_at LIMIT 1",
            (time.time(),),
        ).fetchone()
        if row is None:
            self.db.execute("COMMIT")
            return None
        key, payload_json = row
        self.db.execute(
            "UPDATE task_outbox SET status='running', attempts=attempts+1"
            " WHERE idempotency_key=? AND status='pending'",
            (key,),
        )
        self.db.execute(
            "INSERT INTO task_event(idempotency_key, event_type, payload_json, created_at)"
            " VALUES (?, 'claimed', ?, ?)",
            (key, json.dumps({"consumer": consumer}), time.time()),
        )
        self.db.execute("COMMIT")
        return key, json.loads(payload_json)

    def read_result(self, consumer: str, key: str) -> dict | None:
        row = self.db.execute(
            "SELECT result_json FROM consumer_inbox WHERE consumer_name=? AND idempotency_key=?",
            (consumer, key),
        ).fetchone()
        return json.loads(row[0]) if row else None

    def finish(self, consumer: str, key: str, result: dict) -> None:
        self.db.execute("BEGIN IMMEDIATE")
        self.db.execute(
            "INSERT OR IGNORE INTO consumer_inbox"
            " (consumer_name, idempotency_key, result_json, consumed_at)"
            " VALUES (?, ?, ?, ?)",
            (consumer, key, json.dumps(result, ensure_ascii=False), time.time()),
        )
        self.db.execute(
            "INSERT INTO task_event(idempotency_key, event_type, payload_json, created_at)"
            " VALUES (?, 'succeeded', ?, ?)",
            (key, json.dumps(result, ensure_ascii=False), time.time()),
        )
        self.db.execute(
            "UPDATE task_outbox SET status='done' WHERE idempotency_key=?",
            (key,),
        )
        self.db.execute("COMMIT")

    def fail(self, key: str, error: str, retry: bool) -> None:
        status = "pending" if retry else "failed"
        next_run = time.time() + 2
        self.db.execute(
            "UPDATE task_outbox SET status=?, next_run_at=? WHERE idempotency_key=?",
            (status, next_run, key),
        )
        self.db.execute(
            "INSERT INTO task_event(idempotency_key, event_type, payload_json, created_at)"
            " VALUES (?, 'failed', ?, ?)",
            (key, json.dumps({"error": error, "retry": retry}), time.time()),
        )


async def process(payload: dict) -> dict:
    await asyncio.sleep(0.05)
    return {"normalized_text": payload["text"].strip(), "output_tokens": len(payload["text"])}


async def consume_one(store: Store, consumer: str) -> bool:
    item = store.claim(consumer)
    if item is None:
        return False
    key, payload = item
    cached = store.read_result(consumer, key)
    if cached is not None:
        store.finish(consumer, key, cached)
        return True
    try:
        result = await process(payload)
        store.finish(consumer, key, result)
    except Exception as exc:
        retryable = isinstance(exc, (TimeoutError, ConnectionError))
        store.fail(key, str(exc), retryable)
    return True


async def main() -> None:
    store = Store("tasks.db")
    first = Job("job-0001", {"text": "  企业知识库  "})
    second = Job("job-0001", {"text": "  企业知识库  "})
    print("enqueued:", store.enqueue(first), store.enqueue(second))
    while await consume_one(store, "normalizer-v1"):
        pass
    print("result:", store.read_result("normalizer-v1", "job-0001"))


if __name__ == "__main__":
    asyncio.run(main())
```

运行：

```bash
python worker.py
```

示例用 SQLite 说明事务边界。RabbitMQ/RocketMQ/Kafka 环境中，仍需保留数据库 Inbox 或业务唯一键，消息 ACK 只能在事务提交后执行。

### 队列选型

| 维度 | RabbitMQ/RocketMQ | Kafka | 云任务队列 |
| --- | --- | --- | --- |
| 典型用途 | 业务命令、延迟重试 | 高吞吐事件、日志流 | 托管异步任务 |
| 顺序 | 单队列/分区可控制 | 分区内有序 | 视服务而定 |
| 重试 | 死信、延迟交换 | 自定义重试 Topic | 内置重试/DLQ |
| 重放 | 有限 | 强 | 有限 |
| 运维 | 自建需管理 | 自建需管理 | 低 |

## 生产实践

- 每条消息携带 `message_id`、`idempotency_key`、`trace_id`、`tenant_id`、`attempt`、`created_at`。
- 只允许业务可接受的重试错误自动重试；内容违规、参数错误进入终态。
- 设置最大尝试次数、总任务时长、死信队列和人工重放工具。
- Worker 按模型、租户或任务类型分队列，防止大任务阻塞低延迟交互。
- 批量任务做有界并发；对模型 Provider 设置全局令牌桶，避免队列排空后打爆模型服务。
- 长文本输出分块写入对象存储，数据库只保存摘要、校验和与对象键。
- 事件保留期大于任务保留期，保证问题发生后可以追溯。
- 重放前先预估成本，并按租户、日期和任务类型限制重放范围。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 任务被重复执行 | 消费成功后 ACK 前崩溃 | Inbox/唯一键 + 同事务副作用 |
| 消息堆积 | 大任务、下游限速或消费者过少 | 分队列、扩容、分级限流 |
| 旧消息覆盖新状态 | 消费乱序 | 状态版本、事件时间、只执行合法跃迁 |
| 重试风暴 | 所有失败消息同一时刻重投 | 指数退避、随机抖动、重试配额 |
| 无法续传 SSE | 只把内容写到连接缓冲区 | 写事件日志，按游标续传 |
| 删除会话后结果仍存在 | 数据分散在缓存/对象存储/日志 | 建立数据清单和删除传播任务 |

面试追问：Kafka 的幂等 Producer 能否替代业务幂等？  
不能。Producer 幂等只解决单会话重复写入，不解决消费者重放、版本升级或跨系统重复副作用。

## 总结与延伸

异步链路的可靠性来自事务边界、状态机、消息语义和可重放事件，而不是某一个队列产品。接口同步语义参见[AI 服务接口与可靠性](./ai-engineering-service-reliability.md)，运行指标参见[可观测性与故障治理](./ai-engineering-observability.md)。
