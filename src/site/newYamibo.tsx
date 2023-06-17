import {
  plimit,
  querySelector,
  querySelectorClick,
  request,
  scrollIntoView,
  useInit,
} from 'main';

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/manga/view-chapter')) return;

  const { setManga, init } = await useInit('newYamibo');

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
  const totalPageNum = +querySelector(
    'section div:first-of-type div:last-of-type',
  )!.innerHTML.split('：')[1];

  /** 获取指定页数的图片 url */
  const getImg = async (i = 1) => {
    const res = await request(
      `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
    );

    return res.responseText
      .match(/(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/)![0]
      .replaceAll('&amp;', '&');
  };

  init(() =>
    plimit(
      Object.keys([...new Array(totalPageNum)]).map(
        (i) => () => getImg(+i + 1),
      ),
    ),
  );
})();
