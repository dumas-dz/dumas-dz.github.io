---
title: Java 并发与 J.U.C
category:
  - Java
tag:
  - 并发编程
  - JUC
description: Java 线程、Java 内存模型、锁、线程池和并发容器的系统学习入口。
order: 1
outline: [2, 3]
---

# Java 并发与 J.U.C

并发编程需要同时保证正确性、响应性和资源可控性。本目录从线程与 Java 内存模型开始，逐步进入锁、原子类、线程池、并发容器和结构化并发。

## 学习目标

- 理解线程生命周期、可见性、有序性、原子性和 happens-before。
- 能正确使用锁、原子类、并发工具和线程池。
- 能设计停止、超时、隔离、背压和监控机制。

## 学习顺序

1. [Java 并发知识体系](./java-thread-x-overview.md)
2. [Java 并发理论基础](./java-thread-x-theory-basic.md)
3. [Java 并发线程基础](./java-thread-x-thread-basic.md)
4. [J.U.C 知识体系详解](./java-thread-x-juc-overview.md)

## 内容状态

`持续更新`：基础模型与 J.U.C 主体已完成，后续补充结构化并发和虚拟线程实践。

## 关联阅读

- [Java 集合框架详解](../collection/java-collection-overview.md)
- [JMM 内存结构详解](../jvm/java-jvm-jmm-struct.md)
- [Spring Boot 工程实践](../../spring/spring-boot/spring-boot-guide.md)
