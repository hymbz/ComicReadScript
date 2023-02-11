/* eslint-disable import/no-extraneous-dependencies */
import { describe, expect, it } from 'vitest';
import { handleComicData } from './handleComicData';
import type { FillEffect } from './hooks/useStore/ImageSlice';

const mock = (
  imgTypeList: ComicImg['type'][],
  fillEffect: FillEffect = new Map(),
) => ({
  pageList: handleComicData({
    comicImgList: imgTypeList.map(
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

describe('跨页相关', () => {
  it('跨页在开头', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '']);
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1]]);
    expect(fillEffect).toStrictEqual(new Map([[0, false]]));
  });

  it('跨页在中间，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', 'wide', '']);
    expect(pageList).toStrictEqual([[-1, 0], [1], [2, -1]]);
    expect(fillEffect).toStrictEqual(new Map([[1, false]]));
  });

  it('跨页在结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', '', '', 'wide']);
    expect(pageList).toStrictEqual([[0, 1], [-1, 2], [3]]);
    expect(fillEffect).toStrictEqual(new Map([[3, false]]));
  });

  it('跨页在开头和结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '', 'wide']);
    expect(pageList).toStrictEqual([[0], [1, 2], [-1, 3], [4]]);
    expect(fillEffect).toStrictEqual(
      new Map([
        [0, false],
        [4, false],
      ]),
    );
  });

  it('跨页在开头和中间，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['wide', '', '', '', 'wide', '']);
    expect(pageList).toStrictEqual([[0], [1, 2], [-1, 3], [4], [5, -1]]);
    expect(fillEffect).toStrictEqual(
      new Map([
        [0, false],
        [4, false],
      ]),
    );
  });

  it('跨页在中间和结尾，且会导致缺页', () => {
    const { pageList, fillEffect } = mock(['', 'wide', '', '', '', 'wide']);
    expect(pageList).toStrictEqual([[-1, 0], [1], [2, 3], [-1, 4], [5]]);
    expect(fillEffect).toStrictEqual(
      new Map([
        [1, false],
        [5, false],
      ]),
    );
  });
});

describe('填充页相关', () => {
  it('开头跨页，且要求开头填充', () => {
    const { pageList, fillEffect } = mock(
      ['wide', '', '', ''],
      new Map([[-1, true]]),
    );
    expect(pageList).toStrictEqual([[0], [1, 2], [3, -1]]);
    expect(fillEffect).toStrictEqual(
      new Map([
        [-1, true],
        [0, false],
      ]),
    );
  });
});
