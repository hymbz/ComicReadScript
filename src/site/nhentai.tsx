import {
  insertNode,
  log,
  querySelector,
  querySelectorAll,
  request,
  scrollIntoView,
  singleThreaded,
  t,
  toast,
  useInit,
} from 'main';

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
  const { options, setFab, setManga, init } = await useInit('nhentai', {
    /** 无限滚动 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true,
  });

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit(isEnd) {
        if (isEnd) scrollIntoView('#comment-container');
        setManga('show', false);
      },
    });

    // 虽然有 Fab 了不需要这个按钮，但我自己都点习惯了没有还挺别扭的（
    insertNode(
      document.getElementById('download')!.parentNode as HTMLElement,
      '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Read</a>',
    );
    const comicReadModeDom = document.getElementById('comicReadMode')!;
    const { showComic } = init(() =>
      gallery.images.pages.map(
        ({ number, extension }) =>
          `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`,
      ),
    );
    setFab('initialShow', options.autoShow);
    comicReadModeDom.addEventListener('click', showComic);

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
      GM_addStyle(`
        hr { bottom: 1px; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);
      let pageNum = Number(querySelector('.page.current')?.innerHTML ?? '');
      if (Number.isNaN(pageNum)) return;

      const contentDom = document.getElementById('content')!;

      let apiUrl = '';
      if (window.location.pathname === '/') apiUrl = '/api/galleries/all?';
      else if (querySelector('a.tag'))
        apiUrl = `/api/galleries/tagged?tag_id=${
          querySelector('a.tag')?.classList[1].split('-')[1]
        }&`;
      else if (window.location.pathname.includes('search'))
        apiUrl = `/api/galleries/search?query=${new URLSearchParams(
          window.location.search,
        ).get('q')}&`;

      let observer: IntersectionObserver; // eslint-disable-line no-autofix/prefer-const

      const loadNewComic = singleThreaded(async (): Promise<void> => {
        pageNum += 1;

        type ResData = {
          num_pages: number;
          result: Array<{
            id: number;
            media_id: string;
            tags: Array<{ id: number }>;
            title: { english: string };
            images: Images;
          }>;
        };
        const res = await request<ResData>(
          `${apiUrl}page=${pageNum}${
            window.location.pathname.includes('popular') ? '&sort=popular ' : ''
          }`,
          {
            fetch: true,
            responseType: 'json',
            errorText: t('site.nhentai.fetch_next_page_failed'),
          },
        );
        const { result, num_pages } = res.response;

        let comicDomHtml = '';

        for (const comic of result) {
          const blacklisted = comic.tags.some((tag) =>
            blacklist?.includes(tag.id),
          );
          comicDomHtml += `<div class="gallery${
            blacklisted ? ' blacklisted' : ''
          }" data-tags="${comic.tags.map((e) => e.id).join(' ')}"><a ${
            options.open_link_new_page ? 'target="_blank"' : ''
          } href="/g/${comic.id}/" class="cover" style="padding:0 0 ${
            (comic.images.thumbnail.h / comic.images.thumbnail.w) * 100
          }% 0"><img is="lazyload-image" class="" width="${
            comic.images.thumbnail.w
          }" height="${
            comic.images.thumbnail.h
          }" src="https://t.nhentai.net/galleries/${comic.media_id}/thumb.${
            fileType[comic.images.thumbnail.t]
          }"><div class="caption">${comic.title.english}</div></a></div>`;
        }

        // 构建页数按钮
        if (comicDomHtml) {
          const target = options.open_link_new_page ? 'target="_blank" ' : '';
          const pageNumDom: string[] = [];
          for (let i = pageNum - 5; i <= pageNum + 5; i += 1) {
            if (i > 0 && i <= num_pages)
              pageNumDom.push(
                `<a ${target}href="?page=${i}" class="page${
                  i === pageNum ? ' current' : ''
                }">${i}</a>`,
              );
          }

          insertNode(
            contentDom,
            `<h1>${pageNum}</h1>
             <div class="container index-container">${comicDomHtml}</div>
             <section class="pagination">
              <a ${target}href="?page=1" class="first">
                <i class="fa fa-chevron-left"></i>
                <i class="fa fa-chevron-left"></i>
              </a>
              <a ${target}href="?page=${pageNum - 1}" class="previous">
                <i class="fa fa-chevron-left"></i>
              </a>
              ${pageNumDom.join('')}
                ${
                  pageNum === num_pages
                    ? ''
                    : `<a ${target}shref="?page=${pageNum + 1}" class="next">
                        <i class="fa fa-chevron-right"></i>
                      </a>
                      <a ${target}href="?page=${num_pages}" class="last">
                        <i class="fa fa-chevron-right"></i>
                        <i class="fa fa-chevron-right"></i>
                      </a>`
                }
              </section>`,
          );
        }

        // 添加分隔线
        const hr = document.createElement('hr');
        contentDom.append(hr);
        observer.disconnect();
        observer.observe(hr);
        if (pageNum >= num_pages) hr.style.animationPlayState = 'paused';

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('page', `${pageNum}`);
        history.replaceState(null, '', `?${urlParams.toString()}`);
      }, false);

      observer = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && loadNewComic(),
      );
      observer.observe(contentDom.lastElementChild!);

      if (querySelector('section.pagination'))
        contentDom.append(document.createElement('hr'));
    }
  }
})().catch((error) => log.error(error));
