declare const isDevMode: boolean;

const GMRe = /^GM/;
const gmApiList = Object.keys(window).filter((name) => GMRe.test(name));
const gmApiMap = Object.fromEntries(
  gmApiList.map((name) => [name, window[name]]),
);

unsafeWindow.crsLib = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: { env: { NODE_ENV: process.env.NODE_ENV } },
  // 把 GM API 放进去以便使用
  ...gmApiMap,
};

const getCode = (name: string) => {
  if (name === '../main') return inject('main');
  if (name.includes('./')) return GM_getResourceText(name.split('/').at(-1)!);
  return GM_getResourceText(name);
};

/**
 * 通过 Resource 导入外部模块
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name: string) => {
  const code = getCode(name);
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 通过提供 cjs 环境的变量来兼容 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  GM_addElement('script', {
    textContent: `
      window.crsLib['${name}'] = {};
      ${isDevMode ? `console.time('导入 ${name}');` : ''}
      (function (process, require, exports, module, ${gmApiList.join(', ')}) {
        ${code}
      })(
        window.crsLib.process,
        window.crsLib.require,
        window.crsLib['${name}'],
        {
          set exports(value) {
            window.crsLib['${name}'] = value;
          },
          get exports() {
            return window.crsLib['${name}'];
          },
        },
        ${gmApiList.map((apiName) => `window.crsLib.${apiName}`).join(', ')}
      );
      ${isDevMode ? `console.timeEnd('导入 ${name}');` : ''}
    `,
  });
};

interface SelfModule {
  default: {
    (...args: unknown[]): unknown;
    [key: string | symbol]: unknown;
  };
  [key: string | symbol]: unknown;
}

/**
 * 创建一个外部模块的 Proxy，等到读取对象属性时才加载模块
 * @param name 外部模块名
 */
export const require = (name: string) => {
  // 为了应对 rollup 打包时的工具函数 _interopNamespace，要给外部库加上 __esModule 标志
  const __esModule = { value: true };

  const selfLibProxy = () => {};
  selfLibProxy.default = {};

  const selfDefault = new Proxy(selfLibProxy, {
    get(_, prop) {
      if (prop === '__esModule') return __esModule;
      if (prop === 'default') return selfDefault as unknown;
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module: SelfModule = unsafeWindow.crsLib[name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args) as object;
    },
    construct(_, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args) as object;
    },
  });

  return selfDefault as unknown;
};
unsafeWindow.crsLib.require = require;
