import { createEffectOn, querySelectorAll, useInit } from 'main';

(async () => {
  const { init, options, setManga } = await useInit('kemono', {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  });

  const getImglist = () =>
    options.load_original_image
      ? querySelectorAll<HTMLAnchorElement>('.post__thumbnail a').map(
          (e) => e.href,
        )
      : querySelectorAll<HTMLImageElement>('.post__thumbnail img').map(
          (e) => e.src,
        );

  init(getImglist);

  // 在切换时重新获取图片
  createEffectOn(
    () => options.load_original_image,
    () => setManga('imgList', getImglist()),
  );

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
})();
