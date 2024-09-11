import { type PixelList } from './helper';
import {
  forEachEdge,
  getEdgeScope,
  mainFn,
  resizeImg,
  toGrayList,
} from './workHelper';

/** 获取颜色区域在边缘区域上的占比 */
export const getAreaEdgeRatio = (
  pixelList: PixelList,
  width: number,
  height: number,
) => {
  let size = 0;
  const edgeScope = getEdgeScope(width, height);
  const add = (i: number) => pixelList.has(i) && size++;
  forEachEdge(width, height, edgeScope, add);
  return (
    size / (width * edgeScope * 2 + (height - 2 * edgeScope) * edgeScope * 2)
  );
};

/** 根据灰度值获取图片边缘相似颜色的区域 */
export const getEdgeArea = (
  grayList: Uint8ClampedArray,
  width: number,
  height: number,
): PixelList[] => {
  const imgSize = width * height;
  const maximum = imgSize * 0.4;
  const minimum = imgSize * 0.02;

  const areaMap = new Map<number, Set<number>>();

  /** 待检查相邻像素的像素 */
  const seedPixel = new Set<number>();

  const addSeedPixel = (index: number) => {
    const gray = grayList[index];
    if (gray === undefined) return;
    seedPixel.add(index);
    if (!areaMap.has(gray)) areaMap.set(gray, new Set());
    areaMap.get(gray)!.add(index);
  };

  const popSeedPixel = () => {
    if (seedPixel.size === 0) return undefined;
    const index = seedPixel.values().next().value as number;
    seedPixel.delete(index);
    return index;
  };

  // 将边缘区域的像素设为种子
  const edgeScope = getEdgeScope(width, height);
  forEachEdge(width, height, edgeScope, addSeedPixel);

  /** 获取相邻像素 */
  const getAdjacentPixel = (i: number) => {
    const adjacentPixel: number[] = [];

    const x = i % width;
    const y = Math.floor(i / width);

    const left = x !== 0;
    const up = y >= 1;
    const right = x < width - 1;
    const down = y < height - 1;

    if (left) adjacentPixel.push(i - 1); // ←
    if (up) adjacentPixel.push(i - width); // ↑
    if (right) adjacentPixel.push(i + 1); // →
    if (down) adjacentPixel.push(i + width); // ↓
    if (left && up) adjacentPixel.push(i - width - 1); // ↖
    if (left && down) adjacentPixel.push(i + width - 1); // ↙
    if (right && up) adjacentPixel.push(i - width + 1); // ↗
    if (right && down) adjacentPixel.push(i + width + 1); // ↘

    return adjacentPixel;
  };

  // 从种子像素开始不断合并相同灰度的像素形成区域
  for (let i = popSeedPixel(); i !== undefined; i = popSeedPixel()) {
    const gray = grayList[i];
    const areaPixelList = areaMap.get(gray)!;

    const adjacentPixelList = getAdjacentPixel(i);

    for (const adjacentPixel of adjacentPixelList) {
      if (areaPixelList.has(adjacentPixel)) continue;

      const pixelGray = grayList[adjacentPixel];
      if (pixelGray !== gray) continue;

      addSeedPixel(adjacentPixel);
    }

    // 如果当前区域像素数量超过阈值，就直接认定其为背景
    if (areaPixelList.size > maximum) return [areaPixelList];
  }

  const areaList = new Map<PixelList, number>();

  // 过滤总体占比和边缘占比过小的区域
  for (const pixelList of areaMap.values()) {
    if (pixelList.size < minimum) continue;
    const edgeRatio = getAreaEdgeRatio(pixelList, width, height);
    if (edgeRatio < 0.1) continue;
    areaList.set(pixelList, edgeRatio);
  }

  return [...areaList.keys()].sort(
    (a, b) => areaList.get(b)! - areaList.get(a)!,
  );
};

/** 获取图像区域中的主色 */
export const getAreaColor = (
  imgData: Uint8ClampedArray,
  pixelList: PixelList,
) => {
  const colorMap = new Map<string, number>();
  const maximum = pixelList.size * 0.5;

  let maxColor = '';
  let maxCount = 0;

  for (const i of pixelList.values()) {
    const index = i * 4;
    const r = imgData[index];
    const g = imgData[index + 1];
    const b = imgData[index + 2];
    const color = `rgb(${r}, ${g}, ${b})`;
    if (!colorMap.has(color)) colorMap.set(color, 0);
    const colorCount = colorMap.get(color)! + 1;
    colorMap.set(color, colorCount);
    if (colorCount > maxCount) {
      maxColor = color;
      maxCount = colorCount;
    }
    if (colorCount > maximum) break;
  }

  return maxColor;
};

/** 获取图片背景色 */
export const getImgBackground = async (
  imgData: Uint8ClampedArray,
  width: number,
  height: number,
  imgUrl?: string,
): Promise<string> => {
  const startTime = isDevMode ? Date.now() : undefined;

  const { w, h, data } = resizeImg(imgData, width, height);
  if (isDevMode) mainFn.showCanvas?.(data, w, h);

  const grayList = toGrayList(data, 5);
  if (isDevMode) mainFn.showGrayList?.(grayList, w, h);

  const areaList = getEdgeArea(grayList, w, h);
  if (isDevMode) mainFn.showColorArea?.(data, w, h, ...areaList);
  if (areaList.length === 0) return '';

  const res = getAreaColor(data, areaList[0]);
  if (isDevMode)
    mainFn.log?.(
      `${imgUrl}\n背景色识别完成：${res}, 耗时：${Date.now() - startTime!}ms`,
    );
  return res;
};
