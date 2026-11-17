---
title: JVM 原理与诊断
category:
  - Java
tag:
  - JVM
  - GC
  - 故障诊断
description: JVM 内存、类加载、垃圾回收、字节码增强和生产故障诊断的学习导航。
order: 1
outline: [2, 3]
---

# JVM 原理与诊断

JVM 决定 Java 程序的内存布局、加载、执行和回收行为。本目录按照“理解模型 -> 观测运行时 -> 解决生产问题”的路径组织。

## 学习目标

- 理解运行时数据区、类加载、字节码和垃圾回收器模型。
- 能读取 GC 日志、堆转储、线程转储、JFR 和常用 JDK 工具。
- 能定位内存泄漏、GC 停顿、类加载冲突、死锁和 CPU 热点。

## 学习顺序

1. [JMM 内存结构详解](./java-jvm-jmm-struct.md)
2. [Java 类加载机制](./java-jvm-classloader.md)
3. [JVM 垃圾回收机制](./java-jvm-gc.md)
4. [Java 字节码增强技术](./java-jvm-class-enhencer.md)
5. [Java 调试排错相关](./java-jvm-debug-tools-ref.md)

## 内容状态

`持续更新`：运行时模型和诊断流程已完成，后续按目标 JDK 版本补充 GC 细节。

## 关联阅读

- [Java 并发与 J.U.C](../thread/README.md)
- [Spring Boot 工程实践](../../spring/spring-boot/spring-boot-guide.md)
