---
title: 权限、隐私与审计
category:
  - LLM
  - AI 安全
tag:
  - RBAC
  - ABAC
  - 数据脱敏
  - 审计
description: 在 AI 服务、RAG、Agent 和工具链中实施最小权限、数据脱敏和可追溯审计。
order: 2
outline: [2, 3]
---

# 权限、隐私与审计

## 学习目标

- 将用户身份、租户、角色和资源属性贯穿 AI 调用链。
- 在检索、Prompt、日志、缓存、导出和模型训练各环节控制数据暴露。
- 使用稳定掩码、令牌化和密钥散列保护个人信息与商业秘密。
- 设计防篡改、可查询、最小记录的审计日志与告警。

## 适用场景

适用于多租户产品、企业内部助手、客服 Agent、知识库、MCP 工具和任何接触个人信息或业务敏感数据的系统。

## 核心概念

### 授权模型

| 模型 | 适用 | 局限 |
| --- | --- | --- |
| RBAC | 职责稳定，如客服、运营、管理员 | 难以表达资源属性 |
| ABAC | 按租户、部门、数据等级、时间、设备决策 | 策略复杂，需要测试 |
| ReBAC | 组织、项目、文档分享关系 | 需要关系数据和图查询 |
| 工具级 ACL | 明确工具与动作边界 | 必须叠加数据范围 |

推荐：身份由 OIDC/OAuth2 提供，入口使用 RBAC 做粗粒度判断，资源服务使用 ABAC/ReBAC 做细粒度过滤，工具再执行动作级授权。

### 端到端身份

```text
用户令牌 -> Gateway 验签/限流
         -> 服务获取 user_id/tenant_id/roles
         -> RAG 过滤可见文档
         -> Agent 生成工具意图
         -> 工具服务按用户/租户重新授权
         -> 业务数据库行级过滤
         -> 审计记录主体、资源、动作、结果
```

禁止把用户令牌直接拼入 Prompt，禁止 Agent 用超级服务账号绕过下游业务权限。

### 数据分类

| 类别 | 示例 | 默认处理 |
| --- | --- | --- |
| 公开 | 产品公开文档 | 可检索，保留来源 |
| 内部 | 流程、内部 FAQ | 登录可访问，禁止外发 |
| 机密 | 商业秘密、合同、密钥 | 加密、最小权限、严格日志 |
| 个人信息 | 姓名、电话、地址、交易记录 | 脱敏、用途限制、短保留 |
| 特殊敏感 | 健康、生物、金融账户 | 最小化、强加密、人工审批 |

不要在知识库页面写入真实电话、住址、身份证、账号、密钥或未脱敏客户数据。

## 工程实现

### 可运行的脱敏与审计工具

创建 `privacy_audit.py`：

```python
import hashlib
import hmac
import json
import os
import re
import time
from dataclasses import asdict, dataclass


EMAIL = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE = re.compile(r"(?<!\d)(?:\+?86[- ]?)?1[3-9]\d{9}(?!\d)")
CARD = re.compile(r"(?<!\d)\d{16,19}(?!\d)")


@dataclass(frozen=True)
class AuditEvent:
    event_id: str
    occurred_at: str
    actor_id: str
    tenant_id: str
    action: str
    resource_type: str
    resource_id: str
    result: str
    trace_id: str
    risk_level: str


def mask_text(text: str) -> str:
    text = EMAIL.sub(lambda m: f"{m.group(0)[:2]}***@{m.group(0).split('@', 1)[1]}", text)
    text = PHONE.sub(lambda m: m.group(0)[:3] + "****" + m.group(0)[-4:], text)
    text = CARD.sub(lambda m: m.group(0)[:4] + "*" * (len(m.group(0)) - 8) + m.group(0)[-4:], text)
    return text


def stable_token(value: str, secret_name: str = "TOKEN_HMAC_KEY") -> str:
    secret = os.getenv(secret_name)
    if not secret:
        raise RuntimeError(f"{secret_name} is required")
    digest = hmac.new(secret.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"tok_{digest[:24]}"


def append_audit(path: str, event: AuditEvent) -> None:
    protected = asdict(event)
    canonical = json.dumps(protected, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
    secret = os.getenv("AUDIT_HMAC_KEY")
    if not secret:
        raise RuntimeError("AUDIT_HMAC_KEY is required")
    signature = hmac.new(secret.encode("utf-8"), canonical.encode("utf-8"), hashlib.sha256).hexdigest()
    with open(path, "a", encoding="utf-8") as file:
        file.write(json.dumps({"event": protected, "signature": signature}, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    os.environ["TOKEN_HMAC_KEY"] = os.environ.get("TOKEN_HMAC_KEY", "demo-token-key")
    os.environ["AUDIT_HMAC_KEY"] = os.environ.get("AUDIT_HMAC_KEY", "demo-audit-key")
    print(mask_text("联系 test@example.com 或 13812345678，卡号 6222021234567890123"))
    print(stable_token("customer-001"))
    append_audit(
        "audit.jsonl",
        AuditEvent(
            event_id="evt-001",
            occurred_at=time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            actor_id=stable_token("user-001"),
            tenant_id=stable_token("tenant-001"),
            action="knowledge.query",
            resource_type="document",
            resource_id="doc-001",
            result="allowed",
            trace_id="trace-001",
            risk_level="low",
        ),
    )
```

