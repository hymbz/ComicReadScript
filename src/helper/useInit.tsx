import { For } from 'solid-js';
import { getKeyboardCode, isEqualArray } from '.';
import { useManga } from '../components/useComponents/Manga';
import { useFab } from '../components/useComponents/Fab';
import { toast } from '../components/useComponents/Toast';
import { useSiteOptions } from './useSiteOptions';
import { useSpeedDial } from './useSpeedDial';

/**
 * 对所有支持站点页面的初始化操作的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useInit = async <T extends Record<string, any>>(
  name: string,
  defaultOptions = {} as T,
) => {
  const { options, setOptions, readModeHotKeys, hotKeys, onHotKeysChange } =
    await useSiteOptions(name, defaultOptions);

  const [setFab, fabProps] = await useFab({
    tip: '阅读模式',
    speedDial: useSpeedDial(options, setOptions),
    show: !options.hiddenFAB && undefined,
  });

  const [setManga, mangaProps] = await useManga({
    imgList: [],
    option: options.option,
    onOptionChange: (option) => setOptions({ ...options, option }),
    hotKeys: hotKeys(),
    onHotKeysChange,
  });

  // 检查脚本的版本变化，提示用户
  const version = await GM.getValue<string>('Version');
  if (version && version !== GM.info.script.version) {
    const latestChange = inject('LatestChange');
    toast(
      () => (
        <>
          <h2>🥳 ComicRead 已更新到 v{GM.info.script.version}</h2>
          <div>
            <For each={latestChange.match(/^### [^[].+?$|^\* .+?$/gm)}>
              {(mdText) => {
                switch (mdText[0]) {
                  case '#':
                    return <h3>{mdText.replace('### ', '')}</h3>;
                  case '*':
                    return (
                      <ul>
                        <li>
                          {mdText
                            .replace(/^\* /, '')
                            .replace(/^:\w+?: /, '')
                            .replace(/(?<=^.*)\(\[\w+\]\(.+?\)\)/, '')}
                        </li>
                      </ul>
                    );
                  default:
                    return null;
                }
              }}
            </For>
          </div>
        </>
      ),
      {
        id: 'Version Tip',
        type: 'custom',
        duration: Infinity,
        // 手动点击关掉通知后才不会再次弹出
        onDismiss: () => GM.setValue('Version', GM.info.script.version),
      },
    );

    // 监听储存的版本数据的变动，如果和当前版本一致就关掉弹窗
    // 防止在更新版本后一次性打开多个页面，不得不一个一个关过去
    const listenerId = await GM.addValueChangeListener(
      'Version',
      async (_, __, newVersion) => {
        if (newVersion !== GM.info.script.version) return;
        toast.dismiss('Version Tip');
        await GM.removeValueChangeListener(listenerId);
      },
    );
  }

  let menuId: number;
  /** 更新显示/隐藏悬浮按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(
      `${options.hiddenFAB ? '显示' : '隐藏'}悬浮按钮`,
      async () => {
        await setOptions({ ...options, hiddenFAB: !options.hiddenFAB });
        setFab((state) => {
          state.show = !options.hiddenFAB && undefined;
        });
        await updateHideFabMenu();
      },
    );
  };

  /** 当前是否还需要判断 autoShow */
  let needAutoShow = true;

  return {
    options,
    setOptions,
    setFab,
    setManga,
    mangaProps,

    /**
     * 完成所有支持站点的初始化
     * @param getImgList 返回图片列表的函数
     * @returns 自动加载图片并进入阅读模式的函数
     */
    init: (getImgList: () => Promise<string[]> | string[]) => {
      const firstRun = menuId === undefined;

      /** 是否正在加载图片中 */
      let loading = false;

      const onLoading = (list: ComicImg[]) => {
        const loadNum = list.filter(
          (image) => image.loadType === 'loaded',
        ).length;

        /** 图片加载进度 */
        const progress = 1 + loadNum / list.length;
        if (progress !== 2) {
          setFab({
            progress,
            tip: `图片加载中 - ${loadNum}/${list.length}`,
          });
        } else {
          // 图片全部加载完成后恢复 Fab 状态
          setFab({ progress, tip: '阅读模式', show: undefined });
        }
      };

      const loadImgList = async (initImgList?: string[], show?: boolean) => {
        loading = true;
        try {
          if (!initImgList) setFab({ progress: 0, show: true });
          const newImgList = initImgList ?? (await getImgList());
          if (newImgList.length === 0) throw new Error('获取漫画图片失败');
          setManga((state) => {
            if (!isEqualArray(newImgList, mangaProps.imgList))
              state.imgList = newImgList;
            if (show || (needAutoShow && options.autoShow)) {
              state.show = true;
              needAutoShow = false;
            }

            if (state.onLoading === undefined) state.onLoading = onLoading;
          });
        } catch (e: any) {
          console.error(e);
          if (show) toast.error(e.message);
          setFab({ progress: undefined });
        } finally {
          loading = false;
        }
      };

      /** 进入阅读模式 */
      const showComic = async () => {
        if (loading)
          return toast.warn('加载图片中，请稍候', { duration: 1500 });

        if (!mangaProps.imgList.length) return loadImgList(undefined, true);

        setManga({ show: true });
      };

      setFab({ onClick: showComic });

      if (needAutoShow && options.autoShow) showComic();

      if (firstRun) {
        GM.registerMenuCommand('进入漫画阅读模式', fabProps.onClick!);
        updateHideFabMenu();

        window.addEventListener('keydown', (e) => {
          if ((e.target as HTMLElement).tagName === 'INPUT') return;
          const code = getKeyboardCode(e);
          if (!readModeHotKeys().has(code)) return;
          e.stopPropagation();
          e.preventDefault();
          fabProps.onClick?.();
        });
      }

      return {
        /** 进入阅读模式 */
        showComic,
        /** 重新加载 imgList */
        loadImgList,
        /** 默认的 onLoading */
        onLoading,
      };
    },
  };
};
