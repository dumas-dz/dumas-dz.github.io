---
title: JVM 垃圾回收机制
category:
  - Java
tag:
  - GC
  - G1
  - ZGC
description: 对象可达性、分代与垃圾回收器、GC 日志和停顿调优方法。
order: 3
outline: [2, 3]
---

# JVM 垃圾回收机制

## 学习目标

- 理解可达性分析、对象晋升、分配和回收成本。
- 了解 Serial、Parallel、G1、ZGC 等回收器的目标与边界。
- 能通过 GC 日志、堆转储和分配指标处理停顿与内存问题。

## 适用场景

适用于 Java 服务吞吐、延迟、内存和升级决策。GC 调优应在真实负载和明确 SLO 下进行；“回收次数少”不等于好，频繁 YGC 可能是健康短命对象的表现，也可能伴随分配过量。

## 核心概念

### 对象存活与回收

GC 从 GC Roots 出发标记可达对象，不可达对象可回收。引用处理、终结和弱/软引用会增加复杂度。`finalize` 已废弃，业务资源必须显式关闭；Cleaner 只适合兜底，不替代生命周期管理。

### 分代与区域模型

传统分代假设多数对象朝生夕死，分为年轻代和老年代。G1 把堆划分为 Region，按停顿目标优先回收收益高的区域；ZGC/Shenandoah 等以低停顿为目标。对象何时晋升由年龄、区域容量、分配压力和具体回收器决定。

### 回收器选择

| 回收器 | 目标 | 常见场景 | 注意 |
| --- | --- | --- | --- |
| Serial | 简单、小堆 | 单核/小工具 | 停顿明显 |
| Parallel | 吞吐优先 | 批处理 | 长停顿可能高 |
| G1 | 停顿与吞吐平衡 | 默认通用服务 | 有并发标记和预测成本 |
| ZGC | 低停顿、较大堆 | 延迟敏感 | 版本、平台和内存余量需验证 |

具体默认值和特性随 JDK 版本变化，以目标 JDK 文档和压测为准。

### GC 日志与关键指标

观察 Young/Mixed/Full GC、原因、每阶段耗时、堆占用前后、晋升、并发标记和停顿目标。区分分配触发与老年代压力；Full GC 可能来自元空间、显式 System.gc、JNI 或晋升失败，必须看完整原因。

## 工程实现

JDK 9+ 统一日志示例：

```bash
java -Xms4g -Xmx4g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -Xlog:gc*,gc+heap=debug,gc+age=trace:file=logs/gc.log:time,uptime,level,tags:filecount=5,filesize=50m \
  -jar service.jar
```

建议同时开启稳定 JFR 记录，用于关联分配、对象统计和线程事件：

```bash
jcmd <pid> JFR.start name=service duration=30m filename=service.jfr settings=profile
```

## 生产实践

- 先控制对象分配、缓存、批量大小和响应体，再调整堆与回收器。
- 给堆留出元空间、线程、直接内存、代码缓存和进程缓冲空间。
- 基于 P95/P99、GC 停顿、吞吐和 CPU 评估结果，不使用平均值掩盖尾延迟。
- Full GC、晋升失败和并发模式失败进入告警，并保留前后 30 分钟 JFR/GC 日志。
- 业务调用中避免显式 `System.gc()`；需要释放直接内存应正确关闭通道和缓冲。

## 常见问题

### 频繁 Young GC 是否要扩大年轻代？

不一定。先看分配速率、对象生命周期和停顿；扩大年轻代可能增加单次停顿或晋升问题。短命对象高分配可通过复用/切片/减少中间对象优化。

### 为什么堆转储打开后找不到明显大对象？

泄漏可能是大量中小对象、类加载器、ThreadLocal、缓存链或堆外内存。使用支配树、类直方图、引用链和 NMT 结合分析。

### G1 的 Mixed GC 与 Full GC 如何区分？

Mixed GC 回收年轻代和部分老年代 Region；Full GC 通常是兜底的全堆回收，往往更长。关注触发原因和连续 Full GC。

### 面试追问：三色标记是什么？

并发标记中用白、灰、黑表示未访问、已发现但未扫描、已扫描对象。写屏障和 SATB 等机制处理并发标记期间的引用变化，避免漏标。

## 总结与延伸

GC 调优的对象是业务延迟与内存成本。内存结构见[JMM 内存结构](./java-jvm-jmm-struct.md)，实际定位使用[调试排错](./java-jvm-debug-tools-ref.md)。

## 关联阅读

- [JMM 内存结构详解](./java-jvm-jmm-struct.md)
- [Java 调试排错相关](./java-jvm-debug-tools-ref.md)
- [Java 并发知识体系](../thread/java-thread-x-overview.md)
