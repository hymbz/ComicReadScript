import { canvasToBlob, log, t, waitImgLoad } from 'helper';

import { setState, store } from '../../store';

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (url: string, msg: string) =>
  setState('imgMap', url, 'translationMessage', msg);

const sizeDict = { '1024': 'S', '1536': 'M', '2048': 'L', '2560': 'X' };

export const createFormData = (
  imgBlob: Blob,
  type: 'selfhosted' | 'cotrans' | 'selfhosted-old',
) => {
  const formData = new FormData();
  const { options } = store.option.translation;
  const file = new File([imgBlob], `image.${imgBlob.type.split('/').at(-1)}`, {
    type: imgBlob.type,
  });

  if (type === 'selfhosted') {
    formData.append('image', file);
    formData.append('config', JSON.stringify(options));
  } else {
    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('size', sizeDict[options.detector.detection_size]);
    formData.append('detector', options.detector.detector);
    formData.append('direction', options.render.direction);
    formData.append('translator', options.translator.translator);
    formData.append(
      type === 'cotrans' ? 'target_language' : 'target_lang',
      options.translator.target_lang,
    );
    formData.append('retry', `${store.option.translation.forceRetry}`);
  }
  return formData;
};

/** 将站点列表转为选择器中的选项 */
export const createOptions = (list: string[]) =>
  list.map(
    (name) =>
      [name, t(`translation.translator.${name}`) || name] as [string, string],
  );

/** 缩小过大的图片 */
export const resize = async (blob: Blob, url: string): Promise<Blob> => {
  const img = store.imgMap[url];
  const w = img.width!;
  const h = img.height!;

  if (w <= 4096 && h <= 4096) return blob;

  try {
    const scale = Math.min(4096 / w, 4096 / h);
    const width = Math.floor(w * scale);
    const height = Math.floor(h * scale);

    const img = await waitImgLoad(URL.createObjectURL(blob));
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(img.src);

    return await canvasToBlob(canvas);
  } catch (error) {
    log.error('缩小图片尺寸时出错', error);
    return blob;
  }
};
