// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Needed to build absolute URLs (og:image, og:url) — Discord/Twitter/etc.
  // require a full URL for these, a relative path won't resolve for them.
  site: 'https://britisharmyesports.org.uk',
});
