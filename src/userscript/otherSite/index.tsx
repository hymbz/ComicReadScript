import {
  t,
  getMostItem,
  querySelectorAll,
  wait,
  testImgUrl,
  canvasToBlob,
  plimit,
  singleThreaded,
  throttle,
  createEffectOn,
} from 'helper';
import { renderImgList } from 'components/Manga';
import { useInit, toast } from 'main';

import { getEleSelector, isEleSelector } from './eleSelector';
import {
  getDatasetUrl,
  imgMap,
  isLazyLoaded,
  needTrigged,
  triggerLazyLoad,
} from './triggerLazyLoad';

// 测试案例
// https://www.177picyy.com/html/2023/03/5505307.html
// 需要配合其他翻页脚本使用
// https://www.colamanga.com/manga-za76213/1/5.html
// 直接跳转到图片元素不会立刻触发，还需要停留20ms
// https://www.colamanga.com/manga-kg45140/1/2.html
// 使用 URL.createObjectURL 后马上 URL.revokeObjectURL 的 URL

/** 执行脚本操作。如果中途中断，将返回 true */
export const otherSite = async () => {
  const {
    options,
    setComicLoad,
    setComicMap,
    setImgList,
    setManga,
    setFab,
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
    toast(
      () => (
        <div>
          {t('site.simple.auto_read_mode_message')}
          <button on:click={() => setOptions({ autoShow: false })}>
            {t('other.disable')}
          </button>
        </div>
      ),
      { duration: 1000 * 7 },
    );

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

  const handleImgUrl = async (e: HTMLImageElement) => {
    const url = await handleBlobImg(e);
    if (url.startsWith('http:') && window.location.protocol === 'https:')
      return url.replace('http:', 'https:');
    return url;
  };

  /** 重复的加载占位图 */
  const placeholderImgList = new Set<string>();
  createEffectOn(
    () =>
      mangaProps.imgList.filter((url) => url && !placeholderImgList.has(url)),
    throttle((imgList) => {
      if (!imgList?.length || imgList.length - new Set(imgList).size <= 4)
        return;

      const repeatNumMap = new Map<string, number>();
      for (const url of imgList) {
        const repeatNum = (repeatNumMap.get(url) ?? 0) + 1;
        repeatNumMap.set(url, repeatNum);
        if (repeatNum > 5) placeholderImgList.add(url);
      }
    }),
  );

  const imgBlackList = [
    // 东方永夜机的预加载图片
    '#pagetual-preload',
    // 177picyy 上会在图片下加一个 noscript
    // 本来只是图片元素的 html 代码，但经过东方永夜机加载后就会变成真的图片元素，导致重复
    'noscript',
  ];
  const getAllImg = () =>
    querySelectorAll<HTMLImageElement>(`:not(${imgBlackList.join(',')}) > img`);

  let imgEleList: HTMLImageElement[];

  let updateImgListTimeout: number;
  /** 检查筛选符合标准的图片元素用于更新 imgList */
  const updateImgList = singleThreaded(async () => {
    imgEleList = await wait(() => {
      const newImgList = getAllImg()
        .filter(
          (e) =>
            e.offsetHeight > 100 &&
            e.offsetWidth > 100 &&
            ((e.naturalHeight > 500 && e.naturalWidth > 500) ||
              isEleSelector(e, options.selector)),
        )
        .sort(
          (a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y,
        );
      return newImgList.length >= 2 && newImgList;
    });

    if (imgEleList.length === 0) {
      setFab('show', false);
      setManga('show', false);
      return;
    }

    let newImgEleList: Array<HTMLImageElement | undefined> = imgEleList;

    /** 预计的图片总数 */
    let expectCount = 0;
    /** 还需要继续触发懒加载的图片个数 */
    let needTriggedNum = 0;
    if (options.selector) {
      const expectImgList = querySelectorAll<HTMLImageElement>(
        options.selector,
      );
      expectCount = expectImgList.filter(
        (e) =>
          !imgMap.get(e)?.triggedNum || isLazyLoaded(e, imgMap.get(e)?.oldSrc),
      ).length;
      needTriggedNum = expectImgList.filter(needTrigged).length;
      // 根据预计的图片总数补上占位的空图
      const fillImgNum = expectCount - imgEleList.length;
      if (fillImgNum > 0)
        newImgEleList = [
          ...imgEleList,
          ...Array.from<undefined>({ length: fillImgNum }),
        ];
    }

    let isEdited = false;
    await plimit(
      newImgEleList.map((e, i) => async () => {
        let newUrl = '';
        if (e) {
          newUrl = await handleImgUrl(e);
          if (placeholderImgList.has(newUrl)) newUrl = getDatasetUrl(e) ?? '';
        }
        if (newUrl === mangaProps.imgList[i]) return;

        isEdited ||= true;
        setImgList('', i, newUrl);
      }),
    );
    if (isEdited) saveImgEleSelector(imgEleList);

    // colamanga 会创建随机个数的假 img 元素，导致刚开始时高估页数，需要再删掉多余的页数
    if (mangaProps.imgList.length > newImgEleList.length)
      setComicMap(
        '',
        'imgList',
        mangaProps.imgList.slice(0, newImgEleList.length),
      );

    if (
      isEdited ||
      needTriggedNum ||
      imgEleList.some((e) => !e.naturalWidth && !e.naturalHeight)
    ) {
      if (updateImgListTimeout) window.clearTimeout(updateImgListTimeout);
      updateImgListTimeout = window.setTimeout(updateImgList, 1000);
    }
  });

  let timeout = false;

  const triggerAllLazyLoad = () =>
    triggerLazyLoad(
      getAllImg,
      // 只在`开启了阅读模式`和`当前可显示图片数量不足`时通过滚动触发懒加载
      () => mangaProps.show || (!timeout && mangaProps.imgList.length === 0),
    );

  /** 监视页面元素发生变化的 Observer */
  const imgDomObserver = new MutationObserver(() => {
    updateImgList();
    triggerAllLazyLoad();
  });

  setComicLoad(async () => {
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

      setTimeout(() => {
        timeout = true;
        if (mangaProps.imgList.length > 0) return;
        toast.warn(t('site.simple.no_img'), {
          id: 'no_img',
          duration: Number.POSITIVE_INFINITY,
          async onClick() {
            await setOptions({ remember_current_site: false });
            window.location.reload();
          },
        });
      }, 3000);

      if (isDevMode)
        Object.assign(unsafeWindow, { placeholderImgList, imgEleList });
    }

    await wait(() => mangaProps.imgList.length);
    toast.dismiss('no_img');
    return mangaProps.imgList;
  });

  // 同步滚动显示网页上的图片，用于以防万一保底触发漏网之鱼
  createEffectOn(
    renderImgList,
    throttle((list) => {
      if (list.size === 0 || !mangaProps.show) return;
      const lastImgIndex = [...list].at(-1);
      if (lastImgIndex === undefined) return;
      imgEleList[lastImgIndex]?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }, 1000),
    { defer: true },
  );

  // 在退出阅读模式时跳回之前的滚动位置
  let laseScroll = window.scrollY;
  createEffectOn(
    () => mangaProps.show,
    (show) => {
      if (show) laseScroll = window.scrollY;
      else window.scroll({ top: laseScroll, behavior: 'instant' });
    },
  );
};