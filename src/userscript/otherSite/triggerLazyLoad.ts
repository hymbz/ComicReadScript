import { createScheduled, singleThreaded, wait, throttle, sleep } from 'helper';

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

/** 用于判断是否是图片 url 的正则 */
const isImgUrlRe =
  /^(((https?|ftp|file):)?\/)?\/[-\w+&@#/%?=~|!:,.;]+[-\w+&@#%=~|]$/;

/** 找出格式为图片 url 的元素属性 */
export const getDatasetUrl = (e: Element) => {
  for (const key of e.getAttributeNames()) {
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
        continue;
    }

    const val = e.getAttribute(key)!.trim();
    if (!isImgUrlRe.test(val)) continue;
    return val;
  }
};

/**
 *
 * 通过滚动到指定图片元素位置并停留一会来触发图片的懒加载，返回图片 src 是否发生变化
 *
 * 会在触发后重新滚回原位，当 time 为 0 时，因为滚动速度很快所以是无感的
 */
const triggerEleLazyLoad = async (
  e: HTMLElement,
  time: number,
  isLazyLoaded: () => boolean | Promise<boolean>,
  runCondition: () => boolean,
) => {
  const nowScroll = window.scrollY;
  e.scrollIntoView({ behavior: 'instant' });
  e.dispatchEvent(new Event('scroll', { bubbles: true }));

  try {
    if (isLazyLoaded && time) return await wait(isLazyLoaded, time);
  } finally {
    if (runCondition()) window.scroll({ top: nowScroll, behavior: 'instant' });
  }
};

function isImageElement(e: HTMLElement): e is HTMLImageElement {
  return e.tagName === 'IMG';
}

/** 判断一个元素是否已经成功触发完懒加载 */
export const isLazyLoaded = (e: HTMLElement, oldSrc?: string) => {
  if (isImageElement(e)) {
    if (!e.src) return false;
    if (!e.offsetParent) return false;
    // 有些网站会使用 svg 占位
    if (e.src.startsWith('data:image/svg')) return false;
    if (e.naturalWidth > 500 || e.naturalHeight > 500) return true;
    if (oldSrc !== undefined && e.src !== oldSrc) return true;
  } else {
    const imgDomList = e.querySelectorAll('img');
    for (const imgDom of imgDomList)
      if (isLazyLoaded(imgDom, oldSrc)) return true;
  }
  return false;
};

export const imgMap = new WeakMap<HTMLElement, ImgData>();
// eslint-disable-next-line prefer-const
let imgShowObserver: IntersectionObserver;

const getImg = (e: HTMLElement) => imgMap.get(e) ?? createImgData();

const MAX_TRIGGED_NUM = 5;

/** 判断图片元素是否需要触发懒加载 */
export const needTrigged = (e: HTMLElement) =>
  !isLazyLoaded(e, imgMap.get(e)?.oldSrc) &&
  (imgMap.get(e)?.triggedNum ?? 0) < MAX_TRIGGED_NUM;

/** 图片懒加载触发完后调用 */
const handleTrigged = (e: HTMLElement) => {
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
    const e = img.target as HTMLElement;
    if (img.isIntersecting) {
      imgMap.set(e, {
        ...getImg(e),
        observerTimeout: window.setTimeout(handleTrigged, 290, e),
      });
    } else window.clearTimeout(imgMap.get(e)?.observerTimeout);
  }
});

const turnPageScheduled = createScheduled((fn) => throttle(fn, 1000));
/** 触发翻页 */
const triggerTurnPage = async (
  waitTime: number,
  runCondition: () => boolean,
) => {
  if (!turnPageScheduled()) return;
  const nowScroll = window.scrollY;
  // 滚到底部再滚回来，触发可能存在的自动翻页脚本
  window.scroll({ top: document.body.scrollHeight, behavior: 'instant' });
  document.body.dispatchEvent(new Event('scroll', { bubbles: true }));
  if (waitTime) await sleep(waitTime);
  if (runCondition()) window.scroll({ top: nowScroll, behavior: 'instant' });
};

const waitTime = 300;

/** 触发页面上图片元素的懒加载 */
export const triggerLazyLoad = singleThreaded(
  async (state, targetImgList: HTMLElement[], runCondition: () => boolean) => {
    for (const e of targetImgList) {
      imgShowObserver.observe(e);
      if (!imgMap.has(e))
        imgMap.set(e, createImgData(isImageElement(e) ? e.src : ''));
    }
    for (const e of targetImgList) {
      await wait(runCondition);

      await triggerTurnPage(0, runCondition);

      if (!needTrigged(e)) continue;

      const datasetUrl = getDatasetUrl(e);
      if (datasetUrl) e.setAttribute('src', datasetUrl);

      if (
        await triggerEleLazyLoad(
          e,
          waitTime,
          () => isLazyLoaded(e, imgMap.get(e)?.oldSrc),
          runCondition,
        )
      )
        handleTrigged(e);
    }

    await triggerTurnPage(waitTime, runCondition);

    if (targetImgList.length > 0) state.continueRun();
  },
);
