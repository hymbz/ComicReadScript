// oxlint-disable max-params
import { LAB_QUANTIZE_LEVELS } from '../backgroundDetection/thresholds';
import { LAB_AB_RANGE, LAB_L_RANGE, rgbToOklab } from './lab';

/** 统一的 Oklab 像素量化数据 */
export type LabQuantizedData = {
  /** 每个像素的 Oklab 分组码，中心保留区为 -1 */
  groupList: Int32Array;
  /** Oklab 量化级数 */
  levels: number;
  /** 每个分组码对应的平均 Oklab 代表色，按 group * 3 连续存储 */
  groupToLab: Float32Array;
  /** 每个分组码对应的平均 RGB 代表色，按 group * 3 连续存储，用于 HSV 分组和显示 */
  groupToRgb: Uint8ClampedArray;
};

/** Oklab 量化所需的图片像素数据 */
export type LabQuantizedImage = {
  width: number;
  height: number;
  data: Uint8ClampedArray;
};

/**
 * 构建统一的 Oklab 像素量化数据。
 *
 * @param forEachPixel 指定需要参与量化的像素遍历方式（例如只遍历中心区域外）
 */
export const buildLabQuantizedData = (
  img: LabQuantizedImage,
  levels: number = LAB_QUANTIZE_LEVELS,
  forEachPixel?: (fn: (index: number) => void) => void,
): LabQuantizedData => {
  const { width, height } = img;
  const groupCount = levels ** 3;
  const groupList = new Int32Array(width * height);
  groupList.fill(-1);

  const lStep = LAB_L_RANGE / levels;
  const abStep = LAB_AB_RANGE / levels;

  const labSums = new Float64Array(groupCount * 3);
  const rgbSums = new Float64Array(groupCount * 3);
  const counts = new Uint32Array(groupCount);

  const eachPixel =
    forEachPixel ??
    ((fn: (index: number) => void) => {
      for (let i = 0; i < width * height; i++) fn(i);
    });

  eachPixel((index) => {
    const i = index * 4;
    const r = img.data[i];
    const g = img.data[i + 1];
    const b = img.data[i + 2];
    const [L, a, bLab] = rgbToOklab(r, g, b);

    const lGroup = Math.min(levels - 1, Math.max(0, Math.floor(L / lStep)));
    const aGroup = Math.min(
      levels - 1,
      Math.max(0, Math.floor((a + LAB_AB_RANGE / 2) / abStep)),
    );
    const bGroup = Math.min(
      levels - 1,
      Math.max(0, Math.floor((bLab + LAB_AB_RANGE / 2) / abStep)),
    );

    const group = (lGroup * levels + aGroup) * levels + bGroup;
    groupList[index] = group;

    const labOffset = group * 3;
    labSums[labOffset] += L;
    labSums[labOffset + 1] += a;
    labSums[labOffset + 2] += bLab;

    const rgbOffset = group * 3;
    rgbSums[rgbOffset] += r;
    rgbSums[rgbOffset + 1] += g;
    rgbSums[rgbOffset + 2] += b;
    counts[group] += 1;
  });

  const groupToLab = new Float32Array(groupCount * 3);
  const groupToRgb = new Uint8ClampedArray(groupCount * 3);
  for (let group = 0; group < groupCount; group++) {
    const count = counts[group];
    if (count === 0) continue;

    const offset = group * 3;
    groupToLab[offset] = labSums[offset] / count;
    groupToLab[offset + 1] = labSums[offset + 1] / count;
    groupToLab[offset + 2] = labSums[offset + 2] / count;
    groupToRgb[offset] = Math.round(rgbSums[offset] / count);
    groupToRgb[offset + 1] = Math.round(rgbSums[offset + 1] / count);
    groupToRgb[offset + 2] = Math.round(rgbSums[offset + 2] / count);
  }

  return { groupList, levels, groupToLab, groupToRgb };
};
