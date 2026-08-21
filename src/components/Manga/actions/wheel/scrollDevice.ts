import { setState, store } from '../../store';
import { type ScrollDeviceType } from '../../store/other';

/** 判断两个数值是否成整数倍 */
const isMultipleOf = (a: number, b: number) => (a < b ? b % a : a % b) === 0;

/** C 类设备下连续出现成倍滚动量的次数，达到阈值才允许切换为 A/B 类 */
let consecutiveMultiple = 0;

let lastDelta = Infinity;

/** 根据传入的滚动事件判定滚动设备类型 */
export const detectScrollDevice = (e: WheelEvent) => {
  // 横向、竖向滚轮都参与设备类型判定，取最大滚动量
  const absDelta = Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY));
  let type: ScrollDeviceType | undefined;

  // deltaMode 不是像素单位时必然是 A 类滚轮
  if (e.deltaMode !== 0) type = 'a';
  // macOS 触摸板事件带 phase 属性，而鼠标滚轮没有
  else if ((e as WheelEvent & { phase?: unknown }).phase !== undefined)
    type = 'c';
  // 过小的滚动量只有 C 类才会出现
  else if (absDelta < 10 || lastDelta < 10) type = 'c';

  // 首次事件缺少上次滚动量，无法进行整数倍判断，直接跳过
  else if (lastDelta === Infinity) type = undefined;
  // 成整数倍是滚轮
  else if (isMultipleOf(lastDelta, absDelta)) {
    // 当前是 C 类时需计数，连续多次都成倍才能切换到 A/B 类
    if (store.scrollDeviceType === 'c' && ++consecutiveMultiple < 3)
      type = undefined;
    else {
      consecutiveMultiple = 0;
      // 根据滚动量大小区分 A/B 类
      type = Math.max(lastDelta, absDelta) >= 40 ? 'a' : 'b';
    }
  }
  // 不成倍则是 C 类
  else type = 'c';

  if (type === 'c') consecutiveMultiple = 0;

  lastDelta = absDelta;
  if (type) setState('scrollDeviceType', type);
};
