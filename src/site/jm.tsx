import { request, toast, useInit } from 'main';
import {
  plimit,
  querySelectorAll,
  sleep,
  querySelectorClick,
  querySelector,
  wait,
  waitImgLoad,
  canvasToBlob,
  log,
} from 'helper';

// 已知问题：某些漫画始终会有几页在下载原图时出错
// 并且这类漫画下即使关掉脚本，也还是会有几页就是加载不出来
// 比较神秘的是这两种情况下加载不出来的图片还不一样
// 并且在多次刷新的情况下都是那几张图片加载不出来
// 另外这类漫画也有概率出现，在关闭脚本的情况下所有图片都加载不出来的情况，只能刷新
// 就很怪
// 对此只能放弃
// 例子：https://18comic.vip/photo/450291

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;

  const { init, setManga, setFab, dynamicUpdate } = await useInit('jm');

  while (!unsafeWindow?.onImageLoaded) {
    if (document.readyState === 'complete') {
      toast.error('无法获取图片', { duration: Number.POSITIVE_INFINITY });
      return;
    }

    await sleep(100);
  }

  setManga({
    onPrev: querySelectorClick(
      () =>
        querySelector('.menu-bolock-ul .fa-angle-double-left')?.parentElement,
    ),
    onNext: querySelectorClick(
      () =>
        querySelector('.menu-bolock-ul .fa-angle-double-right')?.parentElement,
    ),
  });

  const imgEleList = querySelectorAll<HTMLImageElement>(
    '.scramble-page:not(.thewayhome) > img',
  );

  // 判断当前漫画是否有被分割，没有就直接获取图片链接加载
  // 判断条件来自页面上的 scramble_image 函数
  if (
    unsafeWindow.aid < unsafeWindow.scramble_id ||
    unsafeWindow.speed === '1'
  ) {
    init(() => imgEleList.map((e) => e.dataset.original!));
    return;
  }

  const downloadImg = async (url: string) => {
    try {
      // 使用 fetch 可以复用本地缓存，但有时候会报 cors 问题
      return await request<Blob>(
        url,
        { responseType: 'blob', fetch: true, noTip: true },
        3,
      );
    } catch {
      return await request<Blob>(
        url,
        { responseType: 'blob', revalidate: true, fetch: false },
        3,
      );
    }
  };

  const getImgUrl = async (imgEle: HTMLImageElement) => {
    if (imgEle.src.startsWith('blob:')) return imgEle.src;

    const originalUrl = imgEle.src;
    const res = await downloadImg(imgEle.dataset.original!);
    if (res.response.size === 0) {
      toast.warn(`下载原图时出错: ${imgEle.dataset.page}`);
      return '';
    }

    imgEle.src = URL.createObjectURL(res.response);
    try {
      await waitImgLoad(imgEle, 1000 * 10);
    } catch {
      URL.revokeObjectURL(imgEle.src);
      imgEle.src = originalUrl;
      toast.warn(`加载原图时出错: ${imgEle.dataset.page}`);
      return '';
    }

    try {
      // 原有的 canvas 可能已被污染，直接删掉
      if (imgEle.nextElementSibling?.tagName === 'CANVAS')
        imgEle.nextElementSibling.remove();
      unsafeWindow.onImageLoaded(imgEle);
      const blob = await canvasToBlob(
        imgEle.nextElementSibling as HTMLCanvasElement,
        'image/webp',
        1,
      );
      URL.revokeObjectURL(imgEle.src);
      if (!blob) throw new Error('转换图片时出错');
      return `${URL.createObjectURL(blob)}#.webp`;
    } catch (error) {
      imgEle.src = originalUrl;
      toast.warn(
        `转换图片时出错: ${imgEle.dataset.page}, ${(error as Error).message}`,
      );
      return '';
    }
  };

  // 先等懒加载触发完毕
  await wait(() => {
    const loadedNum = querySelectorAll('.lazy-loaded').length;
    return loadedNum > 0 && querySelectorAll('canvas').length - loadedNum <= 1;
  });

  init(
    dynamicUpdate(
      (setImg) =>
        plimit(
          imgEleList.map(
            (img, i) => async () => setImg(i, await getImgUrl(img)),
          ),
          (doneNum, totalNum) => {
            setFab({
              progress: doneNum / totalNum,
              tip: `加载图片中 - ${doneNum}/${totalNum}`,
            });
          },
        ),
      imgEleList.length,
    ),
  );
})().catch((error) => log.error(error));
