---
title: 分布式一致性、缓存、事务与幂等
category:
  - 架构
  - 分布式
tag:
  - 一致性
  - 缓存
  - 分布式事务
  - 幂等
description: 掌握分布式一致性、缓存、事务和幂等的模型与模式，设计可恢复的跨服务数据操作。
order: 20
outline: [2, 3]
---

# 分布式一致性、缓存、事务与幂等

## 1. 学习目标

学习后应能区分强一致、最终一致和会话一致，选择合适的共识、缓存、事务与幂等方案，设计跨数据库/服务/MQ 的正确性边界，并用补偿、对账和监控处理部分失败。示例以 Java/关系库/Redis/MQ 为背景。

## 2. 适用场景

这些主题适用于下单扣库存、支付状态、分布式锁、缓存回源、消息投递、跨服务数据同步和多数据中心读写。它们不适用于用复杂分布式事务掩盖业务边界不清；应先尽可能把一致性约束收敛到一个数据库事务或一个聚合边界。

## 3. 核心原理

### 3.1 一致性模型

CAP 讨论网络分区下的一致性和可用性权衡，PACELC 进一步考虑分区外的延迟。强一致要求读取能反映约定的最新写入；最终一致允许短暂不一致但要求收敛；会话一致保证单用户因果顺序，常通过单调读、读己之写和因果 token 实现。

共识算法（Paxos、Raft）用于复制状态、选主和线性化日志，但不等于所有业务读写都线性化。应用需要定义一致性要求、失效窗口、冲突解决和用户体验。

### 3.2 缓存一致性

缓存是数据副本，必须有事实源。常见模式是 Cache-Aside：读未命中回源并填缓存，更新数据库后删除缓存；Write-Through/Write-Behind 适合特定访问模式但要承担同步成本。缓存一致性通常采用“数据库优先 + 失效 + TTL + 重建”，并接受秒级旧值或用版本号/事件保证读己之写。

### 3.3 分布式事务

- **2PC/XA**：强原子性但协调者、锁持有时间和可用性成本高。
- **TCC**：Try/Confirm/Cancel 三阶段，业务需要预留、确认和撤销接口。
- **Saga**：每步本地事务 + 前进补偿，适合长流程但补偿逻辑复杂。
- **本地消息表/Outbox**：业务事务内写事件，异步可靠发布，适合最终一致。
- **最大努力通知 + 对账**：明确可接受损失，靠校验和人工/自动修复闭环。

不要跨数据库事务包裹 RPC、MQ、文件和人工审批。事务边界应短，外部副作用用事件、幂等和补偿表达。

### 3.4 幂等

幂等要求同一请求执行多次与一次效果相同。实现通常组合请求 ID、唯一约束、状态机条件更新、版本号、去重表和业务结果缓存。幂等键必须覆盖业务操作意图，能区分“重试”与“新请求”；返回结果应能告诉调用方首次成功、重复成功或状态冲突。

## 4. 技术决策与对比

| 方案 | 一致性 | 可用性/延迟 | 适用 | 主要风险 |
| --- | --- | --- | --- | --- |
| 单库事务 | 强 | 低延迟、边界清晰 | 聚合内状态变更 | 扩展有限 |
| 2PC/XA | 强 | 延迟高、可用性受协调者影响 | 短事务、严格原子 | 锁、阻塞、运维复杂 |
| TCC | 最终/准强 | 资源预留成本 | 资金、库存预留 | Cancel/空回滚/悬挂 |
| Saga | 最终 | 流程长但可扩展 | 跨服务长流程 | 补偿不完美 |
| Outbox + MQ | 最终 | 吞吐高、异步 | 事件、解耦 | 重复、积压、延迟 |
| 缓存 | 可配置 | 低延迟 | 读多、可容忍旧值 | 穿透、雪崩、失效 |

## 5. 工程实现

### 5.1 幂等条件更新

