/* eslint-disable camelcase */
import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import type { MangaProps } from '@crs/ui-component/dist/Manga';
import { useManga, useFab, useToast } from '../components';
import { dataToParams, querySelectorClick, useSiteOptions } from '../helper';

declare const img_data_arr: { img: string }[];
declare const img_host: string;
declare const img_pre: string;
declare const p_ccid: number;
declare const p_id: number;
declare const p_d: number;
declare const vg_r_data: any;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'img_data_arr')) return;

  const { options, setOptions } = await useSiteOptions('manhuagui', {
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
      method: 'POST',
      url: '/book/goNumPage',
      dataType: 'json',
      data: dataToParams({
        ccid: p_ccid,
        id: p_id,
        num: (vg_r_data.data('num') as number) + (type === 'next' ? 1 : -1),
        d: p_d,
        type,
      }),
    });

    if (res.state)
      return querySelectorClick(
        `a[title="${type === 'next' ? '下集' : '上集'}"]`,
      );

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
        imgList = img_data_arr.map(
          (data) => `${img_host}/${img_pre}/${data.img}`,
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
