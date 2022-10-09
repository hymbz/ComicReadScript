import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';

import type { MouseEventHandler } from 'react';
import { useRef, useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

import classes from './index.module.css';
import { Progress } from './Progress';

export interface FabProps {
  /** 百分比进度值，小数 */
  progress?: number;
  /** 提示文本 */
  tip?: string;

  children?: JSX.Element | JSX.Element[];
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
  children,
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
    <button
      className={classes.fab}
      type="button"
      data-show={progress || show}
      onClick={onClick}
    >
      {children ?? <MdMenuBook />}
      <Progress value={progress} />
      {tip ? <div className={classes.popper}>{tip}</div> : null}
    </button>
  );
};
