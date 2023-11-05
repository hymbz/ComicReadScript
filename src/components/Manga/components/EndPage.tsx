import type { Component } from 'solid-js';
import {
  createMemo,
  createEffect,
  createSignal,
  onMount,
  For,
  Show,
} from 'solid-js';

import { t } from 'helper/i18n';
import { setState, store } from '../hooks/useStore';
import { bindRef, focus, turnPage } from '../hooks/useStore/slice';

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
    focus();
  };

  let ref: HTMLDivElement;

  onMount(() => {
    ref.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        turnPage(e.deltaY > 0 ? 'next' : 'prev');
      },
      { passive: false },
    );
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
        if (store.onPrev && store.option.jumpToNext)
          return t('end_page.tip.start_jump');
        break;
      case 'end':
        if (store.onNext && store.option.jumpToNext)
          return t('end_page.tip.end_jump');
        if (store.onExit) return t('end_page.tip.exit');
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
      on:click={handleClick}
      role="button"
      tabIndex={-1}
    >
      <p class={classes.tip}>{tip()}</p>
      <button
        ref={bindRef('prev')}
        type="button"
        classList={{ [classes.invisible]: !store.onPrev }}
        tabIndex={store.endPageType ? 0 : -1}
        on:click={() => store.onPrev?.()}
      >
        {t('end_page.prev_button')}
      </button>
      <button
        ref={bindRef('exit')}
        type="button"
        data-is-end
        tabIndex={store.endPageType ? 0 : -1}
        on:click={() => store.onExit?.(store.endPageType === 'end')}
      >
        {t('button.exit')}
      </button>
      <button
        ref={bindRef('next')}
        type="button"
        classList={{ [classes.invisible]: !store.onNext }}
        tabIndex={store.endPageType ? 0 : -1}
        on:click={() => store.onNext?.()}
      >
        {t('end_page.next_button')}
      </button>
      <Show when={store.option.showComment && delayType() === 'end'}>
        <div
          class={`${classes.comments} ${classes.beautifyScrollbar}`}
          onWheel={stopPropagation}
        >
          <For each={store.commentList}>{(comment) => <p>{comment}</p>}</For>
        </div>
      </Show>
    </div>
  );
};
