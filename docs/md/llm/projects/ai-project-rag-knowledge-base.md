---
title: RAG 企业知识库项目案例
category:
  - LLM
  - 项目案例
tag:
  - RAG
  - 知识库
  - Milvus
  - 权限
description: 构建可引用、可更新、可评测、可治理的企业 RAG 知识库项目。
order: 3
outline: [2, 3]
---

# RAG 企业知识库项目案例

> 案例类型：项目案例模板  
> 可裁剪技术：Python、FastAPI、Milvus、Elasticsearch、Redis、对象存储、Embedding、Reranker

## 学习目标

- 从知识源、解析、切块、索引到检索生成构建完整 RAG 链路。
- 在查询前实施 ACL、租户和来源过滤，在回答中提供可验证引用。
- 建立文档版本、增量更新、删除传播、评测和索引回滚。
- 通过 Recall、引用支持、忠实度和业务成功率定位并优化质量。

## 业务背景

企业知识分散在制度、产品、操作手册、工单、FAQ、会议纪要和数据库中。传统搜索依赖关键词，LLM 又缺少可验证知识。RAG 项目应解决“找得到、看得懂、答得准、引用对、权限对、更新及时”六个问题。

### 项目定义

```yaml
project:
  name: 企业 RAG 知识库
  users: [员工, 客服, 运营, 管理人员]
  problem: 知识分散、搜索慢、口径不一、引用和权限不可控
  target:
    primary: 知识问题解决率与检索时间改善
    guardrails: [跨权限泄露, 错误引用, 过期答案, P95, 单次成本]
  non_goals: [替代源系统主数据, 无人工审批的政策解释, 实时交易决策]
```

## 适用场景

- 产品、制度、流程、运维、客服、销售和项目知识问答。
- 需要基于原文引用、按部门/角色过滤、按知识版本回答。
- 文档更新频繁，需要增量索引、失效和删除传播。
- 需要与 Agent、Dify 或业务系统集成。

不适用：答案必须实时来自交易数据库、知识内容极少且规则明确、没有文档授权或无法定义访问范围。

## 架构设计

```text
知识源（文档/网页/工单/数据库导出）
  -> 连接器与采集队列
  -> 解析/OCR/清洗/去重/敏感识别
  -> 文档标准化与版本
  -> 切块/父子块/表格处理
  -> Embedding
  -> Milvus 向量索引 + 元数据/ACL
  -> Elasticsearch 关键词/BM25（可选混合检索）
  -> 查询理解/改写/过滤
  -> 召回 -> 粗排 -> 重排 -> 证据压缩
  -> 生成模型（答案 + 引用 + 拒答）
  -> 评测/监控/审计/反馈
```

### 核心数据对象

| 对象 | 关键字段 |
| --- | --- |
| Source | 来源 ID、系统、授权、同步策略、责任人 |
| Document | 文档 ID、标题、版本、状态、敏感级别、ACL、哈希 |
| Chunk | Chunk ID、内容、页码/段落、父子关系、语言、过期时间 |
| Index | 索引 ID、Embedding 模型、维度、构建时间、配置哈希 |
| Answer | Answer ID、引用 Chunk、模型/Prompt/索引版本、评测结果 |
| Feedback | 用户、评分、问题类型、修复状态、样本授权 |

## 工程实现

### 知识流水线配置

创建 `ingestion.yaml`：

```yaml
pipeline_id: enterprise-kb-v1
sources:
  - id: policy-docs
    type: object_storage
    bucket: approved-knowledge
    prefix: policies/
    sync: incremental
    acl_source: document-acl-service
    sensitivity: internal
  - id: resolved-tickets
    type: database_export
    schedule: "0 2 * * *"
    pii_policy: mask_and_hash
    max_age_days: 730
processing:
  parsers: [pdf, docx, html, markdown]
  ocr:
    enabled: true
    languages: [zh, en]
  normalize:
    remove_headers: true
    detect_duplicates: true
    preserve_tables: true
  chunking:
    strategy: recursive_section
    target_tokens: 500
    max_tokens: 900
    overlap_tokens: 80
    parent_tokens: 1800
  embedding:
    model_alias: approved-embedding-v2
    dimensions: 1024
    batch_size: 64
index:
  type: milvus
  collection: enterprise_chunks
  metric: cosine
  partition_key: tenant_id
  metadata_filter: [tenant_id, department, document_acl, language, valid_until]
quality:
  require_source_id: true
  require_acl: true
  require_hash: true
  reject_unlicensed: true
  sample_review_rate: 0.05
```

### 权限与过滤数据

创建 `acl_schema.sql`：

```sql
CREATE TABLE document_acl (
  document_id VARCHAR(64) NOT NULL,
  tenant_id VARCHAR(64) NOT NULL,
  principal_type VARCHAR(16) NOT NULL,
  principal_id VARCHAR(64) NOT NULL,
  permission VARCHAR(16) NOT NULL,
  policy_version INTEGER NOT NULL,
  PRIMARY KEY (document_id, tenant_id, principal_type, principal_id, permission)
);

CREATE TABLE document_version (
  document_id VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  source_id VARCHAR(64) NOT NULL,
  content_hash VARCHAR(64) NOT NULL,
  sensitivity VARCHAR(16) NOT NULL,
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP,
  index_status VARCHAR(16) NOT NULL,
  PRIMARY KEY (document_id, version)
);
```

