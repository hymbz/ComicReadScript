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
import { stopPropagation } from '../helper';
import { _setState, store } from '../store';
import { bindRef, focus, turnPage } from '../actions';
import { dir } from './TouchArea';

import classes from '../index.module.css';

let delayTypeTimer = 0;

export const EndPage: Component = () => {
  const handleClick: EventHandler['onClick'] = (e) => {
    e.stopPropagation();
    if (e.target?.nodeName !== 'BUTTON')
      _setState('show', 'endPage', undefined);
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

  // state.show.endPage 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
  // 防止在动画效果结束前 tip 就消失或改变了位置
  const [delayType, setDelayType] = createSignal<'start' | 'end' | undefined>();
  createEffect(() => {
    if (store.show.endPage) {
      window.clearTimeout(delayTypeTimer);
      setDelayType(store.show.endPage);
    } else {
      delayTypeTimer = window.setTimeout(
        () => setDelayType(store.show.endPage),
        500,
      );
    }
  });

  const tip = createMemo(() => {
    switch (delayType()) {
      case 'start':
        if (store.prop.Prev && store.option.jumpToNext)
          return t('end_page.tip.start_jump');
        break;
      case 'end':
        if (store.prop.Next && store.option.jumpToNext)
          return t('end_page.tip.end_jump');
        if (store.prop.Exit) return t('end_page.tip.exit');
        break;
    }
    return '';
  });

  return (
    <div
      ref={ref!}
      class={classes.endPage}
      data-show={store.show.endPage}
      data-type={delayType()}
      on:click={handleClick}
      role="button"
      tabIndex={-1}
      style={{ 'flex-direction': dir() === 'rtl' ? 'row-reverse' : undefined }}
    >
      <p class={classes.tip}>{tip()}</p>
      <button
        ref={bindRef('prev')}
        type="button"
        classList={{ [classes.invisible]: !store.prop.Prev }}
        tabIndex={store.show.endPage ? 0 : -1}
        on:click={() => store.prop.Prev?.()}
      >
        {t('end_page.prev_button')}
      </button>
      <button
        ref={bindRef('exit')}
        type="button"
        data-is-end
        tabIndex={store.show.endPage ? 0 : -1}
        on:click={() => store.prop.Exit?.(store.show.endPage === 'end')}
      >
        {t('button.exit')}
      </button>
      <button
        ref={bindRef('next')}
        type="button"
        classList={{ [classes.invisible]: !store.prop.Next }}
        tabIndex={store.show.endPage ? 0 : -1}
        on:click={() => store.prop.Next?.()}
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
