import MdCheckCircle from '@material-design-icons/svg/round/check_circle.svg';
import MdWarning from '@material-design-icons/svg/round/warning.svg';
import MdError from '@material-design-icons/svg/round/error.svg';
import MdInfo from '@material-design-icons/svg/round/info.svg';

import type { Component } from 'solid-js';
import { createEffect, createMemo, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { _setState, setState } from './store';

import type { Toast } from '.';
import { toast } from './toast';

import classes from './index.module.css';

const iconMap = {
  info: MdInfo,
  success: MdCheckCircle,
  warn: MdWarning,
  error: MdError,
};

const colorMap = {
  info: '#3a97d7',
  success: '#23bb35',
  warn: '#f0c53e',
  error: '#e45042',
  custom: '#1f2936',
};

/** 删除 toast */
const dismissToast = (id: string) =>
  setState((state) => {
    state.map[id].onDismiss?.({ ...state.map[id] });
    const i = state.list.findIndex((t) => t === id);
    if (i !== -1) state.list.splice(i, 1);
    Reflect.deleteProperty(state.map, id);
  });

/** 重置 toast 的 update 属性 */
const resetToastUpdate = (id: string) =>
  _setState('map', id, 'update', undefined);

export const ToastItem: Component<Toast> = (props) => {
  /** 是否要显示进度 */
  const showSchedule = createMemo(() =>
    props.duration === Infinity && props.schedule ? true : undefined,
  );

  const dismiss = (e: AnimationEvent | MouseEvent) => {
    e.stopPropagation();
    if (showSchedule() && 'animationName' in e) return;
    toast.dismiss(props.id);
  };

  // 在退出动画结束后才真的删除
  const handleAnimationEnd = () => {
    if (!props.exit) return;
    dismissToast(props.id);
  };

  let scheduleRef: HTMLDivElement;
  createEffect(() => {
    if (!props.update) return;

    resetToastUpdate(props.id);
    scheduleRef?.getAnimations().forEach((animation) => {
      animation.cancel();
      animation.play();
    });
  });

  const handleClick: EventHandler['on:click'] = (e) => {
    props.onClick?.();
    dismiss(e);
  };

  return (
    <div
      class={classes.item}
      style={{ '--theme': colorMap[props.type] }}
      data-schedule={showSchedule()}
      data-exit={props.exit}
      on:click={handleClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <Dynamic component={iconMap[props.type]} />
      <div class={classes.msg}>
        {typeof props.msg === 'string' ? props.msg : <props.msg />}
      </div>
      <Show when={props.duration !== Infinity || props.schedule !== undefined}>
        <div
          ref={scheduleRef!}
          class={classes.schedule}
          style={{
            'animation-duration': `${props.duration}ms`,
            transform: showSchedule() ? `scaleX(${props.schedule})` : undefined,
          }}
          onAnimationEnd={dismiss}
        />
      </Show>
    </div>
  );
};
