/* eslint-disable import/no-relative-packages */
import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';

import type { FabProps } from '@crs/ui-component/src';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import IconBottonStyle from '@crs/ui-component/dist/IconButton.css';
import { render } from 'solid-js/web';
import { useComponentsRoot } from '../helper/utils';

export const useFab = async (initProps?: FabProps) => {
  const [, dom] = useComponentsRoot('fab');
  await GM.addStyle(`
    #fab {
      --text_bg: transparent;

      position: fixed;
      z-index: 999999999;
      right: 3vw;
      bottom: 6vh;

      font-size: clamp(12px, 1.5vw, 16px);
    }
  `);

  const props = { ...initProps };

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
    if (recipe) {
      Object.assign(
        props,
        typeof recipe === 'function' ? recipe(props) : recipe,
      );
    }

    render(
      () => (
        <>
          <Fab {...props}>{props.children ?? <FabIcon />}</Fab>
          <style type="text/css">{IconBottonStyle}</style>
          <style type="text/css">{FabStyle}</style>
        </>
      ),
      dom,
    );
  };

  return set;
};
