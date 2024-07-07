import { t, querySelector, request, type useInit, toast, plimit } from 'main';
import { type AsyncReturnType } from 'type-fest';

declare const selected_tagname: string;

/** 关联 nhentai */
export const associateNhentai = async (
  init: AsyncReturnType<typeof useInit>['init'],
  dynamicUpdate: AsyncReturnType<typeof useInit>['dynamicUpdate'],
) => {
  const titleDom = document.getElementById('gn');
  const taglistDom = querySelector('#taglist tbody');
  if (!titleDom || !taglistDom) {
    if ((document.getElementById('taglist')?.children.length ?? 1) > 0)
      toast.error(t('site.ehentai.html_changed_nhentai_failed'));
    return;
  }

  const title = encodeURI(titleDom.textContent!);

  const newTagLine = document.createElement('tr');

  let nHentaiComicInfo: {
    result: Array<{
      id: number;
      media_id: string;
      num_pages: number;
      images: { pages: Array<{ t: string }> };
      title: { japanese: string; english: string };
    }>;
  };
  try {
    const res = await request<typeof nHentaiComicInfo>(
      `https://nhentai.net/api/galleries/search?query=${title}`,
      {
        responseType: 'json',
        errorText: t('site.ehentai.nhentai_error'),
        noTip: true,
      },
    );
    nHentaiComicInfo = res.response;
  } catch {
    newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        ${t('site.ehentai.nhentai_failed', {
          nhentai: `<a href='https://nhentai.net/search/?q=${title}' target="_blank" ><u>nhentai</u></a>`,
        })}
      </td>`;
    taglistDom.append(newTagLine);
    return;
  }

  // 构建新标签行
  if (nHentaiComicInfo.result.length > 0) {
    let temp = '<td class="tc">nhentai:</td><td>';
    let i = nHentaiComicInfo.result.length;
    while (i) {
      i -= 1;
      const tempComicInfo = nHentaiComicInfo.result[i];
      const _title =
        tempComicInfo.title.japanese || tempComicInfo.title.english;
      temp += `
          <div id="td_nhentai:${tempComicInfo.id}" class="gtl" style="opacity:1.0" title="${_title}">
            <a
              href="https://nhentai.net/g/${tempComicInfo.id}/"
              onClick="return toggle_tagmenu(1, 'nhentai:${tempComicInfo.id}',this)"
              nhentai-index=${i}
            >
              ${tempComicInfo.id}
            </a>
          </div>`;
    }

    newTagLine.innerHTML = `${temp}</td>`;
  } else
    newTagLine.innerHTML =
      '<td class="tc">nhentai:</td><td class="tc" style="text-align: left;">Null</td>';

  taglistDom.append(newTagLine);

  // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
  const nhentaiImgList: Record<string, string[]> = {};
  const raw_refresh_tagmenu_act = unsafeWindow._refresh_tagmenu_act;
  // eslint-disable-next-line func-names
  unsafeWindow._refresh_tagmenu_act = function _refresh_tagmenu_act(
    a: HTMLAnchorElement,
  ) {
    if (a.hasAttribute('nhentai-index')) {
      const tagmenu_act_dom = document.getElementById('tagmenu_act')!;
      tagmenu_act_dom.innerHTML = [
        '',
        `<a href="${a.href}" target="_blank"> Jump to nhentai</a>`,
        `<a href="#"> ${
          nhentaiImgList[selected_tagname] ? 'Read' : 'Load comic'
        }</a>`,
      ].join('<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">">');

      const nhentaiComicReadButton =
        tagmenu_act_dom.querySelector('a[href="#"]')!;

      const { media_id, num_pages, images } =
        nHentaiComicInfo.result[Number(a.getAttribute('nhentai-index')!)];
      // nhentai api 对应的扩展名
      const fileType = { j: 'jpg', p: 'png', g: 'gif' };

      const showNhentaiComic = init(
        dynamicUpdate(async (setImg) => {
          nhentaiComicReadButton.innerHTML = ` loading - 0/${num_pages}`;
          nhentaiImgList[selected_tagname] = await plimit(
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
              const blobUrl = URL.createObjectURL(imgRes.response);
              setImg(i, blobUrl);
              return blobUrl;
            }),
            (doneNum, totalNum) => {
              nhentaiComicReadButton.innerHTML = ` loading - ${doneNum}/${totalNum}`;
            },
          );
          nhentaiComicReadButton.innerHTML = ' Read';
        }, num_pages),
      ).showComic;

      // 加载 nhentai 漫画
      nhentaiComicReadButton.addEventListener('click', showNhentaiComic);
    }
    // 非 nhentai 标签列的用原函数去处理
    else raw_refresh_tagmenu_act(a) as unknown;
  };
};
