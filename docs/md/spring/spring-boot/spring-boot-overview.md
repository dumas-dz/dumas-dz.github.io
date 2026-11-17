---
title: Spring Boot 知识体系
category:
  - Spring
tag:
  - Spring Boot
  - 自动配置
description: Spring Boot 自动配置、生命周期、配置管理、测试和可观测性的整体路线。
order: 1
outline: [2, 3]
---

# Spring Boot 知识体系

## 学习目标

- 理解 Starter、自动配置、条件装配和配置绑定。
- 掌握应用启动、健康状态、优雅停机、测试和依赖治理。
- 能建立可上线的 Spring Boot 服务基线。

## 适用场景

Spring Boot 适合快速构建独立 JVM 服务、批处理和 Web 应用。需要极致启动和低内存可评估原生镜像或更轻框架，但应权衡反射配置、调试和生态。Spring Boot 不能自动解决数据库一致性、分布式事务和外部系统故障。

## 核心概念

### 自动配置

自动配置根据 Classpath、属性、已有 Bean 和条件注解决定是否注册默认组件。它提供“可覆盖的默认值”，不是黑盒魔法。通过 `@AutoConfiguration`、`@ConditionalOnClass`、`@ConditionalOnMissingBean` 等扩展，Starter 应保持条件化和可替换。

### 配置层级

```text
命令行参数 / 环境变量
-> application-{profile}.yml
-> application.yml
-> 默认值
```

具体优先级以 `ConfigDataEnvironmentPostProcessor` 文档为准。敏感值来自环境或 Secret Manager，不提交仓库；配置变更可审计、可回滚。`ConfigurationProperties` 提供类型化绑定和校验，适合成组业务配置。

### 生命周期

应用启动完成不等于下游就绪。通过 readiness/liveness 区分进程存活和可接流量，初始化外部资源时支持超时、重试和隔离。停机先从负载均衡摘除，停止接收新请求，等待在途任务，再关闭连接池、消息消费者和执行器。

### 测试层次

| 层次 | 工具 | 目标 |
| --- | --- | --- |
| 单元测试 | JUnit、Mockito | 业务逻辑，快速 |
| 切片测试 | `@WebMvcTest`、`@DataJpaTest` | Web/数据边界 |
| 集成测试 | Testcontainers、SpringBootTest | 真实协议和依赖 |
| 契约测试 | OpenAPI、WireMock | 上下游兼容 |
| 性能/故障测试 | JMeter、k6、混沌实验 | SLO、过载、恢复 |

不要把所有测试都启动完整 Spring Context，也不要用 Mock 掩盖真实 SQL、序列化和事务问题。

## 工程实现

```yaml
spring:
  application:
    name: order-service
  lifecycle:
    timeout-per-shutdown-phase: 20s
  datasource:
    hikari:
      maximum-pool-size: 20
      connection-timeout: 2s
      validation-timeout: 1s

server:
  shutdown: graceful
  port: 8080

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    health:
      probes:
        enabled: true
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@SpringBootApplication
@EnableConfigurationProperties(OrderProperties.class)
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}

@Validated
@ConfigurationProperties("order")
class OrderProperties {
    private int batchSize = 100;
    public int getBatchSize() { return batchSize; }
    public void setBatchSize(int batchSize) { this.batchSize = batchSize; }
}
```

生产环境应限制 actuator 暴露、启用安全策略、结构化日志和 Micrometer 指标。

## 生产实践

- 启动失败输出版本、配置来源和条件评估，不打印 Secret。
- 使用 Boot dependency management，避免手工固定冲突的传递版本。
- 对数据库、Redis、HTTP 客户端分别设置连接、读取、写入和总超时。
- 为 API、任务、消息消费者设置并发和队列上限。
- readiness 与业务依赖联动，但避免短暂下游抖动导致实例反复摘除。
- 保留构建信息、Git SHA、JDK、Spring 版本到 `/info` 或日志。

## 常见问题

### 为什么自动配置没有生效？

常见原因包括依赖缺失、属性不匹配、用户 Bean 覆盖、条件评估失败或 Starter 版本不兼容。查看条件评估报告和启动日志。

### 应用关闭时为什么请求报 503/连接重置？

可能是实例仍在接流量，或服务器关闭先于负载均衡摘除。启用优雅停机、注册中心延迟注销和部署预停机钩子。

### `@ConfigurationProperties` 为什么不绑定？

检查前缀、setter/构造绑定、字段命名、注解注册、`@EnableConfigurationProperties` 和配置来源；未绑定不应静默使用错误默认值。

### 面试追问：Spring Boot 的核心优势是什么？

约定优于配置、自动装配、Starter 依赖、内嵌服务器、生产监控和测试集成，但它保留 Spring 的显式扩展能力。

## 总结与延伸

Spring Boot 的核心是可控默认值和生产生命周期。工程从[入门](./spring-boot-guide.md)到[接口](./spring-boot-interface-resp.md)和[MySQL](./spring-boot-mysql.md)逐步落地。

## 关联阅读

- [Spring Boot 入门](./spring-boot-guide.md)
- [Spring Boot 接口设计实现](./spring-boot-interface-resp.md)
- [Spring 框架知识体系](../spring-framework/spring-framework-overview.md)
