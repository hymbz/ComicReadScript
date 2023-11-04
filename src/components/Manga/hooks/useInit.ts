import { debounce, throttle } from 'throttle-debounce';
import { createEffect, onCleanup } from 'solid-js';

import { assign, isEqualArray } from 'helper';
import type { MangaProps } from '..';
import { store, setState } from './useStore';
import { updatePageData, handleResize } from './useStore/slice';
import type { Option } from './useStore/OptionState';
import { autoCloseFill } from '../handleComicData';
import { playAnimation } from '../helper';
import { defaultHotkeys } from './useStore/OtherState';

const createComicImg = (url: string): ComicImg => ({
  type: '',
  src: url || '',
  loadType: 'wait',
});

/** 初始化 */
export const useInit = (props: MangaProps, rootRef: HTMLElement) => {
  // 绑定 rootRef
  setState((state) => {
    state.rootRef = rootRef;
  });

  // 初始化配置
  createEffect(() => {
    setState((state) => {
      if (props.option)
        state.option = assign(state.option, props.option as Option);
      state.hotkeys = {
        ...JSON.parse(JSON.stringify(defaultHotkeys)),
        ...props.hotkeys,
      };
    });
  });

  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(
    throttle<ResizeObserverCallback>(100, ([entries]) => {
      const { width, height } = entries.contentRect;
      setState((state) => {
        handleResize(state, width, height);
      });
    }),
  );
  // 初始化页面比例
  setState((state) => {
    handleResize(state, rootRef.scrollWidth, rootRef.scrollHeight);
  });
  resizeObserver.disconnect();
  resizeObserver.observe(rootRef);
  onCleanup(() => resizeObserver.disconnect());

  createEffect(() => {
    setState((state) => {
      state.onExit = props.onExit
        ? (isEnd?: boolean | Event) => {
            playAnimation(store.exitRef);
            props.onExit?.(!!isEnd);
            if (isEnd) state.activePageIndex = 0;
            state.endPageType = undefined;
          }
        : undefined;
      state.onPrev = props.onPrev
        ? () => {
            playAnimation(store.prevRef);
            props.onPrev?.();
          }
        : undefined;
      state.onNext = props.onNext
        ? () => {
            playAnimation(store.nextRef);
            props.onNext?.();
          }
        : undefined;

      if (props.editButtonList) state.editButtonList = props.editButtonList;
      if (props.editSettingList) state.editSettingList = props.editSettingList;

      state.commentList = props.commentList;

      state.onLoading = props.onLoading
        ? debounce(100, props.onLoading)
        : undefined;
      state.onOptionChange = props.onOptionChange
        ? debounce(100, props.onOptionChange)
        : undefined;
      state.onHotkeysChange = props.onHotkeysChange
        ? debounce(100, props.onHotkeysChange)
        : undefined;
    });
  });

  // 处理 imgList fillEffect 参数的初始化和修改
  createEffect(() => {
    setState((state) => {
      if (props.fillEffect) state.fillEffect = props.fillEffect;

      // 处理初始化
      if (!state.imgList.length) {
        state.flag.autoScrollMode = true;
        state.flag.autoWide = true;
        autoCloseFill.clear();

        state.fillEffect[-1] = state.option.firstPageFill;
        state.imgList = [...props.imgList].map(createComicImg);
        updatePageData(state);
        state.onLoading?.(state.imgList);
        return;
      }

      if (
        isEqualArray(
          props.imgList,
          state.imgList.map(({ src }) => src),
        )
      )
        return state.onLoading?.(state.imgList);

      state.endPageType = undefined;

      /** 修改前的当前显示图片 */
      const oldActiveImg =
        state.pageList[state.activePageIndex]?.map(
          (i) => state.imgList?.[i]?.src,
        ) ?? [];

      state.imgList = [...props.imgList].map(
        (imgUrl) =>
          state.imgList.find((img) => img.src === imgUrl) ??
          createComicImg(imgUrl),
      );
      state.fillEffect = { '-1': true };
      updatePageData(state);
      state.onLoading?.(state.imgList);

      if (state.pageList.length === 0) {
        state.activePageIndex = 0;
        return;
      }

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

      // 如果已经翻到了最后一页，且最后一页的图片被删掉了，那就保持在末页显示
      if (state.activePageIndex > state.pageList.length - 1)
        state.activePageIndex = state.pageList.length - 1;
    });
  });
};
