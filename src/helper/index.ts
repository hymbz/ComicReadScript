export const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const clamp = (min: number, val: number, max: number) =>
  Math.max(Math.min(max, val), min);

/** 判断两个数是否在指定误差范围内相等 */
export const isEqual = (val: number, target: number, range: number) =>
  Math.abs(target - val) <= range;

/** 根据传入的条件列表的真假，对 val 进行取反 */
export const ifNot = (val: unknown, ...conditions: boolean[]) => {
  let res: boolean = !!val;
  conditions.forEach((v) => {
    if (v) res = !res;
  });
  return res;
};

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

/** 返回 Dom 的点击函数 */
export const querySelectorClick = (
  selector: string | (() => HTMLElement | undefined | null),
) => {
  const getDom = () =>
    typeof selector === 'string' ? querySelector(selector) : selector();
  if (getDom()) return () => getDom()?.click();
};

/** 判断两个列表中包含的值是否相同 */
export const isEqualArray = <T>(a: T[], b: T[]): boolean =>
  a.length === b.length && !a.some((t) => !b.includes(t));

/** 找出数组中出现最多次的元素 */
export const getMostItem = <T>(list: T[]) => {
  const counts = list.reduce((map, val) => {
    map.set(val, map.get(val) ?? 0 + 1);
    return map;
  }, new Map<T, number>());

  return [...counts.entries()].reduce((maxItem, item) =>
    maxItem[1] > item[1] ? maxItem : item,
  )[0];
};

/** 将数组扩充到指定长度，不足项用空字符串补足 */
export const createFillImgList = (imgList: string[], length: number) =>
  [...imgList, ...Array(length - imgList.length).fill('')] as string[];

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
export const scrollIntoView = (
  selector: string,
  behavior: ScrollBehavior = 'instant',
) => querySelector(selector)?.scrollIntoView({ behavior });

/** 循环执行指定函数 */
export const loop = async (fn: () => unknown, ms = 0) => {
  await fn();
  setTimeout(loop, ms, fn);
};

/** 使指定函数延迟运行期间的多次调用直到运行结束 */
export const singleThreaded = <T extends any[]>(
  callback: (...args: T) => unknown,
) => {
  let running = false;
  let continueRun = false;

  const fn = async (...args: T) => {
    if (continueRun) return;
    if (running) {
      continueRun = true;
      return;
    }

    try {
      running = true;
      await callback(...args);
    } catch (error) {
      continueRun = false;
      await sleep(100);
      throw error;
    } finally {
      running = false;
    }

    if (continueRun) {
      continueRun = false;
      setTimeout(fn);
    } else running = false;
  };

  return fn;
};

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

  while (doneNum !== totalNum) {
    while (taskList.length && execPool.size < limit) {
      taskList.shift()!();
    }
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
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

/** 等到传入的函数返回 true */
export const wait = async <T>(
  fn: () => T | undefined | Promise<T | undefined>,
  timeout = Infinity,
): Promise<TrueValue<T>> => {
  let res: T | undefined = await fn();
  let _timeout = timeout;
  while (_timeout > 0 && !res) {
    await sleep(10);
    _timeout -= 10;
    res = await fn();
  }
  return res as TrueValue<T>;
};

/** 等到指定的 dom 出现 */
export const waitDom = (selector: string) =>
  wait(() => querySelector(selector) as HTMLElement);

/** 等待指定的图片元素加载完成 */
export const waitImgLoad = (img: HTMLImageElement, timeout = 1000 * 10) =>
  new Promise<ErrorEvent | null>((resolve) => {
    const id = window.setTimeout(
      () => resolve(new ErrorEvent('timeout')),
      timeout,
    );
    img.addEventListener('load', () => {
      resolve(null);
      window.clearTimeout(id);
    });
    img.addEventListener('error', (e) => {
      resolve(e);
      window.clearTimeout(id);
    });
  });

/** 将指定的布尔值转换为字符串或未定义 */
export const boolDataVal = (val: boolean) => (val ? '' : undefined);

/**
 *
 * 通过滚动到指定图片元素位置并停留一会来触发图片的懒加载，返回图片 src 是否发生变化
 *
 * 会在触发后重新滚回原位，当 time 为 0 时，因为滚动速度很快所以是无感的
 */
export const triggerEleLazyLoad = async (
  e: HTMLImageElement,
  time?: number,
  isLazyLoaded?: () => boolean | Promise<boolean>,
) => {
  const nowScroll = window.scrollY;
  e.scrollIntoView({ behavior: 'instant' });
  e.dispatchEvent(new Event('scroll', { bubbles: true }));

  try {
    if (isLazyLoaded && time) return await wait(isLazyLoaded, time);
  } finally {
    window.scroll({ top: nowScroll, behavior: 'auto' });
  }
};

/** 获取图片尺寸 */
export const getImgSize = async (
  url: string,
): Promise<[number, number] | null> => {
  let error = false;
  const image = new Image();
  try {
    image.onerror = () => {
      error = true;
    };
    image.src = url;

    await wait(() => !error && (image.naturalWidth || image.naturalHeight));
    if (error) return null;
    return [image.naturalWidth, image.naturalHeight];
  } catch (_) {
    return null;
  } finally {
    image.src = '';
  }
};

/** 测试图片 url 能否正确加载 */
export const testImgUrl = (url: string) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });

export const canvasToBlob = (
  canvas: HTMLCanvasElement,
  type?: string,
  quality = 1,
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
      type,
      quality,
    );
  });

/**
 * 求 a 和 b 的差集，相当于从 a 中删去和 b 相同的属性
 *
 * 不会修改参数对象，返回的是新对象
 */
export const difference = <T extends object>(a: T, b: T): Partial<T> => {
  const res = {};
  const keys = Object.keys(a);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (typeof a[key] === 'object' && typeof b[key] === 'object') {
      const _res = difference(a[key], b[key]);
      if (Object.keys(_res).length) res[key] = _res;
    } else if (a[key] !== b?.[key]) res[key] = a[key];
  }
  return res;
};

/**
 * Object.assign 的深拷贝版，不会导致 a 子对象属性的缺失
 *
 * 不会修改参数对象，返回的是新对象
 */
export const assign = <T extends object>(a: T, b: T): T => {
  const res = JSON.parse(JSON.stringify(a)) as T;
  const keys = Object.keys(b);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (res[key] === undefined) res[key] = b[key];
    else if (typeof b[key] === 'object') {
      const _res = assign(res[key], b[key]);
      if (Object.keys(_res).length) res[key] = _res;
    } else if (res[key] !== b[key]) res[key] = b[key];
  }
  return res;
};

/** 根据路径获取对象下的指定值 */
export const byPath = <T = object>(
  obj: object,
  path: string,
  handleVal?: (parentObj: object, key: string) => unknown,
) => {
  const keys = path.split('.');
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
  return window.setTimeout(callback, 1);
};

/**
 * 通过监视点击等会触发动态加载的事件，在触发动态加载后更新图片列表等
 * @param update 动态加载后的重新加载
 */
export const autoUpdate = (update: () => Promise<void>) => {
  let running = false;

  const refresh = async () => {
    running = true;
    try {
      await update();
    } finally {
      running = false;
    }
  };

  ['click', 'popstate'].forEach((eventName) => {
    window.addEventListener(eventName, () =>
      setTimeout(() => {
        if (running) return;
        refresh();
      }, 100),
    );
  });

  refresh();
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
