---
title: 智能客服 Agent 项目案例
category:
  - LLM
  - 项目案例
tag:
  - 智能客服
  - 多Agent
  - LangGraph
  - 工单闭环
description: 使用 Router、垂直 Agent、RAG、分层记忆和工具调用构建企业智能客服 Agent。
order: 1
outline: [2, 3]
---

# 智能客服 Agent 项目案例

> 案例类型：项目案例模板  
> 可裁剪技术：Python、FastAPI、LangGraph、Milvus、Redis、MySQL、RabbitMQ、Dify

## 学习目标

- 构建意图路由 + 垂直 Agent 的客服架构。
- 通过 RAG、短期/长期记忆、槽位填充完成可验证的服务闭环。
- 对工单创建、退款咨询等工具操作实施权限、确认、幂等和审计。
- 用解决率、转人工、一次解决、错误工单和成本衡量生产价值。

## 业务背景

传统客服依赖人工查询知识库、订单、工单和办公系统，存在检索慢、口径不一致、重复录入和高峰排队问题。目标不是让模型替代所有人工，而是自动处理高频明确任务，复杂和高风险场景提供草稿或转人工。

### 项目定义

```yaml
project:
  name: 企业智能客服 Agent
  users: [终端客户, 在线客服, 工单专员]
  problem: 高频咨询重复查询多系统，处理时长和口径不一致
  target:
    primary: 高频咨询自动解决率提升，工单录入时间下降
    guardrails: [错误工单率, 越权, 事实错误, P95, 单次成本]
  non_goals: [自动退款, 无人工复核的账户变更, 医疗/法律结论]
```

## 适用场景

- 订单、物流、退款进度、会员权益、产品使用和内部客服知识问答。
- 需要多轮收集订单号、问题类型、期望时间等槽位。
- 需要查询 Java/微服务业务 API 并创建工单、查询进度或分派部门。
- 需要结合历史工单、用户画像和当前会话实现个性化答复。

不适用：资金自动执行、账户权限变更、法律/医疗结论、完全无人工兜底的高风险投诉。

## 架构设计

```text
客户端/客服工作台
  -> API Gateway（认证、租户、限流）
  -> Python AI 服务（FastAPI/SSE/幂等/审计）
     -> LangGraph Router
        -> FAQ Agent（RAG + 引用）
        -> Order Agent（订单工具 + 槽位）
        -> Refund Agent（退款查询 + 风险确认）
        -> Ticket Agent（创建/更新工单）
        -> Escalation Agent（人工摘要）
     -> 分层记忆
        -> Redis：短期会话、槽位、工具状态
        -> MySQL/向量库：长期偏好、历史摘要
     -> 业务工具
        -> 订单 API、退款 API、工单 API、OA/WM
     -> Milvus：历史工单与知识文档
  -> SSE/任务事件、会话库、审计库、监控
```

### Router + 垂直 Agent

Router 只做高置信路由和边界识别，不直接执行写操作。垂直 Agent 拥有独立 Prompt、工具、状态、评测和权限。

| Agent | 输入 | 允许工具 | 失败策略 |
| --- | --- | --- | --- |
| FAQ | 咨询问题、知识引用 | 知识检索 | 引用不足时追问/转人工 |
| Order | 订单问题、槽位 | 查询订单 | 无权限或找不到时统一错误 |
| Refund | 退款问题、订单状态 | 查询退款、创建工单 | 不自动退款，高风险确认 |
| Ticket | 已确认工单信息 | 创建/更新工单 | 幂等创建，失败保留草稿 |
| Escalation | 会话摘要、用户诉求 | 写入人工队列 | 不泄露内部提示和敏感字段 |

## 数据与接口

### 会话状态

```json
{
  "session_id": "s-001",
  "tenant_id": "tenant-001",
  "route": "refund",
  "slots": {
    "order_id": "A-100",
    "issue_type": "refund_progress",
    "contact_channel": "app"
  },
  "turns": 4,
  "risk_level": "medium",
  "pending_confirmation": "create_ticket",
  "idempotency_key": "ticket-s-001-A-100",
  "versions": {
    "prompt": "refund-agent-v4",
    "knowledge": "kb-2026-11-01",
    "tool_contract": "ticket-v2"
  }
}
```

