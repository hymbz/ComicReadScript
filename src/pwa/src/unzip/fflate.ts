import type { AsyncUnzipOptions, Unzipped } from 'fflate';
import { unzip as unzipCb } from 'fflate';

import type { ZipData } from '.';
import { toast } from '../../../components/Toast';
import { createObjectURL, isSupportFile } from '../helper';

const fflateUnzip = (data: Uint8Array, opts: AsyncUnzipOptions) =>
  new Promise<Unzipped>((resolve, reject) => {
    unzipCb(data, opts, (err, res) => (err ? reject(err) : resolve(res)));
  });

/** 解压缩 zip，速度超快 */
export const fflate = async ({ zipFile, extension }: ZipData) => {
  if (extension !== '.zip' && extension !== '.cbz') return [];

  try {
    const fileData = await zipFile
      .arrayBuffer()
      .then((buff) => new Uint8Array(buff));

    const res = await fflateUnzip(fileData, {
      filter: ({ name }) => isSupportFile(name) === 'img',
    });

    return Promise.all(
      Object.entries(res).map(async ([name, data]) => {
        const url = await createObjectURL(new Blob([data.buffer]));
        if (!url) throw new Error('图片数据错误');
        return { name, url };
      }),
    );
  } catch (e) {
    const errorText = `fflate 解压出错`;
    toast.error(errorText);
    console.error(errorText, e);
    return [];
  }
};
