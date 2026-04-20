/**
 * Cotrans 翻译任务实现
 *
 * 使用 cotrans.touhou.ai 公共服务进行图片翻译。
 * 通过 WebSocket 或轮询获取翻译状态，最终合并原图和翻译蒙版。
 */
import { canvasToBlob, log, sleep, t, waitImgLoad } from 'helper';
import { request } from 'request';

import { store } from '../../../../store';
import { TranslationTask } from '../../TranslationTask';
import { sizeDict } from './options';

/** Cotrans API 返回的消息类型 */
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

/**
 * Cotrans 翻译任务
 *
 * 使用 cotrans.touhou.ai 公共翻译服务。
 * 返回的是翻译蒙版，需要与原图合并。
 */
export class Cotrans extends TranslationTask {
  /** 创建上传表单数据 */
  static createFormData(blob: Blob) {
    const formData = new FormData();
    const fileName = `image.${blob.type.split('/').at(-1)}`;
    const file = new File([blob], fileName, { type: blob.type });

    const options = store.option.translation.cotrans;

    formData.append('file', file);
    formData.append('mime', file.type);
    formData.append('size', sizeDict[options.detector.detection_size]);
    formData.append('detector', options.detector.detector);
    formData.append('direction', options.render.direction);
    formData.append('translator', options.translator.translator);
    formData.append('target_language', options.translator.target_lang);
    formData.append('retry', `${store.option.translation.forceRetry}`);

    return formData;
  }

  /** 上传图片到 Cotrans 服务器 */
  async upload(blob: Blob) {
    try {
      return await request('https://api.cotrans.touhou.ai/task/upload/v1', {
        method: 'POST',
        data: Cotrans.createFormData(blob),
      });
    } catch (error) {
      log.error(error);
      throw new Error(t('translation.tip.upload_error'), { cause: error });
    }
  }

  /** 解析上传响应 */
  parse(json: string) {
    type Data =
      | {
          id: string;
          status: string;
          result: { translation_mask: string } | null;
        }
      | { error_id: string };

    let data: Data;
    try {
      data = JSON.parse(json) as Data;
    } catch (error) {
      throw new Error(`${t('translation.tip.upload_return_error')}：${json}`, {
        cause: error,
      });
    }

    if ('error_id' in data)
      throw new Error(
        `${t('translation.tip.upload_return_error')}：${data.error_id}`,
      );
    if (!data.id) throw new Error(t('translation.tip.id_not_returned'));
    return data;
  }

  /** 处理 WebSocket 或轮询返回的消息 */
  handleMessage(msg: QueryV1Message) {
    switch (msg.type) {
      case 'result':
        return msg.result.translation_mask;
      case 'pending':
        this.setMessage(t('translation.tip.pending', { pos: msg.pos }));
        break;
      case 'status':
        this.setMessage(t(`translation.status.${msg.status}`) || msg.status);
        break;

      case 'error':
        throw new Error(`${t('translation.status.error')}：id ${msg.error_id}`);
      case 'not_found':
        throw new Error(`${t('translation.status.error')}：Not Found`);
    }
  }

  /** 通过轮询等待翻译完成 */
  async waitByPolling(id: string) {
    let result: string | undefined;
    while (result === undefined) {
      const res = await request<QueryV1Message>(
        `https://api.cotrans.touhou.ai/task/${id}/status/v1`,
        { responseType: 'json' },
      );
      result = this.handleMessage(res.response);
      await sleep(1000);
    }
    return result;
  }

  /** 通过 WebSocket 等待翻译完成，失败时降级为轮询 */
  async wait(id: string) {
    const ws = new WebSocket(`wss://api.cotrans.touhou.ai/task/${id}/event/v1`);

    if (ws.readyState > 1) return this.waitByPolling(id);

    return new Promise<string>((resolve, reject) => {
      ws.onmessage = (e) => {
        try {
          const result = this.handleMessage(JSON.parse(e.data));
          if (result) resolve(result);
        } catch (error) {
          reject(error as Error);
        }
      };
    });
  }

  /** 将原图与翻译蒙版合并 */
  async mergeImage(rawImage: Blob, maskUri: string) {
    const img = await waitImgLoad(URL.createObjectURL(rawImage));
    const canvas = new OffscreenCanvas(img.naturalWidth, img.naturalHeight);
    const canvasCtx = canvas.getContext('2d')!;
    canvasCtx.drawImage(img, 0, 0);

    const mask = await waitImgLoad(
      URL.createObjectURL(await this.download(maskUri)),
    );
    canvasCtx.drawImage(mask, 0, 0);

    return await canvasToBlob(canvas);
  }

  async work(blob: Blob) {
    this.setMessage(t('translation.tip.upload'));

    const res = await this.upload(blob);
    const data = this.parse(res.responseText);

    const translation_mask =
      data.result?.translation_mask || (await this.wait(data.id));

    const result = await this.mergeImage(blob, translation_mask);
    return URL.createObjectURL(result);
  }
}
