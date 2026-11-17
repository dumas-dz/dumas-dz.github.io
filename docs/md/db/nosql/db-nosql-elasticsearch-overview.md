---
title: Elasticsearch 详解
category:
  - db
  - NoSQL
tag:
  - Elasticsearch
  - 搜索引擎
  - 可观测性
description: 从倒排索引、分析器、查询 DSL 和集群运行理解 Elasticsearch 的搜索与聚合工程。
order: 60
outline: [2, 3]
---

# Elasticsearch 详解

## 1. 学习目标

学习后应能为站内搜索、日志和指标场景设计 mapping 与 analyzer，使用相关性查询和聚合构建检索能力，理解分片、副本、写入刷新和索引生命周期。示例面向 Elasticsearch 8.x。

## 2. 适用场景

Elasticsearch 适合全文检索、多条件筛选、聚合分析、日志检索和低延迟探索式查询。文档以索引和分片组织，倒排索引支持词项匹配，正排字段支持排序和聚合。

它不是关系数据库，不承担复杂跨文档事务；数据可以由 MySQL、MongoDB 或对象存储作为事实源，通过 CDC、队列或导入管道同步。严格关系约束、频繁跨实体更新通常放主库，搜索索引作为查询投影。

## 3. 核心原理

### 3.1 倒排索引与分析器

写入时 analyzer 完成字符过滤、分词和 token 过滤，生成词项到文档列表的倒排索引。中文搜索需要按业务选择标准分词、IK 或自定义词典；全文搜索、关键词聚合和排序字段的类型不同。

`text` 默认可全文分析，`keyword` 适合精确匹配、聚合和排序。日期、布尔和数值类型能正确比较和范围过滤。Mapping 一旦确定，字段类型修改通常需要重建索引或使用别名迁移。

### 3.2 查询、过滤和相关性

查询上下文计算相关性得分，过滤上下文只判断是否命中且可缓存。`bool` 查询组合 `must`、`should`、`filter` 和 `must_not`。筛选条件放 `filter`，全文关键词放 `must` 或 `should`，不要把所有条件混成高成本模糊查询。

BM25 根据词频、反文档频率和字段长度评分。业务相关性需要通过搜索测试集、点击反馈和排序规则持续调优，不能只看“能搜到”。

### 3.3 写入、刷新和近实时搜索

写入先进入内存和 translog，经过 refresh 后才可搜索。refresh 默认约 1 秒，频繁 refresh 会增加段和 IO；写入量大时使用批量、调整 refresh 间隔并恢复默认。段合并影响写入放大和查询延迟。

### 3.4 分片、副本和集群

索引拆分为 primary shard，副本提供读容量和容错。分片数量在创建后难以直接调整，过多分片增加堆内存和调度压力，过少限制扩展。集群状态、磁盘水位、热点节点和段合并需要持续观察。

## 4. 技术决策与对比

| 场景 | 推荐 | 不推荐 | 原因 |
| --- | --- | --- | --- |
| 关键词聚合 | `keyword` | 对 `text` 直接聚合 | 分析字段不是精确词项 |
| 精确筛选 | `filter` + `term` | 全部 `must` 模糊匹配 | 可缓存、得分稳定 |
| 中文全文 | 业务词典 + 分词测试 | 只用 whitespace | 中文分词影响召回 |
| 指标分析 | 时序数据流 + ILM | 无限增长普通索引 | 便于冷热和删除 |
| 精确计数 | 聚合后核对数据库 | 近似基数直接当账务 | 搜索索引允许短暂不一致 |
| 同步 | CDC/消息 + 幂等消费 | 每次双写无补偿 | 避免漏写和重复写 |

## 5. 工程实现

### 5.1 Mapping 示例

```json
PUT /product-search
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
    "analysis": {
      "analyzer": {
        "product_cn": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text",
        "analyzer": "product_cn",
        "fields": {"keyword": {"type": "keyword", "ignore_above": 256}}
      },
      "status": {"type": "keyword"},
      "price": {"type": "scaled_float", "scaling_factor": 100},
      "updated_at": {"type": "date"}
    }
  }
}
```

### 5.2 搜索请求

```json
POST /product-search/_search
{
  "query": {
    "bool": {
      "must": [{"match": {"title": "无线耳机"}}],
      "filter": [
        {"term": {"status": "ON_SALE"}},
        {"range": {"price": {"gte": 10000, "lte": 50000}}}
      ]
    }
  },
  "sort": [{"_score": "desc"}, {"updated_at": "desc"}],
  "from": 0,
  "size": 20
}
```

### 5.3 同步管道

主库变更事件包含业务 ID、版本、操作类型和变更时间。消费者按 ID 幂等 upsert，删除事件使用墓碑或版本比较，失败事件进入重试队列。搜索索引可以重建，主库数据不可因同步失败丢失。

## 6. 生产实践

- 使用 `bulk` 批量写入，控制请求大小、并发和重试，避免一次大请求阻塞节点。
- 设置 ILM、冷热分层和保留策略；日志索引按时间滚动并定期删除。
- 监控集群状态、节点磁盘、heap、GC、索引速率、查询延迟、慢查询、段数量和副本分配。
- 使用别名做零停机重建 mapping；重建期间并行写入新旧索引或通过 CDC 重放。
- 为查询设置超时、结果上限和熔断，防止复杂聚合打满 CPU。
- 保留搜索评测集合，比较召回率、精确率、点击率和 P95 延迟。
- 认证、TLS、最小权限和审计访问生产集群，防止未受控的写入或删除。

## 7. 常见坑与排查

1. **查询不命中**：先检查 analyzer、keyword/text 和字段值的实际分词结果。
2. **聚合结果与业务账目不一致**：索引同步有延迟、近似算法或分页查询遗漏，最终一致数据要标注口径。
3. **深分页耗尽资源**：大页数查询改用 `search_after`，不要无限提升 `from + size`。
4. **写入突然变慢**：检查 refresh、段合并、bulk 大小、磁盘水位和副本写入。
5. **分片过多**：小索引大量分片造成元数据和 JVM 压力，按容量、查询和恢复目标规划。
6. **mapping 不可变**：字段类型变更后查询错误，使用新索引 + 别名迁移。
7. **模糊查询成本失控**：限制 `fuzziness`、前缀和 wildcard 范围，对用户输入做长度和特殊字符处理。
8. **数据删除误伤**：删除模板、索引和生命周期策略必须有审批、权限和回收站/快照策略。

## 8. 总结与关联阅读

Elasticsearch 是面向检索和聚合的投影系统，核心是分析、索引结构和查询上下文。事实数据放主库，搜索索引可重建，必须把同步、一致性和评测纳入工程闭环。

关联阅读：[MongoDB 详解](./db-nosql-mongodb-overview.md)、[数据库原理](../sql/db-sql-theory.md)、[日志规范](../../dev-spec/dev-spec-logging.md)、[微服务治理](../../arch/microservice/arch-microservice-overview.md)。
