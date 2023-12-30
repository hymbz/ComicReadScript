/* eslint-disable solid/reactivity */
import { debounce, throttle } from 'throttle-debounce';
import { createEffect, on, onCleanup } from 'solid-js';

import { assign } from 'helper';
import type { MangaProps } from '..';
import type { State } from '../store';
import { refs, setState, store } from '../store';
import {
  defaultHotkeys,
  focus,
  handleResize,
  resetImgState,
  updateImgLoadType,
  updatePageData,
} from '../actions';
import { defaultOption, type Option } from '../store/option';
import { playAnimation } from '../helper';

const createComicImg = (url: string): ComicImg => ({
  type: store.flag.autoWide ? 'wide' : '',
  src: url || '',
  loadType: 'wait',
});

export const useInit = (props: MangaProps) => {
  const watchProps: Partial<
    Record<keyof MangaProps, (state: State) => unknown>
  > = {
    option: (state) => {
      state.option = props.option
        ? assign(state.option, props.option as Option)
        : (JSON.parse(JSON.stringify(defaultOption)) as Option);
    },
    fillEffect: (state) => {
      state.fillEffect = props.fillEffect ?? { '-1': true };
      updatePageData(state);
    },
    hotkeys: (state) => {
      state.hotkeys = {
        ...JSON.parse(JSON.stringify(defaultHotkeys)),
        ...props.hotkeys,
      };
    },

    onExit: (state) => {
      state.prop.Exit = props.onExit
        ? (isEnd?: boolean | Event) => {
            playAnimation(refs.exit);
            props.onExit?.(!!isEnd);
            setState((draftState) => {
              if (isEnd) draftState.activePageIndex = 0;
              draftState.show.endPage = undefined;
            });
          }
        : undefined;
    },
    onPrev: (state) => {
      state.prop.Prev = props.onPrev
        ? debounce(
            1000,
            () => {
              playAnimation(refs.prev);
              props.onPrev?.();
            },
            { atBegin: true },
          )
        : undefined;
    },
    onNext: (state) => {
      state.prop.Next = props.onNext
        ? debounce(
            1000,
            () => {
              playAnimation(refs.next);
              props.onNext?.();
            },
            { atBegin: true },
          )
        : undefined;
    },
    editButtonList: (state) => {
      state.prop.editButtonList = props.editButtonList ?? ((list) => list);
    },
    editSettingList: (state) => {
      state.prop.editSettingList = props.editSettingList ?? ((list) => list);
    },
    onLoading: (state) => {
      state.prop.Loading = props.onLoading
        ? debounce(100, props.onLoading)
        : undefined;
    },
    onOptionChange: (state) => {
      state.prop.OptionChange = props.onOptionChange
        ? debounce(100, props.onOptionChange)
        : undefined;
    },
    onHotkeysChange: (state) => {
      state.prop.HotkeysChange = props.onHotkeysChange
        ? debounce(100, props.onHotkeysChange)
        : undefined;
    },
    commentList: (state) => {
      state.commentList = props.commentList;
    },
  };
  Object.entries(watchProps).forEach(([key, fn]) =>
    createEffect(
      on(
        () => props[key as keyof MangaProps],
        () => setState(fn),
      ),
    ),
  );

  // 初始化页面比例
  handleResize(refs.root.scrollWidth, refs.root.scrollHeight);
  // 在 rootDom 的大小改变时更新比例，并重新计算图片类型
  const resizeObserver = new ResizeObserver(
    throttle<ResizeObserverCallback>(100, ([{ contentRect }]) => {
      handleResize(contentRect.width, contentRect.height);
    }),
  );
  resizeObserver.disconnect();
  resizeObserver.observe(refs.root);
  onCleanup(() => resizeObserver.disconnect());

  const handleImgList = () => {
    setState((state) => {
      state.show.endPage = undefined;

      /** 修改前的当前显示图片 */
      const oldActiveImg =
        state.pageList[state.activePageIndex]?.map(
          (i) => state.imgList?.[i]?.src,
        ) ?? [];

      /** 判断是否有影响到现有图片流的改动 */
      let isChange = state.imgList.length !== props.imgList.length;

      const imgMap = new Map(state.imgList.map((img) => [img.src, img]));
      for (let i = 0; i < props.imgList.length; i++) {
        const url = props.imgList[i];
        const img = url && !isChange && state.imgList[i];
        if (img && img.loadType !== 'wait' && img.src && img.src !== url)
          isChange = true;
        state.imgList[i] = imgMap.get(url) ?? createComicImg(url);
      }
      if (state.imgList.length > props.imgList.length) {
        state.imgList.length = props.imgList.length;
        isChange = true;
      }

      if (isChange) {
        state.fillEffect = props.fillEffect ?? { '-1': true };
        resetImgState(state);
        updatePageData(state);
      } else updateImgLoadType(state);
      state.prop.Loading?.(state.imgList);

      if (state.pageList.length === 0) {
        state.activePageIndex = 0;
        return;
      }

      // 尽量使当前显示的图片在修改后依然不变
      oldActiveImg.some((url) => {
        // 跳过填充页和已被删除的图片
        if (!url || props.imgList.includes(url)) return false;

        const newPageIndex = state.pageList.findIndex((page) =>
          page.some((index) => state.imgList?.[index]?.src === url),
        );
        if (newPageIndex === -1) return false;

        state.activePageIndex = newPageIndex;
        return true;
      });

      // 如果已经翻到了最后一页，且最后一页的图片被删掉了，那就保持在末页显示
      if (state.activePageIndex > state.pageList.length - 1)
        state.activePageIndex = state.pageList.length - 1;
    });
  };

  // 处理 imgList 参数的初始化和修改
  createEffect(on(() => props.imgList.join(), throttle(500, handleImgList)));

  focus();
};
