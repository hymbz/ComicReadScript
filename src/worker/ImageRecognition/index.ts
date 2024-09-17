import type { State } from '../../components/Manga/store';

import { getBackground } from './background';
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
  if (option.pageFill || option.background) {
    blankMargin = getBlankMargin(grayList, w, h);
    if (blankMargin) {
      for (const key of ['top', 'bottom', 'left', 'right'] as const)
        blankMargin[key] &&= Math.floor(blankMargin[key] / w) * width;
      mainFn.setImg(url, 'blankMargin', {
        left: blankMargin.left,
        right: blankMargin.right,
      });
      mainFn.updatePageData();
    }
  }

  let bgColor: string | undefined;
  if (option.background) {
    // 虽然也想支持渐变背景，但浏览器上不像手机端那样只需要显示上下背景，可以无视中间的渐变
    // 大部分时候都要显示左右区域的背景，不能和实际背景一致的话就会很突兀
    // 要是图片能一直占满屏幕的话，那还能通过单独显示上下或左右部分的背景色来实现
    // 但偏偏又有「禁止图片自动放大」功能，需要把图片的四边背景都显示出来
    bgColor = getBackground(data, grayList, w, h, blankMargin);
    if (bgColor) mainFn.setImg(url, 'background', bgColor);
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
