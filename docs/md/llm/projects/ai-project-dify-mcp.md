---
title: Dify + MCP 工具平台项目案例
category:
  - LLM
  - 项目案例
tag:
  - Dify
  - MCP
  - 工具平台
  - Spring
description: 将 Dify 私有化编排与 MCP 工具服务接入企业 API、鉴权、重试和审计体系。
order: 2
outline: [2, 3]
---

# Dify + MCP 工具平台项目案例

> 案例类型：项目案例模板  
> 可裁剪技术：Dify、MCP Protocol、Spring Boot 3、Spring WebFlux、SSE、Redis、MySQL、Gateway

## 学习目标

- 划分 Dify 编排、MCP 工具服务和企业业务 API 的职责。
- 设计工具目录、能力契约、身份传播、幂等、重试和审计。
- 将 Dify 的 Agent/Workflow/ChatFlow 作为应用入口，同时保持企业安全边界。
- 为工具版本、调用成本、错误和副作用建立可运维平台。

## 业务背景

企业已有多套 Java/微服务 API，希望使用 Dify 快速编排对话和工作流，但不希望业务 API 直接暴露给模型，也不接受工具任意调用和重复副作用。项目目标是形成统一 AI 服务平台：Dify 负责编排，MCP 工具层负责安全、稳定的业务能力。

### 项目定义

```yaml
project:
  name: Dify + MCP 企业工具平台
  users: [AI 应用开发者, 业务系统, 运营人员]
  problem: 业务工具分散、接口不统一、权限与审计不足
  target:
    primary: 新工具接入周期下降，工具调用成功率和可追溯性提升
    guardrails: [越权, 重复副作用, 数据泄漏, P95, 调用成本]
  non_goals: [将全部业务 API 自动开放给模型, 取代业务事务系统]
```

## 适用场景

- 使用 Dify Agent、Workflow、ChatFlow 调用企业订单、客户、工单、OA、知识和报表服务。
- 需要标准工具描述、Schema、能力发现和调用协议。
- 多应用复用同一批业务工具，并统一鉴权、限流、审计、重试和成本。
- 需要 SSE 流式对话、异步长任务和工具结果持久化。

不适用：所有工具都应由模型自主执行、无法定义输入输出契约、业务系统没有幂等能力且不允许改造。

## 架构设计

```text
用户/业务系统
  -> Gateway（OAuth2/OIDC、租户、限流、IP 策略）
  -> Dify 私有平台
     -> Agent / Workflow / ChatFlow
     -> MCP Tool Client / Plugin
        -> MCP Tool Gateway（目录、策略、配额、Trace）
           -> Tool Adapter（参数校验、幂等、重试、结果规范化）
              -> Java 业务 API / OA / 工单 / 客户系统
        -> AI 应用服务（复杂状态、SSE、任务持久化）
  -> Redis（限流/缓存/幂等摘要）
  -> MySQL（工具注册、版本、调用记录、任务）
  -> 对象存储/日志/审计/监控
```

### 责任边界

| 组件 | 负责 | 不负责 |
| --- | --- | --- |
| Dify | Prompt、流程、知识库、模型和应用配置 | 企业业务事务最终一致性 |
| MCP Gateway | 工具目录、Schema、鉴权、限流、Trace | 具体业务规则 |
| Tool Adapter | 参数映射、幂等、超时、重试、错误码 | 决定用户是否有业务权限 |
| 业务 API | 权限、事务、幂等、业务校验 | 信任模型传来的身份 |
| AI 应用服务 | 长任务、会话、SSE、副作用登记 | 绕过业务 API 直写数据库 |

## 工具契约

### 工具描述

