---
title: 关于我
icon: user
order: 1
category:
  - 个人展示
tag:
  - About
  - AI应用开发
  - 后端工程
description: Dumas的个人介绍、核心能力、工作经历、代表性项目与学习方向。
outline: [2, 3]
---

# 关于我

## 目录

- [职业定位](#职业定位)
- [核心能力](#核心能力)
- [工作经历概览](#工作经历概览)
- [代表性项目案例](#代表性项目案例)
- [技术影响力与学习方向](#技术影响力与学习方向)
- [联系入口](#联系入口)

## 职业定位

我是Dumas，一名拥有 8 年开发经验的 AI 应用开发工程师，技术主线是从 Java 后端工程走向 AI Agent 应用开发。

我关注的问题不是单纯接入一个大模型，而是如何把模型能力嵌入真实业务流程：设计意图路由和多 Agent 协作，使用 RAG 构建企业知识检索，使用 MCP 和 Tool Calling 连接既有系统，并用 FastAPI、SSE、消息队列、缓存和可观测性把对话体验做成可运行、可维护的服务。

我的定位是：**能够同时理解业务、后端系统和 AI 应用架构的工程开发者**。适合参与企业智能客服、知识库问答、工作流编排、工具服务、AI 平台集成，以及 Java/Python 混合架构的落地工作。

## 核心能力

### AI 应用开发

- **Agent 架构**：意图识别、Router + 垂直 Agent、Multi-Agent 协作、Tool Calling、槽位填充。
- **知识与记忆**：RAG 语义检索、Milvus 向量存储、短期上下文与长期用户画像、跨会话应答。
- **工作流与协议**：LangGraph、Dify Agent / Workflow / ChatFlow 集成、MCP Protocol、Prompt Engineering。
- **交互工程**：FastAPI、SSE 流式响应、指数退避重试、异步消息持久化、实时对话体验优化。
- **模型部署与微调**：Dify 私有化对接，熟悉 LoRA 微调流程，了解 Ollama 与 vLLM 高效推理部署。

### 后端与分布式工程

- **开发语言**：Java、Python、C#、JavaScript / TypeScript。
- **后端框架**：Spring Boot 3、Spring Cloud、MyBatis、Netty、Spring WebFlux。
- **数据库与中间件**：Oracle、MySQL、Redis、MongoDB、RocketMQ、Elasticsearch。
- **微服务治理**：Gateway、Nacos、Sentinel、OAuth2.0、JWT、负载均衡、熔断降级。
- **交付与运维**：Docker、Kubernetes、Jenkins、PowerJob、SkyWalking。
- **工程方法**：策略模式、模板方法模式、观察者模式，重视分层、幂等、可观测性和可扩展性。

### AI 辅助开发

熟练使用 Claude Code、Trae、GitHub Copilot 参与需求分析、代码生成、重构、测试和文档整理。对于 AI 编程工具，我更关注如何建立可复用的上下文、校验生成结果，并让工具真正融入工程流程，而不是只做一次性代码生成。

## 工作经历概览

### 万得信息 - Java 开发工程师

**2023.03 - 2026.04**

- 主导 AI 智能服务平台建设，对接 Dify 私有平台，集成 Agent、Workflow 与 ChatFlow 能力并提供标准 MCP 调用 API。
- 设计基于 LLM 的智能客户匹配工作流，通过规则库与大模型结合，实现客户名称自动分类。
- 主导客服平台 AI 化改造，构建 Python Agent 中台，基于 LangGraph 编排多 Agent 完成意图识别与协作。
- 构建 RAG 检索与分层记忆系统，基于历史工单向量化存储实现语义问答。
- 基于槽位填充对接工单 API 与 OA 办公软件 WM，实现咨询工单创建、分配和处理闭环。
- 实现基于 SSE 的流式响应，加入指数退避重试与异步消息持久化，优化 AI 对话接口的实时交互体验。
- 负责 CRM 对外服务安全性改造，搭建 Gateway 网关与 OAuth2.0 鉴权，覆盖 IP 白名单、路由鉴权和访问阈值控制。
- 负责代销组件数据上报系统，基于策略模式支持 16+ 家交易所、30+ 种 Excel 报告自动化生成。

### 华住集团 - 企业商旅部 - Java 开发工程师

**2022.10 - 2022.12**

参与企业商旅系统服务端开发，负责业务服务的工程实现与协作交付。

### 顺网科技 - Java 开发工程师

**2019.11 - 2022.06**

- 负责云电脑服务端微服务架构设计，覆盖串流调度、商品订单、运营活动、微信服务等核心模块。
- 搭建基于 Netty 长连接与 RocketMQ 的多路串流服务，支持多人游戏互动体验。
- 主导云手游及炮炮加速器服务端框架搭建，对接 ARM 云算力平台与游戏加速节点服务。

### 兰州乐智教育 - Java 开发工程师

**2018.07 - 2019.08**

负责教育产品服务端开发，包括招生预报名微信小程序及四川凉山州学前学普项目。

## 代表性项目案例

以下案例基于公开职业经历整理，重点展示问题背景、个人职责、技术方案和可验证成果。

| 项目 | 技术焦点 | 项目记录 | 文档 |
| --- | --- | --- | --- |
| 企业智能客服 Agent 平台 | LangGraph、RAG、Milvus、分层记忆、工具调用 | 咨询工单闭环处理 | [查看案例](./portfolio/enterprise-customer-service-agent.md) |
| 智能服务平台 Dify 集成与 MCP 服务 | Dify、SSE、MCP、Spring WebFlux | 流式响应与异步消息持久化 | [查看案例](./portfolio/dify-mcp-platform.md) |
| CRM 代销报表 | 策略模式、PowerJob、EasyExcel | 新增交易所开发周期缩短 70%，报告生成时间缩短 30% | [查看案例](./portfolio/crm-agency-reporting.md) |
| CRM 对外服务安全网关 | Spring Cloud Gateway、OAuth2.0、Sentinel | 多层安全防护与熔断降级 | [查看案例](./portfolio/crm-security-gateway.md) |
| 云电脑 / Netty 微服务 | Spring Cloud Alibaba、Netty、RocketMQ | 多路串流、房间互动、云算力接入 | [查看案例](./portfolio/cloud-pc-netty-services.md) |

## 技术影响力与学习方向

### 当前技术输出

我通过个人学习知识库整理 AI 应用开发、Agent 架构、RAG、MCP、工作流编排、后端工程与部署实践，目标是把项目中遇到的设计取舍、接口组织、状态管理、检索质量和可靠性问题沉淀为可复用的工程笔记。

网站既是个人学习记录，也是对外展示窗口。内容会优先写清楚“为什么这样设计”“在什么条件下适用”“生产环境还要补什么”，而不是只罗列框架名称。

### 下一步学习方向

- 深化 LangGraph 状态图、动态路由、多 Agent 交接和失败恢复的设计模式。
- 完善 RAG 的数据清洗、召回、重排、引用、评测和知识更新链路。
- 研究 MCP 工具服务的权限边界、参数校验、审计、幂等和版本演进。
- 建立 AI 应用离线评测与在线反馈闭环，关注准确率、拒答、延迟、成本和用户满意度。
- 继续探索 Ollama、vLLM、LoRA 的部署与调优，以及 Java + Python 混合系统的集成方式。
- 用 Claude Code、Trae、GitHub Copilot 提升设计、编码、测试和文档协作效率。

## 联系入口

欢迎交流 AI 应用开发、Agent 架构、RAG、MCP、Java / Python 后端工程和知识库建设。

- 个人网站：[https://dumas-dz.github.io](https://dumas-dz.github.io)
- GitHub：[dumas-dz](https://github.com/dumas-dz)
- 联系渠道：优先通过 [GitHub](https://github.com/dumas-dz) 联系

::: tip 公开信息说明
本页面只公开展示职业能力、工作经历和项目案例，不包含电话号码、邮箱、住址、家庭信息或其他个人敏感信息。
:::
