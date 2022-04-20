/* eslint-disable @typescript-eslint/consistent-type-imports */

const selfLibName = 'selfLib';
Reflect.set(unsafeWindow, selfLibName, {});

/**
 * 通过 Resource 导入外部模块
 *
 * @param name \@resource 引用的资源名
 */
const selfImport = async (name: string) => {
  const code = await GM.getResourceText(name);
  // 导入 umd 模块，同时用 call 将模块导入到 selfLib，防止污染全局作用域
  return GM.addElement('script', {
    textContent: `console.log('导入：${name}');(function () {${code}}).call(window.${selfLibName});`,
  });
};

/**
 * 获取外部模块的变量
 *
 * 如果外部模块未导入，则会自动导入
 *
 * @param varName 模块导入后增加的变量名
 * @param libName resource 引用的资源名
 */
const create =
  <T = any>(varName: string, libName?: string): (() => Promise<T>) =>
  async () => {
    if (!unsafeWindow[selfLibName][varName])
      await selfImport(libName ?? varName);
    return unsafeWindow[selfLibName][varName] as T;
  };

/**
 * 获取提前定义好的外部模块
 */
export const getLib = {
  React: create<typeof import('react')>('React'),
  ReactDOM: create<typeof import('react-dom/client')>('ReactDOM'),
};

export const React = create<typeof import('react')>('React');
export const ReactDOM = create<typeof import('react-dom/client')>('ReactDOM');
