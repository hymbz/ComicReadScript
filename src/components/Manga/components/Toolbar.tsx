import { type Component, For, createEffect } from 'solid-js';
import { boolDataVal } from 'helper';

import { defaultButtonList } from '../defaultButtonList';
import { store } from '../store';
import classes from '../index.module.css';
import { focus } from '../actions';

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
      style={{ 'pointer-events': store.isDragMode ? 'none' : undefined }}
    >
      <div class={classes.toolbarPanel} on:click={focus}>
        <div class={classes.toolbarBg} />
        <For each={store.prop.editButtonList(defaultButtonList)}>
          {(ButtonItem) => <ButtonItem />}
        </For>
      </div>
    </div>
  );
};
