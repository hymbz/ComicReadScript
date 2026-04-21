/**
 * MangaImageTranslator 翻译任务实现
 *
 * 支持自部署的 manga-image-translator 服务。
 * 同时兼容新旧版本 API，支持流式和非流式响应。
 *
 * API 文档: http://0.0.0.0:5003/docs
 */
import {
  createEffectOn,
  createEqualsSignal,
  lang,
  log,
  sleep,
  t,
} from 'helper';

import type { TaskState } from './helper';

import { setOption } from '../../..';
import { store } from '../../../../store';
import { TranslationTask } from '../../TranslationTask';
import { api, apiUrl, headers } from './helper';
import { sizeDict } from './options';

/**
 * MangaImageTranslator 翻译任务
 *
 * 支持自部署服务，可使用自定义服务器地址。
 * 优先使用流式 API 获取实时翻译状态。
 */
export class MIT extends TranslationTask {
  isOldVersion = false;

  /** 创建上传表单数据 */
  static createFormData(blob: Blob, isOldVersion: boolean) {
    const formData = new FormData();
    const fileName = `image.${blob.type.split('/').at(-1)}`;
    const file = new File([blob], fileName, { type: blob.type });

    // oxlint-disable-next-line no-unused-vars
    const { localUrl: _, ...options } = store.option.translation.mit;

    if (isOldVersion) {
      formData.append('file', file);
      formData.append('mime', file.type);
      formData.append('size', sizeDict[options.detector.detection_size]);
      formData.append('detector', options.detector.detector);
      formData.append('direction', options.render.direction);
      formData.append('translator', options.translator.translator);
      formData.append('target_lang', options.translator.target_lang);
      formData.append('retry', `${store.option.translation.forceRetry}`);
    } else {
      formData.append('image', file);
      formData.append('config', JSON.stringify(options));
    }
    return formData;
  }

  async init() {
    const res = await api('/', {
      errorText: `${t('setting.option.paragraph_translation')} - ${t('alert.server_connect_failed')}`,
    });
    this.isOldVersion = res.responseText.includes('value="S">1024px</');
  }

  /** 旧版 API：上传图片获取任务 ID */
  async oldUpload(blob: Blob) {
    try {
      type resData = {
        task_id: string;
        status: string;
      };
      const res = await api<resData>('/submit', {
        method: 'POST',
        responseType: 'json',
        data: MIT.createFormData(blob, true),
      });
      return res.response.task_id;
    } catch (error) {
      log.error(error);
      throw new Error(t('translation.tip.upload_error'), { cause: error });
    }
  }

  /** 旧版 API：等待翻译完成 */
  async oldWork(blob: Blob) {
    const task_id = await this.oldUpload(blob);

    let errorNum = 0;
    let taskState: TaskState | undefined;
    while (!taskState?.finished) {
      try {
        await sleep(200);
        const res = await api<TaskState>(`/task-state?taskid=${task_id}`, {
          responseType: 'json',
        });
        taskState = res.response;
        this.setMessage(
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

    const res = await this.download(`${apiUrl()}/result/${task_id}`, {
      headers: headers(),
    });
    return URL.createObjectURL(res);
  }

  /** 新版 API：通过流式接口上传 */
  async uploadByStream(blob: Blob) {
    const res = await fetch(`${apiUrl()}/translate/with-form/image/stream`, {
      method: 'POST',
      headers: headers(),
      body: MIT.createFormData(blob, false),
    });

    if (res.status !== 200 || !res.body)
      throw new Error(t('translation.status.error'));

    return res.body.getReader();
  }

  /** 解析流式响应，等待翻译完成 */
  async wait(reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>) {
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
          case 1: {
            // manga-image-translator 的流式状态协议：
            // case 1 = 翻译进度状态，case 2 = 错误，case 3 = 排队位置
            // 部分状态带有冒号前缀（如 rendering_folder:xxx、final_ready:xxx），
            // 这些是前端 UI 内部指令，不应显示给用户，需过滤掉

            // MIT 更新后若新增了需要显示的翻译状态，可对照
            // manga-image-translator/server/index.html 中的 _statusText getter 来确认
            const status = decoder.decode(data);
            if (!status.includes(':'))
              this.setMessage(t(`translation.status.${status}`) || status);
            break;
          }
          case 2:
            throw new Error(
              `${t('translation.status.error')}: ${decoder.decode(data)}`,
            );
          case 3: {
            const pos = decoder.decode(data);
            if (pos !== '0') {
              this.setMessage(t('translation.tip.pending', { pos }));
              break;
            }
            // falls through
          }
          case 4:
            this.setMessage(t('translation.status.pending'));
            break;
        }
        buffer = buffer.slice(totalSize);
      }
    }
    throw new Error(t('translation.status.error'));
  }

