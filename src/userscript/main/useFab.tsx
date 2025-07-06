import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';
import { createEffect } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { Fab } from 'components/Fab';
import {
  mountComponents,
  useDrag,
  useStyle,
  useStyleMemo,
  type UseDrag,
} from 'helper';

import { useSpeedDial, type MainContext } from '.';

export const useFab = async <T extends Record<string, any>>(
  mainContext: MainContext<T>,
) => {
  const { store, _setState, options, setOptions } = mainContext;

  useStyle(`
    #fab {
      --text-bg: transparent;

      position: fixed;
      right: calc(3vw - var(--left, 0px));
      bottom: calc(6vh - var(--top, 0px));

      font-size: clamp(12px, 1.5vw, 16px);
    }
  `);

  useStyleMemo('#fab', {
    '--left': () => `${options.fabPosition.left}px`,
    '--top': () => `${options.fabPosition.top}px`,
  });

  const FabIcon = () => {
    switch (store.fab.progress) {
      case undefined:
        return MdImportContacts; // 没有内容的书
      case 1:
      case 2:
        return MdMenuBook; // 有内容的书
      default:
        return store.fab.progress > 1 ? MdCloudDownload : MdImageSearch;
    }
  };

  const handleMount = (ref: HTMLElement) => {
    const handleDrag: UseDrag = ({ xy: [x, y], last: [lx, ly] }) => {
      const left = options.fabPosition.left + x - lx;
      const top = options.fabPosition.top + y - ly;
      setOptions({ fabPosition: { left, top } });
    };
    useDrag({ ref, handleDrag, setCapture: true });

    // 超出显示范围就恢复原位
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length !== 1 || entries[0].isIntersecting) return;
        setOptions({ fabPosition: { left: 0, top: 0 } });
      },
      { threshold: 0.5 },
    );
    observer.observe(ref);
  };

  const dom = mountComponents('fab', () => {
    createEffect(() => {
      _setState('fab', {
        placement:
          -options.fabPosition.left < window.innerWidth / 2 ? 'left' : 'right',
        speedDialPlacement:
          -options.fabPosition.top < window.innerHeight / 2 ? 'top' : 'bottom',
      });
    });

    return (
      <Fab ref={handleMount} {...store.fab}>
        {store.fab.children ?? <Dynamic component={FabIcon()} />}
      </Fab>
    );
  });
  dom.style.setProperty('z-index', '2147483646', 'important');

  useSpeedDial(mainContext);
};
