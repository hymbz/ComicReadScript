import type { ScheduleCallback } from '@solid-primitives/scheduled';

import {
  debounce as _debounce,
  throttle as _throttle,
  leadingAndTrailing,
} from '@solid-primitives/scheduled';

export { createScheduled } from '@solid-primitives/scheduled';

export { default as isEqual } from 'fast-deep-equal/es6/index.js';

/** 图片文件扩展名缩写 */
export const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
  w: 'webp',
  b: 'bmp',
} as const;

export const throttle: ScheduleCallback = (fn, wait = 100) =>
  leadingAndTrailing(_throttle, fn, wait);

export const debounce: ScheduleCallback = (fn, wait = 100) =>
  _debounce(fn, wait);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const clamp = (min: number, val: number, max: number) =>
  Math.max(Math.min(max, val), min);

export const inRange = (min: number, val: number, max: number) =>
  val >= min && val <= max;

export const getFileName = (url: string) => url.match(/.+\/([^?]+)/)?.[1];

/** 判断两个数是否在指定误差范围内相等 */
export const approx = (val: number, target: number, range = 1) =>
  Math.abs(target - val) <= range;

/** 创建一个只会执行一次的函数 */
export const onec = (fn: () => unknown) => {
  let hasRun = false;

  return () => {
    if (hasRun) return;
    hasRun = true;
    fn();
  };
};

/** 创建顺序递增的数组 */
export function range(a: number, b?: number): number[];
export function range<T = number>(a: number, b: (K: number) => T): T[];
export function range<T = number>(
  a: number,
  b: number,
  c: (K: number) => T,
): T[] | number[];
// oxlint-disable-next-line func-style
export function range<T = number>(
  a: number,
  b?: number | T | ((K: number) => T),
  c?: (K: number) => T,
) {
  switch (typeof b) {
    case 'undefined':
      return [...Array.from({ length: a }).keys()];

    case 'number': {
      const list: (T | number)[] = [];
      for (let i = a; i < b; i++) list.push(c ? c(i) : i);
      return list;
    }

    case 'function':
      return Array.from<T, T>({ length: a }, (_, i) =>
        (b as (K: number) => T)(i),
      );
  }
}

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

/** 返回 Dom 的点击函数 */
export const querySelectorClick = (
  selector: string | (() => HTMLElement | undefined | null),
  textContent?: string,
) => {
  let getDom: () => HTMLElement | null | undefined;

  if (typeof selector === 'function') getDom = selector;
  else if (textContent) {
    getDom = () =>
      querySelectorAll(selector).find((e) =>
        e.textContent?.includes(textContent),
      );
  } else getDom = () => querySelector(selector);

  if (getDom()) return () => getDom()?.click();
};

/** 找出数组中出现最多次的元素 */
export const getMostItem = <T>(list: T[]) => {
  const counts = new Map<T, number>();
  for (const val of list) counts.set(val, (counts.get(val) ?? 0) + 1);

  return [...counts.entries()].reduce((maxItem, item) =>
    maxItem[1] > item[1] ? maxItem : item,
  )[0];
};

