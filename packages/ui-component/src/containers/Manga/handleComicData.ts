import type { FillEffect } from './hooks/useStore/ImageSlice';

interface HandleComicDataProps {
  comicImgList: ComicImg[];
  fillEffect: FillEffect;
}

/**
 * 根据图片比例和填充页设置对漫画图片进行排列
 *
 * @param param param
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
      // FIXME: 按理来说应该是不会触发的，一般也确实不会触发，一旦触发 imgCache 就会被覆盖
      // 但确实有过在不知怎么操作后触发了的情况，所以在找到稳定复现的方法并解决前姑且先留着报错
      if (imgCache !== null) throw new Error('imgCache 被覆盖');
      imgCache = -1;
    }

    if (img.type !== 'long' && img.type !== 'wide') {
      if (imgCache !== null) {
        pageList.push([imgCache, img.index]);
        imgCache = null;
      } else {
        imgCache = img.index;
      }
    } else {
      if (imgCache !== null) {
        if (imgCache !== -1) pageList.push([-1, imgCache]);
        imgCache = null;
      }

      if (fillEffect.get(i) === undefined && img.loadType !== 'loading')
        fillEffect.set(i, false);

      pageList.push([img.index]);
    }
  }

  if (imgCache !== null && imgCache !== -1) {
    pageList.push([imgCache, -1]);
    imgCache = null;
  }

  return pageList;
};
