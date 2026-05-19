import MdSettings from '@material-design-icons/svg/round/settings.svg';
import { listenHotkey, setDefaultHotkeys } from 'components/Manga';
import { toast } from 'components/Toast';
import {
  PQueue,
  createEffectOn,
  createRootMemo,
  difference,
  log,
  range,
  setInitLang,
  t,
  useStore,
} from 'helper';

import { handleEsc } from './escManager';
import { type CoreContext, type CoreStore, type SiteOptions } from './types';
import { useFab } from './useFab';
import { useManga } from './useManga';
import { handleVersionUpdate } from './version';

/** 对基础的初始化操作的封装 */
export const useInit = async <T extends Record<string, unknown>>(
  name: string,
  initSiteOptions: Partial<T> = {},
) => {
  await setInitLang();
  await handleVersionUpdate();

  const defaultOptions: SiteOptions & Partial<T> = {
    option: undefined,
    defaultOption: undefined,
    autoShow: true,
    lockOption: false,
    hiddenFab: false,
    fabPosition: { top: 0, left: 0 },
    ...initSiteOptions,
  };

  const saveOptions = await GM.getValue<CoreStore<T>['options']>(name);
  // 检查清理下已保存配置的多余项
  if (saveOptions) {
    for (const key of Object.keys(saveOptions)) {
      if (Reflect.has(defaultOptions, key)) continue;
      Reflect.deleteProperty(saveOptions, key);
    }
  } else await GM.setValue(name, {});

  const { store, setState } = useStore<CoreStore<T>>({
    fab: { tip: t('other.read_mode'), show: false },
    manga: { imgList: [] },
    hotkeys: await GM.getValue<Record<string, string[]>>('@Hotkeys', {}),
    name,
    options: {
      ...structuredClone<typeof defaultOptions>(defaultOptions),
      ...saveOptions,
    } as T & SiteOptions,
    comicMap: {
      '': {
        // oxlint-disable-next-line func-name-matching
        getImgList: function init() {
          return [];
        },
      },
    },
    nowComic: '',

    flag: {
      isStored: saveOptions !== undefined,
      needAutoShow: true,
      hasPageHandler: false,
    },
  });
  setDefaultHotkeys((_hotkeys) => ({
    ..._hotkeys,
    enter_read_mode: ['v'],
    multi_select_load: ['Shift + v'],
  }));

  const { options } = store;
  const setOptions: CoreContext<T>['setOptions'] = (newOptions) => {
    setState((state) => Object.assign(state.options, newOptions));
    if (options.lockOption && newOptions?.lockOption !== false) return;
    // 只保存和默认设置不同的部分
    return GM.setValue(
      store.name,
      difference(options, defaultOptions as T & SiteOptions),
    );
  };

  const loadComic = async (id: string | number = store.nowComic) => {
    if (!Reflect.has(store.comicMap, id)) throw new Error('comic not found');

    try {
      setState('comicMap', id, 'imgList', []);
      const newImgList = await store.comicMap[id].getImgList(coreCtx);
      if (newImgList.length === 0)
        throw new Error(t('alert.fetch_comic_img_failed'));
      setState('comicMap', id, 'imgList', newImgList);
    } catch (error) {
      setState('comicMap', id, 'imgList', undefined);
      log.error(error);
      throw error;
    }
  };

  const showComic = async (id: string | number = store.nowComic) => {
    if (!Reflect.has(store.comicMap, id)) throw new Error('comic not found');
    // 如果 getImgList 还是默认的空函数，说明还未准备好，直接 return 防止报错
    if (store.comicMap[id].getImgList?.name === 'init') return;
    if (id !== store.nowComic) setState('nowComic', id);

    switch (store.comicMap[id].imgList?.length) {
      case 0:
        return toast.warn(t('alert.repeat_load'), { duration: 1500 });

      case undefined: {
        try {
          await loadComic(id);
          setState('flag', 'needAutoShow', false);
        } catch (error) {
          return toast.error((error as Error).message);
        }
      }
    }
    setState('manga', 'show', true);
  };

  let inited = false;
  const init = (autoShow = true) => {
    if (inited) return;
    inited = true;

    setState('fab', {
      onClick: () => void showComic(),
    });

    if (autoShow && store.flag.needAutoShow && options.autoShow)
      void showComic();

    (async () => {
      await GM.registerMenuCommand(
        t('other.enter_comic_read_mode'),
        () => void showComic(),
      );
      await updateHideFabMenu();
    })();

    listenHotkey(
      {
        enter_read_mode: () => showComic(),
        Escape: () => handleEsc() || 'SKIP',
      },
      true,
    );
  };

  // 首次设置默认漫画的加载函数时，进行初始化
  createEffectOn(
    () => store.comicMap[''].getImgList,
    (_, prev) => !prev && init(),
    { defer: true },
  );

  const canLoadComic = createRootMemo(() =>
    Object.entries(store.comicMap).some(
      ([key, entry]) =>
        key !== 'multiSelect' && entry.getImgList?.name !== 'init',
    ),
  );

  const canMultiSelect = createRootMemo(() => 'multiSelect' in store.comicMap);

  const coreCtx: CoreContext<T> = {
    store,
    setState,
    options,
    setOptions,
    loadComic,
    showComic,
    init,
    canLoadComic,
    canMultiSelect,

    dynamicLoad: async (loadImgFn, length, id = '') => {
      if (store.comicMap[id].imgList?.length) return store.comicMap[id].imgList;

      const imgNum = typeof length === 'number' ? length : length();
      setState('comicMap', id, 'imgList', range(imgNum, ''));
      // oxlint-disable-next-line typescript/no-misused-promises typescript/strict-void-return
      await new Promise<void>(async (resolve) => {
        try {
          await loadImgFn((i, img) => {
            setState('comicMap', id, 'imgList', (list) => list!.with(i, img));
            resolve();
          });
        } catch (error) {
          toast.error((error as Error).message);
        }
      });
      return store.comicMap[id].imgList!;
    },

    dynamicLazyLoad: async ({
      loadImg,
      length,
      id = '',
      concurrency = 4,
      onLoad,
    }) => {
      if (store.comicMap[id].imgList?.length) return store.comicMap[id].imgList;

      const imgNum = typeof length === 'number' ? length : length();

      await new Promise<void>((resolve) => {
        const queue = new PQueue<number>(async (i) => {
          const img = await loadImg(i);
          setState('comicMap', id, 'imgList', (list) => list!.with(i, img));
          resolve();
          onLoad?.(img, i, store.comicMap[id].imgList!);
        }, concurrency);

        setState((state) => {
          state.comicMap[id].imgList = range(imgNum, '');
          state.manga.onWaitUrlImgs = (imgs) => queue.set(...imgs);
        });
      });

      return store.comicMap[id].imgList!;
    },
  };

  const nowImgList = createRootMemo(() => {
    const comic = store.comicMap[store.nowComic];
    if (!comic?.imgList) return;
    if (!comic.adList?.size) return comic.imgList;
    return comic.imgList.filter((_, i) => !comic.adList?.has(i));
  });

  createEffectOn(
    nowImgList,
    (list) => list && setState('manga', 'imgList', list),
  );

  useFab(coreCtx, nowImgList);
  useManga(coreCtx);

  let menuId: number;
  /** 更新显示/隐藏悬浮按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(
      options.hiddenFab ? t('other.fab_show') : t('other.fab_hidden'),
      () => {
        setOptions({ hiddenFab: !options.hiddenFab });
        return updateHideFabMenu();
      },
    );
  };

  await GM.registerMenuCommand(t('site.show_settings_menu'), () =>
    setState('fab', {
      show: true,
      focus: true,
      tip: t('other.setting'),
      children: <MdSettings />,
      onBackdropClick: () => setState('fab', { show: false, focus: false }),
    }),
  );

  if (isDevMode)
    Object.assign(unsafeWindow, { coreCtx, toast, coreStore: store });

  return coreCtx;
};
