import {
  createEffectOn,
  querySelectorAll,
  querySelectorClick,
  waitDom,
} from 'helper';
import { universalSPA } from 'main';

const original = () =>
  querySelectorAll<HTMLAnchorElement>('.post__thumbnail a').map((e) => e.href);
const thumbnail = () =>
  querySelectorAll<HTMLImageElement>('.post__thumbnail img').map((e) => e.src);

const handlePwa = () => {
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
};

universalSPA('kemono', {
  options: {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  },
  isMangaPage: async () => {
    if (!location.pathname.includes('/post/')) return false;
    await waitDom('.post__thumbnail');
    handlePwa();
    return true;
  },

  work: async ({ store, setState, showComic }) => {
    // 在切换时重新获取图片
    createEffectOn(
      () => store.options.load_original_image,
      (isOriginal, prev) => {
        setState('nowComic', isOriginal ? 'original' : 'thumbnail');
        if (prev) showComic();
      },
    );

    setState((state) => {
      state.comicMap.original = { getImgList: original };
      state.comicMap.thumbnail = { getImgList: thumbnail };
      state.manga.onNext = querySelectorClick('.post__nav-link.next');
      state.manga.onPrev = querySelectorClick('.post__nav-link.prev');
    });
  },
});
