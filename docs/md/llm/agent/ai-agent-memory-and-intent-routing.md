---
title: 意图路由与分层记忆
category:
  - LLM
  - Agent
tag:
  - 意图路由
  - 记忆系统
description: 用可解释路由和分层记忆降低 Agent 延迟、工具误选和上下文膨胀。
order: 3
outline: [2, 3]
---

# 意图路由与分层记忆

## 1. 学习目标

读完后可以设计“规则优先、模型兜底”的意图路由，并区分工作记忆、会话记忆、用户记忆和外部知识。

## 2. 适用场景

适用于一个入口接收多种任务、需要接续上下文、需要记住用户偏好或项目约束的 Agent。RAG 文档知识由 [RAG](../rag/README.md) 管理，不应直接塞进长期记忆。

## 3. 核心概念

### 3.1 分层记忆

| 层 | 生命周期 | 示例 | 写入条件 |
| --- | --- | --- | --- |
| 工作记忆 | 当前执行 | 目标、计划、工具结果 | Agent 状态变更 |
| 会话记忆 | 单次会话 | 对话历史、未完成事项 | 会话结束或滚动摘要 |
| 用户记忆 | 跨会话 | 语言、格式偏好、授权范围 | 明确确认或稳定规则 |
| 组织知识 | 长期 | 制度、产品事实 | 走文档和权限流程 |

记忆不是数据库的替代品。事实应优先从权威系统实时查询，记忆只保存“去哪里查、如何处理”的稳定信息。

### 3.2 路由流程

```text
输入归一化 → 规则/高置信分类 → 候选 Agent 与工具
          ↘ 低置信/冲突 → 用小型模型分类或向用户澄清
          ↘ 越权/敏感 → 拒绝并记录原因
```

路由应输出 `intent`、`confidence`、`required_slots`、`policy_decision` 和 `fallback`，便于审计和自动化测试。

### 3.3 写入与遗忘

- 写前分类：事实、偏好、任务状态、临时内容。
- 每条记忆有来源、置信度、创建时间、过期时间和可见范围。
- 冲突时保留新版本但不静默覆盖；必要时要求用户确认。
- 会话结束时压缩为摘要和待办，删除无关原文。

## 4. 工程实现

下面的路由器采用规则打分，适合在模型调用前拦截明确意图：

```python
from dataclasses import dataclass


@dataclass
class Route:
    intent: str
    confidence: float
    fallback: str


def route_text(text: str) -> Route:
    rules = {
        "search_knowledge": ["文档", "规范", "在哪里"],
        "query_order": ["订单", "物流", "退款"],
        "write_action": ["创建", "发送", "修改"],
    }
    scores = {intent: sum(word in text for word in words) for intent, words in rules.items()}
    intent, score = max(scores.items(), key=lambda item: item[1])
    if score == 0:
        return Route("clarify", 0.0, "请补充任务类型")
    return Route(intent, min(score / 2, 1.0), "general_agent")


if __name__ == "__main__":
    print(route_text("帮我查订单物流"))
```

生产路由还应使用语言、租户、权限和历史失败率作为特征；低置信结果不能直接触发写操作。

## 5. 生产实践

| 问题 | 做法 | 检查指标 |
| --- | --- | --- |
| 路由误判 | 规则优先、混淆集评测、可达澄清 | 路由准确率、澄清率 |
| 记忆污染 | 来源、置信度、过期、冲突保留 | 陈旧记忆率、冲突率 |
| 上下文膨胀 | 分层检索、摘要、字段投影 | 平均输入 token |
| 隐私泄露 | 最小可见范围、脱敏、删除流程 | 越权访问率 |

## 6. 常见问题

- **应该把全部聊天记录变成长期记忆吗？** 不应该。大量内容是临时任务噪声，会增加检索错误和隐私风险。
- **规则路由和模型路由如何组合？** 明确关键词、白名单和权限先用规则；剩余样本用模型分类并保留置信度。
- **记忆写入失败会影响回答吗？** 应把记忆写入设计成异步或降级动作，不能阻塞用户当前任务；但必须记录丢失。
- **如何处理用户更正？** 写入带来源的更正记录，立即更新会话状态，再异步更新长期记忆。

## 7. 总结与延伸

路由负责“交给谁”，记忆负责“保留什么”。执行控制见[Agent 规划、Tool Calling 与执行控制](./ai-agent-planning-and-execution.md)，跨 Agent 的共享状态见[多 Agent 系统设计](./ai-agent-multi-agent-systems.md)。
