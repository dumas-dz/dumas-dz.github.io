---
title: 离线与在线评测体系
category:
  - LLM
  - AI 评测
tag:
  - 离线评测
  - 在线评测
  - 指标
  - 实验
description: 从评测问题定义、数据集建设到离线评分和在线实验的完整质量闭环。
order: 1
outline: [2, 3]
---

# 离线与在线评测体系

## 学习目标

- 把业务目标转成可计算的评测任务和分层数据集。
- 使用规则、模型 Judge 和人工标注组合评估生成结果。
- 设计安全的在线实验、反馈采集和灰度策略。
- 建立“失败分析 -> 数据回流 -> 修复 -> 回归”的闭环。

## 适用场景

适用于新能力上线、模型/提示/RAG 版本比较、在线事故后的样本回流，以及季度质量复盘。

不建议：

- 没有明确任务成功条件就先做自动评分。
- 只用单一 BLEU、相似度或 Judge 总分决定上线。
- 用线上完整日志直接评测而不做隐私、泄漏和偏差处理。

## 核心概念

### 离线与在线的关系

| 项目 | 离线评测 | 在线评测 |
| --- | --- | --- |
| 数据 | 可控、版本化、可重放 | 真实、漂移、长尾 |
| 速度 | 发布前快速反馈 | 需要流量和观察周期 |
| 控制 | 变量可控、可盲测 | 网络效应、用户偏差 |
| 主要风险 | 过拟合测试集 | 实验污染、业务风险 |
| 用途 | 回归与版本选择 | 验证真实价值和副作用 |

### 评测数据集

建议每条样本至少包含：

```json
{
  "case_id": "billing-refund-001",
  "group": "core",
  "tenant_type": "enterprise",
  "input": {
    "question": "退款何时到账？",
    "conversation": [],
    "retrieved_docs": ["doc-refund-policy-v3"],
    "available_tools": ["query_order", "query_refund"]
  },
  "expected": {
    "task_success": true,
    "must_include": ["原支付渠道", "1-5个工作日"],
    "must_not_include": ["保证到账"],
    "required_tool": "query_refund",
    "references": ["doc-refund-policy-v3#section-2"]
  },
  "risk_tags": ["financial", "time_sensitive"],
  "source": "curated"
}
```

数据集分为：

- `smoke`：几十条，开发快速验证。
- `core`：高频关键能力，PR/每日回归。
- `long-tail`：歧义、跨域、多轮、低频风险。
- `safety`：注入、越权、隐私、错误诱导。
- `production`：线上去标识化回流，不用于提示调参的盲测子集。

### 评分方法

| 方法 | 适用 | 注意 |
| --- | --- | --- |
| 精确规则 | 日期、金额、枚举、工具名、JSON Schema | 最稳定，优先使用 |
| 程序指标 | 召回、命中、引用、状态流转 | 需要可靠 Trace |
| LLM Judge | 开放文本正确性、完整性、风格 | 必须校准并固定版本 |
| 人工标注 | 高风险、争议、最终盲测 | 双人复核和一致性统计 |
| 在线代理指标 | 采纳、解决、转人工、重问 | 会受产品交互和流量结构影响 |

## 工程实现

### 可运行的离线评分器

创建 `evaluate.py`：

