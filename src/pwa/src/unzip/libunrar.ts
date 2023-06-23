import type { ZipData } from '.';
import type { ImgFile } from '../store';
import { toast } from '../../../components/Toast';
import { plimit } from '../../../helper';
import { createObjectURL, isSupportFile, loadScript } from '../helper';

loadScript('/libunrar/rpc.js');

interface FileEntry {
  type: 'file';
  fullFileName: string;
  fileContent: Uint8Array;
  fileSize: number;
}

interface DirEntry {
  type: 'dir';
  ls: Record<string, FileEntry | DirEntry>;
}

declare interface LibunrarRPC {
  transferables: ArrayBuffer[];

  unrar: (
    data: Array<{ name: string; content: ArrayBuffer }>,
    password?: string,
  ) => Promise<DirEntry>;
}

let rpc: LibunrarRPC;

/** 等待 RPC 对象被加载出来 */
export const waitRPC = () =>
  new Promise<void>((resolve) => {
    if (Reflect.has(window, 'RPC')) {
      resolve();
      return;
    }
    const id = window.setInterval(() => {
      if (!Reflect.has(window, 'RPC')) return;
      window.clearInterval(id);
      resolve();
    }, 100);
  });

const findImgFile = async (
  entry: FileEntry | DirEntry,
  tip: string,
  path: string[] = [],
): Promise<Array<ImgFile | undefined>> => {
  if (entry.type === 'file') {
    if (isSupportFile(entry.fullFileName) !== 'img') return [undefined];

    const url = await createObjectURL(new Blob([entry.fileContent]));
    if (!url) throw new Error('图片数据错误');
    return [{ name: path.join('-'), url }];
  }

  const list = await plimit(
    Object.entries(entry.ls).map(
      ([name, itemEntry]) =>
        async () =>
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
): Promise<Array<ImgFile | undefined>> => {
  const { zipFile, tip, extension } = zipData;
  if (extension !== '.rar') return [];
  if (!rpc) {
    await waitRPC();
    rpc = await RPC.new('./libunrar/worker.js');
  }

  const data = await zipFile.arrayBuffer();
  rpc.transferables = [data];
  const unzipData = [{ name: zipFile.name, content: data }];

  try {
    const ret = await rpc.unrar(unzipData, password);
    return findImgFile(ret, tip);
  } catch (error) {
    switch (error) {
      case 'Password was not provided for encrypted file header':
      case 'Missing password':
      case 'Bad password': {
        if (password) {
          toast.error('解压密码错误');
          throw new Error(error as string);
        }
        // eslint-disable-next-line no-alert
        const newPassword = prompt('请输入密码');
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