### 工单创建契约

```json
{
  "operation": "create_service_ticket",
  "idempotency_key": "ticket-s-001-A-100",
  "actor": {"user_id": "u-001", "tenant_id": "tenant-001"},
  "payload": {
    "order_id": "A-100",
    "category": "refund_progress",
    "summary": "用户查询退款进度",
    "priority": "normal",
    "source": "ai_agent"
  },
  "trace_id": "trace-001"
}
```

下游必须根据 `idempotency_key` 保证唯一创建。返回 `ticket_id/status/version`，AI 服务保存工具结果摘要和副作用 ID。

## 实施计划

| 里程碑 | 工作内容 | 出口条件 |
| --- | --- | --- |
| M1 现状与数据 | 问题分类、历史工单、知识盘点、基线 | Top 任务覆盖，数据授权完成 |
| M2 FAQ Agent | RAG、引用、拒答、离线评测 | 核心集达到目标，事实性可追溯 |
| M3 Router/多 Agent | 意图路由、状态、槽位、转人工 | 路由准确率和失败路径达标 |
| M4 工具闭环 | 订单/工单 API、确认、幂等、审计 | 重复请求不重复建单 |
| M5 生产化 | SSE、队列、监控、压测、安全红队 | 门禁、SLO、回滚演练通过 |
| M6 灰度运营 | 影子、小流量、Bad Case、成本优化 | 达到业务目标并稳定运行 |

## 评测与验收

### 评测集

- FAQ：单文档、跨文档、知识缺失、冲突版本、多轮指代。
- 路由：退款/物流/投诉/账户/闲聊等边界意图。
- 槽位：订单号、时间、问题类型、缺失槽位、错误格式。
- 工具：查询空、超时、403、重复创建、参数错误、下游成功。
- 安全：诱导越权、索要隐私、注入文档、伪造订单、危险指令。
- 对话：打断、切换意图、取消、长时间挂起、重复发送。

### 验收指标

| 类别 | 指标示例 |
| --- | --- |
| 业务 | 自动解决率、一次解决率、人工处理分钟下降 |
| 质量 | 核心集通过率、引用支持率、错误工单率 |
| Agent | 路由准确率、槽位完整率、工具成功率、循环率 |
| 安全 | 高危注入零通过、越权零通过、PII 泄露零通过 |
| 性能 | 首 Token、P95、SSE 中断率、工具超时率 |
| 成本 | Token/会话、工具调用/会话、单位成功会话成本 |

## 生产实践

- 先从 FAQ 和只读查询上线，再开放创建工单，最后考虑更复杂写操作。
- 工具返回的用户数据只保留必要字段，长期记忆使用摘要和令牌化 ID。
- 用户纠正 Agent 时保存“正确目标/错误路径”样本，进入回归集。
- Router 置信度低时追问一次，再转人工；不要强迫模型在所有意图中选择。
- 对客户承诺、时间、金额、政策和权益设置事实来源与引用要求。
- 人工接管需要完整会话摘要、用户目标、已尝试步骤、槽位和工具副作用。

## 常见坑

| 坑 | 后果 | 避免方法 |
| --- | --- | --- |
| 一个巨型 Prompt 承担所有业务 | 维护难、互相干扰 | Router + 垂直 Agent、独立评测 |
| 记忆无限拼接 | 成本高、隐私泄露、上下文污染 | 分层摘要、TTL、最小化 |
| 工具由模型决定身份 | 越权 | 下游按真实主体重鉴权 |
| 先建单再持久化 | 重试重复副作用 | 幂等键、事务/Outbox |
| 只测最终答案 | 无法定位 RAG/Agent 失败 | 组件指标和 Trace |
| 高峰同步调用所有下游 | 雪崩 | 超时、并发池、熔断、降级 |
| 把人工转接当失败 | 指标失真 | 区分合理升级和 Agent 失败 |

## 总结与延伸

智能客服的关键是任务闭环、可控副作用和可解释升级。工程基线参考[AI 工程化](../engineering/README.md)，上线证据参考[AI 评测](../evaluation/README.md)，工具接入可采用[Dify + MCP 项目案例](./ai-project-dify-mcp.md)。
