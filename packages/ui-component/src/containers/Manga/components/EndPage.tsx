import type { MouseEventHandler } from 'react';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import type { SelfState } from '../hooks/useStore';
import { shallow, useStore } from '../hooks/useStore';

import classes from '../index.module.css';

const selector = ({ onExit, onPrev, onNext, pageTurn }: SelfState) => ({
  onExit,
  onPrev,
  onNext,
  pageTurn,
});

let delayTypeTimer = 0;

export const EndPage: React.FC = () => {
  const { onExit, onPrev, onNext, pageTurn } = useStore(selector, shallow);

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

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    ref.current?.addEventListener(
      'wheel',
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        pageTurn(e.deltaY > 0 ? 'next' : 'prev');
      },
      {
        passive: false,
        signal: controller.signal,
      },
    );
    return () => {
      controller.abort();
    };
  }, [pageTurn]);

  const type = useStore((state) => state.endPageType);

  // state.endPageType 变量的延时版本，在隐藏的动画效果结束之后才会真正改变
  // 防止在动画效果结束前 tip 就消失或改变了位置
  const [delayType, setDelayType] = useState<'start' | 'end' | undefined>();
  useEffect(() => {
    if (type) {
      window.clearTimeout(delayTypeTimer);
      setDelayType(type);
    } else {
      delayTypeTimer = window.setTimeout(() => setDelayType(type), 500);
    }
  }, [type]);

  const tip = useMemo(() => {
    switch (delayType) {
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
  }, [onNext, onPrev, delayType]);

  return (
    <div
      ref={ref}
      className={classes.endPage}
      data-show={type}
      data-type={delayType}
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
