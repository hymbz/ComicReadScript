import type { Component } from 'solid-js';
import { createMemo } from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { updateImgType } from '../hooks/useStore/slice';

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
    img.loadType = 'error';
    console.error('图片加载失败', e);

    state.onLoading?.(img, state.imgList);
  });
};

/** 漫画图片 */
export const ComicImg: Component<ComicImgProps> = (props) => {
  let imgRef: HTMLImageElement;

  const type = createMemo(() => {
    // 卷轴模式下全部显示
    if (store.option.scrollMode) return { show: '' };

    const activePage = store.pageList[store.activePageIndex];
    if (!activePage?.includes(props.index)) return { show: undefined };
    return {
      show: '',
      fill: ((): undefined | 'left' | 'right' => {
        const i = activePage.indexOf(-1);
        if (i === -1) return undefined;
        return !!i === (store.option.dir === 'rtl') ? 'left' : 'right';
      })(),
    };
  });

  return (
    <img
      ref={imgRef!}
      class={classes.img}
      src={props.img.loadType === 'wait' ? '' : props.img.src}
      alt={`${props.index}`}
      data-show={type().show}
      data-fill={type().fill}
      data-type={props.img.type}
      data-load-type={props.img.loadType}
      onLoad={(e) => handleImgLoaded(props.index, e.currentTarget)}
      onError={(e) => handleImgError(props.index, e.currentTarget)}
    />
  );
};
