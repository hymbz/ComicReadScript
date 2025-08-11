import type { Component, JSX } from 'solid-js';

import { createMemo, createSignal, onMount, Show } from 'solid-js';

import { boolDataVal, createThrottleMemo, debounce, useDrag } from 'helper';

import {
  abreastArea,
  abreastShowColumn,
  bindRef,
  getPageTip,
  handleScrollbarSlider,
  isAbreastMode,
  isDoubleMode,
  isDrag,
  isOnePageMode,
  isScrollMode,
  scrollDomLength,
  scrollPosition,
  sliderHeight,
  sliderMidpoint,
  sliderTop,
  watchDomSize,
} from '../actions';
import { useStyleMemo } from '../hooks/useStyle';
import classes from '../index.module.css';
import { refs, store } from '../store';
import { ScrollbarPageStatus } from './ScrollbarPageStatus';

/** 滚动条 */
export const Scrollbar: Component = () => {
  onMount(() => {
    useDrag({
      ref: refs.scrollbar,
      handleDrag: handleScrollbarSlider,
      easyMode: () => isScrollMode() && store.option.scrollbar.easyScroll,
      setCapture: true,
    });
    watchDomSize('scrollbarSize', refs.scrollbar);
  });

  // 在被滚动时使自身可穿透，以便在卷轴模式下触发页面的滚动
  const [penetrate, setPenetrate] = createSignal(false);
  const resetPenetrate = debounce(() => setPenetrate(false));
  const handleWheel = () => {
    setPenetrate(true);
    resetPenetrate();
  };

  /** 是否强制显示滚动条 */
  const showScrollbar = createMemo(
    () => store.show.scrollbar || Boolean(penetrate()),
  );

  /** 滚动条提示文本 */
  const tipText = createThrottleMemo(() => {
    if (store.showRange[0] === store.showRange[1])
      return getPageTip(store.showRange[0]);

    /** 并排卷轴模式下的滚动条提示文本 */
    if (isAbreastMode()) {
      const columns = abreastArea()
        .columns.slice(abreastShowColumn().start, abreastShowColumn().end + 1)
        .map((column) => column.map(getPageTip));
      if (store.option.dir !== 'rtl') columns.reverse();

      return columns.map((column) => column.join(' ')).join('\n');
    }

    const tipList: string[] = [];
    for (let [i] = store.showRange; i <= store.showRange[1]; i++)
      tipList.push(getPageTip(i));

    if (isOnePageMode() || isDoubleMode()) return tipList.join('\n');
    if (tipList.length === 1) return tipList[0];
    if (store.option.dir === 'rtl') tipList.reverse();
    return tipList.join('   ');
  });

  useStyleMemo(`.${classes.scrollbar}`, {
    'pointer-events': () =>
      penetrate() || store.isDragMode || store.gridMode ? 'none' : 'auto',
    '--scroll-length': () => `${scrollDomLength()}px`,
    '--slider-midpoint': () => `${sliderMidpoint()}px`,
    '--slider-height': () => `${sliderHeight() * scrollDomLength()}px`,
    '--slider-top': sliderTop,
  });

  const _Scrollbar: Component<{
    children: JSX.Element;
    style?: JSX.CSSProperties;
    ref?: JSX.HTMLAttributes<HTMLDivElement>['ref'];
  }> = (props) => (
    <div
      ref={props.ref}
      class={classes.scrollbar}
      role="scrollbar"
      tabIndex={-1}
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      data-auto-hidden={boolDataVal(store.option.scrollbar.autoHidden)}
      data-force-show={boolDataVal(showScrollbar())}
      data-dir={store.option.dir}
      data-position={scrollPosition()}
      data-is-abreast-mode={boolDataVal(isAbreastMode())}
      data-drag={boolDataVal(isDrag())}
      onWheel={handleWheel}
      style={props.style}
      children={props.children}
    />
  );

  return (
    <>
      <_Scrollbar ref={bindRef('scrollbar')}>
        <div class={classes.scrollbarPoper} children={tipText()} />
        <Show when={store.option.scrollbar.showImgStatus}>
          <ScrollbarPageStatus />
        </Show>
      </_Scrollbar>

      {/* 使用 mix-blend-mode 让滚动条颜色自适应背景 */}
      <_Scrollbar
        style={{ 'mix-blend-mode': 'difference', 'pointer-events': 'none' }}
      >
        <div
          class={classes.scrollbarSlider}
          classList={{ [classes.hidden]: store.gridMode }}
        />
      </_Scrollbar>
    </>
  );
};
