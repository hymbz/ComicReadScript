import { byPath } from 'helper';
import { type RolldownPluginOption } from 'rolldown';

import { langList } from '../../src/helper/languages';
import { readFile } from '../lib/utils';
import { codeEdit } from './codeEdit';
import { copyApi } from './copyApi';
import { ehRules } from './ehRules';
import { siteUrl } from './siteUrl';

export { solidSvg } from './rollup-solid-svg';
export { cssModules } from './cssModules';

const langMap: Record<string, object> = {};
for (const langName of langList) {
  const json = readFile(`locales/${langName}.json`);
  Reflect.set(langMap, langName, JSON.parse(json));
}

/** 转义字符串以便能放进模板字符串内 */
export const escapeTmplText = (text: string) =>
  text
    .replaceAll('\\', String.raw`\\`)
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${');

export const outputPlugins: RolldownPluginOption[] = [
  {
    // 不输出 css 文件
    name: 'self-clear',
    generateBundle(_, bundle) {
      for (const key of Object.keys(bundle))
        if (key.endsWith('.css')) Reflect.deleteProperty(bundle, key);
    },
    renderChunk: (code) =>
      // 删除单独的 require 语句和注释
      code.replaceAll(
        /\nrequire.+;|\n\/\*\*.+?\*\/\n(?=\n)|\n\/\/ .+\n(?=\n)/g,
        '',
      ),
  },
  // 实现 extractI18n 函数，单独提取指定的 i18n 语句出来使用
  codeEdit('self-extractI18n', (code) =>
    code.replaceAll(
      /extractI18n\((["'])(.+?)\1\)/g,
      (_, _quote, key) => `((lang) => {
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
  ),
  siteUrl,
  copyApi,
  ehRules,
];
