import { AnimationFrame, type UseDrag } from 'helper';

import { refs, store } from '../store';
import { abreastScrollFill, scrollTop, setAbreastScrollFill } from './memo';
import { saveReadProgress } from './readProgress';
import { scrollTo } from './scroll';

/** 摩擦系数 */
const FRICTION_COEFF = 0.96;

const calcVelocityAnim = new (class extends AnimationFrame {
  lastTop = 0;
  dy = 0;
  lastLeft = 0;
  dx = 0;

  frame = () => {
    const nowTop = store.option.scrollMode.abreastMode
      ? abreastScrollFill()
      : scrollTop();
    this.dy = nowTop - this.lastTop;
    this.lastTop = nowTop;
    this.dx = store.page.offset.x.px - this.lastLeft;
    this.lastLeft = store.page.offset.x.px;
    this.call(true);
  };
})();

const slideAnim = new (class extends AnimationFrame {
  lastTime: DOMHighResTimeStamp = 0;

  frame = (timestamp: DOMHighResTimeStamp) => {
    if (Math.abs(calcVelocityAnim.dx) + Math.abs(calcVelocityAnim.dy) < 1) {
      this.animationId = 0;
      return;
    }

    if (timestamp - this.lastTime > 16) {
      calcVelocityAnim.dy *= FRICTION_COEFF;
      calcVelocityAnim.dx *= FRICTION_COEFF;
      this.lastTime = timestamp;
    }

    if (store.option.scrollMode.abreastMode) {
      scrollTo(scrollTop() + calcVelocityAnim.dx);
      setAbreastScrollFill(abreastScrollFill() + calcVelocityAnim.dy);
    } else scrollTo(scrollTop() + calcVelocityAnim.dy);
    this.call(true);
  };
})();

let initTop = 0;
let initLeft = 0;
let initAbreastScrollFill = 0;

export const handleScrollModeDrag: UseDrag = (
  { type, xy: [x, y], initial: [ix, iy], startTime },
  e,
) => {
  if (!store.option.scrollMode.abreastMode && e.pointerType !== 'mouse') return;
  switch (type) {
    case 'down': {
      calcVelocityAnim.cancel();
      slideAnim.cancel();
      initTop = refs.mangaBox.scrollTop;
      initLeft = store.page.offset.x.px * (store.option.dir === 'rtl' ? 1 : -1);
      initAbreastScrollFill = abreastScrollFill();
      calcVelocityAnim.call();
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
      calcVelocityAnim.cancel();
      if (performance.now() - startTime < 50) return;
      slideAnim.call();
      saveReadProgress();
    }
  }
};
