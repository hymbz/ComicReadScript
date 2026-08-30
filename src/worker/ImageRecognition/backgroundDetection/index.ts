import { type ImgContext } from '../imgContext';
import { mainFn } from '../workHelper';
import { quantizedEdgeGrow } from './quantizedEdgeGrow';
import { RegionManager } from './Region';
// import { otsu } from './otsu';
// import { simpleScan } from './simpleScan';

export { Region, RegionManager } from './Region';
export { RESERVED_REGION_ID, SKIP_CENTER_RATIO } from './thresholds';

/** 在调试窗口中显示检测出的背景区域像素 */
const showBackgroundRegions = (img: ImgContext, separate = false) => {
  const manager = img.backgroundRegions!;
  if (manager.getRegionCount() === 0) return;

  if (separate) {
    for (const id of manager.getRegionIds()) {
      const pixelIndexes: number[] = [];
      manager.forEachPixelOfRegion(id, (index) => pixelIndexes.push(index));
      const color = manager.getRegion(id)?.getMainColor();
      void mainFn.showColorArea?.(
        img,
        pixelIndexes,
        `背景区域 ${id} ${color ?? ''}`,
      );
    }
    return;
  }

  const regionIdSet = new Set(manager.getRegionIds());
  const pixelIndexes: number[] = [];
  for (let i = 0; i < img.width * img.height; i++)
    if (regionIdSet.has(manager.getOwner(i))) pixelIndexes.push(i);

  void mainFn.showColorArea?.(img, pixelIndexes, '背景区域');
};

/** 识别出图片的背景区域 */
export const detectBackgroundRegions = (img: ImgContext): RegionManager => {
  if (img.backgroundRegions) return img.backgroundRegions;

  // const manager = simpleScan(img);
  // const manager = otsu(img);
  const manager = new RegionManager(img);
  img.logger.mark('区域管理器初始化完成');
  quantizedEdgeGrow(img, manager);
  img.logger.mark('背景区域识别完成');

  img.backgroundRegions = manager;

  if (isDevMode) showBackgroundRegions(img, true);

  return manager;
};
