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
  testImgUrl,
  singleThreaded,
  store,
  createEffectOn,
  getAdPageByFileName,
  getAdPageByContent,
  ReactiveSet,
} from 'main';

declare const selected_tagname: string;

(async () => {
  const {
    options,
    init,
    setFab,
    setManga,
    dynamicUpdate,
    onLoading,
    mangaProps,
  } = await useInit('ehentai', {
    /** 关联 nhentai */
    associate_nhentai: true,
    /** 快捷键翻页 */
    hotkeys_page_turn: true,
    /** 识别广告 */
    detect_ad: true,
    autoShow: false,
  });

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

  // 虽然有 Fab 了不需要这个按钮，但都点习惯了没有还挺别扭的（
  insertNode(
    document.getElementById('gd5')!,
    '<p class="g2 gsp"><img src="https://ehgt.org/g/mr.gif"><a id="comicReadMode" href="javascript:;"> Load comic</a></p>',
  );
  const comicReadModeDom = document.getElementById('comicReadMode')!;

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request(url, {
      fetch: true,
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    });

    try {
      return /id="img" src="(.+?)"/.exec(res.responseText)![1];
    } catch {
      throw new Error(t('site.ehentai.fetch_img_url_failed'));
    }
  };

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (
    pageNum = 0,
  ): Promise<Array<[string, string]>> => {
    const res = await request(
      `${window.location.pathname}${pageNum ? `?p=${pageNum}` : ''}`,
      { fetch: true, errorText: t('site.ehentai.fetch_img_page_url_failed') },
    );
    // 从详情页获取图片页的地址
    const reRes = res.responseText.matchAll(
      /<a href="(.{20,50})"><img alt=.+?title=".+?: (.+?)"/gm,
    );
    if (reRes === null) {
      if (
        res.responseText.includes(
          'Your IP address has been temporarily banned for excessive',
        )
      )
        throw new Error(t('site.ehentai.ip_banned'));
      throw new Error(t('site.ehentai.fetch_img_page_url_failed'));
    }

    return [...reRes].map(([, url, fileName]) => [url, fileName]);
  };

  const getImgNum = async () => {
    let numText = querySelector('.gtb .gpc')
      ?.textContent?.replaceAll(',', '')
      .match(/\d+/g)
      ?.at(-1);
    if (numText) return Number(numText);

    const res = await request(window.location.href);
    numText = /(?<=<td class="gdt2">)\d+(?= pages<\/td>)/.exec(
      res.responseText,
    )?.[0];
    if (numText) return Number(numText);

    toast.error(t('site.changed_load_failed'));
    return 0;
  };

  const totalImgNum = await getImgNum();
  const placeValueNum = `${totalImgNum}`.length;

  const ehImgList: string[] = [];
  const ehImgPageList: string[] = [];
  const ehImgFileNameList: string[] = [];

  const stylesheet = new CSSStyleSheet();
  document.adoptedStyleSheets.push(stylesheet);
  createEffectOn(
    () => [...(mangaProps.adList ?? [])],
    () => {
      if (!mangaProps.adList?.size) return;
      return stylesheet.replace(
        [...mangaProps.adList]
          .map((i) => {
            const alt = `${i + 1}`.padStart(placeValueNum, '0');
            return `img[alt="${alt}"]:not(:hover) { filter: blur(8px); clip-path: border-box; }`;
          })
          .join('\n'),
      );
    },
  );

  const enableDetectAd =
    options.detect_ad && document.getElementById('ta_other:extraneous_ads');
  if (enableDetectAd) {
    setManga('adList', new ReactiveSet());
    /** 缩略图元素列表 */
    const thumbnailEleList: HTMLImageElement[] = [];

    querySelectorAll<HTMLImageElement>('.gdtl img').forEach((e) => {
      const index = Number(e.alt) - 1;
      if (Number.isNaN(index)) return;
      thumbnailEleList[index] = e;
      // 根据当前显示的图片获取一部分文件名
      [, ehImgFileNameList[index]] = e.title.split(/：|: /);
    });
    // 先根据文件名判断一次
    await getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
    // 不行的话再用缩略图识别
    if (mangaProps.adList!.size === 0)
      await getAdPageByContent(thumbnailEleList, mangaProps.adList);
  }

  const { loadImgList } = init(
    dynamicUpdate(async (setImg) => {
      comicReadModeDom.innerHTML = ` loading`;

      const totalPageNum = Number(
        querySelector('.ptt td:nth-last-child(2)')!.textContent!,
      );
      for (let pageNum = 0; pageNum < totalPageNum; pageNum++) {
        const startIndex = ehImgList.length;
        const imgPageUrlList = await getImgFromDetailsPage(pageNum);
        await plimit(
          imgPageUrlList.map(([imgPageUrl, fileName], i) => async () => {
            const imgUrl = await getImgFromImgPage(imgPageUrl);
            const index = startIndex + i;
            ehImgList[index] = imgUrl;
            ehImgPageList[index] = imgPageUrl;
            ehImgFileNameList[index] = fileName;
            setImg(index, imgUrl);
          }),
          async (_doneNum) => {
            const doneNum = startIndex + _doneNum;
            setFab({
              progress: doneNum / totalImgNum,
              tip: `${t('other.loading_img')} - ${doneNum}/${totalImgNum}`,
            });
            comicReadModeDom.innerHTML = ` loading - ${doneNum}/${totalImgNum}`;

            if (doneNum === totalImgNum) {
              comicReadModeDom.innerHTML = ` Read`;
              if (enableDetectAd) {
                await getAdPageByFileName(ehImgFileNameList, mangaProps.adList);
                await getAdPageByContent(ehImgList, mangaProps.adList);
              }
            }
          },
        );
      }
    }, totalImgNum),
  );

  /** 获取新的图片页地址 */
  const getNewImgPageUrl = async (url: string) => {
    const res = await request(url, {
      errorText: t('site.ehentai.fetch_img_page_source_failed'),
    });

    const nl = /nl\('(.+?)'\)/.exec(res.responseText)?.[1];
    if (!nl) throw new Error(t('site.ehentai.fetch_img_url_failed'));
    const newUrl = new URL(url);
    newUrl.searchParams.set('nl', nl);
    return newUrl.href;
  };

  /** 刷新指定图片 */
  const reloadImg = async (i: number) => {
    const pageUrl = await getNewImgPageUrl(ehImgPageList[i]);
    let imgUrl = '';
    while (!imgUrl || !(await testImgUrl(imgUrl)))
      imgUrl = await getImgFromImgPage(pageUrl);
    ehImgList[i] = imgUrl;
    ehImgPageList[i] = pageUrl;
    setManga('imgList', i, imgUrl);
  };

  /** 判断当前显示的是否是 eh 源 */
  const isShowEh = () => store.imgList[0]?.src === ehImgList[0];

  /** 刷新所有错误图片 */
  const reloadErrorImg = singleThreaded(() =>
    plimit(
      store.imgList.map(({ loadType }, i) => () => {
        if (loadType !== 'error' || !isShowEh()) return;
        return reloadImg(i);
      }),
    ),
  );

  setManga({
    onExit(isEnd) {
      if (isEnd) scrollIntoView('#cdiv');
      setManga('show', false);
    },
    // 在图片加载出错时刷新图片
    async onLoading(imgList, img) {
      onLoading(imgList, img);
      if (!img) return;
      if (img.loadType !== 'error' || (await testImgUrl(img.src))) return;
      return reloadErrorImg();
    },
  });

  setFab('initialShow', options.autoShow);
  comicReadModeDom.addEventListener('click', () =>
    loadImgList(ehImgList.length > 0 ? ehImgList : undefined, true),
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
  }
})().catch((error) => log.error(error));
