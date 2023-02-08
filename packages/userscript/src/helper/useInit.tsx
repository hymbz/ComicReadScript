import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { useFab, useManga, useToast } from '../components';
import { useSiteOptions } from './useSiteOptions';
import { sleep } from '.';

/**
 * 对三个样式组件和 useSiteOptions 的默认值进行封装
 *
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

  const setFab = useFab({
    tip: '阅读模式',
    speedDial: [
      () => <div style={{ height: '1em' }} />,
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
  onOptionChange(() => setFab());

  const setManga = useManga({
    imgList: [],
    option: options.option,
    onOptionChange: (option) => setOptions({ ...options, option }),
  });

  const toast = useToast();

  // 对 GM.xmlHttpRequest 进行包装
  type RequestOptions = Partial<Tampermonkey.Request<any>> & {
    errorText?: string;
  };
  const request = async (
    method: 'GET' | 'POST',
    url: string,
    details?: RequestOptions,
    errorNum = 0,
  ): Promise<Tampermonkey.Response<any>> => {
    const errorText = details?.errorText ?? '漫画图片加载出错';
    try {
      const res = await GM.xmlHttpRequest({ method, url, ...details });
      if (res.status !== 200 || !res.responseText) throw new Error(errorText);
      return res;
    } catch (error) {
      if (errorNum > 3) {
        toast.error(errorText);
        throw new Error(errorText);
      }
      console.error(errorText, error);
      await sleep(1000 * 3);
      return request(method, url, details, errorNum + 1);
    }
  };

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
      const res = await GM.xmlHttpRequest({
        method: 'GET',
        url: `https://cdn.jsdelivr.net/gh/hymbz/ComicReadScriptTest@${GM.info.script.version}/file`,
      });
      if (!res.responseText) return;
      toast(() => (
        <div>
          <h2>ComicReadScrip 已更新到 {GM.info.script.version}</h2>
          <div className="md">
            {res.responseText.match(/##.+?\n|(-.+?\n)+/g)!.map((mdText) => {
              if (mdText[0] === '#') return <h2>{mdText.split('##')}</h2>;
              if (mdText[0] === '-')
                return (
                  <ul>
                    {mdText.match(/(?<=- ).+/g)!.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul>
                );
              return null;
            })}
          </div>
        </div>
      ));
      GM_setValue('Version', GM.info.script.version);
    })();
  }

  return {
    options,
    setOptions,
    onOptionChange,
    setFab,
    setManga,
    toast,

    request,

    /**
     * 创建一个加载图片列表并进入阅读模式的函数
     *
     * @param getImgList 返回图片列表的函数
     * @param onLoading 图片加载状态发生变化时触发的回调
     */
    createShowComic: (
      getImgList: () => Promise<string[]> | string[],
      onLoading: (
        loadNum: number,
        totalNum: number,
        img: ComicImg,
      ) => void = () => {},
    ) => {
      let imgList: string[] = [];

      let progress = 1;

      let loading = false;

      /**
       * 进入阅读模式
       *
       * @param waitLoad 等待图片全部加载完成后再自动进入阅读模式
       */
      const showComic = async (waitLoad = false) => {
        if (loading) {
          toast('加载图片中，请稍候', { autoClose: 1500 });
          return;
        }

        if (!imgList.length) {
          loading = true;
          try {
            setFab({ progress: 0, show: true });
            imgList = await getImgList();
            if (imgList.length === 0) throw new Error('获取漫画图片失败');
            setFab({ progress: 1, tip: '阅读模式' });
            setManga({
              imgList,
              show: !waitLoad,
              onLoading: (img, list) => {
                const loadNum = list.filter(
                  (image) => image.loadType === 'loaded',
                ).length;

                onLoading(loadNum, imgList.length, img);

                progress = 1 + loadNum / imgList.length;
                if (progress !== 2) {
                  setFab({
                    progress,
                    tip: `图片加载中 - ${loadNum}/${imgList.length}`,
                  });
                } else {
                  setFab({ progress, tip: '阅读模式', show: undefined });
                  if (options.autoLoad) setManga({ show: true });
                }
              },
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

      return showComic;
    },
  };
};
