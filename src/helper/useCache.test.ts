import { expect, it, beforeEach } from 'vitest';

import { useCache } from './useCache';
import 'fake-indexeddb/auto';

const cache = useCache<{
  comic: { id: string; imgList: string[]; num: number };
}>((db: IDBDatabase) => {
  const store = db.createObjectStore('comic', { keyPath: 'id' });
  store.createIndex('imgList', 'imgList');
  store.createIndex('num', 'num');
});

beforeEach(async () => {
  await cache.set('comic', { id: 'a', imgList: ['fdsfs'], num: 23 });
  await cache.set('comic', { id: 'b', imgList: ['hrthr'], num: 7 });
  await cache.set('comic', { id: 'c', imgList: ['teege'], num: 1 });
});

it('存入', async () => {
  await cache.set('comic', { id: 'a', imgList: ['fdsfs'], num: 41 });
  expect(await cache.get('comic', 'a')).toStrictEqual({
    id: 'a',
    imgList: ['fdsfs'],
    num: 41,
  });
});

it('搜索', async () => {
  expect(await cache.find('comic', 'null')).toStrictEqual([]);

  // 根据主键搜索
  expect(await cache.find('comic', 'a')).toStrictEqual([
    {
      id: 'a',
      imgList: ['fdsfs'],
      num: 23,
    },
  ]);

  // 根据索引搜索
  expect(await cache.find('comic', ['hrthr'], 'imgList')).toStrictEqual([
    { id: 'b', imgList: ['hrthr'], num: 7 },
  ]);
  expect(
    await cache.find('comic', IDBKeyRange.lowerBound(2, true), 'num'),
  ).toStrictEqual([
    { id: 'b', imgList: ['hrthr'], num: 7 },
    { id: 'a', imgList: ['fdsfs'], num: 23 },
  ]);
});

it('根据主键删除', async () => {
  await cache.del('comic', 'a');
  expect(await cache.get('comic', 'a')).toStrictEqual(undefined);
  await cache.del('comic', 'a');
});

it('根据索引删除', async () => {
  // 删除 num 大于 2 的数据
  await cache.del('comic', IDBKeyRange.lowerBound(2), 'num');

  expect(
    await cache.find('comic', IDBKeyRange.lowerBound(2, true), 'num'),
  ).toStrictEqual([]);

  // 确认没有误删
  expect(await cache.get('comic', 'c')).toStrictEqual({
    id: 'c',
    imgList: ['teege'],
    num: 1,
  });
});
