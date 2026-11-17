---
title: Java 并发线程基础
category:
  - Java
tag:
  - Thread
  - Executor
description: Java 线程生命周期、中断、协作、线程池和优雅关闭的工程基础。
order: 3
outline: [2, 3]
---

# Java 并发线程基础

## 学习目标

- 掌握线程创建、状态、优先级、守护线程和上下文 ClassLoader。
- 正确实现中断、等待/通知、超时和线程安全停止。
- 能配置可观测、可隔离、可关闭的线程池。

## 适用场景

业务应用通常不直接无限创建线程，而是使用 `ExecutorService`、调度器或框架托管线程。直接创建线程适合小型工具、线程边界控制或理解运行机制；虚拟线程适合大量阻塞任务，但仍需限制下游资源。

## 核心概念

### 生命周期

`NEW -> RUNNABLE -> BLOCKED / WAITING / TIMED_WAITING -> TERMINATED`。`RUNNABLE` 可能正在运行或等待操作系统调度，JVM 状态无法完整反映 IO 等待原因，需结合线程栈和指标。

### 线程上下文

线程拥有名字、优先级、中断状态、ThreadLocal、上下文 ClassLoader 和 inheritable 属性。框架、日志 MDC、事务和认证上下文跨线程传递必须显式定义复制与清理。

### 等待与通知

`wait/notify/notifyAll` 必须在目标对象监视器锁内调用，且应在循环中检查条件以应对虚假唤醒。`Condition.await/signal` 与显式锁配合更易表达多个等待队列。生产代码优先使用队列、Future、Latch、Semaphore 等高层工具。

### 中断与停止

线程收到中断只设置标志；阻塞方法可能清除标志并抛 `InterruptedException`。方法不能吞掉中断，应恢复标志或继续抛出。停止线程是协作过程，必须有宽限期、超时和最终兜底。

### 线程池参数

| 参数 | 作用 | 选择依据 |
| --- | --- | --- |
| core/max | 常驻与最大线程 | CPU/IO 比、下游容量 |
| keepAlive | 空闲线程回收 | 流量波动 |
| queue | 等待任务 | 可接受延迟和内存 |
| factory | 命名、优先级、异常钩子 | 诊断与隔离 |
| rejection | 过载行为 | 快速失败、丢弃或 CallerRuns |

CPU 密集型线程数接近核心数，IO 密集型通常更多，但公式只能给起点，必须用压测和资源池指标校准。

## 工程实现

```java
import java.time.Duration;
import java.util.concurrent.*;

public final class TaskRunner implements AutoCloseable {
    private final ExecutorService executor;

    public TaskRunner() {
        this.executor = new ThreadPoolExecutor(
            4, 16, Duration.ofSeconds(30).toSeconds(), TimeUnit.SECONDS,
            new ArrayBlockingQueue<>(1_000),
            new NamedThreadFactory("report"),
            new ThreadPoolExecutor.AbortPolicy()
        );
    }

    public <T> T call(Callable<T> task, Duration timeout) throws Exception {
        Future<T> future = executor.submit(task);
        try {
            return future.get(timeout.toMillis(), TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            future.cancel(true);
            throw e;
        }
    }

    @Override
    public void close() {
        executor.shutdown();
        try {
            if (!executor.awaitTermination(10, TimeUnit.SECONDS)) {
                executor.shutdownNow();
            }
        } catch (InterruptedException e) {
            executor.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    private static final class NamedThreadFactory implements ThreadFactory {
        private final String prefix;
        private int sequence;

        NamedThreadFactory(String prefix) {
            this.prefix = prefix;
        }

        @Override
        public synchronized Thread newThread(Runnable task) {
            return new Thread(task, prefix + "-" + (++sequence));
        }
    }
}
```

不要使用 `Executors.newCachedThreadPool` 或无界队列承载外部流量；生产库应补全指标、MDC 传播、拒绝审计和停机宽限期。

## 生产实践

- 每个池有名称、容量、队列、拒绝策略、超时和 owner。
- 对数据库连接池、HTTP 客户端、消息消费者分别限制并发。
- 使用 `CallerRunsPolicy` 时必须确认调用线程被阻塞是可接受的，避免把请求线程拖垮。
- 捕获任务异常并记录任务类型、业务 ID 和堆栈摘要，不能只依赖默认未捕获处理器。
- 停机时先停止新任务，取消可取消任务，等待收尾并导出未完成任务数。

## 常见问题

### `Future.cancel(true)` 一定会停止任务吗？

不会。它请求取消并可能中断，但任务可以忽略中断。底层 HTTP、数据库和锁也需支持取消，且必须在 finally 中释放资源。

### `ThreadLocal` 为什么可能内存泄漏？

线程池线程长期存活，Map 中的值不会自动消失。请求结束后执行 `remove`，尤其在容器和虚拟线程复用环境。

### 为什么不要用 `stop`、`suspend`？

这些旧 API 会强制终止或暂停线程，可能破坏锁和对象不变量，已废弃。应采用中断、状态标志和明确协议协作停止。

### 面试追问：守护线程适合做什么？

后台辅助工作，例如 JIT 或某些服务线程。JVM 退出时可能被立即终止，不适合保证刷盘、事务提交和结果持久化。

## 总结与延伸

线程基础重点是生命周期、取消和资源边界。完成本篇后进入[J.U.C 工具](./java-thread-x-juc-overview.md)，并用[并发理论](./java-thread-x-theory-basic.md)验证正确性。

## 关联阅读

- [Java 并发理论基础](./java-thread-x-theory-basic.md)
- [J.U.C 知识体系详解](./java-thread-x-juc-overview.md)
- [Java 调试排错相关](../jvm/java-jvm-debug-tools-ref.md)
