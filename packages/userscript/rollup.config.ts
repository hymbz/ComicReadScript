/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import type { OutputPlugin, RollupOptions } from 'rollup';
import { rollup } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import serve from 'rollup-plugin-serve';
import { babel } from '@rollup/plugin-babel';
import css from 'rollup-plugin-import-css';
import prettier from 'rollup-plugin-prettier';

import type { MetaValues } from 'rollup-plugin-userscript-metablock';
import metablock from 'rollup-plugin-userscript-metablock';

import pkg from './package.json';

const meta = {
  include: '*',
  connect: '*',
  noframes: true,
  grant: [
    'GM_addElement',
    'GM_getResourceText',
    'GM.xmlHttpRequest',
    'GM.getResourceText',
    'GM.addStyle',
    'unsafeWindow',
  ],
  resource: {
    react: 'https://unpkg.com/react@18/umd/react.development.js',
    'react-dom': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    'react/jsx-runtime':
      'https://unpkg.com/react@18.0.0/cjs/react-jsx-runtime.production.min.js',
    zustand: 'https://unpkg.com/zustand@4.0.0-rc.0/umd/index.development.js',
    'zustand/vanilla':
      'https://unpkg.com/zustand@4.0.0-rc.0/umd/vanilla.development.js',
    'use-sync-external-store/shim/with-selector':
      'https://unpkg.com/use-sync-external-store@1.0.0/cjs/use-sync-external-store-with-selector.development.js',
    immer: 'https://unpkg.com/immer@9.0.12/dist/immer.umd.development.js',
  },

  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
} as MetaValues;

const isDevMode = process.env.NODE_ENV === 'development';
/** 开发服务器的端口 */
const DEV_PORT = '2405';

const buildConfig = (
  config: RollupOptions,
  ...plugins: Array<OutputPlugin | false>
): RollupOptions => ({
  plugins: [
    replace({
      values: {
        DEV_PORT,
        isDevMode: `${isDevMode}`,
        'process.env.NODE_ENV': isDevMode ? `'development'` : `'production'`,
      },

      preventAssignment: true,
    }),
    resolve({ browser: true }),
    commonjs(),
    css(),
    // TODO:本想用来加速的，但直接用 babel 好像速度也没差？等之后代码量上来后再测试测试
    // esbuild({ target: 'esnext' }),
    babel({
      targets: ['last 5 Chrome versions', 'last 5 Firefox versions'],
      babelHelpers: 'runtime',
      extensions: ['.ts', '.tsx', '.js'],
      presets: [
        ['@babel/preset-env'],
        ['@babel/preset-react', { runtime: 'automatic', development: false }],
        ['@babel/preset-typescript'],
      ],
      plugins: ['@babel/plugin-transform-runtime'],
    }),

    ...plugins,
  ],
  external: Object.keys(meta.resource ?? {}),

  ...config,
});

export default () => [
  // 编译 bundle.user.js
  buildConfig({
    input: 'src/index.tsx',
    output: {
      file: 'dist/bundle.user.js',
      // sourcemap: isDevMode ? 'inline' : false,
      format: 'commonjs',
      generatedCode: 'es2015',
      exports: 'none',
      intro: async () => {
        const importBundle = await rollup(
          buildConfig({ input: 'src/helper/import.ts', treeshake: false }),
        );
        const {
          output: [{ code: importCode }],
        } = await importBundle.generate({});
        await importBundle.close();
        return importCode.replace(/^export.+;$/m, '');
      },
      plugins: [
        metablock({ file: '', override: meta }),
        !isDevMode &&
          prettier({
            singleQuote: true,
            trailingComma: 'all',
            parser: 'babel',
          }),
      ],
    },
  }),

  // 编译 dev.user.js
  buildConfig(
    {
      input: 'src/dev.ts',
      // 忽略使用 eval 的警告
      onwarn(warning, warn) {
        if (warning.code !== 'EVAL') warn(warning);
      },
      output: {
        file: 'dist/dev.user.js',
        plugins: [
          metablock({
            file: '',
            override: (({ grant = [], ...otherMeta }) => ({
              ...otherMeta,

              // 添加 xmlHttpRequest 权限
              grant: [...new Set([...grant, 'GM.xmlHttpRequest'])],
              // 允许请求所有域
              connect: '*',
            }))(meta),
          }),
        ],
      },
    },
    isDevMode &&
      serve({
        contentBase: './dist',
        port: DEV_PORT,
      }),
  ),
];

// const watcher = watch({
//   watch: {
//     exclude: 'node_modules/**',
//   },
// });
// watcher.on('event', async (event) => {
//   if (event.code === 'BUNDLE_END' || event.code === 'ERROR') {
//     await event.result?.close();
//   }
// });
