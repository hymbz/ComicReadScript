import { createScheduled } from '@solid-primitives/scheduled';

import { singleThreaded, wait, throttle, sleep } from '.';

interface ImgData {
  /** 触发次数 */
  triggedNum: number;
  /** observer 的 timeout id */
  observerTimeout: number;
  /** 最初的 src */
  oldSrc: string;
}

const createImgData = (oldSrc = ''): ImgData => ({
  triggedNum: 0,
  observerTimeout: 0,
  oldSrc,
});

// 使用 triggerEleLazyLoad 会导致正常的滚动在滚到一半时被打断，所以加个锁限制一下
const scrollLock = {
  enabled: false,
  nextOpenTime: 0,
  timeout: 0,
};
const closeScrollLock = (delay: number) => {
  const time = Date.now() + delay;
  if (time <= scrollLock.nextOpenTime) return;
  scrollLock.nextOpenTime = time;
  window.clearInterval(scrollLock.timeout);
  scrollLock.timeout = window.setTimeout(() => {
    scrollLock.enabled = false;
    scrollLock.timeout = 0;
  }, delay);
};

export const openScrollLock = (time: number) => {
  scrollLock.enabled = true;
  closeScrollLock(time);
};

window.addEventListener('wheel', () => openScrollLock(1000));

/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe =
  /^(((https?|ftp|file):)?\/)?\/[-\w+&@#/%?=~|!:,.;]+[-\w+&@#%=~|]$/;

/** 检查元素属性，将格式为图片 url 的属性值作为 src */
const tryCorrectUrl = (e: Element) => {
  e.getAttributeNames().some((key) => {
    // 跳过白名单
    switch (key) {
      case 'src':
      case 'alt':
      case 'class':
      case 'style':
      case 'id':
      case 'title':
      case 'onload':
      case 'onerror':
        return false;
    }

    const val = e.getAttribute(key)!.trim();
    if (!isImgUrlRe.test(val)) return false;
    e.setAttribute('src', val);
    return true;
  });
};

/**
 *
 * 通过滚动到指定图片元素位置并停留一会来触发图片的懒加载，返回图片 src 是否发生变化
 *
 * 会在触发后重新滚回原位，当 time 为 0 时，因为滚动速度很快所以是无感的
 */
const triggerEleLazyLoad = async (
  e: HTMLImageElement,
  time?: number,
  isLazyLoaded?: () => boolean | Promise<boolean>,
) => {
  const nowScroll = window.scrollY;
  e.scrollIntoView({ behavior: 'instant' });
  e.dispatchEvent(new Event('scroll', { bubbles: true }));

  try {
    if (isLazyLoaded && time) return await wait(isLazyLoaded, time);
  } finally {
    window.scroll({ top: nowScroll, behavior: 'instant' });
  }
};

/** 判断一个元素是否已经触发完懒加载 */
const isLazyLoaded = (e: HTMLImageElement, oldSrc?: string) => {
  if (!e.src) return false;
  if (!e.offsetParent) return false;
  // 有些网站会使用 svg 占位
  if (e.src.startsWith('data:image/svg')) return false;
  if (oldSrc !== undefined && e.src !== oldSrc) return true;
  if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
  return false;
};

export const imgMap = new WeakMap<HTMLImageElement, ImgData>();
// eslint-disable-next-line no-autofix/prefer-const
let imgShowObserver: IntersectionObserver;

const getImg = (e: HTMLImageElement) => imgMap.get(e) ?? createImgData();

const MAX_TRIGGED_NUM = 5;

/** 判断图片元素是否需要触发懒加载 */
export const needTrigged = (e: HTMLImageElement) =>
  !isLazyLoaded(e, imgMap.get(e)?.oldSrc) &&
  (imgMap.get(e)?.triggedNum ?? 0) < MAX_TRIGGED_NUM;

/** 图片懒加载触发完后调用 */
const handleTrigged = (e: HTMLImageElement) => {
  const img = getImg(e);
  img.observerTimeout = 0;
  img.triggedNum += 1;
  if (isLazyLoaded(e, img.oldSrc) && img.triggedNum < MAX_TRIGGED_NUM)
    img.triggedNum = MAX_TRIGGED_NUM;
  imgMap.set(e, img);

  if (!needTrigged(e)) imgShowObserver.unobserve(e);
};

/** 监视图片是否被显示的 Observer */
imgShowObserver = new IntersectionObserver((entries) => {
  for (const img of entries) {
    const ele = img.target as HTMLImageElement;
    if (img.isIntersecting) {
      imgMap.set(ele, {
        ...getImg(ele),
        observerTimeout: window.setTimeout(handleTrigged, 290, ele),
      });
    }

    const timeoutID = imgMap.get(ele)?.observerTimeout;
    if (timeoutID) window.clearTimeout(timeoutID);
  }
});

const turnPageScheduled = createScheduled((fn) => throttle(fn, 1000));
/** 触发翻页 */
const triggerTurnPage = async (waitTime = 0) => {
  if (!turnPageScheduled()) return;
  const nowScroll = window.scrollY;
  // 滚到底部再滚回来，触发可能存在的自动翻页脚本
  window.scroll({ top: document.body.scrollHeight, behavior: 'instant' });
  document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
  if (waitTime) await sleep(waitTime);
  window.scroll({ top: nowScroll, behavior: 'instant' });
};

/** 触发页面上所有图片元素的懒加载 */
export const triggerLazyLoad = singleThreaded(
  async (
    state,
    getAllImg: () => HTMLImageElement[],
    getWaitTime: () => number,
  ) => {
    // 过滤掉已经被触发过懒加载的图片
    const targetImgList = getAllImg()
      .filter(needTrigged)
      .sort(
        (a, b) => a.getBoundingClientRect().y - b.getBoundingClientRect().y,
      );

    for (const e of targetImgList) {
      imgShowObserver.observe(e);
      if (!imgMap.has(e)) imgMap.set(e, createImgData(e.src));
    }

    for (const e of targetImgList) {
      await wait(() => !scrollLock.enabled);
      const waitTime = getWaitTime();

      await triggerTurnPage(waitTime);

      if (!needTrigged(e)) continue;
      tryCorrectUrl(e);

      if (
        (await triggerEleLazyLoad(e, waitTime, () =>
          isLazyLoaded(e, imgMap.get(e)?.oldSrc),
        )) ||
        waitTime
      )
        handleTrigged(e);
    }

    await triggerTurnPage();

    if (targetImgList.length > 0) state.continueRun = true;
  },
);
