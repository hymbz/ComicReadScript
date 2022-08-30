import type { MouseEventHandler, MutableRefObject } from 'react';
import { useRef, useMemo } from 'react';
import clsx from 'clsx';
import { useHover } from '../hooks/useHover';
import { useFocus } from '../hooks/useFocus';

interface ToolbarButtonProps {
  /** 按钮描述文本 */
  buttonKey: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否启用 */
  enable?: boolean;
  /** 是否显示文字提示 */
  showTip?: boolean;
  /** 自定义悬浮显示内容 */
  popper?: JSX.Element | boolean;

  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
  ref?: MutableRefObject<HTMLButtonElement | null>;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  children,
  buttonKey,
  hidden,
  enable,
  ref,
  showTip,
  popper,
  onClick,
}) => {
  const buttonRef = useRef(ref?.current ?? null);
  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // 在每次点击后取消焦点
    buttonRef.current?.blur();
    return onClick?.(e);
  };

  const ariaLabel = useMemo(() => `工具栏按钮-${buttonKey}`, [buttonKey]);

  const [isHover, handlerMouseEnter, handlerMouseLeave] = useHover();
  const [isFocus, handleFocus, handleBlur] = useFocus();

  const opacityStyile = useMemo(
    () => ({
      opacity: showTip || isHover || isFocus ? 1 : 0,
    }),
    [isFocus, isHover, showTip],
  );

  return (
    <div className="flex relative items-center">
      <button
        ref={buttonRef}
        aria-label={ariaLabel}
        type="button"
        className={clsx(
          'w-1.5em h-1.5em text-1.5em ripple flex m-1 cursor-pointer items-center justify-center rounded-full border-none p-0 outline-none',
          { hidden },
          enable
            ? 'text-[var(--enableButtonColor)] bg-[var(--enableButtonBgColor)] hover:bg-[var(--enableButtonHoverBgColor)] focus:bg-[var(--enableButtonHoverBgColor)]'
            : 'text-[var(--buttonColor)] bg-[var(--buttonBgColor)] hover:bg-[var(--buttonHoverBgColor)] focus:bg-[var(--buttonHoverBgColor)]',
        )}
        onClick={handleClick}
        onMouseEnter={handlerMouseEnter}
        onMouseLeave={handlerMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </button>

      <span
        className="arrow bg-[var(--buttonHoverBgColor)] transition-opacity duration-150"
        style={opacityStyile}
      />

      <div
        className="ml-.3em h-0 transition-opacity duration-150"
        style={opacityStyile}
      >
        {popper || (
          <div className="text-.8em text-[var(--buttonColor)] bg-[var(--buttonHoverBgColor)] rounded-.3em p-.5em card-shadow -translate-y-1/2 whitespace-nowrap">
            {' '}
            {buttonKey}{' '}
          </div>
        )}
      </div>

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </div>
  );
};
