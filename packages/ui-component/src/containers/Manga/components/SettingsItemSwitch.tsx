import { useCallback } from 'react';
import { SettingsItem } from './SettingsItem';

import classes from '../index.module.css';

export interface SettingsItemSwitchProps {
  name: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

/**
 * 开关式菜单项
 *
 * @param param param
 */
export const SettingsItemSwitch: React.FC<SettingsItemSwitchProps> = ({
  name,
  value,
  onChange,
}) => {
  const handleClick = useCallback(() => {
    onChange(!value);
  }, [onChange, value]);

  return (
    <SettingsItem name={name}>
      <button
        className={classes.SettingsItemSwitch}
        type="button"
        onClick={handleClick}
      >
        <div
          className={classes.SettingsItemSwitchRound}
          style={{ transform: value ? 'translateX(110%)' : 'translateX(-10%)' }}
        />
      </button>
    </SettingsItem>
  );
};
