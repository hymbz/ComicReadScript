import type { Component } from 'solid-js';
import { Index, createMemo, onMount } from 'solid-js';

import { boolDataVal } from 'helper';
import { setState, store } from '../hooks/useStore';
import {
  bindRef,
  handleMangaFlowDrag,
  handleMangaFlowScroll,
  initPanzoom,
  updateRenderPage,
} from '../hooks/useStore/slice';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import { useDrag } from '../hooks/useDrag';
import { ComicPage } from './ComicPage';

import classes from '../index.module.css';

/**
 * 漫画图片流的容器
 */
export const ComicImgFlow: Component = () => {
  const { hiddenMouse, onMouseMove } = useHiddenMouse();

  const handleTransitionEnd = () => {
    if (store.dragMode) return;
    setState((state) => updateRenderPage(state, true));
  };

  const transform = createMemo<string>(() => {
    if (store.gridMode || store.option.scrollMode) return '';

    const x = `calc(${store.pageOffsetPct}% + ${store.pageOffsetPx}px)`;
    if (store.option.dir === 'rtl') return `translate3d(${x}, 0, 0)`;
    return ` translate3d(calc(${x} * -1), 0, 0)`;
  });

  onMount(() => setState((state) => initPanzoom(state)));

  return (
    <div
      class={classes.mangaFlowBox}
      style={{ overflow: store.option.scrollMode ? 'auto' : 'hidden' }}
      ref={(e) => {
        e.addEventListener('scroll', handleMangaFlowScroll, { passive: true });
        useDrag(e, handleMangaFlowDrag);
      }}
      tabIndex={-1}
      data-hiddenMouse={!store.gridMode && hiddenMouse()}
      on:mousemove={onMouseMove}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        id={classes.mangaFlow}
        ref={bindRef('mangaFlow')}
        class={`${classes.mangaFlow} ${classes.beautifyScrollbar}`}
        data-scrollMode={boolDataVal(
          !store.gridMode && store.option.scrollMode,
        )}
        data-disableZoom={boolDataVal(
          store.option.disableZoom || store.option.scrollMode,
        )}
        data-grid-mode={boolDataVal(store.gridMode)}
        dir={store.option.dir}
        style={{
          transform: transform(),
          'transition-duration': `${store.pageAnimation ? 300 : 0}ms`,
        }}
      >
        <Index each={store.pageList} fallback={<h1>NULL</h1>}>
          {(page, i) => <ComicPage page={page()} index={i} />}
        </Index>
      </div>
    </div>
  );
};
