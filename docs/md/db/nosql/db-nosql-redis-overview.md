---
title: Redis 详解
category:
  - db
  - NoSQL
tag:
  - Redis
  - 缓存
  - 分布式锁
description: 掌握 Redis 数据结构、持久化、集群和缓存一致性设计，避免把缓存当成可靠事实源。
order: 40
outline: [2, 3]
---

# Redis 详解

## 1. 学习目标

读完后应能为热点读、限流、去重和分布式协调选择正确的 Redis 数据结构，设计缓存键、TTL、并发回填和降级方案，并识别主从切换、内存淘汰和大键带来的风险。示例面向 Redis 7.x。

## 2. 适用场景

Redis 适合低延迟、可容忍最终一致的热数据、会话、计数器、限流和轻量协调。它能把关系库的热点读压力转移到内存，但不应作为订单、余额等不可丢事实数据的唯一存储。

当数据规模超过内存成本、需要复杂分析或必须以数据库事务为中心时，优先将 Redis 放在缓存和加速层。需要持久、强一致、复杂查询的数据放 MySQL 或其他事实源。

## 3. 核心原理

### 3.1 数据结构

- `STRING`：缓存值、计数器和简单锁。
- `HASH`：对象字段级读写，注意大 hash 会阻塞。
- `LIST`：轻量队列和时间线，消费失败处理不等同于可靠 MQ。
- `SET`/`ZSET`：去重、标签、排行榜、延迟队列。
- `BITMAP`/`HyperLogLog`/`GEO`：布尔状态、基数估算和位置查询。

结构选择必须基于访问模式，而不是仅看业务名词。不要用一个大 `STRING` 保存可独立过期的字段。

### 3.2 单线程模型与阻塞

Redis 命令执行通常是单线程，慢命令会放大所有客户端延迟。大键删除、大集合遍历、`KEYS`、`FLUSHALL` 和复杂 Lua 都要控制范围。网络、持久化和后台线程也会影响整体吞吐。

### 3.3 持久化和复制

RDB 是快照，恢复快但可能丢失最后一次快照后的写入；AOF 记录写命令，可配置 `everysec` 或 `always`。主从复制是异步的，故障切换可能丢失最近写入。Redis Cluster 以槽（slot）分片，跨槽事务和多键操作受限。

### 3.4 缓存一致性

推荐先更新数据库、再使缓存失效，并为缓存值设置 TTL 作为兜底。读穿透用空值缓存、布隆过滤器和限流；热点用本地缓存 + Redis + 数据库分层。缓存只能减少数据库压力，不能让不存在的数据成为不可反驳的事实。

## 4. 技术决策与对比

| 场景 | 推荐方案 | 不推荐 | 原因 |
| --- | --- | --- | --- |
| 缓存对象 | 短小 JSON 或 Hash + TTL | 大对象整存 | 读放大和网络成本 |
| 防重复 | 唯一键 `SET NX PX` | 非原子先查再设 | 并发会产生重复 |
| 排行榜 | `ZSET` + 分页范围查询 | 每次排序数据库 | Redis 原生有序 |
| 延迟任务 | `ZSET` + 轮询/可靠队列 | `EXPIRE` 回调执行业务 | 过期事件不是可靠任务完成 |
| 分布式锁 | Redisson/Redlock 谨慎评估 | `SETNX` 无租约 | 客户端崩溃可能锁死 |
| 强一致 | 事实源数据库 + 事务 | 依赖 Redis 主从 | 复制和切换存在丢失窗口 |

## 5. 工程实现

### 5.1 缓存读写

```java
public Optional<String> findName(String key) {
    String cached = stringRedisTemplate.opsForValue().get(key);
    if (cached != null) {
        return "NULL".equals(cached) ? Optional.empty() : Optional.of(cached);
    }

    String name = userRepository.findName(key);
    if (name == null) {
        stringRedisTemplate.opsForValue().set(key, "NULL", Duration.ofMinutes(1));
        return Optional.empty();
    }

    stringRedisTemplate.opsForValue().set(key, name, Duration.ofMinutes(30));
    return Optional.of(name);
}
```

### 5.2 原子防重

```text
SET request:{requestId} 1 NX PX 300000
```

只有返回 `OK` 才执行首次操作；重复请求返回“处理中或已完成”，并在业务表中再以唯一键兜底。`requestId` 必须覆盖同一业务操作的重试。

### 5.3 Lua 限流

```lua
local current = tonumber(redis.call('GET', KEYS[1]) or '0')
if current >= tonumber(ARGV[1]) then
  return 0
end
redis.call('INCR', KEYS[1])
if current == 0 then
  redis.call('PEXPIRE', KEYS[1], ARGV[2])
end
return 1
```

调用端以业务限流键作为 `KEYS[1]`，阈值和窗口毫秒数作为参数；时间窗口切换、集群 key 哈希和突发流量要单独测试。

## 6. 生产实践

- 键名使用 `业务:对象:ID:字段`，统一前缀、版本和 TTL；禁止裸用户输入拼键。
- 为 Redis 配置最大内存、合理 `maxmemory-policy`，缓存通常使用 `allkeys-lru`，但业务会话要评估淘汰影响。
- 监控命中率、命令延迟、连接数、内存、碎片率、主从延迟、慢日志和集群槽迁移。
- 大键扫描、迁移和清理必须限速，避免影响在线请求。
- 客户端设置连接超时、读写超时、有限重试和熔断，Redis 故障时能回源或降级。
- 多可用区部署要分别评估 Cluster、代理和客户端分片，不把单点哨兵当作跨机房容灾。

## 7. 常见坑与排查

1. **缓存穿透**：数据库不存在的数据被反复查询，用空值缓存、布隆过滤和接口校验。
2. **缓存击穿**：热点键过期瞬间大量回源，使用互斥回填、逻辑过期或本地热点缓存。
3. **缓存雪崩**：大量键同时过期或 Redis 宕机，使用 TTL 抖动、限流、熔断和数据库保护。
4. **删除不一致**：更新数据库后删除缓存失败，要可靠重试、订阅变更或依靠 TTL 接受短暂旧值。
5. **分布式锁误用**：进程停顿超过锁租约、时钟跳变和跨客户端解锁都可能破坏安全性。
6. **`KEYS` 阻塞**：生产使用 `SCAN` 并限制数量；更好的做法是维护索引集合。
7. **集群多键报错**：跨槽事务、Lua 多键需要 hash tag 或业务拆分。
8. **大字符串和大集合**：内存、带宽和删除都会变慢，拆分、分页或流式处理。

排查命中率下降时，同时观察请求量、键 TTL、数据热点、Redis 延迟和数据库回源量，不能只调 TTL。

## 8. 总结与关联阅读

Redis 的价值是快速、灵活的内存数据结构，不是第二事实数据库。缓存方案必须明确一致性、失效、降级和故障边界，并以监控验证收益。

关联阅读：[数据库原理](../sql/db-sql-theory.md)、[分布式系统概述](../../arch/distributed/arch-distributed-overview.md)、[性能与故障排查](../../dev-spec/dev-spec-performance-troubleshooting.md)、[Netty 详解](../../framework/netty/framework-netty-overview.md)。
