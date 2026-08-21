import {
  type ScheduleCallback,
  debounce as _debounce,
  throttle as _throttle,
  leadingAndTrailing,
} from '@solid-primitives/scheduled';
import { type Promisable } from 'type-fest';

export { createScheduled } from '@solid-primitives/scheduled';

export { dequal as isEqual } from 'dequal';

/** 图片文件扩展名缩写 */
export const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
  w: 'webp',
  b: 'bmp',
} as const;

const CRSD: Record<string, unknown> = {};
/** 将调试变量挂到全局 CRSD 对象上 */
export const exposeToGlobal = (obj: Record<string, unknown>) => {
  if (!isDevMode) return;
  if (typeof window !== 'undefined' && typeof unsafeWindow !== 'undefined')
    Object.assign(unsafeWindow ?? window, { CRSD });
  Object.assign(CRSD, obj);
};

export const throttle: ScheduleCallback = (fn, wait = 100) =>
  leadingAndTrailing(_throttle, fn, wait);

export const debounce: ScheduleCallback = (fn, wait = 100) =>
  _debounce(fn, wait);

export const sleep = (ms: number) =>
  // oxlint-disable-next-line promise/avoid-new no-promise-executor-return
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const clamp = (min: number, val: number, max: number) =>
  Math.max(Math.min(max, val), min);

export const inRange = (min: number, val: number, max: number) =>
  val >= min && val <= max;

export const getFileName = (url: string) =>
  /.+\/(?<name>[^?]+)/u.exec(url)?.groups?.name;

export const isString = (val: unknown): val is string =>
  typeof val === 'string';

export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';

export const isArray = (val: unknown): val is unknown[] => Array.isArray(val);

/** 判断两个数是否在指定误差范围内相等 */
export const approx = (val: number, target: number, range = 1) =>
  Math.abs(target - val) <= range;

/** 创建一个只会执行一次的函数，并缓存首次调用的返回值 */
export const once = <T extends (...args: any[]) => any>(
  fn: T,
): ((...args: Parameters<T>) => ReturnType<T>) => {
  let wrapper = (...args: Parameters<T>): ReturnType<T> => {
    const result = fn(...args);
    wrapper = () => result;
    return result;
  };

  return (...args: Parameters<T>) => wrapper(...args);
};

/** 创建顺序递增的数组 */
export function range(a: number, b?: number): number[];
export function range<T = number>(a: number, b: (K: number) => T): T[];
// oxlint-disable-next-line typescript/unified-signatures
export function range<T = number>(a: number, b: T): T[];
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

    case 'string':
      return Array.from<string, string>({ length: a }, () => b);
  }
}

/** 判断节点是否为元素节点 */
export const isHTMLElement = (node: Node): node is HTMLElement =>
  node.nodeType === Node.ELEMENT_NODE;

/** 判断节点是否为图片元素节点 */
export const isImageElement = (node: Node): node is HTMLImageElement =>
  node.nodeName === 'IMG';

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
  continueRun: (...args: T) => void;
};
/** 确保函数在同一时间下只有一个在运行 */
export const singleThreaded = <T extends any[]>(
  callback: (
    state: SingleThreadedState<T>,
    ...args: T
  ) => Promisable<void | undefined>,
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
  fnList: (() => Promisable<T>)[],
  callBack = undefined as
    // oxlint-disable-next-line max-params
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

  // oxlint-disable-next-line no-unmodified-loop-condition
  while (doneNum !== totalNum) {
    while (taskList.length > 0 && execPool.size < limit) taskList.shift()!();
    await Promise.race(execPool);
  }

  return resList;
};

/** Promise 并发队列 */
export class PQueue<T> {
  wait = new Set<T>();
  running = new Set<T>();
  done = new Set<T>();

  private readonly handleTask: (item: T) => Promise<unknown>;
  public concurrency: number;

  constructor(handleTask: (item: T) => Promise<unknown>, concurrency = 1) {
    this.handleTask = handleTask;
    this.concurrency = concurrency;
  }

  public has = (item: T): boolean =>
    this.running.has(item) || this.done.has(item) || this.wait.has(item);

  private async processQueue(): Promise<void> {
    if (this.running.size >= this.concurrency || this.wait.size === 0) return;

    const [item] = this.wait;
    if (item === undefined) return;
    this.wait.delete(item);

    if (!this.running.has(item)) {
      try {
        this.running.add(item);
        await this.handleTask(item);
        this.done.add(item);
      } catch (error) {
        console.error(error);
      } finally {
        this.running.delete(item);
      }
    }
    return this.processQueue();
  }

