import type { Component } from 'solid-js';
import {
  createMemo,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  For,
  Show,
} from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { bindRef, turnPage } from '../hooks/useStore/slice';

import classes from '../index.module.css';
import { stopPropagation } from '../helper';

let delayTypeTimer = 0;

export const EndPage: Component = () => {
  const handleClick: EventHandler['onClick'] = (e) => {
    e.stopPropagation();
    if (e.target?.nodeName !== 'BUTTON')
      setState((state) => {
        state.endPageType = undefined;
      });
  };

  let ref: HTMLDivElement;

  onMount(() => {
    const controller = new AbortController();
    ref.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setState((state) => turnPage(state, e.deltaY > 0 ? 'next' : 'prev'));
      },
      {
        passive: false,
        signal: controller.signal,
      },
    );
    onCleanup(() => controller.abort());
  });

  // state.endPageType 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
  // 防止在动画效果结束前 tip 就消失或改变了位置
  const [delayType, setDelayType] = createSignal<'start' | 'end' | undefined>();
  createEffect(() => {
    if (store.endPageType) {
      window.clearTimeout(delayTypeTimer);
      setDelayType(store.endPageType);
    } else {
      delayTypeTimer = window.setTimeout(
        () => setDelayType(store.endPageType),
        500,
      );
    }
  });

  const tip = createMemo(() => {
    switch (delayType()) {
      case 'start':
        if (store.onPrev && store.option.flipToNext)
          return '已到开头，继续翻页将跳至上一话';
        break;
      case 'end':
        if (store.onNext && store.option.flipToNext)
          return '已到结尾，继续翻页将跳至下一话';
        if (store.onExit) return '已到结尾，继续翻页将退出';
        break;
    }
    return '';
  });

  return (
    <div
      ref={ref!}
      class={classes.endPage}
      data-show={store.endPageType}
      data-type={delayType()}
      onClick={handleClick}
      role="button"
      tabIndex={-1}
    >
      <p class={classes.tip}>{tip()}</p>
      <button
        ref={bindRef('prevRef')}
        type="button"
        classList={{ [classes.invisible]: !store.onPrev }}
        tabIndex={store.endPageType ? 0 : -1}
        onClick={() => store.onPrev?.()}
      >
        上一话
      </button>
      <button
        ref={bindRef('exitRef')}
        type="button"
        data-is-end
        tabIndex={store.endPageType ? 0 : -1}
        onClick={() => store.onExit?.(!!store.activePageIndex)}
      >
        退出
      </button>
      <button
        ref={bindRef('nextRef')}
        type="button"
        classList={{ [classes.invisible]: !store.onNext }}
        tabIndex={store.endPageType ? 0 : -1}
        onClick={() => store.onNext?.()}
      >
        下一话
      </button>
      <Show when={store.option.showComment}>
        <div class={classes.comments} onWheel={stopPropagation}>
          <For each={store.commentList}>{(comment) => <p>{comment}</p>}</For>
        </div>
      </Show>
    </div>
  );
};