/** 判断字符串是否为 URL */
export const isUrl = (text: string) => {
  // 等浏览器版本上来后可以直接使用 URL.canParse
  try {
    return Boolean(new URL(text));
  } catch {
    return false;
  }
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

/** 滚动页面到指定元素的所在位置 */
export const scrollIntoView = (
  selector: string,
  behavior: ScrollBehavior = 'instant',
) => querySelector(selector)?.scrollIntoView({ behavior });

type SingleThreadedState<T extends any[]> = {
  running: boolean;
  argList: T[];
  /** 是否保留运行期间的调用到当此运行结束后调用 */
  abandon?: boolean;
  /** 连续调用的间隔 */
  timeout?: number;
  /** 确保本次运行完后再运行一次 */
  continueRun: () => void;
};
/** 确保函数在同一时间下只有一个在运行 */
export const singleThreaded = <T extends any[]>(
  callback: (
    state: SingleThreadedState<T>,
    ...args: T
  ) => void | undefined | Promise<void | undefined>,
  initState?: Partial<SingleThreadedState<T>>,
) => {
  const state: SingleThreadedState<T> = {
    running: false,
    argList: [],
    continueRun: (...args: T) =>
      state.argList.length > 0 || state.argList.push(args),
    ...initState,
  };

  const work = async () => {
    if (state.argList.length === 0) return;
    const args = state.argList.shift()!;

    try {
      state.running = true;
      await callback(state, ...args);
    } catch (error) {
      await sleep(100);
      if (state.argList.length === 0) throw error;
    } finally {
      if (state.abandon) state.argList.length = 0;
      if (state.argList.length > 0) setTimeout(work, state.timeout);
      else state.running = false;
    }
  };

  return (...args: T) => {
    state.argList.push(args);
    if (!state.running) return work();
  };
};

/**
 * 限制 Promise 并发
 * @param fnList 任务函数列表
 * @param callBack 成功执行一个 Promise 后调用，主要用于显示进度
 * @param limit 限制数
 * @returns 所有 Promise 的返回值
 */
export const plimit = async <T>(
  fnList: (() => Promise<T> | T)[],
  callBack = undefined as
    | ((doneNum: number, totalNum: number, resList: T[], i: number) => void)
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
        callBack?.(doneNum, totalNum, resList, i);
      })();
      execPool.add(p);
    };
  });

  // eslint-disable-next-line no-unmodified-loop-condition
  while (doneNum !== totalNum) {
    while (taskList.length > 0 && execPool.size < limit) taskList.shift()!();
    await Promise.race(execPool);
  }

  return resList;
};

/**
 * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
 * @param hexColor 十六进制颜色。例如 #112233
 */
export const needDarkMode = (hexColor: string) => {
  // by: https://24ways.org/2010/calculating-color-contrast
  const r = Number.parseInt(hexColor.slice(1, 3), 16);
  const g = Number.parseInt(hexColor.slice(3, 5), 16);
  const b = Number.parseInt(hexColor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

/** 等到传入的函数返回 true */
export async function wait<T>(
  fn: () => T | undefined | Promise<T | undefined>,
): Promise<TrueValue<T>>;
export async function wait<T>(
  fn: () => T | undefined | Promise<T | undefined>,
  timeout?: number,
  waitTime?: number,
): Promise<T>;
// oxlint-disable-next-line func-style
export async function wait<T>(
  fn: () => T | undefined | Promise<T | undefined>,
  timeout = Number.POSITIVE_INFINITY,
  waitTime = 100,
) {
  let res: T | undefined = await fn();
  let _timeout = timeout;
  while (_timeout > 0 && !res) {
    await sleep(waitTime);
    _timeout -= waitTime;
    res = await fn();
  }

  return res;
}

/** 等到指定的 dom 出现 */
export async function waitDom(selector: string): Promise<HTMLElement>;
export async function waitDom(
  selector: string,
  timeout?: number,
): Promise<HTMLElement | null>;
export async function waitDom(selector: string, timeout?: number) {
  return wait(() => querySelector(selector), timeout);
}

/** 等待指定的图片元素加载完成 */
export const waitImgLoad = (
  target: HTMLImageElement | string,
  timeout?: number,
) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = typeof target === 'string' ? new Image() : target;
    if (img.complete && img.naturalHeight) resolve(img);

    const id = timeout
      ? window.setTimeout(() => reject(new Error('timeout')), timeout)
      : undefined;

    const handleError = (e: ErrorEvent) => {
      window.clearTimeout(id);
      reject(new Error(e.message));
    };
    const handleLoad = () => {
      window.clearTimeout(id);
      img.removeEventListener('error', handleError);
      resolve(img);
    };

    img.addEventListener('load', handleLoad, { once: true });
    img.addEventListener('error', handleError, { once: true });

    if (typeof target === 'string') img.src = target;
  });

/** 将指定的布尔值转换为字符串或未定义 */
export const boolDataVal = (val: boolean) => (val ? '' : undefined);

/** 测试图片 url 能否正确加载 */
export const testImgUrl = (url: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

export const canvasToBlob = (
  canvas: HTMLCanvasElement | OffscreenCanvas,
  type?: string,
  quality = 1,
) => {
  if (canvas instanceof OffscreenCanvas)
    return canvas.convertToBlob({ type, quality });

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
      type,
      quality,
    );
  });
};

/**
 * 求 a 和 b 的差集，相当于从 a 中删去和 b 相同的属性
 *
 * 不会修改参数对象，返回的是新对象
 */
