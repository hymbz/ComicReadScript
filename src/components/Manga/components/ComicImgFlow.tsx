import type { Component } from 'solid-js';
import { Index, createMemo, onCleanup, onMount } from 'solid-js';

import { boolDataVal } from 'helper';
import { refs, setState, store } from '../store';
import {
  bindRef,
  handleClick,
  updateRenderPage,
  handlePinchZoom,
  handleZoomDrag,
  handleMangaFlowDrag,
  touches,
  handleObserver,
  updateDrag,
  bound,
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
    useDrag({ ref: refs.mangaFlow, handleDrag, handleClick, touches });
    setState((state) => {
      state.observer = new IntersectionObserver(handleObserver, {
        root: refs.mangaFlow,
        threshold: 0.01,
      });
    });
    onCleanup(() => {
      setState((state) => {
        state.observer?.disconnect();
        state.observer = null;
      });
    });
  });

  const handleTransitionEnd = () => {
    if (store.isDragMode) return;
    setState((state) => {
      if (store.zoom.scale === 100) updateRenderPage(state, true);
      else state.page.anima = '';
    });
  };

  const pageXY = createMemo(() => {
    const x = `calc(${store.page.offset.x.pct}% + ${store.page.offset.x.px}px)`;
    return {
      '--page-x': store.option.dir === 'rtl' ? x : `calc(${x} * -1)`,
      '--page-y': `calc(${store.page.offset.y.pct}% + ${store.page.offset.y.px}px)`,
    };
  });

  const zoom = createMemo(() => ({
    '--scale': store.zoom.scale / 100,
    '--zoom-x': `${store.zoom.offset.x || 0}px`,
    '--zoom-y': `${store.zoom.offset.y || 0}px`,
  }));

  const touchAction = createMemo(() => {
    if (store.gridMode) return 'auto';
    if (store.zoom.scale !== 100) {
      if (store.option.scrollMode) {
        if (store.zoom.offset.y === 0) return 'pan-up';
        if (store.zoom.offset.y === bound.y()) return 'pan-down';
      }
      return 'none';
    }
    if (store.option.scrollMode) return 'pan-y';
  });

  return (
    <div
      id={classes.mangaFlow}
      ref={bindRef('mangaFlow')}
      dir={store.option.dir}
      class={`${classes.mangaFlow} ${classes.beautifyScrollbar}`}
      data-disable-zoom={boolDataVal(
        store.option.disableZoom || store.option.scrollMode,
      )}
      data-grid-mode={boolDataVal(store.gridMode)}
      data-scale-mode={boolDataVal(store.zoom.scale !== 100)}
      data-vertical={boolDataVal(store.page.vertical)}
      data-animation={store.page.anima}
      data-hidden-mouse={!store.gridMode && hiddenMouse()}
      on:mousemove={onMouseMove}
      onTransitionEnd={handleTransitionEnd}
      onScroll={() => setState(updateDrag)}
      style={{ 'touch-action': touchAction(), ...zoom(), ...pageXY() }}
      tabIndex={-1}
    >
      <Index each={store.pageList} fallback={<h1>NULL</h1>}>
        {(page, i) => <ComicPage page={page()} index={i} />}
      </Index>
    </div>
  );
};
