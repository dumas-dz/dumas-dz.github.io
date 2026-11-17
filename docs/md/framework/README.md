---
title: 框架与中间件
category:
  - 框架
  - 中间件
tag:
  - ORM
  - MQ
  - RPC
description: MyBatis、消息队列、RPC、Netty 与 ShardingSphere 的工程能力地图。
order: 20
outline: [2, 3]
---

# 框架与中间件

框架解决开发效率，中间件解决跨进程的可靠性、吞吐和治理。这里按持久层、消息、网络/RPC 和数据扩展组织，重点是原理、选型、故障边界和生产实践。

## 学习路线

1. 持久层：[MyBatis 详解](./orm/framework-orm-mybatis-overview.md)，掌握 SQL 映射、事务和 N+1。
2. 异步解耦：[RocketMQ](./mq/framework-mq-rocketmq-overview.md)、[RabbitMQ](./mq/framework-mq-rabbitmq-overview.md)、[Kafka](./mq/framework-mq-kafka-overview.md)。
3. 远程调用：[Dubbo](./rpc/framework-rpc-dubbo-overview.md)、[gRPC](./rpc/framework-rpc-grpc-overview.md)。
4. 网络基础：[Netty 详解](./netty/framework-netty-overview.md)。
5. 数据扩展：[ShardingSphere 详解](./ds-sharding/framework-ds-sharding-sphere-overview.md)。
6. 结合[架构与分布式](../arch/README.md)完成幂等、事务、缓存、限流和可观测性。

## 知识地图

| 领域 | 文档 | 核心问题 | 状态 |
| --- | --- | --- | --- |
| ORM | [MyBatis](./orm/README.md) | SQL 如何稳定映射到对象 | 已完善 |
| 消息队列 | [MQ](./mq/README.md) | 如何解耦、削峰和最终一致 | 已完善 |
| RPC | [RPC](./rpc/README.md) | 如何控制契约、超时和治理 | 已完善 |
| 网络编程 | [Netty](./netty/README.md) | 如何处理高并发字节流 | 已完善 |
| 数据扩展 | [ShardingSphere](./ds-sharding/README.md) | 是否需要、如何安全分片 | 已完善 |

## 中间件通用要求

- **明确语义**：一致性、顺序、重复、丢失和回放边界必须写入设计文档。
- **幂等与补偿**：任何跨网络操作都要处理重复、部分成功和超时。
- **容量与隔离**：队列、连接、线程、分区和内存要有上限与隔离舱。
- **可观测**：统一 traceId，监控吞吐、延迟、错误、积压、重试、资源和版本。
- **可降级**：中间件故障时服务仍能明确失败、降级或恢复，不让故障无界扩散。

状态：已完善。
