---
title: RAG 与 Agent 评测
category:
  - LLM
  - AI 评测
tag:
  - RAG
  - Agent
  - 工具评测
  - Trace
description: 分层评估检索、生成、规划、工具调用与多 Agent 协作，定位失败根因。
order: 2
outline: [2, 3]
---

# RAG 与 Agent 评测

## 学习目标

- 将 RAG 端到端错误拆分为数据、检索、上下文、生成和引用问题。
- 对 Agent 评估目标完成、步骤效率、工具契约、状态恢复和风险控制。
- 从 Trace 中提取评测特征，并形成可重放样本。
- 使用确定性规则和 Judge 组合，避免只看答案相似度。

## 适用场景

适用于知识问答、客服 Agent、工单 Agent、分析 Agent、多 Agent 路由以及 MCP 工具调用链路。

## 核心概念

### RAG 分层指标

| 层次 | 指标 | 说明 |
| --- | --- | --- |
| 数据 | 文档覆盖、切块质量、元数据准确率、新鲜度 | 决定上限 |
| 召回 | Recall@K、Hit@K、MRR、nDCG | 是否找到证据 |
| 重排 | nDCG@K、首相关位置、上下文冗余 | 证据是否排前 |
| 生成 | 正确性、完整性、忠实度、引用支持 | 是否正确使用证据 |
| 产品 | 任务成功、拒答正确率、追问率、引用点击 | 是否真正有用 |

常用定义：

- `Recall@K`：标准答案所需文档至少一篇进入前 K 的比例。
- `MRR`：第一篇相关文档排名倒数的平均值。
- `忠实度`：答案中的事实是否能由给定上下文支持。
- `引用命中`：引用片段确实支持对应句子，而非只出现链接。
- `拒答正确率`：证据不足时拒答/追问，证据充分时不误拒。

### Agent 分层指标

| 层次 | 指标 |
| --- | --- |
| 路由 | 意图准确率、跨域误路由率、低置信转人工率 |
| 规划 | 必要步骤召回、无效步骤率、循环率、平均步数 |
| 工具 | 选择准确率、参数正确率、契约成功率、危险工具误调率 |
| 执行 | 任务成功率、状态转移正确率、恢复成功率、超时率 |
| 结果 | 业务正确率、完整性、简洁度、副作用正确率 |
| 风险 | 越权率、注入成功率、重复副作用、不可逆操作错误率 |

### Trace 评测样本

```json
{
  "trace_id": "trace-001",
  "task": "查询订单并创建退款工单",
  "route": "refund_agent",
  "steps": [
    {"type": "model", "name": "intent", "output": "refund"},
    {"type": "tool", "name": "query_order", "args": {"order_id": "A100"}, "ok": true},
    {"type": "model", "name": "slot_fill", "output": {"order_id": "A100"}},
    {"type": "tool", "name": "create_ticket", "args": {"type": "refund"}, "ok": true}
  ],
  "result": {"task_success": true, "side_effects": ["ticket:T200"]},
  "expected": {
    "required_tools": ["query_order", "create_ticket"],
    "forbidden_tools": ["delete_order"],
    "max_steps": 6
  }
}
```

## 工程实现

### 可运行的 Agent Trace 评分器

创建 `score_agent.py`：

