import type { UseDrag } from 'helper';

import { refs, store } from '../store';

import { scrollTop } from './memo';
import { abreastScrollFill, setAbreastScrollFill } from './abreastScroll';
import { scrollTo } from './scroll';
import { saveReadProgress } from './readProgress';

/** 摩擦系数 */
const FRICTION_COEFF = 0.96;

let lastTop = 0;
let dy = 0;
let lastLeft = 0;
let dx = 0;
let animationId: number | null = null;
let lastTime: DOMHighResTimeStamp = 0;

/** 逐帧计算速率 */
const calcVelocity = () => {
  const nowTop = store.option.scrollMode.abreastMode
    ? abreastScrollFill()
    : scrollTop();
  dy = nowTop - lastTop;
  lastTop = nowTop;
  dx = store.page.offset.x.px - lastLeft;
  lastLeft = store.page.offset.x.px;
  animationId = requestAnimationFrame(calcVelocity);
};

/** 逐帧计算惯性滑动 */
const handleSlide = (timestamp: DOMHighResTimeStamp) => {
  // 当速率足够小时停止计算动画
  if (Math.abs(dx) + Math.abs(dy) < 1) {
    animationId = null;
    return;
  }

  // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
  if (timestamp - lastTime > 16) {
    dy *= FRICTION_COEFF;
    dx *= FRICTION_COEFF;
    lastTime = timestamp;
  }

  if (store.option.scrollMode.abreastMode) {
    scrollTo(scrollTop() + dx);
    setAbreastScrollFill(abreastScrollFill() + dy);
  } else scrollTo(scrollTop() + dy);
  animationId = requestAnimationFrame(handleSlide);
};

let initTop = 0;
let initLeft = 0;
let initAbreastScrollFill = 0;

export const handleScrollModeDrag: UseDrag = ({
  type,
  xy: [x, y],
  initial: [ix, iy],
}) => {
  switch (type) {
    case 'down': {
      if (animationId) cancelAnimationFrame(animationId);
      initTop = refs.mangaBox.scrollTop;
      initLeft = store.page.offset.x.px * (store.option.dir === 'rtl' ? 1 : -1);
      initAbreastScrollFill = abreastScrollFill();
      requestAnimationFrame(calcVelocity);
      return;
    }

    case 'move': {
      if (store.option.scrollMode.abreastMode) {
        const _dx = x - ix;
        const _dy = y - iy;

        scrollTo((initLeft + _dx) * (store.option.dir === 'rtl' ? 1 : -1));
        setAbreastScrollFill(initAbreastScrollFill + _dy);
      } else scrollTo(initTop + iy - y);
      return;
    }

    case 'up': {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(handleSlide);
      saveReadProgress();
    }
  }
};
