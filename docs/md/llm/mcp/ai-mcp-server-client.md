---
title: MCP 服务端与客户端工程
category:
  - LLM
  - MCP
tag:
  - MCP Server
  - MCP Client
  - 协议测试
description: 设计可发现、可调用、可测试和可演进的 MCP 工具服务。
order: 3
outline: [2, 3]
---

# MCP 服务端与客户端工程

## 1. 学习目标

读完后可以定义 MCP 工具 Schema，选择 stdio 或 HTTP 部署方式，实现客户端错误映射、超时、取消和契约测试。

## 2. 适用场景

适用于为 AI Host 提供内部系统工具，或在多个 Agent 之间复用同一套工具能力。对用户直接开放的普通 REST API 不需要强行包装为 MCP。

## 3. 核心概念

### 3.1 服务端设计

```text
协议层：初始化、能力、发现、调用、取消
应用层：Schema 校验、权限、业务规则、幂等
适配层：内部 API / DB / 文件 / SaaS
横切：日志、trace、限流、配置、版本
```

一个工具只做一件可命名的事。把多步业务交给 Host/Agent 编排，服务端负责每一步的正确性。

### 3.2 传输选择

| 传输 | 优点 | 限制 | 适用 |
| --- | --- | --- | --- |
| stdio | 本地启动简单、隔离进程 | 不适合多实例公网 | 本地工具、开发环境 |
| Streamable HTTP | 可部署、可扩展、支持流式能力 | 需要网关、鉴权和会话管理 | 企业服务、远程工具 |

无论传输方式，都要设置连接、请求、工具执行和空闲超时。生产服务不要把调试端点暴露到公共网络。

### 3.3 错误与结果

| 类型 | 示例 | 客户端处理 |
| --- | --- | --- |
| 协议错误 | 方法不存在、参数格式错误 | 修复客户端，不重试 |
| 业务拒绝 | 无权限、订单已关闭 | 说明原因，不重试 |
| 临时故障 | 超时、限流、依赖不可用 | 退避重试或降级 |
| 部分成功 | 批量任务 8/10 成功 | 返回逐项状态，不整体覆盖 |

## 4. 工程实现

下面的注册表实现工具 Schema 校验和调用分发，可作为服务端应用层的最小测试边界：

```python
from collections.abc import Callable
from dataclasses import dataclass


@dataclass(frozen=True)
class ToolSpec:
    name: str
    required: frozenset[str]
    handler: Callable[[dict], dict]


class ToolRegistry:
    def __init__(self) -> None:
        self._tools: dict[str, ToolSpec] = {}

    def register(self, spec: ToolSpec) -> None:
        if spec.name in self._tools:
            raise ValueError(f"duplicate tool: {spec.name}")
        self._tools[spec.name] = spec

    def call(self, name: str, arguments: dict) -> dict:
        spec = self._tools.get(name)
        if spec is None:
            raise KeyError(f"unknown tool: {name}")
        missing = spec.required - arguments.keys()
        if missing:
            raise ValueError(f"missing arguments: {sorted(missing)}")
        return spec.handler(arguments)


if __name__ == "__main__":
    registry = ToolRegistry()
    registry.register(ToolSpec("echo", frozenset({"text"}), lambda a: {"text": a["text"]}))
    print(registry.call("echo", {"text": "ok"}))
```

生产服务应使用所采用 SDK 的正式 Schema 校验、协议序列化和传输实现，不要复制协议字段。

## 5. 生产实践

- 工具发布流程包含契约测试：发现、成功调用、非法参数、未知工具、超时和取消。
- 客户端缓存工具定义时带版本指纹，发现变化后刷新候选工具。
- 对结果做大小、编码和敏感字段控制；大文件返回引用和分页接口。
- 服务端日志记录工具名、参数摘要、结果状态、耗时和 trace_id，不记录密钥。

## 6. 常见问题

- **一个 Server 暴露多少工具合适？** 以职责和模型选择准确率为界；大工具集可按领域拆 Server 或在 Host 中过滤。
- **工具返回纯文本可以吗？** 简单结果可以，但进入业务状态的数据应使用结构化结果和明确 Schema。
- **客户端如何知道工具已删除？** 调用收到不存在错误后刷新发现结果，并把失败映射为“工具变更”，不要无限重试。
- **本地 stdio Server 如何升级？** 独立版本号、启动握手和契约测试；进程崩溃后由 Host 按策略重启。

## 7. 总结与延伸

协议职责见[MCP 架构与工具协议](./ai-mcp-architecture-and-protocol.md)，认证、授权和供应链风险见[MCP 安全与工程落地](./ai-mcp-security-and-production.md)，调用预算和故障模式见[Workflow 可靠性](../workflow/ai-workflow-patterns-and-resilience.md)。
