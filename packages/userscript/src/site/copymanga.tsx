import { querySelectorClick, request, useInit } from '../helper';

(async () => {
  // 只在漫画页内运行
  if (!window.location.href.includes('/chapter/')) return;

  const { setManga, init } = await useInit('copymanga');
  setManga({
    onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
    onPrev: querySelectorClick(
      '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
    ),
  });

  init(async () => {
    const res = await request(
      window.location.href.replace(
        /.*?(?=\/comic\/)/,
        'https://api.copymanga.site/api/v3',
      ),
    );

    const {
      results: {
        chapter: { contents },
      },
    } = JSON.parse(res.responseText);

    type ContentsType = { url: string }[];
    return (contents as ContentsType).map(({ url }) => url);
  });
})();
