import MdAutoFixHigh from '@material-design-icons/svg/round/auto_fix_high.svg';
import MdAutoFixOff from '@material-design-icons/svg/round/auto_fix_off.svg';
import MdAutoFlashOn from '@material-design-icons/svg/round/flash_on.svg';
import MdAutoFlashOff from '@material-design-icons/svg/round/flash_off.svg';
import type { Component, JSX } from 'solid-js';
import { IconButton } from 'components/IconButton';
import { t } from 'helper';

import type { SiteOptions } from './useSiteOptions';

export const useSpeedDial = <T extends Record<string, any>>(
  options: T & SiteOptions,
  setOptions: (newValue: T & SiteOptions, trigger?: boolean) => Promise<void>,
) => {
  const DefaultButton: Component<{
    optionName: string;
    showName?: string;
    children?: JSX.Element;
  }> = (props) => (
    <IconButton
      tip={
        props.showName ??
        (t(`site.add_feature.${props.optionName}`) || props.optionName)
      }
      placement="left"
      showTip={true}
      onClick={() =>
        setOptions({
          ...options,
          [props.optionName]: !options[props.optionName],
        })
      }
    >
      {props.children ??
        (options[props.optionName] ? <MdAutoFixHigh /> : <MdAutoFixOff />)}
    </IconButton>
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
              showName={t('other.auto_enter_read_mode')}
            >
              {options.autoShow ? <MdAutoFlashOn /> : <MdAutoFlashOff />}
            </DefaultButton>
          );

        default:
          if (typeof options[optionName] !== 'boolean') return null;
          return () => <DefaultButton optionName={optionName} />;
      }
    })
    .filter(Boolean) as Component[];

  return list;
};
