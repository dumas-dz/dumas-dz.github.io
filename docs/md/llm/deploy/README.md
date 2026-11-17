---
title: 模型与应用部署
category:
  - LLM
  - AI 部署
tag:
  - Dify
  - Ollama
  - vLLM
  - 成本治理
description: 企业级 AI 应用的私有化部署、模型选型、微调交付、并发容量与成本治理。
order: 1
outline: [2, 3]
---

# 模型与应用部署

> 内容状态：已完善  
> 最后审阅：2026-11-16  
> 适用范围：Dify 私有化、Ollama、vLLM、LoRA/QLoRA、OpenAI-Compatible API、Docker/Kubernetes；具体版本以部署清单为准。

部署目标不仅是“服务能启动”，而是模型能力可被安全、稳定、经济地调用。本领域覆盖推理平台、微调交付、模型选型和容量成本四条主线。

## 学习目标

- 搭建 Dify、Ollama、vLLM 组成的私有 AI 平台，并明确各组件边界。
- 比较基座、量化、LoRA/QLoRA 模型的效果、显存、吞吐和维护成本。
- 根据任务、数据、上下文、延迟和合规约束选择模型。
- 计算并发、队列、GPU、Token 和单位业务成本，设计扩容与降级。
- 形成可回滚的模型、配置、知识库和应用版本发布清单。

## 推荐学习顺序

1. [推理平台与私有化部署](./ai-deploy-inference-platform.md)
2. [LoRA/QLoRA 微调交付](./ai-deploy-lora-qlora.md)
3. [模型选型与部署决策](./ai-deploy-model-selection.md)
4. [并发、容量与成本治理](./ai-deploy-capacity-cost.md)

## 知识地图

| 主题 | 关键决策 | 典型产出 |
| --- | --- | --- |
| 推理平台 | 自建/托管、同步/批处理、网络边界 | 架构图、部署清单、SLO |
| 微调交付 | 全参/LoRA/QLoRA、合并/适配器 | 模型包、模型卡、回归报告 |
| 模型选型 | 质量、上下文、时延、合规、成本 | 评分矩阵、PoC、淘汰理由 |
| 容量成本 | 并发、批大小、KV Cache、配额 | 容量模型、压测、预算告警 |

## 部署分层

```text
用户/业务系统
  -> AI Gateway（认证、限流、路由、成本标签）
     -> Dify（Agent/Workflow/ChatFlow 编排）
     -> AI 应用服务（FastAPI/Spring）
        -> OpenAI-Compatible 推理 API
           -> vLLM（高吞吐服务）
           -> Ollama（本地开发/轻量服务）
        -> Milvus/Redis/MySQL/对象存储
  -> 监控、审计、评测、配置中心、Secret Manager
```

## 发布前检查表

- [ ] 模型、Dify、推理引擎、应用、Prompt、知识库和工具都有稳定版本。
- [ ] 模型许可证、数据处理、部署区域和用户条款已确认。
- [ ] API、数据库、向量库、管理台不直接暴露公网，入口经过网关认证。
- [ ] 模型健康、首 Token、Token 速率、队列、GPU、KV Cache、错误率均有监控。
- [ ] 压测覆盖正常、长上下文、突发、下游超时和节点故障。
- [ ] 设置租户/用户/路由的并发、Token、成本和速率配额。
- [ ] 有容量余量、排队上限、超时预算、降级模型和人工兜底。
- [ ] 发布可按模型别名、配置版本和应用版本一键回滚。
- [ ] 通过[安全门禁](../security/README.md)和[回归评测](../evaluation/ai-evaluation-regression-suite.md)。

## 相关领域

- 服务可靠性与监控：[AI 工程化](../engineering/README.md)
- 质量基线和发布证据：[AI 评测](../evaluation/README.md)
- 私有化边界和模型治理：[AI 安全](../security/README.md)
- 项目交付与验收：[项目案例](../projects/README.md)
