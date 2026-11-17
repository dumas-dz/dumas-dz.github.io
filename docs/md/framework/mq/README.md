---
title: 消息队列
category:
  - 框架
  - 中间件
tag:
  - RocketMQ
  - RabbitMQ
  - Kafka
description: RocketMQ、RabbitMQ、Kafka 的消息语义、拓扑和生产实践导航。
order: 20
outline: [2, 3]
---

# 消息队列

消息队列把同步依赖改造成异步事件，但引入了重复、延迟、积压、失败和最终一致性问题。选型先看语义和数据生命周期，再看吞吐和生态。

## 文档

| 文档 | 强项 | 典型场景 | 状态 |
| --- | --- | --- | --- |
| [RocketMQ](./framework-mq-rocketmq-overview.md) | 业务事件、顺序、延迟、事务消息 | 订单、支付、库存事件 | 已完善 |
| [RabbitMQ](./framework-mq-rabbitmq-overview.md) | 灵活路由、任务队列、确认 | 通知、任务分发 | 已完善 |
| [Kafka](./framework-mq-kafka-overview.md) | 分区日志、吞吐、回放 | 日志、数据流、流处理 | 已完善 |

## 对比结论

| 维度 | RocketMQ | RabbitMQ | Kafka |
| --- | --- | --- | --- |
| 路由 | Topic + Tag | Exchange + Binding | Topic + Partition |
| 顺序 | 队列/键局部顺序 | 队列内确认顺序 | 分区键局部顺序 |
| 事务 | 事务消息与回查 | 业务补偿为主 | Kafka 事务，跨库需补偿 |
| 回放 | 保留和轨迹 | 弱 | 强 |
| 最大风险 | 消费堆积、事务悬挂 | 确认/死信配置 | 分区热点、schema |

## 通用检查清单

- 业务事件 ID、业务键、版本、时间和 traceId 是否完整？
- 生产确认、消费 ACK、重试、死信和人工修复是否闭环？
- 业务处理是否幂等，重复消息是否不产生重复副作用？
- 积压、延迟、失败和资源是否有指标、告警和演练？
- Topic/队列的容量、保留、权限和环境隔离是否明确？

状态：已完善。
