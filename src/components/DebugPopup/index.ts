import * as Comlink from 'comlink';
import { canvasToBlobUrl } from 'helper';
import { type ImgContext } from 'worker/ImageRecognition';

import { init } from './DebugPopup';
import { type DebugImgType, addDebugItem } from './store';

export { DebugPopup } from './DebugPopup';

const createCanvas = (
  data: {
    width: number;
    height: number;
  } & Record<string, string | number>,
) => {
  const { width, height, ...dataSet } = data;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  for (const [key, value] of Object.entries(dataSet))
    canvas.dataset[key] = `${value}`;
  const ctx = canvas.getContext('2d')!;
  const imgData = ctx.createImageData(width, height);
  return { canvas, ctx, imgData };
};

const renderRawImage = (
  rawImgData: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const { canvas, ctx, imgData } = createCanvas({
    width,
    height,
    type: 'raw',
  });
  for (let i = 0; i < imgData.data.length; i++) imgData.data[i] = rawImgData[i];
  ctx.putImageData(imgData, 0, 0);
  return canvasToBlobUrl(canvas);
};

const addDebugImage = (
  img: ImgContext,
  url: string,
  { type, name }: { type: DebugImgType; name?: string },
) => {
  init();
  addDebugItem({
    sourceUrl: img.url,
    url,
    width: img.width,
    height: img.height,
    index: img.index,
    version: img.version,
    type,
    name,
  });
};

/** 显示原图 */
export const showImage = async (img: ImgContext) => {
  const url = await renderRawImage(img.data, img.width, img.height);
  if (url) addDebugImage(img, url, { type: 'raw' });
};

/** 显示灰度图 */
export const showGrayList = async (img: ImgContext) => {
  const { canvas, ctx, imgData } = createCanvas({
    width: img.width,
    height: img.height,
    type: 'gray',
  });

  for (const [i, grayNum] of img.grayList.entries()) {
    const index = i * 4;
    imgData.data[index] = grayNum;
    imgData.data[index + 1] = grayNum;
    imgData.data[index + 2] = grayNum;
    imgData.data[index + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  const url = await canvasToBlobUrl(canvas);
  if (url) addDebugImage(img, url, { type: 'gray' });
};

/** 显示指定区域 */
export const showColorArea = async (
  img: ImgContext,
  pixelIndexes: Uint32Array | number[],
  name?: string,
) => {
  const { canvas, ctx, imgData } = createCanvas({
    width: img.width,
    height: img.height,
    type: 'area',
  });

  for (const index of pixelIndexes) {
    const i = index * 4;
    imgData.data[i] = img.data[i];
    imgData.data[i + 1] = img.data[i + 1];
    imgData.data[i + 2] = img.data[i + 2];
    imgData.data[i + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  const url = await canvasToBlobUrl(canvas);
  if (url) addDebugImage(img, url, { type: 'area', name });
};

export const initDebugPopup = (
  worker: typeof import('worker/ImageRecognition'),
) => {
  if (!isDevMode) return;
  worker.setMainFn(Comlink.proxy({ showImage, showGrayList, showColorArea }), [
    'showImage',
    'showGrayList',
    'showColorArea',
  ]);
};
