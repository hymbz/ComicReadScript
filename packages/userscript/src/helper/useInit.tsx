import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { useSiteOptions } from '.';
import { useFab, useManga, useToast } from '../components';

// TODO: 对其他所有站点应用 useInit

/**
 * 对三个样式组件和 useSiteOptions 的默认值进行封装
 *
 * @param name 站点名
 */
export const useInit = async (name: string) => {
  const { options, setOptions, onOptionChange } = await useSiteOptions(name);

  const [showFab, setFab] = useFab({
    tip: '阅读模式',
    progress: 1,
    speedDial: [
      () => (
        <IconBotton
          tip="自动加载"
          placement="left"
          enabled={options.autoLoad}
          onClick={() =>
            setOptions({ ...options, autoLoad: !options.autoLoad })
          }
        >
          <AutoStories />
        </IconBotton>
      ),
    ],
  });
  onOptionChange(() => showFab());

  const [showManga, setManga] = useManga({
    imgList: [],
    onOptionChange: (option) => setOptions({ ...options, option }),
  });

  const toast = useToast();

  return {
    options,
    setOptions,
    onOptionChange,
    showFab,
    setFab,
    showManga,
    setManga,
    toast,
  };
};
