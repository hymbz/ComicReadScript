import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { useFab } from '../components/Fab';
import type { MangaRecipe } from '../components/Manga';
import { useManga } from '../components/Manga';
import { isEqualArray, useSiteOptions } from '../helper';

setTimeout(async () => {
  const { options, setOptions, isRecorded } = await useSiteOptions(
    window.location.hostname,
    {
      option: undefined as MangaProps['option'] | undefined,
      autoLoad: false,
    },
  );

  /** 图片列表 */
  let imgList: string[] = [];
  /** 是否在等待自动加载完毕后进入阅读模式 */
  const waitAutoLoad = options.autoLoad;
  /** 是否正在后台不断检查图片 */
  let running = 0;

  let showManga: (recipe?: MangaRecipe | undefined) => void | undefined;
  let setManga: (recipe: MangaRecipe) => void | undefined;
  /** 当前是否处于阅读模式 */
  let isReadMode: boolean;

  const initUseManga = () => {
    if (showManga === undefined) {
      [showManga, setManga, isReadMode] = useManga({
        imgList,
        onOptionChange: (option) => setOptions({ ...options, option }),
      });
    }
  };

  /** 显示 Fab */
  const showFab = () => {
    useFab({
      tip: '阅读模式',
      onClick: () => {
        showManga();
      },
      speedDial: [
        <IconBotton
          tip="自动加载"
          placement="left"
          enabled={options.autoLoad}
          onClick={() =>
            setOptions({ ...options, autoLoad: !options.autoLoad })
          }
        >
          <AutoStories />
        </IconBotton>,
      ],
    })[0]();
  };
  // 如果网站有储存配置，就直接显示 Fab
  if (isRecorded) showFab();

  /**
   * 检查搜索页面上符合标准的图片
   *
   * @returns 返回是否成功找到图片
   */
  const checkFindImg = () => {
    const newImgList = [...document.getElementsByTagName('img')]
      .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
      .map((e) => e.src);

    if (newImgList.length === 0) {
      if (!options.autoLoad) {
        clearInterval(running);
        // eslint-disable-next-line no-alert
        alert('没有找到图片');
      }
      return false;
    }

    // 在发现新图片后重新渲染
    if (!isEqualArray(imgList, newImgList)) {
      imgList = newImgList;

      if (isReadMode) {
        showManga?.((draftProps) => {
          draftProps.imgList = imgList;
        });
      } else {
        setManga?.((draftProps) => {
          draftProps.imgList = imgList;
        });
      }

      if (waitAutoLoad) showManga();
    }

    return true;
  };

  if (isRecorded) {
    initUseManga();
    // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
    running = window.setInterval(checkFindImg, 2000);
  }

  await GM.registerMenuCommand('进入漫画阅读模式', async () => {
    initUseManga();

    if (!running) running = window.setInterval(checkFindImg, 2000);
    if (!checkFindImg()) return;
    showManga();

    // 自动启用自动加载功能
    await setOptions({ ...options, autoLoad: true });
    showFab();
  });
});
