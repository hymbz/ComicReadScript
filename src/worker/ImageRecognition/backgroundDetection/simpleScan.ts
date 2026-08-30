// oxlint-disable max-params
import { type ImgContext } from '../imgContext';
import { Region, RegionManager } from './Region';
import {
  BLANK_LINE_RATIO,
  RESERVED_REGION_ID,
  SKIP_CENTER_RATIO,
} from './thresholds';

type Side = 'left' | 'right' | 'top' | 'bottom';

/**
 * 处理一条空白行/列：
 * 1. 统计该行/列灰度直方图；
 * 2. 若存在占比达标的灰度，且与上一行/列灰度一致，则将其加入/合并到背景 Region。
 */
// oxlint-disable-next-line max-params
const processBlankLine = (
  manager: RegionManager,
  img: ImgContext,
  x: number,
  y: number,
  prevRegion: Region | undefined,
  prevGray: number | undefined,
): { region: Region; gray: number } | undefined => {
  const counts = new Uint32Array(256);
  const length = x < 0 ? img.width : img.height;

  const each = (fn: (i: number) => void) => {
    if (x < 0) img.forEachRows(y, fn);
    else img.forEachCols(x, fn);
  };

  each((i) => {
    counts[img.grayList[i]] += 1;
  });

  const threshold = length * BLANK_LINE_RATIO;
  for (let gray = 0; gray < counts.length; gray++) {
    if (counts[gray] < threshold) continue;
    if (prevGray !== undefined && gray !== prevGray) return;

    let region = prevRegion;
    if (!region)
      region = manager.createRegion(
        class extends Region {
          protected checkPixel(index: number): boolean {
            return img.grayList[index] === gray;
          }
          protected onPixelAdded(): void {}
        },
      );

    let currentRegion = region;
    each((i) => {
      if (img.grayList[i] !== gray) return;

      const owner = manager.getOwner(i);
      if (owner === 0) return currentRegion.addPixel(i);
      if (owner === RESERVED_REGION_ID || owner === currentRegion.id) return;

      // 能拥有当前像素的正数 Region 必然与当前灰度相同
      const ownerRegion = manager.getRegion(owner);
      if (!ownerRegion) return;

      manager.mergeRegions(ownerRegion.id, currentRegion.id);
      currentRegion = ownerRegion;
    });

    return { region: currentRegion, gray };
  }

  return undefined;
};

/** 扫描一条边，从边缘向内逐行/列识别并合并背景区域 */
const scanSide = (
  manager: RegionManager,
  img: ImgContext,
  side: Side,
  edgeScanRatio: number,
) => {
  const { width, height } = img;
  const length = side === 'left' || side === 'right' ? width : height;
  const fromEdge = side === 'left' || side === 'top';

  const count = fromEdge
    ? Math.ceil(length * edgeScanRatio)
    : Math.floor(length * edgeScanRatio);

  let prevRegion: Region | undefined;
  let prevGray: number | undefined;

  for (let i = 0; i < count; i++) {
    const pos = fromEdge ? i : length - 1 - i;
    const x = side === 'left' || side === 'right' ? pos : -1;
    const y = side === 'top' || side === 'bottom' ? pos : -1;

    const result = processBlankLine(manager, img, x, y, prevRegion, prevGray);
    if (!result) return;

    prevRegion = result.region;
    prevGray = result.gray;
  }
};

/**
 * 简单扫描：识别图片中的背景区域。
 *
 * 从图片四边向内逐行/逐列扫描：
 * - 行/列中占比最高的灰度达到 BLANK_LINE_RATIO 才判定为空白；
 * - 主灰度和上一行/列不同则停止；
 * - 主灰度相同则合并进同一个背景 Region。
 * 图片居中的 SKIP_CENTER_RATIO 区域不参与背景识别。
 */
export const simpleScan = (img: ImgContext): RegionManager => {
  const manager = new RegionManager(img);
  const edgeScanRatio = (1 - SKIP_CENTER_RATIO) / 2;

  scanSide(manager, img, 'left', edgeScanRatio);
  scanSide(manager, img, 'right', edgeScanRatio);
  scanSide(manager, img, 'top', edgeScanRatio);
  scanSide(manager, img, 'bottom', edgeScanRatio);

  manager.mergeSimilarRegions();
  manager.removeSmallRegions();

  return manager;
};
