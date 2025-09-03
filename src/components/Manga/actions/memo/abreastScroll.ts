import { createSignal } from 'solid-js';

import { clamp, createRootMemo, createThrottleMemo } from 'helper';

import { placeholderSize } from '.';
import { store } from '../../store';
import { getImg } from '../helper';
import { isAbreastMode } from './options';

/** 并排卷轴模式下的全局滚动填充 */
export const [abreastScrollFill, _setAbreastScrollFill] = createSignal(0);

type Position = { column: number; top: number }[];

type Area = {
  columns: number[][];
  position: Record<number, Position>;
  length: number;
};

/** 并排卷轴模式下的每列布局 */
export const abreastArea = createRootMemo<Area>(
  (prev): Area => {
    if (!isAbreastMode()) return prev;

    const columns: number[][] = [[]];
    const position: Area['position'] = {};
    let length = 0;

    const rootHeight = store.rootSize.height;
    if (!rootHeight || store.imgList.length === 0)
      return { columns, position, length };

    const repeatHeight = rootHeight * store.option.scrollMode.abreastDuplicate;

    /** 当前图片在当前列的所在高度 */
    let top = abreastScrollFill();

    while (top > rootHeight) {
      top -= rootHeight - repeatHeight;
      columns.push([]);
    }

    for (let i = 0; i < store.imgList.length; i++) {
      const img = getImg(i);
      const imgPosition: Position = [];

      const imgHeight = img.size.height;
      length += imgHeight;
      let height = imgHeight;

      while (height > 0) {
        columns.at(-1)!.push(i);
        imgPosition.push({ column: columns.length - 1, top });

        if (top < 0 && imgPosition.length > 1) top = 0;
        const availableHeight = rootHeight - top;
        top += height;
        height -= availableHeight;

        // 填满一列后换行
        if (top < rootHeight) continue;
        columns.push([]);
        top = height - imgHeight;

        // 复现上列结尾
        if (!repeatHeight || columns.length === 1) continue;
        top += repeatHeight;

        height = Math.min(imgHeight, height + repeatHeight);

        /** 为了复现而出现的空白部分高度 */
        let emptyTop = top;
        let prevImgIndex = i;

        while (prevImgIndex >= 1 && emptyTop > 0) {
          prevImgIndex -= 1;
          // 把上一张图片加进来填补空白
          columns.at(-1)!.push(prevImgIndex);

          const prevImgHeight = getImg(prevImgIndex).size.height;
          emptyTop -= prevImgHeight;

          position[prevImgIndex].push({
            column: columns.length - 1,
            top: emptyTop,
          });
        }
      }

      position[i] = imgPosition;
    }

    return { columns, position, length };
  },
  { columns: [], position: {}, length: 0 },
);

/** 头尾滚动的限制值 */
const scrollFillLimit = createRootMemo(
  () => abreastArea().length - store.rootSize.height,
);
export const setAbreastScrollFill = (val: number) =>
  _setAbreastScrollFill(clamp(-scrollFillLimit(), val, scrollFillLimit()));

/** 并排卷轴模式下的列宽度 */
export const abreastColumnWidth = createRootMemo(() =>
  isAbreastMode()
    ? placeholderSize().width * store.option.scrollMode.imgScale
    : 0,
);

/** 并排卷轴模式下当前要显示的列 */
export const abreastShowColumn = createThrottleMemo(() => {
  if (!isAbreastMode() || abreastArea().columns.length === 0)
    return { start: 0, end: 0 };

  const columnWidth =
    abreastColumnWidth() + store.option.scrollMode.spacing * 7;
  return {
    start: clamp(
      0,
      Math.floor(store.page.offset.x.px / columnWidth),
      abreastArea().columns.length - 1,
    ),
    end: clamp(
      0,
      Math.floor((store.page.offset.x.px + store.rootSize.width) / columnWidth),
      abreastArea().columns.length - 1,
    ),
  };
});

/** 并排卷轴模式下的漫画流宽度 */
export const abreastContentWidth = createRootMemo(
  () =>
    abreastArea().columns.length * abreastColumnWidth() +
    (abreastArea().columns.length - 1) * store.option.scrollMode.spacing * 7,
);

/** 并排卷轴模式下的最大滚动距离 */
export const abreastScrollWidth = createRootMemo(
  () => abreastContentWidth() - store.rootSize.width,
);

/** 并排卷轴模式下每个图片所在位置的样式 */
export const imgAreaStyle = createRootMemo(() => {
  if (!isAbreastMode() || store.gridMode) return '';

  let styleText = '';

  for (const index of store.imgList.keys()) {
    let imgNum = 0;
    for (const { column, top } of abreastArea().position[index] ?? []) {
      const itemStyle = `grid-area: _${column} !important; transform: translateY(${top}px);`;
      styleText += `#_${index}_${imgNum} { ${itemStyle} }\n`;
      imgNum += 1;
    }
  }

  return styleText;
});
