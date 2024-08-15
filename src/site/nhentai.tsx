import { request, toast, useInit } from 'main';
import {
  domParse,
  log,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  singleThreaded,
  t,
} from 'helper';

/** 用于转换获得图片文件扩展名 */
const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
};

type Images = {
  thumbnail: { h: number; w: number; t: keyof typeof fileType };
  pages: Array<{ number: number; extension: string }>;
};
declare const gallery: { num_pages: number; media_id: string; images: Images };

(async () => {
  const { options, setFab, setManga, setComicLoad, showComic } = await useInit(
    'nhentai',
    {
      /** 无限滚动 */
      auto_page_turn: true,
      /** 彻底屏蔽漫画 */
      block_totally: true,
      /** 在新页面中打开链接 */
      open_link_new_page: true,
    },
  );

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit(isEnd) {
        if (isEnd) scrollIntoView('#comment-container');
        setManga('show', false);
      },
    });

    setComicLoad(() =>
      gallery.images.pages.map(
        ({ number, extension }) =>
          `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`,
      ),
    );
    setFab('initialShow', options.autoShow);

    const comicReadModeDom = (
      <a
        href="javascript:;"
        id="comicReadMode"
        class="btn btn-secondary"
        onClick={() => showComic()}
      >
        {/* eslint-disable-next-line i18next/no-literal-string */}
        <i class="fa fa-book" /> Read
      </a>
    ) as HTMLAnchorElement;
    document.getElementById('download')!.after(comicReadModeDom);

    return;
  }

  // 在漫画浏览页
  if (document.getElementsByClassName('gallery').length > 0) {
    if (options.open_link_new_page)
      for (const e of querySelectorAll('a:not([href^="javascript:"])'))
        e.setAttribute('target', '_blank');

    const blacklist: number[] = (unsafeWindow?._n_app ?? unsafeWindow?.n)
      ?.options?.blacklisted_tags;
    if (blacklist === undefined)
      toast.error(t('site.nhentai.tag_blacklist_fetch_failed'));
    // blacklist === null 时是未登录

    if (options.block_totally && blacklist?.length)
      GM_addStyle('.blacklisted.gallery { display: none; }');

    if (options.auto_page_turn) {
      let nextUrl = querySelector<HTMLAnchorElement>('a.next')?.href;
      if (!nextUrl) return;

      GM_addStyle(`
        hr { bottom: 1px; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);

      const blackSet = new Set(blacklist);
      const contentDom = document.getElementById('content')!;

      const loadNextPage = singleThreaded(async (): Promise<void> => {
        if (!nextUrl) return;

        const res = await request(nextUrl, {
          fetch: true,
          errorText: t('site.nhentai.fetch_next_page_failed'),
        });
        const html = domParse(res.responseText);
        history.replaceState(null, '', nextUrl);

        const container = html.querySelector('.index-container')!;
        for (const gallery of container.querySelectorAll<HTMLElement>(
          '.gallery',
        )) {
          for (const img of gallery.getElementsByTagName('img'))
            img.setAttribute('src', img.dataset.src!);

          // 判断是否有黑名单标签
          const tags = gallery.dataset.tags!.split(' ').map(Number);
          if (tags.some((tag) => blackSet.has(tag)))
            gallery.classList.add('blacklisted');
        }

        const pagination = html.querySelector<HTMLElement>('.pagination')!;
        nextUrl = pagination.querySelector<HTMLAnchorElement>('a.next')?.href;

        contentDom.append(container, pagination);

        const hr = document.createElement('hr');
        contentDom.append(hr);
        observer.disconnect();
        observer.observe(hr);
        if (!nextUrl) hr.style.animationPlayState = 'paused';
      }, false);

      loadNextPage();

      const observer = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && loadNextPage(),
      );
      observer.observe(contentDom.lastElementChild!);

      if (querySelector('section.pagination'))
        contentDom.append(document.createElement('hr'));
    }
  }
})().catch((error) => log.error(error));
