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
    react() as PluginOption,
    Unocss({
      presets: [presetWind() as any, presetIcons() as any],
      mode: 'shadow-dom',
      // TODO: 希望之后能找到办法不用在这里这样手动写出来
      safelist: 'invisible w-full h-auto'.split(' '),
      rules: [
        [
          'arrow',
          {
            'background-color': 'transparent',
            'border-style': 'solid',
            'border-width': '.4em',
            'border-color': 'transparent',
            'border-right-width': '.5em',
            'border-right-color': 'var(--buttonHoverBgColor)',
          },
        ],
        [
          'card-shadow',
          {
            'box-shadow':
              'rgb(0 0 0 / 20%) 0px 2px 1px -1px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 1px 3px 0px',
          },
        ],
      ],
    }) as PluginOption,
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
