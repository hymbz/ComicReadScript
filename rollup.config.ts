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
import json from '@rollup/plugin-json';

import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';

import type { Plugin, RollupOptions } from 'rollup';
import { createServer } from 'vite';
import { parse as parseMd } from 'marked';
import { selfPlugins, solidSvg } from './src/rollup-plugin';
import { getMetaData, updateReadme } from './metaHeader';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEV_PORT = 2405;

const isDevMode = process.env.NODE_ENV === 'development';

const { meta, createMetaHeader } = getMetaData(isDevMode);

const latestChangeHtml = (() => {
  const md = fs
    .readFileSync(resolve(__dirname, `docs/LatestChange.md`))
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
          return mdText
            .replace(/(?<=^\* ):\w+?: /, '')
            .replace(/(?<=^.*)\(\[\w+\]\(.+?\)\).*/, '');
        default:
          return '';
      }
    })
    .join('\n\n');

  return parseMd(newMd);
})();

export const buildOptions = (
  fileName: string,
  watchFiles?: string[],
  ...plugins: Array<Plugin | false>
): RollupOptions => {
  const isUserScript = ['dev', 'index'].includes(fileName);

  return {
    treeshake: true,
    external: [...Object.keys(meta.resource ?? {}), 'main', 'dmzjDecrypt'],
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
          'inject@LatestChange': latestChangeHtml,
        },

        preventAssignment: true,
      }),
      alias({ entries: { helper: resolve(__dirname, 'src/helper') } }),

      json({ namedExports: false, indent: '  ' }),
      nodeResolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
      commonjs(),
      styles({ mode: 'extract', modules: true }),

      solidSvg(),
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
      ...plugins,
    ],
    output: {
      // dev 和 index 外的文件都放到 cache 文件夹下
      dir: resolve(__dirname, isUserScript ? 'dist' : 'dist/cache'),
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

            switch (fileName) {
              case 'index': {
                updateReadme();
                if (isDevMode)
                  code = [
                    `console.time('脚本启动消耗时间')`,
                    code,
                    `console.timeEnd('脚本启动消耗时间')`,
                  ].join('\n');

                code = createMetaHeader(meta) + code;
                break;
              }

              case 'dev': {
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
            }

            return code;
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
    root: resolve(__dirname, 'src'),
    publicDir: resolve(__dirname, 'dist'),
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
    .readdirSync('src/site')
    .map((fileName) => buildOptions(`site/${fileName}`)),

  buildOptions('helper/import', ['dist/cache/main.js']),

  buildOptions('index', ['dist/**/*', '!dist/index.js']),
];
