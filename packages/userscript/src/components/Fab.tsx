import type { FabProps } from '@crs/ui-component/dist/Fab';
import { Fab } from '@crs/ui-component/dist/Fab';
import FabStyle from '@crs/ui-component/dist/Fab.css';
import IconBottonStyle from '@crs/ui-component/dist/IconBotton.css';
import ReactDOM from 'react-dom/client';
import shadow from 'react-shadow';
import produce from 'immer';
import { querySelector } from '../helper';

type Recipe = (draftProps: FabProps) => void;

let FabRoot: ReactDOM.Root | null = null;
export const useFab = (
  props?: FabProps,
): [(recipe?: Recipe) => void, (recipe: Recipe) => void] => {
  let fabProps = props;

  let dom = querySelector('#readFab');
  if (!dom) {
    dom = document.createElement('div');
    dom.id = 'readFab';
    document.body.appendChild(dom);
  }

  if (!FabRoot) FabRoot = ReactDOM.createRoot(dom);

  const set = (recipe: Recipe) => {
    fabProps = produce(fabProps, recipe);
  };

  const show = (recipe?: Recipe) => {
    if (recipe) set(recipe);

    FabRoot!.render(
      <shadow.div>
        <Fab {...fabProps} />
        <style type="text/css">{IconBottonStyle}</style>
        <style type="text/css">{FabStyle}</style>
      </shadow.div>,
    );
  };

  return [show, set];
};
