import type { MouseEventHandler, MutableRefObject } from 'react';
import { memo, useRef } from 'react';
import clsx from 'clsx';

import classes from './index.module.css';

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
  children?: JSX.Element | JSX.Element[];
  ref?: MutableRefObject<HTMLButtonElement | null>;
  onClick?: MouseEventHandler<HTMLButtonElement> | null;
}

/**
 * 图标按钮
 *
 * @param param param
 */
export const IconButton: React.FC<IconButtonProps> = memo(
  ({
    children,
    tip,
    hidden,
    enabled,
    ref,
    showTip,
    placement = 'right',
    popper,
    popperClassName,
    onClick,
  }) => {
    const buttonRef = useRef(ref?.current ?? null);
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      // 在每次点击后取消焦点
      buttonRef.current?.blur();
      return onClick?.(e);
    };

    return (
      <div className={classes.iconButtonItem} data-show={showTip}>
        <button
          ref={buttonRef}
          aria-label={tip}
          type="button"
          className={clsx(
            classes.iconButton,
            { [classes.hidden]: hidden },
            enabled && classes.enabled,
          )}
          onClick={handleClick}
        >
          {children}
        </button>

        {popper || tip ? (
          <div
            className={clsx(classes.iconButtonPopper, popperClassName)}
            data-placement={placement}
          >
            {popper || tip}
          </div>
        ) : null}
      </div>
    );
  },
);
