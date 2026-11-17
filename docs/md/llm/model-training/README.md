---
title: 大模型训练与微调
category:
  - LLM
  - 模型训练
tag:
  - 数据集
  - 微调
  - 评测
description: 从数据工程、训练参数、微调工具到评测、OCR、本地部署和 API 调用的训练学习入口。
order: 30
outline: [2, 3]
---

# 大模型训练与微调

大多数应用开发者不需要从零预训练模型，但需要理解数据、参数、微调、评测和部署之间的权衡。学习目标是能提出可验证的训练假设，并判断何时使用提示、RAG、微调或继续训练。

## 学习顺序

1. [为什么要训练](./ai-llm-training-why.md)：比较提示、RAG、微调和预训练。
2. [训练全流程](./ai-llm-training-pipeline.md)：数据、训练、评测和发布。
3. [数据集文件结构](./ai-llm-training-file-structure.md)与[数据集生成](./ai-llm-training-dataset-gen.md)。
4. [Easy Dataset](./ai-llm-training-easy-dataset.md)与[数据标注/OCR](./ai-llm-training-ocr.md)。
5. [训练参数](./ai-llm-training-params.md)、[微调](./ai-llm-training-tuning.md)与[LlamaFactory](./ai-llm-training-llamafactory.md)。
6. [评测](./ai-llm-training-evaluation.md)、[本地部署](./ai-llm-training-local-deploy.md)和 [API 调用](./ai-llm-training-api-call.md)。

## 训练前检查表

- [ ] 业务目标可由量化指标和人工样例验证。
- [ ] 训练数据有来源、许可、去重、脱敏和切分策略。
- [ ] 基线包含提示/RAG/现有模型，不直接假设必须微调。
- [ ] 评估集与训练集隔离，覆盖主任务、边界和安全场景。
- [ ] 记录模型、Tokenizer、超参数、数据版本、硬件和随机种子。
- [ ] 发布前验证回归、延迟、吞吐、资源、成本和回滚。

状态：持续更新。训练工具和模型 API 版本变化快，示例需锁定版本后再执行。
