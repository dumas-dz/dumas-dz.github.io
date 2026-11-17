---
title: Java 并发理论基础
category:
  - Java
tag:
  - JMM
  - happens-before
  - 可见性
description: Java 内存模型、happens-before、volatile、锁和原子性的核心理论。
order: 2
outline: [2, 3]
---

# Java 并发理论基础

## 学习目标

- 理解 Java 内存模型中的可见性、有序性和原子性。
- 掌握 happens-before、`volatile`、锁、final 和安全发布。
- 能判断数据竞争，而不是仅凭“代码看起来有序”下结论。

## 适用场景

适用于所有共享内存并发代码，尤其是缓存、状态标志、双重检查锁、对象发布和跨线程结果传递。消息队列、数据库事务还具有各自协议，但进入 JVM 后仍需遵守 Java 内存模型。

## 核心概念

### Java 内存模型

JMM 定义线程如何观察共享变量，不等于 JVM 运行时内存区域。程序次序、`volatile` 写读、锁解锁加锁、线程启动和终止等规则建立 happens-before 关系；一个操作的结果对后续 happens-before 的操作可见。

### 数据竞争

两个不同线程访问同一非原子变量，至少一个写入，且没有排序约束，就构成数据竞争。JIT 可能缓存、重排或消除循环读取，测试偶发失败和生产表现可能不同。

### 同步工具语义

| 机制 | 原子性 | 可见性 | 有序性 | 适用 |
| --- | --- | --- | --- | --- |
| `volatile` | 单个读写 | 建立可见性 | 防止相关重排 | 状态标志、发布 |
| `synchronized` | 临界区 | 解锁-加锁建立关系 | 临界区有序 | 复合不变量 |
| `Atomic*` | 指定方法原子 | 提供 volatile 语义 | 提供排序 | 计数、CAS 状态 |
| 不可变对象 | 构造完成后只读 | 安全发布后可见 | final 保证 | 跨线程共享 |

`volatile count++` 仍是“读-改-写”，不能保证递增原子性；使用 `AtomicLong`/`LongAdder` 或锁。

### 安全发布

对象必须在构造完成后才能被其他线程安全观察。通过 `final` 字段、锁、volatile 写入或并发容器发布。在构造函数中把 `this` 逃逸给其他线程是典型错误，即使字段声明 final 也无法消除外部观察到半成品的风险。

### 指令重排与双重检查锁

单例的双重检查锁需要 volatile 修饰实例，防止引用写入在对象字段初始化前被其他线程观察。若无懒加载和并发初始化需求，类初始化或依赖注入通常更简单。

## 工程实现

```java
public final class Worker {
    private volatile boolean running = true;
    private final Object stateLock = new Object();
    private long completed;

    public void stop() {
        running = false;
    }

    public void run() {
        while (running) {
            process();
            synchronized (stateLock) {
                completed++;
            }
        }
    }

    public long completed() {
        synchronized (stateLock) {
            return completed;
        }
    }

    private void process() {
        // 工作单元必须可中断，且不长期占用锁。
    }
}
```

如果 `completed` 只做全局计数，使用 `LongAdder` 通常扩展性更好；如果需要精确快照或条件等待，显式锁更合适。

## 生产实践

- 默认使用不可变对象、线程封闭和成熟并发容器，减少手工同步。
- 用 JCStress 或目标 JDK 的并发测试验证关键不变量，普通单元测试无法证明无竞态。
- 锁范围只覆盖共享不变量，IO、序列化、网络调用放到锁外。
- 文档记录字段共享方式，例如“仅线程内”“volatile 标志”“由 lock 保护”。
- 避免依赖 `Thread.sleep` 让其他线程“赶上”，这不是同步机制。

## 常见问题

### `volatile` 能替代锁吗？

不能。它保证单变量读写的可见性和排序，不保证多步复合操作原子性，也不提供条件等待和互斥。

### final 字段为什么重要？

正确构造后，其他线程看到的 final 字段至少是构造期间写入的值。它解决部分安全发布问题，但不能阻止 `this` 逃逸或 final 字段内部对象继续可变。

### 为什么单核也有并发问题？

线程切换、编译器和处理器优化、缓存一致性以及不同执行顺序都会产生交错，数据竞争与核心数量无直接关系。

### 面试追问：synchronized 的锁升级是什么？

部分 JDK 实现从偏向锁、轻量级锁到重量级锁逐步优化竞争；升级策略随 JDK 版本和 JDKEP 变化，不应把某一版本细节当作跨版本保证。

## 总结与延伸

并发正确性来自明确的共享和排序关系，而不是经验性延时。掌握理论后，在[线程基础](./java-thread-x-thread-basic.md)和[J.U.C](./java-thread-x-juc-overview.md)中落实 API。

## 关联阅读

- [Java 并发知识体系](./java-thread-x-overview.md)
- [Java 并发线程基础](./java-thread-x-thread-basic.md)
- [JMM 内存结构详解](../jvm/java-jvm-jmm-struct.md)
