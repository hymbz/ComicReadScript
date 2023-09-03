import {
  zoomScrollModeImg,
  switchFillEffect,
  switchScrollMode,
  turnPage,
} from './Image';
import { setState, store } from '..';
import {
  contentHeight,
  handleMangaFlowScroll,
  mangaFlowEle,
} from './Scrollbar';
import { hotKeysMap } from './HotKeys';
import { getKeyboardCode } from '../../../../../helper';

import classes from '../../../index.module.css';

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();

  if (
    e.ctrlKey ||
    (e.altKey && !store.option.scrollMode) ||
    (!store.endPageType && store.scrollLock)
  )
    return;

  const isWheelDown = e.deltaY > 0;

  // 实现卷轴模式下的缩放
  if (!store.endPageType && e.altKey) {
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
const handleSwapTurnPage = (nextPage: boolean) => {
  const next = store.option.swapTurnPage ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

export const handleKeyDown = (e: KeyboardEvent) => {
  if (
    (e.target as HTMLElement).tagName === 'INPUT' ||
    (e.target as HTMLElement).className === classes.hotKeysItem
  )
    return;

  const code = getKeyboardCode(e);

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
  if (Reflect.has(hotKeysMap(), code)) {
    e.stopPropagation();
    e.preventDefault();
  }

  switch (hotKeysMap()[code]) {
    case '向上翻页':
      return turnPage('prev');

    case '向下翻页':
      return turnPage('next');

    case '向右翻页':
      return turnPage(handleSwapTurnPage(store.option.dir !== 'rtl'));

    case '向左翻页':
      return turnPage(handleSwapTurnPage(store.option.dir === 'rtl'));

    case '跳至首页':
      return setState((state) => {
        state.activePageIndex = 0;
      });

    case '跳至尾页':
      return setState((state) => {
        state.activePageIndex = state.pageList.length - 1;
      });

    case '切换页面填充':
      return switchFillEffect();
    case '切换卷轴模式':
      return switchScrollMode();

    case '退出':
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
