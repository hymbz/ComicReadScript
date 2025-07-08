import type { Component, JSX } from 'solid-js';

import MdAutoFixHigh from '@material-design-icons/svg/round/auto_fix_high.svg';
import MdAutoFixOff from '@material-design-icons/svg/round/auto_fix_off.svg';
import MdFlashOff from '@material-design-icons/svg/round/flash_off.svg';
import MdFlashOn from '@material-design-icons/svg/round/flash_on.svg';
import MdLockOpen from '@material-design-icons/svg/round/lock_open.svg';
import MdLock from '@material-design-icons/svg/round/lock.svg';

import { IconButton } from 'components/IconButton';
import { createEffectOn, t } from 'helper';

import type { MainContext, SiteOptions } from '.';

export const useSpeedDial = <
  T extends Record<string, any>,
  SaveOptions extends T & SiteOptions = T & SiteOptions,
>({
  store,
  setState,
  options,
  setOptions,
}: MainContext<T>) => {
  const DefaultButton: Component<{
    optionName: keyof SaveOptions & string;
    showName?: string;
    children?: JSX.Element;
  }> = (props) => (
    <IconButton
      placement={store.fab.placement}
      showTip={true}
      tip={
        props.showName ??
        (t(`site.add_feature.${props.optionName}`) ||
          t(`other.${props.optionName}`) ||
          props.optionName)
      }
      onClick={() =>
        setOptions({ [props.optionName]: !options[props.optionName] })
      }
      children={
        props.children ??
        (options[props.optionName] ? <MdAutoFixHigh /> : <MdAutoFixOff />)
      }
    />
  );

  createEffectOn(
    () => store.fab.otherSpeedDial,
    () => {
      const list: Component[] = [
        () => (
          <DefaultButton
            optionName="autoShow"
            showName={t('site.add_feature.auto_show')}
            children={options.autoShow ? <MdFlashOn /> : <MdFlashOff />}
          />
        ),
        () => (
          <DefaultButton
            optionName="lockOption"
            showName={t('site.add_feature.lock_option')}
            children={options.lockOption ? <MdLock /> : <MdLockOpen />}
          />
        ),
      ];

      if (store.fab.otherSpeedDial) {
        for (const optionName of store.fab.otherSpeedDial)
          list.push(() => <DefaultButton optionName={optionName} />);
      } else {
        for (const optionName of Object.keys(options)) {
          switch (optionName) {
            case 'hiddenFAB':
            case 'option':
            case 'autoShow':
            case 'lockOption':
              continue;

            default:
              if (typeof options[optionName] === 'boolean')
                list.push(() => <DefaultButton optionName={optionName} />);
          }
        }
      }

      setState('fab', 'speedDial', list);
    },
  );
};
