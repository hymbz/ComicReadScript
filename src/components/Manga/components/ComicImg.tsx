import type { Component } from 'solid-js';
import { createMemo } from 'solid-js';

import type { State } from '../hooks/useStore';
import { setState, store } from '../hooks/useStore';
import { activePage, updateImgType } from '../hooks/useStore/slice';
import { isWideImg } from '../handleComicData';

import classes from '../index.module.css';

export interface ComicImgProps {
  index: number;
  img: ComicImg;
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
    state.onLoading?.(img, state.imgList);

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
