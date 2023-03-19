import {
  querySelector,
  querySelectorClick,
  request,
  scrollIntoView,
  useInit,
} from '../helper';

(async () => {
  // 只在漫画页内运行
  if (!document.URL.includes('view-chapter')) return;

  const { setFab, setManga, init } = await useInit('newYamibo');

  setManga({
    onNext: querySelectorClick('#btnNext'),
    onPrev: querySelectorClick('#btnPrev'),
    onExit: (isEnd) => {
      if (isEnd) scrollIntoView('#w1');
      setManga({ show: false });
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
    const res = await request(
      `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
    );

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

  init(getImgList);
})();
