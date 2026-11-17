---
title: Spring Boot 集成 MySQL
category:
  - Spring
tag:
  - MySQL
  - Spring Data JPA
  - 事务
description: Spring Boot 连接 MySQL、JPA/JDBC、事务、索引、分页、迁移和生产治理。
order: 4
outline: [2, 3]
---

# Spring Boot 集成 MySQL

## 学习目标

- 配置数据源、连接池、JPA/JDBC 和数据库迁移。
- 理解事务传播、隔离、懒加载、脏检查和异常转换。
- 能设计 SQL、索引、分页、重试和连接池容量。

## 适用场景

适合 OLTP 业务数据访问。Spring Data JPA 适合以聚合和对象映射为中心的 CRUD，复杂报表和批量查询可使用 JDBC/JOOQ/MyBatis。跨服务数据一致性应采用 Saga、Outbox 和幂等消费者，而不是依赖长分布式事务。

## 核心概念

### 数据访问层次

```text
Service/事务边界
-> Repository/JdbcTemplate
-> Connection Pool
-> MySQL Driver/Protocol
-> MySQL Server/Storage Engine
```

Spring Data JPA 的 `save`、脏检查和级联由实体状态机驱动；JDBC SQL 更直接，适合精确控制 SQL、批处理和锁。两种方式可以共存，但事务管理器和连接必须统一。

### 事务

事务通常在应用服务公共方法边界开启。`REQUIRED` 加入或创建事务，`REQUIRES_NEW` 挂起当前事务并新建，`NOT_SUPPORTED` 不使用事务。事务内避免远程调用、长计算和大结果遍历；异常需按运行时/受检异常和 rollback 规则处理。

### 隔离与一致性

MySQL InnoDB 提供不同隔离级别，默认通常为 REPEATABLE READ，但以实例配置为准。应用仍要处理丢失更新、唯一约束、死锁和不可重复读。业务扣减优先原子 SQL 或乐观锁，不能先查后写而不加保护。

### 连接池

HikariCP 连接池大小不是并发 QPS 上限。连接数应小于 MySQL 可承受连接，并结合事务时间、慢查询和 CPU 设置。连接超时、最大生命周期、泄漏检测和验证时间都有生产含义。

## 工程实现

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql:3306/order_db?useUnicode=true&characterEncoding=utf8&serverTimezone=UTC
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 2000
      max-lifetime: 1800000
      leak-detection-threshold: 10000
  jpa:
    open-in-view: false
    hibernate:
      ddl-auto: validate
    properties:
      hibernate.jdbc.batch_size: 50
```

```java
import jakarta.persistence.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Entity
@Table(name = "orders", indexes = @Index(name = "idx_orders_status_created", columnList = "status,created_at"))
public class OrderEntity {
    @Id
    private String id;
    private String status;
    private long version;
}

@Repository
interface OrderRepository extends JpaRepository<OrderEntity, String> {
    @Query("""
        select o from OrderEntity o
        where o.status = :status
        order by o.createdAt desc, o.id desc
    """)
    org.springframework.data.domain.Page<OrderEntity> findByStatus(
        String status,
        org.springframework.data.domain.Pageable pageable
    );
}

@org.springframework.stereotype.Service
class OrderService {
    private final OrderRepository repository;

    OrderService(OrderRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void complete(String id) {
        OrderEntity order = repository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("order not found"));
        order.complete();
    }
}
```

实体字段和 `createdAt` 等访问器按项目补全。生产迁移使用 Flyway/Liquibase 管理 DDL，`ddl-auto` 仅适合本地实验。

## 生产实践

- 数据库变更使用版本化迁移，可执行、可回滚或有前向修复，并在 CI 中验证。
- 查询必须使用索引验证 `EXPLAIN ANALYZE`，索引按过滤、排序和写入成本共同设计。
- 分页有最大页大小，批量写分块并控制事务时长。
- 为 SQL 记录语句模板、耗时、行数和错误，不记录完整敏感参数。
- 监控连接池活跃/等待、慢 SQL、锁等待、死锁、复制延迟、磁盘和缓冲池。
- 数据库重试只用于明确瞬时错误，且业务操作需幂等；死锁可有限重试。

## 常见问题

### 为什么出现 `LazyInitializationException`？

实体在事务外访问懒加载关联。修复方式是事务内映射 DTO、使用 `join fetch`/EntityGraph，或建模显式查询；不要长期开启 `open-in-view` 掩盖边界问题。

### 为什么连接池经常耗尽？

慢 SQL、长事务、未提交连接、外部调用占事务或池配置错误。先看连接等待栈和事务时长，不要只扩大连接数。

### 乐观锁如何实现？

使用 `@Version` 或版本列，在更新时检查版本；冲突捕获 `OptimisticLockingFailureException` 并返回 409/412 或有限重试。

### 面试追问：`save` 为什么可能执行多次 SQL？

实体状态决定 insert/update，合并关联、脏检查和生成键会触发额外查询。使用 SQL 日志和持久化上下文知识判断，不能把 `save` 简单等同一条 SQL。

## 总结与延伸

数据访问的核心是事务、SQL 成本、连接池和一致性。接口事务入口见[Spring Boot 接口设计](./spring-boot-interface-resp.md)，SQL 基础参见[数据库](../../db/README.md)。

## 关联阅读

- [Spring Boot 接口设计实现](./spring-boot-interface-resp.md)
- [Spring Framework AOP](../spring-framework/spring-framework-aop.md)
- [数据库](../../db/README.md)
