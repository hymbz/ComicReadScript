import type { PixelList } from '../helper';
import type { ImgContext, ImgContextMargin, TBLR } from './workHelper';

import {
  getAreaColor,
  getAreaEdgeRatio,
  getEdgeArea,
  getSquareAreaColor,
} from './colorArea';
import { boil } from './workHelper';

/** 根据边缘颜色区域获取背景颜色 */
const byEdgeArea = ({ data, grayList, width, height }: ImgContext) => {
  const areaList = getEdgeArea(grayList, width, height);
  // if (isDevMode) mainFn.showColorArea?.(data, width, height, ...areaList);

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

const getPosAreaColor = (
  pos: TBLR,
  { data, blankMargin, width: w, height: h }: ImgContextMargin,
) => {
  switch (pos) {
    case 'top':
      return getSquareAreaColor(data, 0, 0, w, blankMargin.top * h);
    case 'bottom':
      return getSquareAreaColor(data, 0, h - blankMargin.bottom * h, w, h);
    case 'left':
      return getSquareAreaColor(data, 0, 0, blankMargin.left * w, h);
    case 'right':
      return getSquareAreaColor(data, w - blankMargin.right * w, 0, w, h);
  }
};

/** 从足够大的空白边缘中获取背景颜色 */
const byBlankMargin = (context: ImgContextMargin) => {
  const colorMap: Record<string, number> = {};

  for (const pos of ['top', 'bottom', 'left', 'right'] as const) {
    if (!context.blankMargin[pos]) continue;
    const color = getPosAreaColor(pos, context);
    if (!color) continue;
    colorMap[color] = (colorMap[color] || 0) + context.blankMargin[pos];
  }

  // 过滤占比过低的空白边缘
  const colorList = Object.entries(colorMap).filter(([, v]) => v > 0.04);
  if (colorList.length === 0) return undefined;
  return boil(colorList, (a, b) => (a[1] > b[1] ? a : b))?.[0];
};

/** 判断图像的背景色 */
export const getBackground = (context: ImgContext) =>
  ('blankMargin' in context && byBlankMargin(context)) || byEdgeArea(context);
