// ==UserScript==
// @name         ComicReadTest
// @namespace    ComicReadTest
// @version      0.4.1
// @description  为漫画站增加双页阅读模式并优化使用体验。百合会——「记录阅读历史，体验优化」、动漫之家——「看被封漫画，导出导入漫画订阅/历史记录」、ehentai——「匹配 nhentai 漫画、Tag」、nhentai——「彻底屏蔽漫画，自动翻页」、明日方舟泰拉记事社、禁漫天堂、dm5、manhuagui、manhuadb、mangabz、copymanga、manhuacat。部分支持站点以外的网站，也可以使用简易阅读模式来双页阅读漫画。
// @author       hymbz
// @license      AGPL-3.0-or-later
// @noframes
// @match        *://*/*
// @connect      cdn.jsdelivr.net
// @connect      yamibo.com
// @connect      dmzj.com
// @connect      idmzj.com
// @connect      exhentai.org
// @connect      e-hentai.org
// @connect      nhentai.net
// @connect      mangabz.com
// @connect      copymanga.site
// @connect      copymanga.info
// @connect      copymanga.net
// @connect      copymanga.org
// @connect      copymanga.com
// @connect      *
// @grant        GM_addElement
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM.getResourceText
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @grant        GM.unregisterMenuCommand
// @grant        unsafeWindow
// @resource     solid-js https://unpkg.com/solid-js@1.7.3/dist/solid.cjs
// @resource     solid-js/store https://unpkg.com/solid-js@1.7.3/store/dist/store.cjs
// @resource     solid-js/web https://unpkg.com/solid-js@1.7.3/web/dist/web.cjs
// @resource     panzoom https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js
// @resource     fflate https://unpkg.com/fflate@0.7.4/umd/index.js
// @resource     dmzj_style https://userstyles.org/styles/chrome/119945.json
// @supportURL   https://github.com/hymbz/ComicReadScript/issues
// ==/UserScript==

unsafeWindow.crsLib = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: {
    env: {
      NODE_ENV: 'production'
    }
  },
  // 把 GM 相关函数放进去以便其中使用
  GM_xmlhttpRequest,
  GM
};

/**
 * 通过 Resource 导入外部模块
 * @param name \@resource 引用的资源名
 */
