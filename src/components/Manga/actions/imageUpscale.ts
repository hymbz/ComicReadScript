import * as Comlink from 'comlink';

import type { MainFn } from 'worker/ImageUpscale';

import { toast } from 'components/Toast';
import { createEffectOn, getImageData, log, t, wait } from 'helper';
import { request } from 'request';
import * as worker from 'worker/ImageUpscale';

import { setState, store } from '../store';
import { getImg, getImgEle } from './helper';
import { activeImgIndex, imgList, isUpscale } from './memo';

export const upscaleImage = async (url: string, imgEle: HTMLImageElement) => {
  setState('imgMap', url, 'upscaleUrl', '');
  const { data, width, height } = getImageData(imgEle);
  await worker.upscaleImage(
    Comlink.transfer(data, [data.buffer]),
    width,
    height,
    url,
  );
};

let upscaleing = false;
const findUpscaleImage = async (
  start: number,
  end: number,
): Promise<[string, HTMLImageElement] | undefined> => {
  for (let i = start; i < end; i++) {
    const img = typeof i === 'number' ? getImg(i) : i;
    if (img.upscaleUrl !== undefined) continue;
    const imgEle = await wait(() => getImgEle(img.src), 1000);
    if (imgEle) return [img.src, imgEle];
  }
};
const handleUpscaleImage = async () => {
  if (upscaleing || !isUpscale()) return;
  // 优先放大 当前显示的图片 > 后面的图片 > 前面的图片
  const targetImg =
    (await findUpscaleImage(activeImgIndex(), store.imgList.length)) ??
    (await findUpscaleImage(0, activeImgIndex()));
  if (!targetImg) return;
  upscaleing = true;
  await upscaleImage(...targetImg);
  upscaleing = false;
  return handleUpscaleImage();
};
createEffectOn([isUpscale, imgList], handleUpscaleImage);

const bufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCodePoint(bytes[i]);
  return window.btoa(binary);
};

const getModel = async () => {
  try {
    let base64: string | undefined;
    let buffer: ArrayBuffer | undefined;
    if (typeof GM !== 'undefined')
      base64 = await GM.getValue<string>('@model.bin');
    if (!base64) {
      toast(t('upscale.module_downloading'), {
        id: 'upscale',
        duration: Number.POSITIVE_INFINITY,
      });
      // TODO: 修改网址
      const bin = await request<ArrayBuffer>(
        'https://cdn.jsdelivr.net/npm/@hymbz/comic-read-script@11.12.1/public/realcugan/2x-conservative-128/group1-shard1of1.bin',
        { responseType: 'arraybuffer', noTip: true },
      );
      toast(t('upscale.module_download_complete'), {
        id: 'upscale',
        duration: 1000 * 3,
      });
      buffer = bin.response;
      base64 = bufferToBase64(buffer);
      await GM.setValue('@model.bin', base64);
    }

    let json = await GM.getValue<string>('@model.json');
    if (!json) {
      const jsonFile = await request(
        'https://cdn.jsdelivr.net/npm/@hymbz/comic-read-script@11.12.1/public/realcugan/2x-conservative-128/model.json',
        { noTip: true },
      );
      json = jsonFile.responseText;
      await GM.setValue('@model.json', json);
    }

    return { base64, json, buffer };
  } catch (error) {
    log.error('获取图片放大模型出错', error);
    toast.dismiss('upscale');
    toast.error(t('upscale.module_download_failed'), {
      id: 'upscale',
      duration: Number.POSITIVE_INFINITY,
    });
    setState('supportUpscaleImage', false);
    setState('option', 'imgRecognition', 'upscale', false);
    throw error;
  }
};

const mainFn = {
  log,
  toast,
  t,
  setImg: (url, key, val) =>
    Reflect.has(store.imgMap, url) && setState('imgMap', url, key, val),
  getModel,
} satisfies MainFn;
worker.setMainFn(Comlink.proxy(mainFn), Object.keys(mainFn));
