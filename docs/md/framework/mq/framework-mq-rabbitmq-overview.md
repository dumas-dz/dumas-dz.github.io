---
title: RabbitMQ 知识体系
category:
  - 框架
  - 中间件
tag:
  - RabbitMQ
  - AMQP
  - 消息队列
description: 理解 RabbitMQ 的交换机、队列、确认机制和可靠消息模式，构建可观测的异步系统。
order: 30
outline: [2, 3]
---

# RabbitMQ 知识体系

## 1. 学习目标

学习后应能按业务路由设计 exchange、queue 和 binding，选择确认/持久化/死信策略，处理重复、乱序、慢消费者与连接故障。示例面向 RabbitMQ 3.13+ 与 AMQP 0-9-1。

## 2. 适用场景

RabbitMQ 适合任务分发、工作队列、通知和路由规则清晰的异步解耦。它以 Exchange 路由到 Queue，提供确认、TTL、死信、优先级和插件能力，控制面灵活。

高吞吐日志流、长期分区回放和大规模流处理通常比较 Kafka。需要跨服务事务时，RabbitMQ 仍是消息运输层，数据库事务与消费幂等必须自行设计。

## 3. 核心原理

### 3.1 AMQP 模型

Producer 发布消息到 Exchange，Exchange 根据 type 和 binding 把消息路由到 Queue，Consumer 从 Queue 拉取。Direct 精确路由，Topic 按通配路由，Fanout 广播，Headers 按属性路由。不要为所有事件使用 `default exchange + queue`，避免路由能力退化。

### 3.2 可靠投递

生产者使用 publisher confirm，确认 Broker 已持久化；消息设置 delivery mode、消息 ID 和可重放事件体。消费者处理成功后手动 ACK；处理失败选择 requeue、NACK 或死信，避免无界重试。

### 3.3 队列与消费者

队列持久化、镜像/quorum 决定可用性；消费者预取数控制在途消息量。慢消费者会触发连接背压或资源耗尽，应通过超时、批处理、并发和独立队列隔离。

### 3.4 死信与 TTL

消息 TTL 和队列 TTL 过期后进入死信交换机，适合延迟重试和最终失败。TTL 不是可靠的定时任务执行时间；超时后还要重新判断业务状态，避免执行过期任务。

## 4. 技术决策与对比

| 需求 | RabbitMQ 方案 | 代价 |
| --- | --- | --- |
| 点对点任务 | Work Queue + 手动 ACK | 需要幂等和重试 |
| 发布订阅 | Fanout/Topic exchange | 每个订阅队列独立积压 |
| 路由规则 | Direct/Topic binding | 规则变更需管理 |
| 延迟/重试 | TTL + DLX | 只能近似时间、需状态复查 |
| 高可用 | Quorum Queue + 多节点 | 写入延迟和资源增加 |
| 消息回放 | 可用插件/外部日志，不擅长 | 长期流式更推荐 Kafka |

## 5. 工程实现

### 5.1 拓扑定义

```text
exchange: order.events (topic, durable)
queue: order.paid.consumer-a (durable)
queue: order.audit (durable)
binding:
  order.paid.consumer-a <- order.paid
  order.audit <- order.*
```

拓扑应由部署脚本或应用启动时统一声明，但生产环境要避免应用互相覆盖不兼容的队列参数。

### 5.2 确认消费

```java
@Component
public class PaidOrderListener {
    private final OrderProjector projector;
    private final ProcessedMessageRepository processed;

    @RabbitListener(queues = "order.paid.consumer-a")
    public void handle(
        @Payload String body,
        @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag,
        Channel channel
    ) throws IOException {
        try {
            OrderPaidEvent event = OrderPaidEvent.fromJson(body);
            if (!processed.exists(event.eventId())) {
                projector.apply(event);
                processed.insert(event.eventId());
            }
            channel.basicAck(deliveryTag, false);
        } catch (Exception exception) {
            channel.basicNack(deliveryTag, false, false);
            throw exception;
        }
    }
}
```

示例采用不重新入队的失败策略，实际系统应将失败转入死信或重试队列，并记录原因。

## 6. 生产实践

- 消息体使用明确版本的 JSON/Protobuf，包含消息 ID、业务键、时间和 traceId；大附件传对象存储。
- 为生产者 confirm、消费者 ACK、重试、死信和队列长度建立指标与告警。
- 为不同重要性队列配置独立节点资源、预取、TTL 和死信策略。
- 启动时校验 exchange/queue/binding，声明与实际拓扑一致；清理测试队列避免生产误用。
- 消费者异常必须分类：可重试、不可重试、格式错误和业务冲突，分别处理。
- 节点磁盘、内存、连接、通道和 Erlang 进程需要监控，磁盘告警会阻塞发布。

## 7. 常见坑与排查

1. **消息未持久化**：broker 重启丢失消息，消息和队列都要持久化且使用 publisher confirm。
2. **消费者自动 ACK**：进程崩溃前消息已丢失，必须在业务处理成功后 ACK。
3. **requeue 无限循环**：同一条消息不断返回队列，按次数或异常类型进入死信。
4. **死信丢失路由**：只配置队列 TTL 未绑定 DLX，或死信队列本身不存在。
5. **交换机类型不匹配**：binding 和 routing key 不符合 direct/topic 规则，消息被静默丢弃。
6. **慢消费者堆积**：增加消费者前检查下游数据库和外部服务承载能力。
7. **通道泄漏**：长期运行的消费者大量 channel 未关闭，连接和内存逐渐上涨。
8. **消息重复**：confirm 重发、消费者重试和业务回滚均会重复，唯一键是最终防线。

## 8. 总结与关联阅读

RabbitMQ 的拓扑表达能力来自 Exchange/Queue，可靠性来自确认、持久化和明确失败策略。它解决异步运输，不替代业务幂等和事务补偿。

关联阅读：[RocketMQ 知识体系](./framework-mq-rocketmq-overview.md)、[Kafka 知识体系](./framework-mq-kafka-overview.md)、[分布式事务与幂等](../../arch/distributed/arch-distributed-overview.md)、[性能与故障排查](../../dev-spec/dev-spec-performance-troubleshooting.md)。