const selfImportSync = name => {
  const code = name === '../main' ? `
const web = require('solid-js/web');
const solidJs = require('solid-js');
const fflate = require('fflate');
const store$2 = require('solid-js/store');
const createPanZoom = require('panzoom');

const sleep = ms => new Promise(resolve => {
  window.setTimeout(resolve, ms);
});

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

/** 挂载 solid-js 组件 */
const mountComponents = (id, fc) => {
  const dom = document.createElement('div');
  dom.id = id;
  document.body.appendChild(dom);
  const shadowDom = dom.attachShadow({
    mode: 'open'
  });
  web.render(fc, shadowDom);
  return dom;
};

/** 返回 Dom 的点击函数 */
const querySelectorClick = selector => {
  const dom = querySelector(selector);
  if (!dom) return undefined;
  return () => dom.click();
};

/** 判断两个列表中包含的值是否相同 */
const isEqualArray = (a, b) => a.length === b.length && !!a.filter(t => !b.includes(t));

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
const scrollIntoView = selector => querySelector(selector)?.scrollIntoView();

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
        callBack?.(doneNum, totalNum, resList);
      })();
      execPool.add(p);
    };
  });
  while (doneNum !== totalNum) {
    while (taskList.length && execPool.size < limit) {
      taskList.shift()();
    }
    // eslint-disable-next-line no-await-in-loop
    await Promise.race(execPool);
  }
  return resList;
};

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
const request = async (url, details, errorNum = 0) => {
  const errorText = details?.errorText ?? '漫画加载出错';
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: {
        Referer: window.location.href
      },
      ...details
    });
    if (res.status !== 200) throw new Error(errorText);
    return res;
  } catch (error) {
    if (errorNum > 3) {
      if (errorText) {
        const {
          useToast
        } = require('../main');
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
const needDarkMode = hexColor => {
  // by: https://24ways.org/2010/calculating-color-contrast
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

/** 轮询等到指定的 dom 出现后调用指定函数 */
const wait = (selector, handle) => {
  const id = window.setInterval(() => {
    const dom = querySelector(selector);
    if (!dom) return;
    handle(dom);
    window.clearInterval(id);
  }, 100);
};

const _tmpl$$C = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="m20.45 6 .49-1.06L22 4.45a.5.5 0 0 0 0-.91l-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05c.17.39.73.39.9 0zM8.95 6l.49-1.06 1.06-.49a.5.5 0 0 0 0-.91l-1.06-.48L8.95 2a.492.492 0 0 0-.9 0l-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49L8.05 6c.17.39.73.39.9 0zm10.6 7.5-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49.49 1.06a.5.5 0 0 0 .91 0l.49-1.06 1.05-.5a.5.5 0 0 0 0-.91l-1.06-.49-.49-1.06c-.17-.38-.73-.38-.9.01zm-1.84-4.38-2.83-2.83a.996.996 0 0 0-1.41 0L2.29 17.46a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0L17.7 10.53c.4-.38.4-1.02.01-1.41zm-3.5 2.09L12.8 9.8l1.38-1.38 1.41 1.41-1.38 1.38z">\`);
const MdAutoFixHigh = ((props = {}) => (() => {
  const _el$ = _tmpl$$C();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$B = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="m22 3.55-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05a.5.5 0 0 0 .91 0l.49-1.06L22 4.45c.39-.17.39-.73 0-.9zm-7.83 4.87 1.41 1.41-1.46 1.46 1.41 1.41 2.17-2.17a.996.996 0 0 0 0-1.41l-2.83-2.83a.996.996 0 0 0-1.41 0l-2.17 2.17 1.41 1.41 1.47-1.45zM2.1 4.93l6.36 6.36-6.17 6.17a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l6.17-6.17 6.36 6.36a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42z">\`);
const MdAutoFixOff = ((props = {}) => (() => {
  const _el$ = _tmpl$$B();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$A = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M7 3v9c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l5.19-8.9a.995.995 0 0 0-.86-1.5H13l2.49-6.65A.994.994 0 0 0 14.56 2H8c-.55 0-1 .45-1 1z">\`);
const MdAutoFlashOn = ((props = {}) => (() => {
  const _el$ = _tmpl$$A();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$z = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M16.12 11.5a.995.995 0 0 0-.86-1.5h-1.87l2.28 2.28.45-.78zm.16-8.05c.33-.67-.15-1.45-.9-1.45H8c-.55 0-1 .45-1 1v.61l6.13 6.13 3.15-6.29zm2.16 14.43L4.12 3.56a.996.996 0 1 0-1.41 1.41L7 9.27V12c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l2.65-4.55 3.44 3.44c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41z">\`);
const MdAutoFlashOff = ((props = {}) => (() => {
  const _el$ = _tmpl$$z();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css$2 = ".index_module_iconButtonItem__d88db3ae{align-items:center;display:flex;position:relative}.index_module_iconButton__d88db3ae{align-items:center;background-color:var(--text_bg,#121212);border-radius:9999px;border-style:none;color:var(--text,#fff);cursor:pointer;display:flex;font-size:1.5em;height:1.5em;justify-content:center;margin:.1em;outline:none;padding:0;width:1.5em}.index_module_iconButton__d88db3ae:focus,.index_module_iconButton__d88db3ae:hover{background-color:var(--hover_bg_color,#fff3)}.index_module_iconButton__d88db3ae.index_module_enabled__d88db3ae{background-color:var(--text,#fff);color:var(--text_bg,#121212)}.index_module_iconButton__d88db3ae.index_module_enabled__d88db3ae:focus,.index_module_iconButton__d88db3ae.index_module_enabled__d88db3ae:hover{background-color:var(--hover_bg_color_enable,#fffa)}.index_module_iconButtonPopper__d88db3ae{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;opacity:0;padding:.4em .5em;position:absolute;top:50%;transform:translateY(-50%);user-select:none;white-space:nowrap}.index_module_iconButtonPopper__d88db3ae[data-placement=right]{left:calc(100% + 1.5em)}.index_module_iconButtonPopper__d88db3ae[data-placement=right]:before{border-right-color:var(--switch_bg,#6e6e6e);border-right-width:.5em;right:calc(100% + .5em)}.index_module_iconButtonPopper__d88db3ae[data-placement=left]{right:calc(100% + 1.5em)}.index_module_iconButtonPopper__d88db3ae[data-placement=left]:before{border-left-color:var(--switch_bg,#6e6e6e);border-left-width:.5em;left:calc(100% + .5em)}.index_module_iconButtonPopper__d88db3ae:before{background-color:initial;border:.4em solid #0000;content:\\"\\";position:absolute;transition:opacity .15s}.index_module_iconButtonItem__d88db3ae:focus .index_module_iconButtonPopper__d88db3ae,.index_module_iconButtonItem__d88db3ae:hover .index_module_iconButtonPopper__d88db3ae,.index_module_iconButtonItem__d88db3ae[data-show=true] .index_module_iconButtonPopper__d88db3ae{opacity:1}.index_module_hidden__d88db3ae{display:none}";
var modules_c21c94f2$2 = {"iconButtonItem":"index_module_iconButtonItem__d88db3ae","iconButton":"index_module_iconButton__d88db3ae","enabled":"index_module_enabled__d88db3ae","iconButtonPopper":"index_module_iconButtonPopper__d88db3ae","hidden":"index_module_hidden__d88db3ae"};
n(css$2,{});

const _tmpl$$y = /*#__PURE__*/web.template(\`<div><button type="button">\`),
  _tmpl$2$7 = /*#__PURE__*/web.template(\`<div>\`);
const IconButtonStyle = css$2;
/**
 * 图标按钮
 */
const IconButton = _props => {
  const props = solidJs.mergeProps({
    placement: 'right'
  }, _props);
  let buttonRef;
  const handleClick = e => {
    // 在每次点击后取消焦点
    buttonRef?.blur();
    props.onClick?.(e);
  };
  return (() => {
    const _el$ = _tmpl$$y(),
      _el$2 = _el$.firstChild;
    _el$2.$$click = handleClick;
    const _ref$ = buttonRef;
    typeof _ref$ === "function" ? web.use(_ref$, _el$2) : buttonRef = _el$2;
    web.insert(_el$2, () => props.children);
    web.insert(_el$, (() => {
      const _c$ = web.memo(() => !!(props.popper || props.tip));
      return () => _c$() ? (() => {
        const _el$3 = _tmpl$2$7();
        web.insert(_el$3, () => props.popper || props.tip);
        web.effect(_p$ => {
          const _v$6 = [modules_c21c94f2$2.iconButtonPopper, props.popperClassName].join(' '),
            _v$7 = props.placement;
          _v$6 !== _p$._v$6 && web.className(_el$3, _p$._v$6 = _v$6);
          _v$7 !== _p$._v$7 && web.setAttribute(_el$3, "data-placement", _p$._v$7 = _v$7);
          return _p$;
        }, {
          _v$6: undefined,
          _v$7: undefined
        });
        return _el$3;
      })() : null;
    })(), null);
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$2.iconButtonItem,
        _v$2 = props.showTip,
        _v$3 = props.tip,
        _v$4 = modules_c21c94f2$2.iconButton,
        _v$5 = {
          [modules_c21c94f2$2.hidden]: props.hidden,
          [modules_c21c94f2$2.enabled]: props.enabled
        };
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-show", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && web.setAttribute(_el$2, "aria-label", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && web.className(_el$2, _p$._v$4 = _v$4);
      _p$._v$5 = web.classList(_el$2, _v$5, _p$._v$5);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined
    });
    return _el$;
  })();
};
web.delegateEvents(["click"]);

const useSpeedDial = (options, setOptions) => {
  const DefaultButton = props => {
    return web.createComponent(IconButton, {
      get tip() {
        return props.showName ?? props.optionName;
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
  };
  const list = Object.keys(options).map(optionName => {
    switch (optionName) {
      case 'hiddenFAB':
      case 'option':
        return null;
      case 'autoShow':
        return () => web.createComponent(DefaultButton, {
          optionName: "autoShow",
          showName: "\\u81EA\\u52A8\\u8FDB\\u5165\\u9605\\u8BFB\\u6A21\\u5F0F",
          get children() {
            return web.memo(() => !!options.autoShow)() ? web.createComponent(MdAutoFlashOn, {}) : web.createComponent(MdAutoFlashOff, {});
          }
        });
      default:
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

const _tmpl$$x = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z">\`);
const MdFileDownload = ((props = {}) => (() => {
  const _el$ = _tmpl$$x();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$w = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z">\`);
const MdClose = ((props = {}) => (() => {
  const _el$ = _tmpl$$w();
  web.spread(_el$, props, true, true);
  return _el$;
})());

/** 加载状态的中文描述 */
const loadTypeMap = {
  error: '加载出错',
  loading: '正在加载',
  wait: '等待加载',
  loaded: ''
};

/** 页面填充数据 */

const imgState = {
  imgList: [],
  pageList: [],
  /** 页面填充数据 */
  fillEffect: {
    '-1': true
  },
  /** 当前页数 */
  activePageIndex: 0,
  /** 比例 */
  proportion: {
    单页比例: 0,
    横幅比例: 0,
    条漫比例: 0
  }
};

const ScrollbarState = {
  /** 滚动条 */
  scrollbar: {
    /** 滚动条提示文本 */
    tipText: '',
    /** 滚动条高度比率 */
    dragHeight: 0,
    /** 滚动条所处高度比率 */
    dragTop: 0
  }
};

const OperateState = {
  /**
   * 用于防止滚轮连续滚动导致过快触发事件的锁
   *
   * - 在缩放时开启，结束缩放一段时间后关闭。开启时禁止翻页。
   * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
   */
  scrollLock: false
};

const ExternalLibState = {
  panzoom: undefined,
  /** 当前是否处于放大模式 */
  isZoomed: false
};

const OptionState = {
  option: {
    dir: 'rtl',
    scrollbar: {
      enabled: true,
      autoHidden: false,
      showProgress: true
    },
    onePageMode: false,
    scrollMode: false,
    clickPage: {
      enabled: 'ontouchstart' in document.documentElement,
      overturn: false
    },
    disableZoom: false,
    // 判断用户系统环境是否要求开启暗色模式
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    flipToNext: true,
    alwaysLoadAllImg: false
  },
  /** 显示点击区域 */
  showTouchArea: false
};

const OtherState = {
  /** 是否强制显示侧边栏 */
  showToolbar: false,
  /** 是否强制显示滚动条 */
  showScrollbar: false,
  /** 是否显示结束页 */
  showEndPage: false,
  /** 结束页状态。showEndPage 更改时自动计算 */
  endPageType: undefined,
  /** 卷轴模式下图片的最大宽度 */
  imgMaxWidth: 0,
  /** 点击结束页按钮时触发的回调 */
  onExit: undefined,
  /** 点击上一话按钮时触发的回调 */
  onPrev: undefined,
  /** 点击下一话按钮时触发的回调 */
  onNext: undefined,
  /** 图片加载状态发生变化时触发的回调 */
  onLoading: undefined,
  editButtonList: list => list,
  editSettingList: list => list
};

const [_state, _setState] = store$2.createStore({
  ...imgState,
  ...ScrollbarState,
  ...OperateState,
  ...ExternalLibState,
  ...OptionState,
  ...OtherState,
  rootRef: undefined,
  mangaFlowRef: undefined
});
const setState = fn => _setState(store$2.produce(fn));

// eslint-disable-next-line solid/reactivity
const store$1 = _state;

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The \`this\` context and all arguments are passed through,
 *                                            as-is, to \`callback\` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every \`delay\` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            \`delay\` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If \`debounceMode\` is true (at begin), schedule \`clear\` to execute after \`delay\` ms. If \`debounceMode\` is
 *                                            false (at end), schedule \`callback\` to execute after \`delay\` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
function throttle (delay, callback, options) {
  var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * \`callback\` is executed at the proper times in \`throttle\` and \`end\`
   * debounce modes.
   */


  var timeoutID;
  var cancelled = false; // Keep track of the last time \`callback\` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel(options) {
    var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  /*
   * The \`wrapper\` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which \`callback\`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute \`callback\` and update the \`lastExec\` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If \`debounceMode\` is true (at begin) this is used to clear the flag
     * to allow future \`callback\` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /*
       * Since \`wrapper\` is being called for the first time and
       * \`debounceMode\` is true (at begin), execute \`callback\`
       * and noLeading != true.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if \`delay\` time has
         * been exceeded, update \`lastExec\` and schedule \`callback\`
         * to execute after \`delay\` ms.
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * In throttle mode without noLeading, if \`delay\` time has been exceeded, execute
         * \`callback\`.
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since \`delay\` time has not been
       * exceeded, schedule \`callback\` to execute \`delay\` ms after most
       * recent execution.
       *
       * If \`debounceMode\` is true (at begin), schedule \`clear\` to execute
       * after \`delay\` ms.
       *
       * If \`debounceMode\` is false (at end), schedule \`callback\` to
       * execute after \`delay\` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param {number} delay -               A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param {Function} callback -          A function to be executed after delay milliseconds. The \`this\` context and all arguments are passed through, as-is,
 *                                        to \`callback\` when the debounced-function is executed.
 * @param {object} [options] -           An object to configure options.
 * @param {boolean} [options.atBegin] -  Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed \`delay\` milliseconds
 *                                        after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                        (After the throttled-function has not been called for \`delay\` milliseconds, the internal counter is reset).
 *
 * @returns {Function} A new, debounced function.
 */

function debounce (delay, callback, options) {
  var _ref = options || {},
      _ref$atBegin = _ref.atBegin,
      atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;

  return throttle(delay, callback, {
    debounceMode: atBegin !== false
  });
}

const initPanzoom = state => {
  // 销毁之前可能创建过的实例
  state.panzoom?.dispose();
  const panzoom = createPanZoom(state.mangaFlowRef, {
    // 边界限制
    bounds: true,
    boundsPadding: 1,
    // 禁止缩小
    minZoom: 1,
    // 禁用默认的双击缩放
    zoomDoubleClickSpeed: 1,
    // 忽略键盘事件
    filterKey: () => true,
    beforeWheel(e) {
      // 卷轴模式下可以保持缩放状态滚动
      if (!store$1.option.scrollMode) {
        const {
          scale
        } = panzoom.getTransform();

        // 图片处于缩放状态时，可以直接通过滚轮缩放
        if (scale !== 1) return false;
      }

      // 只在按下 Alt 键才能通过滚轮缩放
      return !e.altKey;
    },
    beforeMouseDown(e) {
      // 按下「alt 键」或「处于放大状态」时才允许拖动
      return !(e.altKey || panzoom.getTransform().scale !== 1);
    },
    onTouch() {
      // 未进行缩放时不捕捉 touch 事件
      return state.isZoomed;
    }
  });
  panzoom.on('transform', () => {
    if (!state.isZoomed) {
      // 防止在放大模式下通过滚轮缩小至原尺寸后立刻跳转至下一页
      if (state.scrollLock) {
        window.setTimeout(() => {
          state.scrollLock = false;
        }, 500);
      }
    } else if (!state.scrollLock) {
      state.scrollLock = true;
    }
  });
  panzoom.on('zoom', throttle(200, () => {
    state.isZoomed = panzoom.getTransform().scale !== 1;
  }));
  state.panzoom = panzoom;
};

// 1. 因为不同汉化组处理情况不同不可能全部适配，所以只能是尽量适配*出现频率更多*的情况
// 2. 因为大部分用户都不会在意正确页序，所以应该尽量少加填充页
/**
 * 根据图片比例和填充页设置对漫画图片进行排列
 */
const handleComicData = (imgList, fillEffect) => {
  const pageList = [];
  let imgCache = null;
  for (let i = 0; i < imgList.length; i += 1) {
    const img = imgList[i];
    if (fillEffect[i - 1]) {
      if (imgCache !== null) pageList.push([imgCache]);
      imgCache = -1;
    }
    if (img.type !== 'long' && img.type !== 'wide') {
      if (imgCache !== null) {
        pageList.push([imgCache, i]);
        imgCache = null;
      } else {
        imgCache = i;
      }
    } else {
      if (imgCache !== null) {
        // 默认会开启首页填充，但如果在开头和中间出现了跨页，就应该关掉
        if (fillEffect['-1'] && i < imgList.length - 2) {
          fillEffect['-1'] = false;
          return handleComicData(imgList, fillEffect);
        }
        if (imgCache !== -1) {
          // 跨页在倒数两张的话大概率时汉化组加的图，应该将填充页放在后面
          if (i >= imgList.length - 2) pageList.push([imgCache, -1]);
          // 正常进度中出现的跨页应该代表页序的「正确答案」，导致了缺页的话就说明在这之前缺少填充页
          else pageList.push([-1, imgCache]);
        }
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

/**
 * 获取指定 page 中的图片 index，并在后面加上加载状态
 */
const getPageIndexText = (state, pageIndex) => {
  const page = state.pageList[pageIndex];
  if (!page) return ['null'];
  const pageIndexText = page.map(index => {
    if (index === -1) return '填充页';
    const img = state.imgList[index];
    if (img.loadType === 'loaded') return \`\${index + 1}\`;
    // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
    return \`\${index + 1} (\${loadTypeMap[img.loadType]})\`;
  });
  if (state.option.dir === 'rtl') pageIndexText.reverse();
  return pageIndexText;
};

/** 更新滚动条提示文本 */
const updateTipText = state => {
  state.scrollbar.tipText = (() => {
    if (!state.pageList.length) return '';
    if (!state.option.scrollMode) return getPageIndexText(state, state.activePageIndex).join(' | ');
    const {
      pageList,
      scrollbar: {
        dragHeight,
        dragTop
      }
    } = state;
    const pageIndex = pageList.slice(Math.floor(dragTop * pageList.length), Math.floor((dragTop + dragHeight) * pageList.length)).flat().map(index => getPageIndexText(state, index));
    return pageIndex.join('\\n');
  })();
};

/** 更新滚动条滑块的高度和所处高度 */
const updateDrag = state => {
  if (!state.option.scrollMode) {
    state.scrollbar.dragHeight = 0;
    state.scrollbar.dragTop = 0;
    return;
  }

  /** 能显示出漫画的高度 */
  const windowHeight = state.rootRef.offsetHeight;
  /** 漫画的总高度 */
  const contentHeight = state.mangaFlowRef.scrollHeight;
  state.scrollbar.dragHeight = !windowHeight || !contentHeight ? 0 : windowHeight / contentHeight;
};

/** 监视漫画页的滚动事件 */
const handleMangaFlowScroll = () => {
  if (!store$1.option.scrollMode) return;
  setState(state => {
    const mangaFlowEle = state.mangaFlowRef?.parentNode;

    /** 漫画的总高度 */
    const contentHeight = mangaFlowEle?.scrollHeight;
    state.scrollbar.dragTop = !mangaFlowEle || !contentHeight ? 0 : mangaFlowEle.scrollTop / contentHeight;
    state.activePageIndex = Math.floor(state.scrollbar.dragTop * state.pageList.length);
  });
  setState(updateDrag);
};

/** 使在滚动条上的滚轮可以触发滚动 */
const handleWheel = e => {
  /** 能显示出漫画的高度 */
  const windowHeight = store$1.rootRef?.offsetHeight;
  if (!windowHeight) return;

  /** 滚动条高度 */
  const scrollbarHeight = e.target.offsetHeight;
  // 使用 scrollBy 会导致和原生滚动效果不同，少了平滑滚动，但初次之外找不到其他办法了
  store$1.mangaFlowRef?.scrollBy({
    top: e.deltaY / scrollbarHeight * windowHeight
  });
};

/** 开始拖拽时的 dragTop 值 */
let startTop = 0;
const dragOption = {
  handleDrag: ({
    type,
    xy: [, y],
    initial: [, iy]
  }, e) => {
    // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
    if (type === 'end') return;
    // 跳过没必要处理的情况
    if (type === 'dragging' && y === iy) return;
    if (!store$1.mangaFlowRef) return;

    /** 滚动条高度 */
    const scrollbarHeight = e.target.offsetHeight;
    /** 点击位置在滚动条上的位置比率 */
    const clickTop = y / scrollbarHeight;
    let top = clickTop;
    if (store$1.option.scrollMode) {
      const mangaFlowEle = store$1.mangaFlowRef.parentNode;

      /** 漫画的总高度 */
      const contentHeight = mangaFlowEle.scrollHeight;
      if (type === 'dragging') {
        /** 在滚动条上的移动比率 */
        const dy = (y - iy) / scrollbarHeight;
        top = startTop + dy;
        // 处理超出范围的情况
        if (top < 0) top = 0;else if (top > 1) top = 1;
        mangaFlowEle.scrollTo({
          top: top * contentHeight
        });
      } else {
        // 确保滚动条的中心会在点击位置
        top -= store$1.scrollbar.dragHeight / 2;
        startTop = top;
        mangaFlowEle.scrollTo({
          top: top * contentHeight,
          behavior: 'smooth'
        });
      }
    } else {
      let newPageIndex = Math.floor(top * store$1.pageList.length);
      // 处理超出范围的情况
      if (newPageIndex < 0) newPageIndex = 0;else if (newPageIndex >= store$1.pageList.length) newPageIndex = store$1.pageList.length - 1;
      if (newPageIndex !== store$1.activePageIndex) {
        setState(state => {
          state.activePageIndex = newPageIndex;
        });
      }
    }
  }
};
solidJs.createRoot(() => {
  // 更新滚动条提示文本
  solidJs.createEffect(solidJs.on([() => store$1.activePageIndex, () => store$1.pageList, () => store$1.scrollbar.dragHeight, () => store$1.scrollbar.dragTop, () => store$1.option.scrollMode, () => store$1.option.dir], () => {
    setState(updateTipText);
  }));
});

/** 是否需要自动判断开启卷轴模式 */
let autoScrollMode = true;

/**
 * 预加载指定页数的图片，并取消其他预加载的图片
 * @param state state
 * @param startIndex 起始 page index
 * @param endIndex 结束 page index
 * @param loadNum 加载图片的数量
 * @returns 返回指定范围内的图片在执行前是否还有未加载完的
 */
const loadImg = (state, startIndex, endIndex = startIndex + 1, loadNum = 2) => {
  let editNum = 0;
  state.pageList.slice(Math.max(startIndex, 0), Math.max(Math.min(endIndex, state.pageList.length), 0)).flat().some(index => {
    if (index === -1) return false;
    const img = state.imgList[index];
    if (img.loadType !== 'loaded') {
      img.loadType = 'loading';
      editNum += 1;
    }
    return editNum >= loadNum;
  });
  const edited = editNum > 0;
  if (edited) updateTipText(state);
  return edited;
};

/** 根据当前页数更新所有图片的加载状态 */
const updateImgLoadType = debounce(100, state => {
  const {
    imgList,
    activePageIndex
  } = state;

  // 先将所有加载中的图片状态改为暂停
  imgList.forEach(({
    loadType
  }, i) => {
    if (loadType === 'loading' || loadType === 'error') imgList[i].loadType = 'wait';
  });
  return (
    // 优先加载当前显示页
    loadImg(state, activePageIndex, activePageIndex + 1) ||
    // 再加载后十页
    loadImg(state, activePageIndex + 1, activePageIndex + 20) ||
    // 再加载前十页
    loadImg(state, activePageIndex - 10, activePageIndex - 1) ||
    // 默认在页数不多时，继续加载其余图片
    !state.option.alwaysLoadAllImg && imgList.length > 60 ||
    // 加载当前页后面的图片
    loadImg(state, activePageIndex + 1, imgList.length, 5) ||
    // 加载剩余未加载页面
    loadImg(state, 0, imgList.length, 5)
  );
});

/** 重新计算 PageData */
const updatePageData = state => {
  const {
    imgList,
    fillEffect,
    option: {
      onePageMode,
      scrollMode
    }
  } = state;
  if (onePageMode || scrollMode) state.pageList = imgList.map((_, i) => [i]);else state.pageList = handleComicData(imgList, fillEffect);
  updateDrag(state);
  updateImgLoadType(state);
};
updatePageData.debounce = debounce(100, updatePageData);

/** 根据比例更新图片类型 */
const updateImgType = (state, draftImg) => {
  const {
    width,
    height,
    type
  } = draftImg;
  if (!width || !height) return;
  const imgRatio = width / height;
  if (imgRatio <= state.proportion.单页比例) {
    if (imgRatio < state.proportion.条漫比例) draftImg.type = 'vertical';else draftImg.type = '';
  } else {
    draftImg.type = imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
  }

  // 当超过3张图的类型为长图时，自动开启卷轴模式
  if (!state.option.scrollMode && autoScrollMode && state.imgList.filter(img => img.type === 'vertical').length > 3) {
    state.option.scrollMode = true;
    autoScrollMode = false;
  }
  if (type === draftImg.type) {
    updateDrag(state);
    updateImgLoadType(state);
    return;
  }
  updatePageData.debounce(state);
};

/** 更新页面比例 */
const updatePageRatio = (state, width, height) => {
  state.proportion.单页比例 = Math.min(width / 2 / height, 1);
  state.proportion.横幅比例 = width / height;
  state.proportion.条漫比例 = state.proportion.单页比例 / 2;
  state.imgList.forEach(img => updateImgType(state, img));
};

/** 图片加载完毕的回调 */
const handleImgLoaded = (i, e) => {
  setState(state => {
    const img = state.imgList[i];
    if (!img) return;
    img.loadType = 'loaded';
    img.height = e.naturalHeight;
    img.width = e.naturalWidth;
    updateImgType(state, img);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    state.onLoading?.(img, state.imgList);
  });
};
const handleImgError = (i, e) => {
  // 跳过因为 src 为空导致的错误
  if (e.getAttribute('src') === '') return;
  setState(state => {
    const img = state.imgList[i];
    img.loadType = 'error';
    console.error('图片加载失败', e);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    state.onLoading?.(img, state.imgList);
  });
};

/** 翻页 */
const turnPage = (state, dir) => {
  if (dir === 'prev') {
    switch (state.endPageType) {
      case 'start':
        if (!state.scrollLock && state.option.flipToNext) {
          state.onPrev?.();
          state.endPageType = undefined;
        }
        return;
      case 'end':
        state.endPageType = undefined;
        return;
      default:
        // 弹出卷首结束页
        if (state.activePageIndex === 0) {
          // 没有 onPrev 时不弹出
          if (!state.onPrev || !state.option.flipToNext) return;
          state.endPageType = 'start';
          state.scrollLock = true;
          window.setTimeout(() => {
            state.scrollLock = false;
          }, 500);
          return;
        }
        if (!state.option.scrollMode) state.activePageIndex -= 1;
    }
  } else {
    switch (state.endPageType) {
      case 'end':
        if (state.scrollLock) return;
        if (state.onNext && state.option.flipToNext) {
          state.onNext();
          state.activePageIndex = 0;
          state.endPageType = undefined;
          return;
        }
        if (state.onExit) {
          state.onExit(true);
          state.activePageIndex = 0;
          state.endPageType = undefined;
        }
        return;
      case 'start':
        state.endPageType = undefined;
        return;
      default:
        // 弹出卷尾结束页
        if (state.activePageIndex === state.pageList.length - 1) {
          state.endPageType = 'end';
          state.scrollLock = true;
          window.setTimeout(() => {
            state.scrollLock = false;
          }, 200);
          return;
        }
        if (!state.option.scrollMode) state.activePageIndex += 1;
    }
  }
};
const {
  activeImgIndex,
  nowFillIndex
} = solidJs.createRoot(() => {
  const activeImgIndexMemo = solidJs.createMemo(() => store$1.pageList[store$1.activePageIndex]?.find(i => i !== -1) ?? 0);
  const nowFillIndexMemo = solidJs.createMemo(() => {
    let __nowFillIndex = activeImgIndexMemo();
    while (!Reflect.has(store$1.fillEffect, __nowFillIndex)) {
      __nowFillIndex -= 1;
    }
    return __nowFillIndex;
  });

  // 页数发生变动时
  solidJs.createEffect(solidJs.on(() => store$1.activePageIndex, () => {
    setState(state => {
      updateImgLoadType(state);
      if (state.endPageType) state.endPageType = undefined;
    });
  }, {
    defer: true
  }));
  return {
    /** 当前显示的第一张图片的 index */
    activeImgIndex: activeImgIndexMemo,
    /** 当前所处的图片流 */
    nowFillIndex: nowFillIndexMemo
  };
});

/** 切换页面填充 */
const switchFillEffect = () => {
  setState(state => {
    state.fillEffect[nowFillIndex()] = !state.fillEffect[nowFillIndex()];
    updatePageData(state);
  });
};

const handleScroll = e => {
  e.stopPropagation();
  if (e.altKey || !store$1.endPageType && store$1.scrollLock) return;
  if (store$1.option.scrollMode && !store$1.endPageType) {
    if (store$1.scrollbar.dragTop === 0 && e.deltaY <= 0) {
      window.setTimeout(() => {
        setState(state => {
          state.endPageType = 'start';
          state.scrollLock = true;
        });
      });
      window.setTimeout(() => {
        setState(state => {
          state.scrollLock = false;
        });
      }, 500);
    } else if (store$1.scrollbar.dragHeight + store$1.scrollbar.dragTop >= 1 && e.deltaY > 0) {
      setState(state => {
        state.endPageType = 'end';
        state.scrollLock = true;
      });
      window.setTimeout(() => {
        setState(state => {
          state.scrollLock = false;
        });
      }, 500);
    }
    return;
  }
  setState(state => {
    if (e.deltaY > 0) turnPage(state, 'next');else turnPage(state, 'prev');
  });
};
const handleKeyUp = e => {
  e.stopPropagation();
  if (store$1.option.scrollMode && !store$1.endPageType) return;
  let nextPage = null;
  switch (e.key) {
    case 'PageUp':
    case 'ArrowUp':
    case '.':
    case 'w':
      nextPage = false;
      break;
    case ' ':
    case 'PageDown':
    case 'ArrowDown':
    case ',':
    case 's':
      nextPage = true;
      break;
    case 'ArrowRight':
    case 'd':
      nextPage = store$1.option.dir !== 'rtl';
      break;
    case 'ArrowLeft':
    case 'a':
      nextPage = store$1.option.dir === 'rtl';
      break;
    case '/':
    case 'm':
    case 'z':
      switchFillEffect();
      break;
    case 'Home':
      setState(state => {
        state.activePageIndex = 0;
      });
      break;
    case 'End':
      setState(state => {
        state.activePageIndex = state.pageList.length - 1;
      });
      break;
    case 'Escape':
      store$1.onExit?.();
      break;
  }
  if (nextPage === null) return;
  setState(state => turnPage(state, nextPage ? 'next' : 'prev'));
};

/** 通过重新解构赋值 option 以触发 onOptionChange */
const setOption = fn => {
  setState(state => {
    fn(state.option);
    state.option = {
      ...state.option
    };
  });
};

var css$1 = ".index_module_img__5c381e3b{display:none;height:100%;max-width:100%;object-fit:contain}.index_module_img__5c381e3b[data-show]{display:unset}.index_module_img__5c381e3b[data-load-type=error],.index_module_img__5c381e3b[data-load-type=wait]{visibility:hidden}.index_module_img__5c381e3b[data-fill=left]{transform:translate(50%)}.index_module_img__5c381e3b[data-fill=right]{transform:translate(-50%)}.index_module_mangaFlowBox__5c381e3b{height:100%;overflow:auto;scrollbar-width:none}.index_module_mangaFlowBox__5c381e3b::-webkit-scrollbar{display:none}.index_module_mangaFlow__5c381e3b{align-items:center;color:var(--text);display:flex;height:100%;justify-content:center;user-select:none}.index_module_mangaFlow__5c381e3b.index_module_disableZoom__5c381e3b .index_module_img__5c381e3b{height:unset;max-height:100%;object-fit:scale-down}.index_module_mangaFlow__5c381e3b.index_module_scrollMode__5c381e3b{flex-direction:column;justify-content:flex-start;overflow:visible}.index_module_mangaFlow__5c381e3b.index_module_scrollMode__5c381e3b .index_module_img__5c381e3b{height:auto;max-height:unset;max-width:var(--img_max_width)}.index_module_mangaFlow__5c381e3b[dir=ltr]{flex-direction:row}.index_module_endPage__5c381e3b{align-items:center;background-color:#3339;color:#fff;display:flex;height:100%;justify-content:center;left:0;opacity:0;pointer-events:none;position:absolute;top:0;transition:opacity .5s;width:100%;z-index:10}.index_module_endPage__5c381e3b>button{background-color:initial;border:0;color:inherit;cursor:pointer;font-size:1.2em}.index_module_endPage__5c381e3b>button[data-is-end]{font-size:3em;margin:2em}.index_module_endPage__5c381e3b>button:focus-visible{outline:none}.index_module_endPage__5c381e3b>.index_module_tip__5c381e3b{margin:auto;position:absolute}.index_module_endPage__5c381e3b[data-show]{opacity:1;pointer-events:all}.index_module_endPage__5c381e3b[data-type=start]>.index_module_tip__5c381e3b{transform:translateY(-40vh)}.index_module_endPage__5c381e3b[data-type=end]>.index_module_tip__5c381e3b{transform:translateY(40vh)}.index_module_toolbar__5c381e3b{align-items:center;display:flex;height:100%;justify-content:flex-start;position:fixed;width:5vw;z-index:9}.index_module_toolbarPanel__5c381e3b{display:flex;flex-direction:column;padding:1em 1em 1em .5em;transform:translateX(-100%);transition:transform .2s}.index_module_toolbar__5c381e3b[data-show=true] .index_module_toolbarPanel__5c381e3b{transform:none}.index_module_SettingPanelPopper__5c381e3b{height:0!important;padding:0!important;transform:none!important}.index_module_SettingPanel__5c381e3b{background-color:var(--page_bg);border-radius:.3em;bottom:0;box-shadow:0 3px 1px -2px #0003,0 2px 2px 0 #00000024,0 1px 5px 0 #0000001f;color:var(--text);font-size:1.2em;height:-moz-fit-content;height:fit-content;margin:auto;max-height:95vh;overflow:auto;position:fixed;scrollbar-width:none;top:0;width:15em}.index_module_SettingPanel__5c381e3b::-webkit-scrollbar{display:none}.index_module_SettingBlock__5c381e3b{padding:.5em}.index_module_SettingBlockSubtitle__5c381e3b{color:var(--text_secondary);font-size:.7em;margin-bottom:-.3em}.index_module_SettingsItem__5c381e3b{align-items:center;display:flex;justify-content:space-between;margin-top:1em}.index_module_SettingsItemName__5c381e3b{font-size:.9em}.index_module_SettingsItemSwitch__5c381e3b{align-items:center;background-color:var(--switch_bg);border:0;border-radius:1em;cursor:pointer;display:inline-flex;height:.8em;margin-right:.3em;padding:0;width:2.3em}.index_module_SettingsItemSwitchRound__5c381e3b{background:var(--switch);border-radius:100%;box-shadow:0 2px 1px -1px #0003,0 1px 1px 0 #00000024,0 1px 3px 0 #0000001f;height:1.15em;transform:translateX(-10%);transition:transform .1s;width:1.15em}.index_module_SettingsItemSwitch__5c381e3b[data-checked=true]{background:var(--secondary_bg)}.index_module_SettingsItemSwitch__5c381e3b[data-checked=true] .index_module_SettingsItemSwitchRound__5c381e3b{background:var(--secondary);transform:translateX(110%)}.index_module_SettingsItemIconButton__5c381e3b{background-color:initial;border:none;color:var(--text);cursor:pointer;font-size:1.7em;height:1em;margin:0;padding:0;position:absolute;right:.7em}.index_module_closeCover__5c381e3b{height:100%;left:0;position:fixed;top:0;width:100%;z-index:-1}.index_module_scrollbar__5c381e3b{border-left:10em solid #0000;display:flex;flex-direction:column;height:98%;outline:none;position:absolute;right:3px;top:1%;touch-action:none;user-select:none;width:5px;z-index:9}.index_module_scrollbar__5c381e3b>div{display:flex;flex-direction:column;flex-grow:1;pointer-events:none}.index_module_scrollbarDrag__5c381e3b{background-color:var(--scrollbar_drag);border-radius:1em;justify-content:center;opacity:0;position:absolute;width:100%;z-index:1}.index_module_scrollbarPage__5c381e3b{flex-grow:1;transform:scaleY(1);transform-origin:bottom;transition:transform 1s,background-color 0ms 1s}.index_module_scrollbarPage__5c381e3b[data-type=loaded]{transform:scaleY(0)}.index_module_scrollbarPage__5c381e3b[data-type=loading]{background-color:var(--secondary)}.index_module_scrollbarPage__5c381e3b[data-type=wait]{background-color:var(--secondary);opacity:.5}.index_module_scrollbarPage__5c381e3b[data-type=error]{background-color:#f005}.index_module_scrollbarPoper__5c381e3b{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;line-height:1.5em;opacity:0;padding:.2em .5em;position:absolute;right:2em;text-align:center;transition:opacity .15s;white-space:pre;width:-moz-fit-content;width:fit-content}.index_module_scrollbarPoper__5c381e3b:after{background-color:#303030;background-color:initial;border:.4em solid #0000;border-left:.5em solid #303030;content:\\"\\";left:100%;position:absolute}.index_module_scrollbarDrag__5c381e3b[data-show=true],.index_module_scrollbarPoper__5c381e3b[data-show=true],.index_module_scrollbar__5c381e3b:hover .index_module_scrollbarDrag__5c381e3b,.index_module_scrollbar__5c381e3b:hover .index_module_scrollbarPoper__5c381e3b{opacity:1}.index_module_touchAreaRoot__5c381e3b{color:#0000;display:flex;font-size:3em;height:100%;position:absolute;top:0;user-select:none;width:100%}.index_module_touchArea__5c381e3b{align-items:center;display:flex;flex-grow:1;justify-content:center;outline:none;writing-mode:vertical-rl;z-index:1}.index_module_touchArea__5c381e3b[data-area=menu]{flex-basis:0}.index_module_touchAreaRoot__5c381e3b[data-show=true] .index_module_touchArea__5c381e3b{color:#fff}.index_module_touchAreaRoot__5c381e3b[data-show=true] .index_module_touchArea__5c381e3b[data-area=prev]{background-color:#95e1d3e6}.index_module_touchAreaRoot__5c381e3b[data-show=true] .index_module_touchArea__5c381e3b[data-area=menu]{background-color:#fce38ae6}.index_module_touchAreaRoot__5c381e3b[data-show=true] .index_module_touchArea__5c381e3b[data-area=next]{background-color:#f38181e6}.index_module_hidden__5c381e3b{display:none}.index_module_invisible__5c381e3b{visibility:hidden}.index_module_opacity1__5c381e3b{opacity:1}.index_module_opacity0__5c381e3b{opacity:0}.index_module_root__5c381e3b{background-color:var(--bg);height:100%;outline:0;overflow:hidden;position:relative;width:100%}a{color:var(--text_secondary)}";
var modules_c21c94f2$1 = {"img":"index_module_img__5c381e3b","mangaFlowBox":"index_module_mangaFlowBox__5c381e3b","mangaFlow":"index_module_mangaFlow__5c381e3b","disableZoom":"index_module_disableZoom__5c381e3b","scrollMode":"index_module_scrollMode__5c381e3b","endPage":"index_module_endPage__5c381e3b","tip":"index_module_tip__5c381e3b","toolbar":"index_module_toolbar__5c381e3b","toolbarPanel":"index_module_toolbarPanel__5c381e3b","SettingPanelPopper":"index_module_SettingPanelPopper__5c381e3b","SettingPanel":"index_module_SettingPanel__5c381e3b","SettingBlock":"index_module_SettingBlock__5c381e3b","SettingBlockSubtitle":"index_module_SettingBlockSubtitle__5c381e3b","SettingsItem":"index_module_SettingsItem__5c381e3b","SettingsItemName":"index_module_SettingsItemName__5c381e3b","SettingsItemSwitch":"index_module_SettingsItemSwitch__5c381e3b","SettingsItemSwitchRound":"index_module_SettingsItemSwitchRound__5c381e3b","SettingsItemIconButton":"index_module_SettingsItemIconButton__5c381e3b","closeCover":"index_module_closeCover__5c381e3b","scrollbar":"index_module_scrollbar__5c381e3b","scrollbarDrag":"index_module_scrollbarDrag__5c381e3b","scrollbarPage":"index_module_scrollbarPage__5c381e3b","scrollbarPoper":"index_module_scrollbarPoper__5c381e3b","touchAreaRoot":"index_module_touchAreaRoot__5c381e3b","touchArea":"index_module_touchArea__5c381e3b","hidden":"index_module_hidden__5c381e3b","invisible":"index_module_invisible__5c381e3b","opacity1":"index_module_opacity1__5c381e3b","opacity0":"index_module_opacity0__5c381e3b","root":"index_module_root__5c381e3b"};
n(css$1,{});

const _tmpl$$v = /*#__PURE__*/web.template(\`<img>\`);
/** 漫画图片 */
const ComicImg = props => {
  let imgRef;
  const type = solidJs.createMemo(() => {
    // 卷轴模式下全部显示
    if (store$1.option.scrollMode) return {
      show: ''
    };
    const activePage = store$1.pageList[store$1.activePageIndex];
    if (!activePage?.includes(props.index)) return {
      show: undefined
    };
    return {
      show: '',
      fill: (() => {
        const i = activePage.indexOf(-1);
        if (i === -1) return undefined;
        return !!i === (store$1.option.dir === 'rtl') ? 'left' : 'right';
      })()
    };
  });
  return (() => {
    const _el$ = _tmpl$$v();
    _el$.addEventListener("error", e => handleImgError(props.index, e.currentTarget));
    _el$.addEventListener("load", e => handleImgLoaded(props.index, e.currentTarget));
    const _ref$ = imgRef;
    typeof _ref$ === "function" ? web.use(_ref$, _el$) : imgRef = _el$;
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.img,
        _v$2 = props.img.loadType === 'wait' ? '' : props.img.src,
        _v$3 = \`\${props.index}\`,
        _v$4 = type().show,
        _v$5 = type().fill,
        _v$6 = props.img.type,
        _v$7 = props.img.loadType;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$, "src", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && web.setAttribute(_el$, "alt", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && web.setAttribute(_el$, "data-show", _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && web.setAttribute(_el$, "data-fill", _p$._v$5 = _v$5);
      _v$6 !== _p$._v$6 && web.setAttribute(_el$, "data-type", _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.setAttribute(_el$, "data-load-type", _p$._v$7 = _v$7);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined
    });
    return _el$;
  })();
};

const _tmpl$$u = /*#__PURE__*/web.template(\`<div><div>\`);

/**
 * 漫画图片流的容器
 */
const ComicImgFlow = () => {
  let mangaFlowRef;
  // 绑定 mangaFlowRef
  solidJs.onMount(() => {
    setState(state => {
      state.mangaFlowRef = mangaFlowRef;
      initPanzoom(state);
    });
  });
  return (() => {
    const _el$ = _tmpl$$u(),
      _el$2 = _el$.firstChild;
    web.addEventListener(_el$, "scroll", handleMangaFlowScroll);
    const _ref$ = mangaFlowRef;
    typeof _ref$ === "function" ? web.use(_ref$, _el$2) : mangaFlowRef = _el$2;
    web.insert(_el$2, web.createComponent(solidJs.Index, {
      get each() {
        return store$1.imgList;
      },
      children: (img, i) => web.createComponent(ComicImg, {
        get img() {
          return img();
        },
        index: i
      })
    }));
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.mangaFlowBox,
        _v$2 = modules_c21c94f2$1.mangaFlow,
        _v$3 = modules_c21c94f2$1.mangaFlow,
        _v$4 = {
          [modules_c21c94f2$1.disableZoom]: store$1.option.disableZoom || store$1.option.scrollMode,
          [modules_c21c94f2$1.scrollMode]: store$1.option.scrollMode
        },
        _v$5 = store$1.option.dir;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$2, "id", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && web.className(_el$2, _p$._v$3 = _v$3);
      _p$._v$4 = web.classList(_el$2, _v$4, _p$._v$4);
      _v$5 !== _p$._v$5 && web.setAttribute(_el$2, "dir", _p$._v$5 = _v$5);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined
    });
    return _el$;
  })();
};

const _tmpl$$t = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14c-.55 0-1-.45-1-1V9h-1c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z">\`);
const MdLooksOne = ((props = {}) => (() => {
  const _el$ = _tmpl$$t();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$s = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2h-2v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2h2V9h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c1.1 0 2 .9 2 2v2z">\`);
const MdLooksTwo = ((props = {}) => (() => {
  const _el$ = _tmpl$$s();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$r = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M3 21h17c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 4v1c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1z">\`);
const MdViewDay = ((props = {}) => (() => {
  const _el$ = _tmpl$$r();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$q = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3V6c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z">\`);
const MdQueue = ((props = {}) => (() => {
  const _el$ = _tmpl$$q();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$p = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">\`);
const MdSettings = ((props = {}) => (() => {
  const _el$ = _tmpl$$p();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$o = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">\`);
const MdSearch = ((props = {}) => (() => {
  const _el$ = _tmpl$$o();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$n = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M9 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1H9.17C7.08 2 5.22 3.53 5.02 5.61A3.998 3.998 0 0 0 9 10zm11.65 7.65-2.79-2.79a.501.501 0 0 0-.86.35V17H6c-.55 0-1 .45-1 1s.45 1 1 1h11v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z">\`);
const MdOutlineFormatTextdirectionLToR = ((props = {}) => (() => {
  const _el$ = _tmpl$$n();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$m = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M10 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1h-6.83C8.08 2 6.22 3.53 6.02 5.61A3.998 3.998 0 0 0 10 10zm-2 7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1s-.45-1-1-1H8z">\`);
const MdOutlineFormatTextdirectionRToL = ((props = {}) => (() => {
  const _el$ = _tmpl$$m();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$l = /*#__PURE__*/web.template(\`<div><div> <!> \`);
/**
 * 设置菜单项
 */
const SettingsItem = props => (() => {
  const _el$ = _tmpl$$l(),
    _el$2 = _el$.firstChild,
    _el$3 = _el$2.firstChild,
    _el$5 = _el$3.nextSibling,
    _el$4 = _el$5.nextSibling;
  web.insert(_el$2, () => props.name, _el$5);
  web.insert(_el$, () => props.children, null);
  web.effect(_p$ => {
    const _v$ = props.class ? \`\${modules_c21c94f2$1.SettingsItem} \${props.class}\` : modules_c21c94f2$1.SettingsItem,
      _v$2 = {
        [props.class ?? '']: !!props.class?.length,
        ...props.classList
      },
      _v$3 = modules_c21c94f2$1.SettingsItemName;
    _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
    _p$._v$2 = web.classList(_el$, _v$2, _p$._v$2);
    _v$3 !== _p$._v$3 && web.className(_el$2, _p$._v$3 = _v$3);
    return _p$;
  }, {
    _v$: undefined,
    _v$2: undefined,
    _v$3: undefined
  });
  return _el$;
})();

const _tmpl$$k = /*#__PURE__*/web.template(\`<button type="button"><div>\`);
/**
 * 开关式菜单项
 */
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
      const _el$ = _tmpl$$k(),
        _el$2 = _el$.firstChild;
      _el$.$$click = handleClick;
      web.effect(_p$ => {
        const _v$ = modules_c21c94f2$1.SettingsItemSwitch,
          _v$2 = props.value,
          _v$3 = modules_c21c94f2$1.SettingsItemSwitchRound;
        _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-checked", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && web.className(_el$2, _p$._v$3 = _v$3);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined,
        _v$3: undefined
      });
      return _el$;
    }
  });
};
web.delegateEvents(["click"]);

const _tmpl$$j = /*#__PURE__*/web.template(\`<button type="button">\`),
  _tmpl$2$6 = /*#__PURE__*/web.template(\`<input type="color">\`),
  _tmpl$3$2 = /*#__PURE__*/web.template(\`<a href="https://github.com/hymbz/ComicReadScript">0.0.1\`),
  _tmpl$4 = /*#__PURE__*/web.template(\`<div><a href="https://github.com/hymbz/ComicReadScript/issues">Github</a><a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback">Greasy Fork\`);
/** 默认菜单项 */
const defaultSettingList = [['阅读方向', () => web.createComponent(SettingsItem, {
  get name() {
    return store$1.option.dir === 'rtl' ? '从右到左（日漫）' : '从左到右（美漫）';
  },
  get children() {
    const _el$ = _tmpl$$j();
    _el$.$$click = () => setOption(draftOption => {
      draftOption.dir = draftOption.dir === 'rtl' ? 'ltr' : 'rtl';
    });
    web.insert(_el$, (() => {
      const _c$ = web.memo(() => store$1.option.dir === 'rtl');
      return () => _c$() ? web.createComponent(MdOutlineFormatTextdirectionRToL, {}) : web.createComponent(MdOutlineFormatTextdirectionLToR, {});
    })());
    web.effect(() => web.className(_el$, modules_c21c94f2$1.SettingsItemIconButton));
    return _el$;
  }
})], ['滚动条', () => [web.createComponent(SettingsItemSwitch, {
  name: "\\u663E\\u793A\\u6EDA\\u52A8\\u6761",
  get value() {
    return store$1.option.scrollbar.enabled;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.scrollbar.enabled = !draftOption.scrollbar.enabled;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u81EA\\u52A8\\u9690\\u85CF\\u6EDA\\u52A8\\u6761",
  get value() {
    return store$1.option.scrollbar.autoHidden;
  },
  get classList() {
    return {
      [modules_c21c94f2$1.hidden]: store$1.option.scrollbar.enabled
    };
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.scrollbar.autoHidden = !draftOption.scrollbar.autoHidden;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u663E\\u793A\\u56FE\\u7247\\u52A0\\u8F7D\\u72B6\\u6001",
  get value() {
    return store$1.option.scrollbar.showProgress;
  },
  get classList() {
    return {
      [modules_c21c94f2$1.hidden]: store$1.option.scrollbar.enabled
    };
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.scrollbar.showProgress = !draftOption.scrollbar.showProgress;
    });
  }
})]], ['点击翻页', () => [web.createComponent(SettingsItemSwitch, {
  name: "\\u542F\\u7528\\u70B9\\u51FB\\u7FFB\\u9875",
  get value() {
    return store$1.option.clickPage.enabled;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.clickPage.enabled = !draftOption.clickPage.enabled;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u5DE6\\u53F3\\u53CD\\u8F6C\\u70B9\\u51FB\\u533A\\u57DF",
  get value() {
    return store$1.option.clickPage.overturn;
  },
  get classList() {
    return {
      [modules_c21c94f2$1.hidden]: store$1.option.clickPage.enabled
    };
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.clickPage.overturn = !draftOption.clickPage.overturn;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u663E\\u793A\\u70B9\\u51FB\\u533A\\u57DF\\u63D0\\u793A",
  get value() {
    return store$1.showTouchArea;
  },
  get classList() {
    return {
      [modules_c21c94f2$1.hidden]: store$1.option.clickPage.enabled
    };
  },
  onChange: () => {
    setState(state => {
      state.showTouchArea = !state.showTouchArea;
    });
  }
})]], ['其他', () => [web.createComponent(SettingsItemSwitch, {
  name: "\\u7FFB\\u9875\\u81F3\\u4E0A/\\u4E0B\\u4E00\\u8BDD",
  get value() {
    return store$1.option.flipToNext;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.flipToNext = !draftOption.flipToNext;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u542F\\u7528\\u591C\\u95F4\\u6A21\\u5F0F",
  get value() {
    return store$1.option.darkMode;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.darkMode = !draftOption.darkMode;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u7981\\u6B62\\u653E\\u5927\\u56FE\\u7247",
  get value() {
    return store$1.option.disableZoom;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.disableZoom = !draftOption.disableZoom;
    });
  }
}), web.createComponent(SettingsItemSwitch, {
  name: "\\u59CB\\u7EC8\\u52A0\\u8F7D\\u6240\\u6709\\u56FE\\u7247",
  get value() {
    return store$1.option.alwaysLoadAllImg;
  },
  onChange: () => {
    setOption(draftOption => {
      draftOption.alwaysLoadAllImg = !draftOption.alwaysLoadAllImg;
    });
    setState(updateImgLoadType);
  }
}), web.createComponent(SettingsItem, {
  name: "\\u80CC\\u666F\\u989C\\u8272",
  get children() {
    const _el$2 = _tmpl$2$6();
    _el$2.addEventListener("change", e => {
      setOption(draftOption => {
        // 在拉到纯黑或纯白时改回初始值
        draftOption.customBackground = e.target.value === '#000000' || e.target.value === '#ffffff' ? undefined : e.target.value;
        draftOption.darkMode = needDarkMode(e.target.value);
      });
    });
    _el$2.style.setProperty("width", "2em");
    _el$2.style.setProperty("margin-right", ".4em");
    web.effect(() => _el$2.value = store$1.option.customBackground ?? (store$1.option.darkMode ? 'black' : 'white'));
    return _el$2;
  }
})]], ['关于', () => [web.createComponent(SettingsItem, {
  name: "\\u7248\\u672C\\u53F7",
  get children() {
    return _tmpl$3$2();
  }
}), web.createComponent(SettingsItem, {
  name: "\\u53CD\\u9988",
  get children() {
    const _el$4 = _tmpl$4(),
      _el$5 = _el$4.firstChild;
    _el$5.style.setProperty("margin-right", ".5em");
    return _el$4;
  }
})]]];
web.delegateEvents(["click"]);

const stopPropagation = e => {
  e.stopPropagation();
};

const _tmpl$$i = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$5 = /*#__PURE__*/web.template(\`<div><div>\`),
  _tmpl$3$1 = /*#__PURE__*/web.template(\`<hr>\`);

/** 菜单面板 */
const SettingPanel = () => {
  const settingList = solidJs.createMemo(() => store$1.editSettingList(defaultSettingList));
  return (() => {
    const _el$ = _tmpl$$i();
    web.addEventListener(_el$, "wheel", stopPropagation);
    web.addEventListener(_el$, "scroll", stopPropagation);
    web.insert(_el$, web.createComponent(solidJs.For, {
      get each() {
        return settingList();
      },
      children: ([key, SettingItem], i) => [web.memo((() => {
        const _c$ = web.memo(() => !!i());
        return () => _c$() ? _tmpl$3$1() : null;
      })()), (() => {
        const _el$2 = _tmpl$2$5(),
          _el$3 = _el$2.firstChild;
        web.insert(_el$3, key);
        web.insert(_el$2, web.createComponent(SettingItem, {}), null);
        web.effect(_p$ => {
          const _v$ = modules_c21c94f2$1.SettingBlock,
            _v$2 = modules_c21c94f2$1.SettingBlockSubtitle;
          _v$ !== _p$._v$ && web.className(_el$2, _p$._v$ = _v$);
          _v$2 !== _p$._v$2 && web.className(_el$3, _p$._v$2 = _v$2);
          return _p$;
        }, {
          _v$: undefined,
          _v$2: undefined
        });
        return _el$2;
      })()]
    }));
    web.effect(() => web.className(_el$, modules_c21c94f2$1.SettingPanel));
    return _el$;
  })();
};

const _tmpl$$h = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$4 = /*#__PURE__*/web.template(\`<div role="button" tabindex="-1" aria-label="关闭设置弹窗的遮罩">\`);
/** 工具栏按钮分隔栏 */
const buttonListDivider = () => (() => {
  const _el$ = _tmpl$$h();
  _el$.style.setProperty("height", "1em");
  return _el$;
})();

/** 工具栏的默认按钮列表 */
const defaultButtonList = [
// 单双页模式
() => {
  const isOnePageMode = store$1.option.onePageMode;
  const handleClick = () => {
    setState(state => {
      setOption(draftOption => {
        draftOption.onePageMode = !draftOption.onePageMode;
      });
      updatePageData(state);
      state.activePageIndex = state.option.onePageMode ? activeImgIndex() : state.pageList.findIndex(page => page.includes(activeImgIndex()));
    });
  };
  return web.createComponent(IconButton, {
    tip: isOnePageMode ? '单页模式' : '双页模式',
    onClick: handleClick,
    get hidden() {
      return store$1.option.scrollMode;
    },
    get children() {
      return isOnePageMode ? web.createComponent(MdLooksOne, {}) : web.createComponent(MdLooksTwo, {});
    }
  });
},
// 卷轴模式
() => {
  const handleClick = () => {
    setState(state => {
      setOption(draftOption => {
        draftOption.scrollMode = !draftOption.scrollMode;
        draftOption.onePageMode = draftOption.scrollMode;
      });
      updatePageData(state);
    });
    setTimeout(handleMangaFlowScroll);
  };
  return web.createComponent(IconButton, {
    tip: "\\u5377\\u8F74\\u6A21\\u5F0F",
    get enabled() {
      return store$1.option.scrollMode;
    },
    onClick: handleClick,
    get children() {
      return web.createComponent(MdViewDay, {});
    }
  });
},
// 页面填充
() => {
  return web.createComponent(IconButton, {
    tip: "\\u9875\\u9762\\u586B\\u5145",
    get enabled() {
      return store$1.fillEffect[nowFillIndex()];
    },
    get hidden() {
      return store$1.option.onePageMode;
    },
    onClick: switchFillEffect,
    get children() {
      return web.createComponent(MdQueue, {});
    }
  });
}, buttonListDivider,
// 放大模式
() => {
  const handleClick = () => {
    if (!store$1.panzoom) return;
    const {
      scale
    } = store$1.panzoom.getTransform();
    if (scale === 1) store$1.panzoom.zoomTo(0, 0, 1.2);else store$1.panzoom.zoomAbs(0, 0, 1);
  };
  return web.createComponent(IconButton, {
    tip: "\\u653E\\u5927\\u6A21\\u5F0F",
    get enabled() {
      return store$1.isZoomed;
    },
    onClick: handleClick,
    get children() {
      return web.createComponent(MdSearch, {});
    }
  });
},
// 设置
props => {
  const [showPanel, setShowPanel] = solidJs.createSignal(false);
  const handleClick = () => {
    const _showPanel = !showPanel();
    setState(state => {
      state.showToolbar = _showPanel;
    });
    setShowPanel(_showPanel);
    props.onMouseLeave();
  };
  const popper = solidJs.createMemo(() => [web.createComponent(SettingPanel, {}), (() => {
    const _el$2 = _tmpl$2$4();
    _el$2.$$click = handleClick;
    web.effect(() => web.className(_el$2, modules_c21c94f2$1.closeCover));
    return _el$2;
  })()]);
  return web.createComponent(IconButton, {
    tip: "\\u8BBE\\u7F6E",
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
web.delegateEvents(["click"]);

const useHover = () => {
  const [isHover, setIsHover] = solidJs.createSignal(false);
  return {
    isHover,
    /** 鼠标移入 */
    handleMouseEnter: () => setIsHover(true),
    /** 鼠标移出 */
    handleMouseLeave: () => setIsHover(false)
  };
};

const _tmpl$$g = /*#__PURE__*/web.template(\`<div role="toolbar"><div>\`);

/** 左侧工具栏 */
const Toolbar = () => {
  const {
    isHover,
    handleMouseEnter,
    handleMouseLeave
  } = useHover();
  return (() => {
    const _el$ = _tmpl$$g(),
      _el$2 = _el$.firstChild;
    web.addEventListener(_el$, "mouseenter", handleMouseEnter);
    web.addEventListener(_el$, "mouseleave", handleMouseLeave);
    web.insert(_el$2, web.createComponent(solidJs.For, {
      get each() {
        return store$1.editButtonList(defaultButtonList);
      },
      children: ButtonItem => web.createComponent(ButtonItem, {
        onMouseLeave: handleMouseLeave
      })
    }));
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.toolbar,
        _v$2 = isHover() || store$1.showToolbar,
        _v$3 = modules_c21c94f2$1.toolbarPanel;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-show", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && web.className(_el$2, _p$._v$3 = _v$3);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });
    return _el$;
  })();
};

const defaultStata = () => ({
  type: 'start',
  xy: [0, 0],
  initial: [0, 0],
  startTime: 0
});
const state = defaultStata();
const useDrag = ref => {
  solidJs.onMount(() => {
    const controller = new AbortController();
    const {
      handleDrag
    } = dragOption;
    if (ref) {
      // 在鼠标、手指按下后切换状态
      ref.addEventListener('mousedown', e => {
        e.stopPropagation();
        // 只处理左键按下触发的事件
        if (e.buttons !== 1) return;
        state.type = 'start';
        state.xy = [e.offsetX, e.offsetY];
        state.initial = [e.offsetX, e.offsetY];
        state.startTime = Date.now();
        handleDrag(state, e);
      }, {
        capture: false,
        passive: true,
        signal: controller.signal
      });

      // TODO: 完成触摸事件的适配
      // ref.addEventListener(
      //   'touchstart',
      //   (e) => {
      //     down = true;
      //     handleDrag(e., e.offsetY);
      //   },
      //   { capture: false, passive: true, signal: controller.signal },
      // );

      // 在鼠标、手指移动时根据状态判断是否要触发函数
      ref.addEventListener('mousemove', e => {
        e.stopPropagation();
        if (state.startTime === 0) return;
        // 只处理左键按下触发的事件
        if (e.buttons !== 1) return;
        state.type = 'dragging';
        state.xy = [e.offsetX, e.offsetY];
        handleDrag(state, e);
      }, {
        capture: false,
        passive: true,
        signal: controller.signal
      });

      // 在鼠标、手指松开后切换状态
      ref.addEventListener('mouseup', e => {
        e.stopPropagation();
        if (state.startTime === 0) return;
        state.type = 'end';
        state.xy = [e.offsetX, e.offsetY];
        handleDrag(state, e);
        Object.assign(state, defaultStata());
      }, {
        capture: false,
        passive: true,
        signal: controller.signal
      });
    }
    solidJs.onCleanup(() => controller.abort());
  });
};

const _tmpl$$f = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$2$3 = /*#__PURE__*/web.template(\`<div role="scrollbar" tabindex="-1"><div><div>\`);

/** 滚动条上用于显示对应图片加载情况的元素 */
const ScrollbarPage = props => (() => {
  const _el$ = _tmpl$$f();
  web.effect(_p$ => {
    const _v$ = modules_c21c94f2$1.scrollbarPage,
      _v$2 = props.index,
      _v$3 = store$1.imgList[props.index].loadType;
    _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
    _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-index", _p$._v$2 = _v$2);
    _v$3 !== _p$._v$3 && web.setAttribute(_el$, "data-type", _p$._v$3 = _v$3);
    return _p$;
  }, {
    _v$: undefined,
    _v$2: undefined,
    _v$3: undefined
  });
  return _el$;
})();

/** 滚动条 */
const Scrollbar = () => {
  /** 滚动条高度 */
  const height = solidJs.createMemo(() => store$1.scrollbar.dragHeight ? \`\${store$1.scrollbar.dragHeight * 100}%\` : \`\${1 / store$1.pageList.length * 100}%\`);

  /** 滚动条位置高度 */
  const top = solidJs.createMemo(() => store$1.option.scrollMode ? \`\${store$1.scrollbar.dragTop * 100}%\` : \`\${1 / store$1.pageList.length * 100 * store$1.activePageIndex}%\`);
  return (() => {
    const _el$2 = _tmpl$2$3(),
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.firstChild;
    web.addEventListener(_el$2, "wheel", handleWheel);
    web.use(e => useDrag(e), _el$2);
    web.insert(_el$4, () => store$1.scrollbar.tipText);
    web.insert(_el$2, web.createComponent(solidJs.Show, {
      get when() {
        return store$1.option.scrollbar.showProgress;
      },
      get children() {
        return web.createComponent(solidJs.For, {
          get each() {
            return store$1.pageList;
          },
          children: ([a, b]) => (() => {
            const _el$5 = _tmpl$$f();
            web.insert(_el$5, web.createComponent(ScrollbarPage, {
              index: a !== -1 ? a : b
            }), null);
            web.insert(_el$5, b ? web.createComponent(ScrollbarPage, {
              index: b !== -1 ? b : a
            }) : null, null);
            return _el$5;
          })()
        });
      }
    }), null);
    web.effect(_p$ => {
      const _v$4 = modules_c21c94f2$1.scrollbar,
        _v$5 = {
          [modules_c21c94f2$1.hidden]: !store$1.option.scrollbar.enabled && !store$1.showScrollbar
        },
        _v$6 = modules_c21c94f2$1.mangaFlow,
        _v$7 = store$1.activePageIndex || -1,
        _v$8 = modules_c21c94f2$1.scrollbarDrag,
        _v$9 = !store$1.option.scrollbar.autoHidden || store$1.showScrollbar,
        _v$10 = height(),
        _v$11 = top(),
        _v$12 = store$1.option.scrollMode ? undefined : 'top 150ms',
        _v$13 = modules_c21c94f2$1.scrollbarPoper,
        _v$14 = {
          [modules_c21c94f2$1.hidden]: !store$1.scrollbar.tipText
        },
        _v$15 = store$1.showScrollbar;
      _v$4 !== _p$._v$4 && web.className(_el$2, _p$._v$4 = _v$4);
      _p$._v$5 = web.classList(_el$2, _v$5, _p$._v$5);
      _v$6 !== _p$._v$6 && web.setAttribute(_el$2, "aria-controls", _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.setAttribute(_el$2, "aria-valuenow", _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && web.className(_el$3, _p$._v$8 = _v$8);
      _v$9 !== _p$._v$9 && web.setAttribute(_el$3, "data-show", _p$._v$9 = _v$9);
      _v$10 !== _p$._v$10 && ((_p$._v$10 = _v$10) != null ? _el$3.style.setProperty("height", _v$10) : _el$3.style.removeProperty("height"));
      _v$11 !== _p$._v$11 && ((_p$._v$11 = _v$11) != null ? _el$3.style.setProperty("top", _v$11) : _el$3.style.removeProperty("top"));
      _v$12 !== _p$._v$12 && ((_p$._v$12 = _v$12) != null ? _el$3.style.setProperty("transition", _v$12) : _el$3.style.removeProperty("transition"));
      _v$13 !== _p$._v$13 && web.className(_el$4, _p$._v$13 = _v$13);
      _p$._v$14 = web.classList(_el$4, _v$14, _p$._v$14);
      _v$15 !== _p$._v$15 && web.setAttribute(_el$4, "data-show", _p$._v$15 = _v$15);
      return _p$;
    }, {
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined,
      _v$9: undefined,
      _v$10: undefined,
      _v$11: undefined,
      _v$12: undefined,
      _v$13: undefined,
      _v$14: undefined,
      _v$15: undefined
    });
    return _el$2;
  })();
};

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

const _tmpl$$e = /*#__PURE__*/web.template(\`<div><div data-area="prev" role="button" tabindex="-1"><h6>上 一 页</div><div data-area="menu" role="button" tabindex="-1"><h6>菜 单</div><div data-area="next" role="button" tabindex="-1"><h6>下 一 页\`);
const TouchArea = () => {
  /** 处理双击缩放 */
  const handleDoubleClickZoom = e => {
    if (!store$1.panzoom) {
      console.warn('panzoom 未加载');
      return;
    }
    const {
      scale
    } = store$1.panzoom.getTransform();

    // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
    if (scale > 2) store$1.panzoom.smoothZoomAbs(e.clientX, e.clientY, 1);else store$1.panzoom.smoothZoomAbs(e.clientX, e.clientY, scale + 1);
  };
  const handleClickNext = useDoubleClick(() => {
    if (store$1.option.clickPage.enabled) setState(state => turnPage(state, 'next'));
  }, handleDoubleClickZoom);
  const handleClickPrev = useDoubleClick(() => {
    if (store$1.option.clickPage.enabled) setState(state => turnPage(state, 'prev'));
  }, handleDoubleClickZoom);
  const handleClickMenu = useDoubleClick(() => {
    // 处于放大模式时跳过不处理
    if (store$1.isZoomed) return;
    setState(state => {
      state.showScrollbar = !state.showScrollbar;
      state.showToolbar = !state.showToolbar;
    });
  }, handleDoubleClickZoom);

  // 在右键点击时使自身可穿透，使右键菜单为图片的右键菜单
  const [penetrate, setPenetrate] = solidJs.createSignal();
  // 之后再立刻恢复回来
  solidJs.createEffect(solidJs.on(penetrate, () => setPenetrate()));
  return (() => {
    const _el$ = _tmpl$$e(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.nextSibling;
    web.addEventListener(_el$, "contextmenu", setPenetrate, true);
    web.addEventListener(_el$2, "click", handleClickPrev, true);
    web.addEventListener(_el$3, "click", handleClickMenu, true);
    web.addEventListener(_el$4, "click", handleClickNext, true);
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.touchAreaRoot,
        _v$2 = penetrate() || store$1.option.scrollMode ? 'none' : 'auto',
        _v$3 = store$1.option.dir === 'rtl' === (store$1.option.clickPage.enabled && store$1.option.clickPage.overturn) ? undefined : 'row-reverse',
        _v$4 = store$1.isZoomed ? 'move' : undefined,
        _v$5 = store$1.showTouchArea,
        _v$6 = modules_c21c94f2$1.touchArea,
        _v$7 = modules_c21c94f2$1.touchArea,
        _v$8 = modules_c21c94f2$1.touchArea;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && ((_p$._v$2 = _v$2) != null ? _el$.style.setProperty("pointer-events", _v$2) : _el$.style.removeProperty("pointer-events"));
      _v$3 !== _p$._v$3 && ((_p$._v$3 = _v$3) != null ? _el$.style.setProperty("flex-direction", _v$3) : _el$.style.removeProperty("flex-direction"));
      _v$4 !== _p$._v$4 && ((_p$._v$4 = _v$4) != null ? _el$.style.setProperty("cursor", _v$4) : _el$.style.removeProperty("cursor"));
      _v$5 !== _p$._v$5 && web.setAttribute(_el$, "data-show", _p$._v$5 = _v$5);
      _v$6 !== _p$._v$6 && web.className(_el$2, _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.className(_el$3, _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && web.className(_el$4, _p$._v$8 = _v$8);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined
    });
    return _el$;
  })();
};
web.delegateEvents(["contextmenu", "click"]);

const _tmpl$$d = /*#__PURE__*/web.template(\`<div role="button" tabindex="-1"><p></p><button type="button">上一话</button><button type="button" data-is-end>退出</button><button type="button">下一话\`);
let delayTypeTimer = 0;
const EndPage = () => {
  const handleClick = e => {
    e.stopPropagation();
    if (e.target.nodeName === 'BUTTON') return;
    setState(state => {
      state.endPageType = undefined;
    });
  };
  const handleEnd = () => setState(state => {
    state.onExit?.(true);
    state.activePageIndex = 0;
    state.endPageType = undefined;
  });
  let ref;
  solidJs.onMount(() => {
    const controller = new AbortController();
    ref.addEventListener('wheel', e => {
      e.preventDefault();
      e.stopPropagation();
      setState(state => turnPage(state, e.deltaY > 0 ? 'next' : 'prev'));
    }, {
      passive: false,
      signal: controller.signal
    });
    solidJs.onCleanup(() => controller.abort());
  });

  // state.endPageType 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
  // 防止在动画效果结束前 tip 就消失或改变了位置
  const [delayType, setDelayType] = solidJs.createSignal();
  solidJs.createEffect(() => {
    if (store$1.endPageType) {
      window.clearTimeout(delayTypeTimer);
      setDelayType(store$1.endPageType);
    } else {
      delayTypeTimer = window.setTimeout(() => setDelayType(store$1.endPageType), 500);
    }
  });
  const tip = solidJs.createMemo(() => {
    switch (delayType()) {
      case 'start':
        if (store$1.onPrev && store$1.option.flipToNext) return '已到开头，继续翻页将跳至上一话';
        break;
      case 'end':
        if (store$1.onNext && store$1.option.flipToNext) return '已到结尾，继续翻页将跳至下一话';
        if (store$1.onExit) return '已到结尾，继续翻页将退出';
        break;
    }
    return '';
  });
  return (() => {
    const _el$ = _tmpl$$d(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.nextSibling,
      _el$4 = _el$3.nextSibling,
      _el$5 = _el$4.nextSibling;
    _el$.$$click = handleClick;
    const _ref$ = ref;
    typeof _ref$ === "function" ? web.use(_ref$, _el$) : ref = _el$;
    web.insert(_el$2, tip);
    web.addEventListener(_el$3, "click", store$1.onPrev, true);
    _el$4.$$click = handleEnd;
    web.addEventListener(_el$5, "click", store$1.onNext, true);
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.endPage,
        _v$2 = store$1.endPageType,
        _v$3 = delayType(),
        _v$4 = modules_c21c94f2$1.tip,
        _v$5 = store$1.onPrev ? undefined : modules_c21c94f2$1.invisible,
        _v$6 = store$1.endPageType ? 0 : -1,
        _v$7 = store$1.endPageType ? 0 : -1,
        _v$8 = store$1.onNext ? undefined : modules_c21c94f2$1.invisible,
        _v$9 = store$1.endPageType ? 0 : -1;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$, "data-show", _p$._v$2 = _v$2);
      _v$3 !== _p$._v$3 && web.setAttribute(_el$, "data-type", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && web.className(_el$2, _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && web.className(_el$3, _p$._v$5 = _v$5);
      _v$6 !== _p$._v$6 && web.setAttribute(_el$3, "tabindex", _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.setAttribute(_el$4, "tabindex", _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && web.className(_el$5, _p$._v$8 = _v$8);
      _v$9 !== _p$._v$9 && web.setAttribute(_el$5, "tabindex", _p$._v$9 = _v$9);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined,
      _v$9: undefined
    });
    return _el$;
  })();
};
web.delegateEvents(["click"]);

/** 深色模式的 css 变量 */
const dark = {
  '--hover_bg_color': '#FFF3',
  '--hover_bg_color_enable': '#FFFa',
  '--switch': '#BDBDBD',
  '--switch_bg': '#6E6E6E',
  '--scrollbar_drag': '#FFF6',
  '--page_bg': '#303030',
  '--secondary': '#7A909A',
  '--secondary_bg': '#556065',
  '--text': 'white',
  '--text_secondary': '#FFFC',
  '--text_bg': '#121212'
};

/** 浅色模式的 css 变量 */
const light = {
  '--hover_bg_color': '#0001',
  '--hover_bg_color_enable': '#0009',
  /* 开关按钮 */
  '--switch': '#FAFAFA',
  /* 开关滑轨 */
  '--switch_bg': '#9C9C9C',
  /* 滚动条 */
  '--scrollbar_drag': '#0006',
  '--page_bg': 'white',
  '--secondary': '#7A909A',
  '--secondary_bg': '#BAC5CA',
  '--text': 'black',
  '--text_secondary': '#0008',
  '--text_bg': '#FAFAFA'
};
const cssVar = solidJs.createRoot(() => {
  const _cssVar = solidJs.createMemo(() => ({
    '--bg': store$1.option.customBackground ?? (store$1.option.darkMode ? 'black' : 'white'),
    '--img_max_width': \`\${store$1.imgMaxWidth}px\`,
    ...(store$1.option.darkMode ? dark : light)
  }));
  return _cssVar;
});

/** 初始化 */
const useInit$1 = (props, rootRef) => {
  // 绑定 rootRef
  setState(state => {
    state.rootRef = rootRef;
  });

  // 初始化配置
  solidJs.createEffect(() => {
    if (!props.option) return;
    setState(state => {
      state.option = {
        ...state.option,
        ...props.option
      };
    });
  });

  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(throttle(100, ([entries]) => {
    const {
      width,
      height
    } = entries.contentRect;
    setState(state => {
      updatePageRatio(state, width, height);
      state.imgMaxWidth = height * 0.5;
    });
  }));
  // 初始化页面比例
  setState(state => {
    updatePageRatio(state, rootRef.scrollWidth, rootRef.scrollHeight);
  });
  resizeObserver.disconnect();
  resizeObserver.observe(rootRef);
  solidJs.onCleanup(() => resizeObserver.disconnect());

  // 处理 imgList fillEffect 参数的初始化和修改
  solidJs.createEffect(() => {
    setState(state => {
      if (props.fillEffect) state.fillEffect = props.fillEffect;

      // 处理初始化
      if (!state.imgList.length) {
        state.imgList = props.imgList.map(imgUrl => ({
          type: '',
          src: imgUrl,
          loadType: 'wait'
        }));
        updatePageData(state);
        return;
      }

      /** 修改前的当前显示图片 */
      const oldActiveImg = state.pageList[state.activePageIndex].map(i => state.imgList?.[i]?.src);
      state.imgList = props.imgList.map(imgUrl => state.imgList.find(img => img.src === imgUrl) ?? {
        type: '',
        src: imgUrl,
        loadType: 'wait'
      });
      updatePageData(state);
      if (state.pageList.length === 0) {
        state.activePageIndex = 0;
        return;
      }

      // 尽量使当前显示的图片在修改后依然不变
      oldActiveImg.some(imgUrl => {
        // 跳过填充页和已被删除的图片
        if (!imgUrl || props.imgList.includes(imgUrl)) return false;
        const newPageIndex = state.pageList.findIndex(page => page.some(index => state.imgList?.[index]?.src === imgUrl));
        if (newPageIndex === -1) return false;
        state.activePageIndex = newPageIndex;
        return true;
      });

      // 如果已经翻到了最后一页，且最后一页的图片被删掉了，那就保持在末页显示
      if (state.activePageIndex > state.pageList.length - 1) state.activePageIndex = state.pageList.length - 1;
    });
  });
  solidJs.createEffect(() => {
    setState(state => {
      if (props.onExit) state.onExit = props.onExit;
      if (props.onPrev) state.onPrev = props.onPrev;
      if (props.onNext) state.onNext = props.onNext;
      if (props.editButtonList) state.editButtonList = props.editButtonList;
      if (props.editSettingList) state.editSettingList = props.editSettingList;
      if (props.onLoading) state.onLoading = debounce(100, props.onLoading);
    });
  });

  // 绑定配置发生改变时的回调
  solidJs.createEffect(solidJs.on(() => store$1.option, async (option, prevOption) => {
    if (!props.onOptionChange) return;
    await props.onOptionChange(store$2.unwrap(option), store$2.unwrap(prevOption));
  }, {
    defer: true
  }));
};

const _tmpl$$c = /*#__PURE__*/web.template(\`<div role="presentation" tabindex="-1">\`);
const MangaStyle = css$1;
solidJs.enableScheduling();
/**
 * 漫画组件
 */
const Manga = props => {
  let rootRef;
  solidJs.onMount(() => {
    useInit$1(props, rootRef);
    rootRef.focus();
  });
  return (() => {
    const _el$ = _tmpl$$c();
    web.addEventListener(_el$, "keydown", stopPropagation, true);
    web.addEventListener(_el$, "keyup", handleKeyUp, true);
    web.addEventListener(_el$, "wheel", handleScroll);
    const _ref$ = rootRef;
    typeof _ref$ === "function" ? web.use(_ref$, _el$) : rootRef = _el$;
    web.insert(_el$, web.createComponent(Toolbar, {}), null);
    web.insert(_el$, web.createComponent(ComicImgFlow, {}), null);
    web.insert(_el$, web.createComponent(Scrollbar, {}), null);
    web.insert(_el$, web.createComponent(TouchArea, {}), null);
    web.insert(_el$, web.createComponent(EndPage, {}), null);
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2$1.root,
        _v$2 = cssVar();
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _p$._v$2 = web.style(_el$, _v$2, _p$._v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });
    return _el$;
  })();
};
web.delegateEvents(["keyup", "keydown"]);

const _tmpl$$b = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29 5.7 12.7a.996.996 0 1 1 1.41-1.41L10 14.17l6.88-6.88a.996.996 0 1 1 1.41 1.41l-7.59 7.59a.996.996 0 0 1-1.41 0z">\`);
const MdCheckCircle = ((props = {}) => (() => {
  const _el$ = _tmpl$$b();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$a = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z">\`);
const MdWarning = ((props = {}) => (() => {
  const _el$ = _tmpl$$a();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$9 = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z">\`);
const MdError = ((props = {}) => (() => {
  const _el$ = _tmpl$$9();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const isFunction = valOrFunction => typeof valOrFunction === 'function';

const resolveValue = (valOrFunction, arg) => isFunction(valOrFunction) ? valOrFunction(arg) : valOrFunction;

let ActionType;

(function (ActionType) {
  ActionType[ActionType["ADD_TOAST"] = 0] = "ADD_TOAST";
  ActionType[ActionType["UPDATE_TOAST"] = 1] = "UPDATE_TOAST";
  ActionType[ActionType["UPSERT_TOAST"] = 2] = "UPSERT_TOAST";
  ActionType[ActionType["DISMISS_TOAST"] = 3] = "DISMISS_TOAST";
  ActionType[ActionType["REMOVE_TOAST"] = 4] = "REMOVE_TOAST";
  ActionType[ActionType["START_PAUSE"] = 5] = "START_PAUSE";
  ActionType[ActionType["END_PAUSE"] = 6] = "END_PAUSE";
})(ActionType || (ActionType = {}));

const [store, setStore] = store$2.createStore({
  toasts: [],
  pausedAt: undefined
});
const createTimers = () => {
  const {
    pausedAt,
    toasts
  } = store;
  if (pausedAt) return;
  const now = Date.now();
  const timers = toasts.map(toast => {
    if (toast.duration === Infinity) return;
    const durationLeft = (toast.duration || 0) + toast.pauseDuration - (now - toast.createdAt);

    if (durationLeft <= 0) {
      if (toast.visible) {
        dispatch({
          type: ActionType.DISMISS_TOAST,
          toastId: toast.id
        });
      }

      return;
    }

    return setTimeout(() => {
      dispatch({
        type: ActionType.DISMISS_TOAST,
        toastId: toast.id
      });
    }, durationLeft);
  });
  return timers;
};
const removalQueue = new Map();

const scheduleRemoval = (toastId, unmountDelay) => {
  if (removalQueue.has(toastId)) return;
  const timeout = setTimeout(() => {
    removalQueue.delete(toastId);
    dispatch({
      type: ActionType.REMOVE_TOAST,
      toastId
    });
  }, unmountDelay);
  removalQueue.set(toastId, timeout);
};

const unscheduleRemoval = toastId => {
  const timeout = removalQueue.get(toastId);
  removalQueue.delete(toastId);
  if (timeout) clearTimeout(timeout);
};

const dispatch = action => {
  switch (action.type) {
    case ActionType.ADD_TOAST:
      setStore('toasts', t => {
        const toasts = t;
        return [action.toast, ...toasts];
      });
      break;

    case ActionType.DISMISS_TOAST:
      const {
        toastId
      } = action;
      const toasts = store.toasts;

      if (toastId) {
        const toastToRemove = toasts.find(t => t.id === toastId);
        if (toastToRemove) scheduleRemoval(toastId, toastToRemove.unmountDelay);
        setStore('toasts', t => t.id === toastId, store$2.produce(t => t.visible = false));
      } else {
        toasts.forEach(t => {
          scheduleRemoval(t.id, t.unmountDelay);
        });
        setStore('toasts', t => t.id !== undefined, store$2.produce(t => t.visible = false));
      }

      break;

    case ActionType.REMOVE_TOAST:
      if (!action.toastId) {
        setStore('toasts', []);
        break;
      }

      setStore('toasts', t => {
        const toasts = t;
        return toasts.filter(t => t.id !== action.toastId);
      });
      break;

    case ActionType.UPDATE_TOAST:
      if (action.toast.id) {
        unscheduleRemoval(action.toast.id);
      }

      setStore('toasts', t => t.id === action.toast.id, t => {
        const toast = t;
        return { ...toast,
          ...action.toast
        };
      });
      break;

    case ActionType.UPSERT_TOAST:
      store.toasts.find(t => t.id === action.toast.id) ? dispatch({
        type: ActionType.UPDATE_TOAST,
        toast: action.toast
      }) : dispatch({
        type: ActionType.ADD_TOAST,
        toast: action.toast
      });
      break;

    case ActionType.START_PAUSE:
      setStore(store$2.produce(s => {
        s.pausedAt = Date.now();
        s.toasts.forEach(t => {
          t.paused = true;
        });
      }));
      break;

    case ActionType.END_PAUSE:
      const pauseInterval = action.time - (store.pausedAt || 0);
      setStore(store$2.produce(s => {
        s.pausedAt = undefined;
        s.toasts.forEach(t => {
          t.pauseDuration += pauseInterval;
          t.paused = false;
        });
      }));
      break;
  }
};

const defaultTimeouts = {
  blank: 4000,
  error: 4000,
  success: 2000,
  loading: Infinity,
  custom: 4000
};
const defaultToastOptions = {
  id: '',
  icon: '',
  unmountDelay: 500,
  duration: 3000,
  ariaProps: {
    role: 'status',
    'aria-live': 'polite'
  },
  className: '',
  style: {},
  position: 'top-right',
  iconTheme: {}
};
const defaultToasterOptions = {
  position: 'top-right',
  toastOptions: defaultToastOptions,
  gutter: 8,
  containerStyle: {},
  containerClassName: ''
};
const defaultContainerPadding = '16px';
const defaultContainerStyle = {
  position: 'fixed',
  'z-index': 9999,
  top: defaultContainerPadding,
  bottom: defaultContainerPadding,
  left: defaultContainerPadding,
  right: defaultContainerPadding,
  'pointer-events': 'none'
};

const generateID = (() => {
  let count = 0;
  return () => String(++count);
})();
const mergeContainerOptions = props => {
  setDefaultOpts(s => ({
    containerClassName: props.containerClassName ?? s.containerClassName,
    containerStyle: props.containerStyle ?? s.containerStyle,
    gutter: props.gutter ?? s.gutter,
    position: props.position ?? s.position,
    toastOptions: { ...props.toastOptions
    }
  }));
};
const getToastWrapperStyles = (position, offset) => {
  const top = position.includes('top');
  const verticalStyle = top ? {
    top: 0,
    'margin-top': \`\${offset}px\`
  } : {
    bottom: 0,
    'margin-bottom': \`\${offset}px\`
  };
  const horizontalStyle = position.includes('center') ? {
    'justify-content': 'center'
  } : position.includes('right') ? {
    'justify-content': 'flex-end'
  } : {};
  return {
    left: 0,
    right: 0,
    display: 'flex',
    position: 'absolute',
    transition: \`all 230ms cubic-bezier(.21,1.02,.73,1)\`,
    ...verticalStyle,
    ...horizontalStyle
  };
};
const updateToastHeight = (ref, toast) => {
  const boundingRect = ref.getBoundingClientRect();

  if (boundingRect.height !== toast.height) {
    dispatch({
      type: ActionType.UPDATE_TOAST,
      toast: {
        id: toast.id,
        height: boundingRect.height
      }
    });
  }
};
const getWrapperYAxisOffset = (toast, position) => {
  const {
    toasts
  } = store;
  const gutter = defaultOpts().gutter || defaultToasterOptions.gutter || 8;
  const relevantToasts = toasts.filter(t => (t.position || position) === position && t.height);
  const toastIndex = relevantToasts.findIndex(t => t.id === toast.id);
  const toastsBefore = relevantToasts.filter((toast, i) => i < toastIndex && toast.visible).length;
  const offset = relevantToasts.slice(0, toastsBefore).reduce((acc, t) => acc + gutter + (t.height || 0), 0);
  return offset;
};
const getToastYDirection = (toast, defaultPos) => {
  const position = toast.position || defaultPos;
  const top = position.includes('top');
  return top ? 1 : -1;
};

const toastBarBase = {
  display: 'flex',
  'align-items': 'center',
  color: '#363636',
  background: 'white',
  'box-shadow': '0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)',
  'max-width': '350px',
  'pointer-events': 'auto',
  padding: '8px 10px',
  'border-radius': '4px',
  'line-height': '1.3',
  'will-change': 'transform'
};
const messageContainer = {
  display: 'flex',
  'align-items': 'center',
  flex: '1 1 auto',
  margin: '4px 10px',
  'white-space': 'pre-line'
};
const iconContainer = {
  'flex-shrink': 0,
  'min-width': '20px',
  'min-height': '20px',
  display: 'flex',
  'align-items': 'center',
  'justify-content': 'center',
  'text-align': 'center'
};
const genSVGCubicBezier = keySplines => ({
  calcMode: 'spline',
  keyTimes: '0; 1',
  keySplines: keySplines
});

const [defaultOpts, setDefaultOpts] = solidJs.createSignal(defaultToasterOptions);
const createToast = (message, type = 'blank', options) => ({ ...defaultToastOptions,
  ...defaultOpts().toastOptions,
  ...options,
  type,
  message,
  pauseDuration: 0,
  createdAt: Date.now(),
  visible: true,
  id: options.id || generateID(),
  paused: false,
  style: { ...defaultToastOptions.style,
    ...defaultOpts().toastOptions?.style,
    ...options.style
  },
  duration: options.duration || defaultOpts().toastOptions?.duration || defaultTimeouts[type],
  position: options.position || defaultOpts().toastOptions?.position || defaultOpts().position || defaultToastOptions.position
});

const createToastCreator = type => (message, options = {}) => {
  return solidJs.createRoot(() => {
    const existingToast = store.toasts.find(t => t.id === options.id);
    const toast = createToast(message, type, { ...existingToast,
      duration: undefined,
      ...options
    });
    dispatch({
      type: ActionType.UPSERT_TOAST,
      toast
    });
    return toast.id;
  });
};

const toast$1 = (message, opts) => createToastCreator('blank')(message, opts);

solidJs.untrack(() => toast$1);
toast$1.error = createToastCreator('error');
toast$1.success = createToastCreator('success');
toast$1.loading = createToastCreator('loading');
toast$1.custom = createToastCreator('custom');

toast$1.dismiss = toastId => {
  dispatch({
    type: ActionType.DISMISS_TOAST,
    toastId
  });
};

toast$1.promise = (promise, msgs, opts) => {
  const id = toast$1.loading(msgs.loading, { ...opts
  });
  promise.then(p => {
    toast$1.success(resolveValue(msgs.success, p), {
      id,
      ...opts
    });
    return p;
  }).catch(e => {
    toast$1.error(resolveValue(msgs.error, e), {
      id,
      ...opts
    });
  });
  return promise;
};

toast$1.remove = toastId => {
  dispatch({
    type: ActionType.REMOVE_TOAST,
    toastId
  });
};

const _tmpl$$6$1 = /*#__PURE__*/web.template(\`<div><style>.sldt-active{z-index:9999;}.sldt-active>*{pointer-events:auto;}</style></div>\`, 4);
const Toaster = props => {
  solidJs.createEffect(() => {
    mergeContainerOptions(props);
  });
  solidJs.createEffect(() => {
    const timers = createTimers();
    solidJs.onCleanup(() => {
      if (!timers) return;
      timers.forEach(timer => timer && clearTimeout(timer));
    });
  });
  return (() => {
    const _el$ = _tmpl$$6$1.cloneNode(true);
          _el$.firstChild;

    web.insert(_el$, web.createComponent(solidJs.For, {
      get each() {
        return store.toasts;
      },

      children: toast => web.createComponent(ToastContainer, {
        toast: toast
      })
    }), null);

    web.effect(_p$ => {
      const _v$ = { ...defaultContainerStyle,
        ...props.containerStyle
      },
            _v$2 = props.containerClassName;
      _p$._v$ = web.style(_el$, _v$, _p$._v$);
      _v$2 !== _p$._v$2 && web.className(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const _tmpl$$5$1 = /*#__PURE__*/web.template(\`<div></div>\`, 2),
      _tmpl$2$1 = /*#__PURE__*/web.template(\`<div><div></div></div>\`, 4);
const ToastBar = props => {
  let el;
  solidJs.createEffect(() => {
    if (!el) return;
    const direction = getToastYDirection(props.toast, props.position);

    if (props.toast.visible) {
      el.animate([{
        transform: \`translate3d(0,\${direction * -200}%,0) scale(.6)\`,
        opacity: 0.5
      }, {
        transform: 'translate3d(0,0,0) scale(1)',
        opacity: 1
      }], {
        duration: 350,
        fill: 'forwards',
        easing: 'cubic-bezier(.21,1.02,.73,1)'
      });
    } else {
      el.animate([{
        transform: 'translate3d(0,0,-1px) scale(1)',
        opacity: 1
      }, {
        transform: \`translate3d(0,\${direction * -150}%,-1px) scale(.4)\`,
        opacity: 0
      }], {
        duration: 400,
        fill: 'forwards',
        easing: 'cubic-bezier(.06,.71,.55,1)'
      });
    }
  });
  return (() => {
    const _el$ = _tmpl$2$1.cloneNode(true),
          _el$6 = _el$.firstChild;

    const _ref$ = el;
    typeof _ref$ === "function" ? _ref$(_el$) : el = _el$;

    web.insert(_el$, web.createComponent(solidJs.Switch, {
      get children() {
        return [web.createComponent(solidJs.Match, {
          get when() {
            return props.toast.icon;
          },

          get children() {
            const _el$2 = _tmpl$$5$1.cloneNode(true);

            web.insert(_el$2, () => props.toast.icon);

            web.effect(_$p => web.style(_el$2, iconContainer, _$p));

            return _el$2;
          }

        }), web.createComponent(solidJs.Match, {
          get when() {
            return props.toast.type === 'loading';
          },

          get children() {
            const _el$3 = _tmpl$$5$1.cloneNode(true);

            web.insert(_el$3, web.createComponent(Loader, web.mergeProps(() => props.toast.iconTheme)));

            web.effect(_$p => web.style(_el$3, iconContainer, _$p));

            return _el$3;
          }

        }), web.createComponent(solidJs.Match, {
          get when() {
            return props.toast.type === 'success';
          },

          get children() {
            const _el$4 = _tmpl$$5$1.cloneNode(true);

            web.insert(_el$4, web.createComponent(Success, web.mergeProps(() => props.toast.iconTheme)));

            web.effect(_$p => web.style(_el$4, iconContainer, _$p));

            return _el$4;
          }

        }), web.createComponent(solidJs.Match, {
          get when() {
            return props.toast.type === 'error';
          },

          get children() {
            const _el$5 = _tmpl$$5$1.cloneNode(true);

            web.insert(_el$5, web.createComponent(Error$1, web.mergeProps(() => props.toast.iconTheme)));

            web.effect(_$p => web.style(_el$5, iconContainer, _$p));

            return _el$5;
          }

        })];
      }

    }), _el$6);

    web.spread(_el$6, () => props.toast.ariaProps, false, true);

    web.insert(_el$6, () => resolveValue(props.toast.message, props.toast));

    web.effect(_p$ => {
      const _v$ = props.toast.className,
            _v$2 = { ...toastBarBase,
        ...props.toast.style
      },
            _v$3 = messageContainer;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _p$._v$2 = web.style(_el$, _v$2, _p$._v$2);
      _p$._v$3 = web.style(_el$6, _v$3, _p$._v$3);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });

    return _el$;
  })();
};

const _tmpl$$4$1 = /*#__PURE__*/web.template(\`<div></div>\`, 2);
const ToastContainer = props => {
  const calculatePosition = () => {
    const position = props.toast.position || defaultToastOptions.position;
    const offset = getWrapperYAxisOffset(props.toast, position);
    const positionStyle = getToastWrapperStyles(position, offset);
    return positionStyle;
  };

  const positionStyle = solidJs.createMemo(() => calculatePosition());
  let el = undefined;
  solidJs.onMount(() => {
    if (el) {
      updateToastHeight(el, props.toast);
    }
  });
  return (() => {
    const _el$ = _tmpl$$4$1.cloneNode(true);

    _el$.addEventListener("mouseleave", () => dispatch({
      type: ActionType.END_PAUSE,
      time: Date.now()
    }));

    _el$.addEventListener("mouseenter", () => dispatch({
      type: ActionType.START_PAUSE,
      time: Date.now()
    }));

    const _ref$ = el;
    typeof _ref$ === "function" ? _ref$(_el$) : el = _el$;

    web.insert(_el$, (() => {
      const _c$ = web.memo(() => props.toast.type === 'custom', true);

      return () => _c$() ? resolveValue(props.toast.message, props.toast) : web.createComponent(ToastBar, {
        get toast() {
          return props.toast;
        },

        get position() {
          return props.toast.position || defaultToastOptions.position;
        }

      });
    })());

    web.effect(_p$ => {
      const _v$ = positionStyle(),
            _v$2 = props.toast.visible ? 'sldt-active' : '';

      _p$._v$ = web.style(_el$, _v$, _p$._v$);
      _v$2 !== _p$._v$2 && web.className(_el$, _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const _tmpl$$3$1 = /*#__PURE__*/web.template(\`<svg><circle cx="16" cy="16" r="0"><animate attributeName="opacity" values="0; 1; 1"></animate><animate attributeName="r" values="0; 17.5; 16"></animate></circle></svg>\`, 8, true),
      _tmpl$2$2 = /*#__PURE__*/web.template(\`<svg><circle cx="16" cy="16" r="12" opacity="0"><animate attributeName="opacity" values="1; 0"></animate><animate attributeName="r" values="12; 26"></animate></circle></svg>\`, 8, true);
const MainCircle = props => {
  const publicProps = {
    dur: '0.35s',
    begin: '100ms',
    fill: 'freeze',
    calcMode: 'spline',
    keyTimes: '0; 0.6; 1',
    keySplines: '0.25 0.71 0.4 0.88; .59 .22 .87 .63'
  };
  return (() => {
    const _el$ = _tmpl$$3$1.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.nextSibling;

    web.spread(_el$2, publicProps, true, false);

    web.spread(_el$3, publicProps, true, false);

    web.effect(() => web.setAttribute(_el$, "fill", props.fill));

    return _el$;
  })();
};
const SecondaryCircle = props => {
  const publicProps = {
    dur: '1s',
    begin: props.begin || '320ms',
    fill: 'freeze',
    ...genSVGCubicBezier('0.0 0.0 0.2 1')
  };
  return (() => {
    const _el$4 = _tmpl$2$2.cloneNode(true),
          _el$5 = _el$4.firstChild,
          _el$6 = _el$5.nextSibling;

    web.spread(_el$5, publicProps, true, false);

    web.spread(_el$6, publicProps, true, false);

    web.effect(() => web.setAttribute(_el$4, "fill", props.fill));

    return _el$4;
  })();
};

const _tmpl$$2$1 = /*#__PURE__*/web.template(\`<svg viewBox="0 0 32 32" width="1.25rem" height="1.25rem"><path fill="none" stroke-width="4" stroke-dasharray="22" stroke-dashoffset="22" stroke-linecap="round" stroke-miterlimit="10" d="M9.8,17.2l3.8,3.6c0.1,0.1,0.3,0.1,0.4,0l9.6-9.7"><animate attributeName="stroke-dashoffset" values="22;0" dur="0.25s" begin="250ms" fill="freeze"></animate></path></svg>\`, 6);
const Success = props => {
  const fill = props.primary || '#34C759';
  return (() => {
    const _el$ = _tmpl$$2$1.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.firstChild;

    _el$.style.setProperty("overflow", "visible");

    web.insert(_el$, web.createComponent(MainCircle, {
      fill: fill
    }), _el$2);

    web.insert(_el$, web.createComponent(SecondaryCircle, {
      fill: fill,
      begin: "350ms"
    }), _el$2);

    web.spread(_el$3, () => genSVGCubicBezier('0.0, 0.0, 0.58, 1.0'), true, false);

    web.effect(() => web.setAttribute(_el$2, "stroke", props.secondary || '#FCFCFC'));

    return _el$;
  })();
};

const _tmpl$$1$1 = /*#__PURE__*/web.template(\`<svg viewBox="0 0 32 32" width="1.25rem" height="1.25rem"><path fill="none" stroke-width="4" stroke-dasharray="9" stroke-dashoffset="9" stroke-linecap="round" d="M16,7l0,9"><animate attributeName="stroke-dashoffset" values="9;0" dur="0.2s" begin="250ms" fill="freeze"></animate></path><circle cx="16" cy="23" r="2.5" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.25s" begin="350ms" fill="freeze"></animate></circle></svg>\`, 10);
const Error$1 = props => {
  const fill = props.primary || '#FF3B30';
  return (() => {
    const _el$ = _tmpl$$1$1.cloneNode(true),
          _el$2 = _el$.firstChild,
          _el$3 = _el$2.firstChild,
          _el$4 = _el$2.nextSibling,
          _el$5 = _el$4.firstChild;

    _el$.style.setProperty("overflow", "visible");

    web.insert(_el$, web.createComponent(MainCircle, {
      fill: fill
    }), _el$2);

    web.insert(_el$, web.createComponent(SecondaryCircle, {
      fill: fill
    }), _el$2);

    web.spread(_el$3, () => genSVGCubicBezier('0.0, 0.0, 0.58, 1.0'), true, false);

    web.spread(_el$5, () => genSVGCubicBezier('0.0, 0.0, 0.58, 1.0'), true, false);

    web.effect(_p$ => {
      const _v$ = props.secondary || '#FFFFFF',
            _v$2 = props.secondary || '#FFFFFF';

      _v$ !== _p$._v$ && web.setAttribute(_el$2, "stroke", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && web.setAttribute(_el$4, "fill", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });

    return _el$;
  })();
};

const _tmpl$$8 = /*#__PURE__*/web.template(\`<svg viewBox="0 0 32 32" width="1.25rem" height="1.25rem"><path fill="none" stroke-width="4" stroke-miterlimit="10" d="M16,6c3,0,5.7,1.3,7.5,3.4c1.5,1.8,2.5,4,2.5,6.6c0,5.5-4.5,10-10,10S6,21.6,6,16S10.5,6,16,6z"></path><path fill="none" stroke-width="4" stroke-linecap="round" stroke-miterlimit="10" d="M16,6c3,0,5.7,1.3,7.5,3.4c0.6,0.7,1.1,1.4,1.5,2.2"><animateTransform attributeName="transform" type="rotate" from="0 16 16" to="360 16 16" dur="0.75s" repeatCount="indefinite"></animateTransform></path></svg>\`, 8);

const Loader = props => (() => {
  const _el$ = _tmpl$$8.cloneNode(true),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling;

  _el$.style.setProperty("overflow", "visible");

  web.effect(_p$ => {
    const _v$ = props.primary || '#E5E7EB',
          _v$2 = props.secondary || '#4b5563';

    _v$ !== _p$._v$ && web.setAttribute(_el$2, "stroke", _p$._v$ = _v$);
    _v$2 !== _p$._v$2 && web.setAttribute(_el$3, "stroke", _p$._v$2 = _v$2);
    return _p$;
  }, {
    _v$: undefined,
    _v$2: undefined
  });

  return _el$;
})();

var toast$2 = toast$1;

const _tmpl$$7 = /*#__PURE__*/web.template(\`<div>\`);
let dom$1;
const toast = (message, opts) => {
  if (!dom$1) {
    dom$1 = mountComponents('toast', () => web.createComponent(Toaster, {
      position: "bottom-right",
      containerStyle: {
        'z-index': '9999999999'
      },
      toastOptions: {
        duration: 3000,
        style: {
          background: '#1f2937',
          color: '#f3f4f6'
        }
      }
    }));
  }
  toast$2(message, opts);
};
toast.success = (message, opts) => toast(message, {
  icon: (() => {
    const _el$ = _tmpl$$7();
    _el$.style.setProperty("color", "#23bb35");
    _el$.style.setProperty("display", "flex");
    web.insert(_el$, web.createComponent(MdCheckCircle, {}));
    return _el$;
  })(),
  ...opts
});
toast.warn = (message, opts) => toast(message, {
  icon: (() => {
    const _el$2 = _tmpl$$7();
    _el$2.style.setProperty("color", "#f0c53e");
    _el$2.style.setProperty("display", "flex");
    web.insert(_el$2, web.createComponent(MdWarning, {}));
    return _el$2;
  })(),
  ...opts
});
toast.error = (message, opts) => toast(message, {
  icon: (() => {
    const _el$3 = _tmpl$$7();
    _el$3.style.setProperty("color", "#e45042");
    _el$3.style.setProperty("display", "flex");
    web.insert(_el$3, web.createComponent(MdError, {}));
    return _el$3;
  })(),
  ...opts
});

const _tmpl$$6 = /*#__PURE__*/web.template(\`<style type="text/css">\`);
let dom;

/**
 * 显示漫画阅读窗口
 */
const useManga = async initProps => {
  await GM.addStyle(\`
    #comicRead {
      position: fixed;
      z-index: 999999999;
      top: 0;
      left: 0;
      transform: scale(0);

      width: 100vw;
      height: 100vh;

      font-size: 16px;

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }

    #comicRead.show {
      transform: scale(1);
      opacity: 1;
      transition: opacity 300ms, transform 100ms;
    }
  \`);
  const [props, setProps] = store$2.createStore({
    imgList: [],
    show: false,
    ...initProps
  });
  const set = recipe => {
    if (!dom) {
      dom = mountComponents('comicRead', () => [web.createComponent(Manga, props), (() => {
        const _el$ = _tmpl$$6();
        web.insert(_el$, IconButtonStyle);
        return _el$;
      })(), (() => {
        const _el$2 = _tmpl$$6();
        web.insert(_el$2, MangaStyle);
        return _el$2;
      })()]);
    }
    setProps(typeof recipe === 'function' ? store$2.produce(recipe) : recipe);
    if (props.imgList.length && props.show) {
      dom.className = 'show';
      document.documentElement.style.overflow = 'hidden';
    } else {
      dom.className = '';
      document.documentElement.style.overflow = 'unset';
    }
  };

  /** 下载按钮 */
  const DownloadButton = () => {
    const [tip, setTip] = solidJs.createSignal('下载');
    const handleDownload = async () => {
      // eslint-disable-next-line solid/reactivity
      const {
        imgList
      } = props;
      const fileData = {};
      const imgIndexNum = \`\${imgList.length}\`.length;
      for (let i = 0; i < imgList.length; i += 1) {
        setTip(\`下载中 - \${i}/\${imgList.length}\`);
        const index = \`\${\`\${i}\`.padStart(imgIndexNum, '0')}\`;
        const fileExt = imgList[i].split('.').at(-1);
        const fileName = \`\${index}.\${fileExt}\`;
        try {
          // eslint-disable-next-line no-await-in-loop
          const res = await request(imgList[i], {
            responseType: 'arraybuffer'
          });
          fileData[fileName] = new Uint8Array(res.response);
        } catch (error) {
          toast.error(\`\${fileName} 下载失败\`);
          fileData[\`\${index} - 下载失败.\${fileExt}\`] = new Uint8Array();
        }
      }
      setTip('开始打包');
      const zipped = fflate.zipSync(fileData, {
        level: 0,
        comment: window.location.href
      });
      saveAs(new Blob([zipped]), \`\${document.title}.zip\`);
      setTip('下载完成');
      toast('下载完成');
    };
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
  setProps({
    onExit: () => set({
      show: false
    }),
    editButtonList: list => {
      // 在设置按钮上方放置下载按钮
      list.splice(-1, 0, DownloadButton);
      return [...list,
      // 再在最下面添加分隔栏和退出按钮
      buttonListDivider, () => web.createComponent(IconButton, {
        tip: "\\u9000\\u51FA",
        onClick: () => props.onExit?.(),
        get children() {
          return web.createComponent(MdClose, {});
        }
      })];
    }
  });
  return [set, props];
};

const _tmpl$$5 = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79zM21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98v9.47z"></path><path d="M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.7-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03z">\`);
const MdMenuBook = ((props = {}) => (() => {
  const _el$ = _tmpl$$5();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$4 = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M18 15v4c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h3.02c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1s-1 .45-1 1zm-2.5 3H6.52c-.42 0-.65-.48-.39-.81l1.74-2.23a.5.5 0 0 1 .78-.01l1.56 1.88 2.35-3.02c.2-.26.6-.26.79.01l2.55 3.39c.25.32.01.79-.4.79zm3.8-9.11c.48-.77.75-1.67.69-2.66-.13-2.15-1.84-3.97-3.97-4.2A4.5 4.5 0 0 0 11 6.5c0 2.49 2.01 4.5 4.49 4.5.88 0 1.7-.26 2.39-.7l2.41 2.41c.39.39 1.03.39 1.42 0 .39-.39.39-1.03 0-1.42l-2.41-2.4zM15.5 9a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z">\`);
const MdImageSearch = ((props = {}) => (() => {
  const _el$ = _tmpl$$4();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$3 = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79zM21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98v9.47z">\`);
const MdImportContacts = ((props = {}) => (() => {
  const _el$ = _tmpl$$3();
  web.spread(_el$, props, true, true);
  return _el$;
})());

const _tmpl$$2 = /*#__PURE__*/web.template(\`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z">\`);
const MdCloudDownload = ((props = {}) => (() => {
  const _el$ = _tmpl$$2();
  web.spread(_el$, props, true, true);
  return _el$;
})());

var css = ".index_module_fabRoot__57634bed{font-size:1.1em;transition:transform .2s}.index_module_fabRoot__57634bed[data-show=false]{transform:scale(0)}.index_module_fabRoot__57634bed[data-trans=true]{opacity:.8}.index_module_fabRoot__57634bed[data-trans=true]:focus,.index_module_fabRoot__57634bed[data-trans=true]:hover{opacity:1}.index_module_fab__57634bed{align-items:center;background-color:var(--fab,#607d8b);border:none;border-radius:100%;box-shadow:0 3px 5px -1px #0003,0 6px 10px 0 #00000024,0 1px 18px 0 #0000001f;color:#fff;cursor:pointer;display:flex;font-size:1em;height:3.6em;justify-content:center;width:3.6em}.index_module_fab__57634bed>svg{font-size:1.5em}.index_module_fab__57634bed:hover{background-color:var(--fab_hover,#78909c)}.index_module_progress__57634bed{color:#b0bec5;display:inline-block;height:100%;position:absolute;transform:rotate(-90deg);transition:transform .3s cubic-bezier(.4,0,.2,1) 0ms;width:100%}.index_module_progress__57634bed>svg{stroke:currentcolor;stroke-dasharray:290%;stroke-dashoffset:100%;stroke-linecap:round;transition:stroke-dashoffset .3s cubic-bezier(.4,0,.2,1) 0ms}.index_module_progress__57634bed:hover{color:#cfd8dc}.index_module_progress__57634bed[aria-valuenow=\\"1\\"]{opacity:0;transition:opacity .2s .15s}.index_module_popper__57634bed{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:none;font-size:.8em;padding:.4em .5em;position:absolute;right:calc(100% + 1.5em);top:50%;transform:translateY(-50%);white-space:nowrap}:is(.index_module_fab__57634bed:hover,.index_module_fabRoot__57634bed[data-focus=true]) .index_module_popper__57634bed{display:flex}.index_module_speedDial__57634bed{align-items:center;bottom:0;display:flex;flex-direction:column-reverse;font-size:1.1em;padding-bottom:120%;pointer-events:none;position:absolute;width:100%;z-index:-1}.index_module_speedDialItem__57634bed{margin:.1em 0;opacity:0;transform:scale(0);transition-delay:var(--hide-delay);transition-duration:.23s;transition-property:transform,opacity}.index_module_speedDial__57634bed:hover,:is(.index_module_fabRoot__57634bed:hover,.index_module_fabRoot__57634bed[data-focus=true])>.index_module_speedDial__57634bed{pointer-events:all}:is(.index_module_fabRoot__57634bed:hover,.index_module_fabRoot__57634bed[data-focus=true])>.index_module_speedDial__57634bed>.index_module_speedDialItem__57634bed{opacity:unset;transform:unset;transition-delay:var(--show-delay)}.index_module_backdrop__57634bed{background:#000;height:100vh;left:0;opacity:0;pointer-events:none;position:fixed;top:0;transition:opacity .5s;width:100vw}:is(.index_module_fabRoot__57634bed:hover,.index_module_fabRoot__57634bed[data-focus=true],.index_module_speedDial__57634bed:hover) .index_module_backdrop__57634bed{opacity:.4}.index_module_fabRoot__57634bed[data-focus=true] .index_module_backdrop__57634bed{pointer-events:unset}";
var modules_c21c94f2 = {"fabRoot":"index_module_fabRoot__57634bed","fab":"index_module_fab__57634bed","progress":"index_module_progress__57634bed","popper":"index_module_popper__57634bed","speedDial":"index_module_speedDial__57634bed","speedDialItem":"index_module_speedDialItem__57634bed","backdrop":"index_module_backdrop__57634bed"};
n(css,{});

const _tmpl$$1 = /*#__PURE__*/web.template(\`<div><button type="button"><span role="progressbar"><svg viewBox="22 22 44 44"><circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6">\`),
  _tmpl$2 = /*#__PURE__*/web.template(\`<div>\`),
  _tmpl$3 = /*#__PURE__*/web.template(\`<div><div>\`);
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
  let lastY = window.pageYOffset;
  const [show, setShow] = solidJs.createSignal(props.initialShow);

  // 绑定滚动事件
  const handleScroll = throttle(200, e => {
    // 跳过非用户操作的滚动
    if (e.isTrusted === false) return;
    if (window.pageYOffset === lastY) return;
    setShow(
    // 滚动到底部时显示
    window.pageYOffset + window.innerHeight >= document.body.scrollHeight ||
    // 向上滚动时显示，反之隐藏
    window.pageYOffset - lastY < 0);
    lastY = window.pageYOffset;
  });
  solidJs.onMount(() => window.addEventListener('scroll', handleScroll));
  solidJs.onCleanup(() => window.removeEventListener('scroll', handleScroll));

  // 将 forceShow 的变化同步到 show 上
  solidJs.createEffect(() => {
    if (props.show) setShow(props.show);
  });
  const handleClick = () => {
    props.onClick?.();
  };
  const handleBackdropClick = () => {
    props.onBackdropClick?.();
  };
  return (() => {
    const _el$ = _tmpl$$1(),
      _el$2 = _el$.firstChild,
      _el$3 = _el$2.firstChild,
      _el$4 = _el$3.firstChild;
    _el$2.$$click = handleClick;
    web.insert(_el$2, () => props.children ?? web.createComponent(MdMenuBook, {}), _el$3);
    web.insert(_el$2, (() => {
      const _c$ = web.memo(() => !!props.tip);
      return () => _c$() ? (() => {
        const _el$5 = _tmpl$2();
        web.insert(_el$5, () => props.tip);
        web.effect(() => web.className(_el$5, modules_c21c94f2.popper));
        return _el$5;
      })() : null;
    })(), null);
    web.insert(_el$, (() => {
      const _c$2 = web.memo(() => !!props.speedDial?.length);
      return () => _c$2() ? (() => {
        const _el$6 = _tmpl$3(),
          _el$7 = _el$6.firstChild;
        _el$7.$$click = handleBackdropClick;
        web.insert(_el$6, web.createComponent(solidJs.For, {
          get each() {
            return props.speedDial;
          },
          children: (SpeedDialItem, i) => (() => {
            const _el$8 = _tmpl$2();
            web.insert(_el$8, web.createComponent(SpeedDialItem, {}));
            web.effect(_p$ => {
              const _v$12 = modules_c21c94f2.speedDialItem,
                _v$13 = {
                  '--show-delay': \`\${i() * 30}ms\`,
                  '--hide-delay': \`\${(props.speedDial.length - 1 - i()) * 50}ms\`
                },
                _v$14 = i() * 30;
              _v$12 !== _p$._v$12 && web.className(_el$8, _p$._v$12 = _v$12);
              _p$._v$13 = web.style(_el$8, _v$13, _p$._v$13);
              _v$14 !== _p$._v$14 && web.setAttribute(_el$8, "data-i", _p$._v$14 = _v$14);
              return _p$;
            }, {
              _v$12: undefined,
              _v$13: undefined,
              _v$14: undefined
            });
            return _el$8;
          })()
        }), null);
        web.effect(_p$ => {
          const _v$10 = modules_c21c94f2.speedDial,
            _v$11 = modules_c21c94f2.backdrop;
          _v$10 !== _p$._v$10 && web.className(_el$6, _p$._v$10 = _v$10);
          _v$11 !== _p$._v$11 && web.className(_el$7, _p$._v$11 = _v$11);
          return _p$;
        }, {
          _v$10: undefined,
          _v$11: undefined
        });
        return _el$6;
      })() : null;
    })(), null);
    web.effect(_p$ => {
      const _v$ = modules_c21c94f2.fabRoot,
        _v$2 = props.style,
        _v$3 = props.show ?? show(),
        _v$4 = props.autoTrans,
        _v$5 = props.focus,
        _v$6 = modules_c21c94f2.fab,
        _v$7 = modules_c21c94f2.progress,
        _v$8 = props.progress,
        _v$9 = \`\${(1 - props.progress) * 290}%\`;
      _v$ !== _p$._v$ && web.className(_el$, _p$._v$ = _v$);
      _p$._v$2 = web.style(_el$, _v$2, _p$._v$2);
      _v$3 !== _p$._v$3 && web.setAttribute(_el$, "data-show", _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && web.setAttribute(_el$, "data-trans", _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && web.setAttribute(_el$, "data-focus", _p$._v$5 = _v$5);
      _v$6 !== _p$._v$6 && web.className(_el$2, _p$._v$6 = _v$6);
      _v$7 !== _p$._v$7 && web.className(_el$3, _p$._v$7 = _v$7);
      _v$8 !== _p$._v$8 && web.setAttribute(_el$3, "aria-valuenow", _p$._v$8 = _v$8);
      _v$9 !== _p$._v$9 && ((_p$._v$9 = _v$9) != null ? _el$4.style.setProperty("stroke-dashoffset", _v$9) : _el$4.style.removeProperty("stroke-dashoffset"));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined,
      _v$9: undefined
    });
    return _el$;
  })();
};
web.delegateEvents(["click"]);

const _tmpl$ = /*#__PURE__*/web.template(\`<style type="text/css">\`);
let mounted = false;
const useFab = async initProps => {
  await GM.addStyle(\`
    #fab {
      --text_bg: transparent;

      position: fixed;
      z-index: 99999999;
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
  const set = recipe => {
    if (!mounted) {
      mountComponents('fab', () => [web.createComponent(Fab, web.mergeProps(props, {
        get children() {
          return props.children ?? web.createComponent(web.Dynamic, {
            get component() {
              return FabIcon();
            }
          });
        }
      })), (() => {
        const _el$ = _tmpl$();
        web.insert(_el$, IconButtonStyle);
        return _el$;
      })(), (() => {
        const _el$2 = _tmpl$();
        web.insert(_el$2, FabStyle);
        return _el$2;
      })()]);
      mounted = true;
    }
    if (recipe) setProps(typeof recipe === 'function' ? store$2.produce(recipe) : recipe);
  };
  return set;
};

/**
 * 对修改站点配置的相关方法的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useSiteOptions = async (name, defaultOptions = {}) => {
  const rawValue = await GM.getValue(name);
  const options = Object.assign({
    option: undefined,
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions
  }, rawValue);
  const changeCallbackList = [];
  return {
    options,
    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,
    /**
     * 设置新 Option
     * @param newValue newValue
     * @param trigger 是否触发变更事件
     */
    setOptions: async (newValue, trigger = true) => {
      Object.assign(options, newValue);
      await GM.setValue(name, options);
      if (trigger) await Promise.all(changeCallbackList.map(callback => callback(options)));
    },
    /**
     * 监听配置变更事件
     */
    onOptionChange: callback => {
      changeCallbackList.push(callback);
    }
  };
};

/**
 * 对所有支持站点页面的初始化操作的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useInit = async (name, defaultOptions = {}) => {
  const {
    options,
    setOptions,
    onOptionChange
  } = await useSiteOptions(name, defaultOptions);
  const setFab = await useFab({
    tip: '阅读模式',
    speedDial: useSpeedDial(options, setOptions)
  });
  const [setManga, mangaProps] = await useManga({
    imgList: [],
    option: options.option,
    onOptionChange: option => setOptions({
      ...options,
      option
    })
  });

  // 检查脚本的版本变化，提示用户
  const version = await GM.getValue('Version');
  if (version && version !== GM.info.script.version) {
    // FIXME: 实现通过 jsdelivr 获取指定版本的更新内容
    //     const changelog = \`
    // ## 新增

    // - 通过 M 键切换页面填充

    // ## 修复

    // - 增加拷贝漫画的支持域名
    // - 修复漫画柜失效问题
    // \`;
    (async () => {
      // const res = await request(
      //   \`https://cdn.jsdelivr.net/gh/hymbz/ComicReadScriptTest@\${GM.info.script.version}/file\`,
      //   { errorText: '' },
      // );
      // toast(() => (
      //   <div>
      //     <h2>ComicReadScrip 已更新到 {GM.info.script.version}</h2>
      //     <div className="md">
      //       {res.responseText.match(/##.+?\\n|(-.+?\\n)+/g)!.map((mdText) => {
      //         if (mdText[0] === '#') return <h2>{mdText.split('##')}</h2>;
      //         if (mdText[0] === '-')
      //           return (
      //             <ul>
      //               {mdText.match(/(?<=- ).+/g)!.map((item) => (
      //                 <li>{item}</li>
      //               ))}
      //             </ul>
      //           );
      //         return null;
      //       })}
      //     </div>
      //   </div>
      // ));
      // GM_setValue('Version', GM.info.script.version);
    })();
  }
  let menuId;
  /** 更新显示/隐藏阅读模式按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(\`\${options.hiddenFAB ? '显示' : '隐藏'}阅读模式按钮\`, async () => {
      await setOptions({
        ...options,
        hiddenFAB: !options.hiddenFAB
      });
      setFab(state => {
        state.show = !options.hiddenFAB && undefined;
      });
      await updateHideFabMenu();
    });
  };
  return {
    options,
    setOptions,
    onOptionChange,
    setFab,
    setManga,
    /**
     * 完成所有支持站点的初始化
     * @param getImgList 返回图片列表的函数
     * @param onLoading 图片加载状态发生变化时触发的回调
     * @returns 自动加载图片并进入阅读模式的函数
     */
    init: (getImgList, onLoading = () => {}) => {
      /** 是否正在加载图片中 */
      let loading = false;

      /** 进入阅读模式 */
      const showComic = async (show = options.autoShow) => {
        if (loading) {
          toast.warn('加载图片中，请稍候', {
            unmountDelay: 1500,
            id: '加载图片中，请稍候'
          });
          return;
        }
        const {
          imgList
        } = mangaProps;
        if (!imgList.length) {
          loading = true;
          try {
            setFab({
              progress: 0,
              show: true
            });
            const initImgList = await getImgList();
            if (initImgList.length === 0) throw new Error('获取漫画图片失败');
            setFab({
              progress: 1,
              tip: '阅读模式',
              show: !options.hiddenFAB && undefined
            });
            setManga(state => {
              state.imgList = initImgList;
              state.show = show;

              // 监听图片加载状态，将进度显示到 Fab 上
              state.onLoading = (img, list) => {
                const loadNum = list.filter(image => image.loadType === 'loaded').length;
                onLoading(loadNum, list.length, img);

                /** 图片加载进度 */
                const progress = 1 + loadNum / list.length;
                if (progress !== 2) {
                  setFab({
                    progress,
                    tip: \`图片加载中 - \${loadNum}/\${list.length}\`
                  });
                } else {
                  // 图片全部加载完成后恢复 Fab 状态
                  setFab({
                    progress,
                    tip: '阅读模式',
                    show: undefined
                  });
                }
              };
              return state;
            });
          } catch (e) {
            console.error(e);
            toast.error(e.message);
            setFab({
              progress: undefined
            });
          } finally {
            loading = false;
          }
        } else {
          setManga({
            show: true
          });
        }
      };
      setFab({
        onClick: () => showComic(true)
      });
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (options.autoShow) showComic();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      GM.registerMenuCommand('进入漫画阅读模式', () => showComic(true));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      updateHideFabMenu();
      return () => showComic(true);
    }
  };
};

/** 将除各个站点的逻辑代码外的其余代码打包在一起 */

exports.dataToParams = dataToParams;
exports.insertNode = insertNode;
exports.isEqualArray = isEqualArray;
exports.linstenKeyup = linstenKeyup;
exports.mountComponents = mountComponents;
exports.needDarkMode = needDarkMode;
exports.plimit = plimit;
exports.promisifyRequest = promisifyRequest;
exports.querySelector = querySelector;
exports.querySelectorAll = querySelectorAll;
exports.querySelectorClick = querySelectorClick;
exports.request = request;
exports.saveAs = saveAs;
exports.scrollIntoView = scrollIntoView;
exports.sleep = sleep;
exports.toast = toast;
exports.useCache = useCache;
exports.useFab = useFab;
exports.useInit = useInit;
exports.useManga = useManga;
exports.useSiteOptions = useSiteOptions;
exports.useSpeedDial = useSpeedDial;
exports.wait = wait;
` : GM_getResourceText(name);
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);

  // 通过提供 cjs 环境的变量来兼容 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  return GM_addElement('script', {
    textContent: `
      window.crsLib['${name}'] = {};
      ${false ? `console.time('导入 ${name}');` : ''}
      (function (process, require, exports, module, GM, GM_xmlhttpRequest) {
        ${code}
      })(
        window.crsLib.process,
        window.crsLib.require,
        window.crsLib['${name}'],
        {
          set exports(value) {
            window.crsLib['${name}'] = value;
          },
          get exports() {
            return window.crsLib['${name}'];
          },
        },
        window.crsLib.GM,
        window.crsLib.GM_xmlhttpRequest,
      );
      ${false ? `console.timeEnd('导入 ${name}');` : ''}
    `
  });
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
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc = typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args);
    },
    construct(_, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc = typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args);
    }
  });
  return selfDefault;
};
unsafeWindow.crsLib.require = require;


