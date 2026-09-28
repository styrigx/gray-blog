#!/usr/bin/env python3
"""Gray 的博客 · 静态生成器：posts/*.md -> public/（Cloudflare Pages 直接部署）

发布流程：写好 posts/*.md，git push，Cloudflare Pages 自动构建上线。
构建命令：python3 build.py；输出目录：public
"""
import os, re, html
from datetime import date, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
POSTS_DIR = os.path.join(ROOT, "posts")
OUT_DIR = os.path.join(ROOT, "public")

BLOG_TITLE = "Gray 的博客"
BLOG_TAGLINE = "记录与分享"
SITE_URL = "https://gray-blog.pages.dev"

# 由部署流程填入（giscus.app 上按 styrigx/gray-blog 生成）
GISCUS_REPO_ID = "R_kgDOUvdSCg"
GISCUS_CATEGORY = "Blog Comments"
GISCUS_CATEGORY_ID = "DIC_kwDOUvdSCs4DGjtd"

CSS = """
:root{--bg:#fafafa;--card:#fff;--txt:#1a1a1a;--dim:#888;--line:#e8e8e8;--acc:#2563eb}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--txt);font-family:apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;line-height:1.9}
.wrap{max-width:700px;margin:0 auto;padding:0 20px}
header.site{padding:48px 0 24px;border-bottom:1px solid var(--line);margin-bottom:32px}
header.site h1{font-size:26px;letter-spacing:1px}
header.site h1 a{color:var(--txt);text-decoration:none}
header.site p{color:var(--dim);font-size:14px;margin-top:6px}
nav{margin-top:14px;font-size:14px}
nav a{color:var(--dim);text-decoration:none;margin-right:18px}
nav a:hover{color:var(--acc)}
.post-item{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px 22px;margin-bottom:16px;display:block;text-decoration:none;color:var(--txt)}
.post-item:hover{border-color:var(--acc)}
.post-item h2{font-size:19px;margin-bottom:6px}
.post-item .date{color:var(--dim);font-size:13px}
.post-item .excerpt{color:#555;font-size:14px;margin-top:8px;line-height:1.8}
article{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:32px 30px;margin-bottom:32px}
article h1{font-size:24px;margin-bottom:8px;line-height:1.5}
article .date{color:var(--dim);font-size:13px;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--line)}
article h2{font-size:19px;margin:28px 0 12px}
article h3{font-size:16px;margin:22px 0 10px}
article p{margin:12px 0}
article ul,article ol{margin:12px 0 12px 22px}
article li{margin:6px 0}
article a{color:var(--acc)}
article code{background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:13px;font-family:ui-monospace,Menlo,monospace}
article pre{background:#1e1e1e;color:#e8e8e8;padding:16px;border-radius:8px;overflow:auto;margin:14px 0}
article pre code{background:none;padding:0;color:inherit}
article blockquote{border-left:3px solid var(--acc);padding:4px 16px;color:#555;margin:14px 0;background:#f7f9ff}
article img{max-width:100%;border-radius:8px}
footer.site{text-align:center;color:var(--dim);font-size:12px;padding:32px 0 48px}
.back{display:inline-block;margin-bottom:20px;color:var(--dim);font-size:14px;text-decoration:none}
.back:hover{color:var(--acc)}
.giscus{margin-top:8px}
@media(max-width:600px){article{padding:22px 18px}}
"""

GISCUS_SCRIPT = """
<div class="giscus"></div>
<script src="https://giscus.app/client.js"
  data-repo="styrigx/gray-blog"
  data-repo-id="{repo_id}"
  data-category="{category}"
  data-category-id="{category_id}"
  data-mapping="pathname"
  data-strict="0"
  data-reactions-enabled="1"
  data-emit-metadata="0"
  data-input-position="bottom"
  data-theme="light"
  data-lang="zh-CN"
  crossorigin="anonymous"
  async></script>
""".format(repo_id=GISCUS_REPO_ID, category=GISCUS_CATEGORY, category_id=GISCUS_CATEGORY_ID)


