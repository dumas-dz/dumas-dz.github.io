---
title: gRPC 详解
category:
  - 框架
  - RPC
tag:
  - gRPC
  - Protobuf
  - HTTP/2
description: 以 Protobuf、HTTP/2、流式通信和超时错误为核心，构建跨语言高性能 RPC 接口。
order: 60
outline: [2, 3]
---

# gRPC 详解

## 1. 学习目标

学习后应能编写兼容演进的 `.proto` 契约，使用 unary/streaming 调用，理解 deadline、状态码、拦截器、重试和负载均衡，并为跨语言服务制定接口治理。示例面向 gRPC Java 1.6x。

## 2. 适用场景

gRPC 适合服务间高性能 RPC、跨语言调用、双向流和需要明确 IDL 的系统。Protobuf 使接口和数据结构可版本化，HTTP/2 支持多路复用、头部压缩和流式传输。

浏览器直接调用、通用第三方 API、人工调试和 SEO 场景通常以 HTTP/JSON 网关更方便。可以把 gRPC 作为内部核心协议，通过网关暴露 REST/JSON。

## 3. 核心原理

### 3.1 Protobuf 契约

`.proto` 定义消息和 service，生成各语言客户端和服务端。字段编号是兼容性基础：删除字段要保留编号，不能复用；新增字段使用默认值兼容旧客户端。枚举、optional、oneof 和 map 的兼容行为不同，升级前做契约测试。

### 3.2 四种调用模式

- Unary：一次请求、一次响应，最常用。
- Server streaming：一次请求、多次响应，适合进度、报表或事件流。
- Client streaming：多次请求、一次响应，适合上传、批量聚合。
- Bidirectional streaming：双向流，适合实时对话、订阅和长连接。

流式接口需要显式处理半关闭、取消、背压和断线重连，不能把无限流当成普通 RPC。

### 3.3 deadline、状态码与重试

客户端传递 deadline，服务器和每个下游共享剩余预算。状态码要区分 `INVALID_ARGUMENT`、`NOT_FOUND`、`ALREADY_EXISTS`、`RESOURCE_EXHAUSTED`、`UNAVAILABLE`、`DEADLINE_EXCEEDED` 和 `INTERNAL`。只对明确瞬时、幂等的错误自动重试，重试要有指数退避和抖动。

### 3.4 HTTP/2 与连接

一个 HTTP/2 连接可以复用多路 stream，但流控、连接池、代理和 TLS 配置会影响延迟和吞吐。长连接发布时要优雅关闭，客户端要支持 DNS 刷新和目标端负载均衡。

## 4. 技术决策与对比

| 问题 | gRPC | REST/JSON | 选择 |
| --- | --- | --- | --- |
| 契约 | Protobuf、强类型 | OpenAPI、灵活 JSON | 多语言/自动客户端用 gRPC |
| 性能 | 二进制、HTTP/2、低编码成本 | 通用、调试方便 | 高 QPS 内部调用用 gRPC |
| 流式 | 原生 | SSE/WebSocket | 双向实时用 gRPC |
| 外部开放 | 需要网关/文档 | 直接开放 | 依赖生态与客户端 |
| 版本 | 字段兼容、方法演进 | URL/媒体类型 | 明确迁移策略 |

## 5. 工程实现

### 5.1 Proto 契约

```proto
syntax = "proto3";

package order.v1;

service OrderService {
  rpc GetOrder(GetOrderRequest) returns (Order);
  rpc WatchOrders(WatchOrdersRequest) returns (stream OrderEvent);
}

message GetOrderRequest {
  string order_no = 1;
}

message Order {
  string order_no = 1;
  string status = 2;
  int64 amount_minor = 3;
  int64 updated_at_unix_ms = 4;
}

message WatchOrdersRequest {
  string tenant_id = 1;
}

message OrderEvent {
  string event_id = 1;
  string order_no = 2;
  string type = 3;
}
```

### 5.2 Server 端 deadline 和状态

```java
public final class OrderGrpcService extends OrderServiceGrpc.OrderServiceImplBase {
    private final OrderService service;

    public OrderGrpcService(OrderService service) {
        this.service = service;
    }

    @Override
    public void getOrder(
        GetOrderRequest request,
        StreamObserver<Order> responseObserver
    ) {
        try {
            Order order = service.getByOrderNo(request.getOrderNo());
            responseObserver.onNext(order);
            responseObserver.onCompleted();
        } catch (NotFoundException exception) {
            responseObserver.onError(
                Status.NOT_FOUND.withDescription(exception.getMessage()).asRuntimeException()
            );
        }
    }
}
```

### 5.3 客户端 deadline

```java
ManagedChannel channel = ManagedChannelBuilder
    .forAddress("localhost", 9090)
    .usePlaintext()
    .build();
try {
    OrderServiceGrpc.OrderServiceBlockingStub stub =
        OrderServiceGrpc.newBlockingStub(channel)
            .withDeadlineAfter(300, TimeUnit.MILLISECONDS);
    Order order = stub.getOrder(
        GetOrderRequest.newBuilder().setOrderNo("ORD-1").build()
    );
} finally {
    channel.shutdown();
}
```

生产环境应配置 TLS、鉴权、重试策略和通道生命周期管理，`usePlaintext()` 只用于本地示例。

## 6. 生产实践

- 以 package/version 管理契约，生成代码纳入构建，禁止手改生成文件。
- 所有方法配置 deadline、最大消息大小、并发和鉴权；服务端提前快速校验。
- 错误通过状态码和结构化 details 返回，日志保留 traceId、方法和耗时。
- streaming 设计最大队列、消息速率、心跳、取消和重连；不能无限缓存服务端消息。
- 契约变更运行兼容检查、客户端测试和灰度，关注默认值和枚举扩展。
- 监控 QPS、状态码、延迟分位、流数量、连接数、消息大小、重试、熔断和 TLS/认证错误。

## 7. 常见坑与排查

1. **字段编号复用**：删除字段后复用编号会让旧数据被错误解释，编号一旦分配不得复用。
2. **deadline 未向下传递**：下游不知道剩余时间，导致整体超时堆积，使用 Context 传播。
3. **把所有错误当 UNKNOWN**：客户端无法判断重试/参数问题，使用标准状态码和错误详情。
4. **流式无背压**：生产快于消费导致内存增长，设置窗口、队列上限和丢弃/阻塞策略。
5. **消息体过大**：未限制 `maxInboundMessageSize`，大对象应传引用。
6. **代理不支持 HTTP/2 或 deadline**：部署层丢失元数据，必须做端到端链路验证。
7. **客户端关闭时机错误**：请求进行中关闭 channel，产生 `UNAVAILABLE`，优雅停机先停止接流。
8. **序列化类型不稳定**：跨语言数字精度、时间和枚举默认值必须在契约中明确。

## 8. 总结与关联阅读

gRPC 的价值是明确 IDL、高性能传输和流式能力；可靠性仍依赖兼容契约、deadline、状态码和幂等。内部 RPC 与外部 API 可以分工，不必强行二选一。

关联阅读：[Dubbo 详解](./framework-rpc-dubbo-overview.md)、[API 设计](../../dev-spec/dev-spec-api-design.md)、[Netty 详解](../netty/framework-netty-overview.md)、[微服务治理](../../arch/microservice/arch-microservice-overview.md)。
