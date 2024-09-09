import { t } from 'helper';
import { request } from 'request';

import { _setState, store } from '../../store';

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (i: number, msg: string) =>
  _setState('imgList', i, 'translationMessage', msg);

export const download = async (url: string) => {
  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await request<Blob>(url, {
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

  const formData = new FormData();
  formData.append('file', file);
  formData.append('mime', file.type);
  formData.append('size', size);
  formData.append('detector', detector);
  formData.append('direction', direction);
  formData.append('translator', translator);
  if (type === 'cotrans') formData.append('target_language', targetLanguage);
  else formData.append('target_lang', targetLanguage);
  formData.append('retry', `${store.option.translation.forceRetry}`);
  return formData;
};

/** 将站点列表转为选择器中的选项 */
export const createOptions = (list: string[]) =>
  list.map(
    (name) =>
      [name, t(`translation.translator.${name}`) || name] as [string, string],
  );
