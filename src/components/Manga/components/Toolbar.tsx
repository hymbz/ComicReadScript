import type { Component } from 'solid-js';
import { For, createEffect } from 'solid-js';

import { boolDataVal } from 'helper';
import { defaultButtonList } from '../defaultButtonList';
import { store } from '../hooks/useStore';

import classes from '../index.module.css';
import { focus } from '../hooks/useStore/slice';

/** 左侧工具栏 */
export const Toolbar: Component = () => {
  createEffect(() => store.show.toolbar || focus());

  return (
    <div
      role="toolbar"
      class={classes.toolbar}
      data-show={boolDataVal(store.show.toolbar)}
      // 移动端开启网格模式后关闭工具栏
      data-close={boolDataVal(store.isMobile && store.gridMode)}
      // 避免在页面拖拽时触发
      style={{ 'pointer-events': store.dragMode ? 'none' : undefined }}
    >
      <div class={classes.toolbarPanel}>
        <div class={classes.toolbarBg} />
        <For
          each={store.prop.editButtonList(defaultButtonList)}
          children={(ButtonItem) => <ButtonItem />}
        />
      </div>
    </div>
  );
};
