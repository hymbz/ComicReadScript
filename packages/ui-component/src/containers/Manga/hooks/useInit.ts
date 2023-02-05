import type { Draft } from 'immer';
import { useEffect, useRef } from 'react';
import { debounce, throttle } from 'throttle-debounce';
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
  onLoading,
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
    useStore.setState((state) => {
      // 绑定 rootRef
      state.rootRef = rootRef as Draft<React.RefObject<HTMLElement>>;
      // 初始化 panzoom
      state.initPanzoom();
    });
  }, []);

  useEffect(() => {
    // 初始化页面比例
    useStore.setState((state) => {
      state.img.updatePageRatio(
        state,
        rootRef.current!.scrollWidth,
        rootRef.current!.scrollHeight,
      );
    });

    // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
    const resizeObserver = new ResizeObserver(
      throttle<ResizeObserverCallback>(100, ([entries]) => {
        const { width, height } = entries.contentRect;
        useStore.setState((state) => {
          state.img.updatePageRatio(state, width, height);
        });
      }),
    );
    resizeObserver.disconnect();
    resizeObserver.observe(rootRef.current!);

    return () => resizeObserver.disconnect();
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
    if (!onOptionChange) return undefined;
    return useStore.subscribe((state) => state.option, onOptionChange);
  }, [onOptionChange]);

  // 绑定图片加载状态发生变化时触发的回调
  useEffect(() => {
    if (!onLoading) return;
    useStore.setState((state) => {
      state.onLoading = debounce(100, onLoading);
    });
  }, [onLoading]);

  return rootRef;
};
