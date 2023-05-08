import type { JSX } from 'solid-js';
import { render } from 'solid-js/web';

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;

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

/** 挂载 solid-js 组件 */
export const mountComponents = (id: string, fc: () => JSX.Element) => {
  const dom = document.createElement('div');
  dom.id = id;
  document.body.appendChild(dom);
  const shadowDom = dom.attachShadow({ mode: 'open' });
  render(fc, shadowDom);
  return dom;
};

/** 返回 Dom 的点击函数 */
export const querySelectorClick = (selector: string) => {
  const dom = querySelector(selector);
  if (!dom) return undefined;
  return () => {
    dom.click();
  };
};

/** 判断两个列表中包含的值是否相同 */
export const isEqualArray = <T>(a: T[], b: T[]): boolean =>
  a.length === b.length && !!a.filter((t) => !b.includes(t));

/** 将对象转为 URLParams 类型的字符串 */
export const dataToParams = (data: Record<string, unknown>) =>
  Object.entries(data)
    .map(([key, val]) => `${key}=${val}`)
    .join('&');

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

/** 滚动页面到指定元素的所在位置 */
export const scrollIntoView = (selector: string) =>
  querySelector(selector)?.scrollIntoView();

/**
 * 限制 Promise 并发
 * @param fnList 任务函数列表
 * @param callBack 成功执行一个 Promise 后调用，主要用于显示进度
 * @param limit 限制数
 * @returns 所有 Promise 的返回值
 */
export const plimit = async <T>(
  fnList: Array<() => Promise<T>>,
  callBack = undefined as
    | ((doneNum: number, totalNum: number, resList: T[]) => void)
    | undefined,
  limit = 10,
) => {
  let doneNum = 0;
  const totalNum = fnList.length;
  const resList: T[] = [];
  const execPool = new Set<Promise<void>>();
  const taskList = fnList.map((fn, i) => {
    let p: Promise<void>;
    return () => {
      p = (async () => {
        resList[i] = await fn();
        doneNum += 1;
        execPool.delete(p);
        callBack?.(doneNum, totalNum, resList);
      })();
      execPool.add(p);
    };
  });

  while (doneNum !== totalNum) {
    while (taskList.length && execPool.size < limit) {
      taskList.shift()!();
    }
    // eslint-disable-next-line no-await-in-loop
    await Promise.race(execPool);
  }

  return resList;
};

// 将 xmlHttpRequest 包装为 Promise
const xmlHttpRequest = (
  details: Tampermonkey.Request<any>,
): Promise<Tampermonkey.Response<any>> =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...details,
      onload: resolve,
      onerror: reject,
      ontimeout: reject,
    });
  });

/** 发起请求 */
export const request = async <T = any>(
  url: string,
  details?: Partial<Tampermonkey.Request<any>> & {
    errorText?: string;
  },
  errorNum = 0,
): Promise<Tampermonkey.Response<T>> => {
  const errorText = details?.errorText ?? '漫画加载出错';
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: { Referer: window.location.href },
      ...details,
    });
    if (res.status !== 200) throw new Error(errorText);
    return res;
  } catch (error) {
    if (errorNum > 3) {
      if (errorText) {
        const { useToast } = require('../main');
        useToast().error(errorText);
      }
      throw new Error(errorText);
    }
    console.error(errorText, error);
    await sleep(1000);
    return request(url, details, errorNum + 1);
  }
};

/**
 * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
 * @param hexColor 十六进制颜色。例如 #112233
 */
export const needDarkMode = (hexColor: string) => {
  // by: https://24ways.org/2010/calculating-color-contrast
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};
