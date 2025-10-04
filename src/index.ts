import type { InitOptions } from 'main';

import { downloadImgHeaders, type MangaProps } from 'components/Manga';
import {
  fileType,
  isUrl,
  log,
  plimit,
  querySelector,
  querySelectorAll,
  querySelectorClick,
  range,
  requestIdleCallback,
  scrollIntoView,
  sleep,
  t,
  useStyle,
  wait,
  waitDom,
} from 'helper';
import { getInitLang } from 'helper/languages';
import { request, toast, universal } from 'main';
import { getImglistByHtml } from 'userscript/copyApi';
import { otherSite } from 'userscript/otherSite';

/** 站点配置 */
let options: InitOptions | undefined;

try {
  // 匹配站点
  switch (location.hostname) {
    // #百合会（记录阅读历史、自动签到等）
    // test: https://bbs.yamibo.com/thread-559899-1-1.html
    case 'bbs.yamibo.com': {
      inject('site/yamibo');
      break;
    }

    // #百合会新站
    // test: https://www.yamibo.com/manga/view-chapter?id=251
    case 'www.yamibo.com': {
      if (!location.pathname.includes('/manga/view-chapter')) break;

      const id = new URLSearchParams(location.search).get('id');
      if (!id) break;

      /** 总页数 */
      const totalPageNum = Number(
        querySelector(
          'section div:first-of-type div:last-of-type',
        )!.innerHTML.split('：')[1],
      );
      if (Number.isNaN(totalPageNum))
        throw new Error(t('site.changed_load_failed'));

      /** 获取指定页数的图片 url */
      const loadImg = async (i: number) => {
        const res = await request(
          `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
        );
        return /(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/
          .exec(res.responseText)![0]
          .replaceAll('&amp;', '&')
          .replaceAll('http://', 'https://');
      };

      options = {
        name: 'newYamibo',
        getImgList: ({ dynamicLazyLoad }) =>
          dynamicLazyLoad({ loadImg, length: totalPageNum }),
        onNext: querySelectorClick('#btnNext'),
        onPrev: querySelectorClick('#btnPrev'),
        onExit: (isEnd) => isEnd && scrollIntoView('#w1'),
      };
      break;
    }

    // #动漫之家（解锁隐藏漫画）
    // TODO: 动漫之家是似了吗？怎么所有网页都没法正常使用
    // test: todo
    case 'comic.idmzj.com':
    case 'comic.dmzj.com':
    case 'manhua.idmzj.com':
    case 'manhua.dmzj.com': {
      inject('site/dmzj');
      break;
    }

    case 'm.idmzj.com':
    case 'm.dmzj.com': {
      inject('site/dmzj_phone');
      break;
    }

    case 'www.idmzj.com':
    case 'www.dmzj.com': {
      inject('site/dmzj_www');
      break;
    }

    // #E-Hentai（关联外站、快捷收藏、标签染色、识别广告页等）
    // test: https://e-hentai.org/g/2945358/699f8eb501
    case 'exhentai.org':
    case 'e-hentai.org': {
      inject('site/ehentai');
      break;
    }

    // #nhentai（彻底屏蔽漫画、无限滚动）
    // test: https://nhentai.net/g/582446/
    case 'nhentai.net': {
      inject('site/nhentai');
      break;
    }

    // #Yurifans（自动签到）
    // test: https://yuri.website/95131/
    case 'yuri.website': {
      inject('site/yurifans');
      break;
    }

    // #拷贝漫画(copymanga)（显示最后阅读记录、解锁隐藏漫画）
    // test: https://www.mangacopy.com/comic/lianggrendeetaobixianshi/chapter/33cde95c-c8ea-11ea-a67e-00163e0ca5bd
    case '2025copy.com':
    case 'www.2025copy.com':
    case 'copy20.com':
    case 'www.copy20.com':
    case 'mangacopy.com':
    case 'www.mangacopy.com': {
      inject('site/copymanga');
      break;
    }

    // #[Pixiv](https://www.pixiv.net)
    // test: https://www.pixiv.net/artworks/128841242
    case 'www.pixiv.net': {
      let imgList: string[] = [];

      options = {
        name: 'pixiv',
        getImgList: () => imgList,
        SPA: {
          async isMangaPage() {
            const id = Number(location.pathname.split('/')[2]);
            if (!id || !location.pathname.startsWith('/artworks/')) {
              imgList.length = 0;
              return false;
            }

            type resData = { body: { urls: { original: string } }[] };
            const res = await request<resData>(`/ajax/illust/${id}/pages`, {
              responseType: 'json',
            });
            imgList = res.response.body.map((e) => e.urls.original);
            return imgList.length > 1;
          },
        },
        initOptions: { autoShow: false, defaultOption: { pageNum: 1 } },
      };
      break;
    }

    // #[再漫画](https://manhua.zaimanhua.com/)
    // test: https://manhua.zaimanhua.com/view/heimaohemonvdeketang/64175/133789
    case 'www.zaimanhua.com':
    case 'manhua.zaimanhua.com': {
      const getImgList = () =>
        unsafeWindow.__NUXT__.data.getChapters?.data?.chapterInfo
          ?.page_url as string[];
      options = {
        name: 'zaiManHua',
        wait: () => Boolean(querySelector('.scrollbar-demo-item')),
        getImgList,
        SPA: {
          isMangaPage: () => location.pathname.startsWith('/view/'),
          getOnNext: () => querySelectorClick('#next_chapter'),
          getOnPrev: () => querySelectorClick('#prev_chapter'),
        },
      };
      break;
    }
    // TODO: 移动端网页的测试
    case 'm.zaimanhua.com': {
      const getPageData = async (comicId: number, chapterId: number) => {
        const res = await request(
          `https://v4api.zaimanhua.com/app/v1/comic/chapter/${comicId}/${chapterId}?_v=15`,
          { responseType: 'json' },
        );
        if (res.response.errno)
          toast.error(
            `${t('alert.comic_load_error')}: ${res.response.errmsg}`,
            { throw: true },
          );
        return res.response.data.data as {
          page_url: string[];
          page_url_hd: string[];
        };
      };

      const getComicData = async (comicId: number) => {
        const res = await request(
          `https://v4api.zaimanhua.com/app/v1/comic/detail/${comicId}?_v=15`,
          { responseType: 'json' },
        );
        if (res.response.errno)
          toast.error(
            `${t('alert.comic_load_error')}: ${res.response.errmsg}`,
            { throw: true },
          );
        return res.response.data.data as {
          chapters: {
            data: { chapter_id: number; chapter_order: number }[];
          }[];
        };
      };

      options = {
        name: 'zaiManHua',
        async getImgList({ setState }) {
          const urlParams = new URLSearchParams(location.search);
          const comicId = Number(urlParams.get('comic_id'));
          const chapterId = Number(urlParams.get('chapter_id'));
          if (!comicId || !chapterId)
            throw new Error(t('site.changed_load_failed'));

          // 设置上/下话跳转
          const comicData = await getComicData(comicId);
          const chapter = (
            comicData.chapters.length === 1
              ? comicData.chapters[0]
              : comicData.chapters.find((chapter) =>
                  chapter.data.find((data) => data.chapter_id === chapterId),
                )!
          ).data;
          chapter.sort((a, b) => a.chapter_order - b.chapter_order);
          const chapterIndex = chapter.findIndex(
            (data) => data.chapter_id === chapterId,
          );
          setState('manga', {
            onPrev:
              chapterIndex > 0
                ? () =>
                    location.assign(
                      `/pages/comic/page?comic_id=${comicId}&chapter_id=${chapter[chapterIndex - 1].chapter_id}`,
                    )
                : undefined,
            onNext:
              chapterIndex + 1 < chapter.length
                ? () =>
                    location.assign(
                      `/pages/comic/page?comic_id=${comicId}&chapter_id=${chapter[chapterIndex + 1].chapter_id}`,
                    )
                : undefined,
          });

          const pageData = await getPageData(comicId, chapterId);
          return pageData.page_url_hd;
        },
        SPA: {
          isMangaPage: () => location.pathname === '/pages/comic/page',
        },
      };
      break;
    }

    // #[明日方舟泰拉记事社](https://terra-historicus.hypergryph.com)
    // test: https://terra-historicus.hypergryph.com/comic/6253/episode/3156
    case 'terra-historicus.hypergryph.com': {
      const apiUrl = () =>
        `https://terra-historicus.hypergryph.com/api${location.pathname}`;

      const getImgUrl = (i: number) => async () => {
        const res = await request(`${apiUrl()}/page?pageNum=${i + 1}`);
        return JSON.parse(res.responseText).data.url as string;
      };

      options = {
        name: 'terraHistoricus',
        wait: () => Boolean(querySelector('.HG_COMIC_READER_main')),
        async getImgList() {
          const res = await request<{ data: { pageInfos: unknown[] } }>(
            apiUrl(),
            { responseType: 'json' },
          );
          const pageList = res.response.data.pageInfos;
          if (pageList.length === 0 && location.pathname.includes('episode'))
            throw new Error('获取图片列表时出错');

          return plimit<string>(range(pageList.length, getImgUrl));
        },
        SPA: {
          isMangaPage: () => location.href.includes('episode'),
          getOnPrev: () => querySelectorClick('footer .HG_COMIC_READER_prev a'),
          getOnNext: () =>
            querySelectorClick(
              'footer .HG_COMIC_READER_prev+.HG_COMIC_READER_buttonEp a',
            ),
        },
      };
      break;
    }

    // #[禁漫天堂](https://18comic.vip)
    // test: https://18comic.vip/photo/1198559
    case 'siteUrl#jm':
    case '18comic.org':
    case '18comic.vip': {
      inject('site/jm');
      break;
    }

    // #[漫画柜(manhuagui)](https://www.manhuagui.com)
    // test: https://www.manhuagui.com/comic/36584/508218.html
    case 'tw.manhuagui.com':
    case 'm.manhuagui.com':
    case 'www.mhgui.com':
    case 'www.manhuagui.com': {
      if (!/\/comic\/\d+\/\d+\.html/.test(location.pathname)) break;

      let comicInfo: {
        sl: Record<string, string>;
        files?: string[];
        images?: string[];
        prevId: number;
        nextId: number;
      };
      try {
        const dataScript = querySelectorAll('body > script:not([src])').find(
          (script) => script.innerHTML.startsWith('window['),
        );
        if (!dataScript) throw new Error(t('site.changed_load_failed'));
        comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // oxlint-disable-next-line no-eval
          eval(dataScript.innerHTML.slice(26)).match(/(?<=\()\{.+\}/)[0],
        );
      } catch {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      // 让切换章节的提示可以显示在漫画页上
      useStyle(`#smh-msg-box { z-index: 2147483647 !important }`);

      const handlePrevNext = (cid: number) => {
        if (cid === 0) return undefined;
        const newUrl = location.pathname.replace(
          /(?<=\/)\d+(?=\.html)/,
          `${cid}`,
        );
        return () => location.assign(newUrl);
      };

      options = {
        name: 'manhuagui',
        getImgList() {
          const sl = Object.entries(comicInfo.sl)
            .map((attr) => `${attr[0]}=${attr[1]}`)
            .join('&');

          if (comicInfo.files)
            return comicInfo.files.map(
              (file) => `${unsafeWindow.pVars.manga.filePath}${file}?${sl}`,
            );
          if (comicInfo.images) {
            const { origin } = new URL(
              querySelector<HTMLImageElement>('#manga img')!.src,
            );
            return comicInfo.images.map((url) => `${origin}${url}?${sl}`);
          }

          toast.error(t('site.changed_load_failed'), { throw: true });
          return [];
        },
        onNext: handlePrevNext(comicInfo.nextId),
        onPrev: handlePrevNext(comicInfo.prevId),
      };
      break;
    }

    // #[动漫屋(dm5)](https://www.dm5.com)
    // test: https://www.dm5.cn/m1033552/
    case 'www.manhuaren.com':
    case 'm.1kkk.com':
    case 'www.1kkk.com':
    case 'tel.dm5.com':
    case 'en.dm5.com':
    case 'cnc.dm5.com':
    case 'www.dm5.cn':
    case 'www.dm5.com': {
      if (!Reflect.has(unsafeWindow, 'DM5_CID')) break;

      const imgNum: number =
        unsafeWindow.DM5_IMAGE_COUNT ?? unsafeWindow.imgsLen;
      if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      const getPageImg = async (i: number) => {
        const res = await unsafeWindow.$.ajax({
          type: 'GET',
          url: 'chapterfun.ashx',
          data: {
            cid: unsafeWindow.DM5_CID,
            page: i,
            key:
              unsafeWindow.$('#dm5_key').length > 0
                ? unsafeWindow.$('#dm5_key').val()
                : '',
            language: 1,
            gtk: 6,
            _cid: unsafeWindow.DM5_CID,
            _mid: unsafeWindow.DM5_MID,
            _dt: unsafeWindow.DM5_VIEWSIGN_DT,
            _sign: unsafeWindow.DM5_VIEWSIGN,
          },
        });
        return eval(res) as string[]; // oxlint-disable-line no-eval
      };

      const handlePrevNext = (pcSelector: string, mobileText: string) =>
        querySelectorClick(
          () =>
            querySelector(pcSelector) ??
            querySelectorAll('.view-bottom-bar a').find((e) =>
              e.textContent?.includes(mobileText),
            ),
        );

      options = {
        name: 'dm5',
        getImgList({ dynamicLoad }) {
          // manhuaren 和 1kkk 的移动端上会直接用一个变量存储所有图片的链接
          if (
            Array.isArray(unsafeWindow.newImgs) &&
            unsafeWindow.newImgs.every(isUrl)
          )
            return unsafeWindow.newImgs as string[];

          return dynamicLoad(async (setImg) => {
            const imgList = new Set<string>();
            while (imgList.size < imgNum) {
              // 因为每次会返回指定页数及上一页的图片链接，所以加个1减少请求次数
              for (const url of await getPageImg(imgList.size + 1)) {
                if (imgList.has(url)) continue;
                imgList.add(url);
                setImg(imgList.size - 1, url);
              }
            }
          }, imgNum);
        },
        onPrev: handlePrevNext('.logo_1', '上一章'),
        onNext: handlePrevNext('.logo_2', '下一章'),
        onExit: (isEnd) => isEnd && scrollIntoView('.postlist'),
      };
      break;
    }

    // #[绅士漫画(wnacg)](https://www.wnacg.com)
    // test: https://www.wnacg.com/photos-slide-aid-284931.html
    case 'siteUrl#wnacg':
    case 'www.wnacg.com':
    case 'wnacg.com': {
      // 突出显示下拉阅读的按钮
      const buttonDom = querySelector('#bodywrap a.btn');
      if (buttonDom) {
        buttonDom.style.setProperty('background-color', '#607d8b');
        buttonDom.style.setProperty('background-image', 'none');
      }

      if (!Reflect.has(unsafeWindow, 'imglist')) break;

      options = {
        name: 'wnacg',
        getImgList: () =>
          (unsafeWindow.imglist as { url: string; caption: string }[])
            .filter(
              ({ caption }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！',
            )
            .map(({ url }) => new URL(url, location.origin).href),
      };
      break;
    }

    // #[mangabz](https://mangabz.com)
    // test: https://mangabz.com/m131128/
    case 'www.mangabz.com':
    case 'mangabz.com': {
      if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) break;

      const imgNum: number =
        unsafeWindow.MANGABZ_IMAGE_COUNT ?? unsafeWindow.imgsLen;
      if (!(Number.isSafeInteger(imgNum) && imgNum > 0)) {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      const getPageImg = async (i: number) => {
        const res = await unsafeWindow.$.ajax({
          type: 'GET',
          url: 'chapterimage.ashx',
          data: {
            cid: unsafeWindow.MANGABZ_CID,
            page: i,
            key: '',
            _cid: unsafeWindow.MANGABZ_CID,
            _mid: unsafeWindow.MANGABZ_MID,
            _dt: unsafeWindow.MANGABZ_VIEWSIGN_DT,
            _sign: unsafeWindow.MANGABZ_VIEWSIGN,
          },
        });
        return eval(res) as string[]; // oxlint-disable-line no-eval
      };

      const handlePrevNext = (pcSelector: string, mobileText: string) =>
        querySelectorClick(
          () =>
            querySelector(pcSelector) ??
            querySelectorAll('.bottom-bar-tool a').find((e) =>
              e.textContent?.includes(mobileText),
            ),
        );

      options = {
        name: 'mangabz',
        getImgList: ({ dynamicLoad }) =>
          dynamicLoad(async (setImg) => {
            const imgList = new Set<string>();
            while (imgList.size < imgNum) {
              // 因为每次会返回指定页数及上一页的图片链接，所以加个1减少请求次数
              for (const url of await getPageImg(imgList.size + 1)) {
                if (imgList.has(url)) continue;
                imgList.add(url);
                setImg(imgList.size - 1, url);
              }
            }
          }, imgNum),
        onNext: handlePrevNext(
          'body > .container a[href^="/"]:last-child',
          '下一',
        ),
        onPrev: handlePrevNext(
          'body > .container a[href^="/"]:first-child',
          '上一',
        ),
      };
      break;
    }

    // #[komiic](https://komiic.com)
    // test: https://komiic.com/comic/2299/chapter/66668/images/all
    case 'komiic.com': {
      const query = `
        query imagesByChapterId($chapterId: ID!) {
          imagesByChapterId(chapterId: $chapterId) {
            id
            kid
            height
            width
            __typename
          }
        }`;

      const getImgList = async (): Promise<string[]> => {
        const chapterId = /chapter\/(\d+)/.exec(location.pathname)?.[1];
        if (!chapterId) throw new Error(t('site.changed_load_failed'));

        const res = await request('/api/query', {
          method: 'POST',
          responseType: 'json',
          headers: { 'content-type': 'application/json' },
          data: JSON.stringify({
            operationName: 'imagesByChapterId',
            variables: { chapterId: `${chapterId}` },
            query,
          }),
        });
        return (res.response.data.imagesByChapterId as { kid: string }[]).map(
          ({ kid }) => `https://komiic.com/api/image/${kid}`,
        );
      };

      const handlePrevNext = (text: string) => async () => {
        await waitDom('.v-bottom-navigation__content');
        return querySelectorClick(
          '.v-bottom-navigation__content button:not([disabled])',
          text,
        );
      };

      options = {
        name: 'komiic',
        getImgList,
        SPA: {
          isMangaPage: () =>
            /comic\/\d+\/chapter\/\d+\/images\//.test(location.href),
          getOnPrev: handlePrevNext('上一'),
          getOnNext: handlePrevNext('下一'),
          handleUrl: (location) => location.pathname,
        },
      };
      break;
    }

    // #[MangaDex](https://mangadex.org)
    // test: https://mangadex.org/chapter/4c419c16-ef49-4305-9c46-d3adbe1f60b7
    case 'mangadex.org': {
      options = {
        name: 'mangadex',
        async getImgList() {
          const chapter_id = location.pathname.split('/').at(2);
          const {
            response: {
              baseUrl,
              chapter: { data, hash },
            },
          } = await request<{
            baseUrl: string;
            chapter: { data: string[]; hash: string };
          }>(
            `https://api.mangadex.org/at-home/server/${chapter_id}?forcePort443=false`,
            { responseType: 'json' },
          );
          return data.map((e) => `${baseUrl}/data/${hash}/${e}`);
        },
        SPA: {
          isMangaPage: () => /^\/chapter\/.+/.test(location.pathname),
          getOnPrev: () =>
            querySelectorClick(
              `#chapter-selector > a[href^="/chapter/"]:nth-of-type(1)`,
            ),
          getOnNext: () =>
            querySelectorClick(
              `#chapter-selector > a[href^="/chapter/"]:nth-of-type(2)`,
            ),
          handleUrl: (location) =>
            location.href.replace(/(?<=\/chapter\/.+?)\/.*/, ''),
        },
      };
      break;
    }

    // #[NoyAcg](https://noy1.top)
    // test: https://noy1.top/#/read/13349
    case 'siteUrl#noy':
    case 'noy1.top': {
      options = {
        name: 'NoyAcg',
        async getImgList() {
          const [, , id] = location.hash.split('/');

          // 随便拿一个图片来获取 cdn url
          const img = await wait(() =>
            querySelector<HTMLImageElement>('.lazy-load-image-background img'),
          );
          const [cdn] = img.src.split(id);

          const imgNum = await wait(
            () => querySelectorAll('.lazy-load-image-background').length,
          );
          return range(imgNum, (i) => `${cdn}${id}/${i + 1}.webp`);
        },
        SPA: { isMangaPage: () => location.hash.startsWith('#/read/') },
      };
      break;
    }

    // #[無限動漫](https://www.8comic.com)
    // test: 直接访问漫画页会因为 referer 检测不过而被拦截，跳过
    case '8.twobili.com':
    case 'a.twobili.com':
    case 'articles.onemoreplace.tw':
    case 'www.8comic.com': {
      if (!/^\/(?:online|ReadComic|comic)\//.test(location.pathname)) break;
      downloadImgHeaders.Referer = 'https://www.8comic.com/';

      // by: https://sleazyfork.org/zh-CN/scripts/374903-comicread/discussions/241035
      const getImgList = () =>
        [...(unsafeWindow.xx as string).matchAll(/(?<= s=").+?(?=")/g)].map(
          ([text]) => decodeURIComponent(text),
        );

      options = {
        name: '8comic',
        getImgList,
        onNext: querySelectorClick('#nextvol'),
        onPrev: querySelectorClick('#prevvol'),
      };
      break;
    }

    // #[熱辣漫畫](https://www.relamanhua.org/)
    // test: https://www.relamanhua.org/comic/lianggrendeetaobixianshi/chapter/33cde95c-c8ea-11ea-a67e-00163e0ca5bd
    case 'www.relamanhua.org':
    case 'www.manga2024.com':
    case 'www.2024manga.com': {
      if (!location.pathname.includes('/chapter/')) break;

      if (!document.querySelector('.disData[contentkey]')) {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      options = {
        name: 'relamanhua',
        getImgList: () => getImglistByHtml(),
        onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
        onPrev: querySelectorClick(
          '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
        ),
      };
      break;
    }

    // #[hitomi](https://hitomi.la)
    // test: https://hitomi.la/reader/3427121.html
    case 'hitomi.la': {
      options = {
        name: 'hitomi',
        wait: () =>
          (unsafeWindow.galleryinfo as object | undefined) &&
          Reflect.has(unsafeWindow.galleryinfo, 'files') &&
          unsafeWindow.galleryinfo.type !== 'anime',
        getImgList: () =>
          (unsafeWindow.galleryinfo!.files as object[]).map(
            (img) =>
              unsafeWindow.url_from_url_from_hash(
                unsafeWindow.galleryinfo.id,
                img,
                'webp',
              ) as string,
          ),
      };
      break;
    }

    // #[SchaleNetwork](https://schale.network/)
    // test: 有cf验证，跳过
    case 'shupogaki.moe':
    case 'hoshino.one':
    case 'niyaniya.moe': {
      const downloadImg = (url: string) =>
        new Promise<string>((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.open('GET', url);
          xhr.onload = () => {
            resolve(URL.createObjectURL(xhr.response));
          };
          xhr.send();
        });

      const isMangaPage = () => location.href.includes('/g/');
      const crt = localStorage.getItem('clearance');
      options = {
        name: 'schale',
        async getImgList({ dynamicLazyLoad }) {
          const [, , galleryId, galleryKey] = location.pathname.split('/');

          type DetailRes = {
            created_at: number;
            updated_at: number;
            data: {
              id: number;
              key: string;
              size: number;
            }[];
          };
          const detailRes = await request<DetailRes>(
            `https://api.schale.network/books/detail/${galleryId}/${galleryKey}?crt=${crt}`,
            { fetch: true, responseType: 'json', method: 'POST' },
          );
          const [[w, { id, key }]] = Object.entries(detailRes.response.data)
            .filter(([, data]) => data.id && data.key)
            .toSorted(([, a], [, b]) => b.size - a.size);

          type DataRes = {
            base: string;
            entries: { path: string; dimensions: [number, number] }[];
          };
          const dataRes = await request<DataRes>(
            `https://api.schale.network/books/data/${galleryId}/${galleryKey}/${
              id
            }/${key}/${w}?crt=${crt}`,
            { fetch: true, responseType: 'json' },
          );
          const { base, entries } = dataRes.response;
          const { length } = entries;

          const loadImg = async (i: number) => {
            const { path, dimensions } = entries[i];
            const startTime = performance.now();
            const url = await downloadImg(`${base}${path}?w=${dimensions[0]}`);
            await sleep(500 - (performance.now() - startTime));
            return url;
          };

          return dynamicLazyLoad({ loadImg, length, concurrency: 1 });
        },
        SPA: { isMangaPage },
      };
      break;
    }

    // #[nude-moon](https://nude-moon.org)
    // test: https://nude-moon.org/22729--zone-himitsu-no-tomodachi--tayney-drug.html
    case 'nude-moon.org': {
      inject('site/nude-moon');
      break;
    }

    // #[kemono](https://kemono.su)
    // test: https://kemono.cr/fanbox/user/41106591/post/6813818
    case 'kemono.cr':
    case 'kemono.su':
    case 'kemono.party': {
      inject('site/kemono');
      break;
    }

    // #[nekohouse](https://nekohouse.su)
    // test: https://nekohouse.su/fanbox/user/159912/post/1350453
    case 'nekohouse.su': {
      if (!location.pathname.includes('/post/')) break;
      options = {
        name: 'nekohouse',
        getImgList: () =>
          querySelectorAll<HTMLAnchorElement>('.fileThumb').map(
            (e) => e.getAttribute('href')!,
          ),
        initOptions: { autoShow: false, defaultOption: { pageNum: 1 } },
      };
      break;
    }

    // #[welovemanga](https://welovemanga.one)
    // test: https://nicomanga.com/read-yuri-no-hajimari-wa-dorei-kara-chapter-6.2.html
    case 'nicomanga.com':
    case 'weloma.art':
    case 'welovemanga.one': {
      if (!querySelector('#listImgs, .chapter-content')) break;

      const getImgList = async (): Promise<string[]> => {
        const imgList = querySelectorAll<HTMLImageElement>(
          'img.chapter-img:not(.ls-is-cached)',
        )
          .map((e) =>
            (
              e.dataset.src ||
              e.dataset.srcset ||
              e.dataset.original ||
              e.src
            ).trim(),
          )
          .filter(Boolean);
        if (
          imgList.length > 0 &&
          imgList.every((url) => !/loading.*\.gif/.test(url))
        )
          return imgList;
        await sleep(500);
        return getImgList();
      };

      options = {
        name: 'welovemanga',
        getImgList,
        onNext: querySelectorClick('.rd_top-right.next:not(.disabled)'),
        onPrev: querySelectorClick('.rd_top-left.prev:not(.disabled)'),
      };
      break;
    }

    // #[HentaiZap](https://hentaizap.com)
    // test: https://hentaizap.com/g/1290854/1/
    case 'hentaizap.com': {
      if (!location.pathname.startsWith('/g/')) break;

      options = {
        name: 'hentaizap',
        getImgList() {
          const max = Number(querySelector<HTMLInputElement>('#pages')!.value);
          const img = querySelector<HTMLImageElement>('#fimg')!;
          const imgUrl = img.dataset.src || img.src;
          const baseUrl = imgUrl.split('/').slice(0, -1).join('/');
          return range(
            max,
            (i) =>
              `${baseUrl}/${i + 1}.${fileType[unsafeWindow.g_th[i + 1].slice(0, 1)]}`,
          );
        },
      };
      break;
    }

    // #[IMHentai](https://imhentai.xxx)
    // test: https://imhentai.xxx/gallery/1526168/
    case 'imhentai.xxx': {
      if (!location.pathname.startsWith('/gallery/')) break;

      options = {
        name: 'IMHentai',
        getImgList() {
          const [baseUrl] = querySelector(
            '#append_thumbs a img',
          )!.dataset.src!.match(/.+\//)!;

          const imgList: MangaProps['imgList'] = [];
          for (const [i, th] of Object.entries<string>(unsafeWindow.g_th)) {
            const [t, w, h] = th.split(',');
            imgList[Number(i) - 1] = {
              src: `${baseUrl}${i}.${fileType[t]}`,
              width: Number(w),
              height: Number(h),
            };
          }
          return imgList;
        },
      };
      break;
    }

    // #[最前線](https://sai-zen-sen.jp)
    // test: https://sai-zen-sen.jp/works/comics/karanokyoukai/01/01.html
    case 'sai-zen-sen.jp': {
      options = {
        name: 'sai-zen-sen',
        getImgList: () => [],
      };

      switch (location.pathname.match(/\/[^/]+\/[^/]+\//)?.[0]) {
        case '/special/4pages-comics/':
        case '/works/comics/':
          options.getImgList = () =>
            Object.values(
              unsafeWindow.B.Package.Manifest.items as { href: string }[],
            )
              .map(({ href }) => href)
              .filter(Boolean)
              .map((path) => `${unsafeWindow.B.Path}/${path}`);
          options.onPrev = querySelectorClick(
            'ul.volumes > li:nth-child(2) > a[href]',
          );
          options.onNext = querySelectorClick(
            'ul.volumes > li:nth-child(3) > a[href]',
          );
          break;

        case '/comics/twi4/':
          options.getImgList = () =>
            unsafeWindow.t4.Meta.Items.map(
              ({ ImageFileName }) =>
                `${unsafeWindow.t4.GA.Gate.x_directory}works/${ImageFileName}`,
            );
          break;

        default:
          options = undefined;
      }
      break;
    }

    // 为 pwa 版页面提供 api，以便翻译功能能正常运作
    // case 'localhost':
    case 'comic-read.pages.dev': {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
      unsafeWindow.toast = toast;
      break;
    }

    default: {
      // #[Tachidesk](https://github.com/Suwayomi/Tachidesk-Sorayomi)
      // #[LANraragi](https://github.com/Difegue/LANraragi)
      inject('site/selfhosted');

      if (!options) {
        (async () => {
          if ((await GM.getValue(location.hostname)) !== undefined)
            return requestIdleCallback(otherSite);

          await GM.registerMenuCommand(
            extractI18n('site.simple.simple_read_mode')(await getInitLang()),
            () => otherSite(),
          );
        })();
      }
    }
  }

  if (options) universal(options);
} catch (error) {
  log.error(error as Error);
}