```python
import argparse
import json
from pathlib import Path


def score_trace(trace: dict) -> dict:
    steps = trace.get("steps", [])
    tools = [step["name"] for step in steps if step.get("type") == "tool"]
    expected = trace.get("expected", {})
    required = expected.get("required_tools", [])
    forbidden = set(expected.get("forbidden_tools", []))
    failed_tools = [step["name"] for step in steps if step.get("type") == "tool" and not step.get("ok")]

    checks = {
        "task_success": trace.get("result", {}).get("task_success") is True,
        "required_tools": all(tool in tools for tool in required),
        "forbidden_tools": not bool(forbidden.intersection(tools)),
        "step_budget": len(steps) <= expected.get("max_steps", 100),
        "tool_contract": not failed_tools,
    }
    return {
        "trace_id": trace.get("trace_id"),
        "passed": all(checks.values()),
        "checks": checks,
        "tool_count": len(tools),
        "failed_tools": failed_tools,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    traces = [
        json.loads(line)
        for line in args.input.read_text(encoding="utf-8").splitlines()
        if line.strip()
    ]
    results = [score_trace(trace) for trace in traces]
    summary = {
        "total": len(results),
        "passed": sum(item["passed"] for item in results),
        "pass_rate": sum(item["passed"] for item in results) / max(len(results), 1),
    }
    args.output.write_text(
        json.dumps({"summary": summary, "results": results}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

准备 `traces.jsonl`：

```json
{"trace_id":"trace-001","steps":[{"type":"tool","name":"query_order","ok":true},{"type":"tool","name":"create_ticket","ok":true}],"result":{"task_success":true},"expected":{"required_tools":["query_order","create_ticket"],"forbidden_tools":["delete_order"],"max_steps":6}}
```

运行：

```bash
python score_agent.py traces.jsonl trace-result.json
```

### RAG 失败定位矩阵

| 用户失败 | 检索表现 | 证据表现 | 生成表现 | 优先动作 |
| --- | --- | --- | --- | --- |
| 答错 | 未召回 | 无 | 无从判断 | 数据覆盖、Embedding、查询改写 |
| 答错 | 已召回 | 证据正确 | 未利用/推断 | 提示、上下文顺序、截断策略 |
| 答错 | 已召回 | 证据冲突 | 选择错误 | 新鲜度、来源优先级、冲突规则 |
| 引用错 | 已召回 | 文档正确 | 引用定位错 | 细粒度切块、引用对齐 |
| 正确拒答 | 未召回 | 无 | 拒答 | 区分检索失败和知识缺失 |
| 错误拒答 | 已召回 | 足够 | 过度拒答 | 置信阈值、证据充分性判断 |

## 评测设计

### RAG 基准集

- 单文档事实、跨文档综合、冲突版本、时效问题。
- 表格、列表、长文档、OCR 噪声、同名实体、多跳推理。
- 知识库没有答案的负样本，验证拒答和追问。
- 问题改写、口语、错别字、上下文省略和多轮指代。
- 每条样本保存文档 ID、切块 ID、答案依据、知识库版本。

### Agent 基准集

- 正常路径、参数缺失、工具超时、返回空、权限拒绝。
- 多步依赖、中途取消、重复请求、断线恢复。
- 意图相近但路由不同的边界样本。
- 高风险工具的禁止调用、二次确认、最小权限测试。
- 模拟工具用固定响应，保证评测可重复；真实工具只进入受控联调集。

## 生产实践

- 评测前冻结知识库快照，记录文档、切块、Embedding 和索引版本。
- 分别保存召回结果、重排结果、最终上下文、模型答案和引用，不只存最终答案。
- 对 Agent 记录计划、状态、工具参数摘要、工具结果摘要、重试和终止原因。
- 用规则先检测确定性问题，再将困难样本交给 Judge 或人工。
- 线上失败先按根因聚类，再选代表样本；不要把大量近重复样本加入基准集。
- 高风险工具评测必须验证“未调用”和“调用但参数正确”两个方向。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 端到端分数变化无法定位 | 只测最终答案 | 组件级指标 + Trace 归因 |
| Recall 高但答案差 | 切块过长、证据被淹没 | 调整切块、重排、压缩 |
| Agent 平均步数低但失败高 | 鼓励过早结束 | 以任务成功为主，步骤为护栏 |
| 评测结果不稳定 | 工具/知识库实时变化 | Mock 工具、冻结知识快照 |
| Judge 偏爱长答案 | 评分提示只奖励详细 | 明确正确、必要、简洁 |
| 多 Agent 无法定位 | 缺少路由和交接事件 | 记录 Router 决策、Agent 输入输出和父 Trace |

面试追问：RAG 中“引用存在”为什么不等于“引用正确”？  
引用片段可能来自错误文档、过期版本，或不能支持该句。需要验证来源 ID、版本、片段与句子之间的蕴含关系。

## 总结与延伸

RAG 评测要下钻到证据链，Agent 评测要下钻到工具和状态链。将成功规则固化到[回归集与发布门禁](./ai-evaluation-regression-suite.md)。
