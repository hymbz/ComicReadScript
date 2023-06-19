import { For } from 'solid-js';
import { useManga } from '../components/useComponents/Manga';
import { useFab } from '../components/useComponents/Fab';
import { toast } from '../components/useComponents/Toast';
import { useSiteOptions } from './useSiteOptions';
import { useSpeedDial } from './useSpeedDial';
import { request } from '.';

/**
 * 对所有支持站点页面的初始化操作的封装
 * @param name 站点名
 * @param defaultOptions 默认配置
 */
export const useInit = async <T extends Record<string, any>>(
  name: string,
  defaultOptions = {} as T,
) => {
  const { options, setOptions, onOptionChange } = await useSiteOptions(
    name,
    defaultOptions,
  );

  const setFab = await useFab({
    tip: '阅读模式',
    speedDial: useSpeedDial(options, setOptions),
  });

  const [setManga, mangaProps] = await useManga({
    imgList: [],
    option: options.option,
    onOptionChange: (option) => setOptions({ ...options, option }),
  });

  // 检查脚本的版本变化，提示用户
  const version = await GM.getValue<string>('Version');
  if (version && version !== GM.info.script.version) {
    (async () => {
      const res = await request(
        `https://cdn.jsdelivr.net/gh/hymbz/ComicReadScript@${GM.info.script.version}/docs/LatestChange.md`,
        { errorText: '' },
      );
      toast(
        () => (
          <>
            <h2>🥳 ComicRead 已更新到 v{GM.info.script.version}</h2>
            <div class="md">
              <For each={res.responseText.match(/^### [^[].+?$|^\* .+?$/gm)}>
                {(mdText) => {
                  switch (mdText[0]) {
                    case '#':
                      return <h3>{mdText.replace('### ', '')}</h3>;
                    case '*':
                      return (
                        <ul>
                          <For each={mdText.match(/(?<=:.+?: ).+?(?= \()/)}>
                            {(item) => <li>{item}</li>}
                          </For>
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
    })();

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
  /** 更新显示/隐藏阅读模式按钮的菜单项 */
  const updateHideFabMenu = async () => {
    await GM.unregisterMenuCommand(menuId);
    menuId = await GM.registerMenuCommand(
      `${options.hiddenFAB ? '显示' : '隐藏'}阅读模式按钮`,
      async () => {
        await setOptions({ ...options, hiddenFAB: !options.hiddenFAB });
        setFab((state) => {
          state.show = !options.hiddenFAB && undefined;
        });
        await updateHideFabMenu();
      },
    );
  };

  return {
    options,
    setOptions,
    onOptionChange,
    setFab,
    setManga,

    /**
     * 完成所有支持站点的初始化
     * @param getImgList 返回图片列表的函数
     * @param onLoading 图片加载状态发生变化时触发的回调
     * @returns 自动加载图片并进入阅读模式的函数
     */
    init: (
      getImgList: () => Promise<string[]> | string[],
      onLoading: (
        loadNum: number,
        totalNum: number,
        img: ComicImg,
      ) => void = () => {},
    ) => {
      /** 是否正在加载图片中 */
      let loading = false;

      /** 进入阅读模式 */
      const showComic = async (show: boolean = options.autoShow) => {
        if (loading) {
          toast.warn('加载图片中，请稍候', {
            duration: 1500,
            id: '加载图片中，请稍候',
          });
          return;
        }

        const { imgList } = mangaProps;

        if (!imgList.length) {
          loading = true;
          try {
            setFab({ progress: 0, show: true });
            const initImgList = await getImgList();
            if (initImgList.length === 0) throw new Error('获取漫画图片失败');
            setFab({
              progress: 1,
              tip: '阅读模式',
              show: !options.hiddenFAB && undefined,
            });
            setManga((state) => {
              state.imgList = initImgList;
              state.show = show;

              // 监听图片加载状态，将进度显示到 Fab 上
              state.onLoading = (img, list) => {
                const loadNum = list.filter(
                  (image) => image.loadType === 'loaded',
                ).length;

                onLoading(loadNum, list.length, img);

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

              return state;
            });
          } catch (e: any) {
            console.error(e);
            toast.error(e.message);
            setFab({ progress: undefined });
          } finally {
            loading = false;
          }
        } else {
          setManga({ show: true });
        }
      };

      setFab({ onClick: () => showComic(true) });
      if (options.autoShow) showComic();

      GM.registerMenuCommand('进入漫画阅读模式', () => showComic(true));
      updateHideFabMenu();

      return () => showComic(true);
    },
  };
};
