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
      // option: { dir },
    } = get();

    if (swiper === undefined) return;

    switch (e.key) {
      case 'PageUp':
      case 'ArrowUp':
      case 'ArrowRight':
      case '.':
      case 'w':
        swiper.slidePrev(0);
        break;

      case ' ':
      case 'PageDown':
      case 'ArrowDown':
      case 'ArrowLeft':
      case ',':
      case 's':
        swiper.slideNext(0);
        break;

      case '/':
      case 'm':
        switchFillEffect();
        break;

      default:
        break;
    }
  },
});
