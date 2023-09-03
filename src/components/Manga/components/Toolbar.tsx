import type { Component } from 'solid-js';
import { For, createEffect, createMemo } from 'solid-js';

import { defaultButtonList } from '../defaultButtonList';
import { useHover } from '../hooks/useHover';
import { store } from '../hooks/useStore';

import classes from '../index.module.css';
import { focus } from '../hooks/useStore/slice';

/** 左侧工具栏 */
export const Toolbar: Component = () => {
  const { isHover, handleMouseEnter, handleMouseLeave } = useHover();

  const show = createMemo(() => isHover() || store.showToolbar);

  createEffect(() => show() || focus());

  return (
    <div
      role="toolbar"
      class={classes.toolbar}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      data-show={show()}
    >
      <div class={classes.toolbarPanel}>
        <div class={classes.toolbarBg} />
        <For each={store.editButtonList(defaultButtonList)}>
          {(ButtonItem) => <ButtonItem onMouseLeave={handleMouseLeave} />}
        </For>
      </div>
    </div>
  );
};
