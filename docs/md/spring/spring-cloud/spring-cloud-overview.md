---
title: Spring Cloud 知识体系
category:
  - Spring
tag:
  - Spring Cloud
  - Gateway
  - OAuth2
description: Spring Cloud 微服务治理模型、Gateway、配置、弹性、安全与可观测性的工程指南。
order: 1
outline: [2, 3]
---

# Spring Cloud 知识体系

## 学习目标

- 理解微服务治理问题和 Spring Cloud 的抽象层次。
- 掌握 Gateway、服务发现、配置、熔断、链路追踪和安全的协作边界。
- 能用 OAuth2/JWT、限流、超时和降级构建可恢复系统。

## 适用场景

适合多个独立部署、团队自治、故障隔离需求明确的服务。小团队或低复杂度系统使用模块化单体更易维护。微服务不会自动提高性能，还会增加网络、一致性和运维成本；先以业务边界和 SLO 驱动拆分。

## 核心概念

### 治理地图

```text
客户端
-> Gateway（认证、路由、限流、协议）
-> 服务（业务、超时、重试、熔断）
-> Nacos/配置中心（注册、配置、元数据）
-> 数据库/MQ/外部 API
-> Tracing/Metrics/Logging（全链路观测）
```

网关不是业务编排中心，不应承载复杂订单规则；配置中心不是数据库，不保存高频变化的大状态；服务发现不能替代健康检查和优雅停机。

### Gateway

Spring Cloud Gateway 基于 Spring WebFlux/Netty，适合路由、TLS 终止、鉴权前置、灰度、限流和请求改写。每条路由都应有超时、重试、熔断和指标。请求体改写会增加内存与延迟，超大上传应走直传或流式代理。

### 配置与服务发现

配置分为启动配置、动态配置和密钥。热更新只应用于明确支持的 Bean/属性，并有版本、灰度、审计和回滚。注册元数据包括版本、区域、权重和协议；实例注销与优雅停机协同，避免流量进入关闭中的实例。

### 弹性策略

| 故障 | 策略 | 注意 |
| --- | --- | --- |
| 瞬时网络错误 | 有限重试、指数退避、抖动 | 只重试幂等操作 |
| 慢依赖 | 超时、并发隔离、队列上限 | 超时之和需小于入口 SLO |
| 持续失败 | 熔断、降级、备用实现 | 半开探测恢复 |
| 流量突增 | 网关/服务限流、背压 | 公平性与租户隔离 |
| 重复请求 | 幂等键、唯一约束 | 网关重试也需覆盖 |

### OAuth2/JWT 安全

推荐使用 OAuth 2.1 + OpenID Connect 的授权服务器、资源服务器和客户端角色。网关进行粗粒度认证和路由防护，服务仍验证 JWT 并执行方法级授权，避免“网关可信后内网全开放”。

JWT 资源服务器必须验证签名算法、密钥轮换、`iss`、`aud`、`exp`、`nbf` 和 scope/role 映射。访问令牌保持短时，刷新令牌严格存储；本地 JWT 验证不等于可即时吊销，敏感操作可结合令牌版本、会话检查或 introspection。

## 工程实现

```yaml
spring:
  application:
    name: edge-gateway
  cloud:
    gateway:
      default-filters:
        - name: Retry
          args:
            retries: 1
            methods: GET
            statuses: BAD_GATEWAY
            backoff:
              firstBackoff: 50ms
              maxBackoff: 500ms
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=0
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 50
                redis-rate-limiter.burstCapacity: 100
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.example.com

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,gateway
```

YAML 中的 Filter 名称、参数和依赖随 Spring Cloud 版本变化，应以目标版本文档和集成测试为准。网关路由暴露端点需严格鉴权，不能与业务公开路径混淆。

## 生产实践

- 为入口到数据库设置逐层超时预算，单次重试不能放大成重试风暴。
- 网关和服务分别限流，按租户/API/用户维度保证公平，拒绝响应清晰。
- 配置发布按环境和实例灰度，支持审计、差异对比和快速回滚。
- 使用 W3C `traceparent`、统一日志字段和 RED 指标关联请求。
- 安全扫描 JWT 算法混淆、公钥泄露、越权、SSRF、开放路由和调试端点。
- 对注册中心、网关、认证服务等控制面组件建立容量和可用性 SLO。

## 常见问题

### 网关重试为什么造成流量翻倍？

多个层级同时自动重试、请求非幂等或超时阈值过短都会放大流量。定义唯一重试边界、总预算和幂等保证。

### JWT 过期后为什么请求仍成功？

可能存在较长缓存、时钟偏差、错误的验证配置或服务只解码未验证。记录验证链和 `exp`，校验资源服务器配置。

### Nacos 配置热更新为什么不生效？

Bean 可能未绑定 `@RefreshScope`/配置属性，或只在启动读取一次。动态能力应显式设计，并避免频繁热更改变并发状态。

### 面试追问：网关鉴权后为什么服务还要鉴权？

网关可能被绕过、内部网络存在其他入口或错误路由，且服务也需要最小权限和租户隔离。零信任要求每层验证调用者和操作权限。

## 总结与延伸

Spring Cloud 的价值在于统一治理契约，而不是引入更多组件。Nacos/Sentinel 落地见[Spring Cloud Alibaba](./spring-cloud-alibaba-overview.md)，服务工程基线见[Spring Boot](../spring-boot/README.md)。

## 关联阅读

- [Spring Cloud Alibaba 知识体系](./spring-cloud-alibaba-overview.md)
- [Spring Boot 工程实践](../spring-boot/README.md)
- [Spring Boot 接口设计实现](../spring-boot/spring-boot-interface-resp.md)
