---
title: SpringMVC
category:
  - Spring
tag:
  - MVC
  - DispatcherServlet
  - Web
description: Spring MVC 请求流程、参数绑定、消息转换、异常处理和异步请求。
order: 5
outline: [2, 3]
---

# SpringMVC

## 学习目标

- 理解 DispatcherServlet、HandlerMapping、适配器、参数解析和消息转换。
- 能设计一致的请求校验、响应、异常和内容协商。
- 掌握异步请求、拦截器、过滤器和文件/流式响应边界。

## 适用场景

Spring MVC 适合传统阻塞式 HTTP API 和服务器渲染，依赖 Servlet 容器与同步编程模型。CPU 密集或大量长连接可评估 WebFlux/Netty，但必须整体采用 Reactor 友好生态；仅把接口改成 `Mono` 不能消除阻塞 JDBC 和线程池成本。

## 核心概念

### 请求流程

```text
HTTP -> Filter -> DispatcherServlet
-> HandlerMapping / HandlerAdapter
-> Controller 方法
-> 参数解析、校验、业务调用
-> 返回值处理、HttpMessageConverter
-> 异常解析器 / 拦截器收尾
-> HTTP 响应
```

Filter 面向 Servlet 生命周期，Interceptor 面向 Handler 调用，Controller Advice 面向 MVC 异常。安全、请求 ID、压缩通常在 Filter；埋点和 Handler 级权限常在 Interceptor；业务异常映射在 Exception Handler。

### 参数与消息转换

`@PathVariable`、`@RequestParam`、`@RequestBody` 分别绑定路径、查询和请求体。Jackson 等 `HttpMessageConverter` 完成 JSON/XML 转换，应统一时区、空值、未知字段、数字精度和错误输出。

### 返回模型

REST API 通常返回 DTO，而不是 JPA Entity 或内部领域对象。`ResponseEntity` 适合精确控制状态和响应头；统一响应包装应在全局策略中完成，避免控制器各写一套。

### 异步与文件

`Callable`、`DeferredResult`、`StreamingResponseBody` 可释放容器线程，但底层工作仍占用资源并需超时。大文件下载/上传采用流式，限制大小和速率，正确处理 Content-Length、Range 和断开连接。

## 工程实现

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderQueryService queryService;

    public OrderController(OrderQueryService queryService) {
        this.queryService = queryService;
    }

    @GetMapping("/{id}")
    public OrderResponse get(@PathVariable String id) {
        return queryService.find(id);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest request) {
        OrderResponse created = queryService.create(request);
        return ResponseEntity.status(201).body(created);
    }

    public record CreateOrderRequest(@NotBlank String sku, int quantity) {}
    public record OrderResponse(String id, String sku, int quantity) {}
    public interface OrderQueryService {
        OrderResponse find(String id);
        OrderResponse create(CreateOrderRequest request);
    }
}
```

完整项目还需 `@ControllerAdvice` 统一错误、OpenAPI 描述、鉴权和测试。测试使用 MockMvc/WebTestClient 验证序列化、状态码和输入边界。

## 生产实践

- 请求边界完成鉴权、校验、幂等和上下文提取，业务服务不直接读取 `HttpServletRequest`。
- 限制请求体、上传、响应体和分页大小，避免大对象进入堆。
- 统一错误结构包含 trace ID、稳定错误码和可展示信息，不暴露堆栈。
- 拦截器和 Converter 有界执行，阻塞下游配置连接/读取/总超时。
- 观测每阶段耗时：解析、业务、序列化、网络和队列。

## 常见问题

### 为什么 JSON 反序列化出现未知字段失败？

Jackson 配置可能拒绝未知字段，或 DTO 字段、注解和时区不一致。协议变更应版本化，并在契约测试中保留兼容样本。

### 404 和 405 为什么分别表示什么？

404 表示资源/路由不存在，405 表示路径存在但方法不允许。Spring 还可能返回 406/415 处理内容协商和媒体类型。

### 为什么 Controller 方法返回 Entity 不推荐？

Entity 暴露持久化结构、代理和敏感字段，序列化可能触发懒加载或无限引用。使用明确的 API DTO 并在应用层映射。

### 面试追问：Filter、Interceptor、ControllerAdvice 的区别？

Filter 在 Servlet 容器层执行，覆盖所有匹配请求；Interceptor 在 Handler 调用前后执行；ControllerAdvice 集中处理 MVC Controller 异常和模型增强。

## 总结与延伸

Spring MVC 的重点是请求边界、协议转换和资源控制。HTTP 工程规范见[Spring Boot 接口设计](../spring-boot/spring-boot-interface-resp.md)，切面扩展见[AOP](./spring-framework-aop.md)。

## 关联阅读

- [Spring Boot 接口设计实现](../spring-boot/spring-boot-interface-resp.md)
- [面向切面编程（AOP）](./spring-framework-aop.md)
- [Java IO/NIO/AIO 详解](../../java/io/java-io-overview.md)
