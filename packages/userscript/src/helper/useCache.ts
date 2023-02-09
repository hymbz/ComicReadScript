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
  const request = indexedDB.open('ComicReadScript', version);
  request.onupgradeneeded = () => {
    initSchema(request.result);
  };
  const dbp = promisifyRequest(request);

  const useStore = <T>(
    storeName: keyof Schema & string,
    txMode: IDBTransactionMode,
    callback: (store: IDBObjectStore) => T | PromiseLike<T>,
  ) =>
    dbp.then((db) =>
      callback(db.transaction(storeName, txMode).objectStore(storeName)),
    );

  return {
    /** 存入数据 */
    set: <K extends keyof Schema & string>(storeName: K, value: Schema[K]) =>
      useStore(storeName, 'readwrite', async (store) => {
        store.put(value);
        await promisifyRequest(store.transaction);
      }),

    /** 根据主键直接获取数据 */
    get: <K extends keyof Schema & string>(storeName: K, query: IDBValidKey) =>
      useStore(storeName, 'readonly', (store) =>
        promisifyRequest<Schema[K]>(store.get(query)),
      ),

    /** 查找符合条件的数据 */
    find: <K extends keyof Schema & string>(
      storeName: K,
      query?: IDBValidKey | IDBKeyRange,
      index?: keyof Schema[K],
    ) =>
      useStore(storeName, 'readonly', (store) =>
        promisifyRequest(
          (index ? store.index(index as string) : store).getAll(
            query,
          ) as IDBRequest<Schema[K][]>,
        ),
      ),

    /** 删除符合条件的数据 */
    del: <K extends keyof Schema & string>(
      storeName: K,
      query: IDBValidKey | IDBKeyRange,
      index?: keyof Schema[K] & string,
    ) =>
      useStore(storeName, 'readwrite', async (store) => {
        if (index) {
          store.index(index).openCursor(query).onsuccess =
            async function onsuccess() {
              if (!this.result) return;
              await promisifyRequest(this.result.delete());
              this.result.continue();
            };
          await promisifyRequest(store.transaction);
        } else {
          store.delete(query);
          await promisifyRequest(store.transaction);
        }
      }),

    // each: <K extends keyof Schema & string>(
    //   storeName: K,
    //   query: IDBValidKey | IDBKeyRange | null,
    //   callback: (cursor: IDBCursorWithValue) => void,
    // ) =>
    //   useStore(storeName, 'readonly', (store) => {
    //     store.openCursor(query).onsuccess = function onsuccess() {
    //       if (!this.result) return;
    //       callback(this.result);
    //       this.result.continue();
    //     };
    //     return promisifyRequest(store.transaction);
    //   }),
  };
};
