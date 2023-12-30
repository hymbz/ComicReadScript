import { debounce } from 'throttle-debounce';

import type { State } from '../store';
import { store, setState, _setState } from '../store';
import { updateRenderPage } from './show';

/** 判断当前是否已经滚动到底部 */
const isBottom = (state: State) =>
  state.option.scrollMode
    ? store.scrollbar.dragHeight + store.scrollbar.dragTop >= 0.999
    : state.activePageIndex === state.pageList.length - 1;

/** 判断当前是否已经滚动到顶部 */
const isTop = (state: State) =>
  state.option.scrollMode
    ? store.scrollbar.dragTop === 0
    : state.activePageIndex === 0;

export const closeScrollLock = debounce(200, () =>
  _setState('flag', 'scrollLock', false),
);

/** 翻页。返回是否成功改变了当前页数 */
export const turnPageFn = (state: State, dir: 'next' | 'prev'): boolean => {
  if (state.gridMode) return false;

  if (dir === 'prev') {
    switch (state.show.endPage) {
      case 'start':
        if (!state.flag.scrollLock && state.option.jumpToNext)
          state.prop.Prev?.();
        return false;
      case 'end':
        state.show.endPage = undefined;
        state.flag.scrollLock = true;
        closeScrollLock();
        return false;

      default:
        // 弹出卷首结束页
        if (isTop(state)) {
          if (!state.prop.Exit) return false;
          // 没有 onPrev 时不弹出
          if (!state.prop.Prev || !state.option.jumpToNext) return false;

          state.show.endPage = 'start';
          state.flag.scrollLock = true;
          closeScrollLock();
          return false;
        }
        if (state.option.scrollMode) return false;
        state.activePageIndex -= 1;
        return true;
    }
  } else {
    switch (state.show.endPage) {
      case 'end':
        if (state.flag.scrollLock) return false;
        if (state.prop.Next && state.option.jumpToNext) {
          state.prop.Next();
          return false;
        }
        state.prop.Exit?.(true);
        return false;
      case 'start':
        state.show.endPage = undefined;
        state.flag.scrollLock = true;
        closeScrollLock();
        return false;

      default:
        // 弹出卷尾结束页
        if (isBottom(state)) {
          if (!state.prop.Exit) return false;
          state.show.endPage = 'end';
          state.flag.scrollLock = true;
          closeScrollLock();
          return false;
        }
        if (state.option.scrollMode) return false;
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
      updateRenderPage(state, true);
      state.isDragMode = false;
      return;
    }

    state.isDragMode = true;
    updateRenderPage(state);
    if (store.page.vertical)
      state.page.offset.y.pct += dir === 'next' ? 100 : -100;
    else state.page.offset.x.pct += dir === 'next' ? -100 : 100;

    setTimeout(() => {
      setState((draftState) => {
        updateRenderPage(draftState, true);
        draftState.page.offset.x.px = 0;
        draftState.page.offset.y.px = 0;
        draftState.isDragMode = false;
      });
    }, 16);
  });
};
