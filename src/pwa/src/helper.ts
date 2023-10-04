import { testImgUrl } from 'helper';

export const imgExtension = new Set(['.png', '.gif', '.jpeg', '.jpg', '.webp']);

export type ZipExtension = '.zip' | '.rar' | '.7z' | '.cbz' | '.cbr' | '.cb7';
export const zipExtension = new Set<ZipExtension>([
  '.zip',
  '.rar',
  '.7z',
  '.cbz',
  '.cbr',
  '.cb7',
]);

const extensionRe = /\.[^.]+$/;
/** 根据文件名判断文件是否受支持 */
export const isSupportFile = (name: string) => {
  const extension = name.match(extensionRe)?.[0];
  if (!extension) return null;
  if (zipExtension.has(extension as any)) return extension as ZipExtension;
  if (imgExtension.has(extension)) return 'img';
  return null;
};

export const loadScript = (url: string) => {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  document.head.appendChild(script);
};

/** 创建 blob 链接，但是会先测试图片 url 能否正确加载 */
export const createObjectURL = async (obj: Blob | MediaSource) => {
  const url = URL.createObjectURL(obj);
  if (await testImgUrl(url)) return url;
  return null;
};

/** 将 FileSystemHandle 转为 File */
export const FileSystemToFile = (
  list: readonly FileSystemHandle[] | FileSystemHandle[],
) => Promise.all(list.map((file) => (file as FileSystemFileHandle).getFile()));
