import type { TransformResult } from 'rollup';
import type { Config } from 'svgo';
import type { Plugin } from 'vite';

import { readFile } from 'node:fs/promises';
import { optimize } from 'svgo';
import solid from 'vite-plugin-solid';

/** svgo 配置 */
const svgoConfig: Config = {
  plugins: [
    'preset-default',
    'removeDimensions',
    {
      name: 'addAttributesToSVGElement',
      params: {
        attribute: {
          stroke: 'currentColor',
          fill: 'currentColor',
          'stroke-width': '0',
        },
      },
    },
  ],
};

const optimizeSvg = (content: string, path: string) => {
  if (svgoConfig.datauri) throw new Error('禁止使用 datauri 选项');

  const result = optimize(content, { ...svgoConfig, path });
  return result.data;
};

const getSvgCode = async (path: string) => {
  const code = await readFile(path, { encoding: 'utf8' });
  const optimized = optimizeSvg(code, path);
  return optimized || code;
};

/** 将导入的 svg 转为 solidjs 组件 */
export const solidSvg = (): Plugin => {
  const solidPlugin = solid();

  return {
    name: 'solid-svg',
    enforce: 'pre',

    async load(path) {
      if (!path.endsWith('.svg')) return null;

      const code = await getSvgCode(path);
      return `export default (props = {}) => ${code
        .replaceAll(/([{}])/g, "{'$1'}")
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        .replaceAll(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
        .replace(/(?<=<svg.*?)(>)/i, ' {...props}>')}`;
    },

    async transform(rawCode, path) {
      if (path.endsWith('.svg'))
        return (solidPlugin.transform as any).bind(this)(
          rawCode,
          `${path}.tsx`,
        ) as TransformResult;

      let code = rawCode;

      // 将结尾带有 `?raw` 的导入替换成对应的字符串变量
      for (const [raw, name, _path] of rawCode.matchAll(
        /import (\w+) from '(.+\.svg)\?raw';/g,
      )) {
        const svgPath = (await this.resolve(_path))!.id;
        const svgCode = await getSvgCode(svgPath);
        code = code.replaceAll(raw, `const ${name} = \`${svgCode}\`;\n`);
      }

      if (code === rawCode) return null;
      return code;
    },
  };
};
