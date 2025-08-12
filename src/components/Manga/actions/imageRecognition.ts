import * as Comlink from 'comlink';
import { unwrap } from 'solid-js/store';

import type { MainFn } from 'worker/ImageRecognition';

import { getImageData, log, onec, throttle, wait } from 'helper';
import { showCanvas, showColorArea, showGrayList } from 'worker/helper';
import * as worker from 'worker/ImageRecognition';

import { setState, store } from '../store';
import { getImgEle } from './helper';
import { updatePageData } from './image';

export const handleImgRecognition = async (
  url: string,
  imgEle?: HTMLImageElement | null,
) => {
  const img = store.imgMap[url];
  const needRecognition =
    (store.option.imgRecognition.background && img.background === undefined) ||
    (store.option.imgRecognition.pageFill && img.blankMargin === undefined);
  if (needRecognition) {
    imgEle ??= await wait(() => getImgEle(url), 1000);
    if (!imgEle) return log.warn('获取图片元素失败');
    const { data, width, height } = getImageData(imgEle);
    initWorker();
    return worker.recognitionImg(
      Comlink.transfer(data, [data.buffer]),
      width,
      height,
      url,
      unwrap(store.option.imgRecognition),
    );
  }
};

const initWorker = onec(() => {
  const mainFn = {
    log,
    updatePageData: throttle(() => setState(updatePageData), 1000),
    setImg: (url, key, val) =>
      Reflect.has(store.imgMap, url) && setState('imgMap', url, key, val),
  } satisfies MainFn;
  if (isDevMode)
    Object.assign(mainFn, { showCanvas, showColorArea, showGrayList });
  worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
});
