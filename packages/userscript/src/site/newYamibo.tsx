import { querySelector, querySelectorClick, scrollIntoView } from '../helper';
import { useInit } from '../helper/useInit';

(async () => {
  // 只在漫画页内运行
  if (!document.URL.includes('view-chapter')) return;

  const { options, setFab, toast, setManga, createShowComic } = await useInit(
    'newYamibo',
  );

  setManga({
    onNext: querySelectorClick('#btnNext'),
    onPrev: querySelectorClick('#btnPrev'),
    onExit: (isEnd) => {
      setManga({ show: false });
      if (isEnd) scrollIntoView('#w1');
    },
  });

  const id = new URLSearchParams(window.location.search).get('id');
  /** 总页数 */
  const totalNum = +querySelector(
    'section div:first-of-type div:last-of-type',
  )!.innerHTML.split('：')[1];

  const getImgList = async (
    i = 1,
    imgList: string[] = [],
  ): Promise<string[]> => {
    const res = await GM.xmlHttpRequest({
      method: 'GET',
      url: `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
    });

    if (res.status !== 200 || !res.responseText) {
      console.error('漫画加载出错', res);
      toast.error('漫画加载出错');
      return [];
    }

    imgList.push(
      /<img id="imgPic".+="(.+?)".+>/
        .exec(res.responseText)![1]
        .replaceAll('&amp;', '&'),
    );

    if (imgList.length === totalNum) {
      setFab({ progress: 1, tip: '阅读模式' });
      return imgList;
    }

    setFab({
      progress: imgList.length / totalNum,
      tip: `加载图片中 - ${imgList.length}/${totalNum}`,
    });

    return getImgList(i + 1, imgList);
  };

  const showComic = createShowComic(getImgList);
  setFab({ onClick: showComic });

  if (options.autoShow) await showComic();
})();
