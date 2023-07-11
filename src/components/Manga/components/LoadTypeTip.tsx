import MdImageNotSupported from '@material-design-icons/svg/round/image_not_supported.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';

import { For, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { store } from '../hooks/useStore';
import { activePage } from '../hooks/useStore/slice';

const loadTypeSvg = {
  error: MdImageNotSupported,
  loading: MdCloudDownload,
  wait: MdCloudDownload,
};

const ShowSvg = (index: number) => {
  const position = createMemo<'before' | 'after' | undefined>(() => {
    if (activePage().length === 1) return;
    return activePage().indexOf(index) ? 'after' : 'before';
  });

  return (
    <Dynamic
      component={loadTypeSvg[store.imgList[index]?.loadType]}
      style={{
        transform:
          position() && `translate(${position() === 'before' ? '' : '-'}100%)`,
      }}
    />
  );
};

export const LoadTypeTip = () => <For each={activePage()} children={ShowSvg} />;
