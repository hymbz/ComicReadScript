import { t } from 'helper';

import { _setState, store } from '../../store';

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (i: number, msg: string) =>
  _setState('imgList', i, 'translationMessage', msg);

export const request = <T = any>(
  url: string,
  details?: Partial<Tampermonkey.Request<any>>,
): Promise<Tampermonkey.Response<T>> =>
  new Promise((resolve, reject) => {
    if (typeof GM_xmlhttpRequest === 'undefined')
      reject(new Error(t('pwa.alert.userscript_not_installed')));

    GM_xmlhttpRequest({
      method: 'GET',
      url,
      headers: { Referer: window.location.href },
      ...details,
      onload: resolve,
      onerror: reject,
      ontimeout: reject,
    });
  });

export const download = async (url: string) => {
  if (url.startsWith('blob:')) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await request<Blob>(url, { responseType: 'blob' });
  return res.response;
};

export const createFormData = (imgBlob: Blob) => {
  const file = new File([imgBlob], `image.${imgBlob.type.split('/').at(-1)}`, {
    type: imgBlob.type,
  });

  const formData = new FormData();
  formData.append('file', file);
  formData.append('mime', file.type);
  formData.append('size', store.option.translation.options.size);
  formData.append('detector', store.option.translation.options.detector);
  formData.append('direction', store.option.translation.options.direction);
  formData.append('translator', store.option.translation.options.translator);
  formData.append('tgt_lang', store.option.translation.options.targetLanguage);
  formData.append(
    'target_language',
    store.option.translation.options.targetLanguage,
  );
  formData.append('retry', `${store.option.translation.forceRetry}`);

  return formData;
};

/** 将站点列表转为选择器中的选项 */
export const createOptions = (list: string[]) =>
  list.map(
    (name) =>
      [name, t(`translation.translator.${name}`) || name] as [string, string],
  );
