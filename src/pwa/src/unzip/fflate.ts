import {
  type AsyncUnzipOptions,
  type Unzipped,
  unzip as unzipCb,
} from 'fflate';
import { t } from 'helper/i18n';

import { toast } from '../../../components/Toast';
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
      .then((buff) => new Uint8Array(buff));

    const res = await fflateUnzip(fileData, {
      filter: ({ name }) => isSupportFile(name) === 'img',
    });

    return await Promise.all(
      Object.entries(res).map(async ([name, data]) => {
        const url = await createObjectURL(new Blob([data.buffer]));
        if (!url) throw new Error(t('pwa.alert.img_data_error'));
        return { name, url };
      }),
    );
  } catch {
    toast.error(`fflate ${t('pwa.alert.unzip_error')}`);
    return [];
  }
};
