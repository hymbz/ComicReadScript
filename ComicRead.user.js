// ==UserScript==
// @name      comic-read-script
// @namespace comic-read-script
// @version   0.1.0
// @author    hymbz
// @license   AGPL-3.0-or-later
// @include   *
// @connect   *
// @noframes
// @resource  react https://unpkg.com/react@18.2.0/umd/react.production.min.js
// @resource  react-dom https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js
// @resource  react/jsx-runtime https://unpkg.com/react@18.2.0/cjs/react-jsx-runtime.production.min.js
// @resource  zustand https://unpkg.com/zustand@4.1.1/umd/index.production.js
// @resource  zustand/vanilla https://unpkg.com/zustand@4.1.1/umd/vanilla.production.js
// @resource  use-sync-external-store/shim/with-selector https://unpkg.com/use-sync-external-store@1.0.0/cjs/use-sync-external-store-with-selector.production.min.js
// @resource  immer https://unpkg.com/immer@9.0.15/dist/immer.umd.production.min.js
// @resource  react-shadow https://unpkg.com/react-shadow@19.0.3/react-shadow.js
// @resource  prop-types https://unpkg.com/prop-types@15.8.1/prop-types.min.js
// @resource  panzoom https://unpkg.com/panzoom@9.4.3/dist/panzoom.min.js
// @resource  react-toastify https://unpkg.com/react-toastify@9.0.8/dist/react-toastify.js
// @resource  clsx https://unpkg.com/clsx@1.2.1/dist/clsx.js
// @resource  fflate https://unpkg.com/fflate@0.7.4/umd/index.js
// @resource  dmzj_style https://userstyles.org/styles/chrome/119945.json
// @grant     GM_addElement
// @grant     GM_getResourceText
// @grant     GM_xmlhttpRequest
// @grant     GM.xmlHttpRequest
// @grant     GM.getResourceText
// @grant     GM.addStyle
// @grant     GM.getValue
// @grant     GM.setValue
// @grant     GM.deleteValue
// @grant     GM.registerMenuCommand
// @grant     GM.unregisterMenuCommand
// @grant     unsafeWindow
// ==/UserScript==
'use strict';
// 为了尽量减少在无关页面浪费时间，将 components、helper 下的代码都转成文本存放在变量中
// 只在需要使用时再通过和其他外部库一样的方式进行加载
const helperCode = `
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });

const require$$0 = require('react/jsx-runtime');
const React = require('react');
const require$$2 = require('clsx');
const require$$2$1 = require('zustand');
const require$$3 = require('immer');
const require$$4 = require('panzoom');
const reactToastify = require('react-toastify');
const fflate = require('fflate');
const shadow = require('react-shadow');

const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
  if (e) {
    for (const k in e) {
      if (k !== 'default') {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}

const require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
const React__namespace = /*#__PURE__*/_interopNamespace(React);
const React__default = /*#__PURE__*/_interopDefaultLegacy(React);
const require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
const require$$2__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$2$1);
const require$$3__default = /*#__PURE__*/_interopDefaultLegacy(require$$3);
const require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
const fflate__default = /*#__PURE__*/_interopDefaultLegacy(fflate);
const shadow__default = /*#__PURE__*/_interopDefaultLegacy(shadow);

const sleep = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
});
/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
const querySelector = (selector) => document.querySelector(selector);
/**
 * 对 document.querySelector 的封装
 * 将默认返回类型改为 HTMLElement
 */
const querySelectorAll = (selector) => [...document.querySelectorAll(selector)];
/**
 * 添加元素
 *
 * @param node 被添加元素
 * @param textnode 添加元素
 * @param referenceNode 参考元素，添加元素将插在参考元素前
 */
const insertNode = (node, textnode, referenceNode = null) => {
    const temp = document.createElement('div');
    temp.innerHTML = textnode;
    const frag = document.createDocumentFragment();
    while (temp.firstChild)
        frag.appendChild(temp.firstChild);
    node.insertBefore(frag, referenceNode);
};
/** 创建组件用的 ReactDOM Root */
const useComponentsRoot = (id) => {
    // 需要使用动态导入以避免在支持站点外的页面上加载 React
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    const ReactDOM = require('react-dom');
    const dom = document.getElementById(id) ??
        (() => {
            const _dom = document.createElement('div');
            _dom.id = id;
            document.body.appendChild(_dom);
            return _dom;
        })();
    return [ReactDOM.createRoot(dom), dom];
};
/** 返回 Dom 的点击函数，如果找不到 Dom 则返回 null */
const querySelectorClick = (selector) => {
    const dom = querySelector(selector);
    if (!dom)
        return null;
    return () => {
        dom.click();
    };
};
/** 判断两个列表中包含的值是否相同 */
const isEqualArray = (a, b) => a.length === b.length && !!a.filter((t) => !b.includes(t));
/** 将对象转为 URLParams 类型的字符串 */
const dataToParams = (data) => Object.entries(data)
    .map(([key, val]) => \`\${key}=\${val}\`)
    .join('&');
/** 根据 url 下载为 blob 格式数据 */
const download = async (url, details, errorNum = 0, maxErrorNum = 3) => {
    const res = await GM.xmlHttpRequest({
        method: 'GET',
        url,
        responseType: 'blob',
        headers: { Referer: window.location.href },
        ...details,
    });
    if (res.status !== 200) {
        const errorTest = \`\${url} 下载图片时出错：[\${res.status}]\${res.statusText}\`;
        if (errorNum >= maxErrorNum)
            throw new Error(errorTest);
        console.warn(errorTest);
        await sleep(1000);
        return download(url, details, errorNum + 1, maxErrorNum);
    }
    return res.response;
};
/** 将 blob 数据作为文件保存至本地 */
const saveAs = (blob, name = 'download') => {
    const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    a.download = name;
    a.rel = 'noopener';
    a.href = URL.createObjectURL(blob);
    setTimeout(() => a.dispatchEvent(new MouseEvent('click')));
};
/** 监听键盘事件 */
const linstenKeyup = (handler) => window.addEventListener('keyup', (e) => {
    // 跳过输入框的键盘事件
    switch (e.target.tagName) {
        case 'INPUT':
        case 'TEXTAREA':
            return;
    }
    handler(e);
});
/** 滚动页面到指定元素的所在位置 */
const scrollIntoView = (selector) => {
    querySelector(selector)?.scrollIntoView();
};
/**
 * 限制 Promise 并发
 *
 * @param limit 限制数
 * @param fnList 返回 Promise 的函数
 * @param callBack 成功执行一个 Promise 后调用，主要用于显示进度
 * @returns 所有 Promise 的返回值
 */
const plimit = async (limit, fnList, callBack) => {
    const totalNum = fnList.length;
    const resList = [];
    const execPool = new Set();
    const taskList = fnList.map((fn, i) => {
        let p;
        return () => {
            p = (async () => {
                resList[i] = await fn();
                execPool.delete(p);
                callBack?.(resList);
            })();
            execPool.add(p);
        };
    });
    while (resList.length !== totalNum) {
        while (taskList.length && execPool.size < limit) {
            taskList.shift()();
        }
        // eslint-disable-next-line no-await-in-loop
        await Promise.race(execPool);
    }
    return resList;
};

var _path$9;
function _extends$9() { _extends$9 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$9.apply(this, arguments); }
const SvgFileDownload = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$9({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$9 || (_path$9 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"
})));

var _path$8;
function _extends$8() { _extends$8 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$8.apply(this, arguments); }
const SvgClose = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$8({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$8 || (_path$8 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"
})));

var IconButton = {exports: {}};

(function (module, exports) {
    Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });
    const main = () => {
        const jsxRuntime = require$$0__default.default;
        const react = React__default.default;
        const clsx = require$$2__default.default;
        const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };
        const clsx__default = /*#__PURE__*/ _interopDefaultLegacy(clsx);
        const classes = { "iconButtonItem": "index-module_iconButtonItem__jb7BZ", "iconButton": "index-module_iconButton__-XHmw", "enabled": "index-module_enabled__NKlE9", "iconButtonPopper": "index-module_iconButtonPopper__vhloV", "hidden": "index-module_hidden__jOPaw" };
        /**
         * 图标按钮
         *
         * @param param param
         */
        const IconButton = react.memo(({ children, tip, hidden, enabled, ref, showTip, placement = 'right', popper, popperClassName, onClick, }) => {
            const buttonRef = react.useRef(ref?.current ?? null);
            const handleClick = (e) => {
                // 在每次点击后取消焦点
                buttonRef.current?.blur();
                return onClick?.(e);
            };
            return (jsxRuntime.jsxs("div", { className: classes.iconButtonItem, "data-show": showTip, children: [jsxRuntime.jsx("button", { ref: buttonRef, "aria-label": tip, type: "button", className: clsx__default.default(classes.iconButton, { [classes.hidden]: hidden }, enabled && classes.enabled), onClick: handleClick, children: children }), popper || tip ? (jsxRuntime.jsx("div", { className: clsx__default.default(classes.iconButtonPopper, popperClassName), "data-placement": placement, children: popper || tip })) : null] }));
        });
        exports.IconButton = IconButton;
    };
    const selfModule = module.exports;
    module.exports = new Proxy(selfModule, {
        get(_, prop) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop];
        },
        apply(_, __, args) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop](...args);
        },
        construct(_, args) {
            if (selfModule[prop] === undefined)
                main();
            return new selfModule[prop](...args);
        },
    });
}(IconButton, IconButton.exports));

var Manga = {exports: {}};

(function (module, exports) {
    Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });
    const main = () => {
        const jsxRuntime = require$$0__default.default;
        const React = React__default.default;
        const create = require$$2__default$1.default;
        const immer$1 = require$$3__default.default;
        const createPanZoom = require$$4__default.default;
        const clsx = require$$2__default.default;
        const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : { default: e };
        function _interopNamespace(e) {
            if (e && e.__esModule)
                return e;
            const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
            if (e) {
                for (const k in e) {
                    if (k !== 'default') {
                        const d = Object.getOwnPropertyDescriptor(e, k);
                        Object.defineProperty(n, k, d.get ? d : {
                            enumerable: true,
                            get: () => e[k]
                        });
                    }
                }
            }
            n.default = e;
            return Object.freeze(n);
        }
        const React__namespace = /*#__PURE__*/ _interopNamespace(React);
        const create__default = /*#__PURE__*/ _interopDefaultLegacy(create);
        const createPanZoom__default = /*#__PURE__*/ _interopDefaultLegacy(createPanZoom);
        const clsx__default = /*#__PURE__*/ _interopDefaultLegacy(clsx);
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
        function throttle(delay, callback, options) {
            var _ref = options || {}, _ref$noTrailing = _ref.noTrailing, noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing, _ref$noLeading = _ref.noLeading, noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading, _ref$debounceMode = _ref.debounceMode, debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
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
                var _ref2 = options || {}, _ref2$upcomingOnly = _ref2.upcomingOnly, upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;
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
                    }
                    else {
                        /*
                         * In throttle mode without noLeading, if \`delay\` time has been exceeded, execute
                         * \`callback\`.
                         */
                        exec();
                    }
                }
                else if (noTrailing !== true) {
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
        function debounce(delay, callback, options) {
            var _ref = options || {}, _ref$atBegin = _ref.atBegin, atBegin = _ref$atBegin === void 0 ? false : _ref$atBegin;
            return throttle(delay, callback, {
                debounceMode: atBegin !== false
            });
        }
        const immerImpl = (initializer) => (set, get, store) => {
            store.setState = (updater, replace, ...a) => {
                const nextState = typeof updater === "function" ? immer$1.produce(updater) : updater;
                return set(nextState, replace, ...a);
            };
            return initializer(store.setState, get, store);
        };
        const immer = immerImpl;
        const subscribeWithSelectorImpl = (fn) => (set, get, api) => {
            const origSubscribe = api.subscribe;
            api.subscribe = (selector, optListener, options) => {
                let listener = selector;
                if (optListener) {
                    const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
                    let currentSlice = selector(api.getState());
                    listener = (state) => {
                        const nextSlice = selector(state);
                        if (!equalityFn(currentSlice, nextSlice)) {
                            const previousSlice = currentSlice;
                            optListener(currentSlice = nextSlice, previousSlice);
                        }
                    };
                    if (options == null ? void 0 : options.fireImmediately) {
                        optListener(currentSlice, currentSlice);
                    }
                }
                return origSubscribe(listener);
            };
            const initialState = fn(set, get, api);
            return initialState;
        };
        const subscribeWithSelector = subscribeWithSelectorImpl;
        const optionSlice = () => ({
            option: {
                dir: 'rtl',
                scrollbar: {
                    enabled: true,
                    autoHidden: false,
                    showProgress: true,
                },
                onePageMode: false,
                scrollMode: false,
                clickPage: {
                    enabled: 'ontouchstart' in document.documentElement,
                    overturn: false,
                },
                disableZoom: false,
                // 判断用户系统环境是否要求开启暗色模式
                darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
                autoLoadOtherImg: 5,
                flipToNext: true,
            },
            showTouchArea: false,
        });
        /**
         * 根据图片比例和填充页设置对漫画图片进行排列
         */
        const handleComicData = ({ comicImgList, fillEffect, }) => {
            const pageList = [];
            let imgCache = null;
            for (let i = 0; i < comicImgList.length; i += 1) {
                const img = comicImgList[i];
                if (fillEffect.get(i - 1)) {
                    if (imgCache !== null)
                        throw new Error('imgCache 被覆盖');
                    imgCache = -1;
                }
                if (img.type !== 'long' && img.type !== 'wide') {
                    if (imgCache !== null) {
                        pageList.push([imgCache, i]);
                        imgCache = null;
                    }
                    else {
                        imgCache = i;
                    }
                }
                else {
                    if (imgCache !== null) {
                        if (imgCache !== -1)
                            pageList.push([-1, imgCache]);
                        imgCache = null;
                    }
                    if (fillEffect.get(i) === undefined && img.loadType !== 'loading')
                        fillEffect.set(i, false);
                    pageList.push([i]);
                }
            }
            if (imgCache !== null && imgCache !== -1) {
                pageList.push([imgCache, -1]);
                imgCache = null;
            }
            return pageList;
        };
        /** 加载状态的中文描述 */
        const loadTypeMap = {
            error: '加载出错',
            loading: '正在加载',
            wait: '等待加载',
            loaded: '',
        };
        /**
         * 预加载指定页数的图片，并取消其他预加载的图片
         *
         * @param state state
         * @param startIndex 起始 page index
         * @param endIndex 结束 page index
         * @param loadNum 加载图片的数量
         * @returns 返回指定范围内的图片在执行前是否还有未加载完的
         */
        const loadImg = (state, startIndex, endIndex = startIndex, loadNum = NaN) => {
            let editNum = 0;
            state.pageList
                .slice(startIndex, endIndex)
                .flat()
                .some((index) => {
                if (index === -1)
                    return false;
                const img = state.imgList[index];
                if (img.loadType !== 'loaded') {
                    img.loadType = 'loading';
                    editNum += 1;
                }
                return editNum >= loadNum;
            });
            const edited = editNum > 0;
            if (edited)
                state.scrollbar.updateTipText(state);
            return edited;
        };
        const imageSlice = (set, get) => {
            const _updatePageData = (state) => {
                if (state.option.onePageMode || state.option.scrollMode)
                    state.pageList = state.imgList.map((_, i) => [i]);
                else
                    state.pageList = handleComicData({
                        comicImgList: state.imgList,
                        fillEffect: state.fillEffect,
                    });
                state.scrollbar.updateDrag(state);
                state.img.updateImgLoadType();
            };
            return {
                imgList: [],
                fillEffect: new Map([[-1, true]]),
                pageList: [],
                activeImgIndex: 0,
                activePageIndex: 0,
                nowFillIndex: -1,
                onLoading: undefined,
                img: {
                    单页比例: 0,
                    横幅比例: 0,
                    条漫比例: 0,
                    updatePageData: Object.assign(debounce(100, () => set(_updatePageData)), { sync: _updatePageData }),
                    updateImgType: (draftImg) => {
                        const { img: { 单页比例, 横幅比例, 条漫比例, updatePageData }, } = get();
                        const { width, height } = draftImg;
                        if (width && height) {
                            const imgRatio = width / height;
                            if (imgRatio <= 单页比例) {
                                if (imgRatio < 条漫比例)
                                    draftImg.type = 'vertical';
                            }
                            else {
                                draftImg.type = imgRatio > 横幅比例 ? 'long' : 'wide';
                            }
                        }
                        set(updatePageData);
                    },
                    updatePageRatio: (state, width, height) => {
                        state.img.单页比例 = Math.min(width / 2 / height, 1);
                        state.img.横幅比例 = width / height;
                        state.img.条漫比例 = state.img.单页比例 / 2;
                        state.imgList.forEach(state.img.updateImgType);
                        state.scrollbar.updateDrag(state);
                    },
                    switchFillEffect: () => {
                        set((state) => {
                            state.fillEffect.set(state.nowFillIndex, !state.fillEffect.get(state.nowFillIndex));
                            state.img.updatePageData();
                        });
                    },
                    updateImgLoadType: debounce(100, () => {
                        set((state) => {
                            const { imgList, activePageIndex } = state;
                            // 先将所有加载中的图片状态改为暂停
                            imgList.forEach(({ loadType }, i) => {
                                if (loadType === 'loading' || loadType === 'error')
                                    imgList[i].loadType = 'wait';
                            });
                            if (
                            // 如果当前显示页还没有加载完，则优先加载
                            loadImg(state, activePageIndex, activePageIndex + 1) ||
                                // 之后加载后俩页
                                loadImg(state, activePageIndex + 1, activePageIndex + 3) ||
                                // 最后加载前一页
                                (activePageIndex >= 1 &&
                                    loadImg(state, activePageIndex - 1, activePageIndex)))
                                return;
                            // 确认没有图片在加载后，在空闲时间自动加载其余图片
                            if (!state.option.autoLoadOtherImg &&
                                imgList.some((img) => img.loadType === 'loading'))
                                return;
                            // 优先加载当前页后面的图片
                            if (loadImg(state, activePageIndex + 1, imgList.length, state.option.autoLoadOtherImg))
                                return;
                            loadImg(state, 0, imgList.length, state.option.autoLoadOtherImg);
                        });
                    }),
                },
                turnPage: (dir) => {
                    const { pageList, endPageType, activePageIndex } = get();
                    set((state) => {
                        if (dir === 'prev') {
                            switch (endPageType) {
                                case 'start':
                                    if (!state.scrollLock && state.option.flipToNext)
                                        state.onPrev?.();
                                    return;
                                case 'end':
                                    state.endPageType = undefined;
                                    return;
                                default:
                                    // 弹出卷首结束页
                                    if (activePageIndex === 0) {
                                        // 没有 onPrev 时不弹出
                                        if (!state.onPrev || !state.option.flipToNext)
                                            return;
                                        state.endPageType = 'start';
                                        state.scrollLock = true;
                                        window.setTimeout(() => {
                                            set((draftState) => {
                                                draftState.scrollLock = false;
                                            });
                                        }, 500);
                                        return;
                                    }
                                    if (!state.option.scrollMode)
                                        state.activePageIndex -= 1;
                            }
                        }
                        else {
                            switch (endPageType) {
                                case 'end':
                                    if (state.scrollLock)
                                        return;
                                    if (state.onNext && state.option.flipToNext) {
                                        state.onNext();
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
                                    if (activePageIndex === pageList.length - 1) {
                                        state.endPageType = 'end';
                                        state.scrollLock = true;
                                        window.setTimeout(() => {
                                            set((draftState) => {
                                                draftState.scrollLock = false;
                                            });
                                        }, 200);
                                        return;
                                    }
                                    if (!state.option.scrollMode)
                                        state.activePageIndex += 1;
                            }
                        }
                    });
                },
            };
        };
        const imageCallback = (useStore) => {
            // 页数发生变动时
            useStore.subscribe((state) => state.activePageIndex, () => {
                useStore.setState((state) => {
                    // 重新计算 activeImgIndex
                    state.activeImgIndex =
                        state.pageList[state.activePageIndex].find((i) => i !== -1) ?? 0;
                    // 找到当前所属的 fillEffect
                    let nowFillIndex = state.activeImgIndex;
                    while (!state.fillEffect.has(nowFillIndex) && (nowFillIndex -= 1))
                        ;
                    state.nowFillIndex = nowFillIndex;
                    state.img.updateImgLoadType();
                    if (state.endPageType)
                        state.endPageType = undefined;
                });
            });
        };
        const externalLibSlice = (set, get) => ({
            panzoom: undefined,
            initPanzoom: () => {
                const { mangaFlowRef } = get();
                set((state) => {
                    // 销毁之前可能创建过的实例
                    state.panzoom?.dispose();
                    const panzoom = createPanZoom__default.default(mangaFlowRef.current, {
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
                            const { scale } = panzoom.getTransform();
                            // 图片不处于放大状态时，必须按下 Alt 键才能通过滚轮缩放
                            if (e.altKey && scale === 1)
                                return false;
                            // 图片处于放大状态时，可以直接通过滚轮缩放
                            if (scale !== 1)
                                return false;
                            return true;
                        },
                        beforeMouseDown(e) {
                            // 按下「alt 键」或「处于放大状态」时才允许拖动
                            return !(e.altKey || panzoom.getTransform().scale !== 1);
                        },
                        onTouch() {
                            // 未进行缩放时不捕捉 touch 事件
                            const { scale } = panzoom.getTransform();
                            return scale !== 1;
                        },
                    });
                    panzoom.on('transform', () => {
                        if (panzoom.getTransform().scale === 1) {
                            const { scrollLock } = get();
                            // 防止在放大模式下通过滚轮缩小至原尺寸后立刻跳转至下一页
                            if (scrollLock)
                                window.setTimeout(() => {
                                    set((draftState) => {
                                        draftState.scrollLock = false;
                                    });
                                }, 500);
                        }
                        else {
                            const { scrollLock } = get();
                            if (!scrollLock)
                                set((draftState) => {
                                    draftState.scrollLock = true;
                                });
                        }
                    });
                    state.panzoom = panzoom;
                });
            },
        });
        const operateSlice = (set, get) => ({
            scrollLock: false,
            handleScroll: (e) => {
                e.stopPropagation();
                const { option: { scrollMode }, turnPage, scrollLock, endPageType, } = get();
                if (e.altKey || (!endPageType && scrollLock))
                    return;
                if (scrollMode && !endPageType) {
                    set((state) => {
                        if (state.scrollbar.dragTop === 0 && e.deltaY <= 0) {
                            state.endPageType = 'start';
                            state.scrollLock = true;
                            window.setTimeout(() => {
                                set((draftState) => {
                                    draftState.scrollLock = false;
                                });
                            }, 500);
                        }
                        else if (state.scrollbar.dragHeight + state.scrollbar.dragTop === 1) {
                            state.endPageType = 'end';
                            state.scrollLock = true;
                            window.setTimeout(() => {
                                set((draftState) => {
                                    draftState.scrollLock = false;
                                });
                            }, 500);
                        }
                    });
                    return;
                }
                if (e.deltaY > 0)
                    turnPage('next');
                else
                    turnPage('prev');
            },
            handleKeyUp: (e) => {
                e.stopPropagation();
                const { turnPage, img: { switchFillEffect }, option: { dir, scrollMode }, onExit, pageList, endPageType, } = get();
                if (scrollMode && !endPageType)
                    return;
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
                        nextPage = dir !== 'rtl';
                        break;
                    case 'ArrowLeft':
                    case 'a':
                        nextPage = dir === 'rtl';
                        break;
                    case '/':
                    case 'm':
                    case 'z':
                        switchFillEffect();
                        break;
                    case 'Home':
                        set((state) => {
                            state.activePageIndex = 0;
                        });
                        break;
                    case 'End':
                        set((state) => {
                            state.activePageIndex = pageList.length - 1;
                        });
                        break;
                    case 'Escape':
                        onExit?.();
                        break;
                }
                if (nextPage === null)
                    return;
                turnPage(nextPage ? 'next' : 'prev');
            },
        });
        function shallow(objA, objB) {
            if (Object.is(objA, objB)) {
                return true;
            }
            if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
                return false;
            }
            const keysA = Object.keys(objA);
            if (keysA.length !== Object.keys(objB).length) {
                return false;
            }
            for (let i = 0; i < keysA.length; i++) {
                if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
                    return false;
                }
            }
            return true;
        }
        /** 开始拖拽时的 dragTop 值 */
        let startTop = 0;
        /**
         * 获取指定 page 中的图片 index，并在后面加上加载状态
         */
        const getPageIndexText = (state, pageIndex) => {
            const pageIndexText = state.pageList[pageIndex].map((index) => {
                if (index === -1)
                    return '填充页';
                const img = state.imgList[index];
                if (img.loadType === 'loaded')
                    return \`\${index}\`;
                // 如果图片未加载完毕则在其 index 后增加显示当前加载状态
                return \`\${index} (\${loadTypeMap[img.loadType]})\`;
            });
            if (state.option.dir === 'rtl')
                pageIndexText.reverse();
            return pageIndexText;
        };
        const scrollbarSlice = (set, get) => ({
            scrollbar: {
                tipText: '',
                dragHeight: 0,
                dragTop: 0,
                updateTipText: (state) => {
                    state.scrollbar.tipText = (() => {
                        if (!state.pageList.length)
                            return '';
                        if (!state.option.scrollMode)
                            return getPageIndexText(state, state.activePageIndex).join(' | ');
                        const { pageList, scrollbar: { dragHeight, dragTop }, } = state;
                        const pageIndex = pageList
                            .slice(Math.floor(dragTop * pageList.length), Math.floor((dragTop + dragHeight) * pageList.length))
                            .flat()
                            .map((index) => getPageIndexText(state, index));
                        return pageIndex.join('\\n');
                    })();
                },
                updateDrag: (state) => {
                    if (!state.option.scrollMode) {
                        state.scrollbar.dragHeight = 0;
                        state.scrollbar.dragTop = 0;
                        return;
                    }
                    /** 能显示出漫画的高度 */
                    const windowHeight = state.rootRef.current?.offsetHeight;
                    /** 漫画的总高度 */
                    const contentHeight = state.mangaFlowRef.current?.scrollHeight;
                    state.scrollbar.dragHeight =
                        !windowHeight || !contentHeight ? 0 : windowHeight / contentHeight;
                },
                handleMangaFlowScroll: () => {
                    set((state) => {
                        if (!state.option.scrollMode)
                            return;
                        const mangaFlowDom = state.mangaFlowRef.current;
                        /** 漫画的总高度 */
                        const contentHeight = mangaFlowDom?.scrollHeight;
                        state.scrollbar.dragTop =
                            !mangaFlowDom || !contentHeight
                                ? 0
                                : mangaFlowDom.scrollTop / contentHeight;
                        state.activePageIndex = Math.floor(state.scrollbar.dragTop * state.pageList.length);
                        state.scrollbar.updateDrag(state);
                    });
                },
                // 使在滚动条上的滚轮可以触发滚动
                handleWheel: (e) => {
                    const { mangaFlowRef, rootRef } = get();
                    /** 能显示出漫画的高度 */
                    const windowHeight = rootRef.current?.offsetHeight;
                    if (!windowHeight)
                        return;
                    /** 滚动条高度 */
                    const scrollbarHeight = e.target.offsetHeight;
                    // 使用 scrollBy 会导致和原生滚动效果不同，少了平滑滚动，但初次之外找不到其他办法了
                    mangaFlowRef.current?.scrollBy({
                        top: (e.nativeEvent.deltaY / scrollbarHeight) * windowHeight,
                    });
                },
                dragOption: {
                    handleDrag: ({ type, xy: [, y], initial: [, iy] }, e) => {
                        // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
                        if (type === 'end')
                            return;
                        // 跳过没必要处理的情况
                        if (type === 'dragging' && y === iy)
                            return;
                        const { activePageIndex, mangaFlowRef, pageList, option: { scrollMode }, scrollbar: { dragHeight }, } = get();
                        if (!mangaFlowRef.current)
                            return;
                        /** 滚动条高度 */
                        const scrollbarHeight = e.target.offsetHeight;
                        /** 点击位置在滚动条上的位置比率 */
                        const clickTop = y / scrollbarHeight;
                        let top = clickTop;
                        if (scrollMode) {
                            /** 漫画的总高度 */
                            const contentHeight = mangaFlowRef.current.scrollHeight;
                            if (type === 'dragging') {
                                /** 在滚动条上的移动比率 */
                                const dy = (y - iy) / scrollbarHeight;
                                top = startTop + dy;
                                // 处理超出范围的情况
                                if (top < 0)
                                    top = 0;
                                else if (top > 1)
                                    top = 1;
                                mangaFlowRef.current.scrollTo({ top: top * contentHeight });
                            }
                            else {
                                // 确保滚动条的中心会在点击位置
                                top -= dragHeight / 2;
                                startTop = top;
                                mangaFlowRef.current.scrollTo({
                                    top: top * contentHeight,
                                    behavior: 'smooth',
                                });
                            }
                        }
                        else {
                            let newPageIndex = Math.floor(top * pageList.length);
                            // 处理超出范围的情况
                            if (newPageIndex < 0)
                                newPageIndex = 0;
                            else if (newPageIndex >= pageList.length)
                                newPageIndex = pageList.length - 1;
                            if (newPageIndex !== activePageIndex)
                                set((state) => {
                                    state.activePageIndex = newPageIndex;
                                });
                        }
                    },
                },
            },
        });
        const scrollbarCallback = (useStore) => {
            // 更新滚动条提示文本
            useStore.subscribe(({ activePageIndex, pageList, scrollbar: { dragHeight, dragTop }, option: { scrollMode, dir }, }) => [activePageIndex, pageList, dragHeight, dragTop, scrollMode, dir], () => {
                useStore.setState((state) => {
                    state.scrollbar.updateTipText(state);
                });
            }, { equalityFn: shallow });
        };
        const otherSlice = () => ({
            showToolbar: false,
            showScrollbar: false,
            showEndPage: false,
            endPageType: undefined,
            editButtonList: (list) => list,
            editSettingList: (list) => list,
        });
        immer$1.enableMapSet();
        immer$1.setAutoFreeze(false);
        const store = (...a) => ({
            ...optionSlice(...a),
            ...imageSlice(...a),
            ...externalLibSlice(...a),
            ...operateSlice(...a),
            ...scrollbarSlice(...a),
            ...otherSlice(...a),
            rootRef: { current: null },
            mangaFlowRef: { current: null },
        });
        const useStore = create__default.default()(subscribeWithSelector(immer(store)));
        scrollbarCallback(useStore);
        imageCallback(useStore);
        /**
         * 初始化
         */
        const useInit = ({ imgList, fillEffect, option, onExit, onPrev, onNext, onOptionChange, onLoading, editButtonList, editSettingList, }) => {
            // 初始化配置
            React.useEffect(() => {
                if (!option)
                    return;
                useStore.setState((state) => {
                    Object.assign(state.option, option);
                });
            }, [option]);
            const rootRef = React.useRef(null);
            React.useEffect(() => {
                useStore.setState((state) => {
                    // 绑定 rootRef
                    state.rootRef = rootRef;
                    // 初始化 panzoom
                    state.initPanzoom();
                });
            }, []);
            React.useEffect(() => {
                // 初始化页面比例
                useStore.setState((state) => {
                    state.img.updatePageRatio(state, rootRef.current.scrollWidth, rootRef.current.scrollHeight);
                });
                // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
                const resizeObserver = new ResizeObserver(throttle(100, ([entries]) => {
                    const { width, height } = entries.contentRect;
                    useStore.setState((state) => {
                        state.img.updatePageRatio(state, width, height);
                    });
                }));
                resizeObserver.disconnect();
                resizeObserver.observe(rootRef.current);
                return () => resizeObserver.disconnect();
            }, []);
            // 处理 imgList fillEffect 参数的初始化和修改
            React.useEffect(() => {
                useStore.setState((state) => {
                    if (fillEffect)
                        state.fillEffect = fillEffect;
                    // 处理初始化
                    if (!state.imgList.length) {
                        state.imgList = imgList.map((imgUrl) => ({
                            type: '',
                            src: imgUrl,
                            loadType: 'wait',
                        }));
                        state.img.updatePageData.sync(state);
                        return;
                    }
                    /** 修改前的当前显示图片 */
                    const oldActiveImg = state.pageList[state.activePageIndex].map((i) => state.imgList?.[i]?.src);
                    state.imgList = imgList.map((imgUrl) => state.imgList.find((img) => img.src === imgUrl) ?? {
                        type: '',
                        src: imgUrl,
                        loadType: 'wait',
                    });
                    state.img.updatePageData.sync(state);
                    // 尽量使当前显示的图片在修改后依然不变
                    oldActiveImg.some((imgUrl) => {
                        // 跳过填充页和已被删除的图片
                        if (!imgUrl || imgList.includes(imgUrl))
                            return false;
                        const newPageIndex = state.pageList.findIndex((page) => page.some((index) => state.imgList?.[index]?.src === imgUrl));
                        if (newPageIndex === -1)
                            return false;
                        state.activePageIndex = newPageIndex;
                        return true;
                    });
                    // 如果已经翻到了最后一页，且最后一页的图片都被删掉了，那就保持在末页显示
                    if (state.activePageIndex > state.pageList.length - 1)
                        state.activePageIndex = state.pageList.length - 1;
                });
            }, [imgList, fillEffect]);
            React.useEffect(() => {
                useStore.setState((state) => {
                    if (onExit)
                        state.onExit = onExit;
                    if (onPrev)
                        state.onPrev = onPrev;
                    if (onNext)
                        state.onNext = onNext;
                    if (editButtonList)
                        state.editButtonList = editButtonList;
                    if (editSettingList)
                        state.editSettingList = editSettingList;
                });
            }, [editButtonList, editSettingList, onExit, onNext, onPrev]);
            // 绑定配置发生改变时的回调
            React.useEffect(() => {
                if (!onOptionChange)
                    return undefined;
                return useStore.subscribe((state) => state.option, onOptionChange);
            }, [onOptionChange]);
            // 绑定图片加载状态发生变化时触发的回调
            React.useEffect(() => {
                if (!onLoading)
                    return;
                useStore.setState((state) => {
                    state.onLoading = debounce(100, onLoading);
                });
            }, [onLoading]);
            return rootRef;
        };
        const classes$1 = { "img": "index-module_img__1DxVP", "mangaFlow": "index-module_mangaFlow__Emsh7", "disableZoom": "index-module_disableZoom__SQnsB", "scrollMode": "index-module_scrollMode__vYIgd", "endPage": "index-module_endPage__JITNn", "tip": "index-module_tip__710pO", "toolbar": "index-module_toolbar__0u69J", "toolbarPanel": "index-module_toolbarPanel__tBbg4", "SettingPanelPopper": "index-module_SettingPanelPopper__liZDa", "SettingPanel": "index-module_SettingPanel__GQTbw", "SettingBlock": "index-module_SettingBlock__Yw7Qr", "SettingBlockSubtitle": "index-module_SettingBlockSubtitle__LtLBn", "SettingsItem": "index-module_SettingsItem__UcbhR", "SettingsItemName": "index-module_SettingsItemName__dabYv", "SettingsItemSwitch": "index-module_SettingsItemSwitch__MON2V", "SettingsItemSwitchRound": "index-module_SettingsItemSwitchRound__O9-c9", "SettingsItemIconButton": "index-module_SettingsItemIconButton__nTP1V", "closeCover": "index-module_closeCover__HRd50", "scrollbar": "index-module_scrollbar__wUmnU", "scrollbarDrag": "index-module_scrollbarDrag__wX5Be", "scrollbarPage": "index-module_scrollbarPage__d2B2h", "scrollbarPoper": "index-module_scrollbarPoper__c5XwM", "touchAreaRoot": "index-module_touchAreaRoot__XPLTA", "touchArea": "index-module_touchArea__d6T8h", "hidden": "index-module_hidden__gZmTY", "invisible": "index-module_invisible__HuqQw", "opacity1": "index-module_opacity1__4O7y-", "opacity0": "index-module_opacity0__93ym1", "root": "index-module_root__dkTnB" };
        /**
         * 漫画图片
         *
         * @param img 图片数据
         */
        const ComicImg = React.memo(({ index }) => {
            const imgRef = React.useRef(null);
            const handleImgLoaded = React.useCallback(() => {
                if (index === -1)
                    return;
                useStore.setState((state) => {
                    if (!imgRef.current)
                        return;
                    const img = state.imgList[index];
                    img.loadType = 'loaded';
                    img.height = imgRef.current.naturalHeight;
                    img.width = imgRef.current.naturalWidth;
                    state.img.updateImgType(img);
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    state.onLoading?.(immer$1.current(img), immer$1.current(state.imgList));
                });
            }, [index]);
            const handleImgError = React.useCallback((e) => {
                if (index === -1)
                    return;
                // 跳过因为 src 为空导致的错误
                if (e.target.getAttribute('src') === '')
                    return;
                useStore.setState((state) => {
                    const img = state.imgList[index];
                    img.loadType = 'error';
                    img.error = e;
                    console.error('图片加载失败', e);
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    state.onLoading?.(immer$1.current(img), immer$1.current(state.imgList));
                });
            }, [index]);
            const { show, fill } = useStore((state) => {
                // 卷轴模式下全部显示
                if (state.option.scrollMode)
                    return { show: '' };
                const activePage = state.pageList[state.activePageIndex];
                if (!activePage.includes(index))
                    return { show: undefined };
                return {
                    show: '',
                    fill: (() => {
                        const i = activePage.indexOf(-1);
                        if (i === -1)
                            return undefined;
                        return !!i === (state.option.dir === 'rtl') ? 'left' : 'right';
                    })(),
                };
            }, shallow);
            const img = useStore((state) => state.imgList[index]);
            return (jsxRuntime.jsx("img", { ref: imgRef, className: classes$1.img, src: img.loadType === 'wait' ? '' : img.src, alt: \`\${index}\`, "data-show": show, "data-type": img.type, "data-load-type": img.loadType, "data-fill": fill, onLoad: handleImgLoaded, onError: handleImgError }));
        });
        const selector$3 = ({ activePageIndex, imgList, option: { scrollMode, disableZoom, dir }, scrollbar: { handleMangaFlowScroll }, }) => ({
            activePageIndex,
            imgList,
            scrollMode,
            disableZoom,
            dir,
            handleMangaFlowScroll,
        });
        /**
         * 漫画图片流的容器
         */
        const ComicImgFlow = () => {
            const { imgList, scrollMode, disableZoom, dir, handleMangaFlowScroll } = useStore(selector$3, shallow);
            const mangaFlowRef = React.useRef(null);
            // 绑定 mangaFlowRef
            React.useEffect(() => {
                useStore.setState((state) => {
                    state.mangaFlowRef = mangaFlowRef;
                });
            }, []);
            const imgEleList = React.useMemo(
            // eslint-disable-next-line react/no-array-index-key
            () => imgList.map((_, i) => jsxRuntime.jsx(ComicImg, { index: i }, i)), [imgList]);
            return (jsxRuntime.jsx("div", { ref: mangaFlowRef, id: classes$1.mangaFlow, className: clsx__default.default(classes$1.mangaFlow, (disableZoom || scrollMode) && classes$1.disableZoom, scrollMode && classes$1.scrollMode), dir: dir, onScroll: handleMangaFlowScroll, children: imgEleList }));
        };
        const useHover = () => {
            const [isHover, setIsHover] = React.useState(false);
            /** 鼠标移入 */
            const handleMouseEnter = React.useCallback(() => {
                setIsHover(true);
            }, []);
            /** 鼠标移出 */
            const handleMouseLeave = React.useCallback(() => {
                setIsHover(false);
            }, []);
            return [isHover, handleMouseEnter, handleMouseLeave];
        };
        var _path$6;
        function _extends$6() { _extends$6 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$6.apply(this, arguments); }
        const SvgLooksOne = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$6({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$6 || (_path$6 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14c-.55 0-1-.45-1-1V9h-1c-.55 0-1-.45-1-1s.45-1 1-1h2c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1z"
        })));
        var _path$5;
        function _extends$5() { _extends$5 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$5.apply(this, arguments); }
        const SvgLooksTwo = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$5({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$5 || (_path$5 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 8c0 1.1-.9 2-2 2h-2v2h3c.55 0 1 .45 1 1s-.45 1-1 1h-4c-.55 0-1-.45-1-1v-3c0-1.1.9-2 2-2h2V9h-3c-.55 0-1-.45-1-1s.45-1 1-1h3c1.1 0 2 .9 2 2v2z"
        })));
        var _path$4;
        function _extends$4() { _extends$4 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$4.apply(this, arguments); }
        const SvgViewDay = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$4({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$4 || (_path$4 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M3 21h17c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 4v1c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1z"
        })));
        var _path$3;
        function _extends$3() { _extends$3 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$3.apply(this, arguments); }
        const SvgQueue = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$3({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$3 || (_path$3 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1zm17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 9h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3h-3c-.55 0-1-.45-1-1s.45-1 1-1h3V6c0-.55.45-1 1-1s1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1z"
        })));
        var _path$2;
        function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$2.apply(this, arguments); }
        const SvgSettings = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$2({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$2 || (_path$2 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
        })));
        const classes = { "iconButtonItem": "index-module_iconButtonItem__jb7BZ", "iconButton": "index-module_iconButton__-XHmw", "enabled": "index-module_enabled__NKlE9", "iconButtonPopper": "index-module_iconButtonPopper__vhloV", "hidden": "index-module_hidden__jOPaw" };
        /**
         * 图标按钮
         *
         * @param param param
         */
        const IconButton = React.memo(({ children, tip, hidden, enabled, ref, showTip, placement = 'right', popper, popperClassName, onClick, }) => {
            const buttonRef = React.useRef(ref?.current ?? null);
            const handleClick = (e) => {
                // 在每次点击后取消焦点
                buttonRef.current?.blur();
                return onClick?.(e);
            };
            return (jsxRuntime.jsxs("div", { className: classes.iconButtonItem, "data-show": showTip, children: [jsxRuntime.jsx("button", { ref: buttonRef, "aria-label": tip, type: "button", className: clsx__default.default(classes.iconButton, { [classes.hidden]: hidden }, enabled && classes.enabled), onClick: handleClick, children: children }), popper || tip ? (jsxRuntime.jsx("div", { className: clsx__default.default(classes.iconButtonPopper, popperClassName), "data-placement": placement, children: popper || tip })) : null] }));
        });
        var _path$1;
        function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends$1.apply(this, arguments); }
        const SvgFormatTextdirectionLToR = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends$1({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path$1 || (_path$1 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M9 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1H9.17C7.08 2 5.22 3.53 5.02 5.61A3.998 3.998 0 0 0 9 10zm11.65 7.65-2.79-2.79a.501.501 0 0 0-.86.35V17H6c-.55 0-1 .45-1 1s.45 1 1 1h11v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.19.2-.51.01-.7z"
        })));
        var _path;
        function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends.apply(this, arguments); }
        const SvgFormatTextdirectionRToL = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path || (_path = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M10 10v4c0 .55.45 1 1 1s1-.45 1-1V4h2v10c0 .55.45 1 1 1s1-.45 1-1V4h1c.55 0 1-.45 1-1s-.45-1-1-1h-6.83C8.08 2 6.22 3.53 6.02 5.61A3.998 3.998 0 0 0 10 10zm-2 7v-1.79c0-.45-.54-.67-.85-.35l-2.79 2.79c-.2.2-.2.51 0 .71l2.79 2.79a.5.5 0 0 0 .85-.36V19h11c.55 0 1-.45 1-1s-.45-1-1-1H8z"
        })));
        /**
         * 设置菜单项
         */
        const SettingsItem = ({ name, className, children, }) => (jsxRuntime.jsxs("div", { className: clsx__default.default(classes$1.SettingsItem, className?.length && className), children: [jsxRuntime.jsxs("div", { className: classes$1.SettingsItemName, children: [" ", name, " "] }), children] }));
        /**
         * 开关式菜单项
         */
        const SettingsItemSwitch = ({ name, value, className, onChange, }) => {
            const handleClick = React.useCallback(() => {
                onChange(!value);
            }, [onChange, value]);
            return (jsxRuntime.jsx(SettingsItem, { name: name, className: className, children: jsxRuntime.jsx("button", { className: classes$1.SettingsItemSwitch, type: "button", onClick: handleClick, "data-checked": value, children: jsxRuntime.jsx("div", { className: classes$1.SettingsItemSwitchRound }) }) }));
        };
        /**
         * 从 boolean | Element 分出 Element 的类型保护函数
         */
        /**
         * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
         *
         * @param hexColor 十六进制颜色。例如 #112233
         */
        const needDarkMode = (hexColor) => {
            // 来自 https://24ways.org/2010/calculating-color-contrast
            const r = parseInt(hexColor.substring(1, 3), 16);
            const g = parseInt(hexColor.substring(3, 5), 16);
            const b = parseInt(hexColor.substring(5, 7), 16);
            const yiq = (r * 299 + g * 587 + b * 114) / 1000;
            return yiq < 128;
        };
        /** 默认菜单项 */
        const defaultSettingList = [
            [
                '阅读方向',
                () => {
                    const dir = useStore((state) => state.option.dir);
                    const handleEditDir = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.dir = state.option.dir === 'rtl' ? 'ltr' : 'rtl';
                        });
                    }, []);
                    return (jsxRuntime.jsx(SettingsItem, { name: dir === 'rtl' ? '从右到左（日漫）' : '从左到右（美漫）', children: jsxRuntime.jsx("button", { className: classes$1.SettingsItemIconButton, type: "button", onClick: handleEditDir, children: dir === 'rtl' ? (jsxRuntime.jsx(SvgFormatTextdirectionRToL, {})) : (jsxRuntime.jsx(SvgFormatTextdirectionLToR, {})) }) }));
                },
            ],
            [
                '滚动条',
                () => {
                    const enabled = useStore((state) => state.option.scrollbar.enabled);
                    const handleEnable = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.scrollbar.enabled = !state.option.scrollbar.enabled;
                        });
                    }, []);
                    const autoHidden = useStore((state) => state.option.scrollbar.autoHidden);
                    const handleAutoHidden = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.scrollbar.autoHidden =
                                !state.option.scrollbar.autoHidden;
                        });
                    }, []);
                    const showProgress = useStore((state) => state.option.scrollbar.showProgress);
                    const handleShowProgress = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.scrollbar.showProgress =
                                !state.option.scrollbar.showProgress;
                        });
                    }, []);
                    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u663E\\u793A\\u6EDA\\u52A8\\u6761", value: enabled, onChange: handleEnable }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u81EA\\u52A8\\u9690\\u85CF\\u6EDA\\u52A8\\u6761", value: autoHidden, className: clsx__default.default(enabled || classes$1.hidden), onChange: handleAutoHidden }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u663E\\u793A\\u56FE\\u7247\\u52A0\\u8F7D\\u72B6\\u6001", value: showProgress, className: clsx__default.default(enabled || classes$1.hidden), onChange: handleShowProgress })] }));
                },
            ],
            [
                '点击翻页',
                () => {
                    /** 是否启用点击翻页功能 */
                    const clickPage = useStore((state) => state.option.clickPage.enabled);
                    const handleClickPages = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.clickPage.enabled = !state.option.clickPage.enabled;
                        });
                    }, []);
                    /** 是否显示点击区域 */
                    const showTouchArea = useStore((state) => state.showTouchArea);
                    const handleShowTouchArea = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.showTouchArea = !state.showTouchArea;
                        });
                    }, []);
                    /** 是否左右反转点击区域 */
                    const overturn = useStore((state) => state.option.clickPage.overturn);
                    const handleOverturn = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.clickPage.overturn = !state.option.clickPage.overturn;
                        });
                    }, []);
                    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u542F\\u7528\\u70B9\\u51FB\\u7FFB\\u9875", value: clickPage, onChange: handleClickPages }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u5DE6\\u53F3\\u53CD\\u8F6C\\u70B9\\u51FB\\u533A\\u57DF", value: overturn, className: clsx__default.default(!clickPage && classes$1.hidden), onChange: handleOverturn }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u663E\\u793A\\u70B9\\u51FB\\u533A\\u57DF\\u63D0\\u793A", value: showTouchArea, className: clsx__default.default(!clickPage && classes$1.hidden), onChange: handleShowTouchArea })] }));
                },
            ],
            [
                '其他',
                () => {
                    const darkMode = useStore((state) => state.option.darkMode);
                    const background = useStore((state) => state.option.customBackground);
                    const handleDarkMode = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.darkMode = !state.option.darkMode;
                        });
                    }, []);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    const handleBgColor = React.useCallback((event) => {
                        useStore.setState((state) => {
                            // 在拉到纯黑或纯白时改回初始值
                            state.option.customBackground =
                                event.target.value === '#000000' ||
                                    event.target.value === '#ffffff'
                                    ? undefined
                                    : event.target.value;
                            state.option.darkMode = needDarkMode(event.target.value);
                        });
                    }, []);
                    const disableZoom = useStore((state) => state.option.disableZoom);
                    const handleDisableZoom = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.disableZoom = !state.option.disableZoom;
                        });
                    }, []);
                    const flipToNext = useStore((state) => state.option.flipToNext);
                    const handleFlipToNext = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.flipToNext = !state.option.flipToNext;
                        });
                    }, []);
                    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u7FFB\\u9875\\u81F3\\u4E0A/\\u4E0B\\u4E00\\u8BDD", value: flipToNext, onChange: handleFlipToNext }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u542F\\u7528\\u591C\\u95F4\\u6A21\\u5F0F", value: darkMode, onChange: handleDarkMode }), jsxRuntime.jsx(SettingsItemSwitch, { name: "\\u7981\\u6B62\\u653E\\u5927\\u56FE\\u7247", value: disableZoom, onChange: handleDisableZoom }), jsxRuntime.jsx(SettingsItem, { name: "\\u80CC\\u666F\\u989C\\u8272", children: jsxRuntime.jsx("input", { type: "color", value: background ?? (darkMode ? 'black' : 'white'), onChange: handleBgColor, style: { width: '2em', marginRight: '.4em' } }) })] }));
                },
            ],
            [
                '关于',
                () => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SettingsItem, { name: "\\u7248\\u672C\\u53F7", children: jsxRuntime.jsx("a", { href: "https://github.com/hymbz/ComicReadScript", children: "0.0.1" }) }), jsxRuntime.jsx(SettingsItem, { name: "\\u53CD\\u9988", children: jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("a", { href: "https://github.com/hymbz/ComicReadScript/issues", style: { marginRight: '.5em' }, children: "Github" }), jsxRuntime.jsx("a", { href: "https://greasyfork.org/zh-CN/scripts/374903-comicread/feedback", children: "Greasy Fork" })] }) })] })),
            ],
        ];
        /** 菜单面板 */
        const SettingPanel = React.memo(() => {
            const editSettingList = useStore((state) => state.editSettingList);
            const settingList = React.useMemo(() => editSettingList(defaultSettingList), [editSettingList]);
            const handleScroll = React.useCallback((e) => {
                e.stopPropagation();
            }, []);
            return (jsxRuntime.jsx("div", { className: classes$1.SettingPanel, onScroll: handleScroll, onWheel: handleScroll, children: settingList.map(([key, SettingItem], i) => (jsxRuntime.jsxs(React.Fragment, { children: [i ? jsxRuntime.jsx("hr", {}) : null, jsxRuntime.jsxs("div", { className: classes$1.SettingBlock, children: [jsxRuntime.jsx("div", { className: classes$1.SettingBlockSubtitle, children: key }), jsxRuntime.jsx(SettingItem, {})] })] }, key))) }));
        });
        /** 工具栏按钮分隔栏 */
        const buttonListDivider = [
            '',
            () => jsxRuntime.jsx("div", { style: { height: '1em' } }),
        ];
        /** 工具栏的默认按钮列表 */
        const defaultButtonList = [
            [
                '单双页模式',
                () => {
                    const isOnePageMode = useStore((state) => state.option.onePageMode);
                    const handleClick = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.onePageMode = !state.option.onePageMode;
                            state.img.updatePageData.sync(state);
                            state.activePageIndex = state.option.onePageMode
                                ? state.activeImgIndex
                                : state.pageList.findIndex((page) => page.includes(state.activeImgIndex));
                        });
                    }, []);
                    const isScrollMode = useStore((state) => state.option.scrollMode);
                    return (jsxRuntime.jsx(IconButton, { tip: isOnePageMode ? '单页模式' : '双页模式', onClick: handleClick, hidden: isScrollMode, children: isOnePageMode ? jsxRuntime.jsx(SvgLooksOne, {}) : jsxRuntime.jsx(SvgLooksTwo, {}) }));
                },
            ],
            [
                '卷轴模式',
                () => {
                    const enabled = useStore((state) => state.option.scrollMode);
                    const handleClick = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.option.scrollMode = !state.option.scrollMode;
                            state.option.onePageMode = state.option.scrollMode;
                            state.img.updatePageData.sync(state);
                            setTimeout(state.scrollbar.handleMangaFlowScroll);
                        });
                    }, []);
                    return (jsxRuntime.jsx(IconButton, { tip: "\\u5377\\u8F74\\u6A21\\u5F0F", enabled: enabled, onClick: handleClick, children: jsxRuntime.jsx(SvgViewDay, {}) }));
                },
            ],
            [
                '页面填充',
                () => {
                    const enabled = useStore((state) => state.fillEffect.get(state.nowFillIndex));
                    const isOnePageMode = useStore((state) => state.option.onePageMode);
                    const handleClick = useStore((state) => state.img.switchFillEffect);
                    return (jsxRuntime.jsx(IconButton, { tip: "\\u9875\\u9762\\u586B\\u5145", enabled: enabled, hidden: isOnePageMode, onClick: handleClick, children: jsxRuntime.jsx(SvgQueue, {}) }));
                },
            ],
            buttonListDivider,
            [
                '设置',
                ({ onMouseLeave }) => {
                    const [showPanel, setShowPanel] = React.useState(false);
                    const handleClick = React.useCallback(() => {
                        useStore.setState((state) => {
                            state.showToolbar = !showPanel;
                        });
                        setShowPanel(!showPanel);
                    }, [showPanel]);
                    const popper = React.useMemo(() => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(SettingPanel, {}), jsxRuntime.jsx("div", { className: classes$1.closeCover, onClick: () => {
                                    handleClick();
                                    onMouseLeave();
                                }, role: "button", tabIndex: -1, "aria-label": "\\u5173\\u95ED\\u8BBE\\u7F6E\\u5F39\\u7A97\\u7684\\u906E\\u7F69" })] })), [handleClick, onMouseLeave]);
                    return (jsxRuntime.jsx(IconButton, { tip: "\\u8BBE\\u7F6E", enabled: showPanel, showTip: showPanel, onClick: handleClick, popperClassName: showPanel && classes$1.SettingPanelPopper, popper: showPanel && popper, children: jsxRuntime.jsx(SvgSettings, {}) }));
                },
            ],
        ];
        /** 左侧工具栏 */
        const Toolbar = () => {
            const showToolbar = useStore((state) => state.showToolbar);
            const [isHover, handleMouseEnter, handleMouseLeave] = useHover();
            const editButtonList = useStore((state) => state.editButtonList);
            const buttonList = React.useMemo(() => editButtonList(defaultButtonList).map(([key, ButtonItem], i) => (jsxRuntime.jsx(ButtonItem, { onMouseLeave: handleMouseLeave }, key || i))), [editButtonList, handleMouseLeave]);
            return (jsxRuntime.jsx("div", { role: "toolbar", className: classes$1.toolbar, onMouseLeave: handleMouseLeave, onMouseEnter: handleMouseEnter, "data-show": isHover || showToolbar, children: jsxRuntime.jsx("div", { className: classes$1.toolbarPanel, children: buttonList }) }));
        };
        const defaultStata = () => ({
            type: 'start',
            xy: [0, 0],
            initial: [0, 0],
            startTime: 0,
        });
        const useDrag = (ref, option) => {
            const { current: state } = React.useRef(defaultStata());
            React.useEffect(() => {
                const { handleDrag } = option;
                const controller = new AbortController();
                if (ref.current) {
                    // 在鼠标、手指按下后切换状态
                    ref.current.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        // 只处理左键按下触发的事件
                        if (e.buttons !== 1)
                            return;
                        state.type = 'start';
                        state.xy = [e.offsetX, e.offsetY];
                        state.initial = [e.offsetX, e.offsetY];
                        state.startTime = Date.now();
                        handleDrag(state, e);
                    }, { capture: false, passive: true, signal: controller.signal });
                    // TODO: 完成触摸事件的适配
                    // ref.current.addEventListener(
                    //   'touchstart',
                    //   (e) => {
                    //     down.current = true;
                    //     handleDrag(e., e.offsetY);
                    //   },
                    //   { capture: false, passive: true, signal: controller.signal },
                    // );
                    // 在鼠标、手指移动时根据状态判断是否要触发函数
                    ref.current.addEventListener('mousemove', (e) => {
                        e.stopPropagation();
                        if (state.startTime === 0)
                            return;
                        // 只处理左键按下触发的事件
                        if (e.buttons !== 1)
                            return;
                        state.type = 'dragging';
                        state.xy = [e.offsetX, e.offsetY];
                        handleDrag(state, e);
                    }, { capture: false, passive: true, signal: controller.signal });
                    // 在鼠标、手指松开后切换状态
                    ref.current.addEventListener('mouseup', (e) => {
                        e.stopPropagation();
                        if (state.startTime === 0)
                            return;
                        state.type = 'end';
                        state.xy = [e.offsetX, e.offsetY];
                        handleDrag(state, e);
                        Object.assign(state, defaultStata());
                    }, { capture: false, passive: true, signal: controller.signal });
                }
                return () => controller.abort();
            }, [option, ref, state]);
        };
        const ScrollbarPage = React.memo(({ index }) => {
            const loadType = useStore((state) => state.imgList[index].loadType);
            return (jsxRuntime.jsx("div", { className: classes$1.scrollbarPage, "data-index": index, "data-type": loadType }));
        });
        const selector$2 = ({ option: { scrollbar, scrollMode }, pageList, showScrollbar, activePageIndex, scrollbar: { dragHeight, dragTop, handleWheel, dragOption, tipText }, }) => ({
            pageList,
            showScrollbar,
            scrollbar,
            scrollMode,
            activePageIndex,
            dragHeight,
            dragTop,
            handleWheel,
            dragOption,
            tipText,
        });
        /** 滚动条 */
        const Scrollbar = React.memo(() => {
            const { pageList, showScrollbar, scrollbar, scrollMode, activePageIndex, dragHeight, dragTop, handleWheel, dragOption, tipText, } = useStore(selector$2, shallow);
            const pageEleList = React.useMemo(() => scrollbar.showProgress
                ? pageList.map(([a, b]) => (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(ScrollbarPage, { index: a !== -1 ? a : b }), b ? jsxRuntime.jsx(ScrollbarPage, { index: b !== -1 ? b : a }) : null] }, \`\${a}\${b}\`)))
                : [], [scrollbar.showProgress, pageList]);
            const ref = React.useRef(null);
            useDrag(ref, dragOption);
            return (jsxRuntime.jsxs("div", { ref: ref, className: clsx__default.default(classes$1.scrollbar, {
                    [classes$1.hidden]: !scrollbar.enabled && !showScrollbar,
                }), role: "scrollbar", "aria-controls": classes$1.mangaFlow, "aria-valuenow": activePageIndex || -1, tabIndex: -1, onWheel: handleWheel, children: [jsxRuntime.jsx("div", { className: classes$1.scrollbarDrag, "data-show": !scrollbar.autoHidden || showScrollbar, style: {
                            top: scrollMode
                                ? \`\${dragTop * 100}%\`
                                : \`\${(1 / pageList.length) * 100 * activePageIndex}%\`,
                            height: dragHeight
                                ? \`\${dragHeight * 100}%\`
                                : \`\${(1 / pageList.length) * 100}%\`,
                        }, children: jsxRuntime.jsx("div", { className: clsx__default.default(classes$1.scrollbarPoper, !tipText && classes$1.hidden), "data-show": showScrollbar, children: tipText }) }), pageEleList] }));
        });
        const useDoubleClick = (click, doubleClick, timeout = 200) => {
            const clickTimeout = React.useRef(null);
            return React.useCallback((event) => {
                // 如果点击触发时还有上次计时器的记录，说明这次是双击
                if (clickTimeout.current) {
                    clearTimeout(clickTimeout.current);
                    clickTimeout.current = null;
                    doubleClick?.(event);
                    return;
                }
                // 单击事件延迟触发
                clickTimeout.current = window.setTimeout(() => {
                    click(event);
                    clickTimeout.current = null;
                }, timeout);
            }, [click, doubleClick, timeout]);
        };
        const selector$1 = ({ showTouchArea, panzoom, turnPage, option: { clickPage, scrollMode, dir }, }) => ({
            showTouchArea,
            panzoom,
            turnPage,
            clickPage,
            scrollMode,
            dir,
        });
        const TouchArea = React.memo(() => {
            const { showTouchArea, panzoom, turnPage, clickPage, scrollMode, dir } = useStore(selector$1, shallow);
            /** 处理双击缩放 */
            const handleDoubleClickZoom = React.useCallback((e) => {
                if (!panzoom)
                    return;
                const { scale } = panzoom.getTransform();
                setTimeout(() => {
                    // 当缩放到一定程度时再双击会缩放回原尺寸，否则正常触发缩放
                    if (scale > 2)
                        panzoom.smoothZoomAbs(e.clientX, e.clientY, 1);
                    else
                        panzoom.smoothZoomAbs(e.clientX, e.clientY, scale + 1);
                });
            }, [panzoom]);
            const handleClickNext = useDoubleClick(() => {
                if (clickPage.enabled)
                    turnPage('next');
            }, handleDoubleClickZoom);
            const handleClickPrev = useDoubleClick(() => {
                if (clickPage.enabled)
                    turnPage('prev');
            }, handleDoubleClickZoom);
            const handleClickMenu = useDoubleClick(() => {
                useStore.setState((state) => {
                    state.showScrollbar = !state.showScrollbar;
                    state.showToolbar = !state.showToolbar;
                });
            }, handleDoubleClickZoom);
            // 在右键点击时使自身可穿透，使右键菜单为图片的右键菜单
            const [penetrate, setPenetrate] = React.useState(null);
            // 之后再立刻恢复回来
            React.useEffect(() => {
                setPenetrate(null);
            }, [penetrate]);
            return (jsxRuntime.jsxs("div", { className: classes$1.touchAreaRoot, style: {
                    // 开启卷轴模式时隐藏自身
                    pointerEvents: penetrate || scrollMode ? 'none' : 'auto',
                    // 左右方向默认和漫画方向相同，如果开启了左右翻转则翻转
                    flexDirection: (dir === 'rtl') === (clickPage.enabled && clickPage.overturn)
                        ? undefined
                        : 'row-reverse',
                }, onContextMenu: setPenetrate, "data-show": showTouchArea, children: [jsxRuntime.jsx("div", { className: clsx.clsx(classes$1.touchArea), onClick: handleClickPrev, "data-area": "prev", role: "button", tabIndex: -1, children: jsxRuntime.jsx("h6", { children: "\\u4E0A \\u4E00 \\u9875" }) }), jsxRuntime.jsx("div", { className: clsx.clsx(classes$1.touchArea), onClick: handleClickMenu, "data-area": "menu", role: "button", tabIndex: -1, children: jsxRuntime.jsx("h6", { children: "\\u83DC \\u5355" }) }), jsxRuntime.jsx("div", { className: clsx.clsx(classes$1.touchArea), onClick: handleClickNext, "data-area": "next", role: "button", tabIndex: -1, children: jsxRuntime.jsx("h6", { children: "\\u4E0B \\u4E00 \\u9875" }) })] }));
        });
        const selector = ({ onExit, onPrev, onNext, turnPage, endPageType, option: { flipToNext }, }) => ({
            onExit,
            onPrev,
            onNext,
            turnPage,
            endPageType,
            flipToNext,
        });
        let delayTypeTimer = 0;
        const EndPage = () => {
            const { onExit, onPrev, onNext, turnPage, endPageType, flipToNext } = useStore(selector, shallow);
            const handleClick = React.useCallback((e) => {
                e.stopPropagation();
                if (e.target.nodeName === 'BUTTON')
                    return;
                useStore.setState((state) => {
                    state.endPageType = undefined;
                });
            }, []);
            const handleEnd = React.useCallback(() => {
                useStore.setState((state) => {
                    state.onExit?.(true);
                    state.activePageIndex = 0;
                    state.endPageType = undefined;
                });
            }, []);
            const ref = React.useRef(null);
            React.useEffect(() => {
                const controller = new AbortController();
                ref.current?.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    turnPage(e.deltaY > 0 ? 'next' : 'prev');
                }, {
                    passive: false,
                    signal: controller.signal,
                });
                return () => {
                    controller.abort();
                };
            }, [turnPage]);
            // state.endPageType 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
            // 防止在动画效果结束前 tip 就消失或改变了位置
            const [delayType, setDelayType] = React.useState();
            React.useEffect(() => {
                if (endPageType) {
                    window.clearTimeout(delayTypeTimer);
                    setDelayType(endPageType);
                }
                else {
                    delayTypeTimer = window.setTimeout(() => setDelayType(endPageType), 500);
                }
            }, [endPageType]);
            const tip = React.useMemo(() => {
                switch (delayType) {
                    case 'start':
                        if (onPrev && flipToNext)
                            return '已到开头，继续翻页将跳至上一话';
                        break;
                    case 'end':
                        if (onNext && flipToNext)
                            return '已到结尾，继续翻页将跳至下一话';
                        if (onExit)
                            return '已到结尾，继续翻页将退出';
                        break;
                }
                return '';
            }, [onNext, onPrev, onExit, delayType, flipToNext]);
            return (jsxRuntime.jsxs("div", { ref: ref, className: classes$1.endPage, "data-show": endPageType, "data-type": delayType, onClick: handleClick, role: "button", tabIndex: -1, children: [jsxRuntime.jsx("p", { className: classes$1.tip, children: tip }), jsxRuntime.jsx("button", { className: onPrev ? undefined : classes$1.invisible, onClick: onPrev, type: "button", tabIndex: endPageType ? 0 : -1, children: "\\u4E0A\\u4E00\\u8BDD" }), jsxRuntime.jsx("button", { onClick: handleEnd, type: "button", tabIndex: endPageType ? 0 : -1, "data-is-end": true, children: "\\u9000\\u51FA" }), jsxRuntime.jsx("button", { className: onNext ? undefined : classes$1.invisible, onClick: onNext, type: "button", tabIndex: endPageType ? 0 : -1, children: "\\u4E0B\\u4E00\\u8BDD" })] }));
        };
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
            '--text_bg': '#121212',
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
            '--text_bg': '#FAFAFA',
        };
        const useCssVar = () => {
            const bg = useStore((state) => state.option.customBackground);
            const darkMode = useStore((state) => state.option.darkMode);
            return React.useMemo(() => ({
                '--bg': bg ?? (darkMode ? 'black' : 'white'),
                ...(darkMode ? dark : light),
            }), [bg, darkMode]);
        };
        /**
         * 漫画组件
         */
        const Manga = (props) => {
            const rootRef = useInit(props);
            const cssVar = useCssVar();
            const handleScroll = useStore((state) => state.handleScroll);
            const handleKeyUp = useStore((state) => state.handleKeyUp);
            React.useEffect(() => {
                rootRef.current?.focus();
            });
            return (jsxRuntime.jsxs("div", { className: classes$1.root, ref: rootRef, style: cssVar, onWheel: handleScroll, onKeyUp: handleKeyUp, role: "presentation", tabIndex: -1, children: [jsxRuntime.jsx(Toolbar, {}), jsxRuntime.jsx(ComicImgFlow, {}), jsxRuntime.jsx(Scrollbar, {}), jsxRuntime.jsx(TouchArea, {}), jsxRuntime.jsx(EndPage, {})] }));
        };
        exports.Manga = Manga;
        exports.buttonListDivider = buttonListDivider;
    };
    const selfModule = module.exports;
    module.exports = new Proxy(selfModule, {
        get(_, prop) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop];
        },
        apply(_, __, args) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop](...args);
        },
        construct(_, args) {
            if (selfModule[prop] === undefined)
                main();
            return new selfModule[prop](...args);
        },
    });
}(Manga, Manga.exports));

/** 为工具栏加上下载和退出按钮 */
const setToolbarButton = (draftProps) => {
    /** 下载按钮 */
    const DownloadButton = () => {
        const [tip, setTip] = React.useState('下载');
        const handleDownload = React.useCallback(async () => {
            const { imgList } = draftProps;
            const fileData = {};
            const imgIndexNum = \`\${imgList.length}\`.length;
            for (let i = 0; i < imgList.length; i += 1) {
                setTip(\`下载中 - \${i}/\${imgList.length}\`);
                const index = \`\${\`\${i}\`.padStart(imgIndexNum, '0')}\`;
                const fileExt = imgList[i].split('.').at(-1);
                const fileName = \`\${index}.\${fileExt}\`;
                try {
                    // eslint-disable-next-line no-await-in-loop
                    const data = await download(imgList[i], {
                        responseType: 'arraybuffer',
                    });
                    fileData[fileName] = new Uint8Array(data);
                }
                catch (error) {
                    reactToastify.toast.error(\`\${fileName} 下载失败\`);
                    fileData[\`\${index} - 下载失败.\${fileExt}\`] = new Uint8Array();
                }
            }
            setTip('开始打包');
            const zipped = fflate__default.default.zipSync(fileData, {
                level: 0,
                comment: window.location.href,
            });
            saveAs(new Blob([zipped]), \`\${document.title}.zip\`);
            setTip('下载完成');
        }, []);
        return (require$$0.jsx(IconButton.exports.IconButton, { tip: tip, onClick: handleDownload, children: require$$0.jsx(SvgFileDownload, {}) }));
    };
    const handleEnd = () => draftProps.onExit?.();
    draftProps.editButtonList = (list) => {
        // 在设置按钮上方放置下载按钮
        list.splice(-1, 0, ['下载', DownloadButton]);
        return [
            ...list,
            // 再在最下面添加分隔栏和退出按钮
            Manga.exports.buttonListDivider,
            [
                '退出',
                () => (require$$0.jsx(IconButton.exports.IconButton, { tip: "\\u9000\\u51FA", onClick: handleEnd, children: require$$0.jsx(SvgClose, {}) })),
            ],
        ];
    };
    return draftProps;
};

var _path$7;
function _extends$7() { _extends$7 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$7.apply(this, arguments); }
const SvgAutoFixHigh = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$7({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$7 || (_path$7 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "m20.45 6 .49-1.06L22 4.45a.5.5 0 0 0 0-.91l-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05c.17.39.73.39.9 0zM8.95 6l.49-1.06 1.06-.49a.5.5 0 0 0 0-.91l-1.06-.48L8.95 2a.492.492 0 0 0-.9 0l-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49L8.05 6c.17.39.73.39.9 0zm10.6 7.5-.49 1.06-1.06.49a.5.5 0 0 0 0 .91l1.06.49.49 1.06a.5.5 0 0 0 .91 0l.49-1.06 1.05-.5a.5.5 0 0 0 0-.91l-1.06-.49-.49-1.06c-.17-.38-.73-.38-.9.01zm-1.84-4.38-2.83-2.83a.996.996 0 0 0-1.41 0L2.29 17.46a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0L17.7 10.53c.4-.38.4-1.02.01-1.41zm-3.5 2.09L12.8 9.8l1.38-1.38 1.41 1.41-1.38 1.38z"
})));

var _path$6;
function _extends$6() { _extends$6 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$6.apply(this, arguments); }
const SvgAutoFixOff = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$6({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$6 || (_path$6 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "m22 3.55-1.06-.49L20.45 2a.5.5 0 0 0-.91 0l-.49 1.06-1.05.49a.5.5 0 0 0 0 .91l1.06.49.49 1.05a.5.5 0 0 0 .91 0l.49-1.06L22 4.45c.39-.17.39-.73 0-.9zm-7.83 4.87 1.41 1.41-1.46 1.46 1.41 1.41 2.17-2.17a.996.996 0 0 0 0-1.41l-2.83-2.83a.996.996 0 0 0-1.41 0l-2.17 2.17 1.41 1.41 1.47-1.45zM2.1 4.93l6.36 6.36-6.17 6.17a.996.996 0 0 0 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0l6.17-6.17 6.36 6.36a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42z"
})));

var _path$5;
function _extends$5() { _extends$5 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$5.apply(this, arguments); }
const SvgFlashOn = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$5({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$5 || (_path$5 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M7 3v9c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l5.19-8.9a.995.995 0 0 0-.86-1.5H13l2.49-6.65A.994.994 0 0 0 14.56 2H8c-.55 0-1 .45-1 1z"
})));

var _path$4;
function _extends$4() { _extends$4 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
const SvgFlashOff = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$4({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$4 || (_path$4 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M16.12 11.5a.995.995 0 0 0-.86-1.5h-1.87l2.28 2.28.45-.78zm.16-8.05c.33-.67-.15-1.45-.9-1.45H8c-.55 0-1 .45-1 1v.61l6.13 6.13 3.15-6.29zm2.16 14.43L4.12 3.56a.996.996 0 1 0-1.41 1.41L7 9.27V12c0 .55.45 1 1 1h2v7.15c0 .51.67.69.93.25l2.65-4.55 3.44 3.44c.39.39 1.02.39 1.41 0 .4-.39.4-1.02.01-1.41z"
})));

const defaultSpeedDial = (options, setOptions) => {
    const DefaultButton = ({ optionName, showName, children }) => {
        return (require$$0.jsx(IconButton.exports.IconButton, { tip: showName ?? optionName, placement: "left", onClick: () => setOptions({ ...options, [optionName]: !options[optionName] }), children: children ??
                (options[optionName] ? require$$0.jsx(SvgAutoFixHigh, {}) : require$$0.jsx(SvgAutoFixOff, {})) }));
    };
    const list = Object.keys(options).map((optionName) => {
        switch (optionName) {
            case 'hiddenFAB':
            case 'option':
                return null;
            case 'autoShow':
                return () => (require$$0.jsx(DefaultButton, { optionName: "autoShow", showName: "\\u81EA\\u52A8\\u8FDB\\u5165\\u9605\\u8BFB\\u6A21\\u5F0F", children: options.autoShow ? require$$0.jsx(SvgFlashOn, {}) : require$$0.jsx(SvgFlashOff, {}) }));
            default:
                return () => require$$0.jsx(DefaultButton, { optionName: optionName });
        }
    });
    return list.filter(Boolean);
};

const promisifyRequest = (request) => new Promise((resolve, reject) => {
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
    const useStore = (storeName, txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
    return {
        /** 存入数据 */
        set: (storeName, value) => useStore(storeName, 'readwrite', async (store) => {
            store.put(value);
            await promisifyRequest(store.transaction);
        }),
        /** 根据主键直接获取数据 */
        get: (storeName, query) => useStore(storeName, 'readonly', (store) => promisifyRequest(store.get(query))),
        /** 查找符合条件的数据 */
        find: (storeName, query, index) => useStore(storeName, 'readonly', (store) => promisifyRequest((index ? store.index(index) : store).getAll(query))),
        /** 删除符合条件的数据 */
        del: (storeName, query, index) => useStore(storeName, 'readwrite', async (store) => {
            if (index) {
                store.index(index).openCursor(query).onsuccess =
                    async function onsuccess() {
                        if (!this.result)
                            return;
                        await promisifyRequest(this.result.delete());
                        this.result.continue();
                    };
                await promisifyRequest(store.transaction);
            }
            else {
                store.delete(query);
                await promisifyRequest(store.transaction);
            }
        }),
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

const MangaStyle = ".index-module_img__1DxVP{display:none;height:100%;max-width:100%;object-fit:contain}.index-module_img__1DxVP[data-show]{display:unset}.index-module_img__1DxVP[data-load-type=error],.index-module_img__1DxVP[data-load-type=wait]{visibility:hidden}.index-module_img__1DxVP[data-fill=left]{transform:translate(50%)}.index-module_img__1DxVP[data-fill=right]{transform:translate(-50%)}.index-module_mangaFlow__Emsh7{align-items:center;background-color:var(--bg);color:var(--text);display:flex;height:100%;justify-content:center;user-select:none}.index-module_mangaFlow__Emsh7.index-module_disableZoom__SQnsB .index-module_img__1DxVP{height:unset;max-height:100%;object-fit:scale-down}.index-module_mangaFlow__Emsh7.index-module_scrollMode__vYIgd{flex-direction:column;justify-content:flex-start;overflow:auto;scrollbar-width:none}.index-module_mangaFlow__Emsh7.index-module_scrollMode__vYIgd::-webkit-scrollbar{display:none}.index-module_mangaFlow__Emsh7.index-module_scrollMode__vYIgd .index-module_img__1DxVP{height:auto;max-height:unset;max-width:100%}.index-module_mangaFlow__Emsh7[dir=ltr]{flex-direction:row}.index-module_endPage__JITNn{align-items:center;background-color:#3339;color:#fff;display:flex;height:100%;justify-content:center;left:0;opacity:0;pointer-events:none;position:absolute;top:0;transition:opacity .5s;width:100%;z-index:10}.index-module_endPage__JITNn>button{background-color:initial;border:0;color:inherit;cursor:pointer;font-size:1.2em}.index-module_endPage__JITNn>button[data-is-end]{font-size:3em;margin:2em}.index-module_endPage__JITNn>button:focus-visible{outline:none}.index-module_endPage__JITNn>.index-module_tip__710pO{margin:auto;position:absolute}.index-module_endPage__JITNn[data-show]{opacity:1;pointer-events:all}.index-module_endPage__JITNn[data-type=start]>.index-module_tip__710pO{transform:translateY(-40vh)}.index-module_endPage__JITNn[data-type=end]>.index-module_tip__710pO{transform:translateY(40vh)}.index-module_toolbar__0u69J{align-items:center;display:flex;height:100%;justify-content:flex-start;position:fixed;width:5vw;z-index:9}.index-module_toolbarPanel__tBbg4{display:flex;flex-direction:column;padding:1em 1em 1em .5em;transform:translateX(-100%);transition:transform .2s}.index-module_toolbar__0u69J[data-show=true] .index-module_toolbarPanel__tBbg4{transform:none}.index-module_SettingPanelPopper__liZDa{height:0!important;padding:0!important;transform:none!important}.index-module_SettingPanel__GQTbw{background-color:var(--page_bg);border-radius:.3em;bottom:0;box-shadow:0 3px 1px -2px #0003,0 2px 2px 0 #00000024,0 1px 5px 0 #0000001f;color:var(--text);font-size:1.2em;height:-moz-fit-content;height:fit-content;margin:auto;max-height:95vh;overflow:auto;position:fixed;scrollbar-width:none;top:0;width:15em}.index-module_SettingPanel__GQTbw::-webkit-scrollbar{display:none}.index-module_SettingBlock__Yw7Qr{padding:.5em}.index-module_SettingBlockSubtitle__LtLBn{color:var(--text_secondary);font-size:.7em;margin-bottom:-.3em}.index-module_SettingsItem__UcbhR{align-items:center;display:flex;justify-content:space-between;margin-top:1em}.index-module_SettingsItemName__dabYv{font-size:.9em}.index-module_SettingsItemSwitch__MON2V{align-items:center;background-color:var(--switch_bg);border:0;border-radius:1em;cursor:pointer;display:inline-flex;height:.8em;margin-right:.3em;padding:0;width:2.3em}.index-module_SettingsItemSwitchRound__O9-c9{background:var(--switch);border-radius:100%;box-shadow:0 2px 1px -1px #0003,0 1px 1px 0 #00000024,0 1px 3px 0 #0000001f;height:1.15em;transform:translateX(-10%);transition:transform .1s;width:1.15em}.index-module_SettingsItemSwitch__MON2V[data-checked=true]{background:var(--secondary_bg)}.index-module_SettingsItemSwitch__MON2V[data-checked=true] .index-module_SettingsItemSwitchRound__O9-c9{background:var(--secondary);transform:translateX(110%)}.index-module_SettingsItemIconButton__nTP1V{background-color:initial;border:none;color:var(--text);cursor:pointer;font-size:1.7em;height:1em;margin:0;padding:0;position:absolute;right:.7em}.index-module_closeCover__HRd50{height:100%;left:0;position:fixed;top:0;width:100%;z-index:-1}.index-module_scrollbar__wUmnU{border-left:10em solid #0000;display:flex;flex-direction:column;height:98%;outline:none;position:absolute;right:3px;top:1%;touch-action:none;user-select:none;width:5px;z-index:9}.index-module_scrollbar__wUmnU>div{display:flex;flex-direction:column;flex-grow:1;pointer-events:none}.index-module_scrollbarDrag__wX5Be{background-color:var(--scrollbar_drag);border-radius:1em;justify-content:center;opacity:0;position:absolute;transition:top .15s;width:100%;z-index:1}.index-module_scrollbarPage__d2B2h{flex-grow:1;transform:scaleY(1);transform-origin:bottom;transition:transform 1s,background-color 0ms 1s}.index-module_scrollbarPage__d2B2h[data-type=loaded]{transform:scaleY(0)}.index-module_scrollbarPage__d2B2h[data-type=loading]{background-color:var(--secondary)}.index-module_scrollbarPage__d2B2h[data-type=wait]{background-color:var(--secondary);opacity:.5}.index-module_scrollbarPage__d2B2h[data-type=error]{background-color:#f005}.index-module_scrollbarPoper__c5XwM{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;line-height:1.5em;opacity:0;padding:.2em .5em;position:absolute;right:2em;text-align:center;transition:opacity .15s;white-space:pre;width:-moz-fit-content;width:fit-content}.index-module_scrollbarPoper__c5XwM:after{background-color:#303030;background-color:initial;border:.4em solid #0000;border-left:.5em solid #303030;content:\\"\\";left:100%;position:absolute}.index-module_scrollbarDrag__wX5Be[data-show=true],.index-module_scrollbarPoper__c5XwM[data-show=true],.index-module_scrollbar__wUmnU:hover .index-module_scrollbarDrag__wX5Be,.index-module_scrollbar__wUmnU:hover .index-module_scrollbarPoper__c5XwM{opacity:1}.index-module_touchAreaRoot__XPLTA{color:#0000;display:flex;font-size:3em;height:100%;position:absolute;top:0;user-select:none;width:100%}.index-module_touchArea__d6T8h{align-items:center;display:flex;flex-grow:1;justify-content:center;outline:none;writing-mode:vertical-rl;z-index:1}.index-module_touchArea__d6T8h[data-area=menu]{flex-basis:0}.index-module_touchAreaRoot__XPLTA[data-show=true] .index-module_touchArea__d6T8h{color:#fff}.index-module_touchAreaRoot__XPLTA[data-show=true] .index-module_touchArea__d6T8h[data-area=prev]{background-color:#95e1d3e6}.index-module_touchAreaRoot__XPLTA[data-show=true] .index-module_touchArea__d6T8h[data-area=menu]{background-color:#fce38ae6}.index-module_touchAreaRoot__XPLTA[data-show=true] .index-module_touchArea__d6T8h[data-area=next]{background-color:#f38181e6}.index-module_hidden__gZmTY{display:none}.index-module_invisible__HuqQw{visibility:hidden}.index-module_opacity1__4O7y-{opacity:1}.index-module_opacity0__93ym1{opacity:0}.index-module_root__dkTnB{height:100%;outline:0;overflow:hidden;position:relative;width:100%}a{color:var(--text_secondary)}\\n.index-module_iconButtonItem__jb7BZ{align-items:center;display:flex;position:relative}.index-module_iconButton__-XHmw{align-items:center;background-color:var(--text_bg,#121212);border-radius:9999px;border-style:none;color:var(--text,#fff);cursor:pointer;display:flex;font-size:1.5em;height:1.5em;justify-content:center;margin:.1em;outline:none;padding:0;width:1.5em}.index-module_iconButton__-XHmw:focus,.index-module_iconButton__-XHmw:hover{background-color:var(--hover_bg_color,#fff3)}.index-module_iconButton__-XHmw.index-module_enabled__NKlE9{background-color:var(--text,#fff);color:var(--text_bg,#121212)}.index-module_iconButton__-XHmw.index-module_enabled__NKlE9:focus,.index-module_iconButton__-XHmw.index-module_enabled__NKlE9:hover{background-color:var(--hover_bg_color_enable,#fffa)}.index-module_iconButtonPopper__vhloV{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;opacity:0;padding:.4em .5em;position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap}.index-module_iconButtonPopper__vhloV[data-placement=right]{left:calc(100% + 1.5em)}.index-module_iconButtonPopper__vhloV[data-placement=right]:before{border-right-color:var(--switch_bg,#6e6e6e);border-right-width:.5em;right:calc(100% + .5em)}.index-module_iconButtonPopper__vhloV[data-placement=left]{right:calc(100% + 1.5em)}.index-module_iconButtonPopper__vhloV[data-placement=left]:before{border-left-color:var(--switch_bg,#6e6e6e);border-left-width:.5em;left:calc(100% + .5em)}.index-module_iconButtonPopper__vhloV:before{background-color:initial;border:.4em solid #0000;content:\\"\\";position:absolute;transition:opacity .15s}.index-module_iconButtonItem__jb7BZ:focus .index-module_iconButtonPopper__vhloV,.index-module_iconButtonItem__jb7BZ:hover .index-module_iconButtonPopper__vhloV,.index-module_iconButtonItem__jb7BZ[data-show=true] .index-module_iconButtonPopper__vhloV{opacity:1}.index-module_hidden__jOPaw{display:none}";

const IconBottonStyle = ".index-module_iconButtonItem__jb7BZ{align-items:center;display:flex;position:relative}.index-module_iconButton__-XHmw{align-items:center;background-color:var(--text_bg,#121212);border-radius:9999px;border-style:none;color:var(--text,#fff);cursor:pointer;display:flex;font-size:1.5em;height:1.5em;justify-content:center;margin:.1em;outline:none;padding:0;width:1.5em}.index-module_iconButton__-XHmw:focus,.index-module_iconButton__-XHmw:hover{background-color:var(--hover_bg_color,#fff3)}.index-module_iconButton__-XHmw.index-module_enabled__NKlE9{background-color:var(--text,#fff);color:var(--text_bg,#121212)}.index-module_iconButton__-XHmw.index-module_enabled__NKlE9:focus,.index-module_iconButton__-XHmw.index-module_enabled__NKlE9:hover{background-color:var(--hover_bg_color_enable,#fffa)}.index-module_iconButtonPopper__vhloV{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:flex;font-size:.8em;opacity:0;padding:.4em .5em;position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap}.index-module_iconButtonPopper__vhloV[data-placement=right]{left:calc(100% + 1.5em)}.index-module_iconButtonPopper__vhloV[data-placement=right]:before{border-right-color:var(--switch_bg,#6e6e6e);border-right-width:.5em;right:calc(100% + .5em)}.index-module_iconButtonPopper__vhloV[data-placement=left]{right:calc(100% + 1.5em)}.index-module_iconButtonPopper__vhloV[data-placement=left]:before{border-left-color:var(--switch_bg,#6e6e6e);border-left-width:.5em;left:calc(100% + .5em)}.index-module_iconButtonPopper__vhloV:before{background-color:initial;border:.4em solid #0000;content:\\"\\";position:absolute;transition:opacity .15s}.index-module_iconButtonItem__jb7BZ:focus .index-module_iconButtonPopper__vhloV,.index-module_iconButtonItem__jb7BZ:hover .index-module_iconButtonPopper__vhloV,.index-module_iconButtonItem__jb7BZ[data-show=true] .index-module_iconButtonPopper__vhloV{opacity:1}.index-module_hidden__jOPaw{display:none}";

/**
 * 显示漫画阅读窗口
 */
const useManga = async (initProps) => {
    const [root, dom] = useComponentsRoot('comicRead');
    await GM.addStyle(\`
    #comicRead > div {
      position: fixed;
      z-index: 999999999;
      top: 0;
      left: 0;

      width: 100vw;
      height: 100vh;

      font-size: 16px;

      opacity: 1;

      transition: opacity 300ms, transform 100ms;
    }

    #comicRead.hidden > div {
      transform: scale(0);

      opacity: 0;

      transition: opacity 300ms, transform 0s 300ms;
    }
  \`);
    const props = { imgList: [], show: false, ...initProps };
    const set = (recipe, render = true) => {
        if (recipe) {
            Object.assign(props, typeof recipe === 'function' ? recipe(props) : recipe);
        }
        if (!render)
            return;
        root.render(require$$0.jsxs(shadow__default.default.div, { children: [require$$0.jsx(Manga.exports.Manga, { ...props }), require$$0.jsx("style", { type: "text/css", children: IconBottonStyle }), require$$0.jsx("style", { type: "text/css", children: MangaStyle })] }));
        if (props.imgList.length > 1 && props.show) {
            dom.className = '';
            document.documentElement.style.overflow = 'hidden';
        }
        else {
            dom.className = 'hidden';
            document.documentElement.style.overflow = 'unset';
        }
    };
    props.onExit = () => {
        set({ show: false });
    };
    return [set, props];
};

var _path$3, _path2;
function _extends$3() { _extends$3 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
const SvgMenuBook = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$3({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$3 || (_path$3 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79zM21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98v9.47z"
})), _path2 || (_path2 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.7-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03z"
})));

var _path$2;
function _extends$2() { _extends$2 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
const SvgImageSearch = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$2({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$2 || (_path$2 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M18 15v4c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h3.02c.55 0 1-.45 1-1s-.45-1-1-1H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1s-1 .45-1 1zm-2.5 3H6.52c-.42 0-.65-.48-.39-.81l1.74-2.23a.5.5 0 0 1 .78-.01l1.56 1.88 2.35-3.02c.2-.26.6-.26.79.01l2.55 3.39c.25.32.01.79-.4.79zm3.8-9.11c.48-.77.75-1.67.69-2.66-.13-2.15-1.84-3.97-3.97-4.2A4.5 4.5 0 0 0 11 6.5c0 2.49 2.01 4.5 4.49 4.5.88 0 1.7-.26 2.39-.7l2.41 2.41c.39.39 1.03.39 1.42 0 .39-.39.39-1.03 0-1.42l-2.41-2.4zM15.5 9a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"
})));

var _path$1;
function _extends$1() { _extends$1 = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
const SvgImportContacts = props => /*#__PURE__*/React__namespace.createElement("svg", _extends$1({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path$1 || (_path$1 = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79zM21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98v9.47z"
})));

var _path;
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SvgCloudDownload = props => /*#__PURE__*/React__namespace.createElement("svg", _extends({
  xmlns: "http://www.w3.org/2000/svg",
  width: "1em",
  height: "1em",
  viewBox: "0 0 24 24",
  role: "img",
  stroke: "currentColor",
  fill: "currentColor",
  strokeWidth: "0"
}, props), _path || (_path = /*#__PURE__*/React__namespace.createElement("path", {
  d: "M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z"
})));

var Fab = {exports: {}};

(function (module, exports) {
    Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: 'Module' } });
    const main = () => {
        const jsxRuntime = require$$0__default.default;
        const React = React__default.default;
        function _interopNamespace(e) {
            if (e && e.__esModule)
                return e;
            const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
            if (e) {
                for (const k in e) {
                    if (k !== 'default') {
                        const d = Object.getOwnPropertyDescriptor(e, k);
                        Object.defineProperty(n, k, d.get ? d : {
                            enumerable: true,
                            get: () => e[k]
                        });
                    }
                }
            }
            n.default = e;
            return Object.freeze(n);
        }
        const React__namespace = /*#__PURE__*/ _interopNamespace(React);
        var _path, _path2;
        function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        } return target; }; return _extends.apply(this, arguments); }
        const SvgMenuBook = props => /*#__PURE__*/ React__namespace.createElement("svg", _extends({
            xmlns: "http://www.w3.org/2000/svg",
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            role: "img",
            stroke: "currentColor",
            fill: "currentColor",
            strokeWidth: "0"
        }, props), _path || (_path = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M17.5 4.5c-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5-1.45 0-2.99.22-4.28.79C1.49 5.62 1 6.33 1 7.14v11.28c0 1.3 1.22 2.26 2.48 1.94.98-.25 2.02-.36 3.02-.36 1.56 0 3.22.26 4.56.92.6.3 1.28.3 1.87 0 1.34-.67 3-.92 4.56-.92 1 0 2.04.11 3.02.36 1.26.33 2.48-.63 2.48-1.94V7.14c0-.81-.49-1.52-1.22-1.85-1.28-.57-2.82-.79-4.27-.79zM21 17.23c0 .63-.58 1.09-1.2.98-.75-.14-1.53-.2-2.3-.2-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5.92 0 1.83.09 2.7.28.46.1.8.51.8.98v9.47z"
        })), _path2 || (_path2 = /*#__PURE__*/ React__namespace.createElement("path", {
            d: "M13.98 11.01c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.54-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39-.08.01-.16.03-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.71-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03zm0 2.66c-.32 0-.61-.2-.71-.52-.13-.39.09-.82.48-.94 1.53-.5 3.53-.66 5.36-.45.41.05.71.42.66.83-.05.41-.42.7-.83.66-1.62-.19-3.39-.04-4.73.39a.97.97 0 0 1-.23.03z"
        })));
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
        function throttle(delay, callback, options) {
            var _ref = options || {}, _ref$noTrailing = _ref.noTrailing, noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing, _ref$noLeading = _ref.noLeading, noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading, _ref$debounceMode = _ref.debounceMode, debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
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
                var _ref2 = options || {}, _ref2$upcomingOnly = _ref2.upcomingOnly, upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;
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
                    }
                    else {
                        /*
                         * In throttle mode without noLeading, if \`delay\` time has been exceeded, execute
                         * \`callback\`.
                         */
                        exec();
                    }
                }
                else if (noTrailing !== true) {
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
        const classes = { "fabRoot": "index-module_fabRoot__AUYw8", "fab": "index-module_fab__Uuak2", "progress": "index-module_progress__ffT7T", "popper": "index-module_popper__K0axO", "speedDial": "index-module_speedDial__RP62p", "speedDialItem": "index-module_speedDialItem__8j9Tj", "backdrop": "index-module_backdrop__IcRxK" };
        /**
         * Fab 按钮
         */
        const Fab = ({ progress = 0, tip, speedDial, show: forceShow, initShow = true, autoTrans = false, focus, children, style, onClick, onBackdropClick, }) => {
            // 上次滚动位置
            const lastY = React.useRef(window.pageYOffset);
            const [show, setShow] = React.useState(initShow);
            // 绑定滚动事件
            React.useEffect(() => {
                window.addEventListener('scroll', throttle(200, (e) => {
                    // 跳过非用户操作的滚动
                    if (e.isTrusted === false)
                        return;
                    if (window.pageYOffset === lastY.current)
                        return;
                    setShow(
                    // 滚动到底部时显示
                    window.pageYOffset + window.innerHeight >=
                        document.body.scrollHeight ||
                        // 向上滚动时显示，反之隐藏
                        window.pageYOffset - lastY.current < 0);
                    lastY.current = window.pageYOffset;
                }));
            }, []);
            // 将 forceShow 的变化同步到 show 上
            React.useEffect(() => {
                if (forceShow)
                    setShow(forceShow);
            }, [forceShow]);
            const handleClick = React.useCallback(() => {
                onClick?.();
            }, [onClick]);
            const handleBackdropClick = React.useCallback(() => {
                onBackdropClick?.();
            }, [onBackdropClick]);
            return (jsxRuntime.jsxs("div", { className: classes.fabRoot, style: style, "data-show": forceShow ?? show, "data-trans": autoTrans, "data-focus": focus, children: [jsxRuntime.jsxs("button", { type: "button", className: classes.fab, onClick: handleClick, children: [children ?? jsxRuntime.jsx(SvgMenuBook, {}), jsxRuntime.jsx("span", { className: classes.progress, role: "progressbar", "aria-valuenow": progress, children: jsxRuntime.jsx("svg", { viewBox: "22 22 44 44", style: { strokeDashoffset: \`\${(1 - progress) * 290}%\` }, children: jsxRuntime.jsx("circle", { cx: "44", cy: "44", r: "20.2", fill: "none", strokeWidth: "3.6" }) }) }), tip ? jsxRuntime.jsx("div", { className: classes.popper, children: tip }) : null] }), speedDial?.length ? (jsxRuntime.jsxs("div", { className: classes.speedDial, children: [jsxRuntime.jsx("div", { className: classes.backdrop, onClick: handleBackdropClick }), speedDial?.map((SpeedDialItem, i) => (jsxRuntime.jsx("div", { className: classes.speedDialItem, style: {
                                    '--show-delay': \`\${i * 30}ms\`,
                                    '--hide-delay': \`\${(speedDial.length - 1 - i) * 50}ms\`,
                                }, "data-i": i * 30, children: jsxRuntime.jsx(SpeedDialItem, {}) }, i)))] })) : null] }));
        };
        exports.Fab = Fab;
    };
    const selfModule = module.exports;
    module.exports = new Proxy(selfModule, {
        get(_, prop) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop];
        },
        apply(_, __, args) {
            if (selfModule[prop] === undefined)
                main();
            return selfModule[prop](...args);
        },
        construct(_, args) {
            if (selfModule[prop] === undefined)
                main();
            return new selfModule[prop](...args);
        },
    });
}(Fab, Fab.exports));

const FabStyle = ".index-module_fabRoot__AUYw8{font-size:1.1em;transition:transform .2s}.index-module_fabRoot__AUYw8[data-show=false]{transform:scale(0)}.index-module_fabRoot__AUYw8[data-trans=true]{opacity:.8}.index-module_fabRoot__AUYw8[data-trans=true]:focus,.index-module_fabRoot__AUYw8[data-trans=true]:hover{opacity:1}.index-module_fab__Uuak2{align-items:center;background-color:var(--fab,#607d8b);border:none;border-radius:100%;box-shadow:0 3px 5px -1px #0003,0 6px 10px 0 #00000024,0 1px 18px 0 #0000001f;color:#fff;cursor:pointer;display:flex;font-size:1em;height:3.6em;justify-content:center;width:3.6em}.index-module_fab__Uuak2>svg{font-size:1.5em}.index-module_fab__Uuak2:hover{background-color:var(--fab_hover,#78909c)}.index-module_progress__ffT7T{color:#b0bec5;display:inline-block;height:100%;position:absolute;transform:rotate(-90deg);transition:transform .3s cubic-bezier(.4,0,.2,1) 0ms;width:100%}.index-module_progress__ffT7T>svg{stroke:currentcolor;stroke-dasharray:290%;stroke-dashoffset:100%;stroke-linecap:round;transition:stroke-dashoffset .3s cubic-bezier(.4,0,.2,1) 0ms}.index-module_progress__ffT7T:hover{color:#cfd8dc}.index-module_progress__ffT7T[aria-valuenow=\\"1\\"]{opacity:0;transition:opacity .2s .15s}.index-module_popper__K0axO{align-items:center;background-color:#303030;border-radius:.3em;color:#fff;display:none;font-size:.8em;padding:.4em .5em;position:absolute;right:calc(100% + 1.5em);top:50%;transform:translateY(-50%);white-space:nowrap}:is(.index-module_fab__Uuak2:hover,.index-module_fabRoot__AUYw8[data-focus=true]) .index-module_popper__K0axO{display:flex}.index-module_speedDial__RP62p{align-items:center;bottom:0;display:flex;flex-direction:column-reverse;font-size:1.1em;padding-bottom:120%;pointer-events:none;position:absolute;width:100%;z-index:-1}.index-module_speedDialItem__8j9Tj{margin:.1em 0;opacity:0;transform:scale(0);transition-delay:var(--hide-delay);transition-duration:.23s;transition-property:transform,opacity}.index-module_speedDial__RP62p:hover,:is(.index-module_fabRoot__AUYw8:hover,.index-module_fabRoot__AUYw8[data-focus=true])>.index-module_speedDial__RP62p{pointer-events:all}:is(.index-module_fabRoot__AUYw8:hover,.index-module_fabRoot__AUYw8[data-focus=true])>.index-module_speedDial__RP62p>.index-module_speedDialItem__8j9Tj{opacity:unset;transform:unset;transition-delay:var(--show-delay)}.index-module_backdrop__IcRxK{background:#000;height:100vh;left:0;opacity:0;position:fixed;top:0;transition:opacity .5s;width:100vw}:is(.index-module_fabRoot__AUYw8:hover,.index-module_fabRoot__AUYw8[data-focus=true],.index-module_speedDial__RP62p:hover) .index-module_backdrop__IcRxK{opacity:.4}";

const useFab = async (initProps) => {
    const [root] = useComponentsRoot('fab');
    await GM.addStyle(\`
    #fab > div {
      --text_bg: transparent;

      position: fixed;
      z-index: 999999999;
      right: 3vw;
      bottom: 6vh;

      font-size: clamp(12px, 1.5vw, 16px);
    }
  \`);
    const props = { ...initProps };
    const FabIcon = () => {
        switch (props.progress) {
            case undefined:
                // 没有内容的书
                return require$$0.jsx(SvgImportContacts, {});
            case 1:
            case 2:
                // 有内容的书
                return require$$0.jsx(SvgMenuBook, {});
            default:
                return props.progress > 1 ? require$$0.jsx(SvgCloudDownload, {}) : require$$0.jsx(SvgImageSearch, {});
        }
    };
    const set = (recipe) => {
        if (recipe) {
            Object.assign(props, typeof recipe === 'function' ? recipe(props) : recipe);
        }
        root.render(require$$0.jsxs(shadow__default.default.div, { children: [require$$0.jsx(Fab.exports.Fab, { ...props, children: props.children ?? require$$0.jsx(FabIcon, {}) }), require$$0.jsx("style", { type: "text/css", children: IconBottonStyle }), require$$0.jsx("style", { type: "text/css", children: FabStyle })] }));
    };
    return set;
};

const ToastStyle = ":root{--toastify-color-light:#fff;--toastify-color-dark:#121212;--toastify-color-info:#3498db;--toastify-color-success:#07bc0c;--toastify-color-warning:#f1c40f;--toastify-color-error:#e74c3c;--toastify-color-transparent:hsla(0,0%,100%,.7);--toastify-icon-color-info:var(--toastify-color-info);--toastify-icon-color-success:var(--toastify-color-success);--toastify-icon-color-warning:var(--toastify-color-warning);--toastify-icon-color-error:var(--toastify-color-error);--toastify-toast-width:320px;--toastify-toast-background:#fff;--toastify-toast-min-height:64px;--toastify-toast-max-height:800px;--toastify-font-family:sans-serif;--toastify-z-index:9999;--toastify-text-color-light:#757575;--toastify-text-color-dark:#fff;--toastify-text-color-info:#fff;--toastify-text-color-success:#fff;--toastify-text-color-warning:#fff;--toastify-text-color-error:#fff;--toastify-spinner-color:#616161;--toastify-spinner-color-empty-area:#e0e0e0;--toastify-color-progress-light:linear-gradient(90deg,#4cd964,#5ac8fa,#007aff,#34aadc,#5856d6,#ff2d55);--toastify-color-progress-dark:#bb86fc;--toastify-color-progress-info:var(--toastify-color-info);--toastify-color-progress-success:var(--toastify-color-success);--toastify-color-progress-warning:var(--toastify-color-warning);--toastify-color-progress-error:var(--toastify-color-error)}.Toastify__toast-container{z-index:var(--toastify-z-index);-webkit-transform:translateZ(var(--toastify-z-index));position:fixed;padding:4px;width:var(--toastify-toast-width);box-sizing:border-box;color:#fff}.Toastify__toast-container--top-left{top:1em;left:1em}.Toastify__toast-container--top-center{top:1em;left:50%;transform:translateX(-50%)}.Toastify__toast-container--top-right{top:1em;right:1em}.Toastify__toast-container--bottom-left{bottom:1em;left:1em}.Toastify__toast-container--bottom-center{bottom:1em;left:50%;transform:translateX(-50%)}.Toastify__toast-container--bottom-right{bottom:1em;right:1em}@media only screen and (max-width:480px){.Toastify__toast-container{width:100vw;padding:0;left:0;margin:0}.Toastify__toast-container--top-center,.Toastify__toast-container--top-left,.Toastify__toast-container--top-right{top:0;transform:translateX(0)}.Toastify__toast-container--bottom-center,.Toastify__toast-container--bottom-left,.Toastify__toast-container--bottom-right{bottom:0;transform:translateX(0)}.Toastify__toast-container--rtl{right:0;left:auto}}.Toastify__toast{position:relative;min-height:var(--toastify-toast-min-height);box-sizing:border-box;margin-bottom:1rem;padding:8px;border-radius:4px;box-shadow:0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05);display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;max-height:var(--toastify-toast-max-height);overflow:hidden;font-family:var(--toastify-font-family);cursor:pointer;direction:ltr;z-index:0}.Toastify__toast--rtl{direction:rtl}.Toastify__toast-body{margin:auto 0;-ms-flex:1 1 auto;flex:1 1 auto;padding:6px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center}.Toastify__toast-body>div:last-child{-ms-flex:1;flex:1}.Toastify__toast-icon{-webkit-margin-end:10px;margin-inline-end:10px;width:20px;-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex}.Toastify--animate{animation-fill-mode:both;animation-duration:.7s}.Toastify--animate-icon{animation-fill-mode:both;animation-duration:.3s}@media only screen and (max-width:480px){.Toastify__toast{margin-bottom:0;border-radius:0}}.Toastify__toast-theme--dark{background:var(--toastify-color-dark);color:var(--toastify-text-color-dark)}.Toastify__toast-theme--colored.Toastify__toast--default,.Toastify__toast-theme--light{background:var(--toastify-color-light);color:var(--toastify-text-color-light)}.Toastify__toast-theme--colored.Toastify__toast--info{color:var(--toastify-text-color-info);background:var(--toastify-color-info)}.Toastify__toast-theme--colored.Toastify__toast--success{color:var(--toastify-text-color-success);background:var(--toastify-color-success)}.Toastify__toast-theme--colored.Toastify__toast--warning{color:var(--toastify-text-color-warning);background:var(--toastify-color-warning)}.Toastify__toast-theme--colored.Toastify__toast--error{color:var(--toastify-text-color-error);background:var(--toastify-color-error)}.Toastify__progress-bar-theme--light{background:var(--toastify-color-progress-light)}.Toastify__progress-bar-theme--dark{background:var(--toastify-color-progress-dark)}.Toastify__progress-bar--info{background:var(--toastify-color-progress-info)}.Toastify__progress-bar--success{background:var(--toastify-color-progress-success)}.Toastify__progress-bar--warning{background:var(--toastify-color-progress-warning)}.Toastify__progress-bar--error{background:var(--toastify-color-progress-error)}.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning{background:var(--toastify-color-transparent)}.Toastify__close-button{color:#fff;background:transparent;outline:none;border:none;padding:0;cursor:pointer;opacity:.7;transition:.3s ease;-ms-flex-item-align:start;align-self:flex-start}.Toastify__close-button--light{color:#000;opacity:.3}.Toastify__close-button>svg{fill:currentColor;height:16px;width:14px}.Toastify__close-button:focus,.Toastify__close-button:hover{opacity:1}@keyframes Toastify__trackProgress{0%{transform:scaleX(1)}to{transform:scaleX(0)}}.Toastify__progress-bar{position:absolute;bottom:0;left:0;width:100%;height:5px;z-index:var(--toastify-z-index);opacity:.7;transform-origin:left}.Toastify__progress-bar--animated{animation:Toastify__trackProgress linear 1 forwards}.Toastify__progress-bar--controlled{transition:transform .2s}.Toastify__progress-bar--rtl{right:0;left:auto;transform-origin:right}.Toastify__spinner{width:20px;height:20px;box-sizing:border-box;border:2px solid;border-radius:100%;border-color:var(--toastify-spinner-color-empty-area);border-right-color:var(--toastify-spinner-color);animation:Toastify__spin .65s linear infinite}@keyframes Toastify__bounceInRight{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(3000px,0,0)}60%{opacity:1;transform:translate3d(-25px,0,0)}75%{transform:translate3d(10px,0,0)}90%{transform:translate3d(-5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutRight{20%{opacity:1;transform:translate3d(-20px,0,0)}to{opacity:0;transform:translate3d(2000px,0,0)}}@keyframes Toastify__bounceInLeft{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(-3000px,0,0)}60%{opacity:1;transform:translate3d(25px,0,0)}75%{transform:translate3d(-10px,0,0)}90%{transform:translate3d(5px,0,0)}to{transform:none}}@keyframes Toastify__bounceOutLeft{20%{opacity:1;transform:translate3d(20px,0,0)}to{opacity:0;transform:translate3d(-2000px,0,0)}}@keyframes Toastify__bounceInUp{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,3000px,0)}60%{opacity:1;transform:translate3d(0,-20px,0)}75%{transform:translate3d(0,10px,0)}90%{transform:translate3d(0,-5px,0)}to{transform:translateZ(0)}}@keyframes Toastify__bounceOutUp{20%{transform:translate3d(0,-10px,0)}40%,45%{opacity:1;transform:translate3d(0,20px,0)}to{opacity:0;transform:translate3d(0,-2000px,0)}}@keyframes Toastify__bounceInDown{0%,60%,75%,90%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:translate3d(0,-3000px,0)}60%{opacity:1;transform:translate3d(0,25px,0)}75%{transform:translate3d(0,-10px,0)}90%{transform:translate3d(0,5px,0)}to{transform:none}}@keyframes Toastify__bounceOutDown{20%{transform:translate3d(0,10px,0)}40%,45%{opacity:1;transform:translate3d(0,-20px,0)}to{opacity:0;transform:translate3d(0,2000px,0)}}.Toastify__bounce-enter--bottom-left,.Toastify__bounce-enter--top-left{animation-name:Toastify__bounceInLeft}.Toastify__bounce-enter--bottom-right,.Toastify__bounce-enter--top-right{animation-name:Toastify__bounceInRight}.Toastify__bounce-enter--top-center{animation-name:Toastify__bounceInDown}.Toastify__bounce-enter--bottom-center{animation-name:Toastify__bounceInUp}.Toastify__bounce-exit--bottom-left,.Toastify__bounce-exit--top-left{animation-name:Toastify__bounceOutLeft}.Toastify__bounce-exit--bottom-right,.Toastify__bounce-exit--top-right{animation-name:Toastify__bounceOutRight}.Toastify__bounce-exit--top-center{animation-name:Toastify__bounceOutUp}.Toastify__bounce-exit--bottom-center{animation-name:Toastify__bounceOutDown}@keyframes Toastify__zoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes Toastify__zoomOut{0%{opacity:1}50%{opacity:0;transform:scale3d(.3,.3,.3)}to{opacity:0}}.Toastify__zoom-enter{animation-name:Toastify__zoomIn}.Toastify__zoom-exit{animation-name:Toastify__zoomOut}@keyframes Toastify__flipIn{0%{transform:perspective(400px) rotateX(90deg);animation-timing-function:ease-in;opacity:0}40%{transform:perspective(400px) rotateX(-20deg);animation-timing-function:ease-in}60%{transform:perspective(400px) rotateX(10deg);opacity:1}80%{transform:perspective(400px) rotateX(-5deg)}to{transform:perspective(400px)}}@keyframes Toastify__flipOut{0%{transform:perspective(400px)}30%{transform:perspective(400px) rotateX(-20deg);opacity:1}to{transform:perspective(400px) rotateX(90deg);opacity:0}}.Toastify__flip-enter{animation-name:Toastify__flipIn}.Toastify__flip-exit{animation-name:Toastify__flipOut}@keyframes Toastify__slideInRight{0%{transform:translate3d(110%,0,0);visibility:visible}to{transform:translateZ(0)}}@keyframes Toastify__slideInLeft{0%{transform:translate3d(-110%,0,0);visibility:visible}to{transform:translateZ(0)}}@keyframes Toastify__slideInUp{0%{transform:translate3d(0,110%,0);visibility:visible}to{transform:translateZ(0)}}@keyframes Toastify__slideInDown{0%{transform:translate3d(0,-110%,0);visibility:visible}to{transform:translateZ(0)}}@keyframes Toastify__slideOutRight{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(110%,0,0)}}@keyframes Toastify__slideOutLeft{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(-110%,0,0)}}@keyframes Toastify__slideOutDown{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(0,500px,0)}}@keyframes Toastify__slideOutUp{0%{transform:translateZ(0)}to{visibility:hidden;transform:translate3d(0,-500px,0)}}.Toastify__slide-enter--bottom-left,.Toastify__slide-enter--top-left{animation-name:Toastify__slideInLeft}.Toastify__slide-enter--bottom-right,.Toastify__slide-enter--top-right{animation-name:Toastify__slideInRight}.Toastify__slide-enter--top-center{animation-name:Toastify__slideInDown}.Toastify__slide-enter--bottom-center{animation-name:Toastify__slideInUp}.Toastify__slide-exit--bottom-left,.Toastify__slide-exit--top-left{animation-name:Toastify__slideOutLeft}.Toastify__slide-exit--bottom-right,.Toastify__slide-exit--top-right{animation-name:Toastify__slideOutRight}.Toastify__slide-exit--top-center{animation-name:Toastify__slideOutUp}.Toastify__slide-exit--bottom-center{animation-name:Toastify__slideOutDown}@keyframes Toastify__spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}";

const useToast = () => {
    const [root] = useComponentsRoot('toast');
    const toastFunc = (text, options) => {
        root.render(require$$0.jsxs(shadow__default.default.div, { style: { fontSize: 16 }, children: [require$$0.jsx(reactToastify.ToastContainer, { autoClose: 1000 * 3, style: {
                        // 进度条颜色
                        '--toastify-color-progress-light': '#7A909A',
                        // 背景色
                        '--toastify-color-light': 'white',
                    } }), require$$0.jsxs("style", { type: "text/css", children: [ToastStyle.replace(':root', '.Toastify'), \`
            h2 {
              font-size: 1.1em;
              margin: 0;
              margin-bottom: 1em;
            }
            .md {
              text-align: left;
            }
            .md ul, .md h2 {
              margin:0;
              margin-bottom: .5em;
              font-size: 1em;
            }
          \`] })] }));
        reactToastify.toast(text, { ...options });
    };
    toastFunc.info = (text, options) => toastFunc(text, { ...options, type: 'info' });
    toastFunc.error = (text, options) => toastFunc(text, { ...options, type: 'error' });
    toastFunc.warn = (text, options) => toastFunc(text, { ...options, type: 'warning' });
    toastFunc.success = (text, options) => toastFunc(text, { ...options, type: 'success' });
    return toastFunc;
};

/**
 * 对修改站点配置的相关方法的封装
 *
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useSiteOptions = async (name, defaultOptions = {}) => {
    const rawValue = await GM.getValue(name);
    const options = Object.assign({
        option: undefined,
        autoShow: true,
        hiddenFAB: false,
        ...defaultOptions,
    }, rawValue);
    const changeCallbackList = [];
    return {
        options,
        /** 该站点是否有储存配置 */
        isRecorded: rawValue !== undefined,
        /**
         * 设置新 Option
         *
         * @param newValue newValue
         * @param trigger 是否触发变更事件
         */
        setOptions: async (newValue, trigger = true) => {
            Object.assign(options, newValue);
            await GM.setValue(name, options);
            if (trigger)
                await Promise.all(changeCallbackList.map((callback) => callback(options)));
        },
        /**
         * 监听配置变更事件
         */
        onOptionChange: (callback) => {
            changeCallbackList.push(callback);
        },
    };
};

/**
 * 对三个样式组件和 useSiteOptions 的默认值进行封装
 *
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
const useInit = async (name, defaultOptions = {}) => {
    const { options, setOptions, onOptionChange } = await useSiteOptions(name, defaultOptions);
    const setFab = await useFab({
        tip: '阅读模式',
        speedDial: defaultSpeedDial(options, setOptions),
    });
    onOptionChange(() => setFab());
    const [setManga, mangaProps] = await useManga({
        imgList: [],
        option: options.option,
        onOptionChange: (option) => setOptions({ ...options, option }),
    });
    const toast = useToast();
    const request = async (method, url, details, errorNum = 0) => {
        const errorText = details?.errorText ?? '漫画图片加载出错';
        try {
            const res = await GM.xmlHttpRequest({ method, url, ...details });
            if (res.status !== 200 || !res.responseText)
                throw new Error(errorText);
            return res;
        }
        catch (error) {
            if (errorNum > 3) {
                toast.error(errorText);
                throw new Error(errorText);
            }
            console.error(errorText, error);
            await sleep(1000 * 3);
            return request(method, url, details, errorNum + 1);
        }
    };
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
            const res = await GM.xmlHttpRequest({
                method: 'GET',
                url: \`https://cdn.jsdelivr.net/gh/hymbz/ComicReadScriptTest@\${GM.info.script.version}/file\`,
            });
            if (!res.responseText)
                return;
            toast(() => (require$$0.jsxs("div", { children: [require$$0.jsxs("h2", { children: ["ComicReadScrip \\u5DF2\\u66F4\\u65B0\\u5230 ", GM.info.script.version] }), require$$0.jsx("div", { className: "md", children: res.responseText.match(/##.+?\\n|(-.+?\\n)+/g).map((mdText) => {
                            if (mdText[0] === '#')
                                return require$$0.jsx("h2", { children: mdText.split('##') });
                            if (mdText[0] === '-')
                                return (require$$0.jsx("ul", { children: mdText.match(/(?<=- ).+/g).map((item) => (require$$0.jsx("li", { children: item }))) }));
                            return null;
                        }) })] })));
            GM_setValue('Version', GM.info.script.version);
        })();
    }
    let menuId;
    /** 更新显示/隐藏阅读模式按钮的菜单项 */
    const updateHideFabMenu = async () => {
        await GM.unregisterMenuCommand(menuId);
        menuId = await GM.registerMenuCommand(\`\${options.hiddenFAB ? '显示' : '隐藏'}阅读模式按钮\`, async () => {
            await setOptions({ ...options, hiddenFAB: !options.hiddenFAB });
            setFab((draftProps) => {
                draftProps.show = !options.hiddenFAB && undefined;
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
        toast,
        request,
        /**
         * 完成所有支持站点的初始化
         *
         * @param getImgList 返回图片列表的函数
         * @param onLoading 图片加载状态发生变化时触发的回调
         * @returns 自动加载图片并进入阅读模式的函数
         */
        init: (getImgList, onLoading = () => { }) => {
            /** 是否正在加载图片中 */
            let loading = false;
            /** 进入阅读模式 */
            const showComic = async (show = options.autoShow) => {
                if (loading) {
                    toast('加载图片中，请稍候', { autoClose: 1500 });
                    return;
                }
                const { imgList } = mangaProps;
                if (!imgList.length) {
                    loading = true;
                    try {
                        setFab({ progress: 0, show: true });
                        const initImgList = await getImgList();
                        if (initImgList.length === 0)
                            throw new Error('获取漫画图片失败');
                        setFab({
                            progress: 1,
                            tip: '阅读模式',
                            show: !options.hiddenFAB && undefined,
                        });
                        setManga((draftProps) => {
                            draftProps.imgList = initImgList;
                            draftProps.show = show;
                            setToolbarButton(draftProps);
                            // 监听图片加载状态，将进度显示到 Fab 上
                            draftProps.onLoading = (img, list) => {
                                const loadNum = list.filter((image) => image.loadType === 'loaded').length;
                                onLoading(loadNum, list.length, img);
                                /** 图片加载进度 */
                                const progress = 1 + loadNum / list.length;
                                if (progress !== 2) {
                                    setFab({
                                        progress,
                                        tip: \`图片加载中 - \${loadNum}/\${list.length}\`,
                                    });
                                }
                                else {
                                    // 图片全部加载完成后恢复 Fab 状态
                                    setFab({ progress, tip: '阅读模式', show: undefined });
                                }
                            };
                            return draftProps;
                        });
                    }
                    catch (e) {
                        console.error(e);
                        toast.error(e.message);
                        setFab({ progress: undefined });
                    }
                    finally {
                        loading = false;
                    }
                }
                else {
                    setManga({ show: true });
                }
            };
            setFab({ onClick: () => showComic(true) });
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            if (options.autoShow)
                showComic();
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            GM.registerMenuCommand('进入漫画阅读模式', () => showComic(true));
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            updateHideFabMenu();
            return () => showComic(true);
        },
    };
};

exports.dataToParams = dataToParams;
exports.defaultSpeedDial = defaultSpeedDial;
exports.download = download;
exports.insertNode = insertNode;
exports.isEqualArray = isEqualArray;
exports.linstenKeyup = linstenKeyup;
exports.plimit = plimit;
exports.promisifyRequest = promisifyRequest;
exports.querySelector = querySelector;
exports.querySelectorAll = querySelectorAll;
exports.querySelectorClick = querySelectorClick;
exports.saveAs = saveAs;
exports.scrollIntoView = scrollIntoView;
exports.setToolbarButton = setToolbarButton;
exports.sleep = sleep;
exports.useCache = useCache;
exports.useComponentsRoot = useComponentsRoot;
exports.useFab = useFab;
exports.useInit = useInit;
exports.useManga = useManga;
exports.useSiteOptions = useSiteOptions;
exports.useToast = useToast;
`;

