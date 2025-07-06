import { getChapterInfo } from 'userscript/dmzjApi';
import { toast, useInit } from 'main';
import { log, querySelector, waitDom } from 'helper';

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
  const chapterId = /(?<=\/)\d+(?=\.html)/.exec(window.location.pathname)?.[0];

  if (!comicId || !chapterId) return;

  const { setState } = await useInit('dmzj');

  try {
    const { next_chap_id, prev_chap_id, page_url } = await getChapterInfo(
      comicId,
      chapterId,
    );
    setState((state) => {
      state.comicMap[''].getImgList = () => page_url;
      state.manga.onNext = turnPage(next_chap_id);
      state.manga.onPrev = turnPage(prev_chap_id);
    });
  } catch {
    toast.error('获取漫画数据失败', { duration: Number.POSITIVE_INFINITY });
  }
})().catch((error) => log.error(error));
