# Slaon Gray 的博客

Astro + Navfolio 主题，Cloudflare Pages 自动部署。

线上：https://styrigx-blog.pages.dev

## 写文章

在 `src/content/blog/zh/`（中文）或 `src/content/blog/en/`（英文）下新建 `YYYY-MM-DD-slug.md`，开头写：

```yaml
---
title: 文章标题
description: "一句话简介"
date: 2026-10-08
lang: zh
tags: ["标签1", "标签2"]
---
```

正文用 Markdown。文件名日期和 `date` 保持一致。

- 中文是默认语言，走根路径 `/`
- 英文走 `/en/`，`lang` 写 `en`
- 文章 URL 固定为 `/post/<slug>/`，别改（评论按路径绑定）

## 发布

push 到 `main` 分支，GitHub Actions 自动构建并部署到 Cloudflare Pages。不用管构建细节。

## 本地预览

```bash
bun install
bun run dev
```

## 结构

- `src/content/blog/` — 文章（zh/en 双语）
- `src/config/site.toml` — 站点配置（座右铭、社交链接、doing 列表等）
- `src/pages/about.astro` — 关于页
- `.github/workflows/deploy.yml` — 自动部署
