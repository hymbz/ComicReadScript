import { type TransformFn } from '../plugin/codeEdit';
import { getCopyMangaHosts } from '../plugin/copyMangaApi';
import { siteUrl } from '../plugin/siteUrl';
import { createMetaHeader, isDevMode, meta } from './ctx';
import { minifyCode, pathResolve, readFile } from './utils';

export const transforms = {
  /** 拼接 import.js + meta 头到产物顶部 */
  importEmbed: async (code, _chunk, addWatchFile) => {
    if (isDevMode)
      code = `\nconsole.time('脚本启动消耗时间');\n${code}\nconsole.timeEnd('脚本启动消耗时间');\n`;

    const importFile = pathResolve('dist/userscript/import.js');
    addWatchFile?.(importFile);
    const importCode = readFile(importFile)
      .replaceAll('require$1', 'require')
      .replaceAll(/^exports\.(?<_>require|selfImport)+\s*=\s*.+;\n?/gmu, '');

    // 加入拷贝漫画的 api 主机
    const hosts = await getCopyMangaHosts();
    const metaData = {
      ...meta,
      connect: [
        ...new Set([...meta.connect, ...hosts.content, ...hosts.mobile]),
      ],
    };

    return [createMetaHeader(metaData), importCode, code].join('\n');
  },

  dev: (code) =>
    createMetaHeader({
      ...meta,
      // 添加 Test 后缀，避免与正式脚本冲突
      name: `${meta.name}Test`,
      namespace: `${meta.namespace}Test`,
      // 去除更新链接，防止开发版本被自动更新覆盖
      updateURL: undefined,
      downloadURL: undefined,
    }) + code,

  /** AdGuard 变体的输出变换函数 */
  adGuard: async (code, chunk) => {
    // 不知道为啥俄罗斯访问不了 npmmirror，只能改用 jsdelivr
    // https://github.com/hymbz/ComicReadScript/issues/170
    code = code.replaceAll(
      /registry\.npmmirror\.com\/(?<pkg>.+)\/(?<version>\d+\.\d+\.\d)\/files\/(?<file>.+)/gu,
      'cdn.jsdelivr.net/npm/$<pkg>@$<version>/$<file>',
    );

    // AdGuard 无法支持简易阅读模式，所以改为只在支持网站上运行
    let indexCode = readFile(pathResolve('src/index.ts'));
    indexCode = await siteUrl.renderChunk(indexCode, chunk);
    const matchList = [
      ...indexCode.matchAll(/(?<=\n {4}case ').+?(?=':)/gu),
    ].flatMap(([url]) => `// @match           *://${url}/*`);
    code = code.replace(/\/\/ @match \s+ \*:\/\/\*\/\*/u, matchList.join('\n'));

    // 删掉不支持的菜单 api
    code = code.replaceAll(
      /\/\/ @grant \s+ GM\.(?<fn>registerMenuCommand|unregisterMenuCommand)\n/gu,
      '',
    );

    // 把菜单 api 的调用也改掉
    code = code.replaceAll(
      /await GM\.(?<fn>registerMenuCommand|unregisterMenuCommand)/gu,
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
      /\n(?=\/\/ @grant)/u,
      '\n// @grant           GM_getValue\n// @grant           GM_setValue\n',
    );

    return code;
  },

  /** 创建 UMD 主包的输出变换函数 */
  umdMain: async (code) => {
    const importCode = readFile(pathResolve('dist/umd/import.js')).replaceAll(
      'require$1',
      'require',
    );
    code = `${importCode}\n${code}`;

    if (!isDevMode) code = await minifyCode(code);

    const name = 'ComicReadScript';
    return `
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.${name} = global.${name} || {}));
})(this, (function (exports) {
${code}
}));`;
  },
} satisfies Record<string, TransformFn>;
