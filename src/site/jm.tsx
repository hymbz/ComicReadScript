import {
  request,
  plimit,
  querySelectorAll,
  sleep,
  toast,
  useInit,
  querySelectorClick,
  wait,
} from 'main';

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;

  const { init, setManga, setFab } = await useInit('jm');

  while (!unsafeWindow?.onImageLoaded) {
    if (document.readyState === 'complete') {
      toast.error('无法获取图片', { duration: Infinity });
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
  }

  setManga({
    onPrev: querySelectorClick('.menu-bolock-ul a:has(.fa-angle-double-left)'),
    onNext: querySelectorClick('.menu-bolock-ul a:has(.fa-angle-double-right)'),
  });

  const imgEleList = querySelectorAll<HTMLImageElement>('.scramble-page > img');

  // 判断当前漫画是否有被分割，没有就直接获取图片链接加载
  // 判断条件来自页面上的 scramble_image 函数
  if (
    unsafeWindow.aid < unsafeWindow.scramble_id ||
    unsafeWindow.speed === '1'
  ) {
    init(() => imgEleList.map((e) => e.getAttribute('data-original')!));
    return;
  }

  const isBlobUrl = /^blob:https?:\/\//;

  const getImgUrl = async (imgEle: HTMLImageElement) => {
    if (isBlobUrl.test(imgEle.src)) return imgEle.src;

    const originalUrl = imgEle.src;
    const res = await request<Blob>(imgEle.getAttribute('data-original')!, {
      responseType: 'blob',
      revalidate: true,
      fetch: true,
    });
    if (!res.response.size) {
      console.error('下载原图时出错', imgEle);
      return '';
    }

    imgEle.src = URL.createObjectURL(res.response);
    try {
      await new Promise((resolve) => {
        imgEle.onload = resolve;
        imgEle.onerror = resolve;
      });
    } catch (error) {
      URL.revokeObjectURL(imgEle.src);
      imgEle.src = originalUrl;
      console.warn('加载原图时出错', imgEle);
      return '';
    }

    try {
      unsafeWindow.onImageLoaded(imgEle);
      const blob = await new Promise<Blob | null>((resolve) => {
        (imgEle.nextElementSibling as HTMLCanvasElement).toBlob(
          resolve,
          'image/webp',
          1,
        );
      });
      URL.revokeObjectURL(imgEle.src);
      if (!blob) throw new Error('');
      return `${URL.createObjectURL(blob)}#.webp`;
    } catch (error) {
      imgEle.src = originalUrl;
      console.warn('转换图片时出错', imgEle);
      return '';
    }
  };

  // 先等网页自己的懒加载加载完毕
  await wait(
    () =>
      querySelectorAll('.lazy-loaded.hide').length &&
      querySelectorAll('.lazy-loaded.hide').length ===
        querySelectorAll('canvas').length,
  );

  init(() =>
    plimit<string>(
      imgEleList.map((img) => () => getImgUrl(img)),
      (doneNum, totalNum) => {
        setFab({
          progress: doneNum / totalNum,
          tip: `加载图片中 - ${doneNum}/${totalNum}`,
        });
      },
    ),
  );
})();
