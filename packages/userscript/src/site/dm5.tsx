/* eslint-disable camelcase */
import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { useManga, useFab, useToast } from '../components';
import { querySelectorClick, sleep, useSiteOptions } from '../helper';

// 页面自带的变量
declare const DM5_CID: number;
declare const DM5_MID: number;
declare const DM5_VIEWSIGN_DT: string;
declare const DM5_VIEWSIGN: string;
/** 漫画页数 */
declare const DM5_IMAGE_COUNT: number;
declare const DM5_PageType: number;
declare const $: any;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'DM5_CID')) return;

  const { options, setOptions, onOptionChange } = await useSiteOptions('dm5');

  const [showFab] = useFab({
    tip: '阅读模式',
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
  onOptionChange(() => showFab());

  const toast = useToast();

  const getImgList = async (
    imgList: string[] = [],
    errorNum = 0,
  ): Promise<string[]> => {
    try {
      const res = await $.ajax({
        type: 'GET',
        url: 'chapterfun.ashx',
        data: {
          cid: DM5_CID,
          page: imgList.length + 1,
          key: $('#dm5_key').length ? $('#dm5_key').val() : '',
          language: 1,
          gtk: 6,
          _cid: DM5_CID,
          _mid: DM5_MID,
          _dt: DM5_VIEWSIGN_DT,
          _sign: DM5_VIEWSIGN,
        },
      });

      // 返回的数据只能通过 eval 获得
      // eslint-disable-next-line no-eval
      const newImgList = [...imgList, ...(eval(res) as string[])];

      if (newImgList.length !== DM5_IMAGE_COUNT) {
        showFab((draftProps) => {
          draftProps.progress = newImgList.length / DM5_IMAGE_COUNT;
          draftProps.tip = `加载中 - ${newImgList.length}/${DM5_IMAGE_COUNT}`;
        });
        return getImgList(newImgList);
      }

      showFab((draftProps) => {
        draftProps.progress = 1;
        draftProps.tip = '阅读模式';
      });

      return newImgList;
    } catch (error) {
      if (errorNum > 3) throw new Error('漫画图片加载出错');
      console.error('漫画图片加载出错');
      toast('漫画图片加载出错', { type: 'error' });
      await sleep(1000 * 3);
      return getImgList(imgList, errorNum + 1);
    }
  };

  let imgList: string[] = [];
  const [showManga] = useManga({
    imgList,
    onOptionChange: (option) => setOptions({ ...options, option }),
    onNext: querySelectorClick('.logo_2'),
    onPrev: querySelectorClick('.logo_1'),
  });

  const loadAndShowComic = async () => {
    showFab((draftProps) => {
      draftProps.progress = 0;
    });
    if (!imgList.length) imgList = await getImgList();

    showManga((draftProps) => {
      draftProps.imgList = imgList;
    });
  };
  showFab((draftProps) => {
    draftProps.onClick = loadAndShowComic;
  });

  if (options.autoLoad) await loadAndShowComic();
})();
