import { debounce } from 'throttle-debounce';
import { createEffect, createMemo, createRoot, on } from 'solid-js';

import type { State } from '..';
import { store, setState } from '..';
import { findFillIndex, handleComicData } from '../../../handleComicData';
import { updateDrag, updateTipText } from './Scrollbar';

/** 是否需要自动判断开启卷轴模式 */
let autoScrollMode = true;

/**
 * 预加载指定页数的图片，并取消其他预加载的图片
 * @param state state
 * @param startIndex 起始 page index
 * @param endIndex 结束 page index
 * @param loadNum 加载图片的数量
 * @returns 返回指定范围内的图片在执行前是否还有未加载完的
 */
const loadImg = (
  state: State,
  startIndex: number,
  endIndex = startIndex + 1,
  loadNum = 2,
) => {
  let editNum = 0;
  state.pageList
    .slice(
      Math.max(startIndex, 0),
      Math.max(Math.min(endIndex, state.pageList.length), 0),
    )
    .flat()
    .some((index) => {
      if (index === -1) return false;
      const img = state.imgList[index];
      if (img.loadType !== 'loaded') {
        img.loadType = 'loading';
        editNum += 1;
      }
      return editNum >= loadNum;
    });

  const edited = editNum > 0;
  if (edited) updateTipText(state);
  return edited;
};

/** 根据当前页数更新所有图片的加载状态 */
export const updateImgLoadType = debounce(100, (state: State) => {
  const { imgList, activePageIndex } = state;

  // 先将所有加载中的图片状态改为暂停
  imgList.forEach(({ loadType }, i) => {
    if (loadType === 'loading' || loadType === 'error')
      imgList[i].loadType = 'wait';
  });

  return (
    // 优先加载当前显示页
    loadImg(state, activePageIndex, activePageIndex + 1) ||
    // 再加载后十页
    loadImg(state, activePageIndex + 1, activePageIndex + 20) ||
    // 再加载前十页
    loadImg(state, activePageIndex - 10, activePageIndex - 1) ||
    // 默认在页数不多时，继续加载其余图片
    (!state.option.alwaysLoadAllImg && imgList.length > 60) ||
    // 加载当前页后面的图片
    loadImg(state, activePageIndex + 1, imgList.length, 5) ||
    // 加载剩余未加载页面
    loadImg(state, 0, imgList.length, 5)
  );
});

/** 重新计算 PageData */
export const updatePageData = (state: State) => {
  const {
    imgList,
    fillEffect,
    option: { onePageMode, scrollMode },
  } = state;

  if (onePageMode || scrollMode) state.pageList = imgList.map((_, i) => [i]);
  else state.pageList = handleComicData(imgList, fillEffect);
  updateDrag(state);
  updateImgLoadType(state);
};
updatePageData.debounce = debounce(100, updatePageData);

/** 根据比例更新图片类型 */
export const updateImgType = (state: State, draftImg: ComicImg) => {
  const { width, height, type } = draftImg;

  if (!width || !height) return;

  const imgRatio = width / height;
  if (imgRatio <= state.proportion.单页比例) {
    if (imgRatio < state.proportion.条漫比例) draftImg.type = 'vertical';
    else draftImg.type = '';
  } else {
    draftImg.type = imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
  }

  // 当超过3张图的类型为长图时，自动开启卷轴模式
  if (
    !state.option.scrollMode &&
    autoScrollMode &&
    state.imgList.filter((img) => img.type === 'vertical').length > 3
  ) {
    state.option.scrollMode = true;
    autoScrollMode = false;
  }

  if (type === draftImg.type) {
    updateDrag(state);
    updateImgLoadType(state);
    return;
  }

  updatePageData.debounce(state);
};

/** 更新页面比例 */
export const updatePageRatio = (
  state: State,
  width: number,
  height: number,
) => {
  state.proportion.单页比例 = Math.min(width / 2 / height, 1);
  state.proportion.横幅比例 = width / height;
  state.proportion.条漫比例 = state.proportion.单页比例 / 2;

  state.imgList.forEach((img) => updateImgType(state, img));
};

/** 翻页 */
export const turnPage = (state: State, dir: 'next' | 'prev') => {
  if (dir === 'prev') {
    switch (state.endPageType) {
      case 'start':
        if (!state.scrollLock && state.option.flipToNext) {
          state.onPrev?.();
          state.endPageType = undefined;
        }
        return;
      case 'end':
        state.endPageType = undefined;
        return;

      default:
        // 弹出卷首结束页
        if (state.activePageIndex === 0) {
          // 没有 onPrev 时不弹出
          if (!state.onPrev || !state.option.flipToNext) return;

          state.endPageType = 'start';
          state.scrollLock = true;
          window.setTimeout(() => {
            state.scrollLock = false;
          }, 500);
          return;
        }
        if (!state.option.scrollMode) state.activePageIndex -= 1;
    }
  } else {
    switch (state.endPageType) {
      case 'end':
        if (state.scrollLock) return;
        if (state.onNext && state.option.flipToNext) {
          state.onNext();
          state.endPageType = undefined;
          return;
        }
        if (state.onExit) {
          state.onExit(true);
          state.activePageIndex = 0;
          state.endPageType = undefined;
        }
        return;
      case 'start':
        state.endPageType = undefined;
        return;

      default:
        // 弹出卷尾结束页
        if (state.activePageIndex === state.pageList.length - 1) {
          state.endPageType = 'end';
          state.scrollLock = true;
          window.setTimeout(() => {
            state.scrollLock = false;
          }, 200);
          return;
        }
        if (!state.option.scrollMode) state.activePageIndex += 1;
    }
  }
};

export const { activeImgIndex, nowFillIndex } = createRoot(() => {
  const activeImgIndexMemo = createMemo(
    () => store.pageList[store.activePageIndex]?.find((i) => i !== -1) ?? 0,
  );
  const nowFillIndexMemo = createMemo(() =>
    findFillIndex(activeImgIndexMemo(), store.fillEffect),
  );

  // 页数发生变动时
  createEffect(
    on(
      () => store.activePageIndex,
      () => {
        setState((state) => {
          updateImgLoadType(state);
          if (state.endPageType) state.endPageType = undefined;
        });
      },
      { defer: true },
    ),
  );

  return {
    /** 当前显示的第一张图片的 index */
    activeImgIndex: activeImgIndexMemo,
    /** 当前所处的图片流 */
    nowFillIndex: nowFillIndexMemo,
  };
});

/** 在图片排列改变后自动跳转回原先显示图片所在的页数 */
export const jumpBackPage = (state: State) => {
  const lastActiveImgIndex = activeImgIndex();
  return () => {
    state.activePageIndex = state.pageList.findIndex((page) =>
      page.includes(lastActiveImgIndex),
    );
  };
};

/** 切换页面填充 */
export const switchFillEffect = () => {
  setState((state) => {
    // 如果当前页不是双页显示的就跳过，避免在显示跨页图的页面切换却没看到效果的疑惑
    if (state.pageList[state.activePageIndex].length !== 2) return;

    const jump = jumpBackPage(state);
    state.fillEffect[nowFillIndex()] = !state.fillEffect[nowFillIndex()];
    updatePageData(state);
    jump();
  });
};
