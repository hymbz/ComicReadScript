import { request, setupSiteAdapter } from 'core';
import { createEffectOn, waitDom } from 'helper';

import { useMultiSelectLoad } from '../userscript/multiSelect';

let imgs: {
  urls: { original: string; regular: string };
  height: number;
  width: number;
}[] = [];

setupSiteAdapter({
  name: 'pixiv',
  options: {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  },
  getPageContext: async () => {
    const listId = /^\/users\/(?<listId>\d+)/u.exec(location.pathname)?.groups
      ?.listId;
    if (listId) return { type: 'list', id: listId } as const;

    if (!location.pathname.startsWith('/artworks/')) return;

    const id = /^\/artworks\/(?<artworkId>\d+)/u.exec(location.pathname)?.groups
      ?.artworkId;
    if (!id) {
      imgs.length = 0;
      return;
    }

    const res = await request<{ body: typeof imgs }>(
      `/ajax/illust/${id}/pages`,
      { responseType: 'json' },
    );
    if (res.response.body.length <= 1) return;
    imgs = res.response.body;

    return { type: 'manga', id } as const;
  },

  handlers: {
    manga: ({ store, setState, showComic }) => {
      // 在切换时重新获取图片
      createEffectOn(
        () => store.options.load_original_image,
        (isOriginal, prev) => {
          setState('nowComic', isOriginal ? 'original' : 'regular');
          if (prev) void showComic();
        },
      );

      const getImgList = (isOriginal: boolean) => () =>
        imgs.map((img) => {
          const src = isOriginal ? img.urls.original : img.urls.regular;
          return { src, height: img.height, width: img.width };
        });

      setState((state) => {
        state.comicMap.original = { getImgList: getImgList(true) };
        state.comicMap.regular = { getImgList: getImgList(false) };
      });
    },
    list: async (coreCtx, { id }) => {
      const { options } = coreCtx;

      const ms = await useMultiSelectLoad(coreCtx, {
        id,
        getImgList: async (workId) => {
          const res = await request<{ body: typeof imgs }>(
            `/ajax/illust/${workId}/pages`,
            { responseType: 'json' },
          );

          if (options.load_original_image)
            return res.response.body.map((img) => img.urls.original);
          return res.response.body.map((img) => img.urls.regular);
        },
      });

      await ms.registerItems(id, async (map) => {
        for (const dom of await waitDom('li div[data-worktype="illusts"]'))
          map.set(dom, dom.dataset.workid!);
      });

      return ms.createCleanup(id);
    },
  },
});
