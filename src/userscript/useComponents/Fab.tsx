import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';
import { Dynamic } from 'solid-js/web';
import { createRoot, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { type FabProps, Fab } from 'components/Fab';

import { mountComponents } from './helper';

let dom: HTMLDivElement;

export const useFab = async (initProps?: FabProps) => {
  GM_addStyle(`
    #fab {
      --text-bg: transparent;

      position: fixed;
      right: 3vw;
      bottom: 6vh;

      font-size: clamp(12px, 1.5vw, 16px);
    }
  `);

  const [props, setProps] = createStore({ ...initProps });

  const FabIcon = () => {
    switch (props.progress) {
      case undefined: {
        // 没有内容的书
        return MdImportContacts;
      }

      case 1:
      case 2: {
        // 有内容的书
        return MdMenuBook;
      }

      default: {
        return props.progress > 1 ? MdCloudDownload : MdImageSearch;
      }
    }
  };

  createRoot(() => {
    createEffect(() => {
      if (dom) return;
      dom = mountComponents('fab', () => (
        <Fab {...props}>
          {props.children ?? <Dynamic component={FabIcon()} />}
        </Fab>
      ));
      dom.style.setProperty('z-index', '2147483646', 'important');
    });
  });

  return [setProps, props] as const;
};
