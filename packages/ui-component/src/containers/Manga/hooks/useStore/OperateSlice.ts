import type { WheelEventHandler, KeyboardEventHandler } from 'react';
import type { SelfStateCreator } from '.';

export interface OperateSlice {
  /**
   * 滚动相关的锁
   *
   * - 在缩放时开启，结束缩放一段时间后关闭。开启时禁止翻页。
   * - 在首次触发结束页时开启，一段时间关闭。开启时禁止触发结束页的上下话切换功能。
   */
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
      turnPage,
      scrollLock,
      endPageType,
    } = get();
    if (e.altKey || (!endPageType && scrollLock)) return;

    if (scrollMode && !endPageType) {
      set((state) => {
        if (state.scrollbar.dragTop === 0 && e.deltaY <= 0) {
          state.endPageType = 'start';
          state.scrollLock = true;
          window.setTimeout(() => {
            set((draftState) => {
              draftState.scrollLock = false;
            });
          }, 500);
        } else if (state.scrollbar.dragHeight + state.scrollbar.dragTop === 1) {
          state.endPageType = 'end';
          state.scrollLock = true;
          window.setTimeout(() => {
            set((draftState) => {
              draftState.scrollLock = false;
            });
          }, 500);
        }
      });
      return;
    }

    if (e.deltaY > 0) turnPage('next');
    else turnPage('prev');
  },

  handleKeyUp: (e) => {
    e.stopPropagation();

    const {
      turnPage,
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
      case 'z':
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
    turnPage(nextPage ? 'next' : 'prev');
  },
});