// 匹配站点
switch (window.location.hostname) {
  case 'bbs.yamibo.com':
    {
const web = require('solid-js/web');
const main = require('../main');

const _tmpl$ = /*#__PURE__*/web.template(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="currentColor" stroke-width="0"><path d="M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z">`);
const MdSettings = ((props = {}) => (() => {
  const _el$ = _tmpl$();
  web.spread(_el$, props, true, true);
  return _el$;
})());

(async () => {
  const {
    options,
    setFab,
    setManga,
    init
  } = await main.useInit('yamibo', {
    记录阅读进度: true,
    关闭快捷导航按钮的跳转: true,
    修正点击页数时的跳转判定: true,
    固定导航条: true,
    自动签到: true
  });
  await GM.addStyle(`#fab { --fab: #6E2B19; --fab_hover: #A15640; };

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
      if (!/签到成功|打过卡/.test(body)) throw new Error('自动签到失败');
      main.toast.success('自动签到成功');
      localStorage.setItem('signDate', todayString);
    } catch (e) {
      console.error(e);
      main.toast.error('自动签到失败');
    }
  })();
  if (options.关闭快捷导航按钮的跳转)
    // eslint-disable-next-line no-script-url
    main.querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');

  // 增加菜单项，以便在其他板块用于调整其他功能的开关
  await GM.registerMenuCommand('显示设置菜单', () => setFab({
    show: true,
    focus: true,
    tip: '设置',
    children: web.createComponent(MdSettings, {}),
    onBackdropClick: () => setFab({
      show: false,
      focus: false
    })
  }));

  // 判断当前页是帖子
  if (/thread(-\d+){3}|mod=viewthread/.test(document.URL)) {
    // 修复微博图床的链接
    main.querySelectorAll('img[file*="sinaimg.cn"]').forEach(e => {
      e.setAttribute('referrerpolicy', 'no-referrer');
    });
    if (
    // 限定板块启用
    (unsafeWindow.fid === 30 || unsafeWindow.fid === 37) &&
    // 只在第一页生效
    !main.querySelector('.pg > .prev')) {
      let imgList = main.querySelectorAll('.t_fsz img');
      const updateImgList = () => {
        let i = imgList.length;
        while (i--) {
          const img = imgList[i];
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
      setManga({
        // 在图片加载完成后再检查一遍有没有小图，有就删掉
        onLoading: img => {
          // 跳过符合标准的
          if (img.height && img.width && img.height > 500 && img.width > 500) return;
          const delImgIndex = imgList.findIndex(image => image.src === img.src);
          if (delImgIndex !== -1) imgList.splice(delImgIndex, 1);
          setManga({
            imgList: imgList.map(image => image.src)
          });
        },
        onExit: isEnd => {
          if (isEnd) main.scrollIntoView('.psth, .rate, #postlist > div:nth-of-type(2)');
          setManga({
            show: false
          });
        }
      });
      updateImgList();
      const showComic = init(() => imgList.map(img => img.src));
      setFab({
        progress: 1,
        tip: '阅读模式'
      });

      // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
      main.insertNode(main.querySelector('div.pti > div.authi'), '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>');
      document.getElementById('comicReadMode')?.addEventListener('click', showComic);

      // 如果帖子内有设置目录
      if (main.querySelector('#threadindex')) {
        main.querySelectorAll('#threadindex li').forEach(dom => {
          dom.addEventListener('click', () => {
            setTimeout(() => {
              imgList = main.querySelectorAll('.t_fsz img');
              setManga({
                imgList: updateImgList(),
                show: options.autoShow ?? undefined
              });
            }, 1000);
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
      const {
        tid
      } = unsafeWindow;
      const res = await main.request(`https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`, {
        errorText: '获取帖子回复数时出错'
      });
      /** 回复数 */
      const allReplies = parseInt(JSON.parse(res.responseText)?.Variables?.thread?.allreplies, 10);
      if (!allReplies) return;

      /** 当前所在页数 */
      const currentPageNum = parseInt(document.querySelector('#pgt strong')?.innerHTML ?? '1', 10);
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
      const watchFloorList = main.querySelectorAll(data?.lastAnchor && currentPageNum === data.lastPageNum ? `#${data.lastAnchor} ~ div` : '#postlist > div');
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
        threshold: 1.0
      });
      watchFloorList.forEach(e => observer.observe(e));
    }
    return;
  }

  // 判断当前页是板块
  if (/forum(-\d+){2}|mod=forumdisplay/.test(document.URL)) {
    if (options.修正点击页数时的跳转判定) {
      const List = document.querySelectorAll('.tps>a');
      let i = List.length;
      while (i--) List[i].setAttribute('onclick', 'atarget(this)');
    }
    if (options.记录阅读进度) {
      const cache = main.useCache(db => {
        db.createObjectStore('history', {
          keyPath: 'tid'
        });
      });

      // 更新页面上的阅读进度提示
      const updateHistoryTag = () => {
        // 先删除所有进度提示
        main.querySelectorAll('.historyTag').forEach(e => e.remove());

        // 再添加上进度提示
        return Promise.all(main.querySelectorAll('tbody[id^=normalthread]').map(async e => {
          const tid = e.id.split('_')[1];
          const data = await cache.get('history', tid);
          if (!data) return;
          const lastReplies = +e.querySelector('.num a').innerHTML - data.lastReplies;
          main.insertNode(e.getElementsByTagName('th')[0], `
                <a
                  class="historyTag"
                  onclick="atarget(this)"
                  href="thread-${tid}-${data.lastPageNum}-1.html#${data.lastAnchor}"
                >
                  回第${data.lastPageNum}页
                </a>
                ${lastReplies > 0 ? `<div class="historyTag">+${lastReplies}</div>` : ''}
              `);
        }));
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      updateHistoryTag();

      // 切换回当前页时更新提示
      document.addEventListener('visibilitychange', updateHistoryTag);
      // 点击下一页后更新提示
      main.querySelector('#autopbn').addEventListener('click', updateHistoryTag);
    }
  }
})();

      break;
    }
  case 'www.yamibo.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!document.URL.includes('view-chapter')) return;
  const {
    setFab,
    setManga,
    init
  } = await main.useInit('newYamibo');
  setManga({
    onNext: main.querySelectorClick('#btnNext'),
    onPrev: main.querySelectorClick('#btnPrev'),
    onExit: isEnd => {
      if (isEnd) main.scrollIntoView('#w1');
      setManga({
        show: false
      });
    }
  });
  const id = new URLSearchParams(window.location.search).get('id');
  /** 总页数 */
  const totalNum = +main.querySelector('section div:first-of-type div:last-of-type').innerHTML.split('：')[1];
  const getImgList = async (i = 1, imgList = []) => {
    const res = await main.request(`https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`);
    imgList.push(/<img id="imgPic".+="(.+?)".+>/.exec(res.responseText)[1].replaceAll('&amp;', '&'));
    if (imgList.length === totalNum) {
      setFab({
        progress: 1,
        tip: '阅读模式'
      });
      return imgList;
    }
    setFab({
      progress: imgList.length / totalNum,
      tip: `加载图片中 - ${imgList.length}/${totalNum}`
    });
    return getImgList(i + 1, imgList);
  };
  init(getImgList);
})();

      break;
    }
  case 'manhua.idmzj.com':
  case 'manhua.dmzj.com':
    {
const main = require('../main');
const web = require('solid-js/web');

const sleep = ms => new Promise(resolve => {
  window.setTimeout(resolve, ms);
});

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

/** 挂载 solid-js 组件 */
const mountComponents = (id, fc) => {
  const dom = document.createElement('div');
  dom.id = id;
  document.body.appendChild(dom);
  const shadowDom = dom.attachShadow({
    mode: 'open'
  });
  web.render(fc, shadowDom);
  return dom;
};

/** 返回 Dom 的点击函数 */
const querySelectorClick = selector => {
  const dom = querySelector(selector);
  if (!dom) return undefined;
  return () => dom.click();
};

/** 判断两个列表中包含的值是否相同 */
const isEqualArray = (a, b) => a.length === b.length && !!a.filter(t => !b.includes(t));

/** 将对象转为 URLParams 类型的字符串 */
const dataToParams = data => Object.entries(data).map(([key, val]) => `${key}=${val}`).join('&');

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
const scrollIntoView = selector => querySelector(selector)?.scrollIntoView();

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
        callBack?.(doneNum, totalNum, resList);
      })();
      execPool.add(p);
    };
  });
  while (doneNum !== totalNum) {
    while (taskList.length && execPool.size < limit) {
      taskList.shift()();
    }
    // eslint-disable-next-line no-await-in-loop
    await Promise.race(execPool);
  }
  return resList;
};

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
const request = async (url, details, errorNum = 0) => {
  const errorText = details?.errorText ?? '漫画加载出错';
  try {
    const res = await xmlHttpRequest({
      method: 'GET',
      url,
      headers: {
        Referer: window.location.href
      },
      ...details
    });
    if (res.status !== 200) throw new Error(errorText);
    return res;
  } catch (error) {
    if (errorNum > 3) {
      if (errorText) {
        const {
          useToast
        } = require('../main');
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
const needDarkMode = hexColor => {
  // by: https://24ways.org/2010/calculating-color-contrast
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq < 128;
};

/** 轮询等到指定的 dom 出现后调用指定函数 */
const wait = (selector, handle) => {
  const id = window.setInterval(() => {
    const dom = querySelector(selector);
    if (!dom) return;
    handle(dom);
    window.clearInterval(id);
  }, 100);
};

// 解除吐槽的字数限制 功能部分引用的原代码使用到的变量

(async () => {
  // 某些隐藏漫画虽然被删掉了 PC 端页面，但其实手机版的网页依然还在
  // 所以当跳转至某部漫画的 PC 端页面被提示「页面找不到」时，就先跳转至手机版的页面去
  if (document.title === '页面找不到') {
    // 测试例子：https://manhua.dmzj.com/yanquan/48713.shtml
    const [, comicName, _chapter_id] = window.location.pathname.split(/[./]/);
    const res = await request(`https://manhua.dmzj.com/${comicName}`);
    const _comic_id = /g_comic_id = "(\d+)/.exec(res.responseText)?.[1];
    if (!_comic_id) {
      console.error('无法跳转至手机版页面', res);
      // eslint-disable-next-line no-alert
      alert('无法跳转至手机版页面');
      return;
    }
    window.location.href = `https://m.dmzj.com/view/${_comic_id}/${_chapter_id}.html`;
    return;
  }

  // 通过 rss 链接，在作者作品页里添加上隐藏漫画的链接
  if (window.location.pathname.includes('/tags/')) {
    const res = await request(querySelector('a.rss').href, {
      errorText: '获取作者作品失败'
    });

    // 页面上原有的漫画标题
    const titleList = querySelectorAll('#hothit p.t').map(e => e.innerText.replace('[完]', ''));
    insertNode(document.getElementById('hothit'), res.responseText.split('item').filter((_, i) => i % 2).map(item => {
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

  // 跳过漫画目录、漫画页外的其他页面
  if (!Reflect.has(unsafeWindow, 'g_comic_name')) return;
  if (!Reflect.has(unsafeWindow, 'g_chapter_name')) {
    // 判断当前页是漫画详情页

    // 判断漫画被禁
    // 测试例子：https://manhua.dmzj.com/yanquan/
    if (querySelector('.cartoon_online_border > img')) {
      document.querySelector('.cartoon_online_border').innerHTML = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';

      // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
      const res = await request(`https://api.dmzj.com/dynamic/comicinfo/${g_comic_id}.json`, {
        errorText: '漫画加载出错'
      });

      // 删掉原有的章节 dom
      querySelectorAll('.odd_anim_title ~ div').forEach(e => e.parentNode?.removeChild(e));
      const {
        info: {
          last_updatetime,
          title
        },
        list: chaptersList
      } = JSON.parse(res.responseText).data;

      // 手动构建添加章节 dom
      let temp = `<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
      let i = chaptersList.length;
      while (i--) {
        temp += `<li><a target="_blank" title="${chaptersList[i].chapter_name}" href="https://manhua.dmzj.com/${g_comic_url}${chaptersList[i].id}.shtml" ${chaptersList[i].updatetime === last_updatetime ? 'class="color_red"' : ''}>${chaptersList[i].chapter_name}</a></li>`;
      }
      insertNode(querySelector('.middleright_mr'), `${temp}</ul><div class="clearfix"></div></div>`);
    }
    return;
  }

  // 处理当前页是漫画页的情况
  const {
    options,
    setManga,
    init,
    onOptionChange
  } = await main.useInit('dmzj', {
    解除吐槽的字数限制: true
  });

  // 切换至上下翻页阅读
  if ($.cookie('display_mode') === '0') unsafeWindow.qiehuan();

  // 根据漫画模式下的夜间模式切换样式
  if (options.option?.darkMode === false) {
    document.body.classList.add('day');
  }
  onOptionChange(option => {
    // 监听漫画模式下的夜间模式切换，进行实时切换
    if (option.option?.darkMode) document.body.classList.remove('day');else document.body.classList.add('day');
  });

  // 添加自定义样式修改
  await GM.addStyle(`
    ${JSON.parse(await GM.getResourceText('dmzj_style')).sections[0].code}

    /* 修复和 dmzj_style 的冲突 */
    .mainNav {
      display: none !important
    }

    /* 增加日间模式的样式 */
    body.day {
      background-color: white !important
    }
    body.day .header-box {
      background-color: #DDD !important;
      box-shadow: 0 1px 2px white
    }
    body.day .comic_gd_fb .gd_input {
      color: #666;
      background: white
    }
  `);
  setManga({
    onNext: main.querySelectorClick('#next_chapter'),
    onPrev: main.querySelectorClick('#prev_chapter'),
    onExit: isEnd => {
      if (isEnd) {
        unsafeWindow.huPoint();
        main.scrollIntoView('#hd');
      }
      setManga({
        show: false
      });
    }
  });
  init(() => querySelectorAll('.inner_img img').map(e => e.getAttribute('data-original')).filter(src => src));

  // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
  if (options.解除吐槽的字数限制) {
    const intervalID = setInterval(() => {
      if (!unsafeWindow.addpoint) return;
      clearInterval(intervalID);
      // eslint-disable-next-line
      unsafeWindow.addpoint = function () {
        const e = $('#gdInput').val();
        const c = $('input[name=length]').val();
        if (e == '') {
          alert('沉默是你的个性，但还是吐个槽吧！');
          return false;
        } else {
          if ($.trim(e) == '') {
            alert('空寂是你的个性，但还是吐个槽吧！');
            return false;
          }
        }
        const d = $('#suBtn');
        const b = d.attr('onclick');
        const a = d.html();
        d.attr('onclick', '').html('发表中..').css({
          'background': '#eee',
          'color': '#999',
          'cursor': 'not-allowed'
        });
        if (is_login) {
          $.ajax({
            type: 'get',
            url: `${comicUrl}/api/viewpoint/add`,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'success_jsonpCallback_201508281119',
            data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(e)}`,
            success: function (f) {
              if (f.result == 1000) {
                $('#gdInput').val('');
                if ($('#moreLi').length > 0) {
                  $('#moreLi').before(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`);
                } else {
                  $('#tc').hide();
                  if (c == undefined) {
                    $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`);
                  } else {
                    if (c > 9) {
                      $('.comic_gd_li').append(`<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`);
                    } else {
                      $('.comic_gd_li').append(`<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`);
                    }
                  }
                }
                alert('吐槽成功');
              } else {
                if (f.result == 2001) {
                  $('body').append(zcHtml);
                  zcClick();
                } else {
                  alert(f.msg);
                }
              }
              d.attr({
                'onclick': b,
                'style': ''
              }).html(a);
            }
          });
        }
      };
    }, 2000);
  }
})();

      break;
    }
  case 'm.idmzj.com':
  case 'm.dmzj.com':
    {
const main = require('../main');

// 接口参考
// https://github.com/xiaoyaocz/flutter_dmzj/blob/ecbe73eb435624022ae5a77156c5d3e0c06809cc/lib/requests/api.dart
// https://github.com/erinacio/tachiyomi-extensions/blob/548be91cccb8f248342e2e7762c2c3d4b2d02036/src/zh/dmzj/src/eu/kanade/tachiyomi/extension/zh/dmzj/Dmzj.kt

(async () => {
  const {
    setManga,
    init
  } = await main.useInit('dmzj', {
    解除吐槽的字数限制: true
  });

  // 分别处理目录页和漫画页
  switch (window.location.pathname.split('/')[1]) {
    case 'info':
      {
        // 跳过正常漫画
        if (Reflect.has(unsafeWindow, 'obj_id')) return;
        const comicId = parseInt(window.location.pathname.split('/')[2], 10);
        if (Number.isNaN(comicId)) {
          document.body.removeChild(document.body.childNodes[0]);
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

        // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
        const res = await main.request(`http://api.dmzj.com/dynamic/comicinfo/${comicId}.json`, {
          errorText: '获取漫画数据失败'
        });
        const {
          info: {
            last_updatetime,
            title
          },
          list: chaptersList
        } = JSON.parse(res.responseText).data;
        document.title = title;
        let temp = `<h1 style="text-align:center">${title}</h1>`;
        let i = chaptersList.length;
        while (i--) temp += `<a target="_blank" title="${chaptersList[i].chapter_name}" href="https://m.dmzj.com/view/${comicId}/${chaptersList[i].id}.html" ${chaptersList[i].updatetime === last_updatetime ? 'style="color:red"' : ''}>${chaptersList[i].chapter_name}</a>`;
        main.insertNode(document.body, temp);
        document.body.removeChild(document.body.childNodes[0]);
        await GM.addStyle('body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}');
        break;
      }
    case 'view':
      {
        // 如果不是隐藏漫画，直接进入阅读模式
        if (unsafeWindow.comic_id) {
          await GM.addStyle('.subHeader{display:none !important}');
          setManga({
            onNext: main.querySelectorClick('#loadNextChapter'),
            onPrev: main.querySelectorClick('#loadPrevChapter')
          });
          const showComic = init(() => main.querySelectorAll('#commicBox img').map(e => e.getAttribute('data-original')).filter(src => src));
          await showComic();
          return;
        }
        document.body.removeChild(document.body.childNodes[0]);
        const tipDom = document.createElement('p');
        tipDom.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
        document.body.appendChild(tipDom);
        let res;
        try {
          res = await main.request(`https://m.dmzj.com/chapinfo/${/\d+\/\d+/.exec(document.URL)[0]}.html`, {
            errorText: '获取漫画数据失败'
          });
        } catch (error) {
          tipDom.innerText = error.message;
          throw error;
        }
        tipDom.innerText = `加载完成，即将进入阅读模式`;
        const {
          folder,
          page_url
        } = JSON.parse(res.responseText);
        document.title = folder.split('/').at(-2) ?? folder;

        // 进入阅读模式后禁止退出，防止返回空白页面
        setManga({
          onExit: () => {},
          editButtonList: list => list
        });
        const showComic = init(() => {
          if (page_url.length) return page_url;
          tipDom.innerHTML = `无法获得漫画数据，请通过 <a href="https://github.com/hymbz/ComicReadScript/issues">Github</a> 或 <a href="https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback#post-discussion">Greasy Fork</a> 进行反馈`;
          return [];
        });
        await showComic();
        break;
      }
  }
})();

      break;
    }
  case 'www.idmzj.com':
  case 'www.dmzj.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'g_comic_id')) return;
  const {
    setManga,
    init
  } = await main.useInit('dmzj');
  setManga({
    onNext: main.querySelectorClick('.next > a'),
    onPrev: main.querySelectorClick('.pre > a')
  });
  init(() => picArry.map(url => `${img_prefix}${url}`));
})();

      break;
    }
  // 懒得整理导入导出的代码了，应该也没人用了吧，等有人需要的时候再说
  // case 'i.dmzj.com': {
  //   // dmzj_user_info
  //   break;
  // }

  case 'exhentai.org':
  case 'e-hentai.org':
    {
const main = require('../main');

(async () => {
  const {
    options,
    setFab,
    setManga,
    init
  } = await main.useInit('ehentai', {
    匹配nhentai: true,
    快捷键翻页: true
  });

  // 不是漫画页的话
  if (!Reflect.has(unsafeWindow, 'gid')) {
    if (options.快捷键翻页) {
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
  setManga({
    onExit: isEnd => {
      if (isEnd) main.scrollIntoView('#cdiv');
      setManga({
        show: false
      });
    }
  });

  // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
  main.insertNode(document.getElementById('gd5'), '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>');
  const comicReadModeDom = document.getElementById('comicReadMode');

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async url => {
    const res = await main.request(url, {
      errorText: '从图片页获取图片地址失败'
    });
    return res.responseText.split('id="img" src="')[1].split('"')[0];
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe = /(?<=<a href=").{20,50}(?="><img alt="\d+")/gm;

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (pageNum = 0) => {
    const res = await main.request(`${window.location.origin}${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`, {
      errorText: '从详情页获取图片页地址失败'
    });

    // 从详情页获取图片页的地址
    const imgPageList = res.responseText.match(getImgFromDetailsPageRe);
    if (imgPageList === null) throw new Error('从详情页获取图片页的地址时出错');
    return imgPageList;
  };
  const showComic = init(async () => {
    const totalPageNum = +main.querySelector('.ptt td:nth-last-child(2)').innerText;
    comicReadModeDom.innerHTML = ` loading`;

    // 从详情页获取所有图片页的 url
    const imgPageUrlList = await main.plimit([...Array(totalPageNum).keys()].map(pageNum => () => getImgFromDetailsPage(pageNum)), (doneNum, totalNum) => {
      setFab({
        tip: `获取图片页中 - ${doneNum}/${totalNum}`
      });
    });
    return main.plimit(imgPageUrlList.flat().map(imgPageUrl => () => getImgFromImgPage(imgPageUrl)), (doneNum, totalNum) => {
      setFab({
        progress: doneNum / totalNum,
        tip: `加载图片中 - ${doneNum}/${totalNum}`
      });
      comicReadModeDom.innerHTML = ` loading - ${doneNum}/${totalNum}`;
    });
  });
  setFab({
    initialShow: options.autoShow
  });
  comicReadModeDom.addEventListener('click', showComic);
  if (options.快捷键翻页) {
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
  if (options.匹配nhentai) {
    const titleDom = document.getElementById('gn');
    const taglistDom = main.querySelector('#taglist tbody');
    if (!titleDom || !taglistDom) {
      main.toast.error('页面结构发生改变，匹配 nhentai 漫画功能无法正常生效');
      return;
    }
    const newTagLine = document.createElement('tr');
    let res;
    try {
      res = await main.request(`https://nhentai.net/api/galleries/search?query=${encodeURI(titleDom.innerText)}`, {
        errorText: ''
      });
    } catch (_) {
      newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        匹配失败，请确认 nhentai 登录状态
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
        temp += `<div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${tempComicInfo.title.japanese ? tempComicInfo.title.japanese : tempComicInfo.title.english}"><a href="https://nhentai.net/g/${tempComicInfo.id}/" index=${i} onclick="return toggle_tagmenu('nhentai:${tempComicInfo.id}',this)">${tempComicInfo.id}</a></a></div>`;
      }
      newTagLine.innerHTML = `${temp}</td>`;
    } else newTagLine.innerHTML = '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';
    taglistDom.appendChild(newTagLine);

    // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
    const nhentaiImgList = {};
    unsafeWindow._refresh_tagmenu_act = function _refresh_tagmenu_act(a, b) {
      const tagmenu_act_dom = document.getElementById('tagmenu_act');
      if (a.includes('nhentai:')) {
        tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;
        tagmenu_act_dom.innerHTML += `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> ${nhentaiImgList[selected_tag] ? 'Read' : 'Load comic'}</a>`;
        const nhentaiComicReadModeDom = tagmenu_act_dom.querySelector('a[href="#"]');

        // 加载 nhentai 漫画
        nhentaiComicReadModeDom.addEventListener('click', async e => {
          e.preventDefault();
          const comicInfo = nHentaiComicInfo.result[+selected_link.getAttribute('index')];
          let loadNum = 0;
          if (!nhentaiImgList[selected_tag]) {
            nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
            // 用于转换获得图片文件扩展名的 dict
            const fileType = {
              j: 'jpg',
              p: 'png',
              g: 'gif'
            };
            nhentaiImgList[selected_tag] = await Promise.all(comicInfo.images.pages.map(async ({
              t
            }, i) => {
              const imgRes = await main.request(`https://i.nhentai.net/galleries/${comicInfo.media_id}/${i + 1}.${fileType[t]}`, {
                headers: {
                  Referer: `https://nhentai.net/g/${comicInfo.media_id}`
                },
                responseType: 'blob'
              });
              const blobUrl = URL.createObjectURL(imgRes.response);
              loadNum += 1;
              nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
              return blobUrl;
            }));
            nhentaiComicReadModeDom.innerHTML = ' Read';
          }
          setManga({
            imgList: nhentaiImgList[selected_tag],
            show: true
          });
        });
      } else {
        const mr = '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" />';
        let temp = '';
        if (b.className !== 'tup') temp += ` ${mr} <a href="#" onclick="tag_vote_up(); return false">${b.className === '' ? 'Vote Up' : 'Withdraw Vote'}</a>`;
        if (b.className !== 'tdn') temp += ` ${mr} <a href="#" onclick="tag_vote_down(); return false">${b.className === '' ? 'Vote Down' : 'Withdraw Vote'}</a>`;
        // 删掉原有的 Show Tagged Galleries 按钮空出位置
        temp += `${mr} <a href="#" onclick="tag_define(); return false">Show Tag Definition</a>${mr} <a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a> ${mr} `;
        const tag = selected_link.id.slice(3).split(':');
        if (tag.length === 1) {
          temp += `<a href="https://nhentai.net/tag/${tag[0].replace(/_/g, '-')}" target="_blank">Jump to nhentai</a>`;
        } else {
          temp += `<a href="https://nhentai.net/${tag[0] === 'female' ? 'tag' : tag[0]}/${tag[1].replace(/_/g, '-')}" target="_blank">Jump to nhentai</a>`;
        }
        tagmenu_act_dom.innerHTML = temp;
      }
    };
  }
})();

      break;
    }
  case 'nhentai.net':
    {
const main = require('../main');

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
    自动翻页: true,
    彻底屏蔽漫画: true,
    在新页面中打开链接: true
  });

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit: isEnd => {
        if (isEnd) main.scrollIntoView('#comment-container');
        setManga({
          show: false
        });
      }
    });

    // 虽然有 Fab 了不需要这个按钮，但我自己都点习惯了没有还挺别扭的（
    main.insertNode(document.getElementById('download').parentNode, '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Load comic</a>');
    const comicReadModeDom = document.getElementById('comicReadMode');
    const showComic = init(() => gallery.images.pages.map(({
      number,
      extension
    }) => `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`), (loadNum, totalNum) => {
      comicReadModeDom.innerHTML = loadNum !== totalNum ? `<i class="fa fa-spinner"></i> loading —— ${loadNum}/${totalNum}` : '<i class="fa fa-book"></i> Read';
    });
    setFab({
      initialShow: options.autoShow
    });
    comicReadModeDom.addEventListener('click', showComic);
    return;
  }

  // 在漫画浏览页
  if (document.getElementsByClassName('gallery').length) {
    if (options.在新页面中打开链接) main.querySelectorAll('a:not([href^="javascript:"])').forEach(e => e.setAttribute('target', '_blank'));
    const blacklist = (unsafeWindow?._n_app ?? unsafeWindow?.n)?.options?.blacklisted_tags;
    if (blacklist === undefined) main.toast.error('标签黑名单获取失败');
    // blacklist === null 时是未登录

    if (options.彻底屏蔽漫画 && blacklist?.length) await GM.addStyle('.blacklisted.gallery { display: none; }');
    if (options.自动翻页) {
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
          errorText: '下一页漫画信息加载出错'
        });
        const {
          result,
          num_pages
        } = JSON.parse(res.responseText);
        let comicDomHtml = '';

        // 在 用户已登录 且 有设置标签黑名单 且 开启了彻底屏蔽功能时，才对结果进行筛选
        (options.彻底屏蔽漫画 && blacklist?.length ? result.filter(({
          tags
        }) => tags.every(tag => !blacklist.includes(tag.id))) : result).forEach(comic => {
          comicDomHtml += `<div class="gallery" data-tags="${comic.tags.map(e => e.id).join(' ')}"><a ${options.在新页面中打开链接 ? 'target="_blank"' : ''} href="/g/${comic.id}/" class="cover" style="padding:0 0 ${comic.images.thumbnail.h / comic.images.thumbnail.w * 100}% 0"><img is="lazyload-image" class="" width="${comic.images.thumbnail.w}" height="${comic.images.thumbnail.h}" src="https://t.nhentai.net/galleries/${comic.media_id}/thumb.${fileType[comic.images.thumbnail.t]}"><div class="caption">${comic.title.english}</div></a></div>`;
        });

        // 构建页数按钮
        if (comicDomHtml) {
          const target = options.在新页面中打开链接 ? 'target="_blank" ' : '';
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
})();

      break;
    }
  case 'terra-historicus.hypergryph.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('episode')) return;
  const {
    setManga,
    setFab,
    init
  } = await main.useInit('terraHistoricus');
  const apiUrl = () => `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;
  const getImgUrl = i => async () => {
    const res = await main.request(`${apiUrl()}/page?pageNum=${i + 1}`);
    return JSON.parse(res.response).data.url;
  };
  const getImgList = async () => {
    const res = await main.request(apiUrl());
    const pageList = JSON.parse(res.response).data.pageInfos;
    if (pageList.length === 0) throw new Error('获取图片列表时出错');
    return main.plimit([...Array(pageList.length).keys()].map(getImgUrl), (doneNum, totalNum) => {
      setFab({
        tip: `获取图片中 - ${doneNum}/${totalNum}`
      });
    });
  };

  // 点击指定 dom 的同时重新获取图片列表
  const turnPage = selector => async () => {
    main.querySelectorClick(selector)();
    setManga({
      imgList: []
    });
    setManga({
      imgList: await getImgList(),
      show: true
    });
  };
  setManga({
    onPrev: turnPage('footer .HG_GAME_JS_BRIDGE__prev a'),
    onNext: turnPage('footer .HG_GAME_JS_BRIDGE__buttonEp+.HG_GAME_JS_BRIDGE__buttonEp a')
  });
  init(getImgList);
})();

      break;
    }
  case 'copymanga.site':
  case 'copymanga.info':
  case 'copymanga.net':
  case 'copymanga.org':
  case 'copymanga.com':
  case 'www.copymanga.site':
  case 'www.copymanga.info':
  case 'www.copymanga.net':
  case 'www.copymanga.org':
  case 'www.copymanga.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!window.location.href.includes('/chapter/')) return;
  const {
    setManga,
    init
  } = await main.useInit('copymanga');
  setManga({
    onNext: main.querySelectorClick('.comicContent-next a:not(.prev-null)'),
    onPrev: main.querySelectorClick('.comicContent-prev:not(.index,.list) a:not(.prev-null)')
  });
  init(async () => {
    const res = await main.request(window.location.href.replace(/.*?(?=\/comic\/)/, 'https://api.copymanga.site/api/v3'));
    const {
      results: {
        chapter: {
          contents
        }
      }
    } = JSON.parse(res.responseText);
    return contents.map(({
      url
    }) => url);
  });
})();

      break;
    }
  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.dm5.cn':
  case 'www.1kkk.com':
    {
const main = require('../main');

// 页面自带的变量

/** 漫画页数 */

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'DM5_CID')) return;
  const {
    setFab,
    setManga,
    init
  } = await main.useInit('dm5');
  setManga({
    onNext: main.querySelectorClick('.logo_2'),
    onPrev: main.querySelectorClick('.logo_1'),
    onExit: isEnd => {
      if (isEnd) main.scrollIntoView('.top');
      setManga({
        show: false
      });
    }
  });
  const getImgList = async (imgList = [], errorNum = 0) => {
    try {
      const res = await $.ajax({
        type: 'GET',
        url: 'chapterfun.ashx',
        data: {
          cid: DM5_CID,
          page: imgList.length + 1,
          key: $('#dm5_key').length ? $('#dm5_key').val() : '',
          language: 1,
          gtk: 6,
          _cid: DM5_CID,
          _mid: DM5_MID,
          _dt: DM5_VIEWSIGN_DT,
          _sign: DM5_VIEWSIGN
        }
      });

      // 返回的数据只能通过 eval 获得
      // eslint-disable-next-line no-eval
      const newImgList = [...imgList, ...eval(res)];
      if (newImgList.length !== DM5_IMAGE_COUNT) {
        setFab({
          progress: newImgList.length / DM5_IMAGE_COUNT,
          tip: `加载图片中 - ${newImgList.length}/${DM5_IMAGE_COUNT}`
        });
        return getImgList(newImgList);
      }
      return newImgList;
    } catch (error) {
      if (errorNum > 3) throw new Error('加载图片时出错');
      console.error('加载图片时出错');
      main.toast.error('加载图片时出错');
      await main.sleep(1000 * 3);
      return getImgList(imgList, errorNum + 1);
    }
  };
  init(getImgList);
})();

      break;
    }
  case 'www.mangabz.com':
  case 'mangabz.com':
    {
const main = require('../main');

// 页面自带的变量

/** 总页数 */

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) return;
  const {
    setFab,
    setManga,
    init
  } = await main.useInit('mangabz');
  setManga({
    onNext: main.querySelectorClick('body > .container a[href^="/"]:last-child'),
    onPrev: main.querySelectorClick('body > .container a[href^="/"]:first-child')
  });
  const getImgList = async (imgList = []) => {
    const urlParams = main.dataToParams({
      cid: MANGABZ_CID,
      page: imgList.length + 1,
      key: '',
      _cid: MANGABZ_CID,
      _mid: MANGABZ_MID,
      _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
      _sign: MANGABZ_VIEWSIGN
    });
    const res = await main.request(`http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`);

    // 返回的数据只能通过 eval 获得
    // eslint-disable-next-line no-eval
    const newImgList = [...imgList, ...eval(res.responseText)];
    if (newImgList.length !== MANGABZ_IMAGE_COUNT) {
      // 在 Fab 按钮上通过进度条和提示文本显示当前进度
      setFab({
        progress: newImgList.length / MANGABZ_IMAGE_COUNT,
        tip: `加载图片中 - ${newImgList.length}/${MANGABZ_IMAGE_COUNT}`
      });
      return getImgList(newImgList);
    }
    return newImgList;
  };
  init(getImgList);
})();

      break;
    }
  case 'www.manhuagui.com':
  case 'www.mhgui.com':
  case 'tw.manhuagui.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cInfo')) return;
  const {
    setManga,
    init
  } = await main.useInit('manhuagui');
  setManga({
    onNext: cInfo.nextId !== 0 ? main.querySelectorClick('a.nextC') : undefined,
    onPrev: cInfo.prevId !== 0 ? main.querySelectorClick('a.prevC') : undefined
  });
  init(() => {
    const comicInfo = JSON.parse(
    // 只能通过 eval 获得数据
    // eslint-disable-next-line no-eval
    eval(document.querySelectorAll('body > script')[1].innerHTML.slice(26)).slice(12, -12));
    const sl = Object.entries(comicInfo.sl).map(attr => `${attr[0]}=${attr[1]}`).join('&');
    return comicInfo.files.map(file => `${pVars.manga.filePath}${file}?${sl}`);
  });
})();

      break;
    }
  case 'www.manhuadb.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'img_data_arr')) return;
  const {
    setManga,
    init
  } = await main.useInit('manhuaDB');

  /**
   * 检查是否有上/下一话
   */
  const checkTurnPage = async type => {
    const res = await $.ajax({
      method: 'POST',
      url: '/book/goNumPage',
      dataType: 'json',
      data: main.dataToParams({
        ccid: p_ccid,
        id: p_id,
        num: vg_r_data.data('num') + (type === 'next' ? 1 : -1),
        d: p_d,
        type
      })
    });
    if (res.state) return main.querySelectorClick(`a[title="${type === 'next' ? '下集' : '上集'}"]`);
    return undefined;
  };
  setManga({
    onNext: await checkTurnPage('next'),
    onPrev: await checkTurnPage('pre')
  });
  init(() => img_data_arr.map(data => `${img_host}/${img_pre}/${data.img}`));
})();

      break;
    }
  case 'www.manhuacat.com':
  case 'www.maofly.com':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cdnImage')) return;
  const {
    setManga,
    init
  } = await main.useInit('manhuacat');

  /**
   * 检查是否有上/下一页
   */
  const checkTurnPage = async type => {
    const res = await $.ajax({
      type: 'get',
      url: `/chapter_num?chapter_id=${chapter_num}&ctype=${type === 'next' ? 1 : 2}&type=${chapter_type}`,
      dataType: 'json'
    });
    if (res.code === '0000') return () => goNumPage(type);
    return null;
  };
  setManga({
    onNext: await checkTurnPage('next'),
    onPrev: await checkTurnPage('pre')
  });
  init(() => img_data_arr.map(img => cdnImage(img_pre + img, asset_domain, asset_key)));
})();

      break;
    }
  case 'jmcomic.me':
  case 'jmcomic1.me':
  case '18comic.org':
  case '18comic.cc':
  case '18comic.vip':
    {
const main = require('../main');

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;
  const {
    init,
    setFab
  } = await main.useInit('jm');
  while (!unsafeWindow?.onImageLoaded) {
    if (document.readyState === 'complete') {
      main.toast.error('无法获取图片', {
        duration: 60000
      });
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await main.sleep(100);
  }
  const imgEleList = main.querySelectorAll('.scramble-page > img');

  // 判断当前漫画是否有被分割，没有就直接获取图片链接加载
  // 判断条件来自页面上的 scramble_image 函数
  if (unsafeWindow.aid < unsafeWindow.scramble_id || unsafeWindow.speed === '1') {
    init(() => imgEleList.map(e => e.getAttribute('data-original')));
    return;
  }
  const getImgUrl = async imgEle => {
    const res = await main.request(imgEle.getAttribute('data-original'), {
      responseType: 'blob'
    });
    imgEle.src = URL.createObjectURL(res.response);
    await new Promise((resolve, reject) => {
      imgEle.onload = resolve;
      imgEle.onerror = reject;
    });
    unsafeWindow.onImageLoaded(imgEle);
    const blob = await new Promise(resolve => {
      imgEle.nextElementSibling.toBlob(resolve, 'image/webp', 1);
    });
    if (!blob) return '';
    return `${URL.createObjectURL(blob)}#.webp`;
  };
  init(() => main.plimit(imgEleList.map(img => () => getImgUrl(img)), (doneNum, totalNum) => {
    setFab({
      progress: doneNum / totalNum,
      tip: `加载图片中 - ${doneNum}/${totalNum}`
    });
  }));
})();

      break;
    }
  default:
    {
const main = require('../main');

/**
 * 对修改站点配置的相关方法的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useSiteOptions = async (name, defaultOptions = {}) => {
  const rawValue = await GM.getValue(name);
  const options = Object.assign({
    option: undefined,
    autoShow: true,
    hiddenFAB: false,
    ...defaultOptions
  }, rawValue);
  const changeCallbackList = [];
  return {
    options,
    /** 该站点是否有储存配置 */
    isRecorded: rawValue !== undefined,
    /**
     * 设置新 Option
     * @param newValue newValue
     * @param trigger 是否触发变更事件
     */
    setOptions: async (newValue, trigger = true) => {
      Object.assign(options, newValue);
      await GM.setValue(name, options);
      if (trigger) await Promise.all(changeCallbackList.map(callback => callback(options)));
    },
    /**
     * 监听配置变更事件
     */
    onOptionChange: callback => {
      changeCallbackList.push(callback);
    }
  };
};

