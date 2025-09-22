let supportWorker = typeof Worker !== 'undefined';

const gmApi = {
  GM: typeof GM === 'undefined' ? undefined : GM,
  GM_addElement:
    typeof GM_addElement === 'undefined' ? undefined : GM_addElement,
  GM_getResourceText:
    typeof GM_getResourceText === 'undefined' ? undefined : GM_getResourceText,
  GM_xmlhttpRequest:
    typeof GM_xmlhttpRequest === 'undefined' ? undefined : GM_xmlhttpRequest,
  unsafeWindow: typeof unsafeWindow === 'undefined' ? window : unsafeWindow,
};
const gmApiList = Object.keys(gmApi);

const crsLib: Window['crsLib'] = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: { env: { NODE_ENV: process.env.NODE_ENV } },
  ...gmApi,
};

const tempName = Math.random().toString(36).slice(2);

const getResource = (name: string) => {
  const text = gmApi.GM_getResourceText?.(
    name.replaceAll('/', '|').replaceAll('@', '_'),
  );
  if (!text) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  if (name === '@tensorflow/tfjs-backend-webgpu')
    return text.replace('@tensorflow/tfjs-core', '@tensorflow/tfjs');

  return text;
};

const evalCode = (code: string) => {
  if (!code) return;

  // 因为部分网站会对 eval 进行限制，比如推特（CSP）、hitomi（代理 window.eval 进行拦截）
  // 所以优先使用最通用的 GM_addElement 来加载
  if (gmApi.GM_addElement)
    return GM_addElement('script', { textContent: code })?.remove();

  eval.call(gmApi.unsafeWindow, code);
};

/**
 * 通过 Resource 导入外部模块
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name: string) => {
  let code: string;

  // 为了方便打包、减少在无关站点上的运行损耗、顺带隔离下作用域
  // 除站点逻辑外的代码会作为字符串存着，要用时再像外部模块一样导入
  switch (name) {
    // import list

    default:
      code = getResource(name);
  }

  if (name.startsWith('worker/') && supportWorker) {
    try {
      // 如果浏览器支持 worker，就将模块转为 worker

      const importModule = new Map<string, string>();
      importModule.set('Comlink', getResource('comlink'));

      // 统计 require 导入的模块，统一放到 moduleMap 里
      const handleCode = (code: string) =>
        code.replaceAll(/require\('(.+?)'\)/g, (_, moduleName) => {
          if (!importModule.has(moduleName))
            importModule.set(moduleName, handleCode(getResource(moduleName)));
          return `moduleMap['${moduleName}']`;
        });
      const moduleCode = handleCode(code);

      let workerCode = `const moduleMap = {};\n`;
      for (const [moduleName, code] of importModule) {
        workerCode += `
moduleMap['${moduleName}'] = {};
(function (exports, module) { ${code} }) (
  moduleMap['${moduleName}'],
  {
    set exports(value) { moduleMap['${moduleName}'] = value; },
    get exports() { return moduleMap['${moduleName}']; }
  },
);\n`;
      }
      workerCode += `
const exports = {};
${moduleCode}
moduleMap['Comlink'].expose(exports);`;

      const codeUrl = URL.createObjectURL(
        new Blob([workerCode], { type: 'text/javascript' }),
      );
      setTimeout(URL.revokeObjectURL, 0, codeUrl);
      const worker = new Worker(codeUrl);
      crsLib[name] = (require('comlink') as typeof import('comlink')).wrap(
        worker,
      );
      return;
    } catch {
      supportWorker = false;
    }
  }

  // 通过提供 cjs 环境的变量来兼容 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  let runCode = `
    (function (process, require, exports, module, ${gmApiList.join(', ')}) {
      ${code}
    })(
      window['${tempName}'].process,
      window['${tempName}'].require,
      window['${tempName}']['${name}'],
      ((module) => ({
        set exports(value) { module['${name}'] = value; },
        get exports() { return module['${name}']; },
      }))(window['${tempName}']),
      ${gmApiList
        .map((apiName) => `window['${tempName}'].${apiName}`)
        .join(', ')}
    );
  `;

  if (isDevMode)
    runCode = [
      `console.time('导入 ${name}');`,
      runCode,
      `console.timeEnd('导入 ${name}');`,
    ].join('\n');

  gmApi.unsafeWindow[tempName] = crsLib;
  gmApi.unsafeWindow[tempName][name] = {};
  evalCode(runCode);
  Reflect.deleteProperty(gmApi.unsafeWindow, tempName);
};

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
      if (
        Reflect.has(crsLib[name], 'default') &&
        Reflect.has(crsLib[name].default, prop)
      )
        return crsLib[name].default[prop];
      return crsLib[name][prop];
    },
    apply(_, __, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args) as Record<string, unknown>;
    },
    construct(_, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args) as Record<string, unknown>;
    },
    ownKeys() {
      if (!crsLib[name]) selfImportSync(name);
      return Reflect.ownKeys(crsLib[name]);
    },
    getOwnPropertyDescriptor() {
      return { enumerable: true, configurable: true };
    },
  });

  return selfDefault as unknown;
};

crsLib.require = require;
