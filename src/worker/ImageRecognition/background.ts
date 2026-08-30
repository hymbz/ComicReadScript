import {
  EDGE_AREA_RATIO,
  EDGE_AREA_REGION_RATIO,
} from './backgroundDetection/thresholds';
import { type ImgContext } from './imgContext';
import { mainFn } from './workHelper';

type EdgeArea = {
  width: number;
  height: number;
  edgeX: number;
  edgeY: number;
};

const isInEdgeArea = (
  index: number,
  { width, height, edgeX, edgeY }: EdgeArea,
) => {
  const x = index % width;
  const y = Math.floor(index / width);
  return x < edgeX || x >= width - edgeX || y < edgeY || y >= height - edgeY;
};

/** 在调试窗口中显示图片的边缘区域 */
const showEdgeArea = (img: ImgContext, edgeArea: EdgeArea) => {
  const pixelIndexes: number[] = [];
  for (let i = 0; i < img.width * img.height; i++)
    if (isInEdgeArea(i, edgeArea)) pixelIndexes.push(i);

  void mainFn.showColorArea?.(img, pixelIndexes, '边缘区域');
};

/**
 * 判断图像的背景色。
 *
 * 在图片边缘区域内找到占比最大的背景区域，
 * 如果该区域在边缘区域中的占比达到 EDGE_AREA_REGION_RATIO，
 * 则将该区域的主色视为背景色，否则判定取色失败。
 */
const getBackgroundColor = (img: ImgContext): string | null => {
  const manager = img.backgroundRegions!;
  if (manager.getRegionCount() === 0) return null;

  const { width, height } = img;
  const edge = Math.max(
    1,
    Math.floor(Math.min(width, height) * EDGE_AREA_RATIO),
  );
  const edgeArea = { width, height, edgeX: edge, edgeY: edge };
  if (isDevMode) showEdgeArea(img, edgeArea);
  const centerWidth = Math.max(0, width - edge * 2);
  const centerHeight = Math.max(0, height - edge * 2);
  const totalEdgeAreaPixels = width * height - centerWidth * centerHeight;

  let maxRegionId: number | undefined;
  let maxCount = 0;

  for (const id of manager.getRegionIds()) {
    let count = 0;
    manager.forEachPixelOfRegion(id, (index) => {
      if (isInEdgeArea(index, edgeArea)) count += 1;
    });
    if (count > maxCount) {
      maxCount = count;
      maxRegionId = id;
    }
  }
  img.logger.mark('背景色区域统计完成');

  if (
    maxRegionId === undefined ||
    maxCount / totalEdgeAreaPixels < EDGE_AREA_REGION_RATIO
  ) {
    if (isDevMode && maxRegionId !== undefined) {
      const ratio = maxCount / totalEdgeAreaPixels;
      img.logger.log(
        `失败：区域 ${maxRegionId} 在边缘区域中的占比为 ${(ratio * 100).toFixed(2)}%`,
      );
    }
    return null;
  }

  const color = manager.getRegion(maxRegionId)?.getMainColor() ?? null;
  img.logger.mark('背景主色提取完成', color ?? '未检测到');
  return color;
};

/** 获取图片背景色并写入 ImgContext */
export const getBackground = (img: ImgContext): string | null =>
  (img.background ??= getBackgroundColor(img));

// 通过找出图片四向边缘相连的区域，可以实现检测出图片四边各自独立的背景色，但没有用。
// 不像手机端的 APP 那样，大部分情况下图片都只会露出上/下的阅读器背景，
// 所以可以为上/下单独设置背景色。
// 项目在开启了「禁止图片自动放大」功能后，可能会直接将图片的四边都露出来，
// 此时再怎么说也没法支持四边不同色了。
// 即使只在判断图片占满了X/Y轴后对露出的那两边设置背景色，实现也过于复杂了。
// 最重要的是，在最常用的双页翻页模式下，每个图片都只会露出左/右一条边的背景。
// 实现麻烦，效果不佳，一般用不上，因此不考虑识别四边背景色
