---
title: MCP 与工具协议
category:
  - LLM
  - MCP
tag:
  - MCP
  - 工具协议
  - 集成架构
description: 理解 MCP 主机、客户端、服务端、工具协议以及安全落地方法。
order: 1
outline: [2, 3]
---

# MCP 与工具协议

> 状态：已完善。协议细节会随官方规范演进，生产实现应以部署时采用的 MCP 规范和 SDK 版本为准。

## 1. 领域定位

MCP（Model Context Protocol）为模型应用提供连接工具、资源和提示模板的标准化边界。它解决“每个 Agent 都要写一套私有插件协议”的集成问题，但不负责业务授权、工具正确性或模型决策。

## 2. 知识地图

| 主题 | 关键问题 | 核心文档 |
| --- | --- | --- |
| 架构与协议 | Host、Client、Server 如何连接，协议交换什么 | [MCP 架构与工具协议](./ai-mcp-architecture-and-protocol.md) |
| 服务端与客户端 | 如何定义、发现、调用、测试工具和资源 | [MCP 服务端与客户端工程](./ai-mcp-server-client.md) |
| 安全与生产 | 如何做权限、提示注入防护、审计、限流和运维 | [MCP 安全与工程落地](./ai-mcp-security-and-production.md) |

## 3. 参考架构

```text
用户 / Agent
    ↓
MCP Host ── MCP Client ── stdio / Streamable HTTP ── MCP Server
    │                                                ├─ Tools
    ├─ 会话与策略                                      ├─ Resources
    └─ 审计与观测                                      └─ Prompts
                                                         ↓
                                              业务 API / DB / SaaS
```

Host 管理用户会话和模型，Client 实现协议连接，Server 暴露能力。业务系统仍需校验调用者身份、租户、参数和幂等性。

## 4. 学习顺序

1. 先理解 JSON-RPC 消息、能力协商、工具发现和调用生命周期。
2. 再实现服务端工具契约和客户端错误处理。
3. 最后加入认证授权、沙箱、审计、限流、发布和兼容策略。

## 5. 与相邻领域的关系

- [Tool Calling 与执行控制](../agent/ai-agent-planning-and-execution.md)决定何时调用 MCP 工具。
- [Workflow 可靠性](../workflow/ai-workflow-patterns-and-resilience.md)提供超时、重试和幂等模式。
- [结构化输出](../foundations/ai-llm-structured-output.md)用于工具参数和结果的 Schema 校验。

## 6. 维护清单

- 记录 Server 名称、协议版本、能力、工具 Schema 和部署地址。
- 升级 SDK 时运行握手、发现、调用、取消、超时和错误映射测试。
- 工具变更保持向后兼容；破坏性修改发布新名称或新主版本。
