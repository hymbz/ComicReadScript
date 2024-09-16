import type { State } from '../../components/Manga/store';

import { getAreaColor, getAreaEdgeRatio, getEdgeArea } from './colorArea';
import type { PixelList } from './helper';
import { getBlankMargin } from './blankMargin';
import { mainFn, resizeImg, toGrayList } from './workHelper';

export { setMainFn } from './workHelper';
export type { MainFn } from './workHelper';

export const handleImg = async (
  imgData: Uint8ClampedArray,
  width: number,
  height: number,
  url: string,
  option: State['option']['imgRecognition'],
) => {
  const startTime = isDevMode ? Date.now() : undefined;

  const { w, h, data } = resizeImg(imgData, width, height);
  // if (isDevMode) mainFn.showCanvas?.(data, w, h);

  const grayList = toGrayList(data, 5);
  // if (isDevMode) mainFn.showGrayList?.(grayList, w, h);

  let blankMargin: ReturnType<typeof getBlankMargin> | undefined;
  if (option.pageFill) {
    blankMargin = getBlankMargin(grayList, w, h);
    blankMargin.left = Math.floor((blankMargin.left / w) * width);
    blankMargin.right = Math.floor((blankMargin.right / w) * width);
    blankMargin.top = Math.floor((blankMargin.top / h) * height);
    blankMargin.bottom = Math.floor((blankMargin.bottom / h) * height);
    mainFn.setImg(url, 'blankMargin', {
      left: blankMargin.left,
      right: blankMargin.right,
    });
    mainFn.updatePageData();
  }

  let bgColor: string | undefined;
  if (option.background) {
    // XXX: 在有足够大的空白边缘时，直接取边缘颜色

    // 虽然也想支持渐变背景，但不像手机端只需要显示上下背景，可以无视中间的渐变
    // 浏览器上大部分时候都要显示左右区域的背景，不能和实际背景一致的话就会很突兀
    // 要是图片能一直占满屏幕的话，那还能通过单独显示上下或左右部分的背景色来实现
    // 但偏偏又有「禁止图片自动放大」功能，需要把图片的四边背景都显示出来
    const areaList = getEdgeArea(grayList, w, h);
    // if (isDevMode) mainFn.showColorArea?.(data, w, h, maxArea);

    if (areaList.length > 0) {
      const minimum = w * h * 0.02;
      let maxArea: undefined | PixelList;
      let maxRatio = 0.1;

      // 过滤总体占比和边缘占比过小的区域
      for (const pixelList of areaList) {
        if (pixelList.size < minimum) continue;
        const edgeRatio = getAreaEdgeRatio(pixelList, w, h);
        if (edgeRatio < maxRatio) continue;
        maxArea = pixelList;
        maxRatio = edgeRatio;
      }

      if (maxArea) {
        bgColor = getAreaColor(data, maxArea);
        mainFn.setImg(url, 'background', bgColor);
      }
    }
  }

  if (isDevMode) {
    let logText = `${url} 耗时 ${Date.now() - startTime!}ms 处理完成`;
    const resList: string[] = [];
    if (bgColor !== undefined) resList.push(`背景色: ${bgColor}`);
    if (blankMargin !== undefined)
      resList.push(`空白边缘：${JSON.stringify(blankMargin)}`);
    if (resList.length > 0) logText += `\n${resList.join('\n')}`;
    mainFn.log?.(logText);
  }
};
