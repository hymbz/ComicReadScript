import {
  type AsyncUnzipOptions,
  type Unzipped,
  unzip as unzipCb,
} from 'fflate';
import { fileTypeFromBuffer } from 'file-type';
import { toast } from 'components/Toast';
import { t } from 'helper';

import { createObjectURL, isSupportFile } from '../helper';

import { type ZipData } from '.';

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
      // eslint-disable-next-line promise/prefer-await-to-then
      .then((buff) => new Uint8Array(buff));

    const res = await fflateUnzip(fileData, {
      filter: ({ name }) => isSupportFile(name) === 'img',
    });

    return await Promise.all(
      Object.entries(res).map(async ([name, data]) => {
        const filtType = await fileTypeFromBuffer(data.buffer as ArrayBuffer);
        const url = await createObjectURL(
          new Blob([data.buffer as ArrayBuffer], {
            type: filtType?.mime || 'image/jpeg',
          }),
        );
        if (!url) throw new Error(t('pwa.alert.img_data_error'));
        return { name, url };
      }),
    );
  } catch {
    toast.error(`fflate ${t('pwa.alert.unzip_error')}`);
    return [];
  }
};
