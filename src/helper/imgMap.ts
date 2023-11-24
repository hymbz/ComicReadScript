import { triggerEleLazyLoad, wait } from '.';

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
  });
};
export const openScrollLock = (time: number) => {
  scrollLock.enabled = true;
  closeScrollLock(time);
};
window.addEventListener('wheel', () => openScrollLock(1000));

/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe =
  /^(((https?|ftp|file):)?\/)?\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#%=~_|]$/;

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

/** 判断一个元素是否已经触发完懒加载 */
const isLazyLoaded = (e: HTMLImageElement, oldSrc?: string) => {
  if (!e.src) return false;
  if (oldSrc !== undefined && e.src !== oldSrc) return true;
  if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
  return false;
};

export const imgMap = new Map<HTMLImageElement, ImgData>();
let imgShowObserver: IntersectionObserver;

unsafeWindow.imgMap = imgMap;

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
imgShowObserver = new IntersectionObserver((entries) =>
  entries.forEach((img) => {
    const ele = img.target as HTMLImageElement;
    if (img.isIntersecting) {
      imgMap.set(ele, {
        ...getImg(ele),
        observerTimeout: window.setTimeout(handleTrigged, 290, ele),
      });
    }

    const timeoutID = imgMap.get(ele)?.observerTimeout;
    if (timeoutID) window.clearTimeout(timeoutID);
  }),
);

let timeoutId: number;
/** 触发页面上所有图片元素的懒加载 */
export const triggerLazyLoad = async (
  getAllImg: () => HTMLImageElement[],
  getWaitTime: () => number,
) => {
  const nowScroll = window.scrollY;
  // 滚到底部再滚回来，触发可能存在的自动翻页脚本
  window.scroll({ top: document.body.scrollHeight, behavior: 'auto' });
  document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
  window.scroll({ top: nowScroll, behavior: 'auto' });

  // 过滤掉已经被触发过懒加载的图片
  const targetImgList = getAllImg().filter(needTrigged);
  targetImgList.forEach((e) => {
    imgShowObserver.observe(e);
    if (!imgMap.has(e)) imgMap.set(e, createImgData(e.src));
  });

  for (let i = 0; i < targetImgList.length; i++) {
    await wait(() => !scrollLock.enabled);
    const e = targetImgList[i];
    if (!needTrigged(e)) continue;
    tryCorrectUrl(e);

    const waitTime = getWaitTime();

    if (
      (await triggerEleLazyLoad(e, waitTime, () =>
        isLazyLoaded(e, imgMap.get(e)?.oldSrc),
      )) ||
      waitTime
    )
      handleTrigged(e);
  }

  if (targetImgList.length !== 0) {
    if (timeoutId) window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(triggerLazyLoad, 500, getAllImg, getWaitTime);
  }
};
