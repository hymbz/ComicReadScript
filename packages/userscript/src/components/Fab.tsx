import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';

import type { FabProps } from '@crs/ui-component/dist/Fab';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import IconBottonStyle from '@crs/ui-component/dist/IconButton.css';
import shadow from 'react-shadow';
import { useComponentsRoot } from '../helper';

export type FabRecipe = ((draftProps: FabProps) => void) | Partial<FabProps>;

export const useFab = (initProps?: FabProps) => {
  const [root] = useComponentsRoot('fab');

  const props = initProps ?? {};

  const FabIcon = () => {
    switch (props.progress) {
      case undefined:
        // 没有内容的书
        return <MdImportContacts />;
      case 1:
      case 2:
        // 有内容的书
        return <MdMenuBook />;
      default:
        return props.progress > 1 ? <MdCloudDownload /> : <MdImageSearch />;
    }
  };

  const set = (recipe?: FabRecipe) => {
    if (recipe) {
      Object.assign(
        props,
        typeof recipe === 'function' ? recipe(props) : recipe,
      );
    }

    root.render(
      <shadow.div
        style={{
          fontSize: ' clamp(12px, calc(1.5vw), 16px)',
          position: 'fixed',
          right: '3vw',
          bottom: '6vh',
          zIndex: 999999999,
        }}
      >
        <Fab {...props}>
          <FabIcon />
        </Fab>
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{FabStyle}</style>
      </shadow.div>,
    );
  };

  return set;
};
