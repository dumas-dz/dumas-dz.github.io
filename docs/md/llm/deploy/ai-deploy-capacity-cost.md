---
title: 并发、容量与成本治理
category:
  - LLM
  - AI 部署
tag:
  - 并发
  - 容量规划
  - 成本治理
  - 配额
description: 通过压测、队列、并发池、配额和成本归因治理 AI 服务的容量与费用。
order: 4
outline: [2, 3]
---

# 并发、容量与成本治理

## 学习目标

- 区分请求并发、模型并发、生成并发和下游工具并发。
- 根据输入/输出 Token、时延和 GPU 吞吐估算容量与成本。
- 通过队列、批处理、路由、缓存、配额和自动扩缩防止雪崩。
- 建立预算、异常成本告警、归因和优化闭环。

## 适用场景

适用于 GPU 私有化推理、模型 API 调用、Dify Workflow、批量任务和多租户 AI 平台。

## 核心概念

### 并发层次

| 层次 | 受限因素 | 保护措施 |
| --- | --- | --- |
| 客户端并发 | 连接数、浏览器、上游系统 | 客户端连接池、退避 |
| Gateway QPS | 网关连接和鉴权 | 限流、请求大小 |
| 应用并发 | 事件循环、连接池、线程 | 有界队列、隔离池 |
| 模型并发 | GPU、KV Cache、批处理 | 排队、动态批、并发上限 |
| 工具并发 | 业务系统容量 | 熔断、并发池、幂等 |
| 重试并发 | 故障时放大量 | 重试预算、抖动、熔断 |

### 容量估算

简化模型：

```text
请求到达率 λ（req/s）
平均服务时间 S（s/req）
理论并发 L = λ × S

模型总并发 = 实例数 × 单实例有效并发
有效吞吐 = 完成请求数 / 时间
单位成功任务成本 = 总成本 / 成功任务数
```

实际容量受输入/输出 Token、上下文长度、缓存命中、输出波动、批处理、模型精度和工具时延影响。必须以压测结果修正模型。

### 成本构成

| 成本 | 自建 GPU | 外部 API |
| --- | --- | --- |
| 固定 | GPU、主机、存储、网络、许可 | 预留/承诺费用 |
| 变动 | 电力、托管、扩容、运维 | Token/请求/工具调用 |
| 隐性 | 空闲、冷启动、故障、重试 | 长输出、重试、超额、人工 |
| 质量 | 评测、红队、人工复核 | 评测和人工复核 |

## 工程实现

### 可运行的容量与预算模型

创建 `capacity_model.py`：

