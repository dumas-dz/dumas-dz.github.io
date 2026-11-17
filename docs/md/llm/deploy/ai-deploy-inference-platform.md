---
title: 推理平台与私有化部署
category:
  - LLM
  - AI 部署
tag:
  - Dify
  - Ollama
  - vLLM
  - 私有化
description: 设计 Dify、Ollama、vLLM 和 AI 应用组成的私有化推理平台。
order: 1
outline: [2, 3]
---

# 推理平台与私有化部署

## 学习目标

- 划分 Dify、应用服务、推理引擎、数据组件和网关的职责。
- 根据开发、内网办公、生产高吞吐场景选择 Ollama 或 vLLM。
- 为模型 API、管理台、数据面和运维面设计网络与身份边界。
- 形成环境清单、健康检查、容量基线、备份和回滚方案。

## 适用场景

适用于不允许数据出域、需要统一 Agent/Workflow、需要多团队共享推理资源，或需要对模型、知识、工具做企业治理的场景。

## 核心概念

### 组件职责

| 组件 | 负责 | 不负责 |
| --- | --- | --- |
| Dify | Agent/Workflow/ChatFlow 编排、知识库、应用配置 | 业务事务一致性、底层 GPU 调度 |
| AI 应用服务 | 业务 API、幂等、审计、工具鉴权、状态机 | 模型内部推理 |
| Ollama | 本地开发、轻量单机推理、模型拉取 | 大规模生产吞吐与复杂调度 |
| vLLM | 高并发、连续批处理、PagedAttention、OpenAI API | 业务工作流与权限 |
| Milvus | 向量检索和过滤 | 文档 ACL 最终业务授权 |
| Redis/MySQL | 缓存、会话、任务、审计索引 | 大文件和向量原始数据 |
| 对象存储 | 文档、输出、模型工件 | 高频小状态 |

### 环境分层

| 环境 | 推理选择 | 关键要求 |
| --- | --- | --- |
| 本地开发 | Ollama / 小模型 | 快速启动、可离线、固定版本 |
| 测试 | Ollama 或共享 vLLM | 接口兼容、可重置、样本固定 |
| 预生产 | 与生产同构 vLLM | 真实并发、容量和故障演练 |
| 生产 | vLLM 集群 / 合规托管 API | 高可用、隔离、配额、成本监控 |

### Dify 私有化边界

- 使用 Dify 官方部署包或受控发行版，不要复制其内部配置到知识库文档。
- 管理台、Worker、Plugin、外部模型供应商和业务 API 分别配置网络出口。
- 将应用发布为稳定 API，由业务网关执行认证、租户、限流和审计。
- Dify 中的 Prompt、工具和知识库同样需要版本、审批和回归，不应允许任意编辑直上生产。
- 敏感数据使用独立密钥和数据源；测试环境禁止连接生产数据库和生产向量空间。

## 工程实现

### OpenAI-Compatible 推理入口配置

创建 `inference-config.yaml`：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ai-inference-routing
data:
  routing.yaml: |
    defaults:
      request_timeout_seconds: 90
      max_output_tokens: 2048
      queue_timeout_seconds: 20
    providers:
      local-vllm:
        base_url: http://vllm-gateway.ai-system.svc:8000/v1
        health_path: /health
        models:
          general-large:
            model: enterprise-general-large
            max_context: 32768
            concurrency: 64
          general-small:
            model: enterprise-general-small
            max_context: 8192
            concurrency: 128
      local-ollama:
        base_url: http://ollama.dev.svc:11434/v1
        health_path: /api/tags
        models:
          dev-chat:
            model: qwen2.5:7b
            max_context: 8192
            concurrency: 4
    routes:
      chat:
        primary: local-vllm/general-large
        fallback: local-vllm/general-small
      classify:
        primary: local-vllm/general-small
```

应用只读取 `base_url`、模型别名和超时，不允许业务代码直接绑定具体模型文件。API Key 由 Secret Manager 注入，不写入 ConfigMap。

### 可运行的模型健康检查

创建 `healthcheck.py`：

```python
import argparse
import json
import os
import sys
import time

import httpx


