import { fileTypeFromBuffer } from 'file-type';

import { plimit, t, wait } from 'helper';

import type { ZipData } from '.';
import type { ImgFile } from '../store';

import { toast } from '../../../components/Toast';
import { createObjectURL, isSupportFile, loadScript } from '../helper';

loadScript('/libunrar/rpc.js');

declare const RPC: any;

type FileEntry = {
  type: 'file';
  fullFileName: string;
  fileContent: Uint8Array;
  fileSize: number;
};

type DirEntry = {
  type: 'dir';
  ls: Record<string, FileEntry | DirEntry>;
};

declare type LibunrarRPC = {
  transferables: ArrayBuffer[];

  unrar: (
    data: { name: string; content: ArrayBuffer }[],
    password?: string,
  ) => Promise<DirEntry>;
};

let rpc: LibunrarRPC;

const findImgFile = async (
  entry: FileEntry | DirEntry,
  tip: string,
  path: string[] = [],
): Promise<(ImgFile | undefined)[]> => {
  if (entry.type === 'file') {
    if (isSupportFile(entry.fullFileName) !== 'img') return [undefined];

    const filtType = await fileTypeFromBuffer(entry.fileContent);
    const url = await createObjectURL(
      new Blob([entry.fileContent as BlobPart], {
        type: filtType?.mime || 'image/jpeg',
      }),
    );
    if (!url) throw new Error(t('pwa.alert.img_data_error'));
    return [{ name: path.join('-'), src: url }];
  }

  const list = await plimit(
    Object.entries(entry.ls).map(
      ([name, itemEntry]) =>
        () =>
          findImgFile(itemEntry, tip, [...path, name]),
    ),
    (doneNum, totalNum) =>
      toast.set(tip, {
        schedule: doneNum / totalNum,
        msg: `${tip} —— ${doneNum}/${totalNum}`,
      }),
  );

  return list.flat();
};

export const libunrar = async (
  zipData: ZipData,
  password?: string,
): Promise<(ImgFile | undefined)[]> => {
  const { zipFile, tip, extension } = zipData;
  if (extension !== '.rar' && extension !== '.cbr') return [];
  if (!rpc) {
    await wait(() => Reflect.has(window, 'RPC'));
    rpc = await RPC.new('./libunrar/worker.js');
  }

  const data = await zipFile.arrayBuffer();
  rpc.transferables = [data];
  const unzipData = [{ name: zipFile.name, content: data }];

  try {
    const ret = await rpc.unrar(unzipData, password);
    return await findImgFile(ret, tip);
  } catch (error) {
    switch (error) {
      case 'Password was not provided for encrypted file header':
      case 'Missing password':
      case 'Bad password': {
        if (password) {
          toast.error(t('pwa.alert.unzip_password_error'), {
            throw: new Error(error as string),
          });
        }

        // eslint-disable-next-line no-alert
        const newPassword = prompt(t('pwa.message.enter_password'));
        if (!newPassword) return [];
        return libunrar(zipData, newPassword);
      }

      default: {
        const e = error as Error | string;
        throw new Error(typeof e === 'object' ? e.message : e);
      }
    }
  }
};
