import type { Component } from 'solid-js';
import { Show, For } from 'solid-js';
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
export const Scrollbar: Component = () => (
  <div
    ref={useDrag}
    class={classes.scrollbar}
    classList={{
      [classes.hidden]: !store.option.scrollbar.enabled && !store.showScrollbar,
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
        top: store.option.scrollMode
          ? `${store.scrollbar.dragTop * 100}%`
          : `${(1 / store.pageList.length) * 100 * store.activePageIndex}%`,
        height: store.scrollbar.dragHeight
          ? `${store.scrollbar.dragHeight * 100}%`
          : `${(1 / store.pageList.length) * 100}%`,
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
