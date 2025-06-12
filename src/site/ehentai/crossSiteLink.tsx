import { request, type useInit, toast } from 'main';
import { t, querySelector, plimit, hijackFn, querySelectorAll } from 'helper';
import { For, Show, type Component, type JSX } from 'solid-js';
import { render } from 'solid-js/web';
import { createStore } from 'solid-js/store';

type ItemData = {
  id: string;
  title: string;
  href: string;
  showText: string;
  class: string;
};

const nhentai = async (
  setComicLoad: AsyncReturnType<typeof useInit>['setComicLoad'],
  dynamicLoad: AsyncReturnType<typeof useInit>['dynamicLoad'],
  comicTitle: string,
): Promise<ItemData[]> => {
  interface ComicInfo {
    id: number;
    media_id: string;
    num_pages: number;
    images: { pages: Array<{ t: string }> };
    title: { japanese: string; english: string };
  }

  // nhentai api 对应的扩展名
  const fileType = {
    j: 'jpg',
    p: 'png',
    g: 'gif',
    w: 'webp',
    b: 'bmp',
  } as const;

  // 只要带上 cf_clearance cookie 就能通过 Cloudflare 验证，但其是 httpOnly
  // 目前暴力猴还不支持 GM_Cookie，篡改猴也需要去设置里手动设置才能支持 httpOnly
  // 所以暂不处理，就嗯等
  // https://github.com/violentmonkey/violentmonkey/issues/603
  const {
    response: { result },
  } = await request<{ result: ComicInfo[] }>(
    `https://nhentai.net/api/galleries/search?query=${comicTitle}`,
    {
      responseType: 'json',
      errorText: t('site.ehentai.nhentai_error'),
      noTip: true,
      headers: { 'User-Agent': navigator.userAgent },
      fetch: false,
    },
  );

  const downImg = async (i: number, media_id: string, type: string) => {
    const imgRes = await request<Blob>(
      `https://i.nhentai.net/galleries/${media_id}/${i + 1}.${fileType[type]}`,
      {
        headers: { Referer: `https://nhentai.net/g/${media_id}` },
        responseType: 'blob',
        fetch: false,
      },
    );
    return URL.createObjectURL(imgRes.response);
  };

  return result.map(({ id, title, images, num_pages, media_id }) => {
    const itemId = `@nh:${id}`;
    setComicLoad(
      dynamicLoad(
        (setImg) => {
          plimit(
            images.pages.map(
              (page, i) => async () =>
                setImg(i, await downImg(i, media_id, page.t)),
            ),
          );
        },
        num_pages,
        itemId,
      ),
      itemId,
    );

    return {
      id: itemId,
      showText: `${id}`,
      title: title.english || title.japanese,
      href: `https://nhentai.net/g/${id}`,
      class: 'gtl',
    };
  });
};
nhentai.errorTip = (comicTitle: string) =>
  t('site.ehentai.nhentai_failed', {
    nhentai: `<a href='https://nhentai.net/search/?q=${comicTitle}' target="_blank"> <u> nhentai </u> </a>`,
  });

const hitomi = async (
  setComicLoad: AsyncReturnType<typeof useInit>['setComicLoad'],
  dynamicLoad: AsyncReturnType<typeof useInit>['dynamicLoad'],
): Promise<ItemData[]> => {
  const comicId = location.pathname.split('/')[2];

  const domain = 'gold-usergeneratedcontent.net';

  const downImg = async (url: string) => {
    const imgRes = await request<Blob>(url, {
      headers: { Referer: `https://hitomi.la/reader/${comicId}.html` },
      responseType: 'blob',
      fetch: false,
    });
    return URL.createObjectURL(imgRes.response);
  };

  const res = await request(`https://ltn.${domain}/galleries/${comicId}.js`, {
    errorText: t('site.ehentai.hitomi_error'),
    noTip: true,
  });
  const data = JSON.parse(res.responseText.slice(18)) as {
    id: string;
    title: string;
    files: Array<{ name: string; hash: string }>;
  };

  const itemId = `@hitomi:${data.id}`;
  setComicLoad(
    dynamicLoad(
      async (setImg) => {
        const { responseText: ggScript } = await request(
          `https://ltn.${domain}/gg.js?_=${Date.now()}`,
          {
            errorText: t('site.ehentai.hitomi_error'),
            noTip: true,
          },
        );

        // eslint-disable-next-line no-autofix/prefer-const
        let gg = {} as {
          m: (g: number) => number;
          s: (h: string) => number;
          b: string;
        };
        eval(ggScript); // eslint-disable-line no-eval

        const imgList = data.files.map(({ hash }) => {
          const imageId = gg.s(hash);
          const m = /[\da-f]{61}([\da-f]{2})([\da-f])/.exec(hash)!;
          const g = Number.parseInt(m[2] + m[1], 16);
          const subDomainOffset = gg.m(g) + 1;
          return `https://w${subDomainOffset}.${domain}/${gg.b}${imageId}/${hash}.webp`;
        });

        // 顺序下载避免触发反爬限制
        for (const [i, img] of imgList.entries()) setImg(i, await downImg(img));
      },
      data.files.length,
      itemId,
    ),
    itemId,
  );

  return [
    {
      id: itemId,
      showText: data.id,
      title: data.title,
      href: `https://hitomi.la/galleries/${data.id}`,
      class: 'gt',
    },
  ];
};
hitomi.errorTip = () => t('site.ehentai.hitomi_error');

