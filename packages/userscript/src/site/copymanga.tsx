import { querySelectorClick, sleep } from '../helper';
import { useInit } from '../helper/useInit';

// 页面自带的变量

(async () => {
  // 只在漫画页内运行
  if (!window.location.href.includes('/chapter/')) return;

  const { options, showFab, toast, showManga, setManga } = await useInit(
    'copymanga',
  );
  setManga({
    onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
    onPrev: querySelectorClick(
      '.comicContent-prev:nth-child(3) a:not(.prev-null)',
    ),
  });

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

    showFab({ progress: 1, tip: '阅读模式' });

    type ContentsType = { url: string }[];
    return (contents as ContentsType).map(({ url }) => url);
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
