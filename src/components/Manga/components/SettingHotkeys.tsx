import MdClose from '@material-design-icons/svg/round/close.svg';
import MdRefresh from '@material-design-icons/svg/round/refresh.svg';
import MdAdd from '@material-design-icons/svg/round/add.svg';

import { type Component, For, Index } from 'solid-js';

import { getKeyboardCode, keyboardCodeToText } from 'helper';
import { t } from 'helper/i18n';
import {
  delHotkeys,
  focus,
  hotkeysMap,
  setHotkeys,
} from '../hooks/useStore/slice';
import { defaultHotkeys } from '../hooks/useStore/OtherState';
import { store } from '../hooks/useStore';

import classes from '../index.module.css';

const KeyItem: Component<{
  operateName: string;
  i: number;
}> = (props) => {
  const code = () => store.hotkeys[props.operateName][props.i];

  const del = () => delHotkeys(code());

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    e.preventDefault();

    switch (e.key) {
      case 'Tab':
      case 'Enter':
      case 'Escape':
        focus();
        return;

      case 'Backspace':
        setHotkeys(props.operateName, props.i, '');
        return;
    }

    const newCode = getKeyboardCode(e);
    if (!Reflect.has(hotkeysMap(), newCode))
      setHotkeys(props.operateName, props.i, newCode);
  };

  return (
    <div
      class={classes.hotkeysItem}
      tabIndex={0}
      on:keydown={handleKeyDown}
      // 如果被挂载的是空快捷键，则自动设上焦点
      ref={(ref) => code() || setTimeout(() => ref.focus())}
      // 如果失去焦点时还是空快捷键，则自动删掉
      onBlur={() => code() || del()}
    >
      {keyboardCodeToText(code())}
      {/* eslint-disable-next-line solid/no-unknown-namespaces */}
      <MdClose on:click={del} />
    </div>
  );
};

export const SettingHotkeys: Component = () => (
  <For each={Object.entries(store.hotkeys)}>
    {([name, keys]) => (
      <div class={classes.hotkeys}>
        <div class={classes.hotkeysHeader}>
          <p>{t(`hotkeys.${name}`) || name}</p>
          <span style={{ 'flex-grow': 1 }} />
          <div
            title={t('setting.hotkeys.add')}
            on:click={() => setHotkeys(name, store.hotkeys[name].length, '')}
          >
            <MdAdd />
          </div>
          <div
            title={t('setting.hotkeys.recover')}
            on:click={() => {
              const newKeys = defaultHotkeys[name] ?? [];
              newKeys.forEach(delHotkeys);
              setHotkeys(name, newKeys);
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
