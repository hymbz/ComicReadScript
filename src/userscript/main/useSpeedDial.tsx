import MdAutoFixHigh from '@material-design-icons/svg/round/auto_fix_high.svg';
import MdAutoFixOff from '@material-design-icons/svg/round/auto_fix_off.svg';
import MdFlashOn from '@material-design-icons/svg/round/flash_on.svg';
import MdFlashOff from '@material-design-icons/svg/round/flash_off.svg';
import MdLockOpen from '@material-design-icons/svg/round/lock_open.svg';
import MdLock from '@material-design-icons/svg/round/lock.svg';
import type { Component, JSX } from 'solid-js';
import { IconButton } from 'components/IconButton';
import { t } from 'helper';

import type { SiteOptions } from './useSiteOptions';

export const useSpeedDial = <
  T extends Record<string, any>,
  SaveOptions extends T & SiteOptions = T & SiteOptions,
>(
  options: SaveOptions,
  setOptions: (newOptions: Partial<SaveOptions>) => Promise<void>,
  placement: () => 'left' | 'right',
) => {
  const DefaultButton: Component<{
    optionName: keyof SaveOptions & string;
    showName?: string;
    children?: JSX.Element;
  }> = (props) => (
    <IconButton
      placement={placement()}
      showTip={true}
      tip={
        props.showName ??
        (t(`site.add_feature.${props.optionName}`) || props.optionName)
      }
      onClick={() =>
        setOptions({
          [props.optionName]: !options[props.optionName],
        } as Partial<SaveOptions>)
      }
      children={
        props.children ??
        (options[props.optionName] ? <MdAutoFixHigh /> : <MdAutoFixOff />)
      }
    />
  );

  const list = Object.keys(options)
    .map((optionName) => {
      switch (optionName) {
        case 'hiddenFAB':
        case 'option':
          return null;

        case 'autoShow':
          return () => (
            <DefaultButton
              optionName="autoShow"
              showName={t('site.add_feature.auto_show')}
              children={options.autoShow ? <MdFlashOn /> : <MdFlashOff />}
            />
          );
        case 'lockOption':
          return () => (
            <DefaultButton
              optionName="lockOption"
              showName={t('site.add_feature.lock_option')}
              children={options.lockOption ? <MdLock /> : <MdLockOpen />}
            />
          );

        default:
          if (typeof options[optionName] !== 'boolean') return null;
          return () => <DefaultButton optionName={optionName} />;
      }
    })
    .filter(Boolean) as Component[];

  return list;
};
