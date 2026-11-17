---
title: 模型安全与风险治理
category:
  - LLM
  - AI 安全
tag:
  - 模型安全
  - 风险治理
  - 供应链
  - 事件响应
description: 建立模型选择、内容安全、供应链、风险审批和 AI 事件响应治理体系。
order: 3
outline: [2, 3]
---

# 模型安全与风险治理

## 学习目标

- 为 AI 能力建立风险等级、责任人、审批和上线标准。
- 控制模型、Prompt、插件、MCP Server、微调数据和推理镜像供应链。
- 识别幻觉、偏见、歧视、过度自信、数据泄漏和危险建议。
- 建立模型变更、异常事件、回滚和对外沟通机制。

## 适用场景

适用于选择基础模型、上线 Agent 能力、引入第三方插件、私有化部署、微调发布以及持续运营治理。

## 核心概念

### 治理对象

| 对象 | 需要管理的信息 |
| --- | --- |
| 基础模型 | 提供方、版本、许可证、区域、训练截止、已知限制 |
| Prompt/策略 | 版本、责任人、变更记录、评测报告、回滚版本 |
| 知识库 | 来源授权、敏感级别、新鲜度、删除机制 |
| 工具/MCP | 权限、输入输出 Schema、网络边界、签名和依赖 |
| 微调模型 | 数据授权、评测、偏差、模型卡、量化和部署版本 |
| 外部服务 | 数据处理、保留策略、故障与安全条款、退出方案 |

### 模型风险

| 风险 | 表现 | 控制 |
| --- | --- | --- |
| 幻觉/过度自信 | 编造事实、来源、政策 | 引用、检索、拒答、人工复核 |
| 偏见/歧视 | 不同群体待遇不一致 | 分组评测、政策约束、申诉 |
| 数据泄漏 | 训练/上下文/缓存泄露 | 数据隔离、最小上下文、供应商策略 |
| 有害内容 | 暴力、仇恨、危险行为 | 分类、过滤、年龄/场景策略 |
| 不安全建议 | 金融、医疗、法律、生产操作 | 风险标签、免责声明、人工审批 |
| 模型退化 | Provider 更新、漂移、量化损失 | 固定版本、回归、金丝雀、回滚 |
| 供应链攻击 | 恶意模型/插件/依赖 | 来源校验、SBOM、扫描、网络隔离 |

### 模型卡最小字段

```yaml
model_id: customer-service-general-v3
purpose: 企业客户服务辅助回答
owner: ai-platform-team
provider: self-hosted
base_model: approved-base-model-version
training_data_scope: de-identified internal service cases
data_authorization: approved-reference-id
languages: [zh-CN, en-US]
risk_level: L2
intended_use: [faq_answer, draft_reply, ticket_summary]
out_of_scope: [medical_diagnosis, credit_decision, autonomous_refund]
evaluation:
  core_pass_rate: 0.96
  safety_pass_rate: 1.0
  human_review_sample: 200
known_limits:
  - 对实时订单状态需要调用业务工具，不直接回答
  - 对法律法规变化依赖知识库更新
deployment:
  environment: private-kubernetes
  fallback_model: customer-service-small-v2
rollback_version: customer-service-general-v2
```

## 工程实现

### 可运行的风险门禁

创建 `risk_gate.py`：

```python
import argparse
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Assessment:
    capability_id: str
    risk_level: str
    safety_pass_rate: float
    human_review_completed: bool
    has_rollback: bool
    pii_used: bool
    irreversible_actions: bool
    data_authorization: bool


def decide(assessment: Assessment) -> tuple[bool, list[str]]:
    reasons = []
    if assessment.risk_level not in {"L1", "L2", "L3", "L4"}:
        reasons.append("invalid_risk_level")
    if assessment.safety_pass_rate < 1.0:
        reasons.append("safety_gate_failed")
    if assessment.risk_level in {"L3", "L4"} and not assessment.human_review_completed:
        reasons.append("human_review_required")
    if not assessment.has_rollback:
        reasons.append("rollback_required")
    if assessment.pii_used and not assessment.data_authorization:
        reasons.append("data_authorization_required")
    if assessment.risk_level == "L4" and assessment.irreversible_actions:
        reasons.append("autonomous_irreversible_actions_forbidden")
    return not reasons, reasons


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("assessment", type=Path)
    args = parser.parse_args()

    payload = json.loads(args.assessment.read_text(encoding="utf-8"))
    assessment = Assessment(**payload)
    approved, reasons = decide(assessment)
    print(json.dumps({"approved": approved, "reasons": reasons}, ensure_ascii=False, indent=2))
    if not approved:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
```

