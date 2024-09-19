import { unwrap } from 'solid-js/store';
import * as Comlink from 'comlink';
import * as worker from 'worker/ImageRecognition';
import { type MainFn } from 'worker/ImageRecognition';
import { log, throttle } from 'helper';
import {
  getImageData,
  showCanvas,
  showColorArea,
  showGrayList,
} from 'worker/ImageRecognition/helper';

import { _setState, setState, store } from '../store';

import { updatePageData } from './image';

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
    Reflect.has(store.imgMap, url) && _setState('imgMap', url, key, val),
} as MainFn;
if (isDevMode)
  Object.assign(mainFn, { showCanvas, showColorArea, showGrayList });
worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
