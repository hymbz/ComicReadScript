import fs from 'node:fs';

import type { InputPluginOption, OutputPluginOption } from 'rollup';

import { byPath } from '../helper/other';
import { langList } from '../helper/languages';

import { siteUrl } from './siteUrl';
import { ehRules } from './ehRules';

export { solidSvg } from './rollup-solid-svg';

const langMap: Record<string, object> = {};
for (const langName of langList) {
  const json = fs.readFileSync(`locales/${langName}.json`).toString();
  Reflect.set(langMap, langName, JSON.parse(json));
}

const readCode = (path: string, isTmpl: boolean) => {
  const code = fs.readFileSync(path).toString();
  if (!isTmpl) return code;
  return `\`\n${escapeTmplText(code)}\``;
};

/** 转义字符串以便能放进模板字符串内 */
const escapeTmplText = (text: string) =>
  text.replaceAll('\\', '\\\\').replaceAll('`', '\\`').replaceAll('${', '\\${');

export const outputPlugins: OutputPluginOption[] = [
  {
    // 不输出 css 文件
    name: 'self-clear',
    generateBundle(_, bundle) {
      for (const key of Object.keys(bundle))
        if (key.endsWith('.css')) Reflect.deleteProperty(bundle, key);
    },
    renderChunk: (code) =>
      code
        // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
        .replace(/Object\.defineProperty.+?\n\n/, '')
        // 删除 exports.require 语句
        .replace(/\n\nexports\.require.+;/, '')
        // 删除单独的 require 语句和注释
        .replaceAll(
          /\nrequire.+;|\n\/\*\*.+?\*\/\n(?=\n)|\n\/\/ .+?\n(?=\n)/g,
          '',
        ),
  },
  {
    // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
    name: 'self-inject',
    renderChunk: (code) =>
      code.replaceAll(/ *(`)?inject\('(.+?)'\)`?;?/g, (_, isTmplStr, path) =>
        readCode(`dist/${path}.js`, isTmplStr !== undefined),
      ),
  },
  {
    // 实现 extractI18n 函数，单独提取指定的 i18n 语句出来使用
    name: 'self-extractI18n',
    renderChunk: (code) =>
      code.replaceAll(
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
      ),
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
  ehRules,
];

export const inputPlugins: InputPluginOption[] = [
  {
    name: 'self-import',
    async transform(code, path) {
      if (!/.+\.tsx?$/.test(path)) return null;
      // rollup 对 import * as 的处理会导致脚本加载机制失效，
      // 为了兼容 vite，不能直接删掉 `* as`，只能在这里修改代码
      return code.replaceAll(/import \* as (?=\w)/g, 'import ');
    },
  },
];
