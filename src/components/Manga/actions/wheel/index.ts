import { setState, store } from '../../store';
import { type Dir, handleEndTurnPage } from '../endPage';
import { openScrollLock } from '../helper';
import { isAbreastMode, isScrollMode } from '../memo';
import { scrollBy } from '../scroll';
import { handleScrollModeZoom } from '../scrollMode';
import { stopAutoScroll } from '../switch';
import { finishTurnAnimation, turnPageAnimation } from '../turnPageAnimator';
import { zoom } from '../zoom';
import { detectScrollDevice } from './scrollDevice';
import { wheelRatchet } from './wheelRatchet';

let firstWheelTimer = 0;

/** A 类设备直接翻页，不经过虚拟棘轮 */
const turnPageByWheel = (dir: Dir) => {
  // 清空虚拟棘轮可能残留的累积滚动量
  wheelRatchet.wheelDy = 0;
  openScrollLock();
  turnPageAnimation(dir);
};

export const handleWheel = (e: WheelEvent) => {
  // 用户手动滚轮时，停止自动滚动
  stopAutoScroll();
  // 任何滚轮操作都先直接走完当前翻页动画，避免出现 bug
  finishTurnAnimation();

  e.stopPropagation();
  if (e.ctrlKey || e.altKey) e.preventDefault();

  const isWheelDown = e.deltaY > 0;
  const dir = isWheelDown ? 'next' : 'prev';
  const absDeltaY = Math.abs(e.deltaY);

  // 忽略滚动量为 0 的事件（如触摸板抬手）
  if (absDeltaY === 0) return;

  // 卷轴模式下的图片缩放
  if (
    (e.ctrlKey || e.altKey) &&
    store.option.scrollMode.enabled &&
    store.option.zoom.ratio === 100
  ) {
    e.preventDefault();
    return handleScrollModeZoom(isWheelDown ? 'sub' : 'add');
  }

  if (e.ctrlKey || e.altKey) {
    e.preventDefault();
    return zoom(store.option.zoom.ratio + (isWheelDown ? -25 : 25), e);
  }

  // 只有卷轴模式可以直接滚动网页
  if (!isScrollMode()) e.preventDefault();

  // 判定滚动设备类型
  detectScrollDevice(e);

  // 收到首次滚动事件时还无法确定设备类型，所以需要延迟一段时间看是否有后续事件
  // 无后续，说明是A类设备进行响应。有后续，则取消延迟继续判断
  if (store.scrollDeviceType === undefined) {
    firstWheelTimer = window.setTimeout(() => {
      // 延迟后依然没有后续事件，就是 A 类设备，补上响应
      setState('scrollDeviceType', 'a');
      turnPageByWheel(dir);
    }, 100);
  } else if (firstWheelTimer) {
    clearTimeout(firstWheelTimer);
    firstWheelTimer = 0;
  }

  // 过小的滚动量（如触摸板模拟出的惯性滚动）不触发结束页，但仍会累计棘轮进度
  if (absDeltaY >= 5 && handleEndTurnPage(dir)) {
    openScrollLock();
    return e.preventDefault();
  }

  // 并排卷轴模式下
  if (isAbreastMode() && store.option.zoom.ratio === 100) {
    e.preventDefault();
    scrollBy(e.deltaY, true);
  }

  if (store.option.scrollMode.enabled) return;

  // A 类设备直接按方向翻页
  if (store.scrollDeviceType === 'a') return turnPageByWheel(dir);

  return wheelRatchet.handleContinuousWheel(e);
};

export * from './wheelRatchet';
export * from './scrollDevice';
