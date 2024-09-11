import { toGray } from './workHelper';

const histogram = (grayList: number[]) => {
  const hist = Array.from<number>({ length: 256 }).fill(0);
  for (const pixel of grayList) hist[pixel]++;
  return hist;
};

const otsu = (grayList: number[]) => {
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
  const grayList: number[] = [];

  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i];
    const g = imageData.data[i + 1];
    const b = imageData.data[i + 2];
    grayList.push(toGray(r, g, b));
  }

  const threshold = otsu(grayList);

  for (let i = 0; i < grayList.length; i++)
    grayList[i] = grayList[i] < threshold ? 0 : 1;

  return grayList;
};
