---
title: MySQL
category:
  - db
  - MySQL
tag:
  - MySQL
  - InnoDB
description: MySQL 存储引擎、事务、索引、复制和调优导航。
order: 20
outline: [2, 3]
---

# MySQL

MySQL 是关系型业务系统的常见事实数据源。本目录强调 InnoDB 的事务与索引机制、SQL 调优方法以及主从高可用，而不是罗列参数。

## 文档

| 文档 | 重点 | 状态 |
| --- | --- | --- |
| [MySQL 详解](./db-sql-mysql-overview.md) | InnoDB、MVCC、索引、复制、备份和调优 | 已完善 |

## 学习检查点

1. 能解释为什么二级索引可能回表，以及覆盖索引如何减少回表。
2. 能为热点更新选择条件更新、乐观锁或悲观锁。
3. 能把慢查询从发现、分析优化到回归验证闭环。
4. 能说明异步复制、半同步复制和写后读主库的取舍。
5. 能为大表 DDL、备份恢复、连接池和主从切换制定检查清单。

## 关联主题

- 基础原理：[SQL 与关系模型](../sql/README.md)
- 分片扩展：[ShardingSphere](../../framework/ds-sharding/framework-ds-sharding-sphere-overview.md)
- 故障排查：[性能与故障排查](../../dev-spec/dev-spec-performance-troubleshooting.md)

状态：已完善。
