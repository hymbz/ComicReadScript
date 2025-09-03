import * as pdfjsLib from 'pdfjs-dist';
// oxlint-disable-next-line default
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import { toast } from 'components/Toast';
import { canvasToBlob, plimit, range, t } from 'helper';

import type { ImgFile } from '../store';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

/** 解析 PDF */
export const handlePdf = async (file: File): Promise<ImgFile[]> => {
  const tip = `「${file.name}」${t('pwa.message.parsing')}`;
  toast(tip, { duration: Number.POSITIVE_INFINITY });

  let list: ImgFile[] = [];

  try {
    const task = pdfjsLib.getDocument(await file.arrayBuffer());
    task.onPassword = (updatePassword: (password: string) => void) => {
      // eslint-disable-next-line no-alert
      const password = prompt(t('pwa.message.enter_password'));
      if (!password) throw new Error(t('pwa.alert.password_error'));
      updatePassword(password);
    };
    const pdf = await task.promise;

    list = await plimit(
      range(pdf.numPages, (i) => async (): Promise<ImgFile> => {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = new OffscreenCanvas(viewport.width, viewport.height);
        await page.render({ canvas: canvas as any, viewport }).promise;
        const src = URL.createObjectURL(await canvasToBlob(canvas));
        return { src, name: `${i}` };
      }),
    );
  } catch (error) {
    toast.error(
      `${file.name} ${t('pwa.alert.parse_error')}：${(error as Error).message}`,
    );
  }

  toast.dismiss(tip);

  return list;
};
