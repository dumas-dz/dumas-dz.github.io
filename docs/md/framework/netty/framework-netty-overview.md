---
title: Netty 详解
category:
  - 框架
  - 网络编程
tag:
  - Netty
  - NIO
  - TCP
description: 理解 Reactor、ChannelPipeline、ByteBuf、线程模型和 TCP 粘拆包，构建稳定网络服务。
order: 70
outline: [2, 3]
---

# Netty 详解

## 1. 学习目标

学习后应能解释 Netty 的 Reactor 线程模型和 Pipeline 处理链，正确处理 ByteBuf 生命周期、TCP 粘拆包、背压和优雅停机，并避免泄漏、阻塞和无界内存。示例面向 Netty 4.1+。

## 2. 适用场景

Netty 适合高并发 TCP/UDP、私有协议、代理、网关、消息代理和 RPC 网络层。它提供异步事件驱动和高效的 ByteBuf，但协议设计、内存管理和业务线程模型仍由开发者负责。

普通 HTTP 业务可直接使用成熟 Web 框架；短连接、低并发脚本不需要 Netty。不要在 EventLoop 中执行数据库、HTTP、复杂 CPU 或文件阻塞操作。

## 3. 核心原理

### 3.1 Reactor 与线程模型

BossGroup 接受连接，WorkerGroup 处理读写，EventLoop 负责一个 Channel 的生命周期事件。ChannelHandler 通过 Pipeline 串行处理，避免多个线程同时修改同一 Channel 状态。耗时任务应提交到业务线程池，完成后再回到 EventLoop 发送响应。

### 3.2 ChannelHandler 与编解码

入站 Handler 处理读取和事件，出站 Handler 处理写入和编码。编解码器要把 TCP 字节流转换为消息，常见 LengthFieldBasedFrameDecoder、DelimiterBasedFrameDecoder、StringDecoder 和 MessageToMessageCodec。协议必须定义版本、长度、编码、错误帧和最大帧大小。

### 3.3 ByteBuf 与内存

ByteBuf 有堆内存、直接内存、引用计数和池化。读写索引独立，`retain/release` 必须配对，异常路径也要释放。无界累积、忘记释放和在 Handler 间传递后重复释放会造成内存泄漏或异常。

### 3.4 流控与可靠性

TCP 只提供传输层流控，应用层还要限制连接数、每连接在途请求、队列长度和写缓冲。写入返回 `ChannelFuture`，不能假设调用 `writeAndFlush` 已到达网络。网络断开、空闲检测、心跳和半包需要协议级处理。

## 4. 技术决策与对比

| 问题 | Netty | 直接使用 NIO | 成熟 Web 框架 |
| --- | --- | --- | --- |
| 吞吐/延迟 | 高并发、池化 ByteBuf | 可控但样板多 | 适合 HTTP 业务 |
| 协议 | 私有 TCP/UDP 灵活 | 灵活 | HTTP/WebSocket |
| 开发复杂度 | 中高，需生命周期治理 | 高 | 低 |
| 运维风险 | 内存、线程、协议错误 | 同左 | 框架托管 |
| 适用 | 网关、RPC、MQ 客户端 | 教学/极简 | 业务服务 |

## 5. 工程实现

### 5.1 服务端启动

```java
EventLoopGroup bossGroup = new NioEventLoopGroup(1);
EventLoopGroup workerGroup = new NioEventLoopGroup();
try {
    ServerBootstrap bootstrap = new ServerBootstrap();
    bootstrap.group(bossGroup, workerGroup)
        .channel(NioServerSocketChannel.class)
        .childOption(ChannelOption.SO_KEEPALIVE, true)
        .childOption(ChannelOption.TCP_NODELAY, true)
        .childHandler(new ChannelInitializer<SocketChannel>() {
            @Override
            protected void initChannel(SocketChannel channel) {
                channel.pipeline()
                    .addLast(new LengthFieldBasedFrameDecoder(1024 * 1024, 0, 4, 0, 4))
                    .addLast(new StringDecoder(CharsetUtil.UTF_8))
                    .addLast(new SimpleChannelInboundHandler<String>() {
                        @Override
                        protected void channelRead0(ChannelHandlerContext context, String message) {
                            context.writeAndFlush("OK\n");
                        }
                    });
            }
        });
    ChannelFuture bind = bootstrap.bind(8080).sync();
    bind.channel().closeFuture().sync();
} finally {
    bossGroup.shutdownGracefully();
    workerGroup.shutdownGracefully();
}
```

