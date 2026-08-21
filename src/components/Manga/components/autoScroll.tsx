import MdPlayArrow from '@material-design-icons/svg/round/play_arrow.svg';
import MdStop from '@material-design-icons/svg/round/stop.svg';
import { AnimationFrame, createEffectOn, t } from 'helper';
import { createMemo } from 'solid-js';

import { IconButton } from '../../IconButton';
import {
  constantScroll,
  handleEndTurnPage,
  isBottom,
  isScrollMode,
  scrollBy,
  switchAutoScroll,
  turnPageAnimation,
} from '../actions';
import { setState, store } from '../store';

/** 自动滚动最低速度（px/ms），避免 distance 为 0 或异常配置导致卡住 */
const MIN_AUTO_SCROLL_SPEED = 10 / 1000;

const autoScrollSpeed = () => {
  const { interval, distance } = store.option.autoScroll;
  if (interval <= 0 || distance <= 0) return MIN_AUTO_SCROLL_SPEED;
  return Math.max(MIN_AUTO_SCROLL_SPEED, distance / interval);
};

const autoScroll = new (class extends AnimationFrame {
  /** 上次滚动的时间 */
  lastTime = 0;

  scrollEnd = () => {
    this.stop();
    if (!store.prop.onExit) return;
    setState('show', 'endPage', 'end');
    if (store.option.autoScroll.triggerEnd)
      setTimeout(handleEndTurnPage, 500, 'next');
  };

  scroll = () => {
    if (isBottom()) return this.scrollEnd();

    if (isScrollMode())
      return scrollBy(Math.max(1, store.option.autoScroll.distance), true);
    return turnPageAnimation('next');
  };

  frame = (timestamp: DOMHighResTimeStamp) => {
    const elapsed = timestamp - this.lastTime;
    let progress: number;
    if (elapsed >= store.option.autoScroll.interval) {
      this.lastTime = timestamp;
      this.scroll();
      progress = 1;
    }
    if (!store.autoScroll.play) return;

    progress ||= elapsed / store.option.autoScroll.interval;
    setState('autoScroll', 'progress', progress);
    this.call(true);
  };

  start = () => {
    this.lastTime = 0;

    if (!store.option.autoScroll.continuous || !isScrollMode())
      return this.call();

    // 开启了持续滚动的话，改用 constantScroll 来滚动页面
    constantScroll.start(autoScrollSpeed(), (delta) => {
      if (isBottom()) {
        this.scrollEnd();
        return false;
      }

      const { distance } = store.option.autoScroll;
      if (distance > 0)
        setState(
          'autoScroll',
          'progress',
          (store.autoScroll.progress + delta / distance) % 1,
        );
    });
  };

  stop = () => {
    this.cancel();
    constantScroll.cancel();
    setState('autoScroll', 'play', false);
  };
})();

// 每次配置变化后都按最新状态重新开始
createEffectOn(
  () => [
    ...Object.values(store.option.autoScroll),
    store.autoScroll.play,
    isScrollMode(),
  ],
  () => {
    autoScroll.cancel();
    constantScroll.cancel();
    if (!store.option.autoScroll.enabled || !store.autoScroll.play) return;
    autoScroll.start();
  },
);

// 点击屏幕中间停止自动滚动
createEffectOn(
  () => store.show.toolbar,
  (show) => show && autoScroll.stop(),
);

export const AutoScrollButton = () => {
  const background = createMemo(() => {
    if (!store.autoScroll.play) return;
    const deg = (store.autoScroll.progress * 360) % 360;
    return `conic-gradient(var(--text-secondary) 0deg, var(--text-secondary) ${deg}deg, var(--text) ${deg}deg)`;
  });

  return (
    <IconButton
      tip={t('button.auto_scroll')}
      enabled={store.autoScroll.play}
      style={{ background: background() }}
      onClick={switchAutoScroll}
      children={store.autoScroll.play ? <MdStop /> : <MdPlayArrow />}
    />
  );
};
