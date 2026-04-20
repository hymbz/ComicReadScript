import {
  createEffectOn,
  domParse,
  fileType,
  log,
  onUrlChange,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  singleThreaded,
  t,
  useStyle,
  wait,
} from 'helper';
import { ReactiveSet, request, toast, useInit } from 'main';
import { getAdPageByContent } from 'userscript/detectAd';
import { getNhentaiData, getNhentaiImageUrl } from '../userscript/nhentaiApi';

type Images = {
  thumbnail: { t: keyof typeof fileType; w: number; h: number };
  pages: { t: keyof typeof fileType; w: number; h: number }[];
};
declare const _gallery: { num_pages: number; media_id: string; images: Images };

(async () => {
  const { store, options, setState, showComic } = await useInit('nhentai', {
    /** 无限滚动 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true,
    /** 识别广告页 */
    detect_ad: true,
  });

  let currentGalleryId: string | null = null;

  const removeComicReadMode = () => {
    querySelector('#comicReadMode')?.remove();
  };

  const createComicReadMode = () => {
    const el = document.createElement('a');
    el.href = 'javascript:;';
    el.id = 'comicReadMode';
    el.className = 'btn btn-secondary';
    el.addEventListener('click', showComic);
    el.innerHTML = '<i class="fa fa-book"></i> Read';
    return el;
  };

  const setupDetailPage = async (id: string) => {
    if (currentGalleryId === id) return;
    currentGalleryId = id;

    removeComicReadMode();

    setState('manga', {
      onExit(isEnd) {
        if (isEnd) scrollIntoView('#comment-container');
        setState('manga', 'show', false);
      },
    });

    let gallery: any = null;
    try {
      gallery = await getNhentaiData(id);
    } catch (error) {
      log.error('nhentai getNhentaiData failed', error);
    }

    if (gallery) {
      const getImgList = () =>
        gallery.pages.map((page: any, i: number) => ({
          src: getNhentaiImageUrl(gallery, i),
          width: page.width,
          height: page.height,
        }));

      setState('comicMap', '', { getImgList });
    }

    setState('fab', 'initialShow', options.autoShow);

    const comicReadModeDom = createComicReadMode();
    const downloadBtn = document.getElementById('download');
    if (downloadBtn) downloadBtn.after(comicReadModeDom);
    else document.body.append(comicReadModeDom);

    const shouldDetectAd = options.detect_ad;
    const adTagSelector = '#tags a[href="/tag/extraneous-ads/"]';
    const detectedTag = shouldDetectAd
      ? await wait(
          () => querySelector(adTagSelector),
          1000,
        )
      : null;
    const enableDetectAd = Boolean(detectedTag);
    if (enableDetectAd) {
      setState('comicMap', '', 'adList', new ReactiveSet());

      // 先使用缩略图识别
      await getAdPageByContent(
        querySelectorAll<HTMLImageElement>('.thumb-container img').map(
          (img) => img.dataset.src || img.src,
        ),
        store.comicMap[''].adList!,
      );

      // 加载了原图后再用原图识别
      createEffectOn(
        () => store.comicMap[''].imgList,
        (imgList) =>
          imgList?.length &&
          getAdPageByContent(
            imgList.map((img) => (typeof img === 'string' ? img : img.src)),
            store.comicMap[''].adList!,
          ),
      );

      // 模糊广告页的缩略图
      useStyle(() => {
        if (!store.comicMap['']?.adList?.size) return '';
        const styleList = [...store.comicMap[''].adList].map(
          (i) => `
            .thumb-container:nth-of-type(${i + 1}):not(:hover) {
              filter: blur(8px);
              clip-path: border-box;
            }`,
        );
        return styleList.join('\n');
      });
    }
  };

  const setupListPage = async () => {
    currentGalleryId = null;
    removeComicReadMode();

    // 在漫画浏览页
    if (!document.getElementsByClassName('gallery').length) return;
    if (location.pathname.startsWith('/g/')) return;

    if (options.open_link_new_page)
      for (const e of querySelectorAll('a:not([href^="javascript:"])'))
        e.setAttribute('target', '_blank');

    const app = await wait(
      () => (window as any)._n_app ?? (window as any).n,
      2000,
      100,
    );
    const blacklist: number[] | null | undefined = app?.options?.blacklisted_tags;

    if (typeof blacklist === 'undefined' && app !== undefined)
      toast.error(t('site.nhentai.tag_blacklist_fetch_failed'));

    if (options.block_totally && Array.isArray(blacklist) && blacklist.length)
      useStyle('.blacklisted.gallery { display: none; }');

    const blackSet = new Set(Array.isArray(blacklist) ? blacklist : []);
    const contentDom = document.getElementById('content')!;
    let nextUrl = querySelector<HTMLAnchorElement>('a.next')?.href;
    const getObserveDom = () =>
      contentDom.querySelector(
        ':is(.index-container, #favcontainer):last-of-type',
      )!;

    const loadNextPage = singleThreaded(
      async (): Promise<void> => {
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
          for (const img of galleryDom.getElementsByTagName('img')) {
            const src = img.dataset.src || img.src;
            if (src) img.setAttribute('src', src);
          }

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
      },
      { abandon: true },
    );

    loadNextPage();

    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && loadNextPage(),
    );
    observer.observe(getObserveDom());

    if (querySelector('section.pagination'))
      contentDom.append(document.createElement('hr'));
  };

  const processPage = async () => {
    const galleryPathMatch = location.pathname.match(/^\/g\/(\d+)/);
    if (galleryPathMatch) {
      await setupDetailPage(galleryPathMatch[1]);
    } else {
      await setupListPage();
    }
  };

  await processPage();
  onUrlChange(async (_, nowUrl) => {
    const match = new URL(nowUrl).pathname.match(/^\/g\/(\d+)/);
    if (match) {
      await setupDetailPage(match[1]);
    } else {
      await setupListPage();
    }
  });

  return;
})().catch((error) => log.error(error));
