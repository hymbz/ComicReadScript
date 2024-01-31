import { clamp, isEqual, debounce } from 'helper';
import { autoCloseFill, handleComicData } from '../handleComicData';
import type { State } from '../store';
import { store } from '../store';
import { scrollTo, setOption } from './helper';
import {
  activeImgIndex,
  contentHeight,
  isOnePageMode,
  preloadNum,
  scrollTop,
} from './memo';

type LoadImgDraft = { editNum: number; loadNum: number };
const loadImg = (state: State, index: number, draft: LoadImgDraft) => {
  if (index === -1) return false;
  const img = state.imgList[index];
  if (!img?.src) return false;
  if (img.loadType === 'wait') {
    img.loadType = 'loading';
    draft.editNum += 1;
  }
  return draft.editNum >= draft.loadNum;
};
const loadPage = (state: State, index: number, draft: LoadImgDraft) =>
  state.pageList[index]?.some((i) => loadImg(state, i, draft));

/**
 * 以当前显示页为基准，预加载附近指定页数的图片，并取消其他预加载的图片
 * @param state state
 * @param loadPageNum 加载页数
 * @param loadNum 加载图片的数量
 * @returns 返回是否成功加载了未加载图片
 */
const loadPageImg = (state: State, loadPageNum = Infinity, loadNum = 2) => {
  const draft: LoadImgDraft = { editNum: 0, loadNum };
  const targetPage = state.activePageIndex + loadPageNum;

  if (targetPage < state.activePageIndex) {
    const end = Math.max(0, targetPage);
    for (let i = state.activePageIndex; i >= end; i--)
      if (loadPage(state, i, draft)) break;
  } else {
    const end = Math.min(state.pageList.length, targetPage);
    for (let i = state.activePageIndex; i < end; i++)
      if (loadPage(state, i, draft)) break;
  }

  return draft.editNum > 0;
};

export const zoomScrollModeImg = (zoomLevel: number, set = false) => {
  const oldHeight = contentHeight();
  const oldScrollTop = scrollTop();

  setOption((draftOption) => {
    const newVal = set
      ? zoomLevel
      : store.option.scrollModeImgScale + zoomLevel;
    draftOption.scrollModeImgScale = clamp(0.1, +newVal.toFixed(2), 3);
  });

  // 在卷轴模式下缩放时保持滚动进度不变
  scrollTo(oldScrollTop ? (oldScrollTop / oldHeight) * contentHeight() : 0);
};

/** 根据当前页数更新所有图片的加载状态 */
export const updateImgLoadType = debounce((state: State) => {
  // 先将所有加载中的图片状态改为暂停
  let i = state.imgList.length;
  while (i--) {
    if (state.imgList[i].loadType === 'loading')
      state.imgList[i].loadType = 'wait';
  }

  return (
    // 优先加载当前显示页
    loadPageImg(state, 1) ||
    // 再加载后面几页
    loadPageImg(state, preloadNum().back) ||
    // 再加载前面几页
    loadPageImg(state, -preloadNum().front) ||
    // 根据设置决定是否要继续加载其余图片
    (!state.option.alwaysLoadAllImg && state.imgList.length > 60) ||
    // 加载当前页后面的图片
    loadPageImg(state, Infinity, 5) ||
    // 加载当前页前面的图片
    loadPageImg(state, -Infinity, 5)
  );
});

/** 重新计算 PageData */
export const updatePageData = (state: State) => {
  const lastActiveImgIndex = activeImgIndex();

  let newPageList: PageList = [];
  if (isOnePageMode()) newPageList = state.imgList.map((_, i) => [i]);
  else newPageList = handleComicData(state.imgList, state.fillEffect);
  if (!isEqual(state.pageList, newPageList)) state.pageList = newPageList;
  updateImgLoadType(state);

  // 在图片排列改变后自动跳转回原先显示图片所在的页数
  if (lastActiveImgIndex !== activeImgIndex())
    state.activePageIndex = state.pageList.findIndex((page) =>
      page.includes(lastActiveImgIndex),
    );
};

/**
 * 将处理图片的相关变量恢复到初始状态
 *
 * 必须按照以下顺序调用
 * 1. 修改 imgList
 * 2. resetImgState
 * 3. updatePageData
 */
export const resetImgState = (state: State) => {
  state.flag.autoScrollMode = false;
  state.flag.autoWide = false;
  state.flag.autoLong = false;
  autoCloseFill.clear();
  // 如果用户没有手动修改过首页填充，才将其恢复初始
  if (typeof state.fillEffect['-1'] === 'boolean')
    state.fillEffect['-1'] =
      state.option.firstPageFill && state.imgList.length > 3;
};
