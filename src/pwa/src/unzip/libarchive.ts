import { Archive } from 'libarchive.js';

import type { ZipData } from '.';
import type { ImgFile } from '../store';
import { plimit } from '../../../helper';
import { toast } from '../../../components/Toast';
import { createObjectURL, isSupportFile } from '../helper';

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
}: ZipData): Promise<Array<ImgFile | undefined>> => {
  if (!initLibarchive)
    Archive.init({ workerUrl: '/libarchive.js/worker-bundle.js' });

  const archive = await Archive.open(zipFile);

  let password: string | null;
  if (await archive.hasEncryptedData()) {
    // eslint-disable-next-line no-alert
    password = prompt('请输入密码');
    if (!password) return [];
    await archive.usePassword(password);
  }

  const zipImglist = await archive.getFilesArray();

  return plimit(
    zipImglist
      .filter(({ file }) => isSupportFile(file.name) === 'img')
      .map(({ file }) => async () => {
        try {
          const url = await createObjectURL(
            'extract' in file ? await file.extract() : file,
          );
          if (!url) throw new Error('图片数据错误');
          return { name: file.name, url };
        } catch (e) {
          // 如果输入了错误的密码，所有文件都会解压出错
          // 所以为了避免错误提示刷屏，就统一用一个提示框来提示
          // 但也不能因为一个文件解压出错就直接中断所有文件的解压
          // 因为 libarchive 就是有可能出现其中几个文件解压不出来的情况
          if (password) {
            toast.error('解压密码错误');
            return undefined;
          }

          const errorText = `「${zipFile.name}」 - 「${
            file.name
          }」 解压缩时出错：${(e as Error).message}`;
          toast.error(errorText, { duration: Infinity });
          console.error(errorText, e);
          return undefined;
        }
      }),
    (doneNum, totalNum) =>
      toast.set(tip, {
        schedule: doneNum / totalNum,
        msg: `${tip} —— ${doneNum}/${totalNum}`,
      }),
  );
};
