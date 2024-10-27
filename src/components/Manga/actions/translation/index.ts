import { type Accessor } from 'solid-js';
import { t, singleThreaded, createRootMemo } from 'helper';

import { store, setState, _setState } from '../../store';
import { activeImgIndex, activePage, imgList } from '../memo';
import { getImg } from '../helper';

import { createOptions, setMessage } from './helper';
import { selfhostedOptions, selfhostedTranslation } from './selfhosted';
import { cotransTranslation, cotransTranslators } from './cotrans';

declare const toast: typeof import('components/Toast/toast').toast | undefined;

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
      return _setState('imgMap', url, 'translationType', 'show');

    if (img.loadType !== 'loaded')
      return setMessage(url, t('translation.tip.img_not_fully_loaded'));

    const translationUrl = await (
      store.option.translation.server === 'cotrans'
        ? cotransTranslation
        : selfhostedTranslation
    )(url);

    _setState('imgMap', url, {
      translationUrl,
      translationMessage: t('translation.tip.translation_completed'),
      translationType: 'show',
    });
  } catch (error) {
    _setState('imgMap', url, 'translationType', 'error');
    if ((error as Error)?.message)
      _setState('imgMap', url, 'translationMessage', (error as Error).message);
  }
};

/** 逐个翻译状态为等待翻译的图片 */
const translationAll = singleThreaded(async (): Promise<void> => {
  for (const img of Object.values(store.imgMap)) {
    if (img.loadType !== 'loaded' || img.translationType !== 'wait') continue;
    await translationImage(img.src);
  }
});

/** 开启或关闭指定图片的翻译 */
export const setImgTranslationEnbale = (list: number[], enbale: boolean) => {
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

/** 当前显示的图片是否正在翻译 */
export const isTranslatingImage = createRootMemo(() =>
  activePage().some((i) => {
    const img = getImg(i);
    return img?.translationType && img.translationType !== 'hide';
  }),
);

/** 翻译当前页 */
export const translateCurrent = () =>
  setImgTranslationEnbale(activePage(), !isTranslatingImage());

export const createTranslateRange = (
  start: Accessor<number>,
  end: Accessor<number>,
) => {
  const isTranslating = createRootMemo(() => {
    for (let i = start(); i < end(); i++)
      if (imgList()[i]?.translationType === undefined) return false;
    return true;
  });
  const translateRange = () => {
    if (store.option.translation.server !== 'selfhosted') return;
    setImgTranslationEnbale(
      Array.from({ length: end() - start() }, (_, i) => start() + i),
      !isTranslating(),
    );
  };
  return [isTranslating, translateRange] as const;
};

// 翻译全部图片
export const [isTranslatingAll, translateAll] = createTranslateRange(
  () => 0,
  () => store.imgList.length,
);

// 翻译当前页以后的全部图片
export const [isTranslatingToEnd, translateToEnd] = createTranslateRange(
  activeImgIndex,
  () => store.imgList.length,
);
