import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';

import type { FabProps } from '@crs/ui-component/dist/Fab';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import shadow from 'react-shadow';
import produce from 'immer';
import { useComponentsRoot } from '../helper';

export type FabRecipe = ((draftProps: FabProps) => void) | Partial<FabProps>;

export const useFab = (
  props?: FabProps,
): [(recipe?: FabRecipe) => void, (recipe: FabRecipe) => void] => {
  const [root] = useComponentsRoot('fab');

  let fabProps = props ?? {};

  const set = (recipe: FabRecipe) => {
    if (typeof recipe === 'function') fabProps = produce(fabProps, recipe);
    else Object.assign(fabProps, recipe);
  };

  const FabIcon = () => {
    switch (fabProps.progress) {
      case undefined:
        // 没有内容的书
        return <MdImportContacts />;
      case 1:
      case 2:
        // 有内容的书
        return <MdMenuBook />;
      default:
        return fabProps.progress > 1 ? <MdCloudDownload /> : <MdImageSearch />;
    }
  };

  const show = (recipe?: FabRecipe) => {
    if (recipe) set(recipe);

    root.render(
      <shadow.div
        style={{
          fontSize: 16,
          position: 'fixed',
          right: '3em',
          bottom: '2em',
          zIndex: 999999999,
        }}
      >
        <Fab {...fabProps}>
          <FabIcon />
        </Fab>
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{FabStyle}</style>
      </shadow.div>,
    );
  };

  return [show, set];
};
