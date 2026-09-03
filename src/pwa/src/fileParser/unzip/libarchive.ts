import { askInput } from 'components/InputDialog';
import { toast } from 'components/Toast';
import { fileTypeFromBuffer } from 'file-type';
import { plimit, t } from 'helper';
import { Archive } from 'libarchive.js';

import { type ZipData } from '.';
import { createObjectURL } from '../../helper';
import { type ImgFile } from '../../store';
import { isSupportFile } from '../helper';

type CompressedFile = {
  name: string;
  extract: () => Promise<File>;
};

const initLibarchive = false;
/**
 * 解压缩 zip、rar、7z，并且支持密码
 *
 * 但是解压缩 rar 时可能会出错无法解析
 *
 * 还不支持 unicode，非英文字符会直接变成星号
 * 如果有多个文件名位数相同的文件就只能拿到第一个文件
 */
export const libarchive = async ({
  zipFile,
  tip,
}: ZipData): Promise<(ImgFile | undefined)[]> => {
  if (!initLibarchive)
    Archive.init({ workerUrl: '/libarchive.js/worker-bundle.js' });

  const archive = await Archive.open(zipFile);

  let password: string | null;
  if (await archive.hasEncryptedData()) {
    password = await askInput({ tip: zipFile.name });
    if (!password) return [];
    await archive.usePassword(password);
  }

  const zipImglist: { file: CompressedFile }[] = await archive.getFilesArray();

  return plimit(
    zipImglist
      .filter(({ file }) => isSupportFile(file.name) === 'img')
      .map(({ file }) => async () => {
        try {
          const imgFile: File = 'extract' in file ? await file.extract() : file;
          const buffer = await imgFile.arrayBuffer();
          const filtType = await fileTypeFromBuffer(buffer);
          const url = await createObjectURL(
            new Blob([buffer], { type: filtType?.mime || 'image/jpeg' }),
          );
          if (!url) throw new Error(t('pwa.alert.img_data_error'));
          return { name: file.name, src: url };
        } catch (error) {
          // 如果输入了错误的密码，所有文件都会解压出错
          // 所以为了避免错误提示刷屏，就统一用一个提示框来提示
          // 但也不能因为一个文件解压出错就直接中断所有文件的解压
          // 因为 libarchive 就是有可能出现其中几个文件解压不出来的情况
          if (password) return toast.error(t('pwa.alert.password_error'));

          toast.error(
            `「${zipFile.name}」 - 「${file.name}」 ${t(
              'pwa.alert.parse_error',
            )}：${(error as Error).message}`,
            { duration: Infinity },
          );
        }
      }),
    (doneNum, totalNum) =>
      toast.set(tip, {
        schedule: doneNum / totalNum,
        msg: `${tip} —— ${doneNum}/${totalNum}`,
      }),
  );
};
