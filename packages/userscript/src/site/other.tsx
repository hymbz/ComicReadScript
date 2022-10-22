import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { FabRecipe } from '../components';
import { useToast, useManga, useFab } from '../components';
import type { MangaRecipe } from '../components/Manga';
import { useSiteOptions } from '../helper/useSiteOptions';
import { isEqualArray } from '../helper';

setTimeout(async () => {
  const { options, setOptions, isRecorded, onOptionChange } =
    await useSiteOptions(window.location.hostname, { autoLoad: false });

  /** 图片列表 */
  let imgList: string[] = [];
  /** 是否在等待自动加载完毕后进入阅读模式 */
  const waitAutoLoad = options.autoLoad;
  /** 是否正在后台不断检查图片 */
  let running = 0;

  let showManga: (recipe?: MangaRecipe | undefined) => void;
  let setManga: (recipe: MangaRecipe) => void;
  let showFab: ((recipe?: FabRecipe | undefined) => void) | undefined;
  let toast: ReturnType<typeof useToast>;

  /** 当前是否处于阅读模式 */
  let isReadMode: boolean;

  const init = () => {
    if (showManga !== undefined) return;

    [showManga, setManga, isReadMode] = useManga({
      imgList,
      onOptionChange: (option) => setOptions({ ...options, option }, false),
    });

    [showFab] = useFab({
      tip: '阅读模式',
      onClick: () => showManga(),
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
    onOptionChange(() => showFab?.());

    toast = useToast();
  };
  // 如果网站有储存配置，就直接显示 Fab
  if (isRecorded) {
    init();
    showFab?.();
  }

  /** 已经被触发过懒加载的图片 */
  const triggedImgList: Set<HTMLImageElement> = new Set();
  /** 触发懒加载 */
  const triggerLazyLoad = () => {
    const targetImgList = [...document.getElementsByTagName('img')]
      // 过滤掉已经被触发过懒加载的图片
      .filter((e) => !triggedImgList.has(e))
      // 根据位置从小到大排序
      .sort((a, b) => a.offsetTop - b.offsetTop);

    /** 上次触发的图片 */
    let lastTriggedImg: HTMLImageElement | undefined;
    targetImgList.forEach((e) => {
      triggedImgList.add(e);

      // 过滤掉位置相近，在触发上一张图片时已经顺带被触发了的
      if (e.offsetTop >= (lastTriggedImg?.offsetTop ?? 0) + window.innerHeight)
        return;

      // 通过瞬间滚动到图片位置、触发滚动事件、再瞬间滚回来，来触发图片的懒加载
      const nowScroll = window.scrollY;
      window.scroll({ top: e.offsetTop, behavior: 'auto' });
      e.dispatchEvent(new Event('scroll', { bubbles: true }));
      window.scroll({ top: nowScroll, behavior: 'auto' });

      lastTriggedImg = e;
    });
  };

  /**
   * 检查搜索页面上符合标准的图片
   *
   * @returns 返回是否成功找到图片
   */
  const checkFindImg = () => {
    triggerLazyLoad();

    const newImgList = [...document.getElementsByTagName('img')]
      .filter((e) => e.naturalHeight > 500 && e.naturalWidth > 500)
      .map((e) => e.src);

    if (newImgList.length === 0) {
      if (!options.autoLoad) {
        clearInterval(running);
        toast?.('没有找到图片', { type: 'warning' });
      }
      return false;
    }

    // 在发现新图片后重新渲染
    if (!isEqualArray(imgList, newImgList)) {
      imgList = newImgList;

      if (isReadMode) {
        showManga?.({ imgList });
      } else {
        setManga?.({ imgList });
      }

      if (waitAutoLoad) showManga();

      showFab?.({ progress: 1 });
    }

    return true;
  };

  if (isRecorded) {
    init();
    // 为了保证兼容，只能简单粗暴的不断检查网页的图片来更新数据
    running = window.setInterval(checkFindImg, 2000);
  }

  await GM.registerMenuCommand('进入漫画阅读模式', async () => {
    init();

    if (!running) running = window.setInterval(checkFindImg, 2000);
    if (!checkFindImg()) return;
    showManga();

    // 自动启用自动加载功能
    await setOptions({ ...options, autoLoad: true });
    showFab?.();
  });
});
