import {
  createEffectOn,
  createEqualsSignal,
  lang,
  log,
  sleep,
  t,
} from 'helper';
import { request } from 'request';

import type { TaskState } from './helper';

import { downloadImg } from '../../helper';
import { store } from '../../store';
import { setOption } from '../helper';
import { createFormData, createOptions, setMessage } from './helper';

const apiUrl = () =>
  store.option.translation.localUrl || 'http://127.0.0.1:5003';

// api 文档：<http://0.0.0.0:5003/docs>

/** 使用自部署服务器翻译指定图片 */
export const selfhostedTranslation = async (url: string): Promise<string> => {
  const html = await request(apiUrl(), {
    errorText: `${t('setting.option.paragraph_translation')} - ${t('alert.server_connect_failed')}`,
  });

  setMessage(url, t('translation.tip.img_downloading'));
  let imgBlob: Blob;
  try {
    imgBlob = await downloadImg(url);
  } catch (error) {
    log.error(error, url);
    store.prop.onImgError?.(url);
    throw new Error(t('translation.tip.download_img_failed'), { cause: error });
  }

  // 支持旧版 manga-image-translator
  // https://sleazyfork.org/zh-CN/scripts/374903/discussions/273466
  if (html.responseText.includes('value="S">1024px</')) {
    let task_id: string;
    // 上传图片取得任务 id
    try {
      type resData = {
        task_id: string;
        status: string;
      };
      const res = await request<resData>(`${apiUrl()}/submit`, {
        method: 'POST',
        responseType: 'json',
        data: createFormData(imgBlob, 'selfhosted-old'),
      });
      ({ task_id } = res.response);
    } catch (error) {
      log.error(error);
      throw new Error(t('translation.tip.upload_error'), { cause: error });
    }

    let errorNum = 0;
    let taskState: TaskState | undefined;
    // 等待翻译完成
    while (!taskState?.finished) {
      try {
        await sleep(200);
        const res = await request<TaskState>(
          `${apiUrl()}/task-state?taskid=${task_id}`,
          { responseType: 'json' },
        );
        taskState = res.response;
        setMessage(
          url,
          `${t(`translation.status.${taskState.state}`) || taskState.state}`,
        );
      } catch (error) {
        log.error(error);
        if (errorNum > 5)
          throw new Error(t('translation.tip.check_img_status_failed'), {
            cause: error,
          });
        errorNum += 1;
      }
    }

    return URL.createObjectURL(
      await downloadImg(`${apiUrl()}/result/${task_id}`),
    );
  }

  const headers_ngrok = apiUrl().includes('ngrok-free')? new Headers({ "ngrok-skip-browser-warning": "69420" }) : undefined;
  try {
    const res = await fetch(`${apiUrl()}/translate/with-form/image/stream`, {
      method: 'POST',
      headers: headers_ngrok,
      body: createFormData(imgBlob, 'selfhosted'),
    });

    if (res.status !== 200 || !res.body)
      throw new Error(t('translation.status.error'));

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf8');
    let buffer = new Uint8Array();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer = Uint8Array.from([...buffer, ...value]);
      while (buffer.length >= 5) {
        const dataSize = new DataView(buffer.buffer).getUint32(1, false);
        const totalSize = 5 + dataSize;
        if (buffer.length < totalSize) break;

        const data = buffer.slice(5, totalSize);
        switch (buffer[0]) {
          case 0:
            return URL.createObjectURL(new Blob([data], { type: 'image/png' }));
          case 1:
            setMessage(url, t(`translation.status.${decoder.decode(data)}`));
            break;
          case 2:
            throw new Error(
              `${t('translation.status.error')}: ${decoder.decode(data)}`,
            );
          case 3: {
            const pos = decoder.decode(data);
            if (pos !== '0') {
              setMessage(url, t('translation.tip.pending', { pos }));
              break;
            }
            // falls through
          }
          case 4:
            setMessage(url, t('translation.status.pending'));
            break;
        }
        buffer = buffer.slice(totalSize);
      }
    }
    throw new Error(t('translation.status.error'));
  } catch (error) {
    // 如果因为 cors 无法使用 fetch，就只能使用拿不到翻译状态的非流式接口了
    if ((error as Error).message.includes('Failed to fetch')) {
      setMessage(url, t('translation.tip.translating'));
      // 在拷贝漫画上莫名有概率报错
      // 虽然猜测可能是 cors connect-src 导致的，但在类似的 fantia 上却也无法复现
      // 也找不到第二个同样问题的网站，考虑到应该没人会在拷贝上翻译，就暂且不管了
      const res = await request<Blob>(`${apiUrl()}/translate/with-form/image`, {
        method: 'POST',
        responseType: 'blob',
        fetch: false,
        timeout: 1000 * 60 * 10,
        headers: headers_ngrok,
        data: createFormData(imgBlob, 'selfhosted'),
        errorText: t('translation.tip.upload_error'),
      });
      return URL.createObjectURL(res.response);
    }
    throw error;
  }
};

export const [selfhostedOptions, setSelfOptions] = createEqualsSignal<
  [string, string][]
>([]);

/** 更新部署服务的可用翻译 */
export const updateSelfhostedOptions = async (noTip = false) => {
  if (store.option.translation.server !== 'selfhosted') return;

  try {
    const res = await request(`${apiUrl()}`, {
      noTip,
      errorText: `${t('setting.option.paragraph_translation')} - ${t('alert.server_connect_failed')}`,
    });
    const translatorsText = /(?<=validTranslators: )\[.+?\](?=,)/s.exec(
      res.responseText,
    )?.[0];
    if (!translatorsText) return undefined;
    const list = JSON.parse(
      translatorsText.replaceAll(/\s|,\s*(?=\])/g, ``).replaceAll(`'`, `"`),
    ) as string[];
    setSelfOptions(createOptions(list));
  } catch (error) {
    log.error(t('translation.tip.get_translator_list_error'), error);
    setSelfOptions([]);
  }

  // 如果更新后原先选择的翻译服务失效了，就换成第一个翻译
  if (
    !selfhostedOptions().some(
      ([val]) => val === store.option.translation.options.translator.translator,
    )
  ) {
    setOption((draftOption) => {
      draftOption.translation.options.translator.translator =
        selfhostedOptions()[0]?.[0];
    });
  }
};

// 在切换翻译服务器的同时切换可用翻译的选项列表
createEffectOn(
  [
    () => store.option.translation.server,
    () => store.option.translation.localUrl,
    lang,
  ],
  () => store.imgList.length > 0 && updateSelfhostedOptions(true),
  { defer: true },
);
