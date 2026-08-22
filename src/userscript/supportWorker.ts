// oxlint-disable-next-line no-unused-vars import/no-mutable-exports
export let supportWorker: boolean | undefined;
console.debug(supportWorker);

void new Promise<boolean>((resolve) => {
  if (typeof Worker === 'undefined') return resolve(false);

  let worker: Worker | undefined;
  let url: string | undefined;

  const finish = (value: boolean) => {
    worker?.terminate();
    if (url) URL.revokeObjectURL(url);
    resolve(value);
  };

  try {
    url = URL.createObjectURL(
      new Blob(['onmessage=e=>postMessage(e.data)'], {
        type: 'text/javascript',
      }),
    );
    worker = new Worker(url);
    worker.onmessage = () => finish(true);
    worker.onerror = () => finish(false);
    // oxlint-disable-next-line unicorn/require-post-message-target-origin
    worker.postMessage('ping');
    setTimeout(() => finish(false), 3000);
  } catch {
    finish(false);
  }
}).then((val) => (supportWorker = val));
