import { isEqual } from 'helper';

import { autoCloseFill, handleComicData } from '../handleComicData';
import { type State } from '../store';

import { activeImgIndex, isOnePageMode } from './memo/common';

/** 重新计算 PageData */
export const updatePageData = (state: State) => {
  const lastActiveImgIndex = activeImgIndex();

  let newPageList: PageList = [];
  newPageList = isOnePageMode()
    ? state.imgList.map((_, i) => [i])
    : handleComicData(state.imgList, state.fillEffect);
  if (!isEqual(state.pageList, newPageList)) state.pageList = newPageList;

  // 在图片排列改变后自动跳转回原先显示图片所在的页数
  if (lastActiveImgIndex !== activeImgIndex()) {
    const newActivePageIndex = state.pageList.findIndex((page) =>
      page.includes(lastActiveImgIndex),
    );
    if (newActivePageIndex !== -1) state.activePageIndex = newActivePageIndex;
  }
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