setTimeout(async () => {
  const {
    options,
    setOptions,
    isRecorded
  } = await useSiteOptions(window.location.hostname, {
    autoShow: false
  });

  /** 图片列表 */
  let imgList = [];
  /** 是否正在后台不断检查图片 */
  let running = 0;
  let setManga;
  let setFab;
  const init = async () => {
    if (setManga !== undefined) return;
    [setManga] = await main.useManga({
      imgList,
      show: options.autoShow,
      onOptionChange: option => setOptions({
        ...options,
        option
      }, false)
    });
    setFab = await main.useFab({
      tip: '阅读模式',
      onClick: () => setManga({
        show: true
      }),
      speedDial: main.useSpeedDial(options, setOptions)
    });
    setFab();
  };

  /** 已经被触发过懒加载的图片 */
  const triggedImgList = new Set();
  /** 触发懒加载 */
  const triggerLazyLoad = () => {
    const targetImgList = [...document.getElementsByTagName('img')]
    // 过滤掉已经被触发过懒加载的图片
    .filter(e => !triggedImgList.has(e))
    // 根据位置从小到大排序
    .sort((a, b) => a.offsetTop - b.offsetTop);

    /** 上次触发的图片 */
    let lastTriggedImg;
    targetImgList.forEach(e => {
      triggedImgList.add(e);

      // 过滤掉位置相近，在触发上一张图片时已经顺带被触发了的
      if (e.offsetTop >= (lastTriggedImg?.offsetTop ?? 0) + window.innerHeight) return;

      // 通过瞬间滚动到图片位置、触发滚动事件、再瞬间滚回来，来触发图片的懒加载
      const nowScroll = window.scrollY;
      window.scroll({
        top: e.offsetTop,
        behavior: 'auto'
      });
      e.dispatchEvent(new Event('scroll', {
        bubbles: true
      }));
      window.scroll({
        top: nowScroll,
        behavior: 'auto'
      });
      lastTriggedImg = e;
    });
  };

  /**
   * 检查搜索页面上符合标准的图片
   * @returns 返回是否成功找到图片
   */
  const checkFindImg = () => {
    triggerLazyLoad();
    const newImgList = [...document.getElementsByTagName('img')].filter(e => e.naturalHeight > 500 && e.naturalWidth > 500).map(e => e.src);
    if (newImgList.length === 0) {
      if (!options.autoShow) {
        clearInterval(running);
        main.toast.error('没有找到图片');
      }
      return false;
    }

    // 在发现新图片后重新渲染
    if (!main.isEqualArray(imgList, newImgList)) {
      imgList = newImgList;
      setManga({
        imgList
      });
      setFab({
        progress: 1
      });
    }
    return true;
  };
  await GM.registerMenuCommand('进入漫画阅读模式', async () => {
    await init();
    if (!running) running = window.setInterval(checkFindImg, 2000);
    if (!checkFindImg()) return;
    setManga({
      show: true
    });

    // 自动启用自动加载功能
    await setOptions({
      ...options,
      autoShow: true
    });
    await GM.registerMenuCommand('停止在此站点自动运行脚本', () => GM.deleteValue(window.location.hostname));
  });
  if (isRecorded) {
    await init();
    // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
    running = window.setInterval(checkFindImg, 2000);
    await GM.registerMenuCommand('停止在此站点自动运行脚本', () => GM.deleteValue(window.location.hostname));
  }
});

    }
}
