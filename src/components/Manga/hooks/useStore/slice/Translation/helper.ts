import { setState, store } from '../..';
import { updateTipText } from '../Scrollbar';

export const messageMap = {
  default: '未知状态',
  pending: '正在等待',
  'pending-pos': '正在等待',
  upscaling: '正在放大图片',
  detection: '正在检测文本',
  ocr: '正在识别文本',
  'mask-generation': '正在生成文本掩码',
  inpainting: '正在修补图片',
  translating: '正在翻译文本',
  rendering: '正在渲染',
  downscaling: '正在缩小图片',
  finished: '正在整理结果',
  error: '翻译出错',
  'error-lang': '你选择的翻译服务不支持你选择的语言',
  'error-translating': '翻译服务没有返回任何文本',
  'error-with-id': '翻译出错',
  saved: '正在返回缓存结果',
};

export const translatorMap: Record<string, string> = {
  youdao: '有道',
  baidu: '百度',
  google: '谷歌',
  deepl: 'DeepL',
  'gpt3.5': 'GPT-3.5',
  offline: '离线模型',
  none: '删除文本',
  original: '原文',
};

export type TaskState = {
  state: 'saved' | 'finished' | 'error' | 'error-lang';
  finished: boolean;
  waiting: number;
};

export const setMessage = (i: number, msg: string) => {
  setState((state) => {
    state.imgList[i].translationMessage = msg;
  });
  updateTipText();
};

export const isBlobUrlRe = /^blob:/;

export const request = <T = any>(
  url: string,
  details?: Partial<Tampermonkey.Request<any>>,
): Promise<Tampermonkey.Response<T>> =>
  new Promise((resolve, reject) => {
    if (!window.crsLib) throw new Error('未安装 ComicRead 插件');
    window.crsLib.GM_xmlhttpRequest({
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
  if (isBlobUrlRe.test(url)) {
    const res = await fetch(url);
    return res.blob();
  }

  const res = await request<Blob>(url, { responseType: 'blob' });
  return res.response as Blob;
};

export const createFormData = (imgBlob: Blob) => {
  const file = new File([imgBlob], 'image.jpeg', { type: imgBlob.type });

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
  list.map((name) => [name, translatorMap[name] ?? name] as [string, string]);
