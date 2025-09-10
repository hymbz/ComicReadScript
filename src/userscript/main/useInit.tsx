import type { Accessor } from 'solid-js';

import MdSettings from '@material-design-icons/svg/round/settings.svg';

import { hotkeysMap, imgList, setDefaultHotkeys } from 'components/Manga';
import { toast } from 'components/Toast';
import {
  createEffectOn,
  createRootMemo,
  difference,
  getKeyboardCode,
  linstenKeydown,
  log,
  setInitLang,
  t,
  useStore,
} from 'helper';

import type { LoadImgFn, MainContext, MainStore, SiteOptions } from '.';

import { useFab } from './useFab';
import { useManga } from './useManga';
import { handleVersionUpdate } from './version';

/** 对基础的初始化操作的封装 */
export const useInit = async <T extends Record<string, any>>(
  name: string,
  initSiteOptions = {} as T,
) => {
  await setInitLang();
  await handleVersionUpdate();

  const defaultOptions = {
    option: undefined,
    defaultOption: undefined,
    autoShow: true,
    lockOption: false,
    hiddenFAB: false,
    fabPosition: { top: 0, left: 0 },
    ...initSiteOptions,
  };

  const saveOptions = await GM.getValue<MainStore<T>['options']>(name);
  // 检查清理下已保存配置的多余项
  if (saveOptions) {
    for (const key of Object.keys(saveOptions)) {
      if (Reflect.has(defaultOptions, key)) continue;
      Reflect.deleteProperty(saveOptions, key);
    }
  } else await GM.setValue(name, {});

  const { store, setState } = useStore<MainStore<T>>({
    fab: { tip: t('other.read_mode'), show: false },
    manga: { imgList: [] },
    hotkeys: await GM.getValue<Record<string, string[]>>('@Hotkeys', {}),
    name,
    options: {
      ...structuredClone(defaultOptions),
      ...saveOptions,
    },
    comicMap: {
      '': {
        getImgList: function init() {
          return [];
        },
      },
    },
    nowComic: '',

    flag: {
      isStored: saveOptions !== undefined,
      needAutoShow: true,
    },
  });
  setDefaultHotkeys((_hotkeys) => ({ ..._hotkeys, enter_read_mode: ['v'] }));

  const { options } = store;
  const setOptions: MainContext<T>['setOptions'] = function (newOptions) {
    if (newOptions)
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
      const newImgList = await store.comicMap[id].getImgList(main);
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
  const init = () => {
    if (inited) return;
    inited = true;

    setState('fab', {
      onClick: showComic,
      show: !options.hiddenFAB && undefined,
    });

    if (store.flag.needAutoShow && options.autoShow) showComic();

    (async () => {
      await GM.registerMenuCommand(t('other.enter_comic_read_mode'), () =>
        store.fab.onClick?.(),
      );
      await updateHideFabMenu();
    })();

    linstenKeydown((e) => {
      const code = getKeyboardCode(e);
      if (hotkeysMap()[code] !== 'enter_read_mode') return;
      e.stopPropagation();
      e.preventDefault();
      store.fab.onClick?.();
    }, true);
  };

  // 首次设置默认漫画的加载函数时，进行初始化
  createEffectOn(
    () => store.comicMap[''].getImgList,
    (_, prev) => !prev && init(),
    { defer: true },
  );

  const dynamicLoad = async (
    loadImgFn: LoadImgFn,
    length: number | Accessor<number>,
    id: string | number = '',
  ) => {
    if (store.comicMap[id].imgList?.length) return store.comicMap[id].imgList;

    setState(
      'comicMap',
      id,
      'imgList',
      Array.from<string>({
        length: typeof length === 'number' ? length : length(),
      }).fill(''),
    );
    // oxlint-disable-next-line no-async-promise-executor
    await new Promise(async (resolve) => {
      try {
        await loadImgFn((i, img) =>
          resolve(
            setState('comicMap', id, 'imgList', (list) => list!.with(i, img)),
          ),
        );
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
    return store.comicMap[id].imgList!;
  };

  const main: MainContext<T> = {
    store,
    setState,
    options,
    setOptions,
    loadComic,
    showComic,
    dynamicLoad,
    init,
  };

  useFab(main);
  useManga(main);

  const nowImgList = createRootMemo(() => {
    const comic = store.comicMap[store.nowComic];
    if (!comic?.imgList) return undefined;
    if (!comic.adList?.size) return comic.imgList;
    return comic.imgList.filter((_, i) => !comic.adList?.has(i));
  });

  createEffectOn(
    nowImgList,
    (list) => list && setState('manga', 'imgList', list),
  );

  /** 当前已取得 url 的图片数量 */
  const doneImgNum = createRootMemo(
    () => nowImgList()?.filter(Boolean)?.length,
  );

  /** 已加载完毕的图片数量 */
  const loadedImgNum = createRootMemo(() => {
    let i = 0;
    for (const img of imgList()) if (img.loadType === 'loaded') i += 1;
    return i;
  });

  // 设置 Fab 的显示进度
  createEffectOn(
    [doneImgNum, loadedImgNum, () => nowImgList()?.length],
    ([doneNum, loadNum, totalNum]) => {
      if (!totalNum || doneNum === undefined)
        return setState('fab', 'progress', undefined);

      if (totalNum === 0)
        return setState('fab', {
          progress: 0,
          tip: `${t('other.loading_img')} - ${doneNum}/${totalNum}`,
        });

      // 加载图片 url 阶段的进度
      if (doneNum < totalNum)
        return setState('fab', {
          progress: doneNum / totalNum,
          tip: `${t('other.loading_img')} - ${doneNum}/${totalNum}`,
        });

      // 图片加载阶段的进度
      if (loadNum < totalNum)
        return setState('fab', {
          progress: 1 + loadNum / totalNum,
          tip: `${t('other.img_loading')} - ${loadNum}/${totalNum}`,
        });

      return setState('fab', {
        progress: 1 + loadNum / totalNum,
        tip: t('other.read_mode'),
        show: !options.hiddenFAB && undefined,
      });
    },
  );

  let menuId: number;
  /** 更新显示/隐藏悬浮按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(
      options.hiddenFAB ? t('other.fab_show') : t('other.fab_hidden'),
      async () => {
        await setOptions({ hiddenFAB: !options.hiddenFAB });
        setState('fab', 'show', !options.hiddenFAB && undefined);
        await updateHideFabMenu();
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

  if (isDevMode) Object.assign(unsafeWindow, { main, toast });

  return main;
};
