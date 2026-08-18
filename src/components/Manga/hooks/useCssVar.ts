import { t } from 'helper';
import { type JSX } from 'solid-js';

import classes from '../index.module.css';
import { store } from '../store';
import { css } from './useStyle';

/** 主题颜色，通过 light-dark() 配合 color-scheme 自动选择深浅色 */
const themeStyle: JSX.CSSProperties = {
  '--hover-bg-color': 'light-dark(#0001, #FFF3)',
  '--hover-bg-color-enable': 'light-dark(#0009, #FFFa)',

  '--switch': 'light-dark(#FAFAFA, #BDBDBD)',
  '--switch-bg': 'light-dark(#9C9C9C, #6E6E6E)',

  '--page-bg': 'light-dark(white, #303030)',

  '--secondary': '#7A909A',
  '--secondary-bg': 'light-dark(#BAC5CA, #556065)',

  '--text': 'light-dark(black, white)',
  '--text-secondary': 'light-dark(#0008, #FFFC)',
  '--text-bg': 'light-dark(#FAFAFA, #121212)',
};

const createSvgIcon = (fill: string, d: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='${fill}' viewBox='0 0 24 24'%3E%3Cpath d='${d}'/%3E%3C/svg%3E")`;

const MdImageNotSupported = `m21.9 21.9-8.49-8.49-9.82-9.82L2.1 2.1.69 3.51 3 5.83V19c0 1.1.9 2 2 2h13.17l2.31 2.31 1.42-1.41zM5 18l3.5-4.5 2.5 3.01L12.17 15l3 3H5zm16 .17L5.83 3H19c1.1 0 2 .9 2 2v13.17z`;
const MdCloudDownload = `M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-4.65 4.65c-.2.2-.51.2-.71 0L7 13h3V9h4v4h3z`;
const MdPhoto = `M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86-3 3.87L9 13.14 6 17h12l-3.86-5.14z`;

export const useCssVar = () => {
  const svg = () => {
    const fill = store.option.darkMode
      ? 'rgb(156,156,156)'
      : 'rgb(110,110,110)';
    return {
      '--md-image-not-supported': createSvgIcon(fill, MdImageNotSupported),
      '--md-cloud-download': createSvgIcon(fill, MdCloudDownload),
      '--md-photo': createSvgIcon(fill, MdPhoto),
    };
  };

  const i18n = () => ({
    '--i18n-touch-area-prev': `"${t('hotkeys.page_up')}"`,
    '--i18n-touch-area-next': `"${t('hotkeys.page_down')}"`,
    '--i18n-touch-area-menu': `"${t('touch_area.menu')}"`,
  });

  css(`.${classes.root}`, [
    {
      '--bg': () =>
        store.option.customBackground ??
        (store.option.darkMode ? '#000' : '#fff'),
      '--scroll-mode-spacing': () => store.option.scrollMode.spacing,
      'color-scheme': () => (store.option.darkMode ? 'dark' : 'light'),
    },
    () => themeStyle,
    svg,
    i18n,
  ]);
};
