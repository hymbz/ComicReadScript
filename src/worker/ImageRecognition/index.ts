import { getBackground } from './background';
import { detectBackgroundRegions } from './backgroundDetection';
import { getBlankMargin } from './blankMargin';
import { ImgContext } from './imgContext';
import { type ImgContextInput } from './types';
import { mainFn } from './workHelper';

export { setMainFn } from './workHelper';
export type { ImgContext } from './imgContext';
export type { MainFn } from './types';

// /** 把 ImgContext 转成可通过 Comlink 传输的调试数据，提前计算 getter */
// const toDebugImg = (img: ImgContext): ImgContext =>
//   ({
//     data: img.data,
//     width: img.width,
//     height: img.height,
//     url: img.url,
//     index: img.index,
//     version: img.version,
//     grayList: img.grayList,
//   }) as unknown as ImgContext;

export const recognitionImg = async (
  imgData: Uint8ClampedArray,
  data: Omit<ImgContextInput, 'imgData'>,
) => {
  await Promise.resolve();

  const img = new ImgContext({ imgData, ...data });
  // if (isDevMode) {
  //   await mainFn.showImage?.(img);
  //   img.logger.mark('调试数据渲染完成');
  // }

  if (data.option.pageFill || data.option.crop) {
    const blankMargin = getBlankMargin(img);
    mainFn.setImg({
      url: img.url,
      key: 'blankMargin',
      val: blankMargin,
      version: img.version,
    });
    if (blankMargin) mainFn.updatePageData();
  }

  if (data.option.background) {
    detectBackgroundRegions(img);
    const background = getBackground(img);
    mainFn.setImg({
      url: img.url,
      key: 'background',
      val: background,
      version: img.version,
    });
  }

  img.logger.logs.push([`${img.logger.totalTime.toFixed(2)}ms`, '总耗时']);
  mainFn.log?.(`${img.url}\n${img.logger.format()}`);
};
