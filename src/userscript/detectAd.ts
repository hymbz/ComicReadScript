import * as Comlink from 'comlink';

import { log, onec, waitImgLoad } from 'helper';
import { request } from 'main';
import * as worker from 'worker/detectAd';

import type { MainFn } from '../worker/detectAd/workHelper';

import { showCanvas, showGrayList } from '../worker/helper';

/** 用常识逻辑进行判断，以期能在检测失误时减小影响范围和遗漏 */
const getAdPage = async <T>(
  list: (T | undefined)[],
  isAdPage: (item: T) => boolean | Promise<boolean>,
  adList: Set<number>,
) => {
  let i = list.length - 1;
  let normalNum = 0;
  // 只检查最后十张
  for (; i >= list.length - 10; i--) {
    // 开头肯定不会是广告
    if (i <= 2) break;
    if (adList.has(i)) continue;

    const item = list[i];
    if (!item) break;

    if (await isAdPage(item)) adList.add(i);
    // 找到连续三张正常漫画页后中断
    else if (normalNum >= 2) break;
    else normalNum += 1;
  }

  let adNum = 0;
  for (i = Math.min(...adList); i < list.length; i++) {
    if (adList.has(i)) {
      adNum += 1;
      continue;
    }

    // 连续两张广告后面的肯定也都是广告
    if (adNum >= 2) adList.add(i);
    // 夹在两张广告中间的肯定也是广告
    else if (adList.has(i - 1) && adList.has(i + 1)) adList.add(i);
    else adNum = 0;
  }

  return adList;
};

const imgToCanvas = async (
  img: HTMLImageElement | string,
): Promise<ImageBitmap> => {
  if (typeof img !== 'string') {
    await waitImgLoad(img);

    try {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      // 没被 CORS 污染就直接使用
      if (ctx.getImageData(0, 0, 1, 1)) {
        const imgBitmap = canvas.transferToImageBitmap();
        return Comlink.transfer(imgBitmap, [imgBitmap]);
      }
    } catch {}
  }

  const url = typeof img === 'string' ? img : img.src;
  const res = await request<Blob>(url, {
    responseType: 'blob',
    fetch: false,
  });
  const imgBitmap = await createImageBitmap(res.response);
  return Comlink.transfer(imgBitmap, [imgBitmap]);
};

/** 通过文件名判断是否是广告 */
export const getAdPageByFileName = (
  fileNameList: (string | undefined)[],
  adList: Set<number>,
) =>
  getAdPage(fileNameList, (fileName: string) => /^z+/i.test(fileName), adList);

export const isAdImg = (imgBitmap: ImageBitmap) => {
  initWorker();
  return worker.isAdImg(Comlink.transfer(imgBitmap, [imgBitmap]));
};

/** 通过图片内容判断是否是广告 */
export const getAdPageByContent = (
  imgList: (HTMLImageElement | string | undefined)[],
  adList: Set<number>,
) =>
  getAdPage(
    imgList,
    async (img: HTMLImageElement | string) => isAdImg(await imgToCanvas(img)),
    adList,
  );

const initWorker = onec(() => {
  const mainFn = { log } satisfies MainFn;
  if (isDevMode) Object.assign(mainFn, { showCanvas, showGrayList });
  worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
});
