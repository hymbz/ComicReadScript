import { imgList as comicImgList, refs } from 'components/Manga';
import { sleep, t, wait } from 'helper';
import { type RequestDetails } from 'request';
import { userEvent } from 'storybook/test';

import classes from '../components/Manga/index.module.css';

/** 点击侧边栏按钮 */
export const clickToolbarButton = (name = t('other.setting')) => {
  const button = refs.root.querySelector<HTMLElement>(
    `[aria-label="${name}"]`,
  )!;
  button.style.pointerEvents = 'auto';
  return userEvent.click(button);
};

export const getByText = (selector: string, text: string) => {
  for (const e of refs.root.querySelectorAll(selector))
    if (e.textContent.trim() === text) return e;
};

export const clickSettingItem = async (...nameList: string[]) => {
  await clickToolbarButton();
  await wait(() => refs.root.querySelector(`.${classes.SettingPanel}`));

  let dom: Element | undefined | null;
  for (const name of nameList) {
    dom = getByText(
      `.${classes.SettingsItemName}, .${classes.SettingBlockSubtitle}`,
      name,
    );
    if (dom) await userEvent.click(dom);
  }

  dom = dom?.nextElementSibling;
  if (!dom) return;

  await userEvent.click(dom);
  return dom;
};

export const waitImgLoaded = async () => {
  await wait(() =>
    comicImgList().every(
      (img) => img.loadType !== 'wait' && img.loadType !== 'loading',
    ),
  );
  await sleep(1000);
};

const buildImgList = (path: string, length: number) => {
  const numLength = `${length}`.length;
  return Array.from(
    { length },
    (_, i) => `${path}/${`${i}`.padStart(numLength, '0')}.webp`,
  );
};

export const imgList = {
  '透过百合SM能否连结两人的身心呢（跨页）': buildImgList(
    '/透过百合SM能否连结两人的身心呢？',
    18,
  ),
  '若爱在眼前（跨页+小图）': buildImgList('/若爱在眼前', 37),
  '方便的陪跑友（四格）': buildImgList('/方便的陪跑友', 13),
  '饮茶之时、女仆之梦（彩图）': buildImgList('/饮茶之时、女仆之梦', 31),
};

const readBlobWithProgress = async (
  res: Awaited<ReturnType<typeof fetch>>,
  onprogress: NonNullable<RequestDetails<any>['onprogress']>,
) => {
  const total = Number(res.headers.get('Content-Length')) || 0;
  const reader = res.body!.getReader();
  const chunks: BlobPart[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    const progress = {
      loaded,
      total,
      done: loaded,
      position: loaded,
      lengthComputable: total > 0,
      totalSize: total,
    } as any;
    onprogress.call(progress, progress);
  }

  return new Blob(chunks);
};

export const mockGM_xmlhttpRequest = <T = any>(details: RequestDetails<T>) => {
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = details.timeout
    ? setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, details.timeout)
    : undefined;

  details.signal?.addEventListener('abort', () => controller.abort());

  void (async () => {
    try {
      const res = await fetch(details.url!, {
        method: details.method ?? 'GET',
        headers: details.headers as HeadersInit,
        body: details.data as BodyInit | undefined,
        signal: controller.signal,
      });

      let response: T;
      let responseText = '';

      if (details.responseType === 'arraybuffer') {
        response = (await res.arrayBuffer()) as T;
      } else if (details.responseType === 'blob') {
        response = (
          details.onprogress && res.body
            ? await readBlobWithProgress(res, details.onprogress)
            : await res.blob()
        ) as T;
      } else {
        responseText = await res.text();
        response = (
          details.responseType === 'json'
            ? JSON.parse(responseText)
            : responseText
        ) as T;
      }

      const gmResponse = {
        responseText,
        response,
        status: res.status,
        statusText: res.statusText,
        finalUrl: res.url,
        readyState: 4,
      } as any;
      details.onload?.call(gmResponse, gmResponse);
    } catch (error) {
      const errorResponse = {
        error: (error as Error).message,
        responseText: '',
        response: undefined,
        status: 0,
        statusText: 'error',
      } as any;

      if (timedOut) details.ontimeout?.(errorResponse);
      else if (controller.signal.aborted) details.onabort?.();
      else details.onerror?.(errorResponse);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  })();

  return {
    abort: () => controller.abort(),
  };
};
