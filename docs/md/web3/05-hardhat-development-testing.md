---
title: Hardhat 开发、测试与本地调试
category:
  - Web3
tag:
  - Hardhat
  - Foundry
  - 测试
description: 用 Hardhat 或 Foundry 建立编译、测试、分叉、调试和部署脚本的可重复开发流程。
order: 6
outline: [2, 3]
---

# Hardhat 开发、测试与本地调试

## 1. 学习目标

读完后能够建立本地 Hardhat 项目，编写部署与测试脚本，使用 console、分叉和 receipt 定位失败，并了解 Foundry 的适用边界。

## 2. 适用场景

适用于合约原型、回归测试、测试网发布和 CI 检查。生产上线还必须结合 [智能合约安全](./04-smart-contract-security.md) 和 [测试网部署](./10-testnet-deployment.md)。

## 3. 前置知识

- Node.js 20 LTS、pnpm、Git 和基础 TypeScript/JavaScript。
- 理解 Solidity、交易、Gas 和 ABI。
- 能在终端读取测试输出和环境变量。

## 4. 核心概念

### 4.1 项目生命周期

```text
编写 Solidity -> 编译生成 ABI/bytecode -> 本地部署 -> 测试状态和事件
-> 分叉外部依赖 -> 生成部署脚本 -> 测试网验证 -> 发布地址和 ABI
```

Hardhat 适合 JavaScript/TypeScript 生态和插件；Foundry 适合 Solidity 原生测试、模糊测试和快速 fuzz/invariant。两者都可以表达测试意图，不要为了工具争论而牺牲覆盖。

### 4.2 测试分层

| 层级 | 重点 | 示例 |
| --- | --- | --- |
| 单元测试 | 单函数规则、错误、事件 | 非管理员调用 revert |
| 集成测试 | 多合约协作 | 代币 + 金库 + 角色 |
| 分叉测试 | 外部协议兼容 | 真实路由器、预言机 |
| 不变量/模糊 | 大输入、守恒 | 总供应量不变 |
| 部署测试 | 构造参数、地址 | 重复部署、权限初始化 |

### 4.3 调试手段

- 在 Solidity 中使用 `console.log` 只作为本地调试，发布前清理。
- 对失败交易读取 receipt、revert reason、事件和实际状态。
- 使用 Hardhat Network 快照/回滚隔离测试；分叉测试固定区块高度。
- 把测试账号、网络、合约地址、交易哈希写入测试日志，便于复现。

## 5. 最小实践：Hardhat 最小项目

```bash
mkdir -p counter-hardhat && cd counter-hardhat
pnpm init
pnpm add --save-dev hardhat@2.22.x @nomicfoundation/hardhat-toolbox@5.x
pnpm add --save-dev typescript ts-node dotenv
npx hardhat init
```

合约示例 `contracts/Counter.sol`：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    address public immutable owner;
    uint256 public value;

    error NotOwner();

    event CountChanged(address indexed caller, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    function increment(uint256 amount) external {
        if (msg.sender != owner) revert NotOwner();
        value += amount;
        emit CountChanged(msg.sender, amount);
    }
}
```

`hardhat.config.ts` 的最小形态：

```ts
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL ?? "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY
        ? [process.env.DEPLOYER_PRIVATE_KEY]
        : [],
    },
  },
};

export default config;
```

测试示例只断言公共行为，不在测试里复制实现：

```ts
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Counter", function () {
  it("increments and emits CountChanged", async function () {
    const [owner, other] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter", owner);
    const counter = await Counter.deploy();
    await counter.waitForDeployment();

    await expect(counter.connect(owner).increment(2))
      .to.emit(counter, "CountChanged")
      .withArgs(owner.address, 2n);

    await expect(counter.connect(other).increment(1)).to.be.revertedWithCustomError(
      counter,
      "NotOwner"
    );
  });
});
```

## 6. 生产实践

- CI 执行 `hardhat compile`、`hardhat test`、静态分析和 ABI diff；依赖锁文件必须提交。
- 测试环境与生产密钥完全隔离，部署脚本拒绝在缺参数时继续执行。
- 测试网部署后验证源码、记录 constructor 参数和编译设置。
- 对 Foundry 使用 `forge test`、`forge coverage`、`forge snapshot`，把 fuzz 失败样例固化为回归测试。

## 7. 常见坑

- 使用 `npx hardhat init` 后不检查生成文件和插件版本，导致配置不兼容。
- 测试依赖真实测试网或共享账户，结果不可重复。
- 测试只验证返回值，不验证事件、错误、权限和不变量。
- 在 Hardhat 脚本中打印或提交私钥、助记词和 `.env`。
- 本地默认账户直接用于主网；网络配置缺少 chain ID 校验。

## 8. 练习

1. 为 Counter 增加暂停，写成功、拒绝、恢复和事件测试。
2. 配置固定区块高度的 Sepolia 分叉，测试一个外部合约接口。
3. 把一个失败交易的 receipt、revert reason 和实际状态整理成排障记录。
4. 用 Foundry 为余额守恒写一个 invariant，并保存 fuzz 反例。

## 9. 总结与关联阅读

可重复的测试和部署脚本是合约工程质量的基础。继续阅读 [测试网部署](./10-testnet-deployment.md)、[智能合约安全](./04-smart-contract-security.md) 和 [The Graph 与链上数据](./07-indexing-thegraph-data.md)。
