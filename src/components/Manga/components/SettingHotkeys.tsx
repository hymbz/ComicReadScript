import MdClose from '@material-design-icons/svg/round/close.svg';
import MdRefresh from '@material-design-icons/svg/round/refresh.svg';
import MdAdd from '@material-design-icons/svg/round/add.svg';
import { type Component, For, Index } from 'solid-js';
import { getKeyboardCode, isEqual, keyboardCodeToText } from 'helper';
import { t } from 'helper/i18n';

import { _setState, store } from '../store';
import { defaultHotkeys, focus, hotkeysMap } from '../actions';
import classes from '../index.module.css';

const setHotkeys = (...args: any[]) => {
  _setState(...(['hotkeys', ...args] as [any]));
  store.prop.HotkeysChange?.(
    Object.fromEntries(
      Object.entries(store.hotkeys).filter(
        ([name, keys]) =>
          !isEqual(keys.filter(Boolean), defaultHotkeys()[name]),
      ),
    ),
  );
};

const delHotkeys = (code: string) => {
  for (const [name, keys] of Object.entries(store.hotkeys)) {
    const i = keys.indexOf(code);
    if (i === -1) continue;

    const newKeys = [...store.hotkeys[name]];
    newKeys.splice(i, 1);
    setHotkeys(name, newKeys);
  }
};

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
      <MdClose on:click={del} />
    </div>
  );
};

export const SettingHotkeys: Component = () => (
  <For each={Object.keys(defaultHotkeys())}>
    {(name) => (
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
            title={t('setting.hotkeys.restore')}
            on:click={() => {
              const newKeys = defaultHotkeys()[name] ?? [];
              for (const code of defaultHotkeys()[name]) delHotkeys(code);
              setHotkeys(name, newKeys);
            }}
          >
            <MdRefresh />
          </div>
        </div>

        <Index each={store.hotkeys[name]}>
          {(_, i) => <KeyItem operateName={name} i={i} />}
        </Index>
      </div>
    )}
  </For>
);
