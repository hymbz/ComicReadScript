// import MdAutoStories from '@material-design-icons/svg/round/auto_stories.svg';
import MdAutoFixHigh from '@material-design-icons/svg/round/auto_fix_high.svg';
import MdAutoFixOff from '@material-design-icons/svg/round/auto_fix_off.svg';
import MdAutoFlashOn from '@material-design-icons/svg/round/flash_on.svg';
import MdAutoFlashOff from '@material-design-icons/svg/round/flash_off.svg';

import { IconButton } from '@crs/ui-component/dist/IconButton';
import type { FC } from 'react';
import type { DefaultOptions } from './useSiteOptions';

export const defaultSpeedDial = <T extends Record<string, any>>(
  options: T & DefaultOptions,
  setOptions: (
    newValue: T & DefaultOptions,
    trigger?: boolean,
  ) => Promise<void>,
) => {
  const DefaultButton: FC<{
    optionName: string;
    showName?: string;
    children?: JSX.Element | JSX.Element[];
  }> = ({ optionName, showName, children }) => {
    return (
      <IconButton
        tip={showName ?? optionName}
        placement="left"
        onClick={() =>
          setOptions({ ...options, [optionName]: !options[optionName] })
        }
      >
        {children ??
          (options[optionName] ? <MdAutoFixHigh /> : <MdAutoFixOff />)}
      </IconButton>
    );
  };

  const list = Object.keys(options).map((optionName) => {
    switch (optionName) {
      case 'hiddenFAB':
      case 'option':
        return null;

      case 'autoShow':
        return () => (
          <DefaultButton optionName="autoShow" showName="自动进入阅读模式">
            {options.autoShow ? <MdAutoFlashOn /> : <MdAutoFlashOff />}
          </DefaultButton>
        );

      default:
        return () => <DefaultButton optionName={optionName} />;
    }
  });

  return list.filter(Boolean) as Array<() => JSX.Element>;
};
