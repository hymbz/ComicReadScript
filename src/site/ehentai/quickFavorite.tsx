import { request, toast } from 'core';
import { css, domParse, querySelector, querySelectorAll, t } from 'helper';
import { type Accessor, For, Show, createSignal } from 'solid-js';
import { render } from 'solid-js/web';

import { type EhFeatureHandler } from './helper';

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

  .comidread-blink {
    animation: comidread-blink 1.2s ease-in-out infinite;
  }

  @keyframes comidread-blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.25;
    }
  }
`;

const addQuickFavorite = ({
  button: favoriteButton,
  root,
  apiUrl,
  height,
  top = 0,
}: {
  button: HTMLElement;
  root: HTMLElement;
  apiUrl: string;
  height: number;
  top?: number;
}) => {
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

        // 请求期间让收藏按钮缓慢闪烁
        favoriteButton.classList.add('comidread-blink');
        const res = await request(apiUrl, {
          method: 'POST',
          data: formData,
          errorText: t('site.ehentai.change_favorite_failed'),
        }).finally(() => favoriteButton.classList.remove('comidread-blink'));

        toast.success(t('site.ehentai.change_favorite_success'));

        // 修改收藏按钮样式的 js 代码
        const updateCode = /\nif\(window.opener.document.+\n/u
          .exec(res.responseText)?.[0]
          ?.replaceAll('window.opener.document', 'window.document');
        if (updateCode) eval(updateCode); // oxlint-disable-line no-eval

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
  const rawClick = favoriteButton.onclick as (ev: MouseEvent) => void;
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

/** 快捷收藏 */
export const quickFavorite: EhFeatureHandler = (_, pageCtx) => {
  // 登录了才能收藏
  if (unsafeWindow.apiuid === -1) return;

  switch (pageCtx.type) {
    case 'gallery': {
      css(style);
      addQuickFavorite({
        root: querySelector('#gd3')!,
        button: querySelector('#gdf')!,
        apiUrl: `${unsafeWindow.popbase}addfav`,
        height: (querySelector('#gdf')!.firstElementChild as HTMLElement)
          .offsetTop,
      });
      break;
    }

    case 't': {
      css(style);
      for (const item of querySelectorAll('.gl1t')) {
        const button = item.querySelector<HTMLElement>('[id^=posted_]')!;
        const top =
          item.firstElementChild!.getBoundingClientRect().bottom -
          item.getBoundingClientRect().top;
        const bottom =
          item.lastElementChild!.getBoundingClientRect().top -
          item.getBoundingClientRect().top;
        const [apiUrl] = /http.+?(?=')/u.exec(button.getAttribute('onclick')!)!;
        addQuickFavorite({
          root: item,
          top,
          height: bottom - top,
          button,
          apiUrl,
        });
      }
      break;
    }

    case 'e': {
      css(style);
      for (const item of querySelectorAll('.gl1e')) {
        const button =
          item.nextElementSibling!.querySelector<HTMLElement>('[id^=posted_]')!;
        // oxlint-disable-next-line unicorn/prefer-number-coercion
        const height = Number.parseInt(getComputedStyle(item).height, 10);
        const [apiUrl] = /http.+?(?=')/u.exec(button.getAttribute('onclick')!)!;
        addQuickFavorite({ root: item, button, height, apiUrl });
      }
      break;
    }
  }
};
