import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { useManga, useFab, useToast } from '../components';
import { dataToParams, querySelectorClick, useSiteOptions } from '../helper';

// 页面自带的变量
declare const MANGABZ_CID: number;
declare const MANGABZ_MID: number;
declare const MANGABZ_VIEWSIGN_DT: string;
declare const MANGABZ_VIEWSIGN: string;
declare const MANGABZ_COOKIEDOMAIN: string;
declare const MANGABZ_CURL: string;
/** 总页数 */
declare const MANGABZ_IMAGE_COUNT: number;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) return;

  const { options, setOptions, onOptionChange } = await useSiteOptions(
    'mangabz',
  );

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

  const getImgList = async (imgList: string[] = []): Promise<string[]> => {
    const urlParams = dataToParams({
      cid: MANGABZ_CID,
      page: imgList.length + 1,
      key: '',
      _cid: MANGABZ_CID,
      _mid: MANGABZ_MID,
      _dt: MANGABZ_VIEWSIGN_DT.replace(' ', '+').replace(':', '%3A'),
      _sign: MANGABZ_VIEWSIGN,
    });

    const res = await GM.xmlHttpRequest({
      method: 'GET',
      url: `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`,
    });

    if (res.status !== 200 || !res.responseText) {
      console.error('漫画图片加载出错', res);
      toast('漫画图片加载出错', { type: 'error' });
      throw new Error('漫画图片加载出错');
    }

    // 返回的数据只能通过 eval 获得
    // eslint-disable-next-line no-eval
    const newImgList = [...imgList, ...(eval(res.responseText) as string[])];

    if (newImgList.length !== MANGABZ_IMAGE_COUNT) {
      showFab((draftProps) => {
        draftProps.progress = newImgList.length / MANGABZ_IMAGE_COUNT;
        draftProps.tip = `加载中 - ${newImgList.length}/${MANGABZ_IMAGE_COUNT}`;
      });
      return getImgList(newImgList);
    }

    showFab((draftProps) => {
      draftProps.progress = 1;
      draftProps.tip = '阅读模式';
    });

    return newImgList;
  };

  let imgList: string[] = [];
  const [showManga] = useManga({
    imgList,
    onOptionChange: (option) => setOptions({ ...options, option }),
    onNext: querySelectorClick('body > .container a[href^="/"]:last-child'),
    onPrev: querySelectorClick('body > .container a[href^="/"]:first-child'),
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
