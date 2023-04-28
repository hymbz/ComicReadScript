/* eslint-disable import/no-relative-packages */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { InlineConfig } from 'vite';
import { createServer, build as viteBuild } from 'vite';

import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';
// import type { MetaValues } from 'rollup-plugin-userscript-metablock';
// import metablock from 'rollup-plugin-userscript-metablock';
import banner from 'vite-plugin-banner';

import solid from 'vite-plugin-solid';
import SolidSvg from 'vite-plugin-solid-svg';

import type { Plugin } from 'rollup';
import pkg from '../../package.json' assert { type: 'json' };
import resource from '../userscript/resource.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

const isDevMode = process.env.NODE_ENV === 'development';

/** 开发服务器的端口 */
const DEV_PORT = '2405';

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
          return `// @${key}\n`;
        case 'object':
          return Array.isArray(val)
            ? val
                .map((v) => `// @${key.padEnd(keyLength, ' ')} ${v}\n`)
                .join('')
            : Object.entries(val)
                .map(
                  ([k, v]) => `// @${key.padEnd(keyLength, ' ')} ${k} ${v}\n`,
                )
                .join('');
        default:
          return `// @${key.padEnd(keyLength, ' ')} ${val}\n`;
      }
    })
    .join('');
  return `// ==UserScript==\n${metaStr}// ==/UserScript==\n`;
})();

const build = (
  fileName: string,
  watchFiles?: string[],
  ...plugins: Array<Plugin | false>
) => {
  const isUserScript = ['dev', 'index'].includes(fileName);

  return viteBuild({
    configFile: false,
    root: __dirname,
    optimizeDeps: { disabled: true },
    build: {
      terserOptions: {
        mangle: false,
      },
      watch: isDevMode ? {} : null,
      minify: !isDevMode,
      reportCompressedSize: false,
      // dev 和 index 外的文件都放到 cache 文件夹下
      outDir: isUserScript ? 'dist' : 'dist/cache',
      // 首次运行时清空下文件夹
      emptyOutDir: fileName === 'dev',
      lib: {
        name: fileName,
        entry: resolve(__dirname, 'src', fileName),
        formats: ['cjs'],
        fileName,
      },
      rollupOptions: {
        treeshake: false,
        external: [...Object.keys(meta.resource ?? {}), '../main'],
        output: {
          format: 'cjs',
          strict: false,
          generatedCode: 'es2015',
          extend: true,
        },
        plugins: [
          replace({
            values: {
              DEV_PORT,
              isDevMode: `${isDevMode}`,
              'process.env.NODE_ENV': isDevMode
                ? `'development'`
                : `'production'`,
            },
            preventAssignment: true,
          }),
          watchFiles && isDevMode && watchExternal({ entries: watchFiles }),
          ...plugins,
        ],
      },
    },
    plugins: [
      {
        enforce: 'pre',
        name: 'selfPlugin',
        // 不输出 css 文件
        generateBundle: (_, bundle) => {
          Reflect.deleteProperty(bundle, 'style.css');
        },
        renderChunk(code) {
          let newCode = code;
          // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
          newCode = newCode.replace(/[ ]*inject\("(.+)"\);/g, (_, name) => {
            const path =
              name[0] === '/'
                ? `dist/cache${name}.cjs`
                : `dist/cache/site/${name}.tsx.cjs`;
            return fs.readFileSync(resolve(__dirname, path))?.toString();
          });
          // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
          newCode = newCode.replace(/Object\.defineProperty.+?\n/g, '');

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
              newCode = code.replace(
                /inject\("main"\)/,
                () =>
                  `\`\n${fs
                    .readFileSync('./dist/cache/main.cjs')
                    .toString()
                    .replaceAll('\\', '\\\\')
                    .replaceAll('`', '\\`')
                    .replaceAll('${', '\\${')}\``,
              );
              break;
          }

          return newCode;
        },
      },
      SolidSvg({
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
      solid(),
    ],
  });
};

(async () => {
  // await build('dev', undefined);
  // await build('main');

  // await Promise.all(
  //   fs.readdirSync('src/site').map((fileName) => build(`site/${fileName}`)),
  // );

  await build('helper/import', ['dist/cache/main.cjs']);

  // await build('index', ['dist/**/*', '!dist/index.cjs'], banner(metaHeader));

  // if (!isDevMode) return;
  //  // 创建一个 dist 文件夹的文件服务器，用于在浏览器获取最新的脚本代码
  // const server = await createServer({
  //   publicDir: 'dist',
  // });
  // // 开启组件的测试服务器
  // await server.listen();
  // server.printUrls();
})();
