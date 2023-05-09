/* eslint-disable import/no-extraneous-dependencies */
import { describe, expect, it } from 'vitest';
import { handleComicData } from './handleComicData';
import type { FillEffect } from './hooks/useStore/ImageState';

// 例子
// https://www.copymanga.site/comic/yiquanchaoren/chapter/c4ba81ae-5ace-11e9-8b68-024352452ce0
// https://bbs.yamibo.com/thread-535108-1-1.html
// https://bbs.yamibo.com/thread-257258-1-1.html

const mock = (
  imgTypeList: ComicImg['type'][],
  fillEffect: FillEffect = {},
) => ({
  pageList: handleComicData({
    imgList: imgTypeList.map(
      (type): ComicImg => ({
        type,
        loadType: 'loaded',
        src: '',
      }),
    ),
    fillEffect,
  }),
  fillEffect,
});

describe('默认情况', () => {
  it('跨页在开头', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '']);
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1]]);
    expect(fillEffect).toStrictEqual({ 0: false });
  });

  it('跨页在中间，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', 'wide', '']);
    // 正常进度中出现的跨页应该代表页序的「正确答案」，导致了缺页的话就说明在这之前缺少填充页
    expect(pageList).toStrictEqual([[-1, 0], [1], [2, -1]]);
    expect(fillEffect).toStrictEqual({ 1: false });
  });

  it('跨页在结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', '', '', 'wide']);
    // 跨页在倒数两张的话大概率是汉化组加的图，应该将填充页放在后面
    expect(pageList).toStrictEqual([[0, 1], [2, -1], [3]]);
    expect(fillEffect).toStrictEqual({ 3: false });
  });

  it('跨页在开头和结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '', 'wide']);
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1], [4]]);
    expect(fillEffect).toStrictEqual({ 0: false, 4: false });
  });

  it('跨页在开头和中间，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '', 'wide', '']);
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1], [4], [5, -1]]);
    expect(fillEffect).toStrictEqual({ 0: false, 4: false });
  });

  it('跨页在中间和结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', 'wide', '', '', '', 'wide']);
    expect(pageList).toStrictEqual([[-1, 0], [1], [2, 3], [4, -1], [5]]);
    expect(fillEffect).toStrictEqual({ 1: false, 5: false });
  });

  it('没有跨页', () => {
    const { pageList, fillEffect } = mock(['', '', '', '']);
    expect(pageList).toStrictEqual([
      [0, 1],
      [2, 3],
    ]);
    expect(fillEffect).toStrictEqual({});
  });
  it('没有跨页，但有缺页', () => {
    const { pageList, fillEffect } = mock(['', '', '']);
    expect(pageList).toStrictEqual([
      [0, 1],
      [2, -1],
    ]);
    expect(fillEffect).toStrictEqual({});
  });
});

describe('修改了填充页配置的情况', () => {
  it('开头跨页，且要求开头填充', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', ''], { '-1': true });
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1]]);
    expect(fillEffect).toStrictEqual({ '-1': true, 0: false });
  });
});
