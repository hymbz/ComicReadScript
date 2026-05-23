import { request, setupSiteAdapter } from 'core';
import {
  ReactiveSet,
  createEffectOn,
  css,
  domParse,
  querySelector,
  querySelectorAll,
  scrollIntoView,
  singleThreaded,
  t,
  waitDom,
} from 'helper';
import { getAdPageByContent } from 'userscript/detectAd';

import { getNhentaiData, toImgList } from '../userscript/nhentaiApi';

/** 等待水合完成，确保之后的 dom 操作不会被水合覆盖 */
const waitHydrated = () => waitDom('#svelte-announcer', 1, 1000 * 5);

setupSiteAdapter({
  name: 'nhentai',
  options: {
    /** 无限滚动 */
    auto_page_turn: true,
    /** 彻底屏蔽漫画 */
    block_totally: true,
    /** 在新页面中打开链接 */
    open_link_new_page: true,
    /** 识别广告页 */
    detect_ad: true,
  },
  getPageContext: () => {
    const galleryId = /^\/g\/(\d+)/.exec(location.pathname)?.[1];
    if (galleryId) return { type: 'manga', galleryId } as const;

    if (querySelector('.container.index-container'))
      return { type: 'list' } as const;
  },
  handlers: {
    // oxlint-disable-next-line solid/no-destructure
    manga: async ({ setState, showComic }) => {
      setState('manga', {
        onExit(isEnd) {
          if (isEnd) scrollIntoView('#comment-container');
          setState('manga', 'show', false);
        },
      });

      setState('comicMap', '', {
        getImgList: async () => {
          const galleryId = /^\/g\/(\d+)/.exec(location.pathname)?.[1];
          if (!galleryId) throw new Error(t('site.changed_load_failed'));
          const galleryData = await getNhentaiData(galleryId);
          return toImgList(galleryData);
        },
      });

      await waitHydrated();
      const comicReadModeDom = (
        <a
          href="javascript:;"
          id="comicReadMode"
          class="btn btn-secondary"
          onClick={() => showComic()}
        >
          {/* oxlint-disable-next-line i18next/no-literal-string */}
          <i class="fa fa-book" /> Read
        </a>
      ) as HTMLAnchorElement;
      document.getElementById('download')?.after(comicReadModeDom);
    },
  },
  features: {
    /** 识别广告页 */
    detect_ad: async ({ store, setState }, pageCtx) => {
      if (pageCtx.type !== 'manga') return;
      if (!querySelector('#tags .tag[href="/tag/extraneous-ads/"]')) return;

      setState('comicMap', '', 'adList', new ReactiveSet());

      // 先使用缩略图识别
      await getAdPageByContent(
        querySelectorAll<HTMLImageElement>('.thumb-container img').map(
          (img) => img.src,
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
      css(() => {
        if (!store.comicMap['']?.adList?.size) return '';
        return [...store.comicMap[''].adList]
          .map(
            (i) => `
              .thumb-container:nth-of-type(${i + 1}):not(:hover) {
                filter: blur(8px);
                clip-path: border-box;
              }`,
          )
          .join('\n');
      });
    },

    /** 彻底屏蔽漫画 */
    block_totally: (_, pageCtx) => {
      if (pageCtx.type !== 'list') return;
      css`
        .blacklisted.gallery {
          display: none;
        }
      `;
    },

    /** 在新页面中打开链接 */
    open_link_new_page: async (_, pageCtx) => {
      if (pageCtx.type !== 'list') return;
      await waitHydrated();
      for (const e of querySelectorAll('a:not([href^="javascript:"])'))
        e.setAttribute('target', '_blank');
    },

    /** 无限滚动 */
    auto_page_turn: async (_, pageCtx) => {
      if (pageCtx.type !== 'list') return;
      await waitHydrated();

      let nextUrl = querySelector<HTMLAnchorElement>('a.next')?.href;
      let lastUrl = location.href;
      if (!nextUrl) return;

      css`
        hr {
          bottom: 1px;
          box-sizing: border-box;
          margin: -1em auto 2em;
        }

        hr:last-child {
          position: relative;
          animation: load 0.8s linear alternate infinite;
        }

        hr:not(:last-child) {
          display: none;
        }

        @keyframes load {
          0% {
            transform: scaleX(1);
          }

          100% {
            transform: scaleX(0);
          }
        }
      `;
      const contentDom = document.getElementById('content')!;
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

          const pagination = html.querySelector<HTMLElement>('.pagination')!;
          // 在加载出下一页内容的时候，将url设为当前这页的url
          history.pushState(null, '', lastUrl);
          lastUrl = nextUrl;
          nextUrl = pagination.querySelector<HTMLAnchorElement>('a.next')?.href;

          contentDom.append(
            html.querySelector('.index-container, #favcontainer')!,
            pagination,
          );

          const hr = document.createElement('hr');
          contentDom.append(hr);
          observer.disconnect();
          observer.observe(getObserveDom());
          if (!nextUrl) hr.style.animationPlayState = 'paused';
        },
        { abandon: true },
      );

      const observer = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && loadNextPage(),
        { threshold: 0.5 },
      );
      observer.observe(getObserveDom());

      if (querySelector('section.pagination'))
        contentDom.append(document.createElement('hr'));

      return () => observer.disconnect();
    },
  },
});
