---
title: 设计原则与设计模式
category:
  - 工程规范
tag:
  - 面向对象
  - 设计原则
  - 设计模式
description: 用职责、依赖和变化点组织代码，在真实约束下选择最小而有效的抽象。
order: 20
outline: [2, 3]
---

# 设计原则与设计模式

## 1. 学习目标

- 识别类、模块和调用链中的职责过载、隐藏依赖和重复变化。
- 理解常用创建型、结构型和行为型模式解决的问题与代价。
- 用“变化点 + 稳定边界”判断是否抽象，而不是按模式清单堆层次。
- 能通过重构和测试让设计在需求变化时保持局部修改。

## 2. 适用场景

适用于业务规则扩展、多实现切换、对象创建复杂、调用链需要解耦和第三方接口适配。以下情况应优先保持简单：只有一种实现、变化方向未知、抽象层无法被测试，或团队无法解释新增接口的职责。

## 3. 核心原则

- **单一职责**：一个类只有一个导致它变化的主要理由；拆分依据是业务职责，不是代码行数。
- **开闭原则**：对扩展开放、对修改关闭；先确认有哪些扩展点，再决定是否使用接口或注册机制。
- **依赖倒置**：高层业务规则不直接绑定数据库、HTTP、框架或厂商 SDK。
- **接口隔离**：调用方只依赖完成任务所需的方法，避免“大而全”的接口。
- **组合优先**：把可变行为组合成对象，通常比多层继承更容易测试和替换。
- **低耦合高内聚**：模块内部围绕同一业务概念协作，模块之间通过明确契约交换数据。
- **YAGNI**：没有已知变化点时，不为未来假设支付当前复杂度。

## 4. 常用模式速查

| 模式 | 解决的问题 | 典型信号 | 代价 |
| --- | --- | --- | --- |
| Strategy | 同一操作有可替换规则 | `if/switch` 按渠道/等级重复增长 | 实现类和选择逻辑增加 |
| Factory | 创建过程复杂或依赖条件 | 构造逻辑散落、对象初始化不一致 | 间接层增加 |
| Adapter | 隔离外部接口差异 | 多个 SDK 返回模型不一致 | 映射代码需维护 |
| Decorator | 动态叠加能力 | 缓存、日志、重试被写进主类 | 装饰顺序可能影响行为 |
| Template Method | 流程骨架稳定、步骤可变 | 多个子类重复流程控制 | 继承层次僵化 |
| Observer | 事件需要通知多个独立消费者 | 业务主流程被通知逻辑污染 | 顺序、失败和重复语义复杂 |
| State | 行为随状态显著变化 | 状态判断散布在大量条件分支 | 状态模型需要严格维护 |
| Facade | 为复杂子系统提供简单入口 | 客户端编排多个底层调用 | 门面可能变成上帝类 |

模式不是越多越好。若一个 `Map<String, Handler>` 就能表达三条稳定规则，不必再引入框架级插件系统。

## 5. 最小实践：把条件分支改成可测试策略

下面示例把折扣规则从订单服务中分离。新增规则时只增加实现和注册项，不修改结算主流程：

```java
import java.math.BigDecimal;
import java.util.Map;

interface PricingRule {
    String code();
    BigDecimal apply(BigDecimal price);
}

record PercentDiscount(String code, BigDecimal rate) implements PricingRule {
    @Override
    public BigDecimal apply(BigDecimal price) {
        if (rate.signum() < 0 || rate.compareTo(BigDecimal.ONE) > 0) {
            throw new IllegalArgumentException("rate must be between 0 and 1");
        }
        return price.multiply(BigDecimal.ONE.subtract(rate));
    }
}

final class PricingService {
    private final Map<String, PricingRule> rules;

    PricingService(Map<String, PricingRule> rules) {
        this.rules = Map.copyOf(rules);
    }

    BigDecimal price(BigDecimal basePrice, String ruleCode) {
        PricingRule rule = rules.get(ruleCode);
        return rule == null ? basePrice : rule.apply(basePrice);
    }
}
```

验证顺序：

1. 为正常折扣、无匹配规则和非法折扣率写测试。
2. 新增“满减”规则，确认订单结算代码不修改。
3. 如果规则需要读取用户、库存或配置，明确这些依赖是否属于规则对象，避免隐藏远程调用。
4. 如果只出现一个实现且没有变化信号，保留条件分支反而更清晰。

## 6. 设计检查表

- [ ] 一个类/模块的主要变化原因是否可以一句话说明？
- [ ] 依赖是否通过构造或参数显式传入，可否替换为测试实现？
- [ ] 新增一种渠道、规则、存储或协议时，需要修改多少处？
- [ ] 接口方法是否都服务于同一调用方场景？
- [ ] 继承是否满足里氏替换，子类是否改变父类承诺？
- [ ] 异步、缓存、重试等横切能力是否会改变核心业务顺序？
- [ ] 抽象是否被至少两个真实用例或一个明确变化点支撑？
- [ ] 测试是否验证行为，而不是绑定具体实现类和私有结构？

## 7. 常见坑

1. **为模式而模式**：一个简单校验被拆成接口、工厂、策略和模板，维护成本高于收益。
2. **贫血模型**：所有规则散落在 Service，实体只保存字段，状态不变量无人保护。
3. **隐藏依赖**：工具类内部直接连接数据库或远程 API，无法隔离测试。
4. **继承滥用**：子类覆盖父类关键行为后违反调用方假设，应改为组合。
5. **策略选择逻辑重复**：规则实现解耦了，但每个调用方都重新写 `if/else` 选择器。
6. **过早通用化**：根据假想需求设计插件系统，最终只有一个永远不变的实现。
7. **忽略并发语义**：缓存装饰器、事件观察者或状态对象在多线程下出现竞态。

## 8. 总结与关联阅读

设计模式是管理已知变化的工具，不是代码“高级程度”的标签。先明确职责、依赖和变化点，再选择能用测试证明收益的最小抽象。

关联阅读：[工程规范与交付流程](./dev-spec-engineering-spec.md)、[测试工程](./dev-spec-testing.md)、[Java 面向对象](../java/basic/java-basic-oop.md)、[架构知识体系](../arch/basis/arch-basis-overview.md)。
