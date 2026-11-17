---
title: Spring Boot 接口设计实现
category:
  - Spring
tag:
  - REST API
  - DTO
  - 错误处理
description: Spring Boot REST API 的资源模型、校验、响应、异常、幂等、分页和流式接口设计。
order: 3
outline: [2, 3]
---

# Spring Boot 接口设计实现

## 学习目标

- 设计稳定、可演进的 REST API 和 DTO 边界。
- 实现输入校验、统一错误、幂等、分页、并发控制和超时。
- 能保护接口免受大输入、慢客户端、重试和序列化风险影响。

## 适用场景

适合业务 API、后台接口和公开集成。内部 RPC 可使用 protobuf/gRPC 获得契约和性能；浏览器应用还需 CSRF、Cookie、CORS 和 XSS 策略。REST 名称应表达资源和状态转移，不要把所有操作都伪装成 `GET`。

## 核心概念

### 协议设计

- 路径使用名词资源和稳定标识，版本只在破坏性变更时引入。
- 查询参数表达过滤、排序和分页，限制每页大小与字段范围。
- 创建返回 `201` 和资源定位，删除成功可用 `204`，冲突用 `409`，前置条件失败用 `412`。
- 长任务返回 `202` + 任务 ID，并提供查询/回调机制。
- 使用 `Idempotency-Key` 或业务唯一键处理重复提交；服务端保存请求指纹与结果。

### DTO 与模型

API DTO、领域模型、数据库实体职责不同。请求 DTO 只描述可写字段，响应 DTO 只暴露可展示字段；枚举和金额/时间有明确序列化规则。未知字段策略、时区、数字精度和 null 语义写入契约。

### 错误契约

统一错误包含 `code`、`message`、`traceId`、`details`，对外 message 不泄露 SQL、类名和堆栈。校验错误返回字段路径和稳定原因；服务端内部错误使用 500，限流 429，依赖不可用可映射 502/503/504。

## 工程实现

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    private final ProductApplicationService service;

    public ProductController(ProductApplicationService service) {
        this.service = service;
    }

    @PostMapping
    ResponseEntity<ProductResponse> create(
        @RequestHeader("Idempotency-Key") @NotBlank String idempotencyKey,
        @Valid @RequestBody CreateProductRequest request
    ) {
        ProductResponse response = service.create(idempotencyKey, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    ProductResponse get(@PathVariable String id) {
        return service.get(id);
    }

    public record CreateProductRequest(
        @NotBlank @Size(max = 100) String name,
        @NotNull @PositiveOrZero Long priceMinor
    ) {}
}
```

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    ResponseEntity<ApiError> badRequest(IllegalArgumentException exception) {
        return ResponseEntity.badRequest()
            .body(new ApiError("INVALID_ARGUMENT", exception.getMessage(), TraceId.current()));
    }

    public record ApiError(String code, String message, String traceId) {}
    static final class TraceId { static String current() { return "trace-id"; } }
}
```

真实代码还应覆盖校验异常、并发冲突、限流、依赖超时和不可预测异常。响应使用 OpenAPI 契约测试防止无意识破坏兼容。

## 生产实践

- 所有请求设置连接、读取、处理和总超时；不依赖无限等待。
- 分页使用游标或稳定排序，禁止无界 `SELECT` 和全量导出。
- 幂等存储请求指纹、状态和结果，过期时间覆盖客户端最大重试窗口。
- 乐观锁使用版本号/ETag，冲突返回 409/412 并明确重试建议。
- 响应体流式化大结果，限制字段投影、压缩和序列化成本。
- 记录路由模板、状态码、耗时和错误码，标签不使用用户 ID 等高基数字段。

## 常见问题

### 为什么重复创建了资源？

客户端或网关超时后重试，而接口不幂等。使用 Idempotency-Key、唯一约束或条件写，不能只禁用自动重试。

### 400、422、409 应如何选择？

400 表示请求无法解析/基本语义错误；422 常用于结构正确但业务校验失败；409 表示与当前资源状态冲突。团队应统一并在契约中说明。

### 为什么分页到后面越来越慢？

OFFSET 会扫描并丢弃前序行，且数据变化导致漂移。使用基于唯一游标的 keyset pagination，并建立匹配索引。

### 面试追问：REST API 如何兼容演进？

只增加可选字段和新端点，不复用字段语义；旧字段弃用但保留，破坏性变化使用新版本或协商机制，并通过消费者契约测试验证。

## 总结与延伸

接口是外部可见契约，需要版本、安全、限流和可观测性。HTTP 处理流程见[SpringMVC](../spring-framework/spring-framework-mvc.md)，持久化事务见[集成 MySQL](./spring-boot-mysql.md)。

## 关联阅读

- [SpringMVC](../spring-framework/spring-framework-mvc.md)
- [Spring Boot 集成 MySQL](./spring-boot-mysql.md)
- [Spring Boot 入门](./spring-boot-guide.md)
