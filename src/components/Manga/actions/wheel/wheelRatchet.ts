import { createRootMemo, debounce, throttle } from 'helper';

import { type State, setState, store } from '../../store';
import { openScrollLock } from '../helper';
import { resetPage } from '../show';
import { turnPage } from '../turnPage';

/** 虚拟棘轮步长 */
const wheelStepLength = createRootMemo(() => {
  switch (store.scrollDeviceType) {
    case 'a':
    case 'b':
      return 120;
    case 'c':
      return 360;

    case undefined:
      // 未确定时步长为无限大，避免触发翻页
      return Infinity;
  }
});

export const wheelRatchet = new (class {
  /** 带方向的累计滚动量，正数表示向下滚动 */
  wheelDy = 0;

  /** 按当前步长处理累计滚动量进行翻页 */
  processWheel = (state: State) => {
    const step = wheelStepLength();
    while (this.wheelDy <= -step) {
      if (!turnPage('next', state)) {
        this.wheelDy = -step;
        break;
      }
      this.wheelDy += step;
    }
    while (this.wheelDy >= step) {
      if (!turnPage('prev', state)) {
        this.wheelDy = step;
        break;
      }
      this.wheelDy -= step;
    }

    state.wheelProgress = -this.wheelDy / step;
    resetPage(state);
  };

  // 节流合并高频滚动事件
  processWheelThrottled = throttle(() => setState(this.processWheel), 16);

  /** 停止滚动一段时间后重置状态 */
  handleWheelEnd = debounce(() => {
    this.wheelDy = 0;
    setState('wheelProgress', 0);
  }, 300);

  /** 处理滚动产生的连续位移，通过虚拟棘轮（累计满一个步长）实现翻页 */
  handleContinuousWheel(e: WheelEvent) {
    if (store.option.scrollMode.enabled) return;

    openScrollLock();
    this.wheelDy += Math.floor(-e.deltaY);
    this.processWheelThrottled();
    this.handleWheelEnd();
  }
})();
