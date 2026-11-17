---
title: Java 集合框架详解
category:
  - Java
tag:
  - Collections
  - HashMap
  - Queue
description: 按复杂度、有序性和并发语义选择 Java 集合，并给出工程化使用方法。
order: 1
outline: [2, 3]
---

# Java 集合框架详解

## 学习目标

- 熟悉 `Collection`、`Map`、`Iterable` 与 Java Stream 的职责边界。
- 能解释 `ArrayList`、`HashMap`、`TreeMap`、`ConcurrentHashMap` 等实现的取舍。
- 能为缓存、去重、排序、任务队列和高并发计数选择正确容器。

## 适用场景

适用于 JVM 内数据处理。超大数据集、跨进程数据和持久化查询应交给数据库、文件或专用存储；共享可变集合跨线程使用时必须采用并发容器或外部同步，普通集合不能因为“只是读”就默认线程安全。

## 核心概念

### 框架结构

```text
Iterable
└── Collection
    ├── List       有序、可重复
    ├── Set        不可重复
    └── Queue/Deque 入队、出队和双端操作
Map 独立于 Collection：键值映射，键通常不可重复
```

“有序”可能指插入顺序、访问顺序或自然顺序，必须看具体实现。`HashSet` 的无序不等于随机，`LinkedHashSet` 保留插入顺序，`TreeSet` 按比较规则排序。

### 选择矩阵

| 需求 | 首选 | 关键原因 | 注意 |
| --- | --- | --- | --- |
| 随机访问、尾部追加 | `ArrayList` | 连续数组、缓存友好 | 中间插入代价高 |
| 频繁头尾操作 | `ArrayDeque` | 简单循环队列 | 不允许 `null` |
| 键值查找 | `HashMap` | 平均 O(1) | 无顺序保证 |
| 按键排序 | `TreeMap` | O(log n) | 比较器必须与 equals 一致 |
| 保留插入顺序 | `LinkedHashMap` | 双向链表 + 哈希表 | 内存开销较高 |
| 高并发键值更新 | `ConcurrentHashMap` | 分段/CAS 协作 | 复合操作仍需原子 API |
| 去重流式统计 | `ConcurrentHashMap` + 原子值 | 局部更新 | 注意条目生命周期 |

### 常用实现

- `ArrayList`：扩容会复制数组，预估容量可减少扩容，但不要一次分配过大的无界容量。
- `LinkedList`：节点分配多、局部性差，只有明确需要实现 `Deque` 契约且负载很特殊时才考虑；通常 `ArrayDeque` 更快。
- `HashMap`：键的 `hashCode` 和 `equals` 必须一致；允许一个 `null` 键。容量和负载因子影响冲突与内存。
- `HashSet`：底层通常是 `HashMap`，元素就是键，值使用共享占位对象。
- `TreeMap`：比较器为零视为相等；比较器与 `equals` 不一致会导致“相等键”无法按预期去重。
- `PriorityQueue`：队首是优先级最小/最大元素，遍历顺序不是全局排序。
- `Collections.unmodifiableX` 是只读视图，底层仍可变化；`List.copyOf` 创建不可变副本。

### Stream 与集合

Stream 描述惰性流水线，适合过滤、映射、聚合和并行处理；可变结果应使用 `Collectors` 的专用收集器。不要在终端操作后继续使用流，也不要在流中执行数据库或网络调用后再盲目并行。

## 工程实现

```java
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

public final class ProductIndex {
    private final Map<String, Set<String>> tagToProductIds = new ConcurrentHashMap<>();
    private final Map<String, LongAdder> queryCounters = new ConcurrentHashMap<>();

    public void index(String productId, Collection<String> tags) {
        for (String tag : tags) {
            tagToProductIds
                .computeIfAbsent(tag, ignored -> ConcurrentHashMap.newKeySet())
                .add(productId);
        }
    }

    public Set<String> findByTag(String tag) {
        Set<String> ids = tagToProductIds.getOrDefault(tag, Set.of());
        return Set.copyOf(ids);
    }

    public void countQuery(String tag) {
        queryCounters.computeIfAbsent(tag, ignored -> new LongAdder()).increment();
    }
}

// 使用：防止无界增长必须设置淘汰策略或外部存储。
```

单元测试应覆盖重复元素、顺序契约、不可变返回值以及并发更新；性能测试必须使用接近生产的键分布，避免只测唯一短字符串。

## 生产实践

- 集合有界化：缓存使用 Caffeine 等带容量、时间和引用淘汰策略的实现。
- 不要把可变对象放入 `HashSet` 或作为 `HashMap` 键后修改参与 `hashCode` 的字段。
- 返回集合时使用 `List.copyOf`/`Set.copyOf` 防止调用方修改内部状态。
- 并发计数使用 `LongAdder`，精确顺序或单值原子读取使用 `AtomicLong`。
- 大集合关注装箱、对象头和节点开销；必要时使用原始类型集合或数据库下推聚合。
- Stream 并行化先测量数据量、线程池、内存带宽和副作用，不能以 CPU 核数直接判断收益。

## 常见问题

### `HashMap` 为什么线程不安全？

并发写可能丢失更新、扩容时链表/树结构不一致，读到不完整状态。共享读写使用 `ConcurrentHashMap`，但 `get + put` 仍不是原子操作，应使用 `compute`、`merge` 或 `replace` 等原子方法。

### 遍历时删除为什么抛 `ConcurrentModificationException`？

结构性修改会增加 `modCount`，迭代器发现预期值不一致后快速失败。使用 `Iterator.remove`、`removeIf` 或收集后批量修改。

### `HashMap` 的容量为什么建议是 2 的幂？

常见实现用掩码定位桶，2 的幂使索引计算简单且分布稳定。除非有测量依据，不要覆盖默认负载因子。

### 面试追问：`HashMap` 何时树化？

常见 JDK 实现中，桶内节点达到阈值且表容量足够时转为红黑树，节点过少会退化回链表；精确阈值随版本实现细节可能变化，应以目标 JDK 源码和文档为准。

## 总结与延伸

集合选择应由操作复杂度、顺序、并发和生命周期共同决定。并发更新进一步学习[J.U.C](../thread/java-thread-x-juc-overview.md)，JVM 内存影响参见[JMM 内存结构](../jvm/java-jvm-jmm-struct.md)。

## 关联阅读

- [Java 面向对象基础](../basic/java-basic-oop.md)
- [J.U.C 知识体系详解](../thread/java-thread-x-juc-overview.md)
- [JMM 内存结构详解](../jvm/java-jvm-jmm-struct.md)
