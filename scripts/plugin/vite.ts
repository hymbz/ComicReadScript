import { type PluginOption } from 'vite';
import solidPlugin from 'vite-plugin-solid';

import { solidSvg } from './rollup-solid-svg';

const worker: PluginOption[] = [
  {
    name: 'self-worker-pre',
    enforce: 'pre',
    // 将 worker 的导入改成默认导入，并为路径加上 ?worker
    transform: (code) =>
      code.replaceAll(
        /import \* as (?<varName>.+?) from '(?<path>worker\/.+?)'/gu,
        `import $<varName> from '$<path>?worker'`,
      ),
  },
  {
    name: 'self-worker-post',
    enforce: 'post',
    transform(code, id) {
      // 修改 vite 对 ?worker 模块的导入代码，改成返回 comlink 包装后的 worker
      if (id.endsWith('?worker')) {
        const workerUrl = /Worker\(\s*new\s+URL\(\s*"(?<workerUrl>.+?)"/u.exec(
          code,
        )?.groups?.workerUrl;
        if (!workerUrl) return null;
        return `
import * as Comlink from 'comlink';
const worker = Comlink.wrap(new Worker("${workerUrl}", { type: "module" }));
export default worker;`;
      }

      // 为加载的 worker 代码增加 comlink 包装
      if (/src\/worker\/.+?\/index.ts/u.test(id)) {
        const exports: string[] = [];
        let newCode = code
          // export { Foo } from './bar' → 转为 import，创建本地变量供 Comlink.expose 使用
          .replaceAll(
            /export \{\s+(?<varName>\S+)\s+\}\s+from\s+"(?<fromPath>[^"]+)";/gu,
            (_, varName, fromPath) => {
              exports.push(varName);
              return `import { ${varName} } from "${fromPath}";\nexport { ${varName} };`;
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
Comlink.expose({ ${exports.join(', ')} });`;
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
