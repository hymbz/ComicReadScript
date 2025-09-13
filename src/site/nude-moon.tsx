import { hotkeysMap } from 'components/Manga';
import { domParse, getKeyboardCode, linstenKeydown } from 'helper';
import { useInit } from 'main';

(async () => {
  const isMangaPage = () => location.pathname.match(/^\/\d+-/) !== null;

  const original = async () => {
    const url = new URL(location.href);
    const parts = url.pathname.split('-');
    parts.splice(1, 0, 'online');
    url.pathname = parts.join('-');

    const html = await fetch(url).then((e) => e.text());
    const doc = domParse(html);

    const script = [...doc.querySelectorAll('script')].find((e) =>
      e.textContent.includes('/manga/'),
    );
    if (!script) return [];

    return Array.from(
      script.textContent.matchAll(/\/manga\/[^']+/g),
      (e) => `https://nude-moon.org${e[0]}`,
    );
  };

  const { setState } = await useInit('nude-moon', {
    autoShow: false,
    defaultOption: { pageNum: 1 },
  });

  setState((state) => {
    if (isMangaPage()) state.comicMap[''].getImgList = original;
  });

  linstenKeydown((e) => {
    switch (hotkeysMap()[getKeyboardCode(e)]) {
      case 'scroll_right':
        e.preventDefault();
        return unsafeWindow.nextImg();
      case 'scroll_left':
        e.preventDefault();
        return unsafeWindow.backImg();
    }
  });
})();
