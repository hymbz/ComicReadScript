import type { Component, JSX } from 'solid-js';
import { createMemo, onCleanup, onMount } from 'solid-js';

import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { setState, store } from '../store';
import { updateImgLoadType } from '../actions';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  fill?: undefined | 'left' | 'right';
}

/** 图片加载完毕的回调 */
const handleImgLoaded = (i: number, e: HTMLImageElement) => {
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.loadType === 'error' && e.src !== img.src) return;
    img.loadType = 'loaded';
    updateImgLoadType(state);
    state.prop.Loading?.(state.imgList, img);

    // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
    // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
    e.decode();
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
    updateImgLoadType(state);
    log.error(t('alert.img_load_failed'), e);
    state.prop.Loading?.(state.imgList, img);
  });
};

/** 漫画图片 */
export const ComicImg: Component<ComicImgProps> = (props) => {
  let ref: HTMLImageElement;

  onMount(() => {
    store.observer?.observe(ref);

    onCleanup(() => {
      store.observer?.unobserve(ref);
      setState((state) => {
        state.memo.showImgList = state.memo.showImgList.filter(
          (img) => img !== ref,
        );
      });
    });
  });

  const img = () => store.imgList[props.index];

  const src = createMemo(() => {
    if (!img() || img().loadType === 'wait') return '';
    if (img().translationType === 'show') return img().translationUrl;
    return img().src;
  });

  const style = createMemo<JSX.CSSProperties | undefined>(() => {
    if (!store.option.scrollMode) return undefined;
    return {
      '--width': `${img().width}px`,
      'aspect-ratio': `${img().width} / ${img().height}`,
    };
  });

  return (
    <img
      ref={ref!}
      class={classes.img}
      style={style()}
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
