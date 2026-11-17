---
title: 模型选型与部署决策
category:
  - LLM
  - AI 部署
tag:
  - 模型选型
  - 基准测试
  - 量化
  - 总拥有成本
description: 以任务质量、上下文、时延、容量、合规和总拥有成本选择企业 AI 模型。
order: 3
outline: [2, 3]
---

# 模型选型与部署决策

## 学习目标

- 建立符合业务任务而非排行榜的模型评分矩阵。
- 通过代表性 PoC 比较质量、时延、吞吐、显存、成本和运维。
- 区分模型能力、提示/RAG/工具贡献和部署精度影响。
- 为不同任务建立主模型、小模型、嵌入模型和降级模型组合。

## 适用场景

适用于新项目选型、供应商替换、基座升级、量化部署、GPU 采购、成本优化和多模型路由设计。

## 核心概念

### 选型不是单模型排名

同一个系统通常需要多种模型：

| 角色 | 要求 | 示例任务 |
| --- | --- | --- |
| 通用主模型 | 推理、工具调用、中文、长上下文 | 复杂客服、Agent、分析 |
| 轻量模型 | 低时延、低成本、格式稳定 | 意图分类、改写、抽取 |
| 嵌入模型 | 检索质量、维度、语言、成本 | RAG、聚类、语义搜索 |
| 重排模型 | 精排质量、推理速度 | RAG 证据排序 |
| 安全模型 | 分类稳定、可解释 | 注入、PII、内容风险 |
| 专用微调模型 | 固定格式/领域 | 工单分类、报告生成 |

### 评估维度

| 维度 | 指标 |
| --- | --- |
| 任务质量 | 核心集通过率、最差组、结构化成功率 |
| 上下文 | 有效上下文长度、长文定位、截断敏感性 |
| 工具能力 | 工具选择、参数、并行、重试、JSON |
| 中文/领域 | 术语、口语、繁简、行业政策 |
| 安全 | 拒答、注入、越权、隐私、有害内容 |
| 性能 | 首 Token、Token 速率、P95、冷启动、并发 |
| 资源 | 显存、GPU、CPU、内存、存储、网络 |
| 运维 | 版本固定、监控、量化、生态、升级成本 |
| 成本 | 训练/部署/调用/人工复核/故障成本 |
| 合规 | 数据区域、许可证、训练保留、审计支持 |

### 决策公式

不要把所有维度压成一个不透明总分。先设置硬门槛：

```text
硬门槛：安全、许可证、数据区域、最大上下文、P95、预算
        ↓
通过者：比较任务质量、最差组、单位成功任务成本
        ↓
最终选择：主模型 + 小模型 + 降级模型 + 回滚模型
```

## 工程实现

### 可运行的模型评分矩阵

创建 `rank_models.py`：

