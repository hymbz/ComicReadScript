import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';

import { createStore, produce } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';

import type { FabProps } from '../Fab';
import { Fab, FabStyle } from '../Fab';
import { IconButtonStyle } from '../IconButton';
import { mountComponents } from './helper';

let mounted = false;

export const useFab = async (initProps?: FabProps) => {
  await GM.addStyle(`
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
      case undefined:
        // 没有内容的书
        return MdImportContacts;
      case 1:
      case 2:
        // 有内容的书
        return MdMenuBook;
      default:
        return props.progress > 1 ? MdCloudDownload : MdImageSearch;
    }
  };

  const set = (
    recipe?: ((draftProps: FabProps) => void) | Partial<FabProps>,
  ) => {
    if (!mounted) {
      const dom = mountComponents('fab', () => (
        <>
          <Fab {...props}>
            {props.children ?? <Dynamic component={FabIcon()} />}
          </Fab>
          <style type="text/css">{IconButtonStyle}</style>
          <style type="text/css">{FabStyle}</style>
        </>
      ));
      dom.style.setProperty('z-index', '2147483646', 'important');
      mounted = true;
    }
    if (recipe)
      setProps(typeof recipe === 'function' ? produce(recipe) : recipe);
  };

  return [set, props] as const;
};
