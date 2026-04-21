import { createEffectOn } from 'helper';
import { request, universalSPA } from 'main';

let imgs: {
  urls: { original: string; regular: string };
  height: number;
  width: number;
}[] = [];

universalSPA('pixiv', {
  options: {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  },
  getPageType: async () => {
    if (!location.pathname.startsWith('/artworks/')) return;

    const [, , id] = location.pathname.split('/');
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

    return { type: 'manga', id };
  },

  handlers: {
    manga: async ({ store, setState, showComic }) => {
      // 在切换时重新获取图片
      createEffectOn(
        () => store.options.load_original_image,
        (isOriginal, prev) => {
          setState('nowComic', isOriginal ? 'original' : 'regular');
          if (prev) showComic();
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
  },
});
