import { getAreaEdgeRatio } from './colorArea';

export type PixelList = Set<number>;

export const getImageData = (img: HTMLImageElement) => {
  const { naturalWidth: width, naturalHeight: height } = img;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};

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

/** 显示图片 */
export const showCanvas = (
  rawImgData: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const { canvas, ctx, imgData } = createCanvas({ width, height, type: 'raw' });
  for (let i = 0; i < imgData.data.length; i++) imgData.data[i] = rawImgData[i];
  ctx.putImageData(imgData, 0, 0);
  document.body.append(canvas);
};

/** 显示区域 */
export const showColorArea = (
  rawImgData: Uint8ClampedArray,
  width: number,
  height: number,
  ...areaList: PixelList[]
) => {
  for (const pixelList of areaList) {
    const { canvas, ctx, imgData } = createCanvas({
      width,
      height,
      type: 'area',
      scale: ((pixelList.size / (width * height)) * 100).toFixed(2),
      eageRatio: (getAreaEdgeRatio(pixelList, width, height) * 100).toFixed(2),
    });

    for (const _index of pixelList) {
      const index = _index * 4;
      imgData.data[index] = rawImgData[index];
      imgData.data[index + 1] = rawImgData[index + 1];
      imgData.data[index + 2] = rawImgData[index + 2];
      imgData.data[index + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    document.body.append(canvas);
  }
};

/** 显示灰度图 */
export const showGrayList = (
  grayList: Uint8ClampedArray,
  width: number,
  height: number,
) => {
  const { canvas, ctx, imgData } = createCanvas({
    width,
    height,
    type: 'gray',
  });

  for (const [i, grayNum] of grayList.entries()) {
    const index = i * 4;
    imgData.data[index] = grayNum;
    imgData.data[index + 1] = grayNum;
    imgData.data[index + 2] = grayNum;
    imgData.data[index + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
  document.body.append(canvas);
};
