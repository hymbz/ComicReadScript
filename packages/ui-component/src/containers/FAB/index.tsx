import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';

import type { MouseEventHandler } from 'react';
import { useMemo, useRef, useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

import classes from './index.module.css';

export interface FabProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Fab 按钮
 *
 * @param props
 */
export const Fab: React.FC<FabProps> = ({ onClick }) => {
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

  return useMemo(
    () => (
      <button
        className={classes.button}
        type="button"
        data-show={show}
        onClick={onClick}
      >
        <MdMenuBook />
      </button>
    ),
    [onClick, show],
  );
};
