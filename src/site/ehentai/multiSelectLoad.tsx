import {
  css,
  descRange,
  extractRange,
  inRange,
  log,
  querySelectorAll,
  range,
  singleThreaded,
  t,
} from 'helper';

import { useMultiSelectLoad } from '../../userscript/multiSelect';
import { detectAd } from './detectAd';
import { type GalleryHandler } from './helper';
import {
  checkMpvKey,
  checkShowkey,
  ensureImgPageUrl,
  getImgUrl,
} from './helper/api';

export const multiSelectLoad: GalleryHandler<
  Promise<{
    handleClick: (e: MouseEvent) => Promise<void>;
  }>
> = async (coreCtx, pageCtx) => {
  const { setState, showComic } = coreCtx;

  css`
    #gdt > a [title] {
      position: relative;
    }
  `;

  const checkAd = detectAd(coreCtx, pageCtx);

  // 在加载到最后十页时，再使用图片内容来检查广告页
  setState('manga', {
    onLoading: (_, img) => {
      if (!img) return;
      const index = pageCtx.imgList.indexOf(img.src);
      const { length } = pageCtx.imgList;
      if (inRange(length - 10, index, length)) void checkAd?.checkContent();
    },
  });

  const ensureSetup = singleThreaded(async () => {
    await ensureImgPageUrl(pageCtx, 0);
    void checkAd?.checkFileName();

    try {
      await checkMpvKey(pageCtx);
      await checkShowkey(pageCtx, pageCtx.pageList[0]);
    } catch (error) {
      log.warn('checkKey failed', error);
    }
  });

  const ms = await useMultiSelectLoad(coreCtx, {
    id: pageCtx.galleryId,
    allItemIds: () => range(pageCtx.imgNum).map(String),
    getImgList: async (id) => {
      await ensureSetup();
      const i = Number(id);
      await ensureImgPageUrl(pageCtx, i);
      pageCtx.imgList[i] ||= await getImgUrl(pageCtx, i);
      return [{ src: pageCtx.imgList[i], name: pageCtx.fileNameList[i] }];
    },
  });

  await ms.registerItems(pageCtx.galleryId, (map) => {
    for (const dom of querySelectorAll<HTMLAnchorElement>('#gdt a')) {
      const imgIndex = Number(/(?<=-)\d+(?:\?|$)/u.exec(dom.href)?.[0]) - 1;
      if (!Number.isNaN(imgIndex))
        map.set(dom.querySelector('[title]')!, String(imgIndex));
    }
  });

  return {
    handleClick: async (e: MouseEvent) => {
      if (!e.shiftKey) return;
      e.stopPropagation();

      const defaultText = coreCtx.multiSelect
        ? descRange(
            coreCtx.multiSelect.selectedIds().map(Number),
            pageCtx.imgNum,
          )
        : '';

      const pageRange = prompt(t('other.page_range'), defaultText);
      if (!pageRange) return;

      coreCtx.multiSelect?.setSelectedIds(
        [...extractRange(pageRange, pageCtx.imgNum)].map(String),
      );

      // 删掉当前的图片列表以便触发重新加载
      setState('comicMap', '', 'imgList', undefined);
      await showComic('');
    },
  };
};
