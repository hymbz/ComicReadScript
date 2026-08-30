import { SATURATION_WEIGHT } from '../backgroundDetection/thresholds';
import { type RGBColor } from './rgb';

export type HSVColor = { h: number; s: number; v: number };

/** 将 0~255 或 0~1 的 RGB 分量统一到 0~1。 */
export const normalizeChannel = (value: number): number => {
  const clamped = Math.max(0, Math.min(255, value));
  return clamped > 1 ? clamped / 255 : clamped;
};

export const rgbToHsv = (color: RGBColor): HSVColor => {
  const r = normalizeChannel(color.r);
  const g = normalizeChannel(color.g);
  const b = normalizeChannel(color.b);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const v = max;

  if (max !== 0) s = delta / max;

  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }

    if (h < 0) h += 360;
    if (h >= 360) h -= 360;
  }

  return { h, s, v };
};

/** HSV 色差距离 */
export const hsvDistanceSquared = (
  a: HSVColor,
  b: HSVColor,
  saturationWeight: number = SATURATION_WEIGHT,
): number => {
  const dv = a.v - b.v;
  const ds = a.s - b.s;
  return dv * dv + saturationWeight * saturationWeight * ds * ds;
};
