import { createRootMemo } from 'helper';

import { store } from '../../store';
import { type ComicImg } from '../../store/image';
import { getImg } from '../helper';
import { imgList } from './img';
import { isDoubleMode, isScrollMode } from './options';

/** 双页卷轴模式下的页面列表（按行分组） */
export const scrollPageList = createRootMemo<([number] | [number, number])[][]>(
  () => {
    if (!isDoubleMode()) return store.pageList.map((page) => [page]);

    const { pageColumns } = store.option.scrollMode;
    if (pageColumns <= 1) return store.pageList.map((page) => [page]);

    const rows: ([number] | [number, number])[][] = [];
    for (let i = 0; i < store.pageList.length; i += pageColumns)
      rows.push(store.pageList.slice(i, i + pageColumns));
    return rows;
  },
);

/** 卷轴模式下每行高度 */
export const pageHeightList = createRootMemo(() => {
  if (!isScrollMode()) return [];
  if (!isDoubleMode()) return imgList().map((img) => img.size.height ?? 0);

  const { pageColumns } = store.option.scrollMode;
  const doubleWidth = store.rootSize.width / pageColumns / 2;

  const imgDisplayHeight = ({ width, height }: ComicImg['size']) =>
    width < doubleWidth && store.option.scrollMode.adjustToWidth === 'disable'
      ? height
      : height * (doubleWidth / width);

  return scrollPageList().map((row) =>
    Math.max(
      ...row.flatMap((indexs) =>
        indexs
          .filter((i) => i !== -1)
          .map((i) => imgDisplayHeight(getImg(i).size)),
      ),
    ),
  );
});

/** 卷轴模式下每页位置 */
export const pageTopList = createRootMemo(() => {
  if (!isScrollMode()) return [];

  const list = Array.from<number>({ length: store.pageList.length });
  const rows = scrollPageList();

  for (let top = 0, i = 0, rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx];
    for (let col = 0; col < row.length; col++) list[i + col] = top;
    i += row.length;
    top += pageHeightList()[rowIdx] + store.option.scrollMode.spacing * 7;
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
