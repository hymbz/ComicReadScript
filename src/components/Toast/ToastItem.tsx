import type { Component } from 'solid-js';

import MdCheckCircle from '@material-design-icons/svg/round/check_circle.svg';
import MdError from '@material-design-icons/svg/round/error.svg';
import MdInfo from '@material-design-icons/svg/round/info.svg';
import MdWarning from '@material-design-icons/svg/round/warning.svg';
import { createEffect, createMemo, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import type { Toast } from '.';

import classes from './index.module.css';
import { dismiss, setState } from './store';

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
    state.map[id]?.onDismiss?.({ ...state.map[id] });
    const i = state.list.indexOf(id);
    if (i !== -1) state.list.splice(i, 1);
    Reflect.deleteProperty(state.map, id);
  });

/** 重置 toast 的 update 属性 */
const resetToastUpdate = (id: string) =>
  setState('map', id, 'update', undefined);

export const ToastItem: Component<Toast> = (props) => {
  /** 是否要显示进度 */
  const showSchedule = createMemo(() =>
    props.duration === Number.POSITIVE_INFINITY && props.schedule
      ? true
      : undefined,
  );

  const _dismiss = (e: AnimationEvent | MouseEvent) => {
    e.stopPropagation();
    if (showSchedule() && 'animationName' in e) return;
    dismiss(props.id);
  };

  // 在退出动画结束后才真的删除
  const handleAnimationEnd = () => {
    if (!props.exit) return;
    dismissToast(props.id);
  };

  let scheduleRef!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  createEffect(() => {
    if (!props.update) return;
    resetToastUpdate(props.id);
    if (!scheduleRef) return;
    for (const animation of scheduleRef.getAnimations())
      animation.currentTime = 0;
  });

  const handleClick: EventHandler['on:click'] = (e) => {
    props.onClick?.();
    _dismiss(e);
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
      <Show
        when={
          props.duration !== Number.POSITIVE_INFINITY ||
          props.schedule !== undefined
        }
      >
        <div
          ref={scheduleRef}
          class={classes.schedule}
          style={{
            'animation-duration': `${props.duration}ms`,
            transform: showSchedule() ? `scaleX(${props.schedule})` : undefined,
          }}
          onAnimationEnd={_dismiss}
        />
      </Show>
    </div>
  );
};
