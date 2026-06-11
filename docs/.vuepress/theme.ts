import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://vuepress-theme-hope-v2-demo.mrhope.site",

  author: {
    name: "Mr.Dumas",
    url: "https://mrhope.site",
  },

  iconAssets: "iconfont",

  logo: "/logo.svg",

  repo: "dumas-dz/dumas-dz.github.io",

  docsDir: "docs",

  navbar: navbar,

  sidebar: sidebar,

  footer: "默认页脚",

  displayFooter: false,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "后端开发者",
    intro: "/intro.html",
    medias: {
      Email: "dumas.dz.ma@hotmail.com",
      Gitee: "https://gitee.com/dumasz",
      GitHub: "https://github.com/dumasz",
    },
  },

  encrypt: {
    config: {
      "/guide/encrypt.html": ["123456"],
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
