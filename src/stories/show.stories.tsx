import { sleep } from 'helper';

import { _setState } from '../components/Manga/store';

import MangaMeta, { type Props } from './Manga.stories';
import { imgList, waitImgLoaded } from './helper';

export default {
  ...MangaMeta,
  title: '测试/显示',
};

export const 左图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies Props,
  play: waitImgLoaded,
};

export const 右图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
    option: { dir: 'ltr' },
  } satisfies Props,
  play: waitImgLoaded,
};

export const 跨页图 = {
  args: {
    图源: undefined,
    imgList: imgList['饮茶之时、女仆之梦（彩图）'].slice(1),
  } satisfies Props,
  play: waitImgLoaded,
};

export const 异常状态 = {
  args: {
    图源: undefined,
    imgList: ['', 'xxx'],
  } satisfies Props,
  async play() {
    _setState('show', 'scrollbar', true);
    await sleep(1000);
  },
};

export const 卷轴模式分隔 = {
  args: {
    option: {
      scrollMode: { enabled: true, imgScale: 0.5, spacing: 10 },
      darkMode: true,
    },
  } satisfies Props,
  play: waitImgLoaded,
};

export const 并排卷轴模式分隔 = {
  args: {
    option: {
      scrollMode: {
        enabled: true,
        imgScale: 0.5,
        spacing: 10,
        abreastMode: true,
        abreastDuplicate: 0,
      },
      darkMode: true,
    },
  } satisfies Props,
  play: waitImgLoaded,
};
