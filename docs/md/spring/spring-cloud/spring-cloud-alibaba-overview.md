---
title: Spring Cloud Alibaba 知识体系
category:
  - Spring
tag:
  - Nacos
  - Sentinel
  - Seata
description: Spring Cloud Alibaba 中 Nacos、Sentinel、Seata、RocketMQ 与 Gateway 的组合实践。
order: 2
outline: [2, 3]
---

# Spring Cloud Alibaba 知识体系

## 学习目标

- 理解 Nacos 注册/配置、Sentinel 限流熔断、Seata 事务和 RocketMQ 协作。
- 能组合 Nacos、Sentinel 与 Spring Cloud Gateway 构建服务治理体系。
- 能核对版本兼容、部署形态、数据一致性和故障恢复。

## 适用场景

适合采用 Alibaba 生态、需要国产化组件或统一 Nacos/Sentinel 运维的 Java 服务。组件不是越多越好；单机低复杂度服务不需要引入 Seata，消息最终一致性通常比长分布式事务更稳。

## 核心概念

### 版本组合

Spring Cloud Alibaba、Spring Cloud、Spring Boot 必须使用官方兼容矩阵中的版本组合。Nacos/Sentinel/Seata 客户端与服务端也要匹配。不要分别升级 `spring-cloud-dependencies` 与 `spring-cloud-alibaba-dependencies` 而不验证。

### Nacos

Nacos 提供服务注册发现和配置管理。命名空间隔离环境，Group 区分业务/配置域，Cluster/权重支持同区域路由。配置应按应用、环境和 profile 组织，启动时 fail fast，热更新要有版本和灰度。

注册实例应携带版本、区域和协议元数据。服务上线先注册后接流量，下线先摘流量再注销；健康检查失败不等于立即注销，需容忍网络抖动。

### Sentinel

Sentinel 提供流量控制、熔断、热点、系统保护和规则管理。核心模型包括资源、Entry、上下文、指标和规则。限流阈值基于 QPS 或并发，流控可快速失败、Warm Up 或排队；熔断依据慢调用比例、异常比例或异常数。

规则可从 Nacos 动态推送，但本地必须保留启动默认值、持久化和审计。网关和业务服务可设置不同资源粒度，避免单个全局阈值无法保护关键 API。

### Seata 与消息一致性

Seata 支持 AT、TCC、Saga、XA 等模式，但仍增加协调者、锁、回滚和运维成本。高频、长流程业务优先使用本地事务 + Outbox + 幂等消费者，保证“至少一次投递 + 业务去重”，或使用 Saga 明确补偿。

### Gateway 组合

常见组合是 Gateway + Nacos 服务发现 + Sentinel 网关限流 + OAuth2 资源服务器。网关负责入口容量，服务负责自身资源保护；Nacos 规则下发异常时应使用已知安全值，而不是放开全部流量。

## 工程实现

```yaml
spring:
  application:
    name: order-service
  cloud:
    nacos:
      discovery:
        server-addr: ${NACOS_ADDR}
        namespace: ${NACOS_NAMESPACE:prod}
        group: ${NACOS_GROUP:DEFAULT_GROUP}
        cluster-name: ${NACOS_CLUSTER:default}
        fail-fast: true
      config:
        server-addr: ${NACOS_ADDR}
        namespace: ${NACOS_NAMESPACE:prod}
        group: ${NACOS_GROUP:DEFAULT_GROUP}
        file-extension: yaml
    sentinel:
      transport:
        dashboard: ${SENTINEL_DASHBOARD}
        port: 8719
      eager: true

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
```

```java
import com.alibaba.csp.sentinel.annotation.SentinelResource;
import com.alibaba.csp.sentinel.slots.block.BlockException;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {
    @SentinelResource(value = "inventory_deduct", blockHandler = "deductBlocked")
    public DeductResult deduct(String sku, int quantity) {
        return new DeductResult(true);
    }

    public DeductResult deductBlocked(String sku, int quantity, BlockException error) {
        return new DeductResult(false);
    }

    public record DeductResult(boolean accepted) {}
}
```

`blockHandler` 必须与原方法返回值/参数兼容并保持快速；业务异常不等同于 Sentinel block 异常。测试使用真实规则验证快速失败、排队、半开恢复和规则回滚。

## 生产实践

- Nacos 服务端集群、存储、鉴权、TLS、备份和监控独立设计，客户端缓存最后已知注册/配置。
- Sentinel 规则按 API、租户和实例分层，阈值通过容量测试确定，保留紧急全局保护。
- 规则变更审计并支持一键回滚，配置推送失败不得清空保护规则。
- 监控注册实例数、配置拉取失败、规则更新、拒绝数、熔断状态和恢复时间。
- Seata 事务日志表、锁表和恢复流程纳入备份、容量和告警；记录全局事务 ID。

## 常见问题

### 服务注册成功但网关调用失败？

可能是命名空间/Group/Cluster 不一致、实例 IP 不可达、元数据路由错误或健康检查失败。从网关解析目标、实例地址和网络策略逐层核对。

### Sentinel 熔断为什么不恢复？

半开探测条件、规则持续满足、恢复时间未到或探测请求持续失败。查看状态机、规则指标和下游真实恢复时间。

### Nacos 配置推送到所有实例是否安全？

不是。一次全量推送可能造成重启、行为突变或雪崩。配置应支持灰度、分批、幂等应用和快速回滚，重大变化通过发布流程执行。

### 面试追问：AT 模式为什么仍有性能成本？

代理数据源、生成前后镜像、全局锁、事务日志和协调往返都会增加延迟与存储成本，冲突时还可能回滚。

## 总结与延伸

Spring Cloud Alibaba 以 Nacos 和 Sentinel 为治理核心，其他组件按业务一致性需求引入。通用治理边界见[Spring Cloud 知识体系](./spring-cloud-overview.md)，替代发行版见[Netflix](./spring-cloud-netflix-overview.md)。

## 关联阅读

- [Spring Cloud 知识体系](./spring-cloud-overview.md)
- [Spring Cloud Netflix 知识体系](./spring-cloud-netflix-overview.md)
- [Spring Boot 集成 MySQL](../spring-boot/spring-boot-mysql.md)
