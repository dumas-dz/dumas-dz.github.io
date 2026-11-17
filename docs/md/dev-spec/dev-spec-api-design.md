---
title: API 设计规范
category:
  - 工程规范
tag:
  - API
  - REST
  - RPC
  - 接口设计
description: 设计资源清晰、错误可判定、兼容可演进并支持幂等和分页的 HTTP/RPC 接口。
order: 60
outline: [2, 3]
---

# API 设计规范

## 1. 学习目标

- 根据调用方、业务动作和数据边界选择 REST、RPC 或异步事件契约。
- 定义稳定资源、参数、状态码、错误码、幂等、分页和版本策略。
- 用示例、契约测试和兼容规则防止服务端与客户端漂移。
- 识别安全、限流、超时、重试和可观测性要求。

## 2. 适用场景

适用于浏览器、移动端、第三方开放平台、内部服务 RPC、Webhook 和消息契约。REST 适合资源生命周期和 HTTP 语义；RPC 适合明确的内部动作和高吞吐调用；异步事件适合解耦、削峰和最终一致。可以组合使用，但每条契约都应独立定义错误、超时和幂等。

## 3. 设计原则

- **以调用方为中心**：接口表达稳定业务能力，不暴露数据库表、内部类名或框架结构。
- **语义明确**：方法、路径、状态码和错误码含义一致，客户端不需要解析自由文本判断结果。
- **契约最小**：只返回调用方需要的数据；新增可选字段通常比改变字段含义更安全。
- **失败可恢复**：明确哪些错误可重试、哪些需要用户修改、哪些必须人工处理。
- **默认安全**：认证、授权、输入限制、敏感字段、审计和防重放从设计开始。
- **可演进**：先增加兼容能力并观察采用率，再迁移客户端，最后删除旧版本。

## 4. HTTP 接口示例

资源设计示例：

```http
POST /v1/orders
Authorization: Bearer <ACCESS_TOKEN>
Idempotency-Key: 8bb9f38c-7a8b-4f8f-9f2b-9e2208f22cc7
Content-Type: application/json

{
  "customerId": "c_123",
  "items": [
    {"skuId": "sku_456", "quantity": 2}
  ],
  "remark": "please deliver after 18:00"
}
```

成功响应：

```http
HTTP/1.1 201 Created
Location: /v1/orders/o_789
Content-Type: application/json

{
  "orderId": "o_789",
  "status": "CREATED",
  "createdAt": "2026-11-17T10:30:00Z"
}
```

错误响应必须有稳定错误码：

```json
{
  "error": {
    "code": "INVALID_ORDER_ITEMS",
    "message": "Order items must contain at least one valid item.",
    "requestId": "req_01H...",
    "details": [
      {"field": "items[0].quantity", "reason": "must be greater than zero"}
    ]
  }
}
```

### 4.1 状态与错误建议

| 场景 | HTTP 状态 | 客户端行为 |
| --- | --- | --- |
| 创建成功 | 201 | 使用 Location/资源 ID 后续查询 |
| 请求成功且无内容 | 204 | 不解析响应体 |
| 参数或业务规则错误 | 400/422 | 展示可操作信息，不自动重试 |
| 未认证 | 401 | 重新认证 |
| 已认证但无权限 | 403 | 不因重试改变结果 |
| 资源不存在 | 404 | 按业务处理 |
| 幂等键冲突或版本冲突 | 409 | 查询最新状态或使用新键 |
| 限流 | 429 | 遵循 `Retry-After`，有预算重试 |
| 服务端故障 | 500/503 | 有限重试/降级，记录 requestId |

不要把所有失败都返回 200 再用 `success: false` 表达；也不要只给可变的中文 message 让客户端猜测。

## 5. 最小实践：定义分页与幂等

列表接口使用稳定排序键和游标，避免深 offset 在数据变化时重复/漏项：

```http
GET /v1/orders?customerId=c_123&limit=50&cursor=eyJpZCI6Im9fNzg5In0
Accept: application/json
```

```json
{
  "items": [
    {"orderId": "o_789", "status": "CREATED"}
  ],
  "nextCursor": "eyJpZCI6Im9fNzkwIn0",
  "hasMore": true
}
```

创建、支付、确认等写操作支持 `Idempotency-Key`：服务端保存“键 + 请求摘要 + 最终结果”，同一键和同一请求返回首次结果；同一键不同请求应返回冲突。数据库唯一约束是最后防线，不只依赖内存去重。

## 6. 接口评审检查表

- [ ] 调用方、业务动作、资源边界和非目标是否明确？
- [ ] 路径、方法、字段命名、枚举和时间格式是否一致？
- [ ] 认证、授权、租户隔离、敏感字段和审计是否定义？
- [ ] 请求大小、字符串长度、分页上限、速率和并发是否有限制？
- [ ] 成功状态、错误码、可重试性和本地化策略是否明确？
- [ ] 写操作是否需要幂等键、版本号或条件更新？
- [ ] 超时、取消、重试预算、限流和降级是否约定？
- [ ] 响应是否避免泄露内部异常、SQL、堆栈和第三方密钥？
- [ ] 新字段/枚举是否按兼容策略演进，客户端是否处理未知值？
- [ ] 是否有请求/响应示例、契约测试、监控和变更日志？

## 7. 常见坑

1. **把数据库结构当 API**：表结构调整会直接破坏所有客户端。
2. **错误全靠文本**：客户端无法稳定判断重试、跳过或提示用户。
3. **POST 重复执行**：网络超时后客户端重试造成重复订单、扣款或消息。
4. **分页不稳定**：数据持续写入时 offset 翻页漏项或重复。
5. **枚举封闭**：服务端新增枚举值导致旧客户端崩溃，应允许安全处理未知值。
6. **过度版本化**：每个字段变化都开 `/v2` 会增加长期维护成本。
7. **响应过大**：一次返回全量关联对象，延迟和内存不可控。
8. **忽略契约测试**：只有服务端单测通过，客户端实际字段/状态码已经不兼容。

## 8. 总结与关联阅读

API 是系统之间长期承诺。清晰资源、确定错误、幂等写入、稳定分页、安全边界和兼容演进，比追求“短路径”更重要。

关联阅读：[工程规范与交付流程](./dev-spec-engineering-spec.md)、[测试工程](./dev-spec-testing.md)、[gRPC](../framework/rpc/framework-rpc-grpc-overview.md)、[微服务治理](../arch/microservice/arch-microservice-overview.md)、[Web3 DApp 架构](../web3/09-dapp-architecture.md)。
