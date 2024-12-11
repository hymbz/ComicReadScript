/* eslint-disable i18next/no-literal-string */
import { request, type useInit, toast, type LoadImgFn } from 'main';
import { t, querySelector, plimit, hijackFn } from 'helper';
import { createSignal, For, Show, type Component, type JSX } from 'solid-js';
import { render } from 'solid-js/web';

interface ComicInfo {
  id: number;
  media_id: string;
  num_pages: number;
  images: { pages: Array<{ t: string }> };
  title: { japanese: string; english: string };
}

/** 关联 nhentai */
export const associateNhentai = async (
  dynamicLoad: AsyncReturnType<typeof useInit>['dynamicLoad'],
  setComicLoad: AsyncReturnType<typeof useInit>['setComicLoad'],
  LoadButton: Component<{ id: string }>,
) => {
  /** 只处理「Doujinshi」「Manga」 */
  if (!querySelector('#gdc > .cs:is(.ct2, .ct3)')) return;

  const titleDom = document.getElementById('gn');
  if (!titleDom || !querySelector('#taglist tbody')) {
    if ((document.getElementById('taglist')?.children.length ?? 1) > 0)
      toast.error(t('site.ehentai.html_changed_nhentai_failed'));
    return;
  }

  const [comicList, setComicList] = createSignal<
    undefined | ComicInfo[] | null
  >();

  const comicTitle = titleDom.textContent!.replaceAll(/\s+-/g, ' ');

  const tip = () => {
    if (comicList() === undefined) return 'searching...';
    if (comicList() === null) {
      const url = `https://nhentai.net/search/?q=${comicTitle}`;
      return t('site.ehentai.nhentai_failed', {
        nhentai: `<a href='${url}' target="_blank"> <u> nhentai </u> </a>`,
      });
    }
    if (comicList()!.length === 0) return 'null';
  };

  const nhTagLine = () => (
    <tr>
      <td class="tc">nhentai:</td>
      <Show
        when={comicList()?.length}
        fallback={
          // eslint-disable-next-line solid/no-innerhtml
          <td class="tc" style={{ 'text-align': 'left' }} innerHTML={tip()} />
        }
      >
        <td>
          <For each={comicList()}>
            {({ id, title }) => (
              <div
                id={`td_nh:${id}`}
                class="gtl"
                style={{ opacity: '1.0' }}
                title={title.japanese || title.english}
              >
                <a
                  id={`nh:${id}`}
                  href={`https://nhentai.net/g/${id}/`}
                  attr:onclick={`return toggle_tagmenu(1, 'nh:${id}',this)`}
                  children={id}
                />
              </div>
            )}
          </For>
        </td>
      </Show>
    </tr>
  );

  render(nhTagLine, querySelector('#taglist tbody')!);

  // 投票后重新渲染
  hijackFn('tag_update_vote', () =>
    render(nhTagLine, querySelector('#taglist tbody')!),
  );

  try {
    const res = await request<{ result: ComicInfo[] }>(
      `https://nhentai.net/api/galleries/search?query=${comicTitle}`,
      {
        responseType: 'json',
        errorText: t('site.ehentai.nhentai_error'),
        noTip: true,
      },
    );
    setComicList(res.response.result);
  } catch {
    setComicList(null);
  }

  if (!comicList()?.length) return;

  // nhentai api 对应的扩展名
  const fileType = {
    j: 'jpg',
    p: 'png',
    g: 'gif',
    w: 'webp',
    b: 'bmp',
  } as const;

  for (const { id, images, num_pages, media_id } of comicList()!) {
    const comicId = `nh:${id}`;
    const loadImgList: LoadImgFn = (setImg) => {
      plimit(
        images.pages.map((page, i) => async () => {
          const imgRes = await request<Blob>(
            `https://i.nhentai.net/galleries/${media_id}/${i + 1}.${
              fileType[page.t]
            }`,
            {
              headers: { Referer: `https://nhentai.net/g/${media_id}` },
              responseType: 'blob',
            },
          );
          const url = URL.createObjectURL(imgRes.response);
          setImg(i, url);
        }),
      );
    };
    setComicLoad(dynamicLoad(loadImgList, num_pages, comicId), comicId);
  }

  const tagmenu_act_dom = document.getElementById('tagmenu_act')!;

  const icon = () => <img src="https://ehgt.org/g/mr.gif" class="mr" alt=">" />;
  const TagMenu: Component<{ children: JSX.Element[] }> = (props) => (
    <For each={props.children}>{(item) => [icon(), item]}</For>
  );

  let dispose: () => void;
  hijackFn<[a: HTMLAnchorElement]>('_refresh_tagmenu_act', (rawFn, [a]) => {
    dispose?.();
    // 非 nhentai 标签列的用原函数去处理
    if (!a.id.startsWith('nh:')) return rawFn(a);

    if (tagmenu_act_dom.children.length > 0) tagmenu_act_dom.innerHTML = '';
    dispose = render(
      () => (
        <TagMenu>
          <a href={a.href} target="_blank" innerText=" Jump to nhentai" />
          <LoadButton id={a.id} />
        </TagMenu>
      ),
      tagmenu_act_dom,
    );
  });
};
