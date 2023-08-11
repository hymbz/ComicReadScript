/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import shell from 'shelljs';
// import terser from '@rollup/plugin-terser';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import solidPlugin from 'vite-plugin-solid';

import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';

import type { Plugin, RollupOptions } from 'rollup';
import { createServer } from 'vite';
import { solidSvg } from './src/rollup-solid-svg';
import { getMetaData, updateReadme } from './metaHeader';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEV_PORT = 2405;

const isDevMode = process.env.NODE_ENV === 'development';

const { meta, createMetaHeader } = getMetaData(isDevMode);

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
      plugins: [
        {
          name: 'selfPlugin',
          // 不输出 css 文件
          generateBundle: (_, bundle) => {
            Reflect.deleteProperty(bundle, 'style.css');
          },
          renderChunk(rawCode) {
            let code = rawCode;
            // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
            code = code.replaceAll(/[ ]*inject[(<]'(.+)'\);/g, (_, name) => {
              switch (name) {
                case 'main':
                  return `\`\n${fs
                    .readFileSync(resolve(__dirname, 'dist/cache/main.js'))
                    .toString()
                    .replaceAll('\\', '\\\\')
                    .replaceAll('`', '\\`')
                    .replaceAll('${', '\\${')}\``;

                case 'LatestChange':
                  return `\`\n${fs
                    .readFileSync(resolve(__dirname, `docs/LatestChange.md`))
                    .toString()}\`;`;

                default:
                  return fs
                    .readFileSync(resolve(__dirname, `dist/cache/${name}.js`))
                    .toString()
                    .replaceAll('require$1', 'require');
              }
            });

            // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
            code = code.replace(/Object\.defineProperty.+?\n\n/, '');
            // 删除 exports.require 语句
            code = code.replace(/\n\nexports\.require.+;/, '');
            // 删除单独的 require 语句和注释
            code = code.replaceAll(
              /\nrequire.+;|\n\/\*\*.+?\*\/\n(?=\n)|\n\/\/ .+?\n(?=\n)/g,
              '',
            );

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
