import clsx from 'clsx';
import { useCallback } from 'react';
import { useStore } from '../hooks/useStore';

import classes from '../index.module.css';

export const EndPage: React.FC = () => {
  const showEndPage = useStore((state) => state.showEndPage);
  const endFunc = useStore((state) => state.option.endFunc);

  const handleClick = useCallback(() => {
    useStore.setState((state) => {
      state.showEndPage = false;
    });
  }, []);

  return (
    <div
      className={clsx(classes.endPage)}
      data-show={showEndPage}
      onClick={handleClick}
      role="button"
      tabIndex={-1}
    >
      <button onClick={endFunc} type="button">
        END
      </button>
    </div>
  );
};
