import { downloadImg } from '../request';

export const imageBitmapCache = new Map<string, ImageBitmap>();

/** 下载图片并转换为ImageBitmap */
const loadImageBitmap = async (url: string): Promise<ImageBitmap> => {
  // 如果缓存中已有，直接返回
  if (imageBitmapCache.has(url)) return imageBitmapCache.get(url)!;

  const blob = await downloadImg(url);
  const imageBitmap = await createImageBitmap(blob);
  imageBitmapCache.set(url, imageBitmap);
  return imageBitmap;
};

/** 从雪碧图中切割指定区域的图片 */
export const extractSpriteImage = async (style: CSSStyleDeclaration) => {
  const {
    width,
    height,
    backgroundImage,
    backgroundPositionX: backgroundX,
    backgroundPositionY: backgroundY,
  } = style;

  const urlMatch = backgroundImage.match(/url\(['"]([^)]+)['"]\)/);
  if (!urlMatch) throw new Error('解析不到背景图片URL');
  const [, url] = urlMatch;

  const spriteImage = await loadImageBitmap(url);

  const w = parseFloat(width);
  const h = parseFloat(height);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  const sourceX = -parseFloat(backgroundX);
  const sourceY = -parseFloat(backgroundY);

  ctx.drawImage(spriteImage, sourceX, sourceY, w, h, 0, 0, w, h);

  return canvas.transferToImageBitmap();
};
