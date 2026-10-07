---
title: "Migrating the Blog from Hugo to Navfolio: Full Notes"
description: "Same URLs so comments carry over, bilingual setup, dashboard homepage, SGX mark design — the whole Hugo+PaperMod to Astro+Navfolio migration."
date: 2026-10-07
lang: en
tags: ["blog", "Astro", "tinkering"]
---

The blog has a new theme. Moved from Hugo + PaperMod to Astro + Navfolio. Writing down the whole process — why, how, and what broke along the way.

## Why switch

PaperMod is great: light, fast, minimal. But after a while it felt like just a blog theme — post list plus post pages, nothing else.

Navfolio is different. It's a personal dashboard: avatar, motto, nav cards, writing stats, heatmap, all on one screen. The blog is one module of it. That's closer to what I want — a blog isn't just a place for posts, it's a foothold on the internet.

One clarification: **the portal and the blog are two sites, two repos**. The portal comes later; this post is about the blog only.

## Migration rule #1: keep the URLs

This was the most important constraint. Old posts lived at `/post/<slug>/`, and Giscus binds comments by `pathname` — meaning **as long as the new site serves identical article URLs, old comments carry over automatically**. No database migration needed.

So the first job was making sure the new theme could route articles as `/post/<slug>/` with trailing slashes, then verifying every URL, Chinese and English.

## Bilingual setup

Chinese is default at root `/`; English under `/en/`. Details:

- **Auto-redirect on first visit** by browser language, crawlers excluded (or search indexing gets messy)
- **Manual choice remembered** via localStorage
- **Language switch jumps to the translation** — on a Chinese post, hitting EN goes to that post's English version; falls back to homepage only if no translation exists
- **Split search indexes** with Pagefind, one per language, so Chinese searches don't surface English results

## Homepage: the version I rejected

First attempt was a plain blog homepage — title plus post list. I rejected it myself: too far from the official demo's dashboard look.

The redo used the official components directly: ProfileCard, IntroCard, NavigationCard, ConnectCard, BlogHeatmap, arranged as the dashboard. Two sets of copy, Chinese and English.

One bug in between: the title rendered as "Hi, Hi, I'm Sloan Sloan Gray" — greeting duplicated the title. Fixed.

## Fonts: WenKai + Maple Mono

Chinese in **LXGW WenKai**, English and UI in **Maple Mono** monospace. That's the theme's "paper + typewriter" feel — the literary Kai-style Chinese against monospace techiness fits the "take it apart, put it back together" motto.

Technical note: the WenKai TTF is several MB; the build subsets it to used characters only, so loading is fine. WenKai ships a single Regular weight, so bold Chinese is synthesized by the browser — acceptable at these sizes, not worth chasing.

Verdict: once fonts look good and recognizable, stop. Beyond that lies madness.

## Avatar: centered crop

Using my own photo. First crop was face-tracked; I rejected it for a **centered square crop extending from the middle outward**. Person in the center, stable composition.

## Favicon: the SGX monogram

Started with no idea — generated options: a serif S, an ink dot, folded paper. Landed on **SGX**: initials of Sloan Gray, also the core of styrigx. Name and handle in three letters.

A few rounds: serif S was too plain; an interlocked S/G/X geometric mark had style but was unreadable at small sizes; final version thickened the strokes and separated the letters — legibility and design balanced. Sage green to match the theme.

One gotcha: the theme prefers `favicon.svg`, and my placeholder SVG was showing in browser tabs instead of the final interlocked PNG. Deleted the SVG so browsers fall back to PNG.

## Footer year: 2020–2026, automatic

Was `© 2026 Sloan Gray`, now `© 2020–2026`. 2020 is when I first got on the outside internet — worth marking.

The end year is automatic — computed from the build date, rolls forward on every deploy. One caveat: it's build-time, not runtime. A year with zero deploys would show a stale year, but publishing posts triggers builds anyway.

## The "Recently" module

The official demo's about page has a "Recently" section. The theme ships a DoingCard component — just unconfigured and unwired.

I added 5 items in each language, all real: blog migration, portal theme hunt, Muse playbook, invite-code board, S26 upgrade plan. Future updates just edit the doing list in config.

## Deploy: push and forget

Used to be manual wrangler uploads, disconnected from GitHub. Now back to the Hugo-era fully automatic flow:

1. Source in `styrigx/styrigx-blog`, main branch
2. On push, GitHub Actions builds (deps, font subsetting, Pagefind index) and deploys to Cloudflare Pages via wrangler
3. Write a post or tweak config, push, done

## Pitfalls worth noting

1. **`NAVFOLIO_CONTENT_SOURCE=docs` is a landmine.** The theme's workflow sets it, making builds use demo content over yours. Delete it if you deploy via Actions.

2. **Wrangler env vars.** Direct-deploy scripts must preserve proxy vars and cert vars, or npm stalls and wrangler can't connect.

3. **TOML sub-table ordering.** `[params.xxx]` sub-tables must come after sibling plain keys, or later keys get swallowed — once cost me the comment section.

4. **Don't touch Giscus params.** repo_id, category_id — change those and old comments stop matching. Migrate URL structure, leave comment config alone.

5. **Build-time vs runtime year.** The footer year is computed at build time. Knowing that ends the confusion about why "automatic" still depends on deploys.

---

Whole migration done in a day: plan in the morning, content in the afternoon, homepage and icons in the evening, live by night. https://blog.styrigx.com runs this now.

Next: a new theme for the portal. The blog stays put.
