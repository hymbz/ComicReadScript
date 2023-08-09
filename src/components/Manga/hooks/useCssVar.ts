import type { JSX } from 'solid-js';
import { createRoot, createMemo } from 'solid-js';

import { store } from './useStore';
import { imgPlaceholderHeight } from './useStore/slice';

interface CssVar {
  '--hover_bg_color': string;
  '--hover_bg_color_enable': string;

  /* 开关按钮 */
  '--switch': string;
  /* 开关滑轨 */
  '--switch_bg': string;
  /* 滚动条 */
  '--scrollbar_drag': string;

  '--page_bg': string;

  '--secondary': string;
  '--secondary_bg': string;

  '--text': string;
  '--text_secondary': string;
  '--text_bg': string;

  [key: string]: string;
}

/** 深色模式的 css 变量 */
const dark: CssVar = {
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
const light: CssVar = {
  '--hover_bg_color': '#0001',
  '--hover_bg_color_enable': '#0009',

  '--switch': '#FAFAFA',
  '--switch_bg': '#9C9C9C',
  '--scrollbar_drag': '#0006',

  '--page_bg': 'white',

  '--secondary': '#7A909A',
  '--secondary_bg': '#BAC5CA',

  '--text': 'black',
  '--text_secondary': '#0008',
  '--text_bg': '#FAFAFA',
};

export const cssVar = createRoot(() => {
  const _cssVar = createMemo<JSX.CSSProperties>(() => ({
    '--bg':
      store.option.customBackground ??
      (store.option.darkMode ? '#000000' : '#ffffff'),
    '--scrollModeImgScale': store.option.scrollModeImgScale,
    '--img_placeholder_height': `${imgPlaceholderHeight()}px`,
    ...(store.option.darkMode ? dark : light),
  }));
  return _cssVar;
});
