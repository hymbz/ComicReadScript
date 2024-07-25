import fs from 'node:fs';
import { dirname, resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import shell from 'shelljs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import styles from 'rollup-plugin-styles';
import solid from 'vite-plugin-solid';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import { watchExternal } from 'rollup-plugin-watch-external';
import { createServer } from 'vite';
import { parse } from 'marked';
import { leadingAndTrailing, throttle as throttle$1, debounce as debounce$1 } from '@solid-primitives/scheduled';
import 'fast-deep-equal/es6/index.js';
import axios from 'axios';
import { readFile } from 'node:fs/promises';
import { optimize } from 'svgo';
import pkg from './package.json' assert { type: 'json' };
import zh from './locales/zh.json' assert { type: 'json' };
import en from './locales/en.json' assert { type: 'json' };
import ru from './locales/ru.json' assert { type: 'json' };

const throttle = (fn, wait = 100) => leadingAndTrailing(throttle$1, fn, wait);
const debounce = (fn, wait = 100) => debounce$1(fn, wait);
const sleep = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
});
const clamp = (min, val, max) => Math.max(Math.min(max, val), min);
const inRange = (min, val, max) => val >= min && val <= max;
/** 判断两个数是否在指定误差范围内相等 */
const approx = (val, target, range) => Math.abs(target - val) <= range;
/** 根据传入的条件列表的真假，对 val 进行取反 */
const ifNot = (val, ...conditions) => {
    let res = Boolean(val);
    for (const v of conditions)
        if (v)
            res = !res;
    return res;
};
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
 * @param node 被添加元素
 * @param textnode 添加元素
 * @param referenceNode 参考元素，添加元素将插在参考元素前
 */
const insertNode = (node, textnode, referenceNode = null) => {
    const temp = document.createElement('div');
    temp.innerHTML = textnode;
    const frag = document.createDocumentFragment();
    while (temp.firstChild)
        frag.append(temp.firstChild);
    // eslint-disable-next-line unicorn/prefer-modern-dom-apis
    node.insertBefore(frag, referenceNode);
};
/** 返回 Dom 的点击函数 */
const querySelectorClick = (selector, textContent) => {
    let getDom;
    if (typeof selector === 'function')
        getDom = selector;
    else if (textContent) {
        getDom = () => querySelectorAll(selector).find((e) => e.textContent?.includes(textContent));
    }
    else
        getDom = () => querySelector(selector);
    if (getDom())
        return () => getDom()?.click();
};
/** 找出数组中出现最多次的元素 */
const getMostItem = (list) => {
    const counts = new Map();
    for (const val of list)
        counts.set(val, counts.get(val) ?? 0 + 1);
    // eslint-disable-next-line unicorn/no-array-reduce
    return [...counts.entries()].reduce((maxItem, item) => maxItem[1] > item[1] ? maxItem : item)[0];
};
/** 创建顺序数组 */
const createSequence = (length) => [
    ...Array.from({ length }).keys(),
];
/** 判断字符串是否为 URL */
const isUrl = (text) => {
    // 等浏览器版本上来后可以直接使用 URL.canParse
    try {
        return Boolean(new URL(text));
    }
    catch {
        return false;
    }
};
/** 将对象转为 URLParams 类型的字符串 */
const dataToParams = (data) => Object.entries(data)
    .map(([key, val]) => `${key}=${String(val)}`)
    .join('&');
