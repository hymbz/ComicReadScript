import type { Component, JSX } from 'solid-js';
import { For, Show, createMemo, onMount } from 'solid-js';
import { boolDataVal } from 'helper';
import { createEffectOn, createMemoMap } from 'helper/solidJs';
import { ComicImg } from './ComicImg';
import { EmptyTip } from './EmptyTip';
import { refs, setState, store } from '../store';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import type { UseDrag } from '../hooks/useDrag';
import { useDrag } from '../hooks/useDrag';
import {
  bindRef,
  handleClick,
  resetPage,
  handlePinchZoom,
  handleZoomDrag,
  handleMangaFlowDrag,
  handleScrollModeDrag,
  touches,
  initIntersectionObserver,
  bound,
  imgTopList,
  contentHeight,
  renderRange,
  bindScrollTop,
  scrollTo,
  scrollTop,
  isOnePageMode,
  rootSize,
} from '../actions';

import classes from '../index.module.css';

export const ComicImgFlow: Component = () => {
  const { hiddenMouse, onMouseMove } = useHiddenMouse();

  const handleDrag: UseDrag = (state, e) => {
    if (store.gridMode) return;
    if (touches.size > 1) return handlePinchZoom(state, e);
    if (store.zoom.scale !== 100) return handleZoomDrag(state, e);
    if (store.option.scrollMode) return handleScrollModeDrag(state, e);
    return handleMangaFlowDrag(state, e);
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

  const pageToText = (page: [number] | [number, number]) =>
    `${(page.length !== 1 ? page : [page[0], page[0]])
      .map((i) => (i === -1 ? '.' : `_${i}`))
      .join(' ')}`;
  const gridAreas = createMemo(() => {
    if (store.gridMode) {
      const columnNum = isOnePageMode() ? 5 : 3;
      const areaList: string[][] = [[]];
      store.pageList.forEach((page) => {
        if (areaList.at(-1)!.length === columnNum) areaList.push([]);
        areaList.at(-1)!.push(pageToText(page));
      });
      while (areaList.at(-1)!.length !== columnNum)
        areaList.at(-1)!.push('. .');
      return areaList.map((line) => `"${line.join(' ')}"`).join('\n');
    }

    if (store.option.scrollMode) return '';

    return store.page.vertical
      ? store.pageList
          .slice(renderRange.start(), renderRange.end() + 1)
          .map((page) => `"${pageToText(page)}"`)
          .join('\n')
      : `"${store.pageList
          .slice(renderRange.start(), renderRange.end() + 1)
          .map(pageToText)
          .join(' ')}"`;
  });

  const style = createMemoMap<JSX.CSSProperties>({
    '--scale': () => store.zoom.scale / 100,
    '--zoom-x': () => `${store.zoom.offset.x}px`,
    '--zoom-y': () => `${store.zoom.offset.y}px`,
    '--page-x': () => {
      if (store.option.scrollMode) return '0px';
      const x = `${store.page.offset.x.pct * rootSize().width + store.page.offset.x.px}px`;
      return store.option.dir === 'rtl' ? x : `calc(${x} * -1)`;
    },
    '--page-y': () =>
      `${store.page.offset.y.pct * rootSize().height + store.page.offset.y.px}px`,
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
    'grid-template-areas': gridAreas,
    'grid-template-columns': () => {
      if (!store.imgList.length) return undefined;
      if (store.gridMode) return `repeat(${isOnePageMode() ? 10 : 6}, 1fr)`;
      if (store.page.vertical) return isOnePageMode() ? '100%' : '50% 50%';
      return `repeat(${gridAreas().split(' ').length}, 50%)`;
    },
  });

  return (
    <div
      ref={bindRef('mangaBox')}
      class={`${classes.mangaBox} ${classes.beautifyScrollbar}`}
      tabIndex={-1}
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
      >
        <Show when={store.option.scrollMode}>
          <span style={{ height: `${scrollModeFill()}px`, 'flex-shrink': 0 }} />
        </Show>
        <For each={store.imgList} fallback={<EmptyTip />}>
          {(img, i) => <ComicImg index={i()} {...img} />}
        </For>
      </div>
    </div>
  );
};
