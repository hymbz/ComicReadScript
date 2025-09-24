import type { Component, JSX } from 'solid-js';

import { For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { render } from 'solid-js/web';

import { fileType, hijackFn, querySelector, querySelectorAll, t } from 'helper';
import { request, toast } from 'main';

import { type GalleryContext, isInCategories } from './helper';

type ItemData = {
  id: string;
  title: string;
  href: string;
  showText: string;
  class: string;
};

type SiteFn = {
  (context: GalleryContext): Promise<ItemData[]>;
  errorTip: (context: GalleryContext) => string;
};

const nhentai: SiteFn = async ({ setState, galleryTitle }) => {
  type ComicInfo = {
    id: number;
    media_id: string;
    num_pages: number;
    images: { pages: { t: string; w: number; h: number }[] };
    title: { japanese: string; english: string };
  };

  // nhentai api 对应的扩展名

  // 只要带上 cf_clearance cookie 就能通过 Cloudflare 验证，但其是 httpOnly
  // 目前暴力猴还不支持 GM_Cookie，篡改猴也需要去设置里手动设置才能支持 httpOnly
  // 所以暂不处理，就嗯等
  // https://github.com/violentmonkey/violentmonkey/issues/603
  const {
    response: { result },
  } = await request<{ result: ComicInfo[] }>(
    `https://nhentai.net/api/galleries/search?query=${galleryTitle}`,
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
    setState('comicMap', itemId, {
      getImgList: ({ dynamicLazyLoad }) =>
        dynamicLazyLoad({
          loadImg: (i) => downImg(i, media_id, images.pages[i].t),
          length: num_pages,
          id: itemId,
        }),
    });

    return {
      id: itemId,
      showText: `${id}`,
      title: title.english || title.japanese,
      href: `https://nhentai.net/g/${id}`,
      class: 'gtl',
    };
  });
};
nhentai.errorTip = (context) =>
  t('site.ehentai.nhentai_failed', {
    nhentai: `<a href='https://nhentai.net/search/?q=${context.galleryTitle}' target="_blank"> <u> nhentai </u> </a>`,
  });

const hitomi: SiteFn = async ({ setState, galleryId }) => {
  const domain = 'gold-usergeneratedcontent.net';

  const downImg = async (url: string) => {
    const imgRes = await request<Blob>(url, {
      headers: { Referer: `https://hitomi.la/reader/${galleryId}.html` },
      responseType: 'blob',
      fetch: false,
    });
    return URL.createObjectURL(imgRes.response);
  };

  const res = await request(`https://ltn.${domain}/galleries/${galleryId}.js`, {
    errorText: t('site.ehentai.hitomi_error'),
    noTip: true,
    noCheckCode: true,
  });

  switch (res.status) {
    case 404:
      return [];
    case 200:
      break;
    default:
      throw new Error(t('site.ehentai.hitomi_error'));
  }

  const data = JSON.parse(res.responseText.slice(18)) as {
    id: string;
    title: string;
    files: { name: string; hash: string; width: number; height: number }[];
  };

  const itemId = `@hitomi:${data.id}`;
  setState('comicMap', itemId, {
    getImgList: async ({ dynamicLazyLoad }) => {
      const { responseText: ggScript } = await request(
        `https://ltn.${domain}/gg.js?_=${Date.now()}`,
        {
          errorText: t('site.ehentai.hitomi_error'),
          noTip: true,
        },
      );

      // eslint-disable-next-line prefer-const
      let gg = {} as {
        m: (g: number) => number;
        s: (h: string) => number;
        b: string;
      };
      eval(ggScript); // oxlint-disable-line no-eval

      return dynamicLazyLoad({
        loadImg: async (i: number) => {
          const { hash, name } = data.files[i];
          const imageId = gg.s(hash);
          const m = /[\da-f]{61}([\da-f]{2})([\da-f])/.exec(hash)!;
          const g = Number.parseInt(m[2] + m[1], 16);
          const url = `https://w${gg.m(g) + 1}.${domain}/${gg.b}${imageId}/${hash}.webp`;
          const src = await downImg(url);
          return { src, name };
        },
        length: data.files.length,
        id: itemId,
        concurrency: 1, // 避免触发反爬限制
      });
    },
  });

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
export const crossSiteLink = async (context: GalleryContext) => {
  if (!context.galleryTitle)
    return toast.error(t('site.ehentai.html_changed_link_failed'));

  // 根据当前分类判断要匹配哪些站点
  const siteList: SiteFn[] = [];
  if (isInCategories('Doujinshi', 'Manga', 'Artist CG', 'Game CG', 'Image Set'))
    siteList.push(hitomi);
  if (isInCategories('Doujinshi', 'Manga')) siteList.push(nhentai);

  if (siteList.length === 0) return;

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
          <context.LoadButton id={a.id} />
        </TagMenu>
      ),
      tagmenu_act_dom,
    );
  });

  // 获取外站数据
  for (const getSiteComic of siteList) {
    setComicMap(getSiteComic.name, 'searching...');
    try {
      const itemList = await getSiteComic(context);
      if (itemList.length > 0) setComicMap(getSiteComic.name, itemList);
      else setComicMap(getSiteComic.name, 'null');
    } catch (error) {
      const errorTip = getSiteComic.errorTip(context);
      console.error(errorTip, error);
      setComicMap(getSiteComic.name, errorTip);
    }
  }

  const { adList } = context.store.comicMap[''];
  if (!adList) return;
  // 如果外站源只匹配到了一个漫画，就直接为其加上当前识别出的广告列表
  for (const itemList of Object.values(comicMap)) {
    if (typeof itemList === 'string') continue;
    if (itemList.length === 1)
      context.setState('comicMap', itemList[0].id, { adList });
  }
};
