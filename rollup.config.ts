/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import solidPlugin from 'vite-plugin-solid';

import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';

import type { Plugin, RollupOptions } from 'rollup';
import { createServer } from 'vite';
import { solidSvg } from './rollup-solid-svg';

import pkg from './package.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEV_PORT = 2405;

const isDevMode = process.env.NODE_ENV === 'development';

/**
 * 脚本依赖库与对应的 cdn url
 * 数组里的第一个 url 是生产模式下使用的，第二个是开发模式下使用的
 * 只有一个 url 表示不区分生产开发模式
 */
const resourceList: Record<string, [string, string] | [string]> = {
  'solid-js': [
    'https://unpkg.com/solid-js@1.7.3/dist/solid.cjs',
    'https://unpkg.com/solid-js@1.7.3/dist/dev.cjs',
  ],
  'solid-js/store': [
    'https://unpkg.com/solid-js@1.7.3/store/dist/store.cjs',
    'https://unpkg.com/solid-js@1.7.3/store/dist/dev.cjs',
  ],
  'solid-js/web': [
    'https://unpkg.com/solid-js@1.7.3/web/dist/web.cjs',
    'https://unpkg.com/solid-js@1.7.3/web/dist/dev.cjs',
  ],
  panzoom: ['https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js'],
  fflate: ['https://unpkg.com/fflate@0.7.4/umd/index.js'],
  dmzj_style: ['https://userstyles.org/styles/chrome/119945.json'],
};
const resource = {
  prod: Object.fromEntries(
    Object.entries(resourceList).map(([k, v]) => [k, v.at(1)]),
  ),
  dev: Object.fromEntries(
    Object.entries(resourceList).map(([k, v]) => [k, v.at(-1)]),
  ),
};

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
  // updateURL:
  //   'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
  // downloadURL:
  //   'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
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

export const buildOptions = (
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

      solidSvg(),
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        exclude: ['node_modules/**'],
        presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
        plugins: ['@babel/plugin-transform-runtime'],
      }),

      watchFiles && isDevMode && watchExternal({ entries: watchFiles }),
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

// 清空 dist 文件夹
shell.rm('-rf', resolve(__dirname, 'dist/*'));

(async () => {
  if (!isDevMode) return;
  // 创建一个 dist 文件夹的文件服务器，用于在浏览器获取最新的脚本代码
  const server = await createServer({
    publicDir: resolve(__dirname, 'dist'),
    server: {
      host: true,
      port: DEV_PORT,
      cors: false,
    },
    plugins: [
      {
        name: 'selfPlugin',
        enforce: 'pre',
        transform(code, id): null | string {
          if (id.includes('node_modules')) return null;
          let newCode = code;
          // 将 vite 不支持的 rollup-plugin-styles 相关 css 导出代码删除
          newCode = newCode.replace(', { css as style }', '');
          newCode = newCode.replace(/\n.+?Style = style;\n/, '');
          return newCode;
        },
      },
      solidSvg(),
      solidPlugin(),
    ],
  });
  // 开启组件的测试服务器
  await server.listen();
  server.printUrls();
})();

export default [
  buildOptions('dev'),
  buildOptions('main'),

  ...fs
    .readdirSync('src/site')
    .map((fileName) => buildOptions(`site/${fileName}`)),

  buildOptions('helper/import', ['dist/cache/main.js']),

  buildOptions('index', ['dist/**/*', '!dist/index.js']),
];
