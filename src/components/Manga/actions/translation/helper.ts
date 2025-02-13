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
  const file = new File([imgBlob], `image.${imgBlob.type.split('/').at(-1)}`, {
    type: imgBlob.type,
  });
  const { size, detector, direction, translator, targetLanguage } =
    store.option.translation.options;
  const formData = new FormData();

  if (type === 'selfhosted') {
    formData.append('image', file);
    formData.append(
      'config',
      JSON.stringify({
        detector: { detector, detection_size: size },
        render: { direction },
        translator: { translator, target_lang: targetLanguage },
      }),
    );
  } else {
    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('size', sizeDict[size]);
    formData.append('detector', detector);
    formData.append('direction', direction);
    formData.append('translator', translator);
    formData.append(
      type === 'cotrans' ? 'target_language' : 'target_lang',
      targetLanguage,
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
