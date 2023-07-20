import type { Component } from 'solid-js';
import { For, createMemo } from 'solid-js';

import { defaultSettingList } from '../defaultSettingList';
import { store } from '../hooks/useStore';
import { stopPropagation } from '../helper';

import classes from '../index.module.css';

/** 菜单面板 */
export const SettingPanel: Component = () => {
  const settingList = createMemo(() =>
    store.editSettingList(defaultSettingList),
  );

  return (
    <div
      class={`${classes.SettingPanel} ${classes.beautifyScrollbar}`}
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
