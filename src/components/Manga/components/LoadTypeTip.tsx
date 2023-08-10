import MdImageNotSupported from '@material-design-icons/svg/round/image_not_supported.svg';
import MdCloudDownload from '@material-design-icons/svg/round/cloud_download.svg';
import MdPhoto from '@material-design-icons/svg/round/photo.svg';

import type { Component } from 'solid-js';
import { For, createMemo } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { store } from '../hooks/useStore';
import { activePage } from '../hooks/useStore/slice';

const loadTypeSvg: Record<string, Component> = {
  error: MdImageNotSupported,
  loading: MdCloudDownload,
  wait: MdCloudDownload,
};

const getComponent = (img?: ComicImg) => {
  if (!img) return;
  if (!img.src) return MdPhoto;
  return loadTypeSvg[img.loadType];
};

const ShowSvg = (index: number) => {
  const position = createMemo<'before' | 'after' | undefined>(() => {
    if (activePage().length === 1) return;
    return activePage().indexOf(index) ? 'after' : 'before';
  });

  return (
    <Dynamic
      component={getComponent(store.imgList[index])}
      style={{
        transform:
          position() && `translate(${position() === 'before' ? '' : '-'}100%)`,
      }}
    />
  );
};

export const LoadTypeTip = () => <For each={activePage()} children={ShowSvg} />;
