import type { Accessor } from 'solid-js';

import { toast } from 'components/Toast';
import { createRootMemo, range, singleThreaded, t } from 'helper';

import { setState, store } from '../../store';
import { activeImgIndex, activePage, imgList } from '../memo';
import { cotransTranslation, cotransTranslators } from './cotrans';
import { createOptions, setMessage } from './helper';
import { selfhostedOptions, selfhostedTranslation } from './selfhosted';

/** 翻译指定图片 */
export const translationImage = async (url: string) => {
  try {
    if (typeof GM_xmlhttpRequest === 'undefined') {
      toast?.error(t('pwa.alert.userscript_not_installed'));
      throw new Error(t('pwa.alert.userscript_not_installed'));
    }

    if (!url) return;
    const img = store.imgMap[url];

    if (img.translationType !== 'wait') return;

    if (img.translationUrl)
      return setState('imgMap', url, 'translationType', 'show');

    if (img.loadType !== 'loaded')
      return setMessage(url, t('translation.tip.img_not_fully_loaded'));

    const translationUrl = await (
      store.option.translation.server === 'cotrans'
        ? cotransTranslation
        : selfhostedTranslation
    )(url);

    setState('imgMap', url, {
      translationUrl,
      translationMessage: t('translation.tip.translation_completed'),
      translationType: 'show',
    });
  } catch (error) {
    setState('imgMap', url, 'translationType', 'error');
    if ((error as Error)?.message)
      setState('imgMap', url, 'translationMessage', (error as Error).message);
  }
};

/** 逐个翻译状态为等待翻译的图片 */
export const translationAll = singleThreaded(async (state): Promise<void> => {
  const targetImg = imgList().find(
    (img) => img.translationType === 'wait' && img.loadType === 'loaded',
  );
  if (!targetImg) return;
  await translationImage(targetImg.src);
  state.continueRun();
});

/** 开启或关闭指定图片的翻译 */
export const setImgTranslationEnbale = (
  list: Iterable<number>,
  enbale: boolean,
) => {
  if (store.option.translation.server === 'disable' && enbale) return;

  setState((state) => {
    for (const i of list) {
      const img = state.imgMap[state.imgList[i]];
      if (!img) continue;
      const url = img.src;

      if (enbale) {
        if (state.option.translation.forceRetry) {
          img.translationType = 'wait';
          img.translationUrl = undefined;
          setMessage(url, t('translation.tip.wait_translation'));
        } else {
          switch (img.translationType) {
            case 'hide': {
              img.translationType = 'show';
              break;
            }

            case 'error':
            case undefined: {
              img.translationType = 'wait';
              setMessage(url, t('translation.tip.wait_translation'));
              break;
            }
          }
        }
      } else {
        switch (img.translationType) {
          case 'show': {
            img.translationType = 'hide';
            break;
          }

          case 'error':
          case 'wait': {
            img.translationType = undefined;
            break;
          }
        }
      }
    }
  });

  return translationAll();
};

export const translatorOptions = createRootMemo(() =>
  store.option.translation.server === 'selfhosted'
    ? selfhostedOptions()
    : createOptions(cotransTranslators),
);

/** 翻译范围的图片 */
export const translationImgs = createRootMemo(() => {
  const list = new Set<number>();
  for (const [i, img] of imgList().entries()) {
    switch (img.translationType) {
      case 'error':
      case 'show':
      case 'wait':
        list.add(i);
    }
  }
  return list;
});

/** 当前显示的图片是否正在翻译 */
export const isTranslatingImage = createRootMemo(() =>
  activePage().some((i) => translationImgs().has(i)),
);

/** 翻译当前页 */
export const translateCurrent = () =>
  setImgTranslationEnbale(activePage(), !isTranslatingImage());

const createTranslateRange = (imgs: Accessor<number[]>) => {
  const isTranslating = createRootMemo(() =>
    imgs().every((i) => translationImgs().has(i)),
  );
  const translateRange = () => {
    if (store.option.translation.server !== 'selfhosted') return;
    setImgTranslationEnbale(imgs(), !isTranslating());
  };
  return [isTranslating, translateRange] as const;
};

// 翻译全部图片
export const [isTranslatingAll, translateAll] = createTranslateRange(
  createRootMemo(() => range(store.imgList.length)),
);

// 翻译当前页以后的全部图片
export const [isTranslatingToEnd, translateToEnd] = createTranslateRange(
  createRootMemo(() => range(activeImgIndex(), store.imgList.length)),
);
