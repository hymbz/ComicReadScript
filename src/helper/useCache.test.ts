import { expect, it, beforeEach } from 'vitest';

import { useCache } from './useCache';
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
  expect(await cache.get('comic', 'a')).toStrictEqual(undefined);
  await cache.del('comic', 'a');
});
