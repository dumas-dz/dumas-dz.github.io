---
title: 引用、忠实度与 RAG 评测
category:
  - LLM
  - RAG
tag:
  - 引用
  - RAG 评测
  - 忠实度
description: 让答案可追溯，并用检索、生成和端到端指标持续改进 RAG。
order: 4
outline: [2, 3]
---

# 引用、忠实度与 RAG 评测

## 1. 学习目标

读完后可以设计引用契约，区分检索质量、生成忠实度和任务完成度，并建立离线评测、在线反馈和失败分析闭环。

## 2. 适用场景

适用于企业问答、客服助手、制度解释和任何需要“可审计答案”的 RAG 应用。开放式创意写作不要求逐句引用。

## 3. 核心概念

### 3.1 引用契约

答案中的每个关键结论都应关联证据 ID，证据 ID 反向指向文档版本和位置。输出可以是：

```json
{
  "answer": "付款期限为 30 天。",
  "claims": [
    {"text": "付款期限为 30 天。", "evidence_ids": ["doc-7:v3:page-3"]}
  ],
  "status": "supported"
}
```

`status` 至少区分 `supported`、`partial`、`unknown` 和 `conflict`。无证据时返回 `unknown`，不要生成看似合理的补全。

### 3.2 指标分层

| 层级 | 指标 | 说明 |
| --- | --- | --- |
| 检索 | Recall@K、MRR、nDCG、过滤命中率 | 正确证据是否出现、排序是否靠前 |
| 生成 | 忠实度、引用准确率、答案正确率 | 结论是否由证据支持 |
| 任务 | 人工可采纳率、转人工率、任务完成率 | 用户是否真正解决问题 |
| 运行 | TTFT、P95 延迟、token/任务成本 | 能否稳定上线 |

### 3.3 评测流程

```text
建立问题/证据/标准答案集 → 运行检索 → 记录候选集
→ 生成带引用答案 → 规则校验 + 模型评审 + 人工抽检
→ 按失败类型归因 → 修改文档/切分/召回/Prompt
→ 回归测试 → 灰度上线
```

## 4. 工程实现

下面的示例用标准库计算最基础的 Recall@K，适合 CI 回归：

```python
def recall_at_k(relevant: set[str], retrieved: list[str], k: int) -> float:
    if k <= 0:
        raise ValueError("k must be positive")
    if not relevant:
        return 0.0
    return len(relevant.intersection(retrieved[:k])) / len(relevant)


def citation_accuracy(
    claims: list[dict], valid_evidence_ids: set[str]
) -> float:
    if not claims:
        return 0.0
    valid = sum(
        bool(claim.get("evidence_ids"))
        and set(claim["evidence_ids"]).issubset(valid_evidence_ids)
        for claim in claims
    )
    return valid / len(claims)


if __name__ == "__main__":
    print(recall_at_k({"doc-1"}, ["doc-2", "doc-1", "doc-3"], 2))
    print(citation_accuracy([{"evidence_ids": ["doc-1"]}], {"doc-1"}))
```

指标只反映被定义的维度；人工评审要保留“为什么错误”的标签，例如缺证据、错证据、过期文档和权限泄露。

## 5. 生产实践

- 评测集按意图、难度、文档类型、权限和语言分层，持续加入线上失败样本。
- 规则检查引用 ID 是否存在、是否越权、是否覆盖关键 claim；模型评审只做辅助。
- 线上采集显式反馈和隐式信号时区分“没帮助”和“答案错误”，避免噪声污染。
- 发布前比较基线版本，关注指标的同时检查延迟、成本和拒答率回归。

## 6. 常见问题

- **LLM 评审能替代人工吗？** 不能。它适合规模化初筛和一致性检查，但需要标注协议和人工抽检。
- **引用格式正确就代表忠实吗？** 不代表。证据可能只支持部分内容，还要校验 claim 与证据的语义关系。
- **拒答率升高一定是退步吗？** 不一定。如果事实性提高且无依据问题减少，拒答可能是正确行为。
- **如何评测文档更新？** 用受影响问题集做增量回归，确认旧答案不再被召回且新引用可用。

## 7. 总结与延伸

RAG 质量是数据、检索、生成和评测共同作用的结果。输入质量见[数据摄取与切分](./ai-rag-ingestion-and-chunking.md)，排序质量见[Embedding、召回与重排](./ai-rag-retrieval-and-reranking.md)，稳定执行流水线见 [Workflow](../workflow/ai-workflow-patterns-and-resilience.md)。
