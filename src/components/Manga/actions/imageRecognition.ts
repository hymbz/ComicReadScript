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

import { setState, store } from '../store';

const mainFn = { log } as MainFn;
if (isDevMode)
  Object.assign(mainFn, { showCanvas, showColorArea, showGrayList });
worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));

/** 为图片设置合适的背景色 */
const handleBackground = async (imgData: ImageData, imgUrl: string) => {
  const startTime = Date.now();
  const { width, height } = imgData;

  const bgColor = await worker.getImgBackground(
    Comlink.transfer(imgData.data, [imgData.data.buffer]),
    width,
    height,
  );

  // TODO: 将图片数据改为 map 式存储，避免遍历
  // TODO: 把 log 和计时移到 worker 中
  setState((state) => {
    for (const [i, img] of state.imgList.entries()) {
      if (imgUrl !== img.blobUrl) continue;
      img.background = bgColor;
      if (isDevMode)
        log(
          `${i} 背景色识别完成：${bgColor}, 耗时：${Date.now() - startTime}ms`,
        );
    }
  });
};

export const handleImg = async (img: HTMLImageElement) => {
  const imgData = getImageData(img);

  if (store.option.imgRecognition.background)
    handleBackground(imgData, img.src);
};
