import { type Component, Show, createMemo, onMount, Index } from 'solid-js';
import { boolDataVal, createSequence } from 'helper';
import { createEffectOn, createMemoMap } from 'helper/solidJs';

import { refs, setState, store } from '../store';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import { type UseDrag, useDrag } from '../hooks/useDrag';
import {
  bindRef,
  handleClick,
  resetPage,
  handlePinchZoom,
  handleZoomDrag,
  handleMangaFlowDrag,
  handleScrollModeDrag,
  touches,
  bound,
  imgTopList,
  bindScrollTop,
  scrollTo,
  scrollTop,
  isOnePageMode,
  isAbreastMode,
  isScrollMode,
  abreastColumnWidth,
  abreastArea,
  imgAreaStyle,
} from '../actions';
import classes from '../index.module.css';
import { useStyle, useStyleMemo } from '../hooks/useStyle';

import { EmptyTip } from './EmptyTip';
import { ComicImg } from './ComicImg';

export const ComicImgFlow: Component = () => {
  const { hiddenMouse, onMouseMove } = useHiddenMouse();

  const handleDrag: UseDrag = (state, e) => {
    if (store.gridMode) return;
    if (touches.size > 1) return handlePinchZoom(state, e);
    if (store.zoom.scale !== 100) return handleZoomDrag(state, e);
    if (store.option.scrollMode.enabled) return handleScrollModeDrag(state, e);
    return handleMangaFlowDrag(state, e);
  };

  onMount(() => {
    useDrag({ ref: refs.mangaBox, handleDrag, handleClick, touches });
    bindScrollTop(refs.mangaBox);
  });

  const handleTransitionEnd = () => {
    if (store.isDragMode) return;
    setState((state) => {
      if (store.zoom.scale === 100) resetPage(state, true);
      else state.page.anima = '';
    });
  };

  /** 在当前页之前有图片被加载出来，导致内容高度发生变化后，重新滚动页面，确保当前显示位置不变 */
  createEffectOn(
    [
      () => store.showRange[0],
      () => imgTopList()[store.showRange[0]],
      imgTopList,
    ],
    ([showImg, height, topList], prev) => {
      if (!prev || !height || !isScrollMode()) return;
      const [prevShowImg, prevHeight, prevTopList] = prev;
      if (
        showImg !== prevShowImg ||
        prevTopList === topList ||
        prevHeight === height
      )
        return;
      scrollTo(scrollTop() + height - prevHeight);
      // 目前还是会有轻微偏移，但考虑到大部分情况下都是顺序阅读，本身出现概率就低，就不继续排查优化了
    },
  );

  const pageToText = (page: [number] | [number, number]) =>
    `${(page.length === 1 ? [page[0], page[0]] : page)
      .map((i) => (i === -1 ? '.' : `_${i}`))
      .join(' ')}`;

  const gridAreas = createMemo(() => {
    if (store.pageList.length === 0) return undefined;

    if (store.gridMode) {
      let columnNum: number;
      if (store.isMobile) columnNum = 2;
      else if (store.defaultImgType === 'vertical') columnNum = 6;
      else if (isOnePageMode()) columnNum = 4;
      else columnNum = 2;

      const areaList: string[][] = [[]];
      for (const page of store.pageList) {
        if (areaList.at(-1)!.length === columnNum) areaList.push([]);
        areaList.at(-1)!.push(pageToText(page));
      }
      while (areaList.at(-1)!.length !== columnNum)
        areaList.at(-1)!.push('. .');
      return (
        areaList.map((line) => `"${line.join(' ')}"`).join('\n') || undefined
      );
    }

    if (store.option.scrollMode.enabled) {
      if (!store.option.scrollMode.abreastMode)
        return createSequence(store.imgList.length)
          .map((i) => `"_${i}"`)
          .join('\n');
      return `"${createSequence(abreastArea().columns.length)
        .map((i) => `_${i}`)
        .join(' ')}"`;
    }

    return store.page.vertical
      ? store.pageList
          .slice(store.renderRange[0], store.renderRange[1] + 1)
          .map((page) => `"${pageToText(page)}"`)
          .join('\n')
      : `"${store.pageList
          .slice(store.renderRange[0], store.renderRange[1] + 1)
          .map(pageToText)
          .join(' ')}"`;
  });

  const transform = createMemoMap({
    x() {
      if (store.gridMode || isScrollMode()) return 0;
      let x =
        store.page.offset.x.pct * store.rootSize.width + store.page.offset.x.px;
      if (store.option.dir !== 'rtl') x = -x;
      return x + store.zoom.offset.x;
    },
    y: () =>
      store.page.offset.y.pct * store.rootSize.height +
      store.page.offset.y.px +
      store.zoom.offset.y,
    scale: () => store.zoom.scale / 100,
  });

  useStyleMemo(`#${classes.mangaFlow}`, {
    transform:
      () => `translate(${transform().x}px, ${transform().y}px) scale(${transform().scale})
    translateZ(0)`,
    'touch-action'() {
      if (store.gridMode) return 'auto';
      if (store.zoom.scale !== 100) {
        if (!store.option.scrollMode.enabled) return 'none';
        if (store.zoom.offset.y === 0) return 'pan-up';
        if (store.zoom.offset.y === bound.y()) return 'pan-down';
      }

      if (store.option.scrollMode.enabled)
        return store.option.scrollMode.abreastMode ? 'pan-x' : 'pan-y';
    },
    'grid-template-areas': gridAreas,
    'grid-template-columns'() {
      if (store.imgList.length === 0 || store.gridMode) return undefined;
      if (isAbreastMode())
        return `repeat(${abreastArea().columns.length}, ${abreastColumnWidth()}px)`;
      if (isScrollMode()) return undefined;
      if (store.page.vertical) return '50% 50%';
      return `repeat(${gridAreas()?.split(' ').length ?? 0}, 50%)`;
    },
    'grid-template-rows'() {
      if (!isScrollMode() || store.gridMode) return undefined;
      return store.imgList
        .map(({ size: { height } }) => `${height}px`)
        .join(' ');
    },
    '--abreastScrollWidth': () =>
      abreastColumnWidth() ? `${abreastColumnWidth()}px` : undefined,
  });

  useStyle(imgAreaStyle);

  return (
    <div
      ref={bindRef('mangaBox')}
      class={`${classes.mangaBox} ${classes.beautifyScrollbar}`}
      data-abreast-scroll={boolDataVal(store.option.scrollMode.abreastMode)}
      tabIndex={-1}
    >
      <div
        id={classes.mangaFlow}
        ref={bindRef('mangaFlow')}
        dir={store.option.dir}
        class={`${classes.mangaFlow} ${classes.beautifyScrollbar}`}
        data-disable-zoom={boolDataVal(
          store.option.disableZoom ||
            (!store.gridMode && store.option.scrollMode.enabled),
        )}
        data-scale-mode={boolDataVal(store.zoom.scale !== 100)}
        data-vertical={boolDataVal(store.page.vertical)}
        data-animation={store.page.anima}
        data-hidden-mouse={!store.gridMode && hiddenMouse()}
        data-fit-width={boolDataVal(store.option.scrollMode.fitToWidth)}
        on:mousemove={onMouseMove}
        onTransitionEnd={handleTransitionEnd}
        tabIndex={-1}
      >
        <Show when={store.imgList.length === 0} children={<EmptyTip />} />
        <Index each={store.imgList}>
          {(img, i) => <ComicImg index={i} {...img()} />}
        </Index>
      </div>
    </div>
  );
};
