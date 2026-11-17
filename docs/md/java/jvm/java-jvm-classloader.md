---
title: Java 类加载机制
category:
  - Java
tag:
  - ClassLoader
  - 类加载
description: 类加载阶段、双亲委派、模块化与类加载冲突的原理和诊断。
order: 2
outline: [2, 3]
---

# Java 类加载机制

## 学习目标

- 理解加载、链接、初始化和卸载的生命周期。
- 掌握双亲委派、类标识和 ClassLoader 隔离。
- 能排查重复类、`LinkageError`、反射和 SPI 类加载问题。

## 适用场景

适合理解 Spring、插件系统、热部署、Agent、应用服务器和多模块依赖。应用服务通常不需要自定义 ClassLoader；只有插件隔离、多租户、动态替换或字节码工具才需要直接管理。

## 核心概念

### 生命周期

1. **加载**：通过类名找到字节流，创建 `Class` 对象。
2. **链接**：验证字节码、准备静态字段默认值并解析符号引用。
3. **初始化**：执行静态初始化器和静态字段赋值。
4. **使用与卸载**：Class 对象、定义它的 ClassLoader 及其实例不可达后才可能回收。

类初始化由首次主动使用触发，例如 `new`、访问静态字段、反射调用和主类启动；仅加载常量通常不会触发初始化。

### 双亲委派

常见 JVM 采用 bootstrap -> platform -> application 的委派链。子加载器先请求父加载器，优先加载核心类，避免应用替换 `java.lang.Object` 等核心类型。Web 容器和插件容器可能在应用加载器之下建立隔离层，以隔离同一库的不同版本。

### 类的身份

类的唯一身份是“全限定名 + 定义类加载器”。即使字节码相同，由不同加载器定义的类也不是同一类型，赋值会报 `ClassCastException`，方法签名可能报 `LinkageError`。

### 模块与反射

Java Platform Module System 对包导出、强封装和反射访问提供约束。使用 JDK 内部 API 需要 `--add-exports`/`--add-opens` 只是迁移手段，应寻找受支持 API；反射检查异常通常意味着模块边界或版本不兼容。

## 工程实现

```java
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLClassLoader;

public final class PluginLoader extends URLClassLoader {
    public PluginLoader(URL[] urls, ClassLoader parent) {
        super(urls, parent);
    }

    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        if (name.startsWith("com.example.plugin.")) {
            synchronized (getClassLoadingLock(name)) {
                Class<?> loaded = findLoadedClass(name);
                if (loaded == null) {
                    try (InputStream ignored = null) {
                        loaded = findClass(name);
                    } catch (ClassNotFoundException ignored) {
                        loaded = super.loadClass(name, false);
                    }
                }
                if (resolve) resolveClass(loaded);
                return loaded;
            }
        }
        return super.loadClass(name, resolve);
    }

    @Override
    public void close() throws IOException {
        super.close();
    }
}
```

这是隔离加载的基本骨架；插件协议接口必须由父加载器共享，插件实现由子加载器隔离，卸载前必须释放线程、缓存和静态引用。

## 生产实践

- 默认使用应用类路径和标准依赖管理，避免 `Class.forName` 大量散落。
- 插件边界只暴露稳定 API，记录加载器、插件版本和类来源。
- 关闭动态加载环境时停止线程、清理 ThreadLocal、JDBC 驱动和缓存，允许加载器回收。
- 升级 Spring、ASM、Byte Buddy、日志和字节码库时执行代理与反射测试。
- 诊断类来源使用 `-verbose:class` 或 JFR 类加载事件，并保留模块和 classpath 清单。

## 常见问题

### 为什么出现 `ClassNotFoundException` 而依赖明明存在？

可能是打包缺文件、类路径顺序错误、不同 ClassLoader、依赖范围问题或类名拼写错误。先打印当前线程上下文 ClassLoader 和资源 URL。

### `NoClassDefFoundError` 与 `ClassNotFoundException` 有何区别？

前者通常表示链接/初始化阶段失败或类曾加载后找不到，后者是加载时按名称查找失败。查看完整 cause 和首次失败日志。

### Spring Boot Fat JAR 的类加载有什么特点？

可执行 JAR 使用特定加载器读取嵌套 JAR。不要假设普通文件系统路径存在，资源应通过类加载器/资源 API 读取，自定义工具要兼容 nested JAR。

### 面试追问：SPI 为什么经常使用线程上下文 ClassLoader？

SPI 接口可能由父加载器加载，但实现位于应用/容器加载器。上下文加载器让框架从调用方环境查找实现，但使用后应避免跨线程泄漏。

## 总结与延伸

类加载问题本质是类身份、资源可见性和生命周期问题。字节码在加载前的结构见[字节码增强](./java-jvm-class-enhencer.md)，运行故障见[调试排错](./java-jvm-debug-tools-ref.md)。

## 关联阅读

- [Java 字节码增强技术](./java-jvm-class-enhencer.md)
- [Java 调试排错相关](./java-jvm-debug-tools-ref.md)
- [Spring IoC 容器](../../spring/spring-framework/spring-framework-ioc.md)
