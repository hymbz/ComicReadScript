import { switchFillEffect, turnPage } from './Image';
import { setState, store } from '..';

export const handleWheel = (e: WheelEvent) => {
  e.stopPropagation();

  if (e.altKey || (!store.endPageType && store.scrollLock)) return;

  if (store.option.scrollMode && !store.endPageType) {
    if (store.scrollbar.dragTop === 0 && e.deltaY <= 0) {
      window.setTimeout(() => {
        setState((state) => {
          state.endPageType = 'start';
          state.scrollLock = true;
        });
      });
      window.setTimeout(() => {
        setState((state) => {
          state.scrollLock = false;
        });
      }, 500);
    } else if (
      store.scrollbar.dragHeight + store.scrollbar.dragTop >= 0.999 &&
      e.deltaY > 0
    ) {
      setState((state) => {
        state.endPageType = 'end';
        state.scrollLock = true;
      });
      window.setTimeout(() => {
        setState((state) => {
          state.scrollLock = false;
        });
      }, 500);
    }
    return;
  }

  setState((state) => {
    if (e.deltaY > 0) turnPage(state, 'next');
    else turnPage(state, 'prev');
  });
};

export const handleKeyUp = (e: KeyboardEvent) => {
  e.stopPropagation();

  if (store.option.scrollMode && !store.endPageType) return;

  let nextPage: boolean | null = null;

  switch (e.key) {
    case 'PageUp':
    case 'ArrowUp':
    case '.':
    case 'w':
      nextPage = false;
      break;

    case ' ':
    case 'PageDown':
    case 'ArrowDown':
    case ',':
    case 's':
      nextPage = true;
      break;

    case 'ArrowRight':
    case 'd':
      nextPage = store.option.dir !== 'rtl';
      break;

    case 'ArrowLeft':
    case 'a':
      nextPage = store.option.dir === 'rtl';
      break;

    case '/':
    case 'm':
    case 'z':
      switchFillEffect();
      break;

    case 'Home':
      setState((state) => {
        state.activePageIndex = 0;
      });
      break;
    case 'End':
      setState((state) => {
        state.activePageIndex = state.pageList.length - 1;
      });
      break;

    case 'Escape':
      store.onExit?.();
      break;
  }

  if (nextPage === null) return;
  setState((state) => turnPage(state, nextPage ? 'next' : 'prev'));
};
