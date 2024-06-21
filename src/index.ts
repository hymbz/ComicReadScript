import type { InitOptions } from './helper/universalInit';

/**
 * 虽然在打包的时候已经尽可能保持代码格式不变了，但因为脚本代码比较多的缘故
 * 所以真对脚本代码感兴趣的话，推荐还是直接上 github 仓库来看
 * <https://github.com/hymbz/ComicReadScript>
 * 对站点逻辑感兴趣的，结合 `src\index.ts` 看 `src\site` 下的对应文件即可
 */

inject('import');

/** 站点配置 */
let options: InitOptions | undefined;

const main = require('main') as typeof import('./main');

try {
  // 匹配站点
  switch (window.location.hostname) {
    // #百合会——「记录阅读历史、自动签到等」
    case 'bbs.yamibo.com': {
      inject('yamibo');
      break;
    }

    // #百合会新站
    case 'www.yamibo.com': {
      if (!window.location.pathname.includes('/manga/view-chapter')) break;

      const id = new URLSearchParams(window.location.search).get('id');
      if (!id) break;

      /** 总页数 */
      const totalPageNum = Number(
        main
          .querySelector('section div:first-of-type div:last-of-type')!
          .innerHTML.split('：')[1],
      );
      if (Number.isNaN(totalPageNum))
        throw new Error(main.t('site.changed_load_failed'));

      /** 获取指定页数的图片 url */
      const getImg = async (i: number) => {
        const res = await main.request(
          `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
        );
        return /(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/
          .exec(res.responseText)![0]
          .replaceAll('&amp;', '&')
          .replaceAll('http://', 'https://');
      };

      options = {
        name: 'newYamibo',
        getImgList: ({ dynamicUpdate, setFab }) =>
          dynamicUpdate(
            async (setImg) =>
              main.plimit(
                main
                  .createSequence(totalPageNum)
                  .map((i) => async () => setImg(i, await getImg(i + 1))),
                (doneNum, totalNum) => {
                  setFab({
                    progress: doneNum / totalNum,
                    tip: `加载图片中 - ${doneNum}/${totalNum}`,
                  });
                },
              ),
            totalPageNum,
          )(),
        onNext: main.querySelectorClick('#btnNext'),
        onPrev: main.querySelectorClick('#btnPrev'),
        onExit: (isEnd) => isEnd && main.scrollIntoView('#w1'),
      };
      break;
    }

    // #动漫之家——「解锁隐藏漫画」
    case 'comic.idmzj.com':
    case 'comic.dmzj.com':
    case 'manhua.idmzj.com':
    case 'manhua.dmzj.com': {
      inject('dmzj');
      break;
    }

    case 'm.idmzj.com':
    case 'm.dmzj.com': {
      inject('dmzj_phone');
      break;
    }

    case 'www.idmzj.com':
    case 'www.dmzj.com': {
      inject('dmzj_www');
      break;
    }

    // #E-Hentai——「匹配 nhentai 漫画」
    case 'exhentai.org':
    case 'e-hentai.org': {
      inject('ehentai');
      break;
    }

    // #nhentai——「彻底屏蔽漫画、自动翻页」
    case 'nhentai.net': {
      inject('nhentai');
      break;
    }

    // #Yurifans——「自动签到」
    case 'yuri.website': {
      inject('yurifans');
      break;
    }

    // #拷贝漫画(copymanga)——「显示最后阅读记录」
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
      inject('copymanga');
      break;
    }

    // #[PonpomuYuri](https://www.ponpomu.com)
    case 'www.ponpomu.com': {
      options = {
        name: 'terraHistoricus',
        wait: () => Boolean(main.querySelector('.comic-page-container img')),
        getImgList: () =>
          main
            .querySelectorAll('.comic-page-container img')
            .map((e) => e.dataset.srcset!),
        SPA: {
          isMangaPage: () => window.location.href.includes('/comic/'),
          getOnPrev: () =>
            main.querySelectorClick('.prev-btn:not(.invisible) a'),
          getOnNext: () =>
            main.querySelectorClick('.next-btn:not(.invisible) a'),
        },
      };
      break;
    }

    // #[明日方舟泰拉记事社](https://terra-historicus.hypergryph.com)
    case 'terra-historicus.hypergryph.com': {
      const apiUrl = () =>
        `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;

      const getImgUrl = (i: number) => async () => {
        const res = await main.request(`${apiUrl()}/page?pageNum=${i + 1}`);
        return JSON.parse(res.response).data.url as string;
      };

      options = {
        name: 'terraHistoricus',
        wait: () => Boolean(main.querySelector('.HG_COMIC_READER_main')),
        async getImgList({ setFab }) {
          const res = await main.request(apiUrl());
          const pageList = JSON.parse(res.response).data.pageInfos as unknown[];
          if (
            pageList.length === 0 &&
            window.location.pathname.includes('episode')
          )
            throw new Error('获取图片列表时出错');

          return main.plimit<string>(
            main.createSequence(pageList.length).map(getImgUrl),
            (doneNum, totalNum) => {
              setFab({
                progress: doneNum / totalNum,
                tip: `加载图片中 - ${doneNum}/${totalNum}`,
              });
            },
          );
        },
        SPA: {
          isMangaPage: () => window.location.href.includes('episode'),
          getOnPrev: () =>
            main.querySelectorClick('footer .HG_COMIC_READER_prev a'),
          getOnNext: () =>
            main.querySelectorClick(
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
      inject('jm');
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
        const dataScript = main.querySelector('body > script:not([src])')!;
        comicInfo = JSON.parse(
          // 只能通过 eval 获得数据
          // eslint-disable-next-line no-eval
          eval(dataScript.innerHTML.slice(26)).match(/(?<=.*?\(){.+}/)[0],
        );
      } catch {
        main.toast.error(main.t('site.changed_load_failed'));
        break;
      }

      // 让切换章节的提示可以显示在漫画页上
      GM.addStyle(`#smh-msg-box { z-index: 2147483647 !important }`);

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
              main.querySelector<HTMLImageElement>('#manga img')!.src,
            );
            return comicInfo.images.map((url) => `${origin}${url}?${sl}`);
          }

          main.toast.error(main.t('site.changed_load_failed'), { throw: true });
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
        main.toast.error(main.t('site.changed_load_failed'));
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
        main.querySelectorClick(
          () =>
            main.querySelector(pcSelector) ??
            main
              .querySelectorAll('.view-bottom-bar a')
              .find((e) => e.textContent?.includes(mobileText)),
        );

      options = {
        name: 'dm5',
        getImgList({ dynamicUpdate }) {
          // manhuaren 和 1kkk 的移动端上会直接用一个变量存储所有图片的链接
          if (
            Array.isArray(unsafeWindow.newImgs) &&
            unsafeWindow.newImgs.every(main.isUrl)
          )
            return unsafeWindow.newImgs as string[];

          return dynamicUpdate(async (setImg) => {
            for (let i = 0; i < imgNum; ) {
              const newImgs = await getPageImg(i + 1);
              for (const url of newImgs) setImg(i++, url);
            }
          }, imgNum)();
        },
        onPrev: handlePrevNext('.logo_1', '上一章'),
        onNext: handlePrevNext('.logo_2', '下一章'),
        onExit: (isEnd) => isEnd && main.scrollIntoView('.postlist'),
      };
      break;
    }

    // #[绅士漫画(wnacg)](https://www.wnacg.com)
    case 'siteUrl#wnacg':
    case 'www.wnacg.com':
    case 'wnacg.com': {
      // 突出显示下拉阅读的按钮
      const buttonDom = main.querySelector('#bodywrap a.btn');
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
        main.toast.error(main.t('site.changed_load_failed'));
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
        main.querySelectorClick(
          () =>
            main.querySelector(pcSelector) ??
            main
              .querySelectorAll('.bottom-bar-tool a')
              .find((e) => e.textContent?.includes(mobileText)),
        );

      options = {
        name: 'mangabz',
        getImgList: ({ dynamicUpdate }) =>
          dynamicUpdate(async (setImg) => {
            for (let i = 0; i < imgNum; i++) {
              const newImgs = await getPageImg(i + 1);
              newImgs.forEach((url) => setImg(i, url));
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
        if (!chapterId) throw new Error(main.t('site.changed_load_failed'));

        const res = await main.request('/api/query', {
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
        await main.waitDom('.v-bottom-navigation__content');
        return main.querySelectorClick(
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

    // #[无限动漫](https://www.comicabc.com)
    case '8.twobili.com':
    case 'a.twobili.com':
    case 'www.comicabc.com': {
      const pathStartList = ['/online/', '/ReadComic/', '/comic/'];
      if (!pathStartList.some((path) => location.pathname.startsWith(path)))
        break;

      const getImgList = () => {
        const imgList: string[] = [];

        if (Reflect.has(unsafeWindow, 'ss')) {
          const { ss, c, ti, nn, mm, f } = unsafeWindow;
          for (let i = 1; i <= unsafeWindow.ps; i++) {
            imgList.push(
              [
                `https://img${ss(c, 4, 2)}.8comic.com`,
                ss(c, 6, 1),
                ti,
                ss(c, 0, 4),
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                `${nn([i])}_${ss(c, mm([i]) + 10, 3, f)}.jpg`,
              ].join('/'),
            );
          }
        } else {
          const mainCode = [...document.scripts].find((s) =>
            s.textContent!.includes('ge(e)'),
          )!.textContent!;
          // 取得混淆過的關鍵代碼
          const [, keyCode] = /ge\([^.]+\.src\s?=\s?([^;]+)/.exec(mainCode)!;

          const total: number = unsafeWindow.ps;
          for (let i = 1; i <= total; i++) {
            // 把關鍵代碼裡的(p)或(pp)替換成頁數(1)
            const code = keyCode.replaceAll(/\(pp?\)/g, `(${i})`);
            // 使用 eval 來取得圖片網址
            // eslint-disable-next-line no-eval
            imgList.push(`${location.protocol}${eval(code)}`);
          }
        }

        return imgList;
      };

      options = {
        name: '8comic',
        getImgList,
        onNext: main.querySelectorClick('#nextvol'),
        onPrev: main.querySelectorClick('#prevvol'),
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
        onNext: main.querySelectorClick('#pnpage > a', '下一'),
        onPrev: main.querySelectorClick('#pnpage > a', '上一'),
      };
      break;
    }

    // #[hitomi](https://hitomi.la)
    case 'hitomi.la': {
      options = {
        name: 'hitomi',
        wait: () => Reflect.has(unsafeWindow.galleryinfo, 'files'),
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

    // #[Anchira](https://anchira.to)
    case 'anchira.to': {
      options = {
        name: 'hitomi',
        async getImgList({ fabProps }) {
          const [, , galleryId, galleryKey] =
            window.location.pathname.split('/');

          const headers = {
            'X-Requested-With': 'XMLHttpRequest',
            Referer: window.location.href,
          };
          const res = await main.request<string>(
            `/api/v1/library/${galleryId}/${galleryKey}/data`,
            { headers, noCheckCode: true },
          );
          if (res.status !== 200)
            main.toast.error(main.t('site.need_captcha'), {
              throw: true,
              duration: Number.POSITIVE_INFINITY,
              onClick: () => fabProps?.onClick?.(),
            });

          const { names, key, hash } = JSON.parse(res.response) as {
            names: string[];
            key: string;
            hash: string;
          };
          return names.map(
            (name) =>
              `https://kisakisexo.xyz/${galleryId}/${key}/${hash}/b/${name}`,
          );
        },
        SPA: { isMangaPage: () => window.location.href.includes('/g/') },
      };
      break;
    }

    // #[kemono](https://kemono.su)
    case 'kemono.su':
    case 'kemono.party': {
      inject('kemono');
      break;
    }

    // #[nekohouse](https://nekohouse.su)
    case 'nekohouse.su': {
      options = {
        name: 'nekohouse',
        getImgList: () =>
          main
            .querySelectorAll<HTMLAnchorElement>('.fileThumb')
            .map((e) => e.getAttribute('href')!),
        initOptions: { autoShow: false, defaultOption: { onePageMode: true } },
      };
      break;
    }

    // #[welovemanga](https://welovemanga.one)
    case 'nicomanga.com':
    case 'weloma.art':
    case 'welovemanga.one': {
      if (!main.querySelector('#listImgs, .chapter-content')) break;

      const getImgList = async (): Promise<string[]> => {
        const imgList = main
          .querySelectorAll<HTMLImageElement>(
            'img.chapter-img:not(.ls-is-cached)',
          )
          .map((e) =>
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
        await main.sleep(500);
        return getImgList();
      };

      options = {
        name: 'welovemanga',
        getImgList,
        onNext: main.querySelectorClick('.rd_top-right.next:not(.disabled)'),
        onPrev: main.querySelectorClick('.rd_top-left.prev:not(.disabled)'),
      };
      break;
    }

    // 为 pwa 版页面提供 api，以便翻译功能能正常运作
    // case 'localhost':
    case 'comic-read.pages.dev': {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
      unsafeWindow.toast = main.toast;
      break;
    }

    default: {
      inject('other');
    }
  }

  if (options) main.universalInit(options);
} catch (error) {
  main.log.error(error as Error);
}
