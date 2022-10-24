import { querySelectorClick } from '../helper';
import { useInit } from '../helper/useInit';

// 页面自带的变量

(async () => {
  // 只在漫画页内运行
  if (!window.location.href.includes('/chapter/')) return;

  const { options, showFab, toast, showManga, setManga, request } =
    await useInit('copymanga');
  setManga({
    onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
    onPrev: querySelectorClick(
      '.comicContent-prev:nth-child(3) a:not(.prev-null)',
    ),
  });

  const getImgList = async (): Promise<string[]> => {
    const res = await request(
      'GET',
      window.location.href.replace(
        /.*?(?=\/comic\/)/,
        'https://api.copymanga.site/api/v3',
      ),
      { headers: { Referer: window.location.href }, responseType: 'blob' },
    );

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
      try {
        showFab({ progress: 0 });
        imgList = await getImgList();
        if (imgList.length === 0) throw new Error('获取漫画图片失败');
        setManga({ imgList });
      } catch (e: any) {
        console.error(e);
        toast(e?.message, { type: 'error' });
      }
    }

    showManga();
  };

  showFab({ onClick: loadAndShowComic });

  if (options.autoLoad) await loadAndShowComic();
})();
