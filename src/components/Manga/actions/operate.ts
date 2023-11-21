import { debounce } from 'throttle-debounce';

import { getKeyboardCode, requestIdleCallback } from 'helper';
import type { State } from '../store';
import { store, setState, refs, _setState } from '../store';
import { zoom } from './zoom';
import { setOption } from './helper';
import { hotkeysMap } from './hotkeys';
import { zoomScrollModeImg } from './image';
import { updateRenderPage } from './show';
import {
  switchFillEffect,
  switchScrollMode,
  switchOnePageMode,
  switchDir,
  switchGridMode,
} from './switch';

import classes from '../index.module.css';

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
export const focus = () =>
  requestAnimationFrame(() => {
    refs.mangaFlow?.click();
    refs.mangaFlow?.focus();
  });

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

const closeScrollLock = debounce(200, () =>
  _setState('flag', 'scrollLock', false),
);

/** 翻页。返回是否成功改变了当前页数 */
const turnPageFn = (state: State, dir: 'next' | 'prev'): boolean => {
  if (state.gridMode) return false;

  if (dir === 'prev') {
    switch (state.show.endPage) {
      case 'start':
        if (!state.flag.scrollLock && state.option.jumpToNext)
          state.prop.Prev?.();
        return false;
      case 'end':
        state.show.endPage = undefined;
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

    requestIdleCallback(() => {
      setState((draftState) => {
        updateRenderPage(draftState, true);
        draftState.page.offset.x.px = 0;
        draftState.page.offset.y.px = 0;
        draftState.isDragMode = false;
      });
    }, 50);
  });
};

/** 卷轴模式下的滚动 */
const scrollModeScroll = (dir: 'next' | 'prev') => {
  if (!store.show.endPage)
    refs.mangaFlow.scrollBy({
      top: refs.root.clientHeight * 0.8 * (dir === 'next' ? 1 : -1),
      behavior: 'instant',
    });
  _setState('flag', 'scrollLock', true);
  closeScrollLock();
};

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();
  if (store.flag.scrollLock) return;
  const isWheelDown = e.deltaY > 0;

  if (store.show.endPage) return turnPage(isWheelDown ? 'next' : 'prev');

  // 卷轴模式下的图片缩放
  if (
    (e.ctrlKey || e.altKey) &&
    store.option.scrollMode &&
    store.zoom.scale === 100
  ) {
    e.preventDefault();
    return zoomScrollModeImg(isWheelDown ? -0.1 : 0.1);
  }

  if (e.ctrlKey || e.altKey || store.zoom.scale !== 100) {
    e.preventDefault();
    return zoom(store.zoom.scale + (isWheelDown ? -25 : 25), e);
  }

  return turnPage(isWheelDown ? 'next' : 'prev');
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapPageTurnKey = (nextPage: boolean) => {
  const next = store.option.swapPageTurnKey ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

/** 判断按键代码是否可以输入字母 */
const isAlphabetKey = /^(Shift \+ )?[a-zA-Z]$/;

export const handleKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).className === classes.hotkeysItem
  )
    return;

  const code = getKeyboardCode(e);

  // esc 在触发配置操作前，先用于退出一些界面
  if (e.key === 'Escape') {
    if (store.gridMode) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('gridMode', false);
    }
    if (store.show.endPage) {
      e.stopPropagation();
      e.preventDefault();
      return _setState('show', 'endPage', undefined);
    }
  }

  // 处理标注了 data-only-number 的元素
  if ((e.target as HTMLElement).getAttribute('data-only-number') !== null) {
    // 拦截能输入数字外的按键
    if (isAlphabetKey.test(code)) {
      e.stopPropagation();
      e.preventDefault();
    } else if (code.includes('Enter')) (e.target as HTMLElement).blur();
    return;
  }

  // 卷轴、网格模式下跳过用于移动的按键
  if ((store.option.scrollMode || store.gridMode) && !store.show.endPage) {
    switch (e.key) {
      case 'Home':
      case 'End':
      case 'ArrowRight':
      case 'ArrowLeft':
        return;

      case 'ArrowUp':
      case 'PageUp':
        return store.gridMode || turnPage('prev');

      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        return store.gridMode || turnPage('next');
    }
  }

  // 拦截已注册的快捷键
  if (Reflect.has(hotkeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  }

  switch (hotkeysMap()[code]) {
    case 'turn_page_up': {
      if (store.option.scrollMode) scrollModeScroll('prev');
      return turnPage('prev');
    }
    case 'turn_page_down': {
      if (store.option.scrollMode) scrollModeScroll('next');
      return turnPage('next');
    }

    case 'turn_page_right':
      return turnPage(handleSwapPageTurnKey(store.option.dir !== 'rtl'));
    case 'turn_page_left':
      return turnPage(handleSwapPageTurnKey(store.option.dir === 'rtl'));

    case 'jump_to_home':
      return _setState('activePageIndex', 0);
    case 'jump_to_end':
      return _setState('activePageIndex', store.pageList.length - 1);

    case 'switch_page_fill':
      return switchFillEffect();
    case 'switch_scroll_mode':
      return switchScrollMode();
    case 'switch_single_double_page_mode':
      return switchOnePageMode();
    case 'switch_dir':
      return switchDir();
    case 'switch_grid_mode':
      return switchGridMode();

    case 'switch_auto_enlarge':
      return setOption((draftOption) => {
        draftOption.disableZoom = !draftOption.disableZoom;
      });

    case 'exit':
      return store.prop.Exit?.();
  }
};
