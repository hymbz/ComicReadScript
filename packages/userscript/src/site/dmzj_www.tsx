/* eslint-disable camelcase */
import { querySelectorClick, useInit } from '../helper';

declare const picArry: string[];
declare const img_prefix: string;

(async () => {
  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'g_comic_id')) return;

  const { setManga, init } = await useInit('dmzj');
  setManga({
    onNext: querySelectorClick('.next > a'),
    onPrev: querySelectorClick('.pre > a'),
  });

  init(() => picArry.map((url) => `${img_prefix}${url}`));
})();