export const difference = <T extends object>(a: T, b: T): Partial<T> => {
  const res = {};
  const keys = Object.keys(a);
  for (const key of keys) {
    if (typeof a[key] === 'object' && typeof b[key] === 'object') {
      const _res = difference(a[key], b[key]);
      if (Object.keys(_res).length > 0) res[key] = _res;
    } else if (a[key] !== b?.[key]) res[key] = a[key];
  }

  return res;
};

const _assign = <T extends object>(a: T, b: Partial<T>): T => {
  // oxlint-disable-next-line prefer-structured-clone
  const res = JSON.parse(JSON.stringify(a)) as T;
  const keys = Object.keys(b);
  for (const key of keys) {
    if (res[key] === undefined) res[key] = b[key];
    else if (typeof b[key] === 'object') {
      const _res = _assign(res[key], b[key]);
      if (Object.keys(_res).length > 0) res[key] = _res;
    } else if (res[key] !== b[key]) res[key] = b[key];
  }

  return res;
};

/**
 * Object.assign 的深拷贝版，不会导致子对象属性的缺失
 *
 * 不会修改参数对象，返回的是新对象
 */
export const assign = <T extends object>(
  target: T,
  ...sources: (Partial<T> | undefined)[]
): T => {
  let res = target;
  for (const source of sources)
    if (typeof source === 'object') res = _assign(res, source);
  return res;
};

/** 根据路径获取对象下的指定值 */
export const byPath = <T = object>(
  obj: object,
  path: string | string[],
  handleVal?: (parentObj: object, key: string) => unknown,
) => {
  const keys = typeof path === 'string' ? path.split('.') : path;
  let target: object = obj;
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    // 兼容含有「.」的 key
    while (!Reflect.has(target, key) && i < keys.length) {
      i += 1;
      if (keys[i] === undefined) break;
      key += `.${keys[i]}`;
    }

    if (handleVal && i > keys.length - 2 && Reflect.has(target, key)) {
      const res = handleVal(target, key);
      while (i < keys.length - 1) {
        target = target[key];
        i += 1;
        key = keys[i];
      }

      if (res !== undefined) target[key] = res;
      break;
    }

    target = target[key];
  }

  if (target === obj) return null;
  return target as T;
};

export const requestIdleCallback = (
  callback: IdleRequestCallback,
  timeout?: number,
) => {
  if (Reflect.has(window, 'requestIdleCallback'))
    return window.requestIdleCallback(callback, { timeout });
  return window.setTimeout(callback, 16);
};

/** 获取键盘事件的编码 */
export const getKeyboardCode = (e: KeyboardEvent) => {
  let { key } = e;
  switch (key) {
    case 'Shift':
    case 'Control':
    case 'Alt':
      return key;
  }

  key = key.replaceAll(/\b[A-Z]\b/g, (match) => match.toLowerCase());
  if (e.ctrlKey) key = `Ctrl + ${key}`;
  if (e.altKey) key = `Alt + ${key}`;
  if (e.shiftKey) key = `Shift + ${key}`;
  return key;
};

/** 将快捷键的编码转换成更易读的形式 */
export const keyboardCodeToText = (code: string) =>
  code
    .replace('Control', 'Ctrl')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .replace('ArrowLeft', '←')
    .replace('ArrowRight', '→')
    .replace(/^\s$/, 'Space');

/** 将 HTML 字符串转换为 DOM 对象 */
export const domParse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');

/** 监听键盘事件 */
export const linstenKeydown = (
  handler: (e: KeyboardEvent) => unknown,
  capture?: boolean,
) =>
  window.addEventListener(
    'keydown',
    (e) => {
      // 跳过输入框的键盘事件
      switch ((e.target as HTMLElement).tagName) {
        case 'INPUT':
        case 'TEXTAREA':
          return;
      }
      return handler(e);
    },
    { capture },
  );

/**
 * 劫持修改原网页上的函数
 *
 * 如果传入函数的所需参数为零，将在原函数执行完后自动调用
 */
