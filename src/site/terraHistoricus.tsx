import { querySelectorClick, useInit, request, plimit } from '../main';

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

  // 点击指定 dom 的同时重新获取图片列表
  const turnPage = (selector: string) => async () => {
    querySelectorClick(selector)!();
    setManga({ imgList: [] });
    setManga({ imgList: await getImgList(), show: true });
  };

  setManga({
    onPrev: turnPage('footer .HG_GAME_JS_BRIDGE__prev a'),
    onNext: turnPage(
      'footer .HG_GAME_JS_BRIDGE__buttonEp+.HG_GAME_JS_BRIDGE__buttonEp a',
    ),
  });

  init(getImgList);
})();
