---
title: MCP 架构与工具协议
category:
  - LLM
  - MCP
tag:
  - MCP
  - JSON-RPC
description: 掌握 MCP 主机、客户端、服务端和工具协议的职责与消息生命周期。
order: 2
outline: [2, 3]
---

# MCP 架构与工具协议

> 适用范围：本文解释 MCP 的通用架构和 JSON-RPC 消息模型，不绑定某个 SDK 版本；字段和能力以官方规范为准。

## 1. 学习目标

读完后可以区分 Host、Client、Server，描述初始化、能力协商、工具发现、调用和取消流程，并设计稳定工具契约。

## 2. 适用场景

适用于把数据库、内部 API、文件系统、SaaS 或开发工具接入 AI 应用。简单的单体内部函数无需先上 MCP；需要跨应用复用、独立部署或标准工具发现时再引入。

## 3. 核心概念

### 3.1 角色边界

| 角色 | 职责 | 不负责 |
| --- | --- | --- |
| Host | 管理会话、模型、用户同意和策略 | 具体业务工具实现 |
| Client | 与 Server 建连、发送协议请求 | 绕过 Host 授权 |
| Server | 发现并执行工具/资源/提示 | 决定模型何时调用 |
| Provider | 承载实际 API、DB 或 SaaS | MCP 消息传输 |

### 3.2 能力对象

- **Tools**：可执行动作，带名称、描述、输入 Schema 和结果。
- **Resources**：可读取的数据或文件，由 Server 标识和授权。
- **Prompts**：可复用的提示模板或交互模式，不等同于系统安全策略。
- **Sampling / elicitation 等扩展能力**：按客户端和规范版本协商，不能假设一定可用。

### 3.3 消息生命周期

```text
Client → initialize（协议版本、能力）
Server → initialize result（服务端能力）
Client/Server → initialized 通知
Client → tools/list、resources/list
Client → tools/call(name, arguments, request_id)
Server → result 或 JSON-RPC error
Client → notifications/cancelled（需要时）
```

请求必须携带可关联的 `id`，通知没有 `id`。取消表示调用方不再等待，不自动代表业务动作已经回滚。

### 3.4 工具契约

工具描述应回答：做什么、何时使用、参数含义、副作用、权限、幂等性、超时和错误。工具结果至少区分成功数据、业务拒绝、临时故障和协议错误。

## 4. 工程实现

下面的标准库示例验证 JSON-RPC 调用信封并分发工具，便于理解服务端协议边界：

```python
from collections.abc import Callable


def dispatch(request: dict, tools: dict[str, Callable[[dict], dict]]) -> dict:
    if request.get("jsonrpc") != "2.0" or "id" not in request:
        return {"jsonrpc": "2.0", "id": None, "error": {"code": -32600, "message": "invalid request"}}
    if request.get("method") != "tools/call":
        return {"jsonrpc": "2.0", "id": request["id"], "error": {"code": -32601, "message": "method not found"}}
    params = request.get("params", {})
    name = params.get("name")
    arguments = params.get("arguments", {})
    if name not in tools or not isinstance(arguments, dict):
        return {"jsonrpc": "2.0", "id": request["id"], "error": {"code": -32602, "message": "invalid params"}}
    try:
        return {"jsonrpc": "2.0", "id": request["id"], "result": tools[name](arguments)}
    except Exception as exc:
        return {"jsonrpc": "2.0", "id": request["id"], "error": {"code": -32000, "message": type(exc).__name__}}


if __name__ == "__main__":
    request = {"jsonrpc": "2.0", "id": 1, "method": "tools/call",
               "params": {"name": "echo", "arguments": {"text": "ok"}}}
    print(dispatch(request, {"echo": lambda args: {"text": args["text"]}}))
```

SDK 会处理传输、协议字段和能力协商，但业务工具仍必须执行参数、权限和副作用校验。

## 5. 生产实践

- 工具名称稳定、领域化，如 `orders.get`，避免把内部函数名暴露给模型。
- 发现结果可缓存，但变更后要失效；客户端必须处理工具不存在和 Schema 变化。
- 每个请求传播 trace_id、用户/租户上下文和调用预算。
- 结果控制大小，分页返回资源引用，不让模型一次性接收整个数据库。

## 6. 常见问题

- **MCP 能替代 OAuth 或数据库权限吗？** 不能。MCP 只传递协议能力，身份认证和业务授权仍在各层执行。
- **取消请求会回滚写操作吗？** 不保证。写工具需要幂等键、状态查询和补偿接口。
- **工具描述是不是越详细越好？** 要精确且短，突出边界和参数；无关内容会增加模型误选。
- **Resource 和 Tool 怎么选？** 只读内容用 Resource，带动作或计算的用 Tool；资源下载后仍要做权限和内容检查。

## 7. 总结与延伸

MCP 标准化了能力发现和调用边界，不替代业务工程。实现与测试见[MCP 服务端与客户端工程](./ai-mcp-server-client.md)，生产安全见[MCP 安全与工程落地](./ai-mcp-security-and-production.md)。
