import {
  querySelectorClick,
  useInit,
  waitDom,
  autoUpdate,
  querySelectorAll,
  querySelector,
  sleep,
} from 'main';

(async () => {
  const { setManga, setFab, init } = await useInit('komiic');

  const getImgList = async (): Promise<string[]> => {
    const imgList = querySelectorAll('.imageContainer > img').map(
      (e) => e.getAttribute('data-src') ?? '',
    );
    if (imgList.includes('')) {
      await sleep(100);
      return getImgList();
    }
    return imgList;
  };

  let lastUrl = '';

  const urlMatchRe = /comic\/\d+\/chapter\/\d+\/images\//;

  const findButton = (text: string) => () => {
    // 点击唤出底栏
    const id = window.setInterval(() => {
      querySelector('.ComicImageContainer')?.click();
    }, 500);
    while (!querySelector('.ComicImage__bottom-menu-center')) {}
    window.clearInterval(id);

    return querySelectorAll(
      '.ComicImage__bottom-menu-center button:not([disabled])',
    ).find((e) => e.innerText.includes(text));
  };

  autoUpdate(async () => {
    if (window.location.pathname === lastUrl) return;
    lastUrl = window.location.pathname;

    if (!urlMatchRe.test(lastUrl)) {
      setFab({ show: false });
      setManga({ show: false });
      return;
    }

    await waitDom('.imageContainer > img');

    // 先将 imgList 清空以便 activePageIndex 归零
    setManga({ imgList: [] });
    init(getImgList);
    setManga({
      onPrev: querySelectorClick(findButton('上一')),
      onNext: querySelectorClick(findButton('下一')),
    });
  });
})();
