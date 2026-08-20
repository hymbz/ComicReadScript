import { type State } from '../store';
import { type Dir, handleEndTurnPage } from './endPage';
import { withOptionalState } from './helper';
import { saveReadProgress } from './readProgress';

/** 翻页。返回是否成功改变了当前页数 */
export const turnPage = withOptionalState((dir: Dir, state: State) => {
  if (state.option.scrollMode.enabled) return false;

  if (handleEndTurnPage(dir, state)) return false;

  saveReadProgress();
  state.activePageIndex += dir === 'next' ? 1 : -1;
  return true;
});

/** 判断翻页方向 */
export const getTurnPageDir = (
  move: number,
  total: number,
  startTime?: number,
): Dir | undefined => {
  let dir: Dir | undefined;

  // 处理无关速度不考虑时间单纯根据当前滚动距离来判断的情况
  if (!startTime) {
    if (Math.abs(move) > total / 2) dir = move > 0 ? 'next' : 'prev';
    return dir;
  }

  // 滑动距离超过总长度三分之一判定翻页
  if (Math.abs(move) > total / 3) dir = move > 0 ? 'next' : 'prev';
  if (dir) return dir;

  // 滑动速度超过 0.4 判定翻页
  const velocity = move / (performance.now() - startTime);
  if (velocity < -0.4) dir = 'prev';
  if (velocity > 0.4) dir = 'next';

  return dir;
};