示例假设消息使用 4 字节长度前缀和 UTF-8 正文；真实协议还应实现编码、错误帧、最大帧、版本和鉴权。

### 5.2 异步业务处理

```java
public final class BusinessHandler extends SimpleChannelInboundHandler<String> {
    private final ExecutorService businessExecutor = Executors.newFixedThreadPool(8);
    private final EventExecutorGroup pipelineExecutor =
        new DefaultEventExecutorGroup(4);

    @Override
    protected void channelRead0(ChannelHandlerContext context, String message) {
        CompletableFuture.supplyAsync(() -> process(message), businessExecutor)
            .whenComplete((result, error) -> context.executor().execute(() -> {
                if (error == null) {
                    context.writeAndFlush(result);
                } else {
                    context.close();
                }
            }));
    }

    private String process(String message) {
        return "processed:" + message;
    }
}
```

线程池必须有界并设置拒绝策略，关闭时先停止接收新任务，再等待在途任务完成。

## 6. 生产实践

- 协议设计先定义最大帧、长度、压缩、版本、错误码、心跳和兼容策略，再写 Handler。
- 使用 `ResourceLeakDetector` 进行开发/测试，生产日志记录泄漏告警。
- 限制连接数、每 IP 连接数、在途请求、写队列和消息速率，防止慢连接耗尽资源。
- EventLoop 只做 IO 和轻量状态转换；数据库、RPC、文件处理进入业务池。
- 监控连接数、活跃 Channel、读写吞吐、写队列、EventLoop 延迟、内存池和 GC。
- 优雅停机先停止 accept，向现有连接发送关闭/完成信号，设置等待超时后关闭。
- 使用共享的线程模型基准测试，分别观察空载、慢消费者、大包和连接风暴。

## 7. 常见坑与排查

1. **粘包/拆包**：没有消息边界或长度上限，使用帧解码器并测试 1 字节、超大帧和半包。
2. **EventLoop 阻塞**：同步 DNS、文件、数据库或第三方请求导致所有连接延迟，转移业务线程。
3. **ByteBuf 泄漏**：异常分支、转发 Handler、引用计数错误，开启 leak detector 并在 finally 释放。
4. **无界写队列**：客户端不读取或对端过慢，导致堆外内存增长，设置写水位和背压。
5. **连接风暴**：握手、鉴权和分配资源成本高，设置连接限流和 accept 队列监控。
6. **关闭竞态**：线程池、Channel 和 Scheduler 关闭顺序错误，按启动逆序优雅关闭。
7. **协议版本不兼容**：客户端和服务端字段、字节序或编码不同，版本握手和契约测试。
8. **心跳只发不收**：未检测半开连接，设置读写空闲事件和双向健康检查。

## 8. 总结与关联阅读

Netty 是构建网络协议的高性能底座，可靠性来自明确的线程模型、协议边界和内存治理。网络编程问题多数不是“API 调不通”，而是生命周期与容量失控。

关联阅读：[Dubbo 详解](../rpc/framework-rpc-dubbo-overview.md)、[gRPC 详解](../rpc/framework-rpc-grpc-overview.md)、[性能与故障排查](../../dev-spec/dev-spec-performance-troubleshooting.md)、[日志规范](../../dev-spec/dev-spec-logging.md)。
