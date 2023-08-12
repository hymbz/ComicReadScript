import MdSettings from '@material-design-icons/svg/round/settings.svg';

import {
  insertNode,
  linstenKeyup,
  querySelector,
  scrollIntoView,
  request,
  useInit,
  toast,
  plimit,
  querySelectorAll,
} from 'main';

declare const selected_tag: string;
declare const selected_link: HTMLElement;

(async () => {
  const { options, setFab, setManga, init, dynamicUpdate } = await useInit(
    'ehentai',
    {
      匹配nhentai: true,
      快捷键翻页: true,
      autoShow: false,
    },
  );

  // 不是漫画页的话
  if (!Reflect.has(unsafeWindow, 'gid')) {
    await GM.registerMenuCommand('显示设置菜单', () =>
      setFab({
        show: true,
        focus: true,
        tip: '设置',
        children: <MdSettings />,
        onBackdropClick: () => setFab({ show: false, focus: false }),
      }),
    );

    if (options.快捷键翻页) {
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

  /** 获取当前显示页数 */
  const getCurrentPageNum = +(querySelector('.ptds')?.innerText ?? '');

  /** 从图片页获取图片地址 */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request(url, { errorText: '获取图片页源码失败' });

    try {
      return res.responseText.split('id="img" src="')[1].split('"')[0];
    } catch (error) {
      throw new Error('从图片页获取图片地址失败');
    }
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe =
    /(?<=<a href=").{20,50}(?="><img alt="\d+")/gm;

  /** 从详情页获取图片页的地址 */
  const getImgFromDetailsPage = async (pageNum = 0): Promise<string[]> => {
    if (getCurrentPageNum - 1 === pageNum)
      return querySelectorAll<HTMLAnchorElement>('.gdtl > a').map(
        (e) => e.href,
      );

    const res = await request(
      `${window.location.origin}${window.location.pathname}${
        pageNum ? `?p=${pageNum}` : ''
      }`,
      { errorText: '从详情页获取图片页地址失败' },
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
        throw new Error('IP地址被禁');
      throw new Error('从详情页获取图片页的地址时出错');
    }

    return imgPageList;
  };

  const totalImgNum = +(
    querySelector('.gtb .gpc')?.innerText.match(/\d+/g)?.at(-1) ?? '0'
  );

  const ehImgList: string[] = [];

  const { loadImgList } = init(
    dynamicUpdate(async (setImg) => {
      comicReadModeDom.innerHTML = ` loading`;

      const totalPageNum = +querySelector('.ptt td:nth-last-child(2)')!
        .innerText;
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
              tip: `加载图片中 - ${doneNum}/${totalImgNum}`,
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
    loadImgList(ehImgList, true),
  );

  if (options.快捷键翻页) {
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

  if (options.匹配nhentai) {
    const titleDom = document.getElementById('gn');
    const taglistDom = querySelector('#taglist tbody');
    if (!titleDom || !taglistDom) {
      toast.error('页面结构发生改变，匹配 nhentai 漫画功能无法正常生效');
      return;
    }

    const newTagLine = document.createElement('tr');

    let res: Tampermonkey.Response<any>;
    try {
      res = await request(
        `https://nhentai.net/api/galleries/search?query=${encodeURI(
          titleDom.innerText,
        )}`,
        { errorText: 'nhentai 匹配出错', noTip: true },
      );
    } catch (_) {
      newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        匹配失败，请在确认登录
        <a href='https://nhentai.net/' target="_blank" >
          <u>nhentai</u>
        </a>
        后刷新
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
        temp += `<div id="td_nhentai:${
          tempComicInfo.id
        }" class="gtl" style="opacity:1.0" title="${
          tempComicInfo.title.japanese
            ? tempComicInfo.title.japanese
            : tempComicInfo.title.english
        }"><a href="https://nhentai.net/g/${
          tempComicInfo.id
        }/" index=${i} onClick="return toggle_tagmenu('nhentai:${
          tempComicInfo.id
        }',this)">${tempComicInfo.id}</a></a></div>`;
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
      a: any,
      b: any,
    ) {
      if (a.includes('nhentai:')) {
        const tagmenu_act_dom = document.getElementById('tagmenu_act')!;

        tagmenu_act_dom.innerHTML = [
          '',
          `<a href="${b.href}" target="_blank"> Jump to nhentai</a>`,
          `<a href="#"> ${
            nhentaiImgList[selected_tag] ? 'Read' : 'Load comic'
          }</a>`,
        ].join('<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">">');

        const nhentaiComicReadModeDom =
          tagmenu_act_dom.querySelector('a[href="#"]')!;

        // 加载 nhentai 漫画
        nhentaiComicReadModeDom.addEventListener('click', async (e: Event) => {
          e.preventDefault();
          const comicInfo =
            nHentaiComicInfo.result[+selected_link.getAttribute('index')!];
          let loadNum = 0;

          if (!nhentaiImgList[selected_tag]) {
            nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
            // 用于转换获得图片文件扩展名的 dict
            const fileType = {
              j: 'jpg',
              p: 'png',
              g: 'gif',
            };

            nhentaiImgList[selected_tag] = await Promise.all(
              comicInfo.images.pages.map(async ({ t }, i) => {
                const imgRes = await request<Blob>(
                  `https://i.nhentai.net/galleries/${comicInfo.media_id}/${
                    i + 1
                  }.${fileType[t]}`,
                  {
                    headers: {
                      Referer: `https://nhentai.net/g/${comicInfo.media_id}`,
                    },
                    responseType: 'blob',
                  },
                );
                const blobUrl = URL.createObjectURL(imgRes.response);
                loadNum += 1;
                nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
                return blobUrl;
              }),
            );
            nhentaiComicReadModeDom.innerHTML = ' Read';
          }
          await loadImgList(nhentaiImgList[selected_tag], true);
        });
      }
      // 非 nhentai 标签列的用原函数去处理
      else raw_refresh_tagmenu_act(a, b) as unknown;
    };
  }
})();
