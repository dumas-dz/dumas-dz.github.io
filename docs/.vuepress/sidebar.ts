import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "": [
    "/",
    {
      text: "快速开始",
      icon: "guide",
      children: [
        "/md/",
        "/home.html",
        "/guide/",
        "/guide/learning-path.html",
        "/guide/content-standard.html",
      ],
    },
    {
      text: "对外展示",
      icon: "people",
      children: ["/about.html", "/portfolio/"],
    },
  ],
  "/md/llm": [
    {
      text: "AI 应用开发",
      icon: "creative",
      children: [
        "/md/llm/",
        "/md/llm/foundations/",
        "/md/llm/agent/",
        "/md/llm/rag/",
        "/md/llm/workflow/",
        "/md/llm/mcp/",
      ],
    },
    {
      text: "生产交付",
      icon: "config",
      children: [
        "/md/llm/engineering/",
        "/md/llm/evaluation/",
        "/md/llm/security/",
        "/md/llm/deploy/",
        "/md/llm/projects/",
      ],
    },
    {
      text: "框架与模型",
      icon: "structure",
      children: [
        "/md/llm/app-dev/langchain/",
        "/md/llm/app-dev/llamaindex/",
        "/md/llm/model-training/",
      ],
    },
  ],
  "/md/web3": [
    {
      text: "Web3 开发",
      icon: "link",
      children: [
        "/md/web3/",
        "/md/web3/03-solidity-basics.html",
        "/md/web3/04-smart-contract-security.html",
        "/md/web3/09-dapp-architecture.html",
      ],
    },
  ],
  "/md/java": [
    {
      text: "Java 基础",
      prefix: "basic/",
      collapsable: true,
      children: ["java-basic-oop", "java-basic-bok"],
    },
    {
      text: "集合框架",
      prefix: "collection/",
      collapsable: true,
      children: ["java-collection-overview"],
    },
    {
      text: "并发编程",
      prefix: "thread/",
      collapsable: true,
      children: [
        "java-thread-x-overview",
        "java-thread-x-theory-basic",
        "java-thread-x-thread-basic",
        "java-thread-x-juc-overview",
      ],
    },
    {
      text: "IO 与 JVM",
      collapsable: true,
      children: [
        {
          text: "IO/NIO",
          prefix: "io/",
          children: ["java-io-overview"],
        },
        {
          text: "JVM",
          prefix: "jvm/",
          children: [
            "java-jvm-classloader",
            "java-jvm-class-enhencer",
            "java-jvm-jmm-struct",
            "java-jvm-gc",
            "java-jvm-debug-tools-ref",
          ],
        },
      ],
    },
  ],
  "/md/spring": [
    {
      text: "Spring Framework",
      prefix: "spring-framework/",
      collapsable: true,
      children: [
        "spring-framework-overview",
        "spring-framework-introduce",
        "spring-framework-ioc",
        "spring-framework-aop",
        "spring-framework-mvc",
      ],
    },
    {
      text: "Spring Boot",
      prefix: "spring-boot/",
      collapsable: true,
      children: [
        "spring-boot-overview",
        "spring-boot-guide",
        "spring-boot-interface-resp",
        "spring-boot-mysql",
      ],
    },
    {
      text: "Spring Cloud",
      prefix: "spring-cloud/",
      collapsable: true,
      children: [
        "spring-cloud-overview",
        "spring-cloud-netflix-overview",
        "spring-cloud-alibaba-overview",
        "spring-cloud-tencent-overview",
      ],
    },
  ],
  "/md/db": [
    {
      text: "数据库基础",
      prefix: "sql/",
      collapsable: true,
      children: ["db-sql-theory", "db-sql-lan"],
    },
    {
      text: "关系型数据库",
      prefix: "sql-mysql/",
      collapsable: true,
      children: ["db-sql-mysql-overview"],
    },
    {
      text: "NoSQL",
      prefix: "nosql/",
      collapsable: true,
      children: [
        "db-nosql-redis-overview",
        "db-nosql-mongodb-overview",
        "db-nosql-elasticsearch-overview",
      ],
    },
  ],
  "/md/framework": [
    {
      text: "数据访问",
      prefix: "orm/",
      collapsable: true,
      children: ["framework-orm-mybatis-overview"],
    },
    {
      text: "消息队列",
      prefix: "mq/",
      collapsable: true,
      children: [
        "framework-mq-rocketmq-overview",
        "framework-mq-rabbitmq-overview",
        "framework-mq-kafka-overview",
      ],
    },
    {
      text: "RPC 与网络",
      collapsable: true,
      children: [
        {
          text: "RPC",
          prefix: "rpc/",
          children: ["framework-rpc-dubbo-overview", "framework-rpc-grpc-overview"],
        },
        {
          text: "Netty",
          prefix: "netty/",
          children: ["framework-netty-overview"],
        },
      ],
    },
    {
      text: "数据分片",
      prefix: "ds-sharding/",
      collapsable: true,
      children: ["framework-ds-sharding-sphere-overview"],
    },
  ],
  "/md/arch": [
    {
      text: "架构知识",
      prefix: "basis/",
      collapsable: true,
      children: ["arch-basis-overview"],
    },
    {
      text: "分布式系统",
      prefix: "distributed/",
      collapsable: true,
      children: ["arch-distributed-overview"],
    },
    {
      text: "微服务系统",
      prefix: "microservice/",
      collapsable: true,
      children: ["arch-microservice-overview"],
    },
  ],
});
