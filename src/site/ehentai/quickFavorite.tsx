import { type Accessor, For, createSignal, Show } from 'solid-js';
import { render } from 'solid-js/web';
import { request, toast } from 'main';
import { t, domParse, querySelector, querySelectorAll, useStyle } from 'helper';

import type { EhContext } from './helper';

const style = `
  .comidread-favorites {
    position: absolute;
    z-index: 75;
    left: 0;

    overflow: auto;
    align-content: center;

    box-sizing: border-box;
    width: 100%;
    padding-left: 0.6em;

    border: none;
    border-radius: 0;
  }

  .comidread-favorites-item {
    cursor: pointer;

    display: flex;
    align-items: center;

    width: 100%;
    margin: 1em 0;

    text-align: left;
    overflow-wrap: anywhere;
  }

  .comidread-favorites-item > input {
    pointer-events: none;
    margin: 0 0.5em 0 0;
  }

  .comidread-favorites-item > div {
    flex-shrink: 0;

    width: 15px;
    height: 15px;
    margin: 0 0.5em 0 0;

    background-image: url("https://ehgt.org/g/fav.png");
    background-repeat: no-repeat;
  }

  .gl1t > .comidread-favorites {
    padding: 1em 1.5em;
  }
`;

const addQuickFavorite = (
  favoriteButton: HTMLElement,
  root: HTMLElement,
  apiUrl: string,
  height: number,
  top = 0,
) => {
  root.style.position = 'relative';

  const [show, setShow] = createSignal(false);

  const [favorites, setFavorites] = createSignal<HTMLElement[]>([]);
  const [favnote, setFavnote] = createSignal('');

  const updateFavorite = async () => {
    try {
      const res = await request(apiUrl, {
        errorText: t('site.ehentai.fetch_favorite_failed'),
      });
      const dom = domParse(res.responseText);
      const list = [...dom.querySelectorAll('.nosel > div')] as HTMLElement[];
      if (list.length === 10) list[0].querySelector('input')!.checked = false;
      setFavnote(
        dom.querySelector<HTMLTextAreaElement>(
          '#galpop textarea[name="favnote"]',
        )?.value ?? '',
      );
      setFavorites(list);
    } catch {
      toast.error(t('site.ehentai.fetch_favorite_failed'));
      setFavorites([]);
    }
  };

  let hasRender = false;
  const renderDom = () => {
    if (hasRender) return;
    hasRender = true;

    const FavoriteItem = (e: HTMLElement, index: Accessor<number>) => {
      const { checked } = e.querySelector('input')!;

      const handleClick = async () => {
        if (checked) return;

        setShow(false);

        const formData = new FormData();
        formData.append('favcat', index() === 10 ? 'favdel' : `${index()}`);
        formData.append('apply', 'Apply Changes');
        formData.append('favnote', favnote());
        formData.append('update', '1');
        const res = await request(apiUrl, {
          method: 'POST',
          data: formData,
          errorText: t('site.ehentai.change_favorite_failed'),
        });

        toast.success(t('site.ehentai.change_favorite_success'));

        // 修改收藏按钮样式的 js 代码
        const updateCode = /\nif\(window.opener.document.+\n/
          .exec(res.responseText)?.[0]
          ?.replaceAll('window.opener.document', 'window.document');
        if (updateCode) eval(updateCode); // eslint-disable-line no-eval

        await updateFavorite();
      };

      return (
        <div class="comidread-favorites-item" onClick={handleClick}>
          <input type="radio" checked={checked} />
          <Show when={index() <= 9}>
            <div
              style={{ 'background-position': `0px -${2 + 19 * index()}px` }}
            />
          </Show>
          {e.textContent?.trim()}
        </div>
      );
    };

    let background = 'rgba(0, 0, 0, 0)';
    let dom = root;
    while (background === 'rgba(0, 0, 0, 0)') {
      background = getComputedStyle(dom).backgroundColor;
      dom = dom.parentElement!;
    }

    render(
      () => (
        <Show when={show()}>
          <span
            class="comidread-favorites"
            style={{
              background,
              height: `${height}px`,
              top: `${top}px`,
            }}
          >
            <For
              each={favorites()}
              children={FavoriteItem}
              fallback={<h3>loading...</h3>}
            />
          </span>
        </Show>
      ),
      root,
    );
  };

  // 将原本的收藏按钮改为切换显示快捷收藏夹
  const rawClick = favoriteButton.onclick as (ev: MouseEvent) => unknown;
  favoriteButton.onclick = null;
  favoriteButton.addEventListener('mousedown', async (e) => {
    if (e.buttons !== 1 && e.buttons !== 4) return;

    e.stopPropagation();
    e.preventDefault();

    if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.buttons === 4)
      return rawClick.call(favoriteButton, e);

    renderDom();
    setShow((val) => !val);
    if (show()) await updateFavorite();
  });
};

/** 快捷收藏的界面 */
export const quickFavorite = (context: EhContext) => {
  switch (context.type) {
    case 'gallery': {
      useStyle(style);
      const button = querySelector('#gdf')!;
      const root = querySelector('#gd3')!;
      const height = (button.firstElementChild as HTMLElement).offsetTop;
      addQuickFavorite(button, root, `${unsafeWindow.popbase}addfav`, height);
      break;
    }

    case 't': {
      useStyle(style);
      for (const item of querySelectorAll('.gl1t')) {
        const button = item.querySelector<HTMLElement>('[id^=posted_]')!;
        const top =
          item.firstElementChild!.getBoundingClientRect().bottom -
          item.getBoundingClientRect().top;
        const bottom =
          item.lastElementChild!.getBoundingClientRect().top -
          item.getBoundingClientRect().top;
        const apiUrl = /http.+?(?=')/.exec(button.getAttribute('onclick')!)![0];
        addQuickFavorite(button, item, apiUrl, bottom - top, top);
      }
      break;
    }

    case 'e': {
      useStyle(style);
      for (const item of querySelectorAll('.gl1e')) {
        const button =
          item.nextElementSibling!.querySelector<HTMLElement>('[id^=posted_]')!;
        const height = Number.parseInt(getComputedStyle(item).height, 10);
        const apiUrl = /http.+?(?=')/.exec(button.getAttribute('onclick')!)![0];
        addQuickFavorite(button, item, apiUrl, height);
      }
      break;
    }
  }
};
