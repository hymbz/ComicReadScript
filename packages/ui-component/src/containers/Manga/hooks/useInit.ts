import type { WritableDraft } from 'immer/dist/internal';
import type { KeyboardEventHandler } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { shallow, useStore } from './useStore';

const selector = ({
  //
  initSwiper,
  swiper,
  option: { scrollMode },
  img: { initImg, resizeObserver, switchFillEffect },
}: SelfState) => ({
  initImg,
  initSwiper,
  resizeObserver,
  switchFillEffect,
  swiper,
  scrollMode,
});

export type InitData = {
  fillEffect?: FillEffect;
  option?: Partial<Option>;
};

/**
 * 初始化
 *
 * @param imgUrlList 图片列表
 * @param initData 初始化选项
 */
export const useInit = (imgUrlList: string[], initData?: InitData) => {
  const {
    initImg,
    initSwiper,
    swiper,
    scrollMode,
    resizeObserver,
    switchFillEffect,
  } = useStore(selector, shallow);

  // 初始化 swiper、panzoom
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    useStore.setState((state) => {
      state.rootRef = rootRef as WritableDraft<React.RefObject<HTMLElement>>;
      if (initData?.option) Object.assign(state.option, initData?.option);
    });

    const [_swiper, _panzoom] = initSwiper();
    useStore.setState((state) => {
      state.swiper = _swiper;
      state.panzoom = _panzoom;
    });

    // 绑定 resizeObserver
    if (rootRef.current) {
      resizeObserver.disconnect();
      resizeObserver.observe(rootRef.current);
    }
  }, [initData?.option, initSwiper, resizeObserver]);

  // 初始化图片相关
  useEffect(() => {
    initImg(imgUrlList, initData?.fillEffect);
  }, [imgUrlList, initData?.fillEffect, initImg]);

  const [scrollLock, setScrollLock] = useState<number | null>(null);
  /** 处理滚动操作 */
  const handleScroll = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (swiper === undefined) return;

      if (!scrollMode) {
        if (!swiper.allowTouchMove) {
          // 在放大模式下通过滚轮缩小至原尺寸后，不会立刻跳转至下一页
          if (scrollLock) clearTimeout(scrollLock);
          setScrollLock(
            window.setTimeout(() => {
              if (swiper.allowTouchMove) setScrollLock(null);
            }, 500),
          );
        } else if (!event.altKey && !scrollLock) {
          if (event.deltaY > 0) swiper.slideNext(0);
          else swiper.slidePrev(0);
        }
      }
    },
    [scrollLock, swiper, scrollMode],
  );

  /** 处理键盘操作 */
  const handleKeyUp: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (e) => {
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
    [swiper, switchFillEffect],
  );

  useEffect(() => {
    useStore.setState((state) => {
      state.handleScroll = handleScroll;
      state.handleKeyUp = handleKeyUp;
    });
  }, [handleKeyUp, handleScroll]);

  return rootRef;
};
