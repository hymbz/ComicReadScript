import MdSettings from '@material-design-icons/svg/round/settings.svg';
import { createSignal } from 'solid-js';

import { hotkeysMap, useManga } from '../components/useComponents/Manga';
import { useFab } from '../components/useComponents/Fab';
import { toast } from '../components/useComponents/Toast';
import { type MangaProps } from '../components/Manga';
import { setDefaultHotkeys } from '../components/Manga/actions';

import { setInitLang, t } from './i18n';
import { log } from './logger';
import { handleVersionUpdate } from './version';
import { type SiteOptions, useSiteOptions } from './useSiteOptions';
import { useSpeedDial } from './useSpeedDial';

import { getKeyboardCode, linstenKeydown } from '.';

export const [hotkeys, setHotkeys] = createSignal<Record<string, string[]>>({});

/**
 * 对基础的初始化操作的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useInit = async <T extends Record<string, any>>(
  name: string,
  defaultOptions = {} as T,
) => {
  await setInitLang();

  await handleVersionUpdate();

  const { options, setOptions, isStored } = await useSiteOptions(
    name,
    defaultOptions,
  );

  const [setFab, fabProps] = await useFab({
    tip: t('other.read_mode'),
    speedDial: useSpeedDial(options, setOptions),
    show: false,
  });

  /** 处理 Manga 组件的 onLoading 回调，将图片加载状态联动到 Fab 上 */
  const onLoading: MangaProps['onLoading'] = (list, img) => {
    if (list.length === 0 || !img) return;

    const loadNum = list.filter((image) => image.loadType === 'loaded').length;

    /** 图片加载进度 */
    const progress = 1 + loadNum / list.length;
    if (progress === 2)
      // 图片全部加载完成后恢复 Fab 状态
      setFab({
        progress,
        tip: t('other.read_mode'),
        show: !options.hiddenFAB && undefined,
      });
    else
      setFab({
        progress,
        tip: `${t('other.img_loading')} - ${loadNum}/${list.length}`,
      });
  };

  setHotkeys(await GM.getValue<Record<string, string[]>>('Hotkeys', {}));
  setDefaultHotkeys((hotkeys) => ({ ...hotkeys, enter_read_mode: ['v'] }));

  const [setManga, mangaProps] = await useManga({
    imgList: [],
    onLoading,

    option: options.option,
    defaultOption: options.defaultOption,
    onOptionChange: (option) =>
      setOptions({ option } as Partial<T & SiteOptions>),

    hotkeys: hotkeys(),
    onHotkeysChange(newValue: Record<string, string[]>) {
      GM.setValue('Hotkeys', newValue);
      setHotkeys(newValue);
    },
  });

  let menuId: number;
  /** 更新显示/隐藏悬浮按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(
      options.hiddenFAB ? t('other.fab_show') : t('other.fab_hidden'),
      async () => {
        await setOptions({ ...options, hiddenFAB: !options.hiddenFAB });
        setFab('show', !options.hiddenFAB && undefined);
        await updateHideFabMenu();
      },
    );
  };

  await GM.registerMenuCommand(t('site.show_settings_menu'), () =>
    setFab({
      show: true,
      focus: true,
      tip: t('site.settings_tip'),
      children: <MdSettings />,
      onBackdropClick: () => setFab({ show: false, focus: false }),
    }),
  );

  /** 当前是否还需要判断 autoShow */
  const needAutoShow = { val: true };

  return {
    options,
    setOptions,
    setFab,
    setManga,
    mangaProps,
    fabProps,
    needAutoShow,
    isStored,
    /** Manga 组件的默认 onLoading */
    onLoading,

    /**
     * 对 加载图片 和 进入阅读模式 相关初始化的封装
     * @param getImgList 返回图片列表的函数
     * @returns 自动加载图片并进入阅读模式的函数
     */
    init(getImgList: () => Promise<string[]> | string[]) {
      const firstRun = menuId === undefined;

      /** 是否正在加载图片中 */
      let loading = false;

      /** 加载 imgList */
      const loadImgList = async (initImgList?: string[], show?: boolean) => {
        loading = true;
        try {
          if (!initImgList) setFab({ progress: 0, show: true });
          const newImgList = initImgList ?? (await getImgList());
          if (newImgList.length === 0)
            throw new Error(t('alert.fetch_comic_img_failed'));
          setManga('imgList', newImgList);
          if (show || (needAutoShow.val && options.autoShow)) {
            setManga('show', true);
            needAutoShow.val = false;
          }
        } catch (error) {
          log.error(error);
          if (show) toast.error((error as Error).message);
          setFab({ progress: undefined });
        } finally {
          loading = false;
        }
      };

      /** 进入阅读模式 */
      const showComic = async () => {
        if (loading)
          return toast.warn(t('alert.repeat_load'), { duration: 1500 });

        if (mangaProps.imgList.length === 0)
          return loadImgList(undefined, true);

        setManga('show', true);
      };

      setFab({ onClick: showComic, show: !options.hiddenFAB && undefined });

      if (needAutoShow.val && options.autoShow) setTimeout(showComic);

      if (firstRun) {
        (async () => {
          await GM.registerMenuCommand(
            t('other.enter_comic_read_mode'),
            fabProps.onClick!,
          );
          await updateHideFabMenu();
        })();

        linstenKeydown((e) => {
          const code = getKeyboardCode(e);
          if (hotkeysMap()[code] !== 'enter_read_mode') return;
          e.stopPropagation();
          e.preventDefault();
          fabProps.onClick?.();
        });
      }

      return {
        /** 进入阅读模式 */
        showComic,
        /** 加载 imgList */
        loadImgList,
      };
    },

    /** 使用动态更新来加载 imgList */
    dynamicUpdate:
      (
        work: (setImg: (i: number, url: string) => void) => Promise<unknown>,
        length: number,
      ) =>
      async () => {
        if (mangaProps.imgList.length === length) return mangaProps.imgList;

        await new Promise((resolve) => {
          setManga('imgList', Array.from<string>({ length }).fill(''));
          return work((i, url) => resolve(setManga('imgList', i, url)));
        });
        return mangaProps.imgList;
      },
  };
};
