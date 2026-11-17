---
title: Java 面向对象基础
category:
  - Java
tag:
  - OOP
  - 设计原则
description: 使用封装、组合、接口和多态构建可维护 Java 业务模块的实践指南。
order: 2
outline: [2, 3]
---

# Java 面向对象基础

## 学习目标

- 理解对象、类、接口、继承和多态在 JVM 中的实际含义。
- 能用封装和组合建立稳定模块边界，而不是堆叠继承层级。
- 掌握 SOLID 的工程取舍，并能评审常见领域模型问题。

## 适用场景

适合业务服务、SDK、领域模型和框架扩展点设计。数据传输对象、数据库行映射对象不应强行复用领域实体；高性能数值计算或跨语言交换模型也不应为了“纯 OOP”牺牲数据布局和协议稳定性。

## 核心概念

### 对象与责任

对象封装“状态 + 对行为的约束”，而不是只包一层 getter/setter。构造完成后尽量保持不变；需要变化时通过有业务语义的方法完成，并维持对象不变量。

### 组合优先于继承

继承表达稳定的 `is-a` 关系并共享实现，组合表达 `has-a` 或可替换能力。继承会暴露父类实现耦合，父类新增方法可能破坏子类假设；策略、装饰器、观察者等模式通常更适合运行时组合。

### 接口与抽象类

| 能力 | 接口 | 抽象类 |
| --- | --- | --- |
| 多实现 | 支持 | 不支持 |
| 状态与模板方法 | 默认方法有限支持 | 适合 |
| 契约稳定 | 适合定义能力 | 适合共享骨架 |
| 演进 | 可加默认方法 | 修改受继承关系约束 |

### 多态与动态绑定

接口引用指向不同实现，调用在运行时按实际类型绑定。框架大量依赖该机制完成注入、代理和扩展；但不要为了“以后可能替换”给只有一个实现且稳定的概念过早抽象。

### SOLID 的工程解释

- **SRP**：一个类只有一个变化原因，不等于只能有一个方法。
- **OCP**：通过稳定抽象扩展行为，而不是到处修改条件分支。
- **LSP**：子类型不能让调用方依赖运行时类型猜测。
- **ISP**：接口按调用方所需能力拆分，避免“大而全”。
- **DIP**：高层策略依赖契约，具体基础设施在边界注入。

## 工程实现

```java
import java.util.List;

interface PricePolicy {
    Price quote(Order order);
}

final class DefaultPricePolicy implements PricePolicy {
    private final TaxClient taxClient;
    private final List<DiscountRule> discountRules;

    public DefaultPricePolicy(TaxClient taxClient, List<DiscountRule> discountRules) {
        this.taxClient = taxClient;
        this.discountRules = List.copyOf(discountRules);
    }

    @Override
    public Price quote(Order order) {
        Price base = order.basePrice();
        for (DiscountRule rule : discountRules) {
            base = rule.apply(base, order);
        }
        return taxClient.addTax(base, order.shippingAddress());
    }
}

record Price(long amountMinor, String currency) {}
record Order(Price basePrice, Address shippingAddress) {}
interface TaxClient { Price addTax(Price price, Address address); }
interface DiscountRule { Price apply(Price price, Order order); }
record Address(String country, String postalCode) {}
```

`DefaultPricePolicy` 依赖抽象并使用不可变集合。测试可注入固定税率和折扣规则，不需要连接真实税服务。

## 生产实践

- 领域对象暴露行为，DTO 负责协议映射，Entity 负责持久化，避免一个类同时承担三种职责。
- 对外接口保持窄而稳定；内部实现允许演进。
- 不可变对象使用防御性复制，集合字段在构造和返回时复制。
- 使用构造器表达必填依赖，Setter 仅用于框架确实要求的可选配置。
- 代码评审检查继承深度、循环依赖、职责模糊和暴露内部可变状态。

## 常见问题

### 为什么贫血模型不一定是错？

如果业务规则集中在领域对象，实体较薄是正常结果。真正的问题是业务规则散落在多个 Service 并重复校验，或对象只有无意义 getter/setter。

### 接口只有一个实现还要抽象吗？

先从具体实现开始；当出现多个实现、需要隔离外部依赖、测试替换或稳定插件边界时再引入接口。

### `equals` 与对象身份如何选择？

值对象按值比较，实体通常以稳定 ID 比较身份。可变对象作为 Map 键时要谨慎，因为修改参与哈希的字段会破坏查找。

### 面试追问：重载和重写有什么区别？

重载在编译期按参数类型选择，属于静态分派；重写在运行时按实际对象类型选择，属于动态分派。

## 总结与延伸

面向对象设计的核心是职责、契约和变化方向，而不是语法数量。后续将这些原则用于[Java 集合](../collection/java-collection-overview.md)和[Spring IoC](../../spring/spring-framework/spring-framework-ioc.md)。

## 关联阅读

- [Java 基础知识体系](./java-basic-bok.md)
- [Java 集合框架详解](../collection/java-collection-overview.md)
- [Spring IoC 容器](../../spring/spring-framework/spring-framework-ioc.md)
