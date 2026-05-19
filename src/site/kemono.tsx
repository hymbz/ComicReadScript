import { request, setupSiteAdapter } from 'core';
import {
  createEffectOn,
  querySelectorAll,
  querySelectorClick,
  waitDom,
} from 'helper';

import { useMultiSelectLoad } from '../userscript/multiSelect';

const original = () =>
  querySelectorAll<HTMLAnchorElement>('.post__thumbnail a').map((e) => e.href);
const thumbnail = () =>
  querySelectorAll<HTMLImageElement>('.post__thumbnail img').map((e) => e.src);

const handlePwa = () => {
  const zipExtension = new Set(['zip', 'rar', '7z', 'cbz', 'cbr', 'cb7']);
  for (const e of querySelectorAll<HTMLAnchorElement>('.post__attachment a')) {
    if (!zipExtension.has(e.href.split('.').pop()!)) continue;
    const a = document.createElement('a');
    a.href = `https://comic-read.pages.dev/?url=${encodeURIComponent(e.href)}`;
    a.textContent = e.textContent.replace('Download ', 'ComicReadPWA - ');
    a.className = e.className;
    a.style.opacity = '.6';
    e.parentNode!.insertBefore(a, e.nextElementSibling);
  }
};

setupSiteAdapter({
  name: 'kemono',
  options: {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  },
  getPageContext: () => {
    const listId = /\/fanbox\/user\/(\w+)/.exec(location.pathname)?.[1];
    if (listId) {
      const offset = Number(new URLSearchParams(location.search).get('o')) || 0;
      // 传递 offset 是为了在翻页时能被判定为页面改变
      const result = { type: 'list', id: listId, offset } as const;
      return result;
    }

    const postId = /\/post\/(\w+)/.exec(location.pathname)?.[1];
    if (!postId) return;
    return { type: 'manga', id: postId } as const;
  },

  handlers: {
    manga: async ({ store, setState, showComic }) => {
      await waitDom('.post__thumbnail');
      handlePwa();

      createEffectOn(
        () => store.options.load_original_image,
        (isOriginal, prev) => {
          setState('nowComic', isOriginal ? 'original' : 'thumbnail');
          if (prev) void showComic();
        },
      );

      setState((state) => {
        state.comicMap.original = { getImgList: original };
        state.comicMap.thumbnail = { getImgList: thumbnail };
        state.manga.onNext = querySelectorClick('.post__nav-link.next');
        state.manga.onPrev = querySelectorClick('.post__nav-link.prev');
      });
    },
    list: async (coreCtx, { id }) => {
      const { options } = coreCtx;

      const ms = await useMultiSelectLoad(coreCtx, {
        id,
        onStart: () => {
          for (const item of querySelectorAll('.post-card'))
            item.style.position = 'relative';
        },
        getImgList: async (postId) => {
          const res = await request<{
            previews: { name: string; path: string; serer: string }[];
          }>(`/api/v1${location.pathname}/post/${postId}`, {
            responseType: 'json',
            headers: { Accept: 'text/css' },
          });

          if (options.load_original_image)
            return res.response.previews.map(
              ({ serer, path, name }) => `${serer}/data${path}?f=${name}`,
            );

          return res.response.previews.map(
            ({ path }) => `https://img.${location.host}/thumbnail/data${path}`,
          );
        },
      });

      await ms.registerItems(id, async (map) => {
        for (const dom of await waitDom('.post-card', 20))
          map.set(dom, dom.dataset.id!);
      });

      return ms.createCleanup(id);
    },
  },
});
