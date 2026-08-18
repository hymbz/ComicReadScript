import { boolDataVal, createThrottleMemo, useDrag } from 'helper';
import {
  type Component,
  type JSX,
  Show,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

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
  scrollPageList,
  scrollPosition,
  sliderHeight,
  sliderMidpoint,
  sliderTop,
  watchDomSize,
} from '../actions';
import { useHover } from '../hooks/useHover';
import { css } from '../hooks/useStyle';
import classes from '../index.module.css';
import { refs, setState, store } from '../store';
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

  // 在被滚动时，使自身变得可穿透，保持一帧的时间
  const [penetrate, setPenetrate] = createSignal(false);
  let penetrateFrame = 0;
  const handleWheel = () => {
    setPenetrate(true);
    cancelAnimationFrame(penetrateFrame);
    penetrateFrame = requestAnimationFrame(() => setPenetrate(false));
  };
  onCleanup(() => cancelAnimationFrame(penetrateFrame));

  const isScrollbarHover = useHover(() => refs.scrollbar);
  createEffect(() => setState('isScrollbarHover', isScrollbarHover()));

  /** 滚动条提示文本 */
  const tipText = createThrottleMemo(() => {
    if (store.showRange[0] === store.showRange[1])
      return getPageTip(store.showRange[0]);

    if (isDoubleMode()) {
      const rows: string[] = [];
      let pageIndex = 0;
      for (const row of scrollPageList()) {
        const start = pageIndex;
        const end = pageIndex + row.length - 1;
        pageIndex += row.length;

        if (store.showRange[1] < start || store.showRange[0] > end) continue;

        const rowTipList = row.map((_, i) => getPageTip(start + i));
        if (store.option.dir === 'rtl') rowTipList.reverse();
        rows.push(rowTipList.join('   '));
      }
      return rows.join('\n') || getPageTip(store.showRange[0]);
    }

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

    if (isOnePageMode()) return tipList.join('\n');
    if (tipList.length === 1) return tipList[0];
    if (store.option.dir === 'rtl') tipList.reverse();
    return tipList.join('   ');
  });

  css(`.${classes.scrollbar}`, {
    'pointer-events': () => (penetrate() || store.isDragMode ? 'none' : 'auto'),
    '--scroll-length': () => `${scrollDomLength()}px`,
    '--slider-midpoint': () => `${sliderMidpoint()}px`,
    '--slider-height': () => `${sliderHeight() * scrollDomLength()}px`,
    '--slider-top': sliderTop,
  });

  const ScrollbarBase: Component<{
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
      data-force-show={boolDataVal(
        store.show.scrollbar || penetrate() || store.isScrollbarHover,
      )}
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
      <ScrollbarBase ref={bindRef('scrollbar')}>
        <div class={classes.scrollbarPoper} children={tipText()} />
        <Show
          when={
            store.option.scrollbar.showImgStatus &&
            scrollPosition() !== 'hidden'
          }
        >
          <ScrollbarPageStatus />
        </Show>
      </ScrollbarBase>

      {/* 使用 mix-blend-mode 让滚动条颜色自适应背景 */}
      <ScrollbarBase
        style={{ 'mix-blend-mode': 'difference', 'pointer-events': 'none' }}
      >
        <div class={classes.scrollbarSlider} />
      </ScrollbarBase>
    </>
  );
};
