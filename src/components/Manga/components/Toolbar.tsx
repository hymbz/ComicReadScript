import type { Component } from 'solid-js';
import { For } from 'solid-js';

import { defaultButtonList } from '../defaultButtonList';
import { useHover } from '../hooks/useHover';
import { store } from '../hooks/useStore';

import classes from '../index.module.css';

/** 左侧工具栏 */
export const Toolbar: Component = () => {
  const { isHover, handleMouseEnter, handleMouseLeave } = useHover();

  return (
    <div
      role="toolbar"
      class={classes.toolbar}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      data-show={isHover() || store.showToolbar}
    >
      <div class={classes.toolbarPanel}>
        <For each={store.editButtonList(defaultButtonList)}>
          {(ButtonItem) => <ButtonItem onMouseLeave={handleMouseLeave} />}
        </For>
      </div>
    </div>
  );
};
