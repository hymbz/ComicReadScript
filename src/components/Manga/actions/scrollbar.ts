import { clamp } from 'helper';
import { createRootMemo } from 'helper/solidJs';

import { type PointerState, type UseDrag } from '../hooks/useDrag';
import { type State, store, refs, _setState } from '../store';

import { isAbreastMode } from './memo';
import {
  scrollLength,
  scrollPercentage,
  scrollTo,
  sliderHeight,
} from './scroll';

/** 滚动条元素的长度 */
export const scrollDomLength = createRootMemo(() =>
  Math.max(store.scrollbarSize.width, store.scrollbarSize.height),
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
      return store.flag.autoLong ? 'bottom' : 'right';
    }

    return store.option.scrollbar.position;
  },
);

/** 判断点击位置在滚动条上的位置比率 */
const getClickTop = (x: number, y: number, e: HTMLElement): number => {
  switch (scrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'rtl'
        ? 1 - x / e.offsetWidth
        : x / e.offsetWidth;

    default:
      return y / e.offsetHeight;
  }
};

/** 计算在滚动条上的拖动距离 */
const getSliderDist = (
  [x, y]: PointerState['xy'],
  [ix, iy]: PointerState['initial'],
  e: HTMLElement,
) => {
  switch (scrollPosition()) {
    case 'bottom':
    case 'top':
      return store.option.dir === 'rtl'
        ? (1 - (x - ix)) / e.offsetWidth
        : (x - ix) / e.offsetWidth;

    default:
      return (y - iy) / e.offsetHeight;
  }
};

/** 开始拖拽时的 sliderTop 值 */
let startTop = 0;
export const handlescrollbarSlider: UseDrag = ({ type, xy, initial }, e) => {
  const [x, y] = xy;

  // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
  if (type === 'up') return;

  if (!refs.mangaFlow) return;

  const scrollbarDom = e.target as HTMLElement;

  /** 点击位置在滚动条上的位置比率 */
  const clickTop = getClickTop(x, y, e.target as HTMLElement);

  if (store.option.scrollMode.enabled) {
    if (type === 'move') {
      const top =
        clamp(0, startTop + getSliderDist(xy, initial, scrollbarDom), 1) *
        scrollLength();
      scrollTo(top);
    } else {
      // 确保滚动条的中心会在点击位置
      startTop = clickTop - sliderHeight() / 2;
      const top = startTop * scrollLength();
      scrollTo(top, true);
    }
  } else {
    let newPageIndex = Math.floor(clickTop * store.pageList.length);
    // 处理超出范围的情况
    if (newPageIndex < 0) newPageIndex = 0;
    else if (newPageIndex >= store.pageList.length)
      newPageIndex = store.pageList.length - 1;

    if (newPageIndex !== store.activePageIndex)
      _setState('activePageIndex', newPageIndex);
  }
};
