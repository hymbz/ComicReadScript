import { createRoot, createEffect, on, createSignal } from 'solid-js';
import { setState, store } from '../..';
import { updateTipText } from '../Scrollbar';
import { setMessage } from './helper';
import { getValidTranslators, selfhostedTranslation } from './selfhosted';
import { cotransTranslation, cotransTranslators } from './cotrans';

/** 翻译指定图片 */
export const translationImage = async (i: number) => {
  try {
    if (!window.crsLib) throw new Error('未安装 ComicRead 插件');

    const img = store.imgList[i];
    if (!img?.src) return;

    if (img.translationType !== 'wait') return;

    if (img.translationUrl)
      return setState((state) => {
        state.imgList[i].translationType = 'show';
      });

    if (img.loadType !== 'loaded') return setMessage(i, '图片未加载完毕');

    const translationUrl = await (store.option.translation.server === 'cotrans'
      ? cotransTranslation
      : selfhostedTranslation)(i);

    setState((state) => {
      state.imgList[i].translationUrl = translationUrl;
      state.imgList[i].translationMessage = '翻译完成';
      state.imgList[i].translationType = 'show';
    });
  } catch (error) {
    setState((state) => {
      state.imgList[i].translationType = 'error';
      if ((error as Error).message)
        state.imgList[i].translationMessage = (error as Error).message;
    });
  } finally {
    updateTipText();
  }
};

let running = false;

/** 逐个翻译状态为等待翻译的图片 */
const translationAll = async (): Promise<void> => {
  if (running) return;

  const i = store.imgList.findIndex(
    (img) => img.loadType === 'loaded' && img.translationType === 'wait',
  );
  if (i === -1) return;

  running = true;
  try {
    await translationImage(i);
  } finally {
    running = false;
  }
  return translationAll();
};

/** 开启或关闭指定图片的翻译 */
export const setImgTranslationEnbale = (list: number[], enbale: boolean) => {
  setState((state) => {
    list.forEach((i) => {
      const img = state.imgList[i];
      if (!img) return;

      if (enbale) {
        if (state.option.translation.forceRetry) {
          img.translationType = 'wait';
          img.translationUrl = undefined;
          setMessage(i, '等待翻译');
        } else {
          switch (img.translationType) {
            case 'hide': {
              img.translationType = 'show';
              break;
            }
            case 'error':
            case undefined: {
              img.translationType = 'wait';
              setMessage(i, '等待翻译');
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
    });
  });

  return translationAll();
};

export const translatorOptions = createRoot(() => {
  const [options, setOptions] = createSignal<([string, string] | [string])[]>(
    [],
  );

  const updateOptions = async () => {
    setOptions(
      store.option.translation.server === '本地部署'
        ? (await getValidTranslators()) ?? []
        : cotransTranslators,
    );
  };
  updateOptions();

  // 在切换翻译服务器的同时切换可用翻译的选项列表
  createEffect(
    on(
      () => store.option.translation.server,
      async (server) => {
        if (server === '禁用') return;
        await updateOptions();
        // 如果切换服务器后原先选择的翻译服务失效了，就换成谷歌翻译
        if (
          !options().some(
            ([val]) => val === store.option.translation.options.translator,
          )
        ) {
          setState((state) => {
            state.option.translation.options.translator = 'google';
          });
        }
      },
      { defer: true },
    ),
  );

  return options;
});
