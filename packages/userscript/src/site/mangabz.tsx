import { dataToParams, querySelectorClick } from '../helper';
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

  const { options, showFab, showManga, setManga, request } = await useInit(
    'mangabz',
  );

  setManga({
    onNext: querySelectorClick('body > .container a[href^="/"]:last-child'),
    onPrev: querySelectorClick('body > .container a[href^="/"]:first-child'),
  });

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

    const res = await request(
      'GET',
      `http://${MANGABZ_COOKIEDOMAIN}${MANGABZ_CURL}chapterimage.ashx?${urlParams}`,
    );

    // 返回的数据只能通过 eval 获得
    // eslint-disable-next-line no-eval
    const newImgList = [...imgList, ...(eval(res.responseText) as string[])];

    if (newImgList.length !== MANGABZ_IMAGE_COUNT) {
      showFab({
        progress: newImgList.length / MANGABZ_IMAGE_COUNT,
        tip: `加载中 - ${newImgList.length}/${MANGABZ_IMAGE_COUNT}`,
      });
      return getImgList(newImgList);
    }

    showFab({ progress: 1, tip: '阅读模式' });

    return newImgList;
  };

  let imgList: string[] = [];
  const loadAndShowComic = async () => {
    if (!imgList.length) {
      showFab({ progress: 0 });
      imgList = await getImgList();
      setManga({ imgList });
    }

    showManga();
  };

  showFab({ onClick: loadAndShowComic });

  if (options.autoLoad) await loadAndShowComic();
})();
