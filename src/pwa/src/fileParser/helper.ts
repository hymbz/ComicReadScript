import type { IterableElement } from 'type-fest';

export const imgExtension = new Set([
  '.png',
  '.gif',
  '.jpeg',
  '.jpg',
  '.webp',
  '.jfif',
  '.apng',
] as const);
export type ImgExtension = IterableElement<typeof imgExtension>;
const isimgExtension = (name: string): name is ImgExtension =>
  imgExtension.has(name as ImgExtension);

export const zipExtension = new Set([
  '.zip',
  '.rar',
  '.7z',
  '.cbz',
  '.cbr',
  '.cb7',
] as const);
export type ZipExtension = IterableElement<typeof zipExtension>;
const iszipExtension = (name: string): name is ZipExtension =>
  zipExtension.has(name as ZipExtension);

export const supportExtension = new Set([
  ...imgExtension,
  ...zipExtension,
  '.pdf',
] as const);

/** 根据文件名判断文件是否受支持 */
export const isSupportFile = (name: string) => {
  const extension = /\.[^.]+$/.exec(name)?.[0];
  if (!extension) return null;
  if (extension === '.pdf') return 'pdf';
  if (iszipExtension(extension)) return extension;
  if (isimgExtension(extension)) return 'img';
  return null;
};
