import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Java",
    prefix: "/md/java/",
    children: [
      {
        text: "Java 面向对象和基础",
        prefix: "basic/",
        children: ["java-basic-oop", "java-basic-bok"],
      }, {
        text: "Java进阶 - 集合框架",
        prefix: "collection/",
        children: ["java-collection-overview"],
      }, {
        text: "Java进阶 - 并发框架",
        prefix: "thread/",
        children: ["java-thread-x-overview", "java-thread-x-theory-basic", "java-thread-x-thread-basic", "java-thread-x-juc-overview"],
      }, {
        text: "Java进阶 - IO框架",
        prefix: "io/",
        children: ["java-io-overview"]
      }, {
        text: "Java进阶 - JVM相关",
        prefix: "jvm/",
        children: ["java-jvm-classloader", "java-jvm-class-enhencer", "java-jvm-jmm-struct", "java-jvm-gc", "java-jvm-debug-tools-ref"]
      }]
  }, {
    text: "数据库",
    prefix: "/md/db/",
    children: [{
      text: "数据库基础和原理",
      prefix: "sql/",
      children: ["db-sql-theory", "db-sql-lan"]
    }, {
      text: "SQL 数据库",
      prefix: "sql-mysql/",
      children: ["db-sql-mysql-overview"]
    }, {
      text: "NoSQL 数据库",
      prefix: "nosql/",
      children: ["db-nosql-redis-overview", "db-nosql-mongodb-overview", "db-nosql-elasticsearch-overview"]
    }],
  },
  {
    text: "Spring",
    prefix: "/md/spring/",
    children: [{
      text: "Spring Framework",
      prefix: "spring-framework/",
      children: ["spring-framework-overview", "spring-framework-introduce", "spring-framework-ioc", "spring-framework-aop", "spring-framework-mvc"]
    }, {
      text: "SpringCloud",
      prefix: "spring-cloud/",
      children: ["spring-cloud-overview", "spring-cloud-netflix-overview", "spring-cloud-alibaba-overview", "spring-cloud-tencent-overview"]
    }, {
      text: "SpringBoot 系列",
      prefix: "spring-boot/",
      children: ["spring-boot-overview", "spring-boot-guide", "spring-boot-interface-resp", "spring-boot-mysql"]
    }]
  }, {
    text: "框架｜中间件",
    prefix: "/md/framework/",
    children: [{
      text: "ORM 框架",
      prefix: "orm/",
      children: ["framework-orm-mybatis-overview"]
    }, {
      text: "MQ 消息队列",
      prefix: "mq/",
      children: ["framework-mq-rocketmq-overview", "framework-mq-rabbitmq-overview", "framework-mq-kafka-overview"]
    }, {
      text: "RPC 中间件",
      prefix: "rpc/",
      children: ["framework-rpc-dubbo-overview", "framework-rpc-grpc-overview"]
    }, {
      text: "Netty",
      prefix: "netty/",
      children: ["framework-netty-overview"]
    }, {
      text: "分库分表框架",
      prefix: "ds-sharding/",
      children: ["framework-ds-sharding-sphere-overview"]
    }]
  },
  {
    text:"架构",
    prefix:"/md/arch/",
    children:[{
      text: "架构基础和技术点",
      prefix: "basis/",
      children: ["arch-basis-overview"]
    },{
      text: "分布式系统",
      prefix: "distributed/",
      children: ["arch-distributed-overview"]
    },{
      text: "微服务系统",
      prefix: "microservice/",
      children: ["arch-microservice-overview"]
    }]
  },
  {
    text: "LLM",
    prefix: "/md/llm/",
    children: [{
      text: "应用开发 - LangChain",
      link: "app-dev/langchain/ai-langchain-overview",
    }, {
      text: "应用开发 - LlamaIndex",
      link: "app-dev/llamaindex/ai-llamaindex-outline",
    }, {
      text: "模型训练 - 全流程实战",
      link: "model-training/ai-llm-training-why",
    }]
  },
  {
    text: "主题文档",
    icon: "note",
    link: "https://vuepress-theme-hope.github.io/v2/zh/",
  }
]);
