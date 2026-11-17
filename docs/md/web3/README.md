---
title: Web3 开发学习知识库
category:
  - Web3
tag:
  - 学习路线
  - 区块链
  - DApp
description: 面向开发者的 Web3 从入门到实践学习路线，覆盖账户、EVM、Solidity、安全、测试、DApp、索引与测试网部署。
order: 1
outline: [2, 3]
---

# Web3 开发学习知识库

本目录从一名后端或全栈开发工程师的学习视角组织 Web3 知识：先理解区块链为什么这样设计，再逐步完成合约、测试、前端连接、数据索引和测试网部署。内容强调可运行的工程实践、失败模式和安全边界，不把这里当作投资建议或收益承诺。

## 学习目标

- 用账户、交易、状态、Gas 和最终性解释一次链上写操作。
- 看懂 Solidity 合约的存储、调用、权限、事件和失败回滚。
- 使用 Hardhat 完成编译、单元测试、分叉测试和测试网部署。
- 使用 ethers.js 或 viem 连接钱包、读取链上数据并发送交易。
- 理解 ERC-20、ERC-721、ERC-1155 的适用边界和常见安全问题。
- 设计由前端、索引服务、RPC 节点、合约和监控组成的 DApp 架构。
- 建立私钥管理、钓鱼识别、授权撤销和事故响应习惯。

## 推荐学习路径

| 阶段 | 文档 | 建议产出 |
| --- | --- | --- |
| 1 | [账户与交易模型](./01-web3-account-model.md) | 能解释地址、私钥、Nonce 和签名 |
| 2 | [区块链、EVM、交易与 Gas](./02-blockchain-evm-transaction-gas.md) | 能估算交易成本并解释失败原因 |
| 3 | [Solidity 工程基础](./03-solidity-basics.md) | 写出可编译、可测试的合约 |
| 4 | [智能合约安全](./04-smart-contract-security.md) | 能列出威胁模型和测试断言 |
| 5 | [Hardhat 开发与测试](./05-hardhat-development-testing.md) | 建立本地测试与部署脚本 |
| 6 | [钱包、ethers 与 viem](./06-wallet-frontend-ethers-viem.md) | 实现连接、读、签、写四类前端流程 |
| 7 | [The Graph 与链上数据](./07-indexing-thegraph-data.md) | 从事件构建可查询数据源 |
| 8 | [ERC 代币标准](./08-token-standards-erc.md) | 选择正确代币模型并覆盖授权测试 |
| 9 | [DApp 架构](./09-dapp-architecture.md) | 画出从钱包到数据库的链路 |
| 10 | [测试网部署](./10-testnet-deployment.md) | 发布地址、ABI、验证和回滚说明 |
| 11 | [骗局与私钥安全](./11-private-key-security-scams.md) | 完成钱包备份、授权和事故检查表 |

建议每篇按“阅读 → 运行最小实践 → 完成练习 → 再读关联文档”推进。不要先抄一个完整 DApp 再补概念，否则交易失败、授权风险和状态不同步会难以定位。

## 内容状态

- `web3` 根目录：已完善
- 账户、EVM 与 Solidity 基础：已完善
- 安全、测试与部署：持续更新
- 前端、索引与 DApp 架构：持续更新
- 版本基线与迁移说明：持续更新

## 技术与版本基线

示例以 **Solidity 0.8.24**、**Node.js 20 LTS**、**Hardhat 2.22.x**、**ethers.js 6.x**、**viem 2.x**、**OpenZeppelin Contracts 5.x** 为编写基线。这些版本用于解释 API 形态，不代表永远最新；执行示例前应检查本地工具链版本和对应文档。测试网示例默认使用 Sepolia 或本地 Hardhat Network，命令中的 RPC、地址、私钥一律使用占位符。

## 学习者使用方式

1. 先用本地 Hardhat Network，不把主网当练习环境。
2. 把每个最小实践改成自己的测试，而不是只复制代码。
3. 交易、授权和部署都记录网络、合约地址、ABI 版本、交易哈希和失败原因。
4. 对外展示项目时只公开地址、代码、测试和公开 RPC，绝不公开助记词、私钥、Keystore 密码或签名原文。

## 关联阅读

- [Java 工程基础](../java/README.md)
- [架构与分布式](../arch/README.md)
- [AI 应用开发知识地图](../README.md)
- [内容规范](../../guide/content-standard.md)
