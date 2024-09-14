import { userEvent } from '@storybook/test';

import { _setState } from '../components/Manga/store';

import MangaMeta, { type Props } from './Manga.stories';

export default {
  ...MangaMeta,
  title: '测试/显示',
};

export const 左图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies Props,
};

export const 右图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
    option: { dir: 'ltr' },
  } satisfies Props,
};

export const 跨页图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies Props,
  async play() {
    await userEvent.keyboard('[Space]');
  },
};

export const 异常状态 = {
  args: {
    imgList: ['', 'xxx'],
  } satisfies Props,
  async play() {
    _setState('show', 'scrollbar', true);
  },
};

export const 卷轴模式分隔 = {
  args: {
    option: {
      scrollMode: { enabled: true, imgScale: 0.5, spacing: 10 },
      darkMode: true,
    },
  } satisfies Props,
};

export const 并排卷轴模式分隔 = {
  args: {
    option: {
      scrollMode: {
        enabled: true,
        imgScale: 0.5,
        spacing: 10,
        abreastMode: true,
      },
      darkMode: true,
    },
  } satisfies Props,
};
