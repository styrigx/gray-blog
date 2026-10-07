# Styrigx Blog

[![Deploy](https://github.com/styrigx/styrigx-blog/actions/workflows/deploy.yml/badge.svg)](https://github.com/styrigx/styrigx-blog/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-deployed-F68204?logo=cloudflare&logoColor=white)](https://blog.styrigx.com)
[![License](https://img.shields.io/badge/license-MIT%20%2B%20CC_BY--NC--SA-green)](LICENSE)

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
