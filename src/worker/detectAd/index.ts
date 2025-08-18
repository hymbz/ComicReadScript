import type { Options } from 'jsqr';

import jsQR from 'jsqr';

import { mainFn, toGray } from './workHelper';

export { setMainFn } from './workHelper';

// jsQR 最为简洁，但不支持包含多个二维码的图片
// https://github.com/cozmo/jsQR/issues/24
//
// ZXing 可以扫描包含多个二维码的图片，但因为同时支持多种编码，
// 包含了很多根本不需要的代码，用在这里感觉太牛刀杀鸡了
//
// qr-scanner 基于上述两个库进行开发，是最优选。但会收到 CSP 限制而无法使用
// https://github.com/nimiq/qr-scanner/issues/221

/** 判断一张图是否是彩图 */
const isColorImg = (data: Uint8ClampedArray) => {
  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (!(r === g && r === b)) return true;
  }
  return false;
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
  // 棉花糖
  /^https:\/\/marshmallow-qa\.com/,
  // dlsite
  /^https:\/\/www\.dlsite\.com/,
  // hitomi
  /^https:\/\/hitomi\.la/,
];

const options: Options = { inversionAttempts: 'attemptBoth' };

/** 识别图像上的二维码 */
const getQrCode = (img: Uint8ClampedArray, width: number, height: number) => {
  try {
    const binaryData = jsQR(img, width, height, options)?.binaryData;
    if (!binaryData) return false;
    // 因为 jsqr 默认的输出不支持特殊符号，为以防万一，手动进行转换
    const text = new TextDecoder().decode(Uint8Array.from(binaryData));
    mainFn.log(`检测到二维码： ${text}`);
    return text;
  } catch (error) {
    mainFn.log(error);
    return undefined;
  }
};

// zxing 方案
//
// import {
//   MultiFormatReader,
//   BarcodeFormat,
//   DecodeHintType,
//   RGBLuminanceSource,
//   BinaryBitmap,
//   HybridBinarizer,
// } from '@zxing/library';
//
// const hints = new Map();
// // 只识别二维码
// hints.set(DecodeHintType.POSSIBLE_FORMATS, [
//   BarcodeFormat.QR_CODE,
//   BarcodeFormat.DATA_MATRIX,
// ]);
// // 花更多时间尝试寻找条形码
// hints.set(DecodeHintType.TRY_HARDER, true);
//
// /** 识别图像上的二维码 */
// const getQrCode = (
//   data: Uint8ClampedArray,
//   width: number,
//   height: number,
// ) => {
//   try {
//     const luminance = new Uint8ClampedArray(width * height);
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];
//       luminance[i / 4] = (r + g + b) / 3;
//     }
//     const luminanceSource = new RGBLuminanceSource(luminance, width, height);
//     const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
//     const res = new MultiFormatReader().decode(binaryBitmap, hints);
//     const text = res.getText();
//     if (!text) return false;
//     mainFn.log(`检测到二维码： ${text}`);
//     return text;
//   } catch (error) {
//     console.log(error);
//     debugger;
//     return false;
//   }
// };

const getImgData = (img: ImageBitmap) => {
  const canvas = new OffscreenCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const scanImgBlock = (
  img: ImageData,
  sx: number,
  sy: number,
  w: number,
  h: number,
) => {
  if (w === img.width && h === img.height) return getQrCode(img.data, w, h);

  const data = new Uint8ClampedArray(new ArrayBuffer(w * h * 4));
  for (let y = 0, height = sy + h; y < height; y++)
    for (let x = 0, width = sx + w; x < width; x++) {
      const i = (y * w + x) * 4;
      const target = ((y + sy) * img.width + (x + sx)) * 4;
      data[i] = img.data[target];
      data[i + 1] = img.data[target + 1];
      data[i + 2] = img.data[target + 2];
      data[i + 3] = img.data[target + 3];
    }
  return getQrCode(data, w, h);
};

export const isAdImg = (imgBitmap: ImageBitmap) => {
  const imgData = getImgData(imgBitmap);

  // 黑白图肯定不是广告
  if (!isColorImg(imgData.data)) return false;

  // 以 200 灰度为阈值，将图片二值化，以便识别彩色二维码
  for (let i = 0; i < imgData.data.length; i += 4) {
    const gray = toGray(
      imgData.data[i],
      imgData.data[i + 1],
      imgData.data[i + 2],
    );
    const val = gray < 200 ? 0 : 255;
    imgData.data[i] = val;
    imgData.data[i + 1] = val;
    imgData.data[i + 2] = val;
    imgData.data[i + 3] = 255;
  }

  // mainFn.showCanvas?.(imgData.data, imgBitmap.width, imgBitmap.height);

  let text = getQrCode(imgData.data, imgData.width, imgData.height);

  // 分区块扫描图片
  if (!text) {
    const w = Math.floor(imgData.width / 2);
    const h = Math.floor(imgData.height / 2);

    for (const args of [
      [w, h], // ↘
      [0, h], // ↙
      [w, 0], // ↗
      [0, 0], // ↖
    ] as [number, number][]) {
      text = scanImgBlock(imgData, ...args, w, h);
      if (text) break;
    }
  }
  if (text) return qrCodeWhiteList.every((reg) => !reg.test(text));

  return false;
};