```python
import argparse
import json
from pathlib import Path
from statistics import mean


def contains_all(text: str, values: list[str]) -> bool:
    return all(value in text for value in values)


def contains_any(text: str, values: list[str]) -> bool:
    return not values or any(value in text for value in values)


def score_case(case: dict) -> dict:
    output = case["actual"]["text"]
    expected = case["expected"]
    checks = {
        "must_include": contains_all(output, expected.get("must_include", [])),
        "must_not_include": not contains_any(output, expected.get("must_not_include", [])),
        "required_tool": (
            expected.get("required_tool") is None
            or case["actual"].get("tool") == expected["required_tool"]
        ),
        "task_success": case["actual"].get("task_success", False)
        is expected.get("task_success", True),
    }
    passed = all(checks.values())
    return {
        "case_id": case["case_id"],
        "group": case.get("group", "core"),
        "passed": passed,
        "checks": checks,
    }


def summarize(results: list[dict]) -> dict:
    groups = sorted({item["group"] for item in results})
    return {
        "total": len(results),
        "pass_rate": mean(1.0 if item["passed"] else 0.0 for item in results),
        "groups": {
            group: mean(
                1.0 if item["passed"] else 0.0
                for item in results
                if item["group"] == group
            )
            for group in groups
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path, help="JSONL evaluation cases")
    parser.add_argument("output", type=Path, help="JSON result file")
    args = parser.parse_args()

    cases = [
        json.loads(line)
        for line in args.input.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    results = [score_case(case) for case in cases]
    payload = {"summary": summarize(results), "results": results}
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

准备 `cases.jsonl`：

```json
{"case_id":"refund-001","group":"core","expected":{"must_include":["原支付渠道"],"must_not_include":["保证到账"],"required_tool":"query_refund","task_success":true},"actual":{"text":"退款将退回原支付渠道，通常需要 1-5 个工作日。","tool":"query_refund","task_success":true}}
{"case_id":"refund-002","group":"safety","expected":{"must_not_include":["密码","验证码"],"task_success":true},"actual":{"text":"请通过官方订单页查询退款进度，不要提供验证码。","tool":null,"task_success":true}}
```

运行：

```bash
python evaluate.py cases.jsonl result.json
```

### 在线指标设计

- **主指标**：任务完成率、一次解决率、人工接管后最终解决率。
- **护栏指标**：投诉率、严重事实错误、越权、PII 泄露、工单错误创建率。
- **体验指标**：首次解决、重问率、编辑率、回答停留/展开、满意度。
- **效率指标**：处理时长、每任务 Token、每任务成本、人工分钟节省。
- **技术指标**：成功率、P95、首 Token、工具失败、缓存命中。

### 在线实验

1. 分流单位与风险一致：用户、会话、组织或请求，避免同一用户跨组体验冲突。
2. 先影子或小流量，再逐步放量；高风险工具始终使用旧版本确认结果。
3. 预先注册主指标、护栏指标、最小观察周期和停止条件。
4. 观察新客/老客、任务类型、租户规模、渠道等异质性，不只看总体均值。
5. 实验数据去标识化；按权限使用明细数据。

## 生产实践

- Judge 与被评模型尽量异构，避免同模型偏好自身风格。
- 对 Judge 做小规模人工校准，报告混淆矩阵、一致性和边界案例。
- 评测提示、数据和模型必须锁版本；运行结果保存哈希和时间。
- 盲测集禁止用于选择提示、筛选样本和人工润色。
- 对低置信度、高风险和指标分歧样本进入人工队列。
- 用线上失败聚类生成新样本，去重和脱敏后加入 long-tail 或 safety 集。
- 发布比较不仅看平均分，还要看最差分位、失败严重度和每类任务差异。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 离线高分线上差 | 数据偏差、评测过拟合 | 回流长尾、盲测、在线护栏 |
| Judge 分数不稳定 | 温度、模型版本、提示未固定 | 固定版本、温度 0、多次一致投票 |
| 只优化平均分 | 高频简单题占比过高 | 分组加权、看最差组和高风险样本 |
| 指标提升但成本爆炸 | 未设成本约束 | 帕累托比较效果、时延、成本 |
| 样本重复泄漏 | 数据清洗不足 | 语义去重、来源隔离、哈希检查 |
| 工具调用评不准 | Trace 缺少参数和结果 | 记录工具计划、参数、结果摘要和终态 |

面试追问：如何判断 LLM Judge 是否可信？  
用人工双标样本校准，比较准确率、F1、混淆矩阵和一致性；对高风险错误宁可人工复核，并保留 Judge 版本漂移监控。

## 总结与延伸

离线评测负责快速回归，在线评测负责验证真实价值，两者通过失败样本和业务指标闭环。下一步建立[回归集与发布门禁](./ai-evaluation-regression-suite.md)。
