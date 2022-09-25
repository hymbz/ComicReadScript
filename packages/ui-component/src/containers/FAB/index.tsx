import type { MouseEventHandler } from 'react';

import classes from './index.module.css';

export interface FABProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * FAB 按钮
 *
 * @param props
 */
export const FAB: React.FC<FABProps> = ({ onClick }) => {
  return (
    <button className={classes.button} type="button" onClick={onClick}>
      B
    </button>
  );
};
