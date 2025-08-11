import type { Component } from 'solid-js';

import { createMemo, For, Show } from 'solid-js';

import type { ComicImg as _ComicImg } from '../store/image';

import {
  abreastArea,
  getImgTip,
  handleImgError,
  handleImgLoaded,
  imgShowState,
  isAbreastMode,
  isEnableBg,
} from '../actions';
import { useStyleMemo } from '../hooks/useStyle';
import classes from '../index.module.css';
import { store } from '../store';

export const ComicImg: Component<_ComicImg & { index: number }> = (img) => {
  const showState = () => imgShowState().get(img.index);

  const src = () => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    if (store.option.imgRecognition.enabled) {
      if (store.option.imgRecognition.upscale && img.upscaleUrl)
        return img.upscaleUrl;
      return img.blobUrl;
    }
    // 有些浏览器不支持显示带有 hash 标识的图片 url
    if (img.src.startsWith('blob:')) return img.src.replace(/#\..+/, '');
    return img.src;
  };

  /** 并排卷轴模式下需要复制的图片数量 */
  const cloneNum = createMemo(() => {
    if (!isAbreastMode()) return 0;
    const imgPosition = abreastArea().position[img.index];
    return imgPosition ? imgPosition.length - 1 : 0;
  });

  /** 是否要渲染复制图片 */
  const renderClone = () =>
    !store.gridMode && showState() !== undefined && cloneNum() > 0;

  const selector = `.${classes.img}[id^="_${img.index}_"]`;
  useStyleMemo(selector, {
    'grid-area': () =>
      isAbreastMode() && !store.gridMode ? 'none' : `_${img.index}`,
    'background-color': () => (isEnableBg() ? img.background : undefined),
  });
  useStyleMemo(`${selector} > picture`, {
    'aspect-ratio': () => `${img.size.width} / ${img.size.height}`,
    background: () =>
      img.progress &&
      `linear-gradient(
          to bottom,
          var(--secondary-bg) ${img.progress}%,
          var(--hover-bg-color,#fff3) ${img.progress}%
        )`,
  });

  const _ComicImg: Component<{ cloneIndex?: number }> = (props) => (
    <div
      class={classes.img}
      id={`_${img.index}_${props.cloneIndex ?? 0}`}
      data-show={showState()}
      data-type={img.type ?? store.defaultImgType}
      data-load-type={img.loadType === 'loaded' ? undefined : img.loadType}
    >
      {/* 因为 img 无法使用 ::after，所以得用 picture 包一下 */}
      <picture>
        <Show when={img.loadType !== 'wait' && src()}>
          <img
            src={src()}
            alt={`${img.index}`}
            data-src={img.src}
            onLoad={(e) => handleImgLoaded(img.src, e.currentTarget)}
            onError={(e) => handleImgError(img.src, e.currentTarget)}
            draggable="false"
            // 让浏览器提前解码防止在火狐和 Safari 上的翻页闪烁
            decoding="sync"
          />
        </Show>
      </picture>
      <Show when={store.gridMode}>
        <div
          class={classes.gridModeTip}
          children={store.gridMode ? getImgTip(img.index) : ''}
        />
      </Show>
    </div>
  );

  return (
    <>
      <_ComicImg />
      <Show when={renderClone()}>
        <For each={Array.from({ length: cloneNum() })}>
          {(_, i) => <_ComicImg cloneIndex={i() + 1} />}
        </For>
      </Show>
    </>
  );
};

// 目前即使是不显示的图片也必须挂载上，否则解析好的图片会被浏览器垃圾回收掉，
// 导致在 ehentai 上无法正常加载图片。但这样会在图片过多时造成性能问题，
// 虽然也尝试了将解析好的 Image 对象存储起来挂上引用和另外放到一个避免渲染的 dom 下，
// 但也都失败了，只能暂时先不管了。
// 之后尝试新方案时必须经过如下测试：开个几百页的漫画加载完毕后，再打开二十个标签页切换过去，
// 等待一分钟再切回来，等待一小时后再切回来
