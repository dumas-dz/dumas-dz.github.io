---
title: LangGraph 状态图实践
category:
  - LLM
  - Workflow
tag:
  - LangGraph
  - 状态图
description: 用 LangGraph 构建节点、条件边、检查点和可恢复的 AI 工作流。
order: 3
outline: [2, 3]
---

# LangGraph 状态图实践

> 适用范围：示例基于 LangGraph 的 `StateGraph`、`START`、`END` 和内存 Checkpointer API。不同版本的导入路径可能变化，升级前运行官方兼容性检查。

## 1. 学习目标

读完后可以用 TypedDict 定义共享状态，把业务步骤编译成状态图，并理解条件边、线程检查点、中断和恢复。

## 2. 适用场景

适用于需要分支、循环、人工审批、持久化和流式事件的 AI 流程。简单同步请求直接调用模型即可，不必引入图框架。

## 3. 核心概念

### 3.1 状态图模型

```text
START → validate → extract → should_review?
                     ↑          ├─ yes → human_review → apply
                     └─ retry ──┘       └─ no  ────────→ apply → END
```

- **State**：节点共享的可序列化数据。
- **Node**：执行一个业务步骤并返回状态增量。
- **Conditional Edge**：根据状态选择下一节点。
- **Checkpointer**：保存每个步骤后的状态，支持同一线程恢复。
- **Interrupt**：把流程暂停在人工节点，外部决定后继续。

### 3.2 与普通函数调用的区别

LangGraph 的价值是显式状态、可恢复执行和事件流，不是“自动让模型更聪明”。节点内部仍应做超时、校验和幂等。

## 4. 工程实现

安装依赖：

```bash
python -m pip install langgraph
```

以下程序可直接运行，展示节点、条件边和内存检查点：

```python
from typing import TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph


class OrderState(TypedDict, total=False):
    text: str
    amount: float
    needs_review: bool
    result: str


def extract(state: OrderState) -> OrderState:
    amount = 120.0 if "120" in state["text"] else 0.0
    return {"amount": amount, "needs_review": amount >= 100.0}


def review(state: OrderState) -> OrderState:
    return {"result": f"reviewed:{state['amount']}"}


def auto_apply(state: OrderState) -> OrderState:
    return {"result": f"applied:{state['amount']}"}


def route_review(state: OrderState) -> str:
    return "review" if state["needs_review"] else "apply"


builder = StateGraph(OrderState)
builder.add_node("extract", extract)
builder.add_node("review", review)
builder.add_node("apply", auto_apply)
builder.add_edge(START, "extract")
builder.add_conditional_edges("extract", route_review, {
    "review": "review",
    "apply": "apply",
})
builder.add_edge("review", END)
builder.add_edge("apply", END)
graph = builder.compile(checkpointer=MemorySaver())


if __name__ == "__main__":
    config = {"configurable": {"thread_id": "order-1"}}
    print(graph.invoke({"text": "金额为 120 元"}, config))
```

生产环境应把 `MemorySaver` 替换为持久化 Checkpointer，并把 `thread_id` 绑定到业务幂等键。

## 5. 生产实践

- 节点函数输入和返回都限定字段，避免把日志或敏感数据写入共享状态。
- 长任务把模型、工具和数据库调用放在节点外围，统一处理超时与重试。
- 通过事件流向前端发送节点开始、等待人工、失败和完成事件。
- 状态迁移前做 Schema 校验；恢复时验证流程版本和数据版本兼容。

## 6. 常见问题

- **条件边返回未知节点名怎么办？** 把路由函数的返回值限制为枚举，并在编译前做穷举测试。
- **内存 Checkpointer 能用于生产吗？** 不能保证进程重启后恢复；需要持久化实现和一致的线程标识。
- **节点可以修改传入的 State 字典吗？** 应返回状态增量，避免共享引用和非确定性副作用。
- **如何做人工审批？** 在审批节点中断，持久化任务和凭据；回调只提交受权限保护的决定。

## 7. 总结与延伸

LangGraph 把状态机落到可运行代码。建模原则见[AI Workflow 状态机设计](./ai-workflow-state-machine.md)，幂等、重试和补偿见[可靠性与常用模式](./ai-workflow-patterns-and-resilience.md)。
