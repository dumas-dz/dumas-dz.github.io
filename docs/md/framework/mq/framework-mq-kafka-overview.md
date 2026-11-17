---
title: Kafka 知识体系
category:
  - 框架
  - 中间件
tag:
  - Kafka
  - 流处理
  - 消息队列
description: 以分区、offset、消费组、事务和运维为核心，设计可回放、可观测的 Kafka 数据流。
order: 40
outline: [2, 3]
---

# Kafka 知识体系

## 1. 学习目标

学习后应能设计 Topic 分区和键，理解生产者、消费组、offset 与重平衡，选择 at-least-once 或事务语义，并定位消费延迟、分区热点、重复和数据丢失。示例面向 Kafka 3.x Java 客户端。

## 2. 适用场景

Kafka 适合高吞吐事件流、日志、数据管道、流式处理和需要长期回放的系统。消息持久化在分区日志中，消费者按 offset 独立读取，横向扩展主要依靠分区和消费者组。

低延迟请求/响应、少量复杂路由任务或事务事件为主的业务也可使用 RabbitMQ/RocketMQ。Kafka 不是数据库替代品，schema、保留、回放和下游消费契约需要治理。

## 3. 核心原理

### 3.1 Topic、Partition 与 Key

Topic 是逻辑流，Partition 是并行和顺序单元。相同 key 通常进入相同 partition，因此 key 决定局部有序与热点。增加 partition 会改变 key 路由，扩容前要评估顺序语义和客户端兼容性。

### 3.2 Producer 与可靠性

Producer 批量、压缩、`acks`、幂等和重试影响吞吐与可靠性。`acks=all` + ISR 副本能降低丢失风险，但不等于业务恰好一次。发送回调必须处理失败，不能只看 `send()` 返回。

### 3.3 Consumer、Offset 与重平衡

Consumer Group 内分区被分配给消费者，offset 有自动和手动提交。自动提交可能提前或重复提交，业务处理成功后手动提交更可控。重平衡会触发分区迁移，消费者要支持暂停、恢复和优雅退出。

### 3.4 事务与 Exactly-once

Kafka 事务可保证生产、消费位点和读-处理-写在同一事务语义内，但跨外部数据库不自动获得恰好一次。跨系统仍需消费幂等、唯一键、Outbox/CDC 或业务补偿。

## 4. 技术决策与对比

| 需求 | Kafka 做法 | 说明 |
| --- | --- | --- |
| 事件回放 | 按保留策略保留日志 | schema 和业务兼容必须治理 |
| 局部有序 | 选择稳定 partition key | 范围仅限单分区 |
| 削峰 | 增加分区和消费者 | 下游能力才是最终瓶颈 |
| 事务流 | read-process-write + id | 依赖 Kafka 事务 |
| 跨库一致 | Outbox/CDC + 幂等消费者 | 不能只依赖 Kafka 事务 |
| 延迟任务 | 专用 Topic + 时间处理/外部调度 | Kafka 本身不是定时器 |

## 5. 工程实现

### 5.1 生产端

```java
Properties properties = new Properties();
properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,
    StringSerializer.class.getName());
properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
    StringSerializer.class.getName());
properties.put(ProducerConfig.ACKS_CONFIG, "all");
properties.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);

try (KafkaProducer<String, String> producer = new KafkaProducer<>(properties)) {
    ProducerRecord<String, String> record =
        new ProducerRecord<>("order-events", "order-20261116-001", "{\"status\":\"PAID\"}");
    producer.send(record, (metadata, exception) -> {
        if (exception != null) {
            throw new IllegalStateException("publish failed", exception);
        }
    });
}
```

### 5.2 消费端

```java
Properties properties = new Properties();
properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
properties.put(ConsumerConfig.GROUP_ID_CONFIG, "order-projection");
properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
    StringDeserializer.class.getName());
properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
    StringDeserializer.class.getName());
properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);

try (KafkaConsumer<String, String> consumer = new KafkaConsumer<>(properties)) {
    consumer.subscribe(List.of("order-events"));
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));
    for (ConsumerRecord<String, String> record : records) {
        applyIdempotently(record.key(), record.value());
    }
    consumer.commitSync();
}
```

`applyIdempotently` 是业务处理入口，必须以业务 ID/版本保证重复调用不产生额外副作用。

## 6. 生产实践

- Topic、分区、副本、保留、清理和 schema 版本纳入基础设施定义，新增 Topic 评审 key 与容量。
- 监控生产/消费速率、lag、请求延迟、ISR、不可用分区、磁盘、网络、重平衡和认证失败。
- 使用 Schema Registry、Avro/Protobuf/JSON Schema 管理兼容升级，消费者不能依赖隐式字段。
- 消费者批处理、反序列化和外部调用要限制内存和时间，避免心跳超时导致重平衡。
- 对高频热点 key 做采样、拆分或加盐，但要保留顺序所需的业务边界。
- 安全启用认证、授权、TLS、审计和隔离的测试环境，禁止生产 Topic 被任意客户端读写。

## 7. 常见坑与排查

1. **数据未消费却被覆盖**：自动提交或 offset 重置策略错误，消费前确认提交时机和恢复点。
2. **重复消息**：生产重试、消费异常和重平衡都会重复，业务唯一键/版本必须落库。
3. **消费 lag 持续增长**：先看消费者是否停滞、下游是否变慢、分区是否热点，再扩消费者。
4. **热点分区**：key 过于集中导致单消费者瓶颈，用带盐 key、增加分区或拆 Topic，注意顺序影响。
5. **重平衡频繁**：处理时间超过 `max.poll.interval.ms` 或心跳不稳定，降低批大小或改用协作式重平衡。
6. **消息丢失**：生产端未确认、broker 清理策略过短、消费者提交前崩溃，分别补齐证据。
7. **schema 不兼容**：字段删除、类型改变或必填变化导致消费者失败，使用兼容策略和契约测试。
8. **删除/重建 Topic**：生产数据被清理后无法回放，清理、删除和保留策略需审批。

## 8. 总结与关联阅读

Kafka 通过分区日志提供吞吐、回放和流式扩展；可靠性取决于生产确认、消费提交和业务幂等。先定义数据契约和 key 语义，再谈分区数量。

关联阅读：[RocketMQ 知识体系](./framework-mq-rocketmq-overview.md)、[RabbitMQ 知识体系](./framework-mq-rabbitmq-overview.md)、[分布式事务与幂等](../../arch/distributed/arch-distributed-overview.md)、[日志规范](../../dev-spec/dev-spec-logging.md)。
