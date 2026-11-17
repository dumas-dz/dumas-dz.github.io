---
title: 日志规范与可观测性
category:
  - 工程规范
tag:
  - 日志
  - 可观测性
  - 故障排查
description: 用结构化日志、请求关联、脱敏和级别策略还原线上因果，与指标和追踪协同排障。
order: 40
outline: [2, 3]
---

# 日志规范与可观测性

## 1. 学习目标

- 根据事件重要性选择日志级别、字段和采样策略。
- 用 requestId、traceId、userId、bizId 和结果字段关联一次业务链路。
- 避免日志泄露密码、令牌、身份证件、隐私数据和大体积报文。
- 把日志、指标和分布式追踪组合成“发现异常—定位边界—还原因果”的排障路径。

## 2. 适用场景

适用于 HTTP/RPC 服务、消息消费者、批处理、任务调度、网关和 AI 应用调用链。日志用于解释发生了什么，指标用于判断规模和趋势，追踪用于定位跨服务耗时；三者不能相互替代。

## 3. 日志级别

| 级别 | 使用条件 | 示例 |
| --- | --- | --- |
| ERROR | 请求或任务失败，需要人工关注或业务补偿 | 支付确认失败、消费者无法处理 |
| WARN | 异常但已降级/恢复，或接近风险阈值 | 重试成功、缓存回源超时、连接池接近上限 |
| INFO | 关键业务状态变化，可长期保留 | 订单创建、部署启动、任务完成 |
| DEBUG | 排查细节，生产按需或采样开启 | 路由决策、计算中间值 |
| TRACE | 极细粒度诊断，默认关闭 | 协议帧、逐条内部状态 |

不要把 ERROR 用于可正常处理的业务拒绝；不要在正常请求路径打印大量 DEBUG。

## 4. 日志字段规范

每条关键日志至少包含：

- `timestamp`：统一时区和精度。
- `level`、`logger`、`event`：严重性、来源和事件名。
- `traceId`、`spanId`、`requestId`：跨系统关联。
- `service`、`version`、`env`、`host`：定位运行版本。
- `userId`、`tenantId`、`bizId`：业务上下文，按隐私策略处理。
- `durationMs`、`result`、`errorCode`：结果和耗时。
- `message`：面向人的简短解释，不重复堆叠所有字段。

字段名和事件名保持稳定，便于日志平台检索和告警。异常要记录异常类型、错误码和栈，但不要把整个响应对象无条件写入。

## 5. 最小实践：输出结构化事件日志

下面示例使用 SLF4J 参数化日志，避免无意义字符串拼接：

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

public final class OrderAuditLog {
    private static final Logger log = LoggerFactory.getLogger(OrderAuditLog.class);

    private OrderAuditLog() {
    }

    public static void created(String requestId, String orderId, String userId) {
        MDC.put("requestId", requestId);
        try {
            log.info("event=order_created orderId={} userId={} result=success", orderId, userId);
        } finally {
            MDC.remove("requestId");
        }
    }

    public static void createFailed(String requestId, String orderId, String errorCode) {
        MDC.put("requestId", requestId);
        try {
            log.error("event=order_create_failed orderId={} errorCode={} result=failure",
                orderId, errorCode);
        } finally {
            MDC.remove("requestId");
        }
    }
}
```

生产实现应由日志框架统一输出 JSON，并通过过滤器/拦截器注入 `traceId`，不要在每个业务方法手工维护全部 MDC。密码、Authorization、Cookie、私钥、助记词和完整身份证件必须在序列化前脱敏。

## 6. 可观测性检查表

- [ ] 每个入口生成或透传 requestId/traceId，并在响应或异步任务中保留。
- [ ] 关键业务操作记录开始、结果、耗时、业务 ID 和错误码。
- [ ] 异常日志包含异常类型和栈，但不包含敏感原文。
- [ ] ERROR 对应需要行动的故障，WARN 对应可恢复或风险事件。
- [ ] 日志字段命名、时区、采样和保留周期有一致约定。
- [ ] 高频日志有容量上限、采样或聚合，避免磁盘和成本失控。
- [ ] 告警能从指标跳转到日志和追踪，并关联部署版本。
- [ ] 定期用故障演练验证日志足以还原时间线。

## 7. 常见坑

1. **只记录“出错了”**：没有 requestId、bizId、errorCode，无法定位。
2. **打印完整请求/响应**：泄露令牌、隐私数据并制造大日志。
3. **依赖字符串拼接**：即使日志关闭也会构造大字符串，增加 CPU 和 GC 压力。
4. **吞掉异常后只留一句 WARN**：失败原因和栈丢失，问题延迟爆发。
5. **日志级别滥用**：正常业务打 ERROR 形成告警疲劳，真实故障被淹没。
6. **日志格式频繁变化**：检索、仪表盘和告警规则失效。
7. **只看单机日志**：跨服务请求没有 traceId，无法理解整体延迟。
8. **把日志当数据库**：详细历史、统计和审计应进入专门存储与合规流程。

## 8. 总结与关联阅读

好日志回答“谁、在什么上下文、做了什么、结果如何、耗时多少、为什么失败”。结构化字段、隐私边界和链路关联是日志可检索、可告警、可审计的前提。

关联阅读：[性能与故障排查](./dev-spec-performance-troubleshooting.md)、[工程规范与交付流程](./dev-spec-engineering-spec.md)、[Elasticsearch](../db/nosql/db-nosql-elasticsearch-overview.md)、[AI 可观测性](../llm/engineering/ai-engineering-observability.md)。
