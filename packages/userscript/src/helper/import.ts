// 为了尽量减少在无关页面浪费时间，components 下的代码都转成文本存放在变量中
// 只在需要使用时再通过和其他外部库一样的方式进行加载
const componentsCode = '';

const selfLibName = 'selfLib';
unsafeWindow[selfLibName] = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: { env: { NODE_ENV: process.env.NODE_ENV } },
};

/**
 * 通过 Resource 导入外部模块
 *
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name: string) => {
  const code =
    name === '../components' ? componentsCode : GM_getResourceText(name);
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 通过提供 cjs 环境的变量来欺骗 umd 模块加载器
  // 将模块导出变量放到 selfLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  return GM_addElement('script', {
    textContent: `
      window['${selfLibName}']['${name}'] = {};
      ${isDevMode ? `console.time('导入 ${name}');` : ''}
      (function (process, require, exports, module) {
        ${code}
      })(
        window['${selfLibName}'].process,
        window['${selfLibName}'].require,
        window['${selfLibName}']['${name}'],
        {
          set exports(value) {
            window['${selfLibName}']['${name}'] = value;
          },
          get exports() {
            return window['${selfLibName}']['${name}'];
          },
        }
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
 *
 * @param name 外部模块名
 */
export const require = (name: string) => {
  // 为了应对 rollup 打包时的工具函数 _interopNamespace，要给外部库加上 __esModule 标志
  const __esModule = { value: true };

  // rollup 打包后的代码里有时候会先把 default 单独抽出来之后再使用，所以也要把 default 改成动态加载
  const selfDefault = new Proxy(function selfLibProxy() {}, {
    get(_, prop) {
      if (prop === '__esModule') return __esModule;
      if (!unsafeWindow[selfLibName][name]) selfImportSync(name);
      const module: SelfModule = unsafeWindow[selfLibName][name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!unsafeWindow[selfLibName][name]) selfImportSync(name);
      const module = unsafeWindow[selfLibName][name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args) as object;
    },
    construct(_, args) {
      if (!unsafeWindow[selfLibName][name]) selfImportSync(name);
      const module = unsafeWindow[selfLibName][name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args) as object;
    },
  });

  return new Proxy(
    { default: selfDefault },
    {
      get(_, prop) {
        if (prop === 'default') return _.default;
        if (prop === '__esModule') return __esModule;
        if (!unsafeWindow[selfLibName][name]) selfImportSync(name);
        const module: SelfModule = unsafeWindow[selfLibName][name];
        return module[prop];
      },
    },
  );
};
unsafeWindow[selfLibName].require = require;
