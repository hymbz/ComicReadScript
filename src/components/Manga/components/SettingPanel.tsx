import type { Component, ParentComponent } from 'solid-js';

import { createSignal, For, Show } from 'solid-js';

import { createEffectOn, lang } from 'helper';

import { bindRef } from '../actions';
import { defaultSettingList } from '../defaultSettingList';
import { stopPropagation } from '../helper';
import classes from '../index.module.css';
import { refs, store } from '../store';

export const SettingBlockSubtitle: ParentComponent<{
  onClick?: () => void;
}> = (props) => (
  <div
    class={classes.SettingBlockSubtitle}
    on:click={props.onClick}
    children={props.children}
  />
);

/** 菜单面板 */
export const SettingPanel: Component = () => (
  <div
    ref={bindRef('settingPanel')}
    class={`${classes.SettingPanel} ${classes.beautifyScrollbar}`}
    style={{ width: lang() === 'zh' ? '15em' : '20em' }}
    onWheel={(e) =>
      refs.settingPanel.scrollHeight > refs.settingPanel.clientHeight &&
      e.stopPropagation()
    }
    onScroll={stopPropagation}
    on:click={stopPropagation}
  >
    <For each={store.prop.editSettingList(defaultSettingList())}>
      {([name, SettingItem, options], i) => {
        const initShow = options?.initShow;
        const [show, setShwo] = createSignal(Boolean(initShow));

        if (typeof initShow === 'function')
          createEffectOn(initShow, (val) => setShwo(Boolean(val)));

        return (
          <Show when={options?.hidden ? !options.hidden() : true}>
            {i() ? <hr /> : null}
            <div class={classes.SettingBlock} data-show={show()}>
              <SettingBlockSubtitle onClick={() => setShwo((prev) => !prev)}>
                {name}
                {show() ? null : '…'}
              </SettingBlockSubtitle>
              <div class={classes.SettingBlockBody}>
                <SettingItem />
              </div>
            </div>
          </Show>
        );
      }}
    </For>
  </div>
);
