import { dataToParams, querySelectorClick, sleep } from '../helper';
import { useInit } from '../helper/useInit';

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

  const { options, showFab, toast, showManga, setManga } = await useInit(
    'mangabz',
  );

  setManga((draftProps) => {
    draftProps.onNext = querySelectorClick(
      'body > .container a[href^="/"]:last-child',
    );
    draftProps.onPrev = querySelectorClick(
      'body > .container a[href^="/"]:first-child',
    );
  });

  const getImgList = async (
    imgList: string[] = [],
    errorNum = 0,
  ): Promise<string[]> => {
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
      if (errorNum > 3) throw new Error('漫画图片加载出错');
      console.error('漫画图片加载出错', res);
      toast('漫画图片加载出错', { type: 'error' });
      await sleep(1000 * 3);
      return getImgList(imgList, errorNum + 1);
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
  const loadAndShowComic = async () => {
    if (!imgList.length) {
      showFab((draftProps) => {
        draftProps.progress = 0;
      });
      imgList = await getImgList();
      setManga((draftProps) => {
        draftProps.imgList = imgList;
      });
    }

    showManga();
  };

  showFab((draftProps) => {
    draftProps.onClick = loadAndShowComic;
  });

  if (options.autoLoad) await loadAndShowComic();
})();
