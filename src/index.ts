import type { InitOptions, UseInitFnMap } from './helper/universalInit';

/**
 * 虽然在打包的时候已经尽可能保持代码格式不变了，但因为脚本代码比较多的缘故
 * 所以真对脚本代码感兴趣的话，推荐还是直接上 github 仓库来看
 * <https://github.com/hymbz/ComicReadScript>
 * 对站点逻辑感兴趣的，结合 `src\index.ts` 看 `src\site` 下的对应文件即可
 */

inject('import');

/** 站点配置 */
let options: InitOptions | undefined;

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
const main = require('main') as typeof import('./main');

try {
  // 匹配站点
  switch (window.location.hostname) {
    // #百合会——「记录阅读历史，体验优化」
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
      const totalPageNum = +main
        .querySelector('section div:first-of-type div:last-of-type')!
        .innerHTML.split('：')[1];
      if (Number.isNaN(totalPageNum))
        throw new Error('页面结构发生改变，无法正常运行');

      /** 获取指定页数的图片 url */
      const getImg = async (i = 1) => {
        const res = await main.request(
          `https://www.yamibo.com/manga/view-chapter?id=${id}&page=${i}`,
        );

        return res.responseText
          .match(/(?<=<img id=['"]imgPic['"].+?src=['"]).+?(?=['"])/)![0]
          .replaceAll('&amp;', '&');
      };

      options = {
        name: 'newYamibo',
        getImgList: ({ setFab }) =>
          main.plimit(
            Object.keys([...new Array(totalPageNum)]).map(
              (i) => () => getImg(+i + 1),
            ),
            (doneNum, totalNum) => {
              setFab({
                progress: doneNum / totalNum,
                tip: `加载图片中 - ${doneNum}/${totalNum}`,
              });
            },
          ),
        onNext: main.querySelectorClick('#btnNext'),
        onPrev: main.querySelectorClick('#btnPrev'),
        onExit: (isEnd) => isEnd && main.scrollIntoView('#w1'),
      };
      break;
    }

    // #动漫之家——「解锁隐藏漫画」
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

    // #ehentai——「匹配 nhentai 漫画」
    case 'exhentai.org':
    case 'e-hentai.org': {
      inject('ehentai');
      break;
    }

    // #nhentai——「彻底屏蔽漫画，自动翻页」
    case 'nhentai.net': {
      inject('nhentai');
      break;
    }

    // #PonpomuYuri
    case 'www.ponpomu.com': {
      options = {
        name: 'terraHistoricus',
        wait: () => !!main.querySelector('.comic-page-container img'),
        getImgList: () =>
          main
            .querySelectorAll('.comic-page-container img')
            .map((e) => e.getAttribute('data-srcset')!),
        SPA: {
          isMangaPage: () => window.location.href.includes('/comic/'),
          getOnPrev: () => main.querySelectorClick('.prev-btn a'),
          getOnNext: () => main.querySelectorClick('.next-btn a'),
        },
      };
      break;
    }

    // #明日方舟泰拉记事社
    case 'terra-historicus.hypergryph.com': {
      const apiUrl = () =>
        `https://terra-historicus.hypergryph.com/api${window.location.pathname}`;

      const getImgUrl = (i: number) => async () => {
        const res = await main.request(`${apiUrl()}/page?pageNum=${i + 1}`);
        return JSON.parse(res.response).data.url as string;
      };

      options = {
        name: 'terraHistoricus',
        wait: () => !!main.querySelector('.HG_COMIC_READER_main'),
        getImgList: async ({ setFab }) => {
          const res = await main.request(apiUrl());
          const pageList = JSON.parse(res.response).data.pageInfos as unknown[];
          if (
            pageList.length === 0 &&
            window.location.pathname.includes('episode')
          )
            throw new Error('获取图片列表时出错');

          return main.plimit<string>(
            [...Array(pageList.length).keys()].map(getImgUrl),
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

    // #禁漫天堂
    // 发布页：https://jmcomic.ltd
    case '18comic-god.xyz':
    case '18comic-god.club':
    case '18comic-god.cc':
    case 'jmcomic.me':
    case 'jmcomic1.me':
    case '18comic.org':
    case '18comic.vip': {
      inject('jm');
      break;
    }

    // #拷贝漫画(copymanga)
    case 'copymanga.site':
    case 'copymanga.info':
    case 'copymanga.net':
    case 'copymanga.org':
    case 'copymanga.tv':
    case 'copymanga.com':
    case 'www.copymanga.site':
    case 'www.copymanga.info':
    case 'www.copymanga.net':
    case 'www.copymanga.org':
    case 'www.copymanga.tv':
    case 'www.copymanga.com': {
      if (!window.location.href.includes('/chapter/')) break;

      const apiList = [
        'https://api.copymanga.info',
        'https://api.copymanga.net',
        'https://api.copymanga.org',
        'https://api.copymanga.tv',
        'https://api.xsskc.com',
        'https://api.mangacopy.com',
        'https://api.copymanga.site',
      ];

      options = {
        name: 'copymanga',
        getImgList: async () => {
          const res = await main.eachApi(
            window.location.href.replace(/.*?(?=\/comic\/)/, '/api/v3'),
            apiList,
          );
          return (
            JSON.parse(res.responseText).results.chapter.contents as {
              url: string;
            }[]
          ).map(({ url }) => url);
        },
        onNext: main.querySelectorClick('.comicContent-next a:not(.prev-null)'),
        onPrev: main.querySelectorClick(
          '.comicContent-prev:not(.index,.list) a:not(.prev-null)',
        ),
        getCommentList: async () => {
          const chapter_id = window.location.pathname.split('/').at(-1);
          const res = await main.eachApi(
            `/api/v3/roasts?chapter_id=${chapter_id}&limit=100&offset=0&_update=true`,
            apiList,
            { errorText: '获取漫画评论失败' },
          );
          return JSON.parse(res.responseText).results.list.map(
            ({ comment }) => comment as string,
          ) as string[];
        },
      };
      break;
    }

    // #漫画柜(manhuagui)
    case 'www.manhuagui.com':
    case 'www.mhgui.com':
    case 'tw.manhuagui.com': {
      if (!Reflect.has(unsafeWindow, 'cInfo')) break;

      // 让切换章节的提示可以显示在漫画页上
      GM.addStyle(`#smh-msg-box { z-index: 2147483647 !important }`);

      options = {
        name: 'manhuagui',
        getImgList: () => {
          const comicInfo = JSON.parse(
            // 只能通过 eval 获得数据
            // eslint-disable-next-line no-eval
            eval(
              main
                .querySelectorAll('body > script')
                .at(-1)!
                .innerHTML.slice(26),
            ).slice(12, -12),
          );
          const sl = Object.entries(comicInfo.sl)
            .map((attr) => `${attr[0]}=${attr[1]}`)
            .join('&');
          return (comicInfo.files as string[]).map(
            (file) => `${unsafeWindow.pVars.manga.filePath}${file}?${sl}`,
          );
        },
        onNext:
          unsafeWindow.cInfo.nextId !== 0
            ? main.querySelectorClick('a.nextC')
            : undefined,
        onPrev:
          unsafeWindow.cInfo.prevId !== 0
            ? main.querySelectorClick('a.prevC')
            : undefined,
      };
      break;
    }

    // #漫画DB(manhuadb)
    case 'www.manhuadb.com': {
      if (!Reflect.has(unsafeWindow, 'img_data_arr')) break;

      options = {
        name: 'manhuaDB',
        getImgList: () =>
          (unsafeWindow.img_data_arr as { img: string }[]).map(
            (data) =>
              `${unsafeWindow.img_host}/${unsafeWindow.img_pre}/${data.img}`,
          ),
        onPrev: () => unsafeWindow.goNumPage('pre') as void,
        onNext: () => unsafeWindow.goNumPage('next') as void,
      };
      break;
    }

    // #动漫屋(dm5)
    case 'tel.dm5.com':
    case 'en.dm5.com':
    case 'www.dm5.com':
    case 'www.dm5.cn':
    case 'www.1kkk.com': {
      if (!Reflect.has(unsafeWindow, 'DM5_CID')) break;

      const getImgList = async (
        fnMap: UseInitFnMap,
        imgList: string[] = [],
      ): Promise<string[]> => {
        const res = await unsafeWindow.$.ajax({
          type: 'GET',
          url: 'chapterfun.ashx',
          data: {
            cid: unsafeWindow.DM5_CID,
            page: imgList.length + 1,
            key: unsafeWindow.$('#dm5_key').length
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

        // 返回的数据只能通过 eval 获得
        const newImgList = [
          ...imgList,
          // eslint-disable-next-line no-eval
          ...(eval(res) as string[]),
        ];

        if (newImgList.length !== unsafeWindow.DM5_IMAGE_COUNT) {
          // 在 Fab 按钮上通过进度条和提示文本显示当前进度
          fnMap.setFab({
            progress: newImgList.length / unsafeWindow.DM5_IMAGE_COUNT,
            tip: `加载图片中 - ${newImgList.length}/${unsafeWindow.DM5_IMAGE_COUNT}`,
          });
          return getImgList(fnMap, newImgList);
        }

        return newImgList;
      };

      options = {
        name: 'dm5',
        getImgList,
        onNext: main.querySelectorClick('.logo_2'),
        onPrev: main.querySelectorClick('.logo_1'),
        onExit: (isEnd) => isEnd && main.scrollIntoView('.postlist'),
      };
      break;
    }

    // #绅士漫画(wnacg)
    case 'www.wn3.lol':
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
          (unsafeWindow.imglist as { url: string; caption: string }[])
            .filter(
              ({ caption }) => caption !== '喜歡紳士漫畫的同學請加入收藏哦！',
            )
            .map(({ url }) => new URL(url, window.location.origin).href),
      };
      break;
    }

    // #mangabz
    case 'www.mangabz.com':
    case 'mangabz.com': {
      if (!Reflect.has(unsafeWindow, 'MANGABZ_CID')) break;

      const getImgList = async (
        fnMap: UseInitFnMap,
        imgList: string[] = [],
      ): Promise<string[]> => {
        const res = await unsafeWindow.$.ajax({
          type: 'GET',
          url: 'chapterimage.ashx',
          data: {
            cid: unsafeWindow.MANGABZ_CID,
            page: imgList.length + 1,
            key: '',
            _cid: unsafeWindow.MANGABZ_CID,
            _mid: unsafeWindow.MANGABZ_MID,
            _dt: unsafeWindow.MANGABZ_VIEWSIGN_DT,
            _sign: unsafeWindow.MANGABZ_VIEWSIGN,
          },
        });

        // 返回的数据只能通过 eval 获得
        const newImgList = [
          ...imgList,
          // eslint-disable-next-line no-eval
          ...(eval(res) as string[]),
        ];

        if (newImgList.length !== unsafeWindow.MANGABZ_IMAGE_COUNT) {
          // 在 Fab 按钮上通过进度条和提示文本显示当前进度
          fnMap.setFab({
            progress: newImgList.length / unsafeWindow.MANGABZ_IMAGE_COUNT,
            tip: `加载图片中 - ${newImgList.length}/${unsafeWindow.MANGABZ_IMAGE_COUNT}`,
          });
          return getImgList(fnMap, newImgList);
        }

        return newImgList;
      };

      options = {
        name: 'mangabz',
        getImgList,
        onNext: main.querySelectorClick(
          'body > .container a[href^="/"]:last-child',
        ),
        onPrev: main.querySelectorClick(
          'body > .container a[href^="/"]:first-child',
        ),
      };
      break;
    }

    // #komiic
    case 'komiic.com': {
      const getImgList = async (): Promise<string[]> => {
        const imgList = main
          .querySelectorAll('.imageContainer > img')
          .map((e) => e.getAttribute('data-src') ?? '');
        if (imgList.includes('')) {
          await main.sleep(100);
          return getImgList();
        }
        return imgList;
      };

      const handlePrevNext = (text: string) => async () => {
        // 点击唤出底栏
        const id = window.setInterval(() => {
          main.querySelector('.ComicImageContainer')?.click();
        }, 500);
        await main.waitDom('.ComicImage__bottom-menu-center');
        window.clearInterval(id);

        const buttonDom = main
          .querySelectorAll(
            '.ComicImage__bottom-menu-center button:not([disabled])',
          )
          .find((e) => e.innerText.includes(text));

        return main.querySelectorClick(() => buttonDom);
      };

      const urlMatchRe = /comic\/\d+\/chapter\/\d+\/images\//;

      options = {
        name: 'komiic',
        wait: () => !!main.querySelector('.imageContainer > img'),
        getImgList,
        SPA: {
          isMangaPage: () => urlMatchRe.test(window.location.href),
          getOnPrev: handlePrevNext('上一'),
          getOnNext: handlePrevNext('下一'),
        },
      };
      break;
    }

    // #hitomi
    case 'hitomi.la': {
      options = {
        name: 'hitomi',
        getImgList: () =>
          main
            .wait(() => unsafeWindow.galleryinfo?.files as object[])
            .then((files) =>
              files.map(
                (img) =>
                  unsafeWindow.url_from_url_from_hash(
                    unsafeWindow.galleryinfo.id,
                    img,
                    'webp',
                    undefined,
                    'a',
                  ) as string,
              ),
            ),
      };
      break;
    }

    // #kemono
    case 'kemono.party': {
      options = {
        name: 'kemono',
        getImgList: () =>
          main
            .querySelectorAll<HTMLAnchorElement>('.post__thumbnail > a')
            .map((e) => e.href),
        initOptions: { autoShow: false, option: { onePageMode: true } },
      };
      break;
    }

    // #welovemanga
    case 'nicomanga.com':
    case 'weloma.art':
    case 'welovemanga.one': {
      if (!main.querySelector('#listImgs')) break;

      const imgSelector =
        '#listImgs img.chapter-img.chapter-img:not(.ls-is-cached)';

      const isLoadingGifRe = /loading.*\.gif/;

      const getImgList = async (): Promise<string[]> => {
        const imgList = main
          .querySelectorAll<HTMLImageElement>(imgSelector)
          .map(
            (e) =>
              e.getAttribute('data-src')?.trim() ??
              e.getAttribute('data-original')?.trim() ??
              e.src,
          );
        if (imgList.every((url) => !isLoadingGifRe.test(url))) return imgList;
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
    case 'comic-read.pages.dev': {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
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
