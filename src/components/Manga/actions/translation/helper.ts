import { t } from 'helper';

import { _setState, store } from '../../store';

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (url: string, msg: string) =>
  _setState('imgMap', url, 'translationMessage', msg);

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
