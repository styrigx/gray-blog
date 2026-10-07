---
title: Launched a Muse Invite-Code Sharing Site
description: "Shipped a community Muse invite-code board: draw a code, contribute codes, vote on working ones — dead codes get hidden automatically."
date: 2026-09-27
lang: en
tags: ["Muse", "AI", "Open Source"]
---

Shipped a small project today: a **community Muse invite-code board**.

## What it does

- 🎲 **Draw one**: one click, get a random invite code contributed by the community
- 📮 **Contribute**: have a spare code? Submit it for others
- 👍 **Feedback**: got a working code? Mark it "works" to help the next person
- 🧹 **Auto-cleanup**: codes flagged invalid 3 times get hidden automatically

## How it's built

- Frontend: single HTML file, editorial paper aesthetic, Chinese/English bilingual
- Backend: Cloudflare Worker API
- Storage: Supabase for the code table, Cloudflare KV for rate limiting, messages, and recent draws
- Draw logic: weighted rotation, least-drawn codes first

## Link

👉 https://muse-invite-board.vercel.app/

Come grab a code, or contribute one. Suggestions welcome — just reach out.