/** 关联外站 */
export const crossSiteLink = async (
  dynamicLoad: AsyncReturnType<typeof useInit>['dynamicLoad'],
  setComicLoad: AsyncReturnType<typeof useInit>['setComicLoad'],
  LoadButton: Component<{ id: string }>,
) => {
  /** 只处理「Doujinshi」「Manga」 */
  if (!querySelector('#gdc > .cs:is(.ct2, .ct3)')) return;

  const titleDom = document.getElementById('gn');
  if (!titleDom || !querySelector('#taglist tbody')) {
    if ((document.getElementById('taglist')?.children.length ?? 1) > 0)
      toast.error(t('site.ehentai.html_changed_link_failed'));
    return;
  }

  const comicTitle = titleDom.textContent!.replaceAll(/\s+-/g, ' ');

  const [comicMap, setComicMap] = createStore<
    Record<string, ItemData[] | string>
  >({});

  const ItemTag: Component<ItemData> = (props) => (
    <div
      id={`td_${props.id}`}
      class={props.class}
      style={{ opacity: '1.0' }}
      title={props.title}
    >
      <a
        id={props.id}
        href={props.href}
        attr:onclick={`return toggle_tagmenu(1, '${props.id}',this)`}
        title={props.title}
        innerText={props.showText}
      />
    </div>
  );

  const renderList = () =>
    render(
      () => (
        <For each={Object.entries(comicMap)}>
          {([site, itemList]) => (
            <tr id={`${site}_tagline`}>
              <td class="tc">{site}:</td>
              <Show
                when={typeof itemList !== 'string'}
                fallback={
                  <td
                    class="tc"
                    style={{ 'text-align': 'left' }}
                    innerHTML={itemList as string} // eslint-disable-line solid/no-innerhtml
                  />
                }
              >
                <td>
                  <For each={itemList as ItemData[]} children={ItemTag} />
                </td>
              </Show>
            </tr>
          )}
        </For>
      ),
      querySelector('#taglist tbody')!,
    );
  renderList();

  // 投票后重新渲染
  hijackFn('tag_update_vote', () => {
    for (const e of querySelectorAll('#nh_tagline')) e.remove();
    renderList();
  });

  const icon = () => <img src="https://ehgt.org/g/mr.gif" class="mr" alt=">" />;
  const TagMenu: Component<{ children: JSX.Element[] }> = (props) => (
    <For each={props.children}>{(item) => [icon(), item]}</For>
  );

  const tagmenu_act_dom = document.getElementById('tagmenu_act')!;
  let dispose: () => void;
  hijackFn<[a: HTMLAnchorElement]>('_refresh_tagmenu_act', (rawFn, [a]) => {
    dispose?.();
    // 非 nhentai 标签列的用原函数去处理
    if (!a.id.startsWith('@')) return rawFn(a);

    if (tagmenu_act_dom.children.length > 0) tagmenu_act_dom.innerHTML = '';
    dispose = render(
      () => (
        <TagMenu>
          <a href={a.href} target="_blank" innerText=" Jump" />
          <LoadButton id={a.id} />
        </TagMenu>
      ),
      tagmenu_act_dom,
    );
  });

  // 获取外站数据
  for (const getSiteComic of [hitomi, nhentai]) {
    setComicMap(getSiteComic.name, 'searching...');
    try {
      const itemList = await getSiteComic(
        setComicLoad,
        dynamicLoad,
        comicTitle,
      );
      if (itemList.length > 0) setComicMap(getSiteComic.name, itemList);
      else setComicMap(getSiteComic.name, 'null');
    } catch (error) {
      const errorTip = getSiteComic.errorTip(comicTitle);
      console.error(errorTip, error);
      setComicMap(getSiteComic.name, errorTip);
    }
  }
};
