# Styrigx Blog

![Deploy](https://img.shields.io/github/actions/workflow/status/styrigx/styrigx-blog/deploy.yml?style=flat-square&label=Deploy)

Sloan Gray 的个人博客：AI 应用、开源项目与折腾笔记。

**线上：https://blog.styrigx.com**（仓库：https://github.com/styrigx/styrigx-blog）

> 注：顶部站点截图待补。

## 功能要点

- 中英双语（中文默认，英文 `/en/`，自动语言跳转）
- 文章 URL 固定 `/post/<slug>/`，评论不丢失
- 全文搜索（Pagefind）、RSS、站点地图
- 写作热力图、Giscus 评论、「最近在做」卡片
- 中文字体 LXGW WenKai 自托管、Maple Mono 英文、Monaco 代码

## 技术栈

- Astro 7、MDX、Tailwind CSS 4
- 主题：Navfolio（@navfolio/core、@navfolio/pages、@navfolio/theme-default、@navfolio/plugin-markdown、@navfolio/mdx-components）
- 搜索：Pagefind（构建时生成索引）
- 部署：GitHub Actions → Cloudflare Pages（`styrigx-blog`）

## 本地开发

```bash
bun install
bun run dev        # 本地预览
bun run build      # 构建（含 Pagefind 索引与字体子集生成）
bun run preview    # 预览构建产物
```

新建文章：

```bash
bun run post:new
```

或在 `src/content/blog/zh/`（中文）/`src/content/blog/en/`（英文）新建 `YYYY-MM-DD-slug.md`，frontmatter 示例：

```yaml
---
title: 文章标题
description: "一句话简介"
date: 2026-10-08
lang: zh
tags: ["标签1", "标签2"]
---
```

## 部署

push 到 `main`，GitHub Actions 自动构建 → Cloudflare Pages 上线。

构建时用 `SITE_URL: https://blog.styrigx.com`（见 `.github/workflows/deploy.yml`）；
`astro.config.mjs` 的兜底 `site` 已固定为 `https://blog.styrigx.com`。

## 目录结构

| 路径 | 说明 |
|---|---|
| `src/content/blog/zh/`、`src/content/blog/en/` | 文章（中英） |
| `src/config/site.toml` | 站点配置（标题、字体、评论、主题色盘） |
| `src/components/`、`src/layouts/`、`src/pages/` | 覆盖主题默认的定制组件与页面 |
| `src/styles/global.css` | 全局样式 |
| `scripts/fonts/` | UI 字体子集生成脚本 |
| `public/fonts/` | 自托管 woff2 字体 |
| `.github/workflows/deploy.yml` | 自动构建部署 |

## 许可证与致谢

- 代码：MIT，见 [LICENSE](./LICENSE)。
  - Sloan Gray：站点定制与代码修改
  - dodolalorc：原始 Navfolio 代码
- 博文与图片：版权归 Sloan Gray，采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)，不属于 MIT。

致谢：基于 [Navfolio](https://github.com/navfolio)（dodolalorc）修改。

## 相关项目

- 主站 Styrigx's Space：https://styrigx.com（styrigx/styrigx-space）
- 书站：https://book.styrigx.com（styrigx/styrigx-book）
- 邀请码站：https://muse-invite.styrigx.com（styrigx/muse-invite-board）

## English Summary

Styrigx Blog — Sloan Gray's personal blog (https://blog.styrigx.com), a customized bilingual (Chinese/English) blog built with Astro and the Navfolio theme, deployed on Cloudflare Pages. Code is MIT-licensed; blog posts and images are © Sloan Gray under CC BY-NC-SA 4.0.
