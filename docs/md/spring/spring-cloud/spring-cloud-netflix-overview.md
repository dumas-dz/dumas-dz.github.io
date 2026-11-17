---
title: Spring Cloud Netflix 知识体系
category:
  - Spring
tag:
  - Netflix OSS
  - Eureka
  - Hystrix
description: Spring Cloud Netflix 组件、生命周期、迁移边界和维护策略。
order: 3
outline: [2, 3]
---

# Spring Cloud Netflix 知识体系

## 学习目标

- 了解 Eureka、Ribbon、Hystrix、Zuul、Archaius 的原始职责。
- 理解部分 Netflix OSS 组件进入维护或淘汰后的迁移影响。
- 能为遗留系统制定继续维护、逐步替换或新建选型策略。

## 适用场景

适合维护既有 Spring Cloud Netflix 系统。新系统不应默认选择 Hystrix、Ribbon、Zuul 等旧组件；应根据当前 Spring Cloud 支持矩阵选择 Gateway、LoadBalancer、Resilience4j、Nacos/Consul 等。本篇保留概念帮助读日志、配置和迁移，不代表推荐新部署。

## 核心概念

### 组件职责与现状

| 组件 | 原始职责 | 常见替代 |
| --- | --- | --- |
| Eureka | 服务注册发现 | Nacos、Consul、Kubernetes Service |
| Ribbon | 客户端负载均衡 | Spring Cloud LoadBalancer |
| Hystrix | 熔断、隔离、降级 | Resilience4j、Sentinel、Micrometer Breaker |
| Zuul 1 | 边缘网关 | Spring Cloud Gateway、云网关 |
| Archaius | 动态配置 | Spring Config、Nacos、配置服务 |

组件版本、维护状态和 Spring Cloud 支持随时间变化，必须以目标版本官方发布说明为准。不要把“仍能编译”等同于“仍受支持”。

### 迁移原则

1. 建立依赖和配置清单，识别 Netflix 注解、过滤器、路由和线程池。
2. 定义当前 SLO、流量、超时、重试和降级行为基线。
3. 按入口、注册发现、弹性、配置分阶段替换，每阶段可独立回滚。
4. 用流量镜像或双跑验证路由、负载、熔断和指标差异。
5. 清理旧线程池、配置和调试端点，完成 runbook 更新。

### 遗留模式

旧项目常见 `@HystrixCommand`、Ribbon 负载规则、Zuul `ZuulFilter` 和 Archaius 动态属性。迁移时不能机械翻译注解：线程隔离、信号量、fallback 异常传播和配置刷新语义在新库中不同，应重新定义故障契约。

## 工程实现

遗留服务可先建立兼容层，而不是一次替换所有入口：

```java
import org.springframework.cloud.client.loadbalancer.LoadBalancerClient;
import org.springframework.stereotype.Service;
import java.net.URI;

@Service
public class LegacyRoutingMigration {
    private final LoadBalancerClient loadBalancer;

    public LegacyRoutingMigration(LoadBalancerClient loadBalancer) {
        this.loadBalancer = loadBalancer;
    }

    public URI resolve(String serviceId) {
        var instance = loadBalancer.choose(serviceId);
        if (instance == null) {
            throw new IllegalStateException("no healthy instance: " + serviceId);
        }
        return instance.getUri();
    }
}
```

迁移 Hystrix 时通常使用 Resilience4j 的 CircuitBreaker、TimeLimiter、Bulkhead 和 Retry 组合；每个原 `commandKey/threadPoolKey` 都应映射到明确资源、并发和超时预算。

## 生产实践

- 保存旧版本依赖锁、容器镜像和部署配置，保证安全补丁期间可复现构建。
- 对迁移关键行为编写契约测试：路由、灰度、fallback、重试、超时和指标名称。
- 不在迁移期间同时大改业务逻辑，保持差异可归因。
- 为旧组件建立安全补丁和平台支持截止时间，避免永久运行在无维护依赖上。
- 监控新旧路径的成功率、延迟、拒绝和资源消耗差异。

## 常见问题

### Hystrix fallback 返回默认值为什么可能掩盖故障？

fallback 成功可能让入口指标正常，但业务结果错误。必须记录 fallback 指标、数据完整性告警和恢复时间，并区分“服务可用”与“结果正确”。

### Ribbon 自定义负载算法迁移后为何不同？

新负载均衡器的实例缓存、健康选择、重试和权重策略不同。用目标实例数和故障场景做实验，而不是只比较单次请求。

### Zuul Filter 可以直接变成 Gateway Filter 吗？

不能保证直接兼容。Zuul 基于 Servlet/同步模型，Gateway 基于 WebFlux/响应式链路；请求体、线程上下文、超时和异常语义都需重新实现。

### 面试追问：为什么 Hystrix 被逐步替代？

维护模式、线程模型复杂、对新 Java/Spring 版本适配和可观测性需求变化，使更专注、可组合的 Resilience4j、Sentinel 和 Micrometer 方案更常见。

## 总结与延伸

Netflix 知识的价值是理解遗留治理模型并安全迁移。现代治理见[Spring Cloud 知识体系](./spring-cloud-overview.md)，国内组件见[Spring Cloud Alibaba](./spring-cloud-alibaba-overview.md)。

## 关联阅读

- [Spring Cloud 知识体系](./spring-cloud-overview.md)
- [Spring Cloud Alibaba 知识体系](./spring-cloud-alibaba-overview.md)
- [Spring Cloud Tencent 知识体系](./spring-cloud-tencent-overview.md)
