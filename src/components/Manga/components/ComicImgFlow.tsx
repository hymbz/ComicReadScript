import {
  type UseDrag,
  boolDataVal,
  createEffectOn,
  range,
  useDrag,
} from 'helper';
import { type Component, For, createMemo, onMount } from 'solid-js';

import {
  abreastArea,
  abreastColumnWidth,
  activeImgIndex,
  bindRef,
  bindScrollTop,
  bound,
  focus,
  getImg,
  handleClick,
  handleMangaFlowDrag,
  handlePinchZoom,
  handleScrollModeDrag,
  handleZoomDrag,
  imgAreaStyle,
  imgIndexMap,
  isEnableBg,
  isScrollMode,
  loadState,
  pageHeightList,
  pageTopList,
  renderImgList,
  resetPage,
  scrollPageList,
  scrollTo,
  scrollTop,
  touches,
} from '../actions';
import { useHiddenMouse } from '../hooks/useHiddenMouse';
import { css } from '../hooks/useStyle';
import classes from '../index.module.css';
import { refs, setState, store } from '../store';
import { ComicImg } from './ComicImg';
import { EmptyTip } from './EmptyTip';

export const ComicImgFlow: Component = () => {
  const hiddenMouse = useHiddenMouse(() => refs.mangaFlow);

  const handleDrag: UseDrag = (state, e) => {
    if (touches.size > 1) return handlePinchZoom(state, e);
    if (store.option.zoom.ratio !== 100) return handleZoomDrag(state, e);
    if (store.option.scrollMode.enabled) return handleScrollModeDrag(state, e);
    return handleMangaFlowDrag(state, e);
  };

  onMount(() => {
    useDrag({
      ref: refs.mangaBox,
      handleDrag,
      handleClick,
      touches,
      setCapture: true,
    });
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
      () => pageTopList()[store.showRange[0]],
      pageTopList,
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
    (page.length === 1 ? [page[0], page[0]] : page)
      .map((i) => (i === -1 ? '.' : `_${i}`))
      .join(' ');

  const gridAreas = createMemo(() => {
    if (store.pageList.length === 0) return;

    if (store.option.scrollMode.enabled) {
      if (store.option.scrollMode.abreastMode)
        return `"${range(abreastArea().columns.length, (i) => `_${i}`).join(
          ' ',
        )}"`;
      if (store.option.scrollMode.doubleMode) {
        const { pageColumns } = store.option.scrollMode;
        return scrollPageList()
          .map((row) => {
            const missNum = pageColumns * 2 - row.length * 2;
            const pageList = [...row.map(pageToText), ...range(missNum, '.')];
            return `"${pageList.join(' ')}"`;
          })
          .join('\n');
      }
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

  css(`.${classes.mangaBox}`, {
    transform: () =>
      `translate(${store.option.zoom.offset.x}px, ${store.option.zoom.offset.y}px)
        scale(${store.option.zoom.ratio / 100})`,
  });

  const pageX = createMemo(() => {
    if (isScrollMode()) return 0;
    let x =
      store.page.offset.x.pct * store.rootSize.width + store.page.offset.x.px;
    if (store.option.dir !== 'rtl') x = -x;
    return x;
  });

  css(`#${classes.mangaFlow}`, {
    // 不能使用 transform 来移动，不然在 Safari 浏览器上悬浮显示时
    // 每次滚动底下的网页时 mangaFlow 都会闪烁一下，在简易模式下会频繁触发
    left: () => `${pageX()}px`,
    top: () =>
      `${store.page.offset.y.pct * store.rootSize.height + store.page.offset.y.px}px`,

    'touch-action'() {
      if (store.option.zoom.ratio === 100) return;
      if (!store.option.scrollMode.enabled) return 'none';
      if (store.option.zoom.offset.y === 0) return 'pan-up';
      if (store.option.zoom.offset.y === bound().y) return 'pan-down';
    },
    'grid-template-areas': gridAreas,
    'grid-template-columns'() {
      if (store.imgList.length === 0) return;
      if (store.option.scrollMode.enabled) {
        if (store.option.scrollMode.abreastMode)
          return `repeat(${abreastArea().columns.length}, ${abreastColumnWidth()}px)`;
        if (store.option.scrollMode.doubleMode)
          return `repeat(${store.option.scrollMode.pageColumns * 2}, 1fr)`;
        return;
      }
      if (store.page.vertical) return '50% 50%';
      return `repeat(${gridAreas()?.split(' ').length ?? 0}, 50%)`;
    },
    'grid-template-rows'() {
      if (isScrollMode())
        return pageHeightList()
          .map((num) => `${num}px`)
          .join(' ');
    },
    'background-color': () =>
      isEnableBg() ? getImg(activeImgIndex())?.background : undefined,
  });

  css(imgAreaStyle);

  const renderList = createMemo(() => {
    const list = new Set(renderImgList());
    for (const url of loadState.loadingUrlSet) {
      const indexList = imgIndexMap().get(url);
      if (!indexList) continue;
      // 渲染范围内已经有该 url 的图片，加载已在进行中，无需额外挂载
      if (indexList.some((index) => list.has(index))) continue;
      // 否则随便取一个索引，让渲染范围外的图片也能开始加载
      list.add(indexList[0]);
    }

    return [...list].toSorted((a, b) => a - b);
  });

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
        data-hidden-mouse={store.option.autoHiddenMouse && hiddenMouse()}
        onTransitionEnd={handleTransitionEnd}
        tabIndex={-1}
      >
        <For each={renderList()} fallback={<EmptyTip />}>
          {(i) => <ComicImg index={i} {...store.imgMap[store.imgList[i]]} />}
        </For>
      </div>
    </div>
  );
};
