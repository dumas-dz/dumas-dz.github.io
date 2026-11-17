---
title: AI Workflow 状态机设计
category:
  - LLM
  - Workflow
tag:
  - 状态机
  - 工作流建模
description: 用显式状态、事件、守卫和终态设计可恢复的 AI 业务流程。
order: 2
outline: [2, 3]
---

# AI Workflow 状态机设计

## 1. 学习目标

读完后可以把 AI 应用流程建模为有限状态机，定义合法转移、超时、人工节点、失败终态和版本迁移。

## 2. 适用场景

适用于文档审批、数据抽取、RAG 摄取、Agent 任务生命周期和任何需要续跑、审计或人工介入的流程。

## 3. 核心概念

### 3.1 状态模型

```text
状态 = 业务阶段 + 运行数据 + 版本 + 时间戳
事件 = 外部回调 / 节点结果 / 超时 / 人工决定
转移 = 当前状态 + 事件 + 守卫条件 → 下一状态
动作 = 发消息、调工具、写数据库、创建检查点
```

状态名称描述业务事实，如 `awaiting_review`，不要使用 `step3`。失败也应成为显式状态，而不是把异常留在内存里。

### 3.2 状态与事件表

| 当前状态 | 事件 | 守卫 | 下一状态 | 动作 |
| --- | --- | --- | --- | --- |
| `received` | `validated` | 输入 Schema 合法 | `extracting` | 启动抽取 |
| `extracting` | `extraction_ok` | 置信度达阈值 | `awaiting_review` | 保存结果 |
| `extracting` | `failed` | 重试未耗尽 | `extracting` | 延迟重试 |
| `awaiting_review` | `approved` | 审批人有权限 | `completed` | 写业务系统 |
| `awaiting_review` | `rejected` | - | `failed` | 通知申请人 |
| 任意活动态 | `timeout` | 截止时间已过 | `expired` | 释放资源 |

### 3.3 转移约束

- 一个事件只能通过确定的守卫进入一个下一状态；多个条件命中要报建模错误。
- 写操作放在转移动作中并带幂等键，不能因为重放事件重复执行。
- 状态更新和事件消费要保证“至少一次执行、恰好一次业务效果”。
- 状态图修改要做兼容：新增状态可接受旧状态，删除字段要先停止旧流量。

## 4. 工程实现

下面的 Python 状态机只依赖标准库，并拒绝非法转移：

```python
from dataclasses import dataclass, field


@dataclass
class Workflow:
    state: str = "received"
    history: list[tuple[str, str]] = field(default_factory=list)
    transitions: dict[tuple[str, str], str] = field(default_factory=dict)

    def add_transition(self, source: str, event: str, target: str) -> None:
        key = (source, event)
        if key in self.transitions:
            raise ValueError(f"duplicate transition: {key}")
        self.transitions[key] = target

    def send(self, event: str) -> str:
        key = (self.state, event)
        if key not in self.transitions:
            raise ValueError(f"illegal transition: {key}")
        previous, self.state = self.state, self.transitions[key]
        self.history.append((previous, event))
        return self.state


if __name__ == "__main__":
    flow = Workflow(transitions={
        ("received", "validated"): "extracting",
        ("extracting", "extraction_ok"): "awaiting_review",
        ("awaiting_review", "approved"): "completed",
    })
    for event in ["validated", "extraction_ok", "approved"]:
        print(event, flow.send(event))
```

生产实现还要持久化状态、事件 ID、版本、幂等键和错误详情，支持从检查点继续。

## 5. 生产实践

| 目标 | 设计 |
| --- | --- |
| 可恢复 | 每次转移前持久化，重启后从检查点继续 |
| 可重放 | 事件带唯一 ID，动作写结果摘要 |
| 可观测 | 记录状态时长、转移次数、失败原因 |
| 可演进 | 图版本化，运行实例绑定创建时版本 |
| 可审计 | 人工操作记录操作者、时间、理由 |

## 6. 常见问题

- **为什么不能只用布尔变量表示进度？** 多个布尔变量会产生非法组合，难以处理超时、重试和并发事件。
- **模型返回不确定怎么办？** 用 `needs_review` 或 `clarification_required` 等显式状态承接，不要强行推进。
- **节点执行成功但状态写失败怎么办？** 节点必须幂等，恢复后允许重新执行；外部写操作记录幂等键和响应。
- **如何处理并行分支？** 用 join 状态等待所有必要分支，设置超时和部分失败策略，见[可靠性与常用模式](./ai-workflow-patterns-and-resilience.md)。

## 7. 总结与延伸

状态机让流程从“代码里隐藏的控制流”变成可审计资产。框架实现见[LangGraph 状态图实践](./ai-workflow-langgraph.md)，生产故障处理见[可靠性与常用模式](./ai-workflow-patterns-and-resilience.md)。
