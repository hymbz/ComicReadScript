import clsx from 'clsx';
import type { MouseEventHandler } from 'react';
import { useCallback } from 'react';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({
  showEndPage,
  option: { onEnd, onPrev, onNext },
}: SelfState) => ({
  showEndPage,
  onEnd,
  onPrev,
  onNext,
});

export const EndPage: React.FC = () => {
  const { showEndPage, onEnd, onPrev, onNext } = useStore(selector, shallow);

  const handleClick = useCallback<MouseEventHandler>((e) => {
    e.stopPropagation();
    if ((e.target as Element).nodeName === 'BUTTON') return;

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
      <button
        className={clsx(!onPrev && classes.invisible)}
        onClick={onPrev}
        type="button"
      >
        上一话
      </button>
      <button onClick={onEnd} type="button" data-is-end>
        END
      </button>
      <button
        className={clsx(!onNext && classes.invisible)}
        onClick={onNext}
        type="button"
      >
        下一话
      </button>
    </div>
  );
};
