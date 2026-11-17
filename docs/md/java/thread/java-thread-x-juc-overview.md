---
title: J.U.C 知识体系详解
category:
  - Java
tag:
  - JUC
  - 锁
  - 线程池
description: java.util.concurrent 中锁、原子类、同步器、并发容器和线程池的工程指南。
order: 4
outline: [2, 3]
---

# J.U.C 知识体系详解

## 学习目标

- 熟悉锁、原子类、同步器、并发容器、线程池和异步组合工具。
- 能根据不变量、竞争程度、公平性和可取消性选择工具。
- 能诊断锁竞争、线程池饱和、队列积压和 Future 泄漏。

## 适用场景

适合多线程共享状态、限流、缓存、批量并行和任务编排。数据库事务、跨进程一致性和消息投递不能由 J.U.C 单独保证；低竞争时简单 `synchronized` 往往更清晰，高竞争则应优先减少共享和临界区。

## 核心概念

### 锁与同步器

| 工具 | 典型用途 | 关键语义 |
| --- | --- | --- |
| `ReentrantLock` | 可中断、超时、多条件等待 | 可选公平性，手动 unlock |
| `ReadWriteLock` | 读多写少且临界区较大 | 写互斥、读共享，不保证公平升级 |
| `StampedLock` | 乐观读、读多写少 | 乐观读需校验，API 更复杂 |
| `Semaphore` | 并发容量控制 | permit 限制同时进入数量 |
| `CountDownLatch` | 一次性等待多个事件 | 不能重置 |
| `CyclicBarrier` | 多线程分阶段汇合并可重用 | 屏障动作和异常处理 |
| `Phaser` | 动态注册的分阶段协作 | 生命周期更复杂 |

`tryLock()` 没有超时会立即返回；不要为解决死锁随意使用非公平锁或忽略失败。`ReadWriteLock` 适合读临界区确实较长的场景，小读取用 `ConcurrentHashMap` 或不可变快照可能更优。

### 原子类

`AtomicInteger`、`AtomicReference`、`AtomicLong` 基于 CAS 表达单变量更新，`LongAdder` 在高争用计数下通过分散热点扩展。CAS 循环需限制竞争并正确处理 ABA、重试和溢出；业务复合不变量仍可能需要锁或 `AtomicReference` 的不可变状态替换。

### 并发容器

- `ConcurrentHashMap`：支持高并发键值访问和 `compute/merge` 原子操作。
- `CopyOnArrayList`：读多极少写，写入复制底层数组。
- `ConcurrentLinkedQueue`：无界非阻塞队列，必须防止生产过快。
- `ArrayBlockingQueue`：有界、可选公平，适合背压和生产者-消费者。
- `LinkedBlockingQueue`：可选有界，注意不要误用默认无界容量。
- `PriorityBlockingQueue`：按优先级出队，容量不能限制工作量。
- `DelayQueue`：延迟任务调度，需理解时间源和取消。

### CompletableFuture

通过 `thenApply`、`thenCompose`、`thenCombine`、`allOf` 编排依赖。异常通过 `handle`、`exceptionally`、`whenComplete` 明确处理；每条链路要有超时和取消传播。不要把一个阻塞业务事务拆成多线程后共享非线程安全 DAO 连接。

## 工程实现

```java
import java.util.concurrent.*;
import java.util.concurrent.atomic.LongAdder;

public final class LimitedTaskQueue {
    private final Semaphore permits;
    private final ArrayBlockingQueue<Runnable> queue;
    private final LongAdder rejected = new LongAdder();
    private final ExecutorService workers;

    public LimitedTaskQueue(int concurrency, int capacity) {
        this.permits = new Semaphore(concurrency);
        this.queue = new ArrayBlockingQueue<>(capacity);
        this.workers = Executors.newFixedThreadPool(concurrency, task -> {
            Thread thread = new Thread(task, "limited-worker");
            return thread;
        });
    }

    public boolean submit(Runnable task) {
        boolean accepted = queue.offer(task);
        if (!accepted) {
            rejected.increment();
        }
        return accepted;
    }

    public CompletionStage<Void> runAsync(Callable<String> task, Executor executor) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                return task.call();
            } catch (Exception e) {
                throw new CompletionException(e);
            }
        }, executor);
    }

    public long rejectedCount() {
        return rejected.sum();
    }
}
```

该示例展示准入和异步入口；完整实现还需工作循环、关闭顺序、任务异常和队列等待指标。生产环境通常采用成熟线程池库，而不是复制半成品调度器。

## 生产实践

- 先用不可变、线程封闭或分片减少共享，再选择同步工具。
- 锁顺序在设计文档中固定，超时路径必须释放资源。
- 线程池、队列、permit 和 Future 都要有界并可观测。
- 对共享缓存记录命中、淘汰、容量和更新冲突；避免多个线程重复构建昂贵值。
- 使用 JFR、线程转储和锁竞争事件定位问题，不靠增加线程或 sleep。

## 常见问题

### `ConcurrentHashMap.compute` 能长时间运行吗？

不建议。映射更新函数在特定桶/bin 的控制期间运行，长计算、IO 或递归修改会阻塞其他访问甚至死锁。计算结果后再短临界区写入。

### `AtomicReference.compareAndSet` 为什么自旋？

CAS 可能因并发更新失败，重试读取最新值并构造新状态。必须保证更新函数无副作用，并限制循环或提供退避。

### `CompletableFuture` 如何避免线程泄漏？

限制并发、设置超时、取消不用的 Future，关闭专用 Executor，并确保每条链路最终被观察。

### 面试追问：公平锁一定更好吗？

公平锁减少饥饿但可能降低吞吐并增加上下文切换。只有业务确实要求排队顺序且测量证明需要时才启用。

## 总结与延伸

J.U.C 的核心是“减少共享 + 明确同步契约 + 有界执行”。回到[并发理论](./java-thread-x-theory-basic.md)验证安全性，使用[线程基础](./java-thread-x-thread-basic.md)落实关闭与监控。

## 关联阅读

- [Java 并发线程基础](./java-thread-x-thread-basic.md)
- [Java 集合框架详解](../collection/java-collection-overview.md)
- [Java 调试排错相关](../jvm/java-jvm-debug-tools-ref.md)