/** 将 blob 数据作为文件保存至本地 */
const saveAs = (blob, name = 'download') => {
    const a = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    a.download = name;
    a.rel = 'noopener';
    a.href = URL.createObjectURL(blob);
    setTimeout(() => a.dispatchEvent(new MouseEvent('click')));
};
/** 滚动页面到指定元素的所在位置 */
const scrollIntoView = (selector, behavior = 'instant') => querySelector(selector)?.scrollIntoView({ behavior });
/** 循环执行指定函数 */
const loop = async (fn, ms = 0) => {
    await fn();
    setTimeout(loop, ms, fn);
};
/** 使指定函数延迟运行期间的多次调用直到运行结束 */
const singleThreaded = (callback, defaultContinueRun = true) => {
    const state = {
        running: false,
        continueRun: false,
    };
    const fn = async (...args) => {
        if (state.continueRun)
            return;
        if (state.running) {
            state.continueRun = defaultContinueRun;
            return;
        }
        let res;
        try {
            state.running = true;
            res = await callback(state, ...args);
        }
        catch (error) {
            state.continueRun = false;
            await sleep(100);
            throw error;
        }
        finally {
            state.running = false;
        }
        if (state.continueRun) {
            state.continueRun = false;
            setTimeout(fn, 0, ...args);
        }
        else
            state.running = false;
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
    // eslint-disable-next-line no-unmodified-loop-condition
    while (doneNum !== totalNum) {
        while (taskList.length > 0 && execPool.size < limit)
            taskList.shift()();
        await Promise.race(execPool);
    }
    return resList;
};
/**
 * 判断使用参数颜色作为默认值时是否需要切换为黑暗模式
 * @param hexColor 十六进制颜色。例如 #112233
 */
const needDarkMode = (hexColor) => {
    // by: https://24ways.org/2010/calculating-color-contrast
    const r = Number.parseInt(hexColor.slice(1, 3), 16);
    const g = Number.parseInt(hexColor.slice(3, 5), 16);
    const b = Number.parseInt(hexColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 128;
};
async function wait(fn, timeout = Number.POSITIVE_INFINITY) {
    let res = await fn();
    let _timeout = timeout;
    while (_timeout > 0 && !res) {
        await sleep(10);
        _timeout -= 10;
        res = await fn();
    }
    return res;
}
/** 等到指定的 dom 出现 */
const waitDom = (selector) => wait(() => querySelector(selector));
/** 等待指定的图片元素加载完成 */
const waitImgLoad = (img, timeout = 1000 * 10) => new Promise((resolve) => {
    const id = window.setTimeout(() => resolve(new ErrorEvent('timeout')), timeout);
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
const boolDataVal = (val) => (val ? '' : undefined);
/**
 *
 * 通过滚动到指定图片元素位置并停留一会来触发图片的懒加载，返回图片 src 是否发生变化
 *
 * 会在触发后重新滚回原位，当 time 为 0 时，因为滚动速度很快所以是无感的
 */
const triggerEleLazyLoad = async (e, time, isLazyLoaded) => {
    const nowScroll = window.scrollY;
    e.scrollIntoView({ behavior: 'instant' });
    e.dispatchEvent(new Event('scroll', { bubbles: true }));
    try {
        if (isLazyLoaded && time)
            return await wait(isLazyLoaded, time);
    }
    finally {
        window.scroll({ top: nowScroll, behavior: 'auto' });
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
        await wait(() => !error &&
            (image.naturalWidth || image.naturalHeight) &&
            (breakFn ? !breakFn() : true));
        if (error)
            return null;
        return [image.naturalWidth, image.naturalHeight];
    }
    catch (error_) {
        if (isDevMode)
            console.error('获取图片尺寸时出错', error_);
        return null;
    }
    finally {
        image.src = '';
    }
};
/** 测试图片 url 能否正确加载 */
const testImgUrl = (url) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
});
const canvasToBlob = (canvas, type, quality = 1) => new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), type, quality);
});
/**
 * 求 a 和 b 的差集，相当于从 a 中删去和 b 相同的属性
 *
 * 不会修改参数对象，返回的是新对象
 */
const difference = (a, b) => {
    const res = {};
    const keys = Object.keys(a);
    for (const key of keys) {
        if (typeof a[key] === 'object' && typeof b[key] === 'object') {
            const _res = difference(a[key], b[key]);
            if (Object.keys(_res).length > 0)
                res[key] = _res;
        }
        else if (a[key] !== b?.[key])
            res[key] = a[key];
    }
    return res;
};
const _assign = (a, b) => {
    const res = JSON.parse(JSON.stringify(a));
    const keys = Object.keys(b);
    for (const key of keys) {
        if (res[key] === undefined)
            res[key] = b[key];
        else if (typeof b[key] === 'object') {
            const _res = _assign(res[key], b[key]);
            if (Object.keys(_res).length > 0)
                res[key] = _res;
        }
        else if (res[key] !== b[key])
            res[key] = b[key];
    }
    return res;
};
/**
 * Object.assign 的深拷贝版，不会导致子对象属性的缺失
 *
 * 不会修改参数对象，返回的是新对象
 */
