---
title: Spring 框架知识体系
category:
  - Spring
tag:
  - Spring Framework
  - 架构
description: Spring Framework 的能力地图、运行模型、版本边界和学习路线。
order: 1
outline: [2, 3]
---

# Spring 框架知识体系

## 学习目标

- 掌握 Spring Framework 的分层能力和核心运行模型。
- 能区分 Framework、Boot、Security、Data、Cloud 的职责。
- 能根据 Java/Spring 版本选择受支持 API 和升级路径。

## 适用场景

Spring Framework 适用于依赖管理、企业集成、Web 服务、事务、消息和测试等 JVM 应用。简单命令行工具或极小服务未必需要完整容器；响应式高吞吐系统可评估 WebFlux，但必须接受 Reactor 编程模型和生态约束。

## 核心概念

### 能力地图

```text
Core Container: Beans / Core / Context / Expression
Data Access: JDBC / Transactions / ORM / RDATA
Web: Servlet MVC / WebFlux / WebSocket
Integration: Messaging / Remoting / Scheduling
Testing: MockMvc / TestContext / Jupiter
Observability: Micrometer Bridge / Context Propagation
```

Spring 的关键价值是统一对象创建、配置、代理和扩展点，让业务组件专注契约。它不自动消除领域复杂度，也不替代数据库事务、消息确认和安全边界。

### 控制流

1. 读取配置和组件定义。
2. 实例化 Bean，解析构造依赖。
3. 应用 `BeanPostProcessor`、AOP 代理和初始化回调。
4. 运行应用，按请求/消息调用组件。
5. 容器关闭时执行销毁回调并释放资源。

### Framework、Boot 与 Cloud

| 层 | 负责 | 不负责 |
| --- | --- | --- |
| Framework | IoC、AOP、Web、事务等基础 | 自动选择依赖和生产装配 |
| Boot | 自动配置、内嵌服务器、配置绑定、健康检查 | 服务注册、限流和网关 |
| Cloud | 服务发现、配置、网关、熔断、链路 | 单服务内部领域逻辑 |

### 版本与兼容

Spring Framework 6 要求 Java 17 基线并使用 Jakarta EE 9+ 命名空间；Spring Boot 3 对自动配置、Security、Actuator 和原生镜像行为均有演进。升级先阅读 release notes 和迁移指南，使用 OpenRewrite 等工具后仍需编译、测试和代理行为验证。

## 工程实现

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration(proxyBeanMethods = false)
public class ServiceConfiguration {
    @Bean
    OrderService orderService(OrderRepository repository, Environment environment) {
        int batchSize = environment.getProperty("order.batch-size", Integer.class, 100);
        return new DefaultOrderService(repository, batchSize);
    }

    public interface OrderRepository {}
    public interface OrderService {}
    public static final class DefaultOrderService implements OrderService {
        DefaultOrderService(OrderRepository repository, int batchSize) {}
    }
}
```

`proxyBeanMethods = false` 可减少配置类 CGLIB 代理，但要求方法调用不依赖单例代理语义。测试应分别验证容器配置和业务类，避免所有测试都启动完整应用。

## 生产实践

- 组件契约优先使用构造器注入，保持依赖不可变且可在普通单元测试中构造。
- 将自动配置视为默认值，通过显式 Bean、Properties 或 `@Conditional` 建立稳定边界。
- 只声明所需 Starter，定期清理未使用依赖和 actuator 端点。
- 对升级建立兼容矩阵：JDK、Spring、Jakarta、数据库驱动、代理和字节码工具。
- 监控容器启动、Bean 创建失败、配置来源和关键组件版本。

## 常见问题

### 为什么 Bean 创建时报循环依赖？

Spring 对某些 setter/字段注入有有限的循环依赖处理，但构造器循环、原型 Bean 和异步代理无法自动解决。拆分职责或引入明确的生命周期协调对象，不要仅改成 Setter 注入。

### 为什么普通 `new` 出来的对象没有事务/AOP？

Spring AOP 主要通过容器代理管理 Bean。脱离容器创建的对象不会经过代理；同类方法内部调用也通常绕过代理。

### `@Component`、`@Service`、`@Repository` 有什么本质差别？

它们大多都是组件扫描入口，语义帮助表达职责；`@Repository` 还可能应用异常转换。不要根据注解名假设事务、锁或业务边界自动存在。

### 面试追问：Spring 如何实现松耦合？

通过接口契约、依赖注入、容器生命周期、策略选择和 AOP 横切，但真正的松耦合还依赖清晰领域边界和避免共享可变模型。

## 总结与延伸

Spring 的核心是容器、代理和可扩展生命周期。模块组成见[Spring 框架组成](./spring-framework-introduce.md)，容器细节见[IoC](./spring-framework-ioc.md)。

## 关联阅读

- [Spring 框架组成](./spring-framework-introduce.md)
- [控制反转（IoC）](./spring-framework-ioc.md)
- [面向切面编程（AOP）](./spring-framework-aop.md)