unsafeWindow.crsLib = {
  // 有些 cjs 模块会检查这个，所以在这里声明下
  process: { env: { NODE_ENV: 'production' } },
  GM,
};
/**
 * 通过 Resource 导入外部模块
 *
 * @param name \@resource 引用的资源名
 */
const selfImportSync = (name) => {
  const code = name === '../helper' ? helperCode : GM_getResourceText(name);
  if (!code) throw new Error(`外部模块 ${name} 未在 @Resource 中声明`);
  // 通过提供 cjs 环境的变量来欺骗 umd 模块加载器
  // 将模块导出变量放到 crsLib 对象里，防止污染全局作用域和网站自身的模块产生冲突
  return GM_addElement('script', {
    textContent: `
      window.crsLib['${name}'] = {};
      ${''}
      (function (process, require, exports, module, GM) {
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
      );
      ${''}
    `,
  });
};
/**
 * 创建一个外部模块的 Proxy，等到读取对象属性时才加载模块
 *
 * @param name 外部模块名
 */
const require = (name) => {
  // 为了应对 rollup 打包时的工具函数 _interopNamespace，要给外部库加上 __esModule 标志
  const __esModule = { value: true };
  // rollup 打包后的代码里有时候会先把 default 单独抽出来之后再使用，所以也要把 default 改成动态加载
  const selfDefault = new Proxy(function selfLibProxy() {}, {
    get(_, prop) {
      if (prop === '__esModule') return __esModule;
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      return module.default?.[prop] ?? module?.[prop];
    },
    apply(_, __, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return ModuleFunc(...args);
    },
    construct(_, args) {
      if (!unsafeWindow.crsLib[name]) selfImportSync(name);
      const module = unsafeWindow.crsLib[name];
      const ModuleFunc =
        typeof module.default === 'function' ? module.default : module;
      return new ModuleFunc(...args);
    },
  });
  return new Proxy(
    { default: selfDefault },
    {
      get(_, prop) {
        if (prop === 'default') return _.default;
        if (prop === '__esModule') return __esModule;
        if (!unsafeWindow.crsLib[name]) selfImportSync(name);
        const module = unsafeWindow.crsLib[name];
        return module[prop];
      },
    },
  );
};
unsafeWindow.crsLib.require = require;

