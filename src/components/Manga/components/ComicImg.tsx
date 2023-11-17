import type { Component } from 'solid-js';
import { createMemo, onCleanup } from 'solid-js';

import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import type { State } from '../hooks/useStore';
import { setState, store } from '../hooks/useStore';
import { updateImgType } from '../hooks/useStore/slice';
import { isWideImg } from '../handleComicData';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  fill?: undefined | 'left' | 'right';
}

/** 检查已加载图片中是否**连续**出现了多个指定类型的图片 */
const checkImgTypeCount = (
  state: State,
  fn: (img: ComicImg) => boolean,
  maxNum = 3,
) => {
  let num = 0;
  for (let i = 0; i < state.imgList.length; i++) {
    const img = state.imgList[i];
    if (img.loadType !== 'loaded') continue;
    if (!fn(img)) {
      num = 0;
      continue;
    }
    num += 1;
    if (num >= maxNum) return true;
  }
  return false;
};

/** 图片加载完毕的回调 */
const handleImgLoaded = (i: number, e: HTMLImageElement) => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.loadType === 'error' && e.src !== img.src) return;
    img.loadType = 'loaded';
    img.height = e.naturalHeight;
    img.width = e.naturalWidth;
    updateImgType(state, img);
    state.prop.Loading?.(state.imgList, img);
    // 因为火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
    // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
    e.decode();

    switch (img.type) {
      // 连续出现多张跨页图后，将剩余未加载图片类型设为跨页图
      case 'long':
      case 'wide': {
        if (!state.flag.autoWide || !checkImgTypeCount(state, isWideImg))
          return;
        state.imgList.forEach((comicImg, index) => {
          if (comicImg.loadType === 'wait' && comicImg.type === '')
            state.imgList[index].type = 'wide';
        });
        state.flag.autoWide = false;
        break;
      }

      // 连续出现多张长图后，自动开启卷轴模式
      case 'vertical': {
        if (
          !state.flag.autoScrollMode ||
          !checkImgTypeCount(state, (image) => image.type === 'vertical')
        )
          return;
        state.option.scrollMode = true;
        state.flag.autoScrollMode = false;
        break;
      }
    }
  });
};

/** 图片加载出错的回调 */
const handleImgError = (i: number, e: HTMLImageElement) => {
  // 跳过因为 src 为空导致的错误
  if (e.getAttribute('src') === '') return;
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;

    img.loadType = 'error';
    log.error(t('alert.img_load_failed'), e);

    state.prop.Loading?.(state.imgList, img);
  });
};

/** 漫画图片 */
export const ComicImg: Component<ComicImgProps> = (props) => {
  const img = () => store.imgList[props.index];

  const src = createMemo(() => {
    if (!img() || img().loadType === 'wait') return '';
    if (img().translationType === 'show') return img().translationUrl;
    return img().src;
  });

  return (
    <img
      ref={(ref) => {
        onCleanup(() => store.observer?.unobserve(ref));
        store.observer?.observe(ref);
      }}
      class={classes.img}
      style={{
        '--width': img()?.width ? `min(100%, ${img()?.width}px)` : undefined,
      }}
      src={src()}
      alt={`${props.index + 1}`}
      data-fill={props.index === -1 ? 'page' : props.fill}
      data-type={img()?.type || undefined}
      data-load-type={
        img()?.loadType === 'loaded' ? undefined : img()?.loadType
      }
      onLoad={(e) => handleImgLoaded(props.index, e.currentTarget)}
      onError={(e) => handleImgError(props.index, e.currentTarget)}
    />
  );
};
