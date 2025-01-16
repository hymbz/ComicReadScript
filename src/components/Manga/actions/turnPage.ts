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
        if (!state.scrollLock && state.option.jumpToNext) state.prop.Prev?.();
        return false;
      case 'end':
        state.show.endPage = undefined;
        return false;

      default:
        // 弹出卷首结束页
        if (isTop()) {
          if (!state.prop.Exit) return false;
          // 没有 onPrev 时不弹出
          if (!state.prop.Prev || !state.option.jumpToNext) return false;

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
        if (state.prop.Next && state.option.jumpToNext) {
          state.prop.Next();
          return false;
        }

        state.prop.Exit?.(true);
        return false;
      case 'start':
        state.show.endPage = undefined;
        return false;

      default:
        // 弹出卷尾结束页
        if (isBottom()) {
          if (!state.prop.Exit) return false;
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
