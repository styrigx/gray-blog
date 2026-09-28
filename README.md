# Gray 的博客

Hexo + NexT 主题，Cloudflare Pages 自动部署。

## 写文章

```bash
npx hexo new "文章标题"   # 在 source/_posts/ 生成草稿
```

或直接在 `source/_posts/` 下新建 `xxx.md`，开头写：

```markdown
---
title: 文章标题
date: 2026-09-28
tags:
  - 标签1
---
```

## 发布

```bash
git add -A && git commit -m "新文章：标题" && git push
```

推送到 GitHub 后 Action 自动构建（`hexo generate`）并发布到 https://gray-blog.pages.dev。

## 留言

文章页底部集成了 [Giscus](https://giscus.app)（基于 GitHub Discussions）。
