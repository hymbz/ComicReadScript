import type { WheelEventHandler, KeyboardEventHandler } from 'react';

export interface OperateSlice {
  handleScroll: WheelEventHandler;
  handleKeyUp: KeyboardEventHandler;
}

let scrollLock: number | null = null;
export const operateSlice: SelfStateCreator<OperateSlice> = (set, get) => ({
  handleScroll: (e) => {
    e.stopPropagation();

    const {
      swiper,
      option: { scrollMode },
      pageTurn,
    } = get();
    if (swiper === undefined) return;

    if (!scrollMode) {
      if (!swiper.allowTouchMove) {
        // 在放大模式下通过滚轮缩小至原尺寸后，不会立刻跳转至下一页
        if (scrollLock) clearTimeout(scrollLock);
        scrollLock = window.setTimeout(() => {
          if (swiper.allowTouchMove) scrollLock = null;
        }, 500);
      } else if (!e.altKey && !scrollLock) {
        if (e.deltaY > 0) pageTurn(true);
        else pageTurn(false);
      }
    }
  },

  handleKeyUp: (e) => {
    e.stopPropagation();

    const {
      pageTurn,
      img: { switchFillEffect },
      option: { dir },
      onExit,
      swiper,
      slideData,
    } = get();

    let i: boolean | null = null;

    switch (e.key) {
      case 'PageUp':
      case 'ArrowUp':
      case '.':
      case 'w':
        i = false;
        break;

      case ' ':
      case 'PageDown':
      case 'ArrowDown':
      case ',':
      case 's':
        i = true;
        break;

      case 'ArrowRight':
      case 'd':
        i = dir !== 'rtl';
        break;

      case 'ArrowLeft':
      case 'a':
        i = dir === 'rtl';
        break;

      case '/':
      case 'm':
        switchFillEffect();
        break;

      case 'Home':
        swiper?.slideTo(0, 0);
        break;
      case 'End':
        swiper?.slideTo(slideData.length, 0);
        break;

      case 'Escape':
        onExit?.();
        break;

      default:
        break;
    }

    if (i === null) return;
    pageTurn(i);
  },
});
