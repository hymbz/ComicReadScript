import { debounce } from 'throttle-debounce';
import { createEffect, createMemo, createRoot, on } from 'solid-js';

import { clamp } from 'helper';
import type { State } from '..';
import { store, setState } from '..';
import { findFillIndex, handleComicData } from '../../../handleComicData';
import {
  contentHeight,
  handleMangaFlowScroll,
  mangaFlowEle,
  updateDrag,
  updateTipText,
  windowHeight,
} from './Scrollbar';
import { setOption } from './Helper';

export const {
  activeImgIndex,
  nowFillIndex,
  activePage,
  imgPlaceholderHeight,
  preloadNum,
} = createRoot(() => {
  const activeImgIndexMemo = createMemo(
    () => store.pageList[store.activePageIndex]?.find((i) => i !== -1) ?? 0,
  );
  const nowFillIndexMemo = createMemo(() =>
    findFillIndex(activeImgIndexMemo(), store.fillEffect),
  );

  const activePageMemo = createMemo(
    () => store.pageList[store.activePageIndex] ?? [],
  );

  const imgPlaceholderHeightMemo = createMemo(() => {
    if (!store.option.scrollMode) return 0;
    // 使用所有已加载图片高度的中位数
    const heightList = store.imgList
      .filter((img) => img.loadType === 'loaded' && img.height)
      .map((img) => img.height!)
      .sort();

    if (!heightList.length) return windowHeight();
    return (
      heightList[Math.floor(heightList.length / 2)] *
      store.option.scrollModeImgScale
    );
  });

  const preloadNumMemo = createMemo(() => ({
    front: store.option.preloadPageNum,
    back: Math.floor(store.option.preloadPageNum / 2),
  }));

  return {
    /** 当前显示的第一张图片的 index */
    activeImgIndex: activeImgIndexMemo,
    /** 当前所处的图片流 */
    nowFillIndex: nowFillIndexMemo,
    /** 当前显示页面 */
    activePage: activePageMemo,
    /** 卷轴模式下的图片占位高度 */
    imgPlaceholderHeight: imgPlaceholderHeightMemo,
    /** 预加载页数 */
    preloadNum: preloadNumMemo,
  };
});

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
    .slice(Math.max(startIndex, 0), clamp(0, state.pageList.length, endIndex))
    .flat()
    .some((index) => {
      if (index === -1) return false;
      const img = state.imgList[index];
      if (!img.src) return false;
      if (img.loadType === 'wait') {
        img.loadType = 'loading';
        editNum += 1;
      }
      return editNum >= loadNum;
    });

  const edited = editNum > 0;
  if (edited) updateTipText();
  return edited;
};

export const zoomScrollModeImg = (zoomLevel?: number) => {
  setOption((draftOption) => {
    draftOption.scrollModeImgScale = !zoomLevel
      ? 1
      : clamp(
          0.1,
          // 放大到整数再运算，避免精度丢失导致的奇怪的值
          (store.option.scrollModeImgScale * 10 + zoomLevel * 10) / 10,
          3,
        );
  });
  // 在调整图片缩放后使当前滚动进度保持不变
  setState((state) => {
    mangaFlowEle().scrollTo({
      top: contentHeight() * state.scrollbar.dragTop,
    });
  });
  handleMangaFlowScroll();
};

/** 根据当前页数更新所有图片的加载状态 */
export const updateImgLoadType = debounce(100, (state: State) => {
  const { imgList, activePageIndex } = state;

  // 先将所有加载中的图片状态改为暂停
  imgList.forEach((img, i) => {
    if (img.loadType === 'loading') imgList[i].loadType = 'wait';
  });

  return (
    // 优先加载当前显示页
    loadImg(state, activePageIndex, activePageIndex + 1) ||
    // 再加载后面几页
    loadImg(state, activePageIndex + 1, activePageIndex + preloadNum().front) ||
    // 再加载前面几页
    loadImg(state, activePageIndex - 10, activePageIndex - preloadNum().back) ||
    // 根据设置决定是否要继续加载其余图片
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

  if (onePageMode || scrollMode || imgList.length <= 1)
    state.pageList = imgList.map((_, i) => [i]);
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
    draftImg.type = imgRatio < state.proportion.条漫比例 ? 'vertical' : '';
  } else {
    draftImg.type = imgRatio > state.proportion.横幅比例 ? 'long' : 'wide';
  }

  if (type === draftImg.type) {
    updateDrag(state);
    updateImgLoadType(state);
    return;
  }

  updatePageData.debounce(state);
};

/** 处理显示窗口的长宽变化 */
export const handleResize = (state: State, width: number, height: number) => {
  if (!(width && height)) return;
  state.proportion.单页比例 = Math.min(width / 2 / height, 1);
  state.proportion.横幅比例 = width / height;
  state.proportion.条漫比例 = state.proportion.单页比例 / 2;

  state.imgList.forEach((img) => updateImgType(state, img));
};

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

/** 切换卷轴模式 */
export const switchScrollMode = () => {
  store.panzoom?.smoothZoomAbs(0, 0, 1);
  setState((state) => {
    state.activePageIndex = 0;
    setOption((draftOption) => {
      draftOption.scrollMode = !draftOption.scrollMode;
      draftOption.onePageMode = draftOption.scrollMode;
    });
    updatePageData(state);
  });
  setTimeout(handleMangaFlowScroll);
};

/** 切换单双页模式 */
export const switchOnePageMode = () => {
  const jump = jumpBackPage(store);
  setOption((draftOption) => {
    draftOption.onePageMode = !draftOption.onePageMode;
  });
  setState(updatePageData);
  jump();
};

/** 切换阅读方向 */
export const switchDir = () =>
  setOption((draftOption) => {
    draftOption.dir = draftOption.dir !== 'rtl' ? 'rtl' : 'ltr';
  });

createRoot(() => {
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
});
