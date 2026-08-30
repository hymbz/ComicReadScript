import { type LabQuantizedData } from './quantization';

/** Oklab 中 L 的跨度。 */
export const LAB_L_RANGE = 1;

/** Oklab 中 a/b 的跨度（约 -0.4 ~ 0.4）。 */
export const LAB_AB_RANGE = 0.8;

export type OklabColor = { l: number; a: number; b: number };

/** Oklab 欧氏距离平方 */
const deltaEOklabSquared = (a: OklabColor, b: OklabColor): number => {
  const dl = a.l - b.l;
  const da = a.a - b.a;
  const db = a.b - b.b;
  return dl * dl + da * da + db * db;
};

/** Oklab 色差距离 */
export const deltaEOklab = (a: OklabColor, b: OklabColor): number =>
  Math.sqrt(deltaEOklabSquared(a, b));

/** 预计算 0~255 的 sRGB 线性化值，避免每次转换都执行指数运算 */
const LINEAR_RGB = new Float32Array(256);
for (let i = 0; i < 256; i++) {
  const s = i / 255;
  LINEAR_RGB[i] = s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export const rgbToOklab = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  const rl = LINEAR_RGB[r];
  const gl = LINEAR_RGB[g];
  const bl = LINEAR_RGB[b];

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
};

/** 通过 Oklab 数据获取图片的灰度表 */
export const toGrayListByLab = (lab: LabQuantizedData): Uint8ClampedArray => {
  const { groupList, groupToLab } = lab;
  const grayList = new Uint8ClampedArray(groupList.length);
  for (let i = 0; i < groupList.length; i++) {
    const group = groupList[i];
    if (group < 0) continue;
    grayList[i] = groupToLab[group * 3] * 255;
  }
  return grayList;
};
