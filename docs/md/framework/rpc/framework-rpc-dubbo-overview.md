---
title: Dubbo 详解
category:
  - 框架
  - RPC
tag:
  - Dubbo
  - RPC
  - 服务治理
description: 从服务注册、协议、序列化、集群容错和治理指标理解 Dubbo 的远程调用工程。
order: 50
outline: [2, 3]
---

# Dubbo 详解

## 1. 学习目标

学习后应能定义稳定的 RPC 接口，选择 Dubbo 协议、注册中心、序列化和容错策略，处理超时、重试、幂等和服务治理，并通过链路追踪定位跨服务失败。示例面向 Dubbo 3.x Java。

## 2. 适用场景

Dubbo 适合 Java 为主的内部微服务，以接口为中心进行 RPC、服务发现、负载均衡、限流和灰度。它让服务间调用像本地接口，但网络失败、版本兼容、超时和部分成功仍是分布式边界。

面向浏览器/第三方的 API 通常使用 HTTP/gRPC；跨语言、强 IDL 和流式调用偏 gRPC。不要把远程调用隐藏在长事务、循环或无界重试中。

## 3. 核心原理

### 3.1 RPC 链路

Consumer 根据接口和版本选择 Provider，经过代理、序列化、网络传输、服务端反序列化、业务方法和返回值映射。注册中心只负责发现，数据面流量仍由客户端与 Provider 传输。超时、重试和负载均衡属于客户端治理策略。

### 3.2 协议与序列化

Dubbo 协议面向高并发长连接，Triple 协议兼容 HTTP/2 和 gRPC，适合跨语言。Java 原生序列化不推荐用于外部数据；Hessian、Protobuf、JSON 要结合兼容性、体积、可读性和安全。类结构变更必须兼容旧消费者。

### 3.3 服务发现与集群

注册中心保存 Provider 实例和元数据；路由规则、权重、标签和版本支持灰度。集群容错包括 failover、failfast、failsafe、forking 等，默认 failover 只适合幂等读或可重试操作。

### 3.4 治理能力

超时、重试、限流、熔断、隔离、鉴权、灰度和全链路超时共同控制故障扩散。单个服务的 timeout 不能大于上游剩余预算，否则局部“正常”会拖垮整体。

## 4. 技术决策与对比

| 问题 | Dubbo | gRPC | HTTP REST |
| --- | --- | --- | --- |
| 语言生态 | Java 强、Triple 跨语言 | 跨语言强 | 通用 |
| 接口契约 | Java 接口/元数据 | Protobuf IDL | OpenAPI |
| 流式 | 有扩展能力 | 原生四类流式 | SSE/WebSocket |
| 治理 | Dubbo 生态丰富 | 需结合服务网格/库 | 网关和标准 HTTP |
| 适用 | Java 内部 RPC | 跨语言、高性能 API | 对外 API、浏览器 |

## 5. 工程实现

### 5.1 接口契约

```java
public interface OrderQueryService {
    OrderView getOrder(String orderNo);
}
```

实现端：

```java
@DubboService(version = "1.0", group = "order", timeout = 300)
public class OrderQueryServiceImpl implements OrderQueryService {
    private final OrderRepository repository;

    public OrderQueryServiceImpl(OrderRepository repository) {
        this.repository = repository;
    }

    @Override
    public OrderView getOrder(String orderNo) {
        return repository.findView(orderNo)
            .orElseThrow(() -> new NotFoundException("order not found: " + orderNo));
    }
}
```

调用端：

```java
@DubboReference(version = "1.0", group = "order", timeout = 300, retries = 0)
private OrderQueryService orderQueryService;
```

读操作可以设置少量重试，写操作通常 `retries = 0`，除非请求具备业务幂等键。

### 5.2 超时链路

网关设置总预算 1000ms，A 服务调用 B 设置 600ms，B 调用 C 设置 300ms，并保留日志、排队和兜底时间。超时后返回明确错误并记录 `traceId`，不要无限等待。

## 6. 生产实践

- 接口按领域定义，参数使用稳定 DTO，避免把数据库实体直接暴露为 RPC 契约。
- 服务名、接口版本、分组和元数据纳入配置中心，禁止依赖开发机默认值。
- 为 RPC 配置连接池、超时、重试、熔断、隔离舱和最大并发。
- 全链路追踪使用统一 traceId/spanId，记录入口、下游、耗时、错误码和实例。
- 发布采用灰度、权重、标签和版本路由，先观察核心指标再扩大流量。
- Provider 做参数校验、限流和鉴权，不能假设 Consumer 已经校验。
- 监控 QPS、P95/P99、超时率、错误率、连接数、线程池、注册延迟和实例健康。

## 7. 常见坑与排查

1. **远程异常被吞**：只打印 `RuntimeException` 不记录服务名、接口、参数摘要和 traceId，无法定位。
2. **无幂等仍重试**：failover 重试写接口导致重复扣款或重复通知，写操作关闭自动重试。
3. **超时层级倒挂**：下游 timeout 大于上游，必须统一全链路预算。
4. **序列化兼容失败**：新增必填字段、删除类字段或改变类型，旧消费者无法反序列化。
5. **注册中心抖动**：实例误摘除或客户端缓存过旧，结合健康检查、保护阈值和优雅下线。
6. **线程池打满**：慢下游导致 Provider 线程耗尽，设置隔离、限流和快速失败。
7. **本地测试直连遗漏配置**：测试通过直连绕过注册中心，生产才发现版本/分组不匹配。
8. **大对象 RPC**：大报文导致网络和 GC 压力，拆分查询或传对象存储 URL。

## 8. 总结与关联阅读

Dubbo 把远程调用包装成接口，但可靠性来自清晰契约、全链路超时、幂等和治理策略。每次 RPC 都要有预算、错误语义和可追踪证据。

关联阅读：[gRPC 详解](./framework-rpc-grpc-overview.md)、[微服务治理](../../arch/microservice/arch-microservice-overview.md)、[Netty 详解](../netty/framework-netty-overview.md)、[API 设计](../../dev-spec/dev-spec-api-design.md)。
