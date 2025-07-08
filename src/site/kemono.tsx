import {
  createEffectOn,
  onUrlChange,
  querySelectorAll,
  querySelectorClick,
  wait,
  waitDom,
  waitUrlChange,
} from 'helper';
import { useInit } from 'main';

(async () => {
  const isMangaPage = () => location.pathname.includes('/post/');
  await waitUrlChange(isMangaPage);

  const { store, setState, showComic, init } = await useInit('kemono', {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  });

  // 在切换时重新获取图片
  createEffectOn(
    () => store.options.load_original_image,
    (isOriginal, prev) => {
      setState('nowComic', isOriginal ? 'original' : 'thumbnail');
      if (prev) showComic();
    },
  );

  await waitDom('.post__thumbnail');

  const original = () =>
    querySelectorAll<HTMLAnchorElement>('.post__thumbnail a').map(
      (e) => e.href,
    );
  const thumbnail = () =>
    querySelectorAll<HTMLImageElement>('.post__thumbnail img').map(
      (e) => e.src,
    );
  setState((state) => {
    state.comicMap.original = { getImgList: original, imgList: original() };
    state.comicMap.thumbnail = { getImgList: thumbnail, imgList: thumbnail() };
    state.manga.onNext = querySelectorClick('.post__nav-link.next');
    state.manga.onPrev = querySelectorClick('.post__nav-link.prev');
  });
  init();

  // 加上跳转至 pwa 的链接
  const zipExtension = new Set(['zip', 'rar', '7z', 'cbz', 'cbr', 'cb7']);
  for (const e of querySelectorAll<HTMLAnchorElement>('.post__attachment a')) {
    if (!zipExtension.has(e.href.split('.').pop()!)) continue;
    const a = document.createElement('a');
    a.href = `https://comic-read.pages.dev/?url=${encodeURIComponent(e.href)}`;
    a.textContent = e.textContent!.replace('Download ', 'ComicReadPWA - ');
    a.className = e.className;
    a.style.opacity = '.6';
    e.parentNode!.insertBefore(a, e.nextElementSibling);
  }

  onUrlChange(async (lastUrl) => {
    if (!lastUrl) return;

    if (!isMangaPage())
      return setState((state) => {
        state.fab.show = false;
        state.manga.show = false;
      });

    setState((state) => {
      state.fab.show = undefined;
      state.manga.show = false;
    });

    await wait(() => thumbnail()[0] !== store.comicMap.thumbnail.imgList?.[0]);
    setState((state) => {
      state.comicMap.original.imgList = original();
      state.comicMap.thumbnail.imgList = thumbnail();
    });
    if (store.options.autoShow) await showComic();
  });
})();