```python
import argparse
import json
from pathlib import Path


WEIGHTS = {
    "quality": 0.35,
    "safety": 0.25,
    "latency": 0.15,
    "throughput": 0.10,
    "cost": 0.15,
}

GATES = {
    "safety": 0.95,
    "quality": 0.80,
    "p95_seconds_max": 20.0,
    "cost_per_1k_max": 2.0,
}


def evaluate(model: dict) -> dict:
    gate_failures = []
    for key in ("quality", "safety"):
        if model[key] < GATES[key]:
            gate_failures.append(f"{key}_below_gate")
    if model["p95_seconds"] > GATES["p95_seconds_max"]:
        gate_failures.append("p95_above_gate")
    if model["cost_per_1k"] > GATES["cost_per_1k_max"]:
        gate_failures.append("cost_above_gate")

    normalized_cost = max(0.0, min(1.0, 1.0 - model["cost_per_1k"] / GATES["cost_per_1k_max"]))
    score = (
        model["quality"] * WEIGHTS["quality"]
        + model["safety"] * WEIGHTS["safety"]
        + model["latency_score"] * WEIGHTS["latency"]
        + model["throughput_score"] * WEIGHTS["throughput"]
        + normalized_cost * WEIGHTS["cost"]
    )
    return {
        "model_id": model["model_id"],
        "eligible": not gate_failures,
        "score": round(score, 4),
        "gate_failures": gate_failures,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("models", type=Path)
    args = parser.parse_args()

    models = json.loads(args.models.read_text(encoding="utf-8"))
    ranked = sorted(
        (evaluate(model) for model in models),
        key=lambda item: (item["eligible"], item["score"]),
        reverse=True,
    )
    print(json.dumps(ranked, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

创建 `models.json`：

```json
[
  {
    "model_id": "private-large",
    "quality": 0.92,
    "safety": 0.98,
    "latency_score": 0.72,
    "throughput_score": 0.82,
    "p95_seconds": 8.5,
    "cost_per_1k": 1.4
  },
  {
    "model_id": "private-small",
    "quality": 0.84,
    "safety": 0.97,
    "latency_score": 0.94,
    "throughput_score": 0.96,
    "p95_seconds": 2.8,
    "cost_per_1k": 0.4
  }
]
```

运行：

```bash
python rank_models.py models.json
```

数值必须来自同一评测集、同一提示模板、同一输出上限和同一硬件/供应商计价周期。

## PoC 流程

1. 从真实任务抽取代表性输入，覆盖短/长、多轮、工具、结构化、安全和拒答。
2. 冻结 Prompt、RAG、工具和数据快照，避免模型与应用变更混杂。
3. 在目标硬件/供应商上测试质量、首 Token、吞吐、P95、错误率和并发。
4. 测量有效上下文，而非只看厂商最大上下文；记录长文召回和位置偏差。
5. 比较主模型、量化模型、微调小模型和路由方案。
6. 计算单位成功任务成本，包括 GPU 空闲、重试、人工复核和故障损失。
7. 形成淘汰理由和已知限制，写入模型卡与架构决策记录。

## 量化和精度

| 方式 | 收益 | 风险 |
| --- | --- | --- |
| FP16/BF16 | 质量基线、通用 | 显存较高 |
| INT8 | 显存/吞吐改善 | 任务相关退化 |
| INT4/AWQ/GPTQ 等 | 单卡可放更大模型 | 精度、工具格式和长文需重点回归 |
| 服务端量化 | 部署简单 | 引擎和硬件兼容差异 |

任何量化、裁剪、合并或推理引擎升级都视为模型变更，需要完整回归，不能只验证“能输出”。

## 路由策略

```text
请求 -> 风险/复杂度/上下文/租户配额
     -> 高复杂度/高风险：大模型或人工
     -> 常规任务：主模型
     -> 分类/抽取/改写：小模型
     -> 故障/超预算：降级模型、缓存、固定流程或转人工
```

路由模型本身也要评测，关注误分、成本节约、最差任务和切换体验。不要为省成本把高风险任务静默切换到小模型。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 排行榜第一但业务差 | 基准与业务分布不匹配 | 真实样本 PoC、任务门禁 |
| 长上下文效果差 | 有效长度、位置和截断策略 | 长文专项、检索/压缩 |
| 量化后 JSON 频繁错 | 输出格式能力退化 | Schema、修复器或换精度 |
| 小模型总成本更高 | 重试和人工接管多 | 按成功任务成本计算 |
| 同一提示无法比较 | Chat Template/输出预算不同 | 统一接口和评测协议 |
| 供应商升级导致回归 | 非固定模型版本 | 固定版本、金丝雀、回滚 |

面试追问：为什么单位 Token 成本不能代表真实成本？  
真实成本包括重试、长输出、失败任务、人工接管、GPU 空闲、许可、运维和业务损失；应使用“单位成功任务成本”。

## 总结与延伸

模型选型要以硬门槛、真实 PoC 和业务成功率为依据，并为每类任务保留主/小/降级组合。容量数据参见[并发、容量与成本治理](./ai-deploy-capacity-cost.md)。
