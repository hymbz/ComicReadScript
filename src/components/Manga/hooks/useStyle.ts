import { type Accessor, onMount, onCleanup, type JSX } from 'solid-js';
import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { refs } from '../store';

const useStyleSheet = () => {
  const styleSheet = new CSSStyleSheet();

  onMount(() => {
    const root = refs.root.getRootNode() as Document;
    root.adoptedStyleSheets.push(styleSheet);
    onCleanup(() => {
      const index = root.adoptedStyleSheets.indexOf(styleSheet);
      if (index !== -1) root.adoptedStyleSheets.splice(index, 1);
    });
  });

  return styleSheet;
};

export const useStyle = (css: Accessor<string>) => {
  const styleSheet = useStyleSheet();
  createEffectOn(css, (style) => styleSheet.replaceSync(style));
};

type StyleMap = {
  [P in keyof JSX.CSSProperties]: Accessor<JSX.CSSProperties[P]>;
};

/** 用 CSSStyleSheet 实现和修改 style 一样的效果 */
export const useStyleMemo = (
  selector: string,
  ...styleMapList: Array<StyleMap | Accessor<JSX.CSSProperties>>
) => {
  const styleSheet = useStyleSheet();
  styleSheet.insertRule(`${selector} { }`);

  const { style } = styleSheet.cssRules[0] as CSSStyleRule;
  // 等火狐实现了 CSS Typed OM 后改用 styleMap 性能会更好，也能使用 CSS Typed OM 的 单位

  const setStyle = (key: string, val?: string | number) => {
    if (val === undefined || val === '') return style.removeProperty(key);
    style.setProperty(key, typeof val === 'string' ? val : `${val}`);
  };

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
