import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://dumas-dz.github.io",

  author: {
    name: "Dumas",
    url: "https://dumas-dz.github.io",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "dumas-dz/dumas-dz.github.io",

  docsDir: "docs",

  navbar,

  sidebar,

  footer: "Dumas's Lib | 个人学习知识库与技术实践",

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "Java / AI 应用开发工程师",
    intro: "/about.html",
    medias: {
      GitHub: "https://github.com/dumas-dz",
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
