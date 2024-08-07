import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { canvasToBlob, waitImgLoad } from 'helper';

import { store } from '../../store';

import { setMessage, download, request, createFormData } from './helper';

type QueryV1Message =
  | {
      type: 'pending';
      pos: number;
    }
  | {
      type: 'status';
      status: string;
    }
  | {
      type: 'result';
      result: {
        translation_mask: string;
      };
    }
  | {
      type: 'error';
      error_id?: string;
    }
  | {
      type: 'not_found';
    };

/** 等待翻译完成 */
const waitTranslation = (id: string, i: number) => {
  const ws = new WebSocket(`wss://api.cotrans.touhou.ai/task/${id}/event/v1`);

  return new Promise<string>((resolve, reject) => {
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data) as QueryV1Message;

      switch (msg.type) {
        case 'result':
          resolve(msg.result.translation_mask);
          break;
        case 'pending':
          setMessage(i, t('translation.tip.pending', { pos: msg.pos }));
          break;
        case 'status':
          setMessage(i, t(`translation.status.${msg.status}`) || msg.status);
          break;

        case 'error':
          reject(
            new Error(`${t('translation.tip.error')}：id ${msg.error_id}`),
          );
          break;
        case 'not_found':
          reject(new Error(`${t('translation.tip.error')}：Not Found`));
          break;
      }
    };
  });
};

/** 将翻译后的内容覆盖到原图上 */
const mergeImage = async (rawImage: Blob, maskUri: string) => {
  const img = await waitImgLoad(URL.createObjectURL(rawImage));
  const canvas = new OffscreenCanvas(img.width, img.height);
  const canvasCtx = canvas.getContext('2d')!;
  canvasCtx.drawImage(img, 0, 0);

  const img2 = new Image();
  img2.src = maskUri;
  img2.crossOrigin = 'anonymous';
  await waitImgLoad(img2);
  canvasCtx.drawImage(img2, 0, 0);

  return URL.createObjectURL(await canvasToBlob(canvas));
};

/** 缩小过大的图片 */
const resize = async (blob: Blob, w: number, h: number): Promise<Blob> => {
  if (w <= 4096 && h <= 4096) return blob;

  const scale = Math.min(4096 / w, 4096 / h);
  const width = Math.floor(w * scale);
  const height = Math.floor(h * scale);

  const img = await waitImgLoad(URL.createObjectURL(blob));
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);
  URL.revokeObjectURL(img.src);

  return canvasToBlob(canvas);
};

/** 使用 cotrans 翻译指定图片 */
export const cotransTranslation = async (i: number) => {
  const img = store.imgList[i];
  setMessage(i, t('translation.tip.img_downloading'));
  let imgBlob: Blob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.download_img_failed'));
  }

  try {
    imgBlob = await resize(imgBlob, img.width!, img.height!);
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.resize_img_failed'));
  }

  let res: Tampermonkey.Response<any>;
  try {
    res = await request('https://api.cotrans.touhou.ai/task/upload/v1', {
      method: 'POST',
      data: createFormData(imgBlob),
      headers: {
        Origin: 'https://cotrans.touhou.ai',
        Referer: 'https://cotrans.touhou.ai/',
      },
    });
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.upload_error'));
  }

  let resData:
    | {
        id: string;
        status: string;
        result: { translation_mask: string } | null;
      }
    | { error_id: string };
  try {
    resData = JSON.parse(res.responseText);
  } catch {
    throw new Error(
      `${t('translation.tip.upload_return_error')}：${res.responseText}`,
    );
  }

  if ('error_id' in resData)
    throw new Error(
      `${t('translation.tip.upload_return_error')}：${resData.error_id}`,
    );
  if (!resData.id) throw new Error(t('translation.tip.id_not_returned'));

  const translation_mask =
    resData.result?.translation_mask || (await waitTranslation(resData.id, i));

  return mergeImage(imgBlob, translation_mask);
};

export const cotransTranslators = [
  'google',
  'youdao',
  'baidu',
  'deepl',
  'gpt3.5',
  'offline',
  'none',
];
