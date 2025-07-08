import { beforeEach, expect, it } from 'vitest';

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
  await expect(cache.get('comic', 'a')).resolves.toStrictEqual({
    id: 'a',
    imgList: ['fdsfs'],
    num: 41,
  });
});

it('根据主键删除', async () => {
  await cache.del('comic', 'a');
  await expect(cache.get('comic', 'a')).resolves.toBeUndefined();
});

it('根据条件遍历删除', async () => {
  cache.each('comic', async (value, cursor) => {
    if (value.num > 10) await promisifyRequest(cursor.delete());
  });
  await expect(cache.get('comic', 'a')).resolves.toBeUndefined();
  await expect(cache.get('comic', 'b')).resolves.toBeDefined();
  await expect(cache.get('comic', 'c')).resolves.toBeDefined();
  await expect(cache.get('comic', 'd')).resolves.toBeUndefined();
});
