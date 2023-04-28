import { debounce, throttle } from 'throttle-debounce';
import { createEffect, on, onCleanup } from 'solid-js';
import { store, setState } from './useStore';
import type { MangaProps } from '..';
import { updatePageData, updatePageRatio } from './useStore/slice';

/**
 * 初始化
 */
export const useInit = (props: MangaProps, rootRef: HTMLElement) => {
  setState((state) => {
    // 绑定 rootRef
    state.rootRef = rootRef;
    // 初始化 panzoom
  });

  // 初始化配置
  createEffect(() => {
    if (!props.option) return;
    setState((state) => {
      Object.assign(state.option, props.option);
    });
  });

  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(
    throttle<ResizeObserverCallback>(100, ([entries]) => {
      const { width, height } = entries.contentRect;
      setState((state) => {
        updatePageRatio(state, width, height);
      });
    }),
  );
  // 初始化页面比例
  setState((state) => {
    updatePageRatio(state, rootRef.scrollWidth, rootRef.scrollHeight);
  });
  resizeObserver.disconnect();
  resizeObserver.observe(rootRef);
  onCleanup(() => resizeObserver.disconnect());

  // 处理 imgList fillEffect 参数的初始化和修改
  createEffect(() => {
    setState((state) => {
      if (props.fillEffect) state.fillEffect = props.fillEffect;

      // 处理初始化
      if (!state.imgList.length) {
        state.imgList = props.imgList.map((imgUrl) => ({
          type: '',
          src: imgUrl,
          loadType: 'wait',
        }));
        updatePageData(state);
        return;
      }

      /** 修改前的当前显示图片 */
      const oldActiveImg = state.pageList[state.activePageIndex].map(
        (i) => state.imgList?.[i]?.src,
      );

      state.imgList = props.imgList.map(
        (imgUrl) =>
          state.imgList.find((img) => img.src === imgUrl) ?? {
            type: '',
            src: imgUrl,
            loadType: 'wait',
          },
      );
      updatePageData(state);

      // 尽量使当前显示的图片在修改后依然不变
      oldActiveImg.some((imgUrl) => {
        // 跳过填充页和已被删除的图片
        if (!imgUrl || props.imgList.includes(imgUrl)) return false;

        const newPageIndex = state.pageList.findIndex((page) =>
          page.some((index) => state.imgList?.[index]?.src === imgUrl),
        );
        if (newPageIndex === -1) return false;

        state.activePageIndex = newPageIndex;
        return true;
      });

      // 如果已经翻到了最后一页，且最后一页的图片都被删掉了，那就保持在末页显示
      if (state.activePageIndex > state.pageList.length - 1)
        state.activePageIndex = state.pageList.length - 1;
    });
  });

  createEffect(() => {
    setState((state) => {
      if (props.onExit) state.onExit = props.onExit;
      if (props.onPrev) state.onPrev = props.onPrev;
      if (props.onNext) state.onNext = props.onNext;

      if (props.editButtonList) state.editButtonList = props.editButtonList;
      if (props.editSettingList) state.editSettingList = props.editSettingList;

      if (props.onLoading) state.onLoading = debounce(100, props.onLoading);
    });
  });

  // 绑定配置发生改变时的回调
  createEffect(
    on(
      () => store.option,
      async (option, prevOption) => {
        if (!props.onOptionChange) return;
        await props.onOptionChange(option, prevOption!);
      },
    ),
  );
};
