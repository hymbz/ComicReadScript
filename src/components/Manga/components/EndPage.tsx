import type { Component } from 'solid-js';
import {
  createMemo,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';

import { setState, store } from '../hooks/useStore';
import { turnPage } from '../hooks/useStore/slice';

import classes from '../index.module.css';

let delayTypeTimer = 0;

export const EndPage: Component = () => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    if ((e.target as Element).nodeName === 'BUTTON') return;

    setState((state) => {
      state.endPageType = undefined;
    });
  };

  const handleEnd = () =>
    setState((state) => {
      state.onExit?.(true);
      state.activePageIndex = 0;
      state.endPageType = undefined;
    });

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
        class={store.onPrev ? undefined : classes.invisible}
        onClick={store.onPrev}
        type="button"
        tabIndex={store.endPageType ? 0 : -1}
      >
        上一话
      </button>
      <button
        onClick={handleEnd}
        type="button"
        tabIndex={store.endPageType ? 0 : -1}
        data-is-end
      >
        退出
      </button>
      <button
        class={store.onNext ? undefined : classes.invisible}
        onClick={store.onNext}
        type="button"
        tabIndex={store.endPageType ? 0 : -1}
      >
        下一话
      </button>
    </div>
  );
};
