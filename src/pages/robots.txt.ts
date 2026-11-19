import type { APIRoute } from 'astro';
import { PUBLIC_ALLOW_INDEXING } from 'astro:env/client';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site).href;
  const body = PUBLIC_ALLOW_INDEXING
    ? ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemapUrl}`].join('\n')
    : ['User-agent: *', 'Disallow: /'].join('\n');

  return new Response(`${body}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
