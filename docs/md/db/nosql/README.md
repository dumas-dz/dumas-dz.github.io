---
title: NoSQL
category:
  - db
  - NoSQL
tag:
  - Redis
  - MongoDB
  - Elasticsearch
description: Redis、MongoDB、Elasticsearch 的模型差异、适用边界和工程实践。
order: 30
outline: [2, 3]
---

# NoSQL

NoSQL 不是一个统一模型。Redis 面向内存数据结构，MongoDB 面向文档，Elasticsearch 面向检索投影；三者的正确性、性能和运维约束都不同。

## 文档

| 文档 | 核心模型 | 典型场景 | 状态 |
| --- | --- | --- | --- |
| [Redis 详解](./db-nosql-redis-overview.md) | 内存键值与数据结构 | 缓存、计数、限流、轻量协调 | 已完善 |
| [MongoDB 详解](./db-nosql-mongodb-overview.md) | BSON 文档与副本集/分片 | 商品资料、行为、内容管理 | 已完善 |
| [Elasticsearch 详解](./db-nosql-elasticsearch-overview.md) | 倒排索引与分布式搜索 | 全文检索、聚合、日志 | 已完善 |

## 选型对比

| 维度 | Redis | MongoDB | Elasticsearch |
| --- | --- | --- | --- |
| 一致性 | 可丢缓存、异步复制 | 单文档原子、可选多数确认 | 近实时、最终一致投影 |
| 查询 | 键与数据结构命令 | 文档条件、聚合、关联 | 全文、过滤、排序、聚合 |
| 扩展 | Cluster/代理分片 | 副本集与分片 | 索引分片与副本 |
| 主要风险 | 内存、大键、缓存失效 | 文档膨胀、索引、热点分片 | mapping、分片、查询成本 |
| 事实源 | 通常不是 | 通常是 | 通常不是 |

## 通用实践

- 事实源、缓存和搜索投影之间明确同步、版本、幂等和重建。
- 所有请求设置超时、有限重试、限流和降级。
- 键、文档、索引均需命名规范、容量预算、TTL/保留策略和可观测性。
- 用真实数据规模和故障演练验证，不凭本地小数据做架构决策。

状态：已完善。
