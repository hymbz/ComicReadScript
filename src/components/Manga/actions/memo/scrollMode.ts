import type { ComicImg } from '../../store/image';

import { createRootMemo } from '../../../../helper';
import { store } from '../../store';
import { getImg } from '../helper';
import { imgList } from './img';
import { isDoubleMode, isScrollMode } from './options';

/** 卷轴模式下的每页高度 */
export const pageHeightList = createRootMemo(() => {
  if (!isScrollMode()) return [];
  if (!isDoubleMode()) return imgList().map((img) => img.size.height ?? 0);

  const doubleWidth = store.rootSize.width / 2;

  return store.pageList.map((indexs) => {
    if (indexs.length === 1) return getImg(indexs[0]).size.height;

    // 选择更高的那张图片作为行高度，尽量放大图片
    let targetImg: ComicImg | undefined;
    for (const i of indexs) {
      if (i === -1) continue;
      const img = getImg(i);
      if (!targetImg || img.size.height > targetImg.size.height)
        targetImg = img;
    }
    if (!targetImg) throw new Error('找不到图片');
    if (
      targetImg.size.width < doubleWidth &&
      !store.option.scrollMode.fitToWidth
    )
      return targetImg.size.height;
    return targetImg.size.height * (doubleWidth / targetImg.size.width);
  });
});

/** 卷轴模式下每页位置 */
export const pageTopList = createRootMemo(() => {
  if (!isScrollMode()) return [];

  const list = Array.from<number>({ length: store.pageList.length });
  for (let top = 0, i = 0; i < store.pageList.length; i++) {
    list[i] = top;
    top += pageHeightList()[i] + store.option.scrollMode.spacing * 7;
  }
  return list;
});

/** 卷轴模式下漫画流的总高度 */
export const contentHeight = createRootMemo(() => {
  if (!isScrollMode()) return 0;
  return (pageTopList().at(-1) ?? 0) + (pageHeightList().at(-1) ?? 0);
});

/** 获取卷轴模式下指定页的位置 */
export const getPageTop = (index: number) => {
  if (Reflect.has(pageTopList(), index)) return pageTopList()[index];
  if (index < 0) return 0;
  return contentHeight();
};

/** 找到卷轴模式下指定高度上显示的页面 */
export const findTopPage = (top: number, initIndex = 0) => {
  if (top > contentHeight()) return pageTopList().length - 1;

  for (let i = initIndex; i < pageTopList().length; i++)
    if (pageTopList()[i] > top) return i === 0 ? 0 : i - 1;

  return pageTopList().length - 1;
};
