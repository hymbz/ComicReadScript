/* eslint-disable import/no-extraneous-dependencies */

import type { PluginOption } from 'vite';
import { defineConfig } from 'vite';
import ts from 'rollup-plugin-ts';
import react from '@vitejs/plugin-react';
// eslint-disable-next-line import/no-unresolved
import Unocss from 'unocss/vite';
import presetWind from '@unocss/preset-wind';
import presetIcons from '@unocss/preset-icons';
import * as path from 'path';

export default defineConfig(({ command }) => ({
  // 打包时禁用 esbuild
  esbuild: command === 'serve' ? undefined : false,
  plugins: [
    react(),
    Unocss({
      presets: [presetWind(), presetIcons()],
      mode: 'shadow-dom',
    }),
  ],

  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      // input: {
      //   Button: path.resolve(__dirname, 'src/containers/Button/index.tsx'),
      //   Manga: path.resolve(__dirname, 'src/containers/Manga/index.tsx'),
      // },
      output: {
        entryFileNames: '[name].js',
      },
      external: [
        'react-dom',
        'react',
        'react/jsx-runtime',
        'zustand',
        'immer',
        'react-shadow',
      ],
      // 检查 TS 错误，并正确生成声明文件
      plugins: [ts()],
    },

    // 启用 CSS 代码拆分
    cssCodeSplit: true,
    // 禁用 @rollup/plugin-dynamic-import-vars，防止莫名报错
    dynamicImportVarsOptions: { include: [''] },
  },
}));
