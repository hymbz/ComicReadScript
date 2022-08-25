import type { MouseEventHandler } from 'react';
import { useRef, useMemo } from 'react';
import clsx from 'clsx';

interface ToolbarButtonProps {
  /** 按钮描述文本 */
  buttonKey: string;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 是否启用 */
  enable?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: JSX.Element;
}

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  children,
  buttonKey,
  hidden,
  enable,
  onClick,
}) => {
  const ref = useRef() as React.MutableRefObject<HTMLButtonElement>;
  const ariaLabel = useMemo(() => `工具栏按钮-${buttonKey}`, [buttonKey]);
  const className = useMemo(
    () =>
      clsx(
        'w-1.5em h-1.5em text-1.5em m-1 flex items-center justify-center rounded-full p-0 border-none outline-none cursor-pointer ripple',
        { hidden },
        enable
          ? 'text-[var(--enableButtonColor)] bg-[var(--enableButtonBgColor)] hover:bg-[var(--enableButtonHoverBgColor)] focus:bg-[var(--enableButtonHoverBgColor)]'
          : 'text-[var(--buttonColor)] bg-[var(--buttonBgColor)] hover:bg-[var(--buttonHoverBgColor)] focus:bg-[var(--buttonHoverBgColor)]',
      ),
    [hidden, enable],
  );

  return (
    <>
      <button
        ref={ref}
        aria-label={ariaLabel}
        type="button"
        className={className}
        onClick={onClick}
      >
        {children}
      </button>

      <style type="text/css">{`
        @unocss-placeholder;
      `}</style>
    </>
  );
};