```yaml
tool:
  name: create_service_ticket
  version: 2.1.0
  title: 创建服务工单
  risk_level: L3
  side_effect: write
  requires_confirmation: true
  idempotent: true
  timeout_ms: 8000
  input_schema:
    type: object
    additionalProperties: false
    required: [order_id, category, summary]
    properties:
      order_id:
        type: string
        pattern: "^[A-Z0-9-]{1,32}$"
      category:
        type: string
        enum: [refund_progress, delivery, account, other]
      summary:
        type: string
        maxLength: 500
  output_schema:
    type: object
    required: [ticket_id, status]
    properties:
      ticket_id: {type: string}
      status: {type: string, enum: [created, existing, failed]}
      version: {type: integer}
  permissions:
    roles: [service_agent]
    tenant_scoped: true
```

### 统一结果

```json
{
  "ok": true,
  "data": {"ticket_id": "T-100", "status": "created", "version": 1},
  "error": null,
  "meta": {
    "request_id": "req-001",
    "trace_id": "trace-001",
    "tool_version": "2.1.0",
    "duration_ms": 182,
    "idempotent_replay": false
  }
}
```

错误使用稳定代码，如 `AUTH_DENIED`、`VALIDATION_FAILED`、`NOT_FOUND`、`CONFLICT`、`RATE_LIMITED`、`UPSTREAM_TIMEOUT`。不要把数据库堆栈或内部 URL 传给模型。

## 工程实现

### 可运行的 MCP Python 工具服务

以下示例面向 MCP Python SDK 的 `FastMCP` 风格接口。MCP SDK 版本演进较快，落地时应锁定官方 SDK 版本并按其文档验证。

创建 `ticket_mcp_server.py`：

```python
import os
import re
from dataclasses import dataclass

import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("enterprise-ticket-tools")
ORDER_ID = re.compile(r"^[A-Z0-9-]{1,32}$")


@dataclass(frozen=True)
class Settings:
    api_base_url: str
    api_token: str
    timeout_seconds: float = 8.0


def settings() -> Settings:
    base_url = os.getenv("TICKET_API_BASE_URL")
    token = os.getenv("TICKET_API_TOKEN")
    if not base_url or not token:
        raise RuntimeError("TICKET_API_BASE_URL and TICKET_API_TOKEN are required")
    return Settings(base_url.rstrip("/"), token)


@mcp.tool()
async def query_order(order_id: str) -> dict:
    """查询订单状态；order_id 仅允许大写字母、数字和连字符。"""
    if not ORDER_ID.fullmatch(order_id):
        raise ValueError("invalid order_id")
    config = settings()

    async with httpx.AsyncClient(timeout=config.timeout_seconds) as client:
        response = await client.get(
            f"{config.api_base_url}/orders/{order_id}",
            headers={"Authorization": f"Bearer {config.api_token}"},
        )
        response.raise_for_status()
        data = response.json()
        return {
            "order_id": data["order_id"],
            "status": data["status"],
            "updated_at": data["updated_at"],
        }


@mcp.tool()
async def create_service_ticket(
    order_id: str,
    category: str,
    summary: str,
    idempotency_key: str,
) -> dict:
    """为已确认的订单问题创建服务工单；重复 idempotency_key 返回同一工单。"""
    if not ORDER_ID.fullmatch(order_id):
        raise ValueError("invalid order_id")
    if category not in {"refund_progress", "delivery", "account", "other"}:
        raise ValueError("invalid category")
    if not 1 <= len(summary) <= 500:
        raise ValueError("invalid summary")
    if not 8 <= len(idempotency_key) <= 128:
        raise ValueError("invalid idempotency_key")

    config = settings()
    payload = {
        "order_id": order_id,
        "category": category,
        "summary": summary,
        "source": "mcp_agent",
    }
    async with httpx.AsyncClient(timeout=config.timeout_seconds) as client:
        response = await client.post(
            f"{config.api_base_url}/tickets",
            headers={
                "Authorization": f"Bearer {config.api_token}",
                "Idempotency-Key": idempotency_key,
            },
            json=payload,
        )
        response.raise_for_status()
        data = response.json()
        return {
            "ticket_id": data["ticket_id"],
            "status": data["status"],
            "version": data["version"],
        }


if __name__ == "__main__":
    mcp.run()
```

