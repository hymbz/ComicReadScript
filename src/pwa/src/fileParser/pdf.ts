import * as pdfjsLib from 'pdfjs-dist';
// oxlint-disable-next-line default
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import { toast } from 'components/Toast';
import { canvasToBlob, plimit, range, t } from 'helper';

import { type ImgFile } from '../store';
import { setImg } from './helper';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

/** 解析 PDF */
export const handlePdf = async (file: File): Promise<ImgFile[]> => {
  const tip = `「${file.name}」${t('pwa.message.parsing')}`;
  toast(tip, { duration: Number.POSITIVE_INFINITY });

  const outputScale = window.devicePixelRatio || 1;
  const transform =
    outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0];

  try {
    const task = pdfjsLib.getDocument({
      data: await file.arrayBuffer(),
      wasmUrl: '/pdfJsWasm/',
    });
    task.onPassword = (updatePassword: (password: string) => void) => {
      // eslint-disable-next-line no-alert
      const password = prompt(t('pwa.message.enter_password'));
      if (!password) throw new Error(t('pwa.alert.password_error'));
      updatePassword(password);
    };
    const pdf = await task.promise;

    setTimeout(() =>
      plimit(
        range(pdf.numPages, (i) => async () => {
          const page = await pdf.getPage(i + 1);
          const [, , width, height] = page.view;
          let scale = 1;

          // 缩放图片适应屏幕
          if (height > width) {
            if (height < document.body.clientHeight)
              scale = document.body.clientHeight / height;
          } else if (width < document.body.clientWidth)
            scale = document.body.clientWidth / width;

          const viewport = page.getViewport({ scale });
          const canvas = new OffscreenCanvas(
            Math.floor(viewport.width * outputScale),
            Math.floor(viewport.height * outputScale),
          );
          await page.render({ canvas: canvas as any, viewport, transform })
            .promise;
          const src = URL.createObjectURL(await canvasToBlob(canvas));
          setImg(i, src);
        }),
      ),
    );

    return range(pdf.numPages, (i) => ({ src: '', name: `${i}` }));
  } catch (error) {
    toast.error(
      `${file.name} ${t('pwa.alert.parse_error')}：${(error as Error).message}`,
    );
  } finally {
    toast.dismiss(tip);
  }

  return [];
};
