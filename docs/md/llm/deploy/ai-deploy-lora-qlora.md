---
title: LoRA/QLoRA 微调交付
category:
  - LLM
  - AI 部署
tag:
  - LoRA
  - QLoRA
  - 微调
  - 模型交付
description: 从任务判断、适配器训练到合并、量化、评测和生产发布的企业级 LoRA 交付流程。
order: 2
outline: [2, 3]
---

# LoRA/QLoRA 微调交付

## 学习目标

- 判断问题应通过提示、RAG、工具还是微调解决。
- 理解 LoRA/QLoRA 的能力边界、显存收益和交付形态。
- 将适配器、基座、Tokenizer、模型卡、评测和回滚作为整体发布。
- 控制微调数据授权、偏差、灾难性遗忘和模型供应链风险。

本页关注生产交付决策；训练数据生成、参数实验和训练工具细节参见[模型训练与微调](../model-training/README.md)，避免重复维护两套流程。

## 适用场景

适合稳定、高价值、大量重复的任务格式或风格适配，例如固定领域分类、结构化抽取、内部写作规范、工具调用格式和特定领域表达。

优先不微调：

- 实时事实、政策和产品信息：先使用 RAG 或业务 API。
- 权限、流程和不可逆操作：由代码和工具策略决定。
- 只有少量样本且规则/Prompt 可解决。
- 任务目标持续变化，频繁重训成本高于提示维护。

## 核心概念

| 方式 | 更新参数 | 典型收益 | 主要代价 |
| --- | --- | --- | --- |
| Prompt/RAG | 无模型参数 | 快速迭代、知识可更新 | 上下文成本、复杂任务不稳定 |
| LoRA | 低秩适配器 | 显存低、任务风格/格式稳定 | 依赖基座，需数据和回归 |
| QLoRA | 量化基座上训练 LoRA | 单卡/低显存可训练 | 量化误差、部署需验证 |
| 全参微调 | 全部参数 | 理论上限高 | 成本高、数据与基础设施要求高 |

### LoRA 交付包

```text
model-release/
├── model-card.yaml
├── adapter/
│   ├── adapter_model.safetensors
│   └── adapter_config.json
├── tokenizer/
├── evidence/
│   ├── data-manifest.yaml
│   ├── evaluation-report.json
│   ├── safety-report.json
│   └── license.txt
├── deployment/
│   ├── serving-config.yaml
│   └── rollback.yaml
└── checksums.txt
```

基座模型、适配器、Tokenizer、推理配置和量化版本必须兼容并写入清单。只传一个 `adapter_model.safetensors` 不足以支持生产复现。

## 工程实现

### 交付清单

创建 `release-manifest.yaml`：

```yaml
release_id: customer-style-lora-v3
owner: ai-platform-team
risk_level: L2
base:
  model_id: approved-base-model-v2
  revision: immutable-model-hash
  license: approved-license-reference
adapter:
  method: lora
  target_modules: [q_proj, k_proj, v_proj, o_proj]
  rank: 16
  alpha: 32
  checkpoint_hash: replace-with-sha256
tokenizer:
  revision: matching-base-tokenizer
training_data:
  authorization_ref: data-approval-2026-014
  dataset_version: customer-style-2026-11-01
  sample_count: 12400
  pii_removed: true
evaluation:
  core_pass_rate: 0.96
  safety_pass_rate: 1.0
  human_review_count: 300
  baseline_release: customer-style-lora-v2
serving:
  engine: vllm
  precision: approved-deployment-precision
  max_context: 8192
  model_alias: customer-style-v3
rollback:
  alias_target: customer-style-v2
approvals:
  data_owner: approved-reference
  model_owner: approved-reference
  security_review: approved-reference
```

### 发布验证脚本

创建 `verify_release.py`：

