import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import type { OutputPluginOption } from 'rollup';

import { byPath } from '../helper';
import { langList } from '../helper/languages';

import { siteUrl } from './siteUrl';

export { solidSvg } from './rollup-solid-svg';

const __dirname = dirname(fileURLToPath(import.meta.url));

const langMap: Record<string, object> = {};
for (const langName of langList) {
  const json = fs
    .readFileSync(resolve(__dirname, `../../locales/${langName}.json`))
    .toString();
  Reflect.set(langMap, langName, JSON.parse(json));
}

const extractI18n: OutputPluginOption = {
  name: 'self-extractI18n',
  renderChunk(rawCode) {
    let code = rawCode;
    // 实现 extractI18n 函数
    if (code.includes('extractI18n')) {
      code = code.replaceAll(
        /extractI18n\('(.+)'\)/g,
        (_, key) => `((lang) => {
            switch (lang) {
              ${langList
                .filter((l) => l !== 'zh')
                .map(
                  (langName) =>
                    `case '${langName}': return '${byPath<string>(
                      langMap[langName],
                      key,
                    )}';`,
                )
                .join('')}
              default: return '${byPath<string>(langMap.zh, key)}';
            }
          })`,
      );
    }

    return code;
  },
};

export const selfPlugins: OutputPluginOption[] = [
  {
    name: 'self-clear',
    // 不输出 css 文件
    generateBundle(_, bundle) {
      Reflect.deleteProperty(bundle, 'style.css');
    },
    renderChunk(rawCode) {
      let code = rawCode;
      // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
      code = code.replace(/Object\.defineProperty.+?\n\n/, '');
      // 删除 exports.require 语句
      code = code.replace(/\n\nexports\.require.+;/, '');
      // 删除单独的 require 语句和注释
      code = code.replaceAll(
        /\nrequire.+;|\n\/\*\*.+?\*\/\n(?=\n)|\n\/\/ .+?\n(?=\n)/g,
        '',
      );
      return code;
    },
  },
  {
    name: 'self-inject',
    renderChunk(rawCode) {
      let code = rawCode;
      // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
      code = code.replaceAll(/ *inject\('(.+?)'\)/g, (_, name) => {
        switch (name) {
          case 'main':
            return `\`\n${fs
              .readFileSync(resolve(__dirname, '../../dist/cache/main.js'))
              .toString()
              .replaceAll('\\', '\\\\')
              .replaceAll('`', '\\`')
              .replaceAll('${', '\\${')}\``;

          default:
            return fs
              .readFileSync(resolve(__dirname, `../../dist/cache/${name}.js`))
              .toString()
              .replaceAll('require$1', 'require');
        }
      });
      return code;
    },
  },
  extractI18n,
  siteUrl,
];
