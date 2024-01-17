import type { Component, JSX } from 'solid-js';
import { For, Show, createMemo, onMount } from 'solid-js';
import { boolDataVal } from 'helper';
import { refs, setState, store } from '../store';
import { createEffectOn, createMemoMap } from '../helper';
import {
  bindRef,
  handleClick,
  resetPage,
  handlePinchZoom,
  handleZoomDrag,
  handleMangaFlowDrag,
  touches,
  initIntersectionObserver,
  bound,
  imgTopList,
  contentHeight,
  renderRange,
  bindScrollTop,
  scrollTo,
  scrollTop,
} from '../actions';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import type { UseDrag } from '../hooks/useDrag';
import { useDrag } from '../hooks/useDrag';
import { ComicPage } from './ComicPage';

import classes from '../index.module.css';

export const ComicImgFlow: Component = () => {
  const { hiddenMouse, onMouseMove } = useHiddenMouse();

  const handleDrag: UseDrag = (state, e) => {
    if (store.gridMode) return;
    if (touches.size > 1) return handlePinchZoom(state, e);
    if (store.zoom.scale !== 100) return handleZoomDrag(state, e);
    if (!store.option.scrollMode) return handleMangaFlowDrag(state, e);
  };

  onMount(() => {
    useDrag({ ref: refs.mangaBox, handleDrag, handleClick, touches });
    bindScrollTop(refs.mangaBox);
    initIntersectionObserver(refs.mangaBox);
  });

  const handleTransitionEnd = () => {
    if (store.isDragMode) return;
    setState((state) => {
      if (store.zoom.scale === 100) resetPage(state, true);
      else state.page.anima = '';
    });
  };

  /** 卷轴模式下当前显示页之前未渲染页的总高度 */
  const scrollModeFill = createMemo(
    () => imgTopList()[renderRange.start()] ?? 0,
  );

  /** 在当前页之前有图片被加载出来，导致内容高度发生变化后，重新滚动页面，确保当前显示位置不变 */
  createEffectOn([scrollModeFill, imgTopList], ([height, topList], prev) => {
    if (!prev || !height) return;
    const [prevHeight, prevTopList] = prev;
    if (prevTopList === topList || prevHeight === height) return;
    scrollTo(scrollTop() + height - prevHeight);
    // 目前还是会有轻微偏移，但考虑到大部分情况下都是顺序阅读，本身出现概率就低，就不继续排查优化了
  });

  const style = createMemoMap<JSX.CSSProperties>({
    '--scale': () => store.zoom.scale / 100,
    '--zoom-x': () => `${store.zoom.offset.x || 0}px`,
    '--zoom-y': () => `${store.zoom.offset.y || 0}px`,
    '--page-x': () => {
      if (store.option.scrollMode) return '0px';
      const x = `calc(${store.page.offset.x.pct}% + ${store.page.offset.x.px}px)`;
      return store.option.dir === 'rtl' ? x : `calc(${x} * -1)`;
    },
    '--page-y': () =>
      `calc(${store.page.offset.y.pct}% + ${store.page.offset.y.px}px)`,
    'touch-action': () => {
      if (store.gridMode) return 'auto';
      if (store.zoom.scale !== 100) {
        if (!store.option.scrollMode) return 'none';
        if (store.zoom.offset.y === 0) return 'pan-up';
        if (store.zoom.offset.y === bound.y()) return 'pan-down';
      }
      if (store.option.scrollMode) return 'pan-y';
    },
    height: () =>
      !store.gridMode && store.option.scrollMode
        ? `${contentHeight()}px`
        : undefined,
  });

  return (
    <div
      ref={bindRef('mangaBox')}
      class={`${classes.mangaBox} ${classes.beautifyScrollbar}`}
    >
      <div
        id={classes.mangaFlow}
        ref={bindRef('mangaFlow')}
        dir={store.option.dir}
        class={`${classes.mangaFlow} ${classes.beautifyScrollbar}`}
        data-disable-zoom={boolDataVal(
          store.option.disableZoom ||
            (!store.gridMode && store.option.scrollMode),
        )}
        data-scale-mode={boolDataVal(store.zoom.scale !== 100)}
        data-vertical={boolDataVal(store.page.vertical)}
        data-animation={store.page.anima}
        data-hidden-mouse={!store.gridMode && hiddenMouse()}
        on:mousemove={onMouseMove}
        onTransitionEnd={handleTransitionEnd}
        style={style()}
        tabIndex={-1}
      >
        <Show when={store.option.scrollMode}>
          <span style={{ height: `${scrollModeFill()}px`, 'flex-shrink': 0 }} />
        </Show>
        <For each={store.pageList} fallback={<h1>NULL</h1>}>
          {(page, i) => <ComicPage page={page} index={i()} />}
        </For>
      </div>
    </div>
  );
};
