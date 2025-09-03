import { createSignal } from 'solid-js';

import type { PointerState, UseDrag } from 'helper';

import { clamp, debounce } from 'helper';

import { refs, setState, store } from '../store';
import { scrollLength, scrollPosition, sliderHeight } from './memo';
import { saveReadProgress } from './readProgress';
import { scrollTo } from './scroll';

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

export const [isDrag, setIsDrag] = createSignal(false);
const closeDrag = debounce(() => setIsDrag(false), 200);

let lastType: PointerState['type'] = 'up';

/** 开始拖拽时的 sliderTop 值 */
let startTop = 0;
export const handleScrollbarSlider: UseDrag = ({ type, xy, initial }, e) => {
  const [x, y] = xy;

  // 检测是否是拖动操作
  if (type === 'move' && lastType === type) {
    setIsDrag(true);
    closeDrag();
  }
  lastType = type;

  // 跳过拖拽结束事件（单击时会同时触发开始和结束，就用开始事件来完成单击的效果
  if (type === 'up') return saveReadProgress();
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
      setState('activePageIndex', newPageIndex);
  }
};
