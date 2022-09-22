import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { useStore } from './useStore';

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
  '--hover_bg_color': 'white2',
  '--hover_bg_color_enable': 'whitea',

  '--switch': '#bdbdbd',
  '--switch_bg': '#6e6e6e',
  '--scrollbar_drag': 'white3',

  '--page_bg': '#303030',

  '--secondary': '#7a909a',
  '--secondary_bg': '#556065',

  '--text': 'white',
  '--text_secondary': 'whitec',
  '--text_bg': '#121212',
};

/** 浅色模式的 css 变量 */
const light: CssVar = {
  '--hover_bg_color': '#0001',
  '--hover_bg_color_enable': '#0009',

  /* 开关按钮 */
  '--switch': '#fafafa',
  /* 开关滑轨 */
  '--switch_bg': '#9c9c9c',
  /* 滚动条 */
  '--scrollbar_drag': '#0003',

  '--page_bg': 'white',

  '--secondary': '#7a909a',
  '--secondary_bg': '#bac5ca',

  '--text': 'black',
  '--text_secondary': '#0008',
  '--text_bg': '#fafafa',
};

export const useCssVar = (): CSSProperties => {
  const bg = useStore((state) => state.option.customBackground);
  const darkMode = useStore((state) => state.option.darkMode);

  return useMemo(
    () =>
      ({
        '--bg': bg ?? darkMode ? 'black' : 'white',
        ...(darkMode ? dark : light),
      } as CSSProperties),
    [bg, darkMode],
  );
};
