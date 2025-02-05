import { ReactiveSet, request, toast, useInit } from 'main';
import { getAdPageByContent } from 'userscript/detectAd';
import {
  createEffectOn,
  useStyle,
  domParse,
  log,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  singleThreaded,
  t,
} from 'helper';

/** 用于转换获得图片文件扩展名 */
const fileType = { j: 'jpg', p: 'png', g: 'gif', w: 'webp', b: 'bmp' } as const;

type Images = {
  thumbnail: { h: number; w: number; t: keyof typeof fileType };
  pages: Array<{ t: keyof typeof fileType }>;
};
declare const _gallery: { num_pages: number; media_id: string; images: Images };

(async () => {
  const {
    options,
    setFab,
    setManga,
    setComicLoad,
    showComic,
    comicMap,
    setComicMap,
  } = await useInit('nhentai', {
    /** 无限滚动 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true,
    /** 识别广告页 */
    detect_ad: true,
  });

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    setManga({
      onExit(isEnd) {
        if (isEnd) scrollIntoView('#comment-container');
        setManga('show', false);
      },
    });

    // 图片域名编号目前是完全随机的，每次刷新都会出现不同的编号
    // 在图片元素的 data-src 里也是随机的，加载图片时还要用 get_cdn_url 函数替换
    // 但目前实测 i1 到 i4 都能直接用，或许是反爬虫的新机制？
    const hostIndex = unsafeWindow._n_app.options.media_server as number;
    setComicLoad(() =>
      _gallery.images.pages.map(
        (img, i) =>
          `https://i${hostIndex}.nhentai.net/galleries/${_gallery.media_id}/${i + 1}.${fileType[img.t]}`,
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

    const enableDetectAd =
      options.detect_ad && querySelector('#tags .tag.tag-144644');
    if (enableDetectAd) {
      setComicMap('', 'adList', new ReactiveSet());

      // 先使用缩略图识别
      await getAdPageByContent(
        querySelectorAll<HTMLImageElement>('.thumb-container img').map(
          (img) => img.dataset.src,
        ),
        comicMap[''].adList!,
      );

      // 加载了原图后再用原图识别
      createEffectOn(
        () => comicMap[''].imgList,
        (imgList) =>
          imgList?.length && getAdPageByContent(imgList, comicMap[''].adList!),
      );

      // 模糊广告页的缩略图
      useStyle(() => {
        if (!comicMap['']?.adList?.size) return '';
        const styleList = [...comicMap[''].adList].map(
          (i) => `
            .thumb-container:nth-of-type(${i + 1}):not(:hover) {
              filter: blur(8px);
              clip-path: border-box;
            }`,
        );
        return styleList.join('\n');
      });
    }

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
      const getObserveDom = () =>
        contentDom.querySelector(
          ':is(.index-container, #favcontainer):last-of-type',
        )!;

      const loadNextPage = singleThreaded(async (): Promise<void> => {
        if (!nextUrl) return;

        const res = await request(nextUrl, {
          fetch: true,
          errorText: t('site.nhentai.fetch_next_page_failed'),
        });
        const html = domParse(res.responseText);
        history.replaceState(null, '', nextUrl);

        const container = html.querySelector(
          '.index-container, #favcontainer',
        )!;
        for (const galleryDom of container.querySelectorAll<HTMLElement>(
          '.gallery',
        )) {
          for (const img of galleryDom.getElementsByTagName('img'))
            img.setAttribute('src', img.dataset.src!);

          // 判断是否有黑名单标签
          const tags = galleryDom.dataset.tags!.split(' ').map(Number);
          if (tags.some((tag) => blackSet.has(tag)))
            galleryDom.classList.add('blacklisted');
        }

        const pagination = html.querySelector<HTMLElement>('.pagination')!;
        nextUrl = pagination.querySelector<HTMLAnchorElement>('a.next')?.href;

        contentDom.append(container, pagination);

        const hr = document.createElement('hr');
        contentDom.append(hr);
        observer.disconnect();
        observer.observe(getObserveDom());
        if (!nextUrl) hr.style.animationPlayState = 'paused';
      }, false);

      loadNextPage();

      const observer = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && loadNextPage(),
      );
      observer.observe(getObserveDom());

      if (querySelector('section.pagination'))
        contentDom.append(document.createElement('hr'));
    }
  }
})().catch((error) => log.error(error));
