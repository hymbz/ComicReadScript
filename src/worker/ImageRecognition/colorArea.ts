import { type PixelList } from './helper';
import { forEachEdge, getEdgeScope } from './workHelper';

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
  const maximum = width * height * 0.4;

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

  const areaList: PixelList[] = [];
  for (const pixelList of areaMap.values()) {
    if (pixelList.size < 100) continue;
    areaList.push(pixelList);
  }
  return areaList;
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
