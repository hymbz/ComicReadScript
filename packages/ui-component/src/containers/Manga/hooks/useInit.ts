import type { Draft } from 'immer/dist/internal';
import { useEffect, useRef } from 'react';
import type { MangaProps } from '..';

import { shallow, useStore } from './useStore';

const selector = ({ initSwiper, img: { resizeObserver } }: SelfState) => ({
  initSwiper,
  resizeObserver,
});

export interface InitData {
  fillEffect?: FillEffect;
  option?: Partial<Option>;
}

/**
 * 初始化
 *
 * @param props
 */
export const useInit = ({
  imgUrlList,
  initData,
  editButtonList,
  editSettingList,
}: MangaProps) => {
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

  // 初始化 editButtonList 和 editSettingList
  useEffect(() => {
    if (editButtonList)
      useStore.setState((state) => {
        state.editButtonList = editButtonList;
      });
  }, [editButtonList]);
  useEffect(() => {
    if (editSettingList)
      useStore.setState((state) => {
        state.editSettingList = editSettingList;
      });
  }, [editSettingList]);

  return rootRef;
};
