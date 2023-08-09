import {
  querySelectorClick,
  useInit,
  request,
  plimit,
  waitDom,
  autoUpdate,
} from 'main';

(async () => {
  const { setManga, setFab, init } = await useInit('terraHistoricus');

  const apiUrl = () =>
    `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;

  const getImgUrl = (i: number) => async () => {
    const res = await request(`${apiUrl()}/page?pageNum=${i + 1}`);
    return JSON.parse(res.response).data.url as string;
  };

  const getImgList = async () => {
    const res = await request(apiUrl());
    const pageList = JSON.parse(res.response).data.pageInfos as unknown[];
    if (pageList.length === 0 && window.location.pathname.includes('episode'))
      throw new Error('获取图片列表时出错');

    return plimit<string>(
      [...Array(pageList.length).keys()].map(getImgUrl),
      (doneNum, totalNum) => {
        setFab({ tip: `获取图片中 - ${doneNum}/${totalNum}` });
      },
    );
  };

  const { loadImgList } = init(getImgList);

  let lastUrl = '';

  autoUpdate(async () => {
    if (window.location.href === lastUrl) return;
    lastUrl = window.location.href;

    if (!lastUrl.includes('episode')) {
      setFab({ show: false });
      setManga({ show: false, imgList: [] });
      return;
    }

    await waitDom('footer .HG_GAME_JS_BRIDGE__wrapper');

    // 先将 imgList 清空以便 activePageIndex 归零
    setManga({ imgList: [] });
    await loadImgList();
    setManga({
      onPrev: querySelectorClick('footer .HG_GAME_JS_BRIDGE__prev a'),
      onNext: querySelectorClick(
        'footer .HG_GAME_JS_BRIDGE__buttonEp+.HG_GAME_JS_BRIDGE__buttonEp a',
      ),
    });
  });
})();
