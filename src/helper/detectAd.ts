import { log, request, wait } from 'main';
import QrScanner from 'qr-scanner';
import type { AsyncReturnType } from 'type-fest';

/** 判断像素点是否是灰阶 */
const isGrayscalePixel = (r: number, g: number, b: number) =>
  r === g && r === b;

/** 判断一张图是否是彩图 */
const isColorImg = (imgCanvas: HTMLCanvasElement) => {
  const canvas = document.createElement('canvas');
  // 缩小尺寸放弃细节，避免被黑白图上的小段彩色文字干扰
  canvas.width = 3;
  canvas.height = 3;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imgCanvas, 0, 0, canvas.width, canvas.height);

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!isGrayscalePixel(r, g, b)) return true;
  }
  return false;
};

const imgToCanvas = async (img: HTMLImageElement) => {
  await wait(() => img.naturalHeight && img.naturalWidth);

  try {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    // 没被 CORS 污染就直接使用这个 canvas
    if (ctx.getImageData(0, 0, 1, 1)) return canvas;
  } catch (_) {}

  const res = await request<Blob>(img.src, { responseType: 'blob' });

  const image = new Image();
  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = URL.createObjectURL(res.response);
  });
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(image, 0, 0);

  return canvas;
};

/** 二维码白名单 */
const qrCodeWhiteList = [
  // fanbox
  /^https:\/\/[^.]+\.fanbox\.cc/,
  // twitter
  /^https:\/\/twitter\.com/,
  /^https:\/\/x\.com/,
  // fantia
  /^https:\/\/fantia\.jp/,
];

const isAdImg = async (
  imgCanvas: HTMLCanvasElement,
  qrEngine?: AsyncReturnType<typeof QrScanner.createQrEngine>,
  canvas?: HTMLCanvasElement,
) => {
  // 黑白图肯定不是广告
  if (!isColorImg(imgCanvas)) return false;
  try {
    const { data } = await QrScanner.scanImage(imgCanvas, { qrEngine, canvas });
    if (!data) return false;
    log(`检测到二维码： ${data}`);
    return qrCodeWhiteList.every((reg) => !reg.test(data));
  } catch (_) {
    return false;
  }
};

/** 通过图片内容判断是否是广告 */
export const getAdPageByContent = async (
  imgList: Array<HTMLImageElement | string | null>,
  adList = new Set<number>(),
) => {
  const qrEngine = await QrScanner.createQrEngine();
  const canvas = document.createElement('canvas');

  let i = imgList.length - 1;
  let normalNum = 0;
  // 只检查最后十张
  for (; i >= imgList.length - 10; i--) {
    // 开头肯定不会是广告
    if (i <= 2) break;
    if (adList.has(i)) continue;

    const img = imgList[i];
    if (!img) break;

    let imgEle: HTMLImageElement;
    if (typeof img === 'string') {
      imgEle = new Image();
      imgEle.src = img;
    } else imgEle = img;
    const imgCanvas = await imgToCanvas(imgEle);

    if (await isAdImg(imgCanvas, qrEngine, canvas)) adList.add(i);
    // 找到连续两张正常漫画页后中断
    else if (normalNum) break;
    else normalNum += 1;
  }

  let adNum = 0;
  for (i = Math.min(...adList); i < imgList.length; i++) {
    if (adList.has(i)) {
      adNum += 1;
      continue;
    }
    // 连续两张广告后面的肯定也都是广告
    if (adNum >= 2) adList.add(i);
    // 夹在两张广告中间的肯定也是广告
    else if (adList.has(i - 1) && adList.has(i + 1)) adList.add(i);
    else adNum = 0;
  }

  return adList;
};

const beforeTextRe = /^\D+(?=\d)/;
const hasNumRe = /\d/;

/** 通过文件名判断是否是广告 */
export const getAdPageByFileName = (
  fileNameList: Array<string | undefined>,
  adList = new Set<number>(),
) => {
  /** 根据前缀对所有文件名进行分组 */
  const beforeTextMap: Record<string, Set<number>> = {};

  fileNameList.forEach((fileName, i) => {
    // 没有数字的肯定是广告
    if (fileName && !hasNumRe.test(fileName)) return adList.add(i);

    const beforeText = fileName?.match(beforeTextRe)?.[0] ?? '';
    if (!beforeTextMap[beforeText]) beforeTextMap[beforeText] = new Set();
    beforeTextMap[beforeText].add(i);
  });

  const mostLength = Math.max(
    ...Object.values(beforeTextMap).map((list) => list.size),
  );

  const lastIndex = fileNameList.length - 1;

  Object.values(beforeTextMap).forEach((indexList) => {
    if (
      // 应该不至于上来就是广告吧
      indexList.has(0) ||
      // 不会有广告插在中间吧
      !indexList.has(lastIndex) ||
      // 出现最多的前缀肯定(?)不是广告
      indexList.size === mostLength ||
      // 不至于有十张广告吧
      indexList.size > 10
    )
      return;
    indexList.forEach((index) => adList.add(index));
  });

  return adList;
};
