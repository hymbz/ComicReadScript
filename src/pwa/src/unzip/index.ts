import { t } from 'helper/i18n';
import { toast } from '../../../components/Toast';
import type { ZipExtension } from '../helper';
import type { ImgFile } from '../store';
import { fflate } from './fflate';
import { libunrar } from './libunrar';
import { libarchive } from './libarchive';

// fflate 速度最快所以最先尝试
// 是 rar 再交给 libunrar
// 最后 7z 或有密码的给 libarchive
const unzipFnList = [fflate, libunrar, libarchive];
const unzipFnOrder = ['fflate', 'libunrar', 'libarchive'];

export interface ZipData {
  zipFile: File;
  tip: string;
  extension: 'img' | ZipExtension;
}

/** 解压缩文件 */
export const unzip = async (zipFile: File, extension: ZipExtension) => {
  const tip = `「${zipFile.name}」${t('pwa.message.unzipping')}`;
  toast(tip, { duration: Infinity });

  let imgDataList: Array<ImgFile | undefined> = [];

  for (let i = 0; i < unzipFnList.length; i += 1) {
    const unzipFn = unzipFnList[i];
    try {
      console.log(unzipFnOrder[i]);
      imgDataList = await unzipFn({ zipFile, tip, extension });
    } catch (e) {
      const errorText = `${unzipFnOrder[i]} ${t('pwa.alert.unzip_error')}：${
        (e as Error).message
      }`;
      toast.error(errorText);
      console.error(errorText, e);
    }
    if (imgDataList.length) break;
  }

  toast.dismiss(tip);

  return imgDataList.filter(Boolean) as ImgFile[];
};
