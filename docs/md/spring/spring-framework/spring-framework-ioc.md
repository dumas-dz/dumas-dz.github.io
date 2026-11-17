---
title: 控制反转（IoC）
category:
  - Spring
tag:
  - IoC
  - DI
  - Bean 生命周期
description: Spring IoC 容器的 Bean 定义、依赖注入、作用域、生命周期和扩展点。
order: 3
outline: [2, 3]
---

# 控制反转（IoC）

## 学习目标

- 理解控制反转、依赖注入、BeanDefinition 和容器生命周期。
- 掌握构造器注入、限定符、条件装配、作用域和延迟初始化。
- 能解决循环依赖、代理失效、作用域泄漏和启动失败。

## 适用场景

IoC 适合管理服务、仓储、客户端、配置和策略对象。值对象、简单 DTO、局部算法对象直接构造更清晰；每请求业务模型不应注册为单例。原型 Bean 的释放责任通常由调用方承担。

## 核心概念

### IoC 与 DI

控制反转把对象创建和依赖解析从调用方移交给容器；依赖注入通过构造器、工厂方法或配置把依赖传入对象。这样可以解耦具体实现、集中配置和替换测试替身，但隐藏过多容器魔法会降低可读性。

### Bean 生命周期

```text
扫描/读取 BeanDefinition
-> 实例化（构造器/工厂）
-> 属性和依赖填充
-> Aware 回调
-> BeanPostProcessor.before
-> @PostConstruct / InitializingBean
-> BeanPostProcessor.after（常生成代理）
-> 使用
-> @PreDestroy / DisposableBean
-> 容器关闭
```

`@Autowired` 的解析顺序通常包含类型、限定符、名称和主候选；有歧义时应显式 `@Qualifier` 或使用 `@Bean` 方法，避免依赖扫描顺序。

### 注入方式

| 方式 | 优点 | 限制 |
| --- | --- | --- |
| 构造器注入 | 必填依赖清晰、不可变、易测试 | 循环依赖直接暴露 |
| Setter 注入 | 可选依赖、可重配 | 对象可能半初始化 |
| 字段注入 | 代码少 | 隐藏依赖、测试难、框架耦合 |

Spring Framework 6.1 起推荐只声明一个构造器，未标注 `@Autowired` 的单一构造器通常可被使用；最终以目标版本文档为准。

### 作用域

默认 singleton 每个容器一个实例，不是全局单例；prototype 每次获取/注入都新建实例；Web 环境还有 request、session、application 等作用域。单例 Bean 不得持有短生命周期请求数据，若必须持有则使用作用域代理、Provider 或显式上下文对象。

## 工程实现

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.*;
import org.springframework.stereotype.Service;

public interface PaymentGateway {
    PaymentResult pay(Payment payment);
}

record Payment(String orderId, long amountMinor) {}
record PaymentResult(boolean success) {}

@Service
class OrderPaymentService {
    private final PaymentGateway primary;
    private final PaymentGateway fallback;

    OrderPaymentService(
        @Qualifier("primaryPaymentGateway") PaymentGateway primary,
        @Qualifier("fallbackPaymentGateway") PaymentGateway fallback
    ) {
        this.primary = primary;
        this.fallback = fallback;
    }

    PaymentResult pay(Payment payment) {
        return primary.pay(payment);
    }
}

@Configuration(proxyBeanMethods = false)
class PaymentConfiguration {
    @Bean("primaryPaymentGateway")
    PaymentGateway primaryPaymentGateway() {
        return payment -> new PaymentResult(true);
    }

    @Bean("fallbackPaymentGateway")
    PaymentGateway fallbackPaymentGateway() {
        return payment -> new PaymentResult(false);
    }
}
```

接口和记录类型因篇幅整合在同一源码块；拆分到真实项目时按包组织。测试通过直接构造 `OrderPaymentService` 即可，无需启动 Spring。

## 生产实践

- 必填依赖使用构造器，不把容器当 Service Locator。
- 配置类使用 `proxyBeanMethods=false`，除非依赖 `@Bean` 方法的代理单例语义。
- 外部资源统一关闭，`@PreDestroy` 不执行于 `kill -9` 或进程崩溃。
- 多实现策略用限定符、Map 注入或显式工厂，不使用类型擦除和字符串名称隐式约定。
- 启动失败保留 Bean 名称、候选列表和配置来源。

## 常见问题

### 如何消除循环依赖？

提取共同状态/职责到第三个对象，改用事件异步解耦，或重新设计双向关系。临时改为 Setter 注入可能让对象进入不一致中间态。

### 为什么 `@Async`、`@Transactional` 内部调用不生效？

同类 `this.method()` 绕过代理。抽取协作 Bean、使用代理自注入需谨慎，或通过 AopContext 暴露代理（通常不推荐）。

### 单例 Bean 为什么必须线程安全？

它在多个请求/线程间共享。局部变量天然封闭，请求状态放在方法参数或作用域对象中，共享缓存使用并发安全结构。

### 面试追问：构造器注入为什么优于字段注入？

依赖显式、可空性清晰、无需容器即可测试，并能构造不可变对象；字段注入隐藏复杂度且让类与 Spring API 耦合。

## 总结与延伸

IoC 的工程价值来自明确依赖和生命周期。代理行为见[AOP](./spring-framework-aop.md)，应用装配见[Spring 框架组成](./spring-framework-introduce.md)。

## 关联阅读

- [面向切面编程（AOP）](./spring-framework-aop.md)
- [Java 面向对象基础](../../java/basic/java-basic-oop.md)
- [Spring 框架组成](./spring-framework-introduce.md)
