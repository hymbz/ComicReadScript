import { type Component, type JSX, Show, createMemo, For } from 'solid-js';
import { createMemoMap } from 'helper/solidJs';

import { store } from '../store';
import {
  getImgTip,
  imgShowState,
  isAbreastMode,
  abreastArea,
  placeholderSize,
  defaultImgType,
  handleImgError,
  handleImgLoaded,
} from '../actions';
import classes from '../index.module.css';

export const ComicImg: Component<ComicImg & { index: number }> = (img) => {
  const showState = () => imgShowState().get(img.index);

  const src = () => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    return img.src;
  };

  const style = createMemoMap<JSX.CSSProperties>({
    'aspect-ratio': () =>
      `${img.width ?? placeholderSize().width} / ${img.height ?? placeholderSize().height}`,
    'grid-area': () => (isAbreastMode() ? undefined : `_${img.index}`),
    '--width': () =>
      store.option.scrollMode.enabled ? `${img.size.width}px` : undefined,
  });

  /** 并排卷轴模式下需要复制的图片数量 */
  const cloneNum = createMemo(() => {
    if (!isAbreastMode()) return 0;

    const imgPosition = abreastArea().position[img.index];
    if (!imgPosition) return 0;
    return imgPosition.length - 1;
  });

  /** 是否要渲染复制图片 */
  const renderClone = () =>
    !store.gridMode && showState() !== undefined && cloneNum() > 0;

  const rednerImg = (cloneIndex?: number) => {
    if (!src()) return false;
    if (img.loadType === 'loaded') return true;
    if (cloneIndex !== undefined) return false;
    return img.loadType !== 'wait';
  };

  const _ComicImg: Component<{ cloneIndex?: number }> = (props) => (
    <picture
      class={classes.img}
      style={style()}
      id={`_${props.cloneIndex ? `${img.index}-${props.cloneIndex}` : img.index}`}
      data-show={showState()}
      data-type={img.type ?? defaultImgType()}
      data-load-type={img.loadType === 'loaded' ? undefined : img.loadType}
    >
      <Show when={rednerImg()}>
        <img
          src={src()}
          alt={`${img.index}`}
          onLoad={(e) => handleImgLoaded(img.index, e.currentTarget)}
          onError={(e) => handleImgError(img.index, e.currentTarget)}
          draggable="false"
          // 让浏览器提前解码防止在火狐和 Safari 上的翻页闪烁
          decoding="sync"
        />
      </Show>
      <Show when={store.gridMode}>
        <div
          class={classes.gridModeTip}
          children={store.gridMode ? getImgTip(img.index) : ''}
        />
      </Show>
    </picture>
  );

  return (
    <>
      <_ComicImg />
      <Show when={renderClone}>
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
