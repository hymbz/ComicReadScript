import * as Comlink from 'comlink';
import {
  createEffectOn,
  getImageData,
  log,
  once,
  throttle,
  wait,
} from 'helper';
import { unwrap } from 'solid-js/store';
import { type MainFn } from 'worker/ImageRecognition';
import * as worker from 'worker/ImageRecognition';

import { setState, store } from '../store';
import { getImg, getImgEle, getImgIndexs } from './helper';
import { updatePageData } from './image';
import { updateImgSize } from './imageSize';
import { renderImgList } from './renderPage';

/**
 * 在「图像识别」相关功能的配置变更后变更
 * 用于在 worker 执行结束后判断数据是否过期
 */
let recognitionVersion = 0;

/** 使所有正在进行的图像识别结果失效 */
export const invalidateRecognition = () => {
  recognitionVersion += 1;
  setState((state) => {
    for (const img of Object.values(state.imgMap))
      img.recognitionVersion = undefined;
  });
};

/** 判断图片是否处于当前渲染范围内 */
export const isInRenderRange = (url: string) => {
  const renderList = renderImgList();
  return getImgIndexs(url).some((index) => renderList.has(index));
};

export const handleImgRecognition = async (
  url: string,
  imgEle?: HTMLImageElement | null,
) => {
  const img = store.imgMap[url];
  if (!img || img.recognitionVersion !== undefined) return;

  const needRecognition =
    (store.option.imgRecognition.background && img.background === undefined) ||
    (store.option.imgRecognition.pageFill && img.blankMargin === undefined) ||
    (store.option.imgRecognition.crop && img.blankMargin === undefined);
  if (!needRecognition) return;

  // 只处理当前渲染范围内的图片，范围外等进入渲染范围后再由 effect 触发
  if (!isInRenderRange(url)) return;

  imgEle ??= await wait(() => getImgEle(url, true), 1000);
  if (!imgEle) return log.warn('获取图片元素失败');

  setState('imgMap', url, 'recognitionVersion', recognitionVersion);
  const { data, width, height } = getImageData(imgEle, 200);
  initWorker();
  await worker.recognitionImg(Comlink.transfer(data, [data.buffer]), {
    width,
    height,
    url,
    index: Number(imgEle.alt),
    option: unwrap(store.option.imgRecognition),
    version: recognitionVersion,
  });
};

const initWorker = once(() => {
  const mainFn = {
    log,
    updatePageData: throttle(() => setState(updatePageData), 1000),
    setImg: ({ url, key, val, version }) => {
      if (!Reflect.has(store.imgMap, url)) return;
      // 版本不一致说明配置已变化，丢弃旧识别结果
      if (version !== recognitionVersion) return;
      setState('imgMap', url, key, val);
      // 边缘裁切会导致图片大小变化，需要更新图片大小
      if (key === 'blankMargin' && store.option.imgRecognition.crop) {
        const { width, height } = store.imgMap[url];
        if (width && height) updateImgSize(url, width, height);
      }
    },
  } satisfies MainFn;
  worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
  // if (isDevMode) initDebugPopup(worker);
});

// 渲染范围或识别相关配置变化时，只对当前渲染范围内的已加载图片触发识别
createEffectOn(
  [
    renderImgList,
    () => store.option.imgRecognition.enabled,
    () => store.option.imgRecognition.background,
    () => store.option.imgRecognition.pageFill,
    () => store.option.imgRecognition.crop,
  ],
  ([imgList, enabled]) => {
    if (!enabled) return;
    for (const index of imgList) {
      const img = getImg(index);
      if (img.loadType === 'loaded') void handleImgRecognition(img.src);
    }
  },
);
