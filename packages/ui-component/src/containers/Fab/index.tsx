import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';

import type { CSSProperties, MouseEventHandler } from 'react';
import { useRef, useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

import classes from './index.module.css';
import { Progress } from './Progress';

export interface FabProps {
  /** 百分比进度值，小数 */
  progress?: number;
  /** 提示文本 */
  tip?: string;
  /** 快速拨号按钮 */
  speedDial?: React.FC[];

  children?: JSX.Element | JSX.Element[];
  style?: CSSProperties;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Fab 按钮
 *
 * @param props
 */
export const Fab: React.FC<FabProps> = ({
  progress = 0,
  tip,
  speedDial,
  children,
  style,
  onClick,
}) => {
  // 上次滚动位置
  const lastY = useRef(window.scrollY);
  const [show, setShow] = useState(true);

  // 绑定滚动事件
  useEffect(() => {
    window.addEventListener(
      'scroll',
      throttle(200, () => {
        setShow(window.scrollY - lastY.current < 0);
        lastY.current = window.scrollY;
      }),
    );
  }, []);

  return (
    <div className={classes.fabRoot} style={style} data-show={progress || show}>
      <button type="button" className={classes.fab} onClick={onClick}>
        {children ?? <MdMenuBook />}
        <Progress value={progress} />
        {tip ? <div className={classes.popper}>{tip}</div> : null}
      </button>

      {speedDial?.length ? (
        <div className={classes.speedDial}>
          <div className={classes.backdrop} />
          {speedDial?.map((SpeedDialItem, i) => (
            <div
              className={classes.speedDialItem}
              style={
                {
                  '--show-delay': `${i * 30}ms`,
                  '--hide-delay': `${(speedDial.length - 1 - i) * 50}ms`,
                } as CSSProperties
              }
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              data-i={i * 30}
            >
              <SpeedDialItem />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
