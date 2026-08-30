import { type PluginOption } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import { solidSvg } from './rollup-solid-svg';

const worker: PluginOption[] = [
  {
    name: 'self-worker-pre',
    enforce: 'pre',
    // 将 worker 的命名空间导入改为手动 Comlink 包装
    transform: (code) =>
      code.replaceAll(
        /import \* as (?<varName>.+?) from '(?<path>worker\/.+?)'/gu,
        `
import WorkerWrapper from '$<path>?worker';
const $<varName> = Comlink.wrap(new WorkerWrapper());`,
      ),
  },
  {
    name: 'self-worker-post',
    enforce: 'post',
    transform(code, id) {
      // 为加载的 worker 代码增加 comlink 包装
      if (
        /src\/worker\/[^/\\]+?\/index\.ts/u.test(id) &&
        !/\?worker(?:&|$)/u.test(id)
      ) {
        const exports: string[] = [];
        let newCode = code
          // export { Foo } from './bar' → 转为 import，创建本地变量供 Comlink.expose 使用
          .replaceAll(
            /export \{\s*(?<specifiers>[^}]+?)\s*\}\s*from\s+(?<quote>["'])(?<fromPath>.+?)\k<quote>;/gu,
            (_, ...captures) => {
              const [specifiers, _quote, fromPath] = captures;
              const runtimeNames = specifiers
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
                .filter((s) => !/^type\s+/u.test(s))
                .map((s) => s.replace(/^type\s+/u, ''));
              exports.push(...runtimeNames);
              return `import { ${specifiers} } from "${fromPath}";\nexport { ${specifiers} };`;
            },
          )
          // export { Foo }; → 保留导出语句（其他模块需要），同时记录到 exports
          .replaceAll(/export \{\s+(?<varName>\S+)\s+\};/gu, (_, varName) => {
            exports.push(varName);
            return `export { ${varName} };`;
          })
          // export const/function Foo → 保留导出语句，记录到 exports
          .replaceAll(
            /export (?<keyword>const|function|class) (?<varName>\w+)/gu,
            (_, keyword, varName) => {
              exports.push(varName);
              return `export ${keyword} ${varName}`;
            },
          );
        newCode += `
import * as Comlink from 'comlink';
Comlink.expose({ ${[...new Set(exports)].join(', ')} });`;
        return newCode;
      }

      return null;
    },
  },
];

export const vitePlugins: PluginOption[] = [
  ...worker,
  solidSvg(),
  process.env.VITEST !== 'true' && solidPlugin(),
];
