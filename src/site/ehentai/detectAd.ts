import {
  ReactiveSet,
  createRootMemo,
  css,
  isImageElement,
  once,
  querySelectorAll,
} from 'helper';
import { downloadImg } from 'request';
import { getAdPageByContent, getAdPageByFileName } from 'userscript/detectAd';

import { type GalleryHandler } from './helper';

// 多个缩略图会共用一个雪碧图，所以得缓存一下
const imageBitmapCache = new Map<string, ImageBitmap>();

const loadImageBitmap = async (url: string): Promise<ImageBitmap> => {
  if (imageBitmapCache.has(url)) return imageBitmapCache.get(url)!;
  const imageBitmap = await createImageBitmap(await downloadImg(url));
  imageBitmapCache.set(url, imageBitmap);
  return imageBitmap;
};

/** 从雪碧图中切割指定区域的图片 */
const extractSpriteImage = async (style: CSSStyleDeclaration) => {
  const {
    width,
    height,
    backgroundImage,
    backgroundPositionX: backgroundX,
    backgroundPositionY: backgroundY,
  } = style;

  const urlMatch = /url\(['"]([^)]+)['"]\)/.exec(backgroundImage);
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

type DetectAdReturn = {
  checkFileName: () => Promise<Set<number>>;
  checkContent: () => Promise<Set<number>>;
};

/** 识别广告 */
export const detectAd: GalleryHandler<DetectAdReturn | undefined> = (
  { store, setState, options },
  { imgList, pageList, fileNameList },
) => {
  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (!enableDetectAd) return;

  setState('comicMap', '', 'adList', new ReactiveSet());

  /** 缩略图列表 */
  const thumbnailList: (ImageBitmap | HTMLImageElement)[] = [];
  (async () => {
    for (const e of querySelectorAll<HTMLAnchorElement>('#gdt > a')) {
      const index = Number(/.+-(\d+)/.exec(e.href)?.[1]) - 1;
      if (Number.isNaN(index)) continue;
      pageList[index] = e.href;

      const thumbnail = e.querySelector<HTMLElement>('[title]')!;
      [, fileNameList[index]] = thumbnail.title.split(/：|: /);
      if (isImageElement(thumbnail)) thumbnailList[index] = thumbnail;
      if (thumbnail.style.background.includes('url('))
        thumbnailList[index] = await extractSpriteImage(thumbnail.style);
    }

    // 先根据文件名判断一次
    await getAdPageByFileName(fileNameList, store.comicMap[''].adList!);
    // 不行的话再用缩略图识别
    if (store.comicMap[''].adList!.size === 0)
      await getAdPageByContent(thumbnailList, store.comicMap[''].adList!);
  })();

  // 模糊广告页的缩略图
  css(
    createRootMemo(() => {
      if (!store.comicMap['']?.adList?.size) return '';
      return [...store.comicMap[''].adList]
        .map(
          (i) => `a[href="${pageList[i]}"] [title]:not(:hover) {
              filter: blur(8px);
              clip-path: border-box;
              backdrop-filter: blur(8px);
            }`,
        )
        .join('\n');
    }),
  );

  return {
    checkFileName: once(() =>
      getAdPageByFileName(fileNameList, store.comicMap[''].adList!),
    ),
    checkContent: once(() =>
      getAdPageByContent(imgList, store.comicMap[''].adList!),
    ),
  };
};
