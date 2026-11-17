---
title: Java 并发知识体系
category:
  - Java
tag:
  - 并发编程
  - 线程模型
description: Java 并发问题的分解方法、核心工具和工程化设计边界。
order: 1
outline: [2, 3]
---

# Java 并发知识体系

## 学习目标

- 建立“任务、状态、调度、同步、通信、取消”的并发问题分析框架。
- 能选择线程、Future、并发容器、线程池或虚拟线程。
- 理解并发正确性与性能优化必须分别验证。

## 适用场景

适合多核计算、并行 IO、后台任务、请求并行调用和服务器并发处理。单线程已能满足延迟与吞吐时不要增加并发；数据库事务、连接池和限流资源是线程池之外的共享瓶颈，不能通过增加线程解决。

## 核心概念

### 并发问题分解

1. **任务**：独立工作单元和依赖关系。
2. **共享状态**：可变数据、生命周期和归属线程。
3. **同步方式**：不可变、封闭、锁、原子变量或消息传递。
4. **调度**：公平性、优先级、隔离和有界队列。
5. **协作**：Future、CompletableFuture、Future/StructuredTaskScope。
6. **终止**：超时、取消、中断、优雅关闭和结果收集。

### 并发性质

| 性质 | 含义 | 典型保证 |
| --- | --- | --- |
| 原子性 | 操作对外不可分割 | 锁、CAS、原子类 |
| 可见性 | 写入结果对其他线程可见 | `volatile`、锁、并发容器 |
| 有序性 | 观察到的执行顺序受规则约束 | happens-before、`volatile` |
| 活性 | 系统最终继续推进 | 无死锁、无饥饿、无活锁 |
| 安全性 | 不产生错误状态 | 不变量、边界校验、测试 |

### 任务执行模型

```text
任务提交 -> 接收/拒绝 -> 等待队列 -> 工作线程 -> 结果/异常/取消
```

`ExecutorService` 把任务与线程管理解耦，`CompletableFuture` 适合组合异步依赖，虚拟线程适合大量阻塞式 IO 任务。它们都不会自动解决共享可变状态和资源池耗尽问题。

### 并发层次

- 单线程事件循环：顺序简单，适合 IO 密集型。
- 固定/弹性线程池：可控资源，需要队列、隔离和关闭策略。
- Fork/Join：适合可分治的 CPU 密集型任务，注意工作窃取和异常传播。
- 虚拟线程：适合大量阻塞任务；`synchronized` 阻塞可能导致载体线程固定（随 JDK 版本演进，应实测目标版本）。

## 工程实现

```java
import java.util.List;
import java.util.concurrent.*;

public final class OrderStats {
    private final ExecutorService inventoryPool;
    private final ExecutorService pricingPool;

    public OrderStats(int workers) {
        this.inventoryPool = Executors.newFixedThreadPool(workers, named("inventory"));
        this.pricingPool = Executors.newFixedThreadPool(workers, named("pricing"));
    }

    public CompletionStage<Result> load(String orderId) {
        var inventory = CompletableFuture.supplyAsync(() -> Inventory.of(orderId), inventoryPool);
        var pricing = CompletableFuture.supplyAsync(() -> Pricing.of(orderId), pricingPool);

        return inventory
            .thenCombine(pricing, Result::new)
            .orTimeout(2, TimeUnit.SECONDS)
            .whenComplete((value, error) -> {
                if (error != null) Metrics.failed("order_stats");
            });
    }

    public void close() {
        inventoryPool.shutdown();
        pricingPool.shutdown();
    }

    private static ThreadFactory named(String prefix) {
        return task -> {
            Thread thread = new Thread(task, prefix + "-worker");
            thread.setDaemon(false);
            return thread;
        };
    }

    record Result(Inventory inventory, Pricing pricing) {}
    record Inventory(String orderId) { static Inventory of(String id) { return new Inventory(id); } }
    record Pricing(String orderId) { static Pricing of(String id) { return new Pricing(id); } }
    static final class Metrics { static void failed(String name) {} }
}
```

真实实现必须选择拒绝策略、处理取消传播并释放外部资源。异步组合的每个边界都要定义超时、异常转换和结果类型。

## 生产实践

- 线程池按资源隔离：CPU、数据库、外部 API 和内部 RPC 不共用一个池。
- 队列有界，拒绝策略可观测；不要使用无界队列掩盖过载。
- 使用命名线程、MDC/上下文传播、任务 ID 和耗时指标。
- 优雅停止先停止接收任务，再关闭线程池并等待宽限期。
- 性能测试包含竞争、长尾、故障注入和资源池容量，而不只测 QPS。

## 常见问题

### 为什么线程越多不一定越快？

CPU 密集任务受核心数限制，IO 密集任务受下游容量限制。额外线程增加切换、锁竞争、内存和队列等待。

### `CompletableFuture` 异常为什么没有日志？

异步异常只在 `join`、`get` 或组合阶段暴露。应在最终边界记录上下文，或使用 `exceptionally`/`handle` 明确恢复策略。

### 中断为什么不能用 boolean 替代？

中断是协作式取消协议，可唤醒阻塞操作并传播到框架。只设置标志不会解除 `sleep`、`wait` 或 IO 等待，且容易破坏线程池契约。

### 面试追问：并发和并行有什么区别？

并发是任务在时间上交叠推进，可由单线程调度；并行是多个任务真正同时执行，通常依赖多核。

## 总结与延伸

并发工程先建立正确性和边界，再优化吞吐。具体内存规则见[并发理论基础](./java-thread-x-theory-basic.md)，线程 API 见[线程基础](./java-thread-x-thread-basic.md)。

## 关联阅读

- [Java 并发理论基础](./java-thread-x-theory-basic.md)
- [Java 并发线程基础](./java-thread-x-thread-basic.md)
- [J.U.C 知识体系详解](./java-thread-x-juc-overview.md)
