/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { Root } from 'react-dom/client';

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
export const querySelector = <T extends HTMLElement = HTMLElement>(
  selector: string,
) => document.querySelector<T>(selector);

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
export const querySelectorAll = <T extends HTMLElement = HTMLElement>(
  selector: string,
) => [...document.querySelectorAll<T>(selector)];

/**
 * 添加元素
 *
 * @param node 被添加元素
 * @param textnode 添加元素
 * @param referenceNode 参考元素，添加元素将插在参考元素前
 */
export const insertNode = (
  node: HTMLElement | DocumentFragment,
  textnode: string,
  referenceNode: HTMLElement | null = null,
) => {
  const temp = document.createElement('div');
  temp.innerHTML = textnode;
  const frag = document.createDocumentFragment();
  while (temp.firstChild) frag.appendChild(temp.firstChild);
  node.insertBefore(frag, referenceNode);
};

/**
 * 创建组件用的 ReactDOM Root
 */
export const useComponentsRoot = (id: string): [Root, HTMLElement] => {
  // 需要使用动态导入以避免在支持站点外的页面上加载 React
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ReactDOM: typeof import('react-dom/client') = require('react-dom');

  const dom =
    document.getElementById(id) ??
    (() => {
      const _dom = document.createElement('div');
      _dom.id = id;
      document.body.appendChild(_dom);
      return _dom;
    })();

  return [ReactDOM.createRoot(dom), dom];
};

/**
 * 返回 Dom 的点击函数，如果找不到 Dom 则返回 null
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
 */
export const isEqualArray = <T>(a: T[], b: T[]): boolean =>
  a.length === b.length && !!a.filter((t) => !b.includes(t));

/**
 * 将对象转为 URLParams 类型的字符串
 */
export const dataToParams = (data: Record<string, unknown>) =>
  Object.entries(data)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

/**
 * 根据图片地址下载下来转为 blob 格式
 */
export const imgToBlob = async (
  url: string,
  details?: Partial<Tampermonkey.Request<any>>,
  errorNum = 0,
): Promise<string> => {
  const res = await GM.xmlHttpRequest({
    method: 'GET',
    url,
    responseType: 'blob',
    ...details,
  });

  if (res.status !== 200) {
    const errorTest = `${url} 转为 blob 格式时出错：[${res.status}]${res.statusText}`;
    if (errorNum >= 3) throw new Error(errorTest);
    console.warn(errorTest);
    await sleep(1000);
    return imgToBlob(url, details, errorNum + 1);
  }
  return URL.createObjectURL(res.response);
};

/** 将 blob 数据作为文件保存至本地 */
export const saveAs = (blob: Blob, name = 'download') => {
  const a = document.createElementNS(
    'http://www.w3.org/1999/xhtml',
    'a',
  ) as HTMLAnchorElement;
  a.download = name;
  a.rel = 'noopener';
  a.href = URL.createObjectURL(blob);
  setTimeout(() => a.dispatchEvent(new MouseEvent('click')));
};

/** 监听键盘事件 */
export const linstenKeyup = (handler: (e: KeyboardEvent) => unknown) =>
  window.addEventListener('keyup', (e) => {
    // 跳过输入框的键盘事件
    switch ((e.target as HTMLElement).tagName) {
      case 'INPUT':
      case 'TEXTAREA':
        return;
    }
    handler(e);
  });
