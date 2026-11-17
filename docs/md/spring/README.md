---
title: Spring 工程底座
category:
  - Spring
tag:
  - Spring
  - 后端开发
description: Spring Framework、Spring Boot 与 Spring Cloud 的统一学习入口和工程路线。
order: 1
outline: [2, 3]
---

# Spring 工程底座

Spring 技术栈覆盖对象管理、Web 请求、数据访问、配置、安全和分布式系统治理。本领域按照“容器原理 -> 单体工程 -> 分布式协作”组织，强调版本边界、可运行示例和生产实践。

## 学习目标

- 理解 IoC、AOP、MVC、事务和 Bean 生命周期。
- 能构建稳定、可测试、可观测的 Spring Boot API 与数据访问层。
- 能选型并组合 Spring Cloud、Gateway、Nacos、Sentinel、OAuth2/JWT 等能力。

## 推荐路径

| 阶段 | 主题 | 关键产出 |
| --- | --- | --- |
| 1 | [Spring Framework 概览](./spring-framework/spring-framework-overview.md) | 理解容器与模块边界 |
| 2 | [IoC](./spring-framework/spring-framework-ioc.md)、[AOP](./spring-framework/spring-framework-aop.md)、[MVC](./spring-framework/spring-framework-mvc.md) | 掌握核心运行机制 |
| 3 | [Spring Boot 知识体系](./spring-boot/spring-boot-overview.md) | 建立工程骨架 |
| 4 | [接口设计](./spring-boot/spring-boot-interface-resp.md)、[数据访问](./spring-boot/spring-boot-mysql.md) | 交付业务 API |
| 5 | [Spring Cloud](./spring-cloud/spring-cloud-overview.md) | 处理多服务治理 |

## 版本约定

- 示例以 Java 17、Spring Boot 3.x、Spring Framework 6.x、Spring Cloud 2023+ 为基线。
- Spring Boot 2.7/Java 8 项目仍可参考概念，但 Jakarta 命名空间、安全 API、配置属性和依赖版本不同。
- Spring Cloud Alibaba、Netflix、Tencent 的组件组合必须核对官方兼容矩阵，不混搭未经验证的版本。

## 内容状态

`持续更新`：核心栈已完成，后续持续更新版本演进和更多端到端案例。

## 关联阅读

- [Java 工程基础](../java/README.md)
- [数据库](../db/README.md)
- [架构与分布式](../arch/README.md)
