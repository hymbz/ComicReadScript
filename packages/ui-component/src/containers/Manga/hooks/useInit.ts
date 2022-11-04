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
    if (!onOptionChange) return undefined;
    return useStore.subscribe((state) => state.option, onOptionChange);
  }, [onOptionChange]);

  // 绑定图片加载状态发生变化时触发的回调
  useEffect(() => {
    if (!onLoading) return undefined;
    return useStore.subscribe(
      (state) => state.imgList,
      (list) =>
        onLoading(
          list.filter((img) => img.loadType === 'loaded').length,
          list.length,
        ),
    );
  }, [onLoading]);

  return rootRef;
};
