import {
  BLANK_MARGIN_COLOR_TOLERANCE,
  BLANK_MARGIN_MAX_OUTLIER_RATIO,
} from './backgroundDetection/thresholds';
import { type ImgContext } from './imgContext';
import { type BlankMargin } from './types';

/**
 * 根据参考背景色计算图片四边的空白边缘距离（像素单位）。
 *
 * 每条边先以最外层行/列的主色作为参考背景色，然后从边缘向内逐行/列扫描。
 * 累计与参考色差超过阈值的像素数，一旦超过整边预算就停止。
 */
const getRawBlankMargin = (
  img: ImgContext,
): Record<'top' | 'bottom' | 'left' | 'right', number> | undefined => {
  const { width, height } = img;
  const { groupList, groupToLab, levels } = img.labQuantized;
  const counts = new Uint32Array(levels ** 3);
  const touched: number[] = [];

  const resetCounts = () => {
    for (const group of touched) counts[group] = 0;
    touched.length = 0;
  };

  /**
   * 扫描一条边。
   *
   * @param lineLength 行/列长度：左右边用高度，上下边用宽度
   * @param limit 最多扫描多少行/列（由中心保留区边界决定）
   * @param startPos 起始位置：列用 x，行用 y
   * @param step 扫描方向：向内为 1，从右/下边缘向内为 -1
   * @param isColumn true 表示扫描列，false 表示扫描行
   */
  const scanSide = ({
    lineLength,
    limit,
    startPos,
    step,
    isColumn,
  }: {
    lineLength: number;
    limit: number;
    startPos: number;
    step: 1 | -1;
    isColumn: boolean;
  }): number => {
    if (limit <= 0) return 0;

    const maxOutlier = lineLength * BLANK_MARGIN_MAX_OUTLIER_RATIO;

    // 第一条线：用主色建立参考背景色
    resetCounts();
    let refGroup = -1;
    let maxCount = 0;

    const firstPos = startPos;
    if (isColumn) {
      for (let offset = 0; offset < lineLength; offset++) {
        const group = groupList[offset * width + firstPos];
        if (group < 0) continue;
        if (counts[group] === 0) touched.push(group);
        const count = ++counts[group];
        if (count > maxCount) {
          maxCount = count;
          refGroup = group;
        }
      }
    } else {
      for (let offset = 0; offset < lineLength; offset++) {
        const group = groupList[firstPos * width + offset];
        if (group < 0) continue;
        if (counts[group] === 0) touched.push(group);
        const count = ++counts[group];
        if (count > maxCount) {
          maxCount = count;
          refGroup = group;
        }
      }
    }
    resetCounts();

    if (refGroup < 0) return 0;

    const refOffset = refGroup * 3;
    const refL = groupToLab[refOffset];
    const refA = groupToLab[refOffset + 1];
    const refB = groupToLab[refOffset + 2];

    const toleranceSq = BLANK_MARGIN_COLOR_TOLERANCE ** 2;
    const isOutOfTolerance = (group: number) => {
      if (group < 0) return true;
      const offset = group * 3;
      const dl = groupToLab[offset] - refL;
      const da = groupToLab[offset + 1] - refA;
      const db = groupToLab[offset + 2] - refB;
      return dl * dl + da * da + db * db > toleranceSq;
    };

    let outlierCount = 0;

    const scanLineAt = (pos: number): boolean => {
      if (isColumn) {
        for (let offset = 0; offset < lineLength; offset++) {
          const group = groupList[offset * width + pos];
          if (!isOutOfTolerance(group)) continue;
          outlierCount += 1;
          if (outlierCount > maxOutlier) return false;
        }
      } else {
        for (let offset = 0; offset < lineLength; offset++) {
          const group = groupList[pos * width + offset];
          if (!isOutOfTolerance(group)) continue;
          outlierCount += 1;
          if (outlierCount > maxOutlier) return false;
        }
      }
      return true;
    };

    if (!scanLineAt(firstPos)) return 0;

    let margin = 1;
    for (let i = 1; i < limit; i++) {
      const pos = startPos + step * i;
      if (!scanLineAt(pos)) return margin;
      margin += 1;
    }

    return margin;
  };

  const { startX, endX, startY, endY } = img.bounds;
  const left = scanSide({
    lineLength: height,
    limit: startX,
    startPos: 0,
    step: 1,
    isColumn: true,
  });
  const right = scanSide({
    lineLength: height,
    limit: width - endX,
    startPos: width - 1,
    step: -1,
    isColumn: true,
  });
  const top = scanSide({
    lineLength: width,
    limit: startY,
    startPos: 0,
    step: 1,
    isColumn: false,
  });
  const bottom = scanSide({
    lineLength: width,
    limit: height - endY,
    startPos: height - 1,
    step: -1,
    isColumn: false,
  });

  if (left || right || top || bottom) return { left, right, top, bottom };
  return undefined;
};

/** 获取图片的空白边缘 */
export const getBlankMargin = (img: ImgContext): BlankMargin | null => {
  if (img.blankMargin !== undefined) return img.blankMargin;

  const blankMargin = getRawBlankMargin(img);
  if (!blankMargin) {
    img.logger.mark('空白边缘扫描完成', '未检测到');
    return null;
  }

  blankMargin.left /= img.width;
  blankMargin.right /= img.width;
  blankMargin.top /= img.height;
  blankMargin.bottom /= img.height;
  img.blankMargin = blankMargin;

  img.logger.mark(
    '空白边缘扫描完成',
    Object.entries(blankMargin)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v && (v * 100).toFixed(2)}%`)
      .join(' '),
  );

  return img.blankMargin;
};
