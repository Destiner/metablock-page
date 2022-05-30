import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://metablock.dev',
  trailingSlash: 'always',
  integrations: [vue(), sitemap()],
  vite: {
    build: {
      target: 'es2020',
    },
  },
});
