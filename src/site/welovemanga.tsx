import { querySelectorAll, querySelectorClick, useInit } from 'main';

(async () => {
  const imgList = querySelectorAll('.chapter-content img[data-src]').map(
    (e) => e.getAttribute('data-src')!,
  );
  // 只在漫画页内运行
  if (!imgList.length) return;

  const { setManga, init } = await useInit('manhuagui');
  setManga({
    onNext: querySelectorClick('.rd_top-right.next:not(.disabled)'),
    onPrev: querySelectorClick('.rd_top-left.prev:not(.disabled)'),
  });

  init(() => imgList);
})();
