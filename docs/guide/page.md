---
title: 模板示例：页面配置
icon: page
order: 3
category:
  - 模板示例
tag:
  - 页面配置
  - 使用指南
article: false
index: false
sitemap:
  exclude: true
head:
  - - meta
    - name: robots
      content: noindex,nofollow
---

> 本页仅用于演示 VuePress 页面配置，不属于知识正文，也不进入公开文章列表或搜索索引。

`more` 注释之前的内容被视为文章摘要。

<!-- more -->

## 页面信息

你可以在 Markdown 的 Frontmatter 中设置页面信息。

- `article: false` 可避免模板页进入公开文章列表。
- `index: false` 可避免模板页进入站内搜索索引。
- `sitemap.exclude: true` 可避免模板页进入站点地图。
- 分类为 “模板示例”
- 标签为 “页面配置” 和 “使用指南”

## 页面内容

你可以自由在这里书写你的 Markdown。

::: tip

- 你可以将图片和 Markdown 文件放置在一起，但是你需要使用**相对链接**`./` 进行引用。

- 对于 `.vuepress/public` 文件夹的图片，请使用绝对链接 `/` 进行引用。

:::

主题包含了一个自定义徽章章可以使用:

> 文字结尾应该有深蓝色的 徽章文字 徽章。 <Badge text="徽章文字" color="#242378" />

## 页面结构

此页面应当包含:

- [路径导航](https://vuepress-theme-hope.github.io/v2/zh/guide/layout/breadcrumb.html)
- [标题和页面信息](https://vuepress-theme-hope.github.io/v2/zh/guide/feature/page-info.html)
- [TOC (文章标题列表)](https://vuepress-theme-hope.github.io/v2/zh/guide/layout/page.html#标题列表)
- [贡献者、更新时间等页面元信息](https://vuepress-theme-hope.github.io/v2/guide/feature/meta.html)
- [评论](https://vuepress-theme-hope.github.io/v2/zh/guide/feature/comment.html)
- [导航栏](https://vuepress-theme-hope.github.io/v2/zh/guide/layout/navbar.html)
- [侧边栏](https://vuepress-theme-hope.github.io/v2/zh/guide/layout/sidebar.html)
- [页脚](https://vuepress-theme-hope.github.io/v2/zh/guide/layout/footer.html)
- 返回顶部按钮

你可以通过主题选项和页面 Frontmatter 自定义它们。
