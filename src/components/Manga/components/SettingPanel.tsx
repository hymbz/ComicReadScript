import { type Component, For, createSignal } from 'solid-js';
import { lang, createRootMemo } from 'helper';

import { defaultSettingList } from '../defaultSettingList';
import { refs, store } from '../store';
import { stopPropagation } from '../helper';
import { bindRef } from '../actions';
import classes from '../index.module.css';

/** 判断滚动事件是否会导致滚动 */
const canScroll = (e: WheelEvent, container: HTMLElement) => {
  const { scrollHeight, clientHeight, scrollTop } = container;
  return (
    scrollHeight > clientHeight &&
    ((e.deltaY < 0 && scrollTop > 0) ||
      (e.deltaY > 0 && Math.ceil(scrollTop) < scrollHeight - clientHeight))
  );
};

/** 菜单面板 */
export const SettingPanel: Component = () => {
  const settingList = createRootMemo(() =>
    store.prop.editSettingList(defaultSettingList()),
  );

  return (
    <div
      ref={bindRef('settingPanel')}
      class={`${classes.SettingPanel} ${classes.beautifyScrollbar}`}
      style={{ width: lang() === 'zh' ? '15em' : '20em' }}
      onWheel={(e) => canScroll(e, refs.settingPanel) && e.stopPropagation()}
      onScroll={stopPropagation}
      on:click={stopPropagation}
    >
      <For each={settingList()}>
        {([name, SettingItem, initShow], i) => {
          const [show, setShwo] = createSignal(Boolean(initShow));
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
