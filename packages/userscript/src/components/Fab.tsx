import MdMenuBook from '@material-design-icons/svg/round/menu_book.svg';
import MdImageSearch from '@material-design-icons/svg/round/image_search.svg';
import MdImportContacts from '@material-design-icons/svg/round/import_contacts.svg';

import type { FabProps } from '@crs/ui-component/dist/Fab';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import type ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import produce from 'immer';
import { querySelector } from '../helper';

export type FabRecipe = (draftProps: FabProps) => void;

let FabRoot: ReactDOM.Root | null = null;
export const useFab = (
  props?: FabProps,
): [(recipe?: FabRecipe) => void, (recipe: FabRecipe) => void] => {
  // 需要改为动态导入以避免在支持站点外的页面上加载 React
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const ReactDOM: typeof import('react-dom/client') = require('react-dom');

  let fabProps = props ?? {};

  let dom = querySelector('#readFab');
  if (!dom) {
    dom = document.createElement('div');
    dom.id = 'readFab';
    document.body.appendChild(dom);
  }

  if (!FabRoot) FabRoot = ReactDOM.createRoot(dom);

  const set = (recipe: FabRecipe) => {
    fabProps = produce(fabProps, recipe);
  };

  const FabIcon = () => {
    switch (fabProps.progress) {
      case 0:
        return <MdImportContacts />;
      case 1:
      case undefined:
        return <MdMenuBook />;
      default:
        return <MdImageSearch />;
    }
  };

  const show = (recipe?: FabRecipe) => {
    if (recipe) set(recipe);

    FabRoot!.render(
      <shadow.div>
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
