import MdAutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconButton } from '@crs/ui-component/dist/IconButton';
import type { DefaultOptions } from './useSiteOptions';

export const defaultSpeedDial = <T extends Record<string, any>>(
  options: T & DefaultOptions,
  setOptions: (
    newValue: T & DefaultOptions,
    trigger?: boolean,
  ) => Promise<void>,
) => {
  const switchAutoShow = () => (
    <IconButton
      tip={`自动进入阅读模式：${options.autoShow ? '开' : '关'}`}
      placement="left"
      enabled={options.autoShow}
      onClick={() => setOptions({ ...options, autoShow: !options.autoShow })}
    >
      <MdAutoStories />
    </IconButton>
  );

  return [switchAutoShow];
};
