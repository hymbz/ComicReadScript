import type { Component } from 'solid-js';
import { createSignal, createMemo, Show, For } from 'solid-js';
import { debounce } from 'throttle-debounce';
import { store } from '../hooks/useStore';
import { useDrag } from '../hooks/useDrag';

import classes from '../index.module.css';
import { ScrollbarPage } from './ScrollbarPage';

/** 滚动条 */
export const Scrollbar: Component = () => {
  /** 滚动条高度 */
  const height = createMemo(() =>
    store.scrollbar.dragHeight
      ? `${store.scrollbar.dragHeight * 100}%`
      : `${(1 / store.pageList.length) * 100}%`,
  );

  /** 滚动条位置高度 */
  const top = createMemo(() =>
    store.option.scrollMode
      ? `${store.scrollbar.dragTop * 100}%`
      : `${(1 / store.pageList.length) * 100 * store.activePageIndex}%`,
  );

  // 在被滚动时使自身可穿透，以便在卷轴模式下触发页面的滚动
  const [penetrate, setPenetrate] = createSignal(false);
  const resetPenetrate = debounce(200, () => setPenetrate(false));
  const handleWheel = () => {
    setPenetrate(true);
    resetPenetrate();
  };

  /** 是否强制显示滚动条 */
  const showScrollbar = createMemo(() => store.showScrollbar || !!penetrate());

  return (
    <div
      ref={(e) => useDrag(e)}
      class={classes.scrollbar}
      classList={{
        [classes.hidden]: !store.option.scrollbar.enabled && !showScrollbar(),
      }}
      style={{ 'pointer-events': penetrate() ? 'none' : 'auto' }}
      role="scrollbar"
      tabIndex={-1}
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      data-show={!store.option.scrollbar.autoHidden || showScrollbar()}
      onWheel={handleWheel}
    >
      <span
        class={classes.scrollbarDrag}
        style={{
          height: height(),
          /**
           * 使用 transform 来移动的话因为涉及到百分比的四舍五入，
           * 会在长漫画的滚动结束后出现明显的抖动，
           * 所以这里只能用 top 来控制
           */
          top: top(),
          transition: store.option.scrollMode ? undefined : 'top 150ms',
        }}
      >
        <div
          class={classes.scrollbarPoper}
          classList={{ [classes.hidden]: !store.scrollbar.tipText }}
          data-show={showScrollbar()}
        >
          {store.scrollbar.tipText}
        </div>
      </span>
      <Show when={store.option.scrollbar.showImgStatus}>
        <For each={store.pageList}>
          {([a, b]) => <ScrollbarPage a={a} b={b} />}
        </For>
      </Show>
    </div>
  );
};
