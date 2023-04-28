/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import del from 'rollup-plugin-delete';
import serve from 'rollup-plugin-serve';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';

import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';

import solid from 'vite-plugin-solid';
// import SolidSvg from 'vite-plugin-solid-svg';
import type { Plugin, OutputOptions, RollupOptions } from 'rollup';
import { createServer } from 'vite';
import { solidSvg } from './rollup-solid-svg';

import { DEV_PORT } from './vite.config';

import pkg from '../../package.json' assert { type: 'json' };
import resource from '../userscript/resource.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const isDevMode = process.env.NODE_ENV === 'development';

export const meta = {
  name: pkg.name,
  namespace: pkg.name,
  version: pkg.version,
  description: pkg.description,
  author: pkg.author,
  license: pkg.license,
  noframes: true,
  match: '*://*/*',
  connect: [
    'cdn.jsdelivr.net',
    'yamibo.com',
    'dmzj.com',
    'idmzj.com',
    'exhentai.org',
    'e-hentai.org',
    'nhentai.net',
    'mangabz.com',
    'copymanga.site',
    'copymanga.info',
    'copymanga.net',
    'copymanga.org',
    'copymanga.com',
    '*',
  ],
  grant: [
    'GM_addElement',
    'GM_getResourceText',
    'GM_xmlhttpRequest',
    'GM.getResourceText',
    'GM.addStyle',
    'GM.getValue',
    'GM.setValue',
    'GM.deleteValue',
    'GM.registerMenuCommand',
    'GM.unregisterMenuCommand',
    'unsafeWindow',
  ],
  resource: resource[isDevMode ? 'dev' : 'prod'],
  supportURL: 'https://github.com/hymbz/ComicReadScript/issues',
  updateURL:
    'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
  downloadURL:
    'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
} as Record<string, boolean | string | string[] | Record<string, string>>;

/** 脚本头部注释 */
const metaHeader = (() => {
  const keyLength = Math.max(...Object.keys(meta).map((key) => key.length)) + 1;
  const metaStr = Object.entries(meta)
    .map(([key, val]) => {
      switch (typeof val) {
        case 'boolean':
          return `// @${key}`;
        case 'object':
          return Array.isArray(val)
            ? val
                .map((v) => `// @${key.padEnd(keyLength, ' ')} ${v}`)
                .join('\n')
            : Object.entries(val)
                .map(([k, v]) => `// @${key.padEnd(keyLength, ' ')} ${k} ${v}`)
                .join('\n');
        default:
          return `// @${key.padEnd(keyLength, ' ')} ${val}`;
      }
    })
    .join('\n');
  return ['// ==UserScript==', metaStr, '// ==/UserScript=='].join('\n');
})();

const build = (
  fileName: string,
  watchFiles?: string[],
  ...plugins: Array<Plugin | false>
): RollupOptions => {
  const isUserScript = ['dev', 'index'].includes(fileName);

  return {
    treeshake: false,
    external: [...Object.keys(meta.resource ?? {}), '../main'],
    input: resolve(__dirname, 'src', fileName),
    // 忽略使用 eval 的警告
    onwarn(warning, warn) {
      if (warning.code !== 'EVAL') warn(warning);
    },
    plugins: [
      replace({
        values: {
          DEV_PORT: `${DEV_PORT}`,
          isDevMode: `${isDevMode}`,
          'process.env.NODE_ENV': isDevMode ? `'development'` : `'production'`,
        },

        preventAssignment: true,
      }),

      nodeResolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      styles({ modules: true }),

      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        exclude: ['node_modules/**'],
        presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),
      watchFiles && isDevMode && watchExternal({ entries: watchFiles }),

      // 打包第一个脚本时清空 dist 文件夹
      fileName === 'dev' && del({ targets: resolve(__dirname, 'dist/*') }),

      solidSvg({
        svgo: {
          enabled: true,
          svgoConfig: {
            plugins: [
              'preset-default',
              {
                name: 'addAttributesToSVGElement',
                params: {
                  attribute: {
                    stroke: 'currentColor',
                    fill: 'currentColor',
                    'stroke-width': '0',
                  },
                },
              },
            ],
          },
        },
      }),

      ...plugins,
    ],
    output: {
      // dev 和 index 外的文件都放到 cache 文件夹下
      dir: resolve(__dirname, isUserScript ? 'dist' : 'dist/cache'),
      format: 'cjs',
      strict: false,
      generatedCode: 'es2015',
      extend: true,
      // 为脚本加上油猴的注释
      intro: isUserScript ? metaHeader : undefined,
      plugins: [
        {
          name: 'selfPlugin',
          // 不输出 css 文件
          generateBundle: (_, bundle) => {
            Reflect.deleteProperty(bundle, 'style.css');
          },
          renderChunk(code) {
            let newCode = code;
            // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
            newCode = newCode.replace(/[ ]*inject\('(.+)'\);/g, (_, name) =>
              fs
                .readFileSync(resolve(__dirname, 'dist/cache/', `${name}.js`))
                ?.toString(),
            );

            // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
            newCode = newCode.replace(/Object\.defineProperty.+?\n\n/, '');
            // 删除 exports.require 语句
            newCode = newCode.replace(/\n\nexports\.require.+;/, '');

            switch (fileName) {
              case 'index':
                // 在开发模式时计算下脚本的运行消耗时间
                if (isDevMode)
                  newCode = [
                    `console.time('脚本启动消耗时间')`,
                    newCode,
                    `console.timeEnd('脚本启动消耗时间')`,
                  ].join('\n');
                break;
              case 'helper/import':
                // 开发时将 main 代码直接引入，正式打包则要改成通过 GM_getResourceText 获取代码
                // TODO: 正式打包时要替换成通过 GM_getResourceText 获取代码
                newCode = code
                  .replace(
                    /inject\('main'\)/,
                    () =>
                      `\`\n${fs
                        .readFileSync('./dist/cache/main.js')
                        .toString()
                        .replaceAll('\\', '\\\\')
                        .replaceAll('`', '\\`')
                        .replaceAll('${', '\\${')}\``,
                  )
                  .replaceAll('require$1', 'require');
                break;
            }

            return newCode;
          },
        },
      ],
    },
  };
};

(async () => {
  if (!isDevMode) return;
  // 创建一个 dist 文件夹的文件服务器，用于在浏览器获取最新的脚本代码
  const server = await createServer({ publicDir: resolve(__dirname, 'dist') });
  // 开启组件的测试服务器
  await server.listen();
  server.printUrls();
})();

export default [
  build('dev'),
  build('main'),

  ...fs.readdirSync('src/site').map((fileName) => build(`site/${fileName}`)),

  build('helper/import', ['dist/cache/main.js']),

  build('index', ['dist/**/*', '!dist/index.js']),
];
