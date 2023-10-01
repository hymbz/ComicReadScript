/* eslint-disable import/no-extraneous-dependencies */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import type { ManifestOptions } from 'vite-plugin-pwa';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';
import markdown from '@jackfranklin/rollup-plugin-markdown';
import { solidSvg } from '../rollup-plugin/rollup-solid-svg';

const __dirname = dirname(fileURLToPath(import.meta.url));

const manifest: Partial<ManifestOptions> = {
  id: 'ComicRead',
  name: 'ComicRead',
  short_name: 'ComicRead',
  description: '双页阅读漫画',
  theme_color: '#607d8b',
  background_color: '#ffffff',
  display: 'standalone',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],

  file_handlers: [
    {
      action: '/',
      accept: {
        'application/zip': ['.zip', '.cbz'],
        'application/x-rar-compressed': ['.rar', '.cbr'],
        'application/x-7z-compressed': ['.7z', '.cb7'],
      },
    },
  ],
};

export default defineConfig({
  server: { host: '0.0.0.0' },
  build: { rollupOptions: { external: ['/unarchiver.min.js'] } },
  css: { modules: { globalModulePaths: [/^#/] } },
  resolve: {
    alias: { helper: resolve(__dirname, '../../src/helper') },
  },
  plugins: [
    {
      name: 'selfPlugin',
      enforce: 'pre',
      transform(code, id): null | string {
        if (id.includes('node_modules')) return null;
        let newCode = code;
        // 将 vite 不支持的 rollup-plugin-styles 相关 css 导出代码改成正常的代码
        newCode = newCode.replace(
          /(\n.+?), { css as style }(.+?\n)/,
          '$1$2const style = ""',
        );
        newCode = newCode.replace(
          /\nimport { css as style } from .+?;\n/,
          '\nconst style = ""\n',
        );
        return newCode;
      },
    },
    markdown({ parseFrontMatterAsMarkdown: true }),
    solidSvg(),
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { suppressWarnings: true },
      manifest,
      includeAssets: ['/libarchive.js/wasm-gen/libarchive.wasm', '/libunrar/*'],
      workbox: {
        // 清理过期缓存
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
