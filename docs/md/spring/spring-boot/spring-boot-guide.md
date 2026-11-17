---
title: Spring Boot 入门
category:
  - Spring
tag:
  - Spring Boot
  - 工程实践
description: 从项目初始化、配置、Web、测试到打包部署的 Spring Boot 开发流程。
order: 2
outline: [2, 3]
---

# Spring Boot 入门

## 学习目标

- 能初始化、运行、测试和打包一个 Spring Boot 服务。
- 掌握分层结构、配置绑定、Profile、日志和错误处理。
- 能把 OAuth2/JWT、数据库、监控和部署纳入基本工程骨架。

## 适用场景

本篇面向 Java 17、Spring Boot 3.x 的新服务。维护 Boot 2.x 时概念可复用，但需使用 javax 命名空间和对应 Security 5 配置。不要从示例工程复制过量模块，先按业务边界建立最小骨架。

## 核心概念

### 推荐结构

```text
src/main/java/com/example/order
├── api/          HTTP DTO、Controller、错误映射
├── application/  用例、事务边界、编排
├── domain/       领域模型和规则
├── infrastructure/ 数据库、外部客户端、消息
└── config/       装配、安全、可观测性
src/main/resources
├── application.yml
└── application-local.yml
src/test/java
```

依赖方向应从 API/基础设施指向应用和领域契约。包结构可以按业务模块进一步拆分，不机械采用技术分层。

### 配置与 Profile

配置值分默认、环境、Secret 和动态配置。`local`、`test`、`staging`、`prod` Profile 只表达差异，不复制整份文件。敏感值通过环境变量或 Secret 管理，启动时校验必填项。

### 错误与安全基线

- API 使用稳定错误码和统一结构。
- 认证在边界完成，方法级授权作为第二道防线。
- JWT 验证签名、算法、issuer、audience、有效期和时钟偏差；不只解码 payload。
- 所有外部调用有超时、限流、重试边界和熔断。
- 密码、令牌、个人数据不得进入普通日志和指标标签。

## 工程实现

```xml
<project>
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.5</version>
    <relativePath/>
  </parent>
  <groupId>com.example</groupId>
  <artifactId>order-service</artifactId>
  <version>0.1.0-SNAPSHOT</version>
  <properties>
    <java.version>17</java.version>
  </properties>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-oauth2-resource-server</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-test</artifactId>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

```java
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.context.annotation.*;
import org.springframework.security.web.SecurityFilterChain;

@EnableWebSecurity
@Configuration(proxyBeanMethods = false)
class SecurityConfiguration {
    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
            .csrf(csrf -> csrf.disable()); // 仅适用于无 Cookie 会话的纯 Bearer API
        return http.build();
    }
}
```

安全配置必须按项目威胁模型调整。使用 Cookie/会话的浏览器应用不能简单关闭 CSRF；Swagger、调试和管理端点不得无鉴权暴露。

## 生产实践

- 构建产出记录 SBOM、版本、Git SHA 和依赖锁定信息。
- 使用 Testcontainers 验证数据库/消息真实行为，单元测试保持快速。
- 镜像使用非 root 用户、只读根文件系统、固定基础镜像和健康探针。
- 配置值启动校验，非法配置 fail fast。
- 首次上线前完成负载、滚动发布、超时、重试和下游故障演练。

## 常见问题

### 为什么本地能启动而容器失败？

常见差异包括文件路径、时区、DNS、Secret、端口、内存、证书和环境变量大小写。容器内检查实际配置来源和网络，而不是复制本地设置。

### JWT 返回 401/403 如何区分？

401 通常表示身份无效、缺失或过期；403 表示身份有效但授权不足。还需区分签名、issuer、audience、scope/role 和权限表达式错误。

### 为什么应用启动很慢？

扫描范围、Bean 懒加载、数据库迁移、外部连接和字节码代理都可能影响。使用 JFR/启动事件定位，不盲目关闭健康检查或迁移。

### 面试追问：为什么使用分层而不直接把逻辑写在 Controller？

Controller 应处理 HTTP 协议；业务用例需要独立测试、事务边界和多入口复用。分层应随业务复杂度演进，而不是为每个字段生成多个类。

## 总结与延伸

入门工程应具备明确配置、安全、测试和部署基线。完整接口契约见[接口设计实现](./spring-boot-interface-resp.md)，数据边界见[集成 MySQL](./spring-boot-mysql.md)。

## 关联阅读

- [Spring Boot 知识体系](./spring-boot-overview.md)
- [Spring Boot 接口设计实现](./spring-boot-interface-resp.md)
- [Spring Boot 集成 MySQL](./spring-boot-mysql.md)
