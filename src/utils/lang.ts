import type { PageLang } from '../data/site';

export type { PageLang };

/**
 * Content entries live under `blog/<lang>/<slug>.md`, so the collection id
 * looks like `zh/2026-10-07-muse-playbook`. The public URL slug drops the
 * language prefix: `/post/2026-10-07-muse-playbook/`.
 */
export function postSlugFromId(id: string): string {
  return id.replace(/^(zh|en)\//, '').replace(/\.(md|mdx)$/, '');
}

/** Article URL for a language. Chinese: /post/<slug>/, English: /en/post/<slug>/. */
export function postUrl(lang: PageLang, slug: string): string {
  const clean = slug.replace(/^\/+|\/+$/g, '');

  return lang === 'en' ? `/en/post/${clean}/` : `/post/${clean}/`;
}

/** Tag page URL for a language. */
export function tagUrl(lang: PageLang, tagSlug: string): string {
  const clean = tagSlug.replace(/^\/+|\/+$/g, '');

  return lang === 'en' ? `/en/tags/${clean}/` : `/tags/${clean}/`;
}

/** Prefix a root-relative internal path with the language (no-op for zh). */
export function localizedPath(lang: PageLang, path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;

  if (lang === 'en') {
    return clean === '/' ? '/en/' : `/en${clean}`;
  }

  return clean;
}

/** Resolve the page language from content frontmatter (defaults to zh). */
export function pageLangOf(data: { lang?: string } | undefined): PageLang {
  return data?.lang === 'en' ? 'en' : 'zh';
}
