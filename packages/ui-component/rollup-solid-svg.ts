/* eslint-disable import/no-extraneous-dependencies */
import { readFile } from 'node:fs/promises';
import type { Plugin, TransformResult } from 'rollup';
import type { Config } from 'svgo';
import { optimize, loadConfig } from 'svgo';
import solid from 'vite-plugin-solid';

type CompilerOptions = {
  allow_props_children?: boolean;
};
export type SolidSVGPluginOptions = {
  /**
   * If true, will export as JSX component if `as` isn't specified.
   *
   * Otherwise will export as JSX component if '?as=component-solid'
   */
  defaultAsComponent?: boolean;
  svgo?: {
    enabled?: boolean;
    svgoConfig?: Config;
  };
  compilerOptions?: CompilerOptions;
};

function compileSvg(source: string, compilerOptions: CompilerOptions) {
  let svgWithProps = source
    .replace(/([{}])/g, "{'$1'}")
    .replace(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
    .replace(/(?<=<svg.*?)(>)/i, '{...props}>');
  if (compilerOptions.allow_props_children) {
    svgWithProps = svgWithProps.replace(
      /\{'\{'\}\s*(props\.children)\s*\{'\}'\}/g,
      '{$1}',
    );
  }
  return `export default (props = {}) => ${svgWithProps}`;
}

async function optimizeSvg(content: string, path: string, svgoConfig?: Config) {
  const config = svgoConfig || (await loadConfig());
  if (config && config.datauri) {
    throw new Error(
      'datauri option for svgo is not allowed when you use vite-plugin-solid-svg. Remove it or use a falsy value.',
    );
  }
  const result = optimize(content, { ...config, path });
  return result.data;
}

/* how this plugin works:
 * The plugin need to transform an svg file to a solid component.
 * To achieve this, in the transform hook, we call the vite-plugin-solid to compile the svg  source into the solid component.
 */

export function solidSvg(options: SolidSVGPluginOptions = {}): Plugin {
  const {
    defaultAsComponent = true,
    svgo = { enabled: true },
    compilerOptions = { allow_props_children: false },
  } = options;

  const extPrefix = 'component-solid';
  const shouldProcess = (qs: string) => {
    const params = new URLSearchParams(qs);
    return (
      (defaultAsComponent && !Array.from(params.entries()).length) ||
      params.has(extPrefix)
    );
  };

  const solidPlugin = solid();

  return {
    name: 'solid-svg',

    async load(id) {
      const [path, qs] = id.split('?');

      if (!path.endsWith('svg')) {
        return null;
      }

      let code = await readFile(path, { encoding: 'utf8' });
      if (svgo.enabled) {
        const optimized = await optimizeSvg(code, path, svgo.svgoConfig);
        code = optimized || code;
      }
      const result = compileSvg(code, compilerOptions);

      return result;
    },

    transform(source, id) {
      const [path, qs] = id.split('?');
      if (path.endsWith('svg') && shouldProcess(qs)) {
        return (solidPlugin.transform as any).bind(this)(
          source,
          `${path}.tsx`,
        ) as TransformResult;
      }
      return null;
    },
  };
}
