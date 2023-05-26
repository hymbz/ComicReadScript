import MdCheckCircle from '@material-design-icons/svg/round/check_circle.svg';
import MdWarning from '@material-design-icons/svg/round/warning.svg';
import MdError from '@material-design-icons/svg/round/error.svg';
import MdInfo from '@material-design-icons/svg/round/info.svg';

import type { Component } from 'solid-js';
import { createEffect, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { setState } from './helper';

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
  setState((state) => {
    Reflect.deleteProperty(state.map[id], 'update');
  });

export const ToastItem: Component<Toast> = (props) => {
  const dismiss = (e: Event) => {
    e.stopPropagation();
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
    scheduleRef.getAnimations().forEach((animation) => {
      animation.cancel();
      animation.play();
    });
  });

  return (
    <div
      class={classes.item}
      style={{ '--theme': colorMap[props.type] }}
      data-exit={props.exit}
      onClick={dismiss}
      onAnimationEnd={handleAnimationEnd}
    >
      <Dynamic component={iconMap[props.type]} />
      <div class={classes.msg}>
        {typeof props.msg === 'string' ? props.msg : <props.msg />}
      </div>
      <Show when={props.duration !== Infinity}>
        <div
          ref={scheduleRef!}
          class={classes.schedule}
          style={{ 'animation-duration': `${props.duration}ms` }}
          onAnimationEnd={dismiss}
        />
      </Show>
    </div>
  );
};