const assign = (target, ...sources) => {
    let res = target;
    for (let i = 0; i < sources.length; i += 1)
        if (sources[i] !== undefined)
            res = _assign(res, sources[i]);
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
            if (keys[i] === undefined)
                break;
            key += `.${keys[i]}`;
        }
        if (handleVal && i > keys.length - 2 && Reflect.has(target, key)) {
            const res = handleVal(target, key);
            while (i < keys.length - 1) {
                target = target[key];
                i += 1;
                key = keys[i];
            }
            if (res !== undefined)
                target[key] = res;
            break;
        }
        target = target[key];
    }
    if (target === obj)
        return null;
    return target;
};
const requestIdleCallback = (callback, timeout) => {
    if (Reflect.has(window, 'requestIdleCallback'))
        return window.requestIdleCallback(callback, { timeout });
    return window.setTimeout(callback, 16);
};
/**
 * 通过监视点击等会触发动态加载的事件，在触发后执行指定动作
 * @param update 动态加载后的重新加载
 */
const autoUpdate = (update) => {
    const refresh = singleThreaded(update);
    for (const eventName of ['click', 'popstate'])
        window.addEventListener(eventName, refresh, { capture: true });
    refresh();
};
/** 获取键盘事件的编码 */
const getKeyboardCode = (e) => {
    let { key } = e;
    switch (key) {
        case 'Shift':
        case 'Control':
        case 'Alt':
            return key;
    }
    if (e.ctrlKey)
        key = `Ctrl + ${key}`;
    if (e.altKey)
        key = `Alt + ${key}`;
    if (e.shiftKey)
        key = `Shift + ${key}`;
    return key;
};
/** 将快捷键的编码转换成更易读的形式 */
const keyboardCodeToText = (code) => code
    .replace('Control', 'Ctrl')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .replace('ArrowLeft', '←')
    .replace('ArrowRight', '→')
    .replace(/^\s$/, 'Space');
/** 将 HTML 字符串转换为 DOM 对象 */
const domParse = (html) => new DOMParser().parseFromString(html, 'text/html');
/** 监听键盘事件 */
const linstenKeydown = (handler) => window.addEventListener('keydown', (e) => {
    // 跳过输入框的键盘事件
    switch (e.target.tagName) {
        case 'INPUT':
        case 'TEXTAREA':
            return;
    }
    return handler(e);
});

const langList = ['zh', 'en', 'ru'];
/** 判断传入的字符串是否是支持的语言类型代码 */
const isLanguages = (lang) => Boolean(lang) && langList.includes(lang);
/** 返回浏览器偏好语言 */
const getBrowserLang = () => {
    let newLang;
    for (let i = 0; i < navigator.languages.length; i++) {
        const language = navigator.languages[i];
        const matchLang = langList.find((l) => l === language || l === language.split('-')[0]);
        if (matchLang) {
            newLang = matchLang;
            break;
        }
    }
    return newLang;
};
const getSaveLang = async () => typeof GM === 'undefined'
    ? localStorage.getItem('Languages')
    : GM.getValue('Languages');
const setSaveLang = async (val) => typeof GM === 'undefined'
    ? localStorage.setItem('Languages', val)
    : GM.setValue('Languages', val);
const getInitLang = async () => {
    const saveLang = await getSaveLang();
    if (isLanguages(saveLang))
        return saveLang;
    const lang = getBrowserLang() ?? 'zh';
    setSaveLang(lang);
    return lang;
};

