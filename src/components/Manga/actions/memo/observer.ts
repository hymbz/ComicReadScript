import { createRoot, createSignal } from 'solid-js';
import { inRange } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';

import { store, _setState } from '../../store';
import { useDomSize } from '../../hooks/useDomSize';

import { isAbreastMode } from './common';

/** 记录每张图片所在的页面 */
export const imgPageMap = createRootMemo(() => {
  const map: Record<number, number> = {};
  for (let i = 0; i < store.pageList.length; i++) {
    store.pageList[i].forEach((imgIndex) => {
      if (imgIndex !== -1) map[imgIndex] = i;
    });
  }

  return map;
});
export const [rootSize, watchRootSize] = useDomSize();
export const [flowSize, watchFlowSize] = useDomSize();

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
createEffectOn(rootSize, ({ width }) =>
  _setState('isMobile', inRange(1, width, 800)),
);
