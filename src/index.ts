import { getInitLang } from 'helper/languages';
import { otherSite } from 'userscript/otherSite';
import {
  canvasToBlob,
  createSequence,
  isUrl,
  log,
  plimit,
  querySelector,
  querySelectorAll,
  querySelectorClick,
  range,
  scrollIntoView,
  sleep,
  t,
  wait,
  waitDom,
  waitImgLoad,
  requestIdleCallback,
} from 'helper';
import {
  request,
  toast,
  universal,
  type InitOptions,
  type LoadImgFn,
} from 'main';

/** 站点配置 */
let options: InitOptions | undefined;

try {
  // 匹配站点
  switch (window.location.hostname) {
    // #百合会（记录阅读历史、自动签到等）
    case 'bbs.yamibo.com': {
      inject('site/yamibo');
      break;
    }

    // #百合会新站
    case 'www.yamibo.com': {
      if (!window.location.pathname.includes('/manga/view-chapter')) break;

      const id = new URLSearchParams(window.location.search).get('id');
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
      const getImg = async (i: number) => {
        const res = await request(
          `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
        );
        return /(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/
          .exec(res.responseText)![0]
          .replaceAll('&amp;', '&')
          .replaceAll('http://', 'https://');
      };

      const loadImgFn: LoadImgFn = (setImg) =>
        plimit(
          createSequence(totalPageNum).map(
            (i) => async () => setImg(i, await getImg(i + 1)),
          ),
        );

      options = {
        name: 'newYamibo',
        getImgList: ({ dynamicLoad }) => dynamicLoad(loadImgFn, totalPageNum)(),
        onNext: querySelectorClick('#btnNext'),
        onPrev: querySelectorClick('#btnPrev'),
        onExit: (isEnd) => isEnd && scrollIntoView('#w1'),
      };
      break;
    }

    // #动漫之家（解锁隐藏漫画）
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

    // #E-Hentai（关联 nhentai、快捷收藏、标签染色、识别广告页等）
    case 'exhentai.org':
    case 'e-hentai.org': {
      inject('site/ehentai');
      break;
    }

    // #nhentai（彻底屏蔽漫画、无限滚动）
    case 'nhentai.net': {
      inject('site/nhentai');
      break;
    }

    // #Yurifans（自动签到）
    case 'yuri.website': {
      inject('site/yurifans');
      break;
    }

    // #拷贝漫画(copymanga)（显示最后阅读记录、解锁隐藏漫画）
    case 'mangacopy.com':
    case 'copymanga.site':
    case 'copymanga.info':
    case 'copymanga.net':
    case 'copymanga.org':
    case 'copymanga.tv':
    case 'copymanga.com':
    case 'www.mangacopy.com':
    case 'www.copymanga.site':
    case 'www.copymanga.info':
    case 'www.copymanga.net':
    case 'www.copymanga.org':
    case 'www.copymanga.tv':
    case 'www.copymanga.com': {
      inject('site/copymanga');
      break;
    }

    // #[PonpomuYuri](https://www.ponpomu.com)
    case 'www.ponpomu.com': {
      options = {
        name: 'terraHistoricus',
        wait: () => Boolean(querySelector('.comic-page-container img')),
        getImgList: () =>
          querySelectorAll('.comic-page-container img').map(
            (e) => e.dataset.srcset!,
          ),
        SPA: {
          isMangaPage: () => window.location.href.includes('/comic/'),
          getOnPrev: () => querySelectorClick('.prev-btn:not(.invisible) a'),
          getOnNext: () => querySelectorClick('.next-btn:not(.invisible) a'),
        },
      };
      break;
    }

    // #[再漫画](https://manhua.zaimanhua.com/)
    case 'manhua.zaimanhua.com': {
      const getImgList = () =>
        unsafeWindow.__NUXT__.data.getChapters?.data?.chapterInfo
          ?.page_url as string[];
      options = {
        name: 'zaiManHua',
        wait: getImgList,
        getImgList,
        onNext: querySelectorClick('#prev_chapter'),
        onPrev: querySelectorClick('#next_chapter'),
      };
      break;
    }

    // #[明日方舟泰拉记事社](https://terra-historicus.hypergryph.com)
    case 'terra-historicus.hypergryph.com': {
      const apiUrl = () =>
        `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;

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
          if (
            pageList.length === 0 &&
            window.location.pathname.includes('episode')
          )
            throw new Error('获取图片列表时出错');

          return plimit<string>(createSequence(pageList.length).map(getImgUrl));
        },
        SPA: {
          isMangaPage: () => window.location.href.includes('episode'),
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
    case 'siteUrl#jm':
    case '18comic.org':
    case '18comic.vip': {
      inject('site/jm');
      break;
    }

    // #[漫画柜(manhuagui)](https://www.manhuagui.com)
    case 'tw.manhuagui.com':
    case 'm.manhuagui.com':
    case 'www.mhgui.com':
    case 'www.manhuagui.com': {
      if (!/\/comic\/\d+\/\d+\.html/.test(window.location.pathname)) break;

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
          // eslint-disable-next-line no-eval
          eval(dataScript.innerHTML.slice(26)).match(/(?<=.*?\(){.+}/)[0],
        );
      } catch {
        toast.error(t('site.changed_load_failed'));
        break;
      }

      // 让切换章节的提示可以显示在漫画页上
      GM_addStyle(`#smh-msg-box { z-index: 2147483647 !important }`);

      const handlePrevNext = (cid: number) => {
        if (cid === 0) return undefined;
        const newUrl = window.location.pathname.replace(
          /(?<=\/)\d+(?=\.html)/,
          `${cid}`,
        );
        return () => window.location.assign(newUrl);
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

    // #[漫画DB(manhuadb)](https://www.manhuadb.com)
    case 'www.manhuadb.com': {
      if (!Reflect.has(unsafeWindow, 'img_data_arr')) break;

      options = {
        name: 'manhuaDB',
        getImgList: () =>
          (unsafeWindow.img_data_arr as Array<{ img: string }>).map(
            (data) =>
              `${unsafeWindow.img_host}/${unsafeWindow.img_pre}/${data.img}`,
          ),
        onPrev: () => unsafeWindow.goNumPage('pre') as void,
        onNext: () => unsafeWindow.goNumPage('next') as void,
      };
      break;
    }

    // #[动漫屋(dm5)](https://www.dm5.com)
    case 'www.manhuaren.com':
    case 'm.1kkk.com':
    case 'www.1kkk.com':
    case 'tel.dm5.com':
    case 'en.dm5.com':
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
        // eslint-disable-next-line no-eval
        return eval(res) as string[];
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
          }, imgNum)();
        },
        onPrev: handlePrevNext('.logo_1', '上一章'),
        onNext: handlePrevNext('.logo_2', '下一章'),
        onExit: (isEnd) => isEnd && scrollIntoView('.postlist'),
      };
      break;
    }

    // #[绅士漫画(wnacg)](https://www.wnacg.com)
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
          (unsafeWindow.imglist as Array<{ url: string; caption: string }>)
            .filter(
              ({ caption }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！',
            )
            .map(({ url }) => new URL(url, window.location.origin).href),
      };
      break;
    }

    // #[mangabz](https://mangabz.com)
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
        // eslint-disable-next-line no-eval
        return eval(res) as string[];
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
          }, imgNum)(),
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
        const chapterId = /chapter\/(\d+)/.exec(window.location.pathname)?.[1];
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
        return (
          res.response.data.imagesByChapterId as Array<{ kid: string }>
        ).map(({ kid }) => `https://komiic.com/api/image/${kid}`);
      };

      const handlePrevNext = (text: string) => async () => {
        await waitDom('.v-bottom-navigation__content');
        return querySelectorClick(
          '.v-bottom-navigation__content > button:not([disabled])',
          text,
        );
      };

      options = {
        name: 'komiic',
        getImgList,
        SPA: {
          isMangaPage: () =>
            /comic\/\d+\/chapter\/\d+\/images\//.test(window.location.href),
          getOnPrev: handlePrevNext('上一'),
          getOnNext: handlePrevNext('下一'),
        },
      };
      break;
    }

    // #[MangaDex](https://mangadex.org)
    case 'mangadex.org': {
      options = {
        name: 'mangadex',
        async getImgList() {
          const chapter_id = window.location.pathname.split('/').at(2);
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
          return data.map((e) => baseUrl + '/data/' + hash + '/' + e);
        },
        SPA: {
          isMangaPage: () => /^\/chapter\/.+/.test(window.location.pathname),
          getOnPrev: () =>
            querySelectorClick(
              `#chapter-selector > a[href^="/chapter/"]:nth-of-type(1)`,
            ),
          getOnNext: () =>
            querySelectorClick(
              `#chapter-selector > a[href^="/chapter/"]:nth-of-type(2)`,
            ),
          handlePageurl: (location) =>
            location.href.replace(/(?<=\/chapter\/.+?)\/.*/, ''),
        },
      };
      break;
    }

    // #[NoyAcg](https://noy1.top)
    case 'siteUrl#noy':
    case 'noy1.top': {
      options = {
        name: 'NoyAcg',
        async getImgList() {
          const [, , id] = window.location.hash.split('/');

          // 随便拿一个图片来获取 cdn url
          const img = await wait(() =>
            querySelector<HTMLImageElement>('.lazy-load-image-background img'),
          );
          const cdn = img.src.split(id)[0];

          const imgNum = await wait(
            () => querySelectorAll('.lazy-load-image-background').length,
          );
          return range(imgNum, (i) => `${cdn}${id}/${i + 1}.webp`);
        },
        SPA: { isMangaPage: () => window.location.hash.startsWith('#/read/') },
      };
      break;
    }

    // #[無限動漫](https://www.comicabc.com)
    case '8.twobili.com':
    case 'a.twobili.com':
    case 'articles.onemoreplace.tw':
    case 'www.comicabc.com': {
      const pathStartList = ['/online/', '/ReadComic/', '/comic/'];
      if (!pathStartList.some((path) => location.pathname.startsWith(path)))
        break;

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

    // #[新新漫画](https://www.77mh.nl)
    case 'm.77mh.me':
    case 'www.77mh.me':
    case 'm.77mh.xyz':
    case 'www.77mh.xyz':
    case 'm.77mh.nl':
    case 'www.77mh.nl': {
      if (!Reflect.has(unsafeWindow, 'msg')) break;

      options = {
        name: '77mh',
        async getImgList() {
          const baseUrl: string =
            unsafeWindow.img_qianz ?? unsafeWindow.ImgSvrList;

          return (unsafeWindow.msg as string)
            .split('|')
            .map((path) => `${baseUrl}${path}`);
        },
        onNext: querySelectorClick('#pnpage > a', '下一'),
        onPrev: querySelectorClick('#pnpage > a', '上一'),
      };
      break;
    }

    // #[熱辣漫畫](https://www.relamanhua.org/)
    case 'www.relamanhua.org':
    case 'www.manga2024.com':
    case 'www.2024manga.com': {
      if (
        !window.location.pathname.includes('/chapter/') &&
        !document.querySelector('.disData[contentkey]')
      )
        break;
      const getImgList = async () => {
        const [, , word, , id] = window.location.pathname.split('/');
        const res = await request<{
          results: { chapter: { contents: Array<{ url: string }> } };
        }>(
          `https://mapi.fgjfghkk.club/api/v3/comic/${word}/chapter/${id}?platform=1&_update=true`,
          { responseType: 'json' },
        );
        return res.response.results.chapter.contents.map(({ url }) =>
          url.replace('.h800x.', '.h1500x.'),
        );
      };
      options = {
        name: 'relamanhua',
        getImgList,
        onNext: querySelectorClick('.comicContent-next a:not(.prev-null)'),
        onPrev: querySelectorClick(
          '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
        ),
      };
      break;
    }

    // #[hitomi](https://hitomi.la)
    case 'hitomi.la': {
      options = {
        name: 'hitomi',
        wait: () =>
          Reflect.has(unsafeWindow.galleryinfo, 'files') &&
          unsafeWindow.galleryinfo.type !== 'anime',
        getImgList: () =>
          (unsafeWindow.galleryinfo?.files as object[]).map(
            (img) =>
              unsafeWindow.url_from_url_from_hash(
                unsafeWindow.galleryinfo.id,
                img,
                'webp',
                undefined,
                'a',
              ) as string,
          ),
      };
      break;
    }

    // #[SchaleNetwork](https://schale.network/)
    case 'shupogaki.moe':
    case 'hoshino.one':
    case 'niyaniya.moe': {
      const downloadImg = async (url: string) =>
        new Promise<string>((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.open('GET', url);
          xhr.onload = () => {
            resolve(URL.createObjectURL(xhr.response));
          };
          xhr.send();
        });

      const isMangaPage = () => window.location.href.includes('/g/');

      options = {
        name: 'schale',
        async getImgList({ dynamicLoad }) {
          const [, , galleryId, galleryKey] =
            window.location.pathname.split('/');

          type DetailRes = {
            created_at: number;
            updated_at: number;
            data: Array<{
              id: number;
              public_key: string;
              size: number;
            }>;
          };
          const detailRes = await request<DetailRes>(
            `https://api.schale.network/books/detail/${galleryId}/${galleryKey}`,
            { fetch: true, responseType: 'json' },
          );
          const [[w, { id, public_key }]] = Object.entries(
            detailRes.response.data,
          )
            // 以某个时间为分界线，更早之前的漫画返回的格式是：
            // "0": { "id": 104981, "public_key": "512b76025139", "size": 185635578},
            // "780": { "id": 105099, "public_key": "e7404779e2ad", "size": 27643333 },
            // 但实际使用 0 的 id 和 key 就会报错
            // > https://niyaniya.moe/g/24388/6c159e552eb3 [Mira] EARTH GIRLS 果實 後篇 (CHINESE)
            //
            // 分界时间之后的漫画则是：
            // "0": { "size": 29206268 },
            // "780": { "id": 105242, "public_key": "577d6d6558ac", "size": 4237537, "watermarked": true },
            // 没有权限的 0 不再返回 id 和 key
            // > https://niyaniya.moe/g/24410/3f37324296e2 [Pikachi] 同性交際俱樂部 (CHINESE)
            //
            // 考虑到这可能只是更换域名迁移数据导致的临时问题
            // 所以暂且用 `Number(px) &&` 的方式忽略掉 0，等过段时间再视情况而定
            .filter(([px, data]) => Number(px) && data.id && data.public_key)
            .sort(([, a], [, b]) => b.size - a.size);
          const { created_at, updated_at } = detailRes.response;

          type DataRes = {
            base: string;
            entries: Array<{ path: string; dimensions: [number, number] }>;
          };
          const dataRes = await request<DataRes>(
            `https://api.schale.network/books/data/${galleryId}/${galleryKey}/${
              id
            }/${public_key}?v=${updated_at ?? created_at}&w=${w}`,
            { fetch: true, responseType: 'json' },
          );
          const { base, entries } = dataRes.response;
          const totalPageNum = entries.length;

          return dynamicLoad(async (setImg) => {
            for (const [i, { path, dimensions }] of entries.entries()) {
              if (!isMangaPage) break;
              const startTime = performance.now();
              setImg(i, await downloadImg(`${base}${path}?w=${dimensions[0]}`));
              await sleep(500 - (performance.now() - startTime));
            }
          }, totalPageNum)();
        },
        SPA: { isMangaPage },
      };
      break;
    }

    // #[kemono](https://kemono.su)
    case 'kemono.su':
    case 'kemono.party': {
      inject('site/kemono');
      break;
    }

    // #[nekohouse](https://nekohouse.su)
    case 'nekohouse.su': {
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

    // #[コミックグロウル](https://comic-growl.com)
    case 'comic-growl.com': {
      options = {
        name: 'welovemanga',
        async getImgList({ dynamicLoad }) {
          const json = querySelector('#episode-json')?.dataset.value;
          if (!json) throw new Error(t('site.changed_load_failed'));
          const data = JSON.parse(json);
          // 「公開終了しました」的漫画
          if (!data.readableProduct.pageStructure?.pages) return [];
          const pages: Array<{
            src: string;
            type: string;
            width: number;
            height: number;
          }> = data.readableProduct.pageStructure.pages.filter(
            ({ type }) => type === 'main',
          );

          // 有些情况下图片并没有被分割打乱
          // 比如：https://comic-growl.com/episode/14079602755149645069
          // 不过只找到这一个例子，姑且先猜测是通过 choJuGiga 这个字段来判断的
          if (data.readableProduct.pageStructure.choJuGiga !== 'baku')
            return pages.map(({ src }) => src);

          const loadImgList: LoadImgFn = async (setImg) => {
            for (const [i, page] of pages.entries()) {
              // by: https://greasyfork.org/zh-CN/scripts/428282-漫画下载
              // 另外网站使用的 GigaViewer 阅读器在其他很多网站上也都使用的同款
              // 之后或许可以统一适配一下
              // 除上面的脚本外也可以参考：https://github.com/eggplants/getjump
              const blob = await fetch(page.src).then((r) => r.blob());
              const img = await waitImgLoad(URL.createObjectURL(blob));
              const canvas = new OffscreenCanvas(page.width, page.height);
              const ctx = canvas.getContext('2d')!;
              ctx.drawImage(img, 0, 0);

              const raw = ctx.getImageData(0, 0, page.width, page.height);
              const target = ctx.getImageData(0, 0, page.width, page.height);

              const cellWidth = Math.floor(page.width / 32) * 8;
              const cellHeight = Math.floor(page.height / 32) * 8;

              for (let l = 0; l < 4; l++) {
                for (let j = 0; j < 4; j++) {
                  const srcX = l * cellWidth;
                  const srcY = j * cellHeight;
                  const targetX = j * cellWidth;
                  const targetY = l * cellHeight;

                  for (let y = 0; y < cellHeight; y++) {
                    for (let x = 0; x < cellWidth; x++) {
                      const srcIndex =
                        ((srcY + y) * page.width + (srcX + x)) * 4;
                      const targetIndex =
                        ((targetY + y) * page.width + (targetX + x)) * 4;

                      target.data[targetIndex] = raw.data[srcIndex];
                      target.data[targetIndex + 1] = raw.data[srcIndex + 1];
                      target.data[targetIndex + 2] = raw.data[srcIndex + 2];
                      target.data[targetIndex + 3] = raw.data[srcIndex + 3];
                    }
                  }
                }
              }
              ctx.putImageData(target, 0, 0);

              setImg(i, URL.createObjectURL(await canvasToBlob(canvas)));
            }
          };
          return dynamicLoad(loadImgList, pages.length)();
        },
        onNext: querySelectorClick('a.next-link'),
        onPrev: querySelectorClick('a.previous-link'),
        SPA: {
          isMangaPage: () => window.location.pathname.startsWith('/episode/'),
        },
      };
      break;
    }

    // #[welovemanga](https://welovemanga.one)
    case 'nicomanga.com':
    case 'weloma.art':
    case 'welovemanga.one': {
      if (!querySelector('#listImgs, .chapter-content')) break;

      const getImgList = async (): Promise<string[]> => {
        const imgList = querySelectorAll<HTMLImageElement>(
          'img.chapter-img:not(.ls-is-cached)',
        ).map((e) =>
          (
            e.dataset.src ??
            e.dataset.srcset ??
            e.dataset.original ??
            e.src
          ).trim(),
        );
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

    // 为 pwa 版页面提供 api，以便翻译功能能正常运作
    // case 'localhost':
    case 'comic-read.pages.dev': {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
      unsafeWindow.toast = toast;
      break;
    }

    default: {
      (async () => {
        if ((await GM.getValue(window.location.hostname)) !== undefined)
          return requestIdleCallback(otherSite);

        const menuId = await GM.registerMenuCommand(
          extractI18n('site.simple.simple_read_mode')(await getInitLang()),
          async () => !(await otherSite()) && GM.unregisterMenuCommand(menuId),
        );
      })();
    }
  }

  if (options) universal(options);
} catch (error) {
  log.error(error as Error);
}
