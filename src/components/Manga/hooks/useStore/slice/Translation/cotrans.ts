import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { store } from '../..';
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
  const canvas = document.createElement('canvas');
  const canvasCtx = canvas.getContext('2d')!;

  const img = new Image();
  img.src = URL.createObjectURL(rawImage);
  await new Promise((resolve) => {
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      canvasCtx.drawImage(img, 0, 0);
      resolve(null);
    };
  });

  const img2 = new Image();
  img2.src = maskUri;
  img2.crossOrigin = 'anonymous';
  await new Promise((resolve) => {
    img2.onload = () => {
      canvasCtx.drawImage(img2, 0, 0);
      resolve(null);
    };
  });

  const translated = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
  return URL.createObjectURL(translated);
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

  let id: string;
  let translation_mask: string | undefined;
  try {
    const res = await request('https://api.cotrans.touhou.ai/task/upload/v1', {
      method: 'POST',
      data: createFormData(imgBlob),
      headers: {
        Origin: 'https://cotrans.touhou.ai',
        Referer: 'https://cotrans.touhou.ai/',
      },
    });

    const resData = JSON.parse(res.responseText) as
      | {
          id: string;
          status: string;
          result: null | { translation_mask: string };
        }
      | { error_id: string };

    if ('error_id' in resData)
      throw new Error(
        `${t('translation.tip.upload_return_error')}：${resData.error_id}`,
      );
    if (!resData.id) throw new Error(t('translation.tip.id_not_returned'));

    id = resData.id;
    translation_mask = resData.result?.translation_mask;
  } catch (error) {
    log.error(error);
    throw new Error(t('translation.tip.upload_error'));
  }

  if (!translation_mask) translation_mask = await waitTranslation(id, i);

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
