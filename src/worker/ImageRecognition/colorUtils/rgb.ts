export type RGBColor = { r: number; g: number; b: number };

/** 对指定数值取整 */
export const round = (n: number, int: number) => {
  if (int <= 0) return n;
  const remainder = n % int;
  return remainder < int / 2 ? n - remainder : n + (int - remainder);
};

/** 将 rgb 转换为大写 16 进制颜色值 */
export const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((n) => n.toString(16).padStart(2, '0').toUpperCase())
    .join('')}`;

/** 计算 rgb 的灰度 */
export const toGray = (r: number, g: number, b: number) =>
  Math.round(0.299 * r + 0.587 * g + 0.114 * b);

/** 通过 RGB 灰度公式计算图片的灰度表 */
export const toGrayListByRgb = (
  imgData: Uint8ClampedArray,
  roundNum: number,
) => {
  const grayList = new Uint8ClampedArray(new ArrayBuffer(imgData.length / 4));
  for (let i = 0, gi = 0; i < imgData.length; i += 4, gi++) {
    const r = imgData[i];
    const g = imgData[i + 1];
    const b = imgData[i + 2];
    grayList[gi] = round(toGray(r, g, b), roundNum);
  }
  return grayList;
};
