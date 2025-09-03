import { toast } from 'components/Toast';
import { log, t } from 'helper';

import type { ImgFile } from '../../store';
import type { ZipExtension } from '../helper';

import { fflate } from './fflate';
import { libarchive } from './libarchive';
import { libunrar } from './libunrar';

const unzipFnMap = new Map<
  string,
  (data: ZipData) => Promise<(ImgFile | undefined)[]>
>();
// fflate 速度最快所以最先尝试
unzipFnMap.set('fflate', fflate);
// 是 rar 再交给 libunrar
unzipFnMap.set('libunrar', libunrar);
// 最后 7z 或有密码的给 libarchive
unzipFnMap.set('libarchive', libarchive);

export type ZipData = {
  zipFile: File;
  tip: string;
  extension: 'img' | ZipExtension;
};

/** 解压缩文件 */
export const unzip = async (zipFile: File, extension: ZipExtension) => {
  const tip = `「${zipFile.name}」${t('pwa.message.parsing')}`;
  toast(tip, { duration: Number.POSITIVE_INFINITY });

  let imgDataList: (ImgFile | undefined)[] = [];

  for (const [name, unzipFn] of unzipFnMap.entries()) {
    try {
      log(name);
      imgDataList = await unzipFn({ zipFile, tip, extension });
    } catch (error) {
      toast.error(
        `${name} ${t('pwa.alert.parse_error')}：${(error as Error).message}`,
      );
    }

    if (imgDataList.length > 0) break;
  }

  toast.dismiss(tip);

  return imgDataList.filter(Boolean) as ImgFile[];
};