向量检索时必须先限定 `tenant_id`、可见文档集合、语言、有效时间和数据级别。不要先召回全部向量再由模型判断权限。

## 检索与生成

### 查询流程

```text
用户问题
 -> 身份/租户/权限上下文
 -> 问题分类（事实、总结、比较、流程、实时）
 -> 查询改写（口语、指代、同义词）
 -> 混合召回（向量 + 关键词 + 元数据）
 -> 重排
 -> 证据充分性判断
 -> 回答、引用或追问/拒答
```

### 证据策略

- 单文档事实优先精确段落；跨文档综合明确来源。
- 表格保留行列语义，引用到表/页/段落，不只保存纯文本。
- 冲突文档按生效时间、来源优先级、版本和审批状态处理。
- 检索不足时不编造；返回缺失信息或转人工。
- 引用必须支持对应句子，不能只给“相关文档列表”。
- 生成上下文使用结构化来源标签，外部内容保持不可信数据边界。

## 实施计划

| 里程碑 | 工作内容 | 出口条件 |
| --- | --- | --- |
| M1 知识盘点 | 来源、授权、质量、责任人、优先级 | Top 知识域和风险明确 |
| M2 数据管道 | 解析、清洗、切块、元数据、ACL | 样本文档人工核验通过 |
| M3 检索基线 | Embedding、混合召回、重排 | Recall/MRR 达到初始目标 |
| M4 生成问答 | 引用、拒答、结构化输出、缓存 | 事实性和引用支持达标 |
| M5 更新治理 | 增量、删除、版本、索引回滚 | 更新和删除 SLA 演练 |
| M6 生产化 | 权限、安全、压测、监控、灰度 | 全部门禁通过 |
| M7 运营 | 反馈、Bad Case、知识缺口、成本 | 持续指标与复盘机制 |

## 评测与验收

### RAG 基准集

- 文档内事实、跨段落、跨文档、表格、列表和多跳问题。
- 同义、口语、错别字、多轮指代、歧义和缺信息问题。
- 不同 ACL 用户对同一问题的可见性差异。
- 文档冲突、过期、撤销、删除和版本切换。
- OCR、扫描件、复杂排版、长文档和重复文档。
- 注入文档、恶意链接、诱导外泄和越权引用。

### 验收指标

| 层次 | 指标 |
| --- | --- |
| 数据 | 解析成功率、OCR 抽检、元数据准确率、重复率 |
| 检索 | Recall@K、MRR、nDCG、上下文冗余 |
| 生成 | 正确性、完整性、忠实度、引用命中、拒答正确率 |
| 权限 | 跨租户/跨角色泄露零发生、ACL 过滤正确率 |
| 新鲜度 | 更新可见时延、删除传播时延、过期答案率 |
| 性能 | 索引吞吐、查询 P95、首 Token、并发、缓存命中 |
| 成本 | Embedding/存储/检索/生成成本、每成功问题成本 |

## 生产实践

- 文档和 Chunk 保留不可变 ID 与版本，更新时创建新版本并原子切换。
- 每个回答记录 `document_version + chunk_id + index_version`，支持事后复核。
- 删除请求先停止检索，再删除向量、缓存、摘要、评测副本和对象存储；备份按保留政策处理。
- Embedding 模型升级必须重建索引并双写/影子查询，不能只替换模型名。
- 长文档使用父子块或摘要 + 细节两级检索，避免固定小切块丢失上下文。
- 文档质量先于算法优化：重复、错误、过期和权限不清会决定系统上限。
- 对知识缺口建立“用户问题 -> 搜索失败 -> 知识创建/修订”闭环。

## 常见坑

| 坑 | 后果 | 避免方法 |
| --- | --- | --- |
| 一味增大 Top K | 噪声、时延、成本、事实冲突 | 重排、证据充分性、动态 K |
| 固定长度机械切块 | 表格和章节语义断裂 | 结构感知、父子块 |
| 先查全库再过滤权限 | 泄露候选和性能问题 | 查询前 ACL 过滤 |
| 只保存最终答案 | 无法定位和重放 | 保存检索、上下文、引用、版本 |
| 文档更新后缓存不失效 | 过期答案 | 知识版本纳入缓存键和失效 |
| 用相似度代替引用正确性 | 错误引用 | 句子级支持、人工抽检 |
| 把实时数据塞入知识库 | 数据陈旧 | 工具/API 查询实时状态 |
| 无删除传播 | 合规与错误回答 | 数据清单、删除任务、证明 |

## 总结与延伸

RAG 的质量上限来自知识治理，稳定性来自数据版本和权限，效果来自检索/生成分层评测。评测细节参考[RAG 与 Agent 评测](../evaluation/ai-evaluation-rag-agent.md)，隐私与 ACL 参考[权限、隐私与审计](../security/ai-security-authz-privacy-audit.md)。
