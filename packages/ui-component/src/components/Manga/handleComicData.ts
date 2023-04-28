import type { FillEffect } from './hooks/useStore/ImageState';

interface HandleComicDataProps {
  comicImgList: ComicImg[];
  fillEffect: FillEffect;
}

/**
 * 根据图片比例和填充页设置对漫画图片进行排列
 */
export const handleComicData = ({
  comicImgList,
  fillEffect,
}: HandleComicDataProps): PageList => {
  const pageList: PageList = [];
  let imgCache: number | null = null;

  for (let i = 0; i < comicImgList.length; i += 1) {
    const img = comicImgList[i];

    if (fillEffect.get(i - 1)) {
      if (imgCache !== null) throw new Error('imgCache 被覆盖');
      imgCache = -1;
    }

    if (img.type !== 'long' && img.type !== 'wide') {
      if (imgCache !== null) {
        pageList.push([imgCache, i]);
        imgCache = null;
      } else {
        imgCache = i;
      }
    } else {
      if (imgCache !== null) {
        if (imgCache !== -1) pageList.push([-1, imgCache]);
        imgCache = null;
      }

      if (fillEffect.get(i) === undefined && img.loadType !== 'loading')
        fillEffect.set(i, false);

      pageList.push([i]);
    }
  }

  if (imgCache !== null && imgCache !== -1) {
    pageList.push([imgCache, -1]);
    imgCache = null;
  }

  return pageList;
};
