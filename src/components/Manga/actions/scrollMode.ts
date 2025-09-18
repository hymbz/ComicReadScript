import { clamp, createRootMemo } from 'helper';

import { store } from '../store';
import { setOption } from './helper';
import { isAbreastMode } from './memo';
import { saveScrollProgress } from './scroll';

/** 修改卷轴模式下图片的目标宽度 */
export const setAdjustToWidth = (
  val: number | ((oldVal: number) => number),
) => {
  if (typeof store.option.scrollMode.adjustToWidth !== 'number') return;

  if (typeof val === 'function')
    val = val(store.option.scrollMode.adjustToWidth);
  if (Number.isNaN(val)) return;

  setOption((draftOption) => {
    const max = Math.ceil(store.rootSize.width);
    draftOption.scrollMode.adjustToWidth = clamp(200, val, max);
  });
};

const minImgWidth = createRootMemo(() => {
  let min = Number.POSITIVE_INFINITY;
  for (const img of Object.values(store.imgMap))
    if (img.width && img.width < min) min = img.width;
  return min;
});

/** 在卷轴模式下进行缩放，并且保持滚动进度不变 */
export const setImgScale = (val: number | ((oldVal: number) => number)) => {
  if (typeof val === 'function') val = val(store.option.scrollMode.imgScale);
  if (Number.isNaN(val)) return;

  const jump = saveScrollProgress();
  setOption((draftOption) => {
    val = clamp(0.1, val as number, 3);

    // 如果当前最小图片宽度大于视窗宽度，并且这次操作是在调小缩放值
    // 那就将这次操作改为：将缩放值修改为只要缩小一点就会立刻让图片变小的极限值
    // 避免用户需要多次调小缩放值才能看到效果的情况
    // https://github.com/hymbz/ComicReadScript/issues/285
    if (
      minImgWidth() > store.rootSize.width &&
      val < draftOption.scrollMode.imgScale
    ) {
      const maxImgScale = store.rootSize.width / minImgWidth();
      if (val > maxImgScale) val = maxImgScale;
    }

    draftOption.scrollMode.imgScale = clamp(0.1, Number(val.toFixed(2)), 3);
  });
  jump();

  // 并排卷轴模式下并没有一个明确直观的滚动进度，
  // 也想不出有什么实现效果能和普通卷轴模式的效果一致,
  // 所以就摆烂不管了，反正现在这样也已经能避免乱跳了
};

/** 处理卷轴模式下的放大/缩小操作 */
export const handleScrollModeZoom = (dir: 'add' | 'sub') => {
  if (!store.option.scrollMode.enabled) return;
  if (store.option.scrollMode.adjustToWidth === 'full') return;

  if (store.option.scrollMode.adjustToWidth === 'disable' || isAbreastMode())
    setImgScale(0.05 * (dir === 'add' ? 1 : -1));
  else setAdjustToWidth((val) => val + 100 * (dir === 'add' ? 1 : -1));
};
