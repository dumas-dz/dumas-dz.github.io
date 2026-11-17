---
title: Java IO/NIO/AIO 详解
category:
  - Java
tag:
  - BIO
  - NIO
  - 网络 IO
description: 从传统流式 IO 到 NIO、异步 IO 的模型、资源管理和工程实践。
order: 1
outline: [2, 3]
---

# Java IO/NIO/AIO 详解

## 学习目标

- 区分同步、异步、阻塞和非阻塞 IO。
- 掌握字节流、字符流、Buffer、Channel、Selector 和文件通道。
- 能为文件处理、网络连接、超时和背压建立稳定实现。

## 适用场景

普通配置文件、小文件和简单客户端可使用 `java.nio.file` 与缓冲流；高连接数网络服务通常采用 Netty 或成熟框架的非阻塞 IO；Java `AsynchronousFileChannel`/`AsynchronousSocketChannel` 属于异步通道，但平台实现和生态使用率不如 Netty 广泛。不要仅为“并发高”手工重写事件循环。

## 核心概念

### IO 模型

| 模型 | 发起与完成 | 典型实现 | 主要成本 |
| --- | --- | --- | --- |
| 阻塞 IO | 调用等待数据 | `InputStream`、BIO Socket | 线程等待 |
| 非阻塞 IO | 立即返回状态，需轮询/事件 | `SocketChannel` + `Selector` | 状态机复杂 |
| IO 多路复用 | 一个线程观察多连接 | `Selector`、epoll/kqueue | 事件饥饿、缓冲管理 |
| 异步 IO | 完成后回调或 Future | `AsynchronousChannel` | 平台差异、回调复杂度 |

“非阻塞”不代表吞吐一定高；系统调用、线程调度、缓冲复制、序列化和业务逻辑都可能成为瓶颈。

### Stream 与 Channel

Stream 面向连续字节读写，`Reader`/`Writer` 处理字符和编码。Channel 是双向或可定位的传输通道，`Buffer` 管理容量、位置、限制和标记。`ByteBuffer` 的读写模式切换必须正确，网络框架通常在其上封装更易用的消息协议。

### 文件与字符编码

Java 字符串使用 UTF-16，文件和网络通常使用 UTF-8。`Files.readAllBytes` 会把整个文件装入内存，不适合大文件；大文件应使用 `BufferedReader`、`FileChannel` 或流式处理。编码必须显式指定，平台默认值会造成跨环境不一致。

### 同步、异步与背压

异步把等待从调用线程移走，但不会消灭工作量。任务生产速度持续高于消费速度时会出现队列增长，必须设置缓冲上限、暂停读取、拒绝请求或降级，否则最终仍会耗尽内存。

## 工程实现

```java
import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.stream.Stream;

public final class LineCounter {
    public static long count(Path file) {
        try (Stream<String> lines = Files.lines(file, StandardCharsets.UTF_8)) {
            return lines.count();
        } catch (IOException e) {
            throw new UncheckedIOException("Cannot read " + file, e);
        }
    }

    public static void copy(Path source, Path target) throws IOException {
        Files.createDirectories(target.toAbsolutePath().getParent());
        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
    }
}
```

```java
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class EchoServer implements AutoCloseable {
    private final ServerSocketChannel server = ServerSocketChannel.open();
    private final ExecutorService workers = Executors.newFixedThreadPool(8);

    public EchoServer(int port) throws Exception {
        server.bind(new InetSocketAddress(port));
        workers.submit(() -> {
            while (!Thread.currentThread().isInterrupted()) {
                try {
                    SocketChannel client = server.accept();
                    workers.submit(() -> echo(client));
                } catch (Exception e) {
                    return;
                }
            }
        });
    }

    private void echo(SocketChannel client) {
        try (client) {
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            while (client.read(buffer) != -1) {
                buffer.flip();
                while (buffer.hasRemaining()) client.write(buffer);
                buffer.clear();
            }
        } catch (Exception ignored) {
            // 真实服务应记录连接 ID、远端和错误摘要。
        }
    }

    @Override
    public void close() throws Exception {
        server.close();
        workers.shutdownNow();
    }

    public static void main(String[] args) throws Exception {
        try (EchoServer ignored = new EchoServer(9090)) {
            byte[] text = "hello".getBytes(StandardCharsets.UTF_8);
            try (SocketChannel client = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9090))) {
                client.write(ByteBuffer.wrap(text));
            }
        }
    }
}
```

BIO 示例用于说明资源、缓冲和生命周期；生产网络服务优先使用 Netty，并配置连接上限、读写超时和 TLS。

## 生产实践

- 所有 `Closeable` 使用 try-with-resources；线程池、Selector 和事件循环有明确关闭顺序。
- 设置连接、读、写和请求总超时，超时不能只依赖操作系统默认值。
- 限制单请求体、单消息、总连接和在途请求，防止慢连接或大包耗尽资源。
- 文件写入采用临时文件 + 原子移动或追加协议，崩溃后能恢复。
- 监控吞吐、队列长度、等待时间、连接状态、分配速率和 GC。
- 对 TLS、代理、重试和幂等分别建模，不能靠一次网络重试解决所有错误。

## 常见问题

### 字符乱码如何排查？

确认写入编码、读取编码、协议声明和数据实际字节。先以十六进制检查字节，不要反复改变编码“试出正确结果”。

### `flush` 与 `close` 有什么区别？

`flush` 把用户态缓冲写入底层，`close` 释放描述符并完成收尾。只 flush 不 close 可能泄漏资源；文件系统可见也不代表已经持久化到磁盘。

### 非阻塞写为什么仍可能未写完？

`write` 可能只接收部分字节。发送缓冲必须记录偏移并继续注册可写事件，不能假设一次写完成。

### 面试追问：零拷贝是什么？

减少用户态与内核态之间的数据复制或上下文切换，例如 `sendfile`、`FileChannel.transferTo`。它不消除序列化、协议解析和业务处理成本。

## 总结与延伸

IO 设计的核心是数据边界、资源生命周期、超时和背压。并发协作参见[Java 并发知识体系](../thread/java-thread-x-overview.md)，HTTP 边界设计参见[Spring Boot 接口设计](../../spring/spring-boot/spring-boot-interface-resp.md)。

## 关联阅读

- [Java 并发知识体系](../thread/java-thread-x-overview.md)
- [Spring Boot 接口设计实现](../../spring/spring-boot/spring-boot-interface-resp.md)
- [Java 调试排错相关](../jvm/java-jvm-debug-tools-ref.md)
