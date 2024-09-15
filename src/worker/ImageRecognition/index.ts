import type { State } from '../../components/Manga/store';

import { getAreaColor, getEdgeArea } from './background';
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

  if (option.background) {
    const areaList = getEdgeArea(grayList, w, h);
    if (isDevMode) mainFn.showColorArea?.(imgData, w, h, ...areaList);

    if (areaList.length > 0) {
      const bgColor = getAreaColor(data, areaList[0]);
      mainFn.setImg(url, 'background', bgColor);
    }
  }
};
