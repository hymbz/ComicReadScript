import { useManga } from '../components/useComponents/Manga';
import { useFab } from '../components/useComponents/Fab';
import { toast } from '../components/useComponents/Toast';
import { useSiteOptions } from './useSiteOptions';
import { useSpeedDial } from './useSpeedDial';

/**
 * 对三个样式组件和 useSiteOptions 的默认值进行封装
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
    // FIXME: 实现通过 jsdelivr 获取指定版本的更新内容
    //     const changelog = `
    // ## 新增

    // - 通过 M 键切换页面填充

    // ## 修复

    // - 增加拷贝漫画的支持域名
    // - 修复漫画柜失效问题
    // `;
    (async () => {
      // const res = await request(
      //   `https://cdn.jsdelivr.net/gh/hymbz/ComicReadScriptTest@${GM.info.script.version}/file`,
      //   { errorText: '' },
      // );
      // toast(() => (
      //   <div>
      //     <h2>ComicReadScrip 已更新到 {GM.info.script.version}</h2>
      //     <div className="md">
      //       {res.responseText.match(/##.+?\n|(-.+?\n)+/g)!.map((mdText) => {
      //         if (mdText[0] === '#') return <h2>{mdText.split('##')}</h2>;
      //         if (mdText[0] === '-')
      //           return (
      //             <ul>
      //               {mdText.match(/(?<=- ).+/g)!.map((item) => (
      //                 <li>{item}</li>
      //               ))}
      //             </ul>
      //           );
      //         return null;
      //       })}
      //     </div>
      //   </div>
      // ));
      // GM_setValue('Version', GM.info.script.version);
    })();
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
            unmountDelay: 1500,
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
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      if (options.autoShow) showComic();

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      GM.registerMenuCommand('进入漫画阅读模式', () => showComic(true));
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      updateHideFabMenu();

      return () => showComic(true);
    },
  };
};
