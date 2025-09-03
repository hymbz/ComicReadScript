import type { Component } from 'solid-js';

import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
  Show,
} from 'solid-js';

import type { UseDrag } from 'helper';

import { boolDataVal, t, useDrag } from 'helper';

import { bindRef, focus, getTurnPageDir, handleEndTurnPage } from '../actions';
import { stopPropagation } from '../helper';
import classes from '../index.module.css';
import { setState, store } from '../store';
import { dir } from './TouchArea';

let delayTypeTimer = 0;

export const EndPage: Component = () => {
  const handleClick: EventHandler['onClick'] = (e) => {
    e.stopPropagation();
    if (e.target?.nodeName !== 'BUTTON') setState('show', 'endPage', undefined);
    focus();
  };

  let ref!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars

  const [isDrag, setIsDrag] = createSignal(false);
  const [dragY, setDragY] = createSignal(0);
  const handleDrag: UseDrag = ({
    type,
    xy: [, y],
    initial: [, iy],
    startTime,
  }) => {
    switch (type) {
      case 'down':
        return setIsDrag(true);
      case 'move':
        return setDragY(y - iy);
    }

    const pageDir = getTurnPageDir(
      -dragY(),
      store.rootSize.height / 2,
      startTime,
    );
    if (pageDir) handleEndTurnPage(pageDir);
    setDragY(0);
    setIsDrag(false);
  };

  onMount(() => {
    useDrag({
      ref,
      handleDrag,
      skip: (e) =>
        (e.target as HTMLElement).matches(
          `.${classes.comments}, .${classes.comments} *`,
        ),
    });
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
    if (store.option.scroolEnd === 'none') return '';
    switch (delayType()) {
      case 'start':
        if (!store.prop.onPrev || store.option.scroolEnd !== 'auto') break;
        return t('end_page.tip.start_jump');
      case 'end':
        if (store.prop.onNext && store.option.scroolEnd === 'auto')
          return t('end_page.tip.end_jump');
        if (store.prop.onExit) return t('end_page.tip.exit');
    }
    return '';
  });

  return (
    <div
      ref={ref}
      class={classes.endPage}
      data-show={store.show.endPage}
      data-type={delayType()}
      data-drag={boolDataVal(isDrag())}
      on:click={handleClick}
      role="button"
      tabIndex={-1}
      style={{ 'flex-direction': dir() === 'rtl' ? 'row-reverse' : undefined }}
    >
      <div class={classes.endPageBody} style={{ '--drag-y': `${dragY()}px` }}>
        <p class={classes.tip}>{tip()}</p>
        <button
          ref={bindRef('prev')}
          type="button"
          classList={{ [classes.invisible]: !store.prop.onPrev }}
          tabIndex={store.show.endPage ? 0 : -1}
          on:click={() => store.prop.onPrev?.()}
        >
          {t('end_page.prev_button')}
        </button>
        <button
          ref={bindRef('exit')}
          type="button"
          data-is-end
          tabIndex={store.show.endPage ? 0 : -1}
          on:click={() => store.prop.onExit?.(store.show.endPage === 'end')}
        >
          {t('other.exit')}
        </button>
        <button
          ref={bindRef('next')}
          type="button"
          classList={{ [classes.invisible]: !store.prop.onNext }}
          tabIndex={store.show.endPage ? 0 : -1}
          on:click={() => store.prop.onNext?.()}
        >
          {t('end_page.next_button')}
        </button>
        <Show
          when={
            store.option.showComment &&
            delayType() === 'end' &&
            store.commentList?.length
          }
        >
          <div
            class={`${classes.comments} ${classes.beautifyScrollbar}`}
            onWheel={stopPropagation}
          >
            <For each={store.commentList}>{(comment) => <p>{comment}</p>}</For>
          </div>
        </Show>
      </div>
    </div>
  );
};
