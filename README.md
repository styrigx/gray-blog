# Gray 的博客

个人博客，Markdown 写作，Cloudflare Pages 自动部署。

## 写文章

在 `posts/` 下新建 `YYYY-MM-DD-标题.md`，开头写 front matter：

```markdown
---
title: 文章标题
date: 2026-09-28
---

正文用 Markdown 写……
```

## 发布

```bash
git add posts/ && git commit -m "新文章：标题" && git push
```

推送到 GitHub 后，Cloudflare Pages 自动构建（`python3 build.py` → `public/`）并上线，无需手动操作。

## 留言

文章页底部集成了 [Giscus](https://giscus.app)（基于 GitHub Discussions），读者用 GitHub 账号即可留言。
