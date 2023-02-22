/* eslint-disable camelcase */

import {
  download,
  insertNode,
  linstenKeyup,
  querySelector,
  scrollIntoView,
  useInit,
} from '../helper';

declare const selected_tag: string;
declare const selected_link: HTMLElement;

(async () => {
  const { options, setFab, setManga, request, init, toast } = await useInit(
    'nhentai',
    { 匹配nhentai: true, 快捷键翻页: true },
  );

  // 不是漫画页的话
  if (!Reflect.has(unsafeWindow, 'gid')) {
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

  const totalImgNum = parseInt(
    querySelector('#gdd > table > tbody > tr:nth-child(6) > td.gdt2')!
      .innerHTML,
    10,
  );
  let loadedImgNum = 0;

  /**
   * 从图片页获取图片的地址
   */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request('GET', url);

    loadedImgNum += 1;
    setFab({
      progress: loadedImgNum / totalImgNum,
      tip: `加载图片中 - ${loadedImgNum}/${totalImgNum}`,
    });
    comicReadModeDom.innerHTML = ` loading image - ${loadedImgNum}/${totalImgNum}`;

    return res.responseText.split('id="img" src="')[1].split('"')[0];
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe =
    /(?<=<a href=").{20,50}(?="><img alt="\d+")/gm;
  const getImgFromDetailsPage = async (pageNum = 0): Promise<string[]> => {
    const res = await request(
      'GET',
      `${window.location.origin}${window.location.pathname}${
        pageNum ? `?p=${pageNum}` : ''
      }`,
    );

    // 从详情页获取图片页的地址
    const imgPageList = res.responseText.match(
      getImgFromDetailsPageRe,
    ) as string[];
    if (imgPageList === null) throw new Error('从详情页获取图片页的地址时出错');

    return Promise.all(imgPageList.map(getImgFromImgPage));
  };

  const showComic = init(
    async () => {
      const totalPageNum = +querySelector('.ptt td:nth-last-child(2)')!
        .innerText;
      return (
        await Promise.all(
          [...Array(totalPageNum).keys()].map((pageNum) =>
            getImgFromDetailsPage(pageNum),
          ),
        )
      ).flat();
    },
    (loadNum, totalNum) => {
      comicReadModeDom.innerHTML =
        loadNum !== totalNum
          ? ` image loading - ${loadNum}/${totalNum}`
          : ' Read';
    },
  );
  setFab({ initShow: options.autoShow });
  comicReadModeDom.addEventListener('click', showComic);

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

    let res: Tampermonkey.Response<any> | undefined;
    try {
      res = await GM.xmlHttpRequest({
        method: 'GET',
        url: `https://nhentai.net/api/galleries/search?query=${encodeURI(
          titleDom.innerText,
        )}`,
      });
    } catch (e) {
      console.error('nhentai 漫画出错', e);
    }

    const newTagLine = document.createElement('tr');

    if (!res) {
      newTagLine.innerHTML = `
      <td class="tc">nhentai:</td>
      <td class="tc" style="text-align: left;">
        匹配失败，请确认 nhentai 登录状态
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
        }/" index=${i} onclick="return toggle_tagmenu('nhentai:${
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
    unsafeWindow._refresh_tagmenu_act = function _refresh_tagmenu_act(
      a: any,
      b: any,
    ) {
      const tagmenu_act_dom = document.getElementById('tagmenu_act')!;
      if (a.includes('nhentai:')) {
        tagmenu_act_dom.innerHTML = `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="${b.href}" target="_blank"> Jump to nhentai</a>`;

        tagmenu_act_dom.innerHTML += `<img src="https://ehgt.org/g/mr.gif" class="mr" alt=">"><a href="#"> ${
          nhentaiImgList[selected_tag] ? 'Read' : 'Load comic'
        }</a>`;
        const nhentaiComicReadModeDom =
          tagmenu_act_dom.querySelector('a[href="#"]')!;

        // 加载 nhentai 漫画
        nhentaiComicReadModeDom.addEventListener('click', async (e) => {
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

            const details = {
              headers: {
                Referer: `https://nhentai.net/g/${comicInfo.media_id}`,
              },
            };
            nhentaiImgList[selected_tag] = await Promise.all(
              comicInfo.images.pages.map(async ({ t }, i) => {
                const url = `https://i.nhentai.net/galleries/${
                  comicInfo.media_id
                }/${i + 1}.${fileType[t]}`;
                const blobUrl = URL.createObjectURL(
                  await download(url, details),
                );
                loadNum += 1;
                nhentaiComicReadModeDom.innerHTML = ` loading - ${loadNum}/${comicInfo.num_pages}`;
                return blobUrl;
              }),
            );
            nhentaiComicReadModeDom.innerHTML = ' Read';
          }
          setManga({ imgList: nhentaiImgList[selected_tag], show: true });
        });
      } else {
        const mr =
          '<img src="https://ehgt.org/g/mr.gif" class="mr" alt="&gt;" />';
        let temp = '';
        if (b.className !== 'tup')
          temp += ` ${mr} <a href="#" onclick="tag_vote_up(); return false">${
            b.className === '' ? 'Vote Up' : 'Withdraw Vote'
          }</a>`;
        if (b.className !== 'tdn')
          temp += ` ${mr} <a href="#" onclick="tag_vote_down(); return false">${
            b.className === '' ? 'Vote Down' : 'Withdraw Vote'
          }</a>`;
        // 删掉原有的 Show Tagged Galleries 按钮空出位置
        temp += `${mr} <a href="#" onclick="tag_define(); return false">Show Tag Definition</a>${mr} <a href="#" onclick="toggle_tagmenu(undefined, undefined); return false">Add New Tag</a> ${mr} `;

        const tag = selected_link.id.slice(3).split(':');
        if (tag.length === 1) {
          temp += `<a href="https://nhentai.net/tag/${tag[0].replace(
            /_/g,
            '-',
          )}" target="_blank">Jump to nhentai</a>`;
        } else {
          temp += `<a href="https://nhentai.net/${
            tag[0] === 'female' ? 'tag' : tag[0]
          }/${tag[1].replace(/_/g, '-')}" target="_blank">Jump to nhentai</a>`;
        }
        tagmenu_act_dom.innerHTML = temp;
      }
    };
  }
})();
