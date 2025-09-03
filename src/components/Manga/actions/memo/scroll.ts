import { createRootMemo } from '../../../../helper';
import { type State, store } from '../../store';
import { abreastContentWidth } from './abreastScroll';
import { scrollTop } from './observer';
import { isAbreastMode, isScrollMode } from './options';
import { contentHeight } from './scrollMode';

/** 滚动内容的滚动进度 */
export const scrollProgress = createRootMemo(() => {
  if (store.option.scrollMode.enabled) return scrollTop();
  return store.activePageIndex;
});

/** 滚动内容的总长度 */
export const scrollLength = createRootMemo(() => {
  if (store.option.scrollMode.enabled) {
    if (store.option.scrollMode.abreastMode) return abreastContentWidth();
    return contentHeight();
  }
  return store.pageList.length;
});

/** 滚动内容的滚动进度百分比 */
export const scrollPercentage = createRootMemo(
  () => scrollProgress() / scrollLength(),
);

/** 当前是否已经滚动到顶部 */
export const isTop = createRootMemo(() => scrollPercentage() === 0);

/** 滚动条元素的长度 */
export const scrollDomLength = createRootMemo(() =>
  Math.max(store.scrollbarSize.width, store.scrollbarSize.height),
);

/** 滚动条滑块长度 */
export const sliderHeight = createRootMemo(() => {
  let itemLength = 1;
  if (isScrollMode()) itemLength = store.rootSize.height;
  if (isAbreastMode()) itemLength = store.rootSize.width;
  return itemLength / scrollLength();
});

/** 当前是否已经滚动到底部 */
export const isBottom = createRootMemo(
  () => scrollPercentage() + sliderHeight() >= 0.9999,
);

/** 滚动条滑块的中心点高度 */
export const sliderMidpoint = createRootMemo(
  () => scrollDomLength() * (scrollPercentage() + sliderHeight() / 2),
);

/** 滚动条滑块的位置 */
export const sliderTop = createRootMemo(
  () => `${scrollPercentage() * scrollDomLength()}px`,
);

/** 滚动条位置 */
export const scrollPosition = createRootMemo(
  (): State['option']['scrollbar']['position'] => {
    if (store.option.scrollbar.position === 'auto') {
      if (store.isMobile) return 'top';
      if (isAbreastMode()) return 'bottom';
      // 大部分图片都是宽图时，将滚动条移至底部
      return store.defaultImgType === 'long' ? 'bottom' : 'right';
    }

    return store.option.scrollbar.position;
  },
);
