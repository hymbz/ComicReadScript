import { querySelectorClick, request, useInit } from 'main';

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

  const chapter_id = window.location.pathname.split('/').at(-1);
  const res = await request(
    `https://api.copymanga.site/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`,
  );
  const commentList: string[] = JSON.parse(res.responseText).results.list.map(
    ({ comment }) => comment as string,
  );
  setManga({ commentList });
})();
