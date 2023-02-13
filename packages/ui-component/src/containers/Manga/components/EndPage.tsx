import type { MouseEventHandler } from 'react';
import { useMemo, useCallback } from 'react';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({ onExit, onPrev, onNext }: SelfState) => ({
  onExit,
  onPrev,
  onNext,
});

export const EndPage: React.FC = () => {
  const { onExit, onPrev, onNext } = useStore(selector, shallow);

  const handleClick = useCallback<MouseEventHandler>((e) => {
    e.stopPropagation();
    if ((e.target as Element).nodeName === 'BUTTON') return;

    useStore.setState((state) => {
      state.endPageType = undefined;
    });
  }, []);

  const handleEnd = useCallback(() => {
    onExit?.(true);
    useStore.setState((state) => {
      state.activePageIndex = 0;
      state.endPageType = undefined;
    });
  }, [onExit]);

  const type = useStore((state) => state.endPageType);

  const tip = useMemo(() => {
    switch (type) {
      case 'start':
        return `已到开头${
          onPrev ? '，继续翻页将跳至上一话' : '，无法继续翻页'
        }`;
      case 'end':
        return `已到结尾${
          onNext ? '，继续翻页将跳至下一话' : '，无法继续翻页'
        }`;
      default:
        return '';
    }
  }, [onNext, onPrev, type]);

  return (
    <div
      className={classes.endPage}
      data-show={type}
      onClick={handleClick}
      role="button"
      tabIndex={-1}
    >
      <p className={classes.tip}>{tip}</p>
      <button
        className={onPrev ? undefined : classes.invisible}
        onClick={onPrev}
        type="button"
        tabIndex={type ? 0 : -1}
      >
        上一话
      </button>
      <button
        onClick={handleEnd}
        type="button"
        tabIndex={type ? 0 : -1}
        data-is-end
      >
        退出
      </button>
      <button
        className={onNext ? undefined : classes.invisible}
        onClick={onNext}
        type="button"
        tabIndex={type ? 0 : -1}
      >
        下一话
      </button>
    </div>
  );
};
