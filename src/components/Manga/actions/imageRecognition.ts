import * as Comlink from 'comlink';
import { unwrap } from 'solid-js/store';

import type { MainFn } from 'worker/ImageRecognition';

import { log, throttle } from 'helper';
import { showCanvas, showColorArea, showGrayList } from 'worker/helper';
import * as worker from 'worker/ImageRecognition';

import { setState, store } from '../store';
import { updatePageData } from './image';

const getImageData = (img: HTMLImageElement) => {
  const { naturalWidth: width, naturalHeight: height } = img;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};

export const handleImgRecognition = (img: HTMLImageElement, url: string) => {
  const { data, width, height } = getImageData(img);

  return worker.handleImg(
    Comlink.transfer(data, [data.buffer]),
    width,
    height,
    url,
    unwrap(store.option.imgRecognition),
  );
};

const mainFn = {
  log,
  updatePageData: throttle(() => setState(updatePageData), 1000),
  setImg: (url, key, val) =>
    Reflect.has(store.imgMap, url) && setState('imgMap', url, key, val),
} as MainFn;
if (isDevMode)
  Object.assign(mainFn, { showCanvas, showColorArea, showGrayList });
worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
