import { createEffectOn, onUrlChange, waitUrlChange } from 'helper';
import { request, useInit } from 'main';

(async () => {
  let imgs: {
    urls: { original: string; regular: string };
    height: number;
    width: number;
  }[] = [];

  const isMangaPage = async () => {
    const id = Number(location.pathname.split('/')[2]);
    if (!id || !location.pathname.startsWith('/artworks/')) {
      imgs.length = 0;
      return false;
    }

    const res = await request<{ body: typeof imgs }>(
      `/ajax/illust/${id}/pages`,
      { responseType: 'json' },
    );
    imgs = res.response.body;
    return imgs.length > 1;
  };
  await waitUrlChange(isMangaPage);

  const { store, setState, showComic, init } = await useInit('pixiv', {
    autoShow: false,
    defaultOption: { pageNum: 1 },
    /** 加载原图 */
    load_original_image: true,
  });

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
    state.comicMap.original = {
      getImgList: getImgList(true),
      imgList: getImgList(true)(),
    };
    state.comicMap.regular = {
      getImgList: getImgList(false),
      imgList: getImgList(false)(),
    };
  });

  init();

  onUrlChange(async (lastUrl) => {
    if (!lastUrl) return;

    if (!isMangaPage())
      return setState((state) => {
        state.fab.show = false;
        state.manga.show = false;
      });

    setState((state) => {
      state.fab.show = undefined;
      state.manga.show = false;
    });

    if (store.options.autoShow) await showComic();
  });
})();
