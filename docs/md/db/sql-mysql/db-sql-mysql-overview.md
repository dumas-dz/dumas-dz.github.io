---
title: MySQL 详解
category:
  - db
  - MySQL
tag:
  - MySQL
  - InnoDB
  - SQL 调优
description: 从 InnoDB、索引、事务、复制和 SQL 调优理解 MySQL 的生产使用方式。
order: 30
outline: [2, 3]
---

# MySQL 详解

## 1. 学习目标

学习后应能设计可演进的 MySQL 表结构，判断一条查询为什么走或不走索引，处理常见并发问题，并为单机、主从和分库分表场景制定可恢复、可监控的运行方案。示例默认面向 MySQL 8.0+。

## 2. 适用场景

MySQL 适合在线事务处理，尤其是关系清晰、写入量可控、需要成熟生态和运维工具的业务。内容管理、订单、用户和权限等系统通常以 MySQL 作为事实数据源。

当数据达到单实例的容量或连接上限时，优先优化索引和 SQL、读写分离、归档冷数据，再考虑分库分表。超大规模分析查询更适合 ClickHouse 等分析型数据库，全文检索可结合 Elasticsearch。

## 3. 核心原理

### 3.1 服务层与存储层

Server 层负责连接、解析、优化、执行和权限；InnoDB 负责数据页、缓冲池、事务、锁、MVCC 和 redo/undo。逻辑 SQL 的优化由优化器决定实际访问路径。

### 3.2 InnoDB 索引

InnoDB 表按聚簇索引组织数据，主键索引的叶子节点直接保存行数据，二级索引叶子节点保存主键值，查询非覆盖索引列时可能回表。主键宜短、稳定、递增；UUID 随机写会分散页，业务编号可用作唯一约束而非聚簇主键。

最左前缀、索引下推和覆盖索引可减少扫描与回表。低基数列、频繁更新列和大文本通常不宜单独建索引。`ANALYZE TABLE` 可刷新统计信息，但不能替代重新审视索引设计。

### 3.3 事务、锁与 MVCC

InnoDB 默认为 `REPEATABLE READ`，支持快照读与当前读。`SELECT ... FOR UPDATE`、唯一索引冲突和范围更新会加锁。间隙锁和临键锁可阻止并发插入，扫描范围越大，锁冲突风险越高。

热点扣减使用条件更新：

```sql
UPDATE inventory
SET stock = stock - 1, version = version + 1
WHERE sku = 'SKU-1001' AND stock > 0;
```

应用必须检查受影响行数，并为锁等待设置 `innodb_lock_wait_timeout` 或事务级超时。

### 3.4 主从复制与高可用

异步复制吞吐高但可能丢事务；半同步复制降低丢失窗口但仍不等于强一致。复制延迟会影响“写后读”，需要按会话读主库、设置版本检查或业务可接受短暂旧读。高可用切换要验证数据位点、连接切换、DNS 缓存和客户端重试。

## 4. 技术决策与对比

| 问题 | 方案 | 适用条件 | 注意事项 |
| --- | --- | --- | --- |
| 主键 | 自增 BIGINT | 顺序写、通用业务 | 需处理迁移和归档 |
| 唯一业务键 | `UNIQUE` 索引 | 防止重复单号、账号 | 并发插入可能异常重试 |
| 读扩展 | 主从 + 路由 | 读多写少 | 复制延迟需业务容忍 |
| 读写强一致 | 写后读主库 | 支付、权限变更 | 主库压力增加 |
| 大表扩展 | 分库分表 | 单实例确实越界 | 跨分片查询、迁移复杂 |
| 备份 | 物理备份 + binlog | 大库、快速恢复 | 必须做恢复演练 |

## 5. 工程实现

### 5.1 表设计示例

```sql
CREATE TABLE app_order (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  order_no CHAR(32) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  status VARCHAR(24) NOT NULL,
  amount DECIMAL(18, 2) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (id),
  UNIQUE KEY uk_app_order_no (order_no),
  KEY idx_app_order_user_created (user_id, created_at),
  KEY idx_app_order_status_created (status, created_at),
  CONSTRAINT ck_app_order_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 5.2 参数化访问

```java
String sql = "SELECT id, status, amount FROM app_order "
    + "WHERE order_no = ? AND status = ?";
try (PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, orderNo);
    statement.setString(2, "PAID");
    try (ResultSet result = statement.executeQuery()) {
        if (result.next()) {
            return result.getBigDecimal("amount");
        }
    }
}
return null;
```

### 5.3 调优步骤

1. 用慢查询日志、APM 或 `performance_schema` 找到贡献最大的 SQL。
2. 确认业务预期行数，执行 `EXPLAIN ANALYZE` 查看实际耗时和循环次数。
3. 对比索引、过滤、排序和返回列，先消除无谓扫描和临时表。
4. 在生产数据副本验证执行计划，再评估参数调整。
5. 记录 SQL、计划、数据量和优化前后 P95，纳入持续监控。

## 6. 生产实践

- 开启慢查询日志和复制延迟监控，按业务来源打标签。
- 连接池必须设置最大等待、泄漏检测和连接超时；连接数不是越大越好。
- 大表 DDL 使用在线工具，评估主从延迟、磁盘和回滚方案。
- 定期校验备份可恢复性，保留至少一份异地备份。
- 对删除和归档使用批次，避免一次大事务导致 undo 膨胀。
- 敏感字段加密、最小权限、审计管理账号，生产操作使用双人复核。
- 为失败的事务、死锁和锁等待保留关联 `traceId`，便于跨服务定位。

## 7. 常见坑与排查

1. **索引存在但不使用**：检查隐式转换、函数包装、选择性和统计信息。
2. **慢在锁而不是查询**：查看 `innodb_lock_waits`、`SHOW ENGINE INNODB STATUS` 和业务事务时长。
3. **主从数据不一致**：从库可能延迟、跳过错误或被误写；使用一致性校验工具并关闭从库普通写入。
4. **`AUTO_INCREMENT` 行为误解**：ID 不连续是正常的，业务顺序不能依赖自增值。
5. **字符集不一致**：连接、表、列和程序编码要统一为 `utf8mb4`。
6. **`GROUP BY` 依赖隐式排序**：不要依赖该行为，显式使用 `ORDER BY`。
7. **删除大表后磁盘未释放**：删除表空间、备份日志和文件系统缓存会影响观察，应先核对指标。
8. **只在测试库看执行计划**：生产数据分布和配置不同，必须用近似数据验证。

排查问题时先区分 SQL 本身、锁/事务、连接池、复制和机器资源，再决定调参或改架构。

## 8. 总结与关联阅读

MySQL 的稳定性来自合理的表模型、索引与事务边界；扩展性来自主从、缓存、归档和最终必要的分片。每一次优化都要有执行计划和业务指标作为证据。

关联阅读：[数据库原理](../sql/db-sql-theory.md)、[SQL 语言](../sql/db-sql-lan.md)、[ShardingSphere 详解](../../framework/ds-sharding/framework-ds-sharding-sphere-overview.md)、[日志规范](../../dev-spec/dev-spec-logging.md)。
