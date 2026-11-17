---
title: The Graph、索引与链上数据
category:
  - Web3
tag:
  - The Graph
  - 事件
  - 索引
description: 用事件和索引器把链上状态转换为可查询数据，并设计一致性、重组和数据可信边界。
order: 8
outline: [2, 3]
---

# The Graph、索引与链上数据

## 1. 学习目标

读完后能够设计事件、部署一个最小 Subgraph 查询链路，解释索引延迟、重组和分页问题，并知道哪些数据必须回到链上验证。

## 2. 适用场景

适用于交易列表、持仓看板、NFT 元数据、治理历史、排行榜和需要过滤/聚合的 DApp。直接 RPC 读取适合少量实时状态，索引器适合复杂查询。

## 3. 前置知识

- 理解事件、ABI、区块、交易 receipt 和 JSON。
- 会写 GraphQL 查询和基本 TypeScript 服务。
- 有一个本地 Hardhat 合约或测试网合约及公开 ABI。

## 4. 核心概念

### 4.1 为什么需要索引

链上 storage 适合验证当前值，不适合按时间、事件和复杂关系查询。事件是可观察的业务变更记录，索引器把事件转换为实体和查询接口：

```text
合约 emit Event -> 节点日志 -> Subgraph handler -> 实体存储 -> GraphQL/API -> 前端
```

事件设计要有 `indexed` 字段用于过滤，同时保留业务所需的金额、时间、操作者和目标。不要把大量不可变数据全部写入 storage，也不要只依赖事件恢复关键状态。

### 4.2 The Graph 最小数据模型

`schema.graphql` 示例：

```graphql
type Transfer @entity {
  id: ID!
  txHash: String!
  from: Bytes!
  to: Bytes!
  amount: BigInt!
  timestamp: BigInt!
  blockNumber: BigInt!
}
```

`subgraph.yaml` 负责把合约事件映射到 handler；handler 中必须按事件字段写入稳定 ID，避免同一事件覆盖实体。查询时注意 `first/skip` 的性能和一致性，不能假设 API 永远是最新区块。

### 4.3 一致性和重组

索引器可能落后、重试、回滚或遇到重组。设计上要：

- 展示实体的 `blockNumber`、`timestamp` 和索引状态。
- 对资金和权限判断回到合约读取；索引只做搜索、排序和聚合。
- 对前端写操作先等待 receipt，再查询索引器并允许短暂不一致。
- 保留原始 txHash 和事件日志，支持数据重放和审计。

### 4.4 自建索引器

低规模项目可以从 RPC 日志抓取开始：按区块范围增量扫描、保存 cursor、幂等 upsert、记录重组回滚。规模增加后再评估 The Graph、SubQuery、Goldsky 或自建数据库。关键不是工具品牌，而是可重放、可观测和有明确信任边界。

## 5. 最小实践：事件到 GraphQL

1. 合约暴露 `Transfer(from indexed address, to indexed address, amount uint256)`。
2. 用 Hardhat 发送两笔转账，记录 txHash、blockNumber 和事件。
3. 将 handler 写入 `Transfer` 实体，查询 `orderBy: timestamp, orderDirection: desc`。
4. 故意把 handler 改成错误 ID，观察重复/覆盖，然后修复为 `txHash-logIndex`。
5. 停止索引器再发一笔交易，记录前端显示和最终一致性差异。

## 6. 生产实践

- 事件版本化：字段语义变化时新增事件，不在旧事件里悄悄改含义。
- 索引器部署记录 ABI、合约地址、网络、起始区块和 handler 版本。
- API 对地址做规范化，金额使用 BigInt/最小单位，显示层再格式化。
- 为索引延迟、失败重试、重组回滚和查询错误建立监控和告警。
- 私有业务数据不要放事件；事件是公开日志，不是访问控制。

## 7. 常见坑

- 事件缺少稳定唯一 ID，导致同一交易多次写入覆盖。
- 使用 `skip` 做深分页，数据量大后性能恶化；改用 cursor 或时间范围。
- 把索引器返回值当作最终事实，忽略重组和落后。
- 事件字段设计过窄，后续无法重建余额或历史。
- 在 handler 中做昂贵外部调用，索引速度和可靠性下降。

## 8. 练习

1. 为 ERC-20 设计 Transfer/Approval 事件实体，并写出余额历史查询。
2. 测试索引器落后时的前端降级方案：直接 RPC 查询 + 进度提示。
3. 设计一个幂等 handler，确保同一日志重复消费结果不变。
4. 比较自建日志扫描和 The Graph 的部署、查询、重组处理成本。

## 9. 总结与关联阅读

索引服务解决查询效率，不改变链上信任模型。继续阅读 [DApp 架构](./09-dapp-architecture.md)、[ERC 代币标准](./08-token-standards-erc.md) 和 [钱包、ethers 与 viem](./06-wallet-frontend-ethers-viem.md)。
