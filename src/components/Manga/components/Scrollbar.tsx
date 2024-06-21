import {
  type Component,
  createSignal,
  createMemo,
  Show,
  onMount,
} from 'solid-js';
import { boolDataVal, debounce } from 'helper';
import { createThrottleMemo } from 'helper/solidJs';

import { refs, store } from '../store';
import { useDrag } from '../hooks/useDrag';
import { useStyleMemo } from '../hooks/useStyle';
import {
  bindRef,
  getPageTip,
  scrollPosition,
  handlescrollbarSlider,
  sliderMidpoint,
  sliderHeight,
  scrollPercentage,
  showPageList,
  scrollDomLength,
  isScrollMode,
  isOnePageMode,
  abreastShowColumn,
  isAbreastMode,
  abreastArea,
} from '../actions';
import classes from '../index.module.css';

import { ScrollbarPageStatus } from './ScrollbarPageStatus';

/** 滚动条 */
export const Scrollbar: Component = () => {
  onMount(() => {
    useDrag({
      ref: refs.scrollbar,
      handleDrag: handlescrollbarSlider,
      easyMode: () => isScrollMode() && store.option.scrollbar.easyScroll,
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

  const abreastShowTip = createMemo(() => {
    if (!isAbreastMode()) return undefined;

    const columns = abreastArea()
      .columns.slice(abreastShowColumn().start, abreastShowColumn().end + 1)
      .map((column) => column.map(getPageTip));
    if (store.option.dir === 'rtl') {
      columns.reverse();
      columns.forEach((column) => column.reverse());
    }
    return columns.map((column) => column.join(', ')).join(' | ');
  });

  /** 滚动条提示文本 */
  const tipText = createThrottleMemo(() => {
    switch (showPageList().length) {
      case 0:
        return '';
      case 1:
        return getPageTip(showPageList()[0]);
    }

    if (isAbreastMode()) return abreastShowTip();
    const tipList = showPageList().map((i) => getPageTip(i));
    if (isOnePageMode()) return tipList.join('\n');
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
    '--slider-top': () => `${scrollPercentage() * scrollDomLength()}px`,
  });

  return (
    <div
      ref={bindRef('scrollbar')}
      class={classes.scrollbar}
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
