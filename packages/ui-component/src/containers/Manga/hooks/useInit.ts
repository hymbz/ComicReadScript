import type { Draft } from 'immer';
import { useEffect, useRef } from 'react';
import { useStore } from './useStore';
import type { MangaProps } from '..';

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
  // 初始化配置
  useEffect(() => {
    if (!option) return;
    useStore.setState((state) => {
      Object.assign(state.option, option);
    });
  }, [option]);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 绑定 rootRef
    useStore.setState((state) => {
      state.rootRef = rootRef as Draft<React.RefObject<HTMLElement>>;
    });
    // 初始化 panzoom
    useStore.setState((state) => {
      state.initPanzoom();
    });
  }, []);

  // 绑定 resizeObserver
  useEffect(() => {
    useStore.setState((state) => {
      state.img.resizeObserver.disconnect();
      state.img.resizeObserver.observe(rootRef.current!);
    });
    return () => {
      useStore.setState((state) => {
        state.img.resizeObserver.disconnect();
      });
    };
  }, []);

  // 初始化图片
  useEffect(() => {
    useStore.setState((state) => {
      if (fillEffect) state.fillEffect = fillEffect;

      state.imgList = imgList.map((imgUrl, index) => ({
        index,
        type: '',
        src: imgUrl,
        loadType: 'wait',
      }));
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
    if (!onOptionChange) return;
    useStore.subscribe((state) => state.option, onOptionChange);
  }, [onOptionChange]);

  // 页数发生变动时
  useEffect(() => {
    useStore.subscribe(
      (state) => state.activeSlideIndex,
      () => {
        useStore.setState((state) => {
          // 重新计算 activeImgIndex
          state.activeImgIndex =
            state.slideData[state.activeSlideIndex].find(
              (img) => img.type !== 'fill',
            )?.index ?? 0;

          // 找到当前所属的 fillEffect
          let nowFillIndex = state.activeImgIndex;
          while (!state.fillEffect.has(nowFillIndex) && (nowFillIndex -= 1));
          state.nowFillIndex = nowFillIndex;

          state.img.updateImgLoadType();
          if (state.showEndPage) state.showEndPage = false;
        });
      },
    );
  }, []);

  return rootRef;
};
