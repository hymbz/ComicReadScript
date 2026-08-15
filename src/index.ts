import { type MangaProps, listenHotkey } from 'components/Manga';
import { type SetupOptions, request, setup, toast } from 'core';
import {
  css,
  fileType,
  isUrl,
  log,
  querySelector,
  querySelectorAll,
  querySelectorClick,
  range,
  requestIdleCallback,
  scrollIntoView,
  sleep,
  t,
  wait,
} from 'helper';
import { getInitLang } from 'helper/languages';
import { type RequestDetails, downloadImgHeaders } from 'request';
import { getImglistByHtml } from 'userscript/copyApi';
import { otherSite } from 'userscript/otherSite';

import { getNhentaiData, toImgList } from './userscript/nhentaiApi';

try {
  switch (location.hostname) {
    // #百合会（记录阅读历史、自动签到等）
    // test: https://bbs.yamibo.com/thread-559899-1-1.html
    case 'bbs.yamibo.com': {
      selfImport('site/yamibo');
      break;
    }

    // #百合会新站
    // test: https://www.yamibo.com/manga/view-chapter?id=251
    case 'www.yamibo.com': {
      if (location.pathname !== '/manga/view-chapter') break;

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
        return /(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/u
          .exec(res.responseText)![0]
          .replaceAll('&amp;', '&')
          .replaceAll('http://', 'https://');
      };

      setup({
        name: 'newYamibo',
        getImgList: ({ dynamicLazyLoad }) =>
          dynamicLazyLoad({ loadImg, length: totalPageNum }),
        onNext: () => querySelectorClick('#btnNext'),
        onPrev: () => querySelectorClick('#btnPrev'),
        onExit: (isEnd) => isEnd && scrollIntoView('#w1'),
      });
      break;
    }

    // #E-Hentai（关联外站、快捷收藏、标签染色、识别广告页等）
    // test: https://e-hentai.org/g/2945358/699f8eb501
    case 'exhentai.org':
    case 'e-hentai.org': {
      selfImport('site/ehentai');
      break;
    }

    // #nhentai（彻底屏蔽漫画、无限滚动）
    // test: https://nhentai.net/g/582446/
    case 'nhentai.net': {
      selfImport('site/nhentai');
      break;
    }

    // #Yurifans（自动签到）
    // test: https://yuri.website/95131/
    case 'yuri.website': {
      selfImport('site/yurifans');
      break;
    }

    // #拷贝漫画(copymanga)（显示最后阅读记录、解锁隐藏漫画）
    // test: https://www.mangacopy.com/comic/lianggrendeetaobixianshi/chapter/33cde95c-c8ea-11ea-a67e-00163e0ca5bd
    case 'siteUrl#copymanga':
    case 'mangacopy.com':
    case 'www.mangacopy.com': {
      selfImport('site/copymanga');
      break;
    }

    // #漫画站（中文）[再漫画](https://manhua.zaimanhua.com/)
    // test: https://manhua.zaimanhua.com/view/heimaohemonvdeketang/64175/133789
    case 'www.zaimanhua.com':
    case 'manhua.zaimanhua.com': {
      setup({
        name: 'zaiManHua',
        isMangaPage: async () => {
          if (!location.pathname.startsWith('/view/')) return false;
          await wait(() => Boolean(querySelector('.scrollbar-demo-item')));
          return true;
        },
        getImgList: () =>
          unsafeWindow.__NUXT__.data.getChapters?.data?.chapterInfo
            ?.page_url as string[],
        onNext: () => querySelectorClick('#next_chapter'),
        onPrev: () => querySelectorClick('#prev_chapter'),
      });
      break;
    }
    // TODO: 移动端网页的测试
    case 'm.zaimanhua.com': {
      const api = async <T>(apiPath: string): Promise<T> => {
        const res = await request(
          `https://v4api.zaimanhua.com/app/v1/comic${apiPath}?_v=15`,
          { responseType: 'json' },
        );
        if (res.response.errno)
          toast.error(
            `${t('alert.comic_load_error')}: ${res.response.errmsg}`,
            { throw: true },
          );
        return res.response.data.data as T;
      };

      const getPageData = (comicId: number, chapterId: number) =>
        api<{
          page_url: string[];
          page_url_hd: string[];
        }>(`/chapter/${comicId}/${chapterId}`);

      const getComicData = (comicId: number) =>
        api<{
          chapters: { data: { chapter_id: number; chapter_order: number }[] }[];
        }>(`/detail/${comicId}`);

      setup({
        name: 'zaiManHua',
        isMangaPage: () => {
          if (location.pathname !== '/pages/comic/page') return false;

          const urlParams = new URLSearchParams(location.search);
          const comicId = Number(urlParams.get('comic_id'));
          const chapterId = Number(urlParams.get('chapter_id'));
          if (!comicId || !chapterId)
            throw new Error(t('site.changed_load_failed'));
          return { comicId, chapterId };
        },
        async getImgList({ setState }, { comicId, chapterId }) {
          const comicData = await getComicData(comicId);

          // 顺手用数据设置下章节跳转
          const chapter = (
            comicData.chapters.length === 1
              ? comicData.chapters[0]
              : comicData.chapters.find((chapter) =>
                  chapter.data.find((data) => data.chapter_id === chapterId),
                )!
          ).data.toSorted((a, b) => a.chapter_order - b.chapter_order);
          const chapterIndex = chapter.findIndex(
            ({ chapter_id }) => chapter_id === chapterId,
          );
          const createChapterNav = (targetIndex: number) =>
            targetIndex in chapter
              ? () =>
                  location.assign(
                    `/pages/comic/page?comic_id=${comicId}&chapter_id=${chapter[targetIndex].chapter_id}`,
                  )
              : undefined;
          setState('manga', {
            onPrev: createChapterNav(chapterIndex - 1),
            onNext: createChapterNav(chapterIndex + 1),
          });

          const pageData = await getPageData(comicId, chapterId);
          return pageData.page_url_hd;
        },
      });
      break;
    }

    // #漫画站（中文）[漫画柜(manhuagui)](https://www.manhuagui.com)
    // test: https://www.manhuagui.com/comic/36584/508218.html
    case 'tw.manhuagui.com':
    case 'm.manhuagui.com':
    case 'www.mhgui.com':
    case 'www.manhuagui.com': {
      if (!/\/comic\/\d+\/\d+\.html/u.test(location.pathname)) break;

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
          eval(dataScript.innerHTML.slice(26)).match(/(?<=\()\{.+\}/u)[0],
        );
      } catch {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      // 让切换章节的提示可以显示在漫画页上
      css`
        #smh-msg-box {
          z-index: 2147483647 !important;
        }
      `;

      const createChapterNav = (cid: number) => {
        if (cid === 0) return;
        const newUrl = location.pathname.replace(
          /(?<=\/)\d+(?=\.html)/u,
          `${cid}`,
        );
        return () => location.assign(newUrl);
      };

      setup({
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
        onNext: () => createChapterNav(comicInfo.nextId),
        onPrev: () => createChapterNav(comicInfo.prevId),
      });
      break;
    }

    // #漫画站（中文）[动漫屋(dm5)](https://www.dm5.com)
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

      const getChapterNav = (pcSelector: string, mobileText: string) =>
        querySelectorClick(
          () =>
            querySelector(pcSelector) ??
            querySelectorAll('.view-bottom-bar a').find((e) =>
              e.textContent?.includes(mobileText),
            ),
        );

      setup({
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
        onPrev: () => getChapterNav('.logo_1', '上一章'),
        onNext: () => getChapterNav('.logo_2', '下一章'),
        onExit: (isEnd) => isEnd && scrollIntoView('.postlist'),
      });
      break;
    }

    // #漫画站（中文）[mangabz](https://mangabz.com)
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

      const getChapterNav = (pcSelector: string, mobileText: string) =>
        querySelectorClick(
          () =>
            querySelector(pcSelector) ??
            querySelectorAll('.bottom-bar-tool a').find((e) =>
              e.textContent?.includes(mobileText),
            ),
        );

      setup({
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
        onNext: () =>
          getChapterNav('body > .container a[href^="/"]:last-child', '下一'),
        onPrev: () =>
          getChapterNav('body > .container a[href^="/"]:first-child', '上一'),
      });
      break;
    }

    // #漫画站（中文）[komiic](https://komiic.com)
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

      const getChapterNav = (text: string) =>
        querySelectorClick(
          '.v-bottom-navigation__content button:not([disabled])',
          text,
        );

      setup({
        name: 'komiic',
        isMangaPage: () => {
          const match =
            /comic\/(?<comicId>\d+)\/chapter\/(?<chapterId>\d+)\/images\//u.exec(
              location.href,
            )?.groups as { comicId: string; chapterId: string } | null;
          return match ?? false;
        },
        getImgList: async (_, { chapterId }) => {
          const res = await request('/api/query', {
            method: 'POST',
            responseType: 'json',
            headers: { 'content-type': 'application/json' },
            data: JSON.stringify({
              operationName: 'imagesByChapterId',
              variables: { chapterId },
              query,
            }),
          });
          return (res.response.data.imagesByChapterId as { kid: string }[]).map(
            ({ kid }) => `https://komiic.com/api/image/${kid}`,
          );
        },
        onPrev: () => getChapterNav('上一'),
        onNext: () => getChapterNav('下一'),
      });
      break;
    }

    // #漫画站（中文）[無限動漫](https://www.8comic.com)
    // test: 直接访问漫画页会因为 referer 检测不过而被拦截，跳过
    case '8.twobili.com':
    case 'a.twobili.com':
    case 'articles.onemoreplace.tw':
    case 'www.8comic.com': {
      if (!/^\/(?:online|ReadComic|comic)\//u.test(location.pathname)) break;
      downloadImgHeaders.Referer = 'https://www.8comic.com/';

      // by: https://sleazyfork.org/zh-CN/scripts/374903-comicread/discussions/241035
      const getImgList = () =>
        Array.from(
          (unsafeWindow.xx as string).matchAll(/(?<= s=").+?(?=")/gu),
          ([text]) => decodeURIComponent(text),
        );

      setup({
        name: '8comic',
        getImgList,
        onNext: () => querySelectorClick('#nextvol'),
        onPrev: () => querySelectorClick('#prevvol'),
      });
      break;
    }

    // #R18（中文）[绅士漫画(wnacg)](https://www.wnacg.com)
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

      let getImgList: SetupOptions['getImgList'] | undefined;
      if (location.pathname.startsWith('/photos-slide-aid-')) {
        getImgList = async () => {
          const id = /-(?<id>\d+).html/u.exec(location.pathname)?.groups?.id;
          if (!id) throw new Error(t('site.changed_load_failed'));
          const res = await request<string>(`/photos-item-aid-${id}.html`);
          const pageUrl = /"page_url":(?<pageUrl>\[.+\]),/u.exec(
            res.responseText,
          )?.groups.pageUrl;
          if (!pageUrl) throw new Error(t('site.changed_load_failed'));
          return eval(pageUrl) as string[]; // oxlint-disable-line no-eval
        };
      } else if (location.pathname.startsWith('/photos-slist-aid-'))
        getImgList = () =>
          (unsafeWindow.imglist as { url: string; caption: string }[])
            .filter(
              ({ caption }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！',
            )
            .map(({ url }) => url);
      else break;

      setup({ name: 'wnacg', getImgList });
      break;
    }

    // #R18（中文）[禁漫天堂](https://18comic.vip)
    // test: https://18comic.vip/photo/1198559
    case 'siteUrl#jm':
    case '18comic.org':
    case '18comic.vip': {
      selfImport('site/jm');
      break;
    }

    // #R18（中文）[NoyAcg](https://noy1.top)
    // test: https://noy1.top/#/read/13349
    case 'noy1.top': {
      setup({
        name: 'NoyAcg',
        isMangaPage: () =>
          location.hash.startsWith('#/read/') && { id: location.hash },
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
      });
      break;
    }

    // #R18（中文）[熱辣漫畫](https://www.relamanhua.org/)
    // test: https://www.relamanhua.org/comic/lianggrendeetaobixianshi/chapter/33cde95c-c8ea-11ea-a67e-00163e0ca5bd
    case 'www.relamanhua.org':
    case 'www.manga2024.com':
    case 'www.2024manga.com': {
      if (!location.pathname.includes('/chapter/')) break;

      if (!document.querySelector('.disData[contentkey]')) {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      setup({
        name: 'relamanhua',
        getImgList: () => getImglistByHtml(),
        onNext: () =>
          querySelectorClick('.comicContent-next a:not(.prev-null)'),
        onPrev: () =>
          querySelectorClick(
            '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
          ),
      });
      break;
    }

    // #R18（中文）[hanime1](https://hanime1.me)
    // test: https://hanime1.me/comic/134422
    case 'hanime1.me': {
      if (!location.pathname.startsWith('/comic/')) break;

      setup({
        name: 'hanime1',
        getImgList: async () => {
          const downloadDom = await wait(() =>
            querySelector<HTMLAnchorElement>(
              '.comics-metadata-margin-top a:has(span.material-icons)',
            ),
          );
          const id = /\/g\/(?<id>\d+)\//u.exec(downloadDom.href)?.groups?.id;
          if (!id) throw new Error(t('site.changed_load_failed'));
          const data = await getNhentaiData(id);
          return toImgList(data);
        },
      });
      break;
    }

    // #R18[hitomi](https://hitomi.la)
    // test: https://hitomi.la/reader/3427121.html
    case 'hitomi.la': {
      setup({
        name: 'hitomi',
        isMangaPage: () =>
          wait(
            () =>
              (unsafeWindow.galleryinfo as object | undefined) &&
              Reflect.has(unsafeWindow.galleryinfo, 'files') &&
              unsafeWindow.galleryinfo.type !== 'anime',
            1000 * 5,
          ),
        getImgList: () =>
          (unsafeWindow.galleryinfo!.files as object[]).map(
            (img) =>
              unsafeWindow.url_from_url_from_hash(
                unsafeWindow.galleryinfo.id,
                img,
                'webp',
              ) as string,
          ),
      });
      break;
    }

    // #R18[hdoujin](https://hdoujin.org)
    // test: https://hdoujin.org/g/95756/2d1aa56c3325
    case 'hdoujin.org': {
      // https://github.com/dyphire/hentai-assistant/blob/hdoujin/src/providers/hdoujin_api.py
      const clearance = localStorage.getItem('clearance');
      if (!clearance) throw new Error(t('site.changed_load_failed'));

      const api = async <T>(url: string, details?: RequestDetails<T>) => {
        const res = await request<T>(
          `https://api.hdoujin.org/books${url}?crt=${clearance}`,
          { fetch: true, responseType: 'json', ...details },
        );
        return res.response;
      };

      setup({
        name: 'hdoujin',
        isMangaPage: () => {
          const match =
            /\/g\/(?<galleryId>\d+)\/(?<galleryKey>.+?)(?:\/read\/\d+)?$/u.exec(
              location.pathname,
            )?.groups as { galleryId: string; galleryKey: string } | undefined;
          return match ? { type: 'manga', ...match } : false;
        },
        getImgList: async ({ dynamicLazyLoad }, { galleryId, galleryKey }) => {
          type ExtraData = { id: string; key: string; size: string };
          const { data } = await api<{ data: Record<string, ExtraData> }>(
            `/detail/${galleryId}/${galleryKey}`,
            { method: 'POST' },
          );

          // 选择最高分辨率
          const [[size]] = Object.entries(data)
            .filter(([, { id, key }]) => id && key)
            .toSorted(([a], [b]) => {
              if (a === '0') return -1;
              if (b === '0') return 1;
              return Number(b) - Number(a);
            });
          const { id: dataId, key: dataKey } = data[size];

          const { base, entries } = await api<{
            base: string;
            entries: { path: string }[];
          }>(`/data/${galleryId}/${galleryKey}/${dataId}/${dataKey}/${size}`);

          return dynamicLazyLoad({
            length: entries.length,
            loadImg: async (i) => {
              const res = await request<Blob>(`${base}${entries[i].path}`, {
                cookie: document.cookie,
                headers: {
                  Referer: 'https://hdoujin.org/',
                  Origin: 'https://hdoujin.org',
                  'sec-fetch-dest': 'empty',
                  'sec-fetch-mode': 'cors',
                  'sec-fetch-site': 'cross-site',
                },
                responseType: 'blob',
                fetch: false,
              });

              const imgUrl = URL.createObjectURL(res.response);
              return imgUrl;
            },
          });
        },
      });
      break;
    }

    // #R18[SchaleNetwork](https://schale.network/)
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

      const crt = localStorage.getItem('clearance');
      setup({
        name: 'schale',
        isMangaPage: () => {
          const match =
            /\/g\/(?<galleryId>\d+)\/(?<galleryKey>.+?)(?:\/read\/\d+)?$/u.exec(
              location.pathname,
            )?.groups as { galleryId: string; galleryKey: string } | null;
          return match ?? false;
        },
        async getImgList({ dynamicLazyLoad }, { galleryId, galleryKey }) {
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
      });
      break;
    }

    // #R18[nude-moon](https://nude-moon.org)
    // test: https://nude-moon.org/29885--kultkvazar-gubbai-iregyura-goodbye-irregular--pro_ay-ucedcaa.html
    case 'nude-moon.org': {
      if (/^\/\d+-/u.exec(location.pathname) === null) break;

      listenHotkey({
        scroll_right: () => unsafeWindow.nextImg(),
        scroll_left: () => unsafeWindow.backImg(),
      });

      setup({
        name: 'nude-moon',
        initOptions: {
          autoShow: false,
          defaultOption: { pageNum: 1 },
        },
        async getImgList() {
          if (unsafeWindow.images)
            return (unsafeWindow.images as HTMLImageElement[]).map(
              (e) => e.src,
            );

          const url = location.href.replace(
            /(?<slug>\/[^/-]+)(?<dash>-)/u,
            '$<slug>-online-',
          );
          const { response: html } = await request<string>(url);
          const imgList = Array.from(
            html.matchAll(/images\[\d+\]\.src = '(?<src>.+?)';/gu),
            ({ groups: { src } }) => `https://nude-moon.org${src}`,
          );
          if (imgList.length === 0)
            throw new Error(t('site.changed_load_failed'));
          return imgList;
        },
      });
      break;
    }

    // #R18[HentaiZap](https://hentaizap.com)
    // test: https://hentaizap.com/gallery/1290854/
    // #R18[IMHentai](https://imhentai.xxx)
    // test: https://imhentai.xxx/gallery/1526168/
    // #R18[HentaiEra](https://hentaiera.com)
    // test: https://hentaiera.com/gallery/1506236/
    // #R18[HentaiEnvy](https://hentaienvy.com)
    // test: https://hentaienvy.com/gallery/1411647/
    case 'hentaizap.com':
    case 'imhentai.xxx':
    case 'hentaiera.com':
    case 'hentaienvy.com': {
      const imgDom = querySelector<HTMLImageElement>(
        ':is(#thumbs_box, #thumbs_gallery_div, #append_thumbs, #ap_thumbs) img[data-src]',
      );
      if (!imgDom) break;
      const imgUrl = imgDom.dataset.src;
      if (!imgUrl || !unsafeWindow.g_th)
        throw new Error(t('site.changed_load_failed'));
      const baseUrl = imgUrl.replace(/\/\dt.[a-z]+$/u, '');

      setup({
        name: 'HentaiEnvy',
        getImgList() {
          const imgList: MangaProps['imgList'] = [];
          for (const [i, th] of Object.entries<string>(unsafeWindow.g_th)) {
            const [type, w, h] = th.split(',');
            imgList[Number(i) - 1] = {
              src: `${baseUrl}/${i}.${fileType[type]}`,
              width: Number(w),
              height: Number(h),
            };
          }
          return imgList;
        },
      });
      break;
    }

    // #漫画站[MangaDex](https://mangadex.org)
    // test: https://mangadex.org/chapter/4c419c16-ef49-4305-9c46-d3adbe1f60b7
    case 'mangadex.org': {
      setup({
        name: 'mangadex',
        isMangaPage: () =>
          /^\/chapter\/(?<id>[^/]+)/u.exec(location.pathname)?.groups as
            | { id: string }
            | undefined,
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

        onPrev: () =>
          querySelectorClick(
            `#chapter-selector > a[href^="/chapter/"]:nth-of-type(1)`,
          ),
        onNext: () =>
          querySelectorClick(
            `#chapter-selector > a[href^="/chapter/"]:nth-of-type(2)`,
          ),
      });
      break;
    }

    // #漫画站[welovemanga](https://nicomanga.com)
    // test: https://nicomanga.com/read-yuri-no-hajimari-wa-dorei-kara-chapter-6.2.html
    case 'nicomanga.com': {
      const getImgList = () => unsafeWindow.chapterImages as string[];
      setup({
        name: 'welovemanga',
        isMangaPage: () => wait(() => getImgList()?.length > 0),
        getImgList,
        onNext: () => querySelectorClick('.next-chapter'),
        onPrev: () => querySelectorClick('.prev-chapter'),
      });
      break;
    }
    case 'weloma.art':
    case 'love4u.net': {
      if (!querySelector('#chapter-images img')) break;

      const getImgUrl = (e: HTMLImageElement) => {
        const src =
          e.dataset.srcset || e.dataset.original || e.dataset.src || e.src;
        if (src && !src.endsWith('.gif')) return src.trim();
        if (e.dataset.img) return atob(e.dataset.img);
      };

      const getImgList = () =>
        querySelectorAll<HTMLImageElement>('#chapter-images img')
          .map(getImgUrl)
          .filter(Boolean) as string[];

      setup({
        name: 'welovemanga',
        getImgList,
        onNext: () => querySelectorClick('.rd_top-right.next:not(.disabled)'),
        onPrev: () => querySelectorClick('.rd_top-left.prev:not(.disabled)'),
      });
      break;
    }

    // #漫画站[kisslove(klz9)](https://klz9.com)
    // test: https://klz9.com/mayonaka-heart-tune-chapter-109.html
    case 'klz9.com': {
      if (!location.pathname.includes('-chapter-')) break;

      const getNavBtn = (index: 0 | 1) =>
        querySelectorAll<HTMLButtonElement>('main button.flex-1')[index];

      const handlePrevNext = (index: 0 | 1) => {
        const btn = getNavBtn(index);
        return btn && !btn.disabled ? () => btn.click() : undefined;
      };

      setup({
        name: 'klz9',
        isMangaPage: async () => {
          if (!location.pathname.includes('-chapter-')) return false;
          await wait(() => querySelector('main img:not(a img)'));
          return { id: location.pathname };
        },
        getImgList: () =>
          querySelectorAll<HTMLImageElement>('main img:not(a img)').map(
            (img) => img.src,
          ),
        onPrev: () => handlePrevNext(0),
        onNext: () => handlePrevNext(1),
      });
      break;
    }

    // #Fanbox[kemono](https://kemono.su) <sup>合订</sup>
    // test: https://kemono.cr/fanbox/user/41106591/post/6813818
    case 'kemono.cr':
    case 'kemono.su':
    case 'kemono.party': {
      selfImport('site/kemono');
      break;
    }

    // #Fanbox[nekohouse](https://nekohouse.su)
    // test: https://nekohouse.su/fanbox/user/159912/post/1350453
    case 'nekohouse.su': {
      if (!location.pathname.includes('/post/')) break;
      setup({
        name: 'nekohouse',
        getImgList: () =>
          querySelectorAll<HTMLAnchorElement>('.fileThumb').map((e) =>
            e.getAttribute('href')!,
          ),
        initOptions: { autoShow: false, defaultOption: { pageNum: 1 } },
      });
      break;
    }

    // #其他[Pixiv](https://www.pixiv.net) <sup>合订</sup>
    // test: https://www.pixiv.net/artworks/128841242
    case 'www.pixiv.net': {
      selfImport('site/pixiv');
      break;
    }

    // #其他[明日方舟泰拉记事社](https://comic.hypergryph.com)
    // test: https://comic.hypergryph.com/comic/6253/episode/3156
    case 'comic.hypergryph.com': {
      const apiUrl = () => {
        const apiPath = /\/comic\/.+/u.exec(location.pathname)?.[0] ?? '';
        return `https://comic.hypergryph.com/api${apiPath}`;
      };

      const loadImg = async (i: number) => {
        const res = await request(`${apiUrl()}/page?pageNum=${i + 1}`);
        return JSON.parse(res.responseText).data.url as string;
      };

      const handlePrevNext = (text: string) =>
        querySelectorClick('footer button:not([disabled]) a', text);

      setup({
        name: 'terraHistoricus',
        isMangaPage: () =>
          location.href.includes('episode') && { id: location.href },
        async getImgList({ dynamicLazyLoad }) {
          const res = await request<{ data: { pageInfos: unknown[] } }>(
            apiUrl(),
            { responseType: 'json' },
          );
          const pageList = res.response.data.pageInfos;
          if (pageList.length === 0 && location.pathname.includes('episode'))
            throw new Error('获取图片列表时出错');
          return dynamicLazyLoad({ loadImg, length: pageList.length });
        },
        onPrev: () => handlePrevNext('上一'),
        onNext: () => handlePrevNext('下一'),
      });
      break;
    }

    // #其他[最前線](https://sai-zen-sen.jp)
    // test: https://sai-zen-sen.jp/works/comics/karanokyoukai/01/01.html
    case 'sai-zen-sen.jp': {
      switch (/\/[^/]+\/[^/]+\//u.exec(location.pathname)?.[0]) {
        case '/special/4pages-comics/':
        case '/works/comics/':
          setup({
            name: 'sai-zen-sen',
            getImgList: () =>
              Object.values(
                unsafeWindow.B.Package.Manifest.items as { href: string }[],
              )
                .map(({ href }) => href)
                .filter(Boolean)
                .map((path) => `${unsafeWindow.B.Path}/${path}`),
            onPrev: () =>
              querySelectorClick('ul.volumes > li:nth-child(2) > a[href]'),
            onNext: () =>
              querySelectorClick('ul.volumes > li:nth-child(3) > a[href]'),
          });
          break;

        case '/comics/twi4/':
          setup({
            name: 'sai-zen-sen',
            getImgList: () =>
              unsafeWindow.t4.Meta.Items.map(
                ({ ImageFileName }) =>
                  `${unsafeWindow.t4.GA.Gate.x_directory}works/${ImageFileName}`,
              ),
          });
          break;
      }
      break;
    }

    // #其他[芸能ヌード](https://geinou-nude.com)
    // test: https://geinou-nude.com/ロン・モンロウ/
    case 'geinou-nude.com': {
      const imgList: MangaProps['imgList'] = querySelectorAll<HTMLImageElement>(
        'main img.size-medium',
      ).map((e) => {
        const src = e.dataset.src ?? '';
        const res = /-(?<w>\d+)x(?<h>\d+)\.[a-z]+$/iu.exec(src)?.groups;
        if (!res) return src;
        return { src, width: Number(res.w), height: Number(res.h) };
      });
      if (imgList.length === 0) break;

      setup({
        name: 'geinou-nude',
        getImgList: () => imgList,
      });
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
      // #自部署[Tachidesk](https://github.com/Suwayomi/Tachidesk-Sorayomi)
      // #自部署[LANraragi](https://github.com/Difegue/LANraragi)
      selfImport('site/selfhosted');

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
} catch (error) {
  log.error(error);
}
