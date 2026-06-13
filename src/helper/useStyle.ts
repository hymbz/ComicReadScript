import { type Accessor, type JSX } from 'solid-js';

import { createEffectOn, createRootMemo, onAutoMount } from './solidJs';

const useStyleSheet = (e?: Element | null) => {
  const styleSheet = new CSSStyleSheet();

  onAutoMount(() => {
    const root = (e?.getRootNode() as Document) ?? document;
    root.adoptedStyleSheets = [...root.adoptedStyleSheets, styleSheet];
    return () => {
      const index = root.adoptedStyleSheets.indexOf(styleSheet);
      if (index !== -1) root.adoptedStyleSheets.splice(index, 1);
    };
  });

  return styleSheet;
};

const useStyle = (cssText: string | Accessor<string>, e?: Element | null) => {
  const styleSheet = useStyleSheet(e);
  if (typeof cssText === 'string') styleSheet.replaceSync(cssText);
  else
    createEffectOn(createRootMemo(cssText), (style) =>
      styleSheet.replaceSync(style),
    );
};

export type StyleMap = {
  [P in keyof JSX.CSSProperties]: Accessor<JSX.CSSProperties[P]>;
};

/**
 * 将同一帧内的所有 CSS 变更合并为一次 DOM 写入
 *
 * 避免相关属性因更新时序不一致导致浏览器判定值无效
 */
const setStyle = (() => {
  const list: [CSSStyleDeclaration, string, string | number | undefined][] = [];
  let id = 0;

  const flush = () => {
    id = 0;
    for (const [style, key, val] of list) {
      if (val === undefined || val === '') style.removeProperty(key);
      else style.setProperty(key, typeof val === 'string' ? val : `${val}`);
    }
    list.length = 0;
  };

  return (style: CSSStyleDeclaration, key: string, val?: string | number) => {
    list.push([style, key, val]);
    id ||= requestAnimationFrame(flush);
  };
})();

/** 用 CSSStyleSheet 实现和修改 style 一样的效果 */
const useStyleMemo = (
  selector: string | Accessor<string>,
  styleMapArg: (StyleMap | Accessor<JSX.CSSProperties>)[] | StyleMap,
  e?: Element,
) => {
  const styleSheet = useStyleSheet(e);
  const getSelector =
    typeof selector === 'string' ? () => selector : createRootMemo(selector);

  styleSheet.insertRule(`${getSelector()} { }`);
  const { style } = styleSheet.cssRules[0] as CSSStyleRule;
  if (typeof selector !== 'string')
    createEffectOn(getSelector, (s) => {
      (styleSheet.cssRules[0] as CSSStyleRule).selectorText = s;
    });
  // 等火狐实现了 CSS Typed OM 后改用 styleMap 性能会更好，也能使用 CSS Typed OM 的 单位

  const styleMapList = Array.isArray(styleMapArg) ? styleMapArg : [styleMapArg];
  for (const styleMap of styleMapList) {
    if (typeof styleMap === 'object') {
      for (const [key, val] of Object.entries(styleMap)) {
        const styleText = createRootMemo(val);
        createEffectOn(styleText, (newVal) => setStyle(style, key, newVal));
      }
    } else {
      const styleMemoMap = createRootMemo(styleMap);
      createEffectOn(styleMemoMap, (map) => {
        for (const [key, val] of Object.entries(map)) setStyle(style, key, val);
      });
    }
  }
};

/**
 * 通过 CSSStyleSheet 注入全局样式，自动将样式挂载到当前文档或 shadow DOM 的 root 上。
 *
 * 支持三种调用方式：
 *
 * 1. **标签模板** — 模板中的表达式可以是普通值，也可以是函数（会自动追踪响应式变化）。
 *    将 Element 作为模板的第一个插值可以让样式挂载到正确的 root 上。
 *
 *    @example
 *    css`#comicRead { position: fixed; top: 0; left: 0; }`
 *    @example
 *    css`${shadowElement}
 *      .foo { color: ${getComputedStyle(el).color}; }
 *    `
 *
 * 2. **CSS 文本** — 字符串或响应式信号，信号变化时自动更新。
 *    可传入 Element 指定样式挂载到正确的 root 上。
 *
 *    @example
 *    css(cssText)
 *    @example
 *    css(cssText, shadowElement)
 *    @example
 *    css(createRootMemo(() => `.ad { filter: blur(8px); }`))
 *
 * 3. **选择器 + 样式映射** — 属性级的响应式更新，避免全量 CSS 重解析。
 *    支持 StyleMap、Accessor<JSX.CSSProperties>、
 *    以及二者的混合数组。可传入 Element 指定样式挂载到正确的 root 上。
 *
 *    @example
 *    css('#fab', { '--left': () => `${x}px` })
 *    @example
 *    css('.root', { '--bg': () => bg }, shadowElement)
 *    @example
 *    css('.root', () => (dark ? darkStyle : lightStyle))
 *    @example
 *    css('.root', [{ '--bg': () => bg }, () => themeStyle])
 */
export function css(styles: TemplateStringsArray, ...values: any[]): void;
export function css(
  cssText: string | Accessor<string>,
  e?: Element | null,
): void;
export function css(
  selector: string | Accessor<string>,
  styleMap:
    | StyleMap
    | Accessor<JSX.CSSProperties>
    | (StyleMap | Accessor<JSX.CSSProperties>)[],
  e?: Element,
): void;
export function css(
  arg1: TemplateStringsArray | string | Accessor<string>,
  arg2?: any,
  ...rest: any[]
): void {
  if (typeof arg1 !== 'object' || !('raw' in arg1)) {
    if (arg2 instanceof Element || arg2 === null || arg2 === undefined)
      return useStyle(arg1, arg2 as Element | undefined);
    return useStyleMemo(arg1, arg2, rest[0] as Element | undefined);
  }

  const [styles, ...values] = [arg1, arg2, ...rest];
  let e: Element | undefined;
  let startIdx = 0;

  if (values[0] instanceof Element) {
    [e] = values;
    startIdx = 1;
  }

  useStyle(() => {
    let text = styles[startIdx];
    for (let i = startIdx; i < values.length; i++)
      text += `${
        typeof values[i] === 'function'
          ? (values[i] as () => unknown)()
          : values[i]
      }${styles[i + 1]}`;
    return text;
  }, e);
}
