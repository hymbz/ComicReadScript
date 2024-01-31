import { debounce } from 'helper';
import type { State } from '../store';
import { store, setState, _setState } from '../store';
import { contentHeight, rootSize, scrollTop } from './memo';
import { resetPage } from './show';

/** 判断当前是否已经滚动到底部 */
export const isBottom = (state: State) => {
  return state.option.scrollMode
    ? Math.ceil(scrollTop() + rootSize().height) >= contentHeight()
    : state.activePageIndex === state.pageList.length - 1;
};

/** 判断当前是否已经滚动到顶部 */
export const isTop = (state: State) =>
  state.option.scrollMode ? scrollTop() === 0 : state.activePageIndex === 0;

export const closeScrollLock = debounce(
  () => _setState('flag', 'scrollLock', false),
  200,
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
