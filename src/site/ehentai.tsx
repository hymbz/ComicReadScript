import MdSettings from '@material-design-icons/svg/round/settings.svg';

import {
  t,
  insertNode,
  linstenKeyup,
  querySelector,
  scrollIntoView,
  request,
  useInit,
  toast,
  plimit,
  querySelectorAll,
  wait,
  log,
} from 'main';

declare const selected_tagname: string;

(async () => {
  const { options, setFab, setManga, init, dynamicUpdate } = await useInit(
    'ehentai',
    {
      /** 关联 nhentai */
      associate_nhentai: true,
      /** 快捷键翻页 */
      hotkeys_page_turn: true,
      autoShow: false,
    },
  );

  if (Reflect.has(unsafeWindow, 'mpvkey')) {
    const imgEleList = querySelectorAll('.mi0[id]');
    init(
      dynamicUpdate(
        (setImg) =>
          plimit(
            imgEleList.map((ele, i) => async () => {
              const getUrl = () => ele.querySelector('img')?.src;
              if (!getUrl()) unsafeWindow.load_image(i + 1);
              unsafeWindow.next_possible_request = 0;
              const imgUrl = await wait(getUrl);
              setImg(i, imgUrl);
            }),
            undefined,
            4,
          ),
        imgEleList.length,
      ),
    );
    return;
  }

  // 不是漫画页的话
  if (!Reflect.has(unsafeWindow, 'apikey')) {
    await GM.registerMenuCommand(t('site.show_settings_menu'), () =>
      setFab({
        show: true,
        focus: true,
        tip: t('site.settings_tip'),
        children: <MdSettings />,
        onBackdropClick: () => setFab({ show: false, focus: false }),
      }),
    );

    if (options.hotkeys_page_turn) {
      linstenKeyup((e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'd':
            querySelector('#dnext')?.click();
            break;

          case 'ArrowLeft':
          case 'a':
            querySelector('#dprev')?.click();
            break;
        }
      });
    }
    return;
  }

  setManga({
    onExit: (isEnd) => {
      if (isEnd) scrollIntoView('#cdiv');
      setManga({ show: false });
    },
  });

  // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
  insertNode(
    document.getElementById('gd5')!,
    '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>',
  );
  const comicReadModeDom = document.getElementById('comicReadMode')!;

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request(url, {
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    });

    try {
      return res.responseText.split('id="img" src="')[1].split('"')[0];
    } catch (error) {
      throw new Error(t('site.ehentai.fetch_img_url_failed'));
    }
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe =
    /(?<=<a href=").{20,50}(?="><img alt="\d+")/gm;

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (pageNum = 0): Promise<string[]> => {
    const res = await request(
      `${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
      { errorText: t('site.ehentai.fetch_img_page_url_failed') },
    );

    // 从详情页获取图片页的地址
    const imgPageList = res.responseText.match(
      getImgFromDetailsPageRe,
    ) as string[];
    if (imgPageList === null) {
      if (
        res.responseText.includes(
          'Your IP address has been temporarily banned for excessive',
        )
      )
        throw new Error(t('site.ehentai.ip_banned'));
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    }

    return imgPageList;
  };

  const getImgNum = async () => {
    let numText = querySelector('.gtb .gpc')
      ?.textContent?.match(/\d+/g)
      ?.at(-1);
    if (numText) return +numText;

    const res = await request(window.location.href);
    numText = res.responseText.match(
      /(?<=<td class="gdt2">)\d+(?= pages<\/td>)/,
    )?.[0];
    if (numText) return +numText;

    toast.error(t('site.ehentai.html_changed_load_failed'));
    return 0;
  };
  const totalImgNum = await getImgNum();

  const ehImgList: string[] = [];

  const { loadImgList } = init(
    dynamicUpdate(async (setImg) => {
      comicReadModeDom.innerHTML = ` loading`;

      const totalPageNum = +querySelector('.ptt td:nth-last-child(2)')!
        .textContent!;
      for (let pageNum = 0; pageNum < totalPageNum; pageNum++) {
        const startIndex = ehImgList.length;
        const imgPageUrlList = await getImgFromDetailsPage(pageNum);
        await plimit(
          imgPageUrlList.map((imgPageUrl, i) => async () => {
            const imgUrl = await getImgFromImgPage(imgPageUrl);
            const index = startIndex + i;
            ehImgList[index] = imgUrl;
            setImg(index, imgUrl);
          }),
          (_doneNum) => {
            const doneNum = startIndex + _doneNum;
            setFab({
              progress: doneNum / totalImgNum,
              tip: `${t('other.loading_img')} - ${doneNum}/${totalImgNum}`,
            });
            comicReadModeDom.innerHTML =
              doneNum !== totalImgNum
                ? ` loading - ${doneNum}/${totalImgNum}`
                : ` Read`;
          },
        );
      }
    }, totalImgNum),
  );

  setFab({ initialShow: options.autoShow });
  comicReadModeDom.addEventListener('click', () =>
    loadImgList(ehImgList.length ? ehImgList : undefined, true),
  );

  if (options.hotkeys_page_turn) {
    linstenKeyup((e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'd':
          querySelector('.ptt td:last-child:not(.ptdd)')?.click();
          break;

        case 'ArrowLeft':
        case 'a':
          querySelector('.ptt td:first-child:not(.ptdd)')?.click();
          break;
      }
    });
  }

  if (options.associate_nhentai) {
    const titleDom = document.getElementById('gn');
    const taglistDom = querySelector('#taglist tbody');
    if (!titleDom || !taglistDom) {
      toast.error(t('site.ehentai.html_changed_nhentai_failed'));
      return;
    }
    const title = encodeURI(titleDom.innerText);

    const newTagLine = document.createElement('tr');

    let res: Tampermonkey.Response<any>;
    try {
      res = await request(
        `https://nhentai.net/api/galleries/search?query=${title}`,
        { errorText: t('site.ehentai.nhentai_error'), noTip: true },
      );
    } catch (_) {
      newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        ${t('site.ehentai.nhentai_failed', {
          nhentai: `<a href='https://nhentai.net/search/?q=${title}' target="_blank" ><u>nhentai</u></a>`,
        })}
      </td>`;
      taglistDom.appendChild(newTagLine);
      return;
    }
    const nHentaiComicInfo = JSON.parse(res.responseText) as {
      result: Array<{
        id: number;
        media_id: string;
        num_pages: number;
        images: { pages: Array<{ t: string }> };
        title: { japanese: string; english: string };
      }>;
    };

    // 构建新标签行
    if (nHentaiComicInfo.result.length) {
      let temp = '<td class="tc">nhentai:</td><td>';
      let i = nHentaiComicInfo.result.length;
      while (i) {
        i -= 1;
        const tempComicInfo = nHentaiComicInfo.result[i];
        const _title = tempComicInfo.title.japanese
          ? tempComicInfo.title.japanese
          : tempComicInfo.title.english;
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

    taglistDom.appendChild(newTagLine);

    // 重写 _refresh_tagmenu_act 函数，加入脚本的功能
    const nhentaiImgList: Record<string, string[]> = {};
    const raw_refresh_tagmenu_act = unsafeWindow._refresh_tagmenu_act;
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
          nHentaiComicInfo.result[+a.getAttribute('nhentai-index')!];
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
  }
})().catch((e) => log.error(e));
