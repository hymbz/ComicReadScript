import { on } from 'solid-js';
import {
  lang,
  t,
  singleThreaded,
  createEffectOn,
  createEqualsSignal,
  createRootMemo,
} from 'helper';

import { store, setState, _setState } from '../../store';
import { setOption } from '../helper';

import { createOptions, setMessage } from './helper';
import { getValidTranslators, selfhostedTranslation } from './selfhosted';
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

const [selfhostedOptions, setSelfOptions] = createEqualsSignal<
  Array<[string, string]>
>([]);

// 在切换翻译服务器的同时切换可用翻译的选项列表
createEffectOn(
  [
    () => store.option.translation.server,
    () => store.option.translation.localUrl,
  ],
  async () => {
    if (store.option.translation.server !== 'selfhosted') return;

    setSelfOptions((await getValidTranslators()) ?? []);

    // 如果切换服务器后原先选择的翻译服务失效了，就换成谷歌翻译
    if (
      !selfhostedOptions().some(
        ([val]) => val === store.option.translation.options.translator,
      )
    ) {
      setOption((draftOption) => {
        draftOption.translation.options.translator = 'google';
      });
    }
  },
);

export const translatorOptions = createRootMemo(
  on([selfhostedOptions, lang, () => store.option.translation.server], () =>
    store.option.translation.server === 'selfhosted'
      ? selfhostedOptions()
      : createOptions(cotransTranslators),
  ),
);
