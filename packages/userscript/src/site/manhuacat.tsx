/* eslint-disable camelcase */
import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { useManga, useFab, useToast } from '../components';
import { useSiteOptions } from '../helper';

declare const img_data_arr: string[];
declare const img_pre: string;
declare const asset_domain: string;
declare const asset_key: string;
declare const chapter_num: number;
declare const chapter_type: number;
declare const cdnImage: (a: string, b: string, c: string) => string;
declare const goNumPage: (a: string) => void;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cdnImage')) return;

  const { options, setOptions } = await useSiteOptions('manhuacat', {
    option: undefined as MangaProps['option'] | undefined,
    autoLoad: false,
  });

  const [showFab] = useFab({
    tip: '阅读模式',
    progress: 1,
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

  const toast = useToast();

  /**
   * 检查是否有上/下一页
   *
   * @param type
   */
  const checkTurnPage = async (type: 'pre' | 'next') => {
    const res = await $.ajax({
      type: 'get',
      url: `/chapter_num?chapter_id=${chapter_num}&ctype=${
        type === 'next' ? 1 : 2
      }&type=${chapter_type}`,
      dataType: 'json',
    });

    if (res.code === '0000') return () => goNumPage(type);

    return null;
  };

  let imgList: string[] = [];
  const [showManga] = useManga({
    imgList,
    onOptionChange: (option) => setOptions({ ...options, option }),
    onNext: await checkTurnPage('next'),
    onPrev: await checkTurnPage('pre'),
  });

  const showComic = () => {
    if (imgList.length === 0) {
      try {
        imgList = img_data_arr.map((img) =>
          cdnImage(img_pre + img, asset_domain, asset_key),
        );
        if (imgList.length === 0) throw new Error('获取漫画图片失败');
      } catch (e) {
        console.error(e);
        toast('获取漫画图片失败', { type: 'error' });
      }
    }

    showManga((draftProps) => {
      draftProps.imgList = imgList;
    });
  };
  showFab((draftProps) => {
    draftProps.onClick = showComic;
  });

  if (options.autoLoad) showComic();
})();
