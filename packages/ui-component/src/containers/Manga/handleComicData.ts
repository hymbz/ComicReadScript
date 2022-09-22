import type { FillEffect } from './hooks/useStore/ImageSlice';

interface HandleComicDataProps {
  comicImgList: ComicImg[];
  fillEffect: FillEffect;
}

const fillPage = (img: ComicImg): ComicImg => ({
  ...img,
  type: 'fill',
});

/**
 * 根据图片比例和填充页设置对漫画图片进行排列
 *
 * @param param param
 */
export const handleComicData = ({
  comicImgList,
  fillEffect,
}: HandleComicDataProps): SlideData => {
  const comicImgInfo: SlideData = [];
  let imgCache: ComicImg | null = null;

  for (let i = 0; i < comicImgList.length; i += 1) {
    const imgInfo = comicImgList[i];

    if (fillEffect.get(i - 1)) {
      // FIXME:理论上应该是不会触发的，一旦触发 imgCache 就会被覆盖，但保险起见还是先写上
      if (imgCache) throw new Error('imgCache 被覆盖');
      imgCache = fillPage(imgInfo);
    }

    if (imgInfo.type !== 'long' && imgInfo.type !== 'wide') {
      if (imgCache) {
        comicImgInfo.push([imgCache, imgInfo]);
        imgCache = null;
      } else {
        imgCache = imgInfo;
      }
    } else {
      if (imgCache) {
        if (imgCache.type !== 'fill')
          comicImgInfo.push([fillPage(imgCache), imgCache]);
        imgCache = null;
      }

      if (fillEffect.get(i) === undefined && imgInfo.loadType !== 'loading')
        fillEffect.set(i, false);

      comicImgInfo.push([imgInfo]);
    }
  }

  if (imgCache && imgCache.type !== 'fill') {
    comicImgInfo.push([imgCache, fillPage(imgCache)]);
    imgCache = null;
  }

  return comicImgInfo;
};
