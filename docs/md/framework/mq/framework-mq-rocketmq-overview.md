---
title: RocketMQ 知识体系
category:
  - 框架
  - 中间件
tag:
  - RocketMQ
  - 消息队列
  - 最终一致性
description: 掌握 RocketMQ 的消息模型、可靠投递、顺序消息、事务消息和生产运维方法。
order: 20
outline: [2, 3]
---

# RocketMQ 知识体系

## 1. 学习目标

学习后应能为业务选择 Topic/Tag/消费组，设计生产者确认、消费幂等、顺序与延迟消息，理解事务消息和重试/死信机制，并用监控定位堆积和重复消费。示例面向 RocketMQ 5.x Java 客户端。

## 2. 适用场景

RocketMQ 适合订单、支付、库存等需要解耦、削峰、可靠异步和事务最终一致的业务。它以 Topic、队列和消费组组织消息，提供顺序、延迟、事务和轨迹等企业能力。

如果只需要进程内异步任务，使用线程池或调度器即可；高吞吐日志、流式计算、长时间回放也可比较 Kafka。业务数据库事务不能因为引入 MQ 而消失，必须结合本地消息表或事务消息。

## 3. 核心原理

### 3.1 消息模型

Producer 发布到 Topic，Broker 保存并投递给 ConsumerGroup。Tag 用于消费端过滤，Tag 过多会造成订阅配置复杂；业务事件命名要能表达状态变化，例如 `order.paid`。同组消费者共同消费，不同组独立消费。

### 3.2 投递语义

RocketMQ 不能保证“恰好一次网络传输”。生产者可能重发，消费者可能在处理后才失败，因此业务必须幂等。至少一次是常见默认语义，消息 ID 只能作为技术标识，业务唯一键才适合防重。

### 3.3 顺序、延迟和事务消息

同一队列内的顺序由分区/队列选择决定，局部有序比全局有序成本低。延迟消息适合定时关闭、重试提醒，但不替代可持久化的调度表。事务消息通过半消息和回查协调本地事务，适合跨数据库/服务的最终一致，不应承载长事务。

### 3.4 可靠性链路

生产端发送确认、Broker 刷盘/主从同步、消费端 ACK、重试次数、死信队列和轨迹共同形成闭环。每一段都必须可观测；“发送成功”不等于“业务完成”。

## 4. 技术决策与对比

| 场景 | RocketMQ | Kafka | 选择依据 |
| --- | --- | --- | --- |
| 业务事务最终一致 | 事务消息、回查成熟 | 事务能力存在但模型不同 | 强事务事件可优先 RocketMQ |
| 顺序业务 | 队列局部顺序 | 分区局部顺序 | 都要控制分区键 |
| 延迟任务 | 延迟级别 | 通常外部调度/时间轮 | 精细时间选择要评估 |
| 流式回放 | 支持消息轨迹与消费位点 | 分区日志回放强 | 日志/数据流偏 Kafka |
| 运维复杂度 | NameServer/Broker | ZooKeeper/KRaft、分区管理 | 以团队能力为准 |

## 5. 工程实现

### 5.1 发送可靠事件

```java
public record OrderPaidEvent(String eventId, String orderNo, long amount, long occurredAt) {}

@Service
public class OrderPaidPublisher {
    private final DefaultMQProducer producer;
    private final ObjectMapper objectMapper;

    public OrderPaidPublisher(DefaultMQProducer producer, ObjectMapper objectMapper) {
        this.producer = producer;
        this.objectMapper = objectMapper;
    }

    public void publish(OrderPaidEvent event) throws Exception {
        byte[] body = objectMapper.writeValueAsBytes(event);
        Message message = new Message("order-events", "OrderPaid", event.eventId(), body);
        SendResult result = producer.send(message);
        if (result.getSendStatus() != SendStatus.SEND_OK) {
            throw new IllegalStateException("publish failed: " + result.getSendStatus());
        }
    }
}
```

### 5.2 幂等消费

```java
@Component
public class OrderPaidConsumer {
    private final ProcessedMessageRepository processedMessages;
    private final OrderRepository orders;

    @RocketMQMessageListener(
        topic = "order-events",
        consumerGroup = "order-projection-consumers",
        selectorExpression = "OrderPaid"
    )
    public void onMessage(MessageExt message) {
        String eventId = message.getKeys();
        if (processedMessages.exists(eventId)) {
            return;
        }

        OrderPaidEvent event = readEvent(message.getBody());
        orders.markPaid(event.orderNo(), event.amount());
        processedMessages.insert(eventId, message.getMsgId());
    }
}
```

`eventId` 应由业务产生并在数据库中有唯一约束；上述示例假设 `readEvent` 负责反序列化和格式校验。

## 6. 生产实践

- 业务事件包含事件 ID、业务键、版本、发生时间和 traceId；禁止把可变实体全量无版本发送。
- 发送失败要有同步告警和可重放事件，不要只打印日志。
- 消费端设置并发、批量大小、超时和最大重试；重试进入死信后触发人工或自动修复流程。
- 监控生产 TPS、发送失败、Broker 刷盘/主从延迟、消费位点、堆积量、重试和死信。
- Topic、Tag、消费组命名规范化，测试环境隔离，生产发布检查消费者订阅配置。
- 事务消息回查处理器必须幂等、快速、可审计，能根据本地事务表返回提交或回滚。

## 7. 常见坑与排查

1. **重复消费**：网络重试、重平衡、消费失败都可能重复，业务状态更新要用唯一键/版本。
2. **消息丢失**：未确认发送、异步发送异常被忽略、消费异常未重试；补齐确认和监控。
3. **顺序被打乱**：并发消费者或路由键不稳定会破坏局部顺序，明确顺序范围。
4. **堆积误判**：只看总条数不看生产/消费速率，可能是下游变慢或消费者停机。
5. **事务回查循环**：本地事务表缺少状态或回查逻辑反复返回未知，导致半消息长期悬挂。
6. **消息体过大**：大量附件、完整页面或日志放消息体造成网络和存储压力，消息只传 ID 与事实。
7. **Tag 过度过滤**：Tag 像事件总线一样无限膨胀，改成领域 Topic 或明确版本。
8. **消费超时却已 ACK**：处理超时后客户端仍提交位点，业务状态与消息位点不一致，要拆分操作。

## 8. 总结与关联阅读

RocketMQ 提供可靠事件的运输与治理，真正的一致性仍由业务状态、唯一键和幂等消费保证。把发送、存储、消费、重试和死信视为一条可恢复链路。

关联阅读：[RabbitMQ 知识体系](./framework-mq-rabbitmq-overview.md)、[Kafka 知识体系](./framework-mq-kafka-overview.md)、[分布式事务与幂等](../../arch/distributed/arch-distributed-overview.md)、[日志规范](../../dev-spec/dev-spec-logging.md)。
