---
title: 测试网部署与发布交付
category:
  - Web3
tag:
  - 测试网
  - 部署
  - 验证
description: 用本地网络和测试网完成可重复部署、源码验证、地址发布、监控和回滚准备。
order: 11
outline: [2, 3]
---

# 测试网部署与发布交付

## 1. 学习目标

读完后能够从本地 Hardhat Network 发布到 Sepolia 或其他公开测试网，验证源码，交付 ABI、地址、参数和排障说明，并把测试网经验转成主网检查表。

## 2. 适用场景

适用于合约演示、公开 Demo、CI 发布和上线前演练。部署脚本和测试见 [Hardhat 开发、测试与本地调试](./05-hardhat-development-testing.md)。

## 3. 前置知识

- 能运行 Hardhat compile/test/deploy。
- 理解 RPC、私钥、chain ID、交易 receipt 和浏览器验证。
- 有一条不承载真实资产的测试钱包流程。

## 4. 核心概念

### 4.1 网络选择

示例默认使用 **Sepolia** 公开测试网，或本地 `hardhat` 网络。测试网资产不代表真实价值，网络会升级、弃用或更换水龙头。发布前固定网络名称、chain ID、RPC URL、区块浏览器和确认策略。

### 4.2 发布产物

一份可交付发布至少包含：

```text
network + chainId
contract address + transaction hash
compiler version + optimizer settings
constructor arguments + ABI + bytecode/source link
admin/role addresses + parameter table
known limitations + rollback/暂停方案
```

### 4.3 部署脚本原则

部署脚本应幂等：先检查现有地址和代码，再决定部署或复用；每次写入都要有网络和 chain ID 校验。私钥从环境变量或签名器注入，脚本日志只打印地址和哈希，不打印秘密。

## 5. 最小实践：Sepolia 部署清单

```bash
# 只填测试网 RPC 与测试钱包，不使用主网助记词
export SEPOLIA_RPC_URL='<RPC_URL>'
export DEPLOYER_PRIVATE_KEY='<PRIVATE_KEY>'
pnpm hardhat run scripts/deploy.ts --network sepolia
```

部署后执行：

1. 在区块浏览器验证源码和构造参数。
2. 记录合约地址、交易哈希、部署区块、ABI 和编译设置。
3. 从另一个 RPC 读取 owner、关键参数和初始状态。
4. 从前端连接测试网执行一次读、一次写和一次失败调用。
5. 将测试结果、已知限制和联系方式放入发布说明。

以下信息永远不应写入仓库或发布说明：助记词、私钥、Keystore 明文密码、签名原文、内部 RPC 密钥。占位符 `<PRIVATE_KEY>` 只表示“由本地 secret 管理器注入”，不是可用密钥。

### 5.1 部署脚本骨架

```ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  console.log("network", network.name, network.chainId.toString());
  console.log("deployer", deployer.address);

  const Counter = await ethers.getContractFactory("Counter");
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  console.log("counter", await counter.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

## 6. 生产实践

- 使用不同钱包：部署者、管理员、运营、测试者分离；主网权限走多签和时间锁。
- 发布前固定依赖版本、编译设置、构造参数和链 ID；CI 做 ABI diff。
- 测试网至少演练暂停、参数变更、角色转移和前端失败恢复。
- 监控余额、异常调用、管理员变更、Gas 费用和索引高度；预设事故联系人。
- 主网发布采用分阶段额度和人工确认，不要把测试网脚本直接当生产脚本。

## 7. 常见坑

- 用主网私钥或真实助记词做测试网实验。
- 部署到错误网络，地址能读但资产/权限不属于预期链。
- 验证源码时编译器、optimizer 或构造参数不一致。
- 只保存地址，不保存 ABI、版本、管理员和已知限制。
- 测试网水龙头和浏览器不稳定时把网络故障误判为合约故障。

## 8. 练习

1. 写一个部署检查器，验证 chain ID、地址 code、owner 和关键参数。
2. 制作一份包含 ABI、地址、版本、参数和回滚方案的发布包。
3. 在测试网执行角色转移和暂停，记录用户可见变化。
4. 比较本地部署和 Sepolia 部署的确认、费用和排障差异。

## 9. 总结与关联阅读

测试网部署的价值在于暴露流程、权限和发布问题，而不是制造“看起来已上线”的假象。继续阅读 [Hardhat 开发、测试与本地调试](./05-hardhat-development-testing.md)、[骗局与私钥安全](./11-private-key-security-scams.md) 和 [DApp 架构](./09-dapp-architecture.md)。
