---
title: Agent 规划、Tool Calling 与执行控制
category:
  - LLM
  - Agent
tag:
  - Agent
  - Tool Calling
description: 设计可控的 Agent 计划、工具调用、观察、反思和停止条件。
order: 2
outline: [2, 3]
---

# Agent 规划、Tool Calling 与执行控制

## 1. 学习目标

读完后可以把一个开放任务转换为有预算的执行循环，定义工具契约，并处理工具失败、参数错误、循环和提前停止。

## 2. 适用场景

适用于查询多个系统、填写业务对象、执行带副作用的操作和需要动态选择步骤的任务。固定步骤、低容错的流程应使用 [Workflow](../workflow/README.md)。

## 3. 核心概念

### 3.1 Agent 循环

```text
理解目标 → 生成/更新计划 → 选择工具 → 校验参数
       → 执行工具 → 观察结果 → 判断完成
       ↘ 未完成且预算充足 → 回到规划
       ↘ 预算耗尽/无法继续 → 降级或交还人工
```

“思考”应落到结构化状态，如 `goal`、`plan`、`evidence`、`next_action`，不要只保存一段不可审计的自然语言推理。

### 3.2 Tool Calling 契约

一个工具至少包含：稳定名称、用途、输入 Schema、输出 Schema、权限、幂等性、超时、错误码和副作用等级。工具描述写“何时使用/何时不使用”，避免模型把相似工具混用。

| 工具类型 | 示例 | 控制重点 |
| --- | --- | --- |
| 只读查询 | 查订单、查文档 | 数据权限、结果截断 |
| 计算/转换 | 计算税费、格式转换 | 参数范围、确定性 |
| 写操作 | 创建工单、发送消息 | 确认、幂等、审计 |
| 外部服务 | 搜索、调用 MCP | 超时、重试、数据边界 |

### 3.3 计划策略

- **短链计划**：一次只决定下一步，适合环境会变化的任务。
- **预先计划**：一次生成完整步骤，适合输入稳定的分析任务。
- **混合计划**：先给里程碑，再逐步细化；生产 Agent 最常用。

### 3.4 停止与预算

至少设置最大工具调用数、最大 token、最大费用、墙钟超时和错误连续次数。停止条件包括：目标完成、必要信息缺失、工具无可用、预算耗尽、用户取消和安全策略触发。

## 4. 工程实现

下面是一个不依赖框架的最小执行器。`model_fn` 返回下一步动作，`tool` 负责实际业务执行：

```python
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Action:
    kind: str  # "tool" 或 "finish"
    tool_name: str = ""
    arguments: dict = field(default_factory=dict)
    answer: str = ""


def run_agent(
    goal: str,
    model_fn: Callable[[str, list[str]], Action],
    tools: dict[str, Callable[[dict], str]],
    max_steps: int = 4,
) -> dict:
    observations: list[str] = []
    for step in range(max_steps):
        action = model_fn(goal, observations)
        if action.kind == "finish":
            return {"status": "completed", "answer": action.answer, "steps": step + 1}
        if action.kind != "tool" or action.tool_name not in tools:
            observations.append("invalid_action")
            continue
        try:
            observations.append(tools[action.tool_name](action.arguments))
        except Exception as exc:
            observations.append(f"tool_error:{type(exc).__name__}")
    return {"status": "budget_exhausted", "observations": observations}


if __name__ == "__main__":
    calls = iter([Action("tool", "echo", {"text": "ok"}), Action("finish", answer="done")])

    def scripted_model(goal: str, observations: list[str]) -> Action:
        return next(calls)

    print(run_agent("演示", scripted_model, {"echo": lambda a: a["text"]}))
```

真实系统必须在 `tool` 外围加入参数校验、身份传播、超时、幂等键、审计和敏感字段脱敏。

## 5. 生产实践

| 风险 | 控制措施 | 运行信号 |
| --- | --- | --- |
| 工具循环 | 相同动作指纹检测、步数上限 | 重复动作率 |
| 参数错误 | Schema 校验、定向修复一次 | 修复成功率 |
| 外部抖动 | 有限重试 + 指数退避 + 熔断 | 超时率、重试率 |
| 写错数据 | 预览/确认、幂等键、审计日志 | 冲突率、回滚率 |
| 成本失控 | token/费用预算、工具缓存 | 每任务成本 |

## 6. 常见问题

- **Agent 和 Workflow 怎么选？** 步骤可枚举、失败不能自主重试的用 Workflow；步骤依赖实时观察且需要选择工具的才用 Agent。
- **工具数量越多越好吗？** 不是。工具过多会增加选择错误；按意图、权限和领域拆分，并在路由后只暴露候选工具。
- **失败后应该一直重试吗？** 不应该。区分可重试的超时/限流和不可重试的参数/权限错误，超过阈值就降级或人工接管。
- **如何知道 Agent 为什么调用了错误工具？** 记录工具候选、选择结果、参数、工具描述版本和观察结果，而不是只记录最终答案。

## 7. 总结与延伸

Agent 的可靠性来自状态、预算和工具治理。需要共享历史和用户偏好时阅读[意图路由与分层记忆](./ai-agent-memory-and-intent-routing.md)；需要多个执行体协作时阅读[多 Agent 系统设计](./ai-agent-multi-agent-systems.md)。
