import type { PluginOption } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import solidPlugin from 'vite-plugin-solid';

import { solidSvg } from './rollup-solid-svg';

export const vitePlugins: PluginOption[] = [
  tsconfigPaths(),
  {
    // 将 vite 不支持的 rollup-plugin-styles 相关 css 导出代码改成正常的代码
    name: 'self-styles-replace',
    enforce: 'pre',
    transform(code, id): null | string {
      if (id.includes('node_modules')) return null;
      let newCode = code;
      newCode = newCode.replace('isDevMode', 'true');
      newCode = newCode.replace(
        /(\n.+?), { css as style }(.+?\n)/,
        '$1$2const style = ""',
      );
      newCode = newCode.replace(
        /\nimport { css as style } from .+?;\n/,
        '\nconst style = ""\n',
      );
      return newCode;
    },
  },
  solidSvg(),
  solidPlugin(),
];
