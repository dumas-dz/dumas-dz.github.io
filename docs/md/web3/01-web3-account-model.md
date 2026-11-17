---
title: Web3 账户与交易模型
category:
  - Web3
tag:
  - 账户模型
  - 钱包
  - 签名
description: 理解 EOA、合约账户、私钥、地址、Nonce、签名和链上状态的关系。
order: 2
outline: [2, 3]
---

# Web3 账户与交易模型

## 1. 学习目标

读完后能够解释一次“用户点按钮 → 钱包签名 → 节点广播 → 合约状态改变”的完整链路，并区分地址、账户、私钥、交易和链上状态。

## 2. 适用场景

适用于钱包连接、登录签名、转账、合约调用、权限控制和交易排错。合约语法见 [Solidity 工程基础](./03-solidity-basics.md)，前端调用见 [钱包、ethers 与 viem](./06-wallet-frontend-ethers-viem.md)。

## 3. 前置知识

- 能使用命令行和 Git，理解 HTTP API 与 JSON。
- 了解非对称签名的基本概念：密钥用于签名，公钥/地址用于验证。
- 本地安装 Node.js 20 LTS；不需要先安装主网节点。

## 4. 核心概念

### 4.1 账户模型

以太坊主要有两类账户：

| 类型 | 谁持有 | 能否主动发起交易 | 典型用途 |
| --- | --- | --- | --- |
| EOA（外部拥有账户） | 用户或机器人控制私钥 | 能 | 转账、调用合约、签名 |
| 合约账户 | 部署到链上的字节码 | 不能独立发起交易 | 托管逻辑、代币、金库、治理 |

地址是账户的公开标识，私钥是对账户资产和调用权限的控制材料。地址相同不代表内容相同：不同网络上的同地址合约是不同部署实例。

### 4.2 私钥、助记词和签名

- **私钥**：控制账户的秘密值，泄露即可能失去资产控制权。文档示例只能使用 `<PRIVATE_KEY>`、`<MNEMONIC>` 等占位符，不能写成可复用真实值。
- **助记词**：用于确定性派生多个私钥的备份短语；它不是登录密码，不能截图、粘贴到网页或发给客服。
- **签名**：对交易或消息的结构化数据进行签名。签名可被验证，但不应把私钥交给网页、后端或 API。
- **消息签名**：常用于登录证明；它不一定花费 Gas，但仍要检查签名域、过期时间和 nonce，防止重放。

### 4.3 地址、Nonce 与交易状态

EOA 的 `nonce` 是该账户已成功提交交易的计数。相同 nonce 的交易会互相竞争，交易被替换或卡住时优先检查 nonce、Gas 参数和节点状态。交易生命周期至少包括：

```text
构造意图 -> 钱包展示详情 -> 用户签名 -> RPC 广播 -> 进入待打包状态
-> 出块执行 -> 收据 status=1 或 0 -> 索引器/前端更新
```

`status=0` 表示交易被包含但执行回滚；它仍然可能消耗 Gas。没有交易哈希只表示未进入节点可见的广播链路，不等于绝对没提交。

### 4.4 钱包与 RPC 的职责边界

钱包保管私钥并弹出签名确认；RPC 节点负责查询和广播；浏览器或前端只应展示可验证的意图。开发中要区分“链上已确认”“节点已接收”“前端已显示”三个状态。

## 5. 最小实践：读取账户与校验签名意图

以下代码使用 ethers v6，读取本地 Hardhat 账户的公开地址并打印检查项。配置使用环境变量占位符，示例中的私钥字段永远不要填入真实值：

```bash
mkdir -p web3-account-lab && cd web3-account-lab
pnpm init
pnpm add ethers@6 dotenv
printf 'RPC_URL=http://127.0.0.1:8545\n' > .env.example
```

```js
// read-account.mjs
import { JsonRpcProvider, Wallet, verifyMessage } from "ethers";
import "dotenv/config";

const rpcUrl = process.env.RPC_URL;
if (!rpcUrl) throw new Error("缺少 RPC_URL");

const provider = new JsonRpcProvider(rpcUrl);
const message = "I control this account";
// 仅在本地测试中使用 Hardhat 默认账户的私钥；生产环境绝不把私钥写入源码。
const localKey = process.env.LOCAL_TEST_PRIVATE_KEY ?? "";
if (!/^0x[0-9a-fA-F]{64}$/.test(localKey)) {
  throw new Error("请通过 LOCAL_TEST_PRIVATE_KEY 提供本地测试私钥占位值");
}

const wallet = new Wallet(localKey, provider);
const signature = await wallet.signMessage(message);
const recovered = verifyMessage(message, signature);

console.log({
  address: wallet.address,
  signature,
  recovered,
  matches: recovered.toLowerCase() === wallet.address.toLowerCase(),
});
```

运行前把 `.env.example` 复制为 `.env`，只填入本地 Hardhat Network 的测试私钥；不要复制主网钱包或助记词。

## 6. 生产实践

- 登录消息包含域名、链 ID、目的、过期时间和一次性 nonce，避免跨站点重放。
- 前端先展示“将调用哪个合约、哪个函数、最大费用、目标网络”，再请求签名。
- 后端只存地址、签名和验证结果，不存私钥；签名结果应绑定会话和请求 ID。
- 监控交易替换、nonce 过低/过高、RPC 超时和用户拒签，不要把拒签当作系统异常。

## 7. 常见坑

- 把“地址”当成“登录账号”：地址是公开身份，不代表拥有控制权。
- 把助记词当成 API Key 上传到 GitHub、CI 或聊天工具。
- 盲签消息或无限授权；用户需要看到签名语义和合约目标。
- 只看交易哈希就认为成功；必须读取 receipt 和事件。
- 在不同网络复用配置而不检查 chain ID，导致把测试资产当主网资产。

## 8. 练习

1. 写一个函数，断言签名恢复地址等于给定地址，并测试篡改消息后验证失败。
2. 设计一条登录消息，包含 domain、nonce、issuedAt、expiresAt，并解释各字段防什么攻击。
3. 用本地网络发送两笔同 nonce 交易，观察替换规则和 receipt 状态。
4. 列出一次 DApp 连接钱包时需要展示的五个用户确认信息。

## 9. 总结与关联阅读

账户模型的核心不是“有地址就能开发”，而是明确谁控制密钥、谁构造交易、谁验证结果。继续阅读 [区块链、EVM、交易与 Gas](./02-blockchain-evm-transaction-gas.md) 和 [骗局与私钥安全](./11-private-key-security-scams.md)。