```python
import argparse
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Workload:
    requests_per_second: float
    avg_input_tokens: int
    avg_output_tokens: int
    input_price_per_million: float
    output_price_per_million: float
    retry_rate: float
    success_rate: float
    avg_seconds_per_request: float
    monthly_budget: float


def calculate(workload: Workload, days: int = 30) -> dict:
    effective_rps = workload.requests_per_second * (1 + workload.retry_rate)
    monthly_requests = effective_rps * 86400 * days
    input_tokens = monthly_requests * workload.avg_input_tokens
    output_tokens = monthly_requests * workload.avg_output_tokens
    cost = (
        input_tokens / 1_000_000 * workload.input_price_per_million
        + output_tokens / 1_000_000 * workload.output_price_per_million
    )
    successful_tasks = monthly_requests * workload.success_rate
    return {
        "effective_requests_per_second": round(effective_rps, 3),
        "theoretical_concurrency": round(
            effective_rps * workload.avg_seconds_per_request, 3
        ),
        "monthly_requests": round(monthly_requests),
        "monthly_input_tokens": round(input_tokens),
        "monthly_output_tokens": round(output_tokens),
        "monthly_cost": round(cost, 2),
        "cost_per_success": round(cost / max(successful_tasks, 1), 6),
        "budget_utilization": round(cost / workload.monthly_budget, 4),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workload", type=Path)
    args = parser.parse_args()
    workload = Workload(**json.loads(args.workload.read_text(encoding="utf-8")))
    print(json.dumps(calculate(workload), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

创建 `workload.json`：

```json
{
  "requests_per_second": 5,
  "avg_input_tokens": 2200,
  "avg_output_tokens": 500,
  "input_price_per_million": 0.8,
  "output_price_per_million": 2.0,
  "retry_rate": 0.05,
  "success_rate": 0.98,
  "avg_seconds_per_request": 7.5,
  "monthly_budget": 10000
}
```

运行：

```bash
python capacity_model.py workload.json
```

脚本用于建立量级基线。GPU 自建成本需加入 GPU 小时、利用率、预留、存储、网络、许可和人力；API 计费以实际账单规则为准。

## 压测方案

### 流量模型

- 稳态：工作时段和全天平均请求率。
- 突发：整点任务、营销活动、上游批量同步、开园/开盘等业务峰值。
- 形状：短输入短输出、长输入短输出、短输入长输出、多轮长会话。
- 混合：交互、批处理、重试、Embedding、工具和安全检测同时发生。
- 故障：模型节点重启、429、数据库慢、工具超时、网络抖动。

### 指标

| 类别 | 指标 |
| --- | --- |
| 吞吐 | 完成 RPS、Token/s、任务/h |
| 时延 | 首 Token P50/P95/P99、总时长、排队时间 |
| 稳定 | 错误率、超时率、重试率、重试放大系数 |
| 饱和 | 队列深度、连接池、GPU、显存、KV Cache、CPU |
| 质量 | 长任务成功率、输出截断率、结构化成功率 |
| 成本 | Token/请求、成本/成功、缓存命中 |

## 生产治理

### 限流与配额

| 层级 | 配额示例 | 超限动作 |
| --- | --- | --- |
| 租户 | QPS、并发、日 Token、日成本 | 排队、429、审批扩容 |
| 用户 | 并发、单请求 Token、速率 | 429、等待 |
| 路由 | 交互/批处理/实验池并发 | 隔离队列 |
| 模型 | Provider 配额、GPU 并发 | 降级/排队 |
| 工具 | 业务系统 QPS、写操作 | 熔断、转人工 |

配额必须有 429 原因、`Retry-After` 和可观测标签。高价值租户可通过独立池或加权公平队列保障，不应简单优先所有请求。

### 优化顺序

1. 修复重复调用、死循环、超长 Prompt、无效重试和缓存缺失。
2. 对分类、抽取、改写使用小模型或批处理。
3. 优化检索上下文，移除无关文档和重复内容。
4. 调整输出上限、停止条件和结构化约束。
5. 通过路由、缓存、并发池和批量请求改善资源使用。
6. 最后才考虑更换模型、量化、采购或压缩业务范围。

### 预算与告警

- 按租户、产品、路由、模型、团队、环境和任务类型归因成本。
- 设置小时/天/月预算，阈值按 50%/80%/100% 提示、限制和审批。
- 对成本环比、单位任务成本、重试费用、长输出和缓存命中变化告警。
- 异常自动采取措施时先降级非核心任务，不直接阻断高风险人工处理。
- 每月复盘成本/成功任务、Top 任务、模型路由和无效请求。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 并发越高吞吐越低 | 重试、锁、GPU 争用、队列失控 | 分层压测、重试预算、隔离池 |
| GPU 利用率高但完成慢 | 长输出、序列长度不均 | 按长度队列、输出上限 |
| 429 后系统雪崩 | 同步重试且无退避 | 抖动、熔断、全局预算 |
| 成本突然翻倍 | Prompt 变长、循环调用、缓存失效 | Token 细分、Trace、成本告警 |
| 队列堆积内存增长 | 无界队列 | 有界队列、背压、对象存储 |
| 小模型路由省钱但投诉增加 | 高难度任务被误分 | 路由评测、置信转大模型 |
| 预算只剩均值无细节 | 无法归因 | 请求/任务/租户/模型成本标签 |

面试追问：为什么队列越长不一定吞吐越高？  
队列增加只吸收瞬时突发；超过服务容量会提高时延、超时和重试，最终形成有效吞吐下降和成本放大，需要有界队列与背压。

## 总结与延伸

容量治理控制“系统会不会崩”，成本治理控制“业务是否可持续”。模型选择输入参见[模型选型与部署决策](./ai-deploy-model-selection.md)，线上指标接入[可观测性与故障治理](../engineering/ai-engineering-observability.md)。
