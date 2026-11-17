---
title: Spring 框架组成
category:
  - Spring
tag:
  - 模块
  - 依赖管理
description: Spring Framework 模块组成、依赖关系、启动过程和工程选型。
order: 2
outline: [2, 3]
---

# Spring 框架组成

## 学习目标

- 理解 Core Container、AOP、Data Access、Web、Integration 和 Testing 模块。
- 能按需选择依赖，避免把所有 Spring 模块引入业务应用。
- 掌握 ApplicationContext 启动、扩展点和关闭过程。

## 适用场景

适合设计应用骨架、评审依赖和排查启动问题。只写业务 Service 不必记忆所有包名，但要能解释依赖从哪来、谁创建对象、代理如何介入和关闭时如何释放资源。

## 核心概念

### 模块分层

| 模块组 | 代表模块 | 典型职责 |
| --- | --- | --- |
| Core Container | core、beans、context、expression | IoC、环境、事件、SpEL |
| AOP | aop、aspects、instrument | 横切、代理、类增强 |
| Data Access | jdbc、tx、orm、jms | 事务和数据集成 |
| Web | web、webmvc、webflux | HTTP、路由、视图和异步 |
| Integration | messaging、scheduling | 消息、定时、远程调用 |
| Testing | test、mockmvc | 容器测试、Web 测试 |

Starter 是 Spring Boot 的依赖和自动配置入口，不是 Framework 模块本身。`spring-boot-starter-web` 会带来 Spring MVC、内嵌 Tomcat、Jackson 和相关传递依赖。

### 容器扩展点

- `BeanFactoryPostProcessor`：在 Bean 定义加载后修改元数据。
- `BeanPostProcessor`：在初始化前后加工 Bean，常用于代理和注解处理。
- `Aware` 接口：注入容器资源，滥用会把业务绑定到框架。
- `ApplicationListener`：处理领域或容器事件，异步监听仍需错误和事务边界。
- `InitializingBean`/`@PostConstruct`、`DisposableBean`/`@PreDestroy`：初始化和释放资源。

### 启动过程

```text
创建 Environment
-> 加载配置/自动配置
-> 创建 BeanFactory
-> 注册并执行 BeanFactoryPostProcessor
-> 创建 BeanPostProcessor
-> 实例化业务 Bean
-> 处理依赖、Aware、初始化、代理
-> 启动 Web 服务器/消息监听器
```

异常启动时关注“第一个根本错误”，后续 Bean 创建失败往往是连锁反应。

## 工程实现

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Component;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        try (ConfigurableApplicationContext context = SpringApplication.run(Application.class, args)) {
            context.getBean(StartupVerifier.class).verify();
        }
    }
}

@Component
class StartupVerifier {
    void verify() {
        // 只校验轻量、确定性的启动条件；外部依赖不要阻塞启动。
    }
}
```

生产服务通常不立即关闭上下文，示例中的 try-with-resources 仅展示生命周期。可通过 `spring.main.lazy-initialization`、条件装配和启动事件诊断创建阶段。

## 生产实践

- 依赖树写入构建记录，升级时检查 CVE、重复日志实现和传递版本。
- 自动配置失败输出应保留 `CONDITIONS EVALUATION REPORT` 或启动诊断信息。
- 扩展点编写单元测试，验证排序、重复代理和类加载环境。
- 启动阶段避免调用慢外部服务；就绪状态通过 readiness 和后台初始化管理。
- 容器事件和异步任务有界化，记录异常，不依赖默认控制台输出。

## 常见问题

### 为什么 Bean 初始化顺序不确定？

依赖关系决定直接依赖的创建顺序，但无依赖 Bean 受注册、扫描、并行初始化和后处理器影响。不要依赖顺序，改用显式依赖、事件或生命周期接口。

### `@Configuration` 与 `@Component` 有何区别？

配置类处理 `@Bean` 方法，Full 模式下会代理方法以保持单例语义；`@Component` 更适合普通组件。

### 为什么应用关闭时任务没有执行完？

`close` 会关闭线程池、消息监听器和 Web 服务器。应实现优雅停机、等待在途请求并管理非守护线程。

### 面试追问：ApplicationContext 和 BeanFactory 有什么区别？

`BeanFactory` 提供基础 IoC 能力；`ApplicationContext` 在其上增加事件、国际化、资源、环境、AOP 集成和应用启动能力。

## 总结与延伸

模块和扩展点服务于明确的生命周期边界。对象装配详见[IoC](./spring-framework-ioc.md)，横切增强详见[AOP](./spring-framework-aop.md)。

## 关联阅读

- [Spring 框架知识体系](./spring-framework-overview.md)
- [控制反转（IoC）](./spring-framework-ioc.md)
- [面向切面编程（AOP）](./spring-framework-aop.md)
