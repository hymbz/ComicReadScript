import AutoStories from '@material-design-icons/svg/round/auto_stories.svg';

import { IconBotton } from '@crs/ui-component/dist/IconBotton';
import { useManga, useFab, useToast } from '../components';
import { querySelectorClick, sleep, useSiteOptions } from '../helper';

// 页面自带的变量

(async () => {
  // 只在漫画页内运行
  if (!window.location.href.includes('/chapter/')) return;

  const { options, setOptions, onOptionChange } = await useSiteOptions(
    'copymanga',
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

  const getImgList = async (
    imgList: string[] = [],
    errorNum = 0,
  ): Promise<string[]> => {
    const res = await GM.xmlHttpRequest({
      method: 'GET',
      url: window.location.href.replace(
        /.*?(?=\/comic\/)/,
        'https://api.copymanga.site/api/v3',
      ),
      headers: { Referer: window.location.href },
      responseType: 'blob',
    });

    if (res.status !== 200 || !res.responseText) {
      if (errorNum > 3) throw new Error('漫画图片加载出错');
      console.error('漫画图片加载出错', res);
      toast('漫画图片加载出错', { type: 'error' });
      await sleep(1000 * 3);
      return getImgList(imgList, errorNum + 1);
    }

    const {
      results: {
        chapter: { contents },
      },
    } = JSON.parse(res.responseText);

    showFab((draftProps) => {
      draftProps.progress = 1;
      draftProps.tip = '阅读模式';
    });

    type ContentsType = { url: string }[];
    return (contents as ContentsType).map(({ url }) => url);
  };

  let imgList: string[] = [];
  const [showManga] = useManga({
    imgList,
    onOptionChange: (option) => setOptions({ ...options, option }),
    onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
    onPrev: querySelectorClick(
      '.comicContent-prev:nth-child(3) a:not(.prev-null)',
    ),
  });

  const loadAndShowComic = async () => {
    if (!imgList.length) {
      showFab((draftProps) => {
        draftProps.progress = 0;
      });
      imgList = await getImgList();
    }

    showManga((draftProps) => {
      draftProps.imgList = imgList;
    });
  };
  showFab((draftProps) => {
    draftProps.onClick = loadAndShowComic;
  });

  if (options.autoLoad) await loadAndShowComic();
})();