export const hijackFn = <T extends unknown[] = unknown[], R = unknown>(
  fnName: string,
  fn: (rawFn: (...args: T) => R, args: T) => R,
) => {
  const rawFn = unsafeWindow[fnName] as (...args: T) => R;
  unsafeWindow[fnName] =
    fn.length === 0
      ? (...args: T) => {
          const res = rawFn(...args);
          (fn as () => R)();
          return res;
        }
      : (...args: T) => fn(rawFn, args);
};

export const getGmValue = async <T extends string | number | object = string>(
  name: string,
  setValueFn: () => unknown | Promise<unknown>,
) => {
  const value = await GM.getValue<T>(name);
  if (value !== undefined) return value;
  await setValueFn();
  return await GM.getValue<T>(name);
};

/** 根据范围文本提取指定范围的元素的 index */
export const extractRange = (rangeText: string, length: number) => {
  const list = new Set<number>();
  for (const text of rangeText.replaceAll(/[^\d,-]/g, '').split(',')) {
    if (/^\d+$/.test(text)) list.add(Number(text) - 1);
    else if (/^\d*-\d*$/.test(text)) {
      let [start, end] = text.split('-').map(Number);
      end ||= length;
      for (start--, end--; start <= end; start++) list.add(start);
    }
  }
  return list;
};

/** extractRange 的逆向，按照相同的语法表述一个结果数组 */
export const descRange = (list: Iterable<number>, length: number) => {
  let text = '';
  const nowRange: number[] = [];
  const pushRange = (newIndex?: number) => {
    if (nowRange.length === 0) return;

    if (text.length > 0) text += ', ';
    if (nowRange.length === 1) text += nowRange[0] + 1;
    else {
      const end =
        newIndex === undefined && nowRange[1] === length - 1
          ? ''
          : nowRange[1] + 1;
      text += `${nowRange[0] + 1}-${end}`;
    }

    nowRange.length = 0;
    if (newIndex !== undefined) nowRange[0] = newIndex;
  };

  for (const i of list) {
    switch (nowRange.length) {
      case 0:
        nowRange[0] = i;
        break;
      case 1:
        if (i === nowRange[0] + 1) nowRange[1] = i;
        else pushRange(i);
        break;
      case 2:
        if (i === nowRange[1] + 1) nowRange[1] = i;
        else pushRange(i);
        break;
    }
  }

  pushRange();
  return text;
};

/** 监听 url 变化 */
export const onUrlChange = (
  fn: (lastUrl: string, nowUrl: string) => unknown,
  handleUrl = (location: Location) => location.href,
) => {
  let lastUrl = '';
  const refresh = singleThreaded(async () => {
    if (!(await wait(() => handleUrl(location) !== lastUrl, 5000))) return;
    const nowUrl = handleUrl(location);
    await fn(lastUrl, nowUrl);
    lastUrl = nowUrl;
  });

  const controller = new AbortController();
  for (const eventName of ['click', 'popstate'])
    window.addEventListener(eventName, refresh, {
      capture: true,
      signal: controller.signal,
    });
  refresh();

  return () => controller.abort();
};

/** wait，但是只在 url 变化时判断 */
export const waitUrlChange = (isValidUrl: () => unknown) =>
  new Promise<void>((resolve) => {
    const abort = onUrlChange(() => {
      if (!isValidUrl()) return;
      resolve();
      abort();
    });
  });

// TODO: 用这个重构相关实现
export abstract class AnimationFrame {
  animationId = 0;
  abstract frame: (timestamp: DOMHighResTimeStamp) => unknown;

  call = () => {
    this.animationId = requestAnimationFrame(this.frame);
  };

  cancel = () => {
    if (!this.animationId) return;
    cancelAnimationFrame(this.animationId);
    this.animationId = 0;
  };
}

/** 锁定屏幕禁止自动熄屏 */
export class WakeLock {
  isSupported = false;

  lock: WakeLockSentinel | null = null;

  constructor() {
    if (!('wakeLock' in navigator)) return;
    this.isSupported = true;
  }

  on = async () => {
    if (!this.isSupported) return null;
    try {
      this.lock = await navigator.wakeLock.request('screen');
      return this.lock.released;
    } catch {
      return false;
    }
  };

  off = async () => {
    if (!this.lock) return;
    await this.lock.release();
    this.lock = null;
  };
}

export const getImageData = (img: HTMLImageElement) => {
  const { naturalWidth: width, naturalHeight: height } = img;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};