def check(client: httpx.Client, name: str, base_url: str) -> dict:
    started = time.perf_counter()
    try:
        response = client.get(f"{base_url.rstrip('/')}/models")
        response.raise_for_status()
        models = [
            item.get("id", "")
            for item in response.json().get("data", [])
        ]
        return {
            "name": name,
            "ok": True,
            "latency_ms": round((time.perf_counter() - started) * 1000, 2),
            "models": models,
        }
    except Exception as exc:
        return {
            "name": name,
            "ok": False,
            "latency_ms": round((time.perf_counter() - started) * 1000, 2),
            "error": type(exc).__name__,
        }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("base_url", nargs="+")
    args = parser.parse_args()
    headers = {}
    token = os.getenv("MODEL_API_KEY")
    if token:
        headers["Authorization"] = f"Bearer {token}"

    with httpx.Client(timeout=5.0, headers=headers) as client:
        results = [
            check(client, f"provider-{index}", base_url)
            for index, base_url in enumerate(args.base_url, start=1)
        ]
    print(json.dumps(results, ensure_ascii=False, indent=2))
    return 0 if all(item["ok"] for item in results) else 1


if __name__ == "__main__":
    sys.exit(main())
```

安装并运行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "httpx>=0.27,<1"
MODEL_API_KEY='from-secret-manager' python healthcheck.py \
  http://127.0.0.1:8000/v1 \
  http://127.0.0.1:11434/v1
```

## Ollama 与 vLLM

| 维度 | Ollama | vLLM |
| --- | --- | --- |
| 优势 | 安装简单、本地模型管理、适合开发 | 高吞吐、连续批处理、生产特性丰富 |
| 部署 | 单机 Docker/系统服务 | GPU 容器/集群，配置显存和调度 |
| API | 原生 API + OpenAI 兼容层 | OpenAI-Compatible |
| 适用 | PoC、本地工具、低并发 | 企业共享推理、多并发、长上下文 |
| 注意 | 生产容量、隔离和调度能力有限 | 需要 GPU 运维、显存和版本管理 |

生产环境将 vLLM 置于 AI Gateway 后方。模型启动参数（上下文长度、GPU 利用率、张量并行、最大序列数）需要按显卡、模型和压测结果确定，不能直接照抄参数。

## 私有化安全边界

- 管理面、数据面、推理面、运维面使用独立网络策略和身份。
- 数据库、向量库和对象存储启用 TLS、私网、最小账号和静态加密。
- 管理员进入生产需要堡垒机/短期凭证和审计，不在本地保存长期密钥。
- 出站网络使用域名/IP 允许列表；插件和 MCP Server 不得默认访问全内网。
- 备份包括 Dify 数据库、应用数据库、向量元数据、对象存储和配置；定期做恢复演练。
- 模型文件记录来源、哈希、许可证和扫描结果，模型仓库按环境隔离。

## 生产实践

### 容量基线

压测至少覆盖：

- 正常短上下文请求、长上下文请求、最大输出请求。
- 稳态并发、突发并发、重试叠加、批量任务与交互请求混合。
- 节点重启、模型加载、下游 429、数据库慢查询、向量库故障。
- SSE 客户端断开、连接代理超时、缓存冷热切换。
- Dify Workflow 多节点、工具调用失败和循环保护。

### 发布与回滚

1. 模型文件先进入只读仓库，记录哈希和模型卡。
2. vLLM 使用新模型别名启动，健康检查和小流量验证。
3. 应用路由从旧别名切换到新别名，保留旧服务。
4. 观察错误率、时延、Token、GPU、质量评测和成本。
5. 异常时切回旧别名，不需要重建业务应用。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| Dify 调用慢但 GPU 空闲 | 网络、编排节点、外部工具或队列 | Trace 分解节点、并发和连接池 |
| Ollama 响应波动 | 单机并发、模型冷启动 | 限制并发、预热、生产改 vLLM |
| vLLM 启动 OOM | 上下文/并发/KV Cache 设置过高 | 降低上下文和并发，调整显存比例 |
| 管理台可访问生产数据 | 环境/账号隔离不足 | 网络策略、独立凭据、脱敏环境 |
| 回滚后知识仍错误 | 只回滚模型没回滚知识库 | 版本组合清单、联动回滚 |
| 健康检查正常但业务失败 | 只检测模型进程 | 增加真实推理、依赖和工具探测 |

面试追问：为什么不能把 Dify 当成完整业务系统？  
Dify 擅长编排和应用配置，但事务一致性、企业身份、细粒度权限、业务副作用和审计仍需业务服务与数据库保证。

## 总结与延伸

私有化平台要同时管理模型服务、编排平台、数据、安全和运维。模型如何选参见[模型选型与部署决策](./ai-deploy-model-selection.md)，容量阈值参见[并发、容量与成本治理](./ai-deploy-capacity-cost.md)。
