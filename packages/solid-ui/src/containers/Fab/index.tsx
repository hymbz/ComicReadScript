import type { Component, JSX } from 'solid-js';
import {
  For,
  onCleanup,
  onMount,
  createEffect,
  createSignal,
  mergeProps,
} from 'solid-js';

import { throttle } from 'throttle-debounce';

import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import classes from './index.module.css';

export interface FabProps {
  /** 百分比进度值，小数 */
  progress?: number;
  /** 提示文本 */
  tip?: string;
  /** 快速拨号按钮 */
  speedDial?: Component[];
  /** 是否显示。为空时将会根据滚动自动显隐 */
  show?: boolean;
  /** 初始时是否显示 */
  initialShow?: boolean;
  /** 是否自动半透明化 */
  autoTrans?: boolean;
  /** 是否保持聚焦状态 */
  focus?: boolean;

  children?: JSX.Element;
  style?: JSX.CSSProperties;
  onClick?: () => void;
  onBackdropClick?: () => void;
}

/**
 * Fab 按钮
 */
export const Fab: Component<FabProps> = (_props) => {
  const props = mergeProps(
    { progress: 0, initialShow: true, autoTrans: false },
    _props,
  );

  // 上次滚动位置
  let lastY = window.pageYOffset;
  const [show, setShow] = createSignal(props.initialShow);

  // 绑定滚动事件
  const handleScroll = throttle(200, (e: Event) => {
    // 跳过非用户操作的滚动
    if (e.isTrusted === false) return;
    if (window.pageYOffset === lastY) return;
    setShow(
      // 滚动到底部时显示
      window.pageYOffset + window.innerHeight >= document.body.scrollHeight ||
        // 向上滚动时显示，反之隐藏
        window.pageYOffset - lastY < 0,
    );
    lastY = window.pageYOffset;
  });
  onMount(() => window.addEventListener('scroll', handleScroll));
  onCleanup(() => window.removeEventListener('scroll', handleScroll));

  // 将 forceShow 的变化同步到 show 上
  createEffect(() => {
    if (props.show) setShow(props.show);
  });

  const handleClick = () => {
    props.onClick?.();
  };

  const handleBackdropClick = () => {
    props.onBackdropClick?.();
  };

  return (
    <div
      class={classes.fabRoot}
      style={props.style}
      data-show={props.show ?? show()}
      data-trans={props.autoTrans}
      data-focus={props.focus}
    >
      <button type="button" class={classes.fab} onClick={handleClick}>
        {props.children ?? <MdMenuBook />}

        {/* 环形进度条 */}
        <span
          class={classes.progress}
          role="progressbar"
          aria-valuenow={props.progress}
        >
          <svg
            viewBox="22 22 44 44"
            style={{ 'stroke-dashoffset': `${(1 - props.progress) * 290}%` }}
          >
            <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6" />
          </svg>
        </span>

        {props.tip ? <div class={classes.popper}>{props.tip}</div> : null}
      </button>

      {/* 快捷操作栏 */}
      {props.speedDial?.length ? (
        <div class={classes.speedDial}>
          <div class={classes.backdrop} onClick={handleBackdropClick} />
          <For each={props.speedDial}>
            {(SpeedDialItem, i) => (
              <div
                class={classes.speedDialItem}
                style={
                  {
                    '--show-delay': `${i() * 30}ms`,
                    '--hide-delay': `${
                      (props.speedDial!.length - 1 - i()) * 50
                    }ms`,
                  } as JSX.CSSProperties
                }
                data-i={i() * 30}
              >
                <SpeedDialItem />
              </div>
            )}
          </For>
        </div>
      ) : null}
    </div>
  );
};
