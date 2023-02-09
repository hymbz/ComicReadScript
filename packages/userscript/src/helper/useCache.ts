/* eslint-disable no-param-reassign */
export type UseStore = <T>(
  txMode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>,
) => Promise<T>;

export const promisifyRequest = <T>(
  request: IDBRequest<T> | IDBTransaction,
): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    // eslint-disable-next-line no-multi-assign
    (request as any).oncomplete = (request as any).onsuccess = () =>
      resolve((request as any).result);
    // eslint-disable-next-line no-multi-assign
    (request as any).onabort = (request as any).onerror = () =>
      reject((request as any).error);
  });

export const useCache = <Schema extends Record<string, unknown>>(
  initSchema: (db: IDBDatabase) => void,
  version = 1,
) => {
  const request = window.indexedDB.open('ComicReadScript', version);
  request.onupgradeneeded = () => {
    initSchema(request.result);
  };
  const dbp = promisifyRequest(request);

  const useStore = <T>(
    storeName: keyof Schema,
    txMode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => T | PromiseLike<T>,
  ) =>
    dbp.then((db) =>
      callback(
        db.transaction(storeName as string, txMode).objectStore('comic'),
      ),
    );

  return {
    set: <K extends keyof Schema>(storeName: K, value: Schema[K]) =>
      useStore(storeName, 'readwrite', async (store) => {
        store.put(value);
        await promisifyRequest(store.transaction);
      }),
    get: <K extends keyof Schema>(storeName: K, key: string, index?: string) =>
      useStore(storeName, 'readonly', (store) =>
        promisifyRequest<Schema[K]>(
          (index ? store.index(index) : store).get(key),
        ),
      ),
    del: <K extends keyof Schema>(storeName: K, key: string) =>
      useStore(storeName, 'readwrite', async (store) => {
        store.delete(key);
        await promisifyRequest(store.transaction);
      }),
    keys: <K extends keyof Schema>(storeName: K) =>
      useStore(storeName, 'readonly', (store) =>
        promisifyRequest(
          store.getAllKeys() as unknown as IDBRequest<Schema[K][]>,
        ),
      ),
    each: <K extends keyof Schema>(
      storeName: K,
      callback: (cursor: IDBCursorWithValue) => void,
    ) =>
      useStore(storeName, 'readonly', (store) => {
        store.openCursor().onsuccess = function onsuccess() {
          if (!this.result) return;
          callback(this.result);
          this.result.continue();
        };
        return promisifyRequest(store.transaction);
      }),
  };
};
