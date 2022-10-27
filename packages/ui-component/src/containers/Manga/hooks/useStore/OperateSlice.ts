import type { WheelEventHandler, KeyboardEventHandler } from 'react';
import type { SelfStateCreator } from '.';

export interface OperateSlice {
  /** 锁定滚轮滚动 */
  scrollLock: boolean;

  handleScroll: WheelEventHandler;
  handleKeyUp: KeyboardEventHandler;
}

export const operateSlice: SelfStateCreator<OperateSlice> = (set, get) => ({
  scrollLock: false,

  handleScroll: (e) => {
    const {
      option: { scrollMode },
      pageTurn,
      scrollLock,
      showEndPage,
    } = get();
    if (scrollMode && !showEndPage) return;

    e.stopPropagation();

    if (e.altKey || scrollLock) return;

    if (e.deltaY > 0) pageTurn('next');
    else pageTurn('prev');
  },

  handleKeyUp: (e) => {
    const {
      pageTurn,
      img: { switchFillEffect },
      option: { dir, scrollMode },
      onExit,
      slideData,
      showEndPage,
    } = get();
    if (scrollMode && !showEndPage) return;
    e.stopPropagation();

    let nextPage: boolean | null = null;

    switch (e.key) {
      case 'PageUp':
      case 'ArrowUp':
      case '.':
      case 'w':
        nextPage = false;
        break;

      case ' ':
      case 'PageDown':
      case 'ArrowDown':
      case ',':
      case 's':
        nextPage = true;
        break;

      case 'ArrowRight':
      case 'd':
        nextPage = dir !== 'rtl';
        break;

      case 'ArrowLeft':
      case 'a':
        nextPage = dir === 'rtl';
        break;

      case '/':
      case 'm':
        switchFillEffect();
        break;

      case 'Home':
        set((state) => {
          state.activeSlideIndex = 0;
        });
        break;
      case 'End':
        set((state) => {
          state.activeSlideIndex = slideData.length;
        });
        break;

      case 'Escape':
        onExit?.();
        break;

      default:
        break;
    }

    if (nextPage === null) return;
    pageTurn(nextPage ? 'next' : 'prev');
  },
});
