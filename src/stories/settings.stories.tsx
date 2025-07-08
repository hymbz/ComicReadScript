import { t } from 'helper';

import type { PartialProps } from './Manga.stories';

import { clickSettingItem, clickToolbarButton, waitImgLoaded } from './helper';
import MangaMeta from './Manga.stories';

export default {
  ...MangaMeta,
  title: '测试/设置',
};

export const 夜间模式 = {
  async play() {
    await clickSettingItem(t('setting.option.dark_mode'));
    await waitImgLoaded();
  },
};

export const 放大 = {
  async play() {
    await clickToolbarButton(t('button.zoom_in'));
    await waitImgLoaded();
  },
};

export const 滚动条位置 = {
  args: {
    option: { scrollbar: { position: 'top' } },
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 显示点击区域 = {
  args: {
    option: { clickPageTurn: { enabled: true } },
  } satisfies PartialProps,
  async play() {
    await clickSettingItem(t('setting.option.show_clickable_area'));
    await waitImgLoaded();
  },
};

export const 禁止图片自动放大 = {
  args: {
    图源: '若爱在眼前（跨页+小图）',
  } satisfies PartialProps,
  async play() {
    await clickSettingItem(t('setting.option.disable_auto_enlarge'));
    await clickToolbarButton();
    await waitImgLoaded();
  },
};
