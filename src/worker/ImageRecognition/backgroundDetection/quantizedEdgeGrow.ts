import { type ImgContext } from '../imgContext';
import { Region, type RegionManager } from './Region';
import { EDGE_SEED_RATIO } from './thresholds';

/** 基于 Oklab 分组的 Region */
class QuantizedRegion extends Region {
  readonly group: number;

  private readonly groupList: Int32Array;

  constructor(
    manager: RegionManager,
    id: number,
    {
      group,
      groupList,
    }: {
      group: number;
      groupList: Int32Array;
    },
  ) {
    super(manager, id);
    this.group = group;
    this.groupList = groupList;
  }

  protected checkPixel(index: number): boolean {
    return this.groupList[index] === this.group;
  }

  protected onPixelAdded(): void {}
}

/** 从边缘起点区域中未占用的像素开始生长。 */
const growEdgeSeeds = (
  manager: RegionManager,
  img: ImgContext,
  groupList: Int32Array,
): void => {
  const { width, height } = img;
  const edgeX = Math.max(1, Math.floor(width * EDGE_SEED_RATIO));
  const edgeY = Math.max(1, Math.floor(height * EDGE_SEED_RATIO));

  const isInSeedArea = (x: number, y: number) =>
    x < edgeX || x >= width - edgeX || y < edgeY || y >= height - edgeY;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isInSeedArea(x, y)) continue;

      const index = y * width + x;
      if (manager.getOwner(index) !== 0) continue;

      const group = groupList[index];
      const region = manager.createRegion(QuantizedRegion, {
        group,
        groupList,
      });
      region.growFromSeed(index);
    }
  }
};

/**
 * 基于 Oklab 量化与边缘种子生长的背景识别：
 *
 * 1. 使用 ImgContext 上统一的 Oklab 量化数据；
 * 2. 从边缘起点区域中未占用的像素出发，以 4-连通的方式遍历，
 *    将同一 Oklab 分组的像素合并成一个 Region；
 * 3. 生长完成后，合并代表色相似的区域。
 */
export const quantizedEdgeGrow = (
  img: ImgContext,
  manager: RegionManager,
): RegionManager => {
  const { width, height } = img;
  if (width <= 0 || height <= 0) return manager;

  growEdgeSeeds(manager, img, img.labQuantized.groupList);
  img.logger.mark('边缘种子生长完成');

  if (manager.getRegionCount() === 0) return manager;

  manager.mergeSimilarRegions();
  img.logger.mark('相似区域合并完成');
  manager.removeSmallRegions();
  img.logger.mark('小区域清理完成');
  return manager;
};
