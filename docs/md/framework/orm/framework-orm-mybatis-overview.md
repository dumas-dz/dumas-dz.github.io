---
title: MyBatis 详解
category:
  - 框架
  - ORM
tag:
  - MyBatis
  - ORM
  - SQL 映射
description: 理解 MyBatis 的会话、映射、动态 SQL、缓存与事务，并避免 N+1 和参数绑定问题。
order: 10
outline: [2, 3]
---

# MyBatis 详解

## 1. 学习目标

学习后应能设计 Mapper 接口和 XML 映射，使用动态 SQL 安全地完成查询与批量操作，理解一级/二级缓存、事务和插件边界，并通过日志与分页验证 SQL。示例基于 MyBatis 3.5+ 与 JDBC 事务。

## 2. 适用场景

MyBatis 适合需要精确控制 SQL、以关系模型为主、SQL 调优要求高的 Java 业务系统。它比全自动 ORM 更透明，但开发者要负责 SQL 正确性、映射一致性和 N+1 控制。

当实体关系复杂、希望对象状态托管和跨数据库自动迁移时，可评估 JPA/Hibernate；当查询高度动态且面向分析时，不要把复杂 SQL 堆入 MyBatis 动态标签。

## 3. 核心原理

### 3.1 执行链路

一次调用从 Mapper 代理进入 `SqlSession`，由 `Executor` 获取连接并执行，`StatementHandler` 设置参数和 SQL，`ResultSetHandler` 映射结果。`SqlSessionFactory` 管理配置，Spring 环境中通常由事务管理器绑定连接与会话。

### 3.2 映射与参数

`#{}` 创建预编译参数，能防 SQL 注入；`${}` 直接拼接字符串，只能用于受控标识符，并需要白名单。结果映射处理列名、嵌套对象和关联查询。列名变化应在 SQL 中显式别名，不能依赖自动映射的偶然行为。

### 3.3 动态 SQL

`if`、`choose`、`foreach` 和 `where`/`set` 适合条件查询与批量写入。所有集合参数先校验非空和最大长度，避免 `IN ()`、空 SQL 或超长请求。

### 3.4 缓存与 N+1

一级缓存位于同一会话，事务提交/关闭后失效；二级缓存是 namespace 级缓存，跨会话共享但容易因关联更新而失效。默认优先依赖数据库与外部缓存，谨慎启用二级缓存。N+1 问题通常发生在循环查询、嵌套关联映射和懒加载，应改写 JOIN、批量查询或 `fetch` 策略。

## 4. 技术决策与对比

| 问题 | MyBatis | JPA/Hibernate | 选择 |
| --- | --- | --- | --- |
| SQL 控制 | 精确可调优 | 抽象多、复杂查询需扩展 | 需要 DBA/SQL 调优时选 MyBatis |
| 对象状态 | 明确显式映射 | 自动脏检查和级联 | 复杂对象图可选 JPA |
| 动态查询 | XML/Provider 可控 | Criteria/Specification | 保持 SQL 可读和可测 |
| 跨库迁移 | 需要处理方言 | 有更多自动能力 | 统一数据库仍以行为为准 |
| 性能风险 | SQL/N+1 由开发者控制 | 懒加载/脏检查可隐藏成本 | 以真实 SQL 日志和基准测试决策 |

## 5. 工程实现

### 5.1 Mapper 接口

```java
public interface OrderMapper {
    List<OrderSummary> search(
        @Param("userId") Long userId,
        @Param("status") String status,
        @Param("limit") int limit
    );

    int updateStatus(
        @Param("orderNo") String orderNo,
        @Param("fromStatus") String fromStatus,
        @Param("toStatus") String toStatus
    );
}
```

### 5.2 XML 映射

```xml
<mapper namespace="com.example.order.OrderMapper">
  <resultMap id="orderSummaryMap" type="com.example.order.OrderSummary">
    <id column="order_no" property="orderNo"/>
    <result column="user_id" property="userId"/>
    <result column="amount" property="amount"/>
    <result column="status" property="status"/>
  </resultMap>

  <select id="search" resultMap="orderSummaryMap">
    SELECT order_no, user_id, amount, status
    FROM app_order
    <where>
      <if test="userId != null">AND user_id = #{userId}</if>
      <if test="status != null and status != ''">AND status = #{status}</if>
    </where>
    ORDER BY created_at DESC, order_no DESC
    LIMIT #{limit}
  </select>

  <update id="updateStatus">
    UPDATE app_order
    SET status = #{toStatus}, updated_at = CURRENT_TIMESTAMP
    WHERE order_no = #{orderNo}
      AND status = #{fromStatus}
  </update>
</mapper>
```

### 5.3 调用与事务

```java
@Service
public class OrderService {
    private final OrderMapper orderMapper;

    public OrderService(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Transactional
    public void markPaid(String orderNo) {
        int changed = orderMapper.updateStatus(orderNo, "PENDING", "PAID");
        if (changed != 1) {
            throw new IllegalStateException("order status changed: " + orderNo);
        }
    }
}
```

## 6. 生产实践

- 开发环境打印 SQL、参数和结果数，生产环境使用采样与慢查询日志，避免把敏感参数直接写入日志。
- 分页使用数据库能力或成熟插件，禁止把整个结果集读入内存再分页。
- 批量插入、更新设置合理批次和 `rewriteBatchedStatements` 等驱动配置，并做压测。
- Mapper 方法参数尽量少，使用明确 DTO；避免把 HTTP 请求对象直接传入 SQL。
- 所有状态迁移使用条件更新和受影响行数检查，使重试和并发安全。
- XML、注解和 Provider 选一种主风格，减少同一 SQL 多处维护。
- 为关键 Mapper 建立集成测试，用真实数据库容器验证映射和 SQL 方言。

## 7. 常见坑与排查

1. **`#{}` 与 `${}` 误用**：用户输入进入 `${}` 会形成注入；只能把受控表名/排序字段映射到白名单。
2. **动态 SQL 空条件**：`foreach` 传入空集合会生成非法 SQL，调用前校验或显式分支。
3. **N+1 查询**：开启 SQL 日志，统计每请求查询次数，关联数据优先一次查询。
4. **列名映射丢失**：数据库使用下划线、Java 使用驼峰时配置映射或 SQL 别名。
5. **二级缓存脏读**：跨 namespace 更新后旧缓存仍被读取，使用更短 TTL 或关闭二级缓存。
6. **事务边界错误**：多 Mapper 方法不在同一事务或调用远程服务占事务，需重新划分。
7. **批量写入反而慢**：单条回包、约束检查、索引和事务提交顺序都可能抵消收益。
8. **分页排序不稳定**：排序字段缺少唯一键，翻页出现重复或漏数据。

## 8. 总结与关联阅读

MyBatis 的优势是 SQL 透明可控，代价是性能、安全和映射一致性都要工程化保障。以 SQL 日志、集成测试、条件更新和事务边界把它纳入可靠的持久层。

关联阅读：[SQL 语言](../../db/sql/db-sql-lan.md)、[MySQL 详解](../../db/sql-mysql/db-sql-mysql-overview.md)、[API 设计](../../dev-spec/dev-spec-api-design.md)、[测试](../../dev-spec/dev-spec-testing.md)。