// 匹配站点
switch (window.location.hostname) {
  case 'bbs.yamibo.com': {
    const jsxRuntime = require('react/jsx-runtime');
    const React = require('react');
    const helper = require('../helper');

    function _interopNamespace(e) {
      if (e && e.__esModule) return e;
      const n = Object.create(null, {
        [Symbol.toStringTag]: { value: 'Module' },
      });
      if (e) {
        for (const k in e) {
          if (k !== 'default') {
            const d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(
              n,
              k,
              d.get
                ? d
                : {
                    enumerable: true,
                    get: () => e[k],
                  },
            );
          }
        }
      }
      n.default = e;
      return Object.freeze(n);
    }

    const React__namespace = /*#__PURE__*/ _interopNamespace(React);

    var _path;
    function _extends() {
      _extends = Object.assign
        ? Object.assign.bind()
        : function (target) {
            for (var i = 1; i < arguments.length; i++) {
              var source = arguments[i];
              for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                  target[key] = source[key];
                }
              }
            }
            return target;
          };
      return _extends.apply(this, arguments);
    }
    const SvgSettings = (props) =>
      /*#__PURE__*/ React__namespace.createElement(
        'svg',
        _extends(
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '1em',
            height: '1em',
            viewBox: '0 0 24 24',
            role: 'img',
            stroke: 'currentColor',
            fill: 'currentColor',
            strokeWidth: '0',
          },
          props,
        ),
        _path ||
          (_path = /*#__PURE__*/ React__namespace.createElement('path', {
            d: 'M19.5 12c0-.23-.01-.45-.03-.68l1.86-1.41c.4-.3.51-.86.26-1.3l-1.87-3.23a.987.987 0 0 0-1.25-.42l-2.15.91c-.37-.26-.76-.49-1.17-.68l-.29-2.31c-.06-.5-.49-.88-.99-.88h-3.73c-.51 0-.94.38-1 .88l-.29 2.31c-.41.19-.8.42-1.17.68l-2.15-.91c-.46-.2-1-.02-1.25.42L2.41 8.62c-.25.44-.14.99.26 1.3l1.86 1.41a7.343 7.343 0 0 0 0 1.35l-1.86 1.41c-.4.3-.51.86-.26 1.3l1.87 3.23c.25.44.79.62 1.25.42l2.15-.91c.37.26.76.49 1.17.68l.29 2.31c.06.5.49.88.99.88h3.73c.5 0 .93-.38.99-.88l.29-2.31c.41-.19.8-.42 1.17-.68l2.15.91c.46.2 1 .02 1.25-.42l1.87-3.23c.25-.44.14-.99-.26-1.3l-1.86-1.41c.03-.23.04-.45.04-.68zm-7.46 3.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
          })),
      );

    /** 签到按钮的选择器 */
    const checkInDomSelectors =
      '.header-tool > li > a[href^="plugin.php?id=study_daily_attendance"]';
    (async () => {
      const { options, setFab, setManga, request, init } = await helper.useInit(
        'yamibo',
        {
          记录阅读进度: true,
          关闭快捷导航按钮的跳转: true,
          修正点击页数时的跳转判定: true,
          固定导航条: true,
        },
      );
      await GM.addStyle(`#fab { --fab: #6E2B19; --fab_hover: #A15640; };

    ${
      options.固定导航条 ? '.header-stackup { position: fixed !important }' : ''
    }

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

    /* 隐藏签到按钮 */
    ${checkInDomSelectors} {
      display: none;
    }

    /* 将「回复/查看」列加宽一点 */
    .tl .num {
      width: 80px !important;
    }
    `);
      // 自动签到
      const checkInDom = helper.querySelector(checkInDomSelectors);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (checkInDom) fetch(checkInDom.href);
      if (options.关闭快捷导航按钮的跳转)
        // eslint-disable-next-line no-script-url
        helper.querySelector('#qmenu a')?.setAttribute('href', 'javascript:;');
      // 判断当前页是帖子
      if (/thread(-\d+){3}|mod=viewthread/.test(document.URL)) {
        // 修复微博图床的链接
        helper.querySelectorAll('img[file*="sinaimg.cn"]').forEach((e) => {
          e.setAttribute('referrerpolicy', 'no-referrer');
        });
        if (
          // 限定板块启用
          (fid === 30 || fid === 37) &&
          // 只在第一页生效
          !helper.querySelector('.pg > .prev')
        ) {
          let imgList = helper.querySelectorAll('.t_fsz img');
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
              if (
                img.src.includes('static/image') ||
                (img.complete &&
                  img.naturalHeight &&
                  img.naturalWidth &&
                  img.naturalHeight < 500 &&
                  img.naturalWidth < 500)
              )
                imgList.splice(i, 1);
            }
            return imgList.map((img) => img.src);
          };
          setManga({
            // 在图片加载完成后再检查一遍有没有小图，有就删掉
            onLoading: (img) => {
              // 跳过符合标准的
              if (
                img.height &&
                img.width &&
                img.height > 500 &&
                img.width > 500
              )
                return;
              const delImgIndex = imgList.findIndex(
                (image) => image.src === img.src,
              );
              if (delImgIndex !== -1) imgList.splice(delImgIndex, 1);
              setManga({ imgList: imgList.map((image) => image.src) });
            },
            onExit: (isEnd) => {
              if (isEnd)
                helper.scrollIntoView(
                  '.psth, .rate, #postlist > div:nth-of-type(2)',
                );
              setManga({ show: false });
            },
          });
          updateImgList();
          const showComic = init(() => imgList.map((img) => img.src));
          setFab({ progress: 1, tip: '阅读模式' });
          // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
          helper.insertNode(
            helper.querySelector('div.pti > div.authi'),
            '<span class="pipe show">|</span><a id="comicReadMode" class="show" href="javascript:;">漫画阅读</a>',
          );
          document
            .getElementById('comicReadMode')
            ?.addEventListener('click', showComic);
          // 如果帖子内有设置目录
          if (helper.querySelector('#threadindex')) {
            helper.querySelectorAll('#threadindex li').forEach((dom) => {
              dom.addEventListener('click', () => {
                setTimeout(() => {
                  imgList = helper.querySelectorAll('.t_fsz img');
                  setManga({
                    imgList: updateImgList(),
                    show: options.autoShow ?? undefined,
                  });
                }, 1000);
              });
            });
          }
          const tagDom = helper.querySelector('.ptg.mbm.mtn > a');
          // 通过标签确定上/下一话
          if (tagDom) {
            const tagId = tagDom.href.split('id=')[1];
            const reg = /(?<=<th>\s<a href="thread-)\d+(?=-)/g;
            let threadList = [];
            // 先获取包含当前帖后一话在内的同一标签下的帖子id列表，再根据结果设定上/下一话
            const setPrevNext = async (pageNum = 1) => {
              const res = await GM.xmlHttpRequest({
                method: 'GET',
                url: `https://bbs.yamibo.com/misc.php?mod=tag&id=${tagId}&type=thread&page=${pageNum}`,
              });
              const newList = [...res.responseText.matchAll(reg)].map(
                ([tid]) => +tid,
              );
              threadList = threadList.concat(newList);
              const index = threadList.findIndex(
                (tid) => tid === unsafeWindow.tid,
              );
              if (newList.length && (index === -1 || !threadList[index + 1]))
                return setPrevNext(pageNum + 1);
              return setManga({
                onPrev: threadList[index - 1]
                  ? () => {
                      window.location.assign(
                        `thread-${threadList[index - 1]}-1-1.html`,
                      );
                    }
                  : undefined,
                onNext: threadList[index + 1]
                  ? () => {
                      window.location.assign(
                        `thread-${threadList[index + 1]}-1-1.html`,
                      );
                    }
                  : undefined,
              });
            };
            setTimeout(setPrevNext);
          }
        }
        if (options.记录阅读进度) {
          const { tid } = unsafeWindow;
          const res = await request(
            'GET',
            `https://bbs.yamibo.com/api/mobile/index.php?module=viewthread&tid=${tid}`,
            { errorText: '获取帖子回复数时出错' },
          );
          /** 回复数 */
          const allReplies = parseInt(
            JSON.parse(res.responseText)?.Variables?.thread?.allreplies,
            10,
          );
          if (!allReplies) return;
          /** 当前所在页数 */
          const currentPageNum = parseInt(
            document.querySelector('#pgt strong')?.innerHTML ?? '1',
            10,
          );
          const cache = helper.useCache((db) => {
            db.createObjectStore('history', { keyPath: 'tid' });
          });
          const data = await cache.get('history', `${tid}`);
          // 如果是在翻阅之前页数的内容，则跳过不处理
          if (data && currentPageNum < data.lastPageNum) return;
          // 如果有上次阅读进度的数据，则监视上次的进度之后的楼层，否则监视所有
          /** 监视楼层列表 */
          const watchFloorList = helper.querySelectorAll(
            data?.lastAnchor && currentPageNum === data.lastPageNum
              ? `#${data.lastAnchor} ~ div`
              : '#postlist > div',
          );
          if (!watchFloorList.length) return;
          let id = 0;
          /** 储存数据，但是防抖 */
          const debounceSave = (saveData) => {
            if (id) window.clearTimeout(id);
            id = window.setTimeout(async () => {
              id = 0;
              console.log('save');
              await cache.set('history', saveData);
            }, 200);
          };
          // 在指定楼层被显示出来后重新存储进度数据
          const observer = new IntersectionObserver(
            (entries) => {
              // 找到触发楼层
              const trigger = entries.find((e) => e.isIntersecting);
              if (!trigger) return;
              // 取消触发楼层上面楼层的监视
              const triggerIndex = watchFloorList.findIndex(
                (e) => e === trigger.target,
              );
              if (triggerIndex === -1) return;
              watchFloorList
                .splice(0, triggerIndex + 1)
                .forEach((e) => observer.unobserve(e));
              // 储存数据
              debounceSave({
                tid: `${tid}`,
                lastPageNum: currentPageNum,
                lastReplies: allReplies,
                lastAnchor: trigger.target.id,
              });
            },
            { threshold: 1.0 },
          );
          watchFloorList.forEach((e) => observer.observe(e));
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
          const cache = helper.useCache((db) => {
            db.createObjectStore('history', { keyPath: 'tid' });
          });
          // 更新页面上的阅读进度提示
          const updateHistoryTag = () => {
            // 先删除所有进度提示
            helper.querySelectorAll('.historyTag').forEach((e) => e.remove());
            // 再添加上进度提示
            return Promise.all(
              helper
                .querySelectorAll('tbody[id^=normalthread]')
                .map(async (e) => {
                  const tid = e.id.split('_')[1];
                  const data = await cache.get('history', tid);
                  if (!data) return;
                  const lastReplies =
                    +e.querySelector('.num a').innerHTML - data.lastReplies;
                  helper.insertNode(
                    e.getElementsByTagName('th')[0],
                    `
                <a
                  class="historyTag"
                  onclick="atarget(this)"
                  href="thread-${tid}-${data.lastPageNum}-1.html#${
                      data.lastAnchor
                    }"
                >
                  回第${data.lastPageNum}页
                </a>
                ${
                  lastReplies > 0
                    ? `<div class="historyTag">+${lastReplies}</div>`
                    : ''
                }
              `,
                  );
                }),
            );
          };
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          updateHistoryTag();
          // 切换回当前页时更新提示
          document.addEventListener('visibilitychange', updateHistoryTag);
          // 点击下一页后更新提示
          helper
            .querySelector('#autopbn')
            .addEventListener('click', updateHistoryTag);
        }
        // 在其他板块增加菜单项，以便用于调整其他功能的开关
        await GM.registerMenuCommand('显示设置菜单', () =>
          setFab({
            show: true,
            focus: true,
            tip: '设置',
            children: jsxRuntime.jsx(SvgSettings, {}),
            onBackdropClick: () => setFab({ show: false, focus: false }),
          }),
        );
      }
    })();

    break;
  }
  case 'www.yamibo.com': {
    const helper = require('../helper');

    (async () => {
      // 只在漫画页内运行
      if (!document.URL.includes('view-chapter')) return;
      const { setFab, toast, setManga, init } = await helper.useInit(
        'newYamibo',
      );
      setManga({
        onNext: helper.querySelectorClick('#btnNext'),
        onPrev: helper.querySelectorClick('#btnPrev'),
        onExit: (isEnd) => {
          if (isEnd) helper.scrollIntoView('#w1');
          setManga({ show: false });
        },
      });
      const id = new URLSearchParams(window.location.search).get('id');
      /** 总页数 */
      const totalNum = +helper
        .querySelector('section div:first-of-type div:last-of-type')
        .innerHTML.split('：')[1];
      const getImgList = async (i = 1, imgList = []) => {
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
        });
        if (res.status !== 200 || !res.responseText) {
          console.error('漫画加载出错', res);
          toast.error('漫画加载出错');
          return [];
        }
        imgList.push(
          /<img id="imgPic".+="(.+?)".+>/
            .exec(res.responseText)[1]
            .replaceAll('&amp;', '&'),
        );
        if (imgList.length === totalNum) {
          setFab({ progress: 1, tip: '阅读模式' });
          return imgList;
        }
        setFab({
          progress: imgList.length / totalNum,
          tip: `加载图片中 - ${imgList.length}/${totalNum}`,
        });
        return getImgList(i + 1, imgList);
      };
      init(getImgList);
    })();

    break;
  }

  case 'manhua.dmzj.com': {
    const helper = require('../helper');

    /**
     * 对 document.querySelector 的封装
     * 将默认返回类型改为 HTMLElement
     */
    const querySelector = (selector) => document.querySelector(selector);
    /**
     * 对 document.querySelector 的封装
     * 将默认返回类型改为 HTMLElement
     */
    const querySelectorAll = (selector) => [
      ...document.querySelectorAll(selector),
    ];
    /**
     * 添加元素
     *
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

    /* eslint-disable camelcase */
    (async () => {
      // 某些隐藏漫画虽然被删掉了 PC 端页面，但其实手机版的网页依然还在
      // 所以当跳转至某部漫画的 PC 端页面被提示「页面找不到」时，就先跳转至手机版的页面去
      if (document.title === '页面找不到') {
        // 测试例子：https://manhua.dmzj.com/yanquan/48713.shtml
        const [, comicName, _chapter_id] =
          window.location.pathname.split(/[./]/);
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: `https://manhua.dmzj.com/${comicName}`,
        });
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
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: querySelector('a.rss').href,
        });
        if (res.status !== 200) {
          console.error('获取作者作品失败', res);
          const toast = helper.useToast();
          toast.error('获取作者作品失败');
          return;
        }
        // 页面上原有的漫画标题
        const titleList = querySelectorAll('#hothit p.t').map((e) =>
          e.innerText.replace('[完]', ''),
        );
        insertNode(
          document.getElementById('hothit'),
          res.responseText
            .split('item')
            .filter((_, i) => i % 2)
            .map((item) => {
              const newComicUrl = /manhua.dmzj.com\/(.+?)\?from=rssReader/.exec(
                item,
              )[1];
              return {
                newComicUrl,
                comicUrl: newComicUrl.split('/')[0],
                title: /title><!\[CDATA\[(.+?)]]/.exec(item)[1],
                imgUrl: /<img src='(.+?)'/.exec(item)[1],
                newComicTitle: /title='(.+?)'/.exec(item)[1],
              };
            })
            .filter(({ title }) => !titleList.includes(title))
            .map(
              (data) => `
            <div class="pic">
              <a href="/${data.comicUrl}/" target="_blank">
              <img src="${data.imgUrl}" alt="${data.title}" title="" style="">
              <p class="t">【*隐藏*】${data.title}</p></a>
              <p class="d">最新：<a href="/${data.newComicUrl}" target="_blank">${data.newComicTitle}</a></p>
            </div>
          `,
            )
            .join(''),
        );
        return;
      }
      // 跳过漫画目录、漫画页外的其他页面
      if (!Reflect.has(unsafeWindow, 'g_comic_name')) return;
      if (!Reflect.has(unsafeWindow, 'g_chapter_name')) {
        // 判断当前页是漫画详情页
        // 判断漫画被禁
        // 测试例子：https://manhua.dmzj.com/yanquan/
        if (querySelector('.cartoon_online_border > img')) {
          document.querySelector('.cartoon_online_border').innerHTML =
            '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
          // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
          const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: `https://api.dmzj.com/dynamic/comicinfo/${g_comic_id}.json`,
          });
          if (res.status !== 200 || !res.responseText) {
            console.error('漫画加载出错', res);
            const toast = helper.useToast();
            toast.error('漫画加载出错');
            return;
          }
          // 删掉原有的章节 dom
          querySelectorAll('.odd_anim_title ~ div').forEach((e) =>
            e.parentNode?.removeChild(e),
          );
          const {
            info: { last_updatetime, title },
            list: chaptersList,
          } = JSON.parse(res.responseText).data;
          // 手动构建添加章节 dom
          let temp = `<div class="photo_part"><div class="h2_title2"><span class="h2_icon h2_icon22"></span><h2>${title}</h2></div></div><div class="cartoon_online_border" style="border-top: 1px dashed #0187c5;"><ul>`;
          let i = chaptersList.length;
          while (i--) {
            temp += `<li><a target="_blank" title="${
              chaptersList[i].chapter_name
            }" href="https://manhua.dmzj.com/${g_comic_url}${
              chaptersList[i].id
            }.shtml" ${
              chaptersList[i].updatetime === last_updatetime
                ? 'class="color_red"'
                : ''
            }>${chaptersList[i].chapter_name}</a></li>`;
          }
          insertNode(
            querySelector('.middleright_mr'),
            `${temp}</ul><div class="clearfix"></div></div>`,
          );
        }
        return;
      }
      // 处理当前页是漫画页的情况
      const { options, setManga, init, onOptionChange } = await helper.useInit(
        'dmzj',
        {
          解除吐槽的字数限制: true,
        },
      );
      // 切换至上下翻页阅读
      if ($.cookie('display_mode') === '0') unsafeWindow.qiehuan();
      // 根据漫画模式下的夜间模式切换样式
      if (options.option?.darkMode === false) {
        document.body.classList.add('day');
      }
      onOptionChange((option) => {
        // 监听漫画模式下的夜间模式切换，进行实时切换
        if (option.option?.darkMode) document.body.classList.remove('day');
        else document.body.classList.add('day');
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
        onNext: helper.querySelectorClick('#next_chapter'),
        onPrev: helper.querySelectorClick('#prev_chapter'),
        onExit: (isEnd) => {
          if (isEnd) {
            unsafeWindow.huPoint();
            helper.scrollIntoView('#hd');
          }
          setManga({ show: false });
        },
      });
      init(() =>
        querySelectorAll('.inner_img img')
          .map((e) => e.getAttribute('data-original'))
          .filter((src) => src),
      );
      // 修改发表吐槽的函数，删去字数判断。只是删去了原函数的一个判断条件而已，所以将这段压缩了一下
      if (options['解除吐槽的字数限制']) {
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
            d.attr('onclick', '')
              .html('发表中..')
              .css({
                background: '#eee',
                color: '#999',
                cursor: 'not-allowed',
              });
            if (is_login) {
              $.ajax({
                type: 'get',
                url: `${comicUrl}/api/viewpoint/add`,
                dataType: 'jsonp',
                jsonp: 'callback',
                jsonpCallback: 'success_jsonpCallback_201508281119',
                data: `type=${type}&type_id=${comic_id}&chapter_id=${chapter_id}&uid=${uid}&nickname=${nickname}&title=${encodeURIComponent(
                  e,
                )}`,
                success: function (f) {
                  if (f.result == 1000) {
                    $('#gdInput').val('');
                    if ($('#moreLi').length > 0) {
                      $('#moreLi').before(
                        `<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}"  >${e}</a></li>`,
                      );
                    } else {
                      $('#tc').hide();
                      if (c == undefined) {
                        $('.comic_gd_li').append(
                          `<li><a href="javascript:;"  class="c0 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`,
                        );
                      } else {
                        if (c > 9) {
                          $('.comic_gd_li').append(
                            `<li><a href="javascript:;"  class="c9 said" onclick="clickZ($(this));clickY($(this))"  vote_id="${f.data.id}" >${e}</a></li>`,
                          );
                        } else {
                          $('.comic_gd_li').append(
                            `<li><a href="javascript:;"  onclick="clickZ($(this));clickY($(this))" class="c${c} said"    vote_id="${f.data.id}">${e}</a></li>`,
                          );
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
                  d.attr({ onclick: b, style: '' }).html(a);
                },
              });
            }
          };
        }, 2000);
      }
    })();

    break;
  }
  case 'm.dmzj.com': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    // 接口参考
    // https://github.com/xiaoyaocz/flutter_dmzj/blob/ecbe73eb435624022ae5a77156c5d3e0c06809cc/lib/requests/api.dart
    // https://github.com/erinacio/tachiyomi-extensions/blob/548be91cccb8f248342e2e7762c2c3d4b2d02036/src/zh/dmzj/src/eu/kanade/tachiyomi/extension/zh/dmzj/Dmzj.kt
    (async () => {
      const { setManga, init, toast } = await helper.useInit('dmzj', {
        解除吐槽的字数限制: true,
      });
      // 分别处理目录页和漫画页
      switch (window.location.pathname.split('/')[1]) {
        case 'info': {
          // 跳过正常漫画
          if (Reflect.has(unsafeWindow, 'obj_id')) return;
          const comicId = parseInt(window.location.pathname.split('/')[2], 10);
          if (Number.isNaN(comicId)) {
            document.body.removeChild(document.body.childNodes[0]);
            helper.insertNode(
              document.body,
              `
          请手动输入漫画名进行搜索 <br />
          <input type="search"> <button>搜索</button> <br />
          <div id="list" />
        `,
            );
            helper
              .querySelector('button')
              .addEventListener('click', async () => {
                const comicName = helper.querySelector('input')?.value;
                if (!comicName) return;
                const res = await GM.xmlHttpRequest({
                  method: 'GET',
                  url: `https://s.acg.dmzj.com/comicsum/search.php?s=${comicName}`,
                });
                if (res.status !== 200) {
                  console.error('搜索漫画时出错', res);
                  toast.error('搜索漫画时出错');
                  return;
                }
                const comicList = JSON.parse(res.responseText.slice(20, -1));
                helper.querySelector('#list').innerHTML = comicList
                  .map(
                    ({ id, comic_name, comic_author, comic_url }) => `
                <b>《${comic_name}》<b/>——${comic_author}
                <a href="${comic_url}">Web端</a>
                <a href="https://m.dmzj.com/info/${id}.html">移动端</a>
              `,
                  )
                  .join('<br />');
              });
            return;
          }
          // XXX: 使用旧 api 只能获取到主版本的章节，其他版本的章节无法取得，改用 v4api 应该就能拿到了
          const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: `http://api.dmzj.com/dynamic/comicinfo/${comicId}.json`,
          });
          if (res.status !== 200) {
            console.error('获取漫画数据失败', res);
            toast.error('获取漫画数据失败');
            return;
          }
          const {
            info: { last_updatetime, title },
            list: chaptersList,
          } = JSON.parse(res.responseText).data;
          document.title = title;
          let temp = `<h1 style="text-align:center">${title}</h1>`;
          let i = chaptersList.length;
          while (i--)
            temp += `<a target="_blank" title="${
              chaptersList[i].chapter_name
            }" href="https://m.dmzj.com/view/${comicId}/${
              chaptersList[i].id
            }.html" ${
              chaptersList[i].updatetime === last_updatetime
                ? 'style="color:red"'
                : ''
            }>${chaptersList[i].chapter_name}</a>`;
          helper.insertNode(document.body, temp);
          document.body.removeChild(document.body.childNodes[0]);
          await GM.addStyle(
            'body{padding:0 20vw;} a{margin:0 1em;line-height:2em;white-space:nowrap;display:inline-block;min-width:4em;}',
          );
          break;
        }
        case 'view': {
          // 如果不是隐藏漫画，直接进入阅读模式
          if (unsafeWindow.comic_id) {
            await GM.addStyle('.subHeader{display:none !important}');
            setManga({
              onNext: helper.querySelectorClick('#loadNextChapter'),
              onPrev: helper.querySelectorClick('#loadPrevChapter'),
            });
            const showComic = init(() =>
              helper
                .querySelectorAll('#commicBox img')
                .map((e) => e.getAttribute('data-original'))
                .filter((src) => src),
            );
            await showComic();
            return;
          }
          document.body.removeChild(document.body.childNodes[0]);
          const tipDom = document.createElement('p');
          tipDom.innerText = '正在加载中，请坐和放宽，若长时间无反应请刷新页面';
          document.body.appendChild(tipDom);
          const res = await GM.xmlHttpRequest({
            method: 'GET',
            url: `https://m.dmzj.com/chapinfo/${
              /\d+\/\d+/.exec(document.URL)[0]
            }.html`,
          });
          if (res.status !== 200) {
            tipDom.innerText = res.responseText;
            return;
          }
          tipDom.innerText = `加载完成，即将进入阅读模式`;
          const { folder, page_url } = JSON.parse(res.responseText);
          document.title = folder.split('/').at(-2) ?? folder;
          // 进入阅读模式后禁止退出，防止返回空白页面
          setManga({ onExit: undefined, editButtonList: (list) => list });
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
  // 懒得整理导入导出的代码了，应该也没人用了吧，等有人需要的时候再说
  // case 'i.dmzj.com': {
  //   // dmzj_user_info
  //   break;
  // }

  case 'exhentai.org':
  case 'e-hentai.org': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    (async () => {
      const { options, setFab, setManga, request, init, toast } =
        await helper.useInit('nhentai', {
          匹配nhentai: true,
          快捷键翻页: true,
        });
      // 不是漫画页的话
      if (!Reflect.has(unsafeWindow, 'gid')) {
        if (options.快捷键翻页) {
          helper.linstenKeyup((e) => {
            switch (e.key) {
              case 'ArrowRight':
              case 'd':
                helper.querySelector('#dnext')?.click();
                break;
              case 'ArrowLeft':
              case 'a':
                helper.querySelector('#dprev')?.click();
                break;
            }
          });
        }
        return;
      }
      setManga({
        onExit: (isEnd) => {
          if (isEnd) helper.scrollIntoView('#cdiv');
          setManga({ show: false });
        },
      });
      // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
      helper.insertNode(
        document.getElementById('gd5'),
        '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>',
      );
      const comicReadModeDom = document.getElementById('comicReadMode');
      const totalImgNum = parseInt(
        helper.querySelector('#gdd > table > tbody > tr:nth-child(6) > td.gdt2')
          .innerHTML,
        10,
      );
      let loadedImgNum = 0;
      /**
       * 从图片页获取图片地址
       */
      const getImgFromImgPage = async (url) => {
        const res = await request('GET', url, {
          errorText: '从图片页获取图片地址失败',
        });
        loadedImgNum += 1;
        setFab({
          progress: loadedImgNum / totalImgNum,
          tip: `加载图片中 - ${loadedImgNum}/${totalImgNum}`,
        });
        comicReadModeDom.innerHTML = ` loading image - ${loadedImgNum}/${totalImgNum}`;
        return res.responseText.split('id="img" src="')[1].split('"')[0];
      };
      /** 从详情页获取图片页的地址的正则 */
      const getImgFromDetailsPageRe =
        /(?<=<a href=").{20,50}(?="><img alt="\d+")/gm;
      const getImgFromDetailsPage = async (pageNum = 0) => {
        const res = await request(
          'GET',
          `${window.location.origin}${window.location.pathname}${
            pageNum ? `?p=${pageNum}` : ''
          }`,
          {
            errorText: '从详情页获取图片页地址失败',
          },
        );
        // 从详情页获取图片页的地址
        const imgPageList = res.responseText.match(getImgFromDetailsPageRe);
        if (imgPageList === null)
          throw new Error('从详情页获取图片页的地址时出错');
        return Promise.all(imgPageList.map(getImgFromImgPage));
      };
      const showComic = init(
        async () => {
          const totalPageNum = +helper.querySelector(
            '.ptt td:nth-last-child(2)',
          ).innerText;
          return (
            await Promise.all(
              [...Array(totalPageNum).keys()].map((pageNum) =>
                getImgFromDetailsPage(pageNum),
              ),
            )
          ).flat();
        },
        (loadNum, totalNum) => {
          comicReadModeDom.innerHTML =
            loadNum !== totalNum
              ? ` image loading - ${loadNum}/${totalNum}`
              : ' Read';
        },
      );
      setFab({ initShow: options.autoShow });
      comicReadModeDom.addEventListener('click', showComic);
      if (options.快捷键翻页) {
        helper.linstenKeyup((e) => {
          switch (e.key) {
            case 'ArrowRight':
            case 'd':
              helper.querySelector('.ptt td:last-child:not(.ptdd)')?.click();
              break;
            case 'ArrowLeft':
            case 'a':
              helper.querySelector('.ptt td:first-child:not(.ptdd)')?.click();
              break;
          }
        });
      }
      if (options.匹配nhentai) {
        const titleDom = document.getElementById('gn');
        const taglistDom = helper.querySelector('#taglist tbody');
        if (!titleDom || !taglistDom) {
          toast.error('页面结构发生改变，匹配 nhentai 漫画功能无法正常生效');
          return;
        }
        let res;
        try {
          res = await GM.xmlHttpRequest({
            method: 'GET',
            url: `https://nhentai.net/api/galleries/search?query=${encodeURI(
              titleDom.innerText,
            )}`,
          });
        } catch (e) {
          console.error('nhentai 漫画出错', e);
        }
        const newTagLine = document.createElement('tr');
        if (!res) {
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
            temp += `<div id="td_nhentai:${
              tempComicInfo.id
            }" class="gtl" style="opacity:1.0" title="${
              tempComicInfo.title.japanese
                ? tempComicInfo.title.japanese
                : tempComicInfo.title.english
            }"><a href="https://nhentai.net/g/${
              tempComicInfo.id
            }/" index=${i} onclick="return toggle_tagmenu('nhentai:${
              tempComicInfo.id
            }',this)">${tempComicInfo.id}</a></a></div>`;
          }
          newTagLine.innerHTML = `${temp}</td>`;
        } else
          newTagLine.innerHTML =
            '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';
        taglistDom.appendChild(newTagLine);
        // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
        const nhentaiImgList = {};
        unsafeWindow._refresh_tagmenu_act = function _refresh_tagmenu_act(
          a,
          b,
        ) {
          const tagmenu_act_dom = document.getElementById('tagmenu_act');
          if (a.includes('nhentai:')) {
            tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;
            tagmenu_act_dom.innerHTML += `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> ${
              nhentaiImgList[selected_tag] ? 'Read' : 'Load comic'
            }</a>`;
            const nhentaiComicReadModeDom =
              tagmenu_act_dom.querySelector('a[href="#"]');
            // 加载 nhentai 漫画
            nhentaiComicReadModeDom.addEventListener('click', async (e) => {
              e.preventDefault();
              const comicInfo =
                nHentaiComicInfo.result[+selected_link.getAttribute('index')];
              let loadNum = 0;
              if (!nhentaiImgList[selected_tag]) {
                nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
                // 用于转换获得图片文件扩展名的 dict
                const fileType = {
                  j: 'jpg',
                  p: 'png',
                  g: 'gif',
                };
                const details = {
                  headers: {
                    Referer: `https://nhentai.net/g/${comicInfo.media_id}`,
                  },
                };
                nhentaiImgList[selected_tag] = await Promise.all(
                  comicInfo.images.pages.map(async ({ t }, i) => {
                    const url = `https://i.nhentai.net/galleries/${
                      comicInfo.media_id
                    }/${i + 1}.${fileType[t]}`;
                    const blobUrl = URL.createObjectURL(
                      await helper.download(url, details),
                    );
                    loadNum += 1;
                    nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
                    return blobUrl;
                  }),
                );
                nhentaiComicReadModeDom.innerHTML = ' Read';
              }
              setManga({ imgList: nhentaiImgList[selected_tag], show: true });
            });
          } else {
            const mr =
              '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" />';
            let temp = '';
            if (b.className !== 'tup')
              temp += ` ${mr} <a href="#" onclick="tag_vote_up(); return false">${
                b.className === '' ? 'Vote Up' : 'Withdraw Vote'
              }</a>`;
            if (b.className !== 'tdn')
              temp += ` ${mr} <a href="#" onclick="tag_vote_down(); return false">${
                b.className === '' ? 'Vote Down' : 'Withdraw Vote'
              }</a>`;
            // 删掉原有的 Show Tagged Galleries 按钮空出位置
            temp += `${mr} <a href="#" onclick="tag_define(); return false">Show Tag Definition</a>${mr} <a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a> ${mr} `;
            const tag = selected_link.id.slice(3).split(':');
            if (tag.length === 1) {
              temp += `<a href="https://nhentai.net/tag/${tag[0].replace(
                /_/g,
                '-',
              )}" target="_blank">Jump to nhentai</a>`;
            } else {
              temp += `<a href="https://nhentai.net/${
                tag[0] === 'female' ? 'tag' : tag[0]
              }/${tag[1].replace(
                /_/g,
                '-',
              )}" target="_blank">Jump to nhentai</a>`;
            }
            tagmenu_act_dom.innerHTML = temp;
          }
        };
      }
    })();

    break;
  }

  case 'nhentai.net': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    /** 用于转换获得图片文件扩展名 */
    const fileType = {
      j: 'jpg',
      p: 'png',
      g: 'gif',
    };
    (async () => {
      const { options, setFab, setManga, toast, init } = await helper.useInit(
        'nhentai',
        {
          自动翻页: true,
          彻底屏蔽漫画: true,
          在新页面中打开链接: true,
        },
      );
      // 在漫画详情页
      if (Reflect.has(unsafeWindow, 'gallery')) {
        setManga({
          onExit: (isEnd) => {
            if (isEnd) helper.scrollIntoView('#comment-container');
            setManga({ show: false });
          },
        });
        // 虽然有 Fab 了不需要这个按钮，但我自己都点习惯了没有还挺别扭的（
        helper.insertNode(
          document.getElementById('download').parentNode,
          '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Load comic</a>',
        );
        const comicReadModeDom = document.getElementById('comicReadMode');
        const showComic = init(
          () =>
            gallery.images.pages.map(
              ({ number, extension }) =>
                `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`,
            ),
          (loadNum, totalNum) => {
            comicReadModeDom.innerHTML =
              loadNum !== totalNum
                ? `<i class="fa fa-spinner"></i> loading —— ${loadNum}/${totalNum}`
                : '<i class="fa fa-book"></i> Read';
          },
        );
        setFab({ initShow: options.autoShow });
        comicReadModeDom.addEventListener('click', showComic);
        return;
      }
      // 在漫画浏览页
      if (document.getElementsByClassName('gallery').length) {
        if (options.在新页面中打开链接)
          helper
            .querySelectorAll('a:not([href^="javascript:"])')
            .forEach((e) => e.setAttribute('target', '_blank'));
        const blacklist = (unsafeWindow?._n_app ?? unsafeWindow?.n)?.options
          ?.blacklisted_tags;
        if (blacklist === undefined) toast.error('标签黑名单获取失败');
        // blacklist === null 时是未登录
        if (options.彻底屏蔽漫画 && blacklist?.length)
          await GM.addStyle('.blacklisted.gallery { display: none; }');
        if (options.自动翻页) {
          await GM.addStyle(`
        hr { bottom: 0; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);
          const pageNum = Number(
            helper.querySelector('.page.current')?.innerHTML ?? '',
          );
          if (Number.isNaN(pageNum)) return;
          let loadLock = !pageNum;
          const contentDom = document.getElementById('content');
          const apiUrl = (() => {
            if (window.location.pathname === '/')
              return 'https://nhentai.net/api/galleries/all?';
            if (helper.querySelector('a.tag'))
              return `https://nhentai.net/api/galleries/tagged?tag_id=${
                helper.querySelector('a.tag')?.classList[1].split('-')[1]
              }&`;
            if (window.location.pathname.includes('search'))
              return `https://nhentai.net/api/galleries/search?query=${new URLSearchParams(
                window.location.search,
              ).get('q')}&`;
            return '';
          })();
          let errorNum = 0;
          const loadNewComic = async () => {
            if (
              loadLock ||
              contentDom.lastElementChild.getBoundingClientRect().top >
                window.innerHeight
            )
              return undefined;
            loadLock = true;
            const res = await GM.xmlHttpRequest({
              method: 'GET',
              url: `${apiUrl}page=${pageNum}${
                window.location.pathname.includes('popular')
                  ? '&sort=popular '
                  : ''
              }`,
            });
            if (res.status !== 200 || !res.responseText) {
              if (errorNum > 3) throw new Error('漫画加载出错');
              errorNum += 1;
              console.error('漫画加载出错', res);
              toast.error('漫画加载出错');
              await helper.sleep(1000 * 3);
              return loadNewComic();
            }
            const { result, num_pages } = JSON.parse(res.responseText);
            let comicDomHtml = '';
            for (let i = 0; i < result.length; i += 1) {
              const tempComicInfo = result[i];
              // 在 用户未登录 或 黑名单为空 或 未开启屏蔽 或 漫画标签都不在黑名单中 时才添加漫画结果
              if (
                !(
                  blacklist?.length &&
                  options['彻底屏蔽漫画'] &&
                  tempComicInfo.tags.some((e) => blacklist.includes(`${e.id}`))
                )
              )
                comicDomHtml += `<div class="gallery" data-tags="${tempComicInfo.tags
                  .map((e) => e.id)
                  .join(' ')}"><a ${
                  options['在新页面中打开链接'] ? 'target="_blank"' : ''
                } href="/g/${
                  tempComicInfo.id
                }/" class="cover" style="padding:0 0 ${
                  (tempComicInfo.images.thumbnail.h /
                    tempComicInfo.images.thumbnail.w) *
                  100
                }% 0"><img is="lazyload-image" class="" width="${
                  tempComicInfo.images.thumbnail.w
                }" height="${
                  tempComicInfo.images.thumbnail.h
                }" src="https://t.nhentai.net/galleries/${
                  tempComicInfo.media_id
                }/thumb.${
                  fileType[tempComicInfo.images.thumbnail.t]
                }"><div class="caption">${
                  tempComicInfo.title.english
                }</div></a></div>`;
            }
            // 构建页数按钮
            if (comicDomHtml) {
              const target = options['在新页面中打开链接']
                ? 'target="_blank" '
                : '';
              const pageNumDom = [];
              for (let i = pageNum - 5; i <= pageNum + 5; i += 1) {
                if (i > 0 && i <= num_pages)
                  pageNumDom.push(
                    `<a ${target}href="?page=${i}" class="page${
                      i === pageNum ? ' current' : ''
                    }">${i}</a>`,
                  );
              }
              helper.insertNode(
                contentDom,
                `<h1>${pageNum}</h1>
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
                ${
                  pageNum === num_pages
                    ? ''
                    : `<a ${target}shref="?page=${pageNum + 1}" class="next">
                        <i class="fa fa-chevron-right"></i>
                      </a>
                      <a ${target}href="?page=${num_pages}" class="last">
                        <i class="fa fa-chevron-right"></i>
                        <i class="fa fa-chevron-right"></i>
                      </a>`
                }
              </section>`,
              );
            }
            // 添加分隔线
            contentDom.appendChild(document.createElement('hr'));
            if (pageNum < num_pages) loadLock = false;
            else
              contentDom.lastElementChild.style.animationPlayState = 'paused';
            // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
            if (
              !comicDomHtml ||
              contentDom.offsetHeight < document.body.offsetHeight
            )
              return loadNewComic();
            return undefined;
          };
          window.addEventListener('scroll', loadNewComic);
          if (helper.querySelector('section.pagination'))
            contentDom.appendChild(document.createElement('hr'));
          await loadNewComic();
        }
      }
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
  case 'www.copymanga.com': {
    const helper = require('../helper');

    (async () => {
      // 只在漫画页内运行
      if (!window.location.href.includes('/chapter/')) return;
      const { setManga, request, init } = await helper.useInit('copymanga');
      setManga({
        onNext: helper.querySelectorClick(
          '.comicContent-next a:not(.prev-null)',
        ),
        onPrev: helper.querySelectorClick(
          '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
        ),
      });
      init(async () => {
        const res = await request(
          'GET',
          window.location.href.replace(
            /.*?(?=\/comic\/)/,
            'https://api.copymanga.site/api/v3',
          ),
          { headers: { Referer: window.location.href }, responseType: 'blob' },
        );
        const {
          results: {
            chapter: { contents },
          },
        } = JSON.parse(res.responseText);
        return contents.map(({ url }) => url);
      });
    })();

    break;
  }

  case 'tel.dm5.com':
  case 'en.dm5.com':
  case 'www.dm5.com':
  case 'www.dm5.cn':
  case 'www.1kkk.com': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    (async () => {
      // 只在漫画页内运行
      if (!Reflect.has(unsafeWindow, 'DM5_CID')) return;
      const { setFab, toast, setManga, init } = await helper.useInit('dm5');
      setManga({
        onNext: helper.querySelectorClick('.logo_2'),
        onPrev: helper.querySelectorClick('.logo_1'),
        onExit: (isEnd) => {
          if (isEnd) helper.scrollIntoView('.top');
          setManga({ show: false });
        },
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
              _sign: DM5_VIEWSIGN,
            },
          });
          // 返回的数据只能通过 eval 获得
          // eslint-disable-next-line no-eval
          const newImgList = [...imgList, ...eval(res)];
          if (newImgList.length !== DM5_IMAGE_COUNT) {
            setFab({
              progress: newImgList.length / DM5_IMAGE_COUNT,
              tip: `加载图片中 - ${newImgList.length}/${DM5_IMAGE_COUNT}`,
            });
            return getImgList(newImgList);
          }
          return newImgList;
        } catch (error) {
          if (errorNum > 3) throw new Error('加载图片时出错');
          console.error('加载图片时出错');
          toast.error('加载图片时出错');
          await helper.sleep(1000 * 3);
          return getImgList(imgList, errorNum + 1);
        }
      };
      init(getImgList);
    })();

    break;
  }

  case 'www.mangabz.com':
  case 'mangabz.com': {
    const helper = require('../helper');

    (async () => {
      // 只在漫画页内运行
      if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) return;
      const { setFab, setManga, request, init } = await helper.useInit(
        'mangabz',
      );
      setManga({
        onNext: helper.querySelectorClick(
          'body > .container a[href^="/"]:last-child',
        ),
        onPrev: helper.querySelectorClick(
          'body > .container a[href^="/"]:first-child',
        ),
      });
      const getImgList = async (imgList = []) => {
        const urlParams = helper.dataToParams({
          cid: MANGABZ_CID,
          page: imgList.length + 1,
          key: '',
          _cid: MANGABZ_CID,
          _mid: MANGABZ_MID,
          _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
          _sign: MANGABZ_VIEWSIGN,
        });
        const res = await request(
          'GET',
          `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`,
        );
        // 返回的数据只能通过 eval 获得
        // eslint-disable-next-line no-eval
        const newImgList = [...imgList, ...eval(res.responseText)];
        if (newImgList.length !== MANGABZ_IMAGE_COUNT) {
          // 在 Fab 按钮上通过进度条和提示文本显示当前进度
          setFab({
            progress: newImgList.length / MANGABZ_IMAGE_COUNT,
            tip: `加载图片中 - ${newImgList.length}/${MANGABZ_IMAGE_COUNT}`,
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
  case 'tw.manhuagui.com': {
    const helper = require('../helper');

    (async () => {
      // 只在漫画页内运行
      if (!Reflect.has(unsafeWindow, 'cInfo')) return;
      const { setManga, init } = await helper.useInit('manhuagui');
      setManga({
        onNext:
          cInfo.nextId !== 0 ? helper.querySelectorClick('a.nextC') : null,
        onPrev:
          cInfo.prevId !== 0 ? helper.querySelectorClick('a.prevC') : null,
      });
      init(() => {
        const comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // eslint-disable-next-line no-eval
          eval(
            document.querySelectorAll('body > script')[1].innerHTML.slice(26),
          ).slice(12, -12),
        );
        const sl = Object.entries(comicInfo.sl)
          .map((attr) => `${attr[0]}=${attr[1]}`)
          .join('&');
        return comicInfo.files.map(
          (file) => `${pVars.manga.filePath}${file}?${sl}`,
        );
      });
    })();

    break;
  }

  case 'www.manhuadb.com': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    (async () => {
      // 只在漫画页内运行
      if (!Reflect.has(unsafeWindow, 'img_data_arr')) return;
      const { setManga, init } = await helper.useInit('manhuaDB');
      /**
       * 检查是否有上/下一话
       */
      const checkTurnPage = async (type) => {
        const res = await $.ajax({
          method: 'POST',
          url: '/book/goNumPage',
          dataType: 'json',
          data: helper.dataToParams({
            ccid: p_ccid,
            id: p_id,
            num: vg_r_data.data('num') + (type === 'next' ? 1 : -1),
            d: p_d,
            type,
          }),
        });
        if (res.state)
          return helper.querySelectorClick(
            `a[title="${type === 'next' ? '下集' : '上集'}"]`,
          );
        return null;
      };
      setManga({
        onNext: await checkTurnPage('next'),
        onPrev: await checkTurnPage('pre'),
      });
      init(() =>
        img_data_arr.map((data) => `${img_host}/${img_pre}/${data.img}`),
      );
    })();

    break;
  }

  case 'www.manhuacat.com':
  case 'www.maofly.com': {
    const helper = require('../helper');

    /* eslint-disable camelcase */
    (async () => {
      // 只在漫画页内运行
      if (!Reflect.has(unsafeWindow, 'cdnImage')) return;
      const { setManga, init } = await helper.useInit('manhuacat');
      /**
       * 检查是否有上/下一页
       */
      const checkTurnPage = async (type) => {
        const res = await $.ajax({
          type: 'get',
          url: `/chapter_num?chapter_id=${chapter_num}&ctype=${
            type === 'next' ? 1 : 2
          }&type=${chapter_type}`,
          dataType: 'json',
        });
        if (res.code === '0000') return () => goNumPage(type);
        return null;
      };
      setManga({
        onNext: await checkTurnPage('next'),
        onPrev: await checkTurnPage('pre'),
      });
      init(() =>
        img_data_arr.map((img) =>
          cdnImage(img_pre + img, asset_domain, asset_key),
        ),
      );
    })();

    break;
  }

  case 'jmcomic.me':
  case 'jmcomic1.me':
  case '18comic.org':
  case '18comic.cc':
  case '18comic.vip': {
    const helper = require('../helper');

    (async () => {
      // 只在漫画页内运行
      if (!window.location.pathname.includes('/photo/')) return;
      const { init, setFab, toast } = await helper.useInit('jm');
      while (!unsafeWindow?.onImageLoaded) {
        if (document.readyState === 'complete') {
          toast.error('无法获取图片', { autoClose: false });
          return;
        }
        // eslint-disable-next-line no-await-in-loop
        await helper.sleep(100);
      }
      const imgEleList = helper.querySelectorAll('.scramble-page > img');
      // 判断当前漫画是否有被分割，没有就直接获取图片链接加载
      // 判断条件来自页面上的 scramble_image 函数
      if (
        unsafeWindow.aid < unsafeWindow.scramble_id ||
        unsafeWindow.speed === '1'
      ) {
        init(() => imgEleList.map((e) => e.getAttribute('data-original')));
        return;
      }
      const getImgUrl = async (imgEle) => {
        imgEle.src = URL.createObjectURL(
          await helper.download(imgEle.getAttribute('data-original')),
        );
        await new Promise((resolve, reject) => {
          imgEle.onload = resolve;
          imgEle.onerror = reject;
        });
        unsafeWindow.onImageLoaded(imgEle);
        const blob = await new Promise((resolve) => {
          imgEle.nextElementSibling.toBlob(resolve, 'image/webp', 1);
        });
        if (!blob) return '';
        return `${URL.createObjectURL(blob)}#.webp`;
      };
      init(() =>
        helper.plimit(
          10,
          imgEleList.map((img) => async () => getImgUrl(img)),
          (resList) => {
            setFab({
              progress: resList.length / imgEleList.length,
              tip: `加载图片中 - ${resList.length}/${imgEleList.length}`,
            });
          },
        ),
      );
    })();

    break;
  }

  default: {
    const helper = require('../helper');

    /** 判断两个列表中包含的值是否相同 */
    const isEqualArray = (a, b) =>
      a.length === b.length && !!a.filter((t) => !b.includes(t));

    /**
     * 对修改站点配置的相关方法的封装
     *
     * @param name 站点名
     * @param defaultOptions 默认配置
     */
    const useSiteOptions = async (name, defaultOptions = {}) => {
      const rawValue = await GM.getValue(name);
      const options = Object.assign(
        {
          option: undefined,
          autoShow: true,
          hiddenFAB: false,
          ...defaultOptions,
        },
        rawValue,
      );
      const changeCallbackList = [];
      return {
        options,
        /** 该站点是否有储存配置 */
        isRecorded: rawValue !== undefined,
        /**
         * 设置新 Option
         *
         * @param newValue newValue
         * @param trigger 是否触发变更事件
         */
        setOptions: async (newValue, trigger = true) => {
          Object.assign(options, newValue);
          await GM.setValue(name, options);
          if (trigger)
            await Promise.all(
              changeCallbackList.map((callback) => callback(options)),
            );
        },
        /**
         * 监听配置变更事件
         */
        onOptionChange: (callback) => {
          changeCallbackList.push(callback);
        },
      };
    };

    setTimeout(async () => {
      const { options, setOptions, isRecorded, onOptionChange } =
        await useSiteOptions(window.location.hostname, { autoShow: false });
      /** 图片列表 */
      let imgList = [];
      /** 是否正在后台不断检查图片 */
      let running = 0;
      let setManga;
      let setFab;
      let toast;
      const init = async () => {
        if (setManga !== undefined) return;
        [setManga] = await helper.useManga({
          imgList,
          show: options.autoShow,
          onOptionChange: (option) => setOptions({ ...options, option }, false),
        });
        setManga(helper.setToolbarButton, false);
        setFab = await helper.useFab({
          tip: '阅读模式',
          onClick: () => setManga({ show: true }),
          speedDial: helper.defaultSpeedDial(options, setOptions),
        });
        onOptionChange(() => setFab());
        setFab();
        toast = helper.useToast();
      };
      /** 已经被触发过懒加载的图片 */
      const triggedImgList = new Set();
      /** 触发懒加载 */
      const triggerLazyLoad = () => {
        const targetImgList = [...document.getElementsByTagName('img')]
          // 过滤掉已经被触发过懒加载的图片
          .filter((e) => !triggedImgList.has(e))
          // 根据位置从小到大排序
          .sort((a, b) => a.offsetTop - b.offsetTop);
        /** 上次触发的图片 */
        let lastTriggedImg;
        targetImgList.forEach((e) => {
          triggedImgList.add(e);
          // 过滤掉位置相近，在触发上一张图片时已经顺带被触发了的
          if (
            e.offsetTop >=
            (lastTriggedImg?.offsetTop ?? 0) + window.innerHeight
          )
            return;
          // 通过瞬间滚动到图片位置、触发滚动事件、再瞬间滚回来，来触发图片的懒加载
          const nowScroll = window.scrollY;
          window.scroll({ top: e.offsetTop, behavior: 'auto' });
          e.dispatchEvent(new Event('scroll', { bubbles: true }));
          window.scroll({ top: nowScroll, behavior: 'auto' });
          lastTriggedImg = e;
        });
      };
      /**
       * 检查搜索页面上符合标准的图片
       *
       * @returns 返回是否成功找到图片
       */
      const checkFindImg = () => {
        triggerLazyLoad();
        const newImgList = [...document.getElementsByTagName('img')]
          .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
          .map((e) => e.src);
        if (newImgList.length === 0) {
          if (!options.autoShow) {
            clearInterval(running);
            toast?.('没有找到图片', { type: 'warning' });
          }
          return false;
        }
        // 在发现新图片后重新渲染
        if (!isEqualArray(imgList, newImgList)) {
          imgList = newImgList;
          setManga({ imgList });
          setFab({ progress: 1 });
        }
        return true;
      };
      await GM.registerMenuCommand('进入漫画阅读模式', async () => {
        await init();
        if (!running) running = window.setInterval(checkFindImg, 2000);
        if (!checkFindImg()) return;
        setManga({ show: true });
        // 自动启用自动加载功能
        await setOptions({ ...options, autoShow: true });
      });
      if (isRecorded) {
        await init();
        // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
        running = window.setInterval(checkFindImg, 2000);
        await GM.registerMenuCommand('停止在此站点自动运行脚本', async () => {
          await GM.deleteValue(window.location.hostname);
        });
      }
    });
  }
}
