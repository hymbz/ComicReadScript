/* eslint-disable camelcase */

import { querySelector } from '../helper';
import { useInit } from '../helper/useInit';

(async () => {
  const { options, showFab, request, createShowComic, toast } = await useInit(
    'nhentai',
    { 匹配nhentai漫画: true },
  );

  // 只在漫画页内运行
  if (!Reflect.has(unsafeWindow, 'gid')) return;

  const totalImgNum = parseInt(
    querySelector('#gdd > table > tbody > tr:nth-child(6) > td.gdt2')!
      .innerHTML,
    10,
  );
  let loadedImgNum = 0;

  /**
   * 从图片页获取图片的地址
   *
   * @param url
   */
  const getImgFromImgPage = async (url: string): Promise<string> => {
    const res = await request('GET', url);

    loadedImgNum += 1;
    showFab({
      progress: loadedImgNum / totalImgNum,
      tip: `加载图片中 - ${loadedImgNum}/${totalImgNum}`,
    });

    return res.responseText.split('id="img" src="')[1].split('"')[0];
  };

  /** 从详情页获取图片页的地址的正则 */
  const getImgFromDetailsPageRe =
    /(?<=<div class="gdtl" style="height:\d+?px"><a href=").+?(?=">)/gm;
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

  const showComic = createShowComic(async () => {
    const totalPageNum = +querySelector('.ptt td:nth-last-child(2)')!.innerText;
    return (
      await Promise.all(
        [...Array(totalPageNum).keys()].map((pageNum) =>
          getImgFromDetailsPage(pageNum),
        ),
      )
    ).flat();
  });

  showFab({ progress: undefined, onClick: showComic });

  if (options.autoLoad) await showComic();

  if (options.匹配nhentai漫画) {
    const titleDom = document.getElementById('gn');
    const taglistDom = querySelector('#taglist tbody');
    if (!titleDom || !taglistDom) {
      toast('页面结构发生改变，匹配 nhentai 漫画功能无法正常生效', {
        type: 'error',
      });
      return;
    }

    const res = await request(
      'GET',
      `https://nhentai.net/api/gallerises/search?query=${encodeURIComponent(
        titleDom.innerText,
      )}`,
      { errorText: 'nhentai 漫画匹配失败。可能是 nhentai 登录状态失效？' },
    );

    const nHentaiComicInfo = JSON.parse(res.responseText);

    // 构建新标签行
    const newTagLine = document.createElement('tr');
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
  }
})();
