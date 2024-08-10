import { getOwner, type Accessor, type JSX } from 'solid-js';
import { createEffectOn, createRootMemo, onAutoMount } from 'helper';
import type { Computation } from 'solid-js/types/reactive/signal';

const useStyleSheet = () => {
  const styleSheet = new CSSStyleSheet();

  onAutoMount((owner) => {
    let root: Document;

    if (owner) {
      let _owner = getOwner() as Computation<unknown>;
      while (_owner && !_owner.value)
        _owner = _owner.owner as Computation<unknown>;
      if (_owner === null) throw new Error('owner not found');
      root = (_owner.value as HTMLElement).getRootNode() as Document;
    } else root = document;

    root.adoptedStyleSheets = [...root.adoptedStyleSheets, styleSheet];
    return () => {
      const index = root.adoptedStyleSheets.indexOf(styleSheet);
      if (index !== -1) root.adoptedStyleSheets.splice(index, 1);
    };
  });

  return styleSheet;
};

export const useStyle = (css: Accessor<string> | string) => {
  const styleSheet = useStyleSheet();
  if (typeof css === 'string') styleSheet.replaceSync(css);
  else createEffectOn(css, (style) => styleSheet.replaceSync(style));
};

export type StyleMap = {
  [P in keyof JSX.CSSProperties]: Accessor<JSX.CSSProperties[P]>;
};

/** 用 CSSStyleSheet 实现和修改 style 一样的效果 */
export const useStyleMemo = (
  selector: string,
  styleMapArg: Array<StyleMap | Accessor<JSX.CSSProperties>> | StyleMap,
) => {
  const styleSheet = useStyleSheet();
  styleSheet.insertRule(`${selector} { }`);

  const { style } = styleSheet.cssRules[0] as CSSStyleRule;
  // 等火狐实现了 CSS Typed OM 后改用 styleMap 性能会更好，也能使用 CSS Typed OM 的 单位

  const setStyle = (key: string, val?: string | number) => {
    if (val === undefined || val === '') return style.removeProperty(key);
    style.setProperty(key, typeof val === 'string' ? val : `${val}`);
  };

  const styleMapList = Array.isArray(styleMapArg) ? styleMapArg : [styleMapArg];
  for (const styleMap of styleMapList) {
    if (typeof styleMap === 'object') {
      for (const [key, val] of Object.entries(styleMap)) {
        const styleText = createRootMemo(val);
        createEffectOn(styleText, (newVal) => setStyle(key, newVal));
      }
    } else {
      const styleMemoMap = createRootMemo(styleMap);
      createEffectOn(styleMemoMap, (map) => {
        for (const [key, val] of Object.entries(map)) setStyle(key, val);
      });
    }
  }
};
