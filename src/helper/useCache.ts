export type UseStore = <T>(
  txMode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => T | PromiseLike<T>,
) => Promise<T>;

export const promisifyRequest = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error as Error);
  });

const openDb = (version: number, initSchema: (db: IDBDatabase) => void) =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('ComicReadScript', version);
    request.onupgradeneeded = () => initSchema(request.result);
    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => {
      console.error('数据库打开失败', error);
      reject(new Error('数据库打开失败'));
    };
  });

export const useCache = async <Schema extends Record<string, unknown>>(
  initSchema: (db: IDBDatabase) => void,
  version = 1,
) => {
  const db = await openDb(version, initSchema);

  return {
    set: <K extends keyof Schema & string>(storeName: K, value: Schema[K]) =>
      promisifyRequest(
        db
          .transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .put(value),
      ),

    get: async <K extends keyof Schema & string>(
      storeName: K,
      query: IDBValidKey,
    ) =>
      promisifyRequest<Schema[K] | undefined>(
        db.transaction(storeName, 'readonly').objectStore(storeName).get(query),
      ),

    del: <K extends keyof Schema & string>(
      storeName: K,
      query: IDBValidKey | IDBKeyRange,
    ) =>
      promisifyRequest(
        db
          .transaction(storeName, 'readwrite')
          .objectStore(storeName)
          .delete(query),
      ),

    async each<K extends keyof Schema & string>(
      storeName: K,
      callback: (
        value: Schema[K],
        cursor: IDBCursorWithValue,
      ) => void | Promise<void>,
    ) {
      const request = db
        .transaction(storeName, 'readwrite')
        .objectStore(storeName)
        .openCursor();
      request.onsuccess = async function (event) {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (!cursor) return;
        await callback(cursor.value, cursor);
        cursor.continue();
      };
    },
  };
};
