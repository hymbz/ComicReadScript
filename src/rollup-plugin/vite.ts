import type { PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import solidPlugin from 'vite-plugin-solid';

import { solidSvg } from './rollup-solid-svg';

const worker: PluginOption[] = [
  {
    name: 'self-worker-pre',
    enforce: 'pre',
    // 将 worker 的导入改成默认导入，并为路径加上 ?worker
    transform: (code) =>
      code.replaceAll(
        /import \* as (.+?) from '(worker\/.+?)'/g,
        (_, varName, _path) => `import ${varName} from '${_path}?worker'`,
      ),
  },
  {
    name: 'self-worker-post',
    enforce: 'post',
    transform(code, path) {
      // 修改 vite 对 ?worker 模块的导入代码，改成返回 comlink 包装后的 worker
      if (path.endsWith('?worker')) {
        const workerUrl = /Worker\(\s+"(.+?)"/.exec(code)![1];
        return `
import * as Comlink from 'comlink';
const worker = Comlink.wrap(new Worker("${workerUrl}", { type: "module" }));
export default worker;`;
      }

      // 为加载的 worker 代码增加 comlink 包装
      if (path.endsWith('?worker_file&type=module')) {
        const exports: string[] = [];
        let newCode = code
          .replaceAll(/export {\s+(.+?)\s+}/g, (_, varName) => {
            exports.push(varName);
            return `import { ${varName} }`;
          })
          .replaceAll(/export const (.+?) =/g, (_, varName) => {
            exports.push(varName);
            return `const ${varName} =`;
          });
        newCode += `
import * as Comlink from 'comlink';
Comlink.expose({ ${exports.join(', ')} });`;
        return newCode;
      }

      return null;
    },
  },
];

const isVitest = process.env.VITEST === 'true';

export const vitePlugins: PluginOption[] = [
  tsconfigPaths(),
  ...worker,
  {
    name: 'self-styles-replace',
    enforce: 'pre',
    transform(code, id): null | string {
      if (id.includes('node_modules')) return null;

      return (
        code
          .replace('isDevMode', `${!isVitest}`)
          // 将 vite 不支持的 rollup-plugin-styles 相关 css 导出代码改成正常的代码
          .replaceAll(
            /import classes(, { css as style })? from '(.+?)'/g,
            (_, styleVar, path) =>
              `import classes from '${path}';${styleVar ? `\nimport style from '${path}?inline'` : ''}`,
          )
      );
    },
  },
  solidSvg(),
  !isVitest && solidPlugin(),
];
