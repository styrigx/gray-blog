# Styrigx Blog

个人门户：[styrigx.com](https://styrigx.com)

![Astro](https://img.shields.io/badge/Astro-5.x-2563eb?style=flat-square&logo=astro)
![Navfolio](https://img.shields.io/badge/Navfolio-theme-2563eb?style=flat-square)
![Deploy](https://img.shields.io/github/actions/workflow/status/styrigx/styrigx-blog/deploy.yml?style=flat-square&label=Deploy&color=2563eb)
![Site](https://img.shields.io/badge/blog.styrigx.com-online-2563eb?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-2563eb?style=flat-square)

Sloan Gray 的个人博客。中英双语，极简纸质风。

**线上：https://blog.styrigx.com**

## 特点

- 中英双语（中文默认，英文 `/en/`，自动语言跳转）
- 文章 URL 固定 `/post/<slug>/`，评论不丢失
- 全文搜索（Pagefind）、RSS、站点地图
- 写作热力图、Giscus 评论
- LXGW WenKai 中文字体 + Maple Mono 英文
- push 到 `main` 自动构建部署

## 写文章

在 `src/content/blog/zh/` 或 `src/content/blog/en/` 新建 `YYYY-MM-DD-slug.md`：

```yaml
---
title: 文章标题
description: "一句话简介"
date: 2026-10-08
lang: zh
tags: ["标签1", "标签2"]
---
```

正文 Markdown。文件名日期和 `date` 保持一致。

## 发布

push 到 `main`，GitHub Actions 自动构建 → Cloudflare Pages 上线。不用管构建细节。

## 本地预览

```bash
bun install
bun run dev
```

## 目录

| 路径 | 说明 |
|---|---|
| `src/content/blog/` | 文章（zh/en） |
| `src/config/site.toml` | 站点配置 |
| `.github/workflows/deploy.yml` | 自动部署 |

## 协议

- 代码：MIT（主题原作者 dodolalorc）
- 文章：[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans)

## 主题

基于 [Navfolio](https://github.com/navfolio/navfolio) 主题深度定制。

合并上游更新：
```bash
git fetch upstream
git merge upstream/main  # 解决冲突后测试构建
```

主要定制文件（`src/` 下覆盖主题默认）：
- `src/components/BaseHead.astro` — 字体切片覆盖、SEO
- `src/components/Footer.astro` — 页脚定制
- `src/components/Header.astro` — 导航栏定制
- `src/components/widgets/DoingCard.astro` — "最近在做"卡片
- `src/layouts/BaseLayout.astro` — 基础布局
- `src/styles/global.css` — 全局样式
- `src/config/site.toml` — 站点配置
