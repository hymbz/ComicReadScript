/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import type { OutputChunk, OutputPlugin, RollupOptions } from 'rollup';
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
  // include: '*://localhost*',
  include: '*',
  connect: '*',
  noframes: true,
  grant: [
    'GM_getResourceText',
    'GM_addElement',
    'GM.xmlHttpRequest',
    'GM.getResourceText',
    'GM.addElement',
    'unsafeWindow',
  ],
  resource: {
    react: 'https://unpkg.com/react@18/umd/react.development.js',
    'react-dom': 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
    'react/jsx-runtime':
      'https://unpkg.com/react@18.0.0/cjs/react-jsx-runtime.production.min.js',
  },

  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
} as MetaValues;

// const isDevMode = process.env.NODE_ENV === 'development';
const isDevMode = true;
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

    // FIXME:改为 js 调用后，就不好用插件的形式来启用了
    // serve({
    //   contentBase: './dist',
    //   port: DEV_PORT,
    // }),
  ],
  external: ['react', 'react-dom', 'react/jsx-runtime'],

  ...config,
});

//
// 编译 dev.user.js
//

// const bundle = await rollup(
//   buildConfig({
//     input: 'src/dev.ts',
//     // 忽略使用 eval 的警告
//     onwarn(warning, warn) {
//       if (warning.code !== 'EVAL') warn(warning);
//     },
//   }),
// );
// await bundle.write({
//   file: 'dist/dev.user.js',
//   plugins: [
//     metablock({
//       file: '',
//       override: (({ grant = [], ...otherMeta }) => {
//         return {
//           ...otherMeta,

//           // 添加 xmlHttpRequest 权限
//           grant: [...new Set([...grant, 'GM.xmlHttpRequest'])],
//           // 允许请求所有域
//           connect: '*',
//         };
//       })(meta),
//     }),
//   ],
// });
// await bundle.close();

//
// 编译 bundle.user.js
//

const importBundle = await rollup(
  buildConfig({ input: 'src/helper/import.ts', treeshake: false }),
);
const {
  output: [{ code: importCode }],
} = await importBundle.generate({});
await importBundle.close();

const mainBundle = await rollup(
  buildConfig(
    { input: 'src/index.tsx' },
    !isDevMode && prettier({ singleQuote: true, trailingComma: 'all' }),
  ),
);
await mainBundle.write({
  // globals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },

  file: 'dist/bundle.user.js',
  sourcemap: isDevMode ? 'inline' : false,
  format: 'commonjs',
  generatedCode: 'es2015',
  exports: 'none',
  intro: importCode.replace(/^export.+;$/m, ''),
  plugins: [
    metablock({
      file: '',
      override: (({ grant = [], ...otherMeta }) => {
        return {
          ...otherMeta,

          // 添加 xmlHttpRequest 权限
          grant: [...new Set([...grant, 'GM.xmlHttpRequest'])],
          // 允许请求所有域
          connect: '*',
        };
      })(meta),
    }),
  ],
});
await mainBundle.close();
