import { sleep } from 'helper';

import type { PartialProps } from './Manga.stories';

import { setState } from '../components/Manga/store';
import { imgList, waitImgLoaded } from './helper';
import MangaMeta from './Manga.stories';

export default {
  ...MangaMeta,
  title: '测试/显示',
};

export const 左图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 右图 = {
  args: {
    图源: '饮茶之时、女仆之梦（彩图）',
    option: { dir: 'ltr' },
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 跨页图 = {
  args: {
    图源: undefined,
    imgList: imgList['饮茶之时、女仆之梦（彩图）'].slice(1),
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 异常状态 = {
  args: {
    图源: undefined,
    imgList: ['', 'xxx'],
  } satisfies PartialProps,
  async play() {
    setState('show', 'scrollbar', true);
    await sleep(1000);
  },
};

export const 卷轴模式分隔 = {
  args: {
    option: {
      scrollMode: { enabled: true, imgScale: 0.5, spacing: 10 },
      darkMode: true,
    },
  } satisfies PartialProps,
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
  } satisfies PartialProps,
  play: waitImgLoaded,
};

export const 尾页 = {
  args: {
    图源: undefined,
    imgList: [''],
    onPrev() {},
    onNext() {},
  } satisfies PartialProps,
  async play() {
    setState('show', 'endPage', 'end');
    await sleep(1000);
  },
};
