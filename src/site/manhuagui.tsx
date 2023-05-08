import { querySelectorClick, useInit } from '../main';

declare const pVars: { manga: { filePath: string } };
declare const cInfo: { nextId: number; prevId: number };

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'cInfo')) return;

  const { setManga, init } = await useInit('manhuagui');
  setManga({
    onNext: cInfo.nextId !== 0 ? querySelectorClick('a.nextC') : null,
    onPrev: cInfo.prevId !== 0 ? querySelectorClick('a.prevC') : null,
  });

  init(() => {
    const comicInfo = JSON.parse(
      // 只能通过 eval 获得数据
      // eslint-disable-next-line no-eval
      eval(
        document.querySelectorAll('body > script')[1].innerHTML.slice(26),
      ).slice(12, -12),
    );
    const sl = Object.entries(comicInfo.sl)
      .map((attr) => `${attr[0]}=${attr[1]}`)
      .join('&');
    return (comicInfo.files as string[]).map(
      (file) => `${pVars.manga.filePath}${file}?${sl}`,
    );
  });
})();
