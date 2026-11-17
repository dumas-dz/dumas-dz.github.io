---
title: Java 调试排错相关
category:
  - Java
tag:
  - 诊断
  - JFR
  - 线程转储
description: 使用 JDK 工具、日志、JFR、堆转储和线程转储定位 Java 生产问题。
order: 5
outline: [2, 3]
---

# Java 调试排错相关

## 学习目标

- 建立从症状、时间线到证据的生产排障流程。
- 能使用 `jcmd`、`jmap`、`jstack`、JFR、GC 日志和 APM。
- 能定位 CPU 高、内存泄漏、GC 停顿、线程卡住和类加载异常。

## 适用场景

适用于线上或预发 JVM 故障。优先使用低开销、只读、可重复的诊断动作；调试器、全量堆转储和逐类 verbose 可能影响性能，应有变更审批和回滚条件。涉及用户数据时要脱敏并限制留存时间。

## 核心概念

### 排障框架

1. **确定影响**：时间窗、实例、接口、错误率、延迟和版本。
2. **建立时间线**：发布、流量、配置、GC、线程、下游故障。
3. **形成假设**：资源、代码、数据、依赖、并发、配置。
4. **收集最小证据**：指标、日志、JFR、线程栈、堆或 NMT。
5. **验证与恢复**：扩容/重启/回滚只用于止血，随后定位根因。
6. **复盘**：补充监控、测试、容量和 runbook。

### 症状与工具

| 症状 | 首选证据 | 辅助证据 |
| --- | --- | --- |
| CPU 高 | JFR Execution Sample、`top -H` + `jstack` | JIT、锁竞争、GC |
| 内存增长 | 堆指标、类直方图、堆转储 | NMT、JFR Object Allocation |
| GC 停顿 | GC 日志、JFR GC Pause | 分配、晋升、堆转储 |
| 线程卡死 | 线程转储序列、锁、队列指标 | JFR、依赖超时 |
| OOM/进程退出 | 容器事件、退出码、启动参数 | Heap dump on OOM、NMT |
| 类/代理错误 | verbose class、依赖树、字节码版本 | Agent 日志、模块参数 |

### JDK 命令

```bash
jps -lv
jcmd <pid> VM.version
jcmd <pid> VM.flags
jcmd <pid> GC.heap_info
jcmd <pid> Thread.print
jcmd <pid> GC.class_histogram
jcmd <pid> JFR.start name=incident duration=10m filename=incident.jfr settings=profile
jcmd <pid> VM.native_memory summary
jmap -histo:live <pid>
```

`jmap`、全量 heap dump 和 verbose 参数可能造成停顿；优先 JFR 和受控容器执行。`jstack` 应至少连续采集 3 次，间隔数秒，以区分瞬时等待和长期卡死。

## 工程实现

生产诊断入口可以由受保护的运维接口触发，但必须鉴权、审计并限制频率：

```java
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadInfo;
import java.lang.management.ThreadMXBean;

public final class ThreadSnapshot {
    public static String capture() {
        ThreadMXBean bean = ManagementFactory.getThreadMXBean();
        ThreadInfo[] infos = bean.dumpAllThreads(true, true, 20);
        StringBuilder output = new StringBuilder();
        for (ThreadInfo info : infos) {
            output.append(info.toString()).append(System.lineSeparator());
        }
        return output.toString();
    }
}
```

线程转储可能包含认证、SQL、消息或业务 ID，输出到受控存储并设置保留期；不要通过普通业务接口公开。

## 生产实践

- 常开低开销 JFR 或采样 APM，事故时提高采样而不是临时解释不存在的数据。
- 每个实例采集时记录 PID、容器、JDK、启动参数和发布版本。
- 日志包含 trace ID、线程名、业务 ID、耗时和错误摘要，敏感字段脱敏。
- OOM 自动 heap dump 到独立挂载盘，并控制文件数量和磁盘水位。
- 为常见故障准备 runbook：CPU、内存、线程池、死锁、数据库连接、JDK 升级。

## 常见问题

### 如何区分 CPU 高来自业务还是 GC？

先看 GC CPU 和停顿，再对高 CPU 线程采样；JFR 能把 Allocation/GC/CPU 事件关联到同一时间线。

### 连续线程转储如何判断死锁？

`jstack` 可直接报告部分死锁；人工分析时看多个线程的锁获取顺序、等待对象和循环依赖。业务队列、数据库和分布式锁不一定会出现在 JVM 死锁报告中。

### 重启后问题消失还要分析吗？

要。重启只恢复服务，不解释触发条件。保留重启前 JFR、日志、线程/堆转储、版本和流量数据。

### 面试追问：为什么平均 CPU 不高但请求很慢？

可能是少量热点线程、长尾锁等待、下游超时、队列积压、GC 停顿或资源池饱和。查看分位数、线程状态和每阶段耗时，而非平均值。

## 总结与延伸

生产排障依赖证据链和时间线。内存基础见[JMM 内存结构](./java-jvm-jmm-struct.md)，GC 见[垃圾回收](./java-jvm-gc.md)，线程问题见[并发知识体系](../thread/java-thread-x-overview.md)。

## 关联阅读

- [JMM 内存结构详解](./java-jvm-jmm-struct.md)
- [JVM 垃圾回收机制](./java-jvm-gc.md)
- [Java 并发知识体系](../thread/java-thread-x-overview.md)
