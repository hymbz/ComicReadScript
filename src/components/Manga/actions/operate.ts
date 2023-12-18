import { getKeyboardCode } from 'helper';
import { store, refs, _setState, setState } from '../store';
import { handleTrackpadWheel } from './pointer';
import { zoomScrollModeImg } from './image';
import { setOption } from './helper';
import { hotkeysMap } from './hotkeys';
import { zoom } from './zoom';
import { closeScrollLock, turnPage, turnPageFn } from './turnPage';
import {
  switchFillEffect,
  switchScrollMode,
  switchOnePageMode,
  switchDir,
  switchGridMode,
} from './switch';

import classes from '../index.module.css';

// 特意使用 requestAnimationFrame 和 .click() 是为了能和 Vimium 兼容
export const focus = () =>
  requestAnimationFrame(() => {
    refs.mangaFlow?.click();
    refs.mangaFlow?.focus();
  });

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

/** 卷轴模式下的滚动 */
const scrollModeScroll = (dir: 'next' | 'prev') => {
  if (!store.show.endPage) {
    refs.mangaFlow.scrollBy({
      top: refs.root.clientHeight * 0.8 * (dir === 'next' ? 1 : -1),
      behavior: 'instant',
    });
    _setState('flag', 'scrollLock', true);
  }
  closeScrollLock();
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

let lastDeltaY = 0;
let lastTurnPageRes = false;
let wheelType: undefined | 'trackpad' | 'mouse';

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();
  if (store.flag.scrollLock) return closeScrollLock();
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

  if (lastDeltaY === 0) lastDeltaY = Math.abs(e.deltaY);
  else if (wheelType === undefined) {
    // 通过判断首次的两次滚动距离是否相同来判断用的是触摸板还是鼠标
    if (lastDeltaY === Math.abs(e.deltaY)) wheelType = 'mouse';
    else {
      wheelType = 'trackpad';
      // 如果是触摸板滚动，且上次成功触发了翻页，就重新翻页回去
      // 虽然这样偶尔会出现闪烁，但毕竟触摸板用的人少，相比给鼠标滚轮加延迟影响更小
      if (lastTurnPageRes) turnPage(isWheelDown ? 'prev' : 'next');
    }
  }

  if (wheelType === 'trackpad') return handleTrackpadWheel(e);

  setState((state) => {
    lastTurnPageRes = turnPageFn(state, isWheelDown ? 'next' : 'prev');
  });
};
