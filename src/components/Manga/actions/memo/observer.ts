import { createSignal } from 'solid-js';
import { inRange, createEffectOn, createRootMemo } from 'helper';

import { store, setState, _setState } from '../../store';
import { resetImgState, updatePageData } from '../image';

import { isAbreastMode } from './common';

/** 记录每张图片所在的页面 */
export const imgPageMap = createRootMemo(() => {
  const map: Record<number, number> = {};
  for (let i = 0; i < store.pageList.length; i++) {
    for (const imgIndex of store.pageList[i])
      if (imgIndex !== -1) map[imgIndex] = i;
  }
  return map;
});

const [_scrollTop, setScrollTop] = createSignal(0);
/** 卷轴模式下的滚动距离 */
export const scrollModTop = _scrollTop;
/** 滚动距离 */
export const scrollTop = createRootMemo(() =>
  isAbreastMode() ? store.page.offset.x.px : scrollModTop(),
);
export const bindScrollTop = (dom: HTMLElement) => {
  dom.addEventListener('scroll', () => setScrollTop(dom.scrollTop), {
    passive: true,
  });
};

// 自动切换黑暗模式
const darkModeQuery = matchMedia('(prefers-color-scheme: dark)');
const autoSwitchDarkMode = (query: MediaQueryList | MediaQueryListEvent) => {
  if (!store.option.autoDarkMode) return;
  if (query.matches === store.option.darkMode) return;
  _setState('option', 'darkMode', query.matches);
};
darkModeQuery.addEventListener('change', autoSwitchDarkMode);
autoSwitchDarkMode(darkModeQuery);
createEffectOn(
  () => store.option.autoDarkMode,
  () => autoSwitchDarkMode(darkModeQuery),
);

// 窗口宽度小于800像素时，标记为移动端
createEffectOn(
  () => store.rootSize.width,
  (width) => {
    const isMobile = inRange(1, width, 800);
    if (isMobile === store.isMobile) return;
    setState((state) => {
      state.isMobile = isMobile;
      resetImgState(state);
      updatePageData(state);
    });
  },
);
