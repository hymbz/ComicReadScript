import type { Component } from 'solid-js';
import { createSignal, createMemo, Show, For } from 'solid-js';
import { debounce } from 'throttle-debounce';

import { store } from '../hooks/useStore';
import { useDrag } from '../hooks/useDrag';
import { getPageTip, handleScrollbarDrag } from '../hooks/useStore/slice';

import { ScrollbarPage } from './ScrollbarPage';

import classes from '../index.module.css';

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
  const resetPenetrate = debounce(100, () => setPenetrate(false));
  const handleWheel = () => {
    setPenetrate(true);
    resetPenetrate();
  };

  /** 是否强制显示滚动条 */
  const showScrollbar = createMemo(() => store.showScrollbar || !!penetrate());

  return (
    <div
      ref={(e) =>
        useDrag(
          e,
          handleScrollbarDrag,
          () => store.option.scrollMode && store.option.scrollbar.easyScroll,
        )
      }
      class={classes.scrollbar}
      classList={{
        [classes.hidden]: !store.option.scrollbar.enabled && !showScrollbar(),
      }}
      style={{
        'pointer-events':
          penetrate() || store.dragMode || store.gridMode ? 'none' : 'auto',
      }}
      role="scrollbar"
      tabIndex={-1}
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      data-show={!store.option.scrollbar.autoHidden || showScrollbar()}
      data-dir={store.option.dir}
      onWheel={handleWheel}
    >
      <div
        class={classes.scrollbarDrag}
        classList={{ [classes.hidden]: store.gridMode }}
        style={{
          '--height': height(),
          /**
           * 使用 transform 来移动的话因为涉及到百分比的四舍五入，
           * 会在长漫画的滚动结束后出现明显的抖动，
           * 所以这里只能用 top 来控制
           */
          '--top': top(),
          transition: store.option.scrollMode ? undefined : 'top 150ms',
        }}
      >
        <div class={classes.scrollbarPoper} data-show={showScrollbar()}>
          {store.memo.showPageList.map((i) => getPageTip(i)).join('\n')}
        </div>
      </div>
      <Show when={store.option.scrollbar.showImgStatus}>
        <For each={store.pageList}>
          {([a, b]) => <ScrollbarPage a={a} b={b} />}
        </For>
      </Show>
    </div>
  );
};
