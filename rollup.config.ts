import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import shell from 'shelljs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';
import type {
  InputPluginOption,
  OutputPluginOption,
  RollupOptions,
} from 'rollup';
import { parse as parseMd } from 'marked';

import { inputPlugins, outputPlugins, solidSvg } from './src/rollup-plugin';
import { getMetaData, updateReadme } from './src/rollup-plugin/metaHeader';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
          return mdText.replaceAll(/(?<=^\* ):\w+?: |(?<=^.*)\(\[.*/g, '');
        default:
          return '';
      }
    })
    .join('\n\n');

  return parseMd(newMd);
})();

const { meta, createMetaHeader } = getMetaData(isDevMode);

const generateScopedName = '[local]___[hash:base64:5]';

/** 单独打包的代码 */
const packlist = [
  'helper/languages',
  'helper',
  'request',
  'components/Manga',
  'components/IconButton',
  'components/Fab',
  'components/Toast',
  'userscript/dmzjApi',
  'userscript/detectAd',
  'userscript/main',
  'worker/ImageRecognition',
  'worker/detectAd',
  'userscript/otherSite',
  'userscript/ehTagRules',
];

const babelConfig = {
  presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
  plugins: [
    '@babel/plugin-transform-runtime',
    [
      '@babel/plugin-proposal-import-attributes-to-assertions',
      { deprecatedAssertSyntax: true },
    ],
  ],
};

const baseOptions = {
  treeshake: true,
  external: [
    ...Object.keys(meta.resource ?? {}),
    ...packlist,
    'dmzjDecrypt',
    'dmzjApi',
    'main',
    /^solid/,
  ],
  input: '',
  // 忽略使用 eval 的警告
  onwarn: undefined as RollupOptions['onwarn'],
  plugins: [] as InputPluginOption,
  output: {
    file: '',
    format: 'cjs',
    strict: false,
    generatedCode: 'es2015',
    extend: true,
    plugins: [] as OutputPluginOption[],
  },
} satisfies RollupOptions;

export const buildOptions = (
  path: string,
  watchFiles?: string[],
  fn?: (options: typeof baseOptions) => RollupOptions,
): RollupOptions => {
  const options = structuredClone(baseOptions);

  options.input = path.startsWith('src')
    ? path
    : resolve(__dirname, 'src', path);

  options.plugins = [
    replace({
      values: {
        isDevMode: `${isDevMode}`,
        'process.env.NODE_ENV': isDevMode ? `'development'` : `'production'`,
        'inject@LatestChange': latestChangeHtml,
      },
      preventAssignment: true,
    }),
    alias({
      entries: {
        helper: resolve(__dirname, 'src/helper'),
        worker: resolve(__dirname, 'src/worker'),
      },
    }),
    json({ namedExports: false, compact: true }),
    nodeResolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
    commonjs({ strictRequires: 'auto' }),
    styles({ mode: 'extract', modules: { generateScopedName } }),
    solidSvg(),

    // ts({ transpiler: 'babel', transpileOnly: true, babelConfig }),

    babel({
      babelHelpers: 'runtime',
      extensions: ['.ts', '.tsx'],
      exclude: ['node_modules/**'],
      ...babelConfig,
    }),

    ...inputPlugins,
    watchFiles && isDevMode && watchExternal({ entries: watchFiles }),
  ];

  Object.assign(options.output, {
    file: `dist/${path.replace(/(\/index)?\.tsx?/, '')}.js`,
    plugins: [
      ...outputPlugins,
      {
        name: 'selfPlugin',
        renderChunk(rawCode) {
          let code = rawCode;

          switch (path) {
            case 'index': {
              updateReadme();
              if (isDevMode)
                code = `
                  console.time('脚本启动消耗时间');
                  ${code}
                  console.timeEnd('脚本启动消耗时间');
                `;

              const importCode = fs
                .readFileSync(`dist/userscript/import.js`)
                .toString()
                .replaceAll('require$1', 'require');
              code = `${createMetaHeader(meta)}\n${importCode}\n${code}`;

              break;
            }

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
  });

  options.onwarn = (warning, warn) => {
    if (warning.code !== 'EVAL') warn(warning);
  };

  return fn ? fn(options) : options;
};

// 清空 dist 文件夹
shell.rm('-rf', resolve(__dirname, 'dist/*'));
// 创建 dist 的文件服务器
if (isDevMode)
  shell.exec('serve dist --cors -l 2405', { async: true, silent: true });

const optionList: RollupOptions[] = [
  buildOptions('dev'),

  ...packlist.map((path) => buildOptions(path)),

  ...fs
    .readdirSync('src/site', { withFileTypes: true })
    .map((item) =>
      buildOptions(
        item.isFile() ? `site/${item.name}` : `site/${item.name}/index.tsx`,
      ),
    ),

  buildOptions(
    'userscript/import',
    packlist.map((path) => `dist/${path}.js`),
    (options) => {
      options.output.plugins.unshift({
        name: 'selfImport',
        renderChunk(rawCode) {
          return rawCode.replace(
            /\s+\/\/ import list/,
            packlist
              .map((path) => {
                if (path === 'userscript/main') return '';
                return `\ncase '${path}':\ncode = \`inject('${path}')\`;\nbreak;`;
              })
              .join(''),
          );
        },
      });
      return options;
    },
  ),

  buildOptions('index', ['dist/**/*', '!dist/index.*js']),
];

if (!isDevMode)
  optionList.push(
    buildOptions('index', ['dist/**/*', '!dist/index.js'], (options) => {
      options.output.file = 'dist/adguard.js';
      Reflect.deleteProperty(options.output, 'dir');
      options.output.plugins.push({
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
