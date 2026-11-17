---
title: SQL 语言
category:
  - db
  - SQL
tag:
  - SQL
  - 查询
  - 事务
description: 掌握 SQL 的数据定义、查询、事务和可维护写法，能够安全地完成业务查询与数据变更。
order: 20
outline: [2, 3]
---

# SQL 语言

## 1. 学习目标

本篇将 SQL 视为业务规则的可执行表达。学习后应能独立完成表定义、增删改查、复杂关联、窗口统计和事务控制，并能解释 SQL 的结果正确性与性能边界。

## 2. 适用场景

SQL 适合结构化数据的持久化、约束校验、聚合分析和事务处理。报表、批量数据修复和管理查询可以直接使用 SQL；在线服务应由稳定接口封装 SQL，避免把权限与业务规则散落在客户端。

SQL 不适合二进制大文件存储、复杂无结构文档检索和高频轻量缓存，这些通常分别使用对象存储、搜索引擎或 Redis。

## 3. 核心原理

### 3.1 SQL 语言分类

| 类别 | 常见语句 | 作用 |
| --- | --- | --- |
| DDL | `CREATE`、`ALTER`、`DROP` | 修改数据库对象结构 |
| DML | `SELECT`、`INSERT`、`UPDATE`、`DELETE` | 读取和修改数据 |
| DCL | `GRANT`、`REVOKE` | 管理权限 |
| TCL | `COMMIT`、`ROLLBACK`、`SAVEPOINT` | 控制事务 |

### 3.2 查询执行逻辑

逻辑上，查询先确定数据来源（`FROM`/`JOIN`），再执行 `WHERE` 过滤，随后分组（`GROUP BY`）、过滤分组（`HAVING`）、计算表达式（`SELECT`），最后去重、排序和限制。理解该顺序有助于解释为什么聚合列不能直接放在 `WHERE` 中。

### 3.3 集合与关联

`INNER JOIN` 返回双方匹配行，`LEFT JOIN` 保留左表全部行。外连接中的普通右表条件写在 `WHERE` 可能意外过滤左表行，应写进 `ON`。关联字段类型必须一致，一对多关联可能复制行，聚合前要先确认数据粒度。

### 3.4 事务

事务把多个语句变成一个逻辑操作。提交前可以回滚；提交后应由补偿事务处理业务撤销。应用层连接池要关闭自动提交时明确事务范围，禁止把未提交事务连接归还连接池。

## 4. 技术决策与对比

| 场景 | 推荐写法 | 不推荐写法 | 原因 |
| --- | --- | --- | --- |
| 分页 | 基于有序唯一键的游标 | 深度 `OFFSET` | 避免扫描并丢弃前面的数据 |
| 批量更新 | 集合式 `UPDATE ... JOIN` | 循环单行提交 | 减少网络往返与锁开销 |
| 去重 | 明确保留规则后使用窗口函数 | 随意 `GROUP BY` | 避免丢错行 |
| 条件写入 | 唯一键 + `ON DUPLICATE KEY`/`ON CONFLICT` | 先查再插 | 原子且可处理并发 |
| 软删除 | 索引包含删除状态和查询条件 | 全表标记 | 避免活跃数据被历史数据淹没 |

## 5. 工程实现

### 5.1 建表与约束

```sql
CREATE TABLE app_user (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_app_user_email UNIQUE (email),
  CONSTRAINT ck_app_user_status CHECK (status IN ('ACTIVE', 'DISABLED'))
);

CREATE INDEX idx_app_user_status_created
  ON app_user (status, created_at);
```

### 5.2 关联与聚合

```sql
SELECT
  u.id,
  u.email,
  COUNT(o.id) AS paid_order_count,
  COALESCE(SUM(o.amount), 0) AS paid_amount
FROM app_user AS u
LEFT JOIN app_order AS o
  ON o.user_id = u.id
 AND o.status = 'PAID'
WHERE u.status = 'ACTIVE'
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 0
ORDER BY paid_amount DESC, u.id
LIMIT 100;
```

### 5.3 窗口查询

```sql
SELECT
  user_id,
  order_id,
  amount,
  ROW_NUMBER() OVER (
    PARTITION BY user_id
    ORDER BY created_at DESC, order_id DESC
  ) AS row_num
FROM app_order
WHERE status = 'PAID';
```

### 5.4 事务写入

```sql
START TRANSACTION;

UPDATE inventory
SET stock = stock - 1
WHERE sku = 'SKU-1001' AND stock >= 1;

UPDATE app_order
SET status = 'PAID'
WHERE order_no = 'ORD-20261116-001'
  AND status = 'PENDING';

COMMIT;
```

若任一语句未影响预期行数，应用应执行 `ROLLBACK`。

## 6. 生产实践

- 在线查询设置超时和最大返回行数，管理查询使用只读账号。
- 所有 DDL 和数据修复脚本进入版本库，执行前备份并记录变更单。
- 查询返回列写明字段，不用 `SELECT *` 作为持久接口。
- 动态条件使用参数化查询，绝不拼接用户输入。
- 批处理使用小批次提交，避免大事务锁表和复制延迟。
- 测试至少覆盖空数据、重复数据、并发写入、非法状态和分页边界。

## 7. 常见坑与排查

1. **`NULL` 参与比较**：`NULL = NULL` 不成立，需要使用 `IS NULL`；聚合函数通常忽略 `NULL`。
2. **字符串数字隐式转换**：关联或过滤时类型不一致可能导致索引失效。
3. **外连接条件放错位置**：`WHERE` 中条件可能把外连接退化为内连接。
4. **无序分页不稳定**：没有唯一排序键时，相同值可能在不同页重复或漏掉。
5. **时区错误**：数据库时区、JVM/Python 时区和 API 时区必须统一。
6. **`DELETE` 范围失控**：数据修复先执行相同条件的 `SELECT`，再在事务内更新并限制批次。
7. **把字符型时间用于范围查询**：能使用原生时间类型时不要存字符串时间。

排查慢 SQL 时保留 SQL 文本、参数、执行计划、实际返回行数和当时数据量，不要只截图 `EXPLAIN`。

## 8. 总结与关联阅读

SQL 的正确性来自清晰的数据粒度、显式约束和事务边界，性能来自匹配查询的索引与写法。任何数据修复都要可观察、可回滚、可复核。

关联阅读：[数据库原理](./db-sql-theory.md)、[MySQL 详解](../sql-mysql/db-sql-mysql-overview.md)、[API 设计](../../dev-spec/dev-spec-api-design.md)、[测试](../../dev-spec/dev-spec-testing.md)。
