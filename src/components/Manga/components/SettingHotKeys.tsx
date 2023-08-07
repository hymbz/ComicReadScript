import MdClose from '@material-design-icons/svg/round/close.svg';
import MdRefresh from '@material-design-icons/svg/round/refresh.svg';
import MdAdd from '@material-design-icons/svg/round/add.svg';

import { type Component, For, Index } from 'solid-js';

import { delHotKeys, hotKeysMap, setHotKeys } from '../hooks/useStore/slice';
import { defaultHoeKeys } from '../hooks/useStore/OtherState';
import { store } from '../hooks/useStore';
import { getKeyboardCode, keyboardCodeToText } from '../../../helper';

import classes from '../index.module.css';

const KeyItem: Component<{
  operateName: string;
  i: number;
}> = (props) => (
  <div
    class={classes.hotKeysItem}
    tabIndex={0}
    oncapture:keydown={(e) => {
      e.stopPropagation();
      const code = getKeyboardCode(e);
      if (!Reflect.has(hotKeysMap(), code))
        setHotKeys(props.operateName, props.i, code);
    }}
  >
    {keyboardCodeToText(store.hotKeys[props.operateName][props.i])}
    <MdClose
      onClick={() => delHotKeys(store.hotKeys[props.operateName][props.i])}
    />
  </div>
);

export const SettingHotKeys: Component = () => (
  <For each={Object.entries(store.hotKeys)}>
    {([name, keys]) => (
      <div class={classes.hotKeys}>
        <div class={classes.hotKeysHeader}>
          <p>{name}</p>
          <span style={{ 'flex-grow': 1 }} />
          <div
            title="添加新快捷键"
            onClick={() => setHotKeys(name, store.hotKeys[name].length, '')}
          >
            <MdAdd />
          </div>
          <div
            title="恢复默认快捷键"
            onClick={() => {
              const newKeys = defaultHoeKeys[name] ?? [];
              newKeys.forEach(delHotKeys);
              setHotKeys(name, newKeys);
            }}
          >
            <MdRefresh />
          </div>
        </div>

        <Index each={keys}>
          {(_, i) => <KeyItem operateName={name} i={i} />}
        </Index>
      </div>
    )}
  </For>
);
