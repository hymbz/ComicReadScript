import type { Draft } from 'immer/dist/internal';
import { useEffect, useRef } from 'react';

import { shallow, useStore } from './useStore';

const selector = ({ initSwiper, img: { resizeObserver } }: SelfState) => ({
  initSwiper,
  resizeObserver,
});

export interface InitData {
  fillEffect?: FillEffect;
  option?: Partial<Option>;
}

export interface MangaProps {
  /** 图片url列表 */
  imgUrlList: string[];
  /** 初始化配置 */
  initData?: InitData;
}

/**
 * 初始化
 *
 * @param imgUrlList 图片列表
 * @param initData 初始化选项
 */
export const useInit = (imgUrlList: string[], initData?: InitData) => {
  const { initSwiper, resizeObserver } = useStore(selector, shallow);

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

  // 初始化图片
  useEffect(() => {
    useStore.setState((state) => {
      if (initData?.fillEffect) state.fillEffect = initData?.fillEffect;

      imgUrlList.forEach((imgUrl, index) => {
        state.imgList[index] = {
          type: '',
          index,
          src: imgUrl,
          loadType: 'wait',
        };
      });
    });
  }, [imgUrlList, initData?.fillEffect]);

  return rootRef;
};
