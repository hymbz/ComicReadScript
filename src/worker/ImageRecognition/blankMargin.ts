import { forEachCols, forEachRows } from './workHelper';

/** 获取图片空白边缘的长度 */
export const getBlankMargin = (
  grayList: Uint8ClampedArray,
  width: number,
  height: number,
): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} | null => {
  let blankColor: undefined | number;

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
  for (let x = 0, end = width * 0.4; x < end; x++) {
    if (!isBlankLine(x, -1)) break;
    left += 1;
  }

  blankColor = undefined;
  let right = 0;
  for (let x = width - 1, end = width * 0.6; x >= end; x--) {
    if (!isBlankLine(x, -1)) break;
    right += 1;
  }

  blankColor = undefined;
  let top = 0;
  for (let y = 0, end = height * 0.4; y < end; y++) {
    if (!isBlankLine(-1, y)) break;
    top += 1;
  }

  blankColor = undefined;
  let bottom = 0;
  for (let y = height - 1, end = height * 0.6; y >= end; y--) {
    if (!isBlankLine(-1, y)) break;
    bottom += 1;
  }

  // if (isDevMode) mainFn.showGrayList?.(grayList, width, height);

  if (left || right || top || bottom) return { left, right, top, bottom };
  return null;
};
