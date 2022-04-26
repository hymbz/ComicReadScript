/* eslint-disable no-param-reassign */

declare global {
  interface Img {
    type: 'loading' | 'loaded' | 'error';
    element: HTMLImageElement;
    error?: ErrorEvent;
  }

  interface ComicImg {
    type: 'long' | 'wide' | 'vertical' | 'fill' | 'error' | 'loading' | '';
    index: number | '填充';
    src: string;
    imgData: Img;
  }

  // interface FillEffect {
  //   [imgIndex: number]: boolean;
  // }
  type FillEffect = Map<number, boolean>;

  type SlideData = Array<[ComicImg] | [ComicImg, ComicImg]>;
}

interface HandleComicDataProps {
  comicImgList: ComicImg[];
  fillEffect: FillEffect;
}

const fillPage = (img: ComicImg): ComicImg => ({
  ...img,
  type: 'fill',
  index: '填充',
});

export const handleComicData = ({
  comicImgList,
  fillEffect,
}: HandleComicDataProps): SlideData => {
  const comicImgInfo: SlideData = [];
  let imgCache: ComicImg | null = null;

  for (let i = 0; i < comicImgList.length; i += 1) {
    const imgInfo = comicImgList[i];

    if (fillEffect.get(i - 1)) {
      // FIXME:应该不会触发，一旦触发 imgCache 就会被覆盖
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

      if (fillEffect.get(i) === undefined && imgInfo.imgData.type !== 'loading')
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
