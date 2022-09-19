import type { Draft } from 'immer/dist/internal';
import { useEffect, useRef } from 'react';

import { shallow, useStore } from './useStore';

const selector = ({
  initSwiper,
  img: { initImg, resizeObserver },
}: SelfState) => ({
  initImg,
  initSwiper,
  resizeObserver,
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
  const { initImg, initSwiper, resizeObserver } = useStore(selector, shallow);

  // 初始化 swiper、panzoom
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    useStore.setState((state) => {
      state.rootRef = rootRef as Draft<React.RefObject<HTMLElement>>;
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

  return rootRef;
};
