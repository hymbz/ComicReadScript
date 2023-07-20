import type { Component } from 'solid-js';
import { createMemo } from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { activePage, updateImgType } from '../hooks/useStore/slice';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  img: ComicImg;
}

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

    state.onLoading?.(img, state.imgList);
  });
};

/** 图片加载出错的回调 */
const handleImgError = (i: number, e: HTMLImageElement) => {
  // 跳过因为 src 为空导致的错误
  if (e.getAttribute('src') === '') return;
  setState((state) => {
    const img = state.imgList[i];
    if (!img) return;

    // 第一次加载出错自动重试一次
    if (img.loadType !== 'error') {
      const src = e.getAttribute('src');
      e.setAttribute('src', '');
      setTimeout(() => e.setAttribute('src', src!), 500);
    }

    img.loadType = 'error';
    console.error('图片加载失败', e);

    state.onLoading?.(img, state.imgList);
  });
};

/** 漫画图片 */
export const ComicImg: Component<ComicImgProps> = (props) => {
  const show = createMemo(
    () => store.option.scrollMode || activePage().includes(props.index),
  );

  const fill = createMemo(() => {
    if (!show() || props.img.loadType === 'error') return;

    // 判断一下当前是否显示了错误图片
    const activePageType = activePage().map((i) => store.imgList[i]?.loadType);
    const errorIndex = activePageType.indexOf('error');
    if (errorIndex !== -1)
      return !!errorIndex === (store.option.dir === 'rtl') ? 'left' : 'right';

    // 最后判断是否有填充页
    const fillIndex = activePage().indexOf(-1);
    if (fillIndex !== -1)
      return !!fillIndex === (store.option.dir === 'rtl') ? 'left' : 'right';
  });

  const src = createMemo(() => {
    if (props.img.loadType === 'wait') return '';
    if (props.img.translationType === 'show') return props.img.translationUrl;
    return props.img.src;
  });

  return (
    <img
      class={classes.img}
      style={{
        '--width':
          store.option.scrollMode && props.img.width
            ? `${props.img.width}px`
            : undefined,
      }}
      src={src()}
      alt={`${props.index + 1}`}
      data-show={show() ? '' : undefined}
      data-fill={fill()}
      data-type={props.img.type || undefined}
      data-load-type={
        props.img.loadType === 'loaded' ? undefined : props.img.loadType
      }
      onLoad={(e) => handleImgLoaded(props.index, e.currentTarget)}
      onError={(e) => handleImgError(props.index, e.currentTarget)}
    />
  );
};
