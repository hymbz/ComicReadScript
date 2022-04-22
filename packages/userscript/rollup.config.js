import fs from 'fs';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import serve from 'rollup-plugin-serve';
import replace from '@rollup/plugin-replace';
import { babel } from '@rollup/plugin-babel';
import css from 'rollup-plugin-import-css';

import metablock from 'rollup-plugin-userscript-metablock';

const pkg = require('./package.json');

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
    React: 'https://unpkg.com/react@18/umd/react.development.js',
    ReactDOM: 'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
  },

  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
};

const isDevMode = process.env.NODE_ENV === 'development';
/** 开发服务器的端口 */
const DEV_PORT = 2405;

const buildConfig = (config, handleMeta = (e) => e) => ({
  plugins: [
    replace({
      DEV_PORT,
      require: 'selfRequire',
    }),
    resolve({
      browser: true,
    }),
    commonjs(),
    css(),
    esbuild({
      target: 'esnext',
    }),
    babel({
      targets: ['last 5 Chrome versions', 'last 5 Firefox versions'],
      babelHelpers: 'runtime',
      extensions: ['.ts', '.tsx', '.js'],
      presets: [['@babel/preset-env'], ['@babel/preset-react']],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    metablock({
      file: '',
      override: handleMeta(meta),
    }),
    // serve({
    //   contentBase: './dist',
    //   port: DEV_PORT,
    // }),
  ],
  external: ['react', 'react-dom'],
  inlineDynamicImports: true,

  ...config,
});

export default async () => {
  return [
    // bundle.user.js
    buildConfig({
      input: 'src/index.tsx',
      output: {
        file: 'dist/bundle.user.js',
        sourcemap: isDevMode ? 'inline' : false,
        format: 'cjs',
        generatedCode: 'es2015',
        exports: 'none',

        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },

        intro: fs.readFileSync('./src/helper/import.ts', 'utf-8'),
      },
    }),
    // dev.user.js
    buildConfig(
      {
        input: 'src/dev.ts',
        output: { file: 'dist/dev.user.js' },

        // 忽略使用 eval 的警告
        onwarn(warning, warn) {
          if (warning.code !== 'EVAL') warn(warning);
        },
      },
      ({ grant = [], ...otherMeta }) => {
        return {
          ...otherMeta,

          // 添加 xmlHttpRequest 权限
          grant: [...new Set([...grant, 'GM.xmlHttpRequest'])],
          // 允许请求所有域
          connect: '*',
        };
      },
    ),
  ];
};
