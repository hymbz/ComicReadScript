import * as Comlink from 'comlink';
import * as worker from 'worker/ImageRecognition';
import { type MainFn } from 'worker/ImageRecognition';
import { log } from 'helper';
import {
  getImageData,
  showCanvas,
  showColorArea,
  showGrayList,
} from 'worker/ImageRecognition/helper';

import { _setState, store } from '../store';

const mainFn = { log } as MainFn;
if (isDevMode)
  Object.assign(mainFn, { showCanvas, showColorArea, showGrayList });
worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));

/** 为图片设置合适的背景色 */
const handleBackground = async (imgData: ImageData, imgUrl: string) => {
  const { width, height } = imgData;

  const bgColor = await worker.getImgBackground(
    Comlink.transfer(imgData.data, [imgData.data.buffer]),
    width,
    height,
    isDevMode ? imgUrl : undefined,
  );
  if (Reflect.has(store.imgMap, imgUrl))
    _setState('imgMap', imgUrl, 'background', bgColor);
};

export const handleImg = async (img: HTMLImageElement) => {
  const imgData = getImageData(img);

  if (store.option.imgRecognition.background)
    handleBackground(imgData, img.src);
};
