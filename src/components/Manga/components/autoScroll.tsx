import MdPlayArrow from '@material-design-icons/svg/round/play_arrow.svg';
import MdStop from '@material-design-icons/svg/round/stop.svg';
import { createMemo } from 'solid-js';

import { AnimationFrame, createEffectOn, t } from 'helper';

import { IconButton } from '../../IconButton';
import {
  isAbreastMode,
  isBottom,
  isScrollMode,
  scrollProgress,
  scrollTo,
  scrollTop,
  switchAutoScroll,
  turnPage,
} from '../actions';
import { setState, store } from '../store';

const autoScroll = new (class extends AnimationFrame {
  /** 上次滚动的时间 */
  lastTime = 0;

  scroll = () => {
    if (store.show.endPage === 'end') {
      this.stop();
      if (store.option.autoScroll.triggerEnd) turnPage('next');
      return;
    }

    if (!store.option.scrollMode.enabled) turnPage('next');
    else if (isScrollMode())
      scrollTo(scrollTop() + store.option.autoScroll.distance, true);
    else if (isAbreastMode())
      scrollTo(
        scrollProgress() -
          (store.option.dir === 'rtl' ? -1 : 1) *
            store.option.autoScroll.distance,
        true,
      );

    if (!isBottom()) return;
    if (!store.prop.onExit) return this.stop();
    return setState('show', 'endPage', 'end');
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
    this.call();
  };

  start = () => {
    this.lastTime = 0;
    this.call();
  };

  stop = () => {
    this.cancel();
    setState('autoScroll', 'play', false);
  };
})();

createEffectOn(
  () => [...Object.values(store.option.autoScroll), store.autoScroll.play],
  () => {
    autoScroll.cancel();
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
    if (!store.autoScroll.play) return undefined;
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
