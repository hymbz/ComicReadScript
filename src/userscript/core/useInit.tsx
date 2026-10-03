import MdSettings from '@material-design-icons/svg/round/settings.svg';
import { listenHotkey, setDefaultHotkeys } from 'components/Manga';
import { toast } from 'components/Toast';
import {
  PQueue,
  createEffectOn,
  createRootMemo,
  difference,
  exposeToGlobal,
  log,
  once,
  range,
  setInitLang,
  t,
  useStore,
} from 'helper';

import { handleEsc } from './escManager';
import { multiSelectController } from './multiSelect';
import { useReadProgress } from './readProgress';
import { type CoreContext, type CoreStore, type SiteOptions } from './types';
import { useFab } from './useFab';
import { useImgList } from './useImgList';
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
    imgListMap: {
      '': {
        getImgList: Object.assign(() => [], { type: 'init' as const }),
      },
    },
    currentImgListId: '',

    flag: {
      isStored: saveOptions !== undefined,
      needAutoShow: true,
      hasPageHandler: false,
      isChapterMode: false,
    },
  });
  setDefaultHotkeys((_hotkeys) => ({
    ..._hotkeys,
    enter_read_mode: ['v'],
    multi_select_load: ['Shift + v'],
  }));

  const { options } = store;
  const setOptions: CoreContext<T>['setOptions'] = (newOptions) => {
    const wasLocked = options.lockOption;
    setState((state) => Object.assign(state.options, newOptions));
    if (wasLocked && newOptions?.lockOption !== false) return;
    // 只保存和默认设置不同的部分
    return GM.setValue(
      store.name,
      difference(options, defaultOptions as T & SiteOptions),
    );
  };

  const loadComic = async (id: string | number = store.currentImgListId) => {
    if (!Reflect.has(store.imgListMap, id))
      throw new Error('imgList not found');

    // 记录本次调用的 loader，用于之后检查是否过期
    const { getImgList } = store.imgListMap[id];

    try {
      setState('imgListMap', id, 'imgList', []);
      const newImgList = await getImgList(coreCtx);
      if (newImgList.length === 0)
        throw new Error(t('alert.fetch_comic_img_failed'));
      if (store.imgListMap[id]?.getImgList !== getImgList) return;
      setState('imgListMap', id, 'imgList', newImgList);
    } catch (error) {
      if (store.imgListMap[id]?.getImgList !== getImgList) return;
      setState('imgListMap', id, 'imgList', undefined);
      log.error(error);
      throw error;
    }
  };

  const showComic = async (id: string | number = store.currentImgListId) => {
    if (!Reflect.has(store.imgListMap, id))
      throw new Error('imgList not found');
    // 如果 getList 还是默认的空函数，说明还未准备好，直接 return 防止报错
    if (store.imgListMap[id].getImgList?.type === 'init') return;
    if (id !== store.currentImgListId) setState('currentImgListId', id);

    switch (store.imgListMap[id].imgList?.length) {
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

  const init = once((autoShow = true) => {
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
  });

  const canLoadComic = createRootMemo(() =>
    Object.values(store.imgListMap).some(
      (entry) => entry.getImgList?.type === undefined,
    ),
  );

  // 从无可加载漫画变为有可加载漫画时，进行初始化
  createEffectOn(canLoadComic, (canLoad, prev) => canLoad && !prev && init(), {
    defer: true,
  });

  const canMultiSelect = createRootMemo(() => Boolean(multiSelectController()));

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
      if (store.imgListMap[id].imgList?.length)
        return store.imgListMap[id].imgList;

      const imgNum = typeof length === 'number' ? length : length();
      setState('imgListMap', id, 'imgList', range(imgNum, ''));
      // oxlint-disable-next-line typescript/no-misused-promises typescript/strict-void-return
      await new Promise<void>(async (resolve) => {
        try {
          await loadImgFn((i, img) => {
            setState('imgListMap', id, 'imgList', (list) => list!.with(i, img));
            resolve();
          });
        } catch (error) {
          toast.error((error as Error).message);
        }
      });
      return store.imgListMap[id].imgList!;
    },

    dynamicLazyLoad: async ({ loadImg, length, id = '', concurrency = 2 }) => {
      if (store.imgListMap[id].imgList?.length)
        return store.imgListMap[id].imgList;

      const imgNum = typeof length === 'number' ? length : length();

      await new Promise<void>((resolve) => {
        const queue = new PQueue<number>(async (i) => {
          try {
            const img = await loadImg(i);
            setState('imgListMap', id, 'imgList', (list) => list!.with(i, img));
          } finally {
            resolve();
          }
        }, concurrency);

        setState((state) => {
          state.imgListMap[id].imgList = range(imgNum, '');
          state.manga.onWaitUrlImgs = (imgs) => queue.set(...imgs);
        });
      });

      return store.imgListMap[id].imgList!;
    },
  };

  const currentImgList = createRootMemo(() => {
    const entry = store.imgListMap[store.currentImgListId];
    if (!entry?.imgList) return;
    if (!entry.adList?.size) return entry.imgList;
    return entry.imgList.filter((_, i) => !entry.adList?.has(i));
  });

  useReadProgress(coreCtx);
  useImgList(coreCtx, currentImgList);

  createEffectOn(
    () => store.imgListMap[store.currentImgListId]?.commentList,
    (list) => setState('manga', 'commentList', list ?? []),
  );

  useFab(coreCtx, currentImgList);
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
    exposeToGlobal({ coreCtx, toast, coreStore: store, siteOptions: options });

  return coreCtx;
};
