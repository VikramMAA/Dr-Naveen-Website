// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Placeholder domain, also set in src/config/site.ts. Listed in REVIEW.md.
const SITE = 'https://www.drnaveengovind.com';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/og/'),
    }),
  ],
  vite: {
    build: {
      // Keep scripts and fonts as external files so the Content-Security-Policy can use
      // script-src 'self' and font-src 'self' (no inline scripts, no data: fonts).
      assetsInlineLimit: (filePath) => (/\.(js|woff2?)$/.test(filePath) ? false : undefined),
    },
  },
});
