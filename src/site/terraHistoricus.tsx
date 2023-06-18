import { querySelectorClick, useInit, request, plimit, wait } from 'main';

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

  let running = false;

  const handleUrlChange = async () => {
    running = true;
    await wait('footer .HG_GAME_JS_BRIDGE__wrapper');

    // 先将 imgList 清空以便 activePageIndex 归零
    setManga({ imgList: [] });
    init(getImgList);
    setManga({
      onPrev: querySelectorClick('footer .HG_GAME_JS_BRIDGE__prev a'),
      onNext: querySelectorClick(
        'footer .HG_GAME_JS_BRIDGE__buttonEp+.HG_GAME_JS_BRIDGE__buttonEp a',
      ),
    });
    running = false;
  };

  let lastUrl = window.location.href;

  ['click', 'popstate'].forEach((eventName) => {
    window.addEventListener(eventName, () =>
      setTimeout(() => {
        if (running || window.location.href === lastUrl) return;
        lastUrl = window.location.href;

        if (!lastUrl.includes('episode')) {
          setFab({ show: false });
          setManga({ show: false });
          return;
        }

        handleUrlChange();
      }, 100),
    );
  });

  handleUrlChange();
})();
