import MdAutoFixHigh from '@material-design-icons/svg/round/auto_fix_high.svg';
import MdAutoFixOff from '@material-design-icons/svg/round/auto_fix_off.svg';
import MdFlashOff from '@material-design-icons/svg/round/flash_off.svg';
import MdFlashOn from '@material-design-icons/svg/round/flash_on.svg';
import MdLock from '@material-design-icons/svg/round/lock.svg';
import MdLockOpen from '@material-design-icons/svg/round/lock_open.svg';
import { IconButton } from 'components/IconButton';
import { createEffectOn, t } from 'helper';
import { type Component, type JSX } from 'solid-js';

import { type CoreContext, type SiteOptions } from './types';

export const useSpeedDial = <
  T extends Record<string, any>,
  SaveOptions extends T & SiteOptions = T & SiteOptions,
>({
  store,
  setState,
  options,
  setOptions,
}: CoreContext<T>) => {
  const OptionButton: Component<{
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
    () => [
      store.fab.optionsSpeedDial,
      store.fab.extraSpeedDial,
      store.fab.overrideSpeedDial,
    ],
    () => {
      if (store.fab.overrideSpeedDial)
        return setState(
          'fab',
          'speedDial',
          store.fab.overrideSpeedDial.map((btn) => () => (
            <IconButton
              placement={store.fab.placement}
              showTip={true}
              tip={btn.name}
              onClick={btn.onClick}
              children={btn.icon({})}
            />
          )),
        );

      const list: Component[] = [
        () => (
          <OptionButton
            optionName="autoShow"
            showName={t('site.add_feature.auto_show')}
            children={options.autoShow ? <MdFlashOn /> : <MdFlashOff />}
          />
        ),
        () => (
          <OptionButton
            optionName="lockOption"
            showName={t('site.add_feature.lock_option')}
            children={options.lockOption ? <MdLock /> : <MdLockOpen />}
          />
        ),
      ];

      if (store.fab.extraSpeedDial) {
        for (const btn of store.fab.extraSpeedDial) {
          list.push(() => (
            <IconButton
              placement={store.fab.placement}
              showTip={true}
              tip={btn.name}
              onClick={btn.onClick}
              children={btn.icon({})}
            />
          ));
        }
      }

      if (store.fab.optionsSpeedDial) {
        for (const optionName of store.fab.optionsSpeedDial)
          list.push(() => <OptionButton optionName={optionName} />);
      } else {
        for (const optionName of Object.keys(options)) {
          switch (optionName) {
            case 'hiddenFab':
            case 'option':
            case 'autoShow':
            case 'lockOption':
              continue;

            default:
              if (typeof options[optionName] === 'boolean')
                list.push(() => <OptionButton optionName={optionName} />);
          }
        }
      }

      setState('fab', 'speedDial', list);
    },
  );
};
