declare const isDevMode: boolean;

const gmApi = {
  GM,
  GM_addElement,
  GM_getResourceText,
  GM_xmlhttpRequest,
  unsafeWindow,
};
const gmApiList = Object.keys(gmApi);

const crsLib: Window['crsLib'] = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: { env: { NODE_ENV: process.env.NODE_ENV } },
  ...gmApi,
};

const tempName = Math.random().toString(36).slice(2);

/**
 * 通过 Resource 导入外部模块
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name: string) => {
  const code = name !== 'main' ? GM_getResourceText(name) : inject('main');
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 通过提供 cjs 环境的变量来兼容 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  const runCode = `
      window['${tempName}']['${name}'] = {};
      ${isDevMode ? `console.time('导入 ${name}');` : ''}
      (function (process, require, exports, module, ${gmApiList.join(', ')}) {
        ${code}
      })(
        window['${tempName}'].process,
        window['${tempName}'].require,
        window['${tempName}']['${name}'],
        {
          set exports(value) {
            window['${tempName}']['${name}'] = value;
          },
          get exports() {
            return window['${tempName}']['${name}'];
          },
        },
        ${gmApiList
          .map((apiName) => `window['${tempName}'].${apiName}`)
          .join(', ')}
      );
      ${isDevMode ? `console.timeEnd('导入 ${name}');` : ''}
    `;

  Reflect.deleteProperty(unsafeWindow, tempName);
  unsafeWindow[tempName] = crsLib;
  // 因为在一些网站比如推特会触发CSP，所以不能使用 eval 来执行
  GM_addElement('script', { textContent: runCode });
  Reflect.deleteProperty(unsafeWindow, tempName);
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
      if (!crsLib[name]) selfImportSync(name);
      const module: SelfModule = crsLib[name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args) as object;
    },
    construct(_, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args) as object;
    },
  });

  return selfDefault as unknown;
};
crsLib.require = require;
