import { AnimationFrame, clamp } from 'helper';

import { type State, setState, store } from '../store';
import { type Dir } from './endPage';
import { resetPage } from './show';
import { turnPage } from './turnPage';

/** 拖动松手翻页动画时长（固定） */
export const DRAG_TURN_ANIMATION_DURATION = 100;

/** 缓动函数：先慢后快再慢 */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** 将 mangaFlow 偏移到指定页在 renderRange 中的位置 */
const setOffsetToPage = (state: State, pageIndex: number) => {
  const i = pageIndex - state.renderRange[0];
  state.page.offset.x.pct = state.page.vertical ? 0 : i;
  state.page.offset.y.pct = state.page.vertical ? -i : 0;
  state.page.offset.x.px = 0;
  state.page.offset.y.px = 0;
};

/** 计算翻页动画的起点偏移（像素） */
const getTurnStartOffsets = ({
  state,
  oldIndex,
  oldRenderRange,
  oldOffset,
}: {
  state: State;
  oldIndex: number;
  oldRenderRange: [number, number];
  oldOffset: State['page']['offset'];
}) => {
  const [rangeStart, rangeEnd] = state.renderRange;
  const startIndex = clamp(oldIndex, rangeStart, rangeEnd);

  if (oldIndex >= rangeStart && oldIndex <= rangeEnd) {
    const size = state.page.vertical
      ? state.rootSize.height
      : state.rootSize.width;
    const oldInternal = state.page.vertical
      ? oldOffset.y.pct * size + oldOffset.y.px
      : oldOffset.x.pct * size + oldOffset.x.px;
    const oldAbs =
      oldRenderRange[0] +
      (state.page.vertical ? -oldInternal / size : oldInternal / size);
    const startInternal = state.page.vertical
      ? clamp(-(oldAbs - rangeStart) * size, -(rangeEnd - rangeStart) * size, 0)
      : clamp((oldAbs - rangeStart) * size, 0, (rangeEnd - rangeStart) * size);
    return {
      x: state.page.vertical ? 0 : startInternal,
      y: state.page.vertical ? startInternal : 0,
    };
  }

  setOffsetToPage(state, startIndex);
  return {
    x: state.page.offset.x.pct * state.rootSize.width + state.page.offset.x.px,
    y: state.page.offset.y.pct * state.rootSize.height + state.page.offset.y.px,
  };
};

