---
title: JMM 内存结构详解
category:
  - Java
tag:
  - JVM
  - 运行时数据区
  - JMM
description: 区分 JVM 运行时数据区与 Java 内存模型，解释内存布局、对象分配和 OOM 诊断。
order: 1
outline: [2, 3]
---

# JMM 内存结构详解

## 学习目标

- 区分 JVM 运行时数据区、Java 内存模型和进程内存。
- 理解堆、栈、元空间、直接内存、代码缓存和本地内存的职责。
- 能根据 OOM 类型、堆转储和指标定位泄漏、超量分配或容量不足。

## 适用场景

适用于 Java 服务的容量规划、内存故障和并发可见性分析。术语“JMM”常被混用：JMM 通常指 Java Memory Model 的并发可见性/有序性规范，本篇同时说明 JVM 运行时内存结构，避免混淆。

## 核心概念

### 运行时数据区

| 区域 | 存储内容 | 生命周期/线程 | 典型故障 |
| --- | --- | --- | --- |
| 堆 | 对象和数组 | 进程级、共享 | 泄漏、GC 长、OOM |
| Java 虚拟机栈 | 帧、局部变量、操作数栈 | 每线程 | StackOverflowError |
| 堆外/本地内存 | NIO、压缩、库、线程栈 | 进程/线程 | RSS 高、进程被杀 |
| 方法区/元空间 | 类元数据、常量池 | 进程级、共享 | 类过多、类加载泄漏 |
| 程序计数器 | 当前执行位置 | 每线程 | 通常不是诊断重点 |
| 代码缓存 | JIT 编译代码 | 进程级 | 编译停止、性能退化 |

HotSpot 中堆外区域还包括 GC 结构、编译器、符号/字符串表、线程和原生库。容器内存超限通常看进程 RSS/PSS 和 Native Memory Tracking，而不是只看 `-Xmx`。

### 对象分配与布局

新对象通常先在线程本地分配缓冲（TLAB）中分配，避免全局锁；大对象可直接进入老年代或特定区域，具体策略与垃圾回收器、对象大小和 JVM 版本有关。对象头包含标记/类型信息，字段布局会受对齐和压缩指针影响。

### 引用与可达性

强引用可达对象不能回收。软引用适合可重建缓存，弱引用适合关联元数据，虚引用适合回收后通知。业务缓存不能依赖弱/软引用的不确定回收时间，应采用显式容量和过期策略。

### OOM 分类

- `Java heap space`：对象保留过多、分配速率过高或堆不足。
- `GC overhead limit exceeded`：大部分时间用于 GC 且回收很少。
- `Metaspace`：类数量、类加载器泄漏或元空间上限过小。
- `Direct buffer memory`：NIO 释放不及时或直接内存限制不足。
- `Unable to create new native thread`：线程数、栈大小、进程限制或容器配额不足。

## 工程实现

```java
import java.lang.management.ManagementFactory;
import java.lang.management.MemoryMXBean;
import java.lang.management.MemoryUsage;

public final class MemoryProbe {
    public static Snapshot snapshot() {
        MemoryMXBean bean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heap = bean.getHeapMemoryUsage();
        MemoryUsage nonHeap = bean.getNonHeapMemoryUsage();
        return new Snapshot(heap.getUsed(), heap.getMax(), nonHeap.getUsed());
    }

    public record Snapshot(long heapUsed, long heapMax, long nonHeapUsed) {}
}
```

JVM 启动建议至少记录版本、容器配额、堆和元空间限制、GC 选择与日志路径：

```bash
java \
  -XX:+UseG1GC \
  -Xms2g -Xmx2g \
  -XX:MaxMetaspaceSize=256m \
  -Xlog:gc*:file=logs/gc.log:time,uptime,level,tags:filecount=5,filesize=20m \
  -jar app.jar
```

不要在代码中频繁读取管理 API 作为监控主路径；优先由 Prometheus、JMX Exporter、JFR 或平台采集。

## 生产实践

- 堆设置基于活动对象集、分配速率和停顿目标压测，不是“容器内存的 75%”。
- 保留 GC 日志、线程转储、JFR 和启动参数，以便故障时关联时间线。
- 大对象、大响应和批处理做流式化，限制列表大小和返回体。
- 缓存按容量/时间/权重淘汰，记录命中率、加载成本和淘汰原因。
- 容器监控 RSS、堆、元空间、线程数、直接内存和 CPU throttling。

## 常见问题

### `-Xmx` 为什么小于进程内存？

堆只是进程的一部分，元空间、线程栈、JIT、GC、NIO 直接内存和原生库也在本地内存中。容器 OOM 先检查 RSS 和 NMT。

### 堆没满为什么频繁 GC？

可能分配速率高、对象朝生夕死、元数据压力或 GC 参数不合理。查看分配事件、对象大小、晋升和每类 GC 原因。

### 能否用 `System.gc()` 解决泄漏？

不能。显式 GC 只是请求，且回收不能让仍被引用的对象消失。应找到保留链、缩短生命周期或修复缓存。

### 面试追问：对象一定分配在堆上吗？

逃逸分析允许标量替换或栈上分配等优化；但语言层面仍应把对象视为堆分配可能，并通过测量判断。

## 总结与延伸

内存问题要从容量、分配、引用、容器和 GC 五个维度分析。并发可见性参见[并发理论](../thread/java-thread-x-theory-basic.md)，回收细节参见[垃圾回收](./java-jvm-gc.md)。

## 关联阅读

- [JVM 垃圾回收机制](./java-jvm-gc.md)
- [Java 调试排错相关](./java-jvm-debug-tools-ref.md)
- [Java 并发理论基础](../thread/java-thread-x-theory-basic.md)
