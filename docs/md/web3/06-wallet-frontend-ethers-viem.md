---
title: 钱包、ethers.js 与 viem 前端连接
category:
  - Web3
tag:
  - 钱包
  - ethers
  - viem
description: 在前端实现钱包连接、链切换、读取、签名和发送交易，并正确处理网络、费用和错误。
order: 7
outline: [2, 3]
---

# 钱包、ethers.js 与 viem 前端连接

## 1. 学习目标

读完后能够用 ethers.js 或 viem 实现连接钱包、读取合约、请求签名、发送交易和等待确认，并把网络不匹配、拒签、费用不足和 RPC 错误变成可理解的 UI 状态。

## 2. 适用场景

适用于 React/Vue/原生 Web 的 DApp、治理页面、NFT 画廊和代币工具。账户原理见 [账户与交易模型](./01-web3-account-model.md)，业务编排见 [DApp 架构](./09-dapp-architecture.md)。

## 3. 前置知识

- 会写浏览器 JavaScript/TypeScript，理解 Promise、AbortController 和状态管理。
- 了解 ABI、事件、交易 receipt 和钱包网络切换。
- 不需要连接主网；先使用 Hardhat Network 或 Sepolia。

## 4. 核心概念

### 4.1 连接不是授权

连接钱包通常只暴露地址；读写合约和消息签名需要单独请求。前端必须区分：

| 流程 | 结果 | 是否产生链上交易 |
| --- | --- | --- |
| connect | 当前账户地址 | 否 |
| personal_sign | 消息签名 | 否 |
| eth_call | 读取状态 | 否 |
| eth_sendTransaction | 钱包签名并广播 | 是 |
| switch/add chain | 钱包网络配置 | 否 |

连接后还要监听 `accountsChanged`、`chainChanged`，刷新或清空缓存，避免旧地址继续显示旧状态。

### 4.2 ethers 与 viem 的职责

- **ethers v6**：`JsonRpcProvider`、`BrowserProvider`、`Contract`、`Wallet`、`formatEther`/`parseEther`。
- **viem 2.x**：按链和传输通道组织 `publicClient`、`walletClient`，类型和单位转换更严格。
- 两者都不要在前端保存私钥；签名由钱包扩展、WalletConnect 或硬件钱包完成。

### 4.3 错误和用户意图

错误至少分为：用户拒签、目标网络错误、余额不足、Gas 估算失败、合约 revert、RPC 超时和交易替换。不要把原始 JSON-RPC 错误直接丢给用户，也不要误报“交易成功”。

## 5. 最小实践：ethers v6 连接与读写

```ts
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

export async function transferToken() {
  if (!window.ethereum) throw new Error("请安装兼容 EIP-1193 的钱包");
  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  if (network.chainId !== 11155111n) {
    throw new Error("请切换到 Sepolia 测试网");
  }

  const signer = await provider.getSigner();
  const from = await signer.getAddress();
  const token = new Contract(process.env.TOKEN_ADDRESS!, ABI, signer);
  const before = await token.balanceOf(from);
  const tx = await token.transfer(process.env.TO_ADDRESS!, parseEther("0.01"));
  const receipt = await tx.wait();
  const after = await token.balanceOf(from);

  return {
    from,
    txHash: receipt.hash,
    status: receipt.status,
    before: formatEther(before),
    after: formatEther(after),
  };
}
```

`process.env` 在浏览器打包工具中需要替换为运行时配置；地址和链 ID 不应散落在组件中。

### 5.1 viem 只读示例

```ts
import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const abi = parseAbi(["function value() view returns (uint256)"]);
const value = await client.readContract({
  address: process.env.CONTRACT_ADDRESS as `0x${string}`,
  abi,
  functionName: "value",
});
```

## 6. 生产实践

- 交易确认页展示网络、地址缩写/完整地址、方法、参数、最大费用、截止时间和风险。
- 保存本地交易状态，支持刷新、网络切换、RPC 切换和重新广播。
- 读取优先走缓存或索引器，写入后以 receipt 和链上读取校准；不要用前端乐观更新掩盖失败。
- 对签名请求校验 domain、chain ID、nonce 和过期时间；禁止盲签和无限授权。
- 用多 RPC、超时、重试、请求 ID 和遥测定位问题，但重试只针对幂等读取。

## 7. 常见坑

- 把 `connect` 当成已授权写操作，导致用户拒签时 UI 卡死。
- 使用 `window.ethereum` 时未处理多钱包注入、断开和账户变化。
- 金额字符串直接进 ABI，导致小数、精度或 bigint 类型错误。
- 只检查交易哈希，不等待 receipt；或把 `status=0` 显示成成功。
- RPC 返回旧状态后未清理缓存，用户看到过期余额。

## 8. 练习

1. 实现“连接 → 检查链 → 读余额 → 请求转账 → 等 receipt”的状态机，并测试用户拒签。
2. 把 ethers 代码迁移为 viem，比较类型、单位和错误处理差异。
3. 构造网络切换失败、余额不足、Gas 估算失败三个 UI 用例。
4. 设计签名消息字段，证明登录请求不能被另一域名重放。

## 9. 总结与关联阅读

前端的核心是把钱包和链上结果呈现成可验证的用户意图。继续阅读 [DApp 架构](./09-dapp-architecture.md)、[The Graph 与链上数据](./07-indexing-thegraph-data.md) 和 [骗局与私钥安全](./11-private-key-security-scams.md)。
