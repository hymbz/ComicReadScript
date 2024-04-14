import {
  type Component,
  type JSX,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
} from 'solid-js';
import { inRange } from 'helper';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { createMemoMap } from 'helper/solidJs';

import { setState, store } from '../store';
import {
  activePage,
  getImgTip,
  imgPageMap,
  imgShowState,
  placeholderSize,
  renderImgRange,
  showImgList,
  updateImgLoadType,
  updateImgSize,
} from '../actions';
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
export const ComicImg: Component<ComicImg & { index: number }> = (img) => {
  let ref: HTMLImageElement;

  onMount(() => store.observer?.observe(ref));
  onCleanup(() => {
    store.observer?.unobserve(ref);
    showImgList.delete(ref);
  });

  const show = createMemo(
    () =>
      store.gridMode ||
      inRange(renderImgRange().start, img.index, renderImgRange().end),
  );

  const src = createMemo(() => {
    if (img.loadType === 'wait') return '';
    if (img.translationType === 'show') return img.translationUrl;
    return img.src;
  });

  const size = createMemo(() => (img?.width ? img : placeholderSize()));

  const style = createMemoMap<JSX.CSSProperties>({
    'grid-area': () => `_${img.index}`,
    '--width': () => `${size().width}px`,
    'aspect-ratio': () => `${size().width} / ${size().height}`,
    'box-shadow'() {
      if (!store.gridMode || !activePage().includes(img.index))
        return undefined;

      const page = store.pageList[imgPageMap()[img.index]].filter(
        (i) => i !== -1,
      );
      const showState = page.length === 1 ? 2 : imgShowState()[img.index];
      if (showState === 2) return '0 0 1em 0.5em var(--text-secondary)';
      return `${showState ? -1 : 1}em 0 1em -0.5em var(--text-secondary)`;
    },
  });

  createEffect(() => {
    if (!src() || img.loadType !== 'loaded') return;
    // 火狐浏览器在图片进入视口前，即使已经加载完了也不会对图片进行解码
    // 所以需要手动调用 decode 提前解码，防止在翻页时闪烁
    ref.decode();
  });

  return (
    <picture
      class={classes.img}
      style={style()}
      data-show={show() ? imgShowState()[img.index] ?? '' : undefined}
      data-type={img?.type || undefined}
      data-load-type={img?.loadType === 'loaded' ? undefined : img?.loadType}
    >
      <img
        ref={ref!}
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
    </picture>
  );
};
