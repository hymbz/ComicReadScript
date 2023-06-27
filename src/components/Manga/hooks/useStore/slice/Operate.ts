import { setScrollModeImgScale, switchFillEffect, turnPage } from './Image';
import { setState, store } from '..';
import {
  contentHeight,
  handleMangaFlowScroll,
  mangaFlowEle,
} from './Scrollbar';
import { clamp } from '../../../helper';

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
const handleSwapTurnPage = (nextPage: boolean) =>
  store.option.swapTurnPage ? !nextPage : nextPage;

export const handleKeyUp = (e: KeyboardEvent) => {
  e.stopPropagation();

  if (store.option.scrollMode && !store.endPageType) return;

  let nextPage: boolean | null = null;

  switch (e.key) {
    case 'PageUp':
    case 'ArrowUp':
    case 'w':
      nextPage = false;
      break;

    case ' ':
    case 'PageDown':
    case 'ArrowDown':
    case 's':
      nextPage = true;
      break;

    case 'ArrowRight':
    case '.':
    case 'd':
      nextPage = handleSwapTurnPage(store.option.dir !== 'rtl');
      break;

    case 'ArrowLeft':
    case ',':
    case 'a':
      nextPage = handleSwapTurnPage(store.option.dir === 'rtl');
      break;

    case '/':
    case 'm':
    case 'z':
      switchFillEffect();
      break;

    case 'Home':
      setState((state) => {
        state.activePageIndex = 0;
      });
      break;
    case 'End':
      setState((state) => {
        state.activePageIndex = state.pageList.length - 1;
      });
      break;

    case 'Escape':
      store.onExit?.();
      break;
  }

  if (nextPage === null) return;
  setState((state) => turnPage(state, nextPage ? 'next' : 'prev'));
};
