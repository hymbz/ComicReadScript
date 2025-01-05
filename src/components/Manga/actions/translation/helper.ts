import { t } from 'helper';
import { request } from 'request';

import { _setState, store } from '../../store';

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (url: string, msg: string) =>
  _setState('imgMap', url, 'translationMessage', msg);

export const download = async (imgUrl: string) => {
  const url = store.imgMap[imgUrl]?.blobUrl ?? imgUrl;

  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await request<Blob>(url, {
    fetch: false,
    responseType: 'blob',
    errorText: t('translation.tip.download_img_failed'),
  });
  return res.response;
};

export const createFormData = (
  imgBlob: Blob,
  type: 'selfhosted' | 'cotrans',
) => {
  const file = new File([imgBlob], `image.${imgBlob.type.split('/').at(-1)}`, {
    type: imgBlob.type,
  });
  const { size, detector, direction, translator, targetLanguage } =
    store.option.translation.options;
  let SizeLists = [['S', 1024], ['M', 1536], ['L', 2048], ['X', 2560]]
  const formData = new FormData();
  if (type === 'cotrans') {
    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('size', size);
    formData.append('detector', detector);
    formData.append('direction', direction);
    formData.append('translator', translator);
    formData.append('target_language', targetLanguage);
    formData.append('retry', `${store.option.translation.forceRetry}`);
  }else if (type === 'selfhosted') {
    formData.append('image', file);
    formData.append('config', JSON.stringify({
      detector: {
        detector: 'default',
        detection_size: SizeLists.find((item) => item[0] === size)?.[1] ?? 0,
      },
      render: {
        direction: direction,
      },
      translator: {
        translator: translator,
        target_lang: targetLanguage,
      }
    }));

  }
  return formData;
};

/** 将站点列表转为选择器中的选项 */
export const createOptions = (list: string[]) =>
  list.map(
    (name) =>
      [name, t(`translation.translator.${name}`) || name] as [string, string],
  );
