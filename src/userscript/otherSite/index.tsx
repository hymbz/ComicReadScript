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
  sleep,
  isEqual,
} from 'helper';
import { useInit, toast } from 'main';

import { handleSwitchChapter } from './switchChapter';
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
  let laseScroll = window.scrollY;

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

    const canvas = new OffscreenCanvas(e.naturalWidth, e.naturalHeight);
    const canvasCtx = canvas.getContext('2d')!;
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

  /** 根据元素所在高度进行排序 */
  const eleSortFn = (a?: HTMLElement, b?: HTMLElement) =>
    a === undefined || b === undefined
      ? 0
      : a.getBoundingClientRect().y - b.getBoundingClientRect().y;

  const imgBlackList = [
    // 东方永夜机的预加载图片
    '#pagetual-preload',
    // 177picyy 上会在图片下加一个 noscript
    // 本来只是图片元素的 html 代码，但经过东方永夜机加载后就会变成真的图片元素，导致重复
    'noscript',
  ];
  const getAllImg = () =>
    querySelectorAll<HTMLImageElement>(`:not(${imgBlackList.join(',')}) > img`);

  /** 获取大概率是漫画图片的图片元素 */
  const getExpectImgList = () =>
    querySelectorAll<HTMLImageElement>(options.selector).filter(
      (e) =>
        isLazyLoaded(e, imgMap.get(e)?.oldSrc) ||
        !imgMap.has(e) ||
        imgMap.get(e)!.triggedNum <= 5,
    );

  /** 判断一个图片元素是否符合标准 */
  const isDisplayImg = (e: HTMLImageElement) =>
    e.offsetHeight > 100 &&
    e.offsetWidth > 100 &&
    ((e.naturalHeight > 500 && e.naturalWidth > 500) ||
      isEleSelector(e, options.selector));

  let imgEleList: Array<HTMLImageElement | undefined>;

  /** 检查筛选符合标准的图片元素用于更新 imgList */
  const updateImgList = singleThreaded(async (state) => {
    imgEleList = await wait(() => {
      /** 大概率是漫画图片的图片元素 */
      const expectImgs = options.selector
        ? new Set(getExpectImgList())
        : undefined;
      let imgNum = 0;
      const newImgList: typeof imgEleList = [];
      for (const e of getAllImg()) {
        if (isDisplayImg(e)) {
          newImgList.push(e);
          imgNum += 1;
        } else if (expectImgs?.has(e) && needTrigged(e))
          newImgList.push(undefined);
      }
      return imgNum >= 2 && newImgList.sort(eleSortFn);
    });

    if (imgEleList.length === 0) {
      setFab('show', false);
      setManga('show', false);
      return;
    }

    // 随着图片的增加，需要补上空缺位置，避免变成稀疏数组
    if (mangaProps.imgList.length < imgEleList.length)
      setComicMap('', 'imgList', [
        ...mangaProps.imgList,
        ...Array.from(
          { length: imgEleList.length - mangaProps.imgList.length },
          () => '',
        ),
      ]);
    // colamanga 会创建随机个数的假 img 元素，导致刚开始时高估页数，需要删掉多余的页数
    else if (mangaProps.imgList.length > imgEleList.length)
      setComicMap(
        '',
        'imgList',
        mangaProps.imgList.slice(0, imgEleList.length),
      );

    let isEdited = false;
    await plimit(
      imgEleList.map((e, i) => async () => {
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
    if (isEdited)
      saveImgEleSelector(imgEleList.filter(Boolean) as HTMLElement[]);

    if (isEdited || imgEleList.some((e) => !e || needTrigged(e))) {
      await sleep(1000);
      state.continueRun = true;
    }
  });

  let timeout = false;

  /** 只在`开启了阅读模式`和`当前可显示图片数量不足`时通过滚动触发懒加载 */
  const runCondition = () =>
    mangaProps.show || (!timeout && mangaProps.imgList.length === 0);

  /** 触发大概率是漫画图片的懒加载 */
  const triggerExpectImg = (num?: number, time?: number) =>
    wait(async () => {
      let expectImgList = getExpectImgList().filter(needTrigged);
      if (num) expectImgList = expectImgList.slice(0, num);
      await triggerLazyLoad(expectImgList, runCondition);
      return expectImgList.every((e) => !needTrigged(e));
    }, time);

  const triggerAllLazyLoad = singleThreaded(async () => {
    // 优先触发大概率是漫画图片的懒加载
    if (options.selector) {
      await triggerExpectImg(3, 1000 * 5);
      await triggerExpectImg();
    }
    await triggerLazyLoad(
      getAllImg().filter(needTrigged).sort(eleSortFn),
      runCondition,
    );

    // 针对不使用 img 来触发懒加载的网站，要找到图片容器元素再尝试触发懒加载
    // https://www.twmanga.com/comic/chapter/sanjiaoguanxirumen-founai/0_0.html
    if (imgEleList.length > 3) {
      let parent: HTMLElement = imgEleList[0]!;
      // 从现有的图片元素开始冒泡查找，检查每个层级上是否有超过5个相似的兄弟元素
      while (parent?.parentElement) {
        const siblingList = parent.parentElement.children;
        if (siblingList.length >= 5) {
          const dataset = parent.dataset;
          let sameNum = 0;
          for (const siblingDom of siblingList) {
            if (siblingDom === parent) continue;
            if (
              'dataset' in siblingDom &&
              isEqual(siblingDom.dataset, dataset)
            ) {
              sameNum++;
              if (sameNum >= 5) break;
            }
          }
          if (sameNum >= 5) {
            await triggerLazyLoad(
              querySelectorAll(getEleSelector(parent)),
              runCondition,
            );
            break;
          }
        }
        parent = parent.parentElement;
      }
    }
  });

  const handleMutation = () => {
    updateImgList();
    triggerAllLazyLoad();
    handleSwitchChapter(setManga);
  };
  /** 监视页面元素发生变化的 Observer */
  const imgDomObserver = new MutationObserver(handleMutation);

  setComicLoad(async () => {
    if (!imgEleList) {
      imgEleList = [];
      imgDomObserver.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['src'],
      });
      handleMutation();

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
  setManga({
    onShowImgsChange: throttle((showImgs) => {
      if (!mangaProps.show) return;
      imgEleList[[...showImgs].at(-1)!]?.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
    }, 1000),
  });

  // 在退出阅读模式时跳回之前的滚动位置
  createEffectOn(
    () => mangaProps.show,
    (show) => {
      if (show) laseScroll = window.scrollY;
      else window.scroll({ top: laseScroll, behavior: 'instant' });
    },
  );
};