运行：

```bash
export TOKEN_HMAC_KEY='replace-with-secret-manager-value'
export AUDIT_HMAC_KEY='replace-with-different-secret-manager-value'
python privacy_audit.py
```

生产环境将密钥放入 Secret Manager/KMS，审计日志追加到 WORM 存储或审计数据库。HMAC 用于验证完整性，不能替代加密和访问控制。

## 隐私控制点

| 阶段 | 控制 |
| --- | --- |
| 采集 | 说明用途，只收最少字段，敏感字段分开存储 |
| 检索 | 租户/部门/文档 ACL 过滤，缓存键包含授权域 |
| Prompt | 掩码、令牌化、最小上下文，禁止不必要个人信息 |
| 模型调用 | 签署数据处理协议，关闭训练/日志保留，选择合规区域 |
| 输出 | PII/凭据检测，禁止跨用户组合和推断 |
| 日志/Trace | 默认只记录摘要和哈希；受控采样与短保留 |
| 训练/评测 | 去标识化、授权确认、差分隐私视场景评估 |
| 删除 | 传播到缓存、向量库、对象存储、备份、评测集和供应商 |

### 授权检查表

- [ ] 每次工具调用都使用当前用户上下文，不使用模型提供的身份。
- [ ] 检索过滤在向量查询前生效，不先取全库再在 Prompt 中判断。
- [ ] 缓存键包含 `tenant_id + user_scope + policy_version + knowledge_version`。
- [ ] 导出、引用原文、分享会话和长期记忆分别授权。
- [ ] 权限拒绝返回统一错误，不泄露资源是否存在。
- [ ] 管理员查看用户会话需要工单、理由、时限和审计。
- [ ] 服务账号使用短期凭据，按环境和职责拆分。

## 审计设计

审计事件至少包含：

- 主体：用户/服务、租户、认证方式、角色快照。
- 动作：查询、生成、工具调用、导出、授权变更、模型/知识版本变更。
- 资源：类型、稳定 ID、数据等级；不记录原始敏感内容。
- 上下文：Request ID、Trace ID、IP/设备风险、策略版本。
- 结果：允许/拒绝/失败、原因代码、副作用 ID、审批单。
- 完整性：事件 ID、时间戳、签名、链式校验或写入 WORM。

告警场景：短时大量导出、跨租户拒绝、高风险工具失败后重试、管理员访问会话、凭据特征出现在输出、审计链断裂。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 检索出现他租户文档 | 向量库元数据过滤缺失/写错 | 查询前后双检、隔离测试 |
| 缓存返回他人答案 | 缓存键未包含权限域 | 纳入租户/策略/知识版本 |
| 日志再次泄露 PII | Debug 打印完整 Prompt | 日志白名单、脱敏、采集审查 |
| Agent 越权成功 | 工具信任模型声明 | 下游按真实身份重鉴权 |
| 删除后仍被回答 | 备份/向量/缓存未清理 | 删除传播任务与证明 |
| 审计不能追责 | 只有应用日志，没有主体快照 | 独立审计事件与完整性保护 |

面试追问：为什么向量检索必须在查询前做 ACL 过滤？  
模型或应用层事后过滤既泄露候选向量、又可能遗漏复杂权限；数据库/向量库应在检索表达式中限制租户和文档可见性，并保留查询审计。

## 总结与延伸

权限决定数据能否进入模型，隐私控制决定数据暴露多少，审计决定出事后能否追责。模型和组织级风险参见[模型安全与风险治理](./ai-security-model-governance.md)。
