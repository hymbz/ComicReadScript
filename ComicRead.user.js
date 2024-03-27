// ==UserScript==
// @name            ComicRead
// @namespace       ComicRead
// @version         8.8.0
// @description     为漫画站增加双页阅读、翻译等优化体验的增强功能。百合会——「记录阅读历史、自动签到等」、百合会新站、动漫之家——「解锁隐藏漫画」、E-Hentai——「匹配 nhentai 漫画」、nhentai——「彻底屏蔽漫画、自动翻页」、Yurifans——「自动签到」、拷贝漫画(copymanga)——「显示最后阅读记录」、PonpomuYuri、明日方舟泰拉记事社、禁漫天堂、漫画柜(manhuagui)、漫画DB(manhuadb)、动漫屋(dm5)、绅士漫画(wnacg)、mangabz、komiic、hitomi、Anchira、kemono、nekohouse、welovemanga
// @description:en  Add enhanced features to the comic site for optimized experience, including dual-page reading and translation.
// @description:ru  Добавляет расширенные функции для удобства на сайт, такие как двухстраничный режим и перевод.
// @author          hymbz
// @license         AGPL-3.0-or-later
// @noframes
// @match           *://*/*
// @connect         cdn.jsdelivr.net
// @connect         yamibo.com
// @connect         dmzj.com
// @connect         idmzj.com
// @connect         exhentai.org
// @connect         e-hentai.org
// @connect         hath.network
// @connect         nhentai.net
// @connect         hypergryph.com
// @connect         mangabz.com
// @connect         copymanga.site
// @connect         copymanga.info
// @connect         copymanga.net
// @connect         copymanga.org
// @connect         copymanga.tv
// @connect         mangacopy.com
// @connect         xsskc.com
// @connect         self
// @connect         127.0.0.1
// @connect         *
// @grant           GM_addElement
// @grant           GM_getResourceText
// @grant           GM_xmlhttpRequest
// @grant           GM.addValueChangeListener
// @grant           GM.removeValueChangeListener
// @grant           GM.getResourceText
// @grant           GM.addStyle
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.listValues
// @grant           GM.deleteValue
// @grant           GM.registerMenuCommand
// @grant           GM.unregisterMenuCommand
// @grant           unsafeWindow
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC
// @resource        solid-js https://registry.npmmirror.com/solid-js/1.8.12/files/dist/solid.cjs
// @resource        fflate https://registry.npmmirror.com/fflate/0.8.1/files/umd/index.js
// @resource        qr-scanner https://registry.npmmirror.com/qr-scanner/1.4.2/files/qr-scanner.legacy.min.js
// @resource        dmzjDecrypt https://greasyfork.org/scripts/467177/code/dmzjDecrypt.js?version=1207199
// @resource        solid-js|store https://registry.npmmirror.com/solid-js/1.8.12/files/store/dist/store.cjs
// @resource        solid-js|web https://registry.npmmirror.com/solid-js/1.8.12/files/web/dist/web.cjs
// @supportURL      https://github.com/hymbz/ComicReadScript/issues
// @updateURL       https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// @downloadURL     https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js
// ==/UserScript==

/**
 * 虽然在打包的时候已经尽可能保持代码格式不变了，但因为脚本代码比较多的缘故
 * 所以真对脚本代码感兴趣的话，推荐还是直接上 github 仓库来看
 * <https://github.com/hymbz/ComicReadScript>
 * 对站点逻辑感兴趣的，结合 `src\index.ts` 看 `src\site` 下的对应文件即可
 */

const gmApi = {
  GM,
  GM_addElement: typeof GM_addElement === 'undefined' ? undefined : GM_addElement,
  GM_getResourceText,
  GM_xmlhttpRequest,
  unsafeWindow
};
const gmApiList = Object.keys(gmApi);
const crsLib = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: {
    env: {
      NODE_ENV: 'production'
    }
  },
  ...gmApi
};
const tempName = Math.random().toString(36).slice(2);
const evalCode = code => {
  // 因为部分网站会对 eval 进行限制，比如推特（CSP）、hitomi（代理 window.eval 进行拦截）
  // 所以优先使用最通用的 GM_addElement 来加载
  if (gmApi.GM_addElement) return GM_addElement('script', {
    textContent: code
  })?.remove();

  // eslint-disable-next-line no-eval
  eval.call(unsafeWindow, code);
};

/**
 * 通过 Resource 导入外部模块
 * @param name \@resource 引用的资源名
 */
const selfImportSync = name => {
  const code = name !== 'main' ? GM_getResourceText(name.replaceAll('/', '|')) :`
const solidJs = require('solid-js');
const web = require('solid-js/web');
const store$2 = require('solid-js/store');
const fflate = require('fflate');
const main = require('main');
const QrScanner = require('qr-scanner');

// src/index.ts
var triggerOptions = !web.isServer && solidJs.DEV ? { equals: false, name: "trigger" } : { equals: false };
var triggerCacheOptions = !web.isServer && solidJs.DEV ? { equals: false, internal: true } : triggerOptions;
var TriggerCache = class {
  #map;
  constructor(mapConstructor = Map) {
    this.#map = new mapConstructor();
  }
  dirty(key) {
    if (web.isServer)
      return;
    this.#map.get(key)?.$$();
  }
  track(key) {
    if (!solidJs.getListener())
      return;
    let trigger = this.#map.get(key);
    if (!trigger) {
      const [$, $$] = solidJs.createSignal(void 0, triggerCacheOptions);
      this.#map.set(key, trigger = { $, $$, n: 1 });
    } else
      trigger.n++;
    solidJs.onCleanup(() => {
      if (trigger.n-- === 1)
        queueMicrotask(() => trigger.n === 0 && this.#map.delete(key));
    });
    trigger.$();
  }
};

// src/index.ts
var $KEYS = Symbol("track-keys");
var ReactiveSet = class extends Set {
  #triggers = new TriggerCache();
  constructor(values) {
    super();
    if (values)
      for (const v of values)
        super.add(v);
  }
  // reads
  get size() {
    this.#triggers.track($KEYS);
    return super.size;
  }
  has(v) {
    this.#triggers.track(v);
    return super.has(v);
  }
  *keys() {
    for (const key of super.keys()) {
      this.#triggers.track(key);
      yield key;
    }
    this.#triggers.track($KEYS);
  }
  values() {
    return this.keys();
  }
  *entries() {
    for (const key of super.keys()) {
      this.#triggers.track(key);
      yield [key, key];
    }
    this.#triggers.track($KEYS);
  }
  [Symbol.iterator]() {
    return this.values();
  }
  forEach(callbackfn) {
    this.#triggers.track($KEYS);
    super.forEach(callbackfn);
  }
  // writes
  add(v) {
    if (!super.has(v)) {
      super.add(v);
      solidJs.batch(() => {
        this.#triggers.dirty(v);
        this.#triggers.dirty($KEYS);
      });
    }
    return this;
  }
  delete(v) {
    const r = super.delete(v);
    if (r) {
      solidJs.batch(() => {
        this.#triggers.dirty(v);
        this.#triggers.dirty($KEYS);
      });
    }
    return r;
  }
  clear() {
    if (super.size) {
      solidJs.batch(() => {
        for (const v of super.keys())
          this.#triggers.dirty(v);
        super.clear();
        this.#triggers.dirty($KEYS);
      });
    }
  }
};

// src/index.ts
var debounce$1 = (callback, wait) => {
  if (web.isServer) {
    return Object.assign(() => void 0, { clear: () => void 0 });
  }
  let timeoutId;
  const clear = () => clearTimeout(timeoutId);
  if (solidJs.getOwner())
    solidJs.onCleanup(clear);
  const debounced = (...args) => {
    if (timeoutId !== void 0)
      clear();
    timeoutId = setTimeout(() => callback(...args), wait);
  };
  return Object.assign(debounced, { clear });
};
var throttle$1 = (callback, wait) => {
  if (web.isServer) {
    return Object.assign(() => void 0, { clear: () => void 0 });
  }
  let isThrottled = false, timeoutId, lastArgs;
  const throttled = (...args) => {
    lastArgs = args;
    if (isThrottled)
      return;
    isThrottled = true;
    timeoutId = setTimeout(() => {
      callback(...lastArgs);
      isThrottled = false;
    }, wait);
  };
  const clear = () => {
    clearTimeout(timeoutId);
    isThrottled = false;
  };
  if (solidJs.getOwner())
    solidJs.onCleanup(clear);
  return Object.assign(throttled, { clear });
};
var scheduleIdle = web.isServer ? () => Object.assign(() => void 0, { clear: () => void 0 }) : (
  // requestIdleCallback is not supported in Safari
  window.requestIdleCallback ? (callback, maxWait) => {
    let isDeferred = false, id, lastArgs;
    const deferred = (...args) => {
      lastArgs = args;
      if (isDeferred)
        return;
      isDeferred = true;
      id = requestIdleCallback(
        () => {
          callback(...lastArgs);
          isDeferred = false;
        },
        { timeout: maxWait }
      );
    };
    const clear = () => {
      cancelIdleCallback(id);
      isDeferred = false;
    };
    if (solidJs.getOwner())
      solidJs.onCleanup(clear);
    return Object.assign(deferred, { clear });
  } : (
    // fallback to setTimeout (throttle)
    (callback) => throttle$1(callback)
  )
);
function leadingAndTrailing(schedule, callback, wait) {
  if (web.isServer) {
    let called = false;
    const scheduled2 = (...args) => {
      if (called)
        return;
      called = true;
      callback(...args);
    };
    return Object.assign(scheduled2, { clear: () => void 0 });
  }
  let State;
  ((State2) => {
    State2[State2["Ready"] = 0] = "Ready";
    State2[State2["Leading"] = 1] = "Leading";
    State2[State2["Trailing"] = 2] = "Trailing";
  })(State || (State = {}));
  let state = 0 /* Ready */;
  const scheduled = schedule((args) => {
    state === 2 /* Trailing */ && callback(...args);
    state = 0 /* Ready */;
  }, wait);
  const fn = (...args) => {
    if (state !== 2 /* Trailing */) {
      if (state === 0 /* Ready */)
        callback(...args);
      state += 1;
    }
    scheduled(args);
  };
  const clear = () => {
    state = 0 /* Ready */;
    scheduled.clear();
  };
  if (solidJs.getOwner())
    solidJs.onCleanup(clear);
  return Object.assign(fn, { clear });
}
function createScheduled(schedule) {
  let listeners = 0;
  let isDirty = false;
  const [track, dirty] = solidJs.createSignal(void 0, { equals: false });
  const call = schedule(() => {
    isDirty = true;
    dirty();
  });
  return () => {
    if (!isDirty)
      call(), track();
    if (isDirty) {
      isDirty = !!listeners;
      return true;
    }
    if (solidJs.getListener()) {
      listeners++;
      solidJs.onCleanup(() => listeners--);
    }
    return false;
  };
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var es6 = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;

    var length, i, keys;
    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (!equal(a[i], b[i])) return false;
      return true;
    }


    if ((a instanceof Map) && (b instanceof Map)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      for (i of a.entries())
        if (!equal(i[1], b.get(i[0]))) return false;
      return true;
    }

    if ((a instanceof Set) && (b instanceof Set)) {
      if (a.size !== b.size) return false;
      for (i of a.entries())
        if (!b.has(i[0])) return false;
      return true;
    }

    if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
      length = a.length;
      if (length != b.length) return false;
      for (i = length; i-- !== 0;)
        if (a[i] !== b[i]) return false;
      return true;
    }


    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];

      if (!equal(a[key], b[key])) return false;
    }

    return true;
  }

  // true if both NaN, false otherwise
  return a!==a && b!==b;
};

const isEqual = /*@__PURE__*/getDefaultExportFromCjs(es6);

const throttle = (fn, wait = 100) => leadingAndTrailing(throttle$1, fn, wait);
const debounce = (fn, wait = 100) => debounce$1(fn, wait);
const sleep = ms => new Promise(resolve => {
  window.setTimeout(resolve, ms);
});
const clamp = (min, val, max) => Math.max(Math.min(max, val), min);
const inRange = (min, val, max) => val >= min && val <= max;

/** 判断两个数是否在指定误差范围内相等 */
const approx = (val, target, range) => Math.abs(target - val) <= range;

/** 根据传入的条件列表的真假，对 val 进行取反 */
const ifNot = (val, ...conditions) => {
  let res = !!val;
  conditions.forEach(v => {
    if (v) res = !res;
  });
  return res;
};

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
const querySelector = selector => document.querySelector(selector);

/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
const querySelectorAll = selector => [...document.querySelectorAll(selector)];

/**
 * 添加元素
 * @param node 被添加元素
 * @param textnode 添加元素
 * @param referenceNode 参考元素，添加元素将插在参考元素前
 */
const insertNode = (node, textnode, referenceNode = null) => {
  const temp = document.createElement('div');
  temp.innerHTML = textnode;
  const frag = document.createDocumentFragment();
  while (temp.firstChild) frag.appendChild(temp.firstChild);
  node.insertBefore(frag, referenceNode);
};

/** 返回 Dom 的点击函数 */
const querySelectorClick = selector => {
  const getDom = () => typeof selector === 'string' ? querySelector(selector) : selector();
  if (getDom()) return () => getDom()?.click();
};

/** 找出数组中出现最多次的元素 */
const getMostItem = list => {
  const counts = list.reduce((map, val) => {
    map.set(val, map.get(val) ?? 0 + 1);
    return map;
  }, new Map());
  return [...counts.entries()].reduce((maxItem, item) => maxItem[1] > item[1] ? maxItem : item)[0];
};

/** 将数组扩充到指定长度，不足项用空字符串补足 */
const createFillImgList = (imgList, length) => [...imgList, ...Array(length - imgList.length).fill('')];

/** 判断字符串是否为 URL */
const isUrl = text => {
  // 等浏览器版本上来后可以直接使用 URL.canParse
  try {
    return !!new URL(text);
  } catch (_) {
    return false;
  }
};

/** 将对象转为 URLParams 类型的字符串 */
const dataToParams = data => Object.entries(data).map(([key, val]) => \`\${key}=\${val}\`).join('&');

/** 将 blob 数据作为文件保存至本地 */
const saveAs = (blob, name = 'download') => {
  const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  a.download = name;
  a.rel = 'noopener';
  a.href = URL.createObjectURL(blob);
  setTimeout(() => a.dispatchEvent(new MouseEvent('click')));
};

/** 监听键盘事件 */
const linstenKeyup = handler => window.addEventListener('keyup', e => {
  // 跳过输入框的键盘事件
  switch (e.target.tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      return;
  }
  handler(e);
});

/** 滚动页面到指定元素的所在位置 */
const scrollIntoView = (selector, behavior = 'instant') => querySelector(selector)?.scrollIntoView({
  behavior
});

/** 循环执行指定函数 */
const loop = async (fn, ms = 0) => {
  await fn();
  setTimeout(loop, ms, fn);
};

/** 使指定函数延迟运行期间的多次调用直到运行结束 */
const singleThreaded = callback => {
  const state = {
    running: false,
    continueRun: false
  };
  const fn = async (...args) => {
    if (state.continueRun) return;
    if (state.running) {
      state.continueRun = true;
      return;
    }
    let res;
    try {
      state.running = true;
      res = await callback(state, ...args);
    } catch (error) {
      state.continueRun = false;
      await sleep(100);
      throw error;
    } finally {
      state.running = false;
    }
    if (state.continueRun) {
      state.continueRun = false;
      setTimeout(fn, 0, ...args);
    } else state.running = false;
    return res;
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
const plimit = async (fnList, callBack = undefined, limit = 10) => {
  let doneNum = 0;
  const totalNum = fnList.length;
  const resList = [];
  const execPool = new Set();
  const taskList = fnList.map((fn, i) => {
    let p;
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
      taskList.shift()();
    }
    await Promise.race(execPool);
  }
  return resList;
};

/**
 * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
 * @param hexColor 十六进制颜色。例如 #112233
 */
const needDarkMode = hexColor => {
  // by: https://24ways.org/2010/calculating-color-contrast
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

/** 等到传入的函数返回 true */
const wait = async (fn, timeout = Infinity) => {
  let res = await fn();
  let _timeout = timeout;
  while (_timeout > 0 && !res) {
    await sleep(10);
    _timeout -= 10;
    res = await fn();
  }
  return res;
};

/** 等到指定的 dom 出现 */
const waitDom = selector => wait(() => querySelector(selector));

/** 等待指定的图片元素加载完成 */
const waitImgLoad = (img, timeout = 1000 * 10) => new Promise(resolve => {
  const id = window.setTimeout(() => resolve(new ErrorEvent('timeout')), timeout);
  img.addEventListener('load', () => {
    resolve(null);
    window.clearTimeout(id);
  });
  img.addEventListener('error', e => {
    resolve(e);
    window.clearTimeout(id);
  });
});

/** 将指定的布尔值转换为字符串或未定义 */
const boolDataVal = val => val ? '' : undefined;

/**
 *
 * 通过滚动到指定图片元素位置并停留一会来触发图片的懒加载，返回图片 src 是否发生变化
 *
 * 会在触发后重新滚回原位，当 time 为 0 时，因为滚动速度很快所以是无感的
 */
const triggerEleLazyLoad = async (e, time, isLazyLoaded) => {
  const nowScroll = window.scrollY;
  e.scrollIntoView({
    behavior: 'instant'
  });
  e.dispatchEvent(new Event('scroll', {
    bubbles: true
  }));
  try {
    if (isLazyLoaded && time) return await wait(isLazyLoaded, time);
  } finally {
    window.scroll({
      top: nowScroll,
      behavior: 'auto'
    });
  }
};

/** 获取图片尺寸 */
const getImgSize = async (url, breakFn) => {
  let error = false;
  const image = new Image();
  try {
    image.onerror = () => {
      error = true;
    };
    image.src = url;
    await wait(() => !error && (image.naturalWidth || image.naturalHeight) && (breakFn ? !breakFn() : true));
    if (error) return null;
    return [image.naturalWidth, image.naturalHeight];
  } catch (e) {
    return null;
  } finally {
    image.src = '';
  }
};

/** 测试图片 url 能否正确加载 */
const testImgUrl = url => new Promise(resolve => {
  const img = new Image();
  img.onload = () => resolve(true);
  img.onerror = () => resolve(false);
  img.src = url;
});
const canvasToBlob = (canvas, type, quality = 1) => new Promise((resolve, reject) => {
  canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), type, quality);
});

/**
 * 求 a 和 b 的差集，相当于从 a 中删去和 b 相同的属性
 *
 * 不会修改参数对象，返回的是新对象
 */
const difference = (a, b) => {
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
const assign = (a, b) => {
  const res = JSON.parse(JSON.stringify(a));
  const keys = Object.keys(b);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (res[key] === undefined) res[key] = b[key];else if (typeof b[key] === 'object') {
      const _res = assign(res[key], b[key]);
      if (Object.keys(_res).length) res[key] = _res;
    } else if (res[key] !== b[key]) res[key] = b[key];
  }
  return res;
};

/** 根据路径获取对象下的指定值 */
const byPath = (obj, path, handleVal) => {
  const keys = path.split('.');
  let target = obj;
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];

    // 兼容含有「.」的 key
    while (!Reflect.has(target, key) && i < keys.length) {
      i += 1;
      if (keys[i] === undefined) break;
      key += \`.\${keys[i]}\`;
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
  return target;
};
const requestIdleCallback$1 = (callback, timeout) => {
  if (Reflect.has(window, 'requestIdleCallback')) return window.requestIdleCallback(callback, {
    timeout
  });
  return window.setTimeout(callback, 16);
};

/**
 * 通过监视点击等会触发动态加载的事件，在触发动态加载后更新图片列表等
 * @param update 动态加载后的重新加载
 */
const autoUpdate = update => {
  const refresh = singleThreaded(update);
  ['click', 'popstate'].forEach(eventName => window.addEventListener(eventName, refresh, {
    capture: true
  }));
  refresh();
};

/** 获取键盘事件的编码 */
const getKeyboardCode = e => {
  let {
    key
  } = e;
  switch (key) {
    case 'Shift':
    case 'Control':
    case 'Alt':
      return key;
  }
  if (e.ctrlKey) key = \`Ctrl + \${key}\`;
  if (e.altKey) key = \`Alt + \${key}\`;
  if (e.shiftKey) key = \`Shift + \${key}\`;
  return key;
};

/** 将快捷键的编码转换成更易读的形式 */
const keyboardCodeToText = code => code.replace('Control', 'Ctrl').replace('ArrowUp', '↑').replace('ArrowDown', '↓').replace('ArrowLeft', '←').replace('ArrowRight', '→').replace(/^\\s$/, 'Space');

/** 创建一个可以不断更新的 style 元素 */
const createStyle = () => {
  let style;
  return async css => {
    if (style) style.textContent = css;else style = await GM.addStyle(css);
  };
};

const prefix = ['%cComicRead', 'background-color: #607d8b; color: white; padding: 2px 4px; border-radius: 4px;'];
const log = (...args) =>
// eslint-disable-next-line no-console
console.log.apply(null, [...prefix, ...args]);
log.warn = (...args) =>
// eslint-disable-next-line no-console
console.warn.apply(null, [...prefix, ...args]);
log.error = (...args) =>
// eslint-disable-next-line no-console
console.error.apply(null, [...prefix, ...args]);

const langList = ['zh', 'en', 'ru'];
/** 判断传入的字符串是否是支持的语言类型代码 */
const isLanguages = lang => !!lang && langList.includes(lang);

/** 返回浏览器偏好语言 */
const getBrowserLang = () => {
  let newLang;
  for (let i = 0; i < navigator.languages.length; i++) {
    const language = navigator.languages[i];
    const matchLang = langList.find(l => l === language || l === language.split('-')[0]);
    if (matchLang) {
      newLang = matchLang;
      break;
    }
  }
  return newLang;
};
const getSaveLang = () => typeof GM !== 'undefined' ? GM.getValue('Languages') : localStorage.getItem('Languages');
const setSaveLang = val => typeof GM !== 'undefined' ? GM.setValue('Languages', val) : localStorage.setItem('Languages', val);
const getInitLang = async () => {
  const saveLang = await getSaveLang();
  if (isLanguages(saveLang)) return saveLang;
  const lang = getBrowserLang() ?? 'zh';
  setSaveLang(lang);
  return lang;
};

const zh = {
  alert: {
    comic_load_error: "漫画加载出错",
    download_failed: "下载失败",
    fetch_comic_img_failed: "获取漫画图片失败",
    img_load_failed: "图片加载失败",
    no_img_download: "没有能下载的图片",
    repeat_load: "加载图片中，请稍候",
    server_connect_failed: "无法连接到服务器"
  },
  button: {
    close_current_page_translation: "关闭当前页的翻译",
    download: "下载",
    download_completed: "下载完成",
    downloading: "下载中",
    exit: "退出",
    grid_mode: "网格模式",
    packaging: "打包中",
    page_fill: "页面填充",
    page_mode_double: "双页模式",
    page_mode_single: "单页模式",
    scroll_mode: "卷轴模式",
    setting: "设置",
    translate_current_page: "翻译当前页",
    zoom_in: "放大"
  },
  description: "为漫画站增加双页阅读、翻译等优化体验的增强功能。",
  end_page: {
    next_button: "下一话",
    prev_button: "上一话",
    tip: {
      end_jump: "已到结尾，继续向下翻页将跳至下一话",
      exit: "已到结尾，继续翻页将退出",
      start_jump: "已到开头，继续向上翻页将跳至上一话"
    }
  },
  hotkeys: {
    enter_read_mode: "进入阅读模式",
    exit: "退出",
    jump_to_end: "跳至尾页",
    jump_to_home: "跳至首页",
    switch_auto_enlarge: "切换图片自动放大选项",
    switch_dir: "切换阅读方向",
    switch_grid_mode: "切换网格模式",
    switch_page_fill: "切换页面填充",
    switch_scroll_mode: "切换卷轴模式",
    switch_single_double_page_mode: "切换单双页模式",
    turn_page_down: "向下翻页",
    turn_page_left: "向左翻页",
    turn_page_right: "向右翻页",
    turn_page_up: "向上翻页",
    translate_current_page: "翻译当前页"
  },
  img_status: {
    error: "加载出错",
    loading: "正在加载",
    wait: "等待加载"
  },
  other: {
    auto_enter_read_mode: "自动进入阅读模式",
    "default": "默认",
    disable: "禁用",
    enter_comic_read_mode: "进入漫画阅读模式",
    fab_hidden: "隐藏悬浮按钮",
    fab_show: "显示悬浮按钮",
    fill_page: "填充页",
    img_loading: "图片加载中",
    loading_img: "加载图片中",
    read_mode: "阅读模式"
  },
  pwa: {
    alert: {
      img_data_error: "图片数据错误",
      img_not_found: "找不到图片",
      img_not_found_files: "请选择图片文件或含有图片文件的压缩包",
      img_not_found_folder: "文件夹下没有图片文件或含有图片文件的压缩包",
      not_valid_url: "不是有效的 URL",
      repeat_load: "正在加载其他文件中……",
      unzip_error: "解压出错",
      unzip_password_error: "解压密码错误",
      userscript_not_installed: "未安装 ComicRead 脚本"
    },
    button: {
      enter_url: "输入 URL",
      install: "安装",
      no_more_prompt: "不再提示",
      resume_read: "恢复阅读",
      select_files: "选择文件",
      select_folder: "选择文件夹"
    },
    install_md: "### 每次都要打开这个网页很麻烦？\\n如果你希望\\n1. 能有独立的窗口，像是在使用本地软件一样\\n1. 加入本地压缩文件的打开方式之中，方便直接打开\\n1. 离线使用~~（主要是担心国内网络抽风无法访问这个网页~~\\n### 欢迎将本页面作为 PWA 应用安装到电脑上😃👍",
    message: {
      enter_password: "请输入密码",
      unzipping: "解压缩中"
    },
    tip_enter_url: "请输入压缩包 URL",
    tip_md: "# ComicRead PWA\\n使用 [ComicRead](https://github.com/hymbz/ComicReadScript) 的阅读模式阅读**本地**漫画\\n---\\n### 将图片文件、文件夹、压缩包直接拖入即可开始阅读\\n*也可以选择**直接粘贴**或**输入**压缩包 URL 下载阅读*"
  },
  setting: {
    hotkeys: {
      add: "添加新快捷键",
      restore: "恢复默认快捷键"
    },
    language: "语言",
    option: {
      always_load_all_img: "始终加载所有图片",
      background_color: "背景颜色",
      click_page_turn_area: "点击区域",
      click_page_turn_enabled: "点击翻页",
      click_page_turn_swap_area: "左右点击区域交换",
      click_page_turn_vertical: "上下翻页",
      dark_mode: "夜间模式",
      dir_ltr: "从左到右（美漫）",
      dir_rtl: "从右到左（日漫）",
      disable_auto_enlarge: "禁止图片自动放大",
      first_page_fill: "默认启用首页填充",
      jump_to_next_chapter: "翻页至上/下一话",
      paragraph_dir: "阅读方向",
      paragraph_display: "显示",
      paragraph_hotkeys: "快捷键",
      paragraph_operation: "操作",
      paragraph_other: "其他",
      paragraph_scrollbar: "滚动条",
      paragraph_translation: "翻译",
      preload_page_num: "预加载页数",
      scroll_mode_img_scale: "卷轴图片缩放",
      scroll_mode_img_spacing: "卷轴图片间距",
      scrollbar_auto_hidden: "自动隐藏",
      scrollbar_easy_scroll: "快捷滚动",
      scrollbar_position: "位置",
      scrollbar_position_auto: "自动",
      scrollbar_position_bottom: "底部",
      scrollbar_position_hidden: "隐藏",
      scrollbar_position_right: "右侧",
      scrollbar_position_top: "顶部",
      scrollbar_show_img_status: "显示图片加载状态",
      show_clickable_area: "显示点击区域",
      show_comments: "在结束页显示评论",
      swap_page_turn_key: "左右翻页键交换"
    },
    translation: {
      cotrans_tip: "<p>将使用 <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans</a> 提供的接口翻译图片，该服务器由其维护者用爱发电自费维护</p>\\n<p>多人同时使用时需要排队等待，等待队列达到上限后再上传新图片会报错，需要过段时间再试</p>\\n<p>所以还请 <b>注意用量</b></p>\\n<p>更推荐使用自己本地部署的项目，既不占用服务器资源也不需要排队</p>",
      options: {
        detection_resolution: "文本扫描清晰度",
        direction: "渲染字体方向",
        direction_auto: "原文一致",
        direction_horizontal: "仅限水平",
        direction_vertical: "仅限垂直",
        forceRetry: "忽略缓存强制重试",
        localUrl: "自定义服务器 URL",
        onlyDownloadTranslated: "只下载完成翻译的图片",
        target_language: "目标语言",
        text_detector: "文本扫描器",
        translator: "翻译服务"
      },
      server: "翻译服务器",
      server_selfhosted: "本地部署",
      translate_after_current: "翻译当前页至结尾",
      translate_all_img: "翻译全部图片"
    }
  },
  site: {
    add_feature: {
      associate_nhentai: "关联nhentai",
      auto_page_turn: "自动翻页",
      block_totally: "彻底屏蔽漫画",
      detect_ad: "识别广告页",
      hotkeys_page_turn: "快捷键翻页",
      open_link_new_page: "在新页面中打开链接",
      remember_current_site: "记住当前站点"
    },
    changed_load_failed: "网站发生变化，无法加载漫画",
    ehentai: {
      fetch_img_page_source_failed: "获取图片页源码失败",
      fetch_img_page_url_failed: "从详情页获取图片页地址失败",
      fetch_img_url_failed: "从图片页获取图片地址失败",
      html_changed_nhentai_failed: "页面结构发生改变，关联 nhentai 漫画功能无法正常生效",
      ip_banned: "IP地址被禁",
      nhentai_error: "nhentai 匹配出错",
      nhentai_failed: "匹配失败，请在确认登录 {{nhentai}} 后刷新"
    },
    need_captcha: "需要人机验证",
    nhentai: {
      fetch_next_page_failed: "获取下一页漫画数据失败",
      tag_blacklist_fetch_failed: "标签黑名单获取失败"
    },
    settings_tip: "设置",
    show_settings_menu: "显示设置菜单",
    simple: {
      auto_read_mode_message: "已默认开启「自动进入阅读模式」",
      no_img: "未找到合适的漫画图片，\\n如有需要可点此关闭简易阅读模式",
      simple_read_mode: "使用简易阅读模式"
    }
  },
  touch_area: {
    menu: "菜单",
    next: "下页",
    prev: "上页",
    type: {
      edge: "边缘",
      l: "L",
      left_right: "左右",
      up_down: "上下"
    }
  },
  translation: {
    status: {
      "default": "未知状态",
      detection: "正在检测文本",
      downscaling: "正在缩小图片",
      error: "翻译出错",
      "error-lang": "你选择的翻译服务不支持你选择的语言",
      "error-translating": "翻译服务没有返回任何文本",
      "error-with-id": "翻译出错",
      finished: "正在整理结果",
      inpainting: "正在修补图片",
      "mask-generation": "正在生成文本掩码",
      ocr: "正在识别文本",
      pending: "正在等待",
      "pending-pos": "正在等待",
      rendering: "正在渲染",
      saved: "保存结果",
      textline_merge: "正在整合文本",
      translating: "正在翻译文本",
      upscaling: "正在放大图片"
    },
    tip: {
      check_img_status_failed: "检查图片状态失败",
      download_img_failed: "下载图片失败",
      error: "翻译出错",
      get_translator_list_error: "获取可用翻译服务列表时出错",
      id_not_returned: "未返回 id",
      img_downloading: "正在下载图片",
      img_not_fully_loaded: "图片未加载完毕",
      pending: "正在等待，列队还有 {{pos}} 张图片",
      resize_img_failed: "缩放图片失败",
      translation_completed: "翻译完成",
      upload_error: "图片上传出错",
      upload_return_error: "服务器翻译出错",
      wait_translation: "等待翻译"
    },
    translator: {
      baidu: "百度",
      deepl: "DeepL",
      google: "谷歌",
      "gpt3.5": "GPT-3.5",
      none: "删除文本",
      offline: "离线模型",
      original: "原文",
      youdao: "有道"
    }
  }
};

const en = {
  alert: {
    comic_load_error: "Comic loading error",
    download_failed: "Download failed",
    fetch_comic_img_failed: "Failed to fetch comic images",
    img_load_failed: "Image loading failed",
    no_img_download: "No images available for download",
    repeat_load: "Loading image, please wait",
    server_connect_failed: "Unable to connect to the server"
  },
  button: {
    close_current_page_translation: "Close translation of the current page",
    download: "Download",
    download_completed: "Download completed",
    downloading: "Downloading",
    exit: "Exit",
    grid_mode: "Grid mode",
    packaging: "Packaging",
    page_fill: "Page fill",
    page_mode_double: "Double page mode",
    page_mode_single: "Single page mode",
    scroll_mode: "Scroll mode",
    setting: "Settings",
    translate_current_page: "Translate current page",
    zoom_in: "Zoom in"
  },
  description: "Add enhanced features to the comic site for optimized experience, including dual-page reading and translation.",
  end_page: {
    next_button: "Next chapter",
    prev_button: "Prev chapter",
    tip: {
      end_jump: "Reached the last page, scrolling down will jump to the next chapter",
      exit: "Reached the last page, scrolling down will exit",
      start_jump: "Reached the first page, scrolling up will jump to the previous chapter"
    }
  },
  hotkeys: {
    enter_read_mode: "Enter reading mode",
    exit: "Exit",
    jump_to_end: "Jump to the last page",
    jump_to_home: "Jump to the first page",
    switch_auto_enlarge: "Switch auto image enlarge option",
    switch_dir: "Switch reading direction",
    switch_grid_mode: "Switch grid mode",
    switch_page_fill: "Switch page fill",
    switch_scroll_mode: "Switch scroll mode",
    switch_single_double_page_mode: "Switch single/double page mode",
    turn_page_down: "Turn the page to the down",
    turn_page_left: "Turn the page to the left",
    turn_page_right: "Turn the page to the right",
    turn_page_up: "Turn the page to the up",
    translate_current_page: "Translate current page"
  },
  img_status: {
    error: "Load Error",
    loading: "Loading",
    wait: "Waiting for load"
  },
  other: {
    auto_enter_read_mode: "Auto enter reading mode",
    "default": "Default",
    disable: "Disable",
    enter_comic_read_mode: "Enter comic reading mode",
    fab_hidden: "Hide floating button",
    fab_show: "Show floating button",
    fill_page: "Fill Page",
    img_loading: "Image loading",
    loading_img: "Loading image",
    read_mode: "Reading mode"
  },
  pwa: {
    alert: {
      img_data_error: "Image data error",
      img_not_found: "Image not found",
      img_not_found_files: "Please select an image file or a compressed file containing image files",
      img_not_found_folder: "No image files or compressed files containing image files in the folder",
      not_valid_url: "Not a valid URL",
      repeat_load: "Loading other files…",
      unzip_error: "Decompression error",
      unzip_password_error: "Decompression password error",
      userscript_not_installed: "ComicRead userscript not installed"
    },
    button: {
      enter_url: "Enter URL",
      install: "Install",
      no_more_prompt: "Do not prompt again",
      resume_read: "Restore reading",
      select_files: "Select File",
      select_folder: "Select folder"
    },
    install_md: "### Tired of opening this webpage every time?\\nIf you wish to:\\n1. Have an independent window, as if using local software\\n1. Add to the local compressed file opening method for easy direct opening\\n1. Use offline\\n### Welcome to install this page as a PWA app on your computer😃👍",
    message: {
      enter_password: "Please enter your password",
      unzipping: "Unzipping"
    },
    tip_enter_url: "Please enter the URL of the compressed file",
    tip_md: "# ComicRead PWA\\nRead **local** comics using [ComicRead](https://github.com/hymbz/ComicReadScript) reading mode.\\n---\\n### Drag and drop image files, folders, or compressed files directly to start reading\\n*You can also choose to **paste directly** or **enter** the URL of the compressed file for downloading and reading*"
  },
  setting: {
    hotkeys: {
      add: "Add new hotkeys",
      restore: "Restore default hotkeys"
    },
    language: "Language",
    option: {
      always_load_all_img: "Always load all images",
      background_color: "Background Color",
      click_page_turn_area: "Touch area",
      click_page_turn_enabled: "Click to turn page",
      click_page_turn_swap_area: "Swap LR clickable areas",
      click_page_turn_vertical: "Vertically arranged clickable areas",
      dark_mode: "Dark mode",
      dir_ltr: "LTR (American comics)",
      dir_rtl: "RTL (Japanese manga)",
      disable_auto_enlarge: "Disable automatic image enlarge",
      first_page_fill: "Enable first page fill by default",
      jump_to_next_chapter: "Turn to the next/previous chapter",
      paragraph_dir: "Reading direction",
      paragraph_display: "Display",
      paragraph_hotkeys: "Hotkeys",
      paragraph_operation: "Operation",
      paragraph_other: "Other",
      paragraph_scrollbar: "Scrollbar",
      paragraph_translation: "Translation",
      preload_page_num: "Preload page number",
      scroll_mode_img_scale: "Scroll mode image zoom ratio",
      scroll_mode_img_spacing: "Scroll mode image spacing",
      scrollbar_auto_hidden: "Auto hide",
      scrollbar_easy_scroll: "Easy scroll",
      scrollbar_position: "position",
      scrollbar_position_auto: "Auto",
      scrollbar_position_bottom: "Bottom",
      scrollbar_position_hidden: "Hidden",
      scrollbar_position_right: "Right",
      scrollbar_position_top: "Top",
      scrollbar_show_img_status: "Show image loading status",
      show_clickable_area: "Show clickable areas",
      show_comments: "Show comments on the end page",
      swap_page_turn_key: "Swap LR page-turning keys"
    },
    translation: {
      cotrans_tip: "<p>Using the interface provided by <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans</a> to translate images, which is maintained by its maintainer at their own expense.</p>\\n<p>When multiple people use it at the same time, they need to queue and wait. If the waiting queue reaches its limit, uploading new images will result in an error. Please try again after a while.</p>\\n<p>So please <b>mind the frequency of use</b>.</p>\\n<p>It is highly recommended to use your own locally deployed project, as it does not consume server resources and does not require queuing.</p>",
      options: {
        detection_resolution: "Text detection resolution",
        direction: "Render text orientation",
        direction_auto: "Follow source",
        direction_horizontal: "Horizontal only",
        direction_vertical: "Vertical only",
        forceRetry: "Force retry (ignore cache)",
        localUrl: "customize server URL",
        onlyDownloadTranslated: "Download only the translated images",
        target_language: "Target language",
        text_detector: "Text detector",
        translator: "Translator"
      },
      server: "Translation server",
      server_selfhosted: "Selfhosted",
      translate_after_current: "Translate the current page to the end",
      translate_all_img: "Translate all images"
    }
  },
  site: {
    add_feature: {
      associate_nhentai: "Associate nhentai",
      auto_page_turn: "Auto page turning",
      block_totally: "Totally block comics",
      detect_ad: "Detect advertise page",
      hotkeys_page_turn: "Page turning with hotkeys",
      open_link_new_page: "Open links in a new page",
      remember_current_site: "Remember the current site"
    },
    changed_load_failed: "The website has undergone changes, unable to load comics",
    ehentai: {
      fetch_img_page_source_failed: "Failed to get the source code of the image page",
      fetch_img_page_url_failed: "Failed to get the image page address from the detail page",
      fetch_img_url_failed: "Failed to get the image address from the image page",
      html_changed_nhentai_failed: "The web page structure has changed, the function to associate nhentai comics is not working properly",
      ip_banned: "IP address is banned",
      nhentai_error: "Error in nhentai matching",
      nhentai_failed: "Matching failed, please refresh after confirming login to {{nhentai}}"
    },
    need_captcha: "Need CAPTCHA verification",
    nhentai: {
      fetch_next_page_failed: "Failed to get next page of comic data",
      tag_blacklist_fetch_failed: "Failed to fetch tag blacklist"
    },
    settings_tip: "Settings",
    show_settings_menu: "Show settings menu",
    simple: {
      auto_read_mode_message: "\\"Auto enter reading mode\\" is enabled by default",
      no_img: "No suitable comic images were found. If necessary, you can click here to close the simple reading mode.",
      simple_read_mode: "Enter simple reading mode"
    }
  },
  touch_area: {
    menu: "Menu",
    next: "Next Page",
    prev: "Prev Page",
    type: {
      edge: "Edge",
      l: "L",
      left_right: "Left Right",
      up_down: "Up Down"
    }
  },
  translation: {
    status: {
      "default": "Unknown status",
      detection: "Detecting text",
      downscaling: "Downscaling",
      error: "Error during translation",
      "error-lang": "The target language is not supported by the chosen translator",
      "error-translating": "Did not get any text back from the text translation service",
      "error-with-id": "Error during translation",
      finished: "Finishing",
      inpainting: "Inpainting",
      "mask-generation": "Generating mask",
      ocr: "Scanning text",
      pending: "Pending",
      "pending-pos": "Pending",
      rendering: "Rendering",
      saved: "Saved",
      textline_merge: "Merging text lines",
      translating: "Translating",
      upscaling: "Upscaling"
    },
    tip: {
      check_img_status_failed: "Failed to check image status",
      download_img_failed: "Failed to download image",
      error: "Translation error",
      get_translator_list_error: "Error occurred while getting the list of available translation services",
      id_not_returned: "No id returned",
      img_downloading: "Downloading images",
      img_not_fully_loaded: "Image has not finished loading",
      pending: "Pending, {{pos}} in queue",
      resize_img_failed: "Failed to resize image",
      translation_completed: "Translation completed",
      upload_error: "Image upload error",
      upload_return_error: "Error during server translation",
      wait_translation: "Waiting for translation"
    },
    translator: {
      baidu: "baidu",
      deepl: "DeepL",
      google: "Google",
      "gpt3.5": "GPT-3.5",
      none: "Remove texts",
      offline: "offline translator",
      original: "Original",
      youdao: "youdao"
    }
  }
};

const ru = {
  alert: {
    comic_load_error: "Ошибка загрузки комикса",
    download_failed: "Ошибка загрузки",
    fetch_comic_img_failed: "Не удалось загрузить изображения",
    img_load_failed: "Не удалось загрузить изображение",
    no_img_download: "Нет доступных картинок для загрузки",
    repeat_load: "Загрузка изображения, пожалуйста подождите",
    server_connect_failed: "Не удалось подключиться к серверу"
  },
  button: {
    close_current_page_translation: "Скрыть перевод текущей страницы",
    download: "Скачать",
    download_completed: "Загрузка завершена",
    downloading: "Скачивание",
    exit: "Выход",
    grid_mode: "Режим сетки",
    packaging: "Упаковка",
    page_fill: "Заполнить страницу",
    page_mode_double: "Двухчастичный режим",
    page_mode_single: "Одностраничный режим",
    scroll_mode: "Режим прокрутки",
    setting: "Настройки",
    translate_current_page: "Перевести текущую страницу",
    zoom_in: "Приблизить"
  },
  description: "Добавляет расширенные функции для удобства на сайт, такие как двухстраничный режим и перевод.",
  end_page: {
    next_button: "Следующая глава",
    prev_button: "Предыдущая глава",
    tip: {
      end_jump: "Последняя страница, следующая глава ниже",
      exit: "Последняя страница, ниже комикс будет закрыт",
      start_jump: "Первая страница, выше будет загружена предыдущая глава"
    }
  },
  hotkeys: {
    enter_read_mode: "Режим чтения",
    exit: "Выход",
    jump_to_end: "Перейти к последней странице",
    jump_to_home: "Перейти к первой странице",
    switch_auto_enlarge: "Автоматическое приближение",
    switch_dir: "Направление чтения",
    switch_grid_mode: "Режим сетки",
    switch_page_fill: "Заполнение страницы",
    switch_scroll_mode: "Режим прокрутки",
    switch_single_double_page_mode: "Одностраничный/Двухстраничный режим",
    turn_page_down: "Перелистнуть страницу вниз",
    turn_page_left: "Перелистнуть страницу влево",
    turn_page_right: "Перелистнуть страницу вправо",
    turn_page_up: "Перелистнуть страницу вверх",
    translate_current_page: "Перевести текущую страницу"
  },
  img_status: {
    error: "Ошибка загрузки",
    loading: "Загрузка",
    wait: "Ожидание загрузки"
  },
  other: {
    auto_enter_read_mode: "Автоматически включать режим чтения",
    "default": "Дефолт",
    disable: "Отключить",
    enter_comic_read_mode: "Режим чтения комиксов",
    fab_hidden: "Скрыть плавающую кнопку",
    fab_show: "Показать плавающую кнопку",
    fill_page: "Заполнить страницу",
    img_loading: "Изображение загружается",
    loading_img: "Загрузка изображения",
    read_mode: "Режим чтения"
  },
  pwa: {
    alert: {
      img_data_error: "Ошибка данных изображения",
      img_not_found: "Изображение не найдено",
      img_not_found_files: "Пожалуйста выберите файл или архив с изображениями",
      img_not_found_folder: "В папке не найдены изображения или архивы с изображениями",
      not_valid_url: "Невалидный URL",
      repeat_load: "Загрузка других файлов…",
      unzip_error: "Ошибка распаковки",
      unzip_password_error: "Неверный пароль от архива",
      userscript_not_installed: "ComicRead не установлен"
    },
    button: {
      enter_url: "Ввести URL",
      install: "Установить",
      no_more_prompt: "Больше не показывать",
      resume_read: "Продолжить чтение",
      select_files: "Выбрать файл",
      select_folder: "Выбрать папку"
    },
    install_md: "### Устали открывать эту страницу каждый раз?\\nЕсли вы хотите:\\n1. Иметь отдельное окно, как если бы вы использовали обычное программное обеспечение\\n1. Открывать архивы напрямую\\n1. Пользоваться оффлайн\\n### Установите эту страницу в качестве [PWA](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%BE%D0%B3%D1%80%D0%B5%D1%81%D1%81%D0%B8%D0%B2%D0%BD%D0%BE%D0%B5_%D0%B2%D0%B5%D0%B1-%D0%BF%D1%80%D0%B8%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5) на свой компьютер 🐺☝️",
    message: {
      enter_password: "Пожалуйста введите пароль",
      unzipping: "Распаковка"
    },
    tip_enter_url: "Введите URL архива",
    tip_md: "# ComicRead PWA\\nИспользуйте [ComicRead](https://github.com/hymbz/ComicReadScript) для чтения комиксов **локально**.\\n---\\n### Перетащите изображения, папки или архивы чтобы начать читать\\n*Вы так же можете **открыть** или **вставить** URL архива на напрямую*"
  },
  setting: {
    hotkeys: {
      add: "Добавить горячие клавиши",
      restore: "Восстановить горячие клавиши по умолчанию"
    },
    language: "Язык",
    option: {
      always_load_all_img: "Всегда загружать все изображения",
      background_color: "Цвет фона",
      click_page_turn_area: "Область нажатия",
      click_page_turn_enabled: "Перелистывать по клику",
      click_page_turn_swap_area: "Поменять местами правую и левую области переключения страниц",
      click_page_turn_vertical: "Вертикальная область переключения страниц",
      dark_mode: "Ночная тема",
      dir_ltr: "Чтение слева направо (Американские комиксы)",
      dir_rtl: "Чтение справа налево (Японская манга)",
      disable_auto_enlarge: "Отключить автоматическое масштабирование изображений",
      first_page_fill: "Включить заполнение первой страницы по умолчанию",
      jump_to_next_chapter: "Перелистнуть главу",
      paragraph_dir: "Направление чтения",
      paragraph_display: "Отображение",
      paragraph_hotkeys: "Горячие клавиши",
      paragraph_operation: "Управление",
      paragraph_other: "Другое",
      paragraph_scrollbar: "Полоса прокрутки",
      paragraph_translation: "Перевод",
      preload_page_num: "Предзагружать страниц",
      scroll_mode_img_scale: "Коэффициент масштабирования изображения в режиме скроллинга",
      scroll_mode_img_spacing: "Расстояние между страницами в режиме скроллинга",
      scrollbar_auto_hidden: "Автоматически скрывать",
      scrollbar_easy_scroll: "Лёгкая прокрутка",
      scrollbar_position: "Позиция",
      scrollbar_position_auto: "Авто",
      scrollbar_position_bottom: "Снизу",
      scrollbar_position_hidden: "Спрятано",
      scrollbar_position_right: "Справа",
      scrollbar_position_top: "Сверху",
      scrollbar_show_img_status: "Показывать статус загрузки изображения",
      show_clickable_area: "Показывать кликабельные области",
      show_comments: "Показывать комментарии на последней странице",
      swap_page_turn_key: "Поменять местами клавиши переключения страниц"
    },
    translation: {
      cotrans_tip: "<p>Использует для перевода <a href=\\"https://cotrans.touhou.ai\\" target=\\"_blank\\">Cotrans API</a>, работающий исключительно за счёт своего создателя.</p>\\n<p>Запросы обрабатываются по одному в порядке синхронной очереди. Когда очередь превышает лимит новые запросы будут приводить к ошибке. Если такое случилось попробуйте позже.</p>\\n<p>Так что пожалуйста <b>учитывайте загруженность при выборе</b></p>\\n<p>Настоятельно рекомендовано использовать проект развёрнутый локально т.к. это не потребляет серверные ресурсы и вы не ограничены очередью.</p>",
      options: {
        detection_resolution: "Разрешение распознавания текста",
        direction: "Ориетнация текста",
        direction_auto: "Следование оригиналу",
        direction_horizontal: "Только горизонтально",
        direction_vertical: "Только вертикально",
        forceRetry: "Принудительный повтор(Игнорировать кэш)",
        localUrl: "Настроить URL сервера",
        onlyDownloadTranslated: "Скачать только переведённые изображения",
        target_language: "Целевой язык",
        text_detector: "Детектор текста",
        translator: "Переводчик"
      },
      server: "Сервер",
      server_selfhosted: "Свой",
      translate_after_current: "Переводить страницу до конца",
      translate_all_img: "Перевести все изображения"
    }
  },
  site: {
    add_feature: {
      associate_nhentai: "Ассоциация с nhentai",
      auto_page_turn: "Автопереворот страниц",
      block_totally: "Глобально заблокировать комиксы",
      detect_ad: "Detect advertise page",
      hotkeys_page_turn: "Переворот страниц горячими клавишами",
      open_link_new_page: "Открывать ссылки в новой вкладке",
      remember_current_site: "Запомнить текущий сайт"
    },
    changed_load_failed: "Страница изменилась, невозможно загрузить комикс",
    ehentai: {
      fetch_img_page_source_failed: "Не удалось получить исходный код страницы с изображениями",
      fetch_img_page_url_failed: "Не удалось получить адрес страницы изображений из деталей",
      fetch_img_url_failed: "Не удалось получить адрес изображения",
      html_changed_nhentai_failed: "Структура страницы изменилась, функция nhentai manga работает некорректно",
      ip_banned: "IP адрес забанен",
      nhentai_error: "Ошибка сопоставления с nhentai",
      nhentai_failed: "Ошибка сопостовления. Пожалуйста перезагрузите страницу после входа на {{nhentai}}"
    },
    need_captcha: "CAPTCHA",
    nhentai: {
      fetch_next_page_failed: "Не удалось получить следующую страницу",
      tag_blacklist_fetch_failed: "Не удалось получить заблокированные теги"
    },
    settings_tip: "Настройки",
    show_settings_menu: "Показать меню настроек",
    simple: {
      auto_read_mode_message: "\\"Автоматически включать режим чтения\\" по умолчанию",
      no_img: "Не найдено подходящих изображений. Можно нажать тут что бы выключить режим простого чтения.",
      simple_read_mode: "Включить простой режим чтения"
    }
  },
  touch_area: {
    menu: "Меню",
    next: "Следующая страница",
    prev: "Предыдущая страница",
    type: {
      edge: "Грань",
      l: "L",
      left_right: "Лево Право",
      up_down: "Верх Низ"
    }
  },
  translation: {
    status: {
      "default": "Неизвестный статус",
      detection: "Распознавание текста",
      downscaling: "Уменьшение масштаба",
      error: "Ошибка перевода",
      "error-lang": "Целевой язык не поддерживается выбранным переводчиком",
      "error-translating": "Ошибка перевода(пустой ответ)",
      "error-with-id": "Ошибка во время перевода",
      finished: "Завершение",
      inpainting: "Наложение",
      "mask-generation": "Генерация маски",
      ocr: "Распознавание текста",
      pending: "Ожидание",
      "pending-pos": "Ожидание",
      rendering: "Отрисовка",
      saved: "Сохранено",
      textline_merge: "Обьединение текста",
      translating: "Переводится",
      upscaling: "Увеличение изображения"
    },
    tip: {
      check_img_status_failed: "Не удалось проверить статус изображения",
      download_img_failed: "Не удалось скачать изображение",
      error: "Ошибка перевода",
      get_translator_list_error: "Произошла ошибка во время получения списка доступных переводчиков",
      id_not_returned: "ID не вернули(",
      img_downloading: "Скачивание изображений",
      img_not_fully_loaded: "Изображение всё ещё загружается",
      pending: "Ожидение, позиция в очереди {{pos}}",
      resize_img_failed: "Не удалось изменить размер изображения",
      translation_completed: "Перевод завершён",
      upload_error: "Ошибка загрузки изображения",
      upload_return_error: "Ошибка перевода на сервере",
      wait_translation: "Ожидание перевода"
    },
    translator: {
      baidu: "baidu",
      deepl: "DeepL",
      google: "Google",
      "gpt3.5": "GPT-3.5",
      none: "Убрать текст",
      offline: "Оффлайн переводчик",
      original: "Оригинал",
      youdao: "youdao"
    }
  }
};

const [lang, setLang] = solidJs.createSignal('zh');
const setInitLang = async () => setLang(await getInitLang());
const t = solidJs.createRoot(() => {
  solidJs.createEffect(solidJs.on(lang, () => setSaveLang(lang()), {
    defer: true
  }));
  const locales = solidJs.createMemo(() => {
    switch (lang()) {
      case 'en':
        return en;
      case 'ru':
        return ru;
      default:
        return zh;
    }
  });

  // eslint-disable-next-line solid/reactivity
  return (keys, variables) => {
    let text = byPath(locales(), keys) ?? '';
    if (variables) Object.entries(variables).forEach(([k, v]) => {
      text = text.replaceAll(\`{{\${k}}}\`, \`\${v}\`);
    });
    return text;
  };
});

const getDom = id => {
  let dom = document.getElementById(id);
  if (dom) {
    dom.innerHTML = '';
    return dom;
  }
  dom = document.createElement('div');
  dom.id = id;
  document.body.appendChild(dom);
  return dom;
};

/** 挂载 solid-js 组件 */
const mountComponents = (id, fc) => {
  const dom = getDom(id);
  dom.style.setProperty('display', 'unset', 'important');
  const shadowDom = dom.attachShadow({
    mode: 'closed'
  });
  web.render(fc, shadowDom);
  return dom;
};

var css$3 = ".index_module_root__7041fa4c{align-items:flex-end;bottom:0;display:flex;flex-direction:column;font-size:16px;pointer-events:none;position:fixed;right:0;z-index:2147483647}.index_module_item__7041fa4c{align-items:center;animation:index_module_bounceInRight__7041fa4c .5s 1;background:#fff;border-radius:4px;box-shadow:0 1px 10px 0 #0000001a,0 2px 15px 0 #0000000d;color:#000;cursor:pointer;display:flex;margin:1em;max-width:min(30em,100vw);overflow:hidden;padding:.8em 1em;pointer-events:auto;position:relative;width:-moz-fit-content;width:fit-content}.index_module_item__7041fa4c>svg{color:var(--theme);margin-right:.5em;width:1.5em}.index_module_item__7041fa4c[data-exit]{animation:index_module_bounceOutRight__7041fa4c .5s 1}.index_module_schedule__7041fa4c{background-color:var(--theme);bottom:0;height:.2em;left:0;position:absolute;transform-origin:left;width:100%}.index_module_item__7041fa4c[data-schedule] .index_module_schedule__7041fa4c{transition:transform .1s}.index_module_item__7041fa4c:not([data-schedule]) .index_module_schedule__7041fa4c{animation:index_module_schedule__7041fa4c linear 1 forwards}:is(.index_module_item__7041fa4c:hover,.index_module_item__7041fa4c[data-schedule],.index_module_root__7041fa4c[data-paused]) .index_module_schedule__7041fa4c{animation-play-state:paused}.index_module_msg__7041fa4c{line-height:1.4em;text-align:start;white-space:break-spaces;width:-moz-fit-content;width:fit-content}.index_module_msg__7041fa4c h2{margin:0}.index_module_msg__7041fa4c h3{margin:.7em 0}.index_module_msg__7041fa4c ul{margin:0;text-align:left}.index_module_msg__7041fa4c button{background-color:#eee;border:none;border-radius:.4em;cursor:pointer;font-size:inherit;margin:0 .5em;outline:none;padding:.2em .6em}.index_module_msg__7041fa4c button:hover{background:#e0e0e0}p{margin:0}@keyframes index_module_schedule__7041fa4c{0%{transform:scaleX(1)}to{transform:scaleX(0)}}@keyframes index_module_bounceInRight__7041fa4c{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0) scaleX(3)}60%{opacity:1;transform:translate3d(-25px,0,0) scaleX(1)}75%{transform:translate3d(10px,0,0) scaleX(.98)}90%{transform:translate3d(-5px,0,0) scaleX(.995)}to{transform:translateZ(0)}}@keyframes index_module_bounceOutRight__7041fa4c{20%{opacity:1;transform:translate3d(-20px,0,0) scaleX(.9)}to{opacity:0;transform:translate3d(2000px,0,0) scaleX(2)}}";
var modules_c21c94f2$3 = {"root":"index_module_root__7041fa4c","item":"index_module_item__7041fa4c","bounceInRight":"index_module_bounceInRight__7041fa4c","bounceOutRight":"index_module_bounceOutRight__7041fa4c","schedule":"index_module_schedule__7041fa4c","msg":"index_module_msg__7041fa4c"};

const [_state$1, _setState$1] = store$2.createStore({
  list: [],
  map: {}
});
const setState$1 = fn => _setState$1(store$2.produce(fn));

// eslint-disable-next-line solid/reactivity
const store$1 = _state$1;
const creatId = () => {
  let id = \`\${Date.now()}\`;
  while (Reflect.has(store$1.map, id)) {
    id += '_';
  }
  return id;
};

var _tmpl$$S = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M9.29 16.29 5.7 12.7a.996.996 0 1 1 1.41-1.41L10 14.17l6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.59 7.59a.996.996 0 0 1-1.41 0">\`);
const MdCheckCircle = ((props = {}) => (() => {
  var _el$ = _tmpl$$S();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$R = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3M12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1m1 4h-2v-2h2z">\`);
const MdWarning = ((props = {}) => (() => {
  var _el$ = _tmpl$$R();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$Q = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1 4h-2v-2h2z">\`);
const MdError = ((props = {}) => (() => {
  var _el$ = _tmpl$$Q();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$P = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1-8h-2V7h2z">\`);
const MdInfo = ((props = {}) => (() => {
  var _el$ = _tmpl$$P();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const toast$2 = (msg, options) => {
  if (!msg) return;
  const id = options?.id ?? (typeof msg === 'string' ? msg : creatId());
  setState$1(state => {
    if (Reflect.has(state.map, id)) {
      Object.assign(state.map[id], {
        msg,
        ...options,
        update: true
      });
      return;
    }
    state.map[id] = {
      id,
      type: 'info',
      duration: 3000,
      msg,
      ...options
    };
    state.list.push(id);
  });

  /** 弹窗后记录一下 */
  let fn = log;
  switch (options?.type) {
    case 'warn':
      fn = log.warn;
      break;
    case 'error':
      fn = log.error;
      break;
  }
  fn.call(null, 'Toast:', msg);
  if (options?.throw && typeof msg === 'string') throw new Error(msg);
};
toast$2.dismiss = id => {
  if (!Reflect.has(store$1.map, id)) return;
  _setState$1('map', id, 'exit', true);
};
toast$2.set = (id, options) => {
  if (!Reflect.has(store$1.map, id)) return;
  setState$1(state => Object.assign(state.map[id], options));
};
toast$2.success = (msg, options) => toast$2(msg, {
  ...options,
  exit: undefined,
  type: 'success'
});
toast$2.warn = (msg, options) => toast$2(msg, {
  ...options,
  exit: undefined,
  type: 'warn'
});
toast$2.error = (msg, options) => toast$2(msg, {
  ...options,
  exit: undefined,
  type: 'error'
});

var _tmpl$$O = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$d = /*#__PURE__*/web.template(\`<div><div>\`);
const iconMap = {
  info: MdInfo,
  success: MdCheckCircle,
  warn: MdWarning,
  error: MdError
};
const colorMap = {
  info: '#3a97d7',
  success: '#23bb35',
  warn: '#f0c53e',
  error: '#e45042',
  custom: '#1f2936'
};

/** 删除 toast */
const dismissToast = id => setState$1(state => {
  state.map[id].onDismiss?.({
    ...state.map[id]
  });
  const i = state.list.findIndex(t => t === id);
  if (i !== -1) state.list.splice(i, 1);
  Reflect.deleteProperty(state.map, id);
});

/** 重置 toast 的 update 属性 */
const resetToastUpdate = id => _setState$1('map', id, 'update', undefined);
const ToastItem = props => {
  /** 是否要显示进度 */
  const showSchedule = solidJs.createMemo(() => props.duration === Infinity && props.schedule ? true : undefined);
  const dismiss = e => {
    e.stopPropagation();
    if (showSchedule() && 'animationName' in e) return;
    toast$2.dismiss(props.id);
  };

  // 在退出动画结束后才真的删除
  const handleAnimationEnd = () => {
    if (!props.exit) return;
    dismissToast(props.id);
  };
  let scheduleRef;
  solidJs.createEffect(() => {
    if (!props.update) return;
    resetToastUpdate(props.id);
    scheduleRef?.getAnimations().forEach(animation => {
      animation.cancel();
      animation.play();
    });
  });
  const handleClick = e => {
    props.onClick?.();
    dismiss(e);
  };
  return (() => {
    var _el$ = _tmpl$2$d(),
      _el$2 = _el$.firstChild;
    _el$.addEventListener("animationend", handleAnimationEnd);
    _el$.addEventListener("click", handleClick);
    web.insert(_el$, web.createComponent(web.Dynamic, {
      get component() {
        return iconMap[props.type];
      }
    }), _el$2);
    web.insert(_el$2, (() => {
      var _c$ = web.memo(() => typeof props.msg === 'string');
      return () => _c$() ? props.msg : web.createComponent(props.msg, {});
    })());
    web.insert(_el$, web.createComponent(solidJs.Show, {
      get when() {
        return props.duration !== Infinity || props.schedule !== undefined;
      },
      get children() {
        var _el$3 = _tmpl$$O();
        _el$3.addEventListener("animationend", dismiss);
        var _ref$ = scheduleRef;
        typeof _ref$ === "function" ? web.use(_ref$, _el$3) : scheduleRef = _el$3;
        web.effect(_p$ => {
          var _v$ = modules_c21c94f2$3.schedule,
            _v$2 = \`\${props.duration}ms\`,
            _v$3 = showSchedule() ? \`scaleX(\${props.schedule})\` : undefined;
          _v$ !== _p$.e && web.className(_el$3, _p$.e = _v$);
          _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$3.style.setProperty("animation-duration", _v$2) : _el$3.style.removeProperty("animation-duration"));
          _v$3 !== _p$.a && ((_p$.a = _v$3) != null ? _el$3.style.setProperty("transform", _v$3) : _el$3.style.removeProperty("transform"));
          return _p$;
        }, {
          e: undefined,
          t: undefined,
          a: undefined
        });
        return _el$3;
      }
    }), null);
    web.effect(_p$ => {
      var _v$4 = modules_c21c94f2$3.item,
        _v$5 = colorMap[props.type],
        _v$6 = showSchedule(),
        _v$7 = props.exit,
        _v$8 = modules_c21c94f2$3.msg;
      _v$4 !== _p$.e && web.className(_el$, _p$.e = _v$4);
      _v$5 !== _p$.t && ((_p$.t = _v$5) != null ? _el$.style.setProperty("--theme", _v$5) : _el$.style.removeProperty("--theme"));
      _v$6 !== _p$.a && web.setAttribute(_el$, "data-schedule", _p$.a = _v$6);
      _v$7 !== _p$.o && web.setAttribute(_el$, "data-exit", _p$.o = _v$7);
      _v$8 !== _p$.i && web.className(_el$2, _p$.i = _v$8);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined
    });
    return _el$;
  })();
};

var _tmpl$$N = /*#__PURE__*/web.template(\`<div>\`);
const [ref, setRef] = solidJs.createSignal();
const Toaster = () => {
  const [visible, setVisible] = solidJs.createSignal(document.visibilityState === 'visible');
  solidJs.onMount(() => {
    const handleVisibilityChange = () => {
      setVisible(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    solidJs.onCleanup(() => document.removeEventListener('visibilitychange', handleVisibilityChange));
  });
  return (() => {
    var _el$ = _tmpl$$N();
    web.use(setRef, _el$);
    web.insert(_el$, web.createComponent(solidJs.For, {
      get each() {
        return store$1.list;
      },
      children: id => web.createComponent(ToastItem, web.mergeProps(() => store$1.map[id]))
    }));
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$3.root,
        _v$2 = visible() ? undefined : '';
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && web.setAttribute(_el$, "data-paused", _p$.t = _v$2);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })();
};

const ToastStyle = css$3;

var _tmpl$$M = /*#__PURE__*/web.template(\`<style type=text/css>\`);
let dom$2;
const init = () => {
  if (dom$2 || ref()) return;

  // 提前挂载漫画节点，防止 toast 没法显示在漫画上层
  if (!document.getElementById('comicRead')) {
    const _dom = document.createElement('div');
    _dom.id = 'comicRead';
    document.body.appendChild(_dom);
  }
  dom$2 = mountComponents('toast', () => [web.createComponent(Toaster, {}), (() => {
    var _el$ = _tmpl$$M();
    web.insert(_el$, ToastStyle);
    return _el$;
  })()]);
  dom$2.style.setProperty('z-index', '2147483647', 'important');
};
const toast$1 = new Proxy(toast$2, {
  get(target, propKey) {
    init();
    return target[propKey];
  },
  apply(target, propKey, args) {
    init();
    const fn = propKey in target ? target[propKey] : target;
    return fn(...args);
  }
});

// 将 xmlHttpRequest 包装为 Promise
const xmlHttpRequest = details => new Promise((resolve, reject) => {
  GM_xmlhttpRequest({
    ...details,
    onload: resolve,
    onerror: reject,
    ontimeout: reject
  });
});
/** 发起请求 */
const request$1 = async (url, details, errorNum = 0) => {
  const errorText = \`\${details?.errorText ?? t('alert.comic_load_error')} - \${url}\`;
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: {
        Referer: window.location.href
      },
      fetch: url.startsWith('/') || url.startsWith(window.location.origin),
      timeout: 1000 * 10,
      ...details
    });
    if (!details?.noCheckCode && res.status !== 200) {
      log.error(errorText, res);
      throw new Error(errorText);
    }
    return res;
  } catch (error) {
    if (errorNum >= 0) {
      if (!details?.noTip) toast$1.error(errorText);
      throw new Error(errorText);
    }
    log.error(errorText, error);
    await sleep(1000);
    return request$1(url, details, errorNum + 1);
  }
};

/** 轮流向多个 api 发起请求 */
const eachApi = async (url, baseUrlList, details) => {
  for (let i = 0; i < baseUrlList.length; i++) {
    const baseUrl = baseUrlList[i];
    try {
      return await request$1(\`\${baseUrl}\${url}\`, {
        ...details,
        noTip: true
      });
    } catch (_) {}
  }
  const errorText = details?.errorText ?? t('alert.comic_load_error');
  if (!details?.noTip) toast$1.error(errorText);
  log.error('所有 api 请求均失败', url, baseUrlList, details);
  throw new Error(errorText);
};

var _tmpl$$L = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="m20.45 6 .49-1.06L22 4.45a.5.5 0 0 0 0-.91l-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05c.17.39.73.39.9 0M8.95 6l.49-1.06 1.06-.49a.5.5 0 0 0 0-.91l-1.06-.48L8.95 2a.492.492 0 0 0-.9 0l-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49L8.05 6c.17.39.73.39.9 0m10.6 7.5-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49.49 1.06a.5.5 0 0 0 .91 0l.49-1.06 1.05-.5a.5.5 0 0 0 0-.91l-1.06-.49-.49-1.06c-.17-.38-.73-.38-.9.01m-1.84-4.38-2.83-2.83a.996.996 0 0 0-1.41 0L2.29 17.46a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0L17.7 10.53c.4-.38.4-1.02.01-1.41m-3.5 2.09L12.8 9.8l1.38-1.38 1.41 1.41z">\`);
const MdAutoFixHigh = ((props = {}) => (() => {
  var _el$ = _tmpl$$L();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$K = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="m22 3.55-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05a.5.5 0 0 0 .91 0l.49-1.06L22 4.45c.39-.17.39-.73 0-.9m-7.83 4.87 1.41 1.41-1.46 1.46 1.41 1.41 2.17-2.17a.996.996 0 0 0 0-1.41l-2.83-2.83a.996.996 0 0 0-1.41 0l-2.17 2.17 1.41 1.41zM2.1 4.93l6.36 6.36-6.17 6.17a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l6.17-6.17 6.36 6.36a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42">\`);
const MdAutoFixOff = ((props = {}) => (() => {
  var _el$ = _tmpl$$K();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$J = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M7 3v9c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l5.19-8.9a.995.995 0 0 0-.86-1.5H13l2.49-6.65A.994.994 0 0 0 14.56 2H8c-.55 0-1 .45-1 1">\`);
const MdAutoFlashOn = ((props = {}) => (() => {
  var _el$ = _tmpl$$J();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$I = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M16.12 11.5a.995.995 0 0 0-.86-1.5h-1.87l2.28 2.28zm.16-8.05c.33-.67-.15-1.45-.9-1.45H8c-.55 0-1 .45-1 1v.61l6.13 6.13zm2.16 14.43L4.12 3.56a.996.996 0 1 0-1.41 1.41L7 9.27V12c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l2.65-4.55 3.44 3.44c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41">\`);
const MdAutoFlashOff = ((props = {}) => (() => {
  var _el$ = _tmpl$$I();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var css$2 = ".index_module_iconButtonItem__58f56840{align-items:center;display:flex;position:relative}.index_module_iconButton__58f56840{align-items:center;background-color:transparent;border-radius:9999px;border-style:none;color:var(--text,#fff);cursor:pointer;display:flex;font-size:1.5em;height:1.5em;justify-content:center;margin:.1em;outline:none;padding:0;width:1.5em}.index_module_iconButton__58f56840:focus,.index_module_iconButton__58f56840:hover{background-color:var(--hover-bg-color,#fff3)}.index_module_iconButton__58f56840.index_module_enabled__58f56840{background-color:var(--text,#fff);color:var(--text-bg,#121212)}.index_module_iconButton__58f56840.index_module_enabled__58f56840:focus,.index_module_iconButton__58f56840.index_module_enabled__58f56840:hover{background-color:var(--hover-bg-color-enable,#fffa)}.index_module_iconButton__58f56840>svg{width:1em}.index_module_iconButtonPopper__58f56840{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;opacity:0;padding:.4em .5em;pointer-events:none;position:absolute;top:50%;transform:translateY(-50%);-webkit-user-select:none;user-select:none;white-space:nowrap}.index_module_iconButtonPopper__58f56840[data-placement=right]{left:calc(100% + 1.5em)}.index_module_iconButtonPopper__58f56840[data-placement=right]:before{border-right-color:var(--switch-bg,#6e6e6e);border-right-width:.5em;right:calc(100% + .5em)}.index_module_iconButtonPopper__58f56840[data-placement=left]{right:calc(100% + 1.5em)}.index_module_iconButtonPopper__58f56840[data-placement=left]:before{border-left-color:var(--switch-bg,#6e6e6e);border-left-width:.5em;left:calc(100% + .5em)}.index_module_iconButtonPopper__58f56840:before{background-color:transparent;border:.4em solid transparent;content:\\"\\";pointer-events:none;position:absolute;transition:opacity .15s}.index_module_iconButtonItem__58f56840:focus .index_module_iconButtonPopper__58f56840,.index_module_iconButtonItem__58f56840:hover .index_module_iconButtonPopper__58f56840,.index_module_iconButtonItem__58f56840[data-show=true] .index_module_iconButtonPopper__58f56840{opacity:1}.index_module_hidden__58f56840{display:none}";
var modules_c21c94f2$2 = {"iconButtonItem":"index_module_iconButtonItem__58f56840","iconButton":"index_module_iconButton__58f56840","enabled":"index_module_enabled__58f56840","iconButtonPopper":"index_module_iconButtonPopper__58f56840","hidden":"index_module_hidden__58f56840"};

var _tmpl$$H = /*#__PURE__*/web.template(\`<div><button type=button tabindex=0>\`),
  _tmpl$2$c = /*#__PURE__*/web.template(\`<div>\`);
const IconButtonStyle = css$2;
/** 图标按钮 */
const IconButton = _props => {
  const props = solidJs.mergeProps({
    placement: 'right'
  }, _props);
  let buttonRef;
  const handleClick = e => {
    props.onClick?.(e);
    // 在每次点击后取消焦点
    buttonRef?.blur();
  };
  return (() => {
    var _el$ = _tmpl$$H(),
      _el$2 = _el$.firstChild;
    var _ref$ = buttonRef;
    typeof _ref$ === "function" ? web.use(_ref$, _el$2) : buttonRef = _el$2;
    _el$2.addEventListener("click", handleClick);
    web.insert(_el$2, () => props.children);
    web.insert(_el$, (() => {
      var _c$ = web.memo(() => !!(props.popper || props.tip));
      return () => _c$() ? (() => {
        var _el$3 = _tmpl$2$c();
        web.insert(_el$3, () => props.popper || props.tip);
        web.effect(_p$ => {
          var _v$6 = [modules_c21c94f2$2.iconButtonPopper, props.popperClassName].join(' '),
            _v$7 = props.placement;
          _v$6 !== _p$.e && web.className(_el$3, _p$.e = _v$6);
          _v$7 !== _p$.t && web.setAttribute(_el$3, "data-placement", _p$.t = _v$7);
          return _p$;
        }, {
          e: undefined,
          t: undefined
        });
        return _el$3;
      })() : null;
    })(), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$2.iconButtonItem,
        _v$2 = props.showTip,
        _v$3 = props.tip,
        _v$4 = modules_c21c94f2$2.iconButton,
        _v$5 = {
          [modules_c21c94f2$2.hidden]: props.hidden,
          [modules_c21c94f2$2.enabled]: props.enabled
        };
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && web.setAttribute(_el$, "data-show", _p$.t = _v$2);
      _v$3 !== _p$.a && web.setAttribute(_el$2, "aria-label", _p$.a = _v$3);
      _v$4 !== _p$.o && web.className(_el$2, _p$.o = _v$4);
      _p$.i = web.classList(_el$2, _v$5, _p$.i);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined
    });
    return _el$;
  })();
};

const useSpeedDial = (options, setOptions) => {
  const DefaultButton = props => web.createComponent(IconButton, {
    get tip() {
      return props.showName ?? (t(\`site.add_feature.\${props.optionName}\`) || props.optionName);
    },
    placement: "left",
    onClick: () => setOptions({
      ...options,
      [props.optionName]: !options[props.optionName]
    }),
    get children() {
      return props.children ?? (options[props.optionName] ? web.createComponent(MdAutoFixHigh, {}) : web.createComponent(MdAutoFixOff, {}));
    }
  });
  const list = Object.keys(options).map(optionName => {
    switch (optionName) {
      case 'hiddenFAB':
      case 'option':
      case 'hotkeys':
        return null;
      case 'autoShow':
        return () => web.createComponent(DefaultButton, {
          optionName: "autoShow",
          get showName() {
            return t('other.auto_enter_read_mode');
          },
          get children() {
            return web.memo(() => !!options.autoShow)() ? web.createComponent(MdAutoFlashOn, {}) : web.createComponent(MdAutoFlashOff, {});
          }
        });
      default:
        if (typeof options[optionName] !== 'boolean') return null;
        return () => web.createComponent(DefaultButton, {
          optionName: optionName
        });
    }
  }).filter(Boolean);
  return list;
};

/* eslint-disable no-param-reassign */

const promisifyRequest = request => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-multi-assign
  request.oncomplete = request.onsuccess = () => resolve(request.result);
  // eslint-disable-next-line no-multi-assign
  request.onabort = request.onerror = () => reject(request.error);
});
const useCache = (initSchema, version = 1) => {
  const request = indexedDB.open('ComicReadScript', version);
  request.onupgradeneeded = () => {
    initSchema(request.result);
  };
  const dbp = promisifyRequest(request);
  const useStore = (storeName, txMode, callback) => dbp.then(db => callback(db.transaction(storeName, txMode).objectStore(storeName)));
  return {
    /** 存入数据 */
    set: (storeName, value) => useStore(storeName, 'readwrite', async store => {
      store.put(value);
      await promisifyRequest(store.transaction);
    }),
    /** 根据主键直接获取数据 */
    get: (storeName, query) => useStore(storeName, 'readonly', store => promisifyRequest(store.get(query))),
    /** 查找符合条件的数据 */
    find: (storeName, query, index) => useStore(storeName, 'readonly', store => promisifyRequest((index ? store.index(index) : store).getAll(query))),
    /** 删除符合条件的数据 */
    del: (storeName, query, index) => useStore(storeName, 'readwrite', async store => {
      if (index) {
        store.index(index).openCursor(query).onsuccess = async function onsuccess() {
          if (!this.result) return;
          await promisifyRequest(this.result.delete());
          this.result.continue();
        };
        await promisifyRequest(store.transaction);
      } else {
        store.delete(query);
        await promisifyRequest(store.transaction);
      }
    })

    // each: <K extends keyof Schema & string>(
    //   storeName: K,
    //   query: IDBValidKey | IDBKeyRange | null,
    //   callback: (cursor: IDBCursorWithValue) => void,
    // ) =>
    //   useStore(storeName, 'readonly', (store) => {
    //     store.openCursor(query).onsuccess = function onsuccess() {
    //       if (!this.result) return;
    //       callback(this.result);
    //       this.result.continue();
    //     };
    //     return promisifyRequest(store.transaction);
    //   }),
  };
};

var _tmpl$$G = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.3 7.3 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68m-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5">\`);
const MdSettings = ((props = {}) => (() => {
  var _el$ = _tmpl$$G();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$F = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4">\`);
const MdClose = ((props = {}) => (() => {
  var _el$ = _tmpl$$F();
  web.spread(_el$, props, true, true);
  return _el$;
})());

/** 会自动设置 equals 的 createSignal */
const createEqualsSignal = (init, options) =>
// eslint-disable-next-line solid/reactivity
solidJs.createSignal(init, {
  equals: isEqual,
  ...options
});

/** 会自动设置 equals 和 createRoot 的 createMemo */
const createRootMemo = (fn, init, options) => {
  const _init = init ?? fn(undefined);
  // 自动为对象类型设置 equals
  const _options = options?.equals === undefined && typeof init === 'object' ? {
    ...options,
    equals: isEqual
  } : options;
  return solidJs.getOwner() ?
  // eslint-disable-next-line solid/reactivity
  solidJs.createMemo(fn, _init, _options) :
  // eslint-disable-next-line solid/reactivity
  solidJs.createRoot(() => solidJs.createMemo(fn, _init, _options));
};

/** 节流的 createMemo */
const createThrottleMemo = (fn, wait = 100, init = fn(undefined), options = undefined) => {
  const scheduled = createScheduled(_fn => throttle(_fn, wait));
  return createRootMemo(prev => scheduled() ? fn(prev) : prev, init, options);
};
const createMemoMap = fnMap => {
  const memoMap = Object.fromEntries(Object.entries(fnMap).map(([key, fn]) => {
    // 如果函数已经是 createMemo 创建的，就直接使用
    if (fn.name === 'bound readSignal') return [key, fn];
    return [key, createRootMemo(fn, undefined)];
  }));
  const map = createRootMemo(() => {
    const obj = {};
    Object.keys(memoMap).forEach(key => Reflect.set(obj, key, memoMap[key]()));
    return obj;
  });
  return map;
};
const createEffectOn = (deps, fn, options) => solidJs.getOwner() ? solidJs.createEffect(solidJs.on(deps, fn, options)) : solidJs.createRoot(() => solidJs.createEffect(solidJs.on(deps, fn, options)));

var _tmpl$$E = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71M5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1">\`);
const MdFileDownload = ((props = {}) => (() => {
  var _el$ = _tmpl$$E();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const useStore = initState => {
  const [_state, _setState] = store$2.createStore(initState);
  return {
    _state,
    _setState,
    setState: fn => _setState(store$2.produce(fn)),
    store: _state
  };
};

const imgState = {
  imgList: [],
  pageList: [],
  fillEffect: {
    '-1': true
  },
  /** 比例 */
  proportion: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0
  }
};

const LanguageMap = {
  zh: 'CHS',
  en: 'ENG'
};
const targetLanguage = LanguageMap[lang()] ?? 'CHS';
const _defaultOption = {
  dir: 'rtl',
  scrollbar: {
    position: 'auto',
    autoHidden: false,
    showImgStatus: true,
    easyScroll: false
  },
  onePageMode: false,
  clickPageTurn: {
    enabled: 'ontouchstart' in document.documentElement,
    reverse: false,
    area: 'left_right'
  },
  firstPageFill: true,
  disableZoom: false,
  darkMode: false,
  swapPageTurnKey: false,
  jumpToNext: true,
  alwaysLoadAllImg: false,
  showComment: true,
  preloadPageNum: 20,
  scrollMode: false,
  scrollModeSpacing: 0,
  scrollModeImgScale: 1,
  scrollModeFitToWidth: false,
  translation: {
    server: 'disable',
    localUrl: undefined,
    forceRetry: false,
    options: {
      size: 'M',
      detector: 'default',
      translator: 'gpt3.5',
      direction: 'auto',
      targetLanguage
    },
    onlyDownloadTranslated: false
  }
};
const defaultOption = () => JSON.parse(JSON.stringify(_defaultOption));
const OptionState = {
  defaultOption: defaultOption(),
  option: defaultOption()
};

const OtherState = {
  /** 监视图片是否出现的 observer */
  observer: null,
  flag: {
    /** 是否需要自动开启卷轴模式 */
    autoScrollMode: false,
    /** 是否需要自动将未加载图片类型设为跨页图 */
    autoWide: false,
    /** 是否需要将滚动条移至底部 */
    autoLong: false,
    /**
     * 用于防止滚轮连续滚动导致过快触发事件的锁
     *
     * - 在缩放时开启，结束缩放一段时间后关闭。开启时禁止翻页。
     * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
     */
    scrollLock: false
  }
};

const PropState = {
  /** 评论列表 */
  commentList: undefined,
  /** 快捷键配置 */
  hotkeys: {},
  prop: {
    /** 点击结束页按钮时触发的回调 */
    Exit: undefined,
    /** 点击上一话按钮时触发的回调 */
    Prev: undefined,
    /** 点击下一话按钮时触发的回调 */
    Next: undefined,
    /** 图片加载状态发生变化时触发的回调 */
    Loading: undefined,
    /** 配置发生变化时触发的回调 */
    OptionChange: undefined,
    /** 快捷键配置发生变化时触发的回调 */
    HotkeysChange: undefined,
    editButtonList: list => list,
    editSettingList: list => list
  }
};

const ShowState = {
  /** 当前设备是否是移动端 */
  isMobile: false,
  /** 是否处于拖拽模式 */
  isDragMode: false,
  /** 当前页数 */
  activePageIndex: 0,
  /** 网格模式 */
  gridMode: false,
  show: {
    /** 是否强制显示工具栏 */
    toolbar: false,
    /** 是否强制显示滚动条 */
    scrollbar: false,
    /** 是否显示点击区域 */
    touchArea: false,
    /** 结束页状态 */
    endPage: undefined
  },
  page: {
    /** 动画效果 */
    anima: '',
    /** 竖向排列 */
    vertical: false,
    /** 正常显示页面所需的偏移量 */
    offset: {
      x: {
        pct: 0,
        px: 0
      },
      y: {
        pct: 0,
        px: 0
      }
    }
  },
  zoom: {
    /** 缩放大小 */
    scale: 100,
    /** 确保缩放前后基准点不变所需的偏移量 */
    offset: {
      x: 0,
      y: 0
    }
  }
};

const {
  store,
  setState,
  _state,
  _setState
} = useStore({
  ...imgState,
  ...ShowState,
  ...PropState,
  ...OptionState,
  ...OtherState
});
const refs = {
  root: undefined,
  mangaBox: undefined,
  mangaFlow: undefined,
  touchArea: undefined,
  scrollbar: undefined,
  // 结束页上的按钮
  prev: undefined,
  next: undefined,
  exit: undefined
};

/** 触发 onOptionChange */
const triggerOnOptionChange = scheduleIdle(() => store.prop.OptionChange?.(difference(store.option, store.defaultOption)), 1000);

/** 在 option 后手动触发 onOptionChange */
const setOption = fn => {
  setState(state => fn(state.option, state));
  triggerOnOptionChange();
};

/** 创建一个专门用于修改指定配置项的函数 */
const createStateSetFn = name => val => setOption(draftOption => byPath(draftOption, name, () => val));

/** 创建用于将 ref 绑定到对应 state 上的工具函数 */
const bindRef = name => e => Reflect.set(refs, name, e);

/** 将界面恢复到正常状态 */
const resetUI = state => {
  state.show.toolbar = false;
  state.show.scrollbar = false;
  state.show.touchArea = false;
};
const scrollTo = (top, smooth = false) => refs.mangaBox.scrollTo({
  top,
  behavior: smooth ? 'smooth' : 'instant'
});

const defaultHotkeys = {
  turn_page_up: ['w', 'ArrowUp', 'PageUp', 'Shift + W'],
  turn_page_down: [' ', 's', 'ArrowDown', 'PageDown', 'Shift + S'],
  turn_page_right: ['d', '.', 'ArrowRight'],
  turn_page_left: ['a', ',', 'ArrowLeft'],
  jump_to_home: ['Home'],
  jump_to_end: ['End'],
  exit: ['Escape'],
  switch_page_fill: ['/', 'm', 'z'],
  switch_scroll_mode: [],
  switch_grid_mode: [],
  switch_single_double_page_mode: [],
  switch_dir: [],
  switch_auto_enlarge: [],
  translate_current_page: []
};
const setHotkeys = (...args) => {
  _setState(...['hotkeys', ...args]);
  store.prop.HotkeysChange?.(Object.fromEntries(Object.entries(store.hotkeys).filter(([name, keys]) => !defaultHotkeys[name] || !isEqual(keys, defaultHotkeys[name]))));
};

/** 快捷键配置 */
const hotkeysMap = createRootMemo(() => Object.fromEntries(Object.entries(store.hotkeys).flatMap(([name, key]) => key.map(k => [k, name]))));

/** 删除指定快捷键 */
const delHotkeys = code => {
  Object.entries(store.hotkeys).forEach(([name, keys]) => {
    const i = keys.indexOf(code);
    if (i === -1) return;
    const newKeys = [...store.hotkeys[name]];
    newKeys.splice(i, 1);
    setHotkeys(name, newKeys);
  });
};

// 1. 因为不同汉化组处理情况不同不可能全部适配，所以只能是尽量适配*出现频率更多*的情况
/** 记录自动修改过页面填充的图片流 */
const autoCloseFill = new Set();

/** 找到指定页面所处的图片流 */
const findFillIndex = (pageIndex, fillEffect) => {
  let nowFillIndex = pageIndex;
  while (!Reflect.has(fillEffect, nowFillIndex)) nowFillIndex -= 1;
  return nowFillIndex;
};

/** 判断图片是否是跨页图 */
const isWideImg = img => {
  switch (img.type) {
    case 'long':
    case 'wide':
      return true;
    default:
      return false;
  }
};

/** 根据图片比例和填充页设置对漫画图片进行排列 */
const handleComicData = (imgList, fillEffect) => {
  const pageList = [];
  let imgCache = null;
  for (let i = 0; i < imgList.length; i += 1) {
    const img = imgList[i];
    if (fillEffect[i - 1]) {
      if (imgCache !== null) pageList.push([imgCache]);
      imgCache = -1;
    }
    if (!isWideImg(img)) {
      if (imgCache !== null) {
        pageList.push([imgCache, i]);
        imgCache = null;
      } else {
        imgCache = i;
      }
      if (Reflect.has(fillEffect, i)) Reflect.deleteProperty(fillEffect, i);
    } else {
      if (imgCache !== null) {
        const nowFillIndex = findFillIndex(i, fillEffect);

        // 在除结尾外的位置出现了跨页图的话，那张跨页图大概率是页序的「正确答案」
        // 如果这张跨页导致了上面一页缺页，就说明在这之前的填充有误，应该据此调整之前的填充
        // 排除结尾是防止被结尾汉化组图误导
        // 自动调整毕竟有可能误判，所以每个跨页都应该只调整一次，不能重复修改
        if (!autoCloseFill.has(i) && i < imgList.length - 2) {
          autoCloseFill.add(i);
          fillEffect[nowFillIndex] = !fillEffect[nowFillIndex];
          return handleComicData(imgList, fillEffect);
        }
        if (imgCache !== -1) pageList.push([imgCache, -1]);
        imgCache = null;
      }
      if (fillEffect[i] === undefined && img.loadType !== 'loading') fillEffect[i] = false;
      pageList.push([i]);
    }
  }
  if (imgCache !== null && imgCache !== -1) {
    pageList.push([imgCache, -1]);
    imgCache = null;
  }
  return pageList;
};

/** 记录每张图片所在的页面 */
const imgPageMap = createRootMemo(() => {
  const map = {};
  for (let i = 0; i < store.pageList.length; i++) {
    store.pageList[i].forEach(imgIndex => {
      if (imgIndex !== -1) map[imgIndex] = i;
    });
  }
  return map;
});

/** 当前显示的图片 */
const showImgList = new Set();
const [_showPageList, setShowPageList] = createEqualsSignal([]);
/** 当前显示的页面 */
const showPageList = _showPageList;
const updateShowPageList = throttle(() => {
  const newShowPageList = new Set();
  showImgList.forEach(img => newShowPageList.add(imgPageMap()[+img.alt]));
  setShowPageList([...newShowPageList].sort((a, b) => a - b));
});
const initIntersectionObserver = root => {
  const handleObserver = entries => {
    if (!entries.length) return;
    entries.forEach(({
      isIntersecting,
      target
    }) => {
      if (isIntersecting) showImgList.add(target);else showImgList.delete(target);
    });
    updateShowPageList();
  };
  _setState('observer', new IntersectionObserver(handleObserver, {
    root,
    threshold: 0.01
  }));
  solidJs.onCleanup(() => {
    setState(state => {
      state.observer?.disconnect();
      state.observer = null;
    });
  });
};
const [_rootSize, setRootSize] = solidJs.createSignal({
  width: 0,
  height: 0
},
// 宽高为零时不触发变更
{
  equals: (_, {
    width,
    height
  }) => !width || !height
});
/** 容器尺寸 */
const rootSize = _rootSize;
const initResizeObserver = dom => {
  setRootSize({
    width: dom.scrollWidth,
    height: dom.scrollHeight
  });
  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(([{
    contentRect
  }]) => setRootSize({
    width: contentRect.width,
    height: contentRect.height
  }));
  resizeObserver.disconnect();
  resizeObserver.observe(dom);
  solidJs.onCleanup(() => resizeObserver.disconnect());
};
const [_scrollTop, setScrollTop] = solidJs.createSignal(0);
/** 滚动距离 */
const scrollTop = _scrollTop;
const bindScrollTop = dom => {
  dom.addEventListener('scroll', () => setScrollTop(dom.scrollTop), {
    passive: true
  });
};
solidJs.createRoot(() => {
  // 卷轴模式下，将当前显示的第一页作为当前页
  createEffectOn(showPageList, ([firstPage]) => {
    if (!store.gridMode && store.option.scrollMode) _setState('activePageIndex', firstPage ?? 0);
  });

  // 窗口宽度小于800像素时，标记为移动端
  createEffectOn(rootSize, ({
    width
  }) => _setState('isMobile', inRange(1, width, 800)));
});

/** 是否为单页模式 */
const isOnePageMode = createRootMemo(() => store.option.onePageMode || store.option.scrollMode || store.isMobile || store.imgList.length <= 1);

/** 当前显示页面 */
const activePage = createRootMemo(() => store.pageList[store.activePageIndex] ?? []);

/** 当前显示的第一张图片的 index */
const activeImgIndex = createRootMemo(() => activePage().find(i => i !== -1) ?? 0);

/** 当前所处的图片流 */
const nowFillIndex = createRootMemo(() => findFillIndex(activeImgIndex(), store.fillEffect));

/** 预加载页数 */
const preloadNum = createRootMemo(() => ({
  back: store.option.preloadPageNum,
  front: Math.floor(store.option.preloadPageNum / 2)
}));

/** 默认图片类型 */
const defaultImgType = createRootMemo(() => {
  if (store.flag.autoWide) return 'wide';
  if (store.flag.autoScrollMode) return 'vertical';
  return '';
});

/** 获取图片列表中指定属性的中位数 */
const getImgMedian = sizeFn => {
  const list = store.imgList.filter(img => img.loadType === 'loaded' && img.width).map(sizeFn).sort();
  if (!list.length) return null;
  return list[Math.floor(list.length / 2)];
};

/** 图片占位尺寸 */
const placeholderSize = createThrottleMemo(() => ({
  width: getImgMedian(img => img.width) ?? 800,
  height: getImgMedian(img => img.height) ?? 1200
}), 500);

/** 每张图片的高度 */
const imgHeightList = createRootMemo(() => store.option.scrollMode ? store.imgList.map(img => {
  let height = img.height ?? placeholderSize().height;
  const width = img.width ?? placeholderSize().width;
  if (store.option.scrollModeFitToWidth) return height * (rootSize().width / width);
  if (width > rootSize().width) height *= rootSize().width / width;
  return height * store.option.scrollModeImgScale;
}) : []);

/** 卷轴模式下每张图片的位置 */
const imgTopList = createRootMemo(() => {
  if (!store.option.scrollMode) return [];
  const list = new Array(imgHeightList().length);
  let top = 0;
  for (let i = 0; i < imgHeightList().length; i++) {
    list[i] = top;
    top += imgHeightList()[i] + store.option.scrollModeSpacing * 7;
  }
  return list;
});

/** 漫画流的总高度 */
const contentHeight = createRootMemo(() => (imgTopList().at(-1) ?? 0) + (imgHeightList().at(-1) ?? 0));

const [renderRangeStart, setRenderRangeStart] = solidJs.createSignal(0);
const [renderRangeEnd, setRenderRangeEnd] = solidJs.createSignal(0);

/** 渲染页面的范围 */
const renderRange = {
  start: renderRangeStart,
  end: renderRangeEnd
};
const findTopImg = (initIndex, top) => {
  let i = initIndex || 1;
  for (; i < imgTopList().length; i++) if (imgTopList()[i] > top) return i - 1;
  return imgTopList().length - 1;
};

/** 计算渲染页面 */
const updateRenderRange = state => {
  let startPage;
  let endPage;
  if (state.option.scrollMode) {
    if (contentHeight() === 0) {
      startPage = 0;
      endPage = 1;
    } else {
      const top = scrollTop() - rootSize().height * 4;
      startPage = top < 0 ? 0 : findTopImg(0, top);
      const bottom = scrollTop() + rootSize().height * 5;
      endPage = bottom > contentHeight() ? imgTopList().length - 1 : findTopImg(startPage, bottom);
    }
  } else {
    startPage = Math.max(0, state.activePageIndex - 1);
    endPage = Math.min(state.pageList.length - 1, state.activePageIndex + 2);
  }
  if (!startPage) startPage = 0;
  if (!endPage) endPage = startPage + 1;
  setRenderRangeStart(startPage);
  setRenderRangeEnd(endPage);
};
solidJs.createRoot(() => {
  createEffectOn(() => store.option.scrollModeImgScale, () => setState(updateRenderRange));
  const getImgBottom = i => i === imgTopList().length - 1 ? contentHeight() : imgTopList()[i + 1];
  let startImgBootom = 0;
  let endImgTop = 0;
  createEffectOn(scrollTop, top => {
    if (inRange(startImgBootom, top, endImgTop)) return;
    setState(updateRenderRange);
    startImgBootom = getImgBottom(renderRangeStart());
    endImgTop = imgTopList()[renderRangeEnd()];
  });
});

/** 渲染图片的范围 */
const renderImgRange = createRootMemo(() => {
  if (!store.pageList[renderRangeStart()] || !store.pageList[renderRangeEnd()]) return {
    start: 0,
    end: 0
  };
  const renderImgList = [...store.pageList[renderRangeStart()], ...store.pageList[renderRangeEnd()]].filter(i => i !== -1);
  return {
    start: Math.min(...renderImgList),
    end: Math.max(...renderImgList)
  };
});

/**
 * 图片显示状态
 *
 * 0 - 页面中的第一张图片
 * 1 - 页面中的最后一张图片
 * 2 - 页面中的唯一一张图片
 */
const imgShowState = createRootMemo(() => {
  const stateList = [];
  for (let i = 0; i < store.pageList.length; i++) {
    const [a, b] = store.pageList[i];
    if (b !== undefined) {
      stateList[a] = 0;
      stateList[b] = 1;
    } else stateList[a] = 2;
  }
  return stateList;
}, []);

const loadImg = (state, index, draft) => {
  if (index === -1) return false;
  const img = state.imgList[index];
  if (!img?.src) return false;
  if (img.loadType === 'wait') {
    img.loadType = 'loading';
    draft.editNum += 1;
  }
  return draft.editNum >= draft.loadNum;
};
const loadPage = (state, index, draft) => state.pageList[index]?.some(i => loadImg(state, i, draft));

/**
 * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
 * @param state state
 * @param loadPageNum 加载页数
 * @param loadNum 加载图片的数量
 * @returns 返回是否成功加载了未加载图片
 */
const loadPageImg = (state, loadPageNum = Infinity, loadNum = 2) => {
  const draft = {
    editNum: 0,
    loadNum
  };
  const targetPage = state.activePageIndex + loadPageNum;
  if (targetPage < state.activePageIndex) {
    const end = Math.max(0, targetPage);
    for (let i = state.activePageIndex; i >= end; i--) if (loadPage(state, i, draft)) break;
  } else {
    const end = Math.min(state.pageList.length, targetPage);
    for (let i = state.activePageIndex; i < end; i++) if (loadPage(state, i, draft)) break;
  }
  return draft.editNum > 0;
};
const zoomScrollModeImg = (zoomLevel, set = false) => {
  const oldHeight = contentHeight();
  const oldScrollTop = scrollTop();
  setOption(draftOption => {
    const newVal = set ? zoomLevel : store.option.scrollModeImgScale + zoomLevel;
    draftOption.scrollModeImgScale = clamp(0.1, +newVal.toFixed(2), 3);
  });

  // 在卷轴模式下缩放时保持滚动进度不变
  scrollTo(oldScrollTop ? oldScrollTop / oldHeight * contentHeight() : 0);
};

/** 根据当前页数更新所有图片的加载状态 */
const updateImgLoadType = debounce(state => {
  // 先将所有加载中的图片状态改为暂停
  let i = state.imgList.length;
  while (i--) {
    if (state.imgList[i].loadType === 'loading') state.imgList[i].loadType = 'wait';
  }
  return (
    // 优先加载当前显示页
    loadPageImg(state, 1) ||
    // 再加载后面几页
    loadPageImg(state, preloadNum().back) ||
    // 再加载前面几页
    loadPageImg(state, -preloadNum().front) ||
    // 根据设置决定是否要继续加载其余图片
    !state.option.alwaysLoadAllImg && state.imgList.length > 60 ||
    // 加载当前页后面的图片
    loadPageImg(state, Infinity, 5) ||
    // 加载当前页前面的图片
    loadPageImg(state, -Infinity, 5)
  );
});

/** 重新计算 PageData */
const updatePageData = state => {
  const lastActiveImgIndex = activeImgIndex();
  let newPageList = [];
  if (isOnePageMode()) newPageList = state.imgList.map((_, i) => [i]);else newPageList = handleComicData(state.imgList, state.fillEffect);
  if (!isEqual(state.pageList, newPageList)) state.pageList = newPageList;
  updateImgLoadType(state);

  // 在图片排列改变后自动跳转回原先显示图片所在的页数
  if (lastActiveImgIndex !== activeImgIndex()) {
    const newActivePageIndex = state.pageList.findIndex(page => page.includes(lastActiveImgIndex));
    if (newActivePageIndex !== -1) state.activePageIndex = newActivePageIndex;
  }
};

/**
 * 将处理图片的相关变量恢复到初始状态
 *
 * 必须按照以下顺序调用
 * 1. 修改 imgList
 * 2. resetImgState
 * 3. updatePageData
 */
const resetImgState = state => {
  state.flag.autoScrollMode = false;
  state.flag.autoWide = false;
  state.flag.autoLong = false;
  autoCloseFill.clear();
  // 如果用户没有手动修改过首页填充，才将其恢复初始
  if (typeof state.fillEffect['-1'] === 'boolean') state.fillEffect['-1'] = state.option.firstPageFill && state.imgList.length > 3;
};

/** 根据比例更新图片类型。返回是否修改了图片类型 */
const updateImgType = (state, draftImg) => {
  const {
    width,
    height,
    type
  } = draftImg;
  if (!width || !height || !rootSize().width || !rootSize().height) return false;
  const imgRatio = width / height;
  if (imgRatio <= state.proportion.单页比例) {
    draftImg.type = imgRatio < state.proportion.条漫比例 ? 'vertical' : '';
  } else {
    draftImg.type = imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
  }
  return type !== draftImg.type;
};

/** 检查指定图片周围包括自己在内，是否有足够数量的**连续**的符合条件的图片 */
const checkImgTypeCount = (state, index, maxNum, fn = (other, target) => other.type === target.type) => {
  let num = 1;
  const targetImg = state.imgList[index];
  let i = index;
  while (i--) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (fn(img, targetImg)) {
      num += 1;
      if (num >= maxNum) return true;
    } else break;
  }
  for (i = index; i < state.imgList.length; i++) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (fn(img, targetImg)) {
      num += 1;
      if (num >= maxNum) return true;
    } else break;
  }
  return false;
};

/** 更新图片尺寸 */
const updateImgSize = (i, width, height) => {
  setState(state => {
    const img = state.imgList[i];
    if (!img) return;
    img.width = width;
    img.height = height;
    let isEdited = updateImgType(state, img);
    switch (img.type) {
      // 连续出现多张宽图后，自动将滚动条移至底部
      case 'long':
        {
          if (!state.flag.autoLong && checkImgTypeCount(store, i, 5)) state.flag.autoLong = true;
          // fall through
        }
      // 连续出现多张跨页图后，将剩余未加载图片类型设为跨页图
      case 'wide':
        {
          if (state.flag.autoWide || !checkImgTypeCount(state, i, 3, isWideImg)) break;
          state.imgList.forEach((comicImg, index) => {
            if (comicImg.loadType === 'wait' && comicImg.type === '') state.imgList[index].type = 'wide';
          });
          state.flag.autoWide = true;
          isEdited = true;
          break;
        }

      // 连续出现多张长图后，自动开启卷轴模式
      case 'vertical':
        {
          if (state.flag.autoScrollMode || !checkImgTypeCount(state, i, 3)) break;
          state.imgList.forEach((comicImg, index) => {
            if (comicImg.loadType === 'wait' && comicImg.type === '') state.imgList[index].type = 'vertical';
          });
          state.option.scrollMode = true;
          state.flag.autoScrollMode = true;
          isEdited = true;
          break;
        }
    }
    if (!isEdited) return;
    Reflect.deleteProperty(state.fillEffect, i);
    updatePageData(state);
  });
};
solidJs.createRoot(() => {
  // 预加载所有图片的尺寸
  createEffectOn(() => store.imgList, singleThreaded(state => plimit(store.imgList.map((img, i) => async () => {
    if (state.continueRun) return;
    if (img.loadType !== 'wait' || img.width || img.height || !img.src) return;
    const size = await getImgSize(img.src, () => state.continueRun);
    if (state.continueRun) return;
    if (size) updateImgSize(i, ...size);
  }), undefined, Math.max(store.option.preloadPageNum, 1))));

  // 处理显示窗口的长宽变化
  createEffectOn(rootSize, ({
    width,
    height
  }) => setState(state => {
    state.proportion.单页比例 = Math.min(width / 2 / height, 1);
    state.proportion.横幅比例 = width / height;
    state.proportion.条漫比例 = state.proportion.单页比例 / 2;
    let isEdited = false;
    for (let i = 0; i < state.imgList.length; i++) {
      if (!updateImgType(state, state.imgList[i])) continue;
      isEdited = true;
      Reflect.deleteProperty(state.fillEffect, i);
    }
    if (isEdited) resetImgState(state);
    updatePageData(state);
  }), {
    defer: true
  });
});

let clickTimeout = null;
const useDoubleClick = (click, doubleClick, timeout = 200) => {
  return event => {
    // 如果点击触发时还有上次计时器的记录，说明这次是双击
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      doubleClick?.(event);
      return;
    }

    // 单击事件延迟触发
    clickTimeout = window.setTimeout(() => {
      click(event);
      clickTimeout = null;
    }, timeout);
  };
};

/** 将页面移回原位 */
const resetPage = (state, animation = false) => {
  updateRenderRange(state);
  state.page.offset.x.pct = 0;
  state.page.offset.y.pct = 0;
  if (state.option.scrollMode) {
    state.page.anima = '';
    return;
  }
  let i = -1;
  if (inRange(renderRange.start(), state.activePageIndex, renderRange.end())) i = state.activePageIndex - renderRange.start();
  if (store.page.vertical) state.page.offset.y.pct = i === -1 ? 0 : -i;else state.page.offset.x.pct = i === -1 ? 0 : i;
  state.page.anima = animation ? 'page' : '';
};

/** 获取指定图片的提示文本 */
const getImgTip = i => {
  if (i === -1) return t('other.fill_page');
  const img = store.imgList[i];

  // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
  if (img.loadType !== 'loaded') return \`\${i + 1} (\${t(\`img_status.\${img.loadType}\`)})\`;
  if (img.translationType && img.translationType !== 'hide' && img.translationMessage) return \`\${i + 1}：\${img.translationMessage}\`;
  return \`\${i + 1}\`;
};

/** 获取指定页面的提示文本 */
const getPageTip = pageIndex => {
  const page = store.pageList[pageIndex];
  if (!page) return 'null';
  const pageIndexText = page.map(index => getImgTip(index));
  if (store.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText.join(store.option.scrollMode ? '\\n' : ' | ');
};
solidJs.createRoot(() => {
  // 页数发生变动时
  createEffectOn(() => store.activePageIndex, () => {
    setState(state => {
      updateImgLoadType(state);
      if (state.show.endPage) state.show.endPage = undefined;
    });
  }, {
    defer: true
  });
  createEffectOn(activePage, page => {
    if (!store.isDragMode) setState(resetPage);
    // 如果当前显示页面有出错的图片，就重新加载一次
    page?.forEach(i => {
      if (store.imgList[i]?.loadType !== 'error') return;
      _setState('imgList', i, 'loadType', 'wait');
    });
  }, {
    defer: true
  });

  // 在关闭工具栏的同时关掉滚动条的强制显示
  createEffectOn(() => store.show.toolbar, () => store.show.scrollbar && !store.show.toolbar && _setState('show', 'scrollbar', false), {
    defer: true
  });

  // 在切换网格模式后关掉 滚动条和工具栏 的强制显示
  createEffectOn(() => store.gridMode, () => setState(resetUI), {
    defer: true
  });
  createEffectOn(() => store.option.scrollModeImgScale, () => setState(updateRenderRange));
});

/** 判断当前是否已经滚动到底部 */
const isBottom = state => {
  return state.option.scrollMode ? Math.ceil(scrollTop() + rootSize().height) >= contentHeight() : state.activePageIndex === state.pageList.length - 1;
};

/** 判断当前是否已经滚动到顶部 */
const isTop = state => state.option.scrollMode ? scrollTop() === 0 : state.activePageIndex === 0;
const closeScrollLock$1 = debounce(() => _setState('flag', 'scrollLock', false), 200);

/** 翻页。返回是否成功改变了当前页数 */
const turnPageFn = (state, dir) => {
  if (state.gridMode) return false;
  if (dir === 'prev') {
    switch (state.show.endPage) {
      case 'start':
        if (!state.flag.scrollLock && state.option.jumpToNext) state.prop.Prev?.();
        return false;
      case 'end':
        state.show.endPage = undefined;
        state.flag.scrollLock = true;
        closeScrollLock$1();
        return false;
      default:
        // 弹出卷首结束页
        if (isTop(state)) {
          if (!state.prop.Exit) return false;
          // 没有 onPrev 时不弹出
          if (!state.prop.Prev || !state.option.jumpToNext) return false;
          state.show.endPage = 'start';
          state.flag.scrollLock = true;
          closeScrollLock$1();
          return false;
        }
        if (state.option.scrollMode) return false;
        state.activePageIndex -= 1;
        return true;
    }
  } else {
    switch (state.show.endPage) {
      case 'end':
        if (state.flag.scrollLock) return false;
        if (state.prop.Next && state.option.jumpToNext) {
          state.prop.Next();
          return false;
        }
        state.prop.Exit?.(true);
        return false;
      case 'start':
        state.show.endPage = undefined;
        state.flag.scrollLock = true;
        closeScrollLock$1();
        return false;
      default:
        // 弹出卷尾结束页
        if (isBottom(state)) {
          if (!state.prop.Exit) return false;
          state.show.endPage = 'end';
          state.flag.scrollLock = true;
          closeScrollLock$1();
          return false;
        }
        if (state.option.scrollMode) return false;
        state.activePageIndex += 1;
        return true;
    }
  }
};
const turnPage = dir => setState(state => turnPageFn(state, dir));
const turnPageAnimation = dir => {
  setState(state => {
    // 无法翻页就恢复原位
    if (!turnPageFn(state, dir)) {
      state.page.offset.x.px = 0;
      state.page.offset.y.px = 0;
      resetPage(state, true);
      state.isDragMode = false;
      return;
    }
    state.isDragMode = true;
    resetPage(state);
    if (store.page.vertical) state.page.offset.y.pct += dir === 'next' ? 1 : -1;else state.page.offset.x.pct += dir === 'next' ? -1 : 1;
    setTimeout(() => {
      setState(draftState => {
        resetPage(draftState, true);
        draftState.page.offset.x.px = 0;
        draftState.page.offset.y.px = 0;
        draftState.isDragMode = false;
      });
    }, 16);
  });
};

const touches = new Map();
const scale = () => store.zoom.scale / 100;
const width = () => refs.mangaFlow?.clientWidth ?? 0;
const height = () => refs.mangaFlow?.clientHeight ?? 0;
const bound = solidJs.createRoot(() => {
  const x = solidJs.createMemo(() => -width() * (scale() - 1));
  const y = solidJs.createMemo(() => -height() * (scale() - 1));
  return {
    x,
    y
  };
});
const checkBound = state => {
  state.zoom.offset.x = clamp(bound.x(), state.zoom.offset.x, 0);
  state.zoom.offset.y = clamp(bound.y(), state.zoom.offset.y, 0);
};
const zoom = (val, focal, animation = false) => {
  const newScale = clamp(100, val, 500);
  if (newScale === store.zoom.scale) return;

  // 消除放大导致的偏移
  const {
    left,
    top
  } = refs.mangaFlow.getBoundingClientRect();
  const x = (focal?.x ?? width() / 2) - left;
  const y = (focal?.y ?? height() / 2) - top;

  // 当前直接放大后的基准点坐标
  const newX = x / (store.zoom.scale / 100) * (newScale / 100);
  const newY = y / (store.zoom.scale / 100) * (newScale / 100);

  // 放大后基准点的偏移距离
  const dx = newX - x;
  const dy = newY - y;
  setState(state => {
    state.zoom.scale = newScale;
    state.zoom.offset.x -= dx;
    state.zoom.offset.y -= dy;
    checkBound(state);
    if (animation) state.page.anima = 'zoom';

    // 加一个延时锁防止在放大模式下通过滚轮缩小至原尺寸后就立刻跳到下一页
    if (newScale === 100) {
      state.flag.scrollLock = true;
      closeScrollLock$1();
    }
    resetUI(state);
  });
};

//
// 惯性滑动
//

/** 摩擦系数 */
const FRICTION_COEFF$1 = 0.91;
const mouse = {
  x: 0,
  y: 0
};
const last = {
  x: 0,
  y: 0
};
const velocity = {
  x: 0,
  y: 0
};
let animationId$2 = null;
const cancelAnimation = () => {
  if (!animationId$2) return;
  cancelAnimationFrame(animationId$2);
  animationId$2 = null;
};
let lastTime$1 = 0;

/** 逐帧计算惯性滑动 */
const handleSlideAnima = timestamp => {
  // 当速率足够小时停止计算动画
  if (approx(velocity.x, 0, 1) && approx(velocity.y, 0, 1)) {
    animationId$2 = null;
    return;
  }

  // 在拖拽后模拟惯性滑动
  setState(state => {
    state.zoom.offset.x += velocity.x;
    state.zoom.offset.y += velocity.y;
    checkBound(state);

    // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
    if (timestamp - lastTime$1 > 16) {
      velocity.x *= FRICTION_COEFF$1;
      velocity.y *= FRICTION_COEFF$1;
      lastTime$1 = timestamp;
    }
  });
  animationId$2 = requestAnimationFrame(handleSlideAnima);
};

/** 逐帧根据鼠标坐标移动元素，并计算速率 */
const handleDragAnima$1 = () => {
  // 当停着不动时退出循环
  if (mouse.x === store.zoom.offset.x && mouse.y === store.zoom.offset.y) {
    animationId$2 = null;
    return;
  }
  setState(state => {
    last.x = state.zoom.offset.x;
    last.y = state.zoom.offset.y;
    state.zoom.offset.x = mouse.x;
    state.zoom.offset.y = mouse.y;
    checkBound(state);
    velocity.x = state.zoom.offset.x - last.x;
    velocity.y = state.zoom.offset.y - last.y;
  });
  animationId$2 = requestAnimationFrame(handleDragAnima$1);
};

/** 是否正在双指捏合缩放中 */
let pinchZoom = false;

/** 处理放大后的拖拽移动 */
const handleZoomDrag = ({
  type,
  xy: [x, y],
  last: [lx, ly]
}) => {
  if (store.zoom.scale === 100) return;
  switch (type) {
    case 'down':
      {
        mouse.x = store.zoom.offset.x;
        mouse.y = store.zoom.offset.y;
        if (animationId$2) cancelAnimation();
        break;
      }
    case 'move':
      {
        if (animationId$2) cancelAnimation();
        mouse.x += x - lx;
        mouse.y += y - ly;
        if (animationId$2 === null) animationId$2 = requestAnimationFrame(handleDragAnima$1);
        break;
      }
    case 'up':
      {
        // 当双指捏合结束，一个手指抬起时，将剩余的指针当作刚点击来处理
        if (pinchZoom) {
          pinchZoom = false;
          mouse.x = store.zoom.offset.x;
          mouse.y = store.zoom.offset.y;
          return;
        }
        if (animationId$2) cancelAnimationFrame(animationId$2);
        animationId$2 = requestAnimationFrame(handleSlideAnima);
      }
  }
};

//
// 双指捏合缩放
//

/** 初始双指距离 */
let initDistance = 0;
/** 初始缩放比例 */
let initScale = 100;

/** 获取两个指针之间的距离 */
const getDistance = (a, b) => Math.hypot(b.xy[0] - a.xy[0], b.xy[1] - a.xy[1]);

/** 逐帧计算当前屏幕上两点之间的距离，并换算成缩放比例 */
const handlePinchZoomAnima = () => {
  if (touches.size < 2) {
    animationId$2 = null;
    return;
  }
  const [a, b] = [...touches.values()];
  const distance = getDistance(a, b);
  zoom(distance / initDistance * initScale, {
    x: (a.xy[0] + b.xy[0]) / 2,
    y: (a.xy[1] + b.xy[1]) / 2
  });
  animationId$2 = requestAnimationFrame(handlePinchZoomAnima);
};

/** 处理双指捏合缩放 */
const handlePinchZoom = ({
  type
}) => {
  if (touches.size < 2) return;
  switch (type) {
    case 'down':
      {
        pinchZoom = true;
        const [a, b] = [...touches.values()];
        initDistance = getDistance(a, b);
        initScale = store.zoom.scale;
        break;
      }
    case 'up':
      {
        const [a, b] = [...touches.values()];
        initDistance = getDistance(a, b);
        break;
      }
    case 'move':
      {
        if (animationId$2 === null) animationId$2 = requestAnimationFrame(handlePinchZoomAnima);
        break;
      }
    case 'cancel':
      {
        const [a, b] = [...touches.values()];
        initDistance = getDistance(a, b);
        break;
      }
  }
};

/** 根据坐标判断点击的元素 */
const findClickEle = (eleList, {
  x,
  y
}) => [...eleList].find(e => {
  const rect = e.getBoundingClientRect();
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
});

/** 触发 touchArea 操作 */
const handlePageClick = e => {
  const targetArea = findClickEle(refs.touchArea.children, e);
  if (!targetArea) return;
  const areaName = targetArea.getAttribute('data-area');
  if (!areaName) return;
  if (areaName === 'menu' || areaName === 'MENU') return setState(state => {
    state.show.scrollbar = !state.show.scrollbar;
    state.show.toolbar = !state.show.toolbar;
  });
  if (!store.option.clickPageTurn.enabled || store.zoom.scale !== 100) return;
  setState(state => {
    resetUI(state);
    turnPageFn(state, areaName.toLowerCase());
  });
};

/** 网格模式下点击图片跳到对应页 */
const handleGridClick = e => {
  const target = findClickEle(refs.root.getElementsByTagName('img'), e);
  if (!target) return;
  const pageNum = imgPageMap()[+target.alt];
  if (pageNum === undefined) return;
  setState(state => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
  if (store.option.scrollMode) scrollTo(imgTopList()[pageNum]);
};

/** 双击放大 */
const doubleClickZoom = e => !store.gridMode && zoom(store.zoom.scale !== 100 ? 100 : 350, e, true);
const handleClick = useDoubleClick(e => store.gridMode ? handleGridClick(e) : handlePageClick(e), doubleClickZoom);

/** 判断翻页方向 */
const getTurnPageDir = startTime => {
  let dir;
  let move;
  let total;
  if (store.page.vertical) {
    move = -store.page.offset.y.px;
    total = refs.root.clientHeight;
  } else {
    move = store.page.offset.x.px;
    total = refs.root.clientWidth;
  }

  // 处理无关速度不考虑时间单纯根据当前滚动距离来判断的情况
  if (!startTime) {
    if (Math.abs(move) > total / 2) dir = move > 0 ? 'next' : 'prev';
    return dir;
  }

  // 滑动距离超过总长度三分之一判定翻页
  if (Math.abs(move) > total / 3) dir = move > 0 ? 'next' : 'prev';
  if (dir) return dir;

  // 滑动速度超过 0.4 判定翻页
  const velocity = move / (performance.now() - startTime);
  if (velocity < -0.4) dir = 'prev';
  if (velocity > 0.4) dir = 'next';
  return dir;
};
let dx = 0;
let dy$1 = 0;
let animationId$1 = null;
const handleDragAnima = () => {
  // 当停着不动时退出循环
  if (dx === store.page.offset.x.px && dy$1 === store.page.offset.y.px) {
    animationId$1 = null;
    return;
  }
  setState(state => {
    if (state.page.vertical) state.page.offset.y.px = dy$1;else state.page.offset.x.px = dx;
  });
  animationId$1 = requestAnimationFrame(handleDragAnima);
};
const handleDragEnd = startTime => {
  dx = 0;
  dy$1 = 0;
  if (animationId$1) {
    cancelAnimationFrame(animationId$1);
    animationId$1 = null;
  }

  // 将拖动的页面移回正常位置
  const dir = getTurnPageDir(startTime);
  if (dir) return turnPageAnimation(dir);
  setState(state => {
    state.page.offset.x.px = 0;
    state.page.offset.y.px = 0;
    state.page.anima = 'page';
    state.isDragMode = false;
  });
};
handleDragEnd.debounce = debounce(handleDragEnd, 200);
const handleMangaFlowDrag = ({
  type,
  xy: [x, y],
  initial: [ix, iy],
  startTime
}) => {
  switch (type) {
    case 'move':
      {
        dx = store.option.dir === 'rtl' ? x - ix : ix - x;
        dy$1 = y - iy;
        if (store.isDragMode) {
          if (!animationId$1) animationId$1 = requestAnimationFrame(handleDragAnima);
          return;
        }

        // 判断滑动方向
        let slideDir;
        if (Math.abs(dx) > 5 && approx(dy$1, 0, 5)) slideDir = 'horizontal';
        if (Math.abs(dy$1) > 5 && approx(dx, 0, 5)) slideDir = 'vertical';
        if (!slideDir) return;
        setState(state => {
          // 根据滑动方向自动切换排列模式
          state.page.vertical = slideDir === 'vertical';
          state.isDragMode = true;
          resetPage(state);
        });
        return;
      }
    case 'up':
      return handleDragEnd(startTime);
  }
};
let lastDeltaY$1 = 0;
let retardStartTime = 0;
let lastWheel = 0;
const handleTrackpadWheel = e => {
  let deltaY = Math.floor(-e.deltaY);
  let absDeltaY = Math.abs(deltaY);
  if (absDeltaY < 2) return;
  let time = 0;
  let now = 0;
  // 为了避免被触摸板的滚动惯性触发，限定一下滚动距离
  if (absDeltaY > 50) {
    now = performance.now();
    time = now - lastWheel;
    lastWheel = now;
  }
  if (store.option.scrollMode) {
    if (time > 200 && (isTop(store) && e.deltaY < 0 || isBottom(store) && e.deltaY > 0)) turnPage(e.deltaY > 0 ? 'next' : 'prev');
    return;
  }

  // 加速度小于指定值后逐渐缩小滚动距离，实现减速效果
  if (Math.abs(absDeltaY - lastDeltaY$1) <= 6) {
    if (!retardStartTime) retardStartTime = Date.now();
    deltaY *= 1 - Math.min(1, (Date.now() - retardStartTime) / 10 * 0.002);
    absDeltaY = Math.abs(deltaY);
    if (absDeltaY < 2) return;
  } else retardStartTime = 0;
  lastDeltaY$1 = absDeltaY;
  dy$1 += deltaY;
  setState(state => {
    // 滚动至漫画头尾尽头时
    if (isTop(state) && dy$1 > 0 || isBottom(state) && dy$1 < 0) {
      if (time > 200) turnPageFn(state, dy$1 < 0 ? 'next' : 'prev');
      dy$1 = 0;
    }

    // 滚动过一页时
    if (dy$1 <= -rootSize().height) {
      if (turnPageFn(state, 'next')) dy$1 += rootSize().height;
    } else if (dy$1 >= rootSize().height) {
      if (turnPageFn(state, 'prev')) dy$1 -= rootSize().height;
    }
    state.page.vertical = true;
    state.isDragMode = true;
    resetPage(state);
  });
  if (!animationId$1) animationId$1 = requestAnimationFrame(handleDragAnima);
  handleDragEnd.debounce();
};

const setMessage = (i, msg) => _setState('imgList', i, 'translationMessage', msg);
const request = (url, details) => new Promise((resolve, reject) => {
  if (typeof GM_xmlhttpRequest === 'undefined') reject(new Error(t('pwa.alert.userscript_not_installed')));
  GM_xmlhttpRequest({
    method: 'GET',
    url,
    headers: {
      Referer: window.location.href
    },
    ...details,
    onload: resolve,
    onerror: reject,
    ontimeout: reject
  });
});
const download = async url => {
  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }
  const res = await request(url, {
    responseType: 'blob'
  });
  return res.response;
};
const createFormData = imgBlob => {
  const file = new File([imgBlob], \`image.\${imgBlob.type.split('/').at(-1)}\`, {
    type: imgBlob.type
  });
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mime', file.type);
  formData.append('size', store.option.translation.options.size);
  formData.append('detector', store.option.translation.options.detector);
  formData.append('direction', store.option.translation.options.direction);
  formData.append('translator', store.option.translation.options.translator);
  formData.append('tgt_lang', store.option.translation.options.targetLanguage);
  formData.append('target_language', store.option.translation.options.targetLanguage);
  formData.append('retry', \`\${store.option.translation.forceRetry}\`);
  return formData;
};

/** 将站点列表转为选择器中的选项 */
const createOptions = list => list.map(name => [name, t(\`translation.translator.\${name}\`) || name]);

const url = () => store.option.translation.localUrl || 'http://127.0.0.1:5003';

/** 获取部署服务的可用翻译 */
const getValidTranslators = async () => {
  try {
    const res = await request(\`\${url()}\`);
    const translatorsText = res.responseText.match(/(?<=validTranslators: ).+?(?=,\\n)/)?.[0];
    if (!translatorsText) return undefined;
    const list = JSON.parse(translatorsText.replaceAll(\`'\`, \`"\`));
    return createOptions(list);
  } catch (e) {
    log.error(t('translation.tip.get_translator_list_error'), e);
    return undefined;
  }
};

/** 使用自部署服务器翻译指定图片 */
const selfhostedTranslation = async i => {
  if (!(await getValidTranslators())) throw new Error(t('alert.server_connect_failed'));
  const img = store.imgList[i];
  setMessage(i, t('translation.tip.img_downloading'));
  let imgBlob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.download_img_failed'));
  }
  let task_id;
  // 上传图片取得任务 id
  try {
    const res = await request(\`\${url()}/submit\`, {
      method: 'POST',
      data: createFormData(imgBlob)
    });
    const resData = JSON.parse(res.responseText);
    task_id = resData.task_id;
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.upload_error'));
  }
  let errorNum = 0;
  let taskState;
  // 等待翻译完成
  while (!taskState?.finished) {
    try {
      await sleep(200);
      const res = await request(\`\${url()}/task-state?taskid=\${task_id}\`);
      taskState = JSON.parse(res.responseText);
      setMessage(i, \`\${t(\`translation.status.\${taskState.state}\`) || taskState.state}\`);
    } catch (error) {
      log.error(error);
      if (errorNum > 5) throw new Error(t('translation.tip.check_img_status_failed'));
      errorNum += 1;
    }
  }
  return URL.createObjectURL(await download(\`\${url()}/result/\${task_id}\`));
};

/** 等待翻译完成 */
const waitTranslation = (id, i) => {
  const ws = new WebSocket(\`wss://api.cotrans.touhou.ai/task/\${id}/event/v1\`);
  return new Promise((resolve, reject) => {
    ws.onmessage = e => {
      const msg = JSON.parse(e.data);
      switch (msg.type) {
        case 'result':
          resolve(msg.result.translation_mask);
          break;
        case 'pending':
          setMessage(i, t('translation.tip.pending', {
            pos: msg.pos
          }));
          break;
        case 'status':
          setMessage(i, t(\`translation.status.\${msg.status}\`) || msg.status);
          break;
        case 'error':
          reject(new Error(\`\${t('translation.tip.error')}：id \${msg.error_id}\`));
          break;
        case 'not_found':
          reject(new Error(\`\${t('translation.tip.error')}：Not Found\`));
          break;
      }
    };
  });
};

/** 将翻译后的内容覆盖到原图上 */
const mergeImage = async (rawImage, maskUri) => {
  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d');
  const img = new Image();
  img.src = URL.createObjectURL(rawImage);
  await new Promise((resolve, reject) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasCtx.drawImage(img, 0, 0);
      resolve(null);
    };
    img.onerror = reject;
  });
  const img2 = new Image();
  img2.src = maskUri;
  img2.crossOrigin = 'anonymous';
  await new Promise(resolve => {
    img2.onload = () => {
      canvasCtx.drawImage(img2, 0, 0);
      resolve(null);
    };
  });
  return URL.createObjectURL(await canvasToBlob(canvas));
};

/** 缩小过大的图片 */
const resize = async (blob, w, h) => {
  if (w <= 4096 && h <= 4096) return blob;
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
  });
  if (w <= 4096 && h <= 4096) return blob;
  const scale = Math.min(4096 / w, 4096 / h);
  const width = Math.floor(w * scale);
  const height = Math.floor(h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(img.src);
  return canvasToBlob(canvas);
};

/** 使用 cotrans 翻译指定图片 */
const cotransTranslation = async i => {
  const img = store.imgList[i];
  setMessage(i, t('translation.tip.img_downloading'));
  let imgBlob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.download_img_failed'));
  }
  try {
    imgBlob = await resize(imgBlob, img.width, img.height);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.resize_img_failed'));
  }
  let res;
  try {
    res = await request('https://api.cotrans.touhou.ai/task/upload/v1', {
      method: 'POST',
      data: createFormData(imgBlob),
      headers: {
        Origin: 'https://cotrans.touhou.ai',
        Referer: 'https://cotrans.touhou.ai/'
      }
    });
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.upload_error'));
  }
  let resData;
  try {
    resData = JSON.parse(res.responseText);
  } catch (_) {
    throw new Error(\`\${t('translation.tip.upload_return_error')}：\${res.responseText}\`);
  }
  if ('error_id' in resData) throw new Error(\`\${t('translation.tip.upload_return_error')}：\${resData.error_id}\`);
  if (!resData.id) throw new Error(t('translation.tip.id_not_returned'));
  const translation_mask = resData.result?.translation_mask || (await waitTranslation(resData.id, i));
  return mergeImage(imgBlob, translation_mask);
};
const cotransTranslators = ['google', 'youdao', 'baidu', 'deepl', 'gpt3.5', 'offline', 'none'];

/** 翻译指定图片 */
const translationImage = async i => {
  try {
    if (typeof GM_xmlhttpRequest === 'undefined') {
      toast?.error(t('pwa.alert.userscript_not_installed'));
      throw new Error(t('pwa.alert.userscript_not_installed'));
    }
    const img = store.imgList[i];
    if (!img?.src) return;
    if (img.translationType !== 'wait') return;
    if (img.translationUrl) return _setState('imgList', i, 'translationType', 'show');
    if (img.loadType !== 'loaded') return setMessage(i, t('translation.tip.img_not_fully_loaded'));
    const translationUrl = await (store.option.translation.server === 'cotrans' ? cotransTranslation : selfhostedTranslation)(i);
    setState(state => {
      state.imgList[i].translationUrl = translationUrl;
      state.imgList[i].translationMessage = t('translation.tip.translation_completed');
      state.imgList[i].translationType = 'show';
    });
  } catch (error) {
    setState(state => {
      state.imgList[i].translationType = 'error';
      if (error.message) state.imgList[i].translationMessage = error.message;
    });
  }
};

/** 逐个翻译状态为等待翻译的图片 */
const translationAll = singleThreaded(async () => {
  for (let i = 0; i < store.imgList.length; i++) {
    const img = store.imgList[i];
    if (img.loadType !== 'loaded' || img.translationType !== 'wait') continue;
    await translationImage(i);
  }
});

/** 开启或关闭指定图片的翻译 */
const setImgTranslationEnbale = (list, enbale) => {
  setState(state => {
    list.forEach(i => {
      const img = state.imgList[i];
      if (!img) return;
      if (enbale) {
        if (state.option.translation.forceRetry) {
          img.translationType = 'wait';
          img.translationUrl = undefined;
          setMessage(i, t('translation.tip.wait_translation'));
        } else {
          switch (img.translationType) {
            case 'hide':
              {
                img.translationType = 'show';
                break;
              }
            case 'error':
            case undefined:
              {
                img.translationType = 'wait';
                setMessage(i, t('translation.tip.wait_translation'));
                break;
              }
          }
        }
      } else {
        switch (img.translationType) {
          case 'show':
            {
              img.translationType = 'hide';
              break;
            }
          case 'error':
          case 'wait':
            {
              img.translationType = undefined;
              break;
            }
        }
      }
    });
  });
  return translationAll();
};
const [selfhostedOptions, setSelfOptions] = createEqualsSignal([]);

// 在切换翻译服务器的同时切换可用翻译的选项列表
createEffectOn([() => store.option.translation.server, () => store.option.translation.localUrl], async () => {
  if (store.option.translation.server !== 'selfhosted') return;
  setSelfOptions((await getValidTranslators()) ?? []);

  // 如果切换服务器后原先选择的翻译服务失效了，就换成谷歌翻译
  if (!selfhostedOptions().some(([val]) => val === store.option.translation.options.translator)) {
    setOption(draftOption => {
      draftOption.translation.options.translator = 'google';
    });
  }
});
const translatorOptions = createRootMemo(solidJs.on([selfhostedOptions, lang, () => store.option.translation.server], () => store.option.translation.server === 'selfhosted' ? selfhostedOptions() : createOptions(cotransTranslators)));

/** 切换页面填充 */
const switchFillEffect = () => {
  setState(state => {
    // 如果当前页不是双页显示的就跳过，避免在显示跨页图的页面切换却没看到效果的疑惑
    if (state.pageList[state.activePageIndex].length !== 2) return;
    state.fillEffect[nowFillIndex()] = +!state.fillEffect[nowFillIndex()];
    updatePageData(state);
  });
};

/** 切换卷轴模式 */
const switchScrollMode = () => {
  zoom(100);
  setOption((draftOption, state) => {
    draftOption.scrollMode = !draftOption.scrollMode;
    draftOption.onePageMode = draftOption.scrollMode;
    updatePageData(state);
  });
  // 切换到卷轴模式后自动定位到对应页
  if (store.option.scrollMode) scrollTo(imgTopList()[store.activePageIndex]);
};

/** 切换单双页模式 */
const switchOnePageMode = () => {
  setOption((draftOption, state) => {
    draftOption.onePageMode = !draftOption.onePageMode;
    updatePageData(state);
  });
};

/** 切换阅读方向 */
const switchDir = () => {
  setOption(draftOption => {
    draftOption.dir = draftOption.dir !== 'rtl' ? 'rtl' : 'ltr';
  });
};

/** 切换网格模式 */
const switchGridMode = () => {
  zoom(100);
  setState(state => {
    state.gridMode = !state.gridMode;
    if (state.zoom.scale !== 100) zoom(100);
    state.page.anima = '';
  });
  // 切换到网格模式后自动定位到当前页
  if (store.gridMode) requestAnimationFrame(() => {
    refs.mangaFlow.children[activeImgIndex()]?.scrollIntoView({
      block: 'center',
      inline: 'center'
    });
  });
};

/** 切换卷轴模式下图片适应宽度 */
const switchFitToWidth = () => {
  const top = scrollTop();
  const height = contentHeight();
  setOption(draftOption => {
    draftOption.scrollModeFitToWidth = !draftOption.scrollModeFitToWidth;
  });

  // 滚回之前的位置
  scrollTo(top / height * contentHeight());
};

/** 当前显示的图片是否正在翻译 */
const isTranslatingImage = createRootMemo(() => activePage().some(i => store.imgList[i]?.translationType && store.imgList[i].translationType !== 'hide'));

/** 切换当前页的翻译状态 */
const switchTranslation = () => setImgTranslationEnbale(activePage(), !isTranslatingImage());

var css$1 = ".index_module_img__40e84c8f>img{display:block;height:100%;width:100%}.index_module_img__40e84c8f{background-color:var(--hover-bg-color,#fff3);content-visibility:hidden;display:none;height:100%;max-height:100%;max-width:100%;object-fit:contain;position:relative;transform:translate(var(--page-x),var(--page-y)) translateZ(0)}.index_module_img__40e84c8f[data-show]{content-visibility:visible;display:block}.index_module_img__40e84c8f[data-show=\\"0\\"]{justify-self:end}.index_module_img__40e84c8f[data-show=\\"1\\"]{justify-self:start}.index_module_img__40e84c8f[data-type=long]{height:auto;width:100%}.index_module_img__40e84c8f[data-load-type=loading]{max-width:100vw!important}.index_module_img__40e84c8f[data-load-type=error],.index_module_img__40e84c8f[data-load-type=wait],.index_module_img__40e84c8f[src=\\"\\"]{height:100%;position:relative}:is(.index_module_img__40e84c8f[data-load-type=error],.index_module_img__40e84c8f[src=\\"\\"]):before{opacity:0}:is(.index_module_img__40e84c8f[data-load-type],.index_module_img__40e84c8f[src=\\"\\"]):after{background-color:#eee;background-position:50%;background-repeat:no-repeat;background-size:30%;height:100%;pointer-events:none;position:absolute;right:0;top:0;width:100%}.index_module_img__40e84c8f[data-load-type=loading],.index_module_img__40e84c8f[data-load-type=loading]:after{background-image:var(--md-cloud-download);background-position:50%;background-repeat:no-repeat;background-size:30%}.index_module_img__40e84c8f[data-load-type=loading]:after{animation:index_module_show__40e84c8f 1s forwards;content:\\"\\"}.index_module_img__40e84c8f[data-load-type=wait]:after{background-image:var(--md-cloud-download);content:\\"\\"}.index_module_img__40e84c8f[src=\\"\\"]:after{background-image:var(--md-photo);content:\\"\\"}.index_module_img__40e84c8f[data-load-type=error]:after{background-image:var(--md-image-not-supported);content:\\"\\"}.index_module_mangaBox__40e84c8f{height:100%;width:100%}.index_module_root__40e84c8f:not([data-grid-mode]) .index_module_mangaBox__40e84c8f{scrollbar-width:none}.index_module_root__40e84c8f:not([data-grid-mode]) .index_module_mangaBox__40e84c8f::-webkit-scrollbar{display:none}.index_module_mangaFlow__40e84c8f{display:grid;grid-auto-columns:100%;grid-auto-flow:column;grid-auto-rows:100%;touch-action:none;transform:translate(var(--zoom-x),var(--zoom-y)) scale(var(--scale)) translateZ(0);transform-origin:0 0;-webkit-user-select:none;user-select:none;grid-row-gap:0;backface-visibility:hidden;color:var(--text);height:100%;place-items:center;transition-duration:0ms;width:100%}.index_module_mangaFlow__40e84c8f[data-disable-zoom] .index_module_img__40e84c8f{height:unset;max-height:100%;object-fit:scale-down}.index_module_mangaFlow__40e84c8f[data-hidden-mouse=true]{cursor:none}.index_module_mangaFlow__40e84c8f[data-animation=page] .index_module_img__40e84c8f{transition-duration:.3s}.index_module_mangaFlow__40e84c8f[data-animation=zoom]{transition-duration:.3s}.index_module_mangaFlow__40e84c8f[data-vertical]{grid-auto-flow:row}.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f{grid-auto-columns:unset;grid-auto-flow:row;grid-auto-rows:33.33333%;overflow:auto;transform:none;grid-row-gap:1.5em;box-sizing:border-box;grid-template-rows:unset;padding-bottom:2em}.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f{height:auto;transform:none}.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f>img{cursor:pointer}.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f>.index_module_gridModeTip__40e84c8f{bottom:-1.5em;direction:ltr;line-height:1.5em;opacity:.5;overflow:hidden;position:absolute;text-align:center;text-overflow:ellipsis;white-space:nowrap;width:100%}.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[data-load-type=error],.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[data-load-type=wait],.index_module_root__40e84c8f[data-grid-mode] .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[src=\\"\\"]{height:100%}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f{overflow:auto}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f{display:flex;flex-direction:column;height:-moz-fit-content;height:fit-content}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[data-show]{display:unset;height:auto;max-height:unset;max-width:unset;object-fit:contain;width:calc(var(--scroll-mode-img-scale)*min(100%, var(--width)))}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[data-show][data-load-type=loading]{position:unset}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f .index_module_img__40e84c8f[data-show]:not(:first-of-type){margin-top:calc(var(--scroll-mode-spacing)*7px)}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f[data-grid-mode] .index_module_img__40e84c8f{height:100%;max-height:100%;max-width:100%;width:-moz-fit-content;width:fit-content}.index_module_root__40e84c8f[data-scroll-mode]:not([data-grid-mode]) .index_module_mangaBox__40e84c8f .index_module_mangaFlow__40e84c8f[data-fit-width] .index_module_img__40e84c8f{height:auto;max-width:100%;width:100%}@keyframes index_module_show__40e84c8f{0%{opacity:1}90%{opacity:1}to{opacity:0}}.index_module_endPage__40e84c8f{align-items:center;background-color:#333d;color:#fff;display:flex;height:100%;justify-content:center;left:0;opacity:0;pointer-events:none;position:absolute;top:0;transition:opacity .5s;width:100%;z-index:10}.index_module_endPage__40e84c8f>button{animation:index_module_jello__40e84c8f .3s forwards;background-color:transparent;color:inherit;cursor:pointer;font-size:1.2em;transform-origin:center}.index_module_endPage__40e84c8f>button[data-is-end]{font-size:3em;margin:2em}.index_module_endPage__40e84c8f>.index_module_tip__40e84c8f{margin:auto;position:absolute}.index_module_endPage__40e84c8f[data-show]{opacity:1;pointer-events:all}.index_module_endPage__40e84c8f[data-type=start]>.index_module_tip__40e84c8f{transform:translateY(-10em)}.index_module_endPage__40e84c8f[data-type=end]>.index_module_tip__40e84c8f{transform:translateY(10em)}.index_module_root__40e84c8f[data-mobile] .index_module_endPage__40e84c8f>button{width:1em}.index_module_comments__40e84c8f{align-items:flex-end;display:flex;flex-direction:column;max-height:80%;opacity:.3;overflow:auto;padding-right:.5em;position:absolute;right:1em;width:20em}.index_module_comments__40e84c8f>p{background-color:#333b;border-radius:.5em;margin:.5em .1em;padding:.2em .5em}.index_module_comments__40e84c8f:hover{opacity:1}.index_module_root__40e84c8f[data-mobile] .index_module_comments__40e84c8f{max-height:15em;opacity:.8;top:calc(50% + 15em)}@keyframes index_module_jello__40e84c8f{0%,11.1%,to{transform:translateZ(0)}22.2%{transform:skewX(-12.5deg) skewY(-12.5deg)}33.3%{transform:skewX(6.25deg) skewY(6.25deg)}44.4%{transform:skewX(-3.125deg) skewY(-3.125deg)}55.5%{transform:skewX(1.5625deg) skewY(1.5625deg)}66.6%{transform:skewX(-.7812deg) skewY(-.7812deg)}77.7%{transform:skewX(.3906deg) skewY(.3906deg)}88.8%{transform:skewX(-.1953deg) skewY(-.1953deg)}}.index_module_toolbar__40e84c8f{align-items:center;display:flex;height:100%;justify-content:flex-start;position:fixed;top:0;z-index:9}.index_module_toolbarPanel__40e84c8f{display:flex;flex-direction:column;padding:.5em;position:relative;transform:translateX(-100%);transition:transform .2s}:is(.index_module_toolbar__40e84c8f[data-show],.index_module_toolbar__40e84c8f:hover) .index_module_toolbarPanel__40e84c8f{transform:none}.index_module_toolbar__40e84c8f[data-close] .index_module_toolbarPanel__40e84c8f{transform:translateX(-100%);visibility:hidden}.index_module_toolbarBg__40e84c8f{background-color:var(--page-bg);border-bottom-right-radius:1em;border-top-right-radius:1em;filter:opacity(.8);height:100%;position:absolute;right:0;top:0;width:100%}.index_module_root__40e84c8f[data-mobile] .index_module_toolbar__40e84c8f{font-size:1.3em}.index_module_root__40e84c8f[data-mobile] .index_module_toolbar__40e84c8f:not([data-show]){pointer-events:none}.index_module_root__40e84c8f[data-mobile] .index_module_toolbarBg__40e84c8f{filter:opacity(.8)}.index_module_SettingPanelPopper__40e84c8f{height:0!important;padding:0!important;pointer-events:unset!important;transform:none!important}.index_module_SettingPanel__40e84c8f{background-color:var(--page-bg);border-radius:.3em;bottom:0;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12);color:var(--text);font-size:1.2em;height:-moz-fit-content;height:fit-content;margin:auto;max-height:95%;max-width:calc(100% - 5em);overflow:auto;position:fixed;top:0;-webkit-user-select:text;user-select:text;z-index:1}.index_module_SettingPanel__40e84c8f hr{color:#fff;margin:0}.index_module_SettingBlock__40e84c8f{display:grid;grid-template-rows:max-content 1fr;transition:grid-template-rows .2s ease-out}.index_module_SettingBlock__40e84c8f .index_module_SettingBlockBody__40e84c8f{overflow:hidden;padding:0 .5em 1em;z-index:0}:is(.index_module_SettingBlock__40e84c8f .index_module_SettingBlockBody__40e84c8f)>div+:is(.index_module_SettingBlock__40e84c8f .index_module_SettingBlockBody__40e84c8f)>div{margin-top:1em}.index_module_SettingBlock__40e84c8f[data-show=false]{grid-template-rows:max-content 0fr;padding-bottom:unset}.index_module_SettingBlock__40e84c8f[data-show=false] .index_module_SettingBlockBody__40e84c8f{padding:unset}.index_module_SettingBlockSubtitle__40e84c8f{background-color:var(--page-bg);color:var(--text-secondary);cursor:pointer;font-size:.7em;height:3em;line-height:3em;margin-bottom:.1em;position:sticky;text-align:center;top:0;z-index:1}.index_module_SettingsItem__40e84c8f{align-items:center;display:flex;justify-content:space-between}.index_module_SettingsItem__40e84c8f+.index_module_SettingsItem__40e84c8f{margin-top:1em}.index_module_SettingsItemName__40e84c8f{font-size:.9em;max-width:calc(100% - 4em);overflow-wrap:anywhere;text-align:start;white-space:pre-wrap}.index_module_SettingsItemSwitch__40e84c8f{align-items:center;background-color:var(--switch-bg);border:0;border-radius:1em;cursor:pointer;display:inline-flex;height:.8em;margin:.3em;padding:0;width:2.3em}.index_module_SettingsItemSwitchRound__40e84c8f{background:var(--switch);border-radius:100%;box-shadow:0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12);height:1.15em;transform:translateX(-10%);transition:transform .1s;width:1.15em}.index_module_SettingsItemSwitch__40e84c8f[data-checked=true]{background:var(--secondary-bg)}.index_module_SettingsItemSwitch__40e84c8f[data-checked=true] .index_module_SettingsItemSwitchRound__40e84c8f{background:var(--secondary);transform:translateX(110%)}.index_module_SettingsItemIconButton__40e84c8f{background-color:transparent;border:none;color:var(--text);cursor:pointer;font-size:1.7em;height:1em;margin:0 .2em 0 0;padding:0}.index_module_SettingsItemSelect__40e84c8f{background-color:var(--hover-bg-color);border:none;border-radius:5px;cursor:pointer;font-size:.9em;margin:0;max-width:6.5em;outline:none;padding:.3em}.index_module_closeCover__40e84c8f{height:100%;left:0;position:fixed;top:0;width:100%}.index_module_SettingsShowItem__40e84c8f{display:grid;transition:grid-template-rows .2s ease-out}.index_module_SettingsShowItem__40e84c8f>.index_module_SettingsShowItemBody__40e84c8f{overflow:hidden}.index_module_SettingsShowItem__40e84c8f>.index_module_SettingsShowItemBody__40e84c8f>.index_module_SettingsItem__40e84c8f{margin-top:1em}.index_module_hotkeys__40e84c8f{align-items:center;border-bottom:1px solid var(--secondary-bg);color:var(--text);display:flex;flex-grow:1;flex-wrap:wrap;font-size:.9em;padding:2em .2em .2em;position:relative;z-index:1}.index_module_hotkeys__40e84c8f+.index_module_hotkeys__40e84c8f{margin-top:.5em}.index_module_hotkeys__40e84c8f:last-child{border-bottom:none}.index_module_hotkeysItem__40e84c8f{align-items:center;border-radius:.3em;box-sizing:content-box;cursor:pointer;display:flex;font-family:serif;height:1em;margin:.3em;outline:1px solid;outline-color:var(--secondary-bg);padding:.2em 1.2em}.index_module_hotkeysItem__40e84c8f>svg{background-color:var(--text);border-radius:1em;color:var(--page-bg);display:none;height:1em;margin-left:.4em;opacity:.5}.index_module_hotkeysItem__40e84c8f>svg:hover{opacity:.9}.index_module_hotkeysItem__40e84c8f:hover{padding:.2em .5em}.index_module_hotkeysItem__40e84c8f:hover>svg{display:unset}.index_module_hotkeysItem__40e84c8f:focus,.index_module_hotkeysItem__40e84c8f:focus-visible{outline:var(--text) solid 2px}.index_module_hotkeysHeader__40e84c8f{align-items:center;box-sizing:border-box;display:flex;left:0;padding:0 .5em;position:absolute;top:0;width:100%}.index_module_hotkeysHeader__40e84c8f>p{background-color:var(--page-bg);line-height:1em;overflow-wrap:anywhere;text-align:start;white-space:pre-wrap}.index_module_hotkeysHeader__40e84c8f>div[title]{background-color:var(--page-bg);cursor:pointer;display:flex;transform:scale(0);transition:transform .1s}.index_module_hotkeysHeader__40e84c8f>div[title]>svg{width:1.6em}.index_module_hotkeys__40e84c8f:hover div[title]{transform:scale(1)}.index_module_scrollbar__40e84c8f{--arrow-y:clamp(0.45em,calc(var(--slider-midpoint)),calc(var(--scroll-length) - 0.45em));border-left:max(6vw,1em) solid transparent;display:flex;flex-direction:column;height:98%;position:absolute;right:3px;top:1%;touch-action:none;-webkit-user-select:none;user-select:none;width:5px;z-index:9}.index_module_scrollbar__40e84c8f>div{align-items:center;display:flex;flex-direction:column;flex-grow:1;justify-content:center;pointer-events:none}.index_module_scrollbarPage__40e84c8f{background-color:var(--secondary);flex-grow:1;height:100%;transform:scaleY(1);transform-origin:bottom;transition:transform 1s;width:100%}.index_module_scrollbarPage__40e84c8f[data-type=loaded]{transform:scaleY(0)}.index_module_scrollbarPage__40e84c8f[data-type=wait]{opacity:.5}.index_module_scrollbarPage__40e84c8f[data-type=error]{background-color:#f005}.index_module_scrollbarPage__40e84c8f[data-null]{background-color:#fbc02d}.index_module_scrollbarPage__40e84c8f[data-translation-type]{background-color:transparent;transform:scaleY(1);transform-origin:top}.index_module_scrollbarPage__40e84c8f[data-translation-type=wait]{background-color:#81c784}.index_module_scrollbarPage__40e84c8f[data-translation-type=show]{background-color:#4caf50}.index_module_scrollbarPage__40e84c8f[data-translation-type=error]{background-color:#f005}.index_module_scrollbarSlider__40e84c8f{background-color:var(--scrollbar-slider);border-radius:1em;height:var(--slider-height);justify-content:center;opacity:1;position:absolute;transform:translateY(var(--slider-top));transition:transform .15s,opacity .15s;width:100%;z-index:1}.index_module_scrollbarPoper__40e84c8f{--poper-top:clamp(0%,calc(var(--slider-midpoint) - 50%),calc(var(--scroll-length) - 100%));background-color:#303030;border-radius:.3em;color:#fff;font-size:.8em;line-height:1.5em;min-height:1.5em;min-width:1em;padding:.2em .5em;position:absolute;right:2em;text-align:center;transform:translateY(var(--poper-top));white-space:pre;width:-moz-fit-content;width:fit-content}.index_module_scrollbar__40e84c8f:before{background-color:transparent;border:.4em solid transparent;border-left:.5em solid #303030;content:\\"\\";position:absolute;right:2em;transform:translate(140%,calc(var(--arrow-y) - 50%))}.index_module_scrollbarPoper__40e84c8f,.index_module_scrollbar__40e84c8f:before{opacity:0;transition:opacity .15s,transform .15s}.index_module_scrollbar__40e84c8f:hover .index_module_scrollbarPoper__40e84c8f,.index_module_scrollbar__40e84c8f:hover .index_module_scrollbarSlider__40e84c8f,.index_module_scrollbar__40e84c8f:hover:before,.index_module_scrollbar__40e84c8f[data-force-show] .index_module_scrollbarPoper__40e84c8f,.index_module_scrollbar__40e84c8f[data-force-show] .index_module_scrollbarSlider__40e84c8f,.index_module_scrollbar__40e84c8f[data-force-show]:before{opacity:1}.index_module_scrollbar__40e84c8f[data-auto-hidden]:not([data-force-show]) .index_module_scrollbarSlider__40e84c8f{opacity:0}.index_module_scrollbar__40e84c8f[data-auto-hidden]:not([data-force-show]):hover .index_module_scrollbarSlider__40e84c8f{opacity:1}.index_module_scrollbar__40e84c8f[data-position=hidden]{display:none}.index_module_scrollbar__40e84c8f[data-position=top]{border-bottom:max(6vh,1em) solid transparent;top:1px}.index_module_scrollbar__40e84c8f[data-position=top]:before{border-bottom:.5em solid #303030;right:0;top:1.2em;transform:translate(var(--arrow-x),-120%)}.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarPoper__40e84c8f{top:1.2em}.index_module_scrollbar__40e84c8f[data-position=bottom]{border-top:max(6vh,1em) solid transparent;bottom:1px;top:unset}.index_module_scrollbar__40e84c8f[data-position=bottom]:before{border-top:.5em solid #303030;bottom:1.2em;right:0;transform:translate(var(--arrow-x),120%)}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarPoper__40e84c8f{bottom:1.2em}.index_module_scrollbar__40e84c8f[data-position=bottom],.index_module_scrollbar__40e84c8f[data-position=top]{--arrow-x:calc(var(--arrow-y)*-1 + 50%);border-left:none;flex-direction:row-reverse;height:5px;right:1%;width:98%}.index_module_scrollbar__40e84c8f[data-position=bottom]:before,.index_module_scrollbar__40e84c8f[data-position=top]:before{border-left:.4em solid transparent}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarSlider__40e84c8f,.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarSlider__40e84c8f{height:100%;transform:translateX(calc(var(--slider-top)*-1));width:var(--slider-height)}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarPoper__40e84c8f,.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarPoper__40e84c8f{padding:.1em .3em;right:unset;transform:translateX(calc(var(--poper-top)*-1))}.index_module_scrollbar__40e84c8f[data-position=bottom][data-dir=ltr],.index_module_scrollbar__40e84c8f[data-position=top][data-dir=ltr]{--arrow-x:calc(var(--arrow-y) - 50%);flex-direction:row}.index_module_scrollbar__40e84c8f[data-position=bottom][data-dir=ltr]:before,.index_module_scrollbar__40e84c8f[data-position=top][data-dir=ltr]:before{left:0;right:unset}.index_module_scrollbar__40e84c8f[data-position=bottom][data-dir=ltr] .index_module_scrollbarSlider__40e84c8f,.index_module_scrollbar__40e84c8f[data-position=top][data-dir=ltr] .index_module_scrollbarSlider__40e84c8f{transform:translateX(var(--top))}.index_module_scrollbar__40e84c8f[data-position=bottom][data-dir=ltr] .index_module_scrollbarPoper__40e84c8f,.index_module_scrollbar__40e84c8f[data-position=top][data-dir=ltr] .index_module_scrollbarPoper__40e84c8f{transform:translateX(var(--poper-top))}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarPage__40e84c8f,.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarPage__40e84c8f{transform:scaleX(1)}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarPage__40e84c8f[data-type=loaded],.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarPage__40e84c8f[data-type=loaded]{transform:scaleX(0)}.index_module_scrollbar__40e84c8f[data-position=bottom] .index_module_scrollbarPage__40e84c8f[data-translation-type],.index_module_scrollbar__40e84c8f[data-position=top] .index_module_scrollbarPage__40e84c8f[data-translation-type]{transform:scaleX(1)}.index_module_root__40e84c8f[data-scroll-mode] .index_module_scrollbar__40e84c8f:before,.index_module_root__40e84c8f[data-scroll-mode] :is(.index_module_scrollbarSlider__40e84c8f,.index_module_scrollbarPoper__40e84c8f){transition:opacity .15s}.index_module_root__40e84c8f[data-mobile] .index_module_scrollbar__40e84c8f:hover .index_module_scrollbarPoper__40e84c8f,.index_module_root__40e84c8f[data-mobile] .index_module_scrollbar__40e84c8f:hover:before{opacity:0}.index_module_touchAreaRoot__40e84c8f{color:#fff;display:grid;font-size:3em;grid-template-columns:1fr min(30%,10em) 1fr;grid-template-rows:1fr min(20%,10em) 1fr;height:100%;letter-spacing:.5em;opacity:0;pointer-events:none;position:absolute;top:0;transition:opacity .4s;-webkit-user-select:none;user-select:none;width:100%}.index_module_touchAreaRoot__40e84c8f[data-show]{opacity:1}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f{align-items:center;display:flex;justify-content:center;text-align:center}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=PREV],.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=prev]{background-color:#95e1d3e6}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=MENU],.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=menu]{background-color:#fce38ae6}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=NEXT],.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=next]{background-color:#f38181e6}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=PREV]:after{content:var(--i18n-touch-area-prev)}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=MENU]:after{content:var(--i18n-touch-area-menu)}.index_module_touchAreaRoot__40e84c8f .index_module_touchArea__40e84c8f[data-area=NEXT]:after{content:var(--i18n-touch-area-next)}.index_module_touchAreaRoot__40e84c8f[data-vert=true]{flex-direction:column!important}.index_module_touchAreaRoot__40e84c8f:not([data-turn-page]) .index_module_touchArea__40e84c8f[data-area=NEXT],.index_module_touchAreaRoot__40e84c8f:not([data-turn-page]) .index_module_touchArea__40e84c8f[data-area=PREV],.index_module_touchAreaRoot__40e84c8f:not([data-turn-page]) .index_module_touchArea__40e84c8f[data-area=next],.index_module_touchAreaRoot__40e84c8f:not([data-turn-page]) .index_module_touchArea__40e84c8f[data-area=prev]{visibility:hidden}.index_module_touchAreaRoot__40e84c8f[data-area=edge]{grid-template-columns:1fr min(30%,10em) 1fr}.index_module_root__40e84c8f[data-mobile] .index_module_touchAreaRoot__40e84c8f{flex-direction:column!important;letter-spacing:0}.index_module_root__40e84c8f[data-mobile] [data-area]:after{font-size:.8em}.index_module_hidden__40e84c8f{display:none!important}.index_module_invisible__40e84c8f{visibility:hidden!important}.index_module_root__40e84c8f{background-color:var(--bg);font-size:1em;height:100%;outline:0;overflow:hidden;position:relative;width:100%}.index_module_root__40e84c8f a{color:var(--text-secondary)}.index_module_root__40e84c8f[data-mobile]{font-size:.8em}.index_module_beautifyScrollbar__40e84c8f{scrollbar-color:var(--scrollbar-slider) transparent;scrollbar-width:thin}.index_module_beautifyScrollbar__40e84c8f::-webkit-scrollbar{height:10px;width:5px}.index_module_beautifyScrollbar__40e84c8f::-webkit-scrollbar-track{background:transparent}.index_module_beautifyScrollbar__40e84c8f::-webkit-scrollbar-thumb{background:var(--scrollbar-slider)}img,p{margin:0}button,div{border:none;outline:none}blockquote{border-left:.25em solid var(--text-secondary,#607d8b);color:var(--text-secondary);font-style:italic;line-height:1.2em;margin:.5em 0 0;overflow-wrap:anywhere;padding:0 0 0 1em;text-align:start;white-space:pre-wrap}svg{width:1em}";
var modules_c21c94f2$1 = {"img":"index_module_img__40e84c8f","show":"index_module_show__40e84c8f","mangaBox":"index_module_mangaBox__40e84c8f","root":"index_module_root__40e84c8f","mangaFlow":"index_module_mangaFlow__40e84c8f","gridModeTip":"index_module_gridModeTip__40e84c8f","endPage":"index_module_endPage__40e84c8f","jello":"index_module_jello__40e84c8f","tip":"index_module_tip__40e84c8f","comments":"index_module_comments__40e84c8f","toolbar":"index_module_toolbar__40e84c8f","toolbarPanel":"index_module_toolbarPanel__40e84c8f","toolbarBg":"index_module_toolbarBg__40e84c8f","SettingPanelPopper":"index_module_SettingPanelPopper__40e84c8f","SettingPanel":"index_module_SettingPanel__40e84c8f","SettingBlock":"index_module_SettingBlock__40e84c8f","SettingBlockBody":"index_module_SettingBlockBody__40e84c8f","SettingBlockSubtitle":"index_module_SettingBlockSubtitle__40e84c8f","SettingsItem":"index_module_SettingsItem__40e84c8f","SettingsItemName":"index_module_SettingsItemName__40e84c8f","SettingsItemSwitch":"index_module_SettingsItemSwitch__40e84c8f","SettingsItemSwitchRound":"index_module_SettingsItemSwitchRound__40e84c8f","SettingsItemIconButton":"index_module_SettingsItemIconButton__40e84c8f","SettingsItemSelect":"index_module_SettingsItemSelect__40e84c8f","closeCover":"index_module_closeCover__40e84c8f","SettingsShowItem":"index_module_SettingsShowItem__40e84c8f","SettingsShowItemBody":"index_module_SettingsShowItemBody__40e84c8f","hotkeys":"index_module_hotkeys__40e84c8f","hotkeysItem":"index_module_hotkeysItem__40e84c8f","hotkeysHeader":"index_module_hotkeysHeader__40e84c8f","scrollbar":"index_module_scrollbar__40e84c8f","scrollbarPage":"index_module_scrollbarPage__40e84c8f","scrollbarSlider":"index_module_scrollbarSlider__40e84c8f","scrollbarPoper":"index_module_scrollbarPoper__40e84c8f","touchAreaRoot":"index_module_touchAreaRoot__40e84c8f","touchArea":"index_module_touchArea__40e84c8f","hidden":"index_module_hidden__40e84c8f","invisible":"index_module_invisible__40e84c8f","beautifyScrollbar":"index_module_beautifyScrollbar__40e84c8f"};

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
const focus = () => requestAnimationFrame(() => {
  refs.mangaBox?.click();
  refs.mangaBox?.focus();
});
const handleMouseDown = e => {
  if (e.button !== 1 || store.option.scrollMode) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

/** 卷轴模式下的滚动 */
const scrollModeScroll = dir => {
  if (!store.show.endPage) {
    scrollTo(scrollTop() + rootSize().height * 0.8 * (dir === 'next' ? 1 : -1));
    _setState('flag', 'scrollLock', true);
  }
  closeScrollLock$1();
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = nextPage => {
  const next = store.option.swapPageTurnKey ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

/** 判断按键代码是否可以输入字母 */
const isAlphabetKey = /^(Shift \\+ )?[a-zA-Z]$/;
const handleKeyDown = e => {
  if (e.target.tagName === 'INPUT' || e.target.className === modules_c21c94f2$1.hotkeysItem) return;
  const code = getKeyboardCode(e);

  // esc 在触发配置操作前，先用于退出一些界面
  if (e.key === 'Escape') {
    if (store.gridMode) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('gridMode', false);
    }
    if (store.show.endPage) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('show', 'endPage', undefined);
    }
  }

  // 处理标注了 data-only-number 的元素
  if (e.target.getAttribute('data-only-number') !== null) {
    // 拦截能输入数字外的按键
    if (isAlphabetKey.test(code)) {
      e.stopPropagation();
      e.preventDefault();
    } else if (code.includes('Enter')) e.target.blur();
    return;
  }

  // 卷轴、网格模式下跳过用于移动的按键
  if ((store.option.scrollMode || store.gridMode) && !store.show.endPage) {
    switch (e.key) {
      case 'Home':
      case 'End':
      case 'ArrowRight':
      case 'ArrowLeft':
        e.stopPropagation();
        return;
      case 'ArrowUp':
      case 'PageUp':
        e.stopPropagation();
        return store.gridMode || turnPage('prev');
      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        e.stopPropagation();
        return store.gridMode || turnPage('next');
    }
  }

  // 拦截已注册的快捷键
  if (Reflect.has(hotkeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  }
  switch (hotkeysMap()[code]) {
    case 'turn_page_up':
      {
        if (store.option.scrollMode) scrollModeScroll('prev');
        return turnPage('prev');
      }
    case 'turn_page_down':
      {
        if (store.option.scrollMode) scrollModeScroll('next');
        return turnPage('next');
      }
    case 'turn_page_right':
      return turnPage(handleSwapPageTurnKey(store.option.dir !== 'rtl'));
    case 'turn_page_left':
      return turnPage(handleSwapPageTurnKey(store.option.dir === 'rtl'));
    case 'jump_to_home':
      return _setState('activePageIndex', 0);
    case 'jump_to_end':
      return _setState('activePageIndex', store.pageList.length - 1);
    case 'switch_page_fill':
      return switchFillEffect();
    case 'switch_scroll_mode':
      return switchScrollMode();
    case 'switch_single_double_page_mode':
      return switchOnePageMode();
    case 'switch_dir':
      return switchDir();
    case 'switch_grid_mode':
      return switchGridMode();
    case 'translate_current_page':
      return switchTranslation();
    case 'switch_auto_enlarge':
      return setOption(draftOption => {
        draftOption.disableZoom = !draftOption.disableZoom;
      });
    case 'exit':
      return store.prop.Exit?.();
  }
};

/** 判断两个数值是否是整数倍的关系 */
const isMultipleOf = (a, b) => {
  const decimal = \`\${a < b ? b / a : a / b}\`.split('.')?.[1];
  return !decimal || decimal.startsWith('0000') || decimal.startsWith('9999');
};
let lastDeltaY = -1;
let timeoutId = 0;
let lastPageNum = -1;
let wheelType;
let equalNum = 0;
let diffNum = 0;
const handleWheel = e => {
  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();
  if (store.flag.scrollLock || e.deltaY === 0) return closeScrollLock$1();
  const isWheelDown = e.deltaY > 0;
  if (store.show.endPage) return turnPage(isWheelDown ? 'next' : 'prev');

  // 卷轴模式下的图片缩放
  if ((e.ctrlKey || e.altKey) && store.option.scrollMode && store.zoom.scale === 100) {
    e.preventDefault();
    if (store.option.scrollModeFitToWidth) return;
    return zoomScrollModeImg(isWheelDown ? -0.1 : 0.1);
  }
  if (e.ctrlKey || e.altKey || store.zoom.scale !== 100) {
    e.preventDefault();
    return zoom(store.zoom.scale + (isWheelDown ? -25 : 25), e);
  }
  const nowDeltaY = Math.abs(e.deltaY);

  // 通过判断\`两次滚动距离是否成倍数\`和\`滚动距离是否过小\`来判断是否是触摸板
  if (wheelType !== 'trackpad' && (nowDeltaY < 2 || !Number.isInteger(lastDeltaY) && !Number.isInteger(nowDeltaY) && !isMultipleOf(lastDeltaY, nowDeltaY))) {
    wheelType = 'trackpad';
    if (timeoutId) clearTimeout(timeoutId);
    // 如果是触摸板滚动，且上次成功触发了翻页，就重新翻页回去
    if (lastPageNum !== -1) _setState('activePageIndex', lastPageNum);
  }

  // 为了避免因临时卡顿而误判为触摸板
  // 在连续几次滚动量均相同的情况下，将 wheelType 相关变量重置回初始状态
  if (diffNum < 10) {
    if (lastDeltaY === nowDeltaY && nowDeltaY > 5) equalNum += 1;else {
      diffNum += 1;
      equalNum = 0;
    }
    if (equalNum >= 3) {
      wheelType = undefined;
      lastPageNum = -1;
    }
  }
  lastDeltaY = nowDeltaY;
  switch (wheelType) {
    case undefined:
      {
        if (lastPageNum === -1) {
          // 第一次触发滚动没法判断类型，就当作滚轮来处理
          // 但为了避免触摸板前两次滚动事件间隔大于帧生成时间导致得重新翻页回去的闪烁，加个延迟等待下
          lastPageNum = store.activePageIndex;
          timeoutId = window.setTimeout(() => turnPage(isWheelDown ? 'next' : 'prev'), 16);
          return;
        }
        wheelType = 'mouse';
      }
    // falls through

    case 'mouse':
      return turnPage(isWheelDown ? 'next' : 'prev');
    case 'trackpad':
      return handleTrackpadWheel(e);
  }
};

const [_scrollLength, setScrollLength] = solidJs.createSignal(0);
/** 滚动条元素的长度 */
const scrollLength = _scrollLength;

/** 滚动条滑块长度 */
const sliderHeight = createRootMemo(() => store.option.scrollMode ? rootSize().height / contentHeight() : 1 / store.pageList.length);

/** 滚动条滑块高度 */
const sliderTop = createRootMemo(() => store.option.scrollMode ? scrollTop() / contentHeight() : 1 / store.pageList.length * store.activePageIndex);

/** 滚动条滑块的中心点高度 */
const sliderMidpoint = createRootMemo(() => scrollLength() * (sliderTop() + sliderHeight() / 2));

/** 滚动条位置 */
const scrollPosition = createRootMemo(() => {
  if (store.option.scrollbar.position === 'auto') {
    if (store.isMobile) return 'top';
    return store.flag.autoLong ? 'bottom' : 'right';
  }
  return store.option.scrollbar.position;
});

/** 判断点击位置在滚动条上的位置比率 */
const getClickTop = (x, y, e) => {
  switch (scrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'rtl' ? 1 - x / e.offsetWidth : x / e.offsetWidth;
    default:
      return y / e.offsetHeight;
  }
};

/** 计算在滚动条上的拖动距离 */
const getSliderDist = ([x, y], [ix, iy], e) => {
  switch (scrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'ltr' ? (x - ix) / e.offsetWidth : (1 - (x - ix)) / e.offsetWidth;
    default:
      return (y - iy) / e.offsetHeight;
  }
};

/** 开始拖拽时的 sliderTop 值 */
let startTop = 0;
const handlescrollbarSlider = ({
  type,
  xy,
  initial
}, e) => {
  const [x, y] = xy;

  // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
  if (type === 'up') return;
  if (!refs.mangaFlow) return;
  const scrollbarDom = e.target;

  /** 点击位置在滚动条上的位置比率 */
  const clickTop = getClickTop(x, y, e.target);
  if (store.option.scrollMode) {
    if (type === 'move') {
      scrollTo(clamp(0, startTop + getSliderDist(xy, initial, scrollbarDom), 1) * contentHeight());
    } else {
      // 确保滚动条的中心会在点击位置
      startTop = clickTop - sliderHeight() / 2;
      scrollTo(startTop * contentHeight(), true);
    }
  } else {
    let newPageIndex = Math.floor(clickTop * store.pageList.length);
    // 处理超出范围的情况
    if (newPageIndex < 0) newPageIndex = 0;else if (newPageIndex >= store.pageList.length) newPageIndex = store.pageList.length - 1;
    if (newPageIndex !== store.activePageIndex) _setState('activePageIndex', newPageIndex);
  }
};
solidJs.createRoot(() => {
  // 更新 scrollLength
  createEffectOn([scrollPosition, rootSize], () => {
    if (!refs.scrollbar) return;
    // 部分情况下，在窗口大小改变后滚动条大小不会立刻跟着修改，需要等待一帧渲染
    // 比如打开后台标签页后等一会再切换过去
    requestAnimationFrame(() => setScrollLength(Math.max(refs.scrollbar.clientWidth, refs.scrollbar.clientHeight)));
  });
});

/** 摩擦系数 */
const FRICTION_COEFF = 0.96;
let lastTop = 0;
let dy = 0;
let animationId = null;
let lastTime = 0;

/** 逐帧计算速率 */
const calcVelocity = () => {
  const nowTop = scrollTop();
  dy = nowTop - lastTop;
  lastTop = nowTop;
  animationId = requestAnimationFrame(calcVelocity);
};

/** 逐帧计算惯性滑动 */
const handleSlide = timestamp => {
  // 当速率足够小时停止计算动画
  if (approx(dy, 0, 1)) {
    animationId = null;
    return;
  }
  // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
  if (timestamp - lastTime > 16) {
    dy *= FRICTION_COEFF;
    lastTime = timestamp;
  }
  scrollTo(scrollTop() + dy);
  animationId = requestAnimationFrame(handleSlide);
};
let initTop = 0;
const handleScrollModeDrag = ({
  type,
  xy: [, y],
  initial: [, iy]
}, e) => {
  if (e.pointerType !== 'mouse') return;
  switch (type) {
    case 'down':
      {
        if (animationId) cancelAnimationFrame(animationId);
        initTop = refs.mangaBox.scrollTop;
        requestAnimationFrame(calcVelocity);
        return;
      }
    case 'move':
      {
        scrollTo(initTop + iy - y);
        return;
      }
    case 'up':
      {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(handleSlide);
      }
  }
};

var _tmpl$$D = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$b = /*#__PURE__*/web.template(\`<picture><img draggable=false>\`);
/** 图片加载完毕的回调 */
const handleImgLoaded = (i, e) => {
  if (!e.getAttribute('src')) return;
  setState(state => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.loadType === 'error' && e.src !== img.src) return;
    if (img.width !== e.naturalWidth || img.height !== e.naturalHeight) updateImgSize(i, e.naturalWidth, e.naturalHeight);
    img.loadType = 'loaded';
    updateImgLoadType(state);
    state.prop.Loading?.(state.imgList, img);
  });
};
const errorNumMap = new Map();

/** 图片加载出错的回调 */
const handleImgError = (i, e) => {
  if (!e.getAttribute('src')) return;
  setState(state => {
    const img = state.imgList[i];
    if (!img) return;
    const errorNum = errorNumMap.get(img.src) ?? 0;
    // 首次失败自动重试一次
    img.loadType = errorNum === 0 ? 'loading' : 'error';
    errorNumMap.set(img.src, errorNum + 1);
    updateImgLoadType(state);
    if (e) log.error(t('alert.img_load_failed'), e);
    state.prop.Loading?.(state.imgList, img);
  });
};

/** 漫画图片 */
const ComicImg = img => {
  let ref;
  solidJs.onMount(() => store.observer?.observe(ref));
  solidJs.onCleanup(() => {
    store.observer?.unobserve(ref);
    showImgList.delete(ref);
  });
  const show = solidJs.createMemo(() => store.gridMode || inRange(renderImgRange().start, img.index, renderImgRange().end));
  const src = solidJs.createMemo(() => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    return img.src;
  });
  const size = solidJs.createMemo(() => img?.width ? img : placeholderSize());
  const style = createMemoMap({
    'grid-area': () => \`_\${img.index}\`,
    '--width': () => \`\${size().width}px\`,
    'aspect-ratio': () => \`\${size().width} / \${size().height}\`,
    'box-shadow': () => {
      if (!store.gridMode || !activePage().includes(img.index)) return undefined;
      const page = store.pageList[imgPageMap()[img.index]].filter(i => i !== -1);
      const showState = page.length === 1 ? 2 : imgShowState()[img.index];
      if (showState === 2) return '0 0 1em 0.5em var(--text-secondary)';
      return \`\${showState ? -1 : 1}em 0 1em -0.5em var(--text-secondary)\`;
    }
  });
  solidJs.createEffect(() => {
    if (!src() || img.loadType !== 'loaded') return;
    // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
    // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
    ref.decode();
  });
  return (() => {
    var _el$ = _tmpl$2$b(),
      _el$2 = _el$.firstChild;
    _el$2.addEventListener("error", e => handleImgError(img.index, e.currentTarget));
    _el$2.addEventListener("load", e => handleImgLoaded(img.index, e.currentTarget));
    var _ref$ = ref;
    typeof _ref$ === "function" ? web.use(_ref$, _el$2) : ref = _el$2;
    web.insert(_el$, web.createComponent(solidJs.Show, {
      get when() {
        return store.gridMode;
      },
      get children() {
        var _el$3 = _tmpl$$D();
        web.insert(_el$3, (() => {
          var _c$ = web.memo(() => !!store.gridMode);
          return () => _c$() ? getImgTip(img.index) : '';
        })());
        web.effect(() => web.className(_el$3, modules_c21c94f2$1.gridModeTip));
        return _el$3;
      }
    }), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.img,
        _v$2 = style(),
        _v$3 = show() ? imgShowState()[img.index] ?? '' : undefined,
        _v$4 = img?.type || undefined,
        _v$5 = img?.loadType === 'loaded' ? undefined : img?.loadType,
        _v$6 = src(),
        _v$7 = \`\${img.index}\`;
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _p$.t = web.style(_el$, _v$2, _p$.t);
      _v$3 !== _p$.a && web.setAttribute(_el$, "data-show", _p$.a = _v$3);
      _v$4 !== _p$.o && web.setAttribute(_el$, "data-type", _p$.o = _v$4);
      _v$5 !== _p$.i && web.setAttribute(_el$, "data-load-type", _p$.i = _v$5);
      _v$6 !== _p$.n && web.setAttribute(_el$2, "src", _p$.n = _v$6);
      _v$7 !== _p$.s && web.setAttribute(_el$2, "alt", _p$.s = _v$7);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined,
      s: undefined
    });
    return _el$;
  })();
};

var _tmpl$$C = /*#__PURE__*/web.template(\`<h1>NULL\`);
const EmptyTip = () => {
  const [show, setShow] = solidJs.createSignal(false);
  solidJs.onMount(() => {
    let timeoutId = window.setTimeout(() => {
      setShow(true);
      timeoutId = 0;
    }, 2000);
    solidJs.onCleanup(() => timeoutId && clearTimeout(timeoutId));
  });
  return web.createComponent(solidJs.Show, {
    get when() {
      return show();
    },
    get children() {
      return _tmpl$$C();
    }
  });
};

/** 在鼠标静止一段时间后自动隐藏 */
const useHiddenMouse = () => {
  const [hiddenMouse, setHiddenMouse] = solidJs.createSignal(true);
  const hidden = debounce(() => setHiddenMouse(true), 1000);
  return {
    hiddenMouse,
    /** 鼠标移动 */
    onMouseMove: () => {
      setHiddenMouse(false);
      hidden();
    }
  };
};

const createPointerState = (e, type = 'down') => {
  const xy = [e.clientX, e.clientY];
  return {
    id: e.pointerId,
    type,
    xy,
    initial: xy,
    last: xy,
    startTime: performance.now()
  };
};
const useDrag = ({
  ref,
  handleDrag,
  easyMode,
  handleClick,
  touches = new Map()
}) => {
  solidJs.onMount(() => {
    const controller = new AbortController();
    const options = {
      capture: false,
      passive: true,
      signal: controller.signal
    };
    const handleDown = e => {
      e.stopPropagation();
      ref.setPointerCapture(e.pointerId);
      if (!easyMode?.() && e.buttons !== 1) return;
      const state = createPointerState(e);
      touches.set(e.pointerId, state);
      handleDrag(state, e);
    };
    const handleMove = e => {
      e.stopPropagation();
      e.preventDefault();
      if (!easyMode?.() && e.buttons !== 1) return;
      const state = touches.get(e.pointerId);
      if (!state) return;
      state.type = 'move';
      state.xy = [e.clientX, e.clientY];
      handleDrag(state, e);
      state.last = state.xy;
    };
    const handleUp = e => {
      e.stopPropagation();
      ref.releasePointerCapture(e.pointerId);
      const state = touches.get(e.pointerId);
      if (!state) return;
      touches.delete(e.pointerId);
      state.type = 'up';
      state.xy = [e.clientX, e.clientY];

      // 判断单击
      if (handleClick && touches.size === 0 && approx(state.xy[0] - state.initial[0], 0, 5) && approx(state.xy[1] - state.initial[1], 0, 5) && performance.now() - state.startTime < 200) handleClick(e);
      handleDrag(state, e);
      focus();
    };
    ref.addEventListener('pointerdown', handleDown, options);
    ref.addEventListener('pointermove', handleMove, {
      ...options,
      passive: false
    });
    ref.addEventListener('pointerup', handleUp, options);
    ref.addEventListener('pointercancel', e => {
      e.stopPropagation();
      const state = touches.get(e.pointerId);
      if (!state) return;
      state.type = 'cancel';
      handleDrag(state, e);
      touches.clear();
      focus();
    }, {
      capture: false,
      passive: true,
      signal: controller.signal
    });
    if (easyMode) {
      ref.addEventListener('pointerover', handleDown, options);
      ref.addEventListener('pointerout', handleUp, options);
    }
    solidJs.onCleanup(() => controller.abort());
  });
};

var _tmpl$$B = /*#__PURE__*/web.template(\`<span>\`),
  _tmpl$2$a = /*#__PURE__*/web.template(\`<div tabindex=-1><div>\`);
const ComicImgFlow = () => {
  const {
    hiddenMouse,
    onMouseMove
  } = useHiddenMouse();
  const handleDrag = (state, e) => {
    if (store.gridMode) return;
    if (touches.size > 1) return handlePinchZoom(state);
    if (store.zoom.scale !== 100) return handleZoomDrag(state);
    if (store.option.scrollMode) return handleScrollModeDrag(state, e);
    return handleMangaFlowDrag(state);
  };
  solidJs.onMount(() => {
    useDrag({
      ref: refs.mangaBox,
      handleDrag,
      handleClick,
      touches
    });
    bindScrollTop(refs.mangaBox);
    initIntersectionObserver(refs.mangaBox);
  });
  const handleTransitionEnd = () => {
    if (store.isDragMode) return;
    setState(state => {
      if (store.zoom.scale === 100) resetPage(state, true);else state.page.anima = '';
    });
  };

  /** 卷轴模式下当前显示页之前未渲染页的总高度 */
  const scrollModeFill = solidJs.createMemo(() => imgTopList()[renderRange.start()] ?? 0);

  /** 在当前页之前有图片被加载出来，导致内容高度发生变化后，重新滚动页面，确保当前显示位置不变 */
  createEffectOn([scrollModeFill, imgTopList], ([height, topList], prev) => {
    if (!prev || !height) return;
    const [prevHeight, prevTopList] = prev;
    if (prevTopList === topList || prevHeight === height) return;
    scrollTo(scrollTop() + height - prevHeight);
    // 目前还是会有轻微偏移，但考虑到大部分情况下都是顺序阅读，本身出现概率就低，就不继续排查优化了
  });
  const pageToText = page => \`\${(page.length !== 1 ? page : [page[0], page[0]]).map(i => i === -1 ? '.' : \`_\${i}\`).join(' ')}\`;
  const gridAreas = solidJs.createMemo(() => {
    if (store.gridMode) {
      const columnNum = isOnePageMode() ? 5 : 3;
      const areaList = [[]];
      store.pageList.forEach(page => {
        if (areaList.at(-1).length === columnNum) areaList.push([]);
        areaList.at(-1).push(pageToText(page));
      });
      while (areaList.at(-1).length !== columnNum) areaList.at(-1).push('. .');
      return areaList.map(line => \`"\${line.join(' ')}"\`).join('\\n');
    }
    if (store.option.scrollMode) return '';
    return store.page.vertical ? store.pageList.slice(renderRange.start(), renderRange.end() + 1).map(page => \`"\${pageToText(page)}"\`).join('\\n') : \`"\${store.pageList.slice(renderRange.start(), renderRange.end() + 1).map(pageToText).join(' ')}"\`;
  });
  const style = createMemoMap({
    '--scale': () => store.zoom.scale / 100,
    '--zoom-x': () => \`\${store.zoom.offset.x}px\`,
    '--zoom-y': () => \`\${store.zoom.offset.y}px\`,
    '--page-x': () => {
      if (store.option.scrollMode) return '0px';
      const x = \`\${store.page.offset.x.pct * rootSize().width + store.page.offset.x.px}px\`;
      return store.option.dir === 'rtl' ? x : \`calc(\${x} * -1)\`;
    },
    '--page-y': () => \`\${store.page.offset.y.pct * rootSize().height + store.page.offset.y.px}px\`,
    'touch-action': () => {
      if (store.gridMode) return 'auto';
      if (store.zoom.scale !== 100) {
        if (!store.option.scrollMode) return 'none';
        if (store.zoom.offset.y === 0) return 'pan-up';
        if (store.zoom.offset.y === bound.y()) return 'pan-down';
      }
      if (store.option.scrollMode) return 'pan-y';
    },
    height: () => !store.gridMode && store.option.scrollMode ? \`\${contentHeight()}px\` : undefined,
    'grid-template-areas': gridAreas,
    'grid-template-columns': () => {
      if (!store.imgList.length) return undefined;
      if (store.gridMode) return \`repeat(\${isOnePageMode() ? 10 : 6}, 1fr)\`;
      if (store.page.vertical) return '50% 50%';
      return \`repeat(\${gridAreas().split(' ').length}, 50%)\`;
    }
  });
  return (() => {
    var _el$ = _tmpl$2$a(),
      _el$2 = _el$.firstChild;
    var _ref$ = bindRef('mangaBox');
    typeof _ref$ === "function" && web.use(_ref$, _el$);
    _el$2.addEventListener("transitionend", handleTransitionEnd);
    var _ref$2 = bindRef('mangaFlow');
    typeof _ref$2 === "function" && web.use(_ref$2, _el$2);
    _el$2.addEventListener("mousemove", onMouseMove);
    web.insert(_el$2, web.createComponent(solidJs.Show, {
      get when() {
        return store.option.scrollMode;
      },
      get children() {
        var _el$3 = _tmpl$$B();
        _el$3.style.setProperty("flex-shrink", "0");
        web.effect(() => \`\${scrollModeFill()}px\` != null ? _el$3.style.setProperty("height", \`\${scrollModeFill()}px\`) : _el$3.style.removeProperty("height"));
        return _el$3;
      }
    }), null);
    web.insert(_el$2, web.createComponent(solidJs.For, {
      get each() {
        return store.imgList;
      },
      get fallback() {
        return web.createComponent(EmptyTip, {});
      },
      children: (img, i) => web.createComponent(ComicImg, web.mergeProps({
        get index() {
          return i();
        }
      }, img))
    }), null);
    web.effect(_p$ => {
      var _v$ = \`\${modules_c21c94f2$1.mangaBox} \${modules_c21c94f2$1.beautifyScrollbar}\`,
        _v$2 = modules_c21c94f2$1.mangaFlow,
        _v$3 = store.option.dir,
        _v$4 = \`\${modules_c21c94f2$1.mangaFlow} \${modules_c21c94f2$1.beautifyScrollbar}\`,
        _v$5 = boolDataVal(store.option.disableZoom || !store.gridMode && store.option.scrollMode),
        _v$6 = boolDataVal(store.zoom.scale !== 100),
        _v$7 = boolDataVal(store.page.vertical),
        _v$8 = store.page.anima,
        _v$9 = !store.gridMode && hiddenMouse(),
        _v$10 = boolDataVal(store.option.scrollModeFitToWidth),
        _v$11 = style();
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && web.setAttribute(_el$2, "id", _p$.t = _v$2);
      _v$3 !== _p$.a && web.setAttribute(_el$2, "dir", _p$.a = _v$3);
      _v$4 !== _p$.o && web.className(_el$2, _p$.o = _v$4);
      _v$5 !== _p$.i && web.setAttribute(_el$2, "data-disable-zoom", _p$.i = _v$5);
      _v$6 !== _p$.n && web.setAttribute(_el$2, "data-scale-mode", _p$.n = _v$6);
      _v$7 !== _p$.s && web.setAttribute(_el$2, "data-vertical", _p$.s = _v$7);
      _v$8 !== _p$.h && web.setAttribute(_el$2, "data-animation", _p$.h = _v$8);
      _v$9 !== _p$.r && web.setAttribute(_el$2, "data-hidden-mouse", _p$.r = _v$9);
      _v$10 !== _p$.d && web.setAttribute(_el$2, "data-fit-width", _p$.d = _v$10);
      _p$.l = web.style(_el$2, _v$11, _p$.l);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined,
      s: undefined,
      h: undefined,
      r: undefined,
      d: undefined,
      l: undefined
    });
    return _el$;
  })();
};

var _tmpl$$A = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-6 14c-.55 0-1-.45-1-1V9h-1c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1">\`);
const MdLooksOne = ((props = {}) => (() => {
  var _el$ = _tmpl$$A();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$z = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-4 8c0 1.1-.9 2-2 2h-2v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2h2V9h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c1.1 0 2 .9 2 2z">\`);
const MdLooksTwo = ((props = {}) => (() => {
  var _el$ = _tmpl$$z();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$y = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M3 21h17c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1M20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1M2 4v1c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1">\`);
const MdViewDay = ((props = {}) => (() => {
  var _el$ = _tmpl$$y();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$x = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1m17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-2 9h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3V6c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1">\`);
const MdQueue = ((props = {}) => (() => {
  var _el$ = _tmpl$$x();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$w = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14">\`);
const MdSearch = ((props = {}) => (() => {
  var _el$ = _tmpl$$w();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$v = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M12.65 15.67c.14-.36.05-.77-.23-1.05l-2.09-2.06.03-.03A17.5 17.5 0 0 0 14.07 6h1.94c.54 0 .99-.45.99-.99v-.02c0-.54-.45-.99-.99-.99H10V3c0-.55-.45-1-1-1s-1 .45-1 1v1H1.99c-.54 0-.99.45-.99.99 0 .55.45.99.99.99h10.18A15.7 15.7 0 0 1 9 11.35c-.81-.89-1.49-1.86-2.06-2.88A.89.89 0 0 0 6.16 8c-.69 0-1.13.75-.79 1.35.63 1.13 1.4 2.21 2.3 3.21L3.3 16.87a.99.99 0 0 0 0 1.42c.39.39 1.02.39 1.42 0L9 14l2.02 2.02c.51.51 1.38.32 1.63-.35M17.5 10c-.6 0-1.14.37-1.35.94l-3.67 9.8c-.24.61.22 1.26.87 1.26.39 0 .74-.24.88-.61l.89-2.39h4.75l.9 2.39c.14.36.49.61.88.61.65 0 1.11-.65.88-1.26l-3.67-9.8c-.22-.57-.76-.94-1.36-.94m-1.62 7 1.62-4.33L19.12 17z">\`);
const MdTranslate = ((props = {}) => (() => {
  var _el$ = _tmpl$$v();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$u = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M22 6c0-.55-.45-1-1-1h-2V3c0-.55-.45-1-1-1s-1 .45-1 1v2h-4V3c0-.55-.45-1-1-1s-1 .45-1 1v2H7V3c0-.55-.45-1-1-1s-1 .45-1 1v2H3c-.55 0-1 .45-1 1s.45 1 1 1h2v4H3c-.55 0-1 .45-1 1s.45 1 1 1h2v4H3c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h4v2c0 .55.45 1 1 1s1-.45 1-1v-2h4v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2v-4h2c.55 0 1-.45 1-1s-.45-1-1-1h-2V7h2c.55 0 1-.45 1-1M7 7h4v4H7zm0 10v-4h4v4zm10 0h-4v-4h4zm0-6h-4V7h4z">\`);
const MdGrid = ((props = {}) => (() => {
  var _el$ = _tmpl$$u();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$t = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M9 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1H9.17C7.08 2 5.22 3.53 5.02 5.61A4 4 0 0 0 9 10m11.65 7.65-2.79-2.79a.501.501 0 0 0-.86.35V17H6c-.55 0-1 .45-1 1s.45 1 1 1h11v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7">\`);
const MdOutlineFormatTextdirectionLToR = ((props = {}) => (() => {
  var _el$ = _tmpl$$t();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$s = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M10 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1h-6.83C8.08 2 6.22 3.53 6.02 5.61A4 4 0 0 0 10 10m-2 7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1s-.45-1-1-1z">\`);
const MdOutlineFormatTextdirectionRToL = ((props = {}) => (() => {
  var _el$ = _tmpl$$s();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$r = /*#__PURE__*/web.template(\`<div><div> <!> \`);
/** 设置菜单项 */
const SettingsItem = props => (() => {
  var _el$ = _tmpl$$r(),
    _el$2 = _el$.firstChild,
    _el$3 = _el$2.firstChild,
    _el$5 = _el$3.nextSibling;
    _el$5.nextSibling;
  web.insert(_el$2, () => props.name, _el$5);
  web.insert(_el$, () => props.children, null);
  web.effect(_p$ => {
    var _v$ = props.class ? \`\${modules_c21c94f2$1.SettingsItem} \${props.class}\` : modules_c21c94f2$1.SettingsItem,
      _v$2 = {
        [props.class ?? '']: !!props.class?.length,
        ...props.classList
      },
      _v$3 = props.style,
      _v$4 = modules_c21c94f2$1.SettingsItemName;
    _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
    _p$.t = web.classList(_el$, _v$2, _p$.t);
    _p$.a = web.style(_el$, _v$3, _p$.a);
    _v$4 !== _p$.o && web.className(_el$2, _p$.o = _v$4);
    return _p$;
  }, {
    e: undefined,
    t: undefined,
    a: undefined,
    o: undefined
  });
  return _el$;
})();

var _tmpl$$q = /*#__PURE__*/web.template(\`<button type=button><div>\`);
/** 开关式菜单项 */
const SettingsItemSwitch = props => {
  const handleClick = () => props.onChange(!props.value);
  return web.createComponent(SettingsItem, {
    get name() {
      return props.name;
    },
    get ["class"]() {
      return props.class;
    },
    get classList() {
      return props.classList;
    },
    get children() {
      var _el$ = _tmpl$$q(),
        _el$2 = _el$.firstChild;
      _el$.addEventListener("click", handleClick);
      web.effect(_p$ => {
        var _v$ = modules_c21c94f2$1.SettingsItemSwitch,
          _v$2 = props.value,
          _v$3 = modules_c21c94f2$1.SettingsItemSwitchRound;
        _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
        _v$2 !== _p$.t && web.setAttribute(_el$, "data-checked", _p$.t = _v$2);
        _v$3 !== _p$.a && web.className(_el$2, _p$.a = _v$3);
        return _p$;
      }, {
        e: undefined,
        t: undefined,
        a: undefined
      });
      return _el$;
    }
  });
};

var _tmpl$$p = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71z">\`);
const MdRefresh = ((props = {}) => (() => {
  var _el$ = _tmpl$$p();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$o = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1">\`);
const MdAdd = ((props = {}) => (() => {
  var _el$ = _tmpl$$o();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$n = /*#__PURE__*/web.template(\`<div tabindex=0>\`),
  _tmpl$2$9 = /*#__PURE__*/web.template(\`<div><div><p></p><span></span><div></div><div>\`);
const KeyItem = props => {
  const code = () => store.hotkeys[props.operateName][props.i];
  const del = () => delHotkeys(code());
  const handleKeyDown = e => {
    e.stopPropagation();
    e.preventDefault();
    switch (e.key) {
      case 'Tab':
      case 'Enter':
      case 'Escape':
        focus();
        return;
      case 'Backspace':
        setHotkeys(props.operateName, props.i, '');
        return;
    }
    const newCode = getKeyboardCode(e);
    if (!Reflect.has(hotkeysMap(), newCode)) setHotkeys(props.operateName, props.i, newCode);
  };
  return (() => {
    var _el$ = _tmpl$$n();
    _el$.addEventListener("blur", () => code() || del());
    web.use(ref => code() || setTimeout(() => ref.focus()), _el$);
    _el$.addEventListener("keydown", handleKeyDown);
    web.insert(_el$, () => keyboardCodeToText(code()), null);
    web.insert(_el$, web.createComponent(MdClose, {
      "on:click": del
    }), null);
    web.effect(() => web.className(_el$, modules_c21c94f2$1.hotkeysItem));
    return _el$;
  })();
};
const SettingHotkeys = () => web.createComponent(solidJs.For, {
  get each() {
    return Object.entries(store.hotkeys);
  },
  children: ([name, keys]) => (() => {
    var _el$2 = _tmpl$2$9(),
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.firstChild,
      _el$5 = _el$4.nextSibling,
      _el$6 = _el$5.nextSibling,
      _el$7 = _el$6.nextSibling;
    web.insert(_el$4, () => t(\`hotkeys.\${name}\`) || name);
    _el$5.style.setProperty("flex-grow", "1");
    _el$6.addEventListener("click", () => setHotkeys(name, store.hotkeys[name].length, ''));
    web.insert(_el$6, web.createComponent(MdAdd, {}));
    _el$7.addEventListener("click", () => {
      const newKeys = defaultHotkeys[name] ?? [];
      newKeys.forEach(delHotkeys);
      setHotkeys(name, newKeys);
    });
    web.insert(_el$7, web.createComponent(MdRefresh, {}));
    web.insert(_el$2, web.createComponent(solidJs.Index, {
      each: keys,
      children: (_, i) => web.createComponent(KeyItem, {
        operateName: name,
        i: i
      })
    }), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.hotkeys,
        _v$2 = modules_c21c94f2$1.hotkeysHeader,
        _v$3 = t('setting.hotkeys.add'),
        _v$4 = t('setting.hotkeys.restore');
      _v$ !== _p$.e && web.className(_el$2, _p$.e = _v$);
      _v$2 !== _p$.t && web.className(_el$3, _p$.t = _v$2);
      _v$3 !== _p$.a && web.setAttribute(_el$6, "title", _p$.a = _v$3);
      _v$4 !== _p$.o && web.setAttribute(_el$7, "title", _p$.o = _v$4);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined
    });
    return _el$2;
  })()
});

var _tmpl$$m = /*#__PURE__*/web.template(\`<select>\`),
  _tmpl$2$8 = /*#__PURE__*/web.template(\`<option>\`);
/** 选择器式菜单项 */
const SettingsItemSelect = props => {
  let ref;
  solidJs.createEffect(() => {
    ref.value = props.options?.some(([val]) => val === props.value) ? props.value : '';
  });
  return web.createComponent(SettingsItem, {
    get name() {
      return props.name;
    },
    get ["class"]() {
      return props.class;
    },
    get classList() {
      return props.classList;
    },
    get children() {
      var _el$ = _tmpl$$m();
      _el$.addEventListener("change", e => props.onChange(e.target.value));
      var _ref$ = ref;
      typeof _ref$ === "function" ? web.use(_ref$, _el$) : ref = _el$;
      _el$.addEventListener("click", () => props.onClick?.());
      web.insert(_el$, web.createComponent(solidJs.For, {
        get each() {
          return props.options;
        },
        children: ([val, label]) => (() => {
          var _el$2 = _tmpl$2$8();
          _el$2.value = val;
          web.insert(_el$2, label ?? val);
          return _el$2;
        })()
      }));
      web.effect(() => web.className(_el$, modules_c21c94f2$1.SettingsItemSelect));
      return _el$;
    }
  });
};

var _tmpl$$l = /*#__PURE__*/web.template(\`<div><div>\`);

/** 带有动画过渡的切换显示设置项 */
const SettingsShowItem = props => (() => {
  var _el$ = _tmpl$$l(),
    _el$2 = _el$.firstChild;
  web.insert(_el$2, () => props.children);
  web.effect(_p$ => {
    var _v$ = modules_c21c94f2$1.SettingsShowItem,
      _v$2 = props.when ? '1fr' : '0fr',
      _v$3 = modules_c21c94f2$1.SettingsShowItemBody;
    _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
    _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$.style.setProperty("grid-template-rows", _v$2) : _el$.style.removeProperty("grid-template-rows"));
    _v$3 !== _p$.a && web.className(_el$2, _p$.a = _v$3);
    return _p$;
  }, {
    e: undefined,
    t: undefined,
    a: undefined
  });
  return _el$;
})();

var _tmpl$$k = /*#__PURE__*/web.template(\`<blockquote>\`),
  _tmpl$2$7 = /*#__PURE__*/web.template(\`<input type=url>\`);
const SettingTranslation = () => {
  const isTranslationEnable = solidJs.createMemo(() => store.option.translation.server !== 'disable' && translatorOptions().length > 0);

  /** 是否正在翻译全部图片 */
  const isTranslationAll = solidJs.createMemo(() => isTranslationEnable() && store.imgList.every(img => img.translationType === 'show' || img.translationType === 'wait'));

  /** 是否正在翻译当前页以后的全部图片 */
  const isTranslationAfterCurrent = solidJs.createMemo(() => isTranslationEnable() && store.imgList.slice(activeImgIndex()).every(img => img.translationType === 'show' || img.translationType === 'wait'));
  return [web.createComponent(SettingsItemSelect, {
    get name() {
      return t('setting.translation.server');
    },
    get options() {
      return [['disable', t('other.disable')], ['selfhosted', t('setting.translation.server_selfhosted')], ['cotrans']];
    },
    get value() {
      return store.option.translation.server;
    },
    get onChange() {
      return createStateSetFn('translation.server');
    }
  }), web.createComponent(SettingsShowItem, {
    get when() {
      return store.option.translation.server === 'cotrans';
    },
    get children() {
      var _el$ = _tmpl$$k();
      web.effect(() => _el$.innerHTML = t('setting.translation.cotrans_tip'));
      return _el$;
    }
  }), web.createComponent(SettingsShowItem, {
    get when() {
      return store.option.translation.server !== 'disable';
    },
    get children() {
      return [web.createComponent(SettingsItemSelect, {
        get name() {
          return t('setting.translation.options.detection_resolution');
        },
        options: [['S', '1024px'], ['M', '1536px'], ['L', '2048px'], ['X', '2560px']],
        get value() {
          return store.option.translation.options.size;
        },
        get onChange() {
          return createStateSetFn('translation.options.size');
        }
      }), web.createComponent(SettingsItemSelect, {
        get name() {
          return t('setting.translation.options.text_detector');
        },
        options: [['default'], ['ctd', 'Comic Text Detector']],
        get value() {
          return store.option.translation.options.detector;
        },
        get onChange() {
          return createStateSetFn('translation.options.detector');
        }
      }), web.createComponent(SettingsItemSelect, {
        get name() {
          return t('setting.translation.options.translator');
        },
        get options() {
          return translatorOptions();
        },
        get value() {
          return store.option.translation.options.translator;
        },
        get onChange() {
          return createStateSetFn('translation.options.translator');
        },
        onClick: () => {
          if (store.option.translation.server !== 'selfhosted') return;
          // 通过手动触发变更，以便在点击时再获取一下翻译列表
          setState(state => {
            state.option.translation.server = 'disable';
            state.option.translation.server = 'selfhosted';
          });
        }
      }), web.createComponent(SettingsItemSelect, {
        get name() {
          return t('setting.translation.options.direction');
        },
        get options() {
          return [['auto', t('setting.translation.options.direction_auto')], ['h', t('setting.translation.options.direction_horizontal')], ['v', t('setting.translation.options.direction_vertical')]];
        },
        get value() {
          return store.option.translation.options.direction;
        },
        get onChange() {
          return createStateSetFn('translation.options.direction');
        }
      }), web.createComponent(SettingsItemSelect, {
        get name() {
          return t('setting.translation.options.target_language');
        },
        options: [['CHS', '简体中文'], ['CHT', '繁體中文'], ['JPN', '日本語'], ['ENG', 'English'], ['KOR', '한국어'], ['VIN', 'Tiếng Việt'], ['CSY', 'čeština'], ['NLD', 'Nederlands'], ['FRA', 'français'], ['DEU', 'Deutsch'], ['HUN', 'magyar nyelv'], ['ITA', 'italiano'], ['PLK', 'polski'], ['PTB', 'português'], ['ROM', 'limba română'], ['RUS', 'русский язык'], ['ESP', 'español'], ['TRK', 'Türk dili']],
        get value() {
          return store.option.translation.options.targetLanguage;
        },
        get onChange() {
          return createStateSetFn('translation.options.targetLanguage');
        }
      }), web.createComponent(SettingsItemSwitch, {
        get name() {
          return t('setting.translation.options.forceRetry');
        },
        get value() {
          return store.option.translation.forceRetry;
        },
        get onChange() {
          return createStateSetFn('translation.forceRetry');
        }
      }), web.createComponent(solidJs.Show, {
        get when() {
          return store.option.translation.server === 'selfhosted';
        },
        get children() {
          return [web.createComponent(SettingsItemSwitch, {
            get name() {
              return t('setting.translation.translate_all_img');
            },
            get value() {
              return isTranslationAll();
            },
            onChange: () => {
              setImgTranslationEnbale(store.imgList.map((_, i) => i), !isTranslationAll());
            }
          }), web.createComponent(SettingsItemSwitch, {
            get name() {
              return t('setting.translation.translate_after_current');
            },
            get value() {
              return isTranslationAfterCurrent();
            },
            onChange: () => {
              setImgTranslationEnbale(store.pageList.slice(store.activePageIndex).flat(), !isTranslationAfterCurrent());
            }
          }), web.createComponent(SettingsItemSwitch, {
            get name() {
              return t('setting.translation.options.localUrl');
            },
            get value() {
              return store.option.translation.localUrl !== undefined;
            },
            onChange: val => {
              setOption(draftOption => {
                draftOption.translation.localUrl = val ? '' : undefined;
              });
            }
          }), web.createComponent(solidJs.Show, {
            get when() {
              return store.option.translation.localUrl !== undefined;
            },
            get children() {
              var _el$2 = _tmpl$2$7();
              _el$2.addEventListener("change", e => {
                setOption(draftOption => {
                  // 删掉末尾的斜杠
                  const url = e.target.value.replace(/\\/$/, '');
                  draftOption.translation.localUrl = url;
                });
              });
              web.effect(() => web.className(_el$2, modules_c21c94f2$1.SettingsItem));
              web.effect(() => _el$2.value = store.option.translation.localUrl);
              return _el$2;
            }
          })];
        }
      }), web.createComponent(SettingsItemSwitch, {
        get name() {
          return t('setting.translation.options.onlyDownloadTranslated');
        },
        get value() {
          return store.option.translation.onlyDownloadTranslated;
        },
        get onChange() {
          return createStateSetFn('translation.onlyDownloadTranslated');
        }
      })];
    }
  })];
};

var _tmpl$$j = /*#__PURE__*/web.template(\`<div><span contenteditable data-only-number></span><span>\`);
/** 数值输入框菜单项 */
const SettingsItemNumber = props => {
  const handleInput = e => {
    if (e.currentTarget.textContent.length > props.maxLength) e.currentTarget.blur();
  };
  const handleKeyDown = e => {
    switch (e.key) {
      case 'ArrowUp':
        return props.onChange(+e.target.textContent + (props.step ?? 1));
      case 'ArrowDown':
        return props.onChange(+e.target.textContent - (props.step ?? 1));
    }
  };
  return web.createComponent(SettingsItem, {
    get name() {
      return props.name;
    },
    get ["class"]() {
      return props.class;
    },
    get classList() {
      return props.classList;
    },
    get children() {
      var _el$ = _tmpl$$j(),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;
      _el$2.addEventListener("blur", e => {
        try {
          props.onChange(+e.currentTarget.textContent);
        } finally {
          // eslint-disable-next-line no-param-reassign
          e.currentTarget.textContent = \`\${props.value}\`;
        }
      });
      _el$2.addEventListener("input", handleInput);
      _el$2.addEventListener("keydown", handleKeyDown);
      web.insert(_el$2, () => props.value);
      _el$3.style.setProperty("margin-left", ".1em");
      web.insert(_el$3, () => props.suffix ?? '');
      web.effect(() => (props.suffix ? '.3em' : '.6em') != null ? _el$.style.setProperty("margin-right", props.suffix ? '.3em' : '.6em') : _el$.style.removeProperty("margin-right"));
      return _el$;
    }
  });
};

var _tmpl$$i = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$6 = /*#__PURE__*/web.template(\`<div role=button tabindex=-1>\`);

const areaArrayMap = {
  left_right: [['prev', 'menu', 'next'], ['PREV', 'MENU', 'NEXT'], ['prev', 'menu', 'next']],
  up_down: [['prev', 'PREV', 'prev'], ['menu', 'MENU', 'menu'], ['next', 'NEXT', 'next']],
  edge: [['next', 'menu', 'next'], ['NEXT', 'MENU', 'NEXT'], ['next', 'PREV', 'next']],
  l: [['PREV', 'prev', 'prev'], ['prev', 'MENU', 'next'], ['next', 'next', 'NEXT']]
};
const areaType = createRootMemo(() => Reflect.has(areaArrayMap, store.option.clickPageTurn.area) ? store.option.clickPageTurn.area : 'left_right');
const dir = createRootMemo(() => {
  if (!store.option.clickPageTurn.reverse) return store.option.dir;
  return store.option.dir === 'rtl' ? 'ltr' : 'rtl';
});
const TouchArea = () => (() => {
  var _el$ = _tmpl$$i();
  var _ref$ = bindRef('touchArea');
  typeof _ref$ === "function" && web.use(_ref$, _el$);
  web.insert(_el$, web.createComponent(solidJs.For, {
    get each() {
      return areaArrayMap[areaType()];
    },
    children: rows => web.createComponent(solidJs.For, {
      each: rows,
      children: area => (() => {
        var _el$2 = _tmpl$2$6();
        web.setAttribute(_el$2, "data-area", area);
        web.effect(() => web.className(_el$2, modules_c21c94f2$1.touchArea));
        return _el$2;
      })()
    })
  }));
  web.effect(_p$ => {
    var _v$ = modules_c21c94f2$1.touchAreaRoot,
      _v$2 = dir(),
      _v$3 = boolDataVal(store.show.touchArea),
      _v$4 = areaType(),
      _v$5 = boolDataVal(store.option.clickPageTurn.enabled && !store.option.scrollMode);
    _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
    _v$2 !== _p$.t && web.setAttribute(_el$, "dir", _p$.t = _v$2);
    _v$3 !== _p$.a && web.setAttribute(_el$, "data-show", _p$.a = _v$3);
    _v$4 !== _p$.o && web.setAttribute(_el$, "data-area", _p$.o = _v$4);
    _v$5 !== _p$.i && web.setAttribute(_el$, "data-turn-page", _p$.i = _v$5);
    return _p$;
  }, {
    e: undefined,
    t: undefined,
    a: undefined,
    o: undefined,
    i: undefined
  });
  return _el$;
})();

var _tmpl$$h = /*#__PURE__*/web.template(\`<button type=button>\`),
  _tmpl$2$5 = /*#__PURE__*/web.template(\`<input type=color>\`);
/** 默认菜单项 */
const defaultSettingList = () => [[t('setting.option.paragraph_dir'), () => web.createComponent(SettingsItem, {
  get name() {
    return web.memo(() => store.option.dir === 'rtl')() ? t('setting.option.dir_rtl') : t('setting.option.dir_ltr');
  },
  get children() {
    var _el$ = _tmpl$$h();
    _el$.addEventListener("click", switchDir);
    web.insert(_el$, (() => {
      var _c$ = web.memo(() => store.option.dir === 'rtl');
      return () => _c$() ? web.createComponent(MdOutlineFormatTextdirectionRToL, {}) : web.createComponent(MdOutlineFormatTextdirectionLToR, {});
    })());
    web.effect(() => web.className(_el$, modules_c21c94f2$1.SettingsItemIconButton));
    return _el$;
  }
})], [t('setting.option.paragraph_scrollbar'), () => [web.createComponent(SettingsItemSelect, {
  get name() {
    return t('setting.option.scrollbar_position');
  },
  get options() {
    return [['auto', t('setting.option.scrollbar_position_auto')], ['right', t('setting.option.scrollbar_position_right')], ['top', t('setting.option.scrollbar_position_top')], ['bottom', t('setting.option.scrollbar_position_bottom')], ['hidden', t('setting.option.scrollbar_position_hidden')]];
  },
  get value() {
    return store.option.scrollbar.position;
  },
  get onChange() {
    return createStateSetFn('scrollbar.position');
  }
}), web.createComponent(SettingsShowItem, {
  get when() {
    return store.option.scrollbar.position !== 'hidden';
  },
  get children() {
    return [web.createComponent(solidJs.Show, {
      get when() {
        return !store.isMobile;
      },
      get children() {
        return web.createComponent(SettingsItemSwitch, {
          get name() {
            return t('setting.option.scrollbar_auto_hidden');
          },
          get value() {
            return store.option.scrollbar.autoHidden;
          },
          get onChange() {
            return createStateSetFn('scrollbar.autoHidden');
          }
        });
      }
    }), web.createComponent(SettingsItemSwitch, {
      get name() {
        return t('setting.option.scrollbar_show_img_status');
      },
      get value() {
        return store.option.scrollbar.showImgStatus;
      },
      get onChange() {
        return createStateSetFn('scrollbar.showImgStatus');
      }
    }), web.createComponent(solidJs.Show, {
      get when() {
        return store.option.scrollMode;
      },
      get children() {
        return web.createComponent(SettingsItemSwitch, {
          get name() {
            return t('setting.option.scrollbar_easy_scroll');
          },
          get value() {
            return store.option.scrollbar.easyScroll;
          },
          get onChange() {
            return createStateSetFn('scrollbar.easyScroll');
          }
        });
      }
    })];
  }
})]], [t('setting.option.paragraph_operation'), () => [web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.jump_to_next_chapter');
  },
  get value() {
    return store.option.jumpToNext;
  },
  get onChange() {
    return createStateSetFn('jumpToNext');
  }
}), web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.show_clickable_area');
  },
  get value() {
    return store.show.touchArea;
  },
  onChange: () => _setState('show', 'touchArea', !store.show.touchArea)
}), web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.click_page_turn_enabled');
  },
  get value() {
    return store.option.clickPageTurn.enabled;
  },
  get onChange() {
    return createStateSetFn('clickPageTurn.enabled');
  }
}), web.createComponent(SettingsShowItem, {
  get when() {
    return store.option.clickPageTurn.enabled;
  },
  get children() {
    return [web.createComponent(SettingsItemSelect, {
      get name() {
        return t('setting.option.click_page_turn_area');
      },
      get options() {
        return Object.keys(areaArrayMap).map(key => [key, t(\`touch_area.type.\${key}\`)]);
      },
      get value() {
        return store.option.clickPageTurn.area;
      },
      get onChange() {
        return createStateSetFn('clickPageTurn.area');
      }
    }), web.createComponent(SettingsItemSwitch, {
      get name() {
        return t('setting.option.click_page_turn_swap_area');
      },
      get value() {
        return store.option.clickPageTurn.reverse;
      },
      get onChange() {
        return createStateSetFn('clickPageTurn.reverse');
      }
    })];
  }
})]], [t('setting.option.paragraph_display'), () => [web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.dark_mode');
  },
  get value() {
    return store.option.darkMode;
  },
  get onChange() {
    return createStateSetFn('darkMode');
  }
}), web.createComponent(solidJs.Show, {
  get when() {
    return !store.option.scrollMode;
  },
  get children() {
    return web.createComponent(SettingsItemSwitch, {
      get name() {
        return t('setting.option.disable_auto_enlarge');
      },
      get value() {
        return store.option.disableZoom;
      },
      get onChange() {
        return createStateSetFn('disableZoom');
      }
    });
  }
}), web.createComponent(solidJs.Show, {
  get when() {
    return store.option.scrollMode;
  },
  get children() {
    return [web.createComponent(SettingsItemNumber, {
      get name() {
        return t('setting.option.scroll_mode_img_scale');
      },
      maxLength: 3,
      suffix: "%",
      step: 5,
      onChange: val => {
        if (Number.isNaN(val)) return;
        zoomScrollModeImg(val / 100, true);
      },
      get value() {
        return Math.round(store.option.scrollModeImgScale * 100);
      }
    }), web.createComponent(SettingsItemNumber, {
      get name() {
        return t('setting.option.scroll_mode_img_spacing');
      },
      maxLength: 5,
      onChange: val => {
        if (Number.isNaN(val)) return;
        setOption(draftOption => {
          draftOption.scrollModeSpacing = clamp(0, val, Infinity);
        });
      },
      get value() {
        return Math.round(store.option.scrollModeSpacing);
      }
    }), web.createComponent(SettingsItemSwitch, {
      name: '卷轴图片适合宽度',
      get value() {
        return store.option.scrollModeFitToWidth;
      },
      onChange: switchFitToWidth
    })];
  }
})]], [t('setting.option.paragraph_hotkeys'), SettingHotkeys, true], [t('setting.option.paragraph_translation'), SettingTranslation, true], [t('setting.option.paragraph_other'), () => [web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.always_load_all_img');
  },
  get value() {
    return store.option.alwaysLoadAllImg;
  },
  onChange: val => {
    setOption(draftOption => {
      draftOption.alwaysLoadAllImg = val;
    });
    setState(updateImgLoadType);
  }
}), web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.first_page_fill');
  },
  get value() {
    return store.option.firstPageFill;
  },
  get onChange() {
    return createStateSetFn('firstPageFill');
  }
}), web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.show_comments');
  },
  get value() {
    return store.option.showComment;
  },
  get onChange() {
    return createStateSetFn('showComment');
  }
}), web.createComponent(SettingsItemSwitch, {
  get name() {
    return t('setting.option.swap_page_turn_key');
  },
  get value() {
    return store.option.swapPageTurnKey;
  },
  get onChange() {
    return createStateSetFn('swapPageTurnKey');
  }
}), web.createComponent(SettingsItemNumber, {
  get name() {
    return t('setting.option.preload_page_num');
  },
  maxLength: 5,
  onChange: val => {
    if (Number.isNaN(val)) return;
    setOption(draftOption => {
      draftOption.preloadPageNum = clamp(0, val, 99999);
    });
  },
  get value() {
    return store.option.preloadPageNum;
  }
}), web.createComponent(SettingsItem, {
  get name() {
    return t('setting.option.background_color');
  },
  get children() {
    var _el$2 = _tmpl$2$5();
    _el$2.style.setProperty("width", "2em");
    _el$2.style.setProperty("margin-right", ".4em");
    _el$2.addEventListener("input", throttle(e => {
      if (!e.target.value) return;
      setOption(draftOption => {
        // 在拉到纯黑或纯白时改回初始值
        draftOption.customBackground = e.target.value === '#000000' || e.target.value === '#ffffff' ? undefined : e.target.value;
        if (draftOption.customBackground) draftOption.darkMode = needDarkMode(draftOption.customBackground);
      });
    }, 20));
    web.effect(() => _el$2.value = store.option.customBackground ?? (store.option.darkMode ? '#000000' : '#ffffff'));
    return _el$2;
  }
}), web.createComponent(SettingsItemSelect, {
  get name() {
    return t('setting.language');
  },
  options: [['zh', '中文'], ['en', 'English'], ['ru', 'Русский']],
  get value() {
    return lang();
  },
  onChange: setLang
})], true]];

/** 阻止事件冒泡 */
const stopPropagation = e => {
  e.stopPropagation();
};

/** 从头开始播放元素的动画 */
const playAnimation = e => e?.getAnimations().forEach(animation => {
  animation.cancel();
  animation.play();
});

var _tmpl$$g = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$4 = /*#__PURE__*/web.template(\`<div><div></div><div>\`),
  _tmpl$3$3 = /*#__PURE__*/web.template(\`<hr>\`);

/** 菜单面板 */
const SettingPanel = () => {
  const settingList = createRootMemo(() => store.prop.editSettingList(defaultSettingList()));
  return (() => {
    var _el$ = _tmpl$$g();
    web.addEventListener(_el$, "wheel", stopPropagation);
    web.addEventListener(_el$, "scroll", stopPropagation);
    _el$.addEventListener("click", stopPropagation);
    web.insert(_el$, web.createComponent(solidJs.For, {
      get each() {
        return settingList();
      },
      children: ([name, SettingItem, hidden], i) => {
        const [show, setShwo] = solidJs.createSignal(!hidden);
        return [web.memo(() => web.memo(() => !!i())() ? _tmpl$3$3() : null), (() => {
          var _el$2 = _tmpl$2$4(),
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.nextSibling;
          _el$3.addEventListener("click", () => setShwo(prev => !prev));
          web.insert(_el$3, name, null);
          web.insert(_el$3, () => show() ? null : ' …', null);
          web.insert(_el$4, web.createComponent(SettingItem, {}));
          web.effect(_p$ => {
            var _v$3 = modules_c21c94f2$1.SettingBlock,
              _v$4 = show(),
              _v$5 = modules_c21c94f2$1.SettingBlockSubtitle,
              _v$6 = modules_c21c94f2$1.SettingBlockBody;
            _v$3 !== _p$.e && web.className(_el$2, _p$.e = _v$3);
            _v$4 !== _p$.t && web.setAttribute(_el$2, "data-show", _p$.t = _v$4);
            _v$5 !== _p$.a && web.className(_el$3, _p$.a = _v$5);
            _v$6 !== _p$.o && web.className(_el$4, _p$.o = _v$6);
            return _p$;
          }, {
            e: undefined,
            t: undefined,
            a: undefined,
            o: undefined
          });
          return _el$2;
        })()];
      }
    }));
    web.effect(_p$ => {
      var _v$ = \`\${modules_c21c94f2$1.SettingPanel} \${modules_c21c94f2$1.beautifyScrollbar}\`,
        _v$2 = lang() !== 'zh' ? '20em' : '15em';
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$.style.setProperty("width", _v$2) : _el$.style.removeProperty("width"));
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })();
};

var _tmpl$$f = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$3 = /*#__PURE__*/web.template(\`<div role=button tabindex=-1>\`);
/** 工具栏按钮分隔栏 */
const buttonListDivider = () => (() => {
  var _el$ = _tmpl$$f();
  _el$.style.setProperty("height", "1em");
  return _el$;
})();

/** 工具栏的默认按钮列表 */
const defaultButtonList = [
// 单双页模式
() => web.createComponent(IconButton, {
  get tip() {
    return web.memo(() => !!store.option.onePageMode)() ? t('button.page_mode_single') : t('button.page_mode_double');
  },
  get hidden() {
    return store.isMobile || store.option.scrollMode;
  },
  onClick: switchOnePageMode,
  get children() {
    return web.memo(() => !!store.option.onePageMode)() ? web.createComponent(MdLooksOne, {}) : web.createComponent(MdLooksTwo, {});
  }
}),
// 卷轴模式
() => web.createComponent(IconButton, {
  get tip() {
    return t('button.scroll_mode');
  },
  get enabled() {
    return store.option.scrollMode;
  },
  onClick: switchScrollMode,
  get children() {
    return web.createComponent(MdViewDay, {});
  }
}),
// 页面填充
() => web.createComponent(IconButton, {
  get tip() {
    return t('button.page_fill');
  },
  get enabled() {
    return !!store.fillEffect[nowFillIndex()];
  },
  get hidden() {
    return store.isMobile || store.option.onePageMode || store.option.scrollMode;
  },
  onClick: switchFillEffect,
  get children() {
    return web.createComponent(MdQueue, {});
  }
}),
// 网格模式
() => web.createComponent(IconButton, {
  get tip() {
    return t('button.grid_mode');
  },
  get enabled() {
    return store.gridMode;
  },
  onClick: switchGridMode,
  get children() {
    return web.createComponent(MdGrid, {});
  }
}), buttonListDivider,
// 放大模式
() => web.createComponent(IconButton, {
  get tip() {
    return t('button.zoom_in');
  },
  get enabled() {
    return store.zoom.scale !== 100 || store.option.scrollMode && store.option.scrollModeImgScale > 1;
  },
  onClick: () => {
    if (!store.option.scrollMode) return doubleClickZoom();
    if (store.option.scrollModeImgScale >= 1 && store.option.scrollModeImgScale < 1.6) return zoomScrollModeImg(0.2);
    return zoomScrollModeImg(1, true);
  },
  get children() {
    return web.createComponent(MdSearch, {});
  }
}),
// 翻译设置
() => web.createComponent(IconButton, {
  get tip() {
    return web.memo(() => !!isTranslatingImage())() ? t('button.close_current_page_translation') : t('button.translate_current_page');
  },
  get enabled() {
    return isTranslatingImage();
  },
  get hidden() {
    return store.option.translation.server === 'disable';
  },
  onClick: switchTranslation,
  get children() {
    return web.createComponent(MdTranslate, {});
  }
}),
// 设置
() => {
  const [showPanel, setShowPanel] = solidJs.createSignal(false);
  const handleClick = () => {
    const _showPanel = !showPanel();
    _setState('show', 'toolbar', _showPanel);
    setShowPanel(_showPanel);
  };
  const popper = solidJs.createMemo(() => [web.createComponent(SettingPanel, {}), (() => {
    var _el$2 = _tmpl$2$3();
    _el$2.addEventListener("click", handleClick);
    web.effect(() => web.className(_el$2, modules_c21c94f2$1.closeCover));
    return _el$2;
  })()]);
  return web.createComponent(IconButton, {
    get tip() {
      return t('button.setting');
    },
    get enabled() {
      return showPanel();
    },
    get showTip() {
      return showPanel();
    },
    onClick: handleClick,
    get popperClassName() {
      return showPanel() && modules_c21c94f2$1.SettingPanelPopper;
    },
    get popper() {
      return web.memo(() => !!showPanel())() && popper();
    },
    get children() {
      return web.createComponent(MdSettings, {});
    }
  });
}];

var _tmpl$$e = /*#__PURE__*/web.template(\`<div role=toolbar><div><div>\`);

/** 左侧工具栏 */
const Toolbar = () => {
  solidJs.createEffect(() => store.show.toolbar || focus());
  return (() => {
    var _el$ = _tmpl$$e(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild;
    _el$2.addEventListener("click", focus);
    web.insert(_el$2, web.createComponent(solidJs.For, {
      get each() {
        return store.prop.editButtonList(defaultButtonList);
      },
      children: ButtonItem => web.createComponent(ButtonItem, {})
    }), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.toolbar,
        _v$2 = boolDataVal(store.show.toolbar),
        _v$3 = boolDataVal(store.isMobile && store.gridMode),
        _v$4 = store.isDragMode ? 'none' : undefined,
        _v$5 = modules_c21c94f2$1.toolbarPanel,
        _v$6 = modules_c21c94f2$1.toolbarBg;
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && web.setAttribute(_el$, "data-show", _p$.t = _v$2);
      _v$3 !== _p$.a && web.setAttribute(_el$, "data-close", _p$.a = _v$3);
      _v$4 !== _p$.o && ((_p$.o = _v$4) != null ? _el$.style.setProperty("pointer-events", _v$4) : _el$.style.removeProperty("pointer-events"));
      _v$5 !== _p$.i && web.className(_el$2, _p$.i = _v$5);
      _v$6 !== _p$.n && web.className(_el$3, _p$.n = _v$6);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined
    });
    return _el$;
  })();
};

var _tmpl$$d = /*#__PURE__*/web.template(\`<div>\`);
const getScrollbarPage = (img, i) => ({
  num: 1,
  length: imgHeightList()[i],
  loadType: img.loadType,
  isNull: !img.src,
  translationType: img.translationType
});
const ScrollbarPage = props => {
  const flexBasis = solidJs.createMemo(() => store.option.scrollMode ? props.length / contentHeight() : props.num / store.imgList.length);
  return (() => {
    var _el$ = _tmpl$$d();
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.scrollbarPage,
        _v$2 = \`\${flexBasis() * 100}%\`,
        _v$3 = props.loadType,
        _v$4 = boolDataVal(props.isNull),
        _v$5 = props.translationType;
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && ((_p$.t = _v$2) != null ? _el$.style.setProperty("flex-basis", _v$2) : _el$.style.removeProperty("flex-basis"));
      _v$3 !== _p$.a && web.setAttribute(_el$, "data-type", _p$.a = _v$3);
      _v$4 !== _p$.o && web.setAttribute(_el$, "data-null", _p$.o = _v$4);
      _v$5 !== _p$.i && web.setAttribute(_el$, "data-translation-type", _p$.i = _v$5);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined
    });
    return _el$;
  })();
};

/** 显示对应图片加载情况的元素 */
const ScrollbarPageStatus = () => {
  // 将相同类型的页面合并显示
  const scrollbarPageList = createThrottleMemo(() => {
    if (!store.pageList.length) return [];
    const list = [];
    let item;
    const handleImg = i => {
      const img = store.imgList[i];
      if (!item) {
        item = getScrollbarPage(img, i);
        return;
      }
      if (img.loadType === item.loadType && !img.src === item.isNull && img.translationType === item.translationType) {
        item.num += 1;
        item.length += imgHeightList()[i];
      } else {
        list.push(item);
        item = getScrollbarPage(img, i);
      }
    };
    for (let i = 0; i < store.pageList.length; i++) {
      const [a, b] = store.pageList[i];
      if (b === undefined) handleImg(a);else if (a === -1) {
        handleImg(b);
        handleImg(b);
      } else if (b === -1) {
        handleImg(a);
        handleImg(a);
      } else {
        handleImg(a);
        handleImg(b);
      }
    }
    if (item) list.push(item);
    return list;
  }, 100);
  return web.createComponent(solidJs.For, {
    get each() {
      return scrollbarPageList();
    },
    children: page => web.createComponent(ScrollbarPage, page)
  });
};

var _tmpl$$c = /*#__PURE__*/web.template(\`<div role=scrollbar tabindex=-1><div></div><div>\`);

/** 滚动条 */
const Scrollbar = () => {
  solidJs.onMount(() => {
    useDrag({
      ref: refs.scrollbar,
      handleDrag: handlescrollbarSlider,
      easyMode: () => store.option.scrollMode && store.option.scrollbar.easyScroll
    });
  });

  // 在被滚动时使自身可穿透，以便在卷轴模式下触发页面的滚动
  const [penetrate, setPenetrate] = solidJs.createSignal(false);
  const resetPenetrate = debounce(() => setPenetrate(false));
  const handleWheel = () => {
    setPenetrate(true);
    resetPenetrate();
  };

  /** 是否强制显示滚动条 */
  const showScrollbar = solidJs.createMemo(() => store.show.scrollbar || !!penetrate());

  /** 滚动条提示文本 */
  const tipText = createThrottleMemo(() => {
    switch (showPageList().length) {
      case 0:
        return '';
      case 1:
        return getPageTip(showPageList()[0]);
    }
    const tipList = showPageList().map(i => getPageTip(i));
    if (store.option.scrollMode || store.page.vertical) return tipList.join('\\n');
    if (store.option.dir === 'rtl') tipList.reverse();
    return tipList.join('   ');
  });
  const style = createMemoMap({
    'pointer-events': () => penetrate() || store.isDragMode || store.gridMode ? 'none' : 'auto',
    '--scroll-length': () => \`\${scrollLength()}px\`,
    '--slider-midpoint': () => \`\${sliderMidpoint()}px\`,
    '--slider-height': () => \`\${sliderHeight() * scrollLength()}px\`,
    '--slider-top': () => \`\${sliderTop() * scrollLength()}px\`
  });
  return (() => {
    var _el$ = _tmpl$$c(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling;
    _el$.addEventListener("wheel", handleWheel);
    var _ref$ = bindRef('scrollbar');
    typeof _ref$ === "function" && web.use(_ref$, _el$);
    web.insert(_el$3, tipText);
    web.insert(_el$, web.createComponent(solidJs.Show, {
      get when() {
        return store.option.scrollbar.showImgStatus;
      },
      get children() {
        return web.createComponent(ScrollbarPageStatus, {});
      }
    }), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.scrollbar,
        _v$2 = style(),
        _v$3 = modules_c21c94f2$1.mangaFlow,
        _v$4 = store.activePageIndex || -1,
        _v$5 = boolDataVal(store.option.scrollbar.autoHidden),
        _v$6 = boolDataVal(showScrollbar()),
        _v$7 = store.option.dir,
        _v$8 = scrollPosition(),
        _v$9 = modules_c21c94f2$1.scrollbarSlider,
        _v$10 = {
          [modules_c21c94f2$1.hidden]: store.gridMode
        },
        _v$11 = modules_c21c94f2$1.scrollbarPoper;
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _p$.t = web.style(_el$, _v$2, _p$.t);
      _v$3 !== _p$.a && web.setAttribute(_el$, "aria-controls", _p$.a = _v$3);
      _v$4 !== _p$.o && web.setAttribute(_el$, "aria-valuenow", _p$.o = _v$4);
      _v$5 !== _p$.i && web.setAttribute(_el$, "data-auto-hidden", _p$.i = _v$5);
      _v$6 !== _p$.n && web.setAttribute(_el$, "data-force-show", _p$.n = _v$6);
      _v$7 !== _p$.s && web.setAttribute(_el$, "data-dir", _p$.s = _v$7);
      _v$8 !== _p$.h && web.setAttribute(_el$, "data-position", _p$.h = _v$8);
      _v$9 !== _p$.r && web.className(_el$2, _p$.r = _v$9);
      _p$.d = web.classList(_el$2, _v$10, _p$.d);
      _v$11 !== _p$.l && web.className(_el$3, _p$.l = _v$11);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined,
      s: undefined,
      h: undefined,
      r: undefined,
      d: undefined,
      l: undefined
    });
    return _el$;
  })();
};

var _tmpl$$b = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$2 = /*#__PURE__*/web.template(\`<div role=button tabindex=-1><p></p><button type=button></button><button type=button data-is-end></button><button type=button>\`),
  _tmpl$3$2 = /*#__PURE__*/web.template(\`<p>\`);
let delayTypeTimer = 0;
const EndPage = () => {
  const handleClick = e => {
    e.stopPropagation();
    if (e.target?.nodeName !== 'BUTTON') _setState('show', 'endPage', undefined);
    focus();
  };
  let ref;
  solidJs.onMount(() => {
    ref.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      turnPage(e.deltaY > 0 ? 'next' : 'prev');
    }, {
      passive: false
    });
  });

  // state.show.endPage 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
  // 防止在动画效果结束前 tip 就消失或改变了位置
  const [delayType, setDelayType] = solidJs.createSignal();
  solidJs.createEffect(() => {
    if (store.show.endPage) {
      window.clearTimeout(delayTypeTimer);
      setDelayType(store.show.endPage);
    } else {
      delayTypeTimer = window.setTimeout(() => setDelayType(store.show.endPage), 500);
    }
  });
  const tip = solidJs.createMemo(() => {
    switch (delayType()) {
      case 'start':
        if (store.prop.Prev && store.option.jumpToNext) return t('end_page.tip.start_jump');
        break;
      case 'end':
        if (store.prop.Next && store.option.jumpToNext) return t('end_page.tip.end_jump');
        if (store.prop.Exit) return t('end_page.tip.exit');
        break;
    }
    return '';
  });
  return (() => {
    var _el$ = _tmpl$2$2(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.nextSibling,
      _el$5 = _el$4.nextSibling;
    var _ref$ = ref;
    typeof _ref$ === "function" ? web.use(_ref$, _el$) : ref = _el$;
    _el$.addEventListener("click", handleClick);
    web.insert(_el$2, tip);
    var _ref$2 = bindRef('prev');
    typeof _ref$2 === "function" && web.use(_ref$2, _el$3);
    _el$3.addEventListener("click", () => store.prop.Prev?.());
    web.insert(_el$3, () => t('end_page.prev_button'));
    var _ref$3 = bindRef('exit');
    typeof _ref$3 === "function" && web.use(_ref$3, _el$4);
    _el$4.addEventListener("click", () => store.prop.Exit?.(store.show.endPage === 'end'));
    web.insert(_el$4, () => t('button.exit'));
    var _ref$4 = bindRef('next');
    typeof _ref$4 === "function" && web.use(_ref$4, _el$5);
    _el$5.addEventListener("click", () => store.prop.Next?.());
    web.insert(_el$5, () => t('end_page.next_button'));
    web.insert(_el$, web.createComponent(solidJs.Show, {
      get when() {
        return web.memo(() => !!store.option.showComment)() && delayType() === 'end';
      },
      get children() {
        var _el$6 = _tmpl$$b();
        web.addEventListener(_el$6, "wheel", stopPropagation);
        web.insert(_el$6, web.createComponent(solidJs.For, {
          get each() {
            return store.commentList;
          },
          children: comment => (() => {
            var _el$7 = _tmpl$3$2();
            web.insert(_el$7, comment);
            return _el$7;
          })()
        }));
        web.effect(() => web.className(_el$6, \`\${modules_c21c94f2$1.comments} \${modules_c21c94f2$1.beautifyScrollbar}\`));
        return _el$6;
      }
    }), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.endPage,
        _v$2 = store.show.endPage,
        _v$3 = delayType(),
        _v$4 = dir() === 'rtl' ? 'row-reverse' : undefined,
        _v$5 = modules_c21c94f2$1.tip,
        _v$6 = {
          [modules_c21c94f2$1.invisible]: !store.prop.Prev
        },
        _v$7 = store.show.endPage ? 0 : -1,
        _v$8 = store.show.endPage ? 0 : -1,
        _v$9 = {
          [modules_c21c94f2$1.invisible]: !store.prop.Next
        },
        _v$10 = store.show.endPage ? 0 : -1;
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _v$2 !== _p$.t && web.setAttribute(_el$, "data-show", _p$.t = _v$2);
      _v$3 !== _p$.a && web.setAttribute(_el$, "data-type", _p$.a = _v$3);
      _v$4 !== _p$.o && ((_p$.o = _v$4) != null ? _el$.style.setProperty("flex-direction", _v$4) : _el$.style.removeProperty("flex-direction"));
      _v$5 !== _p$.i && web.className(_el$2, _p$.i = _v$5);
      _p$.n = web.classList(_el$3, _v$6, _p$.n);
      _v$7 !== _p$.s && web.setAttribute(_el$3, "tabindex", _p$.s = _v$7);
      _v$8 !== _p$.h && web.setAttribute(_el$4, "tabindex", _p$.h = _v$8);
      _p$.r = web.classList(_el$5, _v$9, _p$.r);
      _v$10 !== _p$.d && web.setAttribute(_el$5, "tabindex", _p$.d = _v$10);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined,
      s: undefined,
      h: undefined,
      r: undefined,
      d: undefined
    });
    return _el$;
  })();
};

var _tmpl$$a = /*#__PURE__*/web.template(\`<style type=text/css>\`);
/** 深色模式 */
const dark = \`
--hover-bg-color: #FFF3;
--hover-bg-color-enable: #FFFa;

--switch: #BDBDBD;
--switch-bg: #6E6E6E;
--scrollbar-slider: #FFF6;

--page-bg: #303030;

--secondary: #7A909A;
--secondary-bg: #556065;

--text: white;
--text-secondary: #FFFC;
--text-bg: #121212;

color-scheme: dark;
\`;

/** 浅色模式 */
const light = \`
--hover-bg-color: #0001;
--hover-bg-color-enable: #0009;

--switch: #FAFAFA;
--switch-bg: #9C9C9C;
--scrollbar-slider: #0006;

--page-bg: white;

--secondary: #7A909A;
--secondary-bg: #BAC5CA;

--text: black;
--text-secondary: #0008;
--text-bg: #FAFAFA;

color-scheme: light;
\`;
const createSvgIcon = (fill, d) => \`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='\${fill}' viewBox='0 0 24 24'%3E%3Cpath d='\${d}'/%3E%3C/svg%3E")\`;
const MdImageNotSupported = \`m21.9 21.9-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41zM5 18l3.5-4.5 2.5 3.01L12.17 15l3 3H5zm16 .17L5.83 3H19c1.1 0 2 .9 2 2v13.17z\`;
const MdCloudDownload$1 = \`M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z\`;
const MdPhoto = \`M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z\`;
const CssVar = () => {
  const svg = solidJs.createMemo(() => {
    const fill = store.option.darkMode ? 'rgb(156,156,156)' : 'rgb(110,110,110)';
    return \`
      --md-image-not-supported: \${createSvgIcon(fill, MdImageNotSupported)};
      --md-cloud-download: \${createSvgIcon(fill, MdCloudDownload$1)};
      --md-photo: \${createSvgIcon(fill, MdPhoto)};\`;
  });
  const i18n = solidJs.createMemo(() => \`
      --i18n-touch-area-prev: "\${t('touch_area.prev')}";
      --i18n-touch-area-next: "\${t('touch_area.next')}";
      --i18n-touch-area-menu: "\${t('touch_area.menu')}";\`);
  return (() => {
    var _el$ = _tmpl$$a();
    web.insert(_el$, () => \`.\${modules_c21c94f2$1.root} {
      \${store.option.darkMode ? dark : light}

      --bg: \${store.option.customBackground ?? (store.option.darkMode ? '#000' : '#fff')};
      --scroll-mode-img-scale: \${store.option.scrollModeImgScale};
      --scroll-mode-spacing: \${store.option.scrollModeSpacing};

      \${svg()}
      \${i18n()}
      }\`);
    return _el$;
  })();
};

/* eslint-disable solid/reactivity */
const createComicImg = url => ({
  type: defaultImgType(),
  src: url || '',
  loadType: 'wait'
});
const useInit$1 = props => {
  initResizeObserver(refs.root);
  const watchProps = {
    option: state => {
      if (!props.option) return;
      state.option = assign(state.option, props.option);
      state.defaultOption = assign(defaultOption(), props.option);
    },
    fillEffect: state => {
      state.fillEffect = props.fillEffect ?? {
        '-1': true
      };
      updatePageData(state);
    },
    hotkeys: state => {
      state.hotkeys = {
        ...JSON.parse(JSON.stringify(defaultHotkeys)),
        ...props.hotkeys
      };
    },
    onExit: state => {
      state.prop.Exit = props.onExit ? isEnd => {
        playAnimation(refs.exit);
        props.onExit?.(!!isEnd);
        setState(draftState => {
          if (isEnd) draftState.activePageIndex = 0;
          draftState.show.endPage = undefined;
        });
      } : undefined;
    },
    onPrev: state => {
      state.prop.Prev = props.onPrev ? throttle(() => {
        playAnimation(refs.prev);
        props.onPrev?.();
      }, 1000) : undefined;
    },
    onNext: state => {
      state.prop.Next = props.onNext ? throttle(() => {
        playAnimation(refs.next);
        props.onNext?.();
      }, 1000) : undefined;
    },
    editButtonList: state => {
      state.prop.editButtonList = props.editButtonList ?? (list => list);
    },
    editSettingList: state => {
      state.prop.editSettingList = props.editSettingList ?? (list => list);
    },
    onLoading: state => {
      state.prop.Loading = props.onLoading ? debounce(props.onLoading) : undefined;
    },
    onOptionChange: state => {
      state.prop.OptionChange = props.onOptionChange ? debounce(props.onOptionChange) : undefined;
    },
    onHotkeysChange: state => {
      state.prop.HotkeysChange = props.onHotkeysChange ? debounce(props.onHotkeysChange) : undefined;
    },
    commentList: state => {
      state.commentList = props.commentList;
    }
  };
  Object.entries(watchProps).forEach(([key, fn]) => solidJs.createEffect(solidJs.on(() => props[key], () => setState(fn))));
  const handleImgList = () => {
    setState(state => {
      state.show.endPage = undefined;

      /** 修改前的当前显示图片 */
      const oldActiveImg = state.pageList[state.activePageIndex]?.map(i => state.imgList?.[i]?.src) ?? [];

      /** 是否需要重置页面填充 */
      let needResetFillEffect = false;
      const fillEffectList = Object.keys(state.fillEffect).map(k => +k);
      for (let i = 0; i < fillEffectList.length; i++) {
        const pageIndex = fillEffectList[i];
        if (pageIndex === -1) continue;
        if (state.imgList[pageIndex].src === props.imgList[pageIndex]) continue;
        needResetFillEffect = true;
        break;
      }

      /** 是否需要更新页面 */
      let needUpdatePageData = needResetFillEffect || state.imgList.length !== props.imgList.length;
      /** 传入的是否是新漫画 */
      let isNew = true;
      const imgMap = new Map(state.imgList.map(img => [img.src, img]));
      for (let i = 0; i < props.imgList.length; i++) {
        const url = props.imgList[i];
        if (isNew && imgMap.has(url)) isNew = false;
        const img = url && !needUpdatePageData && state.imgList[i];
        if (img && img.loadType !== 'wait' && img.src && img.src !== url) needUpdatePageData = true;
        state.imgList[i] = imgMap.get(url) ?? createComicImg(url);
      }
      if (state.imgList.length > props.imgList.length) {
        state.imgList.length = props.imgList.length;
        needUpdatePageData = true;
      }
      state.prop.Loading?.(state.imgList);
      if (isNew || needResetFillEffect) {
        state.fillEffect = props.fillEffect ?? {
          '-1': true
        };
        autoCloseFill.clear();
      }
      if (isNew || needUpdatePageData) updatePageData(state);else updateImgLoadType(state);
      if (isNew || state.pageList.length === 0) {
        resetImgState(state);
        state.activePageIndex = 0;
        scrollTo(0);
        return;
      }

      // 尽量使当前显示的图片在修改后依然不变
      oldActiveImg.some(url => {
        // 跳过填充页和已被删除的图片
        if (!url || props.imgList.includes(url)) return false;
        const newPageIndex = state.pageList.findIndex(page => page.some(index => state.imgList?.[index]?.src === url));
        if (newPageIndex === -1) return false;
        state.activePageIndex = newPageIndex;
        return true;
      });

      // 如果已经翻到了最后一页，且最后一页的图片被删掉了，那就保持在末页显示
      if (state.activePageIndex > state.pageList.length - 1) state.activePageIndex = state.pageList.length - 1;
    });
  };

  // 处理 imgList 参数的初始化和修改
  createEffectOn(() => props.imgList.join(), throttle(handleImgList, 500));
  focus();
};

var _tmpl$$9 = /*#__PURE__*/web.template(\`<div>\`);
const MangaStyle = css$1;
solidJs.enableScheduling();
/** 漫画组件 */
const Manga = props => {
  solidJs.onMount(() => useInit$1(props));
  solidJs.createEffect(() => props.show && focus());
  return [(() => {
    var _el$ = _tmpl$$9();
    web.addEventListener(_el$, "wheel", handleWheel);
    var _ref$ = bindRef('root');
    typeof _ref$ === "function" && web.use(_ref$, _el$);
    _el$.addEventListener("mousedown", handleMouseDown);
    _el$.addEventListener("keydown", handleKeyDown, true);
    _el$.addEventListener("keypress", stopPropagation, true);
    _el$.addEventListener("keyup", stopPropagation, true);
    _el$.addEventListener("click", stopPropagation);
    web.insert(_el$, web.createComponent(ComicImgFlow, {}), null);
    web.insert(_el$, web.createComponent(Toolbar, {}), null);
    web.insert(_el$, web.createComponent(Scrollbar, {}), null);
    web.insert(_el$, web.createComponent(TouchArea, {}), null);
    web.insert(_el$, web.createComponent(EndPage, {}), null);
    web.effect(_p$ => {
      var _v$ = modules_c21c94f2$1.root,
        _v$2 = {
          [modules_c21c94f2$1.hidden]: props.show === false,
          [props.class ?? '']: !!props.class,
          ...props.classList
        },
        _v$3 = boolDataVal(store.isMobile),
        _v$4 = boolDataVal(store.option.scrollMode),
        _v$5 = boolDataVal(store.gridMode);
      _v$ !== _p$.e && web.className(_el$, _p$.e = _v$);
      _p$.t = web.classList(_el$, _v$2, _p$.t);
      _v$3 !== _p$.a && web.setAttribute(_el$, "data-mobile", _p$.a = _v$3);
      _v$4 !== _p$.o && web.setAttribute(_el$, "data-scroll-mode", _p$.o = _v$4);
      _v$5 !== _p$.i && web.setAttribute(_el$, "data-grid-mode", _p$.i = _v$5);
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined
    });
    return _el$;
  })(), web.createComponent(CssVar, {})];
};

/** 下载按钮 */
const DownloadButton = () => {
  const [statu, setStatu] = solidJs.createSignal('button.download');
  const getFileExt = url => url.match(/[^?]+\\.(\\w+)/)?.[1] ?? 'jpg';
  const handleDownload = async () => {
    const fileData = {};
    const {
      imgList
    } = store;
    const imgIndexNum = \`\${imgList.length}\`.length;
    for (let i = 0; i < imgList.length; i += 1) {
      setStatu(\`\${i}/\${imgList.length}\`);
      if (store.option.translation.onlyDownloadTranslated && imgList[i].translationType !== 'show') continue;
      let data;
      let fileName;
      const img = imgList[i];
      const url = img.translationType === 'show' ? \`\${img.translationUrl}#.\${getFileExt(img.src)}\` : img.src;
      const index = \`\${i}\`.padStart(imgIndexNum, '0');
      if (url.startsWith('blob:')) {
        const res = await fetch(url);
        const blob = await res.blob();
        data = await blob.arrayBuffer();
        const fileExt = blob.type.split('/')[1];
        fileName = \`\${index}.\${fileExt}\`;
      } else {
        const fileExt = getFileExt(url);
        fileName = \`\${index}.\${fileExt}\`;
        try {
          const res = await request$1(url, {
            responseType: 'arraybuffer',
            errorText: \`\${t('alert.download_failed')}: \${fileName}\`
          });
          data = res.response;
        } catch (error) {
          fileName = \`\${index} - \${t('alert.download_failed')}.\${fileExt}\`;
        }
      }
      fileData[fileName] = new Uint8Array(data);
    }
    if (Object.keys(fileData).length === 0) {
      toast$1.warn(t('alert.no_img_download'));
      setStatu('button.download');
      return;
    }
    setStatu('button.packaging');
    const zipped = fflate.zipSync(fileData, {
      level: 0,
      comment: window.location.href
    });
    saveAs(new Blob([zipped]), \`\${document.title}.zip\`);
    setStatu('button.download_completed');
    toast$1.success(t('button.download_completed'));
  };
  const tip = solidJs.createMemo(() => t(statu()) || \`\${t('button.downloading')} - \${statu()}\`);
  return web.createComponent(IconButton, {
    get tip() {
      return tip();
    },
    onClick: handleDownload,
    get children() {
      return web.createComponent(MdFileDownload, {});
    }
  });
};

var _tmpl$$8 = /*#__PURE__*/web.template(\`<style type=text/css>\`);
let dom$1;
/**
 * 显示漫画阅读窗口
 */
const useManga = async initProps => {
  await GM.addStyle(\`
    #comicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);

      width: 100%;
      height: 100%;

      font-size: 16px;

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }

    #comicRead[show] {
      transform: scale(1);
      opacity: 1;
      transition: opacity 300ms, transform 100ms;
    }

    /* 防止其他扩展的元素显示到漫画上来 */
    #comicRead[show] ~ :not(#fab, #toast) {
      display: none !important;
      pointer-events: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      z-index: 1 !important;
    }
  \`);
  const [props, setProps] = store$2.createStore({
    imgList: [],
    show: false,
    ...initProps
  });
  const imgList = createRootMemo(() => props.adList ? props.imgList.filter((_, i) => !props.adList.has(i)) : props.imgList);
  createEffectOn([() => imgList().length, () => props.show], () => {
    if (!dom$1) {
      dom$1 = mountComponents('comicRead', () => [web.createComponent(Manga, web.mergeProps(props, {
        get imgList() {
          return imgList();
        }
      })), (() => {
        var _el$ = _tmpl$$8();
        web.insert(_el$, IconButtonStyle);
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$$8();
        web.insert(_el$2, MangaStyle);
        return _el$2;
      })()]);
      dom$1.style.setProperty('z-index', '2147483647', 'important');
    }
    if (imgList().length && props.show) {
      dom$1.setAttribute('show', '');
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom$1.removeAttribute('show');
      document.documentElement.style.overflow = 'unset';
    }
  });
  const ExitButton = () => web.createComponent(IconButton, {
    get tip() {
      return t('button.exit');
    },
    onClick: () => props.onExit?.(),
    get children() {
      return web.createComponent(MdClose, {});
    }
  });
  setProps({
    onExit: () => setProps('show', false),
    editButtonList: list => {
      // 在设置按钮上方放置下载按钮
      list.splice(-1, 0, DownloadButton);
      return [...list,
      // 再在最下面添加分隔栏和退出按钮
      buttonListDivider, ExitButton];
    }
  });
  return [setProps, props];
};

var _tmpl$$7 = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79M21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98z"></path><path d="M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.71-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03m0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83s-.42.7-.83.66c-1.62-.19-3.39-.04-4.73.39a1 1 0 0 1-.23.03">\`);
const MdMenuBook = ((props = {}) => (() => {
  var _el$ = _tmpl$$7();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$6 = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M18 15v4c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h3.02c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1s-1 .45-1 1m-2.5 3H6.52c-.42 0-.65-.48-.39-.81l1.74-2.23a.5.5 0 0 1 .78-.01l1.56 1.88 2.35-3.02c.2-.26.6-.26.79.01l2.55 3.39c.25.32.01.79-.4.79m3.8-9.11c.48-.77.75-1.67.69-2.66-.13-2.15-1.84-3.97-3.97-4.2A4.5 4.5 0 0 0 11 6.5c0 2.49 2.01 4.5 4.49 4.5.88 0 1.7-.26 2.39-.7l2.41 2.41c.39.39 1.03.39 1.42 0s.39-1.03 0-1.42zM15.5 9a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5">\`);
const MdImageSearch = ((props = {}) => (() => {
  var _el$ = _tmpl$$6();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$5 = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79M21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98z">\`);
const MdImportContacts = ((props = {}) => (() => {
  var _el$ = _tmpl$$5();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var _tmpl$$4 = /*#__PURE__*/web.template(\`<svg xmlns=http://www.w3.org/2000/svg viewBox="0 0 24 24"stroke=currentColor fill=currentColor stroke-width=0><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96M17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4z">\`);
const MdCloudDownload = ((props = {}) => (() => {
  var _el$ = _tmpl$$4();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var css = ".index_module_fabRoot__f35e0ac6{font-size:1.1em;transition:transform .2s}.index_module_fabRoot__f35e0ac6[data-show=false]{pointer-events:none}.index_module_fabRoot__f35e0ac6[data-show=false]>button{transform:scale(0)}.index_module_fabRoot__f35e0ac6[data-trans=true]{opacity:.8}.index_module_fabRoot__f35e0ac6[data-trans=true]:focus,.index_module_fabRoot__f35e0ac6[data-trans=true]:focus-visible,.index_module_fabRoot__f35e0ac6[data-trans=true]:hover{opacity:1}.index_module_fab__f35e0ac6{align-items:center;background-color:var(--fab,#607d8b);border:none;border-radius:100%;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12);color:#fff;cursor:pointer;display:flex;font-size:1em;height:3.6em;justify-content:center;transform:scale(1);transition:transform .2s;width:3.6em}.index_module_fab__f35e0ac6>svg{font-size:1.5em;width:1em}.index_module_fab__f35e0ac6:hover{background-color:var(fab-hover,#78909c)}.index_module_fab__f35e0ac6:focus,.index_module_fab__f35e0ac6:focus-visible{box-shadow:0 3px 5px -1px rgba(0,0,0,.5),0 6px 10px 0 rgba(0,0,0,.34),0 1px 18px 0 rgba(0,0,0,.32);outline:none}.index_module_progress__f35e0ac6{color:#b0bec5;display:inline-block;height:100%;position:absolute;transform:rotate(-90deg);transition:transform .3s cubic-bezier(.4,0,.2,1) 0ms;width:100%}.index_module_progress__f35e0ac6>svg{stroke:currentcolor;stroke-dasharray:290%;stroke-dashoffset:100%;stroke-linecap:round;transition:stroke-dashoffset .3s cubic-bezier(.4,0,.2,1) 0ms}.index_module_progress__f35e0ac6:hover{color:#cfd8dc}.index_module_progress__f35e0ac6[aria-valuenow=\\"1\\"]{opacity:0;transition:opacity .2s .15s}.index_module_popper__f35e0ac6{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:none;font-size:.8em;padding:.4em .5em;position:absolute;right:calc(100% + 1.5em);top:50%;transform:translateY(-50%);white-space:nowrap}:is(.index_module_fab__f35e0ac6:hover,.index_module_fabRoot__f35e0ac6[data-focus=true]) .index_module_popper__f35e0ac6{display:flex}.index_module_speedDial__f35e0ac6{align-items:center;bottom:0;display:flex;flex-direction:column-reverse;font-size:1.1em;padding-bottom:120%;pointer-events:none;position:absolute;width:100%;z-index:-1}.index_module_speedDialItem__f35e0ac6{margin:.1em 0;opacity:0;transform:scale(0);transition-delay:var(--hide-delay);transition-duration:.23s;transition-property:transform,opacity}.index_module_speedDial__f35e0ac6:hover{pointer-events:all}:is(.index_module_fabRoot__f35e0ac6:hover:not([data-show=false]),.index_module_fabRoot__f35e0ac6[data-focus=true])>.index_module_speedDial__f35e0ac6{pointer-events:all}:is(.index_module_fabRoot__f35e0ac6:hover:not([data-show=false]),.index_module_fabRoot__f35e0ac6[data-focus=true])>.index_module_speedDial__f35e0ac6>.index_module_speedDialItem__f35e0ac6{opacity:unset;transform:unset;transition-delay:var(--show-delay)}.index_module_backdrop__f35e0ac6{background:#000;height:100vh;left:0;opacity:0;pointer-events:none;position:fixed;top:0;transition:opacity .5s;width:100vw}.index_module_fabRoot__f35e0ac6[data-focus=true] .index_module_backdrop__f35e0ac6{pointer-events:unset}:is(.index_module_fabRoot__f35e0ac6:hover:not([data-show=false]),.index_module_fabRoot__f35e0ac6[data-focus=true],.index_module_speedDial__f35e0ac6:hover) .index_module_backdrop__f35e0ac6{opacity:.4}";
var modules_c21c94f2 = {"fabRoot":"index_module_fabRoot__f35e0ac6","fab":"index_module_fab__f35e0ac6","progress":"index_module_progress__f35e0ac6","popper":"index_module_popper__f35e0ac6","speedDial":"index_module_speedDial__f35e0ac6","speedDialItem":"index_module_speedDialItem__f35e0ac6","backdrop":"index_module_backdrop__f35e0ac6"};

var _tmpl$$3 = /*#__PURE__*/web.template(\`<div><div>\`),
  _tmpl$2$1 = /*#__PURE__*/web.template(\`<div><button type=button tabindex=-1><span role=progressbar><svg viewBox="22 22 44 44"><circle cx=44 cy=44 r=20.2 fill=none stroke-width=3.6>\`),
  _tmpl$3$1 = /*#__PURE__*/web.template(\`<div>\`);
const FabStyle = css;
/**
 * Fab 按钮
 */
const Fab = _props => {
  const props = solidJs.mergeProps({
    progress: 0,
    initialShow: true,
    autoTrans: false
  }, _props);

  // 上次滚动位置
  let lastY = window.scrollY;
  const [show, setShow] = solidJs.createSignal(props.initialShow);

  // 绑定滚动事件
  const handleScroll = throttle(e => {
    // 跳过非用户操作的滚动
    if (e.isTrusted === false) return;
    if (window.scrollY === lastY) return;
    setShow(
    // 滚动到底部时显示
    window.scrollY + window.innerHeight >= document.body.scrollHeight ||
    // 向上滚动时显示，反之隐藏
    window.scrollY - lastY < 0);
    lastY = window.scrollY;
  }, 200);
  solidJs.onMount(() => window.addEventListener('scroll', handleScroll));
  solidJs.onCleanup(() => window.removeEventListener('scroll', handleScroll));

  // 将 forceShow 的变化同步到 show 上
  solidJs.createEffect(() => {
    if (props.show) setShow(props.show);
  });
  return (() => {
    var _el$ = _tmpl$2$1(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.firstChild;
    _el$2.addEventListener("click", () => props.onClick?.());
    web.insert(_el$2, () => props.children ?? web.createComponent(MdMenuBook, {}), _el$3);
    web.insert(_el$2, (() => {
      var _c$ = web.memo(() => !!props.tip);
      return () => _c$() ? (() => {
        var _el$7 = _tmpl$3$1();
        web.insert(_el$7, () => props.tip);
        web.effect(() => web.className(_el$7, modules_c21c94f2.popper));
        return _el$7;
      })() : null;
    })(), null);
    web.insert(_el$, web.createComponent(solidJs.Show, {
      get when() {
        return props.speedDial?.length;
      },
      get children() {
        var _el$5 = _tmpl$$3(),
          _el$6 = _el$5.firstChild;
        _el$6.addEventListener("click", () => props.onBackdropClick?.());
        web.insert(_el$5, web.createComponent(solidJs.For, {
          get each() {
            return props.speedDial;
          },
          children: (SpeedDialItem, i) => (() => {
            var _el$8 = _tmpl$3$1();
            web.insert(_el$8, web.createComponent(SpeedDialItem, {}));
            web.effect(_p$ => {
              var _v$12 = modules_c21c94f2.speedDialItem,
                _v$13 = {
                  '--show-delay': \`\${i() * 30}ms\`,
                  '--hide-delay': \`\${(props.speedDial.length - 1 - i()) * 50}ms\`
                },
                _v$14 = i() * 30;
              _v$12 !== _p$.e && web.className(_el$8, _p$.e = _v$12);
              _p$.t = web.style(_el$8, _v$13, _p$.t);
              _v$14 !== _p$.a && web.setAttribute(_el$8, "data-i", _p$.a = _v$14);
              return _p$;
            }, {
              e: undefined,
              t: undefined,
              a: undefined
            });
            return _el$8;
          })()
        }), null);
        web.effect(_p$ => {
          var _v$ = modules_c21c94f2.speedDial,
            _v$2 = modules_c21c94f2.backdrop;
          _v$ !== _p$.e && web.className(_el$5, _p$.e = _v$);
          _v$2 !== _p$.t && web.className(_el$6, _p$.t = _v$2);
          return _p$;
        }, {
          e: undefined,
          t: undefined
        });
        return _el$5;
      }
    }), null);
    web.effect(_p$ => {
      var _v$3 = modules_c21c94f2.fabRoot,
        _v$4 = props.style,
        _v$5 = props.show ?? show(),
        _v$6 = props.autoTrans,
        _v$7 = props.focus,
        _v$8 = modules_c21c94f2.fab,
        _v$9 = modules_c21c94f2.progress,
        _v$10 = props.progress,
        _v$11 = \`\${(1 - props.progress) * 290}%\`;
      _v$3 !== _p$.e && web.className(_el$, _p$.e = _v$3);
      _p$.t = web.style(_el$, _v$4, _p$.t);
      _v$5 !== _p$.a && web.setAttribute(_el$, "data-show", _p$.a = _v$5);
      _v$6 !== _p$.o && web.setAttribute(_el$, "data-trans", _p$.o = _v$6);
      _v$7 !== _p$.i && web.setAttribute(_el$, "data-focus", _p$.i = _v$7);
      _v$8 !== _p$.n && web.className(_el$2, _p$.n = _v$8);
      _v$9 !== _p$.s && web.className(_el$3, _p$.s = _v$9);
      _v$10 !== _p$.h && web.setAttribute(_el$3, "aria-valuenow", _p$.h = _v$10);
      _v$11 !== _p$.r && ((_p$.r = _v$11) != null ? _el$4.style.setProperty("stroke-dashoffset", _v$11) : _el$4.style.removeProperty("stroke-dashoffset"));
      return _p$;
    }, {
      e: undefined,
      t: undefined,
      a: undefined,
      o: undefined,
      i: undefined,
      n: undefined,
      s: undefined,
      h: undefined,
      r: undefined
    });
    return _el$;
  })();
};

var _tmpl$$2 = /*#__PURE__*/web.template(\`<style type=text/css>\`);
let dom;
const useFab = async initProps => {
  await GM.addStyle(\`
    #fab {
      --text-bg: transparent;

      position: fixed;
      right: 3vw;
      bottom: 6vh;

      font-size: clamp(12px, 1.5vw, 16px);
    }
  \`);
  const [props, setProps] = store$2.createStore({
    ...initProps
  });
  const FabIcon = () => {
    switch (props.progress) {
      case undefined:
        // 没有内容的书
        return MdImportContacts;
      case 1:
      case 2:
        // 有内容的书
        return MdMenuBook;
      default:
        return props.progress > 1 ? MdCloudDownload : MdImageSearch;
    }
  };
  solidJs.createRoot(() => {
    solidJs.createEffect(() => {
      if (dom) return;
      dom = mountComponents('fab', () => [web.createComponent(Fab, web.mergeProps(props, {
        get children() {
          return props.children ?? web.createComponent(web.Dynamic, {
            get component() {
              return FabIcon();
            }
          });
        }
      })), (() => {
        var _el$ = _tmpl$$2();
        web.insert(_el$, IconButtonStyle);
        return _el$;
      })(), (() => {
        var _el$2 = _tmpl$$2();
        web.insert(_el$2, FabStyle);
        return _el$2;
      })()]);
      dom.style.setProperty('z-index', '2147483646', 'important');
    });
  });
  return [setProps, props];
};

var _tmpl$$1 = /*#__PURE__*/web.template(\`<h2>🥳 ComicRead 已更新到 v\`),
  _tmpl$2 = /*#__PURE__*/web.template(\`<h3>新增\`),
  _tmpl$3 = /*#__PURE__*/web.template(\`<ul><li><p>支持 nekohouse </p></li><li><p>translate_current_page shortcut\`),
  _tmpl$4 = /*#__PURE__*/web.template(\`<h3>修复\`),
  _tmpl$5 = /*#__PURE__*/web.template(\`<ul><li><p>修复部分网站下载的漫画文件后辍异常的 bug </p></li><li><p>修复在禁漫上使用时会提示「漫画加载出错」的 bug </p></li><li><p>eslint problems\`);

/** 重命名配置项 */
const renameOption = async (name, list) => {
  try {
    const option = await GM.getValue(name);
    if (!option) throw new Error(\`GM.getValue Error: not found \${name}\`);
    for (let i = list.length - 1; i; i--) {
      const [path, newName] = list[i].split(' => ');
      byPath(option, path, (parent, key) => {
        log('rename Option', list[i]);
        Reflect.set(parent, newName, parent[key]);
        Reflect.deleteProperty(parent, key);
      });
    }
    await GM.setValue(name, option);
  } catch (error) {
    log.error(\`migration \${name} option error:\`, error);
  }
};

/** 旧版本配置迁移 */
const migration = async () => {
  const values = await GM.listValues();

  // 6 => 7
  for (let i = 0; i < values.length; i++) {
    const key = values[i];
    switch (key) {
      case 'Version':
      case 'Languages':
        continue;
      case 'HotKeys':
        {
          await renameOption(key, ['向上翻页 => turn_page_up', '向下翻页 => turn_page_down', '向右翻页 => turn_page_right', '向左翻页 => turn_page_left', '跳至首页 => jump_to_home', '跳至尾页 => jump_to_end', '退出 => exit', '切换页面填充 => switch_page_fill', '切换卷轴模式 => switch_scroll_mode', '切换单双页模式 => switch_single_double_page_mode', '切换阅读方向 => switch_dir', '进入阅读模式 => enter_read_mode']);
          break;
        }
      default:
        await renameOption(key, ['option.scrollbar.showProgress => showImgStatus', 'option.clickPage => clickPageTurn', 'option.clickPage.overturn => reverse', 'option.swapTurnPage => swapPageTurnKey', 'option.flipToNext => jumpToNext',
        // ehentai
        '匹配nhentai => associate_nhentai', '快捷键翻页 => hotkeys_page_turn',
        // nhentai
        '自动翻页 => auto_page_turn', '彻底屏蔽漫画 => block_totally', '在新页面中打开链接 => open_link_new_page',
        // other
        '记住当前站点 => remember_current_site']);
    }
  }
};

/** 处理版本更新相关 */
const handleVersionUpdate = async () => {
  const version = await GM.getValue('Version');
  if (!version) return GM.setValue('Version', GM.info.script.version);
  if (version === GM.info.script.version) return;
  if (version.split('.')[0] !== GM.info.script.version.split('.')[0]) await migration();

  // 只在语言为中文时弹窗提示最新更新内容
  if (lang() === 'zh') {
    toast$1(() => [(() => {
      var _el$ = _tmpl$$1();
        _el$.firstChild;
      web.insert(_el$, () => GM.info.script.version, null);
      return _el$;
    })(), _tmpl$2(), _tmpl$3(), _tmpl$4(), _tmpl$5()], {
      id: 'Version Tip',
      type: 'custom',
      duration: Infinity,
      // 手动点击关掉通知后才不会再次弹出
      onDismiss: () => GM.setValue('Version', GM.info.script.version)
    });

    // 监听储存的版本数据的变动，如果和当前版本一致就关掉弹窗
    // 防止在更新版本后一次性打开多个页面，不得不一个一个关过去
    const listenerId = await GM.addValueChangeListener('Version', async (_, __, newVersion) => {
      if (newVersion !== GM.info.script.version) return;
      toast$1.dismiss('Version Tip');
      await GM.removeValueChangeListener(listenerId);
    });
  } else await GM.setValue('Version', GM.info.script.version);
};

const getHotkeys = async () => ({
  enter_read_mode: ['v'],
  ...(await GM.getValue('Hotkeys', {}))
});

/**
 * 对修改站点配置的相关方法的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useSiteOptions = async (name, defaultOptions = {}) => {
  const _defaultOptions = {
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions
  };
  const saveOptions = await GM.getValue(name);
  const options = store$2.createMutable({
    ..._defaultOptions,
    ...saveOptions
  });
  const setOptions = async newValue => {
    Object.assign(options, newValue);

    // 只保存和默认设置不同的部分
    return GM.setValue(name, difference(options, _defaultOptions));
  };
  const [hotkeys, setHotkeys] = solidJs.createSignal(await getHotkeys());
  const isStored = saveOptions !== undefined;
  // 如果当前站点没有存储配置，就补充上去
  if (!isStored) GM.setValue(name, options);
  return {
    /** 站点配置 */
    options,
    /** 修改站点配置 */
    setOptions,
    /** 是否存过配置 */
    isStored,
    /** 快捷键配置 */
    hotkeys,
    /** 处理快捷键配置的变动 */
    onHotkeysChange: newValue => {
      GM.setValue('Hotkeys', newValue);
      setHotkeys(newValue);
    },
    /** 进入阅读模式的快捷键 */
    readModeHotkeys: solidJs.createRoot(() => {
      const readModeHotkeysMemo = solidJs.createMemo(() => new Set(Object.assign([], hotkeys().enter_read_mode)));
      return readModeHotkeysMemo;
    })
  };
};

/**
 * 对基础的初始化操作的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useInit = async (name, defaultOptions = {}) => {
  await setInitLang();
  await handleVersionUpdate();
  const {
    options,
    setOptions,
    readModeHotkeys,
    hotkeys,
    onHotkeysChange,
    isStored
  } = await useSiteOptions(name, defaultOptions);
  const [setFab, fabProps] = await useFab({
    tip: t('other.read_mode'),
    speedDial: useSpeedDial(options, setOptions),
    show: false
  });

  /** 处理 Manga 组件的 onLoading 回调，将图片加载状态联动到 Fab 上 */
  const onLoading = (list, img) => {
    if (list.length === 0 || !img) return;
    const loadNum = list.filter(image => image.loadType === 'loaded').length;

    /** 图片加载进度 */
    const progress = 1 + loadNum / list.length;
    if (progress !== 2) {
      setFab({
        progress,
        tip: \`\${t('other.img_loading')} - \${loadNum}/\${list.length}\`
      });
    } else {
      // 图片全部加载完成后恢复 Fab 状态
      setFab({
        progress,
        tip: t('other.read_mode'),
        show: !options.hiddenFAB && undefined
      });
    }
  };
  const [setManga, mangaProps] = await useManga({
    imgList: [],
    option: options.option,
    onOptionChange: option => setOptions({
      option
    }),
    hotkeys: hotkeys(),
    onHotkeysChange,
    onLoading
  });
  let menuId;
  /** 更新显示/隐藏悬浮按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(options.hiddenFAB ? t('other.fab_show') : t('other.fab_hidden'), async () => {
      await setOptions({
        ...options,
        hiddenFAB: !options.hiddenFAB
      });
      setFab('show', !options.hiddenFAB && undefined);
      await updateHideFabMenu();
    });
  };
  await GM.registerMenuCommand(t('site.show_settings_menu'), () => setFab({
    show: true,
    focus: true,
    tip: t('site.settings_tip'),
    children: web.createComponent(MdSettings, {}),
    onBackdropClick: () => setFab({
      show: false,
      focus: false
    })
  }));

  /** 当前是否还需要判断 autoShow */
  const needAutoShow = {
    val: true
  };
  return {
    options,
    setOptions,
    setFab,
    setManga,
    mangaProps,
    fabProps,
    needAutoShow,
    isStored,
    /** Manga 组件的默认 onLoading */
    onLoading,
    /**
     * 对 加载图片 和 进入阅读模式 相关初始化的封装
     * @param getImgList 返回图片列表的函数
     * @returns 自动加载图片并进入阅读模式的函数
     */
    init: getImgList => {
      const firstRun = menuId === undefined;

      /** 是否正在加载图片中 */
      let loading = false;

      /** 加载 imgList */
      const loadImgList = async (initImgList, show) => {
        loading = true;
        try {
          if (!initImgList) setFab({
            progress: 0,
            show: true
          });
          const newImgList = initImgList ?? (await getImgList());
          if (newImgList.length === 0) throw new Error(t('alert.fetch_comic_img_failed'));
          setManga('imgList', newImgList);
          if (show || needAutoShow.val && options.autoShow) {
            setManga('show', true);
            needAutoShow.val = false;
          }
        } catch (e) {
          log.error(e);
          if (show) toast$1.error(e.message);
          setFab({
            progress: undefined
          });
        } finally {
          loading = false;
        }
      };

      /** 进入阅读模式 */
      const showComic = async () => {
        if (loading) return toast$1.warn(t('alert.repeat_load'), {
          duration: 1500
        });
        if (!mangaProps.imgList.length) return loadImgList(undefined, true);
        setManga('show', true);
      };
      setFab({
        onClick: showComic,
        show: !options.hiddenFAB && undefined
      });
      if (needAutoShow.val && options.autoShow) showComic();
      if (firstRun) {
        GM.registerMenuCommand(t('other.enter_comic_read_mode'), fabProps.onClick);
        updateHideFabMenu();
        window.addEventListener('keydown', e => {
          if (e.target.tagName === 'INPUT') return;
          const code = getKeyboardCode(e);
          if (!readModeHotkeys().has(code)) return;
          e.stopPropagation();
          e.preventDefault();
          fabProps.onClick?.();
        });
      }
      return {
        /** 进入阅读模式 */
        showComic,
        /** 加载 imgList */
        loadImgList
      };
    },
    /** 使用动态更新来加载 imgList */
    dynamicUpdate: (work, totalImgNum) => async () => {
      if (mangaProps.imgList.length === totalImgNum) return mangaProps.imgList;
      await new Promise(resolve => {
        setManga('imgList', Array(totalImgNum).fill(''));
        work((i, url) => resolve(setManga('imgList', i, url)));
      });
      return mangaProps.imgList;
    }
  };
};

/** 对简单站点的通用解 */
const universalInit = async ({
  name,
  wait: waitFn,
  getImgList,
  onPrev,
  onNext,
  onExit,
  getCommentList,
  initOptions,
  SPA
}) => {
  if (SPA?.isMangaPage) await main.wait(SPA?.isMangaPage);
  if (waitFn) await main.wait(waitFn);
  const fnMap = await main.useInit(name, initOptions);
  const {
    init,
    options,
    setManga,
    setFab,
    needAutoShow
  } = fnMap;
  const {
    loadImgList
  } = init(() => getImgList(fnMap));
  if (onExit) setManga({
    onExit: isEnd => {
      onExit?.(isEnd);
      setManga({
        show: false
      });
    }
  });
  if (!SPA) {
    if (onNext || onPrev) setManga({
      onNext,
      onPrev
    });
    if (getCommentList) setManga({
      commentList: await getCommentList()
    });
    return;
  }
  const {
    isMangaPage,
    getOnPrev,
    getOnNext
  } = SPA;
  let lastUrl = '';
  main.autoUpdate(async () => {
    if (!(await main.wait(() => window.location.href !== lastUrl, 5000))) return;
    lastUrl = window.location.href;
    if (isMangaPage && !(await isMangaPage())) {
      setFab('show', false);
      setManga({
        show: false,
        imgList: []
      });
      return;
    }
    if (waitFn) await main.wait(waitFn);
    setManga({
      onPrev: undefined,
      onNext: undefined
    });
    needAutoShow.val = options.autoShow;
    await loadImgList();
    await Promise.all([(async () => getCommentList && setManga({
      commentList: await getCommentList()
    }))(), (async () => getOnPrev && setManga({
      onPrev: await main.wait(getOnPrev, 5000)
    }))(), (async () => getOnNext && setManga({
      onNext: await main.wait(getOnNext, 5000)
    }))()]);
  });
};

var _tmpl$ = /*#__PURE__*/web.template(\`<div><button>\`);
// 因为直接放到 site/other 里会导致打包时自动加入 import solidjs 的代码，
/** 提示当前开启了自动进入阅读模式的弹窗 */
const autoReadModeMessage = setOptions => () => (() => {
  var _el$ = _tmpl$(),
    _el$2 = _el$.firstChild;
  web.insert(_el$, () => main.t('site.simple.auto_read_mode_message'), _el$2);
  _el$2.addEventListener("click", () => setOptions({
    autoShow: false
  }));
  web.insert(_el$2, () => main.t('other.disable'));
  return _el$;
})();

const getAdPage = async (list, isAdPage, adList = new Set()) => {
  let i = list.length - 1;
  let normalNum = 0;
  // 只检查最后十张
  for (; i >= list.length - 10; i--) {
    // 开头肯定不会是广告
    if (i <= 2) break;
    if (adList.has(i)) continue;
    const item = list[i];
    if (!item) break;
    if (await isAdPage(item)) adList.add(i);
    // 找到连续两张正常漫画页后中断
    else if (normalNum) break;else normalNum += 1;
  }
  let adNum = 0;
  for (i = Math.min(...adList); i < list.length; i++) {
    if (adList.has(i)) {
      adNum += 1;
      continue;
    }
    // 连续两张广告后面的肯定也都是广告
    if (adNum >= 2) adList.add(i);
    // 夹在两张广告中间的肯定也是广告
    else if (adList.has(i - 1) && adList.has(i + 1)) adList.add(i);else adNum = 0;
  }
  return adList;
};

/** 判断像素点是否是灰阶 */
const isGrayscalePixel = (r, g, b) => r === g && r === b;

/** 判断一张图是否是彩图 */
const isColorImg = imgCanvas => {
  const canvas = document.createElement('canvas');
  // 缩小尺寸放弃细节，避免被黑白图上的小段彩色文字干扰
  canvas.width = 3;
  canvas.height = 3;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imgCanvas, 0, 0, canvas.width, canvas.height);
  const {
    data
  } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isGrayscalePixel(r, g, b)) return true;
  }
  return false;
};
const imgToCanvas = async img => {
  if (typeof img !== 'string') {
    await main.wait(() => img.naturalHeight && img.naturalWidth, 1000 * 10);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      // 没被 CORS 污染就直接使用这个 canvas
      if (ctx.getImageData(0, 0, 1, 1)) return canvas;
    } catch (_) {}
  }
  const url = typeof img === 'string' ? img : img.src;
  const res = await main.request(url, {
    responseType: 'blob'
  });
  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = URL.createObjectURL(res.response);
  });
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return canvas;
};

/** 二维码白名单 */
const qrCodeWhiteList = [
// fanbox
/^https:\\/\\/[^.]+\\.fanbox\\.cc/,
// twitter
/^https:\\/\\/twitter\\.com/, /^https:\\/\\/x\\.com/,
// fantia
/^https:\\/\\/fantia\\.jp/,
// 棉花糖
/^https:\\/\\/marshmallow-qa\\.com/];

/** 判断是否含有二维码 */
const hasQrCode = async (imgCanvas, scanRegion, qrEngine, canvas) => {
  try {
    const {
      data
    } = await QrScanner.scanImage(imgCanvas, {
      qrEngine,
      canvas,
      scanRegion,
      alsoTryWithoutScanRegion: true
    });
    if (!data) return false;
    main.log(\`检测到二维码： \${data}\`);
    return qrCodeWhiteList.every(reg => !reg.test(data));
  } catch (_) {
    return false;
  }
};
const isAdImg = async (imgCanvas, qrEngine, canvas) => {
  // 黑白图肯定不是广告
  if (!isColorImg(imgCanvas)) return false;
  const width = imgCanvas.width / 2;
  const height = imgCanvas.height / 2;

  // 分区块扫描图片
  const scanRegionList = [undefined,
  // 右下
  {
    x: width,
    y: height,
    width,
    height
  },
  // 左下
  {
    x: 0,
    y: height,
    width,
    height
  },
  // 右上
  {
    x: width,
    y: 0,
    width,
    height
  },
  // 左上
  {
    x: 0,
    y: 0,
    width,
    height
  }];
  for (let i = 0; i < scanRegionList.length; i++) {
    const scanRegion = scanRegionList[i];
    if (await hasQrCode(imgCanvas, scanRegion, qrEngine, canvas)) return true;
  }
  return false;
};
const byContent = (qrEngine, canvas) => async img => isAdImg(await imgToCanvas(img), qrEngine, canvas);

/** 通过图片内容判断是否是广告 */
const getAdPageByContent = async (imgList, adList = new Set()) => {
  const qrEngine = await QrScanner.createQrEngine();
  const canvas = document.createElement('canvas');
  return getAdPage(imgList, byContent(qrEngine, canvas), adList);
};
const adFileNameRe = /^[zZ]+/;

/** 通过文件名判断是否是广告 */
const getAdPageByFileName = (fileNameList, adList = new Set()) => getAdPage(fileNameList, fileName => adFileNameRe.test(fileName), adList);

const createImgData = (oldSrc = '') => ({
  triggedNum: 0,
  observerTimeout: 0,
  oldSrc
});

// 使用 triggerEleLazyLoad 会导致正常的滚动在滚到一半时被打断，所以加个锁限制一下
const scrollLock = {
  enabled: false,
  nextOpenTime: 0,
  timeout: 0
};
const closeScrollLock = delay => {
  const time = Date.now() + delay;
  if (time <= scrollLock.nextOpenTime) return;
  scrollLock.nextOpenTime = time;
  window.clearInterval(scrollLock.timeout);
  scrollLock.timeout = window.setTimeout(() => {
    scrollLock.enabled = false;
    scrollLock.timeout = 0;
  }, delay);
};
const openScrollLock = time => {
  scrollLock.enabled = true;
  closeScrollLock(time);
};
window.addEventListener('wheel', () => openScrollLock(1000));

/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe = /^(((https?|ftp|file):)?\\/)?\\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#%=~_|]$/;

/** 检查元素属性，将格式为图片 url 的属性值作为 src */
const tryCorrectUrl = e => {
  e.getAttributeNames().some(key => {
    // 跳过白名单
    switch (key) {
      case 'src':
      case 'alt':
      case 'class':
      case 'style':
      case 'id':
      case 'title':
      case 'onload':
      case 'onerror':
        return false;
    }
    const val = e.getAttribute(key).trim();
    if (!isImgUrlRe.test(val)) return false;
    e.setAttribute('src', val);
    return true;
  });
};

/** 判断一个元素是否已经触发完懒加载 */
const isLazyLoaded = (e, oldSrc) => {
  if (!e.src) return false;
  if (!e.offsetParent) return false;
  if (oldSrc !== undefined && e.src !== oldSrc) return true;
  if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
  return false;
};
const imgMap = new Map();
let imgShowObserver;
const getImg = e => imgMap.get(e) ?? createImgData();
const MAX_TRIGGED_NUM = 5;

/** 判断图片元素是否需要触发懒加载 */
const needTrigged = e => !isLazyLoaded(e, imgMap.get(e)?.oldSrc) && (imgMap.get(e)?.triggedNum ?? 0) < MAX_TRIGGED_NUM;

/** 图片懒加载触发完后调用 */
const handleTrigged = e => {
  const img = getImg(e);
  img.observerTimeout = 0;
  img.triggedNum += 1;
  if (isLazyLoaded(e, img.oldSrc) && img.triggedNum < MAX_TRIGGED_NUM) img.triggedNum = MAX_TRIGGED_NUM;
  imgMap.set(e, img);
  if (!needTrigged(e)) imgShowObserver.unobserve(e);
};

/** 监视图片是否被显示的 Observer */
imgShowObserver = new IntersectionObserver(entries => entries.forEach(img => {
  const ele = img.target;
  if (img.isIntersecting) {
    imgMap.set(ele, {
      ...getImg(ele),
      observerTimeout: window.setTimeout(handleTrigged, 290, ele)
    });
  }
  const timeoutID = imgMap.get(ele)?.observerTimeout;
  if (timeoutID) window.clearTimeout(timeoutID);
}));
const turnPageScheduled = createScheduled(fn => throttle(fn, 1000));
/** 触发翻页 */
const triggerTurnPage = async (waitTime = 0) => {
  if (!turnPageScheduled()) return;
  const nowScroll = window.scrollY;
  // 滚到底部再滚回来，触发可能存在的自动翻页脚本
  window.scroll({
    top: document.body.scrollHeight,
    behavior: 'auto'
  });
  document.body.dispatchEvent(new Event('scroll', {
    bubbles: true
  }));
  if (waitTime) await sleep(waitTime);
  window.scroll({
    top: nowScroll,
    behavior: 'auto'
  });
};

/** 触发页面上所有图片元素的懒加载 */
const triggerLazyLoad = singleThreaded(async (state, getAllImg, getWaitTime) => {
  // 过滤掉已经被触发过懒加载的图片
  const targetImgList = getAllImg().filter(needTrigged).sort((a, b) => a.offsetTop - b.offsetTop);
  targetImgList.forEach(e => {
    imgShowObserver.observe(e);
    if (!imgMap.has(e)) imgMap.set(e, createImgData(e.src));
  });
  for (let i = 0; i < targetImgList.length; i++) {
    await wait(() => !scrollLock.enabled);
    const waitTime = getWaitTime();
    await triggerTurnPage(waitTime);
    const e = targetImgList[i];
    if (!needTrigged(e)) continue;
    tryCorrectUrl(e);
    if ((await triggerEleLazyLoad(e, waitTime, () => isLazyLoaded(e, imgMap.get(e)?.oldSrc))) || waitTime) handleTrigged(e);
  }
  await triggerTurnPage();
  if (targetImgList.length !== 0) state.continueRun = true;
});

exports.ReactiveSet = ReactiveSet;
exports.approx = approx;
exports.assign = assign;
exports.autoReadModeMessage = autoReadModeMessage;
exports.autoUpdate = autoUpdate;
exports.boolDataVal = boolDataVal;
exports.byPath = byPath;
exports.canvasToBlob = canvasToBlob;
exports.clamp = clamp;
exports.createEffectOn = createEffectOn;
exports.createEqualsSignal = createEqualsSignal;
exports.createFillImgList = createFillImgList;
exports.createMemoMap = createMemoMap;
exports.createRootMemo = createRootMemo;
exports.createStyle = createStyle;
exports.createThrottleMemo = createThrottleMemo;
exports.dataToParams = dataToParams;
exports.debounce = debounce;
exports.difference = difference;
exports.eachApi = eachApi;
exports.getAdPageByContent = getAdPageByContent;
exports.getAdPageByFileName = getAdPageByFileName;
exports.getImgSize = getImgSize;
exports.getKeyboardCode = getKeyboardCode;
exports.getMostItem = getMostItem;
exports.ifNot = ifNot;
exports.imgMap = imgMap;
exports.inRange = inRange;
exports.insertNode = insertNode;
exports.isEqual = isEqual;
exports.isUrl = isUrl;
exports.keyboardCodeToText = keyboardCodeToText;
exports.lang = lang;
exports.linstenKeyup = linstenKeyup;
exports.log = log;
exports.loop = loop;
exports.needDarkMode = needDarkMode;
exports.needTrigged = needTrigged;
exports.openScrollLock = openScrollLock;
exports.plimit = plimit;
exports.querySelector = querySelector;
exports.querySelectorAll = querySelectorAll;
exports.querySelectorClick = querySelectorClick;
exports.request = request$1;
exports.requestIdleCallback = requestIdleCallback$1;
exports.saveAs = saveAs;
exports.scrollIntoView = scrollIntoView;
exports.setInitLang = setInitLang;
exports.setLang = setLang;
exports.showPageList = showPageList;
exports.singleThreaded = singleThreaded;
exports.sleep = sleep;
exports.store = store;
exports.t = t;
exports.testImgUrl = testImgUrl;
exports.throttle = throttle;
exports.toast = toast$1;
exports.triggerEleLazyLoad = triggerEleLazyLoad;
exports.triggerLazyLoad = triggerLazyLoad;
exports.universalInit = universalInit;
exports.useCache = useCache;
exports.useFab = useFab;
exports.useInit = useInit;
exports.useManga = useManga;
exports.useSiteOptions = useSiteOptions;
exports.useSpeedDial = useSpeedDial;
exports.wait = wait;
exports.waitDom = waitDom;
exports.waitImgLoad = waitImgLoad;
`
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 通过提供 cjs 环境的变量来兼容 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  const runCode = `
    window['${tempName}']['${name}'] = {};
    ${''}
    (function (process, require, exports, module, ${gmApiList.join(', ')}) {
      ${code}
    })(
      window['${tempName}'].process,
      window['${tempName}'].require,
      window['${tempName}']['${name}'],
      {
        set exports(value) {
          window['${tempName}']['${name}'] = value;
        },
        get exports() {
          return window['${tempName}']['${name}'];
        },
      },
      ${gmApiList.map(apiName => `window['${tempName}'].${apiName}`).join(', ')}
    );
    ${''}
  `;
  Reflect.deleteProperty(unsafeWindow, tempName);
  unsafeWindow[tempName] = crsLib;
  evalCode(runCode);
  Reflect.deleteProperty(unsafeWindow, tempName);
};
/**
 * 创建一个外部模块的 Proxy，等到读取对象属性时才加载模块
 * @param name 外部模块名
 */
const require = name => {
  // 为了应对 rollup 打包时的工具函数 _interopNamespace，要给外部库加上 __esModule 标志
  const __esModule = {
    value: true
  };
  const selfLibProxy = () => {};
  selfLibProxy.default = {};
  const selfDefault = new Proxy(selfLibProxy, {
    get(_, prop) {
      if (prop === '__esModule') return __esModule;
      if (prop === 'default') return selfDefault;
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc = typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args);
    },
    construct(_, args) {
      if (!crsLib[name]) selfImportSync(name);
      const module = crsLib[name];
      const ModuleFunc = typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args);
    }
  });
  return selfDefault;
};
crsLib.require = require;


/** 站点配置 */
let options;

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const main = require('main');
try {
  // 匹配站点
  switch (window.location.hostname) {
    // #百合会——「记录阅读历史、自动签到等」
    case 'bbs.yamibo.com':
      {
const web = require('solid-js/web');
const main = require('main');
const solidJs = require('solid-js');

var _tmpl$ = /*#__PURE__*/web.template(`<a class=historyTag>回第<!>页 `),
  _tmpl$2 = /*#__PURE__*/web.template(`<div class=historyTag>+`),
  _tmpl$3 = /*#__PURE__*/web.template(`<li><a>回第<!>页`);
(async () => {
  const {
    options,
    setFab,
    setManga,
    init,
    onLoading,
    needAutoShow
  } = await main.useInit('yamibo', {
    记录阅读进度: true,
    关闭快捷导航的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
    自动签到: true
  });
  await GM.addStyle(`#fab { --fab: #6E2B19; fab-hover: #A15640; }

    ${options.固定导航条 ? '.header-stackup { position: fixed !important }' : ''}

    .historyTag {
      white-space: nowrap;

      border: 2px solid #6e2b19;
    }

    a.historyTag {
      font-weight: bold;

      margin-left: 1em;
      padding: 1px 4px;

      color: #6e2b19;
      border-radius: 4px 0 0 4px;
    }
    a.historyTag:last-child {
      border-radius: 4px;
    }

    div.historyTag {
      display: initial;

      margin-left: -.4em;
      padding: 1px;

      color: RGB(255, 237, 187);
      border-radius: 0 4px 4px 0;
      background-color: #6e2b19;
    }

    #threadlisttableid tbody:nth-child(2n) div.historyTag {
      color: RGB(255, 246, 215);
    }

    /* 将「回复/查看」列加宽一点 */
    .tl .num {
      width: 80px !important;
    }
    `);

  // 自动签到
  if (options.自动签到) (async () => {
    const todayString = new Date().toLocaleDateString('zh-CN');
    // 判断当前日期与上次成功签到日期是否相同
    if (todayString === localStorage.getItem('signDate')) return;
    const sign = main.querySelector('#scbar_form > input[name="formhash"]')?.value;
    if (!sign) return;
    try {
      const res = await fetch(`plugin.php?id=zqlj_sign&sign=${sign}`);
      const body = await res.text();
      if (!/成功！|打过卡/.test(body)) throw new Error('自动签到失败');
      main.toast.success('自动签到成功');
      localStorage.setItem('signDate', todayString);
    } catch (e) {
      main.toast.error('自动签到失败');
    }
  })();
  if (options.关闭快捷导航的跳转)
    // eslint-disable-next-line no-script-url
    main.querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');

  // 判断当前页是帖子
  if (/thread(-\d+){3}|mod=viewthread/.test(document.URL)) {
    // 修复微博图床的链接
    main.querySelectorAll('img[file*="sinaimg.cn"]').forEach(e => e.setAttribute('referrerpolicy', 'no-referrer'));
    const fid = unsafeWindow.fid ?? +(new URLSearchParams(main.querySelector('h2 > a')?.href).get('fid') ?? '-1');

    // 限定板块启用
    if (fid === 30 || fid === 37) {
      const isFirstPage = !main.querySelector('.pg > .prev');
      // 第一页以外不自动加载
      if (!isFirstPage) needAutoShow.val = false;
      let imgList = main.querySelectorAll('.plc:not(.plm) img');
      const updateImgList = () => {
        let i = imgList.length;
        while (i--) {
          const img = imgList[i];

          // 触发懒加载
          const file = img.getAttribute('file');
          if (file && img.src !== file) {
            img.setAttribute('src', file);
            img.setAttribute('lazyloaded', 'true');
          }

          // 测试例子：https://bbs.yamibo.com/thread-502399-1-1.html

          // 删掉表情和小图
          if (img.src.includes('static/image') || img.complete && img.naturalHeight && img.naturalWidth && img.naturalHeight < 500 && img.naturalWidth < 500) imgList.splice(i, 1);
        }
        return imgList.map(img => img.src);
      };
      updateImgList();
      const {
        showComic,
        loadImgList
      } = init(() => imgList.map(img => img.src));
      setManga({
        // 在图片加载完成后再检查一遍有没有小图，有就删掉
        onLoading: (_imgList, img) => {
          onLoading(_imgList, img);
          if (!img) return;
          if (imgList.length !== updateImgList().length) return loadImgList();
        },
        onExit: isEnd => {
          if (isEnd) main.scrollIntoView('.psth, .rate, #postlist > div:nth-of-type(2)');
          setManga('show', false);
        }
      });
      setFab({
        progress: isFirstPage ? 1 : undefined,
        tip: '阅读模式',
        show: undefined
      });
      if (main.querySelector('div.pti > div.authi')) {
        main.insertNode(main.querySelector('div.pti > div.authi'), '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>');
        document.getElementById('comicReadMode')?.addEventListener('click', showComic);
      }

      // 如果帖子内有设置目录
      if (main.querySelector('#threadindex')) {
        let id;
        main.querySelectorAll('#threadindex li').forEach(dom => {
          dom.addEventListener('click', () => {
            if (id) return;
            id = window.setInterval(() => {
              imgList = main.querySelectorAll('.t_fsz img');
              if (!imgList.length || !updateImgList().length) return setFab('progress', undefined);
              setManga({
                imgList: updateImgList(),
                show: options.autoShow ?? undefined
              });
              setFab('progress', 1);
              window.clearInterval(id);
            }, 100);
          });
        });
      }
      const tagDom = main.querySelector('.ptg.mbm.mtn > a');
      // 通过标签确定上/下一话
      if (tagDom) {
        const tagId = tagDom.href.split('id=')[1];
        const reg = /(?<=<th>\s<a href="thread-)\d+(?=-)/g;
        let threadList = [];

        // 先获取包含当前帖后一话在内的同一标签下的帖子id列表，再根据结果设定上/下一话
        const setPrevNext = async (pageNum = 1) => {
          const res = await main.request(`https://bbs.yamibo.com/misc.php?mod=tag&id=${tagId}&type=thread&page=${pageNum}`);
          const newList = [...res.responseText.matchAll(reg)].map(([tid]) => +tid);
          threadList = threadList.concat(newList);
          const index = threadList.findIndex(tid => tid === unsafeWindow.tid);
          if (newList.length && (index === -1 || !threadList[index + 1])) return setPrevNext(pageNum + 1);
          return setManga({
            onPrev: threadList[index - 1] ? () => {
              window.location.assign(`thread-${threadList[index - 1]}-1-1.html`);
            } : undefined,
            onNext: threadList[index + 1] ? () => {
              window.location.assign(`thread-${threadList[index + 1]}-1-1.html`);
            } : undefined
          });
        };
        setTimeout(setPrevNext);
      }
    }
    if (options.记录阅读进度) {
      const tid = unsafeWindow.tid ?? new URLSearchParams(window.location.search).get('tid');
      if (!tid) return;
      const res = await main.request(`https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`, {
        errorText: '获取帖子回复数时出错'
      });
      /** 回复数 */
      const allReplies = parseInt(JSON.parse(res.responseText)?.Variables?.thread?.allreplies, 10);
      if (!allReplies) return;

      /** 当前所在页数 */
      const currentPageNum = parseInt(main.querySelector('#pgt strong')?.innerHTML ?? main.querySelector('#dumppage')?.value ?? '1', 10);
      const cache = main.useCache(db => {
        db.createObjectStore('history', {
          keyPath: 'tid'
        });
      });
      const data = await cache.get('history', `${tid}`);
      // 如果是在翻阅之前页数的内容，则跳过不处理
      if (data && currentPageNum < data.lastPageNum) return;

      // 如果有上次阅读进度的数据，则监视上次的进度之后的楼层，否则监视所有
      /** 监视楼层列表 */
      const watchFloorList = main.querySelectorAll(data?.lastAnchor && currentPageNum === data.lastPageNum ? `#${data.lastAnchor} ~ div` : '#postlist > div, .plc.cl');
      if (!watchFloorList.length) return;
      let id = 0;
      /** 储存数据，但是防抖 */
      const debounceSave = saveData => {
        if (id) window.clearTimeout(id);
        id = window.setTimeout(async () => {
          id = 0;
          await cache.set('history', saveData);
        }, 200);
      };

      // 在指定楼层被显示出来后重新存储进度数据
      const observer = new IntersectionObserver(entries => {
        // 找到触发楼层
        const trigger = entries.find(e => e.isIntersecting);
        if (!trigger) return;

        // 取消触发楼层上面楼层的监视
        const triggerIndex = watchFloorList.findIndex(e => e === trigger.target);
        if (triggerIndex === -1) return;
        watchFloorList.splice(0, triggerIndex + 1).forEach(e => observer.unobserve(e));

        // 储存数据
        debounceSave({
          tid: `${tid}`,
          lastPageNum: currentPageNum,
          lastReplies: allReplies,
          lastAnchor: trigger.target.id
        });
      }, {
        rootMargin: '-160px'
      });
      watchFloorList.forEach(e => observer.observe(e));
    }
    return;
  }

  // 判断当前页是板块
  if (/forum(-\d+){2}|mod=forumdisplay/.test(document.URL)) {
    if (options.修正点击页数时的跳转判定) {
      const List = main.querySelectorAll('.tps>a');
      let i = List.length;
      while (i--) List[i].setAttribute('onClick', 'atarget(this)');
    }
    if (options.记录阅读进度) {
      const cache = main.useCache(db => {
        db.createObjectStore('history', {
          keyPath: 'tid'
        });
      });
      const isMobile = !document.querySelector('#flk');
      const [updateFlag, setUpdateFlag] = solidJs.createSignal(false);
      const updateHistoryTag = () => setUpdateFlag(val => !val);
      let listSelector = 'tbody[id^=normalthread]';
      let getTid = e => e.id.split('_')[1];
      let getUrl = (data, tid) => `thread-${tid}-${data.lastPageNum}-1.html#${data.lastAnchor}`;
      if (isMobile) {
        listSelector = '.threadlist li.list';
        getTid = e => new URLSearchParams(e.children[1].getAttribute('href')).get('tid');
        getUrl = (data, tid) => `forum.php?mod=viewthread&tid=${tid}&extra=page%3D1&mobile=2&page=${data.lastPageNum}#${data.lastAnchor}`;
      }
      main.querySelectorAll(listSelector).forEach(e => {
        const tid = getTid(e);
        web.render(() => {
          const [data, setData] = solidJs.createSignal();
          solidJs.createEffect(solidJs.on(updateFlag, () => cache.get('history', tid).then(setData)));
          const url = solidJs.createMemo(() => data() ? getUrl(data(), tid) : '');
          const lastReplies = solidJs.createMemo(() => !isMobile && data() ? +e.querySelector('.num a').innerHTML - data().lastReplies : 0);
          const pc = () => [(() => {
            var _el$ = _tmpl$(),
              _el$2 = _el$.firstChild,
              _el$4 = _el$2.nextSibling;
              _el$4.nextSibling;
            web.addEventListener(_el$, "click", unsafeWindow.atarget, true);
            web.insert(_el$, () => data()?.lastPageNum, _el$4);
            web.effect(() => web.setAttribute(_el$, "href", url()));
            return _el$;
          })(), web.createComponent(solidJs.Show, {
            get when() {
              return lastReplies() > 0;
            },
            get children() {
              var _el$5 = _tmpl$2();
                _el$5.firstChild;
              web.insert(_el$5, lastReplies, null);
              return _el$5;
            }
          })];
          const mobile = () => (() => {
            var _el$7 = _tmpl$3(),
              _el$8 = _el$7.firstChild,
              _el$9 = _el$8.firstChild,
              _el$11 = _el$9.nextSibling;
              _el$11.nextSibling;
            web.addEventListener(_el$8, "click", unsafeWindow.atarget, true);
            _el$8.style.setProperty("color", "unset");
            web.insert(_el$8, () => data()?.lastPageNum, _el$11);
            web.effect(() => web.setAttribute(_el$8, "href", url()));
            return _el$7;
          })();
          return web.createComponent(solidJs.Show, {
            get when() {
              return !!data();
            },
            get children() {
              return web.createComponent(solidJs.Show, {
                when: isMobile,
                get children() {
                  return mobile();
                },
                get fallback() {
                  return pc();
                }
              });
            }
          });
        }, isMobile ? e.children[3] : e.getElementsByTagName('th')[0]);
      });

      // 切换回当前页时更新提示
      document.addEventListener('visibilitychange', updateHistoryTag);
      // 点击下一页后更新提示
      main.querySelector('#autopbn')?.addEventListener('click', updateHistoryTag);
    }
  }
})().catch(e => main.log.error(e));
web.delegateEvents(["click"]);

        break;
      }
    // #百合会新站
    case 'www.yamibo.com':
      {
        if (!window.location.pathname.includes('/manga/view-chapter')) break;
        const id = new URLSearchParams(window.location.search).get('id');
        if (!id) break;

        /** 总页数 */
        const totalPageNum = +main.querySelector('section div:first-of-type div:last-of-type').innerHTML.split('：')[1];
        if (Number.isNaN(totalPageNum)) throw new Error(main.t('site.changed_load_failed'));

        /** 获取指定页数的图片 url */
        const getImg = async (i = 1) => {
          const res = await main.request(`https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`);
          return res.responseText.match(/(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/)[0].replaceAll('&amp;', '&');
        };
        options = {
          name: 'newYamibo',
          getImgList: ({
            setFab
          }) => main.plimit(Object.keys([...new Array(totalPageNum)]).map(i => () => getImg(+i + 1)), (doneNum, totalNum) => {
            setFab({
              progress: doneNum / totalNum,
              tip: `加载图片中 - ${doneNum}/${totalNum}`
            });
          }),
          onNext: main.querySelectorClick('#btnNext'),
          onPrev: main.querySelectorClick('#btnPrev'),
          onExit: isEnd => isEnd && main.scrollIntoView('#w1')
        };
        break;
      }

    // #动漫之家——「解锁隐藏漫画」
    case 'comic.idmzj.com':
    case 'comic.dmzj.com':
    case 'manhua.idmzj.com':
    case 'manhua.dmzj.com':
      {
const web = require('solid-js/web');
const solidJs = require('solid-js');
const main = require('main');
const store = require('solid-js/store');
const dmzjDecrypt = require('dmzjDecrypt');

/** 根据漫画 id 和章节 id 获取章节数据 */
const getChapterInfo = async (comicId, chapterId) => {
  const res = await main.request(`https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`, {
    errorText: '获取章节数据失败'
  });
  return JSON.parse(res.responseText);
};

/** 根据漫画 id 和章节 id 获取章节评论 */
const getViewpoint = async (comicId, chapterId) => {
  try {
    const res = await main.request(`https://manhua.dmzj.com/tpi/api/viewpoint/getViewpoint?type=0&type_id=${comicId}&chapter_id=${chapterId}&more=1`, {
      errorText: '获取章节评论失败'
    });

    // 还有另一个 api
    // http://v3api.dmzj.com/viewPoint/0/${comic_id}/${chapter_id}.json

    return JSON.parse(res.responseText).data.list.map(({
      title,
      num
    }) => `${title} [+${num}]`);
  } catch (_) {
    return [];
  }
};
const getComicDetail_base = async comicId => {
  const res = await main.request(`https://api.dmzj.com/dynamic/comicinfo/${comicId}.json`);
  const {
    info: {
      last_updatetime,
      title
    },
    list
  } = JSON.parse(res.responseText).data;
  return {
    title,
    last_updatetime,
    last_update_chapter_id: null,
    chapters: [{
      name: '连载',
      list: list.map(({
        id,
        chapter_name,
        updatetime
      }) => ({
        id,
        title: chapter_name,
        updatetime
      }))
    }]
  };
};
const getComicDetail_v4Api = async comicId => {
  const res = await main.request(`https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`);
  const {
    comicInfo: {
      last_update_chapter_id,
      last_updatetime,
      chapters,
      title
    }
  } = dmzjDecrypt(res.responseText);
  Object.values(chapters).forEach(chapter => {
    chapter.data.sort((a, b) => a.chapter_order - b.chapter_order);
  });
  return {
    title,
    last_updatetime,
    last_update_chapter_id,
    chapters: chapters.map(({
      data,
      title: name
    }) => ({
      name,
      list: data.map(({
        chapter_id,
        chapter_title,
        updatetime
      }) => ({
        id: chapter_id,
        title: chapter_title,
        updatetime
      }))
    }))
  };
};
const getComicDetail_traversal = async (comicId, draftData) => {
  let nextId = draftData.last_update_chapter_id;
  if (!nextId) {
    main.log.warn('last_update_chapter_id 为空，无法通过遍历获取章节');
    return;
  }
  draftData.chapters[0] = {
    name: '连载',
    list: []
  };
  main.toast.warn('正在通过遍历获取所有章节，耗时可能较长', {
    id: 'traversalTip',
    duration: Infinity
  });
  while (nextId) {
    try {
      const {
        chapter_name,
        updatetime,
        prev_chap_id
      } = await getChapterInfo(comicId, nextId);
      draftData.chapters[0].list.push({
        id: nextId,
        title: chapter_name,
        updatetime
      });
      nextId = prev_chap_id;
    } catch (_) {
      nextId = undefined;
    }
  }
  main.toast.dismiss('traversalTip');
};

/** 返回可变 store 类型的漫画数据 */
const useComicDetail = comicId => {
  const data = store.createMutable({});
  const apiFn = [getComicDetail_v4Api, getComicDetail_base, getComicDetail_traversal];
  solidJs.onMount(async () => {
    for (let i = 0; i < apiFn.length; i++) {
      try {
        Object.assign(data, await apiFn[i](comicId, data));
        if (data.chapters?.some(chapter => chapter.list.length)) return;
      } catch (_) {}
    }
    main.toast.error('漫画数据获取失败', {
      duration: Infinity
    });
  });
  return data;
};

/** 根据漫画拼音简称找到对应的 id */
const getComicId = async py => {
  const res = await main.request(`https://manhua.dmzj.com/api/v1/comic2/comic/detail?${new URLSearchParams({
    channel: 'pc',
    app_name: 'comic',
    version: '1.0.0',
    timestamp: `${Date.now()}`,
    uid: '',
    comic_py: py
  }).toString()}`);
  return JSON.parse(res.responseText).data?.comicInfo?.id;
};

var _tmpl$ = /*#__PURE__*/web.template(`<div class=photo_part><div class=h2_title2><span class="h2_icon h2_icon22"></span><h2> `),
  _tmpl$2 = /*#__PURE__*/web.template(`<div class=cartoon_online_border_other><ul></ul><div class=clearfix>`),
  _tmpl$3 = /*#__PURE__*/web.template(`<li><a target=_blank>`);
(async () => {
  // 通过 rss 链接，在作者作品页里添加上隐藏漫画的链接
  if (window.location.pathname.includes('/tags/')) {
    const res = await main.request(main.querySelector('a.rss').href, {
      errorText: '获取作者作品失败'
    });

    // 页面上原有的漫画标题
    const titleList = main.querySelectorAll('#hothit p.t').map(e => e.innerText.replace('[完]', ''));
    main.insertNode(document.getElementById('hothit'), res.responseText.split('item').filter((_, i) => i % 2).map(item => {
      const newComicUrl = /manhua.dmzj.com\/(.+?)\?from=rssReader/.exec(item)[1];
      return {
        newComicUrl,
        comicUrl: newComicUrl.split('/')[0],
        title: /title><!\[CDATA\[(.+?)]]/.exec(item)[1],
        imgUrl: /<img src='(.+?)'/.exec(item)[1],
        newComicTitle: /title='(.+?)'/.exec(item)[1]
      };
    }).filter(({
      title
    }) => !titleList.includes(title)).map(data => `
            <div class="pic">
              <a href="/${data.comicUrl}/" target="_blank">
              <img src="${data.imgUrl}" alt="${data.title}" title="" style="">
              <p class="t">【*隐藏*】${data.title}</p></a>
              <p class="d">最新：<a href="/${data.newComicUrl}" target="_blank">${data.newComicTitle}</a></p>
            </div>
          `).join(''));
    return;
  }
  const getId = async () => {
    const [, comicPy, chapterId] = window.location.pathname.split(/\/|\./);
    if (!comicPy) {
      main.toast.error('漫画数据获取失败', {
        duration: Infinity,
        throw: new Error('获取漫画拼音简称失败')
      });
    }
    const comicId = await getComicId(comicPy);
    return {
      comicId,
      chapterId
    };
  };
  const isListPageRe = /^\/[^/]*?\/?$/;
  const isMangaPageRe = /^\/.*?\/\d+\.shtml$/;
  const handleListPage = async () => {
    await main.waitDom('.newpl_ans');
    // 判断漫画被禁
    // 测试例子：https://manhua.dmzj.com/yanquan/
    if (!main.querySelector('.cartoon_online_border > img')) return false;
    main.querySelector('.cartoon_online_border').innerHTML = '获取漫画数据中';

    // 删掉原有的章节 dom
    main.querySelectorAll('.odd_anim_title ~ *').forEach(e => e.remove());
    const {
      comicId
    } = await getId();
    web.render(() => {
      const comicDetail = useComicDetail(comicId);
      return web.createComponent(solidJs.For, {
        get each() {
          return comicDetail.chapters;
        },
        children: ({
          name,
          list
        }) => [(() => {
          var _el$ = _tmpl$(),
            _el$2 = _el$.firstChild,
            _el$3 = _el$2.firstChild,
            _el$4 = _el$3.nextSibling,
            _el$5 = _el$4.firstChild;
          web.insert(_el$4, () => comicDetail.title, _el$5);
          web.insert(_el$4, name === '连载' ? '在线漫画全集' : `漫画其它版本：${name}`, null);
          return _el$;
        })(), (() => {
          var _el$6 = _tmpl$2(),
            _el$7 = _el$6.firstChild;
          _el$6.style.setProperty("margin-top", "-8px");
          web.insert(_el$7, web.createComponent(solidJs.For, {
            each: list,
            children: ({
              title,
              id,
              updatetime
            }) => (() => {
              var _el$8 = _tmpl$3(),
                _el$9 = _el$8.firstChild;
              web.setAttribute(_el$9, "title", title);
              web.setAttribute(_el$9, "href", `https://m.dmzj.com/view/${comicId}/${id}.html`);
              web.insert(_el$9, title);
              web.effect(() => _el$9.classList.toggle("color_red", !!(updatetime === comicDetail.last_updatetime)));
              return _el$8;
            })()
          }));
          return _el$6;
        })()]
      });
    }, main.querySelector('.middleright_mr'));
    return false;
  };

  /** 切换至上下滚动阅读 */
  const waitSwitchScroll = async () => {
    await main.waitDom('#qiehuan_txt');
    await main.wait(() => {
      const dom = main.querySelector('#qiehuan_txt');
      if (!dom) return;
      if (dom.innerText !== '切换到上下滚动阅读') return true;
      dom.click();
    });
  };
  const getImgList = async () => {
    await waitSwitchScroll();
    await main.waitDom('.comic_wraCon img');
    return main.querySelectorAll('.comic_wraCon img').map(e => e.src);
  };
  const checkButton = selector => {
    const dom = main.querySelector(selector);
    if (dom && dom.innerText) return () => dom.click();
  };
  const isMangaPage = async () => {
    if (isListPageRe.test(window.location.pathname)) return handleListPage();
    return isMangaPageRe.test(window.location.pathname);
  };
  await main.universalInit({
    name: 'dmzj',
    getImgList,
    onExit: isEnd => isEnd && main.scrollIntoView('#hd'),
    getCommentList: async () => {
      const {
        comicId,
        chapterId
      } = await getId();
      return getViewpoint(comicId, chapterId);
    },
    SPA: {
      isMangaPage,
      getOnPrev: () => checkButton('.display_left #prev_chapter'),
      getOnNext: () => checkButton('.display_right #next_chapter')
    }
  });
})().catch(e => main.log.error(e));

        break;
      }
    case 'm.idmzj.com':
    case 'm.dmzj.com':
      {
const main = require('main');
const dmzjDecrypt = require('dmzjDecrypt');

/** 根据漫画 id 和章节 id 获取章节数据 */
const getChapterInfo = async (comicId, chapterId) => {
  const res = await main.request(`https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`, {
    errorText: '获取章节数据失败'
  });
  return JSON.parse(res.responseText);
};

/** 根据漫画 id 和章节 id 获取章节评论 */
const getViewpoint = async (comicId, chapterId) => {
  try {
    const res = await main.request(`https://manhua.dmzj.com/tpi/api/viewpoint/getViewpoint?type=0&type_id=${comicId}&chapter_id=${chapterId}&more=1`, {
      errorText: '获取章节评论失败'
    });

    // 还有另一个 api
    // http://v3api.dmzj.com/viewPoint/0/${comic_id}/${chapter_id}.json

    return JSON.parse(res.responseText).data.list.map(({
      title,
      num
    }) => `${title} [+${num}]`);
  } catch (_) {
    return [];
  }
};

(async () => {
  const {
    setManga,
    init
  } = await main.useInit('dmzj');

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info':
      {
        // 跳过正常漫画
        if (Reflect.has(unsafeWindow, 'obj_id')) return;
        const comicId = parseInt(window.location.pathname.split('/')[2], 10);
        if (Number.isNaN(comicId)) {
          document.body.childNodes[0].remove();
          main.insertNode(document.body, `
          请手动输入漫画名进行搜索 <br />
          <input type="search"> <button>搜索</button> <br />
          <div id="list" />
        `);
          main.querySelector('button').addEventListener('click', async () => {
            const comicName = main.querySelector('input')?.value;
            if (!comicName) return;
            const res = await main.request(`https://s.acg.dmzj.com/comicsum/search.php?s=${comicName}`, {
              errorText: '搜索漫画时出错'
            });
            const comicList = JSON.parse(res.responseText.slice(20, -1));
            main.querySelector('#list').innerHTML = comicList.map(({
              id,
              comic_name,
              comic_author,
              comic_url
            }) => `
                <b>《${comic_name}》<b/>——${comic_author}
                <a href="${comic_url}">Web端</a>
                <a href="https://m.dmzj.com/info/${id}.html">移动端</a>
              `).join('<br />');
          });
          return;
        }
        const res = await main.request(`https://v4api.idmzj.com/comic/detail/${comicId}?uid=2665531&disable_level=1`, {
          errorText: '获取漫画数据失败'
        });
        const {
          comicInfo: {
            last_updatetime,
            title,
            chapters
          }
        } = dmzjDecrypt(res.responseText);
        document.title = title;
        main.insertNode(document.body, `<h1>${title}</h1>`);
        Object.values(chapters).forEach(chapter => {
          // 手动构建添加章节 dom
          let temp = `<h2>${chapter.title}</h2>`;
          let i = chapter.data.length;
          while (i--) temp += `<a target="_blank" title="${chapter.data[i].chapter_title}" href="https://m.dmzj.com/view/${comicId}/${chapter.data[i].chapter_id}.html" ${chapter.data[i].updatetime === last_updatetime ? 'style="color:red"' : ''}>${chapter.data[i].chapter_title}</a>`;
          main.insertNode(document.body, temp);
        });
        document.body.childNodes[0].remove();
        await GM.addStyle(`
          h1 {
            margin: 0 -20vw;
          }

          h1,
          h2 {
            text-align: center;
          }

          body {
            padding: 0 20vw;
          }

          a {
            display: inline-block;

            min-width: 4em;
            margin: 0 1em;

            line-height: 2em;
            white-space: nowrap;
          }
        `);
        break;
      }
    case 'view':
      {
        // 如果不是隐藏漫画，直接进入阅读模式
        if (unsafeWindow.comic_id) {
          await GM.addStyle('.subHeader{display:none !important}');
          await main.universalInit({
            name: 'dmzj',
            getImgList: () => main.querySelectorAll('#commicBox img').map(e => e.getAttribute('data-original')).filter(src => src),
            getCommentList: () => getViewpoint(unsafeWindow.subId, unsafeWindow.chapterId),
            onNext: main.querySelectorClick('#loadNextChapter'),
            onPrev: main.querySelectorClick('#loadPrevChapter')
          });
          return;
        }
        const tipDom = document.createElement('p');
        tipDom.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
        document.body.appendChild(tipDom);
        let data;
        let comicId;
        let chapterId;
        try {
          [, comicId, chapterId] = /(\d+)\/(\d+)/.exec(window.location.pathname);
          data = await getChapterInfo(comicId, chapterId);
        } catch (error) {
          main.toast.error('获取漫画数据失败', {
            duration: Infinity
          });
          tipDom.innerText = error.message;
          throw error;
        }
        tipDom.innerText = `加载完成，即将进入阅读模式`;
        const {
          folder,
          chapter_name,
          next_chap_id,
          prev_chap_id,
          comic_id,
          page_url
        } = data;
        document.title = `${chapter_name} ${folder.split('/').at(1)}` ?? folder;
        setManga({
          // 进入阅读模式后禁止退出，防止返回空白页面
          onExit: () => {},
          onNext: next_chap_id ? () => {
            window.location.href = `https://m.dmzj.com/view/${comic_id}/${next_chap_id}.html`;
          } : undefined,
          onPrev: prev_chap_id ? () => {
            window.location.href = `https://m.dmzj.com/view/${comic_id}/${prev_chap_id}.html`;
          } : undefined,
          editButtonList: e => e
        });
        init(() => {
          if (page_url.length) return page_url;
          tipDom.innerHTML = `无法获得漫画数据，请通过 <a href="https://github.com/hymbz/ComicReadScript/issues" target="_blank">Github</a> 或 <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback#post-discussion" target="_blank">Greasy Fork</a> 进行反馈`;
          return [];
        });
        setManga('commentList', await getViewpoint(comicId, chapterId));
        break;
      }
  }
})().catch(e => main.log.error(e));

        break;
      }
    case 'www.idmzj.com':
    case 'www.dmzj.com':
      {
const main = require('main');

/** 根据漫画 id 和章节 id 获取章节数据 */
const getChapterInfo = async (comicId, chapterId) => {
  const res = await main.request(`https://m.dmzj.com/chapinfo/${comicId}/${chapterId}.html`, {
    errorText: '获取章节数据失败'
  });
  return JSON.parse(res.responseText);
};

const chapterIdRe = /(?<=\/)\d+(?=\.html)/;
const turnPage = chapterId => {
  if (!chapterId) return undefined;
  return () => {
    window.open(window.location.href.replace(/(?<=\/)\d+(?=\.html)/, `${chapterId}`), '_self');
  };
};
(async () => {
  await main.waitDom('.head_wz');
  // 只在漫画页内运行
  const comicId = main.querySelector('.head_wz [id]')?.id;
  const chapterId = window.location.pathname.match(chapterIdRe)?.[0];
  if (!comicId || !chapterId) return;
  const {
    setManga,
    init
  } = await main.useInit('dmzj');
  try {
    const {
      next_chap_id,
      prev_chap_id,
      page_url
    } = await getChapterInfo(comicId, chapterId);
    init(() => page_url);
    setManga({
      onNext: turnPage(next_chap_id),
      onPrev: turnPage(prev_chap_id)
    });
  } catch (_) {
    main.toast.error('获取漫画数据失败', {
      duration: Infinity
    });
  }
})().catch(e => main.log.error(e));

        break;
      }

    // #E-Hentai——「匹配 nhentai 漫画」
    case 'exhentai.org':
    case 'e-hentai.org':
      {
const main = require('main');

(async () => {
  const {
    options,
    init,
    setFab,
    setManga,
    dynamicUpdate,
    onLoading,
    mangaProps
  } = await main.useInit('ehentai', {
    /** 关联 nhentai */
    associate_nhentai: true,
    /** 快捷键翻页 */
    hotkeys_page_turn: true,
    /** 识别广告 */
    detect_ad: true,
    autoShow: false
  });
  if (Reflect.has(unsafeWindow, 'mpvkey')) {
    const imgEleList = main.querySelectorAll('.mi0[id]');
    init(dynamicUpdate(setImg => main.plimit(imgEleList.map((ele, i) => async () => {
      const getUrl = () => ele.querySelector('img')?.src;
      if (!getUrl()) unsafeWindow.load_image(i + 1);
      unsafeWindow.next_possible_request = 0;
      const imgUrl = await main.wait(getUrl);
      setImg(i, imgUrl);
    }), undefined, 4), imgEleList.length));
    return;
  }

  // 不是漫画页的话
  if (!Reflect.has(unsafeWindow, 'apikey')) {
    if (options.hotkeys_page_turn) {
      main.linstenKeyup(e => {
        switch (e.key) {
          case 'ArrowRight':
          case 'd':
            main.querySelector('#dnext')?.click();
            break;
          case 'ArrowLeft':
          case 'a':
            main.querySelector('#dprev')?.click();
            break;
        }
      });
    }
    return;
  }

  // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
  main.insertNode(document.getElementById('gd5'), '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>');
  const comicReadModeDom = document.getElementById('comicReadMode');
  const getImgFromImgPageRe = /id="img" src="(.+?)"/;

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async url => {
    const res = await main.request(url, {
      errorText: main.t('site.ehentai.fetch_img_page_source_failed')
    });
    try {
      return res.responseText.match(getImgFromImgPageRe)[1];
    } catch (error) {
      throw new Error(main.t('site.ehentai.fetch_img_url_failed'));
    }
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe = /<a href="(.{20,50})"><img alt=.+?title=".+?: (.+?)"/gm;

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (pageNum = 0) => {
    const res = await main.request(`${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`, {
      errorText: main.t('site.ehentai.fetch_img_page_url_failed')
    });

    // 从详情页获取图片页的地址
    const reRes = res.responseText.matchAll(getImgFromDetailsPageRe);
    if (reRes === null) {
      if (res.responseText.includes('Your IP address has been temporarily banned for excessive')) throw new Error(main.t('site.ehentai.ip_banned'));
      throw new Error(main.t('site.ehentai.fetch_img_page_url_failed'));
    }
    return [...reRes].map(([, url, fileName]) => [url, fileName]);
  };
  const getImgNum = async () => {
    let numText = main.querySelector('.gtb .gpc')?.textContent?.replaceAll(',', '').match(/\d+/g)?.at(-1);
    if (numText) return +numText;
    const res = await main.request(window.location.href);
    numText = res.responseText.match(/(?<=<td class="gdt2">)\d+(?= pages<\/td>)/)?.[0];
    if (numText) return +numText;
    main.toast.error(main.t('site.changed_load_failed'));
    return 0;
  };
  const totalImgNum = await getImgNum();
  const placeValueNum = `${totalImgNum}`.length;
  const ehImgList = [];
  const ehImgPageList = [];
  const ehImgFileNameList = [];
  const setStyle = main.createStyle();
  main.createEffectOn(() => [...(mangaProps.adList ?? [])], () => {
    if (!mangaProps.adList?.size) return;
    setStyle([...mangaProps.adList].map(i => {
      const alt = `${i + 1}`.padStart(placeValueNum, '0');
      return `img[alt="${alt}"]:not(:hover) { filter: blur(8px); clip-path: border-box; }`;
    }).join('\n'));
  });
  const enableDetectAd = options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (enableDetectAd) {
    setManga('adList', new main.ReactiveSet());
    /** 缩略图元素列表 */
    const thumbnailEleList = [];
    main.querySelectorAll('.gdtl img').forEach(e => {
      const index = +e.alt - 1;
      if (Number.isNaN(index)) return;
      thumbnailEleList[index] = e;
      // 根据当前显示的图片获取一部分文件名
      [, ehImgFileNameList[index]] = e.title.split(/：|: /);
    });
    // 先根据文件名判断一次
    await main.getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
    // 不行的话再用缩略图识别
    if (!mangaProps.adList.size) await main.getAdPageByContent(thumbnailEleList, mangaProps.adList);
  }
  const {
    loadImgList
  } = init(dynamicUpdate(async setImg => {
    comicReadModeDom.innerHTML = ` loading`;
    const totalPageNum = +main.querySelector('.ptt td:nth-last-child(2)').textContent;
    for (let pageNum = 0; pageNum < totalPageNum; pageNum++) {
      const startIndex = ehImgList.length;
      const imgPageUrlList = await getImgFromDetailsPage(pageNum);
      await main.plimit(imgPageUrlList.map(([imgPageUrl, fileName], i) => async () => {
        const imgUrl = await getImgFromImgPage(imgPageUrl);
        const index = startIndex + i;
        ehImgList[index] = imgUrl;
        ehImgPageList[index] = imgPageUrl;
        ehImgFileNameList[index] = fileName;
        setImg(index, imgUrl);
      }), async _doneNum => {
        const doneNum = startIndex + _doneNum;
        setFab({
          progress: doneNum / totalImgNum,
          tip: `${main.t('other.loading_img')} - ${doneNum}/${totalImgNum}`
        });
        comicReadModeDom.innerHTML = ` loading - ${doneNum}/${totalImgNum}`;
        if (doneNum === totalImgNum) {
          comicReadModeDom.innerHTML = ` Read`;
          if (enableDetectAd) {
            await main.getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
            await main.getAdPageByContent(ehImgList, mangaProps.adList);
          }
        }
      });
    }
  }, totalImgNum));

  /** 获取新的图片页地址 */
  const getNewImgPageUrl = async url => {
    const res = await main.request(url, {
      errorText: main.t('site.ehentai.fetch_img_page_source_failed')
    });
    const nl = res.responseText.match(/nl\('(.+?)'\)/)?.[1];
    if (!nl) throw new Error(main.t('site.ehentai.fetch_img_url_failed'));
    const newUrl = new URL(url);
    newUrl.searchParams.set('nl', nl);
    return newUrl.href;
  };

  /** 刷新指定图片 */
  const reloadImg = async i => {
    const pageUrl = await getNewImgPageUrl(ehImgPageList[i]);
    let imgUrl = '';
    while (!imgUrl || !(await main.testImgUrl(imgUrl))) imgUrl = await getImgFromImgPage(pageUrl);
    ehImgList[i] = imgUrl;
    ehImgPageList[i] = pageUrl;
    setManga('imgList', i, imgUrl);
  };

  /** 判断当前显示的是否是 eh 源 */
  const isShowEh = () => main.store.imgList[0]?.src === ehImgList[0];

  /** 刷新所有错误图片 */
  const reloadErrorImg = main.singleThreaded(() => main.plimit(main.store.imgList.map(({
    loadType
  }, i) => () => {
    if (loadType !== 'error' || !isShowEh()) return;
    return reloadImg(i);
  })));
  setManga({
    onExit: isEnd => {
      if (isEnd) main.scrollIntoView('#cdiv');
      setManga('show', false);
    },
    // 在图片加载出错时刷新图片
    onLoading: async (imgList, img) => {
      onLoading(imgList, img);
      if (!img) return;
      if (img.loadType !== 'error' || (await main.testImgUrl(img.src))) return;
      return reloadErrorImg();
    }
  });
  setFab('initialShow', options.autoShow);
  comicReadModeDom.addEventListener('click', () => loadImgList(ehImgList.length ? ehImgList : undefined, true));
  if (options.hotkeys_page_turn) {
    main.linstenKeyup(e => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          main.querySelector('.ptt td:last-child:not(.ptdd)')?.click();
          break;
        case 'ArrowLeft':
        case 'a':
          main.querySelector('.ptt td:first-child:not(.ptdd)')?.click();
          break;
      }
    });
  }
  if (options.associate_nhentai) {
    const titleDom = document.getElementById('gn');
    const taglistDom = main.querySelector('#taglist tbody');
    if (!titleDom || !taglistDom) {
      main.toast.error(main.t('site.ehentai.html_changed_nhentai_failed'));
      return;
    }
    const title = encodeURI(titleDom.innerText);
    const newTagLine = document.createElement('tr');
    let res;
    try {
      res = await main.request(`https://nhentai.net/api/galleries/search?query=${title}`, {
        errorText: main.t('site.ehentai.nhentai_error'),
        noTip: true
      });
    } catch (_) {
      newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        ${main.t('site.ehentai.nhentai_failed', {
        nhentai: `<a href='https://nhentai.net/search/?q=${title}' target="_blank" ><u>nhentai</u></a>`
      })}
      </td>`;
      taglistDom.appendChild(newTagLine);
      return;
    }
    const nHentaiComicInfo = JSON.parse(res.responseText);

    // 构建新标签行
    if (nHentaiComicInfo.result.length) {
      let temp = '<td class="tc">nhentai:</td><td>';
      let i = nHentaiComicInfo.result.length;
      while (i) {
        i -= 1;
        const tempComicInfo = nHentaiComicInfo.result[i];
        const _title = tempComicInfo.title.japanese ? tempComicInfo.title.japanese : tempComicInfo.title.english;
        temp += `
          <div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${_title}">
            <a
              href="https://nhentai.net/g/${tempComicInfo.id}/"
              onClick="return toggle_tagmenu(1, 'nhentai:${tempComicInfo.id}',this)"
              nhentai-index=${i}
            >
              ${tempComicInfo.id}
            </a>
          </div>`;
      }
      newTagLine.innerHTML = `${temp}</td>`;
    } else newTagLine.innerHTML = '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';
    taglistDom.appendChild(newTagLine);

    // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
    const nhentaiImgList = {};
    const raw_refresh_tagmenu_act = unsafeWindow._refresh_tagmenu_act;
    unsafeWindow._refresh_tagmenu_act = function _refresh_tagmenu_act(a) {
      if (a.hasAttribute('nhentai-index')) {
        const tagmenu_act_dom = document.getElementById('tagmenu_act');
        tagmenu_act_dom.innerHTML = ['', `<a href="${a.href}" target="_blank"> Jump to nhentai</a>`, `<a href="#"> ${nhentaiImgList[selected_tagname] ? 'Read' : 'Load comic'}</a>`].join('<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">">');
        const nhentaiComicReadButton = tagmenu_act_dom.querySelector('a[href="#"]');
        const {
          media_id,
          num_pages,
          images
        } = nHentaiComicInfo.result[+a.getAttribute('nhentai-index')];
        // nhentai api 对应的扩展名
        const fileType = {
          j: 'jpg',
          p: 'png',
          g: 'gif'
        };
        const showNhentaiComic = init(dynamicUpdate(async setImg => {
          nhentaiComicReadButton.innerHTML = ` loading - 0/${num_pages}`;
          nhentaiImgList[selected_tagname] = await main.plimit(images.pages.map((page, i) => async () => {
            const imgRes = await main.request(`https://i.nhentai.net/galleries/${media_id}/${i + 1}.${fileType[page.t]}`, {
              headers: {
                Referer: `https://nhentai.net/g/${media_id}`
              },
              responseType: 'blob'
            });
            const blobUrl = URL.createObjectURL(imgRes.response);
            setImg(i, blobUrl);
            return blobUrl;
          }), (doneNum, totalNum) => {
            nhentaiComicReadButton.innerHTML = ` loading - ${doneNum}/${totalNum}`;
          });
          nhentaiComicReadButton.innerHTML = ' Read';
        }, num_pages)).showComic;

        // 加载 nhentai 漫画
        nhentaiComicReadButton.addEventListener('click', showNhentaiComic);
      }
      // 非 nhentai 标签列的用原函数去处理
      else raw_refresh_tagmenu_act(a);
    };
  }
})().catch(e => main.log.error(e));

        break;
      }

    // #nhentai——「彻底屏蔽漫画、自动翻页」
    case 'nhentai.net':
      {
const main = require('main');

/** 用于转换获得图片文件扩展名 */
const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif'
};
(async () => {
  const {
    options,
    setFab,
    setManga,
    init
  } = await main.useInit('nhentai', {
    /** 自动翻页 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true
  });

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit: isEnd => {
        if (isEnd) main.scrollIntoView('#comment-container');
        setManga('show', false);
      }
    });

    // 虽然有 Fab 了不需要这个按钮，但我自己都点习惯了没有还挺别扭的（
    main.insertNode(document.getElementById('download').parentNode, '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Read</a>');
    const comicReadModeDom = document.getElementById('comicReadMode');
    const {
      showComic
    } = init(() => gallery.images.pages.map(({
      number,
      extension
    }) => `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`));
    setFab('initialShow', options.autoShow);
    comicReadModeDom.addEventListener('click', showComic);
    return;
  }

  // 在漫画浏览页
  if (document.getElementsByClassName('gallery').length) {
    if (options.open_link_new_page) main.querySelectorAll('a:not([href^="javascript:"])').forEach(e => e.setAttribute('target', '_blank'));
    const blacklist = (unsafeWindow?._n_app ?? unsafeWindow?.n)?.options?.blacklisted_tags;
    if (blacklist === undefined) main.toast.error(main.t('site.nhentai.tag_blacklist_fetch_failed'));
    // blacklist === null 时是未登录

    if (options.block_totally && blacklist?.length) await GM.addStyle('.blacklisted.gallery { display: none; }');
    if (options.auto_page_turn) {
      await GM.addStyle(`
        hr { bottom: 0; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);
      let pageNum = Number(main.querySelector('.page.current')?.innerHTML ?? '');
      if (Number.isNaN(pageNum)) return;
      let loadLock = !pageNum;
      const contentDom = document.getElementById('content');
      const apiUrl = (() => {
        if (window.location.pathname === '/') return 'https://nhentai.net/api/galleries/all?';
        if (main.querySelector('a.tag')) return `https://nhentai.net/api/galleries/tagged?tag_id=${main.querySelector('a.tag')?.classList[1].split('-')[1]}&`;
        if (window.location.pathname.includes('search')) return `https://nhentai.net/api/galleries/search?query=${new URLSearchParams(window.location.search).get('q')}&`;
        return '';
      })();
      const loadNewComic = async () => {
        if (loadLock || contentDom.lastElementChild.getBoundingClientRect().top > window.innerHeight) return undefined;
        loadLock = true;
        pageNum += 1;
        const res = await main.request(`${apiUrl}page=${pageNum}${window.location.pathname.includes('popular') ? '&sort=popular ' : ''}`, {
          errorText: main.t('site.nhentai.fetch_next_page_failed')
        });
        const {
          result,
          num_pages
        } = JSON.parse(res.responseText);
        let comicDomHtml = '';
        result.forEach(comic => {
          const blacklisted = comic.tags.some(tag => blacklist?.includes(tag.id));
          comicDomHtml += `<div class="gallery${blacklisted ? ' blacklisted' : ''}" data-tags="${comic.tags.map(e => e.id).join(' ')}"><a ${options.open_link_new_page ? 'target="_blank"' : ''} href="/g/${comic.id}/" class="cover" style="padding:0 0 ${comic.images.thumbnail.h / comic.images.thumbnail.w * 100}% 0"><img is="lazyload-image" class="" width="${comic.images.thumbnail.w}" height="${comic.images.thumbnail.h}" src="https://t.nhentai.net/galleries/${comic.media_id}/thumb.${fileType[comic.images.thumbnail.t]}"><div class="caption">${comic.title.english}</div></a></div>`;
        });

        // 构建页数按钮
        if (comicDomHtml) {
          const target = options.open_link_new_page ? 'target="_blank" ' : '';
          const pageNumDom = [];
          for (let i = pageNum - 5; i <= pageNum + 5; i += 1) {
            if (i > 0 && i <= num_pages) pageNumDom.push(`<a ${target}href="?page=${i}" class="page${i === pageNum ? ' current' : ''}">${i}</a>`);
          }
          main.insertNode(contentDom, `<h1>${pageNum}</h1>
             <div class="container index-container">${comicDomHtml}</div>
             <section class="pagination">
              <a ${target}href="?page=1" class="first">
                <i class="fa fa-chevron-left"></i>
                <i class="fa fa-chevron-left"></i>
              </a>
              <a ${target}href="?page=${pageNum - 1}" class="previous">
                <i class="fa fa-chevron-left"></i>
              </a>
              ${pageNumDom.join('')}
                ${pageNum === num_pages ? '' : `<a ${target}shref="?page=${pageNum + 1}" class="next">
                        <i class="fa fa-chevron-right"></i>
                      </a>
                      <a ${target}href="?page=${num_pages}" class="last">
                        <i class="fa fa-chevron-right"></i>
                        <i class="fa fa-chevron-right"></i>
                      </a>`}
              </section>`);
        }

        // 添加分隔线
        contentDom.appendChild(document.createElement('hr'));
        if (pageNum < num_pages) loadLock = false;else contentDom.lastElementChild.style.animationPlayState = 'paused';

        // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
        if (!comicDomHtml || contentDom.offsetHeight < document.body.offsetHeight) return loadNewComic();
        return undefined;
      };
      window.addEventListener('scroll', loadNewComic);
      if (main.querySelector('section.pagination')) contentDom.appendChild(document.createElement('hr'));
      await loadNewComic();
    }
  }
})().catch(e => main.log.error(e));

        break;
      }

    // #Yurifans——「自动签到」
    case 'yuri.website':
      {
const main = require('main');

(async () => {
  const {
    options,
    setManga,
    init,
    needAutoShow
  } = await main.useInit('yurifans', {
    自动签到: true
  });

  // 自动签到
  if (options.自动签到) (async () => {
    // 跳过未登录的情况
    if (typeof b2token === 'undefined' || !b2token) return;
    const todayString = new Date().toLocaleDateString('zh-CN');
    // 判断当前日期与上次成功签到日期是否相同
    if (todayString === localStorage.getItem('signDate')) return;
    try {
      const res = await main.request('/wp-json/b2/v1/userMission', {
        method: 'POST',
        noTip: true,
        headers: {
          Authorization: `Bearer ${b2token}`
        }
      });
      const data = JSON.parse(res.responseText);

      // 首次成功签到 或 重复签到
      if (!(data?.mission?.date || !Number.isNaN(+data))) throw new Error('签到失败');
      main.toast('自动签到成功');
      localStorage.setItem('signDate', todayString);
    } catch (e) {
      main.toast.error('自动签到失败');
    }
  })();

  // 跳过漫画区外的页面
  if (!main.querySelector('a.post-list-cat-item[title="在线区-漫画"]')) return;

  // 需要购买的漫画
  if (main.querySelector('.content-hidden')) {
    const imgBody = main.querySelector('.content-hidden');
    const imgList = imgBody.getElementsByTagName('img');
    if (await main.wait(() => imgList.length, 1000)) init(() => [...imgList].map(e => e.src));
    return;
  }

  // 有折叠内容的漫画
  if (main.querySelector('.xControl')) {
    needAutoShow.val = false;
    const {
      loadImgList
    } = init(() => []);
    const imgListMap = [];
    const loadChapterImg = i => {
      const imgList = imgListMap[i];
      loadImgList([...imgList].map(e => e.getAttribute('data-src')), true);
      setManga({
        onPrev: i === 0 ? undefined : () => loadChapterImg(i - 1),
        onNext: i === imgListMap.length - 1 ? undefined : () => loadChapterImg(i + 1)
      });
    };
    main.querySelectorAll('.xControl > a').forEach((a, i) => {
      const imgRoot = a.parentElement.nextElementSibling;
      imgListMap.push(imgRoot.getElementsByTagName('img'));
      a.addEventListener('click', () => {
        // 只在打开折叠内容时进入阅读模式
        if (imgRoot.style.display === 'none' || imgRoot.style.height && imgRoot.style.height.split('.')[0].length <= 2) loadChapterImg(i);
      });
    });
    return;
  }

  // 没有折叠的单篇漫画
  await main.wait(() => main.querySelectorAll('.entry-content img').length);
  return init(() => main.querySelectorAll('.entry-content img').map(e => e.src));
})();

        break;
      }

    // #拷贝漫画(copymanga)——「显示最后阅读记录」
    case 'mangacopy.com':
    case 'copymanga.site':
    case 'copymanga.info':
    case 'copymanga.net':
    case 'copymanga.org':
    case 'copymanga.tv':
    case 'copymanga.com':
    case 'www.mangacopy.com':
    case 'www.copymanga.site':
    case 'www.copymanga.info':
    case 'www.copymanga.net':
    case 'www.copymanga.org':
    case 'www.copymanga.tv':
    case 'www.copymanga.com':
      {
const main = require('main');

const apiList = ['https://api.copymanga.info', 'https://api.copymanga.net', 'https://api.copymanga.org', 'https://api.copymanga.tv', 'https://api.xsskc.com', 'https://api.mangacopy.com', 'https://api.copymanga.site'];

const api = (url, details) => main.eachApi(url, apiList, details);
(() => {
  const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token='))?.replace('token=', '');
  if (window.location.href.includes('/chapter/')) {
    const [,, name,, id] = window.location.pathname.split('/');
    const headers = {
      webp: '1',
      region: '1',
      'User-Agent': 'COPY/2.0.7|',
      version: '2.0.7',
      source: 'copyApp',
      referer: 'com.copymanga.app-2.0.7'
    };
    if (token) Reflect.set(headers, 'Authorization', `Token ${token}`);
    const getImgList = async () => {
      const res = await api(`/api/v3/comic/${name}/chapter2/${id}?platform=3`, {
        headers
      });
      const data = JSON.parse(res.responseText);
      const imgList = [];
      const {
        words,
        contents
      } = data.results.chapter;
      for (let i = 0; i < contents.length; i++) imgList[words[i]] = contents[i].url.replace('.c800x.', '.c1500x.');
      return imgList;
    };
    options = {
      name: 'copymanga',
      getImgList,
      onNext: main.querySelectorClick('.comicContent-next a:not(.prev-null)'),
      onPrev: main.querySelectorClick('.comicContent-prev:not(.index,.list) a:not(.prev-null)'),
      getCommentList: async () => {
        const chapter_id = window.location.pathname.split('/').at(-1);
        const res = await api(`/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`, {
          errorText: '获取漫画评论失败'
        });
        return JSON.parse(res.responseText).results.list.map(({
          comment
        }) => comment);
      }
    };
    return;
  }

  // 在目录页显示上次阅读记录
  if (window.location.href.includes('/comic/')) {
    const comicName = window.location.href.split('/comic/')[1];
    if (!comicName || !token) return;
    let a;
    const setStyle = main.createStyle();
    const updateLastChapter = async () => {
      // 因为拷贝漫画的目录是动态加载的，所以要等目录加载出来再往上添加
      if (!a) (async () => {
        a = document.createElement('a');
        const tableRight = await main.wait(() => main.querySelector('.table-default-right'));
        a.target = '_blank';
        tableRight.insertBefore(a, tableRight.firstElementChild);
        const span = document.createElement('span');
        span.textContent = '最後閱讀：';
        tableRight.insertBefore(span, tableRight.firstElementChild);
      })();
      a.textContent = '獲取中';
      a.removeAttribute('href');
      const res = await api(`/api/v3/comic2/${comicName}/query?platform=3`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const data = JSON.parse(res.response);
      if (data?.results?.browse === null) {
        a.textContent = '無';
        return;
      }
      const lastChapterId = data?.results?.browse?.chapter_id;
      if (!lastChapterId) {
        a.textContent = '接口異常';
        return;
      }
      setStyle(`ul a[href*="${lastChapterId}"] {
        color: #fff !important;
        background: #1790E6;
      }`);
      a.href = `${window.location.pathname}/chapter/${lastChapterId}`;
      a.textContent = data?.results?.browse?.chapter_name;
    };
    updateLastChapter();
    document.addEventListener('visibilitychange', updateLastChapter);
  }
})();

        break;
      }

    // #[PonpomuYuri](https://www.ponpomu.com)
    case 'www.ponpomu.com':
      {
        options = {
          name: 'terraHistoricus',
          wait: () => !!main.querySelector('.comic-page-container img'),
          getImgList: () => main.querySelectorAll('.comic-page-container img').map(e => e.getAttribute('data-srcset')),
          SPA: {
            isMangaPage: () => window.location.href.includes('/comic/'),
            getOnPrev: () => main.querySelectorClick('.prev-btn:not(.invisible) a'),
            getOnNext: () => main.querySelectorClick('.next-btn:not(.invisible) a')
          }
        };
        break;
      }

    // #[明日方舟泰拉记事社](https://terra-historicus.hypergryph.com)
    case 'terra-historicus.hypergryph.com':
      {
        const apiUrl = () => `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;
        const getImgUrl = i => async () => {
          const res = await main.request(`${apiUrl()}/page?pageNum=${i + 1}`);
          return JSON.parse(res.response).data.url;
        };
        options = {
          name: 'terraHistoricus',
          wait: () => !!main.querySelector('.HG_COMIC_READER_main'),
          getImgList: async ({
            setFab
          }) => {
            const res = await main.request(apiUrl());
            const pageList = JSON.parse(res.response).data.pageInfos;
            if (pageList.length === 0 && window.location.pathname.includes('episode')) throw new Error('获取图片列表时出错');
            return main.plimit([...Array(pageList.length).keys()].map(getImgUrl), (doneNum, totalNum) => {
              setFab({
                progress: doneNum / totalNum,
                tip: `加载图片中 - ${doneNum}/${totalNum}`
              });
            });
          },
          SPA: {
            isMangaPage: () => window.location.href.includes('episode'),
            getOnPrev: () => main.querySelectorClick('footer .HG_COMIC_READER_prev a'),
            getOnNext: () => main.querySelectorClick('footer .HG_COMIC_READER_prev+.HG_COMIC_READER_buttonEp a')
          }
        };
        break;
      }

    // #[禁漫天堂](https://18comic.vip)
    case 'jmcomic.me':
    case '18comic-ff7rebirth.art':
    case '18comic-ff7rebirth.quest':
    case '18comic.org':
    case '18comic.vip':
      {
const main = require('main');

// 已知问题：某些漫画始终会有几页在下载原图时出错
// 并且这类漫画下即使关掉脚本，也还是会有几页就是加载不出来
// 比较神秘的是这两种情况下加载不出来的图片还不一样
// 并且在多次刷新的情况下都是那几张图片加载不出来
// 另外这类漫画也有概率出现，在关闭脚本的情况下所有图片都加载不出来的情况，只能刷新
// 就很怪
// 对此只能放弃
(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;
  const {
    init,
    setManga,
    setFab,
    dynamicUpdate,
    mangaProps
  } = await main.useInit('jm');
  while (!unsafeWindow?.onImageLoaded) {
    if (document.readyState === 'complete') {
      main.toast.error('无法获取图片', {
        duration: Infinity
      });
      return;
    }
    await main.sleep(100);
  }
  setManga({
    onPrev: main.querySelectorClick(() => main.querySelector('.menu-bolock-ul .fa-angle-double-left')?.parentElement),
    onNext: main.querySelectorClick(() => main.querySelector('.menu-bolock-ul .fa-angle-double-right')?.parentElement)
  });
  const imgEleList = main.querySelectorAll('.scramble-page:not(.thewayhome) > img');

  // 判断当前漫画是否有被分割，没有就直接获取图片链接加载
  // 判断条件来自页面上的 scramble_image 函数
  if (unsafeWindow.aid < unsafeWindow.scramble_id || unsafeWindow.speed === '1') {
    init(() => imgEleList.map(e => e.getAttribute('data-original')));
    return;
  }
  const getImgUrl = async imgEle => {
    if (imgEle.src.startsWith('blob:')) return imgEle.src;
    const originalUrl = imgEle.src;
    const res = await main.request(imgEle.getAttribute('data-original'), {
      responseType: 'blob',
      revalidate: true,
      fetch: true
    });
    if (!res.response.size) {
      main.toast.warn(`下载原图时出错: ${imgEle.getAttribute('data-page')}`);
      return '';
    }
    imgEle.src = URL.createObjectURL(res.response);
    const err = await main.waitImgLoad(imgEle);
    if (err) {
      URL.revokeObjectURL(imgEle.src);
      imgEle.src = originalUrl;
      main.toast.warn(`加载原图时出错: ${imgEle.getAttribute('data-page')}`);
      return '';
    }
    try {
      unsafeWindow.onImageLoaded(imgEle);
      const blob = await main.canvasToBlob(imgEle.nextElementSibling, 'image/webp', 1);
      URL.revokeObjectURL(imgEle.src);
      if (!blob) throw new Error('');
      return `${URL.createObjectURL(blob)}#.webp`;
    } catch (error) {
      imgEle.src = originalUrl;
      main.toast.warn(`转换图片时出错: ${imgEle.getAttribute('data-page')}`);
      return '';
    }
  };

  // 先等懒加载触发完毕
  await main.wait(() => main.querySelectorAll('.lazy-loaded.hide').length && main.querySelectorAll('.lazy-loaded.hide').length === main.querySelectorAll('canvas').length);
  init(dynamicUpdate(setImg => main.plimit(imgEleList.map((img, i) => async () => setImg(i, await getImgUrl(img))), (doneNum, totalNum) => {
    setFab({
      progress: doneNum / totalNum,
      tip: `加载图片中 - ${doneNum}/${totalNum}`
    });
  }), imgEleList.length));
  const retry = async (num = 0) => {
    for (let i = 0; i < imgEleList.length; i++) {
      if (mangaProps.imgList[i]) continue;
      setManga('imgList', i, await getImgUrl(imgEleList[i]));
      await main.sleep(1000);
    }
    if (num < 60 && mangaProps.imgList.some(url => !url)) setTimeout(retry, 1000 * 5, num + 1);
  };
  retry();
})().catch(e => main.log.error(e));

        break;
      }

    // #[漫画柜(manhuagui)](https://www.manhuagui.com)
    case 'tw.manhuagui.com':
    case 'm.manhuagui.com':
    case 'www.mhgui.com':
    case 'www.manhuagui.com':
      {
        if (!/\/comic\/\d+\/\d+\.html/.test(window.location.pathname)) break;
        let comicInfo;
        try {
          const dataScript = main.querySelector('body > script:not([src])');
          comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // eslint-disable-next-line no-eval
          eval(dataScript.innerHTML.slice(26)).match(/(?<=.*?\()\{.+\}/)[0]);
        } catch (error) {
          main.toast.error(main.t('site.changed_load_failed'));
          break;
        }

        // 让切换章节的提示可以显示在漫画页上
        GM.addStyle(`#smh-msg-box { z-index: 2147483647 !important }`);
        const handlePrevNext = cid => {
          if (cid === 0) return undefined;
          const newUrl = window.location.pathname.replace(/(?<=\/)\d+(?=\.html)/, `${cid}`);
          return () => window.location.assign(newUrl);
        };
        options = {
          name: 'manhuagui',
          getImgList: () => {
            const sl = Object.entries(comicInfo.sl).map(attr => `${attr[0]}=${attr[1]}`).join('&');
            if (comicInfo.files) return comicInfo.files.map(file => `${unsafeWindow.pVars.manga.filePath}${file}?${sl}`);
            if (comicInfo.images) {
              const {
                origin
              } = new URL(main.querySelector('#manga img').src);
              return comicInfo.images.map(url => `${origin}${url}?${sl}`);
            }
            main.toast.error(main.t('site.changed_load_failed'), {
              throw: true
            });
            return [];
          },
          onNext: handlePrevNext(comicInfo.nextId),
          onPrev: handlePrevNext(comicInfo.prevId)
        };
        break;
      }

    // #[漫画DB(manhuadb)](https://www.manhuadb.com)
    case 'www.manhuadb.com':
      {
        if (!Reflect.has(unsafeWindow, 'img_data_arr')) break;
        options = {
          name: 'manhuaDB',
          getImgList: () => unsafeWindow.img_data_arr.map(data => `${unsafeWindow.img_host}/${unsafeWindow.img_pre}/${data.img}`),
          onPrev: () => unsafeWindow.goNumPage('pre'),
          onNext: () => unsafeWindow.goNumPage('next')
        };
        break;
      }

    // #[动漫屋(dm5)](https://www.dm5.com)
    case 'www.manhuaren.com':
    case 'm.1kkk.com':
    case 'www.1kkk.com':
    case 'tel.dm5.com':
    case 'en.dm5.com':
    case 'www.dm5.cn':
    case 'www.dm5.com':
      {
        if (!Reflect.has(unsafeWindow, 'DM5_CID')) break;
        const imgNum = unsafeWindow.DM5_IMAGE_COUNT ?? unsafeWindow.imgsLen;
        if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
          main.toast.error(main.t('site.changed_load_failed'));
          break;
        }
        const getPageImg = async i => {
          const res = await unsafeWindow.$.ajax({
            type: 'GET',
            url: 'chapterfun.ashx',
            data: {
              cid: unsafeWindow.DM5_CID,
              page: i,
              key: unsafeWindow.$('#dm5_key').length ? unsafeWindow.$('#dm5_key').val() : '',
              language: 1,
              gtk: 6,
              _cid: unsafeWindow.DM5_CID,
              _mid: unsafeWindow.DM5_MID,
              _dt: unsafeWindow.DM5_VIEWSIGN_DT,
              _sign: unsafeWindow.DM5_VIEWSIGN
            }
          });
          // eslint-disable-next-line no-eval
          return eval(res);
        };
        const handlePrevNext = (pcSelector, mobileText) => main.querySelectorClick(() => main.querySelector(pcSelector) ?? main.querySelectorAll('.view-bottom-bar a').find(e => e.innerText.includes(mobileText)));
        options = {
          name: 'dm5',
          getImgList: ({
            dynamicUpdate
          }) => {
            // manhuaren 和 1kkk 的移动端上会直接用一个变量存储所有图片的链接
            if (Array.isArray(unsafeWindow.newImgs) && unsafeWindow.newImgs.every(main.isUrl)) return unsafeWindow.newImgs;
            return dynamicUpdate(async setImg => {
              let imgIndex = 0;
              while (imgIndex < imgNum) {
                const newImgs = await getPageImg(imgIndex + 1);
                // eslint-disable-next-line no-loop-func
                newImgs.forEach(url => setImg(imgIndex++, url));
              }
            }, imgNum)();
          },
          onPrev: handlePrevNext('.logo_1', '上一章'),
          onNext: handlePrevNext('.logo_2', '下一章'),
          onExit: isEnd => isEnd && main.scrollIntoView('.postlist')
        };
        break;
      }

    // #[绅士漫画(wnacg)](https://www.wnacg.com)
    case 'www.hm15.lol':
    case 'www.hm16.lol':
    case 'www.wnacg.com':
    case 'wnacg.com':
      {
        // 突出显示下拉阅读的按钮
        const buttonDom = main.querySelector('#bodywrap a.btn');
        if (buttonDom) {
          buttonDom.style.setProperty('background-color', '#607d8b');
          buttonDom.style.setProperty('background-image', 'none');
        }
        if (!Reflect.has(unsafeWindow, 'imglist')) break;
        options = {
          name: 'wnacg',
          getImgList: () => unsafeWindow.imglist.filter(({
            caption
          }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！').map(({
            url
          }) => new URL(url, window.location.origin).href)
        };
        break;
      }

    // #[mangabz](https://mangabz.com)
    case 'www.mangabz.com':
    case 'mangabz.com':
      {
        if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) break;
        const imgNum = unsafeWindow.MANGABZ_IMAGE_COUNT ?? unsafeWindow.imgsLen;
        if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
          main.toast.error(main.t('site.changed_load_failed'));
          break;
        }
        const getPageImg = async i => {
          const res = await unsafeWindow.$.ajax({
            type: 'GET',
            url: 'chapterimage.ashx',
            data: {
              cid: unsafeWindow.MANGABZ_CID,
              page: i,
              key: '',
              _cid: unsafeWindow.MANGABZ_CID,
              _mid: unsafeWindow.MANGABZ_MID,
              _dt: unsafeWindow.MANGABZ_VIEWSIGN_DT,
              _sign: unsafeWindow.MANGABZ_VIEWSIGN
            }
          });
          // eslint-disable-next-line no-eval
          return eval(res);
        };
        const handlePrevNext = (pcSelector, mobileText) => main.querySelectorClick(() => main.querySelector(pcSelector) ?? main.querySelectorAll('.bottom-bar-tool a').find(e => e.innerText.includes(mobileText)));
        options = {
          name: 'mangabz',
          getImgList: ({
            dynamicUpdate
          }) => dynamicUpdate(async setImg => {
            let imgIndex = 0;
            while (imgIndex < imgNum) {
              const newImgs = await getPageImg(imgIndex + 1);
              // eslint-disable-next-line no-loop-func
              newImgs.forEach(url => setImg(imgIndex++, url));
            }
          }, imgNum)(),
          onNext: handlePrevNext('body > .container a[href^="/"]:last-child', '下一'),
          onPrev: handlePrevNext('body > .container a[href^="/"]:first-child', '上一')
        };
        break;
      }

    // #[komiic](https://komiic.com)
    case 'komiic.com':
      {
        const query = `
        query imagesByChapterId($chapterId: ID!) {
          imagesByChapterId(chapterId: $chapterId) {
            id
            kid
            height
            width
            __typename
          }
        }`;
        const getImgList = async () => {
          const chapterId = window.location.pathname.match(/chapter\/(\d+)/)?.[1];
          if (!chapterId) throw new Error(main.t('site.changed_load_failed'));
          const res = await main.request('/api/query', {
            method: 'POST',
            headers: {
              'content-type': 'application/json'
            },
            data: JSON.stringify({
              operationName: 'imagesByChapterId',
              variables: {
                chapterId: `${chapterId}`
              },
              query
            })
          });
          return JSON.parse(res.responseText).data.imagesByChapterId.map(({
            kid
          }) => `https://komiic.com/api/image/${kid}`);
        };
        const handlePrevNext = text => async () => {
          await main.waitDom('.v-bottom-navigation__content');
          return main.querySelectorClick(() => main.querySelectorAll('.v-bottom-navigation__content > button:not([disabled])').find(e => e.innerText.includes(text)));
        };
        const urlMatchRe = /comic\/\d+\/chapter\/\d+\/images\//;
        options = {
          name: 'komiic',
          getImgList,
          SPA: {
            isMangaPage: () => urlMatchRe.test(window.location.href),
            getOnPrev: handlePrevNext('上一'),
            getOnNext: handlePrevNext('下一')
          }
        };
        break;
      }

    // #[hitomi](https://hitomi.la)
    case 'hitomi.la':
      {
        options = {
          name: 'hitomi',
          wait: () => !!unsafeWindow.galleryinfo?.files,
          getImgList: () => (unsafeWindow.galleryinfo?.files).map(img => unsafeWindow.url_from_url_from_hash(unsafeWindow.galleryinfo.id, img, 'webp', undefined, 'a'))
        };
        break;
      }

    // #[Anchira](https://anchira.to)
    case 'anchira.to':
      {
        options = {
          name: 'hitomi',
          getImgList: async ({
            fabProps
          }) => {
            const [,, galleryId, galleryKey] = window.location.pathname.split('/');
            const headers = {
              'X-Requested-With': 'XMLHttpRequest',
              Referer: window.location.href
            };
            const res = await main.request(`/api/v1/library/${galleryId}/${galleryKey}/data`, {
              headers,
              noCheckCode: true
            });
            if (res.status !== 200) main.toast.error(main.t('site.need_captcha'), {
              throw: true,
              duration: Infinity,
              onClick: () => fabProps?.onClick?.()
            });
            const {
              names,
              key,
              hash
            } = JSON.parse(res.response);
            return names.map(name => `https://kisakisexo.xyz/${galleryId}/${key}/${hash}/b/${name}`);
          },
          SPA: {
            isMangaPage: () => window.location.href.includes('/g/')
          }
        };
        break;
      }

    // #[kemono](https://kemono.su)
    case 'kemono.su':
    case 'kemono.party':
      {
        options = {
          name: 'kemono',
          getImgList: () => main.querySelectorAll('.post__thumbnail a').map(e => e.href),
          initOptions: {
            autoShow: false,
            option: {
              onePageMode: true
            }
          }
        };
        const zipExtension = ['zip', 'rar', '7z', 'cbz', 'cbr', 'cb7'];
        main.querySelectorAll('.post__attachment a').forEach(e => {
          if (!zipExtension.includes(e.href.split('.').pop())) return;
          const a = document.createElement('a');
          a.href = `https://comic-read.pages.dev/?url=${encodeURIComponent(e.href)}`;
          a.textContent = e.textContent.replace('Download ', 'ComicReadPWA - ');
          a.className = e.className;
          a.style.opacity = '.6';
          e.parentNode.insertBefore(a, e.nextElementSibling);
        });
        break;
      }

    // #[nekohouse](https://nekohouse.su)
    case 'nekohouse.su':
      {
        options = {
          name: 'nekohouse',
          getImgList: () => main.querySelectorAll('.fileThumb').map(e => e.getAttribute('href')),
          initOptions: {
            autoShow: false,
            option: {
              onePageMode: true
            }
          }
        };
        break;
      }

    // #[welovemanga](https://welovemanga.one)
    case 'nicomanga.com':
    case 'weloma.art':
    case 'welovemanga.one':
      {
        if (!main.querySelector('#listImgs')) break;
        const imgSelector = '#listImgs img.chapter-img.chapter-img:not(.ls-is-cached)';
        const isLoadingGifRe = /loading.*\.gif/;
        const getImgList = async () => {
          const imgList = main.querySelectorAll(imgSelector).map(e => e.getAttribute('data-src')?.trim() ?? e.getAttribute('data-original')?.trim() ?? e.src);
          if (imgList.every(url => !isLoadingGifRe.test(url))) return imgList;
          await main.sleep(500);
          return getImgList();
        };
        options = {
          name: 'welovemanga',
          getImgList,
          onNext: main.querySelectorClick('.rd_top-right.next:not(.disabled)'),
          onPrev: main.querySelectorClick('.rd_top-left.prev:not(.disabled)')
        };
        break;
      }

    // 为 pwa 版页面提供 api，以便翻译功能能正常运作
    case 'comic-read.pages.dev':
      {
        unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
        unsafeWindow.toast = main.toast;
        break;
      }
    default:
      {
const main = require('main');

const langList = ['zh', 'en', 'ru'];
/** 判断传入的字符串是否是支持的语言类型代码 */
const isLanguages = lang => !!lang && langList.includes(lang);

/** 返回浏览器偏好语言 */
const getBrowserLang = () => {
  let newLang;
  for (let i = 0; i < navigator.languages.length; i++) {
    const language = navigator.languages[i];
    const matchLang = langList.find(l => l === language || l === language.split('-')[0]);
    if (matchLang) {
      newLang = matchLang;
      break;
    }
  }
  return newLang;
};
const getSaveLang = () => typeof GM !== 'undefined' ? GM.getValue('Languages') : localStorage.getItem('Languages');
const setSaveLang = val => typeof GM !== 'undefined' ? GM.setValue('Languages', val) : localStorage.setItem('Languages', val);
const getInitLang = async () => {
  const saveLang = await getSaveLang();
  if (isLanguages(saveLang)) return saveLang;
  const lang = getBrowserLang() ?? 'zh';
  setSaveLang(lang);
  return lang;
};

const hasNumRe = /\d/;
const getTagText = ele => {
  let text = ele.nodeName;
  if (ele.id && !hasNumRe.test(ele.id)) text += `#${ele.id}`;
  return text;
};

/** 获取元素仅记录了层级结构关系的选择器 */
const getEleSelector = ele => {
  const parents = [ele.nodeName];
  const root = ele.getRootNode();
  let e = ele;
  while (e.parentNode && e.parentNode !== root) {
    e = e.parentNode;
    parents.push(getTagText(e));
  }
  return parents.reverse().join('>');
};

/** 判断指定元素是否符合选择器 */
const isEleSelector = (ele, selector) => {
  const parents = selector.split('>').reverse();
  let e = ele;
  for (let i = 0; e && i < parents.length; i++) {
    if (getTagText(e) !== parents[i]) return false;
    e = e.parentNode;
  }
  return e === e.getRootNode();
};

// 目录页和漫画页的图片层级相同
// https://www.biliplus.com/manga/
// 图片路径上有 id 元素并且 id 含有漫画 id，不同话数 id 也不同

// 测试案例
// https://www.177picyy.com/html/2023/03/5505307.html
// 需要配合其他翻页脚本使用
// https://www.colamanga.com/manga-za76213/1/5.html
// 直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.colamanga.com/manga-kg45140/1/2.html
(async () => {
  /** 执行脚本操作。如果中途中断，将返回 true */
  const start = async () => {
    const {
      setManga,
      setFab,
      init,
      options,
      setOptions,
      isStored,
      mangaProps
    } = await main.useInit(window.location.hostname, {
      remember_current_site: true,
      selector: ''
    });

    // 通过 options 来迂回的实现禁止记住当前站点
    if (!options.remember_current_site) {
      await GM.deleteValue(window.location.hostname);
      return true;
    }
    if (!isStored) main.toast(main.autoReadModeMessage(setOptions), {
      duration: 1000 * 7
    });

    // 为避免卡死，提供一个删除 selector 的菜单项
    const menuId = await GM.registerMenuCommand(main.t('site.simple.simple_read_mode'), () => setOptions({
      selector: ''
    }));

    // 等待 selector 匹配到目标后再继续执行，避免在漫画页外的其他地方运行
    await main.wait(() => !options.selector || main.querySelectorAll(options.selector).length >= 2);
    await GM.unregisterMenuCommand(menuId);

    /** 记录传入的图片元素中最常见的那个 selector */
    const saveImgEleSelector = imgEleList => {
      if (imgEleList.length < 7) return;
      const selector = main.getMostItem(imgEleList.map(getEleSelector));
      if (selector !== options.selector) setOptions({
        selector
      });
    };
    const blobUrlMap = new Map();
    // 处理那些 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片
    const handleBlobImg = async e => {
      if (blobUrlMap.has(e.src)) return blobUrlMap.get(e.src);
      if (!e.src.startsWith('blob:')) return e.src;
      if (await main.testImgUrl(e.src)) return e.src;
      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d');
      canvas.width = e.naturalWidth;
      canvas.height = e.naturalHeight;
      canvasCtx.drawImage(e, 0, 0);
      const url = URL.createObjectURL(await main.canvasToBlob(canvas));
      blobUrlMap.set(e.src, url);
      return url;
    };
    const imgBlackList = [
    // 东方永夜机的预加载图片
    '#pagetual-preload',
    // 177picyy 上会在图片下加一个 noscript
    // 本来只是图片元素的 html 代码，但经过东方永夜机加载后就会变成真的图片元素，导致重复
    'noscript'];
    const getAllImg = () => main.querySelectorAll(`:not(${imgBlackList.join(',')}) > img`);
    let imgEleList;
    let updateImgListTimeout;
    /** 检查筛选符合标准的图片元素用于更新 imgList */
    const updateImgList = main.singleThreaded(async () => {
      imgEleList = await main.wait(() => {
        const newImgList = getAllImg().filter(e => e.offsetParent && e.naturalHeight > 500 && e.naturalWidth > 500 || isEleSelector(e, options.selector) && (e.naturalHeight > 500 || e.naturalWidth > 500)).sort((a, b) => a.offsetTop - b.offsetTop);
        return newImgList.length >= 2 && newImgList;
      });
      if (imgEleList.length === 0) {
        setFab('show', false);
        setManga('show', false);
        return;
      }

      /** 找出应该是漫画图片，且还需要继续触发懒加载的图片个数 */
      const expectCount = options.selector ? main.querySelectorAll(options.selector).filter(main.needTrigged).length : 0;
      const _imgEleList = expectCount ? [...imgEleList, ...new Array(expectCount)] : imgEleList;
      let isEdited = false;
      await main.plimit(_imgEleList.map((e, i) => async () => {
        const newUrl = e ? await handleBlobImg(e) : '';
        if (newUrl === mangaProps.imgList[i]) return;
        if (!isEdited) isEdited = true;
        setManga('imgList', i, newUrl);
      }));
      if (isEdited) saveImgEleSelector(imgEleList);

      // colamanga 会创建随机个数的假 img 元素，导致刚开始时高估页数，需要再删掉多余的页数
      if (mangaProps.imgList.length > _imgEleList.length) setManga('imgList', mangaProps.imgList.slice(0, _imgEleList.length));
      if (isEdited || expectCount || imgEleList.some(e => !e.naturalWidth && !e.naturalHeight)) {
        if (updateImgListTimeout) window.clearTimeout(updateImgListTimeout);
        updateImgListTimeout = window.setTimeout(updateImgList, 1000);
      }
    });
    let timeout = false;
    setTimeout(() => {
      timeout = true;
      if (mangaProps.imgList.length) return;
      main.toast.warn(main.t('site.simple.no_img'), {
        id: 'no_img',
        duration: Infinity,
        onClick: async () => {
          await setOptions({
            remember_current_site: false
          });
          window.location.reload();
        }
      });
    }, 3000);
    const triggerAllLazyLoad = () => main.triggerLazyLoad(getAllImg, () =>
    // 只在`开启了阅读模式所以用户看不到网页滚动`和`当前可显示图片数量不足`时停留一段时间
    mangaProps.show || !timeout && !mangaProps.imgList.length ? 300 : 0);

    /** 监视页面元素发生变化的 Observer */
    const imgDomObserver = new MutationObserver(() => {
      updateImgList();
      triggerAllLazyLoad();
    });
    init(async () => {
      if (!imgEleList) {
        imgEleList = [];
        imgDomObserver.observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src']
        });
        updateImgList();
        triggerAllLazyLoad();
      }
      await main.wait(() => mangaProps.imgList.length);
      main.toast.dismiss('no_img');
      return mangaProps.imgList;
    });

    // 同步滚动显示网页上的图片，用于以防万一保底触发漏网之鱼
    main.createEffectOn(main.showPageList, main.throttle(() => {
      if (!main.showPageList().length || !main.store.show) return;
      const lastImgIndex = main.store.pageList[main.showPageList().at(-1)].findLast(i => i !== -1);
      if (lastImgIndex === undefined) return;
      imgEleList[lastImgIndex]?.scrollIntoView({
        behavior: 'instant',
        block: 'end'
      });
      main.openScrollLock(500);
    }, 1000), {
      defer: true
    });

    // 在退出阅读模式时跳回之前的滚动位置
    let laseScroll = window.scrollY;
    main.createEffectOn(() => main.store.show, show => {
      if (show) laseScroll = window.scrollY;else {
        main.openScrollLock(1000);
        // 稍微延迟一下，等之前触发懒加载时的滚动结束
        requestAnimationFrame(() => window.scrollTo(0, laseScroll));
      }
    });
  };
  if ((await GM.getValue(window.location.hostname)) !== undefined) return start();
  const menuId = await GM.registerMenuCommand(((lang) => {
            switch (lang) {
              case 'en': return 'Enter simple reading mode';case 'ru': return 'Включить простой режим чтения';
              default: return '使用简易阅读模式';
            }
          })(await getInitLang()), () => !start() && GM.unregisterMenuCommand(menuId));
})().catch(e => main.log.error(e));

      }
  }
  if (options) main.universalInit(options);
} catch (error) {
  main.log.error(error);
}
