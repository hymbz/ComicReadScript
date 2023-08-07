import type { Component } from 'solid-js';
import { For, createMemo, createSignal } from 'solid-js';

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
        {([name, SettingItem, hidden], i) => {
          const [show, setShwo] = createSignal(!hidden);
          return (
            <>
              {i() ? <hr /> : null}
              <div class={classes.SettingBlock} data-show={show()}>
                <div
                  class={classes.SettingBlockSubtitle}
                  onClick={() => setShwo((prev) => !prev)}
                >
                  {name}
                  {show() ? null : ' ...'}
                </div>
                <div class={classes.SettingBlockBody}>
                  <SettingItem />
                </div>
              </div>
            </>
          );
        }}
      </For>
    </div>
  );
};
