---
title: Prompt 工程与提示治理
category:
  - LLM
tag:
  - Prompt
  - 提示工程
description: 用分层模板、示例、工具说明和回归测试维护可复用的提示。
order: 3
outline: [2, 3]
---

# Prompt 工程与提示治理

## 1. 学习目标

读完后可以把模糊需求转换为可版本化的 Prompt 模板，明确输入、工具、输出和失败处理，并用测试保护提示改动。

## 2. 适用场景

适用于分类、抽取、总结、问答、代码生成和 Tool Calling 的提示设计。检索策略见 [RAG](../rag/README.md)，循环控制见 [Agent](../agent/README.md)。

## 3. 核心概念

### 3.1 提示的分层结构

```text
系统策略：身份、边界、合规和输出契约
任务说明：目标、步骤、判断标准
上下文：用户资料、检索证据、当前状态
输入数据：用户消息或业务对象
输出约束：Schema、字段、引用、语言
示例：少量正例和反例，覆盖边界情况
```

系统策略放稳定内容，业务变量放模板占位符。提示中的规则要可判定，例如“只依据 `<evidence>`”比“尽量准确”更容易测试。

### 3.2 常用模式

| 模式 | 适用问题 | 风险 |
| --- | --- | --- |
| 角色 + 任务 | 稳定风格、明确职责 | 角色过宽导致越权 |
| 分步指令 | 多阶段抽取、判断 | 步骤过多时输出变长 |
| Few-shot | 格式稳定、边界规则 | 示例偏差、上下文膨胀 |
| 自检/复核 | 高风险生成 | 多一次模型调用，可能自我强化错误 |
| 结构化输出 | 数据进入系统 | Schema 设计不当会隐藏语义 |

### 3.3 Prompt 版本治理

把模板、变量 Schema、示例集、评测集和变更记录放在一起管理。一次变更至少回答：影响哪些任务、是否改变输出契约、回滚版本是什么。

## 4. 工程实现

下面的模板渲染器只使用标准库，适合把提示放到代码评审中：

```python
from string import Template


SYSTEM_POLICY = "你是数据抽取器。只依据 evidence 回答；缺失字段填 null。"
USER_TEMPLATE = Template("evidence:\n$evidence\n\nquestion:\n$question")


def render_messages(evidence: str, question: str) -> list[dict[str, str]]:
    if not evidence.strip():
        raise ValueError("evidence must not be empty")
    return [
        {"role": "system", "content": SYSTEM_POLICY},
        {"role": "user", "content": USER_TEMPLATE.safe_substitute(
            evidence=evidence, question=question
        )},
    ]


if __name__ == "__main__":
    print(render_messages("合同第 3 条：付款期限为 30 天。", "付款期限是多少？"))
```

模型 SDK 调用、重试和超时应由应用层统一处理，见[上下文工程](./ai-llm-context-and-inference.md)的生产实践。

## 5. 生产实践

- 每个 Prompt 都定义输入校验、输出 Schema、超时和失败文案。
- 用固定回归集测试事实性、拒绝越权、格式、字段缺失和多轮状态。
- 记录 prompt_version、model、temperature、输入摘要和输出校验结果，不记录不必要的敏感原文。
- 线上采样做人工复核，评测集不能只包含“正常快乐路径”。

## 6. 常见问题

- **为什么加了更多规则反而更差？** 规则互相冲突或超过模型注意力有效范围；按优先级拆分系统策略、任务步骤和输出契约。
- **Few-shot 越多越好吗？** 不是。示例应覆盖关键边界，并保持格式一致；重复示例会挤占上下文。
- **如何处理用户要求忽略系统规则？** 通过权限和工具层拦截，Prompt 只是第一道防线，不能替代服务端校验。
- **如何评估一次提示修改？** 保留旧版本基线，运行相同评测集，比较准确率、Schema 合法率、引用率、延迟和成本。

## 7. 总结与延伸

Prompt 是可测试的软件接口，不是一次性文案。输出契约见[结构化输出与校验](./ai-llm-structured-output.md)，复杂任务的规划与工具选择见 [Agent](../agent/ai-agent-planning-and-execution.md)。