```sql
CREATE TABLE request_deduplication (
  request_id VARCHAR(64) PRIMARY KEY,
  business_key VARCHAR(128) NOT NULL,
  result_code VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

START TRANSACTION;

UPDATE inventory
SET stock = stock - 1
WHERE sku = 'SKU-1001' AND stock >= 1;

INSERT INTO request_deduplication (request_id, business_key, result_code)
VALUES ('req-20261116-001', 'order-20261116-001', 'SUCCESS')
ON DUPLICATE KEY UPDATE result_code = result_code;

COMMIT;
```

调用方先查询 `request_id`：已存在则返回保存的结果；唯一键冲突需要区分重复请求与真正并发冲突。更复杂的业务可用状态机：

```sql
UPDATE app_order
SET status = 'PAID', version = version + 1
WHERE order_no = 'ORD-1' AND status = 'PENDING';
```

### 5.2 Outbox 发布

```text
1. 业务事务：更新订单状态 + 写 outbox(event_id, topic, payload, status=NEW)
2. 发布器：按 event_id 唯一键读取 NEW 事件并发送 MQ
3. MQ 消费者：按 event_id 幂等处理，成功后写 processed_message
4. 对账任务：比较业务状态、outbox 和 processed_message，重试/告警
```

发布器崩溃、MQ 重复和消费者失败都要能恢复；不要只用“发消息成功”标记事件完成。

### 5.3 缓存读取

```text
value = cache.get(key)
if value is missing:
    value = database.read(key)
    if value is missing:
        cache.set(key, NULL_MARKER, short_ttl)
    else:
        cache.set(key, value, ttl + random_jitter)
return value
```

删除缓存失败时通过重试队列、订阅数据库变更或 TTL 收敛，并对热点键做互斥回填。

## 6. 生产实践

- 为每条链路定义数据一致性等级、最大陈旧时间、冲突解决和用户可见行为。
- 事务、消息、HTTP、缓存和定时任务都设置超时、重试上限、退避和熔断。
- 关键流程有业务幂等键、版本/状态条件、唯一索引和结果查询。
- 引入对账：数据库状态、消息事件、第三方结果按时间和业务键校验。
- 监控重复请求、失败重试、补偿、死信、缓存命中率、回源、锁等待、复制延迟和事务时长。
- 为人工修复提供只读查询、受控重放、审计和双人复核，不让运维直接改数据。
- 事故演练覆盖 MQ 丢失/重复、Redis 故障、数据库主从切换、消息积压和第三方超时。

## 7. 常见坑与排查

1. **把缓存当事实源**：Redis 删除、过期或丢失后无法恢复，必须保留数据库事实源。
2. **先更新缓存再更新数据库**：数据库失败会留下幽灵缓存，优先提交事实数据再失效缓存。
3. **TCC 悬挂/空回滚**：Try 未到达或已回滚后 Cancel 仍执行，需要状态表和幂等检查。
4. **Saga 补偿副作用**：退款、取消库存和通知自身也可能重复，补偿同样要幂等。
5. **只做发送不做对账**：消息、数据库和第三方结果无法闭环，故障时无法判断真实状态。
6. **请求 ID 覆盖不全**：网络重试生成新 ID，或两个不同操作复用 ID，键要表达业务意图和参数摘要。
7. **跨服务长事务**：数据库锁持有到远程调用结束，放大超时和死锁。
8. **缓存雪崩/击穿/穿透**：TTL 无抖动、热点键失效、不存在数据回源，分别使用随机 TTL、互斥和空值/布隆。
9. **顺序假设错误**：MQ 重复、乱序和重平衡打破顺序，使用版本号、状态机和乱序容忍。
10. **以日志代替状态**：只打印失败无法恢复，要落失败表、重试表或死信并提供修复入口。

## 8. 总结与关联阅读

分布式正确性不是选一个事务框架，而是明确数据边界、幂等、补偿和恢复。强一致要付出延迟与可用性成本，最终一致必须有收敛、对账和用户可解释的状态。

关联阅读：[架构知识体系](../basis/arch-basis-overview.md)、[微服务系统与治理](../microservice/arch-microservice-overview.md)、[RocketMQ](../../framework/mq/framework-mq-rocketmq-overview.md)、[Redis](../../db/nosql/db-nosql-redis-overview.md)、[测试](../../dev-spec/dev-spec-testing.md)。
