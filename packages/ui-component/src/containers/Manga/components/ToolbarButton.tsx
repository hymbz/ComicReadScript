import type { MouseEventHandler, MutableRefObject } from 'react';
import { memo, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { useHover } from '../hooks/useHover';
import { useFocus } from '../hooks/useFocus';

import classes from '../index.module.css';

interface ToolbarButtonProps {
  /** 按钮描述文本 */
  buttonKey: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否启用 */
  enabled?: boolean;
  /** 是否显示文字提示 */
  showTip?: boolean;
  /** 自定义悬浮显示内容 */
  popper?: JSX.Element | boolean;

  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
  ref?: MutableRefObject<HTMLButtonElement | null>;
}

/**
 * 工具栏按钮
 *
 * @param param param
 */
export const ToolbarButton: React.FC<ToolbarButtonProps> = memo(
  ({ children, buttonKey, hidden, enabled, ref, showTip, popper, onClick }) => {
    const buttonRef = useRef(ref?.current ?? null);
    const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      // 在每次点击后取消焦点
      buttonRef.current?.blur();
      return onClick?.(e);
    };

    const ariaLabel = useMemo(() => `工具栏按钮-${buttonKey}`, [buttonKey]);

    const [isHover, handlerMouseEnter, handlerMouseLeave] = useHover();
    const [isFocus, handleFocus, handleBlur] = useFocus();

    return (
      <div className={classes.toolbarButtonItem}>
        <button
          ref={buttonRef}
          aria-label={ariaLabel}
          type="button"
          className={clsx(
            classes.toolbarButton,
            { [classes.hidden]: hidden },
            enabled && classes.enabled,
          )}
          onClick={handleClick}
          onMouseEnter={handlerMouseEnter}
          onMouseLeave={handlerMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {children}
        </button>

        {popper || (
          <div
            className={clsx(
              classes.toolbarButtonPopper,
              isHover || showTip || isFocus
                ? classes.opacity1
                : classes.opacity0,
            )}
          >
            {buttonKey}
          </div>
        )}
      </div>
    );
  },
);
