import { createSignal } from 'solid-js';
import { inRange } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { store, _setState } from '../../store';

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

// 窗口宽度小于800像素时，标记为移动端
createEffectOn(
  () => store.rootSize,
  ({ width }) => _setState('isMobile', inRange(1, width, 800)),
);
