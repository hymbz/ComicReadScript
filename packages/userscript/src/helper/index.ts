/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import type { Root } from 'react-dom/client';

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 *
 * @param selector
 */
export const querySelector = <T extends HTMLElement = HTMLElement>(
  selector: string,
) => document.querySelector<T>(selector);

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 *
 * @param selector
 */
export const querySelectorAll = <T extends HTMLElement = HTMLElement>(
  selector: string,
) => document.querySelectorAll<T>(selector);

/**
 * 创建组件用的 ReactDOM Root
 *
 * @param name 组件名
 * @returns ReactDOM Root
 */
export const useComponentsRoot = (name: string): [Root, HTMLElement] => {
  // 需要使用动态导入以避免在支持站点外的页面上加载 React
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ReactDOM: typeof import('react-dom/client') = require('react-dom');

  const dom =
    document.getElementById(name) ??
    (() => {
      const _dom = document.createElement('div');
      _dom.id = name;
      document.body.appendChild(_dom);
      return _dom;
    })();

  return [ReactDOM.createRoot(dom), dom];
};

/**
 * 返回 Dom 的点击函数，如果找不到 Dom 则返回 null
 *
 * @param selector
 * @returns
 */
export const querySelectorClick = (selector: string) => {
  const dom = querySelector(selector);
  if (!dom) return null;
  return () => {
    dom.click();
  };
};

/**
 * 判断两个列表值是否相同
 *
 * @param a
 * @param b
 */
export const isEqualArray = <T>(a: T[], b: T[]): boolean =>
  a.length === b.length && !!a.filter((t) => !b.includes(t));

/**
 * 添加元素
 *
 * @param textnode 添加元素
 * @param node 被添加元素
 * @param referenceNode 参考元素，添加元素将插在参考元素前
 */
export const insertDom = (
  textnode: string,
  node: HTMLElement = document.body,
  referenceNode: HTMLElement | null = null,
) => {
  const temp = document.createElement('div');
  temp.innerHTML = textnode;
  const frag = document.createDocumentFragment();
  while (temp.firstChild) frag.appendChild(temp.firstChild);
  node.insertBefore(frag, referenceNode);
};

/**
 * 将对象转为 URLParams 类型的字符串
 *
 * @param data
 */
export const dataToParams = (data: Record<string, unknown>) =>
  Object.entries(data)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

interface defaultOptions {
  option: Partial<MangaProps['option']> | undefined;
  autoLoad: boolean;
  [key: string]: unknown;
}
/**
 *
 * @param name 站点名
 * @param defaultValue 默认值
 */
export const useSiteOptions = async <T>(
  name: string,
  defaultValue = {} as T,
) => {
  type Options = T & defaultOptions;

  const rawValue = await GM.getValue<Options | undefined>(name);
  const options =
    rawValue ??
    ({
      option: undefined,
      autoLoad: true,
      ...defaultValue,
    } as Options);

  const changeCallbackList: ((options: Options) => void | Promise<void>)[] = [];

  return {
    options,

    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,

    /**
     * 设置新 Option
     *
     * @param newValue
     * @param trigger 是否触发变更事件
     */
    setOptions: async (newValue: Options, trigger = true) => {
      Object.assign(options, newValue);
      await GM.setValue(name, options);
      if (trigger)
        await Promise.all(
          changeCallbackList.map((callback) => callback(options)),
        );
    },

    /**
     * 监听配置变更事件
     *
     * @param callback 回调
     */
    onOptionChange: (callback: (options: Options) => void | Promise<void>) => {
      changeCallbackList.push(callback);
    },
  };
};