  public add(item: T): void {
    if (this.has(item)) return;
    this.wait.add(item);
    void this.processQueue();
  }

  public set(...items: T[]): void {
    this.wait.clear();
    this.wait = new Set(items.filter((item) => !this.has(item)));
    void this.processQueue();
  }

  public clear(): void {
    this.wait.clear();
    this.done.clear();
  }
}

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

/**
 * 重复执行传入的函数，直到其返回真值或超时
 *
 * @param fn - 条件判断函数
 * @param timeout - 超时时间（毫秒），默认为 Infinity
 * @param waitTime - 轮询间隔时间（毫秒），默认为 100
 */
export async function wait<T>(
  fn: () => Promisable<T | undefined>,
): Promise<TrueValue<T>>;
export async function wait<T>(
  fn: () => Promisable<T>,
  timeout?: number,
  waitTime?: number,
): Promise<T>;
// oxlint-disable-next-line func-style
export async function wait<T>(
  fn: () => Promisable<T>,
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

/** 等到指定 selector 匹配到指定数量的 dom 元素 */
export function waitDom(
  selector: string,
  count?: number,
): Promise<HTMLElement[]>;
export function waitDom(
  selector: string,
  count?: number,
  timeout?: number,
): Promise<HTMLElement[] | undefined>;
export function waitDom(selector: string, count = 1, timeout?: number) {
  return wait(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    return elements.length >= count ? [...elements] : undefined;
  }, timeout);
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
export const boolDataVal = (val: boolean | undefined) => (val ? '' : undefined);

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

  key = key.replaceAll(/\b[A-Z]\b/gu, (match) => match.toLowerCase());
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
    .replace(/^\s$/u, 'Space');

/** 将 HTML 字符串转换为 DOM 对象 */
export const domParse = (html: string) =>
  new DOMParser().parseFromString(html, 'text/html');

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

/**
 * 确保指定 key 的值一定存在
 * 如果对应值不存在，则使用 defaultValue 来设置值，然后返回该值
 * defaultValue 可以是默认值，或者返回默认值的函数
 * 也可以是使用了 GM.setValue 来设置默认值的函数（此时也会返回被设置的值）
 */
export const ensureGmValue = async <
  T extends string | number | object = string,
>(
  name: string,
  defaultValue: string | (() => Promisable<void | string>),
): Promise<T> => {
  const value = await GM.getValue<T>(name);
  if (value !== undefined) return value;

  if (typeof defaultValue !== 'function') {
    await GM.setValue(name, defaultValue);
    return defaultValue as T;
  }

  const fnRes = await defaultValue();
  if (fnRes !== undefined) {
    await GM.setValue(name, fnRes);
    return fnRes as T;
  }
  return (await GM.getValue(name)) as T;
};

/** 根据范围文本提取指定范围的元素的 index */
export const extractRange = (rangeText: string, length: number) => {
  const list = new Set<number>();
  for (const text of rangeText.replaceAll(/[^\d,-]/gu, '').split(',')) {
    if (/^\d+$/u.test(text)) list.add(Number(text) - 1);
    else if (/^\d*-\d*$/u.test(text)) {
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
  fn: (lastUrl: string, nowUrl: string) => Promisable<void>,
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
  void refresh();

  return () => controller.abort();
};

/** wait，但是只在 url 变化时判断 */
export const waitUrlChange = <T = unknown>(isValidUrl: () => T) =>
  new Promise<NonNullable<T>>((resolve) => {
    const abort = onUrlChange(async () => {
      const res = await isValidUrl();
      if (!res) return;
      resolve(res);
      abort();
    });
  });

export abstract class AnimationFrame {
  animationId = 0;
  abstract frame: (timestamp: DOMHighResTimeStamp) => void;

  call = (force?: boolean) => {
    if (!force && this.animationId) return;
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

export const withEventStop =
  <T extends Event>(handler?: (e: T) => void) =>
  (e: T) => {
    e.stopPropagation();
    e.preventDefault();
    if (handler) handler(e);
  };

/** 判断版本号1是否小于版本号2 */
export const versionLt = (version1: string, version2: string) => {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const num1 = v1[i] ?? 0;
    const num2 = v2[i] ?? 0;
    if (num1 !== num2) return num1 < num2;
  }
  return false;
};
