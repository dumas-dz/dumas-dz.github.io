---
title: ShardingSphere 详解
category:
  - 框架
  - 数据库
tag:
  - ShardingSphere
  - 分库分表
  - 分布式事务
description: 理解 ShardingSphere 的分片、读写分离、分布式 ID、事务和扩容，降低分库分表复杂度。
order: 80
outline: [2, 3]
---

# ShardingSphere 详解

## 1. 学习目标

学习后应能评估是否真的需要分片，设计分片键和路由规则，配置读写分离与分布式 ID，理解 ShardingSphere-JDBC/Proxy 的差异，并规划迁移、扩容、事务和 SQL 兼容性。示例面向 ShardingSphere 5.x。

## 2. 适用场景

ShardingSphere 适合单关系库连接数、容量、写入或恢复时间确实接近上限的业务，尤其是订单、流水和用户数据的水平扩展。它通过分片算法把逻辑表路由到物理分片，并提供读写分离、加密、影子库和分布式事务能力。

单机 MySQL 可以通过索引、归档和读写分离满足时，不应提前分片。分片会改变 SQL 能力、唯一键语义、事务边界和运维方式，收益必须有容量与延迟数据支撑。

## 3. 核心原理

### 3.1 分片键与路由

分片键决定数据落在哪个分片，常见按租户、用户 ID、订单 ID 哈希或范围分片。高基数、写入均匀、能覆盖大部分查询的键更适合；查询没有分片键会产生全分片路由。分片键一旦确定，迁移和查询习惯都很难变化。

### 3.2 分片算法

哈希分片均衡容量，范围分片利于范围查询但易产生热点，一致性哈希减少扩容迁移但热点仍存在。分片数应为扩容预留空间，但过多分片会增加连接、元数据和运维成本。复合分片、时间分片和自定义算法要明确边界。

### 3.3 读写分离与分布式 ID

读写分离把 SELECT 路由到从库，写入到主库；复制延迟会影响写后读。分布式 ID 可选雪花、Segment、UUID 或数据库号段，重点是时钟回拨、唯一性、趋势和可运维。

### 3.4 事务与 SQL 兼容

单分片事务接近本地事务；跨分片事务使用 XA/Bedrock 等模式，成本更高。跨分片 JOIN、排序、聚合、唯一约束和自增主键的语义都会变化，应用必须理解路由范围。

## 4. 技术决策与对比

| 方案 | 优点 | 代价 | 适用 |
| --- | --- | --- | --- |
| 单库 + 索引/归档 | 复杂度最低 | 单机容量上限 | 优先评估 |
| 读写分离 | 读扩展快 | 复制延迟、写后读 | 读多写少 |
| 分库分表 | 水平扩展 | 路由、事务、查询复杂 | 数据确实越界 |
| ShardingSphere-JDBC | 应用内路由、部署简单 | 每个应用都要配置/升级 | Java 应用集中 |
| ShardingSphere-Proxy | 对应用透明、统一入口 | 多一层网络和运维 | 多语言/统一管控 |

## 5. 工程实现

### 5.1 分片规则示意

```yaml
dataSources:
  ds0:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://db0:3306/order
    username: app
    password: ${DB_PASSWORD}
  ds1:
    dataSourceClassName: com.zaxxer.hikari.HikariDataSource
    jdbcUrl: jdbc:mysql://db1:3306/order
    username: app
    password: ${DB_PASSWORD}

rules:
  - !SHARDING
    tables:
      app_order:
        actualDataNodes: ds$->{0..1}.app_order_$->{0..3}
        tableStrategy:
          standard:
            shardingColumn: order_no
            shardingAlgorithmName: order-hash
        keyGenerateStrategy:
          column: id
          keyGeneratorName: snowflake
    shardingAlgorithms:
      order-hash:
        type: HASH_MOD
        props:
          sharding-count: 4
    keyGenerators:
      snowflake:
        type: SNOWFLAKE
```

实际部署应从配置中心注入密码，规则变更要有灰度、回滚和兼容校验。

### 5.2 查询约束

```sql
-- 有分片键，可路由到单分片
SELECT id, status, amount
FROM app_order
WHERE order_no = 'ORD-20261116-001';

-- 无分片键，可能广播到所有分片
SELECT id, status
FROM app_order
WHERE status = 'PENDING';
```

应用应为无分片键查询设置超时、上限和审批，报表走归档/分析库，不直接拖垮在线分片。

## 6. 生产实践

- 先建立容量模型：行数、数据量、TPS、连接、恢复时间和查询模式，明确何时拆分。
- 分片键、分片数和扩容方案在上线前压测，避免第一次扩容才发现数据倾斜。
- 使用统一分布式 ID，禁止依赖跨分片自增 ID 保证全局顺序。
- 为跨分片事务定义业务边界和补偿，优先让事务落在单分片。
- 监控每分片 QPS、延迟、磁盘、复制、连接、路由广播数和跨分片事务失败。
- 迁移使用双写/增量同步、校验和切换窗口，保留旧路径和回滚。
- 数据库账号按分片、读写和管理操作最小权限，审计路由规则变更。

## 7. 常见坑与排查

1. **分片键设计失误**：按低基数状态或时间单键分片导致热点/全路由，重新评估字段组合。
2. **无分片键查询打全库**：日志中出现大量广播路由，为查询补充分片键或改走分析库。
3. **跨分片唯一约束失效**：唯一键只在单分片内保证，业务键需要全局检查、号段或独立协调。
4. **分布式 ID 时钟回拨**：雪花 ID 可能失败或重复风险，等待、备用位或使用号段生成器。
5. **读写分离读到旧值**：支付/权限写后读主库，或用版本号和路由 hint。
6. **事务超时放大**：跨分片事务提交慢、回查多，缩短事务并避免调用外部服务。
7. **扩容后 key 路由变化**：分片数变更改变哈希落点，需要数据迁移和路由兼容。
8. **SQL 兼容性**：某些复杂 JOIN、子查询、函数和跨分片排序不支持或性能差，纳入 SQL 审核。

## 8. 总结与关联阅读

ShardingSphere 是分库分表的工程化工具，不是无限扩展开关。只有在数据模型、容量和故障边界明确后才引入，并持续监控路由成本和事务风险。

关联阅读：[MySQL 详解](../../db/sql-mysql/db-sql-mysql-overview.md)、[数据库原理](../../db/sql/db-sql-theory.md)、[分布式事务与幂等](../../arch/distributed/arch-distributed-overview.md)、[性能与故障排查](../../dev-spec/dev-spec-performance-troubleshooting.md)。
