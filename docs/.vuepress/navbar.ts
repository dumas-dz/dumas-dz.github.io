import { navbar } from "vuepress-theme-hope";

export default navbar([
  { text: "首页", link: "/" },
  { text: "知识地图", link: "/md/" },
  {
    text: "Web3 开发",
    children: [
      { text: "Web3 知识地图", link: "/md/web3/" },
      { text: "Solidity 基础", link: "/md/web3/03-solidity-basics.html" },
      { text: "智能合约安全", link: "/md/web3/04-smart-contract-security.html" },
      { text: "DApp 架构", link: "/md/web3/09-dapp-architecture.html" },
    ],
  },
  {
    text: "AI 应用开发",
    children: [
      { text: "AI 应用知识地图", link: "/md/llm/" },
      { text: "AI 基础", link: "/md/llm/foundations/" },
      { text: "Agent 架构", link: "/md/llm/agent/" },
      { text: "RAG 知识库", link: "/md/llm/rag/" },
      { text: "Workflow 与 LangGraph", link: "/md/llm/workflow/" },
      { text: "MCP 与工具协议", link: "/md/llm/mcp/" },
    ],
  },
  {
    text: "AI 工程与交付",
    children: [
      { text: "工程化", link: "/md/llm/engineering/" },
      { text: "评测与可观测性", link: "/md/llm/evaluation/" },
      { text: "安全与治理", link: "/md/llm/security/" },
      { text: "部署与优化", link: "/md/llm/deploy/" },
      { text: "LangChain", link: "/md/llm/app-dev/langchain/" },
      { text: "LlamaIndex", link: "/md/llm/app-dev/llamaindex/" },
      { text: "模型训练", link: "/md/llm/model-training/" },
    ],
  },
  {
    text: "Java 技术栈",
    children: [
      { text: "Java", link: "/md/java/" },
      { text: "Spring", link: "/md/spring/" },
      { text: "数据库", link: "/md/db/" },
      { text: "框架与中间件", link: "/md/framework/" },
      { text: "架构与分布式", link: "/md/arch/" },
      { text: "工程方法论", link: "/md/dev-spec/" },
    ],
  },
  {
    text: "项目与关于",
    children: [
      { text: "项目案例", link: "/portfolio/" },
      { text: "个人介绍", link: "/about.html" },
      { text: "学习路线", link: "/guide/learning-path.html" },
      { text: "内容规范", link: "/guide/content-standard.html" },
    ],
  },
  { text: "GitHub", link: "https://github.com/dumas-dz" },
]);
