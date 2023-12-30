import type { Component, JSX } from 'solid-js';
import { createMemo, onCleanup, onMount } from 'solid-js';

import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { setState, store } from '../store';
import { placeholderSize, updateImgLoadType, updateImgSize } from '../actions';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  fill?: undefined | 'left' | 'right';
}

/** 图片加载完毕的回调 */
const handleImgLoaded = (i: number, e: HTMLImageElement) => {
  if (!e.getAttribute('src')) return;
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    if (img.loadType === 'error' && e.src !== img.src) return;
    if (img.width !== e.naturalWidth || img.height !== e.naturalHeight)
      updateImgSize(i, e.naturalWidth, e.naturalHeight);
    img.loadType = 'loaded';
    updateImgLoadType(state);
    state.prop.Loading?.(state.imgList, img);

    // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
    // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
    e.decode();
  });
};

const errorNumMap = new Map<string, number>();

/** 图片加载出错的回调 */
const handleImgError = (i: number, e: HTMLImageElement) => {
  if (!e.getAttribute('src')) return;
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;
    const errorNum = errorNumMap.get(img.src) ?? 0;
    // 首次失败自动重试一次
    img.loadType = errorNum === 0 ? 'loading' : 'error';
    errorNumMap.set(img.src, errorNum + 1);
    updateImgLoadType(state);
    if (e) log.error(t('alert.img_load_failed'), e);
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

  const img = createMemo(() => store.imgList[props.index]);

  const src = createMemo(() => {
    if (!img() || img().loadType === 'wait') return '';
    if (img().translationType === 'show') return img().translationUrl;
    return img().src;
  });

  const style = createMemo<JSX.CSSProperties | undefined>(() => {
    if (!store.option.scrollMode) return undefined;
    const size = img()?.width ? img() : placeholderSize();
    return {
      '--width': `${size.width}px`,
      'aspect-ratio': `${size.width} / ${size.height}`,
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
