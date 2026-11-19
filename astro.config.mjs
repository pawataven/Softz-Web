// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

export default defineConfig({
  site: SITE_URL || 'http://localhost:4321',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  env: {
    schema: {
      PUBLIC_ALLOW_INDEXING: envField.boolean({ context: 'client', access: 'public', default: false }),
      PUBLIC_BRIEF_ENDPOINT: envField.string({ context: 'client', access: 'public', url: true, optional: true }),
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Noto Sans Thai',
      cssVariable: '--font-noto-sans-thai',
      weights: [400, 500, 600],
      subsets: ['thai', 'latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
  integrations: [
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
