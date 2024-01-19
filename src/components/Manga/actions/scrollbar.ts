import { createRoot, createSignal } from 'solid-js';
import { clamp } from 'helper';
import { createEffectOn, createRootMemo } from 'helper/solidJs';
import type { PointerState, UseDrag } from '../hooks/useDrag';
import type { State } from '../store';
import { store, refs, _setState } from '../store';
import { contentHeight, rootSize, scrollTop } from './memo';
import { scrollTo } from './helper';

const [_scrollLength, setScrollLength] = createSignal(0);
/** 滚动条元素的长度 */
export const scrollLength = _scrollLength;

/** 滚动条滑块长度 */
export const sliderHeight = createRootMemo(() =>
  store.option.scrollMode
    ? rootSize().height / contentHeight()
    : 1 / store.pageList.length,
);

/** 滚动条滑块高度 */
export const sliderTop = createRootMemo(() =>
  store.option.scrollMode
    ? scrollTop() / contentHeight()
    : (1 / store.pageList.length) * store.activePageIndex,
);

/** 滚动条滑块的中心点高度 */
export const sliderMidpoint = createRootMemo(
  () => scrollLength() * (sliderTop() + sliderHeight() / 2),
);

/** 滚动条位置 */
export const scrollPosition = createRootMemo(
  (): State['option']['scrollbar']['position'] => {
    if (store.option.scrollbar.position === 'auto') {
      if (store.isMobile) return 'top';
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
      return store.option.dir === 'ltr'
        ? (x - ix) / e.offsetWidth
        : (1 - (x - ix)) / e.offsetWidth;

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

  if (store.option.scrollMode) {
    if (type === 'move') {
      scrollTo(
        clamp(0, startTop + getSliderDist(xy, initial, scrollbarDom), 1) *
          contentHeight(),
      );
    } else {
      // 确保滚动条的中心会在点击位置
      startTop = clickTop - sliderHeight() / 2;
      scrollTo(startTop * contentHeight(), true);
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

createRoot(() => {
  // 更新 scrollLength
  createEffectOn([scrollPosition, rootSize], () => {
    if (!refs.scrollbar) return;
    // 部分情况下，在窗口大小改变后滚动条大小不会立刻跟着修改，需要等待一帧渲染
    // 比如打开后台标签页后等一会再切换过去
    requestAnimationFrame(() =>
      setScrollLength(
        Math.max(refs.scrollbar.clientWidth, refs.scrollbar.clientHeight),
      ),
    );
  });
});
