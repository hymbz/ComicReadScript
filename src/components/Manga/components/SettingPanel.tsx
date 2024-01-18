import type { Component } from 'solid-js';
import { For, createSignal } from 'solid-js';
import { lang } from 'helper/i18n';
import { createRootMemo } from 'helper/solidJs';
import { defaultSettingList } from '../defaultSettingList';
import { store } from '../store';
import { stopPropagation } from '../helper';

import classes from '../index.module.css';

/** 菜单面板 */
export const SettingPanel: Component = () => {
  const settingList = createRootMemo(() =>
    store.prop.editSettingList(defaultSettingList()),
  );

  return (
    <div
      class={`${classes.SettingPanel} ${classes.beautifyScrollbar}`}
      style={{ width: lang() !== 'zh' ? '20em' : '15em' }}
      onScroll={stopPropagation}
      onWheel={stopPropagation}
      on:click={stopPropagation}
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
                  on:click={() => setShwo((prev) => !prev)}
                >
                  {name}
                  {show() ? null : ' …'}
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
