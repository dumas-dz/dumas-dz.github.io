---
title: Solidity 工程基础
category:
  - Web3
tag:
  - Solidity
  - 智能合约
  - ABI
description: 用 Solidity 编写可读、可测试的合约，理解类型、存储、函数、事件、错误和 ABI 边界。
order: 4
outline: [2, 3]
---

# Solidity 工程基础

## 1. 学习目标

读完后能够编写带权限、事件和错误处理的最小合约，解释 `storage`、`memory`、`calldata`、可见性和 ABI 的差异，并把业务规则拆成可测试的函数。

## 2. 适用场景

适用于代币、金库、投票、登记、拍卖、游戏道具和通用合约的入门开发。生产安全见 [智能合约安全](./04-smart-contract-security.md)，测试见 [Hardhat 开发与测试](./05-hardhat-development-testing.md)。

## 3. 前置知识

- 会写 JavaScript/TypeScript，理解函数、对象和单元测试。
- 理解账户、交易和 Gas 的基本概念。
- 安装 Node.js 20 LTS，能执行 `pnpm` 和 Git。

## 4. 核心概念

### 4.1 合约的结构

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Counter {
    uint256 public count;
    address public owner;

    event CountChanged(address indexed operator, uint256 newValue);

    error NotOwner(address caller);
    error InvalidValue(uint256 value);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner(msg.sender);
        _;
    }

    function increment(uint256 step) external onlyOwner {
        if (step == 0) revert InvalidValue(step);
        count += step;
        emit CountChanged(msg.sender, count);
    }
}
```

### 4.2 类型、存储和调用数据

- `uint256`、`address`、`bool`、`bytes` 是常用基础类型；Solidity 0.8 默认检查算术溢出。
- `storage` 是链上持久状态；`memory` 是调用期间临时数据；`calldata` 是外部调用传入的只读数据。
- `public` 自动生成 getter；`external` 适合外部入口；`internal/private` 不是隐私边界，源码和状态通常仍可被观察。
- `view` 不写状态，`pure` 不读也不写状态；它们可以帮助前端估算和静态调用。

### 4.3 ABI、事件和错误

ABI 是外部程序理解函数参数和返回值的编码约定。事件不是普通返回值，适合给索引器和前端订阅。自定义错误比长字符串 revert 更省 Gas，也能提供结构化错误字段。调用者应同时处理 revert reason、错误选择器和 receipt。

### 4.4 可升级性与库

不要为了“以后改”默认使用代理。代理会引入存储布局、管理员、初始化和实现切换风险。业务需要频繁升级时，优先考虑版本化新合约、迁移脚本和清晰的所有权边界；必须升级时，把升级权限、时间锁、存储兼容测试纳入威胁模型。

## 5. 最小实践：编译一个带错误处理的登记合约

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Registry {
    mapping(address => string) private records;
    address public owner;

    event RecordUpdated(address indexed account, string value);

    error NotOwner();
    error EmptyValue();

    constructor() {
        owner = msg.sender;
    }

    function setRecord(string calldata value) external {
        if (bytes(value).length == 0) revert EmptyValue();
        records[msg.sender] = value;
        emit RecordUpdated(msg.sender, value);
    }

    function getRecord(address account) external view returns (string memory) {
        return records[account];
    }

    function clearRecord() external {
        delete records[msg.sender];
        emit RecordUpdated(msg.sender, "");
    }
}
```

测试要覆盖：只有本人能写入自己的记录；空字符串拒绝；事件字段正确；读取不存在地址返回空字符串。不要只测试 happy path。

## 6. 生产实践

- 固定编译器版本，记录 optimizer、viaIR、部署网络和构造参数。
- 使用 NatSpec 写清权限、单位、精度、事件和失败条件。
- 合约入口尽量薄，把复杂规则拆成纯函数或库，并为边界条件写测试。
- 对金额使用整数最小单位，前端显示时才做格式化；不要在 Solidity 中使用浮点数。
- 将 ABI、字节码和部署地址纳入版本库或发布产物，避免前端硬编码错误版本。

## 7. 常见坑

- 把 `private` 当保密；链上数据不是私有数据库。
- 误用 `uint`、`int`、`address` 的默认值，忽略零地址和零值语义。
- 在循环里写 storage、接收任意长度数组，导致 Gas 超限。
- 事件和状态不一致，或没有索引关键字段，后续难以查询。
- 代理存储槽冲突、初始化函数未锁、权限过宽导致可升级合约被接管。

## 8. 练习

1. 给 `Counter` 增加暂停、恢复和最大步长，并为每个失败分支写测试。
2. 把自定义错误改成字符串 revert，比较测试代码和 Gas 影响。
3. 为登记合约写 ABI 解码脚本，验证事件和 getter。
4. 画出 `storage`、`memory`、`calldata` 在一次外部调用中的生命周期。

## 9. 总结与关联阅读

Solidity 开发的重点是明确状态边界、错误语义和外部 ABI。继续阅读 [ERC 代币标准](./08-token-standards-erc.md)、[智能合约安全](./04-smart-contract-security.md) 和 [Hardhat 开发与测试](./05-hardhat-development-testing.md)。
