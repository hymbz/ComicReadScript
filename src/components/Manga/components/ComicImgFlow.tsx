import type { Component } from 'solid-js';

import { createMemo, Index, onMount } from 'solid-js';

import type { UseDrag } from 'helper';

import { boolDataVal, createEffectOn, range, useDrag } from 'helper';

import {
  abreastArea,
  abreastColumnWidth,
  activeImgIndex,
  bindRef,
  bindScrollTop,
  bound,
  doubleScrollLineHeight,
  focus,
  getImg,
  handleClick,
  handleMangaFlowDrag,
  handlePinchZoom,
  handleScrollModeDrag,
  handleZoomDrag,
  imgAreaStyle,
  imgList,
  imgTopList,
  isDoubleMode,
  isEnableBg,
  isOnePageMode,
  isScrollMode,
  resetPage,
  scrollTo,
  scrollTop,
  touches,
} from '../actions';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import { useStyle, useStyleMemo } from '../hooks/useStyle';
import classes from '../index.module.css';
import { refs, setState, store } from '../store';
import { ComicImg } from './ComicImg';
import { EmptyTip } from './EmptyTip';

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
      if (store.option.zoom.ratio === 100) resetPage(state, false);
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
      if (store.option.scrollMode.abreastMode)
        return `"${range(abreastArea().columns.length, (i) => `_${i}`).join(
          ' ',
        )}"`;
      if (store.option.scrollMode.doubleMode)
        return store.pageList.map((page) => `"${pageToText(page)}"`).join('\n');
      return range(store.imgList.length, (i) => `"_${i}"`).join('\n');
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
    // 不能使用 transform 来移动，不然在 Safari 浏览器上悬浮显示时
    // 每次滚动底下的网页时 mangaFlow 都会闪烁一下，在简易模式下会频繁触发
    left: () => `${pageX()}px`,
    top: () =>
      `${store.page.offset.y.pct * store.rootSize.height + store.page.offset.y.px}px`,

    'touch-action': function () {
      if (store.gridMode) return 'auto';
      if (store.option.zoom.ratio !== 100) {
        if (!store.option.scrollMode.enabled) return 'none';
        if (store.option.zoom.offset.y === 0) return 'pan-up';
        if (store.option.zoom.offset.y === bound().y) return 'pan-down';
      }
    },
    'grid-template-areas': gridAreas,
    'grid-template-columns': function () {
      if (store.imgList.length === 0 || store.gridMode) return undefined;
      if (store.option.scrollMode.enabled) {
        if (store.option.scrollMode.abreastMode)
          return `repeat(${abreastArea().columns.length}, ${abreastColumnWidth()}px)`;
        if (store.option.scrollMode.doubleMode) return `50% 50%`;
        return undefined;
      }
      if (store.page.vertical) return '50% 50%';
      return `repeat(${gridAreas()?.split(' ').length ?? 0}, 50%)`;
    },
    'grid-template-rows': function () {
      if (store.gridMode) return undefined;
      if (isDoubleMode())
        return doubleScrollLineHeight()
          .map((num) => `${num}px`)
          .join(' ');
      if (isScrollMode())
        return imgList()
          .map(({ size: { height } }) => `${height}px`)
          .join(' ');
    },
    'background-color': () =>
      isEnableBg() ? getImg(activeImgIndex())?.background : undefined,
  });

  useStyle(imgAreaStyle);

  return (
    <div
      ref={bindRef('mangaBox')}
      class={`${classes.mangaBox} ${classes.beautifyScrollbar}`}
      data-animation={store.page.anima}
      data-abreast-scroll={boolDataVal(store.option.scrollMode.abreastMode)}
      onTransitionEnd={handleTransitionEnd}
      onScrollEnd={focus}
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
        data-hidden-mouse={
          !store.gridMode && store.option.autoHiddenMouse && hiddenMouse()
        }
        data-fit-width={boolDataVal(store.option.scrollMode.fitToWidth)}
        on:mousemove={onMouseMove}
        onTransitionEnd={handleTransitionEnd}
        tabIndex={-1}
      >
        <Index each={imgList()} fallback={<EmptyTip />}>
          {(img, i) => <ComicImg index={i} {...img()} />}
        </Index>
      </div>
    </div>
  );
};