  /** 新版 API：非流式接口（当流式接口不可用时降级使用） */
  async uploadByNoStream(blob: Blob) {
    this.setMessage(t('translation.tip.translating'));
    // 在拷贝漫画上莫名有概率报错
    // 虽然猜测可能是 cors connect-src 导致的，但在类似的 fantia 上却也无法复现
    // 也找不到第二个同样问题的网站，考虑到应该没人会在拷贝上翻译，就暂且不管了
    const res = await api<Blob>('/translate/with-form/image', {
      method: 'POST',
      responseType: 'blob',
      fetch: false,
      timeout: 1000 * 60 * 10,
      data: MIT.createFormData(blob, false),
      errorText: t('translation.tip.upload_error'),
    });
    return URL.createObjectURL(res.response);
  }

  async work(blob: Blob) {
    this.setMessage(t('translation.tip.upload'));

    if (this.isOldVersion) return await this.oldWork(blob);

    try {
      const reader = await this.uploadByStream(blob);
      return await this.wait(reader);
    } catch (error) {
      // 如果因为 cors 无法使用 fetch，就只能使用拿不到翻译状态的非流式接口了
      if ((error as Error).message.includes('Failed to fetch'))
        return await this.uploadByNoStream(blob);
      throw error;
    }
  }
}

/** 服务支持的翻译器列表 */
export const [mitTranslators, setMitTranslators] = createEqualsSignal<
  [string, string][]
>([]);

/** 从服务器获取可用翻译器列表 */
export const updateMitTranslators = async (noTip = false) => {
  if (store.option.translation.provider !== 'manga-image-translator') return;

  try {
    const res = await api('/', {
      noTip,
      errorText: `${t('setting.option.paragraph_translation')} - ${t('alert.server_connect_failed')}`,
    });
    const translatorsText = /(?<=validTranslators: )\[.+?\](?=,)/s.exec(
      res.responseText,
    )?.[0];
    if (!translatorsText) return undefined;

    const list: string[] = JSON.parse(
      translatorsText.replaceAll(/\s|,\s*(?=\])/g, ``).replaceAll(`'`, `"`),
    );
    setMitTranslators(
      list.map(
        (name) => [name, t(`translation.translator.${name}`) || name] as const,
      ),
    );
  } catch (error) {
    log.error(t('translation.tip.get_translator_list_error'), error);
    setMitTranslators([]);
  }

  // 如果更新后原先选择的翻译服务失效了，就换成第一个翻译
  if (
    !mitTranslators().some(
      ([val]) => val === store.option.translation.mit.translator.translator,
    )
  ) {
    setOption((draftOption) => {
      draftOption.translation.mit.translator.translator =
        mitTranslators()[0]?.[0];
    });
  }
};

// 在切换翻译器或地址时更新可用翻译器列表
createEffectOn(
  [
    () => store.option.translation.provider,
    () => store.option.translation.mit.localUrl,
    lang,
  ],
  ([server]) => {
    if (server === 'manga-image-translator' && store.imgList.length > 0)
      return updateMitTranslators(true);
  },
  { defer: true },
);
