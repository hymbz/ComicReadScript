import { approx, createEffectOn, createRootMemo, inRange } from 'helper';

import { setState, store } from '../../store';
import { resetImgState, updatePageData } from '../image';
import { isAbreastMode } from './options';

/** 记录每张图片所在的页面 */
export const imgPageMap = createRootMemo(() => {
  const map: Record<number, number> = {};
  for (let i = 0; i < store.pageList.length; i++) {
    for (const imgIndex of store.pageList[i])
      if (imgIndex !== -1) map[imgIndex] = i;
  }
  return map;
});

/** 滚动距离 */
export const scrollTop = createRootMemo(() =>
  isAbreastMode() ? store.page.offset.x.px : store.scrollTop,
);
export const bindScrollTop = (dom: HTMLElement) => {
  dom.addEventListener(
    'scroll',
    () => {
      // 跳过小于1像素的滚动事件，避免因小数问题引发的误差
      if (approx(dom.scrollTop, store.scrollTop)) return;
      setState('scrollTop', dom.scrollTop);
    },
    { passive: true },
  );
};

// 自动切换黑暗模式
const darkModeQuery = matchMedia('(prefers-color-scheme: dark)');
const autoSwitchDarkMode = (query: MediaQueryList | MediaQueryListEvent) => {
  if (!store.option.autoDarkMode) return;
  if (query.matches === store.option.darkMode) return;
  setState('option', 'darkMode', query.matches);
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
