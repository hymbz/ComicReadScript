import type { Component } from 'solid-js';
import { createSignal, createMemo, Show, For, onMount } from 'solid-js';
import { debounce } from 'throttle-debounce';

import { refs, store } from '../store';
import { useDrag } from '../hooks/useDrag';
import {
  bindRef,
  getPageTip,
  getScrollPosition,
  handleScrollbarDrag,
} from '../actions';

import { ScrollbarPage } from './ScrollbarPage';

import classes from '../index.module.css';
import { boolDataVal } from '../../../helper';

/** 滚动条 */
export const Scrollbar: Component = () => {
  onMount(() => {
    useDrag({
      ref: refs.scrollbar,
      handleDrag: handleScrollbarDrag,
      easyMode: () =>
        store.option.scrollMode && store.option.scrollbar.easyScroll,
    });
  });

  /** 滚动条高度 */
  const height = createMemo(() =>
    store.option.scrollMode
      ? store.scrollbar.dragHeight
      : 1 / store.pageList.length,
  );

  /** 滚动条位置高度 */
  const top = createMemo(() =>
    store.option.scrollMode
      ? store.scrollbar.dragTop
      : (1 / store.pageList.length) * store.activePageIndex,
  );

  /** 滚动条滑块的中心点高度 */
  const dragMidpoint = createMemo(
    () => store.memo.scrollLength * (top() + height() / 2),
  );

  // 在被滚动时使自身可穿透，以便在卷轴模式下触发页面的滚动
  const [penetrate, setPenetrate] = createSignal(false);
  const resetPenetrate = debounce(100, () => setPenetrate(false));
  const handleWheel = () => {
    setPenetrate(true);
    resetPenetrate();
  };

  /** 是否强制显示滚动条 */
  const showScrollbar = createMemo(() => store.show.scrollbar || !!penetrate());

  const showTip = createMemo(() => {
    if (store.memo.showPageList.length === 0) return 'null';
    if (store.memo.showPageList.length === 1)
      return getPageTip(store.memo.showPageList[0]);

    const tipList = store.memo.showPageList.map((i) => getPageTip(i));

    if (store.option.scrollMode || store.page.vertical)
      return tipList.join('\n');

    if (store.option.dir === 'rtl') tipList.reverse();
    return tipList.join('   ');
  });

  return (
    <div
      ref={bindRef('scrollbar')}
      class={classes.scrollbar}
      style={{
        'pointer-events':
          penetrate() || store.isDragMode || store.gridMode ? 'none' : 'auto',
        '--drag-midpoint': `${dragMidpoint()}px`,
        '--scroll-length': `${store.memo.scrollLength}px`,
      }}
      role="scrollbar"
      tabIndex={-1}
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      data-auto-hidden={boolDataVal(store.option.scrollbar.autoHidden)}
      data-force-show={boolDataVal(showScrollbar())}
      data-dir={store.option.dir}
      data-position={getScrollPosition()}
      onWheel={handleWheel}
    >
      <div
        class={classes.scrollbarDrag}
        classList={{ [classes.hidden]: store.gridMode }}
        style={{
          '--height-ratio': height(),
          '--top-ratio': top(),
        }}
      />
      <div class={classes.scrollbarPoper} children={showTip()} />

      <Show when={store.option.scrollbar.showImgStatus}>
        <For each={store.pageList}>
          {([a, b]) => <ScrollbarPage a={a} b={b} />}
        </For>
      </Show>
    </div>
  );
};
