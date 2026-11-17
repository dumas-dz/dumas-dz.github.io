---
title: 测试工程
category:
  - 工程规范
tag:
  - 单元测试
  - 集成测试
  - 自动化测试
description: 用测试金字塔、边界断言和可重复环境证明系统行为，并建立快速回归能力。
order: 30
outline: [2, 3]
---

# 测试工程

## 1. 学习目标

- 根据风险选择单元、集成、契约、端到端和非功能测试，而不是追求单一覆盖率数字。
- 写出验证行为、失败边界和副作用的可读测试。
- 构造可重复的测试数据、时钟、随机数、数据库和外部依赖。
- 从线上缺陷补充回归测试，并让失败输出足以定位问题。

## 2. 适用场景

适用于业务规则、接口契约、数据库访问、消息处理、并发逻辑、批任务和发布兼容。探索性测试仍有必要，但关键路径必须有自动化回归。测试不能替代监控，监控也不能替代测试。

## 3. 测试分层

| 层级 | 验证对象 | 速度 | 典型断言 |
| --- | --- | --- | --- |
| 单元测试 | 纯业务规则和对象状态 | 毫秒级 | 计算、校验、状态转换、异常 |
| 集成测试 | 数据库、缓存、消息、框架配置 | 秒级 | SQL、事务、序列化、连接行为 |
| 契约测试 | 服务/API 之间的输入输出 | 较快 | 字段、状态码、兼容性 |
| 端到端测试 | 少量关键用户旅程 | 较慢 | 跨组件主流程 |
| 非功能测试 | 性能、安全、恢复 | 按目标 | SLO、权限、故障恢复 |

优先让大部分测试停留在单元和集成层；端到端测试只保护少量无法由下层覆盖的关键旅程。

## 4. 好测试的特征

- **独立**：测试顺序不影响结果，不依赖真实互联网和开发者本地状态。
- **确定**：时钟、随机数、并发调度和外部响应被控制或注入。
- **行为导向**：测试名描述业务结果，断言关键输出和副作用。
- **失败可诊断**：失败消息说明期望、实际和业务上下文。
- **边界完整**：覆盖空值、零、最大值、重复、超时、乱序、权限不足和部分失败。

## 5. 最小实践：测试余额账户规则

先让领域规则不依赖框架，再用一个测试验证成功与失败路径：

```java
import java.math.BigDecimal;

final class Account {
    private BigDecimal balance;

    Account(BigDecimal balance) {
        if (balance.signum() < 0) {
            throw new IllegalArgumentException("balance must be non-negative");
        }
        this.balance = balance;
    }

    void withdraw(BigDecimal amount) {
        if (amount.signum() <= 0) {
            throw new IllegalArgumentException("amount must be positive");
        }
        if (balance.compareTo(amount) < 0) {
            throw new IllegalStateException("insufficient balance");
        }
        balance = balance.subtract(amount);
    }

    BigDecimal balance() {
        return balance;
    }
}
```

```java
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AccountTest {
    @Test
    void withdrawsWhenBalanceIsEnough() {
        Account account = new Account(new BigDecimal("100.00"));

        account.withdraw(new BigDecimal("30.00"));

        assertEquals(new BigDecimal("70.00"), account.balance());
    }

    @Test
    void rejectsWithdrawalWhenBalanceIsNotEnough() {
        Account account = new Account(new BigDecimal("10.00"));

        IllegalStateException error = assertThrows(
            IllegalStateException.class,
            () -> account.withdraw(new BigDecimal("30.00"))
        );

        assertEquals("insufficient balance", error.getMessage());
        assertEquals(new BigDecimal("10.00"), account.balance());
    }
}
```

继续补充零金额、负金额、初始余额非法和边界余额测试。数据库集成测试应使用真实兼容版本的数据库，不要用与生产行为不同的内存替身来证明 SQL 和事务正确。

## 6. 测试设计检查表

- [ ] 测试名称能否说明业务行为，而不是只写 `test1`？
- [ ] 是否同时验证返回值、状态变化和外部副作用？
- [ ] 是否覆盖空、边界、重复、乱序、超时和权限失败？
- [ ] 测试能否在任意顺序和干净环境重复运行？
- [ ] 外部服务是否使用可控替身，关键协议是否另有契约测试？
- [ ] 数据库测试是否使用兼容数据库并验证事务回滚？
- [ ] 时间、随机数、ID 和并发是否可注入、可固定？
- [ ] 测试失败信息是否能在不调试的情况下给出线索？
- [ ] 线上缺陷是否增加最小回归测试？

## 7. 常见坑

1. **追逐覆盖率**：大量 getter、序列化和快乐路径测试掩盖核心规则未覆盖。
2. **Mock 一切**：对象自己都不再协作，测试与真实实现同时漂移。
3. **测试共享数据**：执行顺序改变或并行执行时互相影响。
4. **忽略事务边界**：测试每条 SQL 都成功，但真实回滚、锁等待或隔离级别不同。
5. **端到端测试过多**：反馈慢、定位难、维护成本高，应下沉到契约和集成层。
6. **断言过弱**：只断言“不抛异常”，没有验证余额、状态或消息内容。
7. **依赖真实网络**：超时、限流、数据变化导致测试不稳定。
8. **固定精确时间/耗时**：CI 环境抖动产生假失败，应测试可观察结果而不是墙钟。

## 8. 总结与关联阅读

测试的目标是以最低反馈成本发现最重要的风险。把业务规则、依赖边界和发布兼容拆开验证，并让每次线上缺陷成为下一次回归的一部分。

关联阅读：[工程规范与交付流程](./dev-spec-engineering-spec.md)、[性能与故障排查](./dev-spec-performance-troubleshooting.md)、[API 设计](./dev-spec-api-design.md)、[SQL 语言](../db/sql/db-sql-lan.md)、[MyBatis](../framework/orm/framework-orm-mybatis-overview.md)。
