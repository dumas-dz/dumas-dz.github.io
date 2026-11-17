---
title: Java 集合框架
category:
  - Java
tag:
  - 集合
  - 数据结构
description: Java 集合框架的结构导航、复杂度选择和并发使用边界。
order: 1
outline: [2, 3]
---

# Java 集合框架

集合是 Java 业务代码中最常用的数据结构层。本目录重点解决集合选择、遍历语义、内存开销、并发安全和 API 契约问题。

## 学习目标

- 按访问模式选择 List、Set、Map、Queue 和 Deque。
- 理解常见实现的复杂度、有序性和线程安全边界。
- 避免边遍历边修改、可变键和无界缓存等常见故障。

## 文档

- [Java 集合框架详解](./java-collection-overview.md)

## 内容状态

`持续更新`：框架主体已完成，后续补充基准测试与大集合内存分析。

## 关联阅读

- [Java 基础知识体系](../basic/java-basic-bok.md)
- [J.U.C 知识体系](../thread/java-thread-x-juc-overview.md)
