import {
  forEachCols,
  forEachRows,
  type ImgContextBase,
  type TBLR,
} from './workHelper';

/** 获取图片空白边缘的长度 */
export const getBlankMargin = ({
  grayList,
  width,
  height,
}: ImgContextBase): Record<TBLR, number> | undefined => {
  let blankColor: undefined | number;

  // 检查指定行或列上是否全是相同颜色
  const isBlankLine = (x: number, y: number) => {
    const colorMap = new Map<number, number>();

    const eachFn = (i: number) => {
      const gray = grayList[i];
      colorMap.set(gray, (colorMap.get(gray) || 0) + 1);
      // grayList[i] = Math.abs(gray - 255);
    };

    if (x < 0) forEachRows(width, y, eachFn);
    else forEachCols(width, height, x, eachFn);

    let maxColor: undefined | number;
    // 为了能跳过些微色差和漫画水印，阈值就只设为 90%
    let maxNum = height * 0.9;
    for (const [gray, num] of colorMap.entries()) {
      if (num < maxNum) continue;
      maxColor = gray;
      maxNum = num;
    }

    if (maxColor === undefined) return false;

    blankColor ||= maxColor;

    if (maxColor !== blankColor) return false;
    return true;
  };

  let left = 0;
  for (let x = 0, end = width * 0.4; x < end; x++, left++)
    if (!isBlankLine(x, -1)) break;

  blankColor = undefined;
  let right = 0;
  for (let x = width - 1, end = width * 0.6; x >= end; x--, right++)
    if (!isBlankLine(x, -1)) break;

  blankColor = undefined;
  let top = 0;
  for (let y = 0, end = height * 0.4; y < end; y++, top++)
    if (!isBlankLine(-1, y)) break;

  blankColor = undefined;
  let bottom = 0;
  for (let y = height - 1, end = height * 0.6; y >= end; y--, bottom++)
    if (!isBlankLine(-1, y)) break;

  // if (isDevMode) mainFn.showGrayList?.(grayList, width, height);

  if (left || right || top || bottom) return { left, right, top, bottom };
  return undefined;
};
