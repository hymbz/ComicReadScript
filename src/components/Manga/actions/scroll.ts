import { AnimationFrame, clamp, inRange } from 'helper';

import { refs, setState, store } from '../store';
import { openScrollLock } from './helper';
import {
  abreastArea,
  abreastColumnWidth,
  abreastScrollWidth,
  contentHeight,
  imgPageMap,
  pageTopList,
  scrollLength,
  scrollPercentage,
  scrollTop,
} from './memo';
import { handleEndTurnPage } from './turnPage';
import { zoom } from './zoom';

const _scrollTo = (top: number) => {
  const val = clamp(0, top, contentHeight() - store.rootSize.height);
  refs.mangaBox.scrollTo({
    top: val,
    behavior: 'instant',
  });
  setState((state) => {
    state.scrollTop = val;
    openScrollLock(state);
  });
};
/** 在卷轴模式下滚动到指定进度 */
export const scrollTo = (x: number, smooth = false) => {
  if (!store.option.scrollMode.enabled) return;

  if (store.option.scrollMode.abreastMode) {
    _scrollTo(0);
    const val = clamp(0, x, abreastScrollWidth());
    return setState('page', 'offset', 'x', 'px', val);
  }

  if (!smooth) {
    scrollStep.cancel();
    return _scrollTo(x);
  }

  if (scrollStep.animationId) {
    scrollStep.cancel();
    _scrollTo(x);
  }

  scrollStep.start(x);
};

/** 在卷轴模式下滚动指定进度 */
export const scrollBy = (offset: number, smooth = false) => {
  if (!store.option.scrollMode.enabled) return;
  if (handleEndTurnPage(offset > 0 ? 'next' : 'prev')) return;
  return scrollTo(scrollTop() + offset, smooth);
};

/** 实现卷轴模式下的平滑滚动 */
const scrollStep = new (class extends AnimationFrame {
  /** 动画时长 */
  duration = 100;
  /** 要滚动的距离 */
  distance = 0;
  /** 滚动开始时间 */
  startTime = 0;
  /** 滚动开始位置 */
  startTop = 0;

  scrollTo = (top: number) => {
    if (inRange(0, top, scrollLength())) scrollTo(top);
    else this.cancel();
  };

  frame = (timestamp: number) => {
    this.cancel();
    this.startTime ||= timestamp;
    /** 已滚动时间 */
    const elapsed = timestamp - this.startTime;
    if (elapsed >= this.duration)
      return this.scrollTo(this.startTop + this.distance);
    this.scrollTo(this.startTop + (elapsed / this.duration) * this.distance);
    this.call();
  };

  start = (x: number) => {
    this.startTime = 0;
    this.startTop = scrollTop();
    this.distance = x - this.startTop;
    this.frame(0);
  };
})();

/** 实现卷轴模式下的匀速滚动 */
export const constantScroll = new (class extends AnimationFrame {
  speed = 0;
  lastTime = 0;

  scrollTo = (top: number) => {
    if (inRange(0, top, scrollLength())) scrollTo(top);
    else this.cancel();
  };

  frame = (timestamp: DOMHighResTimeStamp) => {
    if (!this.animationId) return;

    if (this.lastTime) {
      const scrollDelta = this.speed * (timestamp - this.lastTime);
      this.scrollTo(scrollTop() + scrollDelta);
    }
    this.lastTime = timestamp;
    this.call();
  };

  start = (speed: number) => {
    if (this.animationId && speed === this.speed) return;

    this.cancel();
    this.speed = speed;
    this.lastTime = 0;
    this.call();
  };
})();

/** 保存当前滚动进度，并在之后恢复 */
export const saveScrollProgress = () => {
  const oldScrollPercentage = scrollPercentage();
  return () => scrollTo(oldScrollPercentage * scrollLength());
};

/** 在卷轴模式下，滚动到能显示指定图片的位置 */
export const scrollViewImg = (i: number) => {
  if (!store.option.scrollMode.enabled) return;

  let top: number;
  if (store.option.scrollMode.abreastMode) {
    const columnNum = abreastArea().columns.findIndex((column) =>
      column.includes(i),
    );
    top = columnNum * abreastColumnWidth() + 1;
  } else top = pageTopList()[i] + 1;
  scrollTo(top);
};

/** 跳转到指定图片的显示位置 */
export const jumpToImg = (index: number) => {
  zoom(100);
  setState('gridMode', false);
  if (store.option.scrollMode.enabled) return scrollViewImg(index);

  const pageNum = imgPageMap()[index];
  if (pageNum === undefined) return;
  setState((state) => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
};
