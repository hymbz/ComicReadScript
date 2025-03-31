import { type Component, For, createSignal } from 'solid-js';
import { lang, createEffectOn } from 'helper';

import { defaultSettingList } from '../defaultSettingList';
import { refs, store } from '../store';
import { stopPropagation } from '../helper';
import { bindRef } from '../actions';
import classes from '../index.module.css';

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
      {([name, SettingItem, initShow], i) => {
        const [show, setShwo] = createSignal(Boolean(initShow));

        if (typeof initShow === 'function')
          createEffectOn(initShow, (val) => setShwo(Boolean(val)));

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
