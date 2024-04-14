import { approx } from 'helper';

import type { UseDrag } from '../hooks/useDrag';
import { refs } from '../store';

import { scrollTo } from './helper';
import { scrollTop } from './memo';

/** 摩擦系数 */
const FRICTION_COEFF = 0.96;

let lastTop = 0;
let dy = 0;
let animationId: number | null = null;
let lastTime: DOMHighResTimeStamp = 0;

/** 逐帧计算速率 */
const calcVelocity = () => {
  const nowTop = scrollTop();
  dy = nowTop - lastTop;
  lastTop = nowTop;
  animationId = requestAnimationFrame(calcVelocity);
};

/** 逐帧计算惯性滑动 */
const handleSlide = (timestamp: DOMHighResTimeStamp) => {
  // 当速率足够小时停止计算动画
  if (approx(dy, 0, 1)) {
    animationId = null;
    return;
  }

  // 确保每16毫秒才减少一次速率，防止在高刷新率显示器上衰减过快
  if (timestamp - lastTime > 16) {
    dy *= FRICTION_COEFF;
    lastTime = timestamp;
  }

  scrollTo(scrollTop() + dy);
  animationId = requestAnimationFrame(handleSlide);
};

let initTop = 0;

export const handleScrollModeDrag: UseDrag = (
  { type, xy: [, y], initial: [, iy] },
  e,
) => {
  if (e.pointerType !== 'mouse') return;
  switch (type) {
    case 'down': {
      if (animationId) cancelAnimationFrame(animationId);
      initTop = refs.mangaBox.scrollTop;
      requestAnimationFrame(calcVelocity);
      return;
    }

    case 'move': {
      scrollTo(initTop + iy - y);
      return;
    }

    case 'up': {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(handleSlide);
    }
  }
};
