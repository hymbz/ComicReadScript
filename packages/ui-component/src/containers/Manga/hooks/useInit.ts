import type { Draft } from 'immer/dist/internal';
import { useEffect, useRef } from 'react';
import { shallow, useStore } from './useStore';
import type { MangaProps } from '..';

const selector = ({ initSwiper, img: { resizeObserver } }: SelfState) => ({
  initSwiper,
  resizeObserver,
});

/**
 * 初始化
 *
 * @param props
 */
export const useInit = ({
  imgList,
  fillEffect,
  option,
  onExit,
  onPrev,
  onNext,
  onOptionChange,
  editButtonList,
  editSettingList,
}: MangaProps) => {
  const { initSwiper, resizeObserver } = useStore(selector, shallow);

  // 初始化 swiper、panzoom
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    useStore.setState((state) => {
      state.rootRef = rootRef as Draft<React.RefObject<HTMLElement>>;
      if (option) Object.assign(state.option, option);
    });

    const [_swiper, _panzoom] = initSwiper();
    useStore.setState((state) => {
      state.swiper = _swiper;
      state.panzoom = _panzoom;
    });
  }, [option, initSwiper]);

  // 绑定 resizeObserver
  useEffect(() => {
    if (!rootRef.current) return;
    resizeObserver.disconnect();
    resizeObserver.observe(rootRef.current);
  }, [resizeObserver]);

  // 初始化图片
  useEffect(() => {
    useStore.setState((state) => {
      if (fillEffect) state.fillEffect = fillEffect;

      imgList.forEach((imgUrl, index) => {
        state.imgList[index] = {
          type: '',
          index,
          src: imgUrl,
          loadType: 'wait',
        };
      });
    });
  }, [imgList, fillEffect]);

  useEffect(() => {
    useStore.setState((state) => {
      if (onExit) state.onExit = onExit;
      if (onPrev) state.onPrev = onPrev;
      if (onNext) state.onNext = onNext;

      if (editButtonList) state.editButtonList = editButtonList;
      if (editSettingList) state.editSettingList = editSettingList;
    });
  }, [editButtonList, editSettingList, onExit, onNext, onPrev]);

  // 绑定配置发生改变时的回调
  useEffect(() => {
    if (onOptionChange)
      useStore.subscribe((state) => state.option, onOptionChange);
  }, [onOptionChange]);

  // 页数发生变动时，预加载当前页前后指定数量的图片，并取消其他预加载的图片
  const updateImgLoadType = useStore((state) => state.img.updateImgLoadType);
  useEffect(() => {
    useStore.subscribe((state) => state.activeImgIndex, updateImgLoadType);
  }, [updateImgLoadType]);

  return rootRef;
};
