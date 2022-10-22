/* eslint-disable camelcase */

import { insertNode, querySelector, querySelectorAll, sleep } from '../helper';
import { useInit } from '../helper/useInit';

/** 用于转换获得图片文件扩展名 */
const fileType = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
};

type Images = {
  thumbnail: { h: number; w: number; t: keyof typeof fileType };
  pages: { number: number; extension: string }[];
};
declare const gallery: { num_pages: number; media_id: string; images: Images };

(async () => {
  const { options, showFab, toast, showManga, setManga } = await useInit(
    'nhentai',
    { 自动翻页: true, 彻底屏蔽漫画: true, 在新页面中打开链接: true },
  );

  // 在漫画详情页
  if (Reflect.has(unsafeWindow, 'gallery')) {
    let imgList: string[] = [];

    const showComic = () => {
      if (imgList.length === 0) {
        try {
          imgList = gallery.images.pages.map(
            ({ number, extension }) =>
              `https://i.nhentai.net/galleries/${gallery.media_id}/${number}.${extension}`,
          );
          if (imgList.length === 0) throw new Error('获取漫画图片失败');
          setManga({ imgList });
        } catch (e) {
          console.error(e);
          toast('获取漫画图片失败', { type: 'error' });
        }
      }

      showManga();
    };

    showFab({ onClick: showComic, initShow: false });

    if (options.autoLoad) showComic();

    // 虽然有 Fab 了不需要这个按钮，但我自己都点习惯了没有还挺别扭的（
    insertNode(
      document.getElementById('download')!.parentNode as HTMLElement,
      '<a href="javascript:;" id="comicReadMode" class="btn btn-secondary"><i class="fa fa-book"></i> Load comic</a>',
    );
    document
      .getElementById('comicReadMode')!
      .addEventListener('click', showComic);

    return;
  }

  // 在漫画浏览页
  if (document.getElementsByClassName('gallery').length) {
    if (options.在新页面中打开链接)
      querySelectorAll('a:not([href^="javascript:"])').forEach((e) =>
        e.setAttribute('target', '_blank'),
      );

    const blacklist: string[] = (unsafeWindow?._n_app ?? unsafeWindow?.n)
      ?.options?.blacklisted_tags;
    if (blacklist === undefined) toast('标签黑名单获取失败', { type: 'error' });
    // blacklist === null 时是未登录

    if (options.彻底屏蔽漫画 && blacklist?.length)
      await GM.addStyle('.blacklisted.gallery { display: none; }');

    if (options.自动翻页) {
      await GM.addStyle(`
        hr { bottom: 0; box-sizing: border-box; margin: -1em auto 2em; }
        hr:last-child { position: relative; animation: load .8s linear alternate infinite; }
        hr:not(:last-child) { display: none; }
        @keyframes load { 0% { width: 100%; } 100% { width: 0; } }
      `);
      const pageNum = Number(querySelector('.page.current')?.innerHTML ?? '');
      if (Number.isNaN(pageNum)) return;

      let loadLock = !pageNum;
      const contentDom = document.getElementById('content')!;
      const apiUrl = (() => {
        if (window.location.pathname === '/')
          return 'https://nhentai.net/api/galleries/all?';
        if (querySelector('a.tag'))
          return `https://nhentai.net/api/galleries/tagged?tag_id=${
            querySelector('a.tag')?.classList[1].split('-')[1]
          }&`;
        if (window.location.pathname.includes('search'))
          return `https://nhentai.net/api/galleries/search?query=${new URLSearchParams(
            window.location.search,
          ).get('q')}&`;
        return '';
      })();

      let errorNum = 0;
      const loadNewComic = async (): Promise<void> => {
        if (
          loadLock ||
          contentDom.lastElementChild!.getBoundingClientRect().top >
            window.innerHeight
        )
          return undefined;

        loadLock = true;
        const res = await GM.xmlHttpRequest({
          method: 'GET',
          url: `${apiUrl}page=${pageNum}${
            window.location.pathname.includes('popular') ? '&sort=popular ' : ''
          }`,
        });

        if (res.status !== 200 || !res.responseText) {
          if (errorNum > 3) throw new Error('漫画加载出错');
          errorNum += 1;
          console.error('漫画加载出错', res);
          toast('漫画加载出错', { type: 'error' });
          await sleep(1000 * 3);
          return loadNewComic();
        }

        const { result, num_pages } = JSON.parse(res.responseText) as {
          num_pages: number;
          result: {
            id: number;
            media_id: string;
            tags: { id: number }[];
            title: { english: string };
            images: Images;
          }[];
        };

        let comicDomHtml = '';
        for (let i = 0; i < result.length; i += 1) {
          const tempComicInfo = result[i];
          // 在 用户未登录 或 黑名单为空 或 未开启屏蔽 或 漫画标签都不在黑名单中 时才添加漫画结果
          if (
            !(
              blacklist?.length &&
              options['彻底屏蔽漫画'] &&
              tempComicInfo.tags.some((e) => blacklist.includes(`${e.id}`))
            )
          )
            comicDomHtml += `<div class="gallery" data-tags="${tempComicInfo.tags
              .map((e) => e.id)
              .join(' ')}"><a ${
              options['在新页面中打开链接'] ? 'target="_blank"' : ''
            } href="/g/${tempComicInfo.id}/" class="cover" style="padding:0 0 ${
              (tempComicInfo.images.thumbnail.h /
                tempComicInfo.images.thumbnail.w) *
              100
            }% 0"><img is="lazyload-image" class="" width="${
              tempComicInfo.images.thumbnail.w
            }" height="${
              tempComicInfo.images.thumbnail.h
            }" src="https://t.nhentai.net/galleries/${
              tempComicInfo.media_id
            }/thumb.${
              fileType[tempComicInfo.images.thumbnail.t]
            }"><div class="caption">${
              tempComicInfo.title.english
            }</div></a></div>`;
        }

        // 构建页数按钮
        if (comicDomHtml) {
          const target = options['在新页面中打开链接']
            ? 'target="_blank" '
            : '';
          const pageNumDom: string[] = [];
          for (let i = pageNum - 5; i <= pageNum + 5; i += 1) {
            if (i > 0 && i <= num_pages)
              pageNumDom.push(
                `<a ${target}href="?page=${i}" class="page${
                  i === pageNum ? ' current' : ''
                }">${i}</a>`,
              );
          }

          insertNode(
            contentDom,
            `<h1>${pageNum}</h1>
             <div class="container index-container">${comicDomHtml}</div>
             <section class="pagination">
              <a ${target}href="?page=1" class="first">
                <i class="fa fa-chevron-left"></i>
                <i class="fa fa-chevron-left"></i>
              </a>
              <a ${target}href="?page=${pageNum - 1}" class="previous">
                <i class="fa fa-chevron-left"></i>
              </a>
              ${pageNumDom.join('')}
                ${
                  pageNum === num_pages
                    ? ''
                    : `<a ${target}shref="?page=${pageNum + 1}" class="next">
                        <i class="fa fa-chevron-right"></i>
                      </a>
                      <a ${target}href="?page=${num_pages}" class="last">
                        <i class="fa fa-chevron-right"></i>
                        <i class="fa fa-chevron-right"></i>
                      </a>`
                }
              </section>`,
          );
        }

        // 添加分隔线
        contentDom.appendChild(document.createElement('hr'));
        if (pageNum < num_pages) loadLock = false;
        else
          (
            contentDom.lastElementChild as HTMLElement
          ).style.animationPlayState = 'paused';

        // 当前页的漫画全部被屏蔽或当前显示的漫画少到连滚动条都出不来时，继续加载
        if (
          !comicDomHtml ||
          contentDom.offsetHeight < document.body.offsetHeight
        )
          return loadNewComic();

        return undefined;
      };

      window.addEventListener('scroll', loadNewComic);
      if (querySelector('section.pagination'))
        contentDom.appendChild(document.createElement('hr'));
      await loadNewComic();
    }
  }
})();
