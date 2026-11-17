---
title: Embedding、召回与重排
category:
  - LLM
  - RAG
tag:
  - Embedding
  - 混合检索
  - 重排
description: 组合向量、关键词、过滤和重排，构建可调优的 RAG 检索链路。
order: 3
outline: [2, 3]
---

# Embedding、召回与重排

## 1. 学习目标

读完后可以为查询和文档选择 Embedding 策略，设计混合召回与过滤，并用重排和证据预算控制最终上下文。

## 2. 适用场景

适用于知识问答、相似案例检索、文档推荐和 Agent 的证据获取。结构化查询应优先使用 SQL/API，见 [RAG 定位](./README.md)。

## 3. 核心概念

### 3.1 Embedding

Embedding 把文本映射到向量空间，相似度通常用余弦、点积或内积。查询和文档必须使用同一模型和同一预处理规则。模型升级后要重建索引或维护双索引，不要混用向量。

### 3.2 混合召回

```text
查询归一化/改写
      ├─ 向量召回：语义相似、同义表达
      ├─ 关键词/BM25：型号、编号、精确词
      └─ 元数据过滤：租户、权限、时间、语言
              ↓
        合并去重 → 候选集 K1
              ↓
           重排模型/规则
              ↓
        证据预算 → Top K2
```

向量召回擅长语义，关键词召回擅长精确匹配。只用一种方式会漏掉编号、产品名或同义问题。

### 3.3 召回与重排的职责

| 阶段 | 目标 | 典型规模 | 失败表现 |
| --- | --- | --- | --- |
| 召回 | 尽量不漏正确证据 | 20-100 | 正确文档不在候选集 |
| 重排 | 把正确证据排到前面 | 5-20 | 候选有答案但排序差 |
| 压缩 | 降低 token、保留证据 | 3-8 | 有用上下文被截断 |

## 4. 工程实现

下面的融合函数把向量分数和关键词分数归一化后加权，适合在候选集不大时做可解释基线：

```python
def fuse_scores(
    vector_scores: dict[str, float],
    keyword_scores: dict[str, float],
    vector_weight: float = 0.7,
) -> list[tuple[str, float]]:
    if not 0 <= vector_weight <= 1:
        raise ValueError("vector_weight must be between 0 and 1")
    ids = set(vector_scores) | set(keyword_scores)

    def normalize(values: dict[str, float]) -> dict[str, float]:
        if not values:
            return {item_id: 0.0 for item_id in ids}
        low, high = min(values.values()), max(values.values())
        span = high - low
        return {item_id: (value - low) / span if span else 0.0
                for item_id, value in values.items()}

    vector = normalize(vector_scores)
    keyword = normalize(keyword_scores)
    return sorted(
        ((item_id, vector_weight * vector.get(item_id, 0.0)
          + (1 - vector_weight) * keyword.get(item_id, 0.0)) for item_id in ids),
        key=lambda item: item[1],
        reverse=True,
    )


if __name__ == "__main__":
    print(fuse_scores({"a": 0.9, "b": 0.2}, {"a": 1.0, "b": 0.8}))
```

重排模型的输入应是“问题 + 候选块”，输出是排序分数；不要让重排模型直接生成答案。

## 5. 生产实践

- 为查询改写、召回、重排、过滤和截断分别设置耗时与命中指标。
- 先按租户和权限过滤，再做相似度排序；过滤后结果为空时明确返回“无权限”或“无结果”。
- 对热门查询缓存候选集；Embedding 调用批量、限流并记录模型版本。
- 通过标注问题集调 `K1`、`K2`、融合权重和重排阈值，不要凭感觉调参。

## 6. 常见问题

- **向量相似度高为什么答案不对？** 相似不等于相关；可能检索到背景段落而不是结论段，需要标题、实体和重排。
- **如何处理编号和拼写错误？** 关键词召回、别名词表、规范化和查询改写共同解决。
- **重排越复杂越好吗？** 重排增加延迟和成本；先证明候选集存在正确证据，再优化排序。
- **Embedding 模型如何升级？** 灰度重建、双索引对比和版本化查询，避免新旧向量混库。

## 7. 总结与延伸

检索链路要分别测召回和排序，不能只看最终答案。文档质量入口见[数据摄取与切分](./ai-rag-ingestion-and-chunking.md)，答案引用与忠实度见[引用、忠实度与 RAG 评测](./ai-rag-citation-and-evaluation.md)。
