import { handleError, querySelector, toast, useInit, waitDom } from 'main';
import { getChapterInfo } from '../helper/dmzjApi';

const chapterIdRe = /(?<=\/)\d+(?=\.html)/;

const turnPage = (chapterId?: number) => {
  if (!chapterId) return undefined;

  return () => {
    window.open(
      window.location.href.replace(/(?<=\/)\d+(?=\.html)/, `${chapterId}`),
      '_self',
    );
  };
};

(async () => {
  await waitDom('.head_wz');
  // 只在漫画页内运行
  const comicId = querySelector('.head_wz [id]')?.id;
  const chapterId = window.location.pathname.match(chapterIdRe)?.[0];

  if (!comicId || !chapterId) return;

  const { setManga, init } = await useInit('dmzj');

  try {
    const { next_chap_id, prev_chap_id, page_url } = await getChapterInfo(
      comicId,
      chapterId,
    );
    init(() => page_url);

    setManga({
      onNext: turnPage(next_chap_id),
      onPrev: turnPage(prev_chap_id),
    });
  } catch (_) {
    toast.error('获取漫画数据失败', { duration: Infinity });
  }
})().catch(handleError);
