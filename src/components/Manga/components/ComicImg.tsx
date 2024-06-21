import {
  type Component,
  type JSX,
  Show,
  createEffect,
  createMemo,
  onCleanup,
  onMount,
  For,
} from 'solid-js';
import { inRange, singleThreaded, wait } from 'helper';
import { t } from 'helper/i18n';
import { log } from 'helper/logger';
import { createEffectOn, createMemoMap } from 'helper/solidJs';

import { setState, store } from '../store';
import {
  activePage,
  getImgTip,
  imgPageMap,
  imgShowState,
  isAbreastMode,
  renderImgRange,
  showImgList,
  updateImgLoadType,
  updateImgSize,
  abreastArea,
  getImgType,
  placeholderSize,
} from '../actions';
import classes from '../index.module.css';

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

    if (store.flag.autoScrollMode) img.type = 'vertical';
    else if (store.flag.autoWide) img.type = 'wide';
    else if (store.flag.autoLong) img.type = 'long';
    else getImgType(placeholderSize());

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

  const style = createMemoMap<JSX.CSSProperties>({
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

  // 加载期间尽快获取图片尺寸
  createEffectOn(
    () => src(),
    singleThreaded(async () => {
      if (img.width || img.height) return;
      // eslint-disable-next-line solid/reactivity
      await wait(() => !src() || ref.naturalWidth || ref.naturalHeight);
      if (!(ref.naturalWidth || ref.naturalHeight)) return;
      updateImgSize(img.index, ref.naturalWidth, ref.naturalHeight);
    }),
  );

  const cloneNum = createMemo(() => {
    if (!isAbreastMode()) return 0;

    const imgPosition = abreastArea().position[img.index];
    if (!imgPosition) return 0;
    return imgPosition.length - 1;
  });

  const _ComicImg: Component<{ cloneIndex?: number }> = (props) => (
    <picture
      class={classes.img}
      style={style()}
      data-index={
        props.cloneIndex ? `${img.index}-${props.cloneIndex}` : img.index
      }
      data-show={show() ? imgShowState()[img.index] ?? '' : undefined}
      data-type={img?.type || undefined}
      data-load-type={img?.loadType === 'loaded' ? undefined : img?.loadType}
    >
      <Show when={props.cloneIndex === undefined || img.loadType === 'loaded'}>
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
      </Show>
    </picture>
  );

  return (
    <>
      <_ComicImg />
      <Show when={!store.gridMode && show() && cloneNum() > 0}>
        <For each={Array.from({ length: cloneNum() })}>
          {(_, i) => <_ComicImg cloneIndex={i() + 1} />}
        </For>
      </Show>
    </>
  );
};
