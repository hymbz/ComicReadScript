import { querySelectorAll, querySelectorClick, useInit } from 'main';

(async () => {
  const imgList = querySelectorAll<HTMLImageElement>('img.chapter-img').map(
    (e) =>
      e.getAttribute('data-src') ?? e.getAttribute('data-original') ?? e.src,
  );
  // 只在漫画页内运行
  if (!imgList.length) return;

  const { setManga, init } = await useInit('welovemanga');
  setManga({
    onNext: querySelectorClick('.rd_top-right.next:not(.disabled)'),
    onPrev: querySelectorClick('.rd_top-left.prev:not(.disabled)'),
  });

  init(() => imgList);
})();
