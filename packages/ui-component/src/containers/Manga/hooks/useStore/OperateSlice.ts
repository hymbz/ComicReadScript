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
    e.stopPropagation();
    const {
      option: { scrollMode },
      pageTurn,
      scrollLock,
      endPageType,
    } = get();
    if (scrollMode && !endPageType) {
      set((state) => {
        if (state.scrollbar.dragTop === 0 && e.deltaY <= 0) {
          state.endPageType = 'start';
        } else if (state.scrollbar.dragHeight + state.scrollbar.dragTop === 1) {
          state.endPageType = 'end';
        }
      });
      return;
    }

    if (e.altKey || scrollLock) return;

    if (e.deltaY > 0) pageTurn('next');
    else pageTurn('prev');
  },

  handleKeyUp: (e) => {
    e.stopPropagation();

    const {
      pageTurn,
      img: { switchFillEffect },
      option: { dir, scrollMode },
      onExit,
      pageList,
      endPageType,
    } = get();
    if (scrollMode && !endPageType) return;

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
          state.activePageIndex = 0;
        });
        break;
      case 'End':
        set((state) => {
          state.activePageIndex = pageList.length - 1;
        });
        break;

      case 'Escape':
        onExit?.();
        break;
    }

    if (nextPage === null) return;
    pageTurn(nextPage ? 'next' : 'prev');
  },
});
