// @vitest-environment jsdom

import { describe, expect, it } from 'vitest';

import { handleComicData } from './handleComicData';
import type { FillEffect } from './store/image';

// 例子
// https://www.copymanga.site/comic/yiquanchaoren/chapter/c4ba81ae-5ace-11e9-8b68-024352452ce0
// https://bbs.yamibo.com/thread-535108-1-1.html
// https://bbs.yamibo.com/thread-257258-1-1.html
// https://bbs.yamibo.com/thread-499050-1-1.html

const testWide = (
  imgTypeList: Array<ComicImg['type']>,
  initFillEffect?: FillEffect,
) => {
  const fillEffect = { '-1': true, ...initFillEffect };
  const pageList = handleComicData(
    imgTypeList.map((type) => ({ type }) as ComicImg),
    fillEffect,
  );
  return { pageList, fillEffect };
};

it('跨页在开头', () => {
  const { pageList, fillEffect } = testWide(['wide', '', '', '']);
  expect(pageList).toStrictEqual([[0], [1, 2], [3, -1]]);
  expect(fillEffect).toStrictEqual({ '-1': false, 0: false });
});

it('跨页在中间', () => {
  const { pageList, fillEffect } = testWide(['', '', 'wide', '', '', '']);
  expect(pageList).toStrictEqual([[0, 1], [2], [3, 4], [5, -1]]);
  expect(fillEffect).toStrictEqual({ '-1': false, 2: false });
});
it('跨页在中间，且会导致缺页', () => {
  const { pageList, fillEffect } = testWide(['', '', '', 'wide', '', '', '']);
  // 正常进度中出现的跨页应该代表页序的「正确答案」，导致了缺页的话就说明在这之前缺少填充页
  expect(pageList).toStrictEqual([[-1, 0], [1, 2], [3], [4, 5], [6, -1]]);
  expect(fillEffect).toStrictEqual({ '-1': true, 3: false });
});

it('跨页在结尾', () => {
  const { pageList, fillEffect } = testWide(['', '', '', 'wide']);
  expect(pageList).toStrictEqual([[-1, 0], [1, 2], [3]]);
  expect(fillEffect).toStrictEqual({ '-1': true, 3: false });
});
it('跨页在结尾，且会导致缺页', () => {
  const { pageList, fillEffect } = testWide(['', '', '', '', 'wide']);
  // 跨页在倒数两张的话大概率是汉化组加的图，应该将填充页放在后面
  expect(pageList).toStrictEqual([[-1, 0], [1, 2], [3, -1], [4]]);
  expect(fillEffect).toStrictEqual({ '-1': true, 4: false });
});

it('跨页在开头和结尾，且会导致缺页', () => {
  const { pageList, fillEffect } = testWide(['wide', '', '', '', 'wide']);
  expect(pageList).toStrictEqual([[0], [1, 2], [3, -1], [4]]);
  expect(fillEffect).toStrictEqual({ '-1': false, 0: false, 4: false });
});
it('跨页在开头和中间，且会导致缺页', () => {
  const { pageList, fillEffect } = testWide(['wide', '', '', '', 'wide', '']);
  expect(pageList).toStrictEqual([[0], [1, 2], [3, -1], [4], [5, -1]]);
  expect(fillEffect).toStrictEqual({ '-1': false, 0: false, 4: false });
});
it('跨页在中间和结尾，且会导致缺页', () => {
  const { pageList, fillEffect } = testWide(['', 'wide', '', '', '', 'wide']);
  expect(pageList).toStrictEqual([[-1, 0], [1], [2, 3], [4, -1], [5]]);
  expect(fillEffect).toStrictEqual({ '-1': true, 1: false, 5: false });
});

it('没有跨页', () => {
  const { pageList, fillEffect } = testWide(['', '', '']);
  expect(pageList).toStrictEqual([
    [-1, 0],
    [1, 2],
  ]);
  expect(fillEffect).toStrictEqual({ '-1': true });
});
it('没有跨页，但有缺页', () => {
  const { pageList, fillEffect } = testWide(['', '', '', '']);
  expect(pageList).toStrictEqual([
    [-1, 0],
    [1, 2],
    [3, -1],
  ]);
  expect(fillEffect).toStrictEqual({ '-1': true });
});

const testMargin = (
  imgTypeList: Array<'' | 'left' | 'right' | 'both' | 'wide'>,
  initFillEffect?: FillEffect,
) => {
  const fillEffect = { '-1': true, ...initFillEffect };
  const pageList = handleComicData(
    imgTypeList.map((type) => {
      const img = { type: '', width: 99 } as ComicImg;
      switch (type) {
        case 'left':
          img.blankMargin = { left: 99, right: 0 };
          break;
        case 'right':
          img.blankMargin = { left: 0, right: 99 };
          break;
        case 'both':
          img.blankMargin = { left: 99, right: 99 };
          break;
        case 'wide':
          img.type = 'wide';
          break;
      }
      return img;
    }),
    fillEffect,
    true,
  );
  return { pageList, fillEffect };
};

describe('根据白边切换页面填充', () => {
  it('无需调整', () => {
    const { pageList, fillEffect } = testMargin(['right', 'left', 'right']);
    expect(pageList).toStrictEqual([
      [-1, 0],
      [1, 2],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': true });
  });

  it('没有白边数据', () => {
    const { pageList, fillEffect } = testMargin(['', '', '']);
    expect(pageList).toStrictEqual([
      [-1, 0],
      [1, 2],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': true });
  });

  it('调整一次', () => {
    const { pageList, fillEffect } = testMargin(['left', 'right', 'left']);
    expect(pageList).toStrictEqual([
      [0, 1],
      [2, -1],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': false });
  });

  it('全白边', () => {
    const { pageList, fillEffect } = testMargin(['both', 'both', 'both']);
    expect(pageList).toStrictEqual([
      [-1, 0],
      [1, 2],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': true });
  });

  it('混合，无需调整', () => {
    const { pageList, fillEffect } = testMargin(['right', 'both', 'right', '']);
    expect(pageList).toStrictEqual([
      [-1, 0],
      [1, 2],
      [3, -1],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': true });
  });

  it('混合，调整一次', () => {
    const { pageList, fillEffect } = testMargin(['left', 'both', 'left', '']);
    expect(pageList).toStrictEqual([
      [0, 1],
      [2, 3],
    ]);
    expect(fillEffect).toStrictEqual({ '-1': false });
  });

  it('有跨页图时', () => {
    const { pageList, fillEffect } = testMargin([
      'left',
      'right',
      'wide',
      'right',
      'left',
    ]);
    expect(pageList).toStrictEqual([[0, 1], [2], [-1, 3], [4, -1]]);
    expect(fillEffect).toStrictEqual({ '-1': false, 2: true });
  });
});
