import type { WheelEventHandler, KeyboardEventHandler } from 'react';

export interface OperateSlice {
  handleScroll: WheelEventHandler;
  handleKeyUp: KeyboardEventHandler;
}

let scrollLock: number | null = null;
export const operateSlice: SelfStateCreator<OperateSlice> = (set, get) => ({
  handleScroll: (event) => {
    const {
      swiper,
      option: { scrollMode },
    } = get();

    if (swiper === undefined) return;

    if (!scrollMode) {
      if (!swiper.allowTouchMove) {
        // 在放大模式下通过滚轮缩小至原尺寸后，不会立刻跳转至下一页
        if (scrollLock) clearTimeout(scrollLock);
        scrollLock = window.setTimeout(() => {
          if (swiper.allowTouchMove) scrollLock = null;
        }, 500);
      } else if (!event.altKey && !scrollLock) {
        if (event.deltaY > 0) swiper.slideNext(0);
        else swiper.slidePrev(0);
      }
    }
  },

  handleKeyUp: (e) => {
    const {
      swiper,
      img: { switchFillEffect },
      option: { dir },
    } = get();

    if (swiper === undefined) return;

    let i: -1 | 0 | 1 = 0;

    switch (e.key) {
      case 'PageUp':
      case 'ArrowUp':
      case '.':
      case 'w':
        i = -1;
        break;

      case ' ':
      case 'PageDown':
      case 'ArrowDown':
      case ',':
      case 's':
        i = 1;
        break;

      case 'ArrowRight':
      case 'd':
        i = dir === 'rtl' ? -1 : 1;
        break;

      case 'ArrowLeft':
      case 'a':
        i = dir === 'rtl' ? 1 : -1;
        break;

      case '/':
      case 'm':
        switchFillEffect();
        break;

      default:
        break;
    }

    if (i === 1) swiper.slideNext(0);
    else if (i === -1) swiper.slidePrev(0);
  },
});
