import { store } from '../..';
import {
  setMessage,
  download,
  request,
  messageMap,
  createFormData,
  createOptions,
} from './helper';

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
          setMessage(i, `正在等待服务器队列，还有 ${msg.pos} 张图片`);
          break;
        case 'status':
          setMessage(i, messageMap[msg.status] ?? msg.status);
          break;

        case 'error':
          reject(new Error(`翻译出错：id ${msg.error_id}`));
          break;
        case 'not_found':
          reject(new Error(`翻译出错：Not Found`));
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
  setMessage(i, '正在下载图片');
  let imgBlob: Blob;
  try {
    imgBlob = await download(img.src);
  } catch (error) {
    console.error(error);
    throw new Error('下载图片失败');
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
      throw new Error(`上传后报错：${resData.error_id}`);
    if (!resData.id) throw new Error('未返回 id');

    id = resData.id;
    translation_mask = resData.result?.translation_mask;
  } catch (error) {
    console.error(error);
    throw new Error('图片上传出错');
  }

  if (!translation_mask) translation_mask = await waitTranslation(id, i);

  return mergeImage(imgBlob, translation_mask);
};

export const cotransTranslators = createOptions([
  'google',
  'youdao',
  'baidu',
  'deepl',
  'gpt3.5',
  'offline',
  'none',
]);