const siteUrlFnMap = {
    async jm() {
        const res = await axios('https://jmcomic1.ltd');
        return [
            ...res.data
                .replaceAll('&nbsp;', '')
                .matchAll(/(?<=\n\s*)[-A-Za-z\d.]+?(?=<br)/g),
        ].flat();
    },
    async wnacg() {
        const res = await axios('https://wnacg01.org');
        return [...res.data.matchAll(/(?<=<i>)[-A-Za-z\d.]+?(?=<\/i>)/g)].flat();
    },
};
let siteUrlMap;
const initSiteUrlMap = async () => Object.fromEntries(await Promise.all(Object.entries(siteUrlFnMap).map(async ([name, fn]) => [name, await fn()])));
const siteUrl = {
    name: 'self-siteUrl',
    async renderChunk(rawCode) {
        siteUrlMap ||= await initSiteUrlMap();
        let code = rawCode;
        // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
        code = code.replaceAll(/case 'siteUrl#(.+?)':(.+?)(?={)/gs, (_, name, other) => {
            if (!Reflect.has(siteUrlMap, name))
                throw new Error(`未知站点：${name}`);
            const list = siteUrlMap[name].filter((url) => URL.canParse(`https://${url}`));
            if (list.length === 0)
                throw new Error(`未找到可用网址，${name}发布页已失效`);
            const otherUrlList = new Set([...other.matchAll(/(?<=case ').+?(?=':)/g)].flat());
            return `${list
                .filter((url) => !otherUrlList.has(url))
                .map((url) => `case '${url}':`)
                .join('\n    ')}${other}`;
        });
        return code;
    },
};

/** svgo 配置 */
const svgoConfig = {
    plugins: [
        'preset-default',
        'removeDimensions',
        {
            name: 'addAttributesToSVGElement',
            params: {
                attribute: {
                    stroke: 'currentColor',
                    fill: 'currentColor',
                    'stroke-width': '0',
                },
            },
        },
    ],
};
const optimizeSvg = (content, path) => {
    if (svgoConfig.datauri)
        throw new Error('禁止使用 datauri 选项');
    const result = optimize(content, { ...svgoConfig, path });
    return result.data;
};
/** 将导入的 svg 转为 solidjs 组件 */
function solidSvg() {
    const solidPlugin = solid();
    return {
        name: 'solid-svg',
        enforce: 'pre',
        async load(path) {
            if (!path.endsWith('svg'))
                return null;
            let code = await readFile(path, { encoding: 'utf8' });
            const optimized = optimizeSvg(code, path);
            code = optimized || code;
            return `export default (props = {}) => ${code
                .replaceAll(/([{}])/g, "{'$1'}")
                .replaceAll(/<!--\s*([\s\S]*?)\s*-->/g, '{/* $1 */}')
                .replace(/(?<=<svg.*?)(>)/i, ' {...props}>')}`;
        },
        transform(source, path) {
            if (!path.endsWith('svg'))
                return null;
            return solidPlugin.transform.bind(this)(source, `${path}.tsx`);
        },
    };
}

const __dirname$2 = dirname(fileURLToPath('file:///C:/Users/hymbz/GitHub/ComicReadScript/src/rollup-plugin/index.ts'));
const langMap = {};
for (const langName of langList) {
    const json = fs
        .readFileSync(resolve(__dirname$2, `../../locales/${langName}.json`))
        .toString();
    Reflect.set(langMap, langName, JSON.parse(json));
}
const extractI18n = {
    name: 'self-extractI18n',
    renderChunk(rawCode) {
        let code = rawCode;
        // 实现 extractI18n 函数
        if (code.includes('extractI18n')) {
            code = code.replaceAll(/extractI18n\('(.+)'\)/g, (_, key) => `((lang) => {
            switch (lang) {
              ${langList
                .filter((l) => l !== 'zh')
                .map((langName) => `case '${langName}': return '${byPath(langMap[langName], key)}';`)
                .join('')}
              default: return '${byPath(langMap.zh, key)}';
            }
          })`);
        }
        return code;
    },
};
const selfPlugins = [
    {
        name: 'self-clear',
        // 不输出 css 文件
        generateBundle(_, bundle) {
            Reflect.deleteProperty(bundle, 'style.css');
        },
        renderChunk(rawCode) {
            let code = rawCode;
            // 删除 Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" }); 语句
            code = code.replace(/Object\.defineProperty.+?\n\n/, '');
            // 删除 exports.require 语句
            code = code.replace(/\n\nexports\.require.+;/, '');
            // 删除单独的 require 语句和注释
            code = code.replaceAll(/\nrequire.+;|\n\/\*\*.+?\*\/\n(?=\n)|\n\/\/ .+?\n(?=\n)/g, '');
            return code;
        },
    },
    {
        name: 'self-inject',
        renderChunk(rawCode) {
            let code = rawCode;
            // 将 inject 函数调用替换为 dist 文件夹下的指定文件内容
            code = code.replaceAll(/ *inject\('(.+?)'\)/g, (_, name) => {
                switch (name) {
                    case 'main':
                        return `\`\n${fs
                            .readFileSync(resolve(__dirname$2, '../../dist/cache/main.js'))
                            .toString()
                            .replaceAll('\\', '\\\\')
                            .replaceAll('`', '\\`')
                            .replaceAll('${', '\\${')}\``;
                    default:
                        return fs
                            .readFileSync(resolve(__dirname$2, `../../dist/cache/${name}.js`))
                            .toString()
                            .replaceAll('require$1', 'require');
                }
            });
            return code;
        },
    },
    extractI18n,
    siteUrl,
];

const __dirname$1 = dirname(fileURLToPath('file:///C:/Users/hymbz/GitHub/ComicReadScript/metaHeader.ts'));
/**
 * 脚本依赖库与对应的 cdn url
 * 数组里的第一个 url 是生产模式下使用的，第二个是开发模式下使用的
 * 只有一个 url 表示不区分生产开发模式
 */
const resourceList = {
    'solid-js': [
        'https://registry.npmmirror.com/solid-js/1.8.17/files/dist/solid.cjs',
        'https://registry.npmmirror.com/solid-js/1.8.17/files/dist/dev.cjs',
    ],
    'solid-js/store': [
        'https://registry.npmmirror.com/solid-js/1.8.17/files/store/dist/store.cjs',
        'https://registry.npmmirror.com/solid-js/1.8.17/files/store/dist/dev.cjs',
    ],
    'solid-js/web': [
        'https://registry.npmmirror.com/solid-js/1.8.17/files/web/dist/web.cjs',
        'https://registry.npmmirror.com/solid-js/1.8.17/files/web/dist/dev.cjs',
    ],
    fflate: ['https://registry.npmmirror.com/fflate/0.8.2/files/umd/index.js'],
    'qr-scanner': [
        'https://registry.npmmirror.com/qr-scanner/1.4.2/files/qr-scanner.legacy.min.js',
    ],
    dmzjDecrypt: [
        'https://greasyfork.org/scripts/467177/code/dmzjDecrypt.js?version=1207199',
    ],
};
const resource = {
    dev: {},
    prod: {},
};
for (const [k, v] of Object.entries(resourceList)) {
    resource.prod[k] = v.at(0);
    resource.dev[k] = v.at(-1);
}
/** 根据 index.ts 的注释获取支持站点列表 */
const getSupportSiteList = () => {
    const indexCode = fs.readFileSync(resolve(__dirname$1, 'src/index.ts'), 'utf8');
    /** 支持站点列表 */
    return [...indexCode.matchAll(/(?<=\n\s+\/\/\s#).+(?=\n)/g)].map((e) => e[0]);
};
/** 更新 README 上的支持站点列表 */
const updateReadme = () => {
    const readmePath = resolve(__dirname$1, 'README.md');
    const readmeMd = fs.readFileSync(readmePath, 'utf8');
    const newMd = readmeMd.replace(/(?<=<!-- supportSiteList -->\n\n).*(?=\n\n<!-- supportSiteList -->)/s, getSupportSiteList()
        .slice(7)
        .map((siteText) => `- ${siteText}`)
        .join('\n'));
    if (newMd !== readmeMd)
        fs.writeFileSync(readmePath, newMd);
    // 生成一个用于 greasyfork 介绍的 md 文件，把相对链接改成文档外链，以便正常显示图片
    const outMdPath = resolve(__dirname$1, 'docs/index.md');
    const outMd = fs.readFileSync(outMdPath, 'utf8');
    const newOutMd = newMd.replaceAll('/docs/public/', 'https://comic-read-docs.pages.dev/');
    if (newOutMd !== outMd)
        fs.writeFileSync(outMdPath, newOutMd);
};
const enSupportSite = [
    'E-Hentai (Associate nhentai, Quick favorite, Colorize tags, Detect advertise page, etc.)',
    'nhentai (Totally block comics, Auto page turning)',
    'hitomi',
    'Anchira',
    'kemono',
    'nekohouse',
    'welovemanga',
];
/** 脚本头部注释 */
const getMetaData = (isDevMode) => {
    const meta = {
        name: pkg.name,
        namespace: pkg.name,
        version: pkg.version,
        description: `${zh.description}${getSupportSiteList()
            .map((site) => site.replace(/\[(.+)]\(.+\)/, '$1'))
            .join('、')}`,
        'description:en': `${en.description} ${enSupportSite.join(' | ')}.`,
        'description:ru': ru.description,
        author: pkg.author,
        license: pkg.license,
        noframes: true,
        match: '*://*/*',
        connect: [
            'yamibo.com',
            'dmzj.com',
            'idmzj.com',
            'exhentai.org',
            'e-hentai.org',
            'hath.network',
            'nhentai.net',
            'hypergryph.com',
            'mangabz.com',
            'copymanga.site',
            'copymanga.info',
            'copymanga.net',
            'copymanga.org',
            'copymanga.tv',
            'mangacopy.com',
            'xsskc.com',
            'self',
            '127.0.0.1',
            '*',
        ],
        grant: [
            'GM_addElement',
            'GM_getResourceText',
            'GM_addStyle',
            'GM_xmlhttpRequest',
            'GM.addValueChangeListener',
            'GM.removeValueChangeListener',
            'GM.getResourceText',
            'GM.getValue',
            'GM.setValue',
            'GM.listValues',
            'GM.deleteValue',
            'GM.registerMenuCommand',
            'GM.unregisterMenuCommand',
            'unsafeWindow',
        ],
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACBUExURUxpcWB9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i2B9i////198il17idng49DY3PT297/K0MTP1M3X27rHzaCxupmstbTByK69xOfr7bfFy3WOmqi4wPz9/X+XomSBjqW1vZOmsN/l6GmFkomeqe7x8vn6+kv+1vUAAAAOdFJOUwDsAoYli9zV+lIqAZEDwV05SQAAAUZJREFUOMuFk+eWgjAUhGPBiLohjZACUqTp+z/gJkqJy4rzg3Nn+MjhwB0AANjv4BEtdITBHjhtQ4g+CIZbC4Qb9FGb0J4P0YrgCezQqgIA14EDGN8fYz+f3BGMASFkTJ+GDAYMUSONzrFL7SVvjNQIz4B9VERRmV0rbJWbrIwidnsd6ACMlEoip3uad3X2HJmqb3gCkkJELwk5DExRDxA6HnKaDEPSsBnAsZoANgJaoAkg12IJqBiPACImXQKF9IDULIHUkOk7kDpeAMykHqCEWACy8ACdSM7LGSg5F3HtAU1rrkaK9uGAshXS2lZ5QH/nVhmlD8rKlmbO3ZsZwLe8qnpdxJRnLaci1X1V5R32fjd5CndVkfYdGpy3D+htU952C/ypzPtdt3JflzZYBy7fi/O1euvl/XH1Pp+Cw3/1P1xOZwB+AWMcP/iw0AlKAAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC',
        resource: resource[isDevMode ? 'dev' : 'prod'],
        supportURL: 'https://github.com/hymbz/ComicReadScript/issues',
        updateURL: 'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
        downloadURL: 'https://github.com/hymbz/ComicReadScript/raw/master/ComicRead.user.js',
    };
    const keyLength = Math.max(...Object.keys(meta).map((key) => key.length)) + 1;
    const createMetaHeader = (metaData) => {
        const _metaData = JSON.parse(JSON.stringify(metaData));
        // 将 @resource 中的 / 替换为 |，以兼容 ios 的油猴扩展
        for (const key of Object.keys(_metaData.resource)) {
            if (!key.includes('/'))
                continue;
            _metaData.resource[key.replaceAll('/', '|')] = _metaData.resource[key];
            Reflect.deleteProperty(_metaData.resource, key);
        }
        const metaText = Object.entries(_metaData)
            .filter(([, val]) => val)
            .map(([key, val]) => {
            switch (typeof val) {
                case 'boolean':
                    return `// @${key}`;
                case 'object':
                    return Array.isArray(val)
                        ? val
                            .map((v) => `// @${key.padEnd(keyLength, ' ')} ${v}`)
                            .join('\n')
                        : Object.entries(val)
                            .map(([k, v]) => `// @${key.padEnd(keyLength, ' ')} ${k} ${String(v)}`)
                            .join('\n');
                default:
                    return `// @${key.padEnd(keyLength, ' ')} ${val}`;
            }
        })
            .join('\n');
        return `// ==UserScript==\n${metaText}\n// ==/UserScript==\n\n`;
    };
    return {
        meta,
        createMetaHeader,
    };
};

const __dirname = dirname(fileURLToPath('file:///C:/Users/hymbz/GitHub/ComicReadScript/rollup.config.ts'));
const DEV_PORT = 2405;
const isDevMode$1 = process.env.NODE_ENV === 'development';
const latestChangeHtml = await (() => {
    const md = fs
        .readFileSync(resolve(__dirname, `docs/.other/LatestChange.md`))
        .toString();
    const newMd = md
        .match(/^### [^[].+?$|^\* .+?$/gm)
        .map((mdText) => {
        switch (mdText[0]) {
            case '#':
                return mdText
                    .replaceAll('Features', '新增')
                    .replaceAll('Bug Fixes', '修复')
                    .replaceAll('Performance Improvements', '优化');
            case '*':
                return mdText.replaceAll(/(?<=^\* ):\w+?: |(?<=^.*)\(\[\w+]\(.+?\)\).*/g, '');
            default:
                return '';
        }
    })
        .join('\n\n');
    return parse(newMd);
})();
const { meta, createMetaHeader } = getMetaData(isDevMode$1);
const generateScopedName = '[local]';
const buildOptions = (path, watchFiles, fn) => {
    const isUserScript = ['dev', 'index'].includes(path);
    const dir = isUserScript ? 'dist' : 'dist/cache';
    const fileName = path.endsWith('index.tsx')
        ? path.split('/')[1]
        : basename(path, extname(path));
    const options = {
        treeshake: true,
        external: [...Object.keys(meta.resource ?? {}), 'main', 'dmzjDecrypt'],
        input: resolve(__dirname, 'src', path),
        // 忽略使用 eval 的警告
        onwarn(warning, warn) {
            if (warning.code !== 'EVAL')
                warn(warning);
        },
        plugins: [
            replace({
                values: {
                    DEV_PORT: `${DEV_PORT}`,
                    isDevMode: `${isDevMode$1}`,
                    'process.env.NODE_ENV': isDevMode$1 ? `'development'` : `'production'`,
                    'inject@LatestChange': latestChangeHtml,
                },
                preventAssignment: true,
            }),
            alias({ entries: { helper: resolve(__dirname, 'src/helper') } }),
            json({ namedExports: false, indent: '  ' }),
            nodeResolve({ browser: true, extensions: ['.js', '.ts', '.tsx'] }),
            commonjs(),
            styles({
                mode: 'extract',
                modules: { generateScopedName },
            }),
            solidSvg(),
            babel({
                babelHelpers: 'runtime',
                extensions: ['.ts', '.tsx'],
                exclude: ['node_modules/**'],
                presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
                plugins: [
                    '@babel/plugin-transform-runtime',
                    [
                        '@babel/plugin-proposal-import-attributes-to-assertions',
                        { deprecatedAssertSyntax: true },
                    ],
                ],
            }),
            watchFiles && isDevMode$1 && watchExternal({ entries: watchFiles }),
        ],
        output: {
            file: `${dir}/${fileName}.js`,
            format: 'cjs',
            strict: false,
            generatedCode: 'es2015',
            extend: true,
            plugins: [
                ...selfPlugins,
                {
                    name: 'selfPlugin',
                    renderChunk(rawCode) {
                        let code = rawCode;
                        switch (path) {
                            case 'index':
                                updateReadme();
                                if (isDevMode$1)
                                    code = [
                                        `console.time('脚本启动消耗时间')`,
                                        code,
                                        `console.timeEnd('脚本启动消耗时间')`,
                                    ].join('\n');
                                code = createMetaHeader(meta) + code;
                                break;
                            case 'dev':
                                code =
                                    createMetaHeader({
                                        ...meta,
                                        name: `${meta.name}Test`,
                                        namespace: `${meta.namespace}Test`,
                                        updateURL: undefined,
                                        downloadURL: undefined,
                                    }) + code;
                                break;
                        }
                        return code;
                    },
                },
            ],
        },
    };
    return fn ? fn(options) : options;
};
// 清空 dist 文件夹
shell.rm('-rf', resolve(__dirname, 'dist/*'));
(async () => {
    if (!isDevMode$1)
        return;
    // 创建一个 dist 文件夹的文件服务器，用于在浏览器获取最新的脚本代码
    const server = await createServer({
        root: resolve(__dirname, 'src'),
        css: { modules: { generateScopedName } },
        server: {
            host: true,
            port: DEV_PORT,
            cors: false,
        },
        resolve: {
            alias: { helper: resolve(__dirname, 'src/helper') },
        },
        plugins: [
            {
                name: 'selfPlugin',
                enforce: 'pre',
                transform(code, id) {
                    if (id.includes('node_modules'))
                        return null;
                    let newCode = code;
                    newCode = newCode.replace('isDevMode', 'true');
                    // 将 rollup-plugin-styles 格式转换成 vite 支持的格式
                    newCode = newCode.replace(/, { css as style }( from '(.+?)';)/, `$1\nimport style from '$2?inline';`);
                    return newCode;
                },
            },
            solidSvg(),
            solid(),
        ],
    });
    // 开启组件的测试服务器
    await server.listen();
    server.printUrls();
})();
const optionList = [
    // // 打包 dmzjDecrypt 时用的配置
    // (() => {
    //   const options = buildOptions(
    //     'helper/dmzjDecrypt',
    //     undefined,
    //     terser({
    //       keep_classnames: true,
    //       keep_fnames: true,
    //       format: { beautify: true, ecma: 2015 },
    //     }),
    //   );
    //   options.output = { ...options.output, name: 'dmzjDecrypt', format: 'umd' };
    //   return options;
    // })(),
    buildOptions('dev'),
    buildOptions('main'),
    ...fs
        .readdirSync('src/site', { withFileTypes: true })
        .map((item) => item.isFile()
        ? buildOptions(`site/${item.name}`)
        : buildOptions(`site/${item.name}/index.tsx`)),
    buildOptions('helper/import', ['dist/cache/main.js']),
    buildOptions('index', ['dist/**/*', '!dist/index.js']),
];
if (!isDevMode$1)
    optionList.push(buildOptions('index', ['dist/**/*', '!dist/index.js'], (options) => {
        options.output.file = 'dist/adguard.js';
        Reflect.deleteProperty(options.output, 'dir');
        options.output.plugins.push({
            name: 'selfAdGuardPlugin',
            renderChunk(rawCode) {
                let code = rawCode;
                // 不知道为啥俄罗斯访问不了 npmmirror
                // https://github.com/hymbz/ComicReadScript/issues/170
                // 或许和 unpkg 功能的白名单<https://github.com/cnpm/unpkg-white-list>有关
                // <https://sleazyfork.org/zh-CN/scripts/374903/discussions/248665>
                // 可能再过一段时间就能恢复？但总之目前只能先改用 jsdelivr
                code = code.replaceAll(/@resource .+? https:\/\/registry.npmmirror.com\/.+(?=\n)/g, (text) => text
                    .replace('registry.npmmirror.com/', 'cdn.jsdelivr.net/npm/')
                    .replace(/(npm\/[^/]+)\//, '$1@')
                    .replace('files/', ''));
                // AdGuard 无法支持简易阅读模式，所以改为只在支持网站上运行
                const indexCode = fs.readFileSync(resolve(__dirname, 'src/index.ts'), 'utf8');
                const matchList = [
                    ...indexCode.matchAll(/(?<=\n\s+case ').+?(?=':)/g),
                ]
                    .filter(([url]) => !url.includes('siteUrl#'))
                    .flatMap(([url]) => `// @match           *://${url}/*`);
                code = code.replace(/\/\/ @match \s+ \*:\/\/\*\/\*/, matchList.join('\n'));
                // 删掉不支持的菜单 api
                code = code.replaceAll(/\/\/ @grant \s+ GM\.(registerMenuCommand|unregisterMenuCommand)\n/g, '');
                // 把菜单 api 的调用也改掉
                code = code.replaceAll(/await GM\.(registerMenuCommand|unregisterMenuCommand)/g, 'console.debug');
                // 脚本更新链接也换掉
                code = code.replaceAll('/raw/master/ComicRead.user.js', '/raw/master/ComicRead-AdGuard.user.js');
                // 不知道为啥会提示 'Access to function "GM_getValue" is not allowed.'
                // 明明我用的是 GM.getValue。虽然好像对功能没有影响，但以防万一还是加上吧
                code = code.replace(/\n(?=\/\/ @grant)/, '\n// @grant           GM_getValue\n// @grant           GM_setValue\n');
                return code;
            },
        });
        return options;
    }));

export { buildOptions, optionList as default };