const turnPageAnimator = new (class extends AnimationFrame {
  /** 动画令牌，用于丢弃失效的帧回调 */
  token = 0;
  /** 本次动画时长 */
  duration = 0;
  /** 本次动画开始时间 */
  startTime = 0;
  /** 起点偏移（像素） */
  from = { x: 0, y: 0 };
  /** 终点偏移（像素） */
  to = { x: 0, y: 0 };
  /** 终点页对应的 pct，动画期间保持该值不变 */
  toPct = { x: 0, y: 0 };

  frame = (timestamp: DOMHighResTimeStamp) => {
    const { token } = this;
    if (this.startTime === 0) this.startTime = timestamp;
    const elapsed = timestamp - this.startTime;
    const progress = Math.min(1, elapsed / this.duration);
    const t = easeInOutCubic(progress);
    const x = this.from.x + (this.to.x - this.from.x) * t;
    const y = this.from.y + (this.to.y - this.from.y) * t;

    setState((state) => {
      if (token !== this.token) return;
      state.page.offset.x.pct = this.toPct.x;
      state.page.offset.y.pct = this.toPct.y;
      state.page.offset.x.px = x - this.toPct.x * state.rootSize.width;
      state.page.offset.y.px = y - this.toPct.y * state.rootSize.height;
    });

    if (progress >= 1) {
      this.finish();
      return;
    }
    if (token === this.token) this.call(true);
  };

  start = (dir: Dir, duration = store.option.turnPageAnimationDuration) => {
    if (store.option.scrollMode.enabled) {
      turnPage(dir);
      return;
    }

    // 时长为 0 时直接翻页，不启动动画
    if (duration <= 0) {
      this.turnDirectly(dir);
      return;
    }

    // 快速连续翻页时，先直接走完上一次动画，确保新动画从完整的目标页开始
    if (store.isTurnAnimating) this.finish();
    this.cancel();
    this.token += 1;

    if (!this.prepareTurn(dir)) return;

    this.duration = duration;
    this.startTime = 0;
    this.call();
  };

  /** 直接翻页 */
  turnDirectly = (dir: Dir) => {
    this.cancel();
    this.token += 1;
    setState((state) => {
      if (state.option.scrollMode.enabled) return turnPage(dir, state);

      if (!turnPage(dir, state)) {
        state.isTurnAnimating = false;
        state.isDragMode = false;
        resetPage(state, true);
        state.page.offset.x.px = 0;
        state.page.offset.y.px = 0;
        return;
      }

      state.isTurnAnimating = false;
      state.isDragMode = false;
      state.page.offset.x.px = 0;
      state.page.offset.y.px = 0;
      resetPage(state, false);
    });
  };

  /** 准备一次动画：翻页并计算起点/终点偏移。返回是否成功 */
  prepareTurn = (dir: Dir): boolean => {
    let success = false;
    setState((state) => {
      if (state.option.scrollMode.enabled) {
        turnPage(dir, state);
        return;
      }

      const oldIndex = state.activePageIndex;
      if (!turnPage(dir, state)) {
        state.isTurnAnimating = false;
        state.isDragMode = false;
        resetPage(state, true);
        state.page.offset.x.px = 0;
        state.page.offset.y.px = 0;
        return;
      }
      success = true;

      const oldRenderRange = state.renderRange;
      const oldOffset = {
        x: {
          pct: state.page.offset.x.pct,
          px: state.page.offset.x.px,
        },
        y: {
          pct: state.page.offset.y.pct,
          px: state.page.offset.y.px,
        },
      };

      resetPage(state);
      const toX = state.page.offset.x.pct;
      const toY = state.page.offset.y.pct;
      const { x: startX, y: startY } = getTurnStartOffsets({
        state,
        oldIndex,
        oldRenderRange,
        oldOffset,
      });

      this.from.x = startX;
      this.from.y = startY;
      this.to.x = toX * state.rootSize.width;
      this.to.y = toY * state.rootSize.height;
      this.toPct.x = toX;
      this.toPct.y = toY;
      state.page.offset.x.pct = toX;
      state.page.offset.y.pct = toY;
      state.page.offset.x.px = startX - toX * state.rootSize.width;
      state.page.offset.y.px = startY - toY * state.rootSize.height;
      state.page.anima = '';
      state.isDragMode = false;
      state.isTurnAnimating = true;
    });

    return success;
  };

  finish = () => {
    this.cancel();
    this.token += 1;
    setState((state) => {
      state.isTurnAnimating = false;
      state.isDragMode = false;
      state.page.offset.x.px = 0;
      state.page.offset.y.px = 0;
      if (state.option.zoom.ratio === 100) resetPage(state, false);
      else state.page.anima = '';
    });
  };

  stop = () => {
    this.cancel();
    this.token += 1;
    if (store.isTurnAnimating)
      setState((state) => {
        state.isTurnAnimating = false;
        state.page.anima = '';
      });
  };
})();

/** 带滑动动画的翻页。连续翻页会先直接走完上一次动画，再从当前目标页开始新动画 */
export const turnPageAnimation = (dir: Dir, duration?: number) =>
  turnPageAnimator.start(dir, duration);

/** 取消当前正在播放的翻页滑动动画 */
export const cancelTurnAnimation = () => turnPageAnimator.stop();

/** 直接走完当前正在播放的翻页滑动动画 */
export const finishTurnAnimation = () =>
  store.isTurnAnimating && turnPageAnimator.finish();
