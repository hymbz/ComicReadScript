import type { State } from '../store';

import { setState, store } from '../store';
import { withOptionalState } from './helper';
import { isBottom, isTop } from './memo';
import { saveReadProgress } from './readProgress';
import { resetPage } from './show';

export type Dir = 'next' | 'prev';

/** 处理尽头翻页。返回当前是否已抵达尽头 */
export const handleEndTurnPage = withOptionalState(
  (dir: Dir, state: State): boolean => {
    if (dir === 'prev') {
      switch (state.show.endPage) {
        case 'start':
          if (state.scrollLock || store.option.scroolEnd !== 'auto')
            return true;
          state.prop.onPrev?.();
          return true;
        case 'end':
          state.show.endPage = undefined;
          return true;

        default:
          // 弹出卷首结束页
          if (isTop()) {
            if (state.scrollLock) return true;
            if (
              !state.prop.onExit ||
              !state.prop.onPrev ||
              store.option.scroolEnd !== 'auto'
            )
              return true;

            state.show.endPage = 'start';
            return true;
          }
      }
    } else {
      switch (state.show.endPage) {
        case 'end':
          if (state.scrollLock || store.option.scroolEnd === 'none')
            return true;
          if (store.option.scroolEnd === 'auto' && state.prop.onNext)
            state.prop.onNext();
          else state.prop.onExit?.(true);
          return true;
        case 'start':
          state.show.endPage = undefined;
          return true;

        default:
          // 弹出卷尾结束页
          if (isBottom()) {
            if (state.scrollLock) return true;
            if (!state.prop.onExit) return true;

            state.show.endPage = 'end';
            return true;
          }
      }
    }

    return false;
  },
);

/** 翻页。返回是否成功改变了当前页数 */
export const turnPage = withOptionalState((dir: Dir, state: State) => {
  if (state.gridMode || state.option.scrollMode.enabled) return false;

  if (handleEndTurnPage(dir, state)) return false;

  saveReadProgress();
  state.activePageIndex += dir === 'next' ? 1 : -1;
  return true;
});

export const turnPageAnimation = (dir: Dir) => {
  setState((state) => {
    // 无法翻页就恢复原位
    if (!turnPage(dir, state)) {
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
): Dir | undefined => {
  let dir: Dir | undefined;

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
