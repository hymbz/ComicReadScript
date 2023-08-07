import {
  setScrollModeImgScale,
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
import { clamp } from '../../../helper';
import { hotKeysMap } from './HotKeys';
import { getKeyboardCode } from '../../../../../helper';

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();

  if (
    e.ctrlKey ||
    (e.altKey && !store.option.scrollMode) ||
    (!store.endPageType && store.scrollLock)
  )
    return;

  const isWheelDown = e.deltaY > 0;

  if (store.option.scrollMode && !store.endPageType) {
    // 实现在卷轴模式滚动到头尾后继续滚动时弹出结束页
    if (store.scrollbar.dragTop === 0 && !isWheelDown) {
      window.setTimeout(() => {
        setState((state) => {
          state.endPageType = 'start';
          state.scrollLock = true;
        });
      });
      window.setTimeout(() => {
        setState((state) => {
          state.scrollLock = false;
        });
      }, 500);
    } else if (
      store.scrollbar.dragHeight + store.scrollbar.dragTop >= 0.999 &&
      isWheelDown
    ) {
      setState((state) => {
        state.endPageType = 'end';
        state.scrollLock = true;
      });
      window.setTimeout(() => {
        setState((state) => {
          state.scrollLock = false;
        });
      }, 500);
    }

    // 实现卷轴模式下的缩放
    if (e.altKey) {
      e.preventDefault();
      const zoomScale = (isWheelDown ? -1 : 1) * 0.1;
      setScrollModeImgScale(
        clamp(5, store.option.scrollModeImgScale + zoomScale, 0.2),
      );
      // 在调整图片缩放后使当前滚动进度保持不变
      setState((state) => {
        mangaFlowEle().scrollTo({
          top: contentHeight() * state.scrollbar.dragTop,
        });
      });
      handleMangaFlowScroll();
    }

    return;
  }

  setState((state) => turnPage(state, isWheelDown ? 'next' : 'prev'));
};

/** 根据是否开启了 左右翻页键交换 来切换翻页方向 */
const handleSwapTurnPage = (nextPage: boolean) => {
  const next = store.option.swapTurnPage ? !nextPage : nextPage;
  return next ? 'next' : 'prev';
};

export const handleKeyDown = (e: KeyboardEvent) => {
  e.stopPropagation();

  if ((e.target as HTMLElement).tagName === 'INPUT') return;

  if (store.endPageType) e.preventDefault();

  const code = getKeyboardCode(e);

  switch (hotKeysMap()[code]) {
    case '向上翻页':
      return setState((state) => turnPage(state, 'prev'));

    case '向下翻页':
      return setState((state) => turnPage(state, 'next'));

    case '向右翻页':
      return setState((state) =>
        turnPage(state, handleSwapTurnPage(store.option.dir !== 'rtl')),
      );

    case '向左翻页':
      return setState((state) =>
        turnPage(state, handleSwapTurnPage(store.option.dir === 'rtl')),
      );

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

export const handleMouseDown: EventHandler['onmousedown'] = (e) => {
  if (e.button !== 1) return;
  e.stopPropagation();
  e.preventDefault();
  switchFillEffect();
};
