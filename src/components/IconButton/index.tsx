import { type Component, type JSX, mergeProps } from 'solid-js';
import { useStyle } from 'helper';

import classes, { css as style } from './index.module.css';

interface IconButtonProps {
  /** 文字提示 */
  tip?: string;
  /** 是否显示文字提示 */
  showTip?: boolean;
  /** 文字提示位置 */
  placement?: 'left' | 'right';
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否启用 */
  enabled?: boolean;
  /** 是否禁用 */
  disable?: boolean;
  /** 自定义悬浮显示内容 */
  popper?: JSX.Element;

  popperClassName?: string | boolean;
  children?: JSX.Element;
  onClick?: EventHandler['on:click'];
}

/** 图标按钮 */
export const IconButton: Component<IconButtonProps> = (_props) => {
  const props = mergeProps({ placement: 'right' }, _props);
  let buttonRef!: HTMLButtonElement;
  const handleClick: EventHandler['on:click'] = (e) => {
    if (props.disable) return;
    (props.onClick as JSX.EventHandler<HTMLElement, MouseEvent>)?.(e);
    // 在每次点击后取消焦点
    buttonRef?.blur();
  };

  return (
    <div
      ref={(ref) => useStyle(style, ref)}
      class={classes.iconButtonItem}
      data-show={props.showTip}
    >
      <button
        ref={buttonRef}
        aria-label={props.tip}
        type="button"
        class={classes.iconButton}
        classList={{
          [classes.hidden]: props.hidden,
          [classes.enabled]: props.enabled,
          [classes.disable]: props.disable,
        }}
        tabIndex={0}
        on:click={handleClick}
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
