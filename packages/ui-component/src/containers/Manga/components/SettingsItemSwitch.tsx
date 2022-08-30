import { useCallback } from 'react';
import { SettingsItem } from './SettingsItem';

export interface SettingsItemSwitchProps {
  name: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

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
        className="h-.8em w-2.3em inline-flex cursor-pointer items-center rounded-full border-0 bg-[#9b9b9b] p-0"
        type="button"
        onClick={handleClick}
      >
        <div
          className="w-1.15em h-1.15em bg-light-100 transition-margin rounded-full"
          style={{ marginLeft: value ? '1.2em' : 0 }}
        />
      </button>

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </SettingsItem>
  );
};
