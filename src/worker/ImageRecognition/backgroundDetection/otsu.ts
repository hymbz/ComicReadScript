import { toGrayListByRgb } from '../colorUtils';
import { type ImgContext } from '../imgContext';
import { type CenterBounds } from '../types';
import { mainFn } from '../workHelper';
import { Region, RegionManager } from './Region';
import { BACKGROUND_MIN_RATIO } from './thresholds';

/** 8-连通的邻居偏移。 */
const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
] as const;

/** 通过 Otsu 算法计算灰度图的最优二值化阈值。 */
const getOtsuThreshold = (grayList: Uint8ClampedArray): number => {
  const histogram = new Uint32Array(256);
  for (const gray of grayList) histogram[gray] += 1;

  const total = grayList.length;
  let sum = 0;
  for (let i = 0; i < histogram.length; i++) sum += i * histogram[i];

  let sumBackground = 0;
  let weightBackground = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let t = 0; t < histogram.length; t++) {
    weightBackground += histogram[t];
    if (weightBackground === 0) continue;

    const weightForeground = total - weightBackground;
    if (weightForeground === 0) break;

    sumBackground += t * histogram[t];
    const meanBackground = sumBackground / weightBackground;
    const meanForeground = (sum - sumBackground) / weightForeground;
    const diff = meanBackground - meanForeground;
    const variance = weightBackground * weightForeground * diff * diff;

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = t;
    }
  }

  return threshold;
};

/** 图片二值化 */
export const thresholding = (imageData: ImageData) => {
  const grayList = toGrayListByRgb(imageData.data, 0);
  const threshold = getOtsuThreshold(grayList);

  const binary = new Uint8ClampedArray(grayList.length);
  for (let i = 0; i < grayList.length; i++)
    binary[i] = grayList[i] < threshold ? 0 : 255;
  return binary;
};

/** 收集二值化结果中指定类别的像素索引。 */
const collectClassIndexes = (binary: Uint8Array, value: number) => {
  let count = 0;
  for (const pixel of binary) if (pixel === value) count += 1;

  const indexes = new Uint32Array(count);
  let pos = 0;
  for (let i = 0; i < binary.length; i++)
    if (binary[i] === value) indexes[pos++] = i;
  return indexes;
};

/** 在调试窗口中分别显示 Otsu 二值化后的 0 类和 255 类像素。 */
const showOtsuClasses = (img: ImgContext, binary: Uint8Array) => {
  if (!isDevMode) return;

  void mainFn.showColorArea?.(img, collectClassIndexes(binary, 0), 'Otsu 0');
  void mainFn.showColorArea?.(
    img,
    collectClassIndexes(binary, 255),
    'Otsu 255',
  );
};

const isOutsideCenter = (x: number, y: number, bounds: CenterBounds): boolean =>
  x < bounds.startX ||
  x >= bounds.endX ||
  y < bounds.startY ||
  y >= bounds.endY;

type FloodFillContext = {
  manager: RegionManager;
  binary: Uint8Array;
  backgroundValue: number;
  width: number;
  height: number;
  bounds: CenterBounds;
};

/** 从种子像素开始，将 8-连通的背景像素合并为一个 Region。 */
const floodFillRegion = (ctx: FloodFillContext, seed: number): void => {
  const { manager, binary, backgroundValue, width, height, bounds } = ctx;

  const region = manager.createRegion(
    class extends Region {
      protected checkPixel(i: number): boolean {
        return binary[i] === backgroundValue;
      }
      protected onPixelAdded(): void {}
    },
  );

  const queue = [seed];
  region.addPixel(seed);

  let head = 0;
  while (head < queue.length) {
    const current = queue[head];
    head += 1;

    const currentX = current % width;
    const currentY = Math.floor(current / width);

    for (const [dx, dy] of NEIGHBOR_OFFSETS) {
      const nextX = currentX + dx;
      const nextY = currentY + dy;
      if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) continue;
      if (!isOutsideCenter(nextX, nextY, bounds)) continue;

      const nextIndex = nextY * width + nextX;
      if (manager.getOwner(nextIndex) !== 0) continue;
      if (binary[nextIndex] !== backgroundValue) continue;

      if (region.addPixel(nextIndex)) queue.push(nextIndex);
    }
  }
};

/** 获取所有接触图片边缘的区域 id */
const getEdgeTouchingRegionIds = (manager: RegionManager): Set<number> => {
  const { width, height } = manager;
  const ids = new Set<number>();
  const collect = (index: number) => {
    const owner = manager.getOwner(index);
    if (owner > 0) ids.add(owner);
  };

  for (let x = 0; x < width; x++) {
    collect(x);
    collect((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    collect(y * width);
    collect(y * width + width - 1);
  }

  return ids;
};

/**
 * Otsu 背景识别：
 *
 * 1. 使用全图灰度计算 Otsu 阈值，将图片二值化为 0 / 255；
 * 2. 统计 SKIP_CENTER_RATIO 以外区域中两类像素的占比，占比更大的一类视为背景；
 * 3. 如果背景类占比未达到 BACKGROUND_MIN_RATIO，判定为无法可靠识别；
 * 4. 对外围区域中属于背景类的像素做连通合并，构成多个 Region；
 * 5. 只保留接触图片边缘的背景区域。
 */
export const otsu = (img: ImgContext): RegionManager => {
  const { width, height, grayList } = img;
  const threshold = getOtsuThreshold(grayList);

  const binary = new Uint8Array(grayList.length);
  for (let i = 0; i < binary.length; i++)
    binary[i] = grayList[i] < threshold ? 0 : 255;

  showOtsuClasses(img, binary);

  let count0 = 0;
  let count255 = 0;

  img.forEachOutsideCenter((index) => {
    if (binary[index] === 0) count0 += 1;
    else count255 += 1;
  });

  const manager = new RegionManager(img);

  const totalOutside = count0 + count255;
  if (totalOutside === 0) return manager;

  const backgroundValue = count0 >= count255 ? 0 : 255;
  const backgroundCount = Math.max(count0, count255);
  if (backgroundCount / totalOutside < BACKGROUND_MIN_RATIO) return manager;

  img.forEachOutsideCenter((index) => {
    if (binary[index] !== backgroundValue) return;
    if (manager.getOwner(index) !== 0) return;

    floodFillRegion(
      { manager, binary, backgroundValue, width, height, bounds: img.bounds },
      index,
    );
  });

  manager.mergeSimilarRegions();
  manager.removeSmallRegions();

  const regionIdSet = getEdgeTouchingRegionIds(manager);
  for (const id of manager.getRegionIds())
    if (!regionIdSet.has(id)) manager.releaseRegion(id);

  return manager;
};
