import {
  insertNode,
  log,
  querySelector,
  querySelectorAll,
  request,
  scrollIntoView,
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
  pages: { number: number; extension: string }[];
};
declare const gallery: { num_pages: number; media_id: string; images: Images };

(async () => {
  const { options, setFab, setManga, init } = await useInit('nhentai', {
    /** 自动翻页 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true,
  });

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit: (isEnd) => {
        if (isEnd) scrollIntoView('#comment-container');
        setManga({ show: false });
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
    setFab({ initialShow: options.autoShow });
    comicReadModeDom.addEventListener('click', showComic);

    return;
  }

  // 在漫画浏览页
  if (document.getElementsByClassName('gallery').length) {
    if (options.open_link_new_page)
      querySelectorAll('a:not([href^="javascript:"])').forEach((e) =>
        e.setAttribute('target', '_blank'),
      );

    const blacklist: number[] = (unsafeWindow?._n_app ?? unsafeWindow?.n)
      ?.options?.blacklisted_tags;
    if (blacklist === undefined)
      toast.error(t('site.nhentai.tag_blacklist_fetch_failed'));
    // blacklist === null 时是未登录

    if (options.block_totally && blacklist?.length)
      await GM.addStyle('.blacklisted.gallery { display: none; }');

    if (options.auto_page_turn) {
      await GM.addStyle(`
        hr { bottom: 0; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);
      let pageNum = Number(querySelector('.page.current')?.innerHTML ?? '');
      if (Number.isNaN(pageNum)) return;

      let loadLock = !pageNum;
      const contentDom = document.getElementById('content')!;
      const apiUrl = (() => {
        if (window.location.pathname === '/')
          return 'https://nhentai.net/api/galleries/all?';
        if (querySelector('a.tag'))
          return `https://nhentai.net/api/galleries/tagged?tag_id=${querySelector(
            'a.tag',
          )?.classList[1].split('-')[1]}&`;
        if (window.location.pathname.includes('search'))
          return `https://nhentai.net/api/galleries/search?query=${new URLSearchParams(
            window.location.search,
          ).get('q')}&`;
        return '';
      })();

      const loadNewComic = async (): Promise<void> => {
        if (
          loadLock ||
          contentDom.lastElementChild!.getBoundingClientRect().top >
            window.innerHeight
        )
          return undefined;

        loadLock = true;
        pageNum += 1;
        const res = await request(
          `${apiUrl}page=${pageNum}${
            window.location.pathname.includes('popular') ? '&sort=popular ' : ''
          }`,
          { errorText: t('site.nhentai.fetch_next_page_failed') },
        );

        const { result, num_pages } = JSON.parse(res.responseText) as {
          num_pages: number;
          result: {
            id: number;
            media_id: string;
            tags: { id: number }[];
            title: { english: string };
            images: Images;
          }[];
        };

        let comicDomHtml = '';

        result.forEach((comic) => {
          const blacklisted = comic.tags.some(
            (tag) => blacklist?.includes(tag.id),
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
        });

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
        contentDom.appendChild(document.createElement('hr'));
        if (pageNum < num_pages) loadLock = false;
        else
          (
            contentDom.lastElementChild as HTMLElement
          ).style.animationPlayState = 'paused';

        // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
        if (
          !comicDomHtml ||
          contentDom.offsetHeight < document.body.offsetHeight
        )
          return loadNewComic();

        return undefined;
      };

      window.addEventListener('scroll', loadNewComic);
      if (querySelector('section.pagination'))
        contentDom.appendChild(document.createElement('hr'));
      await loadNewComic();
    }
  }
})().catch((e) => log.error(e));
