// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Needed to build absolute URLs (og:image, og:url, sitemap) — Discord,
  // search engines etc. require full URLs, a relative path won't resolve.
  site: 'https://britisharmyesports.org.uk',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/feedback/thanks'),
    }),
  ],
});
