import type { getBlankMargin } from './blankMargin';
import {
  getAreaColor,
  getAreaEdgeRatio,
  getEdgeArea,
  getSquareAreaColor,
} from './colorArea';
import type { PixelList } from './helper';
import { boil } from './workHelper';

/** 根据边缘颜色区域获取背景颜色 */
const byEdgeArea = (
  data: Uint8ClampedArray,
  grayList: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const areaList = getEdgeArea(grayList, width, height);
  // if (isDevMode) mainFn.showColorArea?.(data, w, h, maxArea);

  if (areaList.length === 0) return undefined;
  const minimum = width * height * 0.02;
  let maxArea: undefined | PixelList;
  let maxRatio = 0.1;

  // 过滤总体占比和边缘占比过小的区域
  for (const pixelList of areaList) {
    if (pixelList.size < minimum) continue;
    const edgeRatio = getAreaEdgeRatio(pixelList, width, height);
    if (edgeRatio < maxRatio) continue;
    maxArea = pixelList;
    maxRatio = edgeRatio;
  }

  if (!maxArea) return undefined;
  return getAreaColor(data, maxArea);
};

/** 从足够大的空白边缘中获取背景颜色 */
const byBlankMargin = (
  data: Uint8ClampedArray,
  blankMargin: ReturnType<typeof getBlankMargin>,
  width: number,
  height: number,
) => {
  const colorMap: Record<string, number> = {};
  const minimum = 5;

  if (blankMargin.top > minimum) {
    const color = getSquareAreaColor(data, 0, 0, width, blankMargin.top);
    if (color) colorMap[color] = (colorMap[color] || 0) + blankMargin.top;
  }

  if (blankMargin.bottom > minimum) {
    const color = getSquareAreaColor(
      data,
      0,
      height - blankMargin.bottom,
      width,
      height,
    );
    if (color) colorMap[color] = (colorMap[color] || 0) + blankMargin.bottom;
  }

  if (blankMargin.left > minimum) {
    const color = getSquareAreaColor(data, 0, 0, blankMargin.left, height);
    if (color) colorMap[color] = (colorMap[color] || 0) + blankMargin.left;
  }

  if (blankMargin.right > minimum) {
    const color = getSquareAreaColor(
      data,
      width - blankMargin.right,
      0,
      width,
      height,
    );
    if (color) colorMap[color] = (colorMap[color] || 0) + blankMargin.right;
  }

  const colorList = Object.entries(colorMap);
  if (colorList.length === 0) return undefined;
  return boil(colorList, (a, b) => (a[1] > b[1] ? a : b))?.[0];
};

/** 判断图像的背景色 */
export const getBackground = (
  data: Uint8ClampedArray,
  grayList: Uint8ClampedArray,
  width: number,
  height: number,
  blankMargin?: ReturnType<typeof getBlankMargin>,
) =>
  (blankMargin && byBlankMargin(data, blankMargin, width, height)) ||
  byEdgeArea(data, grayList, width, height);
