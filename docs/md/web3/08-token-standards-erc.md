---
title: ERC-20、ERC-721 与 ERC-1155
category:
  - Web3
tag:
  - ERC-20
  - ERC-721
  - ERC-1155
  - 代币标准
description: 从可替换代币、NFT 和多资产标准选择正确模型，并覆盖授权、转移和安全测试。
order: 9
outline: [2, 3]
---

# ERC-20、ERC-721 与 ERC-1155

## 1. 学习目标

读完后能够根据资产语义选择 ERC-20、ERC-721 或 ERC-1155，读懂标准接口和事件，编写授权、转移、铸造和销毁测试。

## 2. 适用场景

适用于同质化代币、积分、NFT、游戏资产、门票和组合资产。本文不讨论投资价值或收益，只讨论接口、状态和工程安全。

## 3. 前置知识

- 理解 Solidity、mapping、事件、权限和 ABI。
- 会写 Hardhat 测试，知道 `approve/transferFrom` 的调用关系。
- 了解金额单位、供应量和元数据是业务约束。

## 4. 核心概念

### 4.1 标准对比

| 标准 | 资产模型 | 典型接口 | 典型风险 |
| --- | --- | --- | --- |
| ERC-20 | 可互换余额 | `transfer`、`approve`、`transferFrom`、`allowance` | 无限授权、精度、转账钩子 |
| ERC-721 | 每个 tokenId 唯一 | `ownerOf`、`safeTransferFrom`、`tokenURI` | 伪造元数据、错误授权、接收者安全 |
| ERC-1155 | 同一合约多 id、可批量 | `balanceOf`、`safeTransferFrom`、`uri` | 批量权限、URI 混淆、回调重入 |

### 4.2 ERC-20 授权模型

`approve` 给 spender 一定额度，`transferFrom` 由 spender 消费。前端应显示 spender、额度和有效期，优先使用精确额度或带过期的授权模式。不要把 `approve` 当付款完成；付款应以事件和余额变化为准。

### 4.3 NFT 元数据与接收安全

`tokenURI`/`uri` 是公开数据入口，可能指向中心化服务、IPFS 或链上数据。应显示来源、版本和不可变性。`safeTransferFrom` 可能触发接收合约回调，接收方逻辑要防止恶意回调和重入。

### 4.4 供应、销毁和权限

`totalSupply`、`mint`、`burn`、`pause`、`blacklist` 都是业务权限，不是标准的“安全保证”。应定义谁可以铸造、销毁、暂停，是否有上限、时间表、审计和迁移路径。

## 5. 最小实践：OpenZeppelin ERC-20 骨架

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LearningToken is ERC20, Ownable {
    constructor(uint256 initialSupply)
        ERC20("Learning Token", "LEARN")
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

OpenZeppelin Contracts 5.x 的 `Ownable` 构造器需要初始 owner；实际项目应根据权限模型替换为角色、多签或时间锁。测试至少覆盖：初始供应归属、非 owner 铸造失败、`transfer` 事件、`approve/transferFrom` 额度扣减和零地址拒绝。

## 6. 生产实践

- 明确 token decimals、最小单位、总供应和四舍五入规则，禁止前端自行猜单位。
- 授权 UI 默认精确额度，提供撤销入口和授权历史；不要默认无限授权。
- NFT 元数据记录 token URI 版本、内容哈希和更新权限，避免“同 tokenId 不同图片”。
- 批量转账和批量铸造设置上限，测试 Gas、失败原子性和部分成功策略。
- 合约验证源码、固定库版本，并对管理员转移、暂停、升级和黑名单做监控。

## 7. 常见坑

- 认为 `approve` 后资金已到账，忽略 `transferFrom` 和 allowance。
- 使用浮点数或普通 JavaScript number 表示代币数量。
- 直接把用户提供的 URL 当作可信元数据，导致钓鱼或内容替换。
- 忽略 ERC-721 接收回调中的重入和批量 ERC-1155 的部分失败。
- 铸造函数没有上限或权限分离，导致供应被任意改变。

## 8. 练习

1. 写 ERC-20 的授权测试：先 `approve`，再 `transferFrom`，断言 allowance 和余额。
2. 设计 ERC-721 元数据更新策略，说明谁能更新、如何证明历史版本。
3. 为 ERC-1155 批量转账设计失败原子性测试。
4. 写一份授权风险提示，包含 spender、额度、过期和撤销步骤。

## 9. 总结与关联阅读

代币标准解决资产互操作性，不替你决定供应、权限和元数据治理。继续阅读 [智能合约安全](./04-smart-contract-security.md)、[The Graph 与链上数据](./07-indexing-thegraph-data.md) 和 [DApp 架构](./09-dapp-architecture.md)。
