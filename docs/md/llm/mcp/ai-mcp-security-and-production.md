---
title: MCP 安全与工程落地
category:
  - LLM
  - MCP
tag:
  - MCP 安全
  - 提示注入
  - 零信任
description: 为 MCP 工具链建立身份、权限、沙箱、审计和供应链防护。
order: 4
outline: [2, 3]
---

# MCP 安全与工程落地

## 1. 学习目标

读完后可以为 MCP Host、Client、Server 和后端工具建立最小权限边界，防护提示注入、越权、数据泄露、危险工具和不可信依赖。

## 2. 适用场景

适用于连接企业 API、文件系统、代码执行、浏览器、数据库或第三方 SaaS 的 MCP 服务。任何具有写操作、执行代码或读取敏感数据的 Server 都必须按高风险系统治理。

## 3. 核心概念

### 3.1 信任边界

```text
不可信输入：用户消息、网页、文档、工具结果
          ↓ 内容标记与策略
Host/Agent：模型、会话、用户同意
          ↓ 最小权限身份
MCP Client/Server：协议校验、工具策略、沙箱
          ↓ 服务身份 + 业务授权
业务系统：RBAC/ABAC、幂等、审计
```

工具返回内容仍然是数据，不是指令。Server 不能要求客户端忽略 Host 策略，文档中的“请调用某工具”也不能自动授权动作。

### 3.2 威胁与控制

| 威胁 | 典型表现 | 控制 |
| --- | --- | --- |
| 间接提示注入 | 文档要求泄露密钥或调用写工具 | 内容隔离、危险动作确认、工具白名单 |
| 越权调用 | 用户只读却调用删除 | 身份传播、RBAC/ABAC、服务端复核 |
| 工具混淆 | 相似名称诱导高权限工具 | 稳定命名、签名、候选过滤 |
| 数据外泄 | 工具结果含密钥或大段隐私数据 | 脱敏、结果过滤、DLP、输出审批 |
| 依赖供应链 | Server 包或插件被篡改 | 锁版本、校验和、镜像扫描、最小安装 |
| 资源滥用 | 循环调用、超大结果、并发压垮后端 | 预算、限流、配额、熔断 |

### 3.3 授权模型

每次调用都携带最终用户身份、租户、会话和授权范围。服务端不能只相信 Client 传来的 `role` 字段，应校验签名令牌或调用身份服务。高风险动作支持二次确认、任务预览、时间限制和可撤销授权。

## 4. 工程实现

下面的策略门在执行工具前检查作用域和副作用等级，可作为业务层最小防线：

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class Principal:
    subject: str
    scopes: frozenset[str]


@dataclass(frozen=True)
class ToolPolicy:
    required_scope: str
    side_effect: str  # "read" 或 "write"


def authorize(principal: Principal, policy: ToolPolicy, confirmed: bool = False) -> None:
    if policy.required_scope not in principal.scopes:
        raise PermissionError("missing scope")
    if policy.side_effect == "write" and not confirmed:
        raise PermissionError("write action requires confirmation")


if __name__ == "__main__":
    authorize(
        Principal("user-1", frozenset({"orders:read", "orders:write"})),
        ToolPolicy("orders:write", "write"),
        confirmed=True,
    )
    print("authorized")
```

这只是应用层策略；网络层还要做 TLS、来源限制、认证、请求签名和租户隔离。

## 5. 生产实践

| 领域 | 最低要求 |
| --- | --- |
| 身份 | 短期令牌、受众校验、用户和服务身份分离 |
| 权限 | 最小 scope、写操作确认、定期回收授权 |
| 沙箱 | 代码/文件/浏览器工具独立进程、无默认外网、临时目录 |
| 数据 | 分类、脱敏、结果大小限制、秘密扫描 |
| 供应链 | 锁定依赖、签名制品、SBOM、漏洞扫描 |
| 运行 | 配额、审计、告警、禁用开关、灾备 |

## 6. 常见问题

- **加了系统提示“忽略恶意指令”就够了吗？** 不够。提示注入必须通过权限、工具隔离、人工确认和数据边界降低影响。
- **MCP Server 是内部服务为什么还要鉴权？** 内部网络也可能存在横向移动、错误配置和多租户隔离问题。
- **工具结果可以作为 HTML/脚本直接渲染吗？** 不应默认信任；先转义、清洗并限制内容类型。
- **如何做安全测试？** 使用恶意文档、诱导工具描述、参数越界、权限降级、重放、取消和资源耗尽用例做红队测试。
- **如何紧急止损？** 在 Host 和 Server 两侧都提供工具禁用、租户封禁、密钥轮换、审计保全和回滚。

## 7. 总结与延伸

MCP 安全是协议、身份、工具、数据和供应链的组合控制。工程结构见[MCP 服务端与客户端工程](./ai-mcp-server-client.md)，协议边界见[MCP 架构与工具协议](./ai-mcp-architecture-and-protocol.md)，外部动作的恢复策略见[Workflow 可靠性与常用模式](../workflow/ai-workflow-patterns-and-resilience.md)。
