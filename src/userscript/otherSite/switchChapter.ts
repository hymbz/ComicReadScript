import { querySelectorAll } from 'helper';

import type { MangaProps } from '../../components/Manga';
import type { useInit } from '../main';

const prevRe = /^(上一((章|章节|話|话))|prev chapter|前の章)$/i;

const nextRe = /^(下一((章|章节|話|话))|next chapter|次の章)$/i;

export const handleSwitchChapter = (
  setManga: AsyncReturnType<typeof useInit>['setManga'],
) => {
  let onPrev: MangaProps['onPrev'];
  let onNext: MangaProps['onNext'];

  for (const element of querySelectorAll('a, button')) {
    const text = element.textContent?.trim();
    if (!text) continue;
    if (!onPrev && prevRe.test(text)) onPrev = element.click;
    if (!onNext && nextRe.test(text)) onNext = element.click;
    if (onPrev && onNext) break;
  }

  setManga({ onPrev, onNext });
};
