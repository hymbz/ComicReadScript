import type { ImgFile } from '../store';

import { isSupportFile } from './helper';
import { handlePdf } from './pdf';
import { unzip } from './unzip';

export * from './helper';

export const getImgData = (file: File): Promise<ImgFile[]> | ImgFile[] => {
  const fileType = isSupportFile(file.name);
  switch (fileType) {
    case null:
      return [];
    case 'img':
      return [{ name: file.name, src: URL.createObjectURL(file) }];
    case 'pdf':
      return handlePdf(file);
    default:
      return unzip(file, fileType);
  }
};