```python
import hashlib
import json
import sys
from pathlib import Path

import yaml

REQUIRED_TOP_LEVEL = {
    "release_id",
    "base",
    "adapter",
    "tokenizer",
    "training_data",
    "evaluation",
    "serving",
    "rollback",
    "approvals",
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify(root: Path) -> list[str]:
    errors = []
    manifest_path = root / "release-manifest.yaml"
    if not manifest_path.exists():
        return ["release-manifest.yaml missing"]

    manifest = yaml.safe_load(manifest_path.read_text(encoding="utf-8"))
    missing = REQUIRED_TOP_LEVEL - set(manifest)
    if missing:
        errors.append(f"missing fields: {', '.join(sorted(missing))}")

    if manifest.get("evaluation", {}).get("safety_pass_rate", 0) < 1.0:
        errors.append("safety gate not passed")

    adapter = root / "adapter" / "adapter_model.safetensors"
    if not adapter.exists():
        errors.append("adapter checkpoint missing")
    else:
        expected = manifest.get("adapter", {}).get("checkpoint_hash")
        actual = sha256(adapter)
        if expected in (None, "replace-with-sha256"):
            errors.append("adapter checkpoint hash is not recorded")
        elif expected != actual:
            errors.append("adapter checkpoint hash mismatch")

    if not (root / "evaluation" / "evaluation-report.json").exists():
        errors.append("evaluation report missing")
    return errors


def main() -> int:
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    errors = verify(root)
    print(json.dumps({"approved": not errors, "errors": errors}, ensure_ascii=False, indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
```

安装并运行：

```bash
python -m venv .venv
source .venv/bin/activate
pip install "PyYAML>=6,<7"
python verify_release.py /path/to/model-release
```

## 微调实施流程

1. **问题诊断**：记录 Prompt/RAG 基线错误，判断是知识、推理、格式还是风格问题。
2. **数据授权**：确认来源、用途、个人信息、供应商条款和保留期。
3. **样本构建**：输入输出、系统约束、负样本、工具格式、难度分层和去重。
4. **建立基线**：未微调模型、提示优化模型、RAG 版本同时评测。
5. **训练实验**：LoRA/QLoRA 小规模实验，记录基座、数据、超参和随机种子。
6. **模型评测**：核心任务、长尾、安全、幻觉、格式、性能、遗忘和偏差。
7. **人工复核**：高风险样本、边界样本、典型用户和业务专家。
8. **部署验证**：量化/合并后重新评测，压测显存、吞吐、首 Token 和输出稳定性。
9. **灰度发布**：模型别名、金丝雀、在线护栏和回滚。
10. **持续运营**：漂移监控、失败回流、数据合规和定期重评。

## 生产实践

- LoRA 适配器可以在服务端动态加载或合并发布；动态加载节省存储，但必须防止多任务适配器互相污染。
- QLoRA 用于训练不等于生产必须使用同一量化；部署精度需重新评测。
- 基座升级不是简单替换：Tokenizer、特殊 Token、Chat Template、模型架构和适配器均可能不兼容。
- 测试“模型不会什么”与“模型会什么”同样重要，避免微调把外部事实硬编码进模型。
- 数据中的版本、政策和价格容易过时；此类内容优先放 RAG/业务系统。
- 训练样本保留来源和哈希，支持删除请求、授权变更和数据血缘追踪。
- 模型卡必须写明适用范围、失败模式、评测数据和责任团队。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 训练指标好线上差 | 样本分布/格式不一致 | 回流真实输入，端到端评测 |
| 小模型格式变好但事实变差 | 训练数据事实陈旧或过拟合 | 分离知识与风格，RAG 更新 |
| 适配器加载失败 | 基座/Tokenizer/架构不匹配 | 固定基座哈希和兼容矩阵 |
| QLoRA 导出后退化 | 量化误差、合并或模板错误 | 原精度对比、输出校验 |
| 安全能力下降 | 微调数据缺少拒绝/风险样本 | 安全集回归和偏好样本 |
| 无法回滚 | 只发布合并模型 | 保留基座、适配器、配置和别名 |

面试追问：LoRA 为什么节省显存？  
它冻结基座参数，只训练低秩分解的增量矩阵和少量相关参数，因此优化器状态和梯度显存显著降低；但推理时仍需加载基座。

## 总结与延伸

LoRA/QLoRA 是训练与交付手段，不是解决知识时效、权限和业务一致性的替代方案。部署兼容性参见[推理平台与私有化部署](./ai-deploy-inference-platform.md)，版本风险参见[模型安全与风险治理](../security/ai-security-model-governance.md)。
