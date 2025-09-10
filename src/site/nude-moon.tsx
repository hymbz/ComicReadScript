import {
  domParse,
  onUrlChange,
  waitUrlChange,
} from 'helper';
import { useInit } from 'main';

(async () => {
  const isMangaPage = () => location.pathname.match(/^\/[0-9]+--/);
  await waitUrlChange(isMangaPage);

  const { store, setState, showComic, init } = await useInit('nude-moon', {
    autoShow: false,
    defaultOption: { pageNum: 1 },
  });

  const original = async () => {
    const url = new URL(location.href);
    const parts = url.pathname.split('-');
    parts.splice(1, 0, 'online');
    url.pathname = parts.join('-');

    const html = await fetch(url).then(e => e.text());
    const doc = domParse(html);

    const script = Array.from(doc.querySelectorAll("script"))
      .filter(e => e.textContent.includes("/manga/"))?.[0];
    if (!script) return [];

    return Array.from(
      script.textContent.matchAll(/\/manga\/[^']+/g),
      (e) => `https://nude-moon.org${e[0]}`
    );
  }
  setState('comicMap', '', { getImgList: original })

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

  init();
})();
