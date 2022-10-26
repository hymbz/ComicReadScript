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

  const [showFab, setFab] = useFab({
    tip: '阅读模式',
    progress: 1,
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
  onOptionChange(() => showFab());

  const [showManga, setManga] = useManga({
    imgList: [],
    onOptionChange: (option) => setOptions({ ...options, option }),
  });

  const toast = useToast();

  type RequestOptions = Partial<Tampermonkey.Request<any>> & {
    errorText?: string;
  };
  const request = async (
    method: 'GET' | 'POST',
    url: string,
    details?: RequestOptions,
    errorNum = 0,
  ): Promise<Tampermonkey.Response<any>> => {
    const res = await GM.xmlHttpRequest({ method, url, ...details });

    if (res.status !== 200 || !res.responseText) {
      const errorText = details?.errorText ?? '漫画图片加载出错';
      if (errorNum > 3) {
        toast(errorText, { type: 'error' });
        throw new Error(errorText);
      }
      console.error(errorText, res);
      await sleep(1000 * 3);
      return request(method, url, details, errorNum + 1);
    }

    return res;
  };

  return {
    options,
    setOptions,
    onOptionChange,
    showFab,
    setFab,
    showManga,
    setManga,
    toast,

    request,

    /**
     * 创建一个加载图片列表并进入阅读模式的函数
     *
     * @param getImgList 返回图片列表的函数
     * @param errorText 错误提示
     */
    createShowComic: (
      getImgList: () => Promise<string[]> | string[],
      errorText = '获取漫画图片失败',
    ) => {
      let loading = false;
      let imgList: string[] = [];
      return async () => {
        if (loading) return;
        if (!imgList.length) {
          loading = true;
          try {
            showFab({ progress: 0 });
            imgList = await getImgList();
            if (imgList.length === 0) throw new Error(errorText);
            setManga({ imgList });
          } catch (e) {
            console.error(e);
            toast(errorText, { type: 'error' });
            showFab({ progress: undefined });
          } finally {
            loading = false;
          }
        }

        showManga();
      };
    },
  };
};
