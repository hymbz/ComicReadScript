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
    const galleryId = /^\/g\/(?<id>\d+)/u.exec(location.pathname)?.groups?.id;
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
          const galleryId = /^\/g\/(?<id>\d+)/u.exec(location.pathname)?.groups
            ?.id;
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

        /* 被 Cloudflare challenge 反爬影响时用最后一个 hr 提示 */
        hr.crs-scroll-error {
          display: flex;
          gap: 0.75em;
          align-items: center;

          margin: 1em auto 2em;
          border: none;

          font-size: 13px;
          color: rgb(240 240 240 / 60%);
          white-space: nowrap;

          animation: none;
        }

        hr.crs-scroll-error::before,
        hr.crs-scroll-error::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgb(255 255 255 / 35%);
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

          // 因 Cloudflare 反爬而拿不到数据时，
          // 用最后一个 hr 显示提示并停止翻页，避免继续空转
          const pagination = html.querySelector<HTMLElement>('.pagination');
          if (!pagination) {
            nextUrl = undefined;
            const hrList = contentDom.querySelectorAll<HTMLHRElement>('hr');
            const lastHr = hrList.item(hrList.length - 1);
            if (lastHr) {
              lastHr.classList.add('crs-scroll-error');
              const tip = document.createElement('span');
              tip.textContent =
                'Loading blocked — please pass the Cloudflare verification, then refresh.';
              lastHr.replaceChildren(tip);
            }
            return;
          }

          const container = html.querySelector<HTMLElement>(
            '.index-container, #favcontainer',
          )!;
          const currentPageUrl = nextUrl;
          nextUrl = pagination.querySelector<HTMLAnchorElement>('a.next')?.href;

          contentDom.append(container, pagination);

          // 记录该页内容与 url 的对应关系
          pages.set(container, currentPageUrl);
          urlObserver.observe(container);

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

      // 依据每页内容在视口中的可见情况，实时同步地址栏 url：
      // 视口内 50% 可见的最后一页视为当前浏览页
      const pages = new Map<Element, string>();
      const urlObserver = new IntersectionObserver(
        (entries) => {
          let visibleUrl: string | undefined;
          for (const { isIntersecting, target, intersectionRatio } of entries) {
            if (isIntersecting && intersectionRatio >= 0.5 && pages.has(target))
              visibleUrl = pages.get(target);
          }
          if (visibleUrl && visibleUrl !== location.href)
            history.replaceState(null, '', visibleUrl);
        },
        { threshold: 0.5 },
      );

      // 首屏内容页初始化时，记录当前页 url 并监听可见情况
      for (const el of querySelectorAll('.index-container, #favcontainer')) {
        pages.set(el, location.href);
        urlObserver.observe(el);
      }

      if (querySelector('section.pagination'))
        contentDom.append(document.createElement('hr'));

      return () => {
        observer.disconnect();
        urlObserver.disconnect();
      };
    },
  },
});
