import fs from 'node:fs';
import { resolve, dirname, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import shell from 'shelljs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import solidPlugin from 'vite-plugin-solid';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';
import type {
  InputPluginOption,
  OutputOptions,
  OutputPluginOption,
  RollupOptions,
} from 'rollup';
import { createServer } from 'vite';
import { parse as parseMd } from 'marked';

import { selfPlugins, solidSvg } from './src/rollup-plugin';
import { getMetaData, updateReadme } from './metaHeader';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEV_PORT = 2405;

const isDevMode = process.env.NODE_ENV === 'development';

const latestChangeHtml = await (() => {
  const md = fs
    .readFileSync(resolve(__dirname, `docs/.other/LatestChange.md`))
    .toString();

  const newMd = md
    .match(/^### [^[].+?$|^\* .+?$/gm)!
    .map((mdText) => {
      switch (mdText[0]) {
        case '#':
          return mdText
            .replaceAll('Features', '新增')
            .replaceAll('Bug Fixes', '修复')
            .replaceAll('Performance Improvements', '优化');
        case '*':
          return mdText.replaceAll(
            /(?<=^\* ):\w+?: |(?<=^.*)\(\[\w+]\(.+?\)\).*/g,
            '',
          );
        default:
          return '';
      }
    })
    .join('\n\n');

  return parseMd(newMd);
})();

const { meta, createMetaHeader } = getMetaData(isDevMode);

const generateScopedName = '[local]';

export const buildOptions = (
  path: string,
  watchFiles?: string[],
  fn?: (options: RollupOptions) => RollupOptions,
): RollupOptions => {
  const isUserScript = ['dev', 'index'].includes(path);

  const dir = isUserScript ? 'dist' : 'dist/cache';
  const fileName = path.endsWith('index.tsx')
    ? path.split('/')[1]
    : basename(path, extname(path));

  const options: RollupOptions = {
    treeshake: true,
    external: [...Object.keys(meta.resource ?? {}), 'main', 'dmzjDecrypt'],
    input: resolve(__dirname, 'src', path),
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
          'inject@LatestChange': latestChangeHtml,
        },

        preventAssignment: true,
      }),
      alias({ entries: { helper: resolve(__dirname, 'src/helper') } }),

      json({ namedExports: false, indent: '  ' }),
      nodeResolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      styles({
        mode: 'extract',
        modules: { generateScopedName },
      }),

      solidSvg() as InputPluginOption,
      babel({
        babelHelpers: 'runtime',
        extensions: ['.ts', '.tsx'],
        exclude: ['node_modules/**'],
        presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
        plugins: [
          '@babel/plugin-transform-runtime',
          [
            '@babel/plugin-proposal-import-attributes-to-assertions',
            { deprecatedAssertSyntax: true },
          ],
        ],
      }),

      watchFiles && isDevMode && watchExternal({ entries: watchFiles }),
    ],
    output: {
      file: `${dir}/${fileName}.js`,
      format: 'cjs',
      strict: false,
      generatedCode: 'es2015',
      extend: true,
      plugins: [
        ...selfPlugins,
        {
          name: 'selfPlugin',
          renderChunk(rawCode) {
            let code = rawCode;

            switch (path) {
              case 'index':
                updateReadme();
                if (isDevMode)
                  code = [
                    `console.time('脚本启动消耗时间')`,
                    code,
                    `console.timeEnd('脚本启动消耗时间')`,
                  ].join('\n');

                code = createMetaHeader(meta) + code;
                break;

              case 'dev':
                code =
                  createMetaHeader({
                    ...meta,
                    name: `${meta.name}Test`,
                    namespace: `${meta.namespace}Test`,
                    updateURL: undefined,
                    downloadURL: undefined,
                  }) + code;
                break;
            }

            return code;
          },
        },
      ],
    },
  };

  return fn ? fn(options) : options;
};

// 清空 dist 文件夹
shell.rm('-rf', resolve(__dirname, 'dist/*'));

