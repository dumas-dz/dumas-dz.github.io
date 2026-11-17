---
title: 区块链、EVM、交易与 Gas
category:
  - Web3
tag:
  - 区块链
  - EVM
  - Gas
description: 从区块、状态机、EVM、交易执行和 Gas 机制理解链上程序的运行成本与失败方式。
order: 3
outline: [2, 3]
---

# 区块链、EVM、交易与 Gas

## 1. 学习目标

读完后能够把智能合约看作在复制状态机上执行的程序，解释交易、日志、回滚和 Gas 的关系，并用本地模拟估算一次调用的资源与风险。

## 2. 适用场景

适用于合约性能优化、交易失败排查、费用估算、分片/L2 选型和 DApp 状态一致性设计。账户和签名见 [账户与交易模型](./01-web3-account-model.md)。

## 3. 前置知识

- 理解 HTTP、JSON、状态机和事务回滚。
- 能阅读 JavaScript 或 Solidity 函数调用。
- 知道“测试网不是免费主网”，但两者共享部分 EVM 心智模型。

## 4. 核心概念

### 4.1 链、区块和状态

链由按时间顺序链接的区块组成；区块包含一组已执行交易及其产生的状态变化、日志和收据。节点独立执行交易并验证结果，因此不能把某个中心化数据库的写入直接视为最终链上事实。

关键抽象：

| 名称 | 开发者要回答的问题 |
| --- | --- |
| 区块 | 哪些交易被打包，确认到什么深度？ |
| 交易 | 调用谁、传什么参数、带多少费用上限？ |
| 状态 | 合约存储和余额现在是什么？ |
| Receipt | 交易是否成功，消耗多少 Gas，产生哪些事件？ |
| Log/Event | 前端和索引器如何观察状态变化？ |

### 4.2 EVM 调用模型

EVM 是字节码虚拟机。合约调用可以创建内部调用、修改存储、发出事件，也可以回滚。`CALL`、`STATICCALL`、`DELEGATECALL` 的语义不同，尤其是 `DELEGATECALL` 会以调用者的存储上下文执行目标代码，必须谨慎设计代理和库。

失败类型至少要分开：

- **模拟失败**：本地 `callStatic` 或估算 Gas 在当前状态上失败。
- **广播失败**：签名、余额、nonce 或 RPC 参数错误，交易未必被链记录。
- **执行回滚**：交易被包含但 `status=0`，仍消耗 Gas。
- **业务拒绝**：调用成功但事件/状态没有按预期变化。

### 4.3 Gas 与费用

Gas 是 EVM 操作的计量单位，不等于法定货币。交易费用大致与实际执行的计算、存储和数据发布有关：

```text
实际费用 ≈ 实际使用 Gas × 每单位有效 Gas 价格
Gas limit 只是执行资源上限，不是保证全部花费
```

优化顺序通常是：先减少不必要的状态写入和循环，再压缩 calldata，最后才考虑复杂存储布局。不要为了省 Gas 引入重入、权限或可升级性漏洞。

### 4.4 最终性与重组

节点返回 receipt 后仍应关注网络确认策略。不同网络和 L2 的确认、提款延迟、排序器信任模型不同；DApp 应显式展示“待确认/已确认/需更多确认”，而不是把 RPC 首次返回当作不可逆事实。

## 5. 最小实践：估算与模拟调用

使用 ethers v6 对本地合约调用执行 `estimateGas` 和 `staticCall`。示例假设已有 ABI 和地址，地址使用 `<CONTRACT_ADDRESS>` 占位符：

```js
import { Contract, JsonRpcProvider, Wallet } from "ethers";

const provider = new JsonRpcProvider(process.env.RPC_URL);
const signer = new Wallet(process.env.LOCAL_TEST_PRIVATE_KEY, provider);
const contract = new Contract(
  process.env.CONTRACT_ADDRESS,
  ["function setValue(uint256 value)", "function value() view returns (uint256)"],
  signer
);

const value = 42n;
const gas = await contract.setValue.estimateGas(value);
const before = await contract.value();
const tx = await contract.setValue(value, { gasLimit: gas * 12n / 10n });
const receipt = await tx.wait();
const after = await contract.value();

console.log({ before, after, gasLimit: gas, status: receipt.status });
```

把 `value` 改成会导致 revert 的值，分别记录 `estimateGas` 报错、发送失败和 receipt `status=0` 的现象。

## 6. 生产实践

- 对外部输入先做本地校验，再使用 `estimateGas` 模拟；失败时保留 revert reason。
- 交易按钮显示目标链、函数、参数摘要、最大费用和风险提示；避免无限授权。
- 交易状态机保存 `created / signed / broadcast / mined / confirmed / replaced / failed`，支持刷新后恢复。
- 事件不能替代状态查询；索引器可能落后，写流程必须以 receipt 和状态读取为准。
- 对高价值操作设置确认深度、人工复核和可暂停开关，不要依赖单个 RPC。

## 7. 常见坑

- 把 `gasLimit` 当成固定手续费，或把估算值乘一个离谱系数导致失败。
- 相信前端显示的“成功”，却没有检查 receipt。
- 把事件当成唯一数据源，索引延迟导致余额或列表错误。
- 在 Solidity 中无界循环读取大量数组，运行规模变大后耗尽 Gas。
- 混淆测试网代币、主网资产和 L2 桥接资产的最终性。

## 8. 练习

1. 对同一个合约函数分别记录 calldata、gas used、日志数量和状态变化。
2. 构造一个明确 revert 的调用，编写测试断言 revert reason 和 `status`。
3. 比较 `CALL`、`STATICCALL`、`DELEGATECALL` 的权限和存储风险。
4. 写一份交易状态机表格，定义每个状态的 UI 文案和恢复动作。

## 9. 总结与关联阅读

把链看作有成本、会失败、需要确认的复制状态机，才能设计可靠的 DApp。继续阅读 [智能合约安全](./04-smart-contract-security.md) 和 [DApp 架构](./09-dapp-architecture.md)。
