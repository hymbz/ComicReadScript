import type { Component } from 'solid-js';
import { createMemo, Show, For } from 'solid-js';
import { store } from '../hooks/useStore';
import { handleWheel } from '../hooks/useStore/slice';
import { useDrag } from '../hooks/useDrag';

import classes from '../index.module.css';

/** 滚动条上用于显示对应图片加载情况的元素 */
const ScrollbarPage: Component<{ index: number }> = (props) => (
  <div
    class={classes.scrollbarPage}
    data-index={props.index}
    data-type={store.imgList[props.index].loadType}
  />
);

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

  return (
    <div
      ref={(e) => useDrag(e)}
      class={classes.scrollbar}
      classList={{
        [classes.hidden]:
          !store.option.scrollbar.enabled && !store.showScrollbar,
      }}
      role="scrollbar"
      aria-controls={classes.mangaFlow}
      aria-valuenow={store.activePageIndex || -1}
      tabIndex={-1}
      onWheel={handleWheel}
    >
      <div
        class={classes.scrollbarDrag}
        data-show={!store.option.scrollbar.autoHidden || store.showScrollbar}
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
          data-show={store.showScrollbar}
        >
          {store.scrollbar.tipText}
        </div>
      </div>

      <Show when={store.option.scrollbar.showProgress}>
        <For each={store.pageList}>
          {([a, b]) => (
            <div>
              <ScrollbarPage index={a !== -1 ? a : b!} />
              {b ? <ScrollbarPage index={b !== -1 ? b : a} /> : null}
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};
