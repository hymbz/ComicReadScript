import { Manga, refs, setState, store } from 'components/Manga';
import 'userscript/import';
import {
  createEffectOn,
  createRootMemo,
  mountComponents,
  querySelector,
  setInitLang,
  useStore,
  useStyle,
  WakeLock,
} from 'helper';
import * as helper from 'helper';

import type { MangaProps } from './components/Manga';
import type { ErrorResponse, Response } from './request';

type Request<TContext = object> = {
  method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  headers?: Record<string, string>;
  data?: string | Blob | File | FormData | URLSearchParams;
  nocache?: boolean;
  timeout?: number;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'stream';
  overrideMimeType?: string;
  fetch?: boolean;
  signal?: AbortSignal;

  onabort?(): void;
  onerror?: (res?: ErrorResponse) => void;
  ontimeout?: (res: ErrorResponse) => void;
  onload?: (res: Response<TContext>) => void;
  onprogress?: (
    res: Response<TContext> & { loaded: number; total: number },
  ) => void;
};
type GM_xmlhttpRequest = <TContext = any>(
  details: Request<TContext>,
) => { abort: () => void };
type GM_addElement = <T extends HTMLElement = HTMLElement>(
  tagName: string,
  attributes: object,
) => T;
type GM_getResourceText = (name: string) => string;

declare const gmApi: {
  GM: typeof GM;
  GM_addElement: GM_addElement;
  GM_getResourceText: GM_getResourceText;
  GM_xmlhttpRequest: GM_xmlhttpRequest;
  unsafeWindow: typeof window;
};
declare const crsLib: Window['crsLib'];

export type InitConfig = {
  polyfill?: {
    GM_addElement?: GM_addElement;
    GM_xmlhttpRequest?: GM_xmlhttpRequest;

    GM?: Partial<{
      setValue(name: string, value: any): Promise<void>;
      getValue<TValue>(name: string, defaultValue?: TValue): Promise<TValue>;
    }>;
  };
  modules?: Record<string, any>;
  props?: Partial<MangaProps>;
};

export const initComicReader = ({
  polyfill,
  modules,
  props: initProps,
}: InitConfig) => {
  if (polyfill) {
    for (const [key, value] of Object.entries(polyfill)) {
      if (key === 'GM') {
        gmApi.GM = { ...gmApi.GM, ...value };
      } else GM[key] = value;
    }
    Object.assign(crsLib as any, gmApi);
  }

  if (modules) Object.assign(crsLib as any, modules);

  const { store: props, setState: setProps } = useStore<MangaProps>({
    imgList: [],
    show: false,
    onExit: () => setProps('show', false),
    ...initProps,
  });

  setInitLang();

  const dom = mountComponents('ComicRead', () => <Manga {...props} />);
  dom.style.setProperty('z-index', '2147483647', 'important');

  useStyle(`
    #ComicRead {
      position: fixed;
      top: 0;
      left: 0;
      transform: scale(0);

      contain: strict;

      width: 100%;
      height: 100%;

      writing-mode: initial;
      font-size: 16px;

      opacity: 0;

      transition:
        opacity 300ms,
        transform 0s 300ms;
    }

    #ComicRead[show] {
      transform: scale(1);
      opacity: 1;
      transition: opacity 300ms, transform 100ms;
    }
  `);

  // 确保 toast 可以显示在漫画之上
  const toastDom = querySelector('#toast');
  if (toastDom) dom.after(toastDom);

  const htmlStyle = document.documentElement.style;
  let lastOverflow = htmlStyle.overflow;

  const wakeLock = new WakeLock();

  createEffectOn(
    createRootMemo(() => props.show && props.imgList.length > 0),
    (show) => {
      if (show) {
        dom.setAttribute('show', '');
        lastOverflow = htmlStyle.overflow;
        htmlStyle.setProperty('overflow', 'hidden', 'important');
        htmlStyle.setProperty('scrollbar-width', 'none', 'important');
        if (store.option.autoFullscreen) refs.root.requestFullscreen();
        wakeLock.on();
      } else {
        dom.removeAttribute('show');
        htmlStyle.overflow = lastOverflow;
        htmlStyle.removeProperty('scrollbar-width');
        wakeLock.off();
      }
    },
    { defer: true },
  );

  return {
    version: scriptVersion,
    helper,
    store,
    setState,
    props,
    setProps,

    /** 加载显示指定的图片列表 */
    open: (imgList: MangaProps['imgList'], title?: string) => {
      setProps((state) => {
        state.imgList = imgList;
        state.show = true;
        if (title) state.title = title;
      });
    },

    /** 跳到指定页数（注意在双页模式下，页数不等于图片在列表里的序列数） */
    goto: (pageIndex: number) => setState('activePageIndex', pageIndex),
  };
};

const getValue = (key: string, defaultValue?: unknown): any => {
  const text = localStorage.getItem(key);
  if (!text) return defaultValue;
  try {
    return JSON.parse(text);
  } catch {
    return text ?? defaultValue;
  }
};
const setValue = (key: string, value: unknown): any =>
  localStorage.setItem(key, JSON.stringify(value));

export const defaultConfig = (): InitConfig => {
  const saveVersion = getValue('@Version');
  if (saveVersion !== scriptVersion) {
    setValue('@Option', {});
    setValue('@Version', scriptVersion);
  }

  return {
    polyfill: { GM: { getValue, setValue } },
    props: {
      option: getValue('@Option'),
      onOptionChange: (option) => setValue('@Option', option),
      hotkeys: getValue('@Hotkeys'),
      onHotkeysChange: (hotkeys) => setValue('@Hotkeys', hotkeys),
    },
  };
};

initComicReader.defaultConfig = defaultConfig;

export default initComicReader;
