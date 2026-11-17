---
title: RPC 与服务通信
category:
  - 框架
  - RPC
tag:
  - Dubbo
  - gRPC
  - 服务治理
description: Dubbo 与 gRPC 的契约、传输、超时和治理导航。
order: 30
outline: [2, 3]
---

# RPC 与服务通信

RPC 让远程调用拥有接口形态，但网络分区、超时、版本和部分成功不能被语法隐藏。契约、预算和错误语义是服务可靠性的公共基础设施。

## 文档

| 文档 | 契约 | 传输/生态 | 重点 |
| --- | --- | --- | --- |
| [Dubbo 详解](./framework-rpc-dubbo-overview.md) | Java 接口、Triple | Dubbo 服务治理 | 注册、容错、灰度、治理 |
| [gRPC 详解](./framework-rpc-grpc-overview.md) | Protobuf IDL | HTTP/2、跨语言 | 流式、deadline、状态码 |

## 选型建议

- Java 内部服务需要丰富治理、已有 Dubbo 体系时优先 Dubbo/Triple。
- 跨语言、强契约、流式或服务网格接入优先 gRPC。
- 对外第三方 API 优先 HTTP/JSON，必要时通过网关连接内部 RPC。

## 完成标准

- 接口有版本、字段兼容策略和契约测试。
- 全链路 timeout、重试、熔断、限流和线程池边界明确。
- 写操作默认不重试，或有业务幂等键和补偿。
- traceId 能串联入口、多个下游和消息/数据库副作用。
- 发布具备灰度、回滚、健康检查和优雅下线。

关联阅读：[微服务治理](../../arch/microservice/arch-microservice-overview.md)、[API 设计](../../dev-spec/dev-spec-api-design.md)。

状态：已完善。
