import { debounce } from 'helper';

import { type State, store, setState, _setState } from '../store';

import { resetPage } from './show';
import { isBottom, isTop } from './scroll';
import { saveReadProgress } from './readProgress';

export const closeScrollLock = debounce(
  () => _setState('scrollLock', false),
  100,
);

/** 翻页。返回是否成功改变了当前页数 */
export const turnPageFn = (state: State, dir: 'next' | 'prev'): boolean => {
  if (state.gridMode) return false;

  if (dir === 'prev') {
    switch (state.show.endPage) {
      case 'start':
        if (!state.scrollLock && state.option.jumpToNext) state.prop.onPrev?.();
        return false;
      case 'end':
        state.show.endPage = undefined;
        return false;

      default:
        // 弹出卷首结束页
        if (isTop()) {
          if (!state.prop.onExit) return false;
          // 没有 onPrev 时不弹出
          if (!state.prop.onPrev || !state.option.jumpToNext) return false;

          state.show.endPage = 'start';
          state.scrollLock = true;
          closeScrollLock();
          return false;
        }

        saveReadProgress();
        if (state.option.scrollMode.enabled) return false;
        state.activePageIndex -= 1;
        return true;
    }
  } else {
    switch (state.show.endPage) {
      case 'end':
        if (state.scrollLock) return false;
        if (state.prop.onNext && state.option.jumpToNext) {
          state.prop.onNext();
          return false;
        }

        state.prop.onExit?.(true);
        return false;
      case 'start':
        state.show.endPage = undefined;
        return false;

      default:
        // 弹出卷尾结束页
        if (isBottom()) {
          if (!state.prop.onExit) return false;
          state.show.endPage = 'end';
          state.scrollLock = true;
          closeScrollLock();
          return false;
        }

        saveReadProgress();
        if (state.option.scrollMode.enabled) return false;
        state.activePageIndex += 1;
        return true;
    }
  }
};

export const turnPage = (dir: 'next' | 'prev') =>
  setState((state) => turnPageFn(state, dir));

export const turnPageAnimation = (dir: 'next' | 'prev') => {
  setState((state) => {
    // 无法翻页就恢复原位
    if (!turnPageFn(state, dir)) {
      state.page.offset.x.px = 0;
      state.page.offset.y.px = 0;
      resetPage(state, true);
      state.isDragMode = false;
      return;
    }

    state.isDragMode = true;
    resetPage(state);
    if (store.page.vertical) state.page.offset.y.pct += dir === 'next' ? 1 : -1;
    else state.page.offset.x.pct += dir === 'next' ? -1 : 1;

    setTimeout(() => {
      setState((draftState) => {
        resetPage(draftState, true);
        draftState.page.offset.x.px = 0;
        draftState.page.offset.y.px = 0;
        draftState.isDragMode = false;
      });
    }, 16);
  });
};

/** 判断翻页方向 */
export const getTurnPageDir = (
  move: number,
  total: number,
  startTime?: number,
): undefined | 'prev' | 'next' => {
  let dir: undefined | 'prev' | 'next';

  // 处理无关速度不考虑时间单纯根据当前滚动距离来判断的情况
  if (!startTime) {
    if (Math.abs(move) > total / 2) dir = move > 0 ? 'next' : 'prev';
    return dir;
  }

  // 滑动距离超过总长度三分之一判定翻页
  if (Math.abs(move) > total / 3) dir = move > 0 ? 'next' : 'prev';
  if (dir) return dir;

  // 滑动速度超过 0.4 判定翻页
  const velocity = move / (performance.now() - startTime);
  if (velocity < -0.4) dir = 'prev';
  if (velocity > 0.4) dir = 'next';

  return dir;
};
