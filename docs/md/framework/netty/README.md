---
title: Netty 与网络编程
category:
  - 框架
  - 网络编程
tag:
  - Netty
  - NIO
  - TCP
description: Netty 线程模型、编解码、ByteBuf 和可靠性实践导航。
order: 40
outline: [2, 3]
---

# Netty 与网络编程

Netty 位于 TCP/UDP 与业务协议之间，重点不是“写出一个 EchoServer”，而是让连接、线程、内存、协议和故障都可控。

## 文档

| 文档 | 重点 | 状态 |
| --- | --- | --- |
| [Netty 详解](./framework-netty-overview.md) | Reactor、Pipeline、ByteBuf、粘拆包、背压 | 已完善 |

## 核心检查点

1. 协议是否定义长度、版本、编码、最大帧、错误帧和心跳？
2. EventLoop 是否避免数据库、文件、慢 RPC 等阻塞操作？
3. ByteBuf 在成功、异常和转发路径上是否正确引用计数？
4. 连接、在途请求、写队列和每 IP 资源是否有上限？
5. 停机时是否先停止接收，再排空连接和线程池？

状态：已完善。
