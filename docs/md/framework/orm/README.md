---
title: ORM 与持久层
category:
  - 框架
  - ORM
tag:
  - MyBatis
  - 持久层
description: MyBatis 映射、SQL、事务和性能实践导航。
order: 10
outline: [2, 3]
---

# ORM 与持久层

持久层负责把业务状态可靠地存取到数据库。MyBatis 选择“SQL 显式可控”的路线，开发者需要同时承担 SQL 正确性、映射、事务和性能责任。

## 文档

| 文档 | 重点 | 状态 |
| --- | --- | --- |
| [MyBatis 详解](./framework-orm-mybatis-overview.md) | 会话、Mapper、动态 SQL、缓存、事务和 N+1 | 已完善 |

## 完成标准

- Mapper 方法的输入、输出和事务边界明确。
- 参数绑定只使用安全方式，动态集合有上限与空值处理。
- 能通过 SQL 日志发现 N+1、回表和分页问题。
- 关键状态迁移使用条件更新，并验证受影响行数。
- 集成测试覆盖真实 SQL、映射、并发和数据库方言。

关联阅读：[数据库](../../db/README.md)、[测试](../../dev-spec/dev-spec-testing.md)。

状态：已完善。
