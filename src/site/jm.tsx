import {
  request,
  plimit,
  querySelectorAll,
  sleep,
  toast,
  useInit,
} from '../main';

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;

  const { init, setFab } = await useInit('jm');

  while (!unsafeWindow?.onImageLoaded) {
    if (document.readyState === 'complete') {
      toast.error('无法获取图片', { duration: 60000 });
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
  }

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

  const getImgUrl = async (imgEle: HTMLImageElement) => {
    const res = await request<Blob>(imgEle.getAttribute('data-original')!, {
      responseType: 'blob',
    });
    imgEle.src = URL.createObjectURL(res.response);
    await new Promise((resolve, reject) => {
      imgEle.onload = resolve;
      imgEle.onerror = reject;
    });
    unsafeWindow.onImageLoaded(imgEle);
    const blob = await new Promise<Blob | null>((resolve) => {
      (imgEle.nextElementSibling as HTMLCanvasElement).toBlob(
        resolve,
        'image/webp',
        1,
      );
    });
    if (!blob) return '';
    return `${URL.createObjectURL(blob)}#.webp`;
  };

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
