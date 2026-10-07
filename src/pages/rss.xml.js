import { getCollection, render } from 'astro:content';
import rss from '@astrojs/rss';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getSiteConfig } from '../data/site';
import { sortByDateDesc } from '../utils/content-dates';
import { pageLangOf, postSlugFromId, postUrl } from '../utils/lang';

export async function GET(context) {
  const { site } = await getSiteConfig();
  const posts = sortByDateDesc(
    await getCollection('blog', ({ data }) => !data.draft && pageLangOf(data) === 'zh'),
  );
  const container = await AstroContainer.create();
  const items = [];

  for (const post of posts) {
    const { Content } = await render(post);
    const content = await container.renderToString(Content);

    items.push({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      categories: [...new Set([...(post.data.tags ?? [])])],
      link: postUrl('zh', postSlugFromId(post.id)),
      content,
    });
  }

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items,
    customData: '<language>zh-CN</language>',
  });
}