(async () => {
  if (!isDevMode) return;
  // 创建一个 dist 文件夹的文件服务器，用于在浏览器获取最新的脚本代码
  const server = await createServer({
    root: resolve(__dirname, 'src'),
    css: { modules: { generateScopedName } },
    server: {
      host: true,
      port: DEV_PORT,
      cors: false,
    },
    resolve: {
      alias: { helper: resolve(__dirname, 'src/helper') },
    },
    plugins: [
      {
        name: 'selfPlugin',
        enforce: 'pre',
        transform(code, id): null | string {
          if (id.includes('node_modules')) return null;
          let newCode = code;
          newCode = newCode.replace('isDevMode', 'true');
          // 将 rollup-plugin-styles 格式转换成 vite 支持的格式
          newCode = newCode.replace(
            /, { css as style }( from '(.+?)';)/,
            `$1\nimport style from '$2?inline';`,
          );
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

const optionList: RollupOptions[] = [
  // // 打包 dmzjDecrypt 时用的配置
  // (() => {
  //   const options = buildOptions(
  //     'helper/dmzjDecrypt',
  //     undefined,
  //     terser({
  //       keep_classnames: true,
  //       keep_fnames: true,
  //       format: { beautify: true, ecma: 2015 },
  //     }),
  //   );
  //   options.output = { ...options.output, name: 'dmzjDecrypt', format: 'umd' };
  //   return options;
  // })(),

  buildOptions('dev'),
  buildOptions('main'),

  ...fs
    .readdirSync('src/site', { withFileTypes: true })
    .map((item) =>
      item.isFile()
        ? buildOptions(`site/${item.name}`)
        : buildOptions(`site/${item.name}/index.tsx`),
    ),

  buildOptions('helper/import', ['dist/cache/main.js']),

  buildOptions('index', ['dist/**/*', '!dist/index.js']),
];

if (!isDevMode)
  optionList.push(
    buildOptions('index', ['dist/**/*', '!dist/index.js'], (options) => {
      (options.output as OutputOptions).file = 'dist/adguard.js';
      Reflect.deleteProperty(options.output!, 'dir');
      ((options.output as OutputOptions).plugins as OutputPluginOption[]).push({
        name: 'selfAdGuardPlugin',
        renderChunk(rawCode) {
          let code = rawCode;

          // 不知道为啥俄罗斯访问不了 npmmirror
          // https://github.com/hymbz/ComicReadScript/issues/170
          // 或许和 unpkg 功能的白名单<https://github.com/cnpm/unpkg-white-list>有关
          // <https://sleazyfork.org/zh-CN/scripts/374903/discussions/248665>
          // 可能再过一段时间就能恢复？但总之目前只能先改用 jsdelivr
          code = code.replaceAll(
            /@resource .+? https:\/\/registry.npmmirror.com\/.+(?=\n)/g,
            (text) =>
              text
                .replace('registry.npmmirror.com/', 'cdn.jsdelivr.net/npm/')
                .replace(/(npm\/[^/]+)\//, '$1@')
                .replace('files/', ''),
          );

          // AdGuard 无法支持简易阅读模式，所以改为只在支持网站上运行
          const indexCode = fs.readFileSync(
            resolve(__dirname, 'src/index.ts'),
            'utf8',
          );
          const matchList = [
            ...indexCode.matchAll(/(?<=\n\s+case ').+?(?=':)/g),
          ]
            .filter(([url]) => !url.includes('siteUrl#'))
            .flatMap(([url]) => `// @match           *://${url}/*`);
          code = code.replace(
            /\/\/ @match \s+ \*:\/\/\*\/\*/,
            matchList.join('\n'),
          );

          // 删掉不支持的菜单 api
          code = code.replaceAll(
            /\/\/ @grant \s+ GM\.(registerMenuCommand|unregisterMenuCommand)\n/g,
            '',
          );

          // 把菜单 api 的调用也改掉
          code = code.replaceAll(
            /await GM\.(registerMenuCommand|unregisterMenuCommand)/g,
            'console.debug',
          );

          // 脚本更新链接也换掉
          code = code.replaceAll(
            '/raw/master/ComicRead.user.js',
            '/raw/master/ComicRead-AdGuard.user.js',
          );

          // 不知道为啥会提示 'Access to function "GM_getValue" is not allowed.'
          // 明明我用的是 GM.getValue。虽然好像对功能没有影响，但以防万一还是加上吧
          code = code.replace(
            /\n(?=\/\/ @grant)/,
            '\n// @grant           GM_getValue\n// @grant           GM_setValue\n',
          );

          return code;
        },
      });
      return options;
    }),
  );

export default optionList;
