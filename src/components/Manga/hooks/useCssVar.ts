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

  'color-scheme': 'dark',
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

  'color-scheme': 'light',
};

const createSvgIcon = (fill: string, d: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='${fill}' viewBox='0 0 24 24'%3E%3Cpath d='${d}'/%3E%3C/svg%3E")`;

const MdImageNotSupported = `m21.9 21.9-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41zM5 18l3.5-4.5 2.5 3.01L12.17 15l3 3H5zm16 .17L5.83 3H19c1.1 0 2 .9 2 2v13.17z`;
const MdCloudDownload = `M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z`;
const MdPhoto = `M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z`;

export const cssVar = createRoot(() => {
  const svg = createMemo(() => {
    const fill = store.option.darkMode
      ? 'rgb(156,156,156)'
      : 'rgb(110,110,110)';

    return {
      '--MdImageNotSupported': createSvgIcon(fill, MdImageNotSupported),
      '--MdCloudDownload': createSvgIcon(fill, MdCloudDownload),
      '--MdPhoto': createSvgIcon(fill, MdPhoto),
    };
  });

  const _cssVar = createMemo<JSX.CSSProperties>(() => ({
    '--bg':
      store.option.customBackground ??
      (store.option.darkMode ? '#000' : '#fff'),
    '--scrollModeImgScale': store.option.scrollModeImgScale,
    '--scrollModeSpacing': store.option.scrollModeSpacing,
    '--img_placeholder_height': `${imgPlaceholderHeight()}px`,
    ...(store.option.darkMode ? dark : light),
    ...svg(),
  }));
  return _cssVar;
});
