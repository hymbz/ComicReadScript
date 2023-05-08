import type { Component, JSX } from 'solid-js';
import { mergeProps } from 'solid-js';

import classes, { css as style } from './index.module.css';

export const IconButtonStyle = style;

interface IconButtonProps {
  /** 文字提示 */
  tip?: string;
  /** 是否显示文字提示 */
  showTip?: boolean;
  /** 将文字提示移到左边 */
  placement?: 'left' | 'right';
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否启用 */
  enabled?: boolean;
  /** 自定义悬浮显示内容 */
  popper?: JSX.Element | boolean;

  popperClassName?: string | boolean;
  children?: JSX.Element;
  onClick?: (e: MouseEvent) => void;
}

/**
 * 图标按钮
 */
export const IconButton: Component<IconButtonProps> = (_props) => {
  const props = mergeProps({ placement: 'right' }, _props);
  let buttonRef: HTMLButtonElement;
  const handleClick = (e: MouseEvent) => {
    // 在每次点击后取消焦点
    buttonRef?.blur();
    props.onClick?.(e);
  };

  return (
    <div class={classes.iconButtonItem} data-show={props.showTip}>
      <button
        ref={buttonRef!}
        aria-label={props.tip}
        type="button"
        class={classes.iconButton}
        classList={{
          [classes.hidden]: props.hidden,
          [classes.enabled]: props.enabled,
        }}
        onClick={handleClick}
      >
        {props.children}
      </button>

      {props.popper || props.tip ? (
        <div
          class={[classes.iconButtonPopper, props.popperClassName].join(' ')}
          data-placement={props.placement}
        >
          {props.popper || props.tip}
        </div>
      ) : null}
    </div>
  );
};
