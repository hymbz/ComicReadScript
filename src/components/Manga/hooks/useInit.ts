import { createEffect, on } from 'solid-js';
import { assign, debounce, throttle, createEffectOn } from 'helper';

import { type MangaProps } from '..';
import { type State, refs, setState } from '../store';
import {
  defaultHotkeys,
  focus,
  watchDomSize,
  resetImgState,
  scrollTo,
  updatePageData,
  updateShowRange,
  placeholderSize,
} from '../actions';
import { defaultOption } from '../store/option';
import { playAnimation } from '../helper';
import { autoCloseFill } from '../handleComicData';

const createComicImg = (url: string): ComicImg => ({
  // 使用相对协议路径，防止 Mixed Content 报错
  src: url.replace(/^http:/, ''),
  loadType: 'wait',
  size: placeholderSize(),
});

export const useInit = (props: MangaProps) => {
  watchDomSize('rootSize', refs.root);

  const watchProps: Partial<
    Record<keyof MangaProps, (state: State) => unknown>
  > = {
    option(state) {
      state.option = assign(state.option, props.defaultOption, props.option);
    },
    defaultOption(state) {
      state.defaultOption = assign(defaultOption(), props.defaultOption);
    },
    fillEffect(state) {
      state.fillEffect = props.fillEffect ?? { '-1': true };
      updatePageData(state);
    },

    onExit(state) {
      state.prop.Exit = (isEnd?: boolean | Event) => {
        playAnimation(refs.exit);
        props.onExit?.(Boolean(isEnd));
        setState((draftState) => {
          if (isEnd) draftState.activePageIndex = 0;
          draftState.show.endPage = undefined;
        });
      };
    },
    onPrev(state) {
      state.prop.Prev = props.onPrev
        ? throttle(() => {
            playAnimation(refs.prev);
            props.onPrev?.();
          }, 1000)
        : undefined;
    },
    onNext(state) {
      state.prop.Next = props.onNext
        ? throttle(() => {
            playAnimation(refs.next);
            props.onNext?.();
          }, 1000)
        : undefined;
    },
    editButtonList(state) {
      state.prop.editButtonList = props.editButtonList ?? ((list) => list);
    },
    editSettingList(state) {
      state.prop.editSettingList = props.editSettingList ?? ((list) => list);
    },
    onLoading(state) {
      state.prop.Loading = props.onLoading
        ? debounce(props.onLoading)
        : undefined;
    },
    onOptionChange(state) {
      state.prop.OptionChange = props.onOptionChange
        ? debounce(props.onOptionChange)
        : undefined;
    },
    onHotkeysChange(state) {
      state.prop.HotkeysChange = props.onHotkeysChange
        ? debounce(props.onHotkeysChange)
        : undefined;
    },
    commentList(state) {
      state.commentList = props.commentList;
    },
  };
  for (const [key, fn] of Object.entries(watchProps)) {
    createEffect(
      on(
        () => props[key as keyof MangaProps],
        () => setState(fn),
      ),
    );
  }

  createEffect(() => {
    setState((state) => {
      state.hotkeys = {
        ...JSON.parse(JSON.stringify(defaultHotkeys())),
        ...props.hotkeys,
      };
    });
  });

  const handleImgList = () => {
    setState((state) => {
      state.show.endPage = undefined;

      /** 修改前的当前显示图片 */
      const oldActiveImg =
        state.pageList[state.activePageIndex]?.map(
          (i) => state.imgList?.[i]?.src,
        ) ?? [];

      /** 是否需要重置页面填充 */
      let needResetFillEffect = false;
      const fillEffectList = Object.keys(state.fillEffect).map(Number);
      for (const pageIndex of fillEffectList) {
        if (pageIndex === -1) continue;
        if (state.imgList[pageIndex].src === props.imgList[pageIndex]) continue;
        needResetFillEffect = true;
        break;
      }

      /** 是否需要更新页面 */
      let needUpdatePageData =
        needResetFillEffect || state.imgList.length !== props.imgList.length;
      /** 传入的是否是新漫画 */
      let isNew = true;

      const imgMap = new Map(
        state.imgList.filter((img) => img.src).map((img) => [img.src, img]),
      );
      for (let i = 0; i < props.imgList.length; i++) {
        const url = props.imgList[i];
        // 只有旧图一张不剩才算是新漫画
        if (isNew && imgMap.has(url)) isNew = false;
        // 只要有加载好的旧图被删就要更新页面
        const img = url && !needUpdatePageData && state.imgList[i];
        if (img && img.loadType !== 'wait' && img.src && img.src !== url)
          needUpdatePageData = true;
        state.imgList[i] = imgMap.get(url) ?? createComicImg(url);
      }

      if (state.imgList.length > props.imgList.length) {
        state.imgList.length = props.imgList.length;
        needUpdatePageData = true;
      }

      if (isNew) state.imgList = [...state.imgList];

      state.prop.Loading?.(state.imgList);

      if (isNew || needResetFillEffect) {
        state.fillEffect = props.fillEffect ?? { '-1': true };
        autoCloseFill.clear();
      }

      if (isNew || needUpdatePageData) {
        updatePageData(state);

        // 当前位于最后一页时最后一页被删的处理
        if (state.activePageIndex >= state.pageList.length)
          state.activePageIndex = state.pageList.length - 1;
        updateShowRange(state);
      }

      if (isNew || state.pageList.length === 0) {
        resetImgState(state);
        state.activePageIndex = 0;
        scrollTo(0);
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
  createEffectOn(() => props.imgList.join(','), throttle(handleImgList, 500));

  focus();
};
