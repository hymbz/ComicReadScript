import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import type { OutputPluginOption } from 'rollup';

import { byPath } from '../helper/other';
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

export const selfPlugins: OutputPluginOption[] = [
  {
    // 不输出 css 文件
    name: 'self-clear',
    generateBundle(_, bundle) {
      for (const key of Object.keys(bundle))
        if (key.endsWith('.css')) Reflect.deleteProperty(bundle, key);
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
    // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
    name: 'self-inject',
    renderChunk(rawCode) {
      let code = rawCode;
      code = code.replaceAll(
        / *(`)?inject\('(.+?)'\)`?;?/g,
        (_, isTmplStr, path) => {
          const file = fs
            .readFileSync(resolve(__dirname, `../../dist/${path}.js`))
            .toString();

          if (isTmplStr !== undefined) {
            return `\`\n${file
              .replaceAll('\\', '\\\\')
              .replaceAll('`', '\\`')
              .replaceAll('${', '\\${')}\`;`;
          }

          return file;
        },
      );
      return code;
    },
  },
  {
    // 实现 extractI18n 函数，单独提取指定的 i18n 语句出来使用
    name: 'self-extractI18n',
    renderChunk(rawCode) {
      let code = rawCode;
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
  },
  {
    // 不知道为啥，打包出来的 web.template 调用会提前声明，导致 solidjs 也提前导入了
    name: 'self-tmplMove',
    renderChunk(rawCode) {
      let code = rawCode;

      const map = new Map<string, string>();
      code = code.replaceAll(
        /(\nvar)?\s+?(_tmpl.+?) = \/\*#__PURE__\*\/(web.template\(`.+?`\))(,|;)/g,
        (_, __, name, tmpl) => {
          map.set(name, tmpl);
          return '';
        },
      );
      for (const [name, tmpl] of map)
        code = code.replaceAll(`${name}()`, `${tmpl}()`);

      return code;
    },
  },
  siteUrl,
];
