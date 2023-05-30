import { querySelectorClick, useInit, request, plimit, wait } from '../main';

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('episode')) return;

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
    if (pageList.length === 0) throw new Error('获取图片列表时出错');

    return plimit<string>(
      [...Array(pageList.length).keys()].map(getImgUrl),
      (doneNum, totalNum) => {
        setFab({ tip: `获取图片中 - ${doneNum}/${totalNum}` });
      },
    );
  };

  init(getImgList);

  const setTurnPage = () => {
    const creatTrunPageFn = (selector: string) => {
      const fn = querySelectorClick(selector);
      if (!fn) return null;

      return async () => {
        fn();
        setManga({ imgList: [] });
        setManga({
          imgList: await getImgList(),
          show: true,
        });
        setTurnPage();
      };
    };

    setManga({
      onPrev: creatTrunPageFn('footer .HG_GAME_JS_BRIDGE__prev a'),
      onNext: creatTrunPageFn(
        'footer .HG_GAME_JS_BRIDGE__buttonEp+.HG_GAME_JS_BRIDGE__buttonEp a',
      ),
    });
  };

  wait('footer .HG_GAME_JS_BRIDGE__wrapper', setTurnPage);
})();
