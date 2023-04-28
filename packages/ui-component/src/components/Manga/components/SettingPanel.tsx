import type { Component } from 'solid-js';
import { For, createMemo } from 'solid-js';
import { store } from '../hooks/useStore';

import { defaultSettingList } from '../defaultSettingList';

import classes from '../index.module.css';
import { stopPropagation } from '../helper';

/** 菜单面板 */
export const SettingPanel: Component = () => {
  const settingList = createMemo(() =>
    store.editSettingList(defaultSettingList),
  );

  return (
    <div
      class={classes.SettingPanel}
      onScroll={stopPropagation}
      onWheel={stopPropagation}
    >
      <For each={settingList()}>
        {([key, SettingItem], i) => (
          <>
            {i() ? <hr /> : null}
            <div class={classes.SettingBlock}>
              <div class={classes.SettingBlockSubtitle}>{key}</div>
              <SettingItem />
            </div>
          </>
        )}
      </For>
    </div>
  );
};
