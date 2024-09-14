import { type Component, Show, createMemo, For } from 'solid-js';

import { _setState, store } from '../store';
import {
  getImgTip,
  imgShowState,
  isAbreastMode,
  abreastArea,
  handleImgError,
  handleImgLoaded,
} from '../actions';
import classes from '../index.module.css';

export const ComicImg: Component<ComicImg & { index: number }> = (img) => {
  const showState = () => imgShowState().get(img.index);

  const src = () => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    if (store.option.imgRecognition.enabled) return img.blobUrl;
    return img.src;
  };

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

  const _ComicImg: Component<{ cloneIndex?: number }> = (props) => (
    <div
      class={classes.img}
      style={{
        'grid-area': `_${img.index}`,
        'background-color': img.background || 'var(--bg)',
      }}
      id={`_${props.cloneIndex ? `${img.index}-${props.cloneIndex}` : img.index}`}
      data-show={showState()}
      data-type={img.type ?? store.defaultImgType}
      data-load-type={img.loadType === 'loaded' ? undefined : img.loadType}
    >
      {/* 因为 img 无法使用 ::after，所以得用 picture 包一下 */}
      <picture
        style={{ 'aspect-ratio': `${img.size.width} / ${img.size.height}` }}
      >
        <Show when={img.loadType !== 'wait' && src()}>
          <img
            src={src()}
            alt={`${img.index}`}
            onLoad={(e) => handleImgLoaded(img.src, e.currentTarget)}
            onError={(e) => handleImgError(img.src, e.currentTarget)}
            draggable="false"
            // 让浏览器提前解码防止在火狐和 Safari 上的翻页闪烁
            decoding="sync"
            data-src={img.src}
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
