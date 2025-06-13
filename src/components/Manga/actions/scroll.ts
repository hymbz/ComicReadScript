import { AnimationFrame, clamp, createRootMemo } from 'helper';

import { _setState, refs, setState, store } from '../store';

import {
  abreastScrollWidth,
  abreastContentWidth,
  abreastArea,
} from './abreastScroll';
import { isScrollMode, isAbreastMode, abreastColumnWidth } from './memo/common';
import { contentHeight, doubleScrollLineHeight, imgTopList } from './imageSize';
import { imgPageMap, scrollTop } from './memo/observer';
import { setOption } from './helper';

/** 滚动内容的总长度 */
export const scrollLength = createRootMemo(() => {
  if (store.option.scrollMode.enabled) {
    if (store.option.scrollMode.abreastMode) return abreastContentWidth();
    if (store.option.scrollMode.doubleMode)
      return doubleScrollLineHeight().reduce((sum, height) => sum + height, 0);
    return contentHeight();
  }
  return store.pageList.length;
});

/** 滚动内容的滚动进度 */
export const scrollProgress = createRootMemo(() => {
  if (isScrollMode()) return scrollTop();
  if (isAbreastMode()) return store.page.offset.x.px;
  return store.activePageIndex;
});

/** 滚动内容的滚动进度百分比 */
export const scrollPercentage = createRootMemo(
  () => scrollProgress() / scrollLength(),
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

/** 当前是否已经滚动到顶部 */
export const isTop = createRootMemo(() => scrollPercentage() === 0);

const _scrollTo = (x: number) =>
  refs.mangaBox.scrollTo({ top: x, behavior: 'instant' });

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

  frame = (timestamp: number) => {
    this.cancel();
    this.startTime ||= timestamp;
    /** 已滚动时间 */
    const elapsed = timestamp - this.startTime;
    if (elapsed >= this.duration)
      return _scrollTo(this.startTop + this.distance);
    _scrollTo(this.startTop + (elapsed / this.duration) * this.distance);
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

  frame = (timestamp: DOMHighResTimeStamp) => {
    if (!this.animationId) return;

    if (this.lastTime) {
      const scrollDelta = this.speed * (timestamp - this.lastTime);
      _scrollTo(scrollTop() + scrollDelta);
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

/** 在卷轴模式下滚动到指定进度 */
export const scrollTo = (x: number, smooth = false) => {
  if (!store.option.scrollMode.enabled) return;

  if (store.option.scrollMode.abreastMode) {
    _scrollTo(0);
    const val = clamp(0, x, abreastScrollWidth());
    return _setState('page', 'offset', 'x', 'px', val);
  }

  if (!smooth) {
    scrollStep.cancel();
    _scrollTo(x);
    return;
  }

  if (scrollStep.animationId) {
    scrollStep.cancel();
    _scrollTo(x);
  }

  scrollStep.start(x);
};

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
  } else if (store.option.scrollMode.doubleMode) {
    const pageNum = imgPageMap()[i];
    top = doubleScrollLineHeight()
      .slice(0, pageNum)
      .reduce((sum, height) => sum + height, 0);
  } else top = imgTopList()[i] + 1;
  scrollTo(top);
};

/** 跳转到指定图片的显示位置 */
export const jumpToImg = (index: number) => {
  if (store.option.scrollMode.enabled) return scrollViewImg(index);

  const pageNum = imgPageMap()[index];
  if (pageNum === undefined) return;
  setState((state) => {
    state.activePageIndex = pageNum;
    state.gridMode = false;
  });
};

/** 在卷轴模式下进行缩放，并且保持滚动进度不变 */
export const zoomScrollModeImg = (zoomLevel: number, set = false) => {
  const jump = saveScrollProgress();
  setOption((draftOption) => {
    const newVal = set
      ? zoomLevel
      : store.option.scrollMode.imgScale + zoomLevel;
    draftOption.scrollMode.imgScale = clamp(0.1, Number(newVal.toFixed(2)), 3);
  });
  jump();

  // 并排卷轴模式下并没有一个明确直观的滚动进度，
  // 也想不出有什么实现效果能和普通卷轴模式的效果一致,
  // 所以就摆烂不管了，反正现在这样也已经能避免乱跳了
};
