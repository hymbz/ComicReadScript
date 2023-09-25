import { getKeyboardCode } from 'helper';
import { setState, store } from '..';
import { hotkeysMap } from './Hotkeys';
import {
  zoomScrollModeImg,
  switchFillEffect,
  switchScrollMode,
  turnPage,
  switchOnePageMode,
  switchDir,
} from './Image';
import {
  contentHeight,
  handleMangaFlowScroll,
  mangaFlowEle,
} from './Scrollbar';

import classes from '../../../index.module.css';

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();

  if (
    (e.ctrlKey && !store.option.scrollMode) ||
    (e.altKey && !store.option.scrollMode) ||
    (!store.endPageType && store.scrollLock)
  )
    return e.preventDefault();

  const isWheelDown = e.deltaY > 0;

  // 实现卷轴模式下的缩放
  if (!store.endPageType && (e.altKey || e.ctrlKey)) {
    e.preventDefault();
    zoomScrollModeImg(isWheelDown ? -0.1 : 0.1);
    // 在调整图片缩放后使当前滚动进度保持不变
    setState((state) => {
      mangaFlowEle().scrollTo({
        top: contentHeight() * state.scrollbar.dragTop,
      });
    });
    handleMangaFlowScroll();
    return;
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

  // 处理标注了 data-only-number 的元素
  if ((e.target as HTMLElement).getAttribute('data-only-number') !== null) {
    // 拦截能输入数字外的按键
    if (isAlphabetKey.test(code)) {
      e.stopPropagation();
      e.preventDefault();
    } else if (code.includes('Enter')) (e.target as HTMLElement).blur();
    return;
  }

  // 卷轴模式下跳过用于移动的按键
  if (store.option.scrollMode && !store.endPageType) {
    switch (e.key) {
      case 'Home':
      case 'End':
      case 'ArrowRight':
      case 'ArrowLeft':
        return;

      case 'ArrowUp':
      case 'PageUp':
        return turnPage('prev');

      case 'ArrowDown':
      case 'PageDown':
      case ' ':
        return turnPage('next');
    }
  }

  // 拦截已注册的快捷键
  if (Reflect.has(hotkeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  }

  switch (hotkeysMap()[code]) {
    case 'turn_page_up':
      return turnPage('prev');

    case 'turn_page_down':
      return turnPage('next');

    case 'turn_page_right':
      return turnPage(handleSwapPageTurnKey(store.option.dir !== 'rtl'));

    case 'turn_page_left':
      return turnPage(handleSwapPageTurnKey(store.option.dir === 'rtl'));

    case 'jump_to_home':
      return setState((state) => {
        state.activePageIndex = 0;
      });

    case 'jump_to_end':
      return setState((state) => {
        state.activePageIndex = state.pageList.length - 1;
      });

    case 'switch_page_fill':
      return switchFillEffect();
    case 'switch_scroll_mode':
      return switchScrollMode();
    case 'switch_single_double_page_mode':
      return switchOnePageMode();
    case 'switch_dir':
      return switchDir();

    case 'exit':
      return store.onExit?.();
  }
};

export const handleMouseDown: EventHandler['on:mousedown'] = (e) => {
  if (e.button !== 1 || store.option.scrollMode) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};

export const focus = () =>
  (store.mangaFlowRef ?? store.rootRef)?.parentElement?.focus();
