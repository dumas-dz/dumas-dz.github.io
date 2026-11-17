---
title: 数据库
category:
  - db
tag:
  - 数据库
  - 存储选型
description: 数据库原理、SQL、MySQL 与常见 NoSQL 的学习地图和工程选型。
order: 10
outline: [2, 3]
---

# 数据库

数据库是业务事实数据的底座。这里从关系模型与事务出发，覆盖 SQL、MySQL、Redis、MongoDB 和 Elasticsearch，目标是让开发者既能写出正确数据，也能解释性能、一致性和扩展边界。

## 学习路线

1. 先学[数据库原理](./sql/db-sql-theory.md)，掌握事务、隔离、MVCC、索引和执行计划。
2. 用 [SQL 语言](./sql/db-sql-lan.md)完成建模、复杂查询、事务和数据修复。
3. 深入 [MySQL 详解](./sql-mysql/db-sql-mysql-overview.md)，理解 InnoDB、复制、调优和高可用。
4. 按访问模式学习 NoSQL：[Redis 详解](./nosql/db-nosql-redis-overview.md)、[MongoDB 详解](./nosql/db-nosql-mongodb-overview.md)、[Elasticsearch 详解](./nosql/db-nosql-elasticsearch-overview.md)。
5. 结合[架构与分布式](../arch/README.md)和[工程规范](../dev-spec/README.md)完成生产化。

## 知识地图

| 主题 | 核心问题 | 状态 |
| --- | --- | --- |
| [SQL 与关系模型](./sql/README.md) | 如何保证正确、可查询、可演进 | 已完善 |
| [MySQL](./sql-mysql/README.md) | 如何调优事务、索引、复制和容量 | 已完善 |
| [Redis](./nosql/db-nosql-redis-overview.md) | 如何用缓存加速并控制一致性 | 已完善 |
| [MongoDB](./nosql/db-nosql-mongodb-overview.md) | 如何按读写模式设计文档与分片 | 已完善 |
| [Elasticsearch](./nosql/db-nosql-elasticsearch-overview.md) | 如何做检索、聚合和日志查询 | 已完善 |

## 选型原则

- **MySQL**：关系约束、事务和复杂查询是核心。
- **Redis**：热数据、计数、限流和轻量协调，不作为唯一事实源。
- **MongoDB**：文档演化快、按文档读写、需要灵活扩展。
- **Elasticsearch**：全文检索、聚合探索、日志和搜索投影。
- 组合使用时，明确事实源、同步方式、延迟、幂等和重建能力，避免“每个组件都存一份但没有负责人”。

## 生产检查清单

- 事实数据是否有唯一约束、备份和恢复演练？
- 热点查询是否有索引与执行计划证据？
- 缓存或搜索索引是否有 TTL、降级和重建路径？
- 慢查询、复制延迟、内存、磁盘、命中率是否可观测？
- 数据修复是否可审计、分批、可回滚？

状态：已完善。新增文档时请同步本页知识地图和子目录 README。
