import type { State } from '../../components/Manga/store';

import { getAreaColor, getAreaEdgeRatio, getEdgeArea } from './colorArea';
import type { PixelList } from './helper';
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
  const { w, h, data } = resizeImg(imgData, width, height);
  if (isDevMode) mainFn.showCanvas?.(data, w, h);

  const grayList = toGrayList(data, 5);
  if (isDevMode) mainFn.showGrayList?.(grayList, w, h);

  let bgColor: string | undefined;
  if (option.background) {
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
};
