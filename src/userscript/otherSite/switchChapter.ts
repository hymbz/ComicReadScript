import { querySelectorAll } from 'helper';

import type { MangaProps } from '../../components/Manga';
import type { useInit } from '../main';

const prevRe = /^(上一?((章|章节|話|话))|prev|prev chapter|前の章)$/i;
const nextRe = /^(下一?((章|章节|話|话))|next|next chapter|次の章)$/i;

export const handleSwitchChapter = (
  setManga: AsyncReturnType<typeof useInit>['setManga'],
) => {
  let onPrev: MangaProps['onPrev'];
  let onNext: MangaProps['onNext'];

  for (const e of querySelectorAll('a, button')) {
    const texts = [e.textContent!, e.ariaLabel!]
      .filter(Boolean)
      // 删除可能混在其中的特殊符号
      .map((text) => text.replaceAll(/[<>()《》（）「」『』]/g, '').trim());
    if (texts.length === 0) continue;

    for (const text of texts) {
      if (!onPrev && prevRe.test(text)) {
        onPrev = () => e.click();
        break;
      }
      if (!onNext && nextRe.test(text)) {
        onNext = () => e.click();
        break;
      }
    }

    if (onPrev && onNext) break;
  }

  setManga({ onPrev, onNext });
};
