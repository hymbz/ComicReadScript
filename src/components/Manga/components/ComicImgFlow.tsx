import { type Component, Show, createMemo, onMount, Index } from 'solid-js';
import {
  boolDataVal,
  createSequence,
  createEffectOn,
  type UseDrag,
  useDrag,
} from 'helper';

import { useStyleMemo, useStyle } from '../hooks/useStyle';
import { refs, setState, store } from '../store';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
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

import { EmptyTip } from './EmptyTip';
import { ComicImg } from './ComicImg';

export const ComicImgFlow: Component = () => {
  const { hiddenMouse, onMouseMove } = useHiddenMouse();

  const handleDrag: UseDrag = (state, e) => {
    if (store.gridMode) return;
    if (touches.size > 1) return handlePinchZoom(state, e);
    if (store.option.zoom.ratio !== 100) return handleZoomDrag(state, e);
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
      if (store.option.zoom.ratio === 100) resetPage(state, true);
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

  useStyleMemo(`.${classes.mangaBox}`, {
    transform: () =>
      `translate(${store.option.zoom.offset.x}px, ${store.option.zoom.offset.y}px)
        scale(${store.option.zoom.ratio / 100})`,
  });

  const pageX = createMemo(() => {
    if (store.gridMode || isScrollMode()) return 0;
    let x =
      store.page.offset.x.pct * store.rootSize.width + store.page.offset.x.px;
    if (store.option.dir !== 'rtl') x = -x;
    return x;
  });

  useStyleMemo(`#${classes.mangaFlow}`, {
    transform: () =>
      `translate(
        ${pageX()}px,
        ${store.page.offset.y.pct * store.rootSize.height + store.page.offset.y.px}px
      ) translateZ(0)`,
    'touch-action'() {
      if (store.gridMode) return 'auto';
      if (store.option.zoom.ratio !== 100) {
        if (!store.option.scrollMode.enabled) return 'none';
        if (store.option.zoom.offset.y === 0) return 'pan-up';
        if (store.option.zoom.offset.y === bound().y) return 'pan-down';
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
  });

  useStyle(imgAreaStyle);

  return (
    <div
      ref={bindRef('mangaBox')}
      class={`${classes.mangaBox} ${classes.beautifyScrollbar}`}
      data-animation={store.page.anima}
      data-abreast-scroll={boolDataVal(store.option.scrollMode.abreastMode)}
      tabIndex={-1}
    >
      <div
        id={classes.mangaFlow}
        ref={bindRef('mangaFlow')}
        dir={store.option.dir}
        class={`${classes.mangaFlow} ${classes.beautifyScrollbar}`}
        data-disable-zoom={boolDataVal(
          store.option.disableZoom && !store.option.scrollMode.enabled,
        )}
        data-scale-mode={boolDataVal(store.option.zoom.ratio !== 100)}
        data-vertical={boolDataVal(store.page.vertical)}
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
