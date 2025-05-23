import { request, toast, useInit, type LoadImgFn } from 'main';
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

(async () => {
  // 只在漫画页内运行
  if (!window.location.pathname.includes('/photo/')) return;

  const { setComicLoad, setManga, dynamicLoad } = await useInit('jm');

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
  if (unsafeWindow.aid < unsafeWindow.scramble_id || unsafeWindow.speed === '1')
    return setComicLoad(() => imgEleList.map((e) => e.dataset.original ?? ''));

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

    const originalUrl = imgEle.dataset.original!;
    const res = await downloadImg(imgEle.dataset.original!);
    if (res.response.size === 0) {
      toast.warn(`下载原图时出错: ${imgEle.dataset.page}`);
      return '';
    }

    imgEle.src = `${URL.createObjectURL(res.response)}#${imgEle.src}`;
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

  const loadImgList: LoadImgFn = async (setImg) =>
    plimit(
      imgEleList.map((img, i) => async () => {
        setImg(i, await getImgUrl(img));
      }),
    );
  setComicLoad(dynamicLoad(loadImgList, imgEleList.length));
})().catch((error) => log.error(error));
