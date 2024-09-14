import { userEvent } from '@storybook/test';
import { t } from 'helper';

import { refs } from '../components/Manga/store';

import MangaMeta, { type Props } from './Manga.stories';
import { clickSettingButton, clickSettingItem } from './helper';

export default {
  ...MangaMeta,
  title: '测试/设置',
};

export const 设置 = {
  async play() {
    await clickSettingButton();
  },
};

export const 放大 = {
  async play() {
    await userEvent.click(
      refs.root.querySelector(`[aria-label="${t('button.zoom_in')}"]`)!,
    );
  },
};

export const 滚动条位置 = {
  args: {
    option: { scrollbar: { position: 'top' } },
  } satisfies Props,
};

export const 显示点击区域 = {
  async play() {
    await clickSettingItem(t('setting.option.show_clickable_area'));
    await clickSettingButton();
  },
};

export const 夜间模式 = {
  async play() {
    await clickSettingItem(t('setting.option.dark_mode'));
  },
};

export const 禁止图片自动放大 = {
  args: {
    图源: '若爱在眼前（跨页+小图）',
  } satisfies Props,
  async play() {
    await clickSettingItem(t('setting.option.disable_auto_enlarge'));
    await clickSettingButton();
  },
};