创建 `assessment.json`：

```json
{
  "capability_id": "customer-ticket-create",
  "risk_level": "L3",
  "safety_pass_rate": 1.0,
  "human_review_completed": true,
  "has_rollback": true,
  "pii_used": true,
  "irreversible_actions": true,
  "data_authorization": true
}
```

运行：

```bash
python risk_gate.py assessment.json
```

## 发布治理

```text
风险识别 -> 数据/模型/工具清单 -> 威胁建模 -> 控制设计
         -> 离线安全评测 -> 人工审核 -> 灰度/影子
         -> 在线护栏 -> 发布审批 -> 持续监控 -> 定期复审
```

### 审批矩阵

| 风险 | 产品 | 技术 | 安全/隐私 | 业务负责人 |
| --- | --- | --- | --- | --- |
| L1 | 提交 | 评审 | 抽查 | 备案 |
| L2 | 提交 | 评审 | 评审 | 批准 |
| L3 | 提交 | 评审 | 必须批准 | 必须批准 |
| L4 | 提交 | 评审 | 必须批准 | 必须批准并人工控制 |

### 供应链控制

- 模型和镜像来自批准仓库，记录摘要、签名、SBOM 和许可证。
- MCP/插件按独立第三方代码处理：静态扫描、动态沙箱、最小网络、短期凭据。
- 锁定依赖版本和构建来源；更新先过安全扫描和回归评测。
- 运行环境禁止默认公网访问；域名、工具出口、数据库均使用允许列表。
- 密钥由 Secret Manager 注入，禁止写入 Prompt、镜像、模型文件、日志和 Git。

## 事件响应

| 阶段 | 动作 |
| --- | --- |
| 发现 | 监控、用户投诉、红队、供应商通报 |
| 控制 | 禁用工具/模型/知识源，扩大人工审核，限流 |
| 评估 | 影响用户、数据类别、时间窗口、是否外泄/产生副作用 |
| 修复 | 回滚版本、撤销凭据、清理恶意文档、修复策略 |
| 验证 | 安全回归、审计核对、业务确认、人工复核 |
| 总结 | 根因、改进项、数据回流、责任和截止日期 |

高风险事件必须保留证据、变更记录和决策链。对外沟通由组织既有合规/法务流程决定，技术日志不能替代正式通报。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 模型升级后答案风格突变 | Provider 非固定版本 | 锁版本、金丝雀、回归 |
| 评测全过但产生错误工单 | 评测缺少业务副作用 | 加工具副作用和人工确认评测 |
| 插件可访问所有内网 | 网络边界默认开放 | 出口代理、域名允许列表 |
| Prompt 中出现密钥 | 调试信息被拼入上下文 | 秘密扫描、结构化字段白名单 |
| 无法说明模型为什么拒绝 | 缺少策略版本和原因码 | 策略版本、稳定错误码、审计 |
| 微调模型无法合规上线 | 数据授权和评测证据缺失 | 模型卡、数据证明、偏差评测 |

面试追问：模型安全评测通过后为什么仍需在线护栏？  
离线样本无法覆盖实时分布、供应商变化、多轮攻击和业务环境；在线护栏控制速率、权限、输出和副作用，并支持快速回滚。

## 总结与延伸

治理不是一次性审批，而是模型、数据、工具、变更和事件的全生命周期控制。技术发布门禁参见[回归集与发布门禁](../evaluation/ai-evaluation-regression-suite.md)，基础设施边界参见[推理平台与私有化部署](../deploy/ai-deploy-inference-platform.md)。
