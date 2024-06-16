import {
  type Component,
  type JSX,
  createSignal,
  createMemo,
  Show,
  onMount,
} from 'solid-js';
import { boolDataVal, debounce } from 'helper';
import { createMemoMap, createThrottleMemo } from 'helper/solidJs';

import { refs, store } from '../store';
import { useDrag } from '../hooks/useDrag';
import {
  bindRef,
  getPageTip,
  scrollPosition,
  handlescrollbarSlider,
  sliderMidpoint,
  sliderHeight,
  sliderTop,
  showPageList,
  scrollLength,
} from '../actions';
import classes from '../index.module.css';

import { ScrollbarPageStatus } from './ScrollbarPageStatus';

/** 滚动条 */
export const Scrollbar: Component = () => {
  onMount(() => {
    useDrag({
      ref: refs.scrollbar,
      handleDrag: handlescrollbarSlider,
      easyMode: () =>
        store.option.scrollMode.enabled && store.option.scrollbar.easyScroll,
    });
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
    switch (showPageList().length) {
      case 0:
        return '';
      case 1:
        return getPageTip(showPageList()[0]);
    }

    const tipList = showPageList().map((i) => getPageTip(i));
    if (store.option.scrollMode.enabled || store.page.vertical)
      return tipList.join('\n');
    if (store.option.dir === 'rtl') tipList.reverse();
    return tipList.join('   ');
  });

  const style = createMemoMap<JSX.CSSProperties>({
    'pointer-events': () =>
      penetrate() || store.isDragMode || store.gridMode ? 'none' : 'auto',
    '--scroll-length': () => `${scrollLength()}px`,
    '--slider-midpoint': () => `${sliderMidpoint()}px`,
    '--slider-height': () => `${sliderHeight() * scrollLength()}px`,
    '--slider-top': () => `${sliderTop() * scrollLength()}px`,
  });

  return (
    <div
      ref={bindRef('scrollbar')}
      class={classes.scrollbar}
      style={style()}
      role="scrollbar"
      tabIndex={-1}
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      data-auto-hidden={boolDataVal(store.option.scrollbar.autoHidden)}
      data-force-show={boolDataVal(showScrollbar())}
      data-dir={store.option.dir}
      data-position={scrollPosition()}
      onWheel={handleWheel}
    >
      <div
        class={classes.scrollbarSlider}
        classList={{ [classes.hidden]: store.gridMode }}
      />
      <div class={classes.scrollbarPoper} children={tipText()} />

      <Show when={store.option.scrollbar.showImgStatus}>
        <ScrollbarPageStatus />
      </Show>
    </div>
  );
};
