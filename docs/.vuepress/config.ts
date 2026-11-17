import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "Dumas's Lib",
  description:
    "Dumas 的个人学习知识库与技术实践：AI 应用开发、Agent、RAG、MCP、Java 与后端工程。",

  base: "/",

  theme,
});