def md_inline(s):
    s = html.escape(s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    s = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img alt="\1" src="\2">', s)
    s = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', s)
    s = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', s)
    return s


def md_to_html(md):
    lines = md.split("\n")
    out, in_code, in_list, para = [], False, None, []

    def flush_para():
        if para:
            out.append("<p>" + "<br>".join(md_inline(l) for l in para) + "</p>")
            para.clear()

    def close_list():
        nonlocal in_list
        if in_list:
            out.append("</ul>" if in_list == "ul" else "</ol>")
            in_list = None

    for line in lines:
        if line.strip().startswith("```"):
            flush_para(); close_list()
            out.append("</pre>" if in_code else "<pre>")
            in_code = not in_code
            continue
        if in_code:
            out.append(html.escape(line))
            continue
        if not line.strip():
            flush_para(); close_list(); continue
        m = re.match(r'^(#{1,3})\s+(.*)', line)
        if m:
            flush_para(); close_list()
            lvl = len(m.group(1))
            out.append(f"<h{lvl}>{md_inline(m.group(2))}</h{lvl}>")
            continue
        if line.strip().startswith(">"):
            flush_para(); close_list()
            out.append(f"<blockquote>{md_inline(line.strip()[1:].strip())}</blockquote>")
            continue
        m = re.match(r'^(\s*)[-*]\s+(.*)', line)
        if m:
            flush_para()
            if in_list != "ul": close_list(); out.append("<ul>"); in_list = "ul"
            out.append(f"<li>{md_inline(m.group(2))}</li>")
            continue
        m = re.match(r'^(\s*)\d+[.)]\s+(.*)', line)
        if m:
            flush_para()
            if in_list != "ol": close_list(); out.append("<ol>"); in_list = "ol"
            out.append(f"<li>{md_inline(m.group(2))}</li>")
            continue
        para.append(line.strip())
    flush_para(); close_list()
    return "\n".join(out)


def parse_post(path):
    text = open(path, encoding="utf-8").read()
    meta, body = {}, text
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line:
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = m.group(2)
    slug = os.path.splitext(os.path.basename(path))[0]
    title = meta.get("title", slug)
    d = meta.get("date", str(date.today()))
    html_body = md_to_html(body.strip())
    plain = re.sub(r'<[^>]+>', '', html_body).strip()
    excerpt = plain[:120] + ("…" if len(plain) > 120 else "")
    return {"slug": slug, "title": title, "date": d, "html": html_body, "excerpt": excerpt}


def page(title, body_html, desc=""):
    return f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="{html.escape(desc or BLOG_TAGLINE)}">
<title>{html.escape(title)} · {html.escape(BLOG_TITLE)}</title>
<link rel="alternate" type="application/rss+xml" title="{html.escape(BLOG_TITLE)} RSS" href="/rss.xml">
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
<header class="site">
<h1><a href="/">{html.escape(BLOG_TITLE)}</a></h1>
<p>{html.escape(BLOG_TAGLINE)}</p>
<nav><a href="/">首页</a><a href="/about/">关于</a><a href="/rss.xml">RSS</a></nav>
</header>
{body_html}
<footer class="site">© {date.today().year} {html.escape(BLOG_TITLE)}</footer>
</div>
</body>
</html>"""


def write(rel, content):
    path = os.path.join(OUT_DIR, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(content)


def rss(posts):
    items = []
    for p in posts:
        pub = p["date"]
        try:
            pub = datetime.strptime(p["date"], "%Y-%m-%d").strftime("%a, %d %b %Y 00:00:00 +0800")
        except ValueError:
            pass
        items.append(
            f"<item><title>{html.escape(p['title'])}</title>"
            f"<link>{SITE_URL}/post/{p['slug']}/</link>"
            f"<guid>{SITE_URL}/post/{p['slug']}/</guid>"
            f"<pubDate>{pub}</pubDate>"
            f"<description>{html.escape(p['excerpt'])}</description></item>"
        )
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>{html.escape(BLOG_TITLE)}</title>
<link>{SITE_URL}/</link>
<description>{html.escape(BLOG_TAGLINE)}</description>
<language>zh-CN</language>
{''.join(items)}
</channel></rss>"""


def main():
    posts = []
    for f in sorted(os.listdir(POSTS_DIR), reverse=True):
        if f.endswith(".md"):
            posts.append(parse_post(os.path.join(POSTS_DIR, f)))

    items = "\n".join(
        f'<a class="post-item" href="/post/{p["slug"]}/">'
        f'<h2>{html.escape(p["title"])}</h2>'
        f'<div class="date">{p["date"]}</div>'
        f'<div class="excerpt">{html.escape(p["excerpt"])}</div></a>'
        for p in posts
    )
    write("index.html", page(BLOG_TITLE, items if items else '<p style="color:#888">还没有文章。</p>'))

    about_body = """<article><h1>关于</h1><div class="date">关于这个博客</div>
<p>这是我的个人博客，记录想法、折腾笔记和日常分享。</p>
<p>博客是静态生成的，推到 GitHub 就自动上线，不用操心服务器。</p>
<p>想联系我？通过 X 私信即可。</p></article>"""
    write("about/index.html", page("关于", about_body))

    for p in posts:
        body = (f'<a class="back" href="/">← 返回首页</a><article><h1>{html.escape(p["title"])}'
                f'</h1><div class="date">{p["date"]}</div>{p["html"]}</article>')
        if not GISCUS_REPO_ID.startswith("__"):
            body += GISCUS_SCRIPT
        write(f"post/{p['slug']}/index.html", page(p["title"], body, p["excerpt"]))

    write("404.html", page("找不到页面", '<article><h1>404</h1><p>这个页面不存在，<a href="/">回首页</a>看看吧。</p></article>'))
    write("rss.xml", rss(posts))
    print(f"posts: {len(posts)}, files written to public/")


if __name__ == "__main__":
    main()
