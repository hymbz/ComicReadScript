import { ReactiveSet } from 'main';
import { getAdPageByFileName, getAdPageByContent } from 'userscript/detectAd';
import { querySelectorAll, useStyle, createRootMemo } from 'helper';

import type { GalleryContext } from './helper';

/** 识别广告 */
export const detectAd = async ({
  store: { comicMap },
  _setState,
  options,
  imgList,
  pageList,
  fileNameList,
}: GalleryContext) => {
  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (!enableDetectAd) return;

  _setState('comicMap', '', 'adList', new ReactiveSet());

  /** 缩略图列表 */
  const thumbnailList: Array<string | HTMLImageElement> = [];
  for (const e of querySelectorAll<HTMLAnchorElement>('#gdt > a')) {
    const index = Number(/.+-(\d+)/.exec(e.href)?.[1]) - 1;
    if (Number.isNaN(index)) continue;
    pageList[index] = e.href;

    const thumbnail = e.querySelector<HTMLElement>('[title]')!;
    fileNameList[index] = thumbnail.title.split(/：|: /)[1];
    thumbnailList[index] =
      thumbnail.tagName === 'IMG'
        ? (thumbnail as HTMLImageElement)
        : /url\("(.+)"\)/.exec(thumbnail.style.backgroundImage)![1];
  }

  (async () => {
    // 先根据文件名判断一次
    await getAdPageByFileName(fileNameList, comicMap[''].adList!);
    // 不行的话再用缩略图识别
    if (comicMap[''].adList!.size === 0)
      await getAdPageByContent(thumbnailList, comicMap[''].adList!);

    // 模糊广告页的缩略图
    useStyle(
      createRootMemo(() => {
        if (!comicMap['']?.adList?.size) return '';
        return [...comicMap[''].adList]
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
  })();

  // 返回在图片加载时检查图片的函数
  return () => {
    getAdPageByFileName(fileNameList, comicMap[''].adList!);
    getAdPageByContent(imgList, comicMap[''].adList!);
  };
};
