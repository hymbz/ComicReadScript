import { expect, it, beforeEach } from 'vitest';

import { promisifyRequest, useCache } from './useCache';
import 'fake-indexeddb/auto';

const cache = await useCache<{
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
  await cache.set('comic', { id: 'd', imgList: ['teege'], num: 12 });
});

it('存入', async () => {
  await cache.set('comic', { id: 'a', imgList: ['fdsfs'], num: 41 });
  expect(await cache.get('comic', 'a')).toStrictEqual({
    id: 'a',
    imgList: ['fdsfs'],
    num: 41,
  });
});

it('根据主键删除', async () => {
  await cache.del('comic', 'a');
  expect(await cache.get('comic', 'a')).toBeUndefined();
});

it('根据条件遍历删除', async () => {
  await cache.each('comic', async (value, cursor) => {
    if (value.num > 10) await promisifyRequest(cursor.delete());
  });
  expect(await cache.get('comic', 'a')).toBeUndefined();
  expect(await cache.get('comic', 'b')).toBeDefined();
  expect(await cache.get('comic', 'c')).toBeDefined();
  expect(await cache.get('comic', 'd')).toBeUndefined();
});
