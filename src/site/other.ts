// 这个文件里不能含有 jsx 代码，否则会在打包时自动加入 import solidjs 的代码

import { getInitLang } from 'helper/languages';
import {
  triggerLazyLoad,
  needTrigged,
  openScrollLock,
} from 'helper/triggerLazyLoad';
import { getEleSelector, isEleSelector } from 'helper/eleSelector';
import {
  t,
  getMostItem,
  querySelectorAll,
  useInit,
  wait,
  toast,
  autoReadModeMessage,
  testImgUrl,
  canvasToBlob,
  plimit,
  log,
  singleThreaded,
  store,
  throttle,
  showPageList,
  createEffectOn,
} from 'main';

// 测试案例
// https://www.177picyy.com/html/2023/03/5505307.html
// 需要配合其他翻页脚本使用
// https://www.colamanga.com/manga-za76213/1/5.html
// 直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.colamanga.com/manga-kg45140/1/2.html
// 使用 URL.createObjectURL 后马上 URL.revokeObjectURL 的 URL

(async () => {
  /** 执行脚本操作。如果中途中断，将返回 true */
  const start = async () => {
    const {
      setManga,
      setFab,
      init,
      options,
      setOptions,
      isStored,
      mangaProps,
    } = await useInit(window.location.hostname, {
      remember_current_site: true,
      selector: '',
    });

    // 通过 options 来迂回的实现禁止记住当前站点
    if (!options.remember_current_site) {
      await GM.deleteValue(window.location.hostname);
      return true;
    }

    if (!isStored)
      toast(autoReadModeMessage(setOptions), { duration: 1000 * 7 });

    // 为避免卡死，提供一个删除 selector 的菜单项
    const menuId = await GM.registerMenuCommand(
      t('site.simple.simple_read_mode'),
      () => setOptions({ selector: '' }),
    );

    // 等待 selector 匹配到目标后再继续执行，避免在漫画页外的其他地方运行
    await wait(
      () => !options.selector || querySelectorAll(options.selector).length >= 2,
    );

    await GM.unregisterMenuCommand(menuId);

    /** 记录传入的图片元素中最常见的那个 selector */
    const saveImgEleSelector = (imgEleList: HTMLElement[]) => {
      if (imgEleList.length < 7) return;
      const selector = getMostItem(imgEleList.map(getEleSelector));
      if (selector !== options.selector) setOptions({ selector });
    };

    const blobUrlMap = new Map<string, string>();
    // 处理那些 URL.createObjectURL 后马上 URL.revokeObjectURL 的图片
    const handleBlobImg = async (e: HTMLImageElement): Promise<string> => {
      if (blobUrlMap.has(e.src)) return blobUrlMap.get(e.src)!;
      if (!e.src.startsWith('blob:')) return e.src;
      if (await testImgUrl(e.src)) return e.src;

      const canvas = document.createElement('canvas');
      const canvasCtx = canvas.getContext('2d')!;

      canvas.width = e.naturalWidth;
      canvas.height = e.naturalHeight;
      canvasCtx.drawImage(e, 0, 0);

      const url = URL.createObjectURL(await canvasToBlob(canvas));
      blobUrlMap.set(e.src, url);
      return url;
    };

    const imgBlackList = [
      // 东方永夜机的预加载图片
      '#pagetual-preload',
      // 177picyy 上会在图片下加一个 noscript
      // 本来只是图片元素的 html 代码，但经过东方永夜机加载后就会变成真的图片元素，导致重复
      'noscript',
    ];
    const getAllImg = () =>
      querySelectorAll<HTMLImageElement>(
        `:not(${imgBlackList.join(',')}) > img`,
      );

    let imgEleList: HTMLImageElement[];

    let updateImgListTimeout: number;
    /** 检查筛选符合标准的图片元素用于更新 imgList */
    const updateImgList = singleThreaded(async () => {
      imgEleList = await wait(() => {
        const newImgList = getAllImg()
          .filter(
            (e) =>
              (e.offsetParent &&
                e.naturalHeight > 500 &&
                e.naturalWidth > 500) ||
              (isEleSelector(e, options.selector) &&
                (e.naturalHeight > 500 || e.naturalWidth > 500)),
          )
          .sort((a, b) => a.offsetTop - b.offsetTop);
        return newImgList.length >= 2 && newImgList;
      });

      if (imgEleList.length === 0) {
        setFab('show', false);
        setManga('show', false);
        return;
      }

      /** 找出应该是漫画图片，且还需要继续触发懒加载的图片个数 */
      const expectCount = options.selector
        ? querySelectorAll<HTMLImageElement>(options.selector).filter(
            needTrigged,
          ).length
        : 0;
      const _imgEleList = expectCount
        ? [...imgEleList, ...new Array<null>(expectCount)]
        : imgEleList;

      let isEdited = false;
      await plimit(
        _imgEleList.map((e, i) => async () => {
          const newUrl = e ? await handleBlobImg(e) : '';
          if (newUrl === mangaProps.imgList[i]) return;

          if (!isEdited) isEdited = true;
          setManga('imgList', i, newUrl);
        }),
      );
      if (isEdited) saveImgEleSelector(imgEleList);

      // colamanga 会创建随机个数的假 img 元素，导致刚开始时高估页数，需要再删掉多余的页数
      if (mangaProps.imgList.length > _imgEleList.length)
        setManga('imgList', mangaProps.imgList.slice(0, _imgEleList.length));

      if (
        isEdited ||
        expectCount ||
        imgEleList.some((e) => !e.naturalWidth && !e.naturalHeight)
      ) {
        if (updateImgListTimeout) window.clearTimeout(updateImgListTimeout);
        updateImgListTimeout = window.setTimeout(updateImgList, 1000);
      }
    });

    let timeout = false;
    setTimeout(() => {
      timeout = true;
      if (mangaProps.imgList.length) return;
      toast.warn(t('site.simple.no_img'), {
        id: 'no_img',
        duration: Infinity,
        onClick: async () => {
          await setOptions({ remember_current_site: false });
          window.location.reload();
        },
      });
    }, 3000);

    const triggerAllLazyLoad = () =>
      triggerLazyLoad(getAllImg, () =>
        // 只在`开启了阅读模式所以用户看不到网页滚动`和`当前可显示图片数量不足`时停留一段时间
        mangaProps.show || (!timeout && !mangaProps.imgList.length) ? 300 : 0,
      );

    /** 监视页面元素发生变化的 Observer */
    const imgDomObserver = new MutationObserver(() => {
      updateImgList();
      triggerAllLazyLoad();
    });

    init(async () => {
      if (!imgEleList) {
        imgEleList = [];
        imgDomObserver.observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          attributeFilter: ['src'],
        });
        updateImgList();
        triggerAllLazyLoad();
      }
      await wait(() => mangaProps.imgList.length);
      toast.dismiss('no_img');
      return mangaProps.imgList;
    });

    // 同步滚动显示网页上的图片，用于以防万一保底触发漏网之鱼
    createEffectOn(
      showPageList,
      throttle(() => {
        if (!showPageList().length || !store.show) return;
        const lastImgIndex = store.pageList[showPageList().at(-1)!].findLast(
          (i) => i !== -1,
        );
        if (lastImgIndex === undefined) return;
        imgEleList[lastImgIndex]?.scrollIntoView({
          behavior: 'instant',
          block: 'end',
        });
        openScrollLock(500);
      }, 1000),
      { defer: true },
    );

    // 在退出阅读模式时跳回之前的滚动位置
    let laseScroll = window.scrollY;
    createEffectOn(
      () => store.show,
      (show) => {
        if (show) laseScroll = window.scrollY;
        else {
          openScrollLock(1000);
          // 稍微延迟一下，等之前触发懒加载时的滚动结束
          requestAnimationFrame(() => window.scrollTo(0, laseScroll));
        }
      },
    );
  };

  if ((await GM.getValue(window.location.hostname)) !== undefined)
    return start();

  const menuId = await GM.registerMenuCommand(
    extractI18n('site.simple.simple_read_mode')(await getInitLang()),
    () => !start() && GM.unregisterMenuCommand(menuId),
  );
})().catch((e) => log.error(e));
