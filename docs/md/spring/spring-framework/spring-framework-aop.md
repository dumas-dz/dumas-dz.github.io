---
title: 面向切面编程（AOP）
category:
  - Spring
tag:
  - AOP
  - 代理
  - 事务
description: Spring AOP 概念、代理实现、切点、通知、事务边界和失效排查。
order: 4
outline: [2, 3]
---

# 面向切面编程（AOP）

## 学习目标

- 理解连接点、切点、通知、切面和代理对象。
- 掌握 JDK 动态代理与 CGLIB/Byte Buddy 的适用边界。
- 能设计事务、审计、缓存和限流切面，并排查代理失效。

## 适用场景

AOP 适合日志、指标、审计、事务、重试、租户上下文等横切关注点。复杂业务规则、权限决策和数据转换应拥有显式领域 API；切面只负责调用边界上的稳定关注点。不要用切面隐藏主要业务流程。

## 核心概念

### AOP 模型

Spring AOP 通常在运行时通过代理对象包裹目标 Bean。方法调用进入代理后，按切点匹配执行前置、环绕、后置、返回和异常通知。`execution`、`within`、`@annotation`、`args` 等表达式决定匹配范围。

### 代理机制

| 机制 | 代理对象 | 限制 |
| --- | --- | --- |
| JDK 动态代理 | 实现目标接口 | 调用方按接口使用 |
| CGLIB/Byte Buddy | 生成目标类子类 | final 类/方法、构造器、模块访问 |
| AspectJ 编译/加载期 | 字节码织入 | 工具链复杂、更早介入 |

Spring Boot 通常对无接口类使用子类代理。代理对象的类型可能不是原类，`getClass()`、自调用、final 方法和 `equals/hashCode` 都可能表现不同。

### 事务与传播

`@Transactional` 是典型声明式切面。事务边界通常从公共代理方法进入；传播行为定义内外事务如何合并、挂起或新建。异常回滚规则、只读提示、超时、隔离级别由事务管理器和数据库共同执行。

## 工程实现

```java
import java.lang.annotation.*;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Audited {
    String action();
}

@Aspect
@Component
public class AuditAspect {
    @Around("@annotation(audited)")
    public Object audit(ProceedingJoinPoint joinPoint, Audited audited) throws Throwable {
        long started = System.nanoTime();
        try {
            Object result = joinPoint.proceed();
            record(audited.action(), "SUCCESS", System.nanoTime() - started);
            return result;
        } catch (Throwable error) {
            record(audited.action(), "FAILURE", System.nanoTime() - started);
            throw error;
        }
    }

    private void record(String action, String outcome, long elapsedNanos) {
        // 通过结构化日志或审计服务记录；切面内不得泄露密码、令牌和完整响应。
    }
}

interface OrderApplicationService {
    @Audited(action = "ORDER_CANCEL")
    void cancel(String orderId);
}
```

切面必须决定返回值、异常、线程上下文和异步边界如何处理。并行/异步方法不自动继承 MDC、事务和安全上下文。

## 生产实践

- 切点尽量注解驱动并限定包，避免 `execution(* *(..))` 全局扫描。
- 记录切面顺序，事务、锁、审计、缓存顺序会改变语义。
- 切面只做有限工作，不在持有事务或锁时发送网络请求。
- 每个代理关注点提供禁用开关、指标和异常降级，避免监控阻断业务。
- 测试必须通过 Spring 代理调用，并覆盖异常、异步和内部调用。

## 常见问题

### 为什么 AOP 不生效？

常见原因包括自调用绕过代理、方法非 public、final 类/方法、对象未由容器创建、切点表达式不匹配或切面 Bean 自身被排除。

### `@Transactional` 异常为什么没回滚？

默认主要回滚未检查异常，受检异常可能需显式配置；异常被吞、事务没有进入、传播配置或数据库引擎不支持也会导致未回滚。

### 多个切面如何控制顺序？

使用 `@Order` 或 `Ordered`，数值较小通常具有较高优先级；代理嵌套模型和具体注解版本需验证。记录并测试关键顺序。

### 面试追问：AOP 是不是必须用代理？

不是。AspectJ 可在编译期或加载期织入，但 Spring 常用代理模型简单易部署，代价是自调用和 final 等限制。

## 总结与延伸

AOP 适合稳定横切边界，不适合隐藏领域逻辑。容器创建和代理入口见[IoC](./spring-framework-ioc.md)，请求边界见[SpringMVC](./spring-framework-mvc.md)。

## 关联阅读

- [控制反转（IoC）](./spring-framework-ioc.md)
- [SpringMVC](./spring-framework-mvc.md)
- [Java 字节码增强技术](../../java/jvm/java-jvm-class-enhencer.md)
