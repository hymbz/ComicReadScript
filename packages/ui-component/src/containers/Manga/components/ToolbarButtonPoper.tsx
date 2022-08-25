import type { MutableRefObject, CSSProperties } from 'react';
import { useRef, useState, forwardRef } from 'react';

export interface ToolbarBottonPoperProps {
  poper: Poper;
  anchorEl: MutableRefObject<HTMLButtonElement>;
  handleClickAway: Button['handleClickAway'];
}

const style: CSSProperties = {
  zIndex: 9,

  marginLeft: '1em',
};

export const ToolbarBottonPoper: React.FC<ToolbarBottonPoperProps> = ({
  poper,
  anchorEl,
  handleClickAway,
}) => {
  // const arrowRef = useRef() as MutableRefObject<HTMLDivElement>;
  const [arrowRef, setArrowRef] =
    useState<React.MutableRefObject<HTMLDivElement> | null>(null);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Popper
        id={poper.id}
        // style={style}
        // className="manga-MUI-MuiTooltip-popperArrow"
        open={poper.open}
        anchorEl={anchorEl.current}
        placement="right"
        modifiers={[
          {
            name: 'arrow',
            enabled: true,
            options: {
              element: arrowRef,
            },
          },
        ]}
        // TODO:添加回过度效果 Fade
        transition
        disablePortal
      >
        <div ref={setArrowRef} className="manga-MUI-MuiTooltip-arrow" />
        <Fade timeout={350}>{poper.children}</Fade>
      </Popper>
    </ClickAwayListener>
  );
};
ToolbarBottonPoper.displayName = 'ToolbarBottonPoper';
