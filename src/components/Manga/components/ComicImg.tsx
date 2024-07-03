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

/** 漫画图片 */
export const ComicImg: Component<ComicImg & { index: number }> = (img) => {
  const show = () => imgShowState().get(img.index);

  const src = createMemo(() => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    return img.src;
  });

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
    !store.gridMode && show() !== undefined && cloneNum() > 0;

  const _ComicImg: Component<{ cloneIndex?: number }> = (props) => (
    <picture
      class={classes.img}
      style={style()}
      id={`_${props.cloneIndex ? `${img.index}-${props.cloneIndex}` : img.index}`}
      data-show={show()}
      data-type={img.type ?? defaultImgType()}
      data-load-type={img.loadType === 'loaded' ? undefined : img.loadType}
    >
      <Show when={props.cloneIndex === undefined || img.loadType === 'loaded'}>
        <img
          src={src()}
          alt={`${img.index}`}
          onLoad={(e) => handleImgLoaded(img.index, e.currentTarget)}
          onError={(e) => handleImgError(img.index, e.currentTarget)}
          draggable="false"
        />
        <Show when={store.gridMode}>
          <div
            class={classes.gridModeTip}
            children={store.gridMode ? getImgTip(img.index) : ''}
          />
        </Show>
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
