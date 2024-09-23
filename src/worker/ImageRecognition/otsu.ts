import { toGrayList } from './workHelper';

const histogram = (grayList: Uint8ClampedArray) => {
  const hist = Array.from<number>({ length: 256 }).fill(0);
  for (const pixel of grayList) hist[pixel]++;
  return hist;
};

const otsu = (grayList: Uint8ClampedArray) => {
  /** 直方图 */
  const hist = histogram(grayList);

  const total = grayList.length;
  const sum = hist.reduce((acc, val, idx) => acc + idx * val, 0);
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;

    sumB += i * hist[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = i;
    }
  }
  return threshold;
};

/** 图片二值化 */
export const thresholding = (imageData: ImageData) => {
  const grayList = toGrayList(imageData.data, 0);
  const threshold = otsu(grayList);

  for (let i = 0; i < grayList.length; i++)
    grayList[i] = grayList[i] < threshold ? 0 : 255;
  return grayList;
};
