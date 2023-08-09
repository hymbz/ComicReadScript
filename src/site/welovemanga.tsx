import { querySelectorAll, querySelectorClick, useInit, waitDom } from 'main';

(async () => {
  const imgSelector =
    '#listImgs img.chapter-img.chapter-img:not(.ls-is-cached)';
  await waitDom(imgSelector);
  const imgList = querySelectorAll<HTMLImageElement>(imgSelector).map(
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
