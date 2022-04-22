/** 放在脚本开头，用于动态加载外部模块 */

const selfLibName = 'selfLib';
unsafeWindow[selfLibName] = {
  process: { env: { NODE_ENV: process.env.NODE_ENV } },
};

/**
 * 通过 Resource 导入外部模块，但是同步
 *
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name: string) => {
  const code = GM_getResourceText(name);
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 导入 cjs 模块，同时用 call 将模块创建的变量放到 selfLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  return GM_addElement('script', {
    textContent: `
      window['${selfLibName}']['${name}'] = {};
      console.time('导入 ${name}');
      (function (process, require, exports) { ${code} }).call(
        window['${selfLibName}'],
        window['${selfLibName}'].process,
        window['${selfLibName}'].require,
        window['${selfLibName}']['${name}']
      );
      console.timeEnd('导入 ${name}');
    `,
  });
};

/**
 * 创建一个外部模块的 Proxy，等到读取对象属性时才加载模块
 *
 * @param name 外部模块名
 */
export const require = (name: string) => {
  return new Proxy({} as Record<string, unknown>, {
    get(_, prop) {
      console.log('get', prop);
      if (!unsafeWindow[selfLibName][name]) selfImportSync(name);
      return unsafeWindow[selfLibName][name][prop] as unknown;
    },
  });
};
unsafeWindow[selfLibName].require = require;
// 为了防止 TS 报错，只能 export 这个函数，之后会在 rollup 处理时删掉 export 语句