安装并运行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "mcp>=1,<2" "httpx>=0.27,<1"
export TICKET_API_BASE_URL='https://ticket-api.internal.example'
export TICKET_API_TOKEN='short-lived-token-from-secret-manager'
python ticket_mcp_server.py
```

注意：

- 真实身份应由 MCP Gateway/OIDC 传播，示例中的服务令牌不代表用户授权。
- Dify 侧仍需在工具调用前进行高风险确认，业务 API 仍需按用户和租户鉴权。
- 工具不得把 `TICKET_API_TOKEN`、系统提示、内部 URL 或完整响应写入输出。

## 接入流程

1. **工具盘点**：业务能力、责任人、数据等级、读写、副作用、幂等和 SLO。
2. **风险定级**：L1 只读到 L4 极高风险，决定确认、审批、配额和隔离。
3. **契约设计**：名称、版本、Schema、稳定错误码、超时、幂等、兼容策略。
4. **适配开发**：业务 API 适配、参数校验、身份传播、脱敏、Trace。
5. **注册发布**：工具目录、环境、版本、权限、文档、测试和审批。
6. **Dify 配置**：Agent/Workflow 引用稳定工具版本，设置超时和失败分支。
7. **联调评测**：成功、失败、重复、超时、越权、注入、并发和成本。
8. **灰度运维**：金丝雀、限流、熔断、审计、告警、回滚和下线。

## 安全与可靠性

- 工具目录是受控资产，修改工具描述需要代码审查和安全回归。
- MCP Server 视为独立安全域，限制网络、文件、进程、环境变量和密钥。
- 所有写工具提供 `idempotency_key`；所有资源 ID 做格式、租户和存在性校验。
- 对用户身份、租户、授权角色和数据范围使用签名断言，不接受模型自由声明。
- 不可逆操作使用二次确认或人工审批；确认令牌必须绑定工具、参数哈希和短有效期。
- 日志记录工具版本、参数摘要、结果摘要、错误码、耗时和副作用 ID，不记录敏感原文。
- 对工具结果长度限制，防止超长内容撑爆上下文或注入指令。

## 验收与运营

| 类别 | 指标 |
| --- | --- |
| 可靠性 | 工具成功率、P95/P99、超时率、重试率、重试放大 |
| 正确性 | 参数正确率、契约测试、重复副作用率、错误码准确 |
| 安全 | 越权零通过、注入工具误调零通过、密钥泄漏零发生 |
| 效率 | 新工具接入周期、复用应用数、文档完整率 |
| 成本 | 调用/会话、失败调用成本、业务 API 成本 |
| 运营 | 版本变更成功率、回滚时长、告警响应时间 |

## 常见坑

| 坑 | 后果 | 避免方法 |
| --- | --- | --- |
| 把工具描述当普通 Prompt | 任意修改导致行为漂移 | 版本、审批、代码审查 |
| 一个工具接受任意 JSON | 参数攻击、错误映射 | 严格 Schema、`additionalProperties: false` |
| 工具服务用管理员账号 | 越权和审计失真 | 用户身份传播、最小服务账号 |
| 只在 Dify 中做鉴权 | 直连 API 可绕过 | 每层重鉴权 |
| 不做幂等 | 重复建单/发送 | Idempotency-Key、唯一约束 |
| 把完整工具返回给模型 | 注入、Token 爆炸 | 归一化、摘要、长度限制 |
| Dify 流程直连生产变更 | 无法回滚 | 环境、版本、发布门禁 |

## 总结与延伸

Dify 提升编排效率，MCP 统一工具能力，业务 API 仍是权限和事务边界。私有化部署参考[推理平台与私有化部署](../deploy/ai-deploy-inference-platform.md)，工具安全参考[提示注入与输出安全](../security/ai-security-prompt-injection.md)。
