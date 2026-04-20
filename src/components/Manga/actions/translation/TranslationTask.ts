import { toast } from 'components/Toast';
import { canvasToBlob, log, t, waitImgLoad } from 'helper';

import type { RequestDetails } from '../../../../request';

import { downloadImg } from '../../helper';
import { setState, store } from '../../store';

/**
 * 翻译任务基类
 *
 * 每个翻译任务都是独立的实例，负责单张图片的完整翻译流程。
 * 子类需要实现 {@link work} 方法来定义具体的翻译逻辑。
 */
export abstract class TranslationTask {
  constructor(public readonly url: string) {}

  /** 更新当前图片的翻译状态消息 */
  setMessage(message: string) {
    setState('imgMap', this.url, 'translationMessage', message);
  }

  /** 下载图片 */
  async download(url = this.url, details?: RequestDetails<Blob>) {
    try {
      return await downloadImg(url, details);
    } catch (error) {
      log.error(error);
      store.prop.onImgError?.(url);
      throw new Error(t('translation.tip.download_img_failed'), {
        cause: error,
      });
    }
  }

  /** 缩小过大的图片（超过 4096px） */
  async resize(blob: Blob): Promise<Blob> {
    const img = store.imgMap[this.url];
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
  }

  /**
   * 执行翻译任务
   * @returns 翻译后的图片 URL
   */
  async run() {
    try {
      await this.init();
      this.setMessage(t('translation.tip.img_downloading'));
      let blob = await this.download();
      blob = await this.resize(blob);
      return await this.work(blob);
    } catch (error) {
      this.setMessage((error as Error).message);
      log.error('翻译出错', error);
      toast.error((error as Error).message);
      throw error;
    }
  }

  /**
   * 执行具体的翻译工作
   * @param blob 待翻译的图片
   * @returns 翻译后图片的 URL
   */
  abstract work(blob: Blob): Promise<string>;

  /** 初始化任务，子类可重写 */
  async init() {}
}
