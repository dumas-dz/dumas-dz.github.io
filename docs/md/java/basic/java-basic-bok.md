---
title: Java 基础知识体系
category:
  - Java
tag:
  - Java 基础
  - 类型系统
  - 异常
description: 从类型、对象、异常、泛型到现代 Java 语法的工程化基础知识。
order: 1
outline: [2, 3]
---

# Java 基础知识体系

## 学习目标

- 理解 Java 的编译、类加载和执行模型，避免把 Java 与 JVM 规范混为一谈。
- 正确处理基本类型、包装类型、字符串、日期、异常和泛型。
- 能编写边界清晰、可测试且对 `null` 和溢出有明确策略的业务代码。

## 适用场景

适用于 Java 8 LTS 及以上版本的服务端开发。Java 17 是当前常见的 LTS 基线，Java 21 引入虚拟线程等能力；示例不依赖预览特性。底层框架实现、性能调优和并发正确性分别参见 JVM、集合和并发章节。

## 核心概念

### 编译与运行模型

`.java` 源文件编译为平台无关的 `.class` 字节码，由 JVM 的类加载器装载、校验并交给执行引擎。源码兼容不代表字节码或运行时行为兼容，升级 JDK 时应同时验证依赖、反射、代理和序列化。

### 类型与值语义

| 类别 | 示例 | 工程要点 |
| --- | --- | --- |
| 原始类型 | `int`、`long` | 有固定范围，运算溢出不会自动报错 |
| 包装类型 | `Integer`、`Long` | 可为 `null`，可参与泛型，存在缓存和拆箱风险 |
| 引用类型 | 类、接口、数组 | 默认值不等于业务上的“无值” |
| 不可变类型 | `String`、记录类 | 适合跨线程共享，值变化时创建新对象 |

`==` 对引用类型比较引用，业务值比较应使用 `equals`；实现 `equals` 时必须同时实现 `hashCode`。金额不要使用 `float` 或 `double`，应使用 `BigDecimal` 或最小货币单位的整数。

### 字符串与文本

`String` 不可变，拼接循环应使用 `StringBuilder`。格式化输出优先使用 `String.format` 或格式化 API；日志参数化可减少无谓拼接，但仍应避免把敏感数据写入日志。

### 异常

受检异常适合调用方必须处理的可恢复条件；现代服务端代码通常把底层异常转换为稳定的业务异常，并在边界层统一返回错误。不要捕获 `Throwable`，不要用异常做普通分支，`finally` 中避免覆盖原异常。

### 泛型与现代语法

泛型在编译期提供类型检查，运行时会类型擦除。通配符 `? extends T` 适合读取，`? super T` 适合写入。增强 `switch`、记录类、`var`、文本块和模式匹配可以减少样板代码，但公开 API 的可读性优先于局部简写。

## 工程实现

```java
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

public record Money(long amountMinor, String currency) {
    public Money {
        if (amountMinor < 0) {
            throw new IllegalArgumentException("amountMinor must be >= 0");
        }
        Objects.requireNonNull(currency, "currency");
    }

    public Money add(Money other) {
        if (!currency.equals(other.currency())) {
            throw new IllegalArgumentException("currency mismatch");
        }
        return new Money(amountMinor + other.amountMinor(), currency);
    }

    public BigDecimal toDecimal() {
        return BigDecimal.valueOf(amountMinor, 2);
    }
}

final class Order {
    private final String id;
    private final Instant createdAt;
    private final Money total;

    Order(String id, Instant createdAt, Money total) {
        this.id = Objects.requireNonNull(id);
        this.createdAt = Objects.requireNonNull(createdAt);
        this.total = Objects.requireNonNull(total);
    }
}
```

上述示例使用不可变对象、集中校验和明确货币单位。测试应覆盖空值、溢出、货币不一致以及跨日期边界。

## 生产实践

- 所有外部输入在边界处校验，内部方法保持前置条件简洁。
- 为时间、随机数和外部调用注入依赖，避免测试依赖真实时钟和网络。
- 对整数运算明确溢出策略；对金额记录币种、精度和舍入规则。
- 日志记录上下文 ID 和错误摘要，不记录密码、令牌或完整个人数据。
- 升级 JDK 时运行完整测试，并检查依赖字节码版本、内部 API、GC 和 TLS 行为。

## 常见问题

### `Integer` 比较为什么有时错误？

`==` 比较对象引用。即使小整数可能命中缓存，也不应依赖该实现细节；统一使用 `equals` 或先转换为原始值。

### `BigDecimal.equals` 为何认为 `1.0` 和 `1.00` 不同？

`equals` 同时比较值和标度。仅比较数值时使用 `compareTo(...) == 0`，但存储和输出仍应统一标度。

### 为什么捕获异常后吞掉日志很危险？

调用方无法感知失败，问题会延迟暴露。应记录足够的诊断上下文，并返回错误、重试或降级；吞异常必须有明确理由。

### 面试追问：Java 是解释执行还是编译执行？

HotSpot 先解释字节码，热点代码经 JIT 编译为本地代码，并结合分层编译、内联和逃逸分析优化。

## 总结与延伸

Java 基础的价值在于建立可预测的值语义、边界校验和错误处理习惯。下一步学习[面向对象设计](./java-basic-oop.md)，并通过[集合框架](../collection/java-collection-overview.md)把数据结构选择落实到工程中。

## 关联阅读

- [Java 面向对象基础](./java-basic-oop.md)
- [Java 集合框架详解](../collection/java-collection-overview.md)
- [JMM 内存结构详解](../jvm/java-jvm-jmm-struct.md)
